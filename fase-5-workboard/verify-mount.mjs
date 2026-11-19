#!/usr/bin/env node
// verify-mount.mjs — verificador de MONTAJE por ejecución (SEED-022, F7 §7.1)
// La compleción del montaje es un estado comprobado, no un relato: cada check
// es código, no lectura. Sin dependencias, sin red, determinista (ley 4).
//
// Uso (destino):  node verify-mount.mjs <raíz-del-destino> [--seed <raíz-semilla>]
// Uso (semilla):  node verify-mount.mjs --self <raíz-de-la-semilla>
//
// Modo destino comprueba:
//   (a) git: ≥ 1 commit, árbol limpio, harness trackeado
//   (b) core.hooksPath configurado y hook pre-commit ejecutable
//   (c) workboard: verify-workboard.mjs con código 0
//   (d) fidelidad de las copias mecánicas contra la semilla (--seed; hashes)
//   (e) cero referencias internas colgantes (materiales citados que no viajan)
//   (f) entrada de procedencia presente, con versión real (--seed)
//   (g) estado de desmontaje registrado (procedencia con fecha; semilla no remanente)
//
// Modo --self (la semilla se aplica lo que predica): (a)(b)(c)(e) sobre la
// semilla misma + coherencia CHANGELOG ↔ tags.
// Código de salida: 0 montaje completo; 1 violaciones (el ítem de prueba de
// fuego del destino no puede cerrarse con este verificador en rojo).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const self = args.includes('--self');
const seedIdx = args.indexOf('--seed');
const seedRoot = seedIdx >= 0 ? path.resolve(args[seedIdx + 1]) : null;
const root = path.resolve(args.filter((a, i) => i !== seedIdx && i !== seedIdx + 1 && a !== '--self')[0] ?? '.');

const violations = [];
const fail = (msg) => violations.push(msg);
const sh = (cmd, cargs, opts = {}) => execFileSync(cmd, cargs, { encoding: 'utf8', cwd: root, stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
const quiet = (cmd, cargs) => { try { return sh(cmd, cargs); } catch { return null; } };

const HOOK_REL_CANDIDATES = ['docs/workboard/hooks/pre-commit', 'hooks/pre-commit'];

// --- (a) git: existe, ≥ 1 commit, limpio, harness trackeado -------------------
const toplevel = quiet('git', ['rev-parse', '--show-toplevel']);
if (toplevel == null) {
  fail(`(a) ${root} no es un repo git — el montaje exige commit inicial y hooksPath (decisión de F0)`);
} else {
  const count = Number(quiet('git', ['rev-list', '--count', 'HEAD']) ?? 0);
  if (count < 1) fail('(a) cero commits: la entrega inicial del harness nunca se commiteó (informe oracle-erp: main en 0000000)');
  const dirty = sh('git', ['status', '--porcelain']);
  if (dirty) fail(`(a) árbol git sucio — el montaje termina commiteado:\n${dirty.split('\n').map((l) => '      ' + l).join('\n')}`);
  const tracked = sh('git', ['ls-files', ...(self ? ['fase-5-workboard/'] : ['docs/workboard/'])]);
  if (!tracked) fail(`(a) harness sin trackear: no hay archivos de ${self ? 'fase-5-workboard/' : 'docs/workboard/'} en el índice git`);
}

// --- (b) hook: core.hooksPath configurado y pre-commit ejecutable -------------
const hooksPath = quiet('git', ['config', 'core.hooksPath']);
if (!hooksPath) {
  fail('(b) core.hooksPath sin configurar — la capa determinista nace apagada (informe oracle-erp)');
} else {
  const hookFile = path.join(toplevel ?? root, hooksPath, 'pre-commit');
  if (!fs.existsSync(hookFile)) fail(`(b) core.hooksPath=${hooksPath} pero no existe ${path.relative(root, hookFile)}`);
  else if (!(fs.statSync(hookFile).mode & 0o111)) fail(`(b) ${path.relative(root, hookFile)} sin bit de ejecución — git lo ignora`);
}

// --- (c) workboard: verificador del workboard en verde -------------------------
const wbDir = path.join(root, self ? '_dev/workboard' : 'docs/workboard');
const verifier = path.join(root, self ? 'fase-5-workboard/verify-workboard.mjs' : 'docs/workboard/verify-workboard.mjs');
if (!fs.existsSync(verifier)) {
  fail(`(c) falta ${path.relative(root, verifier)} — el workboard del montaje no está completo (F5)`);
} else {
  const r = quiet('node', [verifier, wbDir]);
  if (r === null) fail('(c) verify-workboard.mjs salió con código distinto de 0 — workboard desincronizado');
  else console.log(r);
}

// --- (e) referencias internas colgantes ----------------------------------------
const scanRoots = ['docs', 'AGENTS.md', 'README.md', ...(self ? ['fase-0-decisiones.md', 'fase-1-mapa-maestro.md', 'fase-2-stub-agents.md', 'fase-4-onboarding.md', 'fase-4b-diagnostico.md', 'fase-5-workboard', 'fase-6-dominios', 'fase-7-verificacion.md', 'SEED.md'] : [])]
  .map((p) => path.join(root, p))
  .filter((p) => fs.existsSync(p));
const mdFiles = [];
const walk = (d) => {
  if (!fs.statSync(d).isDirectory()) { if (d.endsWith('.md')) mdFiles.push(d); return; }
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) mdFiles.push(p);
  }
};
// las plantillas contienen marcadores <enlace-relativo> por diseño (F3): sus
// enlaces son ilustrativos, no referencias reales del repo
const TEMPLATE_MARK = /<[^)>]*>/;
// proyección destino (SEED.md §copiado): el nombre de destino del módulo ↔ su
// archivo en la semilla. Un enlace de un contrato-semilla apuntando a un nombre
// de destino es válido si el material que lo proyecta viaja con la semilla.
const PROJECTION = [
  [/^docs\/workboard\/(.*)$/, 'fase-5-workboard/$1'],
  [/^docs\/conocimiento\/protocolos\/(.*)$/, 'fase-6-dominios/protocolos/$1'],
  [/^docs\/conocimiento\/(.*)$/, 'fase-6-dominios/conocimiento/$1'],
  [/^docs\/runbooks\/(.*)$/, 'fase-6-dominios/runbooks/$1'],
  [/^docs\/ARCHITECTURE\.md$/, 'fase-1-mapa-maestro.md'],
  [/^AGENTS\.md$/, 'fase-2-stub-agents.md'],
];
const toSeed = (p) => {
  for (const [re, to] of PROJECTION) if (re.test(p)) return p.replace(re, to);
  return null;
};
const REVERSE = [
  [/^fase-5-workboard\/(.*)$/, 'docs/workboard/$1'],
  [/^fase-6-dominios\/protocolos\/(.*)$/, 'docs/conocimiento/protocolos/$1'],
  [/^fase-6-dominios\/conocimiento\/(.*)$/, 'docs/conocimiento/$1'],
  [/^fase-6-dominios\/runbooks\/(.*)$/, 'docs/runbooks/$1'],
  [/^fase-1-mapa-maestro\.md$/, 'docs/ARCHITECTURE.md'],
  [/^fase-2-stub-agents\.md$/, 'AGENTS.md'],
];
const toDest = (p) => {
  for (const [re, to] of REVERSE) if (re.test(p)) return p.replace(re, to);
  return p;
};
for (const p of scanRoots) walk(p);
const LINK = /\]\(([^)#\s]+)(?:#[^)]*)?\)/g;
for (const f of mdFiles) {
  const text = fs.readFileSync(f, 'utf8')
    .replace(/```[\s\S]*?```/g, '')      // bloques de código: ejemplos, no referencias
    .replace(/`[^`]*`/g, '');            // código en línea: ídem
  for (const m of text.matchAll(LINK)) {
    const target = m[1];
    if (/^[a-z]+:\/\//.test(target) || target.startsWith('/')) continue; // externo o absoluto
    if (TEMPLATE_MARK.test(target)) continue; // marcador de plantilla sin sustituir
    const resolved = path.resolve(path.dirname(f), decodeURIComponent(target));
    if (fs.existsSync(resolved)) continue;
    if (self) {
      // el destino usará otro layout: proyectar el archivo a su ubicación destino,
      // resolver el enlace ahí y comprobar que el material proyectado viaja con la semilla
      const relFile = path.relative(root, f).split(path.sep).join('/');
      const projDir = path.posix.dirname(toDest(relFile));
      const projTarget = path.posix.normalize(path.posix.join(projDir, decodeURIComponent(target)));
      const seedPath = toSeed(projTarget);
      if (seedPath && fs.existsSync(path.join(root, seedPath))) continue;
    }
    fail(`(e) referencia colgante en ${path.relative(root, f)}: «${target}» — el material citado no viaja con el repo (informe oracle-erp: ai-evals.md)`);
  }
}

// --- coherencia CHANGELOG ↔ tags (modo self) -----------------------------------
if (self) {
  const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  // Exención declarada (SEED-029, [2.8.0]): si el operador comprimió el historial
  // a un commit único, el CHANGELOG porta el marcador (blockquote que inicia con
  // «HISTORIAL-COMPRIMIDO») y la comparación se omite — la excepción queda explícita
  // en la salida, nunca en silencio. El ancla evita falsos positivos con menciones
  // del token en el cuerpo de las entradas.
  if (/^> \*\*HISTORIAL-COMPRIMIDO/m.test(changelog)) {
    console.log('⚠ CHANGELOG↔tags exento: el CHANGELOG declara historial comprimido (HISTORIAL-COMPRIMIDO) — aviso, no violación; las entradas quedan como registro histórico.');
  } else {
    // la política de tags empieza en v2.0.0 (lo declara la propia entrada [2.0.0]:
    // «Política a partir de aquí»); la historia pre-integración quedó aplastada en el init
    const idx = changelog.indexOf('## [2.0.0]');
    const fromPolicy = idx >= 0 ? changelog.slice(0, idx) : changelog;
    const versions = [...fromPolicy.matchAll(/^## \[([0-9]+\.[0-9]+\.[0-9]+)\]/gm)].map((m) => m[1]);
    const tags = new Set((quiet('git', ['tag', '--list']) ?? '').split('\n').filter(Boolean));
    for (const v of versions) if (!tags.has(`v${v}`)) fail(`CHANGELOG declara [${v}] sin tag v${v} — el historial de git debe mostrar lo que el CHANGELOG describe`);
  }
}

// --- comprobaciones exclusivas del modo destino (d)(f)(g) ----------------------
if (!self) {
  // (f) procedencia + (g) desmontaje registrado
  const conocimiento = path.join(root, 'docs/conocimiento');
  const provFiles = fs.existsSync(conocimiento) ? (function walk2(d, acc = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk2(p, acc);
      else if (e.name.endsWith('.md')) acc.push(p);
    }
    return acc;
  })(conocimiento) : [];
  const prov = provFiles.map((f) => ({ f, text: fs.readFileSync(f, 'utf8') }))
    .find(({ text }) => /montado desde/i.test(text) && /orquestador-seed|semilla/i.test(text));
  if (!prov) {
    fail('(f) falta la entrada de procedencia en docs/conocimiento/ — «Harness montado desde orquestador-seed vX.Y.Z el <fecha> en modo <sembrar|parasitar>» (F7 §7.6)');
  } else {
    const ver = /v(\d+\.\d+\.\d+)/.exec(prov.text);
    const fecha = /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})\b/.test(prov.text);
    if (!ver) fail('(f) la entrada de procedencia no declara versión (vX.Y.Z)');
    else if (seedRoot) {
      const cl = fs.readFileSync(path.join(seedRoot, 'CHANGELOG.md'), 'utf8');
      if (!new RegExp(`^## \\[${ver[1]}\\]`, 'm').test(cl)) fail(`(f) procedencia declara semilla v${ver[1]}, versión que no existe en el CHANGELOG de la semilla`);
    }
    if (!fecha) fail('(f) la entrada de procedencia no lleva fecha ISO-8601 — el estado de desmontaje queda sin registro temporal (g)');
  }
  const remnant = path.join(root, seedRoot ? path.basename(seedRoot) : 'orquestador-seed');
  if (fs.existsSync(remnant)) {
    fail(`(g) la semilla sigue dentro del destino (${path.basename(remnant)}/) — el desmontaje (principio 15) no se ejecutó ni se registró`);
  }

  // (d) fidelidad de los módulos mecánicos contra la semilla (--seed)
  if (seedRoot) {
    const pairs = [
      ['docs/workboard/verify-workboard.mjs', 'fase-5-workboard/verify-workboard.mjs'],
      ['docs/workboard/verify-jira.mjs', 'fase-5-workboard/verify-jira.mjs'],
      ['docs/workboard/open-issue.mjs', 'fase-5-workboard/open-issue.mjs'],
      ['docs/workboard/hooks/pre-commit', 'fase-5-workboard/hooks/pre-commit'],
      ['docs/workboard/SCHEMA.md', 'fase-5-workboard/SCHEMA.md'],
      ['docs/workboard/ARCHITECTURE.md', 'fase-5-workboard/ARCHITECTURE.md'],
    ];
    for (const [dest, src] of pairs) {
      const fd = path.join(root, dest);
      const fsd = path.join(seedRoot, src);
      if (!fs.existsSync(fsd)) continue; // módulo no presente en esta versión de semilla
      if (!fs.existsSync(fd)) { fail(`(d) falta la copia del destino: ${dest} (módulo ${src} de la semilla v en uso)`); continue; }
      const hd = createHash('sha256').update(fs.readFileSync(fd)).digest('hex').slice(0, 12);
      const hs = createHash('sha256').update(fs.readFileSync(fsd)).digest('hex').slice(0, 12);
      if (hd !== hs) fail(`(d) copia desfasada: ${dest} difiere de ${src} de la semilla — actualizar el destino conforme a §7.6`);
    }
  }
}

// --- Informe -------------------------------------------------------------------
console.log(`verify-mount: ${root}${self ? ' (modo self — la semilla se aplica lo que predica)' : ''}`);
if (violations.length === 0) {
  console.log('OK — montaje completo: cada capa comprobada por ejecución, no por relato.');
  process.exit(0);
}
console.log(`VIOLACIONES (${violations.length}):`);
for (const v of violations) console.log(`  - ${v}`);
process.exit(1);
