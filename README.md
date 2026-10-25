# orquestador-seed

Semilla modular que convierte cualquier repositorio en un **harness documental orquestado**: una red de contratos `ARCHITECTURE.md` navegable por hipervínculos, un workboard con claims atómicos y reglas de sincronización obligatorias. No es software: es una red de contratos + un tablero de trabajo + protocolos de decisión. Todo es documentación y proceso (Git + Markdown), sin dependencias ni hooks.

## Qué resuelve

| Fallo típico de agentes | Mecanismo que lo elimina |
|---|---|
| Leer código "a ciegas" y operar con contexto incorrecto | Red de contratos `ARCHITECTURE.md`; prohibición explícita de abrir código antes del contrato |
| Dos agentes ejecutan la misma tarea o se pisan archivos | Claims atómicos en el workboard; un claim activo por agente; `touches` delimitados; worktree propio por agente |
| Olvidar actualizar documentación tras cambiar código | Regla de la **misma entrega**: código + contrato + ítem + índice, siempre juntos |
| Backlog disperso en conversaciones y listas externas | Fuente única de pendientes: `docs/workboard/` |
| Decisiones y evidencia perdidas al cerrar una sesión | `decision_log` y evidencia dentro del ítem; los ítems cerrados se archivan, nunca se borran |
| Deriva documental (contratos obsoletos) | "Un nodo obsoleto es un bug": mantenimiento contractual obligatorio en la misma entrega |
| Consumo descontrolado del agente | Protocolos de optimización y reglas de pensamiento: presupuesto de lecturas, clasificación del problema, stop conditions |
| Secretos filtrados en documentación | Prohibición explícita + revisión antes de publicar |
| La exploración muere por ceremonia — o contamina por ausencia de ella | Régimen exploratorio `EXP-` con timebox: el producto es un aprendizaje archivado; solo el operador promueve a producción |

## Dos modos de despliegue

| Modo | Cuándo | Qué hace la semilla |
|---|---|---|
| **Sembrar** | Repo vacío o sin contratos | Es el contenido fundacional: crea mapa maestro, stub, workboard y los troncos que dictate la visión del producto. Todo nodo nace `contract`. |
| **Parasitar** | Repo con código de producto | Nunca toca código. Inventario de troncos reales → ítems de onboarding por dominio en el workboard → contratación top-down con las plantillas. El montaje entero se ejecuta respetando las reglas que instala. |

En parasitaje, la **[Fase 4b — diagnóstico estructural](fase-4b-diagnostico.md)** añade el paso que la contratación no cubre: evaluar *cómo está construido* (modularidad, DRY, dirección de dependencias) con la rúbrica de las leyes universales y evidencia por grafo de código (CodeGraph como acelerador opcional, sin dependencia), convirtiendo cada hallazgo en un ítem de mejora del workboard — el primer backlog real que el operador triaja y ejecuta después del montaje, sin tocar código ni contratos durante él.

## Cómo usar

1. Clona esta semilla junto al repo destino (o dentro, en un directorio temporal).
2. Lee [SEED.md](SEED.md) — el manifiesto define modo, principios y orden de fases.
3. Ejecuta las fases 0→7 (una sesión de agente por fase, o manual).
4. Al aprobar la Fase 7, ejecuta el **desmontaje**: la semilla se borra sin dejar dependencias ni referencias (los módulos se copian, jamás se enlazan).

## Estructura

```text
orquestador-seed/
├── SEED.md                  # Manifiesto: principios, modos, mapa de módulos, desmontaje
├── fase-0-decisiones.md     # Modo, operador, inventario, prefijos, leyes de stack
├── fase-1-mapa-maestro.md   # Plantilla del mapa central (12 leyes universales)
├── fase-2-stub-agents.md    # Plantilla del stub con esenciales inline
├── fase-3-plantillas/       # trunk / branch / fruit + protocolo topológico
├── fase-4-onboarding.md     # Modo parasitar: inventario → ítems stub → contratos
├── fase-4b-diagnostico.md   # Diagnóstico estructural post-contratación → ítems de mejora (opcional)
├── fase-5-workboard/        # Contrato + SCHEMA + INDEX + plantilla de ítem + verificador CI
├── fase-6-dominios/         # runbooks · conocimiento · protocolos (datos/red/cómputo/agente/secretos)
├── fase-7-verificacion.md   # Checklist, prueba de fuego y desmontaje de la semilla
└── _dev/workboard/          # Workboard vivo de desarrollo de la propia semilla
```

`_dev/workboard/` es la instancia viva del harness: la semilla se desarrolla a sí misma con sus propias reglas (ítems `SEED-00x`, contrato canónico en `fase-5-workboard/`). No forma parte del material que se copia al destino.

## Protocolos de optimización

La semilla trae de fábrica cinco protocolos canónicos — agnósticos al lenguaje, en formato de árbol de decisión con defaults y parámetros especializables — bajo `fase-6-dominios/protocolos/`:

- `datos.md` — streaming vs batch, chunking, windowing, deduplicación, ledgers reanudables.
- `red.md` — reintentos con backoff + jitter, rate limits, idempotencia, caché, sesiones.
- `computo.md` — medir antes de optimizar, concurrencia vs paralelismo, GPU, memoria.
- `agente.md` — reglas de pensamiento: presupuesto de lecturas, clasificación del problema, stop conditions, auto-mejora del harness.
- `secretos.md` — aislamiento de credenciales por servicio: un secreto viaja únicamente a su servicio; test de auditoría de los dos greps.

La ley universal *«clasifica antes de implementar»* obliga a declarar la clase de problema de cada ítem (`datos | red | cómputo | agente`) y a registrar la elección en el `decision_log`. Si la tarea maneja secretos, consulta además `secretos.md`. Los umbrales se especializan por nodo solo con caso real medido.

## Origen y respaldo

Destilada del harness pionero `arc-aluminium-erp` (donde nació el BLUEPRINT-ORQUESTADOR monolítico que esta semilla modulariza) y contrastada con las buenas prácticas del corpus builder.io (auditoría de octubre de 2026: mapa de dimensiones y secciones testigo). Versionado en [CHANGELOG.md](CHANGELOG.md) con tags `vX.Y.Z`; la traza de montaje en el destino cita la versión usada.
