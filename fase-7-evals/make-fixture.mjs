#!/usr/bin/env node
// make-fixture.mjs — genera el repo-fixture mínimo de la batería de evals (F7 §7.3)
// Sintaxis: node make-fixture.mjs <dir-destino> [--seed <raíz-semilla>] [--falla <modo>]...
//
// Fixture: destino con estilo destino (docs/workboard + docs/conocimiento) montado
// con los módulos mecánicos de la semilla. Determinista; sin red.
// Modos de fallo inyectables (los observados en el informe de campo de oracle-erp):
//   sin-commits      — git init pero sin commit inicial
//   sin-hook         — core.hooksPath sin configurar
//   ref-colgante     — un documento cita un material que no viaja (ai-evals.md)
//   sin-desmontaje   — sin entrada de procedencia con fecha
//   index-roto       — INDEX.md desincronizado respecto a items/
//   modo-jira-activo — MODO.md en modo jira pero con un ítem activo en items/ (SEED-026)
// Sin --falla, el fixture es un montaje SANO que verify-mount debe aceptar.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const dest = path.resolve(args[0]);
const seedIdx = args.indexOf('--seed');
const seedRoot = seedIdx >= 0 ? path.resolve(args[seedIdx + 1]) : path.resolve(import.meta.dirname, '..');
const faults = args.filter((a) => a.startsWith('--falla-')).map((a) => a.slice(8));

const has = (m) => faults.includes(m);
const mkdir = (p) => fs.mkdirSync(p, { recursive: true });
const cp = (src, dst) => { mkdir(path.dirname(dst)); fs.copyFileSync(src, dst); };
const write = (dst, text) => { mkdir(path.dirname(dst)); fs.writeFileSync(dst, text); };
const git = (...a) => {
  const opts = a.length && typeof a[a.length - 1] === 'object' ? a.pop() : {};
  return execFileSync('git', a, { cwd: dest, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
};

// módulos mecánicos de la semilla (copias, jamás enlaces — principio 15)
const V = seedRoot;
const seedVersion = (/^## \[(\d+\.\d+\.\d+)\]/m.exec(fs.readFileSync(path.join(V, 'CHANGELOG.md'), 'utf8')) ?? [])[1] ?? '0.0.0';
cp(path.join(V, 'fase-5-workboard/verify-workboard.mjs'), path.join(dest, 'docs/workboard/verify-workboard.mjs'));
cp(path.join(V, 'fase-5-workboard/verify-jira.mjs'), path.join(dest, 'docs/workboard/verify-jira.mjs'));
cp(path.join(V, 'fase-5-workboard/open-issue.mjs'), path.join(dest, 'docs/workboard/open-issue.mjs'));
cp(path.join(V, 'fase-5-workboard/README.md'), path.join(dest, 'docs/workboard/README.md'));
cp(path.join(V, 'fase-5-workboard/ARCHITECTURE.md'), path.join(dest, 'docs/workboard/ARCHITECTURE.md'));
cp(path.join(V, 'fase-5-workboard/SCHEMA.md'), path.join(dest, 'docs/workboard/SCHEMA.md'));
cp(path.join(V, 'fase-5-workboard/_template-item.md'), path.join(dest, 'docs/workboard/_template-item.md'));
cp(path.join(V, 'fase-5-workboard/hooks/pre-commit'), path.join(dest, 'docs/workboard/hooks/pre-commit'));
cp(path.join(V, 'fase-6-dominios/protocolos/secretos.md'), path.join(dest, 'docs/conocimiento/protocolos/secretos.md'));
cp(path.join(V, 'fase-6-dominios/protocolos/agente.md'), path.join(dest, 'docs/conocimiento/protocolos/agente.md'));
cp(path.join(V, 'fase-6-dominios/protocolos/datos.md'), path.join(dest, 'docs/conocimiento/protocolos/datos.md'));
cp(path.join(V, 'fase-6-dominios/protocolos/red.md'), path.join(dest, 'docs/conocimiento/protocolos/red.md'));
cp(path.join(V, 'fase-6-dominios/protocolos/computo.md'), path.join(dest, 'docs/conocimiento/protocolos/computo.md'));

write(path.join(dest, 'AGENTS.md'), '# AGENTS — stub\n\nLee docs/ARCHITECTURE.md (mapa maestro) antes de tocar nada.\n');
write(path.join(dest, 'README.md'), '# Fixture de evals\n\nRepo mínimo para la batería F7 §7.3 — jamás un destino real.\n');
write(path.join(dest, 'docs/ARCHITECTURE.md'), '# Mapa maestro — fixture\n\n## 5. Mantenimiento de la red\n\n- Si modificas comportamiento, actualiza el contrato del nodo en la misma entrega.\n');
write(path.join(dest, 'docs/conocimiento/README.md'), '# Conocimiento\n\n- Protocolos: `docs/conocimiento/protocolos/`.\n');
if (!has('sin-desmontaje')) {
  write(path.join(dest, 'docs/conocimiento/procedencia.md'),
    `# Procedencia\n\nHarness montado desde \`orquestador-seed\` v${seedVersion} el 2026-11-15T12:00:00+01:00 en modo sembrar. Sin dependencias hacia la semilla. Desmontaje registrado: la semilla fue material de construcción y se retiró el mismo día.\n`);
}
if (has('ref-colgante')) {
  write(path.join(dest, 'docs/ARCHITECTURE.md'),
    '# Mapa maestro — fixture\n\n## 5. Mantenimiento de la red\n\n- Si modificas comportamiento, actualiza el contrato del nodo en la misma entrega.\n- La batería de evals vive en [ai-evals.md](ai-evals.md).\n');
}

// workboard mínimo: MODO.md (dualidad SEED-026), 1 ítem cerrado coherente con INDEX
write(path.join(dest, 'docs/workboard/MODO.md'), has('modo-jira-activo')
  ? '---\nmodo: jira\njira: "fixture.atlassian.net / FIX"\ndesde: 2026-11-15\n---\n\n# MODO\n\nModo jira del fixture (fallo inyectado: queda un ítem activo sin migrar).\n'
  : '---\nmodo: local\njira: null\ndesde: 2026-11-15\n---\n\n# MODO\n\nWorkboard local temporal del fixture (SEED-026): migra a Jira.\n');
const indexRows = has('index-roto')
  ? '| FIX-001 | Ítem fantasma | open | P2 | agente | docs/ |  |\n'
  : has('modo-jira-activo')
    ? '| FIX-002 | Tarea que debió migrar a Jira | open | P2 | agente | docs/ |  |\n'
    : '';
write(path.join(dest, 'docs/workboard/INDEX.md'),
  '# INDEX — Ítems activos\n\n> ⚠️ **Workboard local temporal** — la fuente de verdad final de las tareas es Jira; migra cuanto antes (runbook `migrar-tareas-a-jira.md`). Tras migrar, este tablón queda como punto de reglas maestras (MODO.md, SEED-026).\n\n'
  + (indexRows
    ? `| ID | Título | Status | Priority | Class | Node | Claimed by |\n|---|---|---|---|---|---|---|\n${indexRows}`
    : 'Nada activo.\n'));
if (has('modo-jira-activo')) {
  write(path.join(dest, 'docs/workboard/items/FIX-002-activa.md'), `---
id: FIX-002
title: "Tarea que debió migrar a Jira"
status: open
priority: P2
class: agente
regimen: produccion
timebox: null
node: docs/
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T10:00:00+01:00
updated_at: 2026-11-15T10:00:00+01:00
closed_at: null
closed_reason: null
touches: []
blocks: []
blocked_by: []
acceptance:
  - "Escenario de fallo del eval: ítem activo en modo jira."
subtasks: []
external:
  - null
decision_log:
  - "2026-11-15T10:00:00+01:00 · fixture · Ítem activo inyectado para el fallo modo-jira-activo (SEED-026)."
---

## Contexto

Fallo inyectado de la batería de evals (F7 §7.3).
`);
}
write(path.join(dest, 'docs/workboard/items/_done/.gitkeep'), '');
write(path.join(dest, 'docs/workboard/items/_done/FIX-001-montaje.md'), `---
id: FIX-001
title: "Montaje del fixture"
status: done
priority: P2
class: agente
regimen: produccion
timebox: null
node: docs/
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T10:00:00+01:00
updated_at: 2026-11-15T11:00:00+01:00
closed_at: 2026-11-15T11:00:00+01:00
closed_reason: "Montaje del fixture completado."
touches:
  - docs/
blocks: []
blocked_by: []
acceptance:
  - "Fixture operativo."
subtasks:
  - "[x] Montar"
external:
  - null
decision_log:
  - "2026-11-15T10:00:00+01:00 · fixture · Ítem inicial del fixture."
---

## Contexto

Fixture mínimo de la batería de evals (F7 §7.3).
`);

// git: init + hooksPath + commit (o sus fallos inyectados)
fs.rmSync(path.join(dest, '.git'), { recursive: true, force: true });
git('init', '-q', '-b', 'main');
git('config', 'user.email', 'fixture@evals.local');
git('config', 'user.name', 'fixture');
if (!has('sin-hook')) git('config', 'core.hooksPath', 'docs/workboard/hooks');
if (!has('sin-commits')) {
  git('add', '-A');
  git('commit', '-q', '-m', 'init: fixture de evals', { env: { ...process.env, GIT_AUTHOR_DATE: '2026-11-15T11:00:00+01:00', GIT_COMMITTER_DATE: '2026-11-15T11:00:00+01:00' } });
}
console.log(`fixture listo: ${dest}${faults.length ? ` (fallos: ${faults.join(', ')})` : ' (sano)'}`);
