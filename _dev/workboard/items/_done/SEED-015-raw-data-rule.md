---
id: SEED-015
title: "Datos crudos, no interpretaciones (tip 13) en protocolo agente"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T19:00:00+02:00
updated_at: 2026-10-24T19:30:00+02:00
closed_at: 2026-10-24T19:30:00+02:00
closed_reason: null
touches:
  - fase-6-dominios/protocolos/agente.md
  - fase-5-workboard/README.md
blocks: [SEED-016]
blocked_by: []
acceptance:
  - "agente.md: nueva regla 9 «Datos crudos, no interpretaciones» — el ciclo de depuración (agente instrumenta → se ejecuta → salida cruda íntegra de vuelta al agente) con el argumento de coste: un pegado crudo reemplaza N ciclos verbales de adivinanza"
  - "agente.md: fila en defaults canónicos (salida íntegra; recortar solo ruido, nunca las líneas del error)"
  - "agente.md: antipatrón nuevo (describir el bug con palabras y dejar que el agente adivine)"
  - "verify-workboard.mjs verde sobre _dev/workboard (vía hook en los commits)"
subtasks:
  - "[x] Regla 9"
  - "[x] Defaults"
  - "[x] Antipatrón"
external:
  - null
decision_log:
  - "2026-10-24T18:50:00+02:00 (operador): el tip 13 entra al corpus tras quedar demostrado que reduce consumo — el criterio fijado era: entra si ahorra tokens, y el ciclo verbal de adivinanza cuesta más que un pegado crudo (contexto + re-lecturas + ediciones por cada iteración fallida)."
  - "2026-10-24T19:10:00+02:00 (zcode): INCIDENCIA DURANTE LA EJECUCIÓN — el hook dejó de ejecutarse («cannot exec pre-commit: No such file or directory»): la herramienta de escritura dejó CRLF en el shebang y un checkout con autocrlf lo re-smudgó. Refuerzo de la tríada: `.gitattributes` con `eol=lf` para los hooks (check de repositorio) + nota en el README de la capa determinista. Probadísimo: sin .gitattributes, el hook se rompe en cualquier clon de Windows."
---

## Contexto

Tip 13 del corpus (`claude-code-tips-best-practices.md`): «Stop interpreting bugs for Claude. Paste the raw data.» — describir un fallo con palabras es lento: el agente adivina, lo corriges, repites. La interpretación humana añade abstracción que pierce el detalle que delata la causa raíz. Y en el sentido inverso (cursor-tips, ciclo de depuración): el agente añade instrumentación, se ejecuta, y la salida cruda vuelve al agente íntegra para proponer el fix basado en comportamiento real, no en análisis estático.

## Notas

- Recursos: ninguno (trabajo documental).

## Evidencia

- `fase-6-dominios/protocolos/agente.md`: regla 9 «Datos crudos, no interpretaciones» con el ciclo completo y el argumento de coste; fila nueva en defaults (salida íntegra, recorte solo de ruido); antipatrón nuevo (el ciclo verbal cuesta más que el pegado).
- `fase-5-workboard/README.md`: nota del incidente CRLF en la capa determinista + `.gitattributes` con `eol=lf` para `*.sh` y `fase-5-workboard/hooks/*`.
- Entregas de este ítem pasaron por el hook ya funcional (verificador de `_dev/workboard` automático en cada commit).
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
