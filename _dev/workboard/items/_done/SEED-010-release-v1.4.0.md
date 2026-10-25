---
id: SEED-010
title: "Release v1.4.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T15:00:00+02:00
updated_at: 2026-10-24T16:15:00+02:00
closed_at: 2026-10-24T16:15:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-008, SEED-009]
acceptance:
  - "CHANGELOG.md con entrada v1.4.0 (regímenes, realismo, adopción graduada)"
  - "Merge de feature/harness a develop y tag v1.4.0 en develop"
  - "verify-workboard.mjs verde sobre _dev/workboard (índice vacío, ítems archivados)"
  - "Push lo ejecuta el operador; main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.4.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T16:10:00+02:00 (zcode): push diferido al operador (SSH interactivo); main permanece intocado por decisión del operador."
---

## Contexto

Tercer release de la línea `feature/harness`: régimen exploratorio con graduación (M1+M3) y realismo como criterio de aceptación por defecto (M2), de la propuesta de prototipado con IA.

## Notas

- `main` intocado; push del operador.
- Recursos: ninguno (trabajo documental).

## Evidencia

- `CHANGELOG.md`: entrada v1.4.0 completa.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.4.0` en develop.
- Índice de `_dev/workboard` vacío con 10 ítems archivados (SEED-001…010); verificación mecánica en verde al cierre.
- Push pendiente del operador: `git push -u origin develop feature/harness --tags`.
