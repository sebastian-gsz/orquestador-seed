---
title: "Publicar un repo destino por HTTPS — git credential helpers"
type: runbook
document_status: reviewed
system: "git (HTTPS) + almacén de credenciales del entorno (GCM/llavero)"
environment: "cualquier destino que publica a un forja remota (GitHub, GitLab…)"
version: "1.0.0"
last_reviewed: 2026-11-15
owner: "operador"
---

# Publicar un repo destino por HTTPS — git credential helpers

## Objetivo

Publicar (push) el repo de un destino a su forja remota por HTTPS dejando el token **fuera del repo, del `.git/config` y de la URL de los remotes**, almacenado en el llavero del entorno, con scopes mínimos y expiry corto. Generaliza el flujo resuelto ad-hoc en OPS-005 de gsc-server (origen de SEED-021).

## Alcance y límites

- Cubre la preparación del almacén de credenciales del entorno, la configuración del repo destino y la publicación de ramas con tracking. No cubre la creación del token GitHub para el canal de issues (runbook «Crear la credencial del canal») ni el contenido del repo.
- Requiere una PAT entregada por el operador (o creada en una cuenta dedicada) con **scopes mínimos** para la operación y **expiry corto** (7–30 días). La caducidad es el control de riesgo; la rotación forma parte de este runbook.
- Condición de parada: si no hay credencial con scopes suficientes ni posibilidad de obtenerla, no improvisar alternativas (nada de tokens en URLs, `.env` commiteados ni helpers exóticos) — escalar al operador.

## Requisitos

- `git` ≥ 2.9 (protocolo `git credential`).
- **Llavero disponible** (canónico): GCM instalado — de serie en Windows; en WSL/Linux instalarlo es paso del montaje (`sudo apt install git-credential-manager` o el paquete oficial; en contenedores sin dbus puede no ser posible → fallback del paso 2b, documentado en el ítem).
- PAT del forja con scopes mínimos y expiry corto; se referencia **solo por nombre** («PAT de publicación»), jamás su valor en comandos registrados, ítems ni bitácoras (principio 10).
- Entender que `credential.helper` es **acumulativa** (semántica y truco del reset vacío: protocolo `secretos` §El almacén).

## Pasos

1. **Comprobar el helper activo** del entorno: `git config --get-all credential.helper`. En Windows debe aparecer `manager`; en WSL/Linux, GCM instalado en el montaje. Si la lista acumulada trae helpers heredados que no existen en el entorno (p. ej. `manager` global heredado de Git para Windows sin el binario en WSL), el repo destino necesita el reset del paso 3.
2. **Entregar el token al almacén (llavero), una vez** — no por repo:

       printf 'protocol=https\nhost=github.com\nusername=<usuario-publicador>\npassword=<VALOR_DEL_TOKEN>\n' | git credential approve

   (Ajusta `host` a la forja real. Con GCM el token queda cifrado en el llavero del sistema.)
   - **2b. Fallback documentado** (solo si el destino no puede tener llavero): helper `store` a nivel del repo destino (paso 3 con `store` en vez de llavero); el token duerme en `~/.git-credentials` en claro con `chmod 600`, fuera del repo. Registrar la excepción en el ítem del montaje. **Nunca como default.**
3. **Configurar el repo destino** (solo si su lista acumulada de helpers es problemática): reset vacío + helper deseado a nivel local:

       git config --local credential.helper ""
       git config --local --add credential.helper <llavero-del-entorno|store>

4. **Añadir el remote LIMPIO — sin credenciales, a toda costa** (`https://TOKEN@...` está prohibido y el hook pre-commit lo bloquea):

       git remote add origin https://github.com/OWNER/REPO.git
       # o, si ya existe con token embebido, corregirlo:
       git remote set-url origin https://github.com/OWNER/REPO.git

5. **Publicar con tracking** — la primera vez, el helper entrega el token bajo demanda:

       git push -u origin main
       git push -u origin develop     # si el destino usa rama de integración (§5.3)

6. **Registrar la evidencia sin el secreto**: en el ítem correspondiente, referencia por nombre («PAT de publicación»), su fecha de expiry, el destino publicado y la verificación del paso siguiente.

## Verificación

- `git remote -v` → ninguna URL con `@` antes del host (remotos limpios).
- `git config --get-all credential.helper` → la lista esperada (entender el orden; sin helpers inexistentes).
- `git ls-remote origin HEAD` → responde sin pedir credencial interactiva (el almacén funciona).
- `grep -r <prefijo-del-token> <repo>` → ninguna coincidencia; el token no filtró al repo.
- `node verify-workboard.mjs <workboard>` → código 0.

## Problemas y resolución

| Síntoma | Causa verificada | Resolución |
|---|---|---|
| Aviso/fracaso invocando un helper inexistente (`git-credential-manager: not found`) | `credential.helper = manager` global heredado de Windows sin el binario en WSL | Reset local del paso 3 (helper vacío + helper real) o instalar GCM en WSL (preferente: es paso del montaje) |
| `git push` pide credencial interactivamente a pesar del almacén | El token no está para ese `host`/`username`, o el helper que responde no lo tiene | Repetir el paso 2 con el mismo `host` que consulta git; revisar la lista acumulada del paso 1 |
| El token acaba embebido en la URL del remote | Improvisación previa a este runbook | `git remote set-url` limpio (paso 4), rotar el token si tocó logs o backups, y revisar el historial del repo por si la URL quedó registrada |
| 403/404 al publicar | PAT sin scopes de push o sin acceso al repo | Regenerar el token con scopes mínimos suficientes; re-entregar al almacén (paso 2) |
| 401 de golpe tras días | El expiry corto del token venció (diseño) | Rotar: nuevo token (scopes mínimos), paso 2, y actualizar la fecha de expiry en la evidencia |

## Rollback

1. **Token comprometido o sospecha de fuga**: revocarlo en la forja inmediatamente, re-entregar uno nuevo al almacén (paso 2) y auditar los destinos publicados con la auditoría del protocolo `secretos` (remotos limpios, sin coincidencias del prefijo).
2. **Configuración local rota**: `git config --local --unset-all credential.helper` y rehacer el paso 3; el `--local` garantiza que el `~/.gitconfig` global no se toca.

## Seguridad

- El token vive únicamente en el llavero del entorno (fallback `store`: `~/.git-credentials`, chmod 600, fuera del repo) y viaja solo en las peticiones HTTPS a su forja (aislamiento por servicio).
- Jamás en la URL de un remote, en el `.git/config`, en variables de entorno de sesión compartida ni en logs — el hook pre-commit bloquea remotos con credenciales.
- La evidencia referencia el token por nombre, con expiry y verificación — nunca su valor.

## Trazabilidad

- Contratos relacionados: protocolo `secretos` §El almacén: git credential helpers · runbook «Crear la credencial del canal de issues» · workboard README (convención ítem → rama → PR).
- Workboard/autorización: SEED-021 (aprobado por el operador, 2026-11-15).
- Fuente o validación: informe de campo OPS-005 (gsc-server) + verificaciones de este runbook en verde.
