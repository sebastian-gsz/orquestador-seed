# CHANGELOG — orquestador-seed

Formato: [SemVer](https://semver.org/lang/es/) — mayor: cambios incompatibles en las plantillas; menor: módulos o reglas nuevas; parche: correcciones. La entrada de procedencia que cada destino registra en su dominio de conocimiento cita la versión de semilla usada.

## [2.0.0] — 2026-10-24

**Integración estable**: primera fusión de la línea `develop` (v1.2.0–v1.8.0) en `main`. El corpus completo llega a la línea estable: fases 0–7, plantillas de contratos, 5 protocolos canónicos, workboard vivo con 19 ítems archivados, capa determinista (hook pre-commit), batería de evals de comportamiento y metodología de ramas por feature con fusión multi-feature.

- Marcador pre-integración: tag `v2.0.0-rc.1` sobre el estado anterior de `main` (contenido v1.1.0 del corpus).
- Incluye todo lo documentado en las entradas v1.2.0 … v1.8.0 de este CHANGELOG.
- Política a partir de aquí: `develop` es la rama de integración (§5.3); `main` recibe solo fusiones aprobadas expresamente por el operador, etiquetadas como release.

## [1.8.0] — 2026-10-24

**Metodología de ramas por feature**: cierre de la fase de fusión multi-feature (el ciclo ya cubierto: claim → rama canónica → worktree → trabajo aislado → PR; lo que faltaba era lo que pasa al fusionar).

- **Rama de integración** (§5.3): `develop` — los PR se abren contra ella; `main` solo por decisión expresa del operador. Hasta ahora esta regla vivía en la práctica, no en el corpus.
- **Fusiones serializadas**: una a la vez; toda fusión termina con el verificador en verde (hook local en el commit de fusión; verificador antes de fusionar vía plataforma).
- **Conflictos de `INDEX.md`**: esperados por diseño (todos los ítems lo editan); se resuelven por **unión de filas** — jamás se pierde una fila — y el verificador valida el resultado: si el índice no coincide con los ítems activos, la fusión no pasa.
- **Ramas estancadas**: sincronizar con la rama de integración antes de abrir el PR y tras fusiones ajenas que toquen tus archivos — el «stale checkout» que advierte el corpus (`ai-agent-orchestration.md` §Problem 3).
- README: convención ítem→rama→PR ampliada de 4 a 5 puntos.

## [1.7.0] — 2026-10-24

**Regla de datos crudos en depuración** (tip 13 del corpus, incorporado por criterio de coste del operador: el ciclo verbal de adivinanza cuesta más — contexto, re-lecturas y ediciones por iteración fallida — que un pegado crudo).

- **Nueva regla 9** en `protocolos/agente.md`: «Datos crudos, no interpretaciones» — el ciclo de depuración completo (el agente instrumenta → se ejecuta → la salida cruda vuelve al agente íntegra), la prohibición de resumir/interpretar el fallo, y la regla inversa (si falta información, se pide la salida cruda; no se inventa).
- **Defaults**: salida íntegra al agente — se recorta ruido, nunca las líneas del error.
- **Antipatrón nuevo**: describir un fallo con palabras y dejar que el agente adivine.
- **Refuerzo de tríada incidental**: `.gitattributes` con `eol=lf` para los hooks (`*.sh` y `fase-5-workboard/hooks/*`) — un checkout con `autocrlf` convertía el shebang `#!/bin/sh\n` en `#!/bin/sh\r` y el hook dejaba de ejecutarse («cannot exec»); documentado en el README de la capa determinista.

## [1.6.0] — 2026-10-24

**Capa determinista**: hooks nativos de git + restauración del test first mode (de la serie de tips IDE/agentes del corpus).

- **Hook `pre-commit` del workboard** (`fase-5-workboard/hooks/pre-commit`): instalación con `git config core.hooksPath docs/workboard/hooks` (una vez por clon, la decide el operador). Bloquea en el commit, sin depender de la memoria del agente: workboard inválido (ejecuta el verificador si `items/` existe), commits con `worktrees/` o `.env` (§5.1, principio 10), y secretos obvios en el diff (patrones sk-/ghp_/github_pat_/AKIA/xox/PRIVATE KEY; best-effort — el grep exhaustivo sigue siendo el criterio 11 de F7). En el repo-semilla verifica además la instancia viva `_dev/workboard`. Degradación con aviso si no hay `node`. Probado en fixture con 5 casos y códigos de salida: montaje limpio → aprobado; INDEX desincronizado → **bloqueado** (la clase de fallo que ocurrió 3 veces durante la construcción); workboard válido → aprobado; `.env` → bloqueado; secreto → bloqueado.
- **Principio de la capa** (tip 38, adoptado como regla 10 del contrato del workboard): *lo consultivo vive en los contratos (~80% de cumplimiento esperado); lo que debe pasar siempre se mecaniza (100%)*.
- **Tríada ampliada a cuádruple** (mapa §5 + `agente.md` regla 7): regla | check | **hook** | eval.
- **Test first mode restaurado** (§6.4 de la plantilla de fruto) — estaba en el blueprint de origen y se perdió en la modularización v1.0.0: tests primero hasta verde en features no triviales; en regresiones, un test que reproduce el bug antes del fix.
- El hook está **instalado en la propia semilla** (`core.hooksPath`): los commits de desarrollo verifican `_dev/workboard` automáticamente — primer commit bajo el hook: el cierre de SEED-013.

## [1.5.0] — 2026-10-24

**Evals del harness**: la capa de evaluación del corpus (`ai-evals.md`) aplicada al propio harness — el instrumento de medida que falta para editar el harness sin hacerlo a ciegas.

- **Batería de evals de comportamiento** (nueva §7.3 de la Fase 7): 5 escenarios repetibles sobre repo-fixture — EVAL-1 ciclo completo (reference-based), EVAL-2 exploración y caducidad (code-based), EVAL-3 adversarial (red team), EVAL-4 fuga de credenciales (reference-based), EVAL-5 misma entrega (code-based). *Cada issue del harness se convierte en una eval nueva*; corren tras cada release y al montar destinos.
- **Umbral de release**: EVAL-1 y EVAL-5 bloqueantes; EVAL-2–4 diferibles con justificación en el `decision_log`.
- **Tríada de refuerzo** (§5 del mapa maestro + `agente.md` regla 7): cada violación del harness corregida a mano deja preventivamente una **regla**, un **check** del verificador o una **eval** de la batería — si el fallo puede repetirse, no se corrige solo una vez.
- **CI de la semilla** (nueva §7.5): cada release exige verificador verde, batería ejecutada o justificada, y CHANGELOG; `main` intocado hasta integración del operador.
- DoD (§7.4) ligada a EVAL-1; desmontaje renumerado a §7.6.

## [1.4.0] — 2026-10-24

Regímenes de trabajo: **exploración con graduación** y **realismo por defecto** (de la doctrina de prototipado con IA del corpus).

- **Régimen exploratorio** (§4.6 del contrato del workboard): ítems `EXP-###` — trabajo barato y acotado cuyo producto es un **aprendizaje**, no un entregable. Disparadores (pregunta, descartable, nada prometido); `timebox` obligatorio y **vencido = violación** del verificador; sin `touches` estrictos ni checklist de PR; ejecutado en worktree desechable (§5.1). Tres cierres: **promoción** (solo el operador autoriza el ítem de producción — el código experimental migra por el ciclo normal, nunca directamente), **descarte** (el aprendizaje negativo se archiva y evita repetir el experimento) y **caducidad** (`closed_reason: caducado sin respuesta`).
- **Principio 17** (SEED.md): «Explora barato, promueve con autoridad» — 17 principios.
- **Realismo por defecto** (M2): la aceptación de todo ítem que cree o modifique un flujo incluye al menos un camino no feliz (entrada inválida, fuente caída, resultado vacío); recordatorio en `_template-item.md` y viñeta «Realismo» en la §6.2 de la plantilla de fruto — un flujo solo probado en su camino feliz no está validado.
- **Adopción graduada** (M3): las primeras tareas de un destino recién montado pueden nacer como exploración y graduarse — documentado en §4.6.6 y en el cierre del onboarding (F4).
- **Verificador** (`verify-workboard.mjs`): valida `regimen` (EXP- ⟺ exploracion), `timebox` ISO en exploraciones y exploración activa con timebox vencido como violación. Probado con fixtures válidos e inválidos.
- **Presupuesto de lecturas** (`protocolos/agente.md`): sin tope fijo en exploración — el límite es el timebox.

## [1.3.0] — 2026-10-24

Estándar de seguridad: **aislamiento de credenciales por servicio** (credential scoping — mínimo privilegio aplicado a los secretos).

- **Nuevo protocolo `protocolos/secretos.md`** (transversal — se activa por presencia de un secreto, no por cuello de botella): la regla en una frase («un secreto pertenece a exactamente un servicio: viaja únicamente en las peticiones dirigidas a ese servicio, y en ninguna más»), árbol de decisión con ejemplo anti-patrón/correcto, los tres vectores de fuga (logs de terceros, redirecciones con cabeceras personalizadas, intermediarios), tabla de decisión por situación, compañeros inseparables (variables de entorno, jamás en logs, siempre HTTPS) y auditoría reproducible («test de los dos greps»).
- **Doble consulta obligatoria**: la clasificación «clasifica antes de implementar» manda ahora consultar `secretos.md` además de la clase dominante cuando la tarea crea, transporta o consume un secreto; `red.md` referencia el protocolo en sus reglas de credenciales/sesión.
- **Principio 10 ampliado** (SEED.md): los secretos no solo están fuera de ítems, contratos y logs — en el código viajan aislados por servicio.
- **Plantilla de tronco** (§5 Entorno): cada secreto pertenece a exactamente un servicio y solo viaja en las llamadas hacia ese servicio.
- README de la semilla y criterio 14 de la F7 actualizados a 5 protocolos (datos, red, cómputo, agente, secretos).

## [1.2.0] — 2026-10-24

Orquestación operativa: ciclo de vida de worktrees, recursos locales, entorno codificado y plano de control git (cierre de los 4 huecos de la auditoría corpus).

- **Ciclo de vida del worktree** (§5.1 del contrato del workboard): convención obligatoria `worktrees/<ID>-<slug>/` (`worktrees/` en `.gitignore`), creación al reclamar junto con la rama, `remove`/`prune` al cerrar, `--force` al cancelar, y verificación de huérfanos en el cierre y en la checklist de montaje (nuevo criterio 16). Referenciada desde `protocolos/agente.md` (regla 8).
- **Aislamiento de recursos locales** (§5.2): port plan declarado en las Notas del ítem consultando `INDEX.md`, procesos trazados y liberados al cierre, techo de concurrencia (≤3) y cleanup de procesos zombie por el siguiente claim.
- **Entorno reproducible codificado**: nueva §5 en la plantilla de tronco (herramientas, versiones, setup ejecutable desde cero; «si un tool no está declarado, no existe») y punto 9 del protocolo topológico; los frutos heredan.
- **Convención ítem → rama → PR**: rama `<tipo>/<ID>-<slug>` creada al reclamar, PR titulado `(<ID>) <título>` y enlazado en `external`, entrega directa solo para documentación trivial, checklist de PR en la plantilla de fruto (§6.3) y paso de cierre git en el contrato del workboard (§4.5 pasa a 8 pasos).
- **Instancia viva**: `_dev/workboard/` — la semilla usa su propio harness para desarrollarse (ítems `SEED-00x` ejecutados con claim, evidencia, verificador y cierre; validación mecánica en verde en cada entrega).

## [1.1.0] — 2026-10-23

Diagnóstico estructural del parasitaje:

- **Nuevo módulo `fase-4b-diagnostico.md`**: tras contratar un tronco, evalúa *cómo está construido* (modularidad, DRY demostrable, testeabilidad, dirección de dependencias) con la rúbrica de las leyes universales del mapa maestro. Cubre el hueco del parasitaje en repos monolíticos o poco abstraídos: la contratación documenta lo que existe, el diagnóstico detecta lo que debería cambiar.
- **Hallazgos = ítems del workboard**: cada hallazgo con evidencia se registra como ítem de mejora (`open`, prioridad `P2` por defecto, propuesta como recomendación — autoría ≠ aprobación). El diagnóstico no refactoriza ni edita contratos; los ítems quedan como el primer backlog real que el operador triaja y ejecuta tras el montaje.
- **Grafo de código como acelerador opcional**: integración documentada de [CodeGraph](https://github.com/colbymchenry/codegraph) (índice local `.codegraph/`, MCP vía `codegraph serve --mcp`, consultas `impact/callers/callees/affected` por hallazgo). Cero dependencia: sin grafo, evidencia = mapas de los contratos + auditoría manual acotada (≤ 3 archivos por sospecha). El índice de la herramienta queda excluido por el principio 16.
- **Honestidad de capacidades**: el grafo cubre dependencias, llamadas e impacto; no detecta duplicación ni código muerto en bloque — documentado como límite, con vías alternativas (herramienta dedicada opcional, auditoría por sospecha).
- **Guardas anti-inundación**: sin evidencia no hay hallazgo; DRY solo con ≥ 2 usos reales; nada de mega-refactors (descomposición en ítems pequeños); el agente no se autoasigna P0/P1; > ~10 hallazgos por tronco ⇒ reporte sistémico como un solo ítem.
- **Momento**: por tronco, justo tras cerrar su onboarding (nunca se diagnostica un nodo sin contrato). F4 y F4b referenciadas entre sí.

## [1.0.0] — 2026-10-23

Primera versión de la semilla modular (rediseño del `BLUEPRINT-ORQUESTADOR.md` monolítico):

- **Modularización**: manifiesto `SEED.md` + un módulo por fase (0–7); cada fase es ejecutable en sesión propia.
- **Doble modo**: sembrar (repo vacío) vs parasitar (repo lleno, sin tocar producto), con criterio verificable en Fase 0 y reordenamiento de dependencias (el workboard se monta antes del onboarding: el parasitaje se ejecuta sobre el tablero que instala).
- **Correcciones de brechas**:
  - B1 — el stub `AGENTS.md` incorpora esenciales inline (regla de oro, leyes críticas, permisos), sin perder el ≤45 líneas ni la redirección al mapa maestro.
  - B2 — ley universal de verificación por archivo (tipo/formato/lint/test de un archivo; build completo solo a petición) + sección en la plantilla de fruto.
  - B3 — regla de aislamiento físico: agente paralelo ⇒ worktree propio.
  - B4 — `verify-workboard.mjs` pasa de extensión opcional a parte del kit; validación mecánica `items/ ↔ INDEX.md ↔ _done/` integrada al contrato del workboard.
  - B5 — regla de auto-mejora: segunda vez que un agente repite el mismo error ⇒ nueva regla/antipatrón en la misma entrega.
- **Nuevo dominio de protocolos** (`fase-6-dominios/protocolos/`): datos, red, cómputo y agente, con patrones canónicos de fábrica y especialización de umbrales por nodo solo con evidencia. Ley nueva «clasifica antes de implementar».
- **Notificación ascendente minimal**: formalizada como principio y como parte de la ley de enrutamiento (una fila de ruteo hacia el padre; el detalle jamás asciende ni se propaga a hermanos).
- **Exclusión de artefactos de herramienta**: inventario y contratación excluyen VCS, dependencias, builds, cachés de sesión y assets sin lógica propia.
- **Autodestrucción**: paso de desmontaje en la Fase 7 con verificación de «cero referencias a la semilla»; única traza permitida: entrada histórica en el dominio de conocimiento.
