---
id: SEED-018
title: "Release v1.8.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T20:00:00+02:00
updated_at: 2026-10-24T20:25:00+02:00
closed_at: 2026-10-24T20:25:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-017]
acceptance:
  - "CHANGELOG.md con entrada v1.8.0 (metodología de fusión multi-feature)"
  - "Merge de feature/harness a develop y tag v1.8.0 en develop"
  - "CI §7.5: verificador verde (vía hook), EVAL-5 por construcción, EVAL-1 justificado si sigue pendiente"
  - "Push lo ejecuta el operador; main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.8.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T20:20:00+02:00 (zcode): CI §7.5 — verificador verde vía hook en cada commit; EVAL-5 verde por construcción; EVAL-1 continúa diferido con la justificación de v1.5.0 (primer uso completo antes del próximo montaje); main intocado; push del operador."
---

## Contexto

Séptimo release de la línea `feature/harness`: cierra la metodología de ramas por feature con las reglas de fusión multi-feature.

## Notas

- `main` intocado; push del operador.
- Recursos: ninguno (trabajo documental).

## Evidencia

- `CHANGELOG.md`: entrada v1.8.0 completa.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.8.0` en develop.
- Índice de `_dev/workboard` vacío con 18 ítems archivados (SEED-001…018); hook activo en todos los commits.
- Push pendiente del operador: `git push -u origin develop feature/harness --tags`.
