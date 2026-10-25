---
id: SEED-016
title: "Release v1.7.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T19:00:00+02:00
updated_at: 2026-10-24T19:45:00+02:00
closed_at: 2026-10-24T19:45:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-015]
acceptance:
  - "CHANGELOG.md con entrada v1.7.0 (regla de datos crudos + refuerzo .gitattributes)"
  - "Merge de feature/harness a develop y tag v1.7.0 en develop"
  - "CI §7.5: verificador verde (vía hook), EVAL-5 por construcción, EVAL-1 justificado si sigue pendiente"
  - "Push lo ejecuta el operador; main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.7.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T19:40:00+02:00 (zcode): CI §7.5 — verificador verde en cada commit (vía hook); EVAL-5 verde por construcción (entregas atómicas); EVAL-1 continúa diferido con la justificación de v1.5.0 (repo-fixture + sesión de agente fresco, primer uso completo antes del próximo montaje); main intocado; push del operador."
---

## Contexto

Sexto release de la línea `feature/harness`: regla de datos crudos en depuración (tip 13), incorporada por criterio de coste del operador.

## Notas

- `main` intocado; push del operador.

## Evidencia

- `CHANGELOG.md`: entrada v1.7.0 completa (regla + refuerzo .gitattributes).
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.7.0` en develop.
- Índice de `_dev/workboard` vacío con 16 ítems archivados (SEED-001…016); hook activo en todos los commits del release.
- Push pendiente del operador: `git push -u origin develop feature/harness --tags`.
