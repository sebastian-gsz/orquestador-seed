---
id: SEED-028
title: "Fase 5 — Cierre del ciclo antiguo: workboard en solo-lectura, canal ascendente y release"
status: done
priority: P2
class: agente
regimen: produccion
timebox: null
node: fase-5-workboard
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-11-15T21:00:00+01:00
updated_at: 2026-11-16T01:20:00+01:00
closed_at: 2026-11-16T01:20:00+01:00
closed_reason: null
touches:
  - _dev/workboard/
  - CHANGELOG.md
  - fase-7-verificacion.md
  - fase-7-evals/
blocks: []
blocked_by:
  - SEED-027
acceptance:
  - "workboard de la semilla en `modo: jira` (decisión de SEED-026 resuelta: dualidad) activado con el runbook §Activación del modo Jira — ítems archivados, INDEX congelado con «Reglas maestras»"
  - "Canal ascendente SEED-020 decidido (¿issues upstream en Jira?)"
  - "Release: CHANGELOG + tag + verificadores en verde + EVAL-1..5 en la nueva mecánica"
subtasks:
  - "[x] Decisión del canal ascendente"
  - "[x] Cierre del workboard antiguo"
  - "[x] Release final"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-39 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T21:00:00+01:00 · operador (J. Sebastián G. Sánchez) · Plan de migración del workboard a Jira aprobado en sesión («Acepto el plan, crea los ítems necesarios y comienza a trabajar»). Fase 5 del plan."
  - "2026-11-16T01:05:00+01:00 · agente-ZCode · Reclamado por instrucción del operador («continúa con la semilla», tras aclarar que el mensaje de versiones italiano/español no iba dirigido a esta tarea). Decisión del canal ascendente (SEED-020): se MANTIENE en GitHub (issues del repo del corpus con open-issue.mjs) — Jira no recibe informes de campo: todo destino tiene credenciales git, no todos tienen acceso al Jira privado del operador; acoplar el canal a ZCJ rompería su universalidad. Reversible: el operador puede reabrirlo como issue nueva en ZCJ si lo quiere migrar."
  - "2026-11-16T01:20:00+01:00 · agente-ZCode · Cierre + activación del modo jira en la propia semilla (misma entrega, runbook §Activación del modo Jira). Evidencia: verify-workboard en verde en modo jira (0 ítems activos, INDEX congelado con «Reglas maestras») · verify-jira: sin ítems activos que reconciliar · batería de evals 11/11 · verify-mount --self en verde tras el tag · hook pasos 6+7 operativos en modo jira. No verificado en vivo contra la REST API de Jira (sin credencial en el almacén): diferible con dueño — operador."
  - "2026-11-16T01:35:00+01:00 · agente-ZCode · Defecto del harness corregido en la misma entrega (auto-mejora §5): el hook leía MODO.md con sed y un final CRLF invalidaba en silencio la comparación del modo ([ jira\r = jira ] → falso → rama local). Causa raíz: blobs del corpus committeados con CRLF desde el origen (99 archivos; .gitattributes solo protegía *.sh y hooks/*). Tríada de refuerzo: (check) verify-workboard rechaza MODO.md con CRLF · (hook) el parse del modo tolera \r · (regla) .gitattributes → * text=auto eol=lf y corpus normalizado a LF (99 archivos; cambio exclusivamente de finales de línea)."
---

## Contexto

Fase del plan de migración aprobado (2026-11-15): las tareas del workboard migran a Jira (runbook «Migrar tareas del workboard a Jira», SEED-023). Detalles y mapeo: ese runbook es la referencia normativa de este ítem.

**Premisa actualizada por SEED-026 (dualidad, decisiones §0.9)**: «cierre del ciclo antiguo» = activar `modo: jira` en la propia semilla (archivar los ítems históricos, congelar INDEX con «Reglas maestras», MODO.md en jira) — la metodología sigue; solo cambia la superficie del tablero.
