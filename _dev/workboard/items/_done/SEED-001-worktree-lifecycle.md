---
id: SEED-001
title: "Convención de ciclo de vida de worktrees (hueco 1)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T12:00:00+02:00
updated_at: 2026-10-24T12:45:00+02:00
closed_at: 2026-10-24T12:45:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-7-verificacion.md
  - fase-6-dominios/protocolos/agente.md
blocks: [SEED-005]
blocked_by: []
acceptance:
  - "Contrato del workboard §5.1 con la convención completa: ruta worktrees/<ID>-<slug> (gitignore), creación al reclamar con la rama, remove/prune al cerrar, --force al cancelar"
  - "Verificación de huérfanos añadida al cierre del workboard (README) y a la checklist F7 como criterio 16"
  - "protocolos/agente.md regla 8 actualizada con la convención"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] Contrato §5.1"
  - "[x] README: reclamo y cierre"
  - "[x] F7 criterio 16"
  - "[x] agente.md regla 8"
external:
  - null
decision_log:
  - "2026-10-24T12:30:00+02:00 (zcode): la convención requiere que la rama del worktree siga la convención de SEED-004 — se referencia en §5.1 punto 2 en lugar de duplicarla."
---

## Contexto

Hueco 1 de la auditoría contra el corpus (`ai-agent-orchestration.md` §Problem 3): el harness exige worktree propio (B3) pero no define su ciclo de vida. Sin convención, cada agente improvisa distinto (`git worktree add ../cosa-temporal`), nadie limpia al cerrar, y a las tres semanas hay worktrees huérfanos, carpetas misteriosas y locks de `.git` — el remedio se convierte en la enfermedad.

## Notas

- Convención decidida: `worktrees/<ID>-<slug>/` en la raíz del repo, en `.gitignore`; la rama se crea con el worktree y sigue la convención de SEED-004.
- El corpus avisa: «worktrees come with a lot of overhead... agents get really confused about them» — la convención existe para eliminar la improvisación.

## Evidencia

- Contrato del workboard: añadida §5.1 con los 6 puntos del ciclo (ruta/nombre, creación al reclamar, durante, cierre, cancelación, verificación de huérfanos). Commit de esta entrega.
- README del workboard: paso 9 del protocolo de claim ahora referencia la convención §5.1 explícitamente.
- F7: añadido criterio 16 (huérfanos) y actualizado el conteo de la prueba de fuego (15→16).
- `protocolos/agente.md` regla 8: actualizada con ruta, ciclo y prohibición de improvisación.
- Verificación de huérfanos en esta misma sesión: no se crearon worktrees — **entrega directa justificada**: trabajo documental trivial ejecutado en `feature/harness` (la rama de trabajo de la feature), sin worktree ni PR. Conforme a la convención de SEED-004 (entrega directa solo documentación trivial).
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
