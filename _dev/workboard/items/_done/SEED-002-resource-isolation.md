---
id: SEED-002
title: "Aislamiento de recursos locales: puertos y procesos (hueco 2)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T12:00:00+02:00
updated_at: 2026-10-24T13:00:00+02:00
closed_at: 2026-10-24T13:00:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
blocks: [SEED-005]
blocked_by: []
acceptance:
  - "Contrato del workboard §5.2: port plan declarado en las Notas del ítem, procesos trazados y liberados al cierre, techo de concurrencia y limpieza de zombie por el siguiente claim"
  - "README del workboard: paso de recursos locales en el protocolo"
  - "Plantilla de ítem: recordatorio de puertos/procesos en Notas"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] Contrato §5.2"
  - "[x] README paso de recursos"
  - "[x] Plantilla de ítem"
external:
  - null
decision_log: []
---

## Contexto

Hueco 2 de la auditoría (`ai-agent-orchestration.md` §Problem 2): el worktree (SEED-001) aísla filesystem y git, pero puertos, procesos y RAM siguen siendo compartidos. El corpus documenta el desastre típico: «one run crashed because it couldn't bind to port 3000, another failed on a database lock».

## Notas

- Sin contenedores: el harness es documental; el aislamiento OS-level se sustituye por presupuesto declarado (port plan) + trazabilidad de procesos + techo de concurrencia.
- Recursos de esta tarea: ninguno (trabajo documental; sin servidores ni procesos).

## Evidencia

- Contrato del workboard: añadida §5.2 con 4 reglas (port plan sobre INDEX, procesos trazables liberados al cierre, techo de concurrencia ≤3, cleanup de zombie por el siguiente claim con registro en decision_log).
- README del workboard: añadido paso 10 de recursos locales al protocolo de claim.
- `_template-item.md`: recordatorio de puertos/procesos en la sección Notas.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
