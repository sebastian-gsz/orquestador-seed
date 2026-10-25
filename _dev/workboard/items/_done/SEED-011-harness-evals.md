---
id: SEED-011
title: "Evals del harness: batería de comportamiento, tríada de refuerzo y CI de la semilla"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T16:30:00+02:00
updated_at: 2026-10-24T17:00:00+02:00
closed_at: 2026-10-24T17:00:00+02:00
closed_reason: null
touches:
  - fase-7-verificacion.md
  - fase-1-mapa-maestro.md
  - fase-6-dominios/protocolos/agente.md
blocks: [SEED-012]
blocked_by: []
acceptance:
  - "Fase 7 §7.3: batería de 5 evals de comportamiento repetibles (EVAL-1 ciclo completo reference-based, EVAL-2 exploración/caducidad, EVAL-3 adversarial red-team, EVAL-4 fuga de credenciales, EVAL-5 misma entrega code-based) con estímulo/éxito/fallo y umbral de release"
  - "Fase 7 §7.5: CI de la semilla (verificador verde + batería o justificación + CHANGELOG por release; main intocado)"
  - "DoD §7.4 ligado a EVAL-1; desmontaje renumerado a §7.6"
  - "Tríada de refuerzo en §5 del mapa maestro y en agente.md (regla 7): cada violación corregida deja regla, check o eval"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] F7 §7.3 batería"
  - "[x] F7 §7.5 CI + renumeración"
  - "[x] Tríada en mapa §5"
  - "[x] Tríada en agente.md"
external:
  - null
decision_log:
  - "2026-10-24T16:40:00+02:00 (zcode): la batería vive en la Fase 7 (es parte de la verificación del harness), no como protocolo de clase — su disparador es el ciclo de vida de la semilla, no una clase de problema."
  - "2026-10-24T16:45:00+02:00 (zcode): EVAL-1 y EVAL-5 bloqueantes; EVAL-2–4 diferibles con justificación — el coste de las evals de comportamiento (sesión de agente) exige umbral pragmático."
---

## Contexto

La capa de evals del corpus (`ai-evals.md`) aplicada al propio harness: el harness tiene un comportamiento evaluable (¿los agentes cumplen el protocolo?) y hoy su prueba de fuego es un evento único manual. Doctrina que se adopta: escenarios automatizados y repetibles que viven junto al verificador, y *cada issue del harness se convierte en una eval nueva*. Los evals son el instrumento de medida del harness: «el modelo es la constante; el harness, la variable» — sin evals, se edita el harness a ciegas.

## Notas

- El verificador (B4) ya es un eval code-based; la batería añade los reference-based y red-team que faltaban.
- Antecedente honesto: el verificador detectó 3 veces en esta sesión la desincronización INDEX↔ítems — con la tríada, ese fallo ya quedó cubierto como *check*; la batería cubre los que no se mecanizan.
- Recursos: ninguno (trabajo documental; los evals corren sobre repo-fixture).

## Evidencia

- `fase-7-verificacion.md`: nueva §7.3 con la batería EVAL-1…EVAL-5 (montaje común, estímulo/éxito/fallo por escenario, umbral de release); DoD renumerada a §7.4 y ligada a EVAL-1; nueva §7.5 CI de la semilla (verificador + batería o justificación + CHANGELOG + main intocado); desmontaje renumerado a §7.6.
- `fase-1-mapa-maestro.md` §5: tríada de refuerzo añadida al bloque de auto-mejora (regla | check | eval).
- `fase-6-dominios/protocolos/agente.md` regla 7: tríada referenciada.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
