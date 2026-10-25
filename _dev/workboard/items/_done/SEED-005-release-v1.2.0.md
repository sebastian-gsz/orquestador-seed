---
id: SEED-005
title: "Release v1.2.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T12:00:00+02:00
updated_at: 2026-10-24T13:45:00+02:00
closed_at: 2026-10-24T13:45:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
  - README.md
blocks: []
blocked_by: [SEED-001, SEED-002, SEED-003, SEED-004]
acceptance:
  - "CHANGELOG.md con entrada v1.2.0 (los 4 huecos + instancia viva)"
  - "README con _dev/workboard en la estructura"
  - "Merge de feature/harness a develop y tag v1.2.0 en develop"
  - "Ramas y tags publicadas en origin"
  - "verify-workboard.mjs verde sobre _dev/workboard (índice vacío, 5 ítems archivados)"
subtasks:
  - "[x] CHANGELOG v1.2.0"
  - "[x] README estructura"
  - "[x] Merge + tag"
  - "[x] Push"
external:
  - null
decision_log:
  - "2026-10-24T13:40:00+02:00 (zcode): el tag v1.2.0 se coloca en develop (merge de feature/harness); la integración develop → main la decide el operador."
---

## Contexto

Cierre del lote de 4 huecos de orquestación detectados en la auditoría corpus. La rama `feature/harness` se crea desde `develop`; el release se fusiona a `develop` y se etiqueta ahí — la integración a `main` la decide el operador.

## Notas

- Merge fast-forward esperado (develop no ha divergido).

## Evidencia

- `CHANGELOG.md`: entrada v1.2.0 con los 4 huecos cerrados + instancia viva.
- `README.md`: `_dev/workboard/` añadido a la estructura con nota de que no se copia al destino.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.2.0` en develop; push a origin.
- Índice de `_dev/workboard` vacío con los 5 ítems archivados en `items/_done/`; verificación mecánica en verde al cierre.
