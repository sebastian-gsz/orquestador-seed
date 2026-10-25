---
id: SEED-004
title: "Convención ítem → rama → PR (hueco 4)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T12:00:00+02:00
updated_at: 2026-10-24T13:30:00+02:00
closed_at: 2026-10-24T13:30:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-3-plantillas/fruit.md
blocks: [SEED-005]
blocked_by: []
acceptance:
  - "README del workboard con la convención: rama <tipo>/<ID>-<slug> creada al reclamar, PR titulado (<ID>) <título>, external enlaza PR/rama, entrega directa solo documentación trivial"
  - "Contrato §4.5: paso de cierre git (PR fusionado, worktree y rama limpiados) en la lista de cierre"
  - "Plantilla de fruto §6.3: checklist de PR"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] README convención"
  - "[x] Contrato §4.5 cierre git"
  - "[x] fruit.md §6.3"
external:
  - null
decision_log:
  - "2026-10-24T13:20:00+02:00 (zcode): INDEX no gana columnas de rama/PR — viven en external y las Notas, para no romper el formato ni el verificador existente."
---

## Contexto

Hueco 4 de la auditoría (`ai-agent-orchestration.md` §Problem 5): el workboard ya es el plano de control del trabajo, pero el vínculo ítem↔rama↔PR dependía de la memoria del agente. La convención lo hace determinista y trazable.

## Notas

- INDEX no gana columnas nuevas: rama y PR viven en `external` y las Notas (evita romper el verificador y el formato existente).
- Recursos: ninguno (trabajo documental).

## Evidencia

- README del workboard: nueva sección «Convención ítem → rama → PR» con los 4 puntos (rama `<tipo>/<ID>-<slug>` creada al reclamar con el worktree, PR `(<ID>) <título>` enlazado en `external`, entrega directa solo para documentación trivial, cierre con limpieza de worktree y rama).
- Contrato del workboard §4.5: la lista de cierre pasa de 7 a 8 pasos, con el paso 4 dedicado al ciclo git (PR fusionado/entrega justificada, worktree eliminado, rama borrada).
- `fase-3-plantillas/fruit.md`: nueva §6.3 con la checklist de PR.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
