---
id: SEED-024
title: "Fase 1 — Montaje del proyecto Jira «orquestador-seed» (key SEED) y piloto de migración"
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
updated_at: 2026-11-15T23:00:00+01:00
closed_at: 2026-11-15T23:00:00+01:00
closed_reason: "Parte local completa: generador determinista de cargas probado (28 cargas: 23 Done + 5 del plan, validación OK sin secretos). La PRUEBA FINAL en Jira queda como diferible con dueño (operador): crear proyecto SEED → importar → reconciliar por lectura."
touches:
  - _dev/workboard/
  - fase-6-dominios/runbooks/migrar-tareas-a-jira.md
  - CHANGELOG.md
blocks: []
blocked_by: []
acceptance:
  - "Generador determinista de cargas (ítem del workboard → carga de issue JSON conforme al mapeo del runbook) en el repo, probado en local"
  - "Carga del piloto generada y validada en local: 16 campos mapeados, cero secretos, estructura conforme al runbook"
  - "Prueba final en Jira (crear proyecto + importar piloto + reconciliar por lectura) como subtarea diferible con dueño: operador"
subtasks:
  - "[x] Verificar el bloqueo del MCP (sin creación de proyectos) y registrarlo"
  - "[x] Reenfoque del operador: preparar en local, prueba final en Jira después"
  - "[x] Generador de cargas determinista en el repo (_dev/migracion-jira/generar-cargas.mjs)"
  - "[x] Cargas generadas y validadas: 28 (23 Done + 5 del plan) — 16 campos del mapeo, cero secretos"
  - "[ ] PRUEBA FINAL (diferible, dueño: operador): crear proyecto SEED + importar piloto + reconciliar por lectura"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-36 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T21:00:00+01:00 · operador (J. Sebastián G. Sánchez) · Plan de migración del workboard a Jira aprobado en sesión («Acepto el plan, crea los ítems necesarios y comienza a trabajar»). Ejecuta la fase 1 del plan: montaje + piloto."
  - "2026-11-15T21:40:00+01:00 · zcode · BLOQUEO verificado: el catálogo del MCP de Jira (205 operaciones) no expone creación de proyectos software — listJiraProjects/createJiraBoard/manageJiraProjectVersion requieren el proyecto ya existente; la op «createProject» es del producto Atlas/Projects (otra cosa). 2026-11-15T22:30:00+01:00 · operador (J. Sebastián G. Sánchez) · Corrección de enfoque: no se requiere el proyecto para PREPARAR la migración — las tareas se crean y cierran en LOCAL ahora (cargas de issues deterministas, validadas en local) y la creación en Jira es la PRUEBA FINAL del plan, no el paso previo. El bloqueo deja de bloquear: el ítem se desbloquea y trabaja en local. · 2026-11-15T22:30:00+01:00 · zcode · Desbloqueado por decisión del operador: nuevo alcance = generador de cargas + carga del piloto validadas en local; la prueba final en Jira queda como subtarea diferible con dueño (operador: crear proyecto, o token de API)."
---

## Contexto

Fase del plan de migración aprobado (2026-11-15): las tareas del workboard migran a Jira (runbook «Migrar tareas del workboard a Jira», SEED-023). Detalles y mapeo: ese runbook es la referencia normativa de este ítem.
