---
id: SEED-012
title: "Release v1.5.0"
status: done
priority: P2
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T16:30:00+02:00
updated_at: 2026-10-24T17:15:00+02:00
closed_at: 2026-10-24T17:15:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: [SEED-011]
acceptance:
  - "CHANGELOG.md con entrada v1.5.0 (evals del harness)"
  - "Merge de feature/harness a develop y tag v1.5.0 en develop"
  - "CI de la semilla §7.5 aplicado por primera vez: verificador verde + batería o justificación + CHANGELOG"
  - "Push lo ejecuta el operador; main permanece intocado"
subtasks:
  - "[x] CHANGELOG v1.5.0"
  - "[x] Merge + tag"
external:
  - null
decision_log:
  - "2026-10-24T17:00:00+02:00 (zcode): CI §7.5 aplicado — (1) verificador en verde en cada entrega de la sesión; (2) EVAL-5 ejecutado y verde: cada entrega de SEED-006..011 contiene código+contrato+ítem+INDEX en un commit con verificador verde; (3) EVAL-1 DIFERIDO con justificación: exige repo-fixture y sesión de agente fresco — v1.5.0 es el release que introduce el requisito y no puede aplicarse retroactivamente a sí mismo; primer uso completo de la batería comprometido para v1.6.0 o antes del próximo montaje. Lo no ejecutado se declara, no se finge."
  - "2026-10-24T17:05:00+02:00 (zcode): push diferido al operador (SSH interactivo); main permanece intocado."
---

## Contexto

Cuarto release de la línea `feature/harness`: evals del harness (batería de comportamiento, tríada de refuerzo y CI de la semilla).

## Notas

- Primer release que aplica su propio §7.5 — ver decision_log para el estado exacto de la batería.

## Evidencia

- `CHANGELOG.md`: entrada v1.5.0 completa.
- CI §7.5: verificador verde (código 0 en cada entrega de la sesión); EVAL-5 verde (entregas atómicas código+contrato+ítem+INDEX); EVAL-1 diferido y justificado en `decision_log`.
- Merge `feature/harness` → `develop` (fast-forward) y tag `v1.5.0` en develop.
- Índice de `_dev/workboard` vacío con 12 ítems archivados (SEED-001…012); verificación mecánica en verde al cierre.
- Push pendiente del operador: `git push -u origin develop feature/harness --tags`.
