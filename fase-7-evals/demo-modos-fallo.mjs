#!/usr/bin/env node
// demo-modos-fallo.mjs — demostración determinista de SEED-022 (criterio de aceptación):
// verify-mount detecta como fallo EXACTAMENTE los modos observados en el informe de
// campo (oracle-erp) y acepta el fixture sano. Ejecutar sobre fixtures desechables.
//
//   node demo-modos-fallo.mjs
// Código de salida 0 = la demostración pasa (verificador demostrado).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const seedRoot = path.resolve(import.meta.dirname, '..');
const VM = path.join(seedRoot, 'fase-5-workboard/verify-mount.mjs');
const MF = path.join(seedRoot, 'fase-7-evals/make-fixture.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-mount-demo-'));
let failures = 0;

const run = (script, ...a) => {
  try {
    return { code: 0, out: execFileSync('node', [script, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout ?? '') + (e.stderr ?? '') };
  }
};
const expect = (name, cond, detail) => {
  console.log(`${cond ? '✔' : '✘'} ${name}${cond ? '' : ` — ${detail}`}`);
  if (!cond) failures++;
};

// 1) fixture SANO → verify-mount sale 0
const sano = path.join(tmp, 'sano');
run(MF, sano, '--seed', seedRoot);
const rSano = run(VM, sano, '--seed', seedRoot);
expect('fixture sano aceptado (exit 0)', rSano.code === 0, rSano.out);

// 2..5) cada modo de fallo observado → violación exacta y las demás capas en verde
const cases = [
  ['sin-commits', 'cero commits'],
  ['sin-hook', 'core.hooksPath sin configurar'],
  ['ref-colgante', 'referencia colgante'],
  ['sin-desmontaje', 'entrada de procedencia'],
  ['index-roto', 'verify-workboard'],
];
for (const [fault, expected] of cases) {
  const dir = path.join(tmp, fault);
  run(MF, dir, '--seed', seedRoot, '--falla-' + fault);
  const r = run(VM, dir, '--seed', seedRoot);
  expect(`fallo «${fault}» detectado`, r.code === 1 && r.out.includes(expected), `exit=${r.code}, salida:\n${r.out}`);
}

// 6..7) dualidad workboard↔Jira (SEED-026): presión local + tablón congelado
const VW = path.join(seedRoot, 'fase-5-workboard/verify-workboard.mjs');
const rPresion = run(VW, path.join(sano, 'docs/workboard'));
expect('modo local: presión de migración en cada ejecución (exit 0 + banner)',
  rPresion.code === 0 && rPresion.out.includes('MODO WORKBOARD LOCAL (TEMPORAL)'), `exit=${rPresion.code}, salida:\n${rPresion.out}`);
const jira = path.join(tmp, 'modo-jira-activo');
run(MF, jira, '--seed', seedRoot, '--falla-modo-jira-activo');
const rJira = run(VW, path.join(jira, 'docs/workboard'));
expect('modo jira: ítem activo en items/ detectado como violación',
  rJira.code === 1 && rJira.out.includes('quedan ítems activos'), `exit=${rJira.code}, salida:\n${rJira.out}`);

// 8..10) coherencia ítem↔issue con Jira (SEED-027): degradado + canned determinista
const VJ = path.join(seedRoot, 'fase-5-workboard/verify-jira.mjs');
const rDeg = run(VJ, path.join(jira, 'docs/workboard'));
expect('jira sin credencial: modo degradado avisa y no bloquea (exit 0)',
  rDeg.code === 0 && rDeg.out.includes('MODO DEGRADADO'), `exit=${rDeg.code}, salida:\n${rDeg.out}`);
const cannedOk = path.join(tmp, 'canned-ok.json');
fs.writeFileSync(cannedOk, JSON.stringify([{ key: 'FIX-2', summary: '[FIX-002] Tarea que debió migrar a Jira', statusCategory: 'new' }]));
process.env.VERIFY_JIRA_CANNED = cannedOk;
const rOk = run(VJ, path.join(jira, 'docs/workboard'));
const cannedDeriva = path.join(tmp, 'canned-deriva.json');
fs.writeFileSync(cannedDeriva, JSON.stringify([{ key: 'FIX-2', summary: '[FIX-002] Tarea que debió migrar a Jira', statusCategory: 'done' }]));
process.env.VERIFY_JIRA_CANNED = cannedDeriva;
const rDeriva = run(VJ, path.join(jira, 'docs/workboard'));
delete process.env.VERIFY_JIRA_CANNED;
expect('jira coherente (canned): ítem↔issue en verde (exit 0)',
  rOk.code === 0 && rOk.out.includes('✔ FIX-002 ↔ FIX-2'), `exit=${rOk.code}, salida:\n${rOk.out}`);
expect('jira con deriva de cierre (canned): exit 1',
  rDeriva.code === 1 && rDeriva.out.includes('deriva de estado'), `exit=${rDeriva.code}, salida:\n${rDeriva.out}`);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(failures === 0
  ? '\nDEMOSTRACIÓN COMPLETA: verify-mount detecta exactamente los modos de fallo del informe de campo, acepta el montaje sano, la dualidad workboard↔Jira (SEED-026) se comporta como el contrato §4.7 y la coherencia con Jira (SEED-027) como §4.8.'
  : `\nDEMOSTRACIÓN FALLIDA: ${failures} comprobación(es).`);
process.exit(failures === 0 ? 0 : 1);
