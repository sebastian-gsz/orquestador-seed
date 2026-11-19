#!/usr/bin/env node
// open-issue.mjs — abre la issue del informe de campo en el repo upstream del canal ascendente
// (contrato del workboard §3.12). Uso:
//   node open-issue.mjs --title "…" [--body-file informe.md] [--repo OWNER/REPO]
//   node open-issue.mjs --check        # valida canal.md + credencial sin abrir nada
// La credencial jamás vive en este archivo ni en el repo: se lee del almacén de credenciales de git
// (git credential fill) — ver el runbook «crear-credencial-canal-issues.md».
// Sin dependencias (node ≥ 18). Código 0 con issue abierta o check en verde; 1 en error.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const die = (msg) => {
  console.error(`open-issue: ${msg}`);
  process.exit(1);
};

// 1. Estado del canal: canal.md junto a este script (docs/workboard/ en el destino).
const canalFile = path.join(import.meta.dirname, 'canal.md');
if (!fs.existsSync(canalFile)) die('falta canal.md junto a este script — el montaje no instaló el canal (contrato §3.12)');
const canal = {};
for (const line of fs.readFileSync(canalFile, 'utf8').split(/\r?\n/)) {
  const kv = /^(upstream|item):\s*(.*)$/.exec(line.trim());
  if (kv) canal[kv[1]] = kv[2] === 'null' ? null : kv[2].trim();
}
if (canal.item == null || canal.upstream == null) {
  die('canal inactivo: completa el ítem del canal (cerrarlo escribe upstream en canal.md) o registra el opt-out cancelándolo (§3.12)');
}
const repo = arg('repo') ?? canal.upstream;
if (!repo || !/^[^/\s]+\/[^/\s]+$/.test(repo)) die(`repo upstream inválido: «${repo}» (formato OWNER/REPO)`);

// 2. Credencial: del almacén de git, nunca de archivos del repo. Sin prompt: si no está guardada, falla.
const host = process.env.OPEN_ISSUE_HOST ?? 'github.com';
let token;
try {
  const out = execFileSync('git', ['credential', 'fill'], {
    input: `protocol=https\nhost=${host}\n`,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  token = /^password=(.*)$/m.exec(out)?.[1];
} catch {
  token = undefined;
}
if (!token) die(`sin credencial para ${host} en el almacén de git — sigue el runbook «crear-credencial-canal-issues.md» (nunca en archivos del repo)`);
if (arg('check')) {
  console.log(`canal operativo: ${repo} (credencial presente para ${host})`);
  process.exit(0);
}

// 3. Abrir la issue. La salida nunca incluye el token.
const title = arg('title') ?? (arg('title-file') ? fs.readFileSync(arg('title-file'), 'utf8').trim().split(/\r?\n/)[0] : undefined);
if (!title) die('falta --title o --title-file');
const bodyFile = arg('body-file');
if (bodyFile && !fs.existsSync(bodyFile)) die(`--body-file no existe: ${bodyFile}`);
const body = bodyFile ? fs.readFileSync(bodyFile, 'utf8') : undefined;

let res;
try {
  res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'orquestador-harness',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, ...(body ? { body } : {}) }),
  });
} catch (e) {
  die(`fallo de red al contactar la API: ${e.message}`);
}
if (!res.ok) {
  const detalle = (await res.json().catch(() => ({})))?.message ?? 'sin detalle';
  die(`la API respondió ${res.status}: ${detalle} (revisa los scopes y el expiry del token)`);
}
const issue = await res.json();
console.log(issue.html_url);
