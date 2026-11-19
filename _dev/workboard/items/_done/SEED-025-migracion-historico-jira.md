---
id: SEED-025
title: "Fase 2 — Migración de los 23 ítems archivados como issues Done en Jira"
status: done
priority: P1
class: agente
regimen: produccion
timebox: null
node: fase-5-workboard
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T21:00:00+01:00
updated_at: 2026-11-15T23:05:00+01:00
closed_at: 2026-11-15T23:05:00+01:00
closed_reason: "Parte local completa vía el generador de SEED-024: las 23 cargas Done existen como JSON validado con fixVersion real; la importación y las referencias cruzadas external quedan en la PRUEBA FINAL (diferible con dueño: operador)."
touches:
  - _dev/workboard/items/_done/
  - _dev/workboard/
  - CHANGELOG.md
blocks: []
blocked_by:
  - SEED-024
acceptance:
  - "Las 23 cargas Done existen como JSON validado en _dev/migracion-jira/cargas/ con fixVersion real, labels y descripción resumen (sin secretos, principio 10) — CUMPLIDO"
  - "external de cada ítem archivado apunta a su issue — DIFERIDO a la prueba final (requiere URLs reales)"
  - "Tablero Done de Jira = 23 issues archivadas — DIFERIDO a la prueba final (dueño: operador)"
subtasks:
  - "[x] Cargas de los 23 ítems generadas y validadas en local (vía generar-cargas.mjs, SEED-024)"
  - "[ ] Referencia cruzada external ↔ issue en los 23 archivos (en la PRUEBA FINAL, con las URLs reales)"
  - "[ ] Reconciliación muestreada (en la PRUEBA FINAL)"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-36 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T21:00:00+01:00 · operador (J. Sebastián G. Sánchez) · Plan de migración del workboard a Jira aprobado en sesión («Acepto el plan, crea los ítems necesarios y comienza a trabajar»). Fase 2 del plan: migrar el histórico (decisión del operador implícita al aprobar el plan con la recomendación de migrar los 23)."
  - "2026-11-15T23:05:00+01:00 · zcode · Reenfoque por la corrección del operador (SEED-024): preparar en LOCAL, importar como prueba final. Las 23 cargas Done quedan generadas y validadas (manifiesto: v2.0.0×19, v2.1.0×2, v2.3.0×1, v2.4.0×1) en _dev/migracion-jira/cargas/; su importación y el campo external de los archivos históricos se ejecutan en la prueba final. Cierre con diferible con dueño (§7.2 F7)."
---

## Contexto

Fase del plan de migración aprobado (2026-11-15): las tareas del workboard migran a Jira (runbook «Migrar tareas del workboard a Jira», SEED-023). Detalles y mapeo: ese runbook es la referencia normativa de este ítem.
