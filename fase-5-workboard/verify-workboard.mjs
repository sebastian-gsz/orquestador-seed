#!/usr/bin/env node
// verify-workboard.mjs — verificación mecánica del workboard (contrato §3.3 y §7.6)
// Uso: node verify-workboard.mjs [ruta-al-workboard]     (por defecto: el directorio de este script)
// Valida: items/ ↔ INDEX.md ↔ items/_done/ y los campos del SCHEMA.md.
// Sin dependencias. Código de salida: 0 sin violaciones, 1 con violaciones.

import fs from 'node:fs';
import path from 'node:path';

const wbDir = path.resolve(process.argv[2] ?? import.meta.dirname);
const itemsDir = path.join(wbDir, 'items');
const doneDir = path.join(itemsDir, '_done');
const indexFile = path.join(wbDir, 'INDEX.md');

const STATUSES = ['open', 'in_progress', 'blocked', 'done', 'cancelled'];
const ACTIVE_STATUSES = ['open', 'in_progress', 'blocked'];
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const CLASSES = ['datos', 'red', 'cómputo', 'agente'];
const REQUIRED = ['id', 'title', 'status', 'priority', 'class', 'node', 'created_at', 'updated_at'];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/;

const violations = [];
const fail = (file, msg) => violations.push(`${path.relative(wbDir, file) || file}: ${msg}`);

// --- Parser de front-matter (subconjunto YAML del SCHEMA) -------------------
function parseFrontMatter(text, file) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!m) {
    fail(file, 'sin front-matter YAML');
    return null;
  }
  const fm = {};
  let currentKey = null;
  for (const raw of m[1].split(/\r?\n/)) {
    if (raw.trim() === '' || /^\s*#/.test(raw)) continue;
    const listItem = /^\s+-\s?(.*)$/.exec(raw);
    if (listItem && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(listItem[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(raw);
    if (!kv) {
      fail(file, `línea de front-matter no interpretable: «${raw.trim()}»`);
      continue;
    }
    const key = kv[1];
    let value = kv[2].trim();
    currentKey = key;
    if (value === '[]') { fm[key] = []; continue; }
    if (value === 'null' || value === '') { fm[key] = null; continue; }
    const inlineList = /^\[(.*)\]$/.exec(value);
    if (inlineList) {
      fm[key] = inlineList[1]
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      continue;
    }
    fm[key] = value.replace(/^["']|["']$/g, '');
  }
  return fm;
}

// --- Recolección y validación por ítem --------------------------------------
if (!fs.existsSync(itemsDir)) fail(wbDir, 'falta el directorio items/');
if (!fs.existsSync(doneDir)) fail(wbDir, 'falta el directorio items/_done/');

const collect = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f)) : [];

const all = new Map(); // id -> { fm, file, isActive }

for (const file of [...collect(itemsDir), ...collect(doneDir)]) {
  const isActive = !file.includes(`${path.sep}_done`);
  const text = fs.readFileSync(file, 'utf8');
  const fm = parseFrontMatter(text, file);
  if (!fm) continue;

  const id = String(fm.id ?? '');
  if (id && all.has(id)) fail(file, `ID duplicado: ${id} (también en ${path.relative(wbDir, all.get(id).file)})`);
  else if (id) all.set(id, { fm, file, isActive });

  const base = path.basename(file, '.md');
  if (id && !base.startsWith(id)) fail(file, `el nombre «${base}.md» no empieza por el ID «${id}»`);

  for (const k of REQUIRED) {
    if (fm[k] == null || fm[k] === '') fail(file, `campo obligatorio ausente: ${k}`);
  }
  if (fm.status != null && !STATUSES.includes(fm.status)) fail(file, `status inválido: ${fm.status}`);
  if (fm.priority != null && !PRIORITIES.includes(fm.priority)) fail(file, `prioridad inválida: ${fm.priority}`);
  if (fm.class != null && !CLASSES.includes(fm.class)) fail(file, `clase inválida: ${fm.class} (usa: ${CLASSES.join(', ')})`);
  for (const k of ['id', 'title', 'node']) {
    const v = fm[k];
    if (typeof v === 'string' && /[<>]/.test(v)) fail(file, `marcador sin sustituir en ${k}: «${v}»`);
  }
  for (const k of ['created_at', 'updated_at', 'closed_at', 'claimed_at']) {
    if (fm[k] != null && !ISO.test(String(fm[k]))) fail(file, `${k} sin formato ISO-8601 con offset: «${fm[k]}»`);
  }

  const closed = fm.status === 'done' || fm.status === 'cancelled';
  if (closed) {
    if (isActive) fail(file, `estado ${fm.status} pero el archivo sigue fuera de items/_done/`);
    if (fm.closed_at == null) fail(file, 'cerrado sin closed_at');
    if (fm.status === 'cancelled' && !fm.closed_reason) fail(file, 'cancelado sin closed_reason');
    if (fm.claimed_by != null) fail(file, 'cerrado sin limpiar el claim (claimed_by debe ser null)');
    // §3.11: un informe de campo (defecto del harness) exige la disposición del operador para cerrar.
    if (/^##\s+Informe de campo\s*$/m.test(text)) {
      const hasIssue = Array.isArray(fm.external) && fm.external.some((e) => e && /^https?:\/\//.test(e));
      const hasDecision =
        Array.isArray(fm.decision_log) && fm.decision_log.some((d) => String(d).includes('[via-ascendente] no-asciende'));
      if (!hasIssue && !hasDecision) {
        fail(file, 'informe de campo cerrado sin disposición del operador: issue en external o decision_log con [via-ascendente] no-asciende (§3.11)');
      }
    }
  } else if (fm.status != null) {
    if (fm.claimed_by != null && fm.claimed_at == null) fail(file, 'claimed_by sin claimed_at');
    if (fm.claimed_by == null && fm.claimed_at != null) fail(file, 'claimed_at sin claimed_by');
  }

  const isExp = /^EXP-/.test(id);
  const regimen = fm.regimen;
  if (regimen != null && regimen !== 'produccion' && regimen !== 'exploracion') {
    fail(file, `regimen inválido: ${regimen} (usa produccion | exploracion)`);
  }
  if (isExp && regimen !== 'exploracion') fail(file, 'ID EXP-* requiere regimen: exploracion (§4.6)');
  if (!isExp && regimen === 'exploracion') fail(file, 'regimen: exploracion exige ID EXP-### (§4.6)');
  if (regimen === 'exploracion') {
    if (fm.timebox == null || !ISO.test(String(fm.timebox))) {
      fail(file, 'exploración sin timebox ISO-8601 (§4.6)');
    } else if (!closed && new Date(String(fm.timebox)) < new Date()) {
      fail(file, 'exploración con timebox vencido — cerrar o promover (§4.6)');
    }
  }
}

// --- Dependencias reales -----------------------------------------------------
for (const { fm, file } of all.values()) {
  for (const k of ['blocks', 'blocked_by']) {
    for (const dep of Array.isArray(fm[k]) ? fm[k] : []) {
      if (!all.has(dep)) fail(file, `${k} apunta a un ID inexistente: ${dep}`);
    }
  }
  if (fm.parent != null && !all.has(fm.parent)) fail(file, `parent apunta a un ID inexistente: ${fm.parent}`);
}

// --- Canal ascendente (§3.12): coherencia entre canal.md y el ítem del canal --
const canalFile = path.join(wbDir, 'canal.md');
if (fs.existsSync(canalFile)) {
  const canal = {};
  for (const line of fs.readFileSync(canalFile, 'utf8').split(/\r?\n/)) {
    const kv = /^(upstream|item):\s*(.*)$/.exec(line.trim());
    if (kv) canal[kv[1]] = kv[2] === 'null' ? null : kv[2].trim();
  }
  const canalItem = canal.item ? all.get(canal.item) : null;
  if (canal.item && !canalItem) fail(canalFile, `item apunta a un ID inexistente: ${canal.item}`);
  if (canal.upstream) {
    if (!canalItem || canalItem.fm.status !== 'done') fail(canalFile, 'canal activado (upstream) sin ítem del canal cerrado (§3.12)');
  }
  if (canalItem && canalItem.fm.status === 'done' && !canal.upstream) {
    fail(canalFile, 'ítem del canal cerrado sin activar el canal: canal.md sigue con upstream: null (§3.12)');
  }
  if (canalItem && canalItem.fm.status === 'cancelled' && canal.upstream) {
    fail(canalFile, 'ítem del canal cancelado (opt-out) pero canal.md sigue activo (§3.12)');
  }
}

// --- MODO.md: bisagra de la dualidad workboard↔Jira (SEED-026) ---------------
// modo: local (andamio temporal, con presión de migración) | jira (tablón
// congelado como punto de reglas maestras; las tareas viven en Jira)
const modoFile = path.join(wbDir, 'MODO.md');
let modo = 'local';
let jiraTarget = null;
if (!fs.existsSync(modoFile)) {
  fail(modoFile, 'falta MODO.md — la dualidad workboard↔Jira exige declarar el modo (SEED-026); se asume «local»');
} else {
  const textoModo = fs.readFileSync(modoFile, 'utf8');
  if (/\r/.test(textoModo)) fail(modoFile, 'MODO.md con finales de línea CRLF — la bisagra del modo debe ser LF (el hook la lee con sed y un \r la invalida en silencio)');
  const fmModo = parseFrontMatter(textoModo, modoFile);
  if (fmModo) {
    if (fmModo.modo !== 'local' && fmModo.modo !== 'jira') fail(modoFile, `modo inválido: «${fmModo.modo}» (usa: local | jira)`);
    modo = fmModo.modo === 'jira' ? 'jira' : 'local';
    jiraTarget = typeof fmModo.jira === 'string' && fmModo.jira !== 'null' ? fmModo.jira : null;
    if (modo === 'jira' && !jiraTarget) fail(modoFile, 'modo: jira sin destino de tareas declarado en «jira:» (site/proyecto)');
  }
}

// --- INDEX.md: proyección exacta de los ítems activos ------------------------
const rows = [];
if (!fs.existsSync(indexFile)) {
  fail(wbDir, 'falta INDEX.md');
} else {
  let header = null;
  for (const line of fs.readFileSync(indexFile, 'utf8').split(/\r?\n/)) {
    if (!/^\s*\|/.test(line)) { header = null; continue; }
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length > 1 && cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    if (!header) {
      const lower = cells.map((c) => c.toLowerCase());
      if (lower.includes('id') && lower.includes('status')) header = lower;
      continue;
    }
    const get = (name) => cells[header.indexOf(name)] ?? '';
    rows.push({ id: get('id'), status: get('status') });
  }
}

const active = new Map(
  [...all.values()].filter((it) => it.isActive && ACTIVE_STATUSES.includes(it.fm.status)).map((it) => [String(it.fm.id), it]),
);
const seen = new Set();
for (const r of rows) {
  if (!r.id) { violations.push('INDEX.md: fila sin ID'); continue; }
  if (seen.has(r.id)) violations.push(`INDEX.md: ID duplicado ${r.id}`);
  seen.add(r.id);
  const item = active.get(r.id);
  if (!item) {
    const anywhere = all.get(r.id);
    violations.push(
      `INDEX.md: ${r.id} listado pero ${anywhere ? (anywhere.isActive ? `su estado es ${anywhere.fm.status} (no activo)` : 'está archivado en _done/') : 'no existe en items/'}`,
    );
  } else if (r.status && r.status !== item.fm.status) {
    violations.push(`INDEX.md: ${r.id} con status «${r.status}» pero el ítem dice «${item.fm.status}»`);
  }
}
for (const [id] of active) {
  if (!seen.has(id)) violations.push(`INDEX.md: ítem activo ${id} no listado`);
}

// --- Dualidad (SEED-026): el tablón anuncia el modo y se comporta según él ----
if (fs.existsSync(indexFile)) {
  const indexText = fs.readFileSync(indexFile, 'utf8');
  if (modo === 'local') {
    if (!indexText.includes('Workboard local temporal')) {
      fail(indexFile, 'modo local: el tablón debe anunciar su carácter temporal y la migración a Jira (línea «Workboard local temporal», SEED-026)');
    }
  } else {
    const activos = [...active.keys()];
    if (activos.length > 0) {
      fail(modoFile, `modo jira: quedan ítems activos en items/ (${activos.join(', ')}) — las tareas viven en Jira; archivarlos o eliminarlos (SEED-026)`);
    }
    if (!indexText.includes('Reglas maestras')) {
      fail(indexFile, 'modo jira: el tablón queda como punto de reglas maestras — INDEX.md debe declarar la sección «Reglas maestras» (SEED-026)');
    }
    if (jiraTarget && !indexText.includes(jiraTarget)) {
      fail(indexFile, `modo jira: INDEX.md no referencia el destino de tareas (${jiraTarget}) — SEED-026`);
    }
    if (indexText.includes('Workboard local temporal')) {
      fail(indexFile, 'modo jira: INDEX.md aún anuncia el workboard local temporal — actualizar el tablón al congelarlo (SEED-026)');
    }
  }
}

// --- Compleción por tarea y sus componentes (SEED-022) -----------------------
// (1) decision_log en el front-matter (rechaza bloques sueltos en el cuerpo)
// (2) fechas plausibles (≥ año mínimo del destino; env VERIFY_WB_MIN_YEAR)
// (3) cada ruta de touches existe en el repo (ítems activos)
// (4) runbooks: last_reviewed no anterior a la última fecha del documento

const MIN_YEAR = Number(process.env.VERIFY_WB_MIN_YEAR ?? 2024);
const DATE_IN_TEXT = /\b\d{4}-\d{2}-\d{2}\b/g;
const repoRoot = path.resolve(wbDir, '..', '..');

for (const { fm, file, isActive } of all.values()) {
  // (1) decision_log como campo del front-matter (prospectivo: ítems activos;
  //     los archivados cerraron bajo el SCHEMA anterior y no se retoca la historia)
  if (isActive && (!Array.isArray(fm.decision_log) || fm.decision_log.length === 0)) {
    fail(file, 'decision_log ausente o vacío en el front-matter (SEED-022): los bloques sueltos en el cuerpo no son trazabilidad');
  }
  // (2) fechas plausibles
  for (const k of ['created_at', 'updated_at', 'closed_at', 'claimed_at', 'timebox']) {
    const v = fm[k];
    if (v != null && ISO.test(String(v))) {
      const y = Number(String(v).slice(0, 4));
      if (!Number.isInteger(y) || y < MIN_YEAR) fail(file, `${k} con año implausible: ${y} (mínimo ${MIN_YEAR}; parámetro VERIFY_WB_MIN_YEAR)`);
    }
  }
  // (3) touches: rutas que existen en el repo (solo ítems activos; los archivados son historia)
  if (isActive && fm.status === 'in_progress') {
    for (const t of Array.isArray(fm.touches) ? fm.touches : []) {
      if (!t || t === '.') continue;
      if (!fs.existsSync(path.join(repoRoot, t))) {
        fail(file, `touches apunta a una ruta inexistente en el repo: ${t} (SEED-022: declara solo lo que tocas)`);
      }
    }
  }
}

// (4) runbooks al día: last_reviewed ≥ última fecha del documento
const runbookDirs = ['docs/runbooks', 'fase-6-dominios/runbooks']
  .map((d) => path.join(repoRoot, d))
  .filter((d) => fs.existsSync(d));
for (const dir of runbookDirs) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md') && !x.startsWith('_'))) {
    const file = path.join(dir, f);
    const text = fs.readFileSync(file, 'utf8');
    const lr = /^last_reviewed:\s*(\d{4}-\d{2}-\d{2})/m.exec(text);
    if (!lr) { fail(file, 'runbook sin last_reviewed en el front-matter (SEED-022)'); continue; }
    const dates = [...text.matchAll(DATE_IN_TEXT)].map((m) => m[0]).sort();
    const last = dates[dates.length - 1];
    if (last && lr[1] < last) {
      fail(file, `runbook desactualizado: last_reviewed (${lr[1]}) anterior a la última fecha del documento (${last}) — revisar y actualizar en la misma entrega (SEED-022)`);
    }
  }
}

// --- Remotos con credenciales embebidas (SEED-021): réplica en verificador ----
// El hook pre-commit la aplica al 100% de los destinos con hook; esta réplica
// cubre montajes parciales y verificaciones fuera del ciclo de commit.
try {
  const { execFileSync } = await import('node:child_process');
  let dir = wbDir;
  let toplevel = null;
  while (dir !== path.parse(dir).root) {
    try {
      toplevel = execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
      break;
    } catch {
      dir = path.dirname(dir);
    }
  }
  if (toplevel) {
    const raw = execFileSync('git', ['-C', toplevel, 'remote', '-v'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const bad = [...new Set(raw.split('\n').filter(Boolean).map((l) => l.split(/\s+/)[1]))]
      .filter((u) => /^https?:\/\/[^/@\s]+@/.test(u));
    if (bad.length > 0) {
      violations.push(`repo ${toplevel}: remote con credenciales embebidas en la URL (prohibido a toda costa; usa el credential helper): ${bad.map((u) => u.replace(/\/\/[^/@]*@/, '//***@')).join(', ')}`);
    }
  }
} catch {
  // sin git disponible o no es un repo: la réplica no aplica aquí (el hook sigue siendo la garantía)
}

// --- Informe -----------------------------------------------------------------
// Presión de migración (SEED-026): el modo local es un andamio temporal; la
// semilla lo recuerda en CADA ejecución, en verde o en rojo.
if (modo === 'local') {
  console.log('⚠  MODO WORKBOARD LOCAL (TEMPORAL): este tablón es un andamio de arranque; la fuente de verdad final de las tareas es Jira.');
  console.log('   Migra cuanto antes (runbook migrar-tareas-a-jira.md). Tras migrar, el tablón queda como punto de reglas maestras y las tareas se crean solo en Jira.');
}
const activeCount = [...all.values()].filter((it) => it.isActive).length;
const doneCount = [...all.values()].filter((it) => !it.isActive).length;
console.log(`workboard: ${wbDir}`);
console.log(`ítems en items/: ${activeCount} · archivados en _done/: ${doneCount} · filas en INDEX.md: ${rows.length}`);
if (violations.length === 0) {
  console.log('OK — sin violaciones del contrato del workboard.');
  process.exit(0);
}
console.log(`VIOLACIONES (${violations.length}):`);
for (const v of violations) console.log(`  - ${v}`);
process.exit(1);
