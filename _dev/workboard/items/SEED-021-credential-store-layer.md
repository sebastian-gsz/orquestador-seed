---
id: SEED-021
title: "Estandarizar la capa de credenciales de publicación (git credential helpers, Windows vs Linux)"
status: open
priority: P1
class: agente
regimen: produccion
timebox: null
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-25T03:00:00+02:00
updated_at: 2026-10-25T03:00:00+02:00
closed_at: null
closed_reason: null
touches:
  - fase-6-dominios/protocolos/secretos.md
  - docs/runbooks/
  - fase-5-workboard/
  - SEED.md
blocks: []
blocked_by: []
acceptance:
  - "Debate resuelto por el operador: ¿store plano con PAT de expiry corto como default canónico, o exigir llavero (libsecret/GCM)? ¿El check de remote-URL con token embebido al hook (100%) o como regla (80%)? ¿La divergencia Windows/Linux se documenta como excepción o se elimina instalando GCM en WSL?"
  - "Vía A aprobada: sección «El almacén: git credential helpers» en secretos.md — semántica acumulativa de credential.helper, truco del reset vacío, matriz por entorno"
  - "Vía B aprobada: runbook canónico «Publicar un repo destino por HTTPS» en docs/runbooks/ generalizando el flujo OPS-005"
  - "Vía C aprobada: check mecánico de remote con credenciales embebidas en la URL (verificador o pre-commit)"
  - "Release del corpus con lo aprobado (CHANGELOG vX.Y.Z + verificador en verde en _dev/workboard)"
subtasks:
  - "[ ] Debate del operador (las 3 decisiones de arriba)"
  - "[ ] Vía A: secretos.md §almacén"
  - "[ ] Vía B: runbook de publicación"
  - "[ ] Vía C: check determinista de remote-URL"
  - "[ ] Release con lo aprobado"
external:
  - null
decision_log:
  - "2026-10-25T03:00:00+02:00 · operador (J. Sebastián G. Sánchez) · Ítem creado por orden del operador tras el primer despliegue real de la semilla (gsc-server, 2026-10-25, modo parasitar): la resolución del bloqueo de credenciales quedó como conocimiento oral de sesión y el corpus no la contiene — cada destino publicador la redescubrirá o la resolverá distinto. Este ítem institucionaliza la capa de credenciales de publicación."
  - "2026-10-25T03:00:00+02:00 · zcode · Ítem hermanado con SEED-020 (vía ascendente de issues): SEED-020 institucionaliza el CANAL (destino → issue oficial); este ítem es contenido real de ese canal. El caso origen es OPS-005 de gsc-server."
---

## Contexto

**Informe de campo** (destino: `mcp-google-search-console` / gsc-server, primer despliegue real de la semilla — 2026-10-25, modo parasitar, semilla v2.0.0):

### La idea

Al publicar un repo destino por HTTPS, el agente necesita credenciales. La forma correcta de entregarlas y almacenarlas debe estar **normada en el corpus**, no improvisada por sesión: qué helper usar por entorno, dónde vive el secreto en reposo, con qué permisos y caducidad, y cómo evitar las fugas clásicas (token en la URL del remoto).

### Lo que pasó (cronología exacta de OPS-005)

1. El operador entregó al agente una **PAT de GitHub** (expiry 7 días; scopes: Contents/Issues/PRs/Workflows RW + Metadata/Actions read-only) para publicar el destino.
2. Al publicar por HTTPS, el agente encontró que el `~/.gitconfig` **global** del entorno declara `credential.helper = manager` (Git Credential Manager, que viene con **Git para Windows**) — pero en el **WSL kali** el binario `git-credential-manager` no existe: toda operación HTTPS intenta invocar un helper inexistente y avisa/fracasa.
3. El agente resolvió ad-hoc: helper **vacío de reset** + `store` a nivel **local del repo** (`credential.helper =` resetea la lista acumulada; luego `credential.helper = store`), token en `~/.git-credentials` (plaintext, chmod 600, fuera del repo), URL de `origin` limpia (sin token embebido), PAT con scopes mínimos y expiry corto.
4. Publicación exitosa (main + develop con tracking, cierre de OPS-005 con evidencia). El `.gitconfig` global no se tocó.

### El problema (3 aristas)

1. **Divergencia de helpers entre entornos**: Windows trae GCM de serie; WSL/Linux no. La directiva `credential.helper` es **acumulativa** — se ejecutan todos en orden, no hay "ganador" — así que el override local exige el truco del helper vacío primero. **El corpus no documenta ni la semántica ni el truco.**
2. **Almacén sin estándar**: `store` = plaintext en disco (mitigado con chmod 600 + PAT de expiry corto, pero es una decisión de riesgo sin norma). Alternativas: `cache` (memoria), `libsecret` (llavero Linux), GCM para Linux, variables de entorno. `secretos.md` normariza el **transporte** (el secreto viaja solo a su servicio) pero **no el almacén en reposo**.
3. **URL del remoto**: la variante `https://TOKEN@github.com/...` incrusta el secreto en `.git/config` — fuga clásica que el agente evitó ad-hoc y **nada detecta mecánicamente** hoy.

## Clasificación y protocolo

- **Clase de problema**: `agente` (ley 11) — el trabajo al reclamar es documental sobre el corpus.
- **Protocolo aplicado**: `secretos.md` rige el transporte (un secreto → un servicio); este ítem extiende su alcance al **almacén en reposo** y al flujo de publicación.
- **Umbrales especializados**: ninguno — defaults canónicos.

## Notas

- Vía ascendente: ítem hermanado con **SEED-020** (canal destino → issue oficial). Este ítem es el primer contenido real de ese canal.
- El token del caso origin se referenció siempre como `<REDACTED>` (principio 10) — en este ítem no hay ni habrá valores.
- El helper roto del entorno (`credential-manager` global) no se tocó: el override fue solo local del repo. Si el operador instala GCM en WSL, otros proyectos lo recuperan.
- Recursos: ninguno (trabajo documental al reclamar).

## Evidencia (al cierre)

- Pendiente de ejecución — el ítem queda **abierto y sin reclamar** a la espera del debate del operador (las 3 decisiones de `acceptance`).
