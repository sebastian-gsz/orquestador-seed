---
id: SEED-023
title: "Migración de tareas del workboard a Jira (MCP) — mapeo y runbook; Compass como línea futura"
status: done
priority: P1
class: agente
regimen: produccion
timebox: null
node: fase-5-workboard
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T19:45:00+01:00
updated_at: 2026-11-15T20:15:00+01:00
closed_at: 2026-11-15T20:15:00+01:00
closed_reason: "Diseño completo: mapeo campo a campo, runbook canónico con proyecto destino decidido (SEED), dirección de la fuente de verdad declarada, IDEA-3 (Compass) en el parking lot. Montaje del proyecto en Jira y piloto = diferible con dueño (operador)."
touches:
  - fase-6-dominios/runbooks/
  - _dev/IDEAS-EXPERIMENTALES.md
  - CHANGELOG.md
blocks: []
blocked_by: []
acceptance:
  - "Mapeo completo campo a campo workboard → Jira documentado (ítem, estados, prioridades, clase, touches, decision_log, external, INDEX→tablero, release→fixVersion)"
  - "Runbook canónico de migración en fase-6-dominios/runbooks/ — con proyecto destino decidido por el operador (proyecto nuevo «orquestador-seed», key SEED) y pasos de montaje del proyecto pendientes de su aprobación"
  - "Dirección de la fuente de verdad declarada: el workboard local sigue siendo canónico hasta decisión expresa del operador de invertirla (Jira primero); la migración no duplica estado sin regla"
  - "Línea futura registrada en el parking lot: bitácoras y documentación → Compass (IDEA-3, a debate)"
  - "verify-workboard.mjs en verde en la misma entrega"
subtasks:
  - "[x] Crear worktree y rama feature (§5.1)"
  - "[x] Explorar la instancia Jira del operador (cloudId, proyectos existentes) vía MCP"
  - "[x] Mapeo workboard → Jira (runbook)"
  - "[x] Runbook de migración con proyecto destino decidido"
  - "[x] IDEA-3 (Compass) en el parking lot"
  - "[ ] Crear el proyecto SEED en Jira y el piloto (bloqueado a aprobación del operador)"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-35 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T19:45:00+01:00 · operador (J. Sebastián G. Sánchez) · Orden: migrar las tareas del workboard a Jira vía el MCP de Jira; en el futuro, las bitácoras y la documentación a Compass. Probado el MCP de Jira y el servicio documental de Atlassian («compass o como se llame») el operador decide institucionalizar el flujo."
  - "2026-11-15T19:45:00+01:00 · operador (J. Sebastián G. Sánchez) · Decisiones de diseño: proyecto NUEVO y dedicado «orquestador-seed» (key SEED) como destino de las tareas; en esta entrega SOLO diseño — nada se crea en Jira aún (ni proyecto ni issues): el montaje del proyecto y el piloto quedan como paso siguiente a aprobación expresa."
  - "2026-11-15T19:45:00+01:00 · zcode · Trabajo en worktree worktrees/SEED-023-migracion-jira (rama feature/SEED-023-migracion-jira) conforme a §5.1; la entrega se fusiona a main con verificador en verde."
  - "2026-11-15T20:15:00+01:00 · zcode · Cierre del diseño: runbook v1.0.0 con mapeo de 16 campos verificado contra la instancia real (JQL ilimitado rechazado: 400 — anotado en el runbook), IDEA-3 registrada, CHANGELOG 2.4.0. verify-workboard en verde (1 activo → 0 tras cierre)."
---

## Contexto

El operador lleva unos días probando el **MCP de Jira** y el ecosistema documental de Atlassian (**Compass**). Decisión: las **tareas** del workboard migran a **Jira**; las **bitácoras y la documentación**, más adelante, a **Compass**. Este ítem institucionaliza el flujo: mapeo de campos, runbook canónico, dirección de la fuente de verdad y registro de la línea futura — sin crear todavía nada en Jira (decisión del operador, solo diseño en esta entrega).

### Lo que la migración NO cambia

- El corpus sigue siendo la autoría normativa (contratos, protocolos) — Jira aloja *tareas*, no doctrina (principio 7: nada de lo que vive en Jira es contrato).
- El workboard local y su verificador mecánico siguen operativos; Jira es la **superficie externa** de las tareas y su reconciliación cae bajo la regla §5.1.3 del mapa maestro (lectura de verificación del estado resultante en la misma entrega).

Detalles del mapeo y del procedimiento: [runbook «Migrar tareas del workboard a Jira»](../../fase-6-dominios/runbooks/migrar-tareas-a-jira.md).

## Evidencia (al cierre)

- Cierre 2026-11-15 por zcode en worktree (rama feature), fusionado a main.
- Runbook nuevo con mapeo completo (16 campos), matriz de estados, convención de keys y de referencia cruzada bidireccional (`external` del ítem ↔ descripción/enlace de la issue).
- IDEA-3 (bitácoras + documentación → Compass) en `_dev/IDEAS-EXPERIMENTALES.md`, embrionaria y a debate.
- `verify-workboard.mjs` en verde (Ídem: el workboard no cambia de forma — Jira es superficie externa).
- Pendiente explícito con dueño: montaje del proyecto SEED en Jira + piloto (subtarea 6, dueño: operador).
