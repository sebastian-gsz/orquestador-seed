---
id: SEED-017
title: "Metodología de ramas: fusión multi-feature (G-A/B/C)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T20:00:00+02:00
updated_at: 2026-10-24T20:15:00+02:00
closed_at: 2026-10-24T20:15:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
blocks: [SEED-018]
blocked_by: []
acceptance:
  - "Contrato §5.3: rama de integración `develop` (main solo por decisión del operador), fusiones serializadas con verificación en verde, conflictos de INDEX.md resueltos por unión de filas (jamás se pierde una fila), sincronización de ramas estancadas antes del PR"
  - "README convención ítem→rama→PR: destino del PR, re-sincronización antes de abrir, y unión de INDEX documentados"
  - "verify-workboard.mjs verde sobre _dev/workboard (vía hook)"
subtasks:
  - "[x] Contrato §5.3"
  - "[x] README convención"
external:
  - null
decision_log:
  - "2026-10-24T20:10:00+02:00 (zcode): la regla de unión del INDEX vive en §5.3 (reglas de fusión) y no en el SCHEMA — es una norma del proceso de fusión, no un cambio de campos."
---

## Contexto

El escenario multi-feature (dos agentes en dos características + fusión) está cubierto hasta el PR por las reglas v1.2.0-v1.6.0, pero la **fase de fusión** expone tres huecos: (G-A) `INDEX.md` es un punto de colisión por diseño — todos los ítems lo editan, así que el conflicto de fusión es garantizado y no hay regla de resolución; (G-B) la rama destino (`develop` vs `main`) y la serialización de fusiones no están declaradas — vivían solo en la práctica de esta sesión; (G-C) ramas estancadas: el corpus advierte el «stale checkout» (`ai-agent-orchestration.md` §Problem 3) y no hay regla de re-sincronización.

## Notas

- Recursos: ninguno (trabajo documental).

## Evidencia

- `fase-5-workboard/ARCHITECTURE.md`: nueva §5.3 con las 4 reglas de fusión (rama de integración `develop`; serialización con verificación en verde; unión de filas en conflictos de INDEX con re-validación; sincronización de ramas estancadas).
- `fase-5-workboard/README.md`: convención ítem→rama→PR ampliada de 4 a 5 puntos (destino del PR, sincronización antes de abrir, serialización + unión de INDEX).
- Entrega directa justificada (documental) en `feature/harness`; commit pasó por el hook.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
