---
id: SEED-007
title: "Release v1.3.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T14:00:00+02:00
updated_at: 2026-10-24T14:45:00+02:00
closed_at: 2026-10-24T14:45:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-006]
acceptance:
  - "CHANGELOG.md con entrada v1.3.0 (estándar de seguridad)"
  - "Merge de feature/harness a develop y tag v1.3.0 en develop"
  - "verify-workboard.mjs verde sobre _dev/workboard (índice vacío, ítems archivados)"
  - "Push lo ejecuta el operador (SSH interactivo); main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.3.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T14:40:00+02:00 (zcode): push diferido al operador — su SSH requiere passphrase interactiva (lección de v1.2.0); main permanece intocado por decisión del operador."
---

## Contexto

Segundo release dentro de `feature/harness` tras v1.2.0: incorpora el estándar de seguridad de aislamiento de credenciales por servicio como protocolo canónico del corpus.

## Notas

- `main` permanece intocado por decisión del operador; el push lo ejecuta el operador con su SSH interactivo.

## Evidencia

- `CHANGELOG.md`: entrada v1.3.0 con el estándar completo.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.3.0` en develop.
- Índice de `_dev/workboard` vacío con 7 ítems archivados (SEED-001…007); verificación mecánica en verde al cierre.
- Push pendiente del operador (comando: `git push -u origin develop feature/harness --tags`).
