---
id: SEED-003
title: "Entorno reproducible codificado (hueco 3)"
status: done
priority: P1
class: agente
node: fase-3-plantillas
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T12:00:00+02:00
updated_at: 2026-10-24T13:15:00+02:00
closed_at: 2026-10-24T13:15:00+02:00
closed_reason: null
touches:
  - fase-3-plantillas/
blocks: [SEED-005]
blocked_by: []
acceptance:
  - "Plantilla de tronco con §5 Entorno reproducible: tabla de herramientas/versiones, setup ejecutable desde cero y regla «si un tool no está declarado, no existe»"
  - "Protocolo topológico (README de plantillas) actualizado: los troncos declaran entorno, los frutos heredan"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] trunk.md §5"
  - "[x] README de plantillas punto nuevo"
external:
  - null
decision_log:
  - "2026-10-24T13:00:00+02:00 (zcode): el entorno va en la plantilla de tronco (conocimiento transversal del dominio), no como ley universal — los frutos heredan y solo añaden lo propio, coherente con la ley 5 (configuración centralizada)."
---

## Contexto

Hueco 3 de la auditoría (`ai-agent-orchestration.md` §Problem 4 y `ai-developer-environments.md`): deriva de reproducibilidad entre agentes y máquinas — «funciona en mi máquina». Regla del corpus que se adopta: «si un tool no está definido en el repo, asume que no existe».

## Notas

- Va en la plantilla de tronco (no en leyes): el entorno es conocimiento transversal del dominio, y cada tronco lo declara; los frutos heredan.

## Evidencia

- `fase-3-plantillas/trunk.md`: nueva §5 «Entorno reproducible» (tabla herramienta/versión/obtención, setup ejecutable desde cero, variables con nombres sin valores, herencia por los frutos); Validación y T&C renumeradas a §6/§7.
- `fase-3-plantillas/README.md`: nuevo punto 9 del protocolo topológico (troncos declaran entorno, frutos heredan, tool no declarado = no existe); puntos anteriores 9-11 renumerados a 10-12.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
