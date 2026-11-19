# CHANGELOG — orquestador-seed

Formato: [SemVer](https://semver.org/lang/es/) — mayor: cambios incompatibles en las plantillas; menor: módulos o reglas nuevas; parche: correcciones. La entrada de procedencia que cada destino registra en su dominio de conocimiento cita la versión de semilla usada.

> **HISTORIAL-COMPRIMIDO (2026-11-19)**: decisión del operador — el repo se comprimió a un único commit (`init: Programador solitario`) y las tags v2.1.0–v2.7.0 se retiraron (queda solo `v2.0.0`, «captura esencial»). Las entradas siguientes se conservan como registro histórico; mientras este marcador exista, la comprobación CHANGELOG↔tags (§7.5) queda exenta y `verify-mount --self` lo declara en su salida (aviso, no violación).

## [2.8.0] — 2026-11-19

**Marcador de compresión de historial** (SEED-029): la regla §7.5 «CHANGELOG ↔ tags» admite la excepción declarada tras la compresión del historial a un commit único (2026-11-19).

- **`CHANGELOG.md`**: marcador `HISTORIAL-COMPRIMIDO` al inicio — declara la compresión y la retirada de tags; las entradas previas quedan como registro histórico.
- **`verify-mount.mjs` (modo self)**: si el CHANGELOG porta el marcador, la comparación CHANGELOG↔tags se omite con aviso explícito en la salida; sin marcador, la regla es exactamente la anterior.
- **Contratos**: F7 §7.5 enmendado (la exención es parte del check de CI).

## [2.7.0] — 2026-11-16

**Cierre del ciclo antiguo: la propia semilla vive en modo jira** (SEED-028). El plan de migración (SEED-023–028) queda completo: la metodología no cambia; el tablero de la semilla ahora es Jira.

- **`MODO.md` → `modo: jira`** con destino `sebastian-gsz.atlassian.net / ZCJ`: los ítems históricos (28) quedan en `items/_done/`; `INDEX.md` congelado como **punto de reglas maestras** (principios, leyes, anti-deriva, contratos, protocolos, verificación); crear ítems locales está bloqueado por el hook (SEED-026). Las tareas nuevas de la semilla se crean directamente en Jira (protocolo `agente` §Ciclo de tareas con Jira).
- **Canal ascendente decidido**: se mantiene en GitHub (issues del repo del corpus con `open-issue.mjs`) — Jira no recibe informes de campo: los destinos tienen credenciales git, no todos tienen acceso al Jira privado del operador (decisión registrada en el `decision_log` del ítem, reversible).
- **Contratos alineados con la mecánica**: F7 §7.1/§7.3 (escenarios de dualidad y coherencia en la demo), EVAL-1 según el modo declarado (`MODO.md`).
- **Normalización del corpus a LF + refuerzos** (defecto detectado en la propia entrega): los blobs llevaban CRLF desde el origen (99 archivos) y un final `\r` invalidaba en silencio la lectura del modo en el hook (`[ jira\r = jira ]` → falso). `.gitattributes` pasa a `* text=auto eol=lf`; el hook tolera `\r` en `MODO.md`; `verify-workboard` rechaza un `MODO.md` con CRLF.
- Release: `verify-workboard` en verde en modo jira · `verify-jira` sin ítems activos que reconciliar · batería de evals 11/11 · `verify-mount --self` en verde. Verificación en vivo contra la REST API de Jira: diferible con dueño (operador — token de API al almacén de git).

## [2.6.0] — 2026-11-15

**Coherencia ítem↔issue mecanizada: la misma entrega aplica a las dos superficies** (SEED-027). La sincronización entre el workboard y Jira (mapa maestro §5.1.3, EVAL-5) deja de depender de la disciplina del agente.

- **`verify-jira.mjs`** (nuevo, fase-5-workboard, copiable al destino): compara los ítems activos contra las issues del destino declarado en `MODO.md` (`jira: <site> / <proyecto>`), por el prefijo «[ID] » del summary. Credencial del almacén de git (`git credential fill`; usuario = email, secreto = token de API) contra la REST API v3 — jamás en el repo ni en URLs (SEED-021).
- **Semántica del check**: el **cierre es lo estricto** (issue Finalizada con ítem activo, o ítem activo sin issue = violación, exit 1); los estados intermedios son **aviso** (un flujo team-managed con solo To Do/Done, como ZCJ, no tiene «En curso»); **modo degradado** (sin credencial o sin red) avisa y no bloquea; sin `jira:` declarado, silencio.
- **Hook pre-commit paso 7**: corre `verify-jira` en el destino y en la instancia viva de la semilla — con credencial, la deriva de cierre **bloquea el commit** (EVAL-5 en las dos superficies); degradado, el commit pasa con aviso.
- **Protocolo de sesión** (protocolo `agente` §Ciclo de tareas con Jira): consultar `MODO.md` antes de crear/reclamar/cerrar; claim = assignee + transición (o comentario de claim si el flujo no tiene estado intermedio); cierre Done en la misma entrega. Nuevo antipatrón: trabajar el ciclo sin consultar `MODO.md`.
- **Evals**: 3 asertos nuevos en la demostración (degradado, canned coherente, deriva de cierre) con `VERIFY_JIRA_CANNED` determinista — batería 11/11. `verify-mount` (d) comprueba ahora también la fidelidad de `verify-jira.mjs` en el destino.
- **Contratos**: SEED §6.8 · ARCHITECTURE del workboard §4.8 · runbook «Migrar tareas del workboard a Jira» v1.2.0 · README del workboard. Espejo activado en la propia semilla (`MODO.md` → `jira: sebastian-gsz.atlassian.net / ZCJ`).

## [2.5.0] — 2026-11-15

**Dualidad workboard↔Jira: el workboard local es un andamio temporal con presión de migración constante** (SEED-026; decisión del operador §0.9). Jira sustituye la superficie del seguimiento de tareas; la metodología (contratos, verificadores, hooks) no se sustituye.

- **`MODO.md`** (nuevo, raíz del workboard; en el destino `docs/workboard/MODO.md`): bisagra mecánica de la dualidad — `modo: local` (andamio de arranque) o `modo: jira` (destino, con site/proyecto en `jira:`). Sin él, el verificador falla: la dualidad nunca queda ambigua.
- **Presión de migración constante en modo local**, en tres superficies: banner «Workboard local temporal» en `INDEX.md` (comprobado por el verificador), advertencia del verificador en cada ejecución y recordatorio del hook pre-commit en cada commit.
- **Modo jira = tablón congelado como punto de reglas maestras**: el verificador exige cero ítems activos (histórico en `items/_done/`), `INDEX.md` con la sección «Reglas maestras» y el destino Jira referenciado, sin banner temporal; el hook pre-commit **bloquea** crear ítems nuevos en `items/` (las tareas se crean en Jira).
- **Migración ejecutada en la propia semilla** (SEED-024/025): 28 issues importadas en el proyecto ZCJ (25 `Finalizada`, 3 `To Do`), reconciliadas por lectura (§5.1.3), mapeo id↔key en `_dev/migracion-jira/mapeo-issues.json` y referencia cruzada bidireccional en `external` de los 28 ítems.
- **Contratos**: SEED §6.8 · mapa maestro §5 · decisiones §0.9 (decisión del operador) · ARCHITECTURE del workboard §4.7 · runbook «Migrar tareas del workboard a Jira» v1.1.0 con § Activación del modo Jira.
- **Evals**: escenario `modo-jira-activo` en el fixture y 2 asertos nuevos en la demostración (presión local + tablón congelado) — batería completa 8/8.

## [2.4.0] — 2026-11-15

**Superficie externa de tareas: Jira** (SEED-023). Las tareas del workboard migran a Jira vía el MCP de Jira; las bitácoras y la documentación, más adelante, a Compass (IDEA-3).

- **Runbook nuevo** («Migrar tareas del workboard a Jira — MCP de Jira»): mapeo campo a campo completo (id→key, estados, prioridades, clase/regimen como labels, touches/acceptance en la descripción, decision_log como comentarios, external↔links, releases→fixVersions), matriz de estados, convención de referencia cruzada bidireccional y reconciliación obligatoria por lectura (regla §5.1.3 del mapa maestro).
- **Dirección de la fuente de verdad declarada**: el workboard local sigue siendo canónico hasta decisión expresa del operador; Jira es proyección (el tablero Kanban muestra exactamente el INDEX local).
- **Proyecto destino decidido**: proyecto nuevo y dedicado «orquestador-seed» (key SEED). **El montaje del proyecto y el piloto quedan pendientes de aprobación expresa del operador** — esta entrega no crea nada en Jira.
- **IDEA-3** en el parking lot: bitácoras y documentación → Compass (embrionaria, a debate; ley 12).

## [2.3.0] — 2026-11-15

**Montaje determinista: capas de ejecución que verifican la compleción por código** (SEED-022). La compleción de un montaje deja de ser un relato (checklist de lectura marcada a mano — el defecto que dejó a oracle-erp inerte a los 5 días) y pasa a ser un estado comprobado.

- **`verify-mount.mjs`** (nuevo, fase-5-workboard, copiable al destino): verificador de montaje por ejecución — (a) git: ≥1 commit, árbol limpio, harness trackeado; (b) `core.hooksPath` configurado y hook ejecutable; (c) `verify-workboard` en verde; (d) fidelidad por hash de las copias mecánicas contra la semilla (`--seed`); (e) cero referencias internas colgantes (resolución contra la proyección destino de cada módulo); (f) procedencia con versión real; (g) desmontaje registrado. Modo `--self`: la semilla se aplica lo que predica.
- **Demostración sobre fixture** (`fase-7-evals/demo-modos-fallo.mjs`): detecta exactamente los modos de fallo observados en campo (sin commits, hook sin instalar, referencia colgante, desmontaje sin registrar, INDEX desincronizado) y acepta el montaje sano. Bloqueante en releases y montajes.
- **Batería de evals autocontenida** (`fase-7-evals/`): fixture mínimo (`make-fixture.mjs`) + escenarios EVAL-1..5 — eliminada la dependencia de `ai-evals.md` del corpus, que no viaja con la semilla. EVAL-2 y EVAL-5 mecanizadas en el código; **EVAL-5 bloqueante también en montajes**.
- **fase-7 reorganizada**: §7.1 mecánica (tabla a–g + checklist de lectura mínima), §7.2 con cierre de la prueba de fuego condicionado a `verify-mount` exit 0 y **diferibles con dueño declarado** (nunca omisión silenciosa), §7.5 CI ampliada (self-check + demo + CHANGELOG↔tags desde la política de v2.0.0).
- **`verify-workboard.mjs` ampliado** con 4 checks de compleción por tarea y sus componentes: rutas de `touches` existentes, `decision_log` en el front-matter, fechas plausibles (`VERIFY_WB_MIN_YEAR`), runbooks con `last_reviewed` ≥ última fecha del documento.
- **Reglas anti-deriva** (fase-1 §5.1): entrega completa = ítem + proyecciones + verificador + commit; alcance colateral = ampliar `touches` con `decision_log` antes de tocar; reconciliación de superficies externas = lectura de verificación del estado resultante. Volcadas a fase-5 ARCHITECTURE (§4.3.9, §4.5).
- **Reglas git del montaje** (fase-0 §0.8, fase-5 README): commit inicial + hooks activos son decisión de F0 y paso obligatorio del montaje; su omisión bloquea F7.
- **Corrección expresa de §5.3** (decisión del operador): el repo-semilla opera directamente sobre `main` con integración por decisión expresa; develop rige para destinos y trabajo multiagente en ramas feature.
- Deriva real detectada y corregida en la propia semilla durante el self-check: enlaces colgantes en contratos (apuntaban a un layout de destino inexistente en el repo-semilla).

## [2.2.0] — 2026-11-15

**Capa de credenciales de publicación normada** (SEED-021): cómo git entrega y almacena credenciales HTTPS deja de ser conocimiento oral de sesión (origen: OPS-005, gsc-server).

- **Protocolo `secretos` — nueva sección «El almacén: git credential helpers»**: semántica acumulativa de `credential.helper` y truco del reset vacío; **llavero (GCM) como almacén canónico** con matriz por entorno (Windows de serie, WSL/Linux instalación como paso del montaje) y `store` plano como fallback documentado, nunca default; prohibición absoluta de credenciales embebidas en la URL de remotos; auditoría de un destino.
- **Runbook nuevo** («Publicar un repo destino por HTTPS»): flujo canónico completo — comprobar helpers, entregar el token al llavero, reset local, remote limpio, push con tracking, rotación y rollback — generalizando el flujo OPS-005.
- **Check mecánico de remotos con credenciales embebidas (decisión del operador: hook al 100%)**: nuevo paso 5 en el hook pre-commit — bloquea el commit si algún remote lleva `https://TOKEN@...` en su URL, con el secreto enmascarado en el mensaje; **réplica en `verify-workboard.mjs`** para montajes parciales y verificaciones fuera del ciclo de commit (la réplica completa en el verificador de montaje llega con SEED-022).
- Runbook del canal («Crear la credencial del canal») actualizado: referencia al §El almacén del protocolo `secretos` como normativa del helper.
- Línea futura registrada en SEED-021 (fuera de alcance): capas de red y autenticación (MFA) sobre el token, y generalización del almacén normado a otros tokens más allá del PAT de GitHub.

## [2.1.0] — 2026-10-31

**Canal ascendente destino → repo oficial** (SEED-020): los hallazgos de defectos del corpus dejan de morir en workboards locales.

- **Ítem permanente de canal en cada montaje** (F5, ambos modos): «Configurar el canal de issues ascendentes» — sugerencia activa, no bloqueo; el opt-out es cancelar el ítem con motivo (decisión del operador, 2026-10-31).
- **Activación por estado**: cerrar el ítem escribe `canal.md` (`upstream: OWNER/REPO`) y activa el canal; no hay eventos push — el estado es lo que se comprueba en cada ejecución.
- **`open-issue.mjs`** (sin dependencias): abre la issue del informe de campo en el repo upstream leyendo la credencial del almacén de credenciales de git (`git credential fill`) — nunca contiene ni imprime el token; `--check` valida canal y credencial sin abrir nada.
- **Runbook nuevo** («Crear la credencial del canal»): PAT fine-grained de la cuenta secundaria (Issues: RW, Metadata: R, expiry corto), almacenada fuera del repo, con rotación y rollback.
- **Regla §3.11 + check**: un ítem con sección `## Informe de campo` no cierra sin la disposición del operador — enlace a la issue en `external` o `[via-ascendente] no-asciende` en `decision_log`.
- **Regla §3.12 + check**: coherencia mecánica `canal.md` ↔ ítem del canal (activo sin cierre, cierre sin activación y opt-out con canal vivo son violaciones).
- Corpus: regla del canal en SEED §6.7 y mapa maestro §5, canal ascendente en el protocolo `agente` (regla 7) y su antipatrón, campo `external` del SCHEMA documentado, criterio 17 en la checklist F7.
- **Principio 15 enmendado** (decisión del operador): la configuración del canal (`canal.md` + credencial en el almacén de git) es la segunda traza permitida junto a la entrada de procedencia.

## [2.0.0] — 2026-10-24

**Integración estable**: primera fusión de la línea `develop` (v1.2.0–v1.8.0) en `main`. El corpus completo llega a la línea estable: fases 0–7, plantillas de contratos, 5 protocolos canónicos, workboard vivo con 19 ítems archivados, capa determinista (hook pre-commit), batería de evals de comportamiento y metodología de ramas por feature con fusión multi-feature.

- Marcador pre-integración: tag `v2.0.0-rc.1` sobre el estado anterior de `main` (contenido v1.1.0 del corpus).
- Incluye todo lo documentado en las entradas v1.2.0 … v1.8.0 de este CHANGELOG.
- Política a partir de aquí: `develop` es la rama de integración (§5.3); `main` recibe solo fusiones aprobadas expresamente por el operador, etiquetadas como release.

## [1.8.0] — 2026-10-24

**Metodología de ramas por feature**: cierre de la fase de fusión multi-feature (el ciclo ya cubierto: claim → rama canónica → worktree → trabajo aislado → PR; lo que faltaba era lo que pasa al fusionar).

- **Rama de integración** (§5.3): `develop` — los PR se abren contra ella; `main` solo por decisión expresa del operador. Hasta ahora esta regla vivía en la práctica, no en el corpus.
- **Fusiones serializadas**: una a la vez; toda fusión termina con el verificador en verde (hook local en el commit de fusión; verificador antes de fusionar vía plataforma).
- **Conflictos de `INDEX.md`**: esperados por diseño (todos los ítems lo editan); se resuelven por **unión de filas** — jamás se pierde una fila — y el verificador valida el resultado: si el índice no coincide con los ítems activos, la fusión no pasa.
- **Ramas estancadas**: sincronizar con la rama de integración antes de abrir el PR y tras fusiones ajenas que toquen tus archivos — el «stale checkout» que advierte el corpus (`ai-agent-orchestration.md` §Problem 3).
- README: convención ítem→rama→PR ampliada de 4 a 5 puntos.

## [1.7.0] — 2026-10-24

**Regla de datos crudos en depuración** (tip 13 del corpus, incorporado por criterio de coste del operador: el ciclo verbal de adivinanza cuesta más — contexto, re-lecturas y ediciones por iteración fallida — que un pegado crudo).

- **Nueva regla 9** en `protocolos/agente.md`: «Datos crudos, no interpretaciones» — el ciclo de depuración completo (el agente instrumenta → se ejecuta → la salida cruda vuelve al agente íntegra), la prohibición de resumir/interpretar el fallo, y la regla inversa (si falta información, se pide la salida cruda; no se inventa).
- **Defaults**: salida íntegra al agente — se recorta ruido, nunca las líneas del error.
- **Antipatrón nuevo**: describir un fallo con palabras y dejar que el agente adivine.
- **Refuerzo de tríada incidental**: `.gitattributes` con `eol=lf` para los hooks (`*.sh` y `fase-5-workboard/hooks/*`) — un checkout con `autocrlf` convertía el shebang `#!/bin/sh\n` en `#!/bin/sh\r` y el hook dejaba de ejecutarse («cannot exec»); documentado en el README de la capa determinista.

## [1.6.0] — 2026-10-24

**Capa determinista**: hooks nativos de git + restauración del test first mode (de la serie de tips IDE/agentes del corpus).

- **Hook `pre-commit` del workboard** (`fase-5-workboard/hooks/pre-commit`): instalación con `git config core.hooksPath docs/workboard/hooks` (una vez por clon, la decide el operador). Bloquea en el commit, sin depender de la memoria del agente: workboard inválido (ejecuta el verificador si `items/` existe), commits con `worktrees/` o `.env` (§5.1, principio 10), y secretos obvios en el diff (patrones sk-/ghp_/github_pat_/AKIA/xox/PRIVATE KEY; best-effort — el grep exhaustivo sigue siendo el criterio 11 de F7). En el repo-semilla verifica además la instancia viva `_dev/workboard`. Degradación con aviso si no hay `node`. Probado en fixture con 5 casos y códigos de salida: montaje limpio → aprobado; INDEX desincronizado → **bloqueado** (la clase de fallo que ocurrió 3 veces durante la construcción); workboard válido → aprobado; `.env` → bloqueado; secreto → bloqueado.
- **Principio de la capa** (tip 38, adoptado como regla 10 del contrato del workboard): *lo consultivo vive en los contratos (~80% de cumplimiento esperado); lo que debe pasar siempre se mecaniza (100%)*.
- **Tríada ampliada a cuádruple** (mapa §5 + `agente.md` regla 7): regla | check | **hook** | eval.
- **Test first mode restaurado** (§6.4 de la plantilla de fruto) — estaba en el blueprint de origen y se perdió en la modularización v1.0.0: tests primero hasta verde en features no triviales; en regresiones, un test que reproduce el bug antes del fix.
- El hook está **instalado en la propia semilla** (`core.hooksPath`): los commits de desarrollo verifican `_dev/workboard` automáticamente — primer commit bajo el hook: el cierre de SEED-013.

## [1.5.0] — 2026-10-24

**Evals del harness**: la capa de evaluación del corpus (`ai-evals.md`) aplicada al propio harness — el instrumento de medida que falta para editar el harness sin hacerlo a ciegas.

- **Batería de evals de comportamiento** (nueva §7.3 de la Fase 7): 5 escenarios repetibles sobre repo-fixture — EVAL-1 ciclo completo (reference-based), EVAL-2 exploración y caducidad (code-based), EVAL-3 adversarial (red team), EVAL-4 fuga de credenciales (reference-based), EVAL-5 misma entrega (code-based). *Cada issue del harness se convierte en una eval nueva*; corren tras cada release y al montar destinos.
- **Umbral de release**: EVAL-1 y EVAL-5 bloqueantes; EVAL-2–4 diferibles con justificación en el `decision_log`.
- **Tríada de refuerzo** (§5 del mapa maestro + `agente.md` regla 7): cada violación del harness corregida a mano deja preventivamente una **regla**, un **check** del verificador o una **eval** de la batería — si el fallo puede repetirse, no se corrige solo una vez.
- **CI de la semilla** (nueva §7.5): cada release exige verificador verde, batería ejecutada o justificada, y CHANGELOG; `main` intocado hasta integración del operador.
- DoD (§7.4) ligada a EVAL-1; desmontaje renumerado a §7.6.

## [1.4.0] — 2026-10-24

Regímenes de trabajo: **exploración con graduación** y **realismo por defecto** (de la doctrina de prototipado con IA del corpus).

- **Régimen exploratorio** (§4.6 del contrato del workboard): ítems `EXP-###` — trabajo barato y acotado cuyo producto es un **aprendizaje**, no un entregable. Disparadores (pregunta, descartable, nada prometido); `timebox` obligatorio y **vencido = violación** del verificador; sin `touches` estrictos ni checklist de PR; ejecutado en worktree desechable (§5.1). Tres cierres: **promoción** (solo el operador autoriza el ítem de producción — el código experimental migra por el ciclo normal, nunca directamente), **descarte** (el aprendizaje negativo se archiva y evita repetir el experimento) y **caducidad** (`closed_reason: caducado sin respuesta`).
- **Principio 17** (SEED.md): «Explora barato, promueve con autoridad» — 17 principios.
- **Realismo por defecto** (M2): la aceptación de todo ítem que cree o modifique un flujo incluye al menos un camino no feliz (entrada inválida, fuente caída, resultado vacío); recordatorio en `_template-item.md` y viñeta «Realismo» en la §6.2 de la plantilla de fruto — un flujo solo probado en su camino feliz no está validado.
- **Adopción graduada** (M3): las primeras tareas de un destino recién montado pueden nacer como exploración y graduarse — documentado en §4.6.6 y en el cierre del onboarding (F4).
- **Verificador** (`verify-workboard.mjs`): valida `regimen` (EXP- ⟺ exploracion), `timebox` ISO en exploraciones y exploración activa con timebox vencido como violación. Probado con fixtures válidos e inválidos.
- **Presupuesto de lecturas** (`protocolos/agente.md`): sin tope fijo en exploración — el límite es el timebox.

## [1.3.0] — 2026-10-24

Estándar de seguridad: **aislamiento de credenciales por servicio** (credential scoping — mínimo privilegio aplicado a los secretos).

- **Nuevo protocolo `protocolos/secretos.md`** (transversal — se activa por presencia de un secreto, no por cuello de botella): la regla en una frase («un secreto pertenece a exactamente un servicio: viaja únicamente en las peticiones dirigidas a ese servicio, y en ninguna más»), árbol de decisión con ejemplo anti-patrón/correcto, los tres vectores de fuga (logs de terceros, redirecciones con cabeceras personalizadas, intermediarios), tabla de decisión por situación, compañeros inseparables (variables de entorno, jamás en logs, siempre HTTPS) y auditoría reproducible («test de los dos greps»).
- **Doble consulta obligatoria**: la clasificación «clasifica antes de implementar» manda ahora consultar `secretos.md` además de la clase dominante cuando la tarea crea, transporta o consume un secreto; `red.md` referencia el protocolo en sus reglas de credenciales/sesión.
- **Principio 10 ampliado** (SEED.md): los secretos no solo están fuera de ítems, contratos y logs — en el código viajan aislados por servicio.
- **Plantilla de tronco** (§5 Entorno): cada secreto pertenece a exactamente un servicio y solo viaja en las llamadas hacia ese servicio.
- README de la semilla y criterio 14 de la F7 actualizados a 5 protocolos (datos, red, cómputo, agente, secretos).

## [1.2.0] — 2026-10-24

Orquestación operativa: ciclo de vida de worktrees, recursos locales, entorno codificado y plano de control git (cierre de los 4 huecos de la auditoría corpus).

- **Ciclo de vida del worktree** (§5.1 del contrato del workboard): convención obligatoria `worktrees/<ID>-<slug>/` (`worktrees/` en `.gitignore`), creación al reclamar junto con la rama, `remove`/`prune` al cerrar, `--force` al cancelar, y verificación de huérfanos en el cierre y en la checklist de montaje (nuevo criterio 16). Referenciada desde `protocolos/agente.md` (regla 8).
- **Aislamiento de recursos locales** (§5.2): port plan declarado en las Notas del ítem consultando `INDEX.md`, procesos trazados y liberados al cierre, techo de concurrencia (≤3) y cleanup de procesos zombie por el siguiente claim.
- **Entorno reproducible codificado**: nueva §5 en la plantilla de tronco (herramientas, versiones, setup ejecutable desde cero; «si un tool no está declarado, no existe») y punto 9 del protocolo topológico; los frutos heredan.
- **Convención ítem → rama → PR**: rama `<tipo>/<ID>-<slug>` creada al reclamar, PR titulado `(<ID>) <título>` y enlazado en `external`, entrega directa solo para documentación trivial, checklist de PR en la plantilla de fruto (§6.3) y paso de cierre git en el contrato del workboard (§4.5 pasa a 8 pasos).
- **Instancia viva**: `_dev/workboard/` — la semilla usa su propio harness para desarrollarse (ítems `SEED-00x` ejecutados con claim, evidencia, verificador y cierre; validación mecánica en verde en cada entrega).

## [1.1.0] — 2026-10-23

Diagnóstico estructural del parasitaje:

- **Nuevo módulo `fase-4b-diagnostico.md`**: tras contratar un tronco, evalúa *cómo está construido* (modularidad, DRY demostrable, testeabilidad, dirección de dependencias) con la rúbrica de las leyes universales del mapa maestro. Cubre el hueco del parasitaje en repos monolíticos o poco abstraídos: la contratación documenta lo que existe, el diagnóstico detecta lo que debería cambiar.
- **Hallazgos = ítems del workboard**: cada hallazgo con evidencia se registra como ítem de mejora (`open`, prioridad `P2` por defecto, propuesta como recomendación — autoría ≠ aprobación). El diagnóstico no refactoriza ni edita contratos; los ítems quedan como el primer backlog real que el operador triaja y ejecuta tras el montaje.
- **Grafo de código como acelerador opcional**: integración documentada de [CodeGraph](https://github.com/colbymchenry/codegraph) (índice local `.codegraph/`, MCP vía `codegraph serve --mcp`, consultas `impact/callers/callees/affected` por hallazgo). Cero dependencia: sin grafo, evidencia = mapas de los contratos + auditoría manual acotada (≤ 3 archivos por sospecha). El índice de la herramienta queda excluido por el principio 16.
- **Honestidad de capacidades**: el grafo cubre dependencias, llamadas e impacto; no detecta duplicación ni código muerto en bloque — documentado como límite, con vías alternativas (herramienta dedicada opcional, auditoría por sospecha).
- **Guardas anti-inundación**: sin evidencia no hay hallazgo; DRY solo con ≥ 2 usos reales; nada de mega-refactors (descomposición en ítems pequeños); el agente no se autoasigna P0/P1; > ~10 hallazgos por tronco ⇒ reporte sistémico como un solo ítem.
- **Momento**: por tronco, justo tras cerrar su onboarding (nunca se diagnostica un nodo sin contrato). F4 y F4b referenciadas entre sí.

## [1.0.0] — 2026-10-23

Primera versión de la semilla modular (rediseño del `BLUEPRINT-ORQUESTADOR.md` monolítico):

- **Modularización**: manifiesto `SEED.md` + un módulo por fase (0–7); cada fase es ejecutable en sesión propia.
- **Doble modo**: sembrar (repo vacío) vs parasitar (repo lleno, sin tocar producto), con criterio verificable en Fase 0 y reordenamiento de dependencias (el workboard se monta antes del onboarding: el parasitaje se ejecuta sobre el tablero que instala).
- **Correcciones de brechas**:
  - B1 — el stub `AGENTS.md` incorpora esenciales inline (regla de oro, leyes críticas, permisos), sin perder el ≤45 líneas ni la redirección al mapa maestro.
  - B2 — ley universal de verificación por archivo (tipo/formato/lint/test de un archivo; build completo solo a petición) + sección en la plantilla de fruto.
  - B3 — regla de aislamiento físico: agente paralelo ⇒ worktree propio.
  - B4 — `verify-workboard.mjs` pasa de extensión opcional a parte del kit; validación mecánica `items/ ↔ INDEX.md ↔ _done/` integrada al contrato del workboard.
  - B5 — regla de auto-mejora: segunda vez que un agente repite el mismo error ⇒ nueva regla/antipatrón en la misma entrega.
- **Nuevo dominio de protocolos** (`fase-6-dominios/protocolos/`): datos, red, cómputo y agente, con patrones canónicos de fábrica y especialización de umbrales por nodo solo con evidencia. Ley nueva «clasifica antes de implementar».
- **Notificación ascendente minimal**: formalizada como principio y como parte de la ley de enrutamiento (una fila de ruteo hacia el padre; el detalle jamás asciende ni se propaga a hermanos).
- **Exclusión de artefactos de herramienta**: inventario y contratación excluyen VCS, dependencias, builds, cachés de sesión y assets sin lógica propia.
- **Autodestrucción**: paso de desmontaje en la Fase 7 con verificación de «cero referencias a la semilla»; única traza permitida: entrada histórica en el dominio de conocimiento.
