---
title: ARCHITECTURE.md — Dominio Workboard
Rol: Coordinador de trabajo, claims y trazabilidad
Objetivo: Definir el contrato operativo único para registrar, asignar, bloquear, ejecutar y cerrar trabajo del repositorio.
Nivel: Rama raíz documental
Estado: contract
Padre: ../ARCHITECTURE.md
Lectura obligatoria: SÍ — antes de crear, reclamar, modificar, bloquear o cerrar un ítem.
---

<br>**↑ Padre**: [docs/ARCHITECTURE.md](../ARCHITECTURE.md) — mapa maestro y leyes universales.<br/>

## 1. Alcance y autoridad

`docs/workboard/` es la única fuente de verdad para el ciclo de vida del trabajo:

- tareas y subtareas;
- prioridades;
- claims;
- bloqueos y dependencias;
- criterios de aceptación;
- decisiones de ejecución;
- evidencias y cierre.

El workboard no sustituye a los contratos `ARCHITECTURE.md`. La arquitectura documenta reglas, límites y comportamiento aprobado; el workboard documenta lo que se decide hacer, quién lo ejecuta, qué impide avanzar y cómo se verifica el resultado.

Ningún agente puede crear, reclamar, ejecutar o cerrar trabajo basándose únicamente en una conversación, un comentario aislado o una lista externa.

## 2. Mapa del nodo

| Archivo o directorio | Responsabilidad |
|---|---|
| `README.md` | Procedimiento operativo resumido para agentes y humanos. |
| `SCHEMA.md` | Contrato de campos y formato de cada ítem. |
| `INDEX.md` | Índice sincronizado de ítems `open`, `in_progress` y `blocked`. |
| `items/ID-slug.md` | Ítem primario activo, uno por unidad de trabajo. |
| `items/_done/` | Ítems terminados o cancelados, con evidencia y resolución. |
| `verify-workboard.mjs` | Verificación mecánica de la correspondencia `items/ ↔ INDEX.md ↔ _done/`, los campos del SCHEMA (§3.3 y §7.6), los informes de campo (§3.11) y el canal ascendente (§3.12). Ejecutar antes de cerrar cualquier ítem y en CI. |
| `hooks/pre-commit` | **Capa determinista**: bloquea en el commit lo que debe pasar siempre — workboard inválido, `worktrees/`/`.env`, secretos obvios. Opcional, con `git config core.hooksPath docs/workboard/hooks` (ver README). |
| `canal.md` | Estado del **canal ascendente** (§3.12): `item` (ID del ítem del canal) y `upstream` (repo oficial del corpus). Lo crea el montaje; el cierre del ítem del canal escribe `upstream` y activa el canal. |
| `open-issue.mjs` | Abre la issue del informe de campo en el repo upstream (canal activo), leyendo la credencial del almacén de git — jamás contiene ni imprime el token. |

Un ítem cerrado no se borra: se mueve a `items/_done/`. La eliminación física solo está permitida para corregir un duplicado, y debe dejar una nota de decisión en el ítem conservado.

## 3. Reglas contractuales

1. Cada ítem tiene un ID estable, un nodo afectado, un responsable de claim, criterios verificables y alcance explícito.
2. Crear, modificar, reclamar, bloquear, desbloquear, cancelar, cerrar o mover un ítem exige actualizar en la misma entrega todos los artefactos afectados: el archivo del ítem, `INDEX.md` cuando corresponda y la evidencia/decisión del cuerpo.
3. `INDEX.md` debe contener exactamente todos los ítems activos y ningún ítem de `_done/`.
4. Cada dependencia `blocks` o `blocked_by` debe representar una dependencia real. Las relaciones informativas se documentan en el cuerpo, nunca en esos campos.
5. Una tarea no puede marcarse `done` si falta un criterio de aceptación, una evidencia verificable o la actualización de los contratos afectados por el cambio.
6. Una tarea `cancelled` conserva el motivo y la decisión que la canceló; no se reutiliza su ID.
7. El contenido del workboard no puede introducir cambios en leyes, alcance, precedencia o clasificación de los nodos. Si una tarea contradice un contrato superior, se corrige o cancela; no se relaja la arquitectura para hacerla posible.
8. Las tareas futuras pueden permanecer abiertas si tienen propósito, alcance y criterios válidos. No se convierten en estado dentro de un `ARCHITECTURE.md`.
9. Los secretos, credenciales, tokens y respuestas sensibles no se almacenan en ítems, evidencias ni logs del workboard.
10. **Requisitos mecanizados**: una obligación que deba cumplirse **siempre** se implementa como hook determinista (capa de git), no solo como regla consultiva. Las reglas de este contrato guían (~80% de cumplimiento esperado); los hooks imponen (100%). El operador decide qué se mecaniza instalando `core.hooksPath`.
11. **Informe de campo (hallazgo sobre el harness)**: un ítem cuyo cuerpo contiene una sección `## Informe de campo` documenta un defecto del harness, no del nodo local. No puede cerrarse sin la disposición del operador registrada en la misma entrega: el enlace a la issue ascendida en `external`, o una entrada de `decision_log` con la etiqueta `[via-ascendente] no-asciende` y su justificación. El refuerzo local de la misma entrega no sustituye a la disposición. `verify-workboard.mjs` impone esta regla.
12. **Canal ascendente de issues (activo/inactivo)**: el montaje deja en el workboard el ítem «Configurar el canal de issues ascendentes» y `canal.md` con `item: <ID>` e `upstream: null`. Cerrar ese ítem exige, en la misma entrega, escribir en `canal.md` el repo upstream (`OWNER/REPO`) — acto que **activa** el canal: `open-issue.mjs` pasa a abrir issues en él. Cancelar el ítem (opt-out del operador) exige dejar `upstream: null`: el canal queda inactivo y los informes de campo escalan manualmente. La credencial del canal vive en el almacén de credenciales de git de la máquina, **fuera del repo** (runbook «Crear la credencial del canal»); jamás en archivos del repo, ítems ni documentación. `verify-workboard.mjs` comprueba la coherencia: canal activo sin ítem del canal cerrado, ítem cerrado sin canal activo, o ítem cancelado con canal activo son violaciones.

## 4. Proceso de una tarea individual

### 4.1 Crear

1. Leer la cadena de contratos hasta el nodo afectado.
2. Comprobar que no exista un ítem equivalente.
3. Crear un archivo con el esquema vigente (copiar [_template-item.md](_template-item.md)) y un ID nuevo del dominio.
4. Definir alcance, `touches`, aceptación, dependencias reales, **clase de problema** (`datos | red | cómputo | agente`, ley 11 del mapa maestro) y contexto.
5. Actualizar `INDEX.md` en la misma entrega.

### 4.2 Reclamar

1. Leer el ítem y verificar `status: open`, o confirmar que el agente ya es `claimed_by`.
2. Cambiar atómicamente `status`, `claimed_by`, `claimed_at` y `updated_at`.
3. Reflejar el claim en `INDEX.md`.
4. Un agente mantiene como máximo un claim activo, salvo autorización expresa.

Si dos agentes reclaman simultáneamente, prevalece el primer cambio persistido que conserve el estado previo esperado (`open`). El segundo agente debe detenerse, no sobrescribir el claim y registrar la colisión en su entrega o comunicarla al owner.

Un claim abandonado no se reasigna silenciosamente: el owner libera o reasigna el ítem, actualizando `decision_log` y `INDEX.md`.

### 4.3 Ejecutar

1. Verificar dependencias y bloqueos antes de tocar código o arquitectura.
2. Trabajar solo dentro de `touches`, salvo ampliar el alcance mediante una modificación trazable del ítem.
3. Aplicar el protocolo canónico de la clase de problema declarada (`docs/conocimiento/protocolos/`); los hallazgos intermedios se cachean en las notas del ítem para no re-auditar en la misma sesión.
4. Para varios agentes sobre una misma tarea, dividir el trabajo en subtareas o ítems hijos con límites de archivos no solapados.
5. Un agente coordinador conserva el claim primario, integra resultados y es el único que cierra la tarea.
6. Los agentes colaboradores no cambian el estado global ni mueven archivos a `_done/`; devuelven evidencia al coordinador.
7. Si aparece una contradicción normativa, detener la ejecución y marcar `blocked` con la referencia al contrato conflictivo.
8. **Stop condition**: tras dos iteraciones fallidas sobre lo mismo, escalar (pregunta al owner o `status: blocked` con referencia); nunca iterar en bucle.
9. **Alcance colateral (§5.1 del mapa maestro)**: tocar estado documentado fuera de `touches` exige ampliar `touches` y registrar el motivo en `decision_log` ANTES de tocarlo; el verificador lo comprueba (rutas de `touches` inexistentes en un ítem activo = violación).

### 4.4 Bloquear y desbloquear

Un bloqueo requiere `status: blocked`, `blocked_by` con IDs existentes y una explicación concreta. Al desaparecer la causa, el owner o el agente reclamante actualiza dependencias, evidencia y devuelve el estado a `open` o `in_progress`; nunca se elimina el historial del bloqueo.

### 4.5 Cerrar o cancelar

El coordinador decide entre:

- **`done`**: todos los criterios se verifican y el resultado está persistido;
- **`cancelled`**: el trabajo ya no debe ejecutarse, fue sustituido o contradice una regla superior.

Antes de cerrar:

1. comprobar cada criterio de aceptación;
2. ejecutar las validaciones aplicables (incluida `node verify-workboard.mjs` de este nodo; en montajes, además `verify-mount.mjs` — F7 §7.1: un ítem de prueba de fuego no cierra con el verificador de montaje en rojo);
3. actualizar el `ARCHITECTURE.md` del nodo si cambió comportamiento, mapa o grafo;
4. cerrar el ciclo git: PR fusionado o entrega directa justificada, worktree eliminado y rama fusionada borrada (§5.1 y convención ítem→rama→PR del README);
5. **entrega completa (§5.1 del mapa maestro)**: ítem + proyecciones (`INDEX.md`, contratos) + verificador en verde + commit, todo en la misma entrega; si la operación tuvo efecto fuera del repo, la lectura de verificación del estado resultante forma parte de la evidencia;
6. añadir evidencia, decisión y fecha;
7. cambiar el estado y limpiar el claim;
8. mover el archivo a `items/_done/`;
9. quitarlo de `INDEX.md` en la misma entrega.

Los ítems cancelados también se mueven a `_done/`, pero conservan `closed_reason` y no se presentan como trabajo completado.

### 4.6 Regímenes de trabajo: producción y exploración

No todo el trabajo tiene el mismo destino. El workboard reconoce dos regímenes:

**Producción** (default): el ciclo completo de §4.1–§4.5. Todo ítem sin marca es de producción.

**Exploración** (ítems `EXP-###`): trabajo barato y acotado cuyo producto es un **aprendizaje**, no un entregable. Responde «¿se puede hacer X?» antes de comprometer producción — la primera versión es la que menos importa; el aprendizaje archivado evita pagar el mismo experimento dos veces.

1. **Disparadores de creación**: se abre un ítem exploratorio cuando (a) la tarea responde a una **pregunta** y no a un requisito; (b) el resultado puede **descartarse sin pérdida**; (c) nadie ha **prometido** el resultado a un tercero. Cualquier agente puede crearlos directamente — son el carril legítimo de la curiosidad dentro del harness — pero el operador puede cerrarlos en cualquier momento.
2. **Campos**: `regimen: exploracion` (obligatorio con ID `EXP-`), `acceptance` = «aprendizaje: <qué respuesta resuelve la pregunta>», y `timebox` obligatorio (fecha ISO-8601; vencida, el verificador exige el cierre).
3. **Ejecución**: claim atómico y worktree desechable (`worktrees/EXP-###-<slug>/`, §5.1) como cualquier ítem. Sin `touches` estrictos, sin checklist de PR, sin actualización de contratos: el código experimental **no es comportamiento de producción** y ningún contrato lo describe. El presupuesto de lecturas del protocolo `agente` no aplica aquí — el límite es el timebox.
4. **Cierres posibles**:
   - **Promoción**: el experimento vale → cierre `done` con el aprendizaje como evidencia + nuevo ítem de **producción** que referencia al `EXP-`. **Solo el operador promueve** (principio 9): el agente propone con evidencia; el operador abre o autoriza el ítem de producción. El código experimental migra a producción por el ciclo normal, nunca directamente.
   - **Descarte**: el aprendizaje es negativo o la pregunta se respondió con «no» → cierre `done` con el porqué como evidencia (un resultado negativo archivado es tan valioso como uno positivo). Worktree: `remove --force`.
   - **Caducidad**: timebox vencido sin respuesta → `cancelled` con `closed_reason: caducado sin respuesta`; si la pregunta sigue viva, el operador decide si vuelve al backlog como ítem normal.
5. **Ningún código experimental se fusiona** a producción sin su ítem de producción: el paso exploración→producción pasa siempre por la puerta del operador.
6. **Adopción graduada**: en destinos recién montados, las primeras tareas nuevas pueden proponerse como exploración y graduarse — el harness se valida a sí mismo antes de confiarle trabajo de producción.

### 4.7 Dualidad workboard↔Jira: andamio temporal y reglas maestras (SEED-026)

El workboard local es el **andamio de arranque** del seguimiento de tareas, no su destino: el destino es **Jira** (decisión del operador, `fase-0-decisiones.md` §0.9). La bisagra mecánica de la dualidad es `MODO.md` en la raíz del workboard (en el destino: `docs/workboard/MODO.md`), con front-matter `modo: local|jira` y — en modo jira — el destino de tareas en `jira:`.

| Aspecto | `modo: local` (temporal) | `modo: jira` (destino) |
|---|---|---|
| Fuente de verdad de las tareas | El workboard local | Jira (site/proyecto de `MODO.md`) |
| Presión de migración | Constante: banner en `INDEX.md`, advertencia del verificador en cada ejecución, recordatorio del hook en cada commit | Ya no aplica: la migración se hizo |
| Ítems en `items/` | Ciclo de vida normal (§4.1–§4.5) | Ninguno activo: solo histórico en `items/_done/` |
| `INDEX.md` | Debe llevar la línea «Workboard local temporal» | Congelado: sección «Reglas maestras» + destino Jira referenciado; prohibido el banner temporal |
| Crear tareas locales | Permitido | **Bloqueada por el hook pre-commit** (se crean en Jira) |
| Reglas del corpus | Se siguen sí o sí | Se siguen sí o sí — el tablón queda como **punto de reglas maestras**, la metodología no se sustituye |

El verificador (`verify-workboard.mjs`) comprueba cada fila de esta tabla por ejecución; el cambio de modo se ejecuta con el runbook `migrar-tareas-a-jira.md` (§ Activación del modo Jira) y nunca deja la dualidad ambigua: sin `MODO.md`, el verificador falla.

### 4.8 Coherencia con Jira: verify-jira (SEED-027)

La sincronización en la misma entrega (mapa maestro §5.1.3) se mecaniza: `verify-jira.mjs` compara los ítems activos del workboard contra las issues del destino declarado en `MODO.md` (`jira: <site> / <proyecto>`), emparejadas por el prefijo «[ID] » del summary. La credencial es la del protocolo `secretos` §El almacén (`git credential fill` para el host del site; usuario = email, secreto = token de API) — jamás en el repo ni en la URL de ningún remote (prohibición a toda costa de SEED-021).

| Situación | Comportamiento |
|---|---|
| Sin `jira:` declarado en `MODO.md` | Silencio (exit 0): nada que reconciliar — el modo y su presión los gobierna §4.7 |
| Credencial en el almacén + issue Finalizada con ítem activo en local | **Violación (exit 1)** — el hook pre-commit (paso 7) bloquea: la misma entrega aplica a las dos superficies (EVAL-5) |
| Credencial en el almacén + ítem activo sin issue | **Violación (exit 1)**: crear la issue o reconciliar |
| Credencial + estados intermedios distintos (local `in_progress` / Jira To Do) | **Aviso, no violación**: el flujo del proyecto puede no tener estado En curso (p. ej. team-managed con solo To Do/Done) — el cierre es lo estricto |
| Sin credencial o sin red (modo degradado) | **Aviso, no bloqueo (exit 0)**: «MODO DEGRADADO» — se reconcilia al recuperar acceso |
| Modo jira sin ítems activos | «Sin ítems activos que reconciliar» (exit 0): el seguimiento vive en Jira |

Para evals, `VERIFY_JIRA_CANNED=<archivo.json>` sustituye la API por datos deterministas (ley 4); `VERIFY_JIRA_TIMEOUT_MS` acota la espera de red (default 5000). La demostración vive en la batería de F7 §7.3 (3 asertos: degradado, coherente, deriva).

## 5. Trabajo multiagente

Una tarea única puede tener varios colaboradores, pero solo un coordinador. El coordinador debe:

- mantener el alcance y los criterios de aceptación;
- asignar subtareas no solapadas;
- exigir una evidencia por subtarea;
- integrar cambios sin sobrescribir trabajo ajeno;
- resolver conflictos de archivos;
- verificar el resultado completo;
- ejecutar el cierre atómico del ítem.

**Aislamiento físico (obligatorio con agentes en paralelo)**: cada agente paralelo trabaja en su propio `worktree` (o contenedor equivalente). El claim y los `touches` delimitan la *lógica* del trabajo; el worktree delimita su *ejecución física*. Jamás dos agentes en el mismo working tree: el índice de git, los servidores de desarrollo y las variables de entorno no soportan concurrencia.

### 5.1 Ciclo de vida del worktree (convención obligatoria)

El worktree no es una elección del agente: es un artefacto del ítem, con ciclo de vida fijado. Sin esta convención cada agente improvisa distinto y el remedio se convierte en la enfermedad (checkouts viejos, locks de `.git`, carpetas misteriosas junto al repo).

1. **Ruta y nombre**: `worktrees/<ID>-<slug>/` en la raíz del repo, con `worktrees/` en el `.gitignore`. Prohibidas las rutas y nombres improvisados (`git worktree add ../cosa-temporal`).
2. **Creación al reclamar**: `git worktree add worktrees/<ID>-<slug> -b <rama>`, con la rama de la convención ítem→rama→PR del [README](./README.md). Todo el trabajo del ítem ocurre dentro de su worktree; el árbol principal se mantiene limpio.
3. **Durante la tarea**: el worktree comparte el `.git` pero no las dependencias ni el entorno — preparar lo necesario dentro (instalar dependencias, variables) sin tocar el árbol principal.
4. **Al cerrar** (desde el árbol principal): PR fusionado o entrega directa justificada → `git worktree remove worktrees/<ID>-<slug>` → `git branch -d <rama>` si está fusionada → `git worktree prune`.
5. **Al cancelar**: `git worktree remove --force worktrees/<ID>-<slug>` → `git branch -D <rama>` → `git worktree prune`; la evidencia del ítem registra qué se descartó.
6. **Verificación de huérfanos**: al cerrar cualquier ítem, y en la checklist de montaje (F7, criterio 16): `git worktree list` no muestra worktrees sin ítem activo, y `worktrees/` contiene únicamente los claims activos de `INDEX.md`.

### 5.2 Aislamiento de recursos locales (puertos, procesos, memoria)

El worktree aísla filesystem y git; los recursos del sistema operativo siguen siendo compartidos entre agentes.

1. **Port plan**: los puertos son un recurso del claim. Antes de levantar servidores, el agente consulta `INDEX.md`; cada agente paralelo declara en las Notas del ítem el rango de puertos que usará (p. ej. `ports: 3010-3019`), sin colisionar con claims activos. El puerto por defecto del proyecto solo se usa si ningún otro claim activo lo ocupa.
2. **Procesos trazables**: todo proceso lanzado para la tarea se registra en las Notas (comando + patrón/pid). Al cerrar, se detienen: un ítem no se marca `done` con procesos vivos, y la evidencia incluye la limpieza.
3. **Techo de concurrencia**: el default del protocolo `agente` (≤ 3 agentes paralelos) es también el techo recomendado por recursos locales; escalar más exige autorización del operador y, idealmente, entornos contenerizados (fuera del alcance documental de este harness).
4. **Cleanup de zombie**: si un run muere dejando procesos vivos o puertos ocupados, el siguiente claim del nodo los detecta, limpia antes de trabajar y registra el incidente en el `decision_log`.

### 5.3 Fusión multi-feature (ramas de integración)

Con varios agentes en varias features, la fase de fusión tiene reglas propias:

1. **Rama de integración**: `develop`. Los PR se abren contra ella; `main` solo se toca por decisión expresa del operador.
2. **Fusiones serializadas**: una fusión a la vez hacia la rama de integración. Toda fusión termina con el verificador en verde — en fusiones locales lo impone el hook sobre el commit de fusión; en fusiones vía plataforma, se ejecuta antes de fusionar.
3. **Conflictos de `INDEX.md`**: es el único fichero que todos los ítems editan — el conflicto de fusión entre dos features es esperado, no un error. Se resuelve por **unión de filas** (jamás se pierde una fila); tras resolver, el verificador valida: si el índice no coincide exactamente con los ítems activos, la fusión no pasa.
4. **Ramas estancadas**: sincroniza tu rama con la de integración **antes de abrir el PR**, y re-sincroniza si otro ítem se fusionó tocando tus archivos. Una rama sin sincronizar produce sorpresas que el diff del PR no muestra.

Si las subtareas tienen ciclos de vida independientes, deben promoverse a ítems primarios con IDs propios y dependencias explícitas. No se usan subtareas para ocultar trabajo independiente ni para multiplicar claims sobre el mismo archivo.

## 6. Trazabilidad y sincronización

Cada modificación del workboard debe poder reconstruirse mediante:

- `updated_at`;
- autor o `claimed_by`;
- motivo en el cuerpo o `decision_log`;
- criterios y subtareas afectados;
- evidencia de validación;
- relación con los contratos o archivos tocados.

No se actualiza solo `INDEX.md` ni solo el ítem. El índice es una proyección; el archivo del ítem es el registro primario; `_done/` es el archivo histórico.

## 7. Términos y condiciones

1. El workboard tiene autoridad exclusiva sobre estados y coordinación de tareas, no sobre las leyes arquitectónicas.
2. Un contrato superior prevalece ante cualquier instrucción de un ítem.
3. No existe cierre implícito por antigüedad, comentario o commit sin evidencia.
4. Un ítem abierto no demuestra que el trabajo siga siendo válido; debe conservar alcance coherente con los contratos actuales.
5. Cuando cambia la arquitectura, los ítems afectados se revisan y se cierran, adaptan o cancelan con trazabilidad.
6. La consistencia del nodo se evalúa por la correspondencia exacta entre ítems activos, `INDEX.md` y el archivo histórico `_done/`, verificada mecánicamente por `verify-workboard.mjs`.

---
*Fin del contrato del dominio workboard. Para reglas universales vuelve a [docs/ARCHITECTURE.md](../ARCHITECTURE.md).*
