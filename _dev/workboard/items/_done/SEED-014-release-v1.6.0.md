---
id: SEED-014
title: "Release v1.6.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T17:30:00+02:00
updated_at: 2026-10-24T18:35:00+02:00
closed_at: 2026-10-24T18:35:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-013]
acceptance:
  - "CHANGELOG.md con entrada v1.6.0 (capa determinista + test-first)"
  - "CI de la semilla §7.5: verificador verde (ahora también vía hook), batería o justificación, CHANGELOG"
  - "Merge de feature/harness a develop y tag v1.6.0 en develop"
  - "Push lo ejecuta el operador; main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.6.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T18:30:00+02:00 (zcode): CI §7.5 — (1) verificador en verde, ahora también ejecutado automáticamente por el hook en cada commit; (2) EVAL-5 verde por construcción (entregas atómicas de la sesión, incluido el cierre de SEED-013 que pasó por el hook); (3) EVAL-1 continúa diferido con la misma justificación de v1.5.0 (requiere repo-fixture y sesión de agente fresco; primer uso completo comprometido antes del próximo montaje); (4) CHANGELOG actualizado; (5) main intocado."
  - "2026-10-24T18:30:00+02:00 (operador, heredado): push diferido al operador (SSH interactivo)."
---

## Contexto

Quinto release de la línea `feature/harness`: capa determinista de requisitos mecanizados (hooks nativos de git) y restauración del test first mode.

## Notas

- Primer release cuyo propio commit de cierre pasó por la capa determinista que introduce.

## Evidencia

- `CHANGELOG.md`: entrada v1.6.0 completa.
- CI §7.5: verificador en verde en todas las entregas (manual + automático por hook); EVAL-5 verde; EVAL-1 diferido justificado.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.6.0` en develop.
- Índice de `_dev/workboard` vacío con 14 ítems archivados (SEED-001…014); verificación en verde al cierre.
- Push pendiente del operador: `git push -u origin develop feature/harness --tags`.
