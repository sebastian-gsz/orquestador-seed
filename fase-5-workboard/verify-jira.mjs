#!/usr/bin/env node
// verify-jira.mjs — coherencia ítem↔issue contra Jira (SEED-027, F7 §7.1)
// La sincronización en la misma entrega (mapa maestro §5.1.3 y runbook «Migrar
// tareas del workboard a Jira» paso 7) deja de ser relato: la deriva entre los
// ítems activos del workboard y sus issues en Jira es un estado comprobado.
//
// Uso: node verify-jira.mjs <ruta-al-workboard>
//   · Solo actúa si MODO.md declara destino en `jira: <site> / <proyecto>`.
//   · Datos: credencial del almacén de git (protocolo secretos §El almacén:
//     `git credential fill` para el host del site; usuario = email, secreto =
//     token de API) contra la REST API v3 de Jira Cloud.
//   · Modo degradado (sin credencial o sin red): AVISA, NO BLOQUEA — exit 0.
//   · Con credencial y deriva: violaciones — exit 1 (el hook pre-commit bloquea:
//     EVAL-5 aplica a las dos superficies, ítem local e issue, en la misma entrega).
//   · Evals (ley 4: determinista, sin red): env VERIFY_JIRA_CANNED=<archivo.json>
//     con [{key, summary, statusCategory}] sustituye a la API.
// Sin dependencias. Código de salida: 0 sin deriva (o degradado), 1 con deriva.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const wbDir = path.resolve(process.argv[2] ?? import.meta.dirname);
const modoFile = path.join(wbDir, 'MODO.md');
const TIMEOUT_MS = Number(process.env.VERIFY_JIRA_TIMEOUT_MS ?? 5000);

// --- MODO.md: destino Jira declarado -----------------------------------------
function fmDe(text, keys) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line.trim());
    if (kv && keys.includes(kv[1])) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}
const target = fs.existsSync(modoFile)
  ? fmDe(fs.readFileSync(modoFile, 'utf8'), ['modo', 'jira']).jira
  : null;
if (!target || target === 'null') {
  // sin destino declarado no hay contra qué reconciliar: silencio (el modo y su
  // presión los gobierna verify-workboard, no este verificador)
  process.exit(0);
}
const mSite = /^(\S+)\s*\/\s*(\S+)$/.exec(target);
if (!mSite) {
  console.error(`verify-jira: «jira:» no interpretable: «${target}» — formato esperado: <site> / <proyecto> (p. ej. «mi-site.atlassian.net / ZCJ»)`);
  process.exit(1);
}
const [, site, proyecto] = mSite;

// --- Ítems activos del workboard ----------------------------------------------
const itemsDir = path.join(wbDir, 'items');
const activos = [];
if (fs.existsSync(itemsDir)) {
  for (const f of fs.readdirSync(itemsDir).filter((x) => x.endsWith('.md'))) {
    const fm = fmDe(fs.readFileSync(path.join(itemsDir, f), 'utf8'), ['id', 'status']);
    if (fm.id && ['open', 'in_progress', 'blocked'].includes(fm.status)) {
      activos.push({ id: fm.id, status: fm.status, file: path.basename(f) });
    }
  }
}

// Categoría esperada de la issue según el estado local (mapa del runbook):
// open→To Do (new) · in_progress/blocked→In Progress (indeterminate) · done→Done
const CATEGORIA = { open: 'new', in_progress: 'indeterminate', blocked: 'indeterminate' };
const NOMBRE_CATEGORIA = { new: 'Tareas por hacer / To Do', indeterminate: 'En curso / In Progress', done: 'Finalizada / Done' };

const violations = [];
const degradado = (motivo) => {
  console.log(`⚠  MODO DEGRADADO (${motivo}): la coherencia con Jira no se verifica — aviso, no bloqueo.`);
  console.log('   Registra la credencial (protocolo secretos §El almacén) o reconcilia al recuperar red: la misma entrega aplica a las dos superficies.');
  process.exit(0);
};

// --- Fuente de datos: canned (evals) o REST API v3 ----------------------------
async function issuesDeJira() {
  const canned = process.env.VERIFY_JIRA_CANNED;
  if (canned) return JSON.parse(fs.readFileSync(canned, 'utf8'));

  // credencial del almacén de git (sin prompts: entornos no interactivos fallan rápido)
  let cred;
  try {
    let toplevel = null;
    try {
      toplevel = execFileSync('git', ['-C', wbDir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch { /* no es repo: fill usa el cwd */ }
    const out = execFileSync('git', ['credential', 'fill'], {
      cwd: toplevel ?? wbDir,
      input: `protocol=https\nhost=${site}\n\n`,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: 'true' },
    });
    const get = (k) => new RegExp(`^${k}=(.*)$`, 'm').exec(out)?.[1];
    if (get('username') && get('password')) cred = { user: get('username'), token: get('password') };
  } catch { /* sin helper o sin entrada: degradado */ }
  if (!cred) degradado(`sin credencial para ${site} en el almacén de git`);

  const basic = Buffer.from(`${cred.user}:${cred.token}`).toString('base64');
  const issues = [];
  let startAt = 0;
  for (let pagina = 0; pagina < 10; pagina++) {
    const qs = new URLSearchParams({
      jql: `project = ${proyecto} ORDER BY key ASC`,
      maxResults: '100',
      startAt: String(startAt),
      fields: 'summary,status',
    });
    let res;
    try {
      res = await fetch(`https://${site}/rest/api/3/search?${qs}`, {
        headers: { Authorization: `Basic ${basic}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      degradado(`sin red con ${site} (timeout ${TIMEOUT_MS} ms)`);
    }
    if (!res.ok) degradado(`la API de Jira respondió ${res.status} (credencial, permiso o endpoint)`);
    const data = await res.json();
    for (const it of data.issues ?? []) {
      issues.push({
        key: it.key,
        summary: it.fields?.summary ?? '',
        statusCategory: it.fields?.status?.statusCategory?.key ?? 'new',
      });
    }
    if (startAt + (data.maxResults ?? 0) >= (data.total ?? 0)) break;
    startAt += data.maxResults ?? 100;
  }
  return issues;
}

const issues = await issuesDeJira();
const porPrefijo = new Map(); // «[SEED-027] …» → issue (la primera gana)
for (const it of issues) {
  const prefijo = /^\[([^\]\s]+)\]/.exec(it.summary)?.[1];
  if (prefijo && !porPrefijo.has(prefijo)) porPrefijo.set(prefijo, it);
}

// --- Coherencia: cada ítem activo contra su issue ------------------------------
if (activos.length === 0) {
  console.log(`verify-jira (${site} / ${proyecto}): sin ítems activos que reconciliar${issues.length ? ` — ${issues.length} issues visibles en Jira` : ''}.`);
} else {
  for (const it of activos) {
    const issue = porPrefijo.get(it.id);
    if (!issue) {
      violations.push(`${it.file}: tarea activa ${it.id} sin issue en ${proyecto} (summary «[${it.id}] …» no encontrada) — crea la issue o reconcilia (misma entrega, §5.1.3)`);
      continue;
    }
    const esperada = CATEGORIA[it.status];
    if (issue.statusCategory === 'done') {
      violations.push(`${it.file}: deriva de estado — ${it.id} sigue activo en local («${it.status}») pero su issue ${issue.key} está «${NOMBRE_CATEGORIA.done}» en Jira: cierra el ítem en la misma entrega (§3.11, §5.1.3) o reabre la issue`);
    } else if (issue.statusCategory !== esperada) {
      // los estados intermedios dependen del flujo del proyecto (p. ej. team-managed
      // con solo To Do/Done): la deriva intermedia es aviso, el cierre es lo estricto
      console.log(`⚠ ${it.id} ↔ ${issue.key}: estados intermedios distintos (local «${it.status}» / Jira «${NOMBRE_CATEGORIA[issue.statusCategory]}») — aviso, no violación (el flujo del proyecto puede no tener En curso)`);
    } else {
      console.log(`✔ ${it.id} ↔ ${issue.key} (${NOMBRE_CATEGORIA[esperada]})`);
    }
  }
}

// --- Informe -------------------------------------------------------------------
console.log(`verify-jira: ${wbDir} → ${site} / ${proyecto}${process.env.VERIFY_JIRA_CANNED ? ' (canned, evals)' : ''}`);
if (violations.length === 0) {
  console.log('OK — sin deriva entre el workboard y Jira.');
  process.exit(0);
}
console.log(`VIOLACIONES (${violations.length}):`);
for (const v of violations) console.log(`  - ${v}`);
process.exit(1);
