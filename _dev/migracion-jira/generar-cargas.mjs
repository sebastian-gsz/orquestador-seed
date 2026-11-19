#!/usr/bin/env node
// generar-cargas.mjs — genera las cargas de issues Jira desde los ítems del workboard
// (SEED-024, fase 1 del plan de migración). Determinista, sin red: entrada = workboard
// local; salida = cargas JSON en cargas/ conformes al mapeo del runbook
// «Migrar tareas del workboard a Jira» (fase-6-dominios/runbooks/migrar-tareas-a-jira.md).
// La PRUEBA FINAL (crear proyecto SEED e importar las cargas vía MCP) es diferible con dueño.
//
//   node _dev/migracion-jira/generar-cargas.mjs            # genera todas las cargas
//   node _dev/migracion-jira/generar-cargas.mjs --validar  # solo valida (exit 0/1)

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const wb = path.join(root, '_dev/workboard');
const outDir = path.join(import.meta.dirname, 'cargas');
const VALIDATE = process.argv.includes('--validar');
const PROJECT = process.argv.find((a) => a.startsWith('--project='))?.split('=')[1]
  ?? process.env.JIRA_PROJECT ?? 'SEED'; // ZCJ mientras no exista el proyecto SEED dedicado (decisión del operador 2026-11-15)

const PRIORIDAD = { P0: 'Highest', P1: 'High', P2: 'Medium', P3: 'Low' };
const ESTADO = { open: 'To Do', in_progress: 'In Progress', blocked: 'In Progress', done: 'Done', cancelled: 'Done' };
// fixVersion según el release que archivó cada ítem (CHANGELOG de la semilla)
const FIXVERSION = (id) => {
  const n = Number(id.split('-')[1]);
  if (n >= 24) return null; // ítems del plan de migración: sin release aún
  if (n >= 23) return 'v2.4.0';
  if (n >= 22) return 'v2.3.0';
  if (n >= 20) return 'v2.1.0';
  return 'v2.0.0';
};
// patrones de secreto REAL; <REDACTED> y <VALOR_DEL_TOKEN> son marcadores del
// propio corpus (principio 10), no valores — no se marcan
const SECRETO = /ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-|-----BEGIN [A-Z ]*PRIVATE KEY-----/;

// --- front-matter (mismo subconjunto que verify-workboard) ---------------------
function parseFM(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  const fm = {};
  if (!m) return fm;
  let key = null;
  for (const raw of m[1].split(/\r?\n/)) {
    if (raw.trim() === '' || /^\s*#/.test(raw)) continue;
    const li = /^\s+-\s?(.*)$/.exec(raw);
    if (li && key) { (fm[key] ??= []).push(li[1].trim().replace(/^["']|["']$/g, '')); continue; }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(raw);
    if (!kv) continue;
    key = kv[1];
    const v = kv[2].trim();
    if (v === '[]') { fm[key] = []; continue; }
    if (v === 'null' || v === '') { fm[key] = null; continue; }
    fm[key] = v.replace(/^["']|["']$/g, '');
  }
  return fm;
}

const collect = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f))
  : [];
const items = [...collect(path.join(wb, 'items')), ...collect(path.join(wb, 'items/_done'))]
  .map((f) => ({ file: f, fm: parseFM(fs.readFileSync(f, 'utf8')), body: fs.readFileSync(f, 'utf8') }))
  .filter((it) => it.fm.id);

function carga(it) {
  const { fm, body, file } = it;
  const seccion = (titulo, lista) => Array.isArray(lista) && lista.length
    ? `\n\nh3. ${titulo}\n\n${lista.map((x) => `* ${String(x).replace(/^\[x\]\s*/, '(hecho) ').replace(/^\[ \]\s*/, '(pendiente) ')}`).join('\n')}`
    : '';
  const desc = [
    `Migrada del workboard del corpus (${path.relative(root, file)}).`,
    `Fuente de verdad declarada: el workboard local es canónico hasta la decisión de SEED-026.`,
    seccion('Criterios de aceptación', fm.acceptance),
    seccion('Touches', fm.touches),
  ].join('\n\n');
  const labels = [
    `class:${fm.class ?? 'agente'}`,
    `regimen:${fm.regimen ?? 'produccion'}`,
    ...(fm.status === 'blocked' ? ['blocked'] : []),
    ...(fm.claimed_by ? [`claimed:${fm.claimed_by}`] : []),
  ];
  return {
    // mapeo del runbook: id → key (mismo número); si Jira lo ocupara, registrar en external
    fields: {
      project: { key: PROJECT },
      issuetype: { name: 'Task' },
      summary: `[${fm.id}] ${fm.title}`,
      description: desc,
      priority: { name: PRIORIDAD[fm.priority] ?? 'Medium' },
      labels,
      ...(FIXVERSION(fm.id) ? { fixVersions: [{ name: FIXVERSION(fm.id) }] } : {}),
    },
    _meta: {
      id_local: fm.id,
      archivo: path.relative(root, file),
      estado_local: fm.status,
      estado_jira: ESTADO[fm.status] ?? 'To Do',
      external: Array.isArray(fm.external) ? fm.external.filter((x) => x && x !== 'null') : [],
      informes: SECRETO.test(body) ? 'REVISAR: posible patrón de secreto' : 'limpia',
    },
  };
}

const cargas = items.map(carga);

// --- validación ----------------------------------------------------------------
const errores = [];
const ids = new Set();
for (const c of cargas) {
  if (ids.has(c._meta.id_local)) errores.push(`ID duplicado: ${c._meta.id_local}`);
  ids.add(c._meta.id_local);
  if (!c.fields.summary || !c.fields.description) errores.push(`${c._meta.id_local}: summary/description vacíos`);
  if (!c.fields.labels.some((l) => l.startsWith('class:'))) errores.push(`${c._meta.id_local}: sin label de clase`);
  if (c._meta.informes !== 'limpia') errores.push(`${c._meta.id_local}: ${c._meta.informes}`);
}
if (errores.length) {
  console.log(`VALIDACIÓN FALLIDA (${errores.length}):`);
  for (const e of errores) console.log(`  - ${e}`);
  process.exit(1);
}

if (VALIDATE) {
  console.log(`VALIDACIÓN OK: ${cargas.length} cargas conformes al mapeo (sin secretos, campos completos).`);
  process.exit(0);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
for (const c of cargas) {
  fs.writeFileSync(path.join(outDir, `${c._meta.id_local}.json`), JSON.stringify(c, null, 2) + '\n');
}
fs.writeFileSync(path.join(import.meta.dirname, 'cargas', '_manifiesto.json'), JSON.stringify({
  generado: '2026-11-15T22:45:00+01:00',
  total: cargas.length,
  por_estado: cargas.reduce((a, c) => ({ ...a, [c._meta.estado_jira]: (a[c._meta.estado_jira] ?? 0) + 1 }), {}),
  por_fixVersion: cargas.reduce((a, c) => ({ ...a, [c.fields.fixVersions?.[0].name ?? 'sin-release']: (a[c.fields.fixVersions?.[0].name ?? 'sin-release'] ?? 0) + 1 }), {}),
  nota: 'La importación en Jira (createJiraIssue + transición al estado local + fixVersion) es la PRUEBA FINAL del plan — diferible con dueño: operador.',
}, null, 2) + '\n');
console.log(`cargas generadas: ${cargas.length} en ${path.relative(root, outDir)}`);
console.log('PRUEBA FINAL pendiente (dueño: operador): proyecto SEED en Jira → importar cargas → reconciliar por lectura.');
