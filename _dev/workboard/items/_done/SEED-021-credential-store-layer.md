---
id: SEED-021
title: "Estandarizar la capa de credenciales de publicación (git credential helpers, Windows vs Linux)"
status: done
priority: P1
class: agente
regimen: produccion
timebox: null
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-25T03:00:00+02:00
updated_at: 2026-11-15T14:10:00+01:00
closed_at: 2026-11-15T14:10:00+01:00
closed_reason: "Completado: debate resuelto (GCM canónico / hook 100% + verificador / GCM en WSL), vías A/B/C ejecutadas y release v2.2.0 con verificadores en verde."
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
  - "[x] Debate del operador (las 3 decisiones de arriba) — resuelto 2026-11-15: GCM canónico / hook pre-commit 100% + check en verificador / instalar GCM en WSL"
  - "[x] Vía A: secretos.md §almacén"
  - "[x] Vía B: runbook de publicación"
  - "[x] Vía C: check determinista de remote-URL (hook pre-commit + réplica en verify-workboard; réplica completa en verify-mount → SEED-022)"
  - "[x] Release con lo aprobado (v2.2.0)"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-33 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-10-25T03:00:00+02:00 · operador (J. Sebastián G. Sánchez) · Ítem creado por orden del operador tras el primer despliegue real de la semilla (gsc-server, 2026-10-25, modo parasitar): la resolución del bloqueo de credenciales quedó como conocimiento oral de sesión y el corpus no la contiene — cada destino publicador la redescubrirá o la resolverá distinto. Este ítem institucionaliza la capa de credenciales de publicación."
  - "2026-10-25T03:00:00+02:00 · zcode · Ítem hermanado con SEED-020 (vía ascendente de issues): SEED-020 institucionaliza el CANAL (destino → issue oficial); este ítem es contenido real de ese canal. El caso origen es OPS-005 de gsc-server."
  - "2026-11-15T13:27:08+01:00 · operador (J. Sebastián G. Sánchez) · Debate resuelto — DECISIÓN 1: almacén canónico = llavero (GCM: Credential Manager/DPAPI en Windows, gnome-keyring/libsecret en Linux), token cifrado en reposo y accesible solo vía el helper; el store plano (`~/.git-credentials` chmod 600, PAT expiry corto) queda documentado como fallback explícito para destinos donde no se pueda instalar llavero, nunca como default. DECISIÓN 2: el check de remote-URL con credenciales embebidas es HOOK pre-commit bloqueante al 100% de los destinos (vía core.hooksPath de la semilla), y el mismo check se replica en el verificador mecánico para montajes parciales/destinos sin hook. El protocolo normará evitar el token embebido en la URL a toda costa ( remote set-url con credenciales = comportamiento prohibido). DECISIÓN 3: la divergencia Windows/Linux se ELIMINA instalando GCM en WSL como paso del montaje — la semilla la despliega un agente con capacidad de instalar, no es obstáculo."
  - "2026-11-15T13:27:08+01:00 · operador (J. Sebastián G. Sánchez) · Línea futura registrada (fuera del alcance de este ítem): añadir capas de seguridad adicionales sobre el token — de red (protección cuando el token viaja) y de autenticación (MFA u otros medios para acceder al token vía sesión del llavero) — y generalizar el almacén normado más allá del PAT de GitHub a otros tokens/credenciales. Las vías A/B/C deberán redactarse dejando hueco explícito para esta evolución; su diseño será ítem propio."
  - "2026-11-15T13:27:08+01:00 · zcode · Registro por encargo del operador: decisiones incorporadas al decision_log; status permanece open, sin claim. Subtarea «Debate del operador» queda marcada [x]; vías A/B/C y release siguen [ ]."
  - "2026-11-15T13:40:00+01:00 · zcode · Claim del ítem por encargo del operador («Adelante») y ejecución de las vías A/B/C."
  - "2026-11-15T14:05:00+01:00 · zcode · [via-ascendente] no-asciende — el informe de campo (OPS-005, gsc-server) ya vive como ítem del propio repo upstream (este ítem): abrir issue duplicaría el workboard del corpus. Disposición registrada en la entrega de cierre; el operador puede anularla abriendo la issue vía canal."
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

Cierre 2026-11-15 — ejecutado por zcode por orden del operador («Adelante»), con las decisiones del debate del mismo día.

- **Vía A** ✔ — `fase-6-dominios/protocolos/secretos.md`: sección nueva «El almacén: git credential helpers» (semántica acumulativa + truco del reset vacío, matriz por entorno con GCM canónico y `store` como fallback documentado, prohibición absoluta de token en la URL del remote, auditoría de destino); tabla de defaults y antipatrones ampliadas.
- **Vía B** ✔ — `fase-6-dominios/runbooks/publicar-repo-destino-https.md` (nuevo, v1.0.0, status reviewed): flujo completo con verificación, resolución de problemas y rollback; runbook del canal actualizado con la referencia normativa.
- **Vía C** ✔ — `fase-5-workboard/hooks/pre-commit` paso 5: bloquea commits con credenciales embebidas en la URL de remotos (probado en repo temporal: detecta y enmascara; URL limpia pasa). Réplica en `fase-5-workboard/verify-workboard.mjs` (nuevo bloque antes del informe). La réplica completa en el verificador de montaje (`verify-mount.mjs`) queda en SEED-022.
- **Release** ✔ — CHANGELOG `[2.2.0] — 2026-11-15` + tag; `verify-workboard.mjs` en verde sobre `_dev/workboard` (2 activos, 20 archivados, sin violaciones).
- **Principio 10**: ningún valor de token en esta entrega; todos referenciados por nombre o `<REDACTED>`.
- **Verificaciones ejecutadas**: `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → OK; prueba mecánica del check de remotos en fixture temporal → OK.
- **Nota**: trabajo documental directo en la entrega del repo (sin PR ni worktree) — la semilla no mantiene rama `develop` y la entrega directa está justificada aquí como documental (convención §4 del README del workboard).
