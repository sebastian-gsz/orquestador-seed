---
id: SEED-027
title: "Fase 4 — Mecanizar el ciclo Jira: hook de coherencia, verificador contra Jira y protocolo de sesión"
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
updated_at: 2026-11-16T00:55:00+01:00
closed_at: 2026-11-16T00:55:00+01:00
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-5-workboard/hooks/
  - fase-6-dominios/protocolos/agente.md
  - SEED.md
  - fase-7-evals/
  - _dev/workboard/
blocks: []
blocked_by:
  - SEED-026
acceptance:
  - "Hook pre-commit con check de coherencia ítem ↔ issue (credencial en el almacén de git, protocolo secretos; modo degradado sin red documentado: avisa, no bloquea)"
  - "Verificador que valida tareas contra Jira (verify-jira o modo de verify-workboard)"
  - "Protocolo de sesión reescrito (crear/reclamar/cerrar con Jira; claim = assignee + transición) y EVAL-1..5 actualizados"
  - "Demostración sobre el fixture o issue de prueba"
subtasks:
  - "[ ] Credencial Jira al almacén — diferible con dueño: operador (una orden cuando rote/genere el token; mientras tanto el check corre en modo degradado)"
  - "[x] Hook de coherencia con modo degradado"
  - "[x] Verificador contra Jira"
  - "[x] Protocolo + evals actualizados y demostrados"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-38 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-11-15T21:00:00+01:00 · operador (J. Sebastián G. Sánchez) · Plan de migración del workboard a Jira aprobado en sesión («Acepto el plan, crea los ítems necesarios y comienza a trabajar»). Fase 4 del plan."
  - "2026-11-16T00:20:00+01:00 · agente-ZCode · Reclamado con la aprobación del operador («Adelante. Reclamala»). Sin credencial Jira en el almacén (comprobado con git credential fill): la demostración mecánica corre en modo degradado + canned determinista (ley 4); la verificación en vivo contra la API de Jira queda diferible con dueño (operador)."
  - "2026-11-16T00:55:00+01:00 · agente-ZCode · Cierre. Evidencia: batería de evals 11/11 (degradado avisa sin bloquear; canned coherente en verde; deriva de cierre exit 1) · verify-workboard y verify-mount --self en verde · hook con pasos 6+7 demostrado en los commits de la entrega (presión + MODO DEGRADADO visibles) · claim reflejado en ZCJ-38 por comentario (ZCJ team-managed sin estado En curso; la deriva intermedia es aviso, el cierre es lo estricto). No verificado en vivo contra la REST API de Jira: diferible con dueño (operador — registra el token en el almacén y el paso 7 pasa a bloqueante)."
---

## Contexto

Fase del plan de migración aprobado (2026-11-15): las tareas del workboard migran a Jira (runbook «Migrar tareas del workboard a Jira», SEED-023). Detalles y mapeo: ese runbook es la referencia normativa de este ítem.

**Premisa actualizada por SEED-026 (dualidad, decisiones §0.9)**: la mecánica a mecanizar opera sobre `MODO.md` — el check de coherencia ítem↔issue aplica en modo jira (y como espejo en local si hay credencial), con modo degradado sin red documentado; el protocolo de sesión consulta el modo declarado antes de crear/reclamar/cerrar tareas.
