---
title: "Crear la credencial del canal de issues — GitHub"
type: runbook
document_status: reviewed
system: "GitHub (fine-grained PAT) + almacén de credenciales de git"
environment: "cualquier destino montado con el harness"
version: "1.1.0"
last_reviewed: 2026-10-31
owner: "operador"
---

# Crear la credencial del canal de issues — GitHub

## Objetivo

Dejar el canal ascendente de issues operativo: una PAT de GitHub con permiso de escritura de issues sobre el repo oficial del corpus, guardada **fuera del repositorio** en el almacén de credenciales de git, lista para que `open-issue.mjs` la consuma sin que el token aparezca jamás en archivos, ítems o documentación.

## Alcance y límites

- Cubre la creación del token, su almacenamiento y su verificación. No cubre la publicación del repo destino (runbook de publicación) ni el contenido de las issues.
- La identidad del canal es la **cuenta secundaria** que el operador dedica al harness; el token se crea dentro de ella.
- Condición de parada: si el operador decide no adoptar el canal (opt-out), cancelar el ítem del canal con motivo y dejar `canal.md` con `upstream: null` — no crear credencial alguna.

## Requisitos

- Acceso de navegación a GitHub con la cuenta secundaria del canal (email propio, 2FA, sin claves SSH ni escritura en ningún repo).
- `git` ≥ 2.9 (protocolo `git credential`) y un helper configurado. Canónico: el llavero del entorno vía GCM (protocolo `secretos` §El almacén: git credential helpers — semántica acumulativa, truco del reset vacío, matriz por entorno y fallback `store` documentado). Ver el activo con `git config --get-all credential.helper`.
- El ítem del canal en el workboard (`canal.md` con `item` asignado) y el repo upstream declarado por el operador, con su visibilidad (público/privado).
- Referencias al secreto **solo por nombre de variable**; su valor jamás entra en comandos registrados, ítems ni bitácoras (principio 10).

## Pasos

1. **Identificar el repo upstream**: es el repo oficial del corpus desde el que se montó esta semilla — el operador lo declara; debe coincidir con el que se escribirá en `canal.md` (`OWNER/REPO`). Anota si es **público o privado**: decide el tipo de token.
2. **Crear el token** (con la sesión de la cuenta secundaria; GitHub → Settings → Developer settings → Personal access tokens). Los permisos viven en el token, no en la cuenta: la cuenta debe quedar sin escritura en ningún repo.
   - **Upstream público** → token **classic** con el scope único `public_repo`: crea issues en cualquier repo público. Sin `repo`, sin `workflow`, sin ninguna otra casilla.
   - **Upstream privado** → añade antes la cuenta secundaria como **colaboradora con rol Triage** en el repo (gestiona issues, sin push de código) y crea un token **classic** con scope `repo`: el techo real es el rol de la cuenta, que no tiene escritura en ningún sitio. (Un fine-grained PAT solo puede apuntar a repos propios o de organizaciones donde la cuenta sea miembro — no a repos de otro usuario; si el upstream privado migra a una organización, usa fine-grained con *Issues: Read and write* sobre ese único repo.)
   - *Expiration*: 7–30 días según la rotación que tolere el operador. La caducidad corta es el control de riesgo del almacén; la rotación forma parte de este runbook.
   - *Nota multi-destino*: el almacén de git guarda una credencial por host (`protocol+host`), no por repo — un solo token por máquina cubre todos los upstreams públicos de los destinos que aloje; cada destino apunta al suyo en su `canal.md`.
3. **Guardarla fuera del repo, en el almacén de credenciales de git** (el helper la escribe en `~/.git-credentials` o el llavero del sistema — nunca en archivos del repo):

       printf 'protocol=https\nhost=github.com\nusername=<cuenta-del-canal>\npassword=<VALOR_DEL_TOKEN>\n' | git credential approve

4. **Cerrar el ítem del canal en la misma entrega**: escribir en `canal.md` el `upstream: OWNER/REPO` (activo el canal), registrar la evidencia sin el valor del token, limpiar el claim, mover a `items/_done/` y quitar de `INDEX.md`.

## Verificación

- `node open-issue.mjs --check` → «canal operativo: OWNER/REPO (credencial presente para github.com)». Cualquier otra salida es fallo: revisar el paso 3.
- `node verify-workboard.mjs` → código 0 (coherencia canal.md ↔ ítem, §3.12).
- `grep -r <prefijo-del-token> <repo>` → ninguna coincidencia (el token no filtró al repo; solo el cuerpo del token, jamás su nombre de variable).

## Problemas y resolución

| Síntoma | Causa verificada | Resolución |
|---|---|---|
| `open-issue.mjs` responde «sin credencial para github.com» | El helper activo no tenía el secreto o se guardó con otro host | Repetir el paso 3 con el mismo `host` que consulta el script (`github.com` salvo `OPEN_ISSUE_HOST`) |
| La API responde 403/404 | Token sin scope de Issues o sin acceso al repo upstream | Regenerar el token con el paso 2; comprobar scope y visibilidad del upstream |
| La API responde 401 de golpe tras días | El expiry corto del token venció (diseño) | Rotar: repetir los pasos 2–3; la fecha de rotación vive en la evidencia del ítem del canal |
| `git credential approve` no persiste nada | Helper sin escribir o `credential.helper` vacío en ese repo | Configurar helper (p. ej. `git config credential.helper store` a nivel de usuario) y repetir |
| El picker de fine-grained no muestra el upstream | Un fine-grained PAT no apunta a repos de otro usuario (solo propios u organizaciones) | Usar el token classic del paso 2 según la visibilidad del upstream |

## Rollback

1. El token quedó comprometido o se quiere rotar: revocarlo en GitHub (Developer settings) y repetir los pasos 2–3 con uno nuevo.
2. El operador desactiva el canal: cancelar el ítem del canal con motivo, dejar `canal.md` con `upstream: null` y revocar el token (verificación: `open-issue.mjs` falla con «canal inactivo»).

## Seguridad

- El token vive únicamente en el almacén de credenciales de git de la máquina (fuera del repo) y viaja únicamente en peticiones a `github.com` (aislamiento por servicio, principio 10).
- Nunca en variables de entorno de sesión compartida, en el `.git/config` del repo, ni en la URL de ningún remote.
- La evidencia de cierre referencia el token por nombre («PAT del canal»), con la fecha de expiry y el comando de verificación — nunca su valor.

## Trazabilidad

- Contratos relacionados: `docs/workboard/ARCHITECTURE.md` §3.11–§3.12 · protocolo `agente` (canal ascendente) · SEED §6 regla 7.
- Workboard/autorización: ítem «Configurar el canal de issues ascendentes» (creado por el montaje, F5).
- Fuente o validación: `open-issue.mjs --check` + `verify-workboard.mjs` en verde.
