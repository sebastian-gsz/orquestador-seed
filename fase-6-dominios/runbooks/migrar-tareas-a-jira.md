---
title: "Migrar tareas del workboard a Jira — MCP de Jira"
type: runbook
document_status: reviewed
system: "Jira Cloud (MCP de Jira) + workboard del corpus"
environment: "sebastian-gsz.atlassian.net · proyecto «orquestador-seed» (key SEED, por crear)"
version: "1.2.0"
last_reviewed: 2026-11-15
owner: "operador"
---

# Migrar tareas del workboard a Jira — MCP de Jira

## Objetivo

Migrar las **tareas** del workboard del corpus al proyecto Jira del operador, manteniendo la trazabilidad bidireccional y sin perder ninguna garantía mecánica del workboard. La prueba final se ejecutó el 2026-11-15 en el proyecto existente **ZCJ** (28 issues importadas, 25 `Finalizada`, reconciliadas por lectura) por indicación del operador; un proyecto dedicado «orquestador-seed» queda como opción futura. Las bitácoras y la documentación migrarán más adelante a **Compass** (IDEA-3, parking lot).

## Alcance y límites

- Cubre el mapeo de campos, la matriz de estados, el procedimiento de migración/sincronización y la **activación del modo Jira** (SEED-026). No cubre bitácoras ni documentación (Compass, IDEA-3).
- **Dirección resuelta (SEED-026)**: el workboard local es un andamio temporal con presión de migración constante; **Jira es el destino** de las tareas. Tras migrar, el tablón queda como punto de reglas maestras (decisiones §0.9, ARCHITECTURE §4.7).
- La escritura en Jira se hace por el **MCP de Jira** (herramientas `createJiraIssue`, `editJiraIssue`, `transitionJiraIssue`); la verificación, por **lectura** de la issue migrada (regla §5.1.3 del mapa maestro: toda operación con efecto fuera del repo termina con lectura de verificación del estado resultante en la misma entrega).

## Requisitos

- MCP de Jira conectado con acceso de lectura-escritura al sitio (`sebastian-gsz.atlassian.net`, cloudId en la evidencia del ítem SEED-023).
- Proyecto Jira accesible por MCP (en la prueba final de 2026-11-15 se usó el proyecto existente `ZCJ`; el dedicado `SEED` queda como opción futura).
- El ítem del workboard debe estar en estado válido (`open`/`in_progress`/`blocked`) y pasar `verify-workboard.mjs` — **no se migra un ítem en rojo**.
- Sin secretos jamás (principio 10): el contenido de las issues no incluye tokens, PATs ni valores de credenciales; referencias por nombre.

## Mapeo de campos (workboard → Jira)

| Workboard (front-matter / cuerpo) | Jira | Notas |
|---|---|---|
| `id` (`SEED-021`) | Issue key (`SEED-###`) | Convención: pedir a Jira la key con el mismo número del ID local si está libre; si no, registrar el mapeo en `external` y en la descripción de la issue |
| `title` | `summary` | Literal |
| `status` | Estado del flujo | Ver matriz abajo |
| `priority` (`P0..P3`) | `priority` | `P0→Highest, P1→High, P2→Medium, P3→Low` |
| `class` (`datos\|red\|cómputo\|agente`) | Label `class:<valor>` | Más un label `regimen:<produccion\|exploracion>` |
| `node` | Componente del proyecto | Un componente por nodo (`fase-5-workboard`, `fase-6-dominios`, …) |
| `touches` | Sección «Touches» de la descripción | Lista literal — el alcance colateral se sigue normando en el ítem local |
| `acceptance` | Sección «Criterios de aceptación» de la descripción | Lista literal |
| `subtasks` | Sub-tasks de la issue | Mismo texto; el `[x]` local ↔ resolución de la sub-task |
| `decision_log` | Comentarios de la issue (uno por entrada) | Formato: `fecha · autor · texto` literal |
| `external` (PRs, issues upstream) | `links` / campo remoto de la issue | Y a la inversa: la issue SEED-### se enlaza en `external` del ítem local |
| `blocked_by` / `blocks` | Enlaces «is blocked by / blocks» | Solo dependencias reales, misma regla que §4.4 |
| `parent` | Issue padre (epic/sub-task según jerarquía) | Literal |
| `claimed_by` / `claimed_at` | `assignee` + label `claimed:<fecha>` | El claim local prevalece; Jira lo refleja |
| `INDEX.md` (fila) | Tablero Kanban del proyecto | El tablero es la proyección; el verificador local no lee Jira |
| Release de la semilla (tag `vX.Y.Z`) | `fixVersion` con el mismo nombre | Las versiones del proyecto siguen el CHANGELOG |
| Informe de campo (sección) | Descripción + label `informe-de-campo` | La disposición del operador (§3.11) se aplica igual: issue upstream enlazada o `[via-ascendente] no-asciende` |

### Matriz de estados

| Workboard | Jira (To Do → In Progress → Done) |
|---|---|
| `open` | To Do |
| `in_progress` | In Progress |
| `blocked` | In Progress + label `blocked` + link de bloqueo (Jira no tiene estado blocked nativo; el motivo va en comentario) |
| `done` | Done (cierre local y cierre Jira **en la misma entrega**) |
| `cancelled` | Done + label `cancelled` + `closed_reason` en comentario |

La coherencia de esta matriz se mecaniza con `verify-jira.mjs` (SEED-027, ARCHITECTURE §4.8): el **cierre es lo estricto** (issue Finalizada con ítem activo en local, o ítem activo sin issue, = violación que bloquea el commit); los estados intermedios dependen del flujo del proyecto — un team-managed con solo To Do/Done (como ZCJ) no tiene «In Progress», así que su deriva intermedia es **aviso**, no violación.

## Pasos

1. **Montar el proyecto** (ejecutado en la prueba final con `ZCJ` por decisión del operador; un proyecto dedicado repite estos pasos): crear proyecto y componentes por nodo; crear las versiones del CHANGELOG como `fixVersion`; dejar el tablero Kanban por defecto.
2. **Preparar el ítem local**: verificar con `verify-workboard.mjs`; añadir en `external` (o Notas) la referencia cruzada que se creará.
3. **Crear la issue** vía MCP (`createJiraIssue`): aplicar el mapeo de la tabla; descripción = contexto del ítem (sin secretos); labels según `class`/`regimen`; `fixVersion` = release vigente.
4. **Crear sub-tasks** y comentarios del `decision_log` (uno por entrada).
5. **Enlazar bidireccionalmente**: `external` del ítem local ← URL de la issue; descripción de la issue → ruta del archivo del ítem y commit de referencia.
6. **Reconciliar (obligatorio, §5.1.3)**: leer la issue creada (`getJiraIssue`) y comparar campo a campo contra el mapeo; la lectura forma parte de la evidencia del ítem.
7. **Sincronizar en cada entrega** que toque el ítem: mismo commit actualiza el ítem local y la issue (EVAL-5 aplica a las dos superficies). Mecanizado (SEED-027): `verify-jira.mjs` comprueba la coherencia y el hook pre-commit (paso 7) bloquea la deriva de cierre cuando hay credencial en el almacén de git; sin credencial o sin red, modo degradado — avisa y no bloquea.

## Activación del modo Jira (SEED-026)

Cuando la migración de las tareas activas está completa y reconciliada, se invierte la dualidad — el workboard deja de ser la fuente y queda como punto de reglas maestras:

1. **Archivar los ítems locales** ya migrados: `done` con `closed_at` y movimiento a `items/_done/` en la misma entrega (no se borra el histórico: es la trazabilidad previa a Jira).
2. **Congelar el tablón**: reescribir `INDEX.md` sin filas de ítems, con la sección **«Reglas maestras»** (los contratos del corpus se siguen sí o sí) y el destino Jira referenciado; sin la línea «Workboard local temporal».
3. **Declarar el modo**: `MODO.md` con `modo: jira` y `jira: <site> / <proyecto>` (p. ej. `sebastian-gsz.atlassian.net / ZCJ`).
4. **Verificar**: `verify-workboard.mjs` debe salir en verde **en modo jira** (sin ítems activos, INDEX congelado); el hook pre-commit bloqueará a partir de aquí cualquier ítem nuevo en `items/`.
5. **Commit en la misma entrega**: el cambio de modo es una entrega completa (ítems archivados + INDEX + MODO.md + verificador en verde).

## Verificación

- `getJiraIssue` de cada issue migrada → campos idénticos al mapeo (evidencia de la reconciliación).
- `node fase-5-workboard/verify-jira.mjs _dev/workboard` → sin deriva (código 0; degradado con aviso si no hay credencial en el almacén).
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
- `grep -ri <prefijo-de-token>` sobre los cuerpos migrados → ninguna coincidencia (principio 10).
- El tablero Kanban muestra exactamente los ítems activos del `INDEX.md` local (proyección, no fuente).

## Problemas y resolución

| Síntoma | Causa verificada | Resolución |
|---|---|---|
| JQL ilimitado rechazado (400) | La instancia no permite búsquedas sin restricción | Añadir siempre una cláusula (`project = SEED AND …`) |
| Key duplicada (`SEED-###` ya existe) | Otra issue usó el número | Mantener keys distintas y registrar el mapeo id↔key en `external` + descripción |
| La issue y el ítem local divergen | Sincronización fuera de la misma entrega | Reconciliar con lectura de Jira, corregir la superficie atrasada y registrar el defecto en `decision_log` (auto-mejora §5) |
| El MCP no ve el proyecto | Falta de permiso o proyecto no creado | Verificar permisos del token MCP; completar el paso 1 |

## Rollback

1. **Desactivar la superficie Jira**: cerrar/duplicar como archivadas las issues migradas y dejar el workboard local como única fuente (ya lo es por diseño) — revertir es borrar la proyección, no la fuente.
2. **Issue errónea**: borrarla en Jira y registrar el error en el `decision_log` del ítem local; jamás «parchear» divergiendo del mapeo.

## Seguridad

- Sin secretos en issues, comentarios ni descripciones (principio 10); los PATs viven en el almacén de credenciales de git (protocolo `secretos` §El almacén).
- El MCP de Jira actúa con la identidad del operador: toda escritura es atribuible y reversible; el audit log de Atlassian es la evidencia externa.

## Trazabilidad

- Contratos relacionados: mapa maestro §5.1 (reglas anti-deriva: reconciliación de superficies externas) · contrato del workboard §3.11–§3.12 · runbook «Crear la credencial del canal de issues» (el canal ascendente sigue siendo el flujo destino→corpus; Jira es la superficie de tareas del corpus, no el canal).
- Workboard/autorización: SEED-023 (aprobado por el operador, 2026-11-15 — diseño sin creación en Jira; montaje del proyecto pendiente de aprobación expresa).
- Fuente o validación: exploración MCP de la instancia (6 proyectos existentes, ninguno del corpus) + `verify-workboard.mjs` en verde.
