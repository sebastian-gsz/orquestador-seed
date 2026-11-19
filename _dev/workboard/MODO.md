---
modo: jira
jira: "sebastian-gsz.atlassian.net / ZCJ"
desde: 2026-11-16
---

# MODO — fuente de verdad del seguimiento de tareas

Este archivo es la bisagra de la dualidad workboard↔Jira (SEED-026; decisión del
operador en `fase-0-decisiones.md` §0.9) y lo comprueba `verify-workboard.mjs`:

- **`modo: local`** (estado temporal de arranque): el workboard local es la fuente
  de verdad de las tareas. La semilla ejerce presión de migración constante — el
  verificador, el hook pre-commit y el propio tablón lo recuerdan en cada entrega:
  migra a Jira cuanto antes (runbook `migrar-tareas-a-jira.md`). Con `jira:` declarado,
  `verify-jira.mjs` comprueba además la coherencia de los ítems activos contra sus
  issues (espejo) cuando hay credencial en el almacén de git; sin ella, modo degradado
  (avisa, no bloquea).
- **`modo: jira`**: las tareas viven en Jira (`jira:` declara site y proyecto).
  El workboard queda reducido a **punto de reglas maestras**: sin ítems activos,
  solo el histórico en `items/_done/` y este tablón congelado. Crear tareas aquí
  está bloqueado por el hook pre-commit; las reglas del corpus se siguen sí o sí.

**La semilla migró a modo jira el 2026-11-16** (SEED-028, runbook §Activación del
modo Jira): sus tareas viven en `sebastian-gsz.atlassian.net / ZCJ`; los destinos
que esta semilla planta arrancan en `modo: local` (andamio temporal con presión de
migración) — esa es la dualidad.

Decisión del operador (2026-11-16, «Opción 1»): sin token de API en el almacén de
credenciales — el check de coherencia corre en modo degradado permanente y la
verificación en vivo la hace el agente por MCP de Jira en cada sesión de trabajo
(decisiones §0.9, punto 5).
