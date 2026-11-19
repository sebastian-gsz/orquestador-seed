---
id: SEED-026
title: "Fase 3 — Dualidad workboard↔Jira: workboard local temporal con presión de migración, Jira como destino"
status: done
priority: P1
class: agente
regimen: produccion
timebox: null
node: fase-5-workboard
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T21:00:00+01:00
updated_at: 2026-11-15T23:55:00+01:00
closed_at: 2026-11-15T23:55:00+01:00
closed_reason: null
touches:
  - _dev/workboard/
  - fase-5-workboard/
  - SEED.md
  - fase-1-mapa-maestro.md
  - fase-0-decisiones.md
  - fase-6-dominios/runbooks/migrar-tareas-a-jira.md
  - fase-7-evals/
blocks: []
blocked_by:
  - SEED-025
acceptance:
  - "Decisión del operador registrada en decision_log: dualidad — workboard local temporal con presión constante, Jira destino de las tareas; tras migrar el tablón queda como punto de reglas maestras"
  - "MODO.md declara el modo (local|jira) y es la bisagra mecánica de la dualidad, en la semilla y en la plantilla del destino"
  - "verify-workboard.mjs: presión de migración en modo local + control de tablón congelado en modo jira (sin ítems activos, INDEX con reglas maestras y destino Jira)"
  - "Hook pre-commit: recordatorio de migración en modo local + bloqueo de ítems nuevos en items/ en modo jira"
  - "Contratos actualizados: SEED §6, mapa §5, ARCHITECTURE §4.7, README del workboard, decisiones §0.9, runbook migrar-tareas-a-jira (§ Activación del modo Jira)"
  - "Batería de evals (F7 §7.3) con el escenario de modo jira y la presión local demostrados"
subtasks:
  - "[x] Decisión del operador registrada (dualidad; Jira sustituye la superficie del tablero, no la metodología)"
  - "[x] MODO.md + verificador + hook"
  - "[x] Contratos y runbook"
  - "[x] Evals + cierre"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-37 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T21:00:00+01:00 · operador (J. Sebastián G. Sánchez) · Plan de migración del workboard a Jira aprobado en sesión («Acepto el plan, crea los ítems necesarios y comienza a trabajar»). Fase 3 del plan — la única puerta irreversible: NO se ejecuta sin debate expreso del operador."
  - "2026-11-15T23:30:00+01:00 · operador (J. Sebastián G. Sánchez) · DECISIÓN de inversión resuelta en mensaje: «solo tengo una tarea: pasar de trabajar con workboards a Jira. Al descargar el repo (siembra o parasitar) habrá un workboard local temporal con lo ya construido, que pedirá constantemente migrar a Jira; al migrar, el workboard queda como punto de reglas maestras que sí o sí debe seguir el proyecto». Dualidad: Jira sustituye la superficie del seguimiento de tareas, NO la metodología (contratos, verificadores, hooks siguen)."
  - "2026-11-15T23:55:00+01:00 · agente-ZCode · Cierre. Evidencia: verify-workboard en verde (presión local activa) · verify-mount --self en verde · batería de evals 8/8 (incluye «modo local: presión en cada ejecución» y «modo jira: ítem activo detectado») · hook con paso 6 (recordatorio local / bloqueo en jira) demostrado en el commit de la entrega. No verificado contra un destino real montado en modo jira: diferible con dueño (operador, en el próximo montaje siembrar/parasitar)."
---

## Contexto

Fase del plan de migración aprobado (2026-11-15): las tareas del workboard migran a Jira (runbook «Migrar tareas del workboard a Jira», SEED-023). Detalles y mapeo: ese runbook es la referencia normativa de este ítem.

## Diseño de la dualidad (según la decisión del operador)

- `MODO.md` en la raíz del workboard (`_dev/workboard/` en la semilla, `docs/workboard/` en el destino) declara el modo: `local` (andamio temporal) o `jira` (destino). Sin él el verificador falla — la dualidad nunca queda ambigua.
- **Modo local**: la semilla ejerce presión de migración constante en tres superficies — banner en `INDEX.md`, advertencia del verificador en cada ejecución y recordatorio del hook en cada commit. Lo ya construido no se toca: el workboard sigue funcionando igual mientras tanto.
- **Modo jira**: las tareas viven en Jira (site/proyecto declarado en `MODO.md`). El tablón queda congelado como **punto de reglas maestras**: sin ítems activos (histórico en `items/_done/`), `INDEX.md` con la sección «Reglas maestras» y el destino Jira referenciado; el hook bloquea crear ítems nuevos en `items/`.
- La metodología (contratos, verificadores, hooks, canal ascendente) no se sustituye: solo cambia la superficie del tablero.
