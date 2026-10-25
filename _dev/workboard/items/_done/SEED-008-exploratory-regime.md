---
id: SEED-008
title: "Régimen exploratorio con graduación (M1+M3)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T15:00:00+02:00
updated_at: 2026-10-24T15:45:00+02:00
closed_at: 2026-10-24T15:45:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
  - SEED.md
  - fase-6-dominios/protocolos/agente.md
  - README.md
  - fase-4-onboarding.md
blocks: [SEED-010]
blocked_by: []
acceptance:
  - "Contrato del workboard §4.6: régimen exploratorio (disparadores, campos, ejecución sin ceremonia de producción, tres cierres con promoción solo del operador, adopción graduada)"
  - "SCHEMA: campos regimen (produccion|exploracion) y timebox; regla EXP- ⟺ exploracion"
  - "Verificador: valida EXP- ⟺ exploracion, timebox ISO y exploración activa con timebox vencido como violación (probado con casos válido/inválido)"
  - "Plantilla de ítem con regimen/timebox; README del workboard con sección Regímenes"
  - "SEED.md: principio 17 «Explora barato, promueve con autoridad»"
  - "agente.md: presupuesto de lecturas sin tope fijo en exploración (límite = timebox)"
  - "fase-4: adopción graduada referenciada en el cierre"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] Contrato §4.6"
  - "[x] README Regímenes"
  - "[x] SCHEMA + plantilla"
  - "[x] Verificador EXP + test"
  - "[x] Principio 17"
  - "[x] agente.md + fase-4 + README"
external:
  - null
decision_log:
  - "2026-10-24T15:20:00+02:00 (zcode): el régimen vive como §4.6 del contrato del workboard (no como ley nueva del mapa) — es un proceso del dominio de trabajo, no una norma arquitectónica; el principio 17 sí entra en SEED.md porque define una política del harness."
  - "2026-10-24T15:30:00+02:00 (zcode): el verificador trata la exploración activa con timebox vencido como violación (no warning) — sin dientes, el timebox es decorativo."
---

## Contexto

M1 de la propuesta de prototipado con IA: la ceremonia completa del workboard disuade de explorar — las ideas se exploran fuera del harness (el backlog disperso que prohíbe el principio 4) o se paga ceremonia completa por experimentos. El corpus legitima la exploración barata: «la primera versión es la que menos importa» — el producto de la exploración es un **aprendizaje**, no un entregable.

## Notas

- M3 (adopción graduada) se integra aquí: los primeros ítems de un destino recién montado pueden nacer como EXP y graduarse.
- La promoción es siempre del operador (principio 9): un agente nunca se auto-promueve a producción.
- Recursos: ninguno (trabajo documental).

## Evidencia

- Contrato del workboard: nueva §4.6 (disparadores, campos, ejecución, los tres cierres, prohibición de fusión sin ítem de producción, adopción graduada).
- README del workboard: sección «Regímenes».
- SCHEMA: campos `regimen` y `timebox` + regla de correspondencia EXP- ⟺ exploracion.
- `_template-item.md`: campos con comentarios.
- `verify-workboard.mjs`: 3 validaciones nuevas, probadas con 4 fixtures (EXP válida → exit 0; EXP sin regimen, EXP con timebox vencido activa y produccion con regimen exploracion → 6 violaciones detectadas incluidas las de INDEX).
- `agente.md`: fila nueva en defaults (lecturas sin tope en exploración, límite = timebox).
- `SEED.md`: principio 17 añadido (16→17 principios).
- `README.md` de la semilla: fila nueva en «Qué resuelve»; `fase-4-onboarding.md`: adopción graduada en §4.5.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
