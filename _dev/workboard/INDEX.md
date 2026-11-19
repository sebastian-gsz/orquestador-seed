# INDEX — tablón congelado · punto de reglas maestras

> **El seguimiento de tareas de este proyecto vive en Jira**: `sebastian-gsz.atlassian.net / ZCJ` (modo jira, `MODO.md`; decisión del operador §0.9). Crear/reclamar/cerrar tareas se hace directamente en Jira según el protocolo `agente` §Ciclo de tareas con Jira; crear ítems aquí está bloqueado por el hook pre-commit (SEED-026).
> Histórico completo de la migración (28 ítems, 2026-11-15/16): `items/_done/`. Tablero: https://sebastian-gsz.atlassian.net/browse/ZCJ

## Reglas maestras (se siguen sí o sí, en cualquier modo)

- **Principios inviolables**: [SEED.md §1](../../SEED.md) — la semilla no se negocia en destino.
- **Leyes universales**: [mapa maestro §4](../../fase-1-mapa-maestro.md) — aplican a todos los nodos.
- **Reglas anti-deriva**: [mapa maestro §5.1](../../fase-1-mapa-maestro.md) — entrega completa, alcance colateral, reconciliación de superficies externas.
- **Contrato del workboard**: [ARCHITECTURE](../../fase-5-workboard/ARCHITECTURE.md) — ciclo de vida, dualidad (§4.7) y coherencia con Jira (§4.8).
- **Protocolos**: `fase-6-dominios/protocolos/` — secretos (almacén), agente, datos, red, cómputo.
- **Verificación**: [fase-7-verificacion.md](../../fase-7-verificacion.md) — mecánica antes que relato: `verify-workboard.mjs`, `verify-jira.mjs`, `verify-mount.mjs`.
- **Hook pre-commit**: lo que debe pasar siempre se mecaniza (100%) — `fase-5-workboard/hooks/`.

Verificación (desde la raíz): `node fase-5-workboard/verify-workboard.mjs _dev/workboard` · `node fase-5-workboard/verify-jira.mjs _dev/workboard` · `node fase-5-workboard/verify-mount.mjs --self .`
