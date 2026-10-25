---
id: SEED-009
title: "Realismo como criterio de aceptación por defecto (M2)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T15:00:00+02:00
updated_at: 2026-10-24T16:00:00+02:00
closed_at: 2026-10-24T16:00:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/_template-item.md
  - fase-3-plantillas/fruit.md
blocks: [SEED-010]
blocked_by: []
acceptance:
  - "Plantilla de ítem: recordatorio de incluir ≥1 camino no feliz en la aceptación cuando el ítem crea o modifica un flujo (entrada inválida, fuente caída, resultado vacío)"
  - "Plantilla de fruto §6.2: la validación funcional incluye caminos no felices por defecto"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] Plantilla de ítem"
  - "[x] fruto §6.2"
external:
  - null
decision_log: []
---

## Contexto

M2 de la propuesta de prototipado con IA: «prototype for realism, not perfection» — un flujo solo probado en su camino feliz no está validado. La aceptación de todo ítem que cree o modifique un flujo debe incluir al menos un camino no feliz; conecta con `datos.md` (validación en frontera) y con la testeabilidad del tronco ETL de referencia.

## Notas

- Recursos: ninguno (trabajo documental).

## Evidencia

- `_template-item.md`: comentario en la sección acceptance con la regla de realismo (≥1 camino no feliz).
- `fase-3-plantillas/fruit.md` §6.2: nueva primera viñeta «Realismo» con los tres casos canónicos (entrada inválida, fuente caída, resultado vacío).
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
