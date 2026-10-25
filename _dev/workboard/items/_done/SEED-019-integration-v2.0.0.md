---
id: SEED-019
title: "Integración v2.0.0 a main (rc.1 + fusión + release)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T20:40:00+02:00
updated_at: 2026-10-24T20:55:00+02:00
closed_at: 2026-10-24T20:55:00+02:00
closed_reason: null
touches:
  - CHANGELOG.md
blocks: []
blocked_by: []
acceptance:
  - "Tag v2.0.0-rc.1 sobre el estado pre-integración de main (d4fca4f, contenido v1.1.0)"
  - "CHANGELOG.md con entrada v2.0.0 (integración estable)"
  - "Merge de develop a main con commit de integración (--no-ff)"
  - "Tag v2.0.0 sobre el commit de integración en main"
  - "Contextos de release (rc.1 y v2.0.0) entregados al operador para publicar"
  - "Push lo ejecuta el operador (main, develop, feature/harness, todos los tags)"
subtasks:
  - "[x] Tag rc.1 en main"
  - "[x] CHANGELOG v2.0.0"
  - "[x] Fusión --no-ff a main"
  - "[x] Tag v2.0.0"
  - "[x] Contextos de release"
external:
  - null
decision_log:
  - "2026-10-24T20:35:00+02:00 (operador): primera integración de develop a main autorizada expresamente — main deja de estar intocado por decisión del operador; develop permanece como rama de integración (§5.3)."
  - "2026-10-24T20:35:00+02:00 (zcode): versionado del hito — main contiene corpus v1.1.0; la integración trae v1.8.0 completo; el salto se marca como major (v2.0.0) para no colisionar con la línea de tags de develop, y el estado pre-fusión de main queda marcado como v2.0.0-rc.1."
---

## Contexto

Primera integración de la línea `develop` a la línea estable `main`, autorizada por el operador: el corpus completo (fases 0–7, plantillas, 5 protocolos, workboard vivo con 18 ítems archivados, capa determinista, batería de evals, metodología de fusión) llega a `main` como release v2.0.0.

## Notas

- `feature/harness` y `develop` ya estaban idénticas (4f878c1) — el paso "harness → develop" estaba cumplido de serie.
- Recursos: ninguno (trabajo documental).

## Evidencia

- Tag `v2.0.0-rc.1` (anotado) creado sobre `d4fca4f` — el estado de `main` antes de la integración.
- `CHANGELOG.md`: entrada v2.0.0 (integración estable) en `develop`.
- Merge `develop` → `main` con `--no-ff` (commit de integración explícito) y tag `v2.0.0` (anotado) sobre él.
- `feature/harness` permanece en 4f878c1 como rama de trabajo; `develop` en el commit de release.
- Contextos de release (rc.1 y v2.0.0) entregados al operador; push pendiente del operador.
