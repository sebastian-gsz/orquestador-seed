# Fase 7 — Verificación de montaje, prueba de fuego y desmontaje

> **Doctrina (SEED-022)**: la compleción del montaje es un **estado comprobado, no un relato**. Las verificaciones mecánicas las ejecuta código (`verify-mount.mjs`); la checklist de lectura queda mínima. Un montaje no está completo porque nadie sepa de lo contrario — está completo cuando el verificador sale 0.

## 7.1 Verificador de montaje (mecánico, por ejecución)

`fase-5-workboard/verify-mount.mjs` — copiable al destino junto a los demás módulos de F5. Comprueba **por código**, no por lectura:

| Check | Qué comprueba |
|---|---|
| (a) git | Repo git con ≥ 1 commit, árbol limpio, harness trackeado — la entrega inicial del montaje **es** un commit (decisión de F0, §0.8) |
| (b) hook | `core.hooksPath` configurado y hook pre-commit ejecutable — la capa determinista nace encendida y verificada |
| (c) workboard | `verify-workboard.mjs` con código 0 — items ↔ INDEX ↔ `_done` coherentes |
| (d) fidelidad | Copias mecánicas del destino idénticas (hash) a los módulos de la semilla en uso (`--seed`) |
| (e) referencias | Cero referencias internas colgantes — ningún material citado que no viaja con la semilla |
| (f) procedencia | Entrada de procedencia presente, con versión real de la semilla y fecha |
| (g) desmontaje | Estado de desmontaje registrado (procedencia con fecha; sin restos de la semilla en el destino) |

```bash
# En el destino (tras el montaje y en cada verificación posterior):
node verify-mount.mjs <raíz-del-destino> --seed <copia-de-la-semilla>
# La semilla se aplica lo que predica (self-check):
node verify-mount.mjs --self <raíz-de-la-semilla>
```

**Modos de fallo demostrados**: el verificador se demuestra contra los fallos observados en campo (sin commits, hook sin instalar, referencia colgante, desmontaje sin registrar, INDEX desincronizado) más los escenarios de la dualidad workboard↔Jira (SEED-026) y la coherencia ítem↔issue (SEED-027), con `node fase-7-evals/demo-modos-fallo.mjs` → código 0. Bloqueante en releases y montajes.

**Checklist de lectura** (lo que el código no puede juzgar, mínimo imprescindible): contratos sin backlog ni pendientes (criterio 6); cero secretos (11); cero referencias a la semilla fuera de la procedencia (15); exclusiones de F0 respetadas (13). Todo lo demás (commits, hook, INDEX, rutas de touches, fechas, runbooks al día) lo comprueba el código de 7.1 y del verificador del workboard.

## 7.2 Prueba de fuego (valida el harness end-to-end)

Ejecuta un ciclo completo de tarea con un ítem real y trivial — el montaje del propio harness en modo sembrar, o el último nodo pendiente del onboarding en modo parasitar:

1. Crear ítem `DOC-001 «Verificación de montaje del harness»` con 7.1 como `acceptance`, `class: agente` y `touches: [docs/]`.
2. Reclamarlo atómicamente (status + claimed_by + claimed_at + fila en `INDEX.md`).
3. Ejecutar `verify-mount` (código 0) y la checklist de lectura, anotando defectos en `decision_log` (corrigiéndolos en la misma entrega).
4. **El ítem no puede cerrarse con `verify-mount` en rojo** — la compleción del montaje es un estado comprobado; la evidencia del cierre incluye la salida literal del verificador.
5. Cerrar: evidencia, `closed_at`, limpiar claim, mover a `items/_done/`, quitar de `INDEX.md`.

**Diferibles con dueño**: las fases que pueden quedar pendientes tras la prueba de fuego (F4b, F6, la sesión de evals de comportamiento EVAL-1/3/4, el desmontaje) son **pendientes explícitas del workboard del destino con dueño declarado** — un ítem abierto cada una, nunca una omisión silenciosa. El montaje se considera completo cuando `verify-mount` sale 0 y cada diferible tiene su ítem con dueño; el desmontaje (§7.6) solo procede con los diferibles cerrados o cancelados.

## 7.3 Batería de evals autocontenida (repetible)

La prueba de fuego valida el montaje una vez; esta batería valida el **comportamiento** del harness tantas veces como cambie. **Vive en [`fase-7-evals/`](fase-7-evals/README.md) y viaja con la semilla**: su fixture mínimo (`make-fixture.mjs`) y sus escenarios EVAL-1..5 no dependen de ningún material externo. Sobre el fixture, nunca sobre un destino real.

- **Mecanizadas**: EVAL-2 (timebox vencido → violación del verificador) y EVAL-5 (misma entrega: el hook pre-commit impide commitar código sin contrato o INDEX desincronizado; `verify-mount` (c) lo repite fuera del ciclo de commit) + **EVAL-5 Jira** (`verify-jira.mjs` + hook paso 7: la deriva de cierre ítem↔issue con credencial bloquea el commit; degradado avisa) + la demo de modos de fallo.
- **De comportamiento** (con un agente sobre el fixture): EVAL-1 (ciclo completo sin preguntas de proceso), EVAL-3 (adversarial: sin claim no se toca producción), EVAL-4 (fuga de credenciales: un portador por servicio).

**Umbral**: EVAL-1 y EVAL-5 en verde son **bloqueantes** en releases **y también en montajes** (un montaje no queda completo sin la demo mecánica en verde); EVAL-3–4 pueden diferirse con justificación en el `decision_log` del ítem, y el diferido es ítem con dueño (§7.2).

## 7.4 Definition of Done del harness

> Un agente nuevo, leyendo **solo** `AGENTS.md → mapa maestro → contrato del nodo → workboard`, puede crear, reclamar, clasificar, ejecutar, sincronizar y cerrar una tarea sin hacer ninguna pregunta sobre proceso; y tras modificar comportamiento, actualiza el contrato afectado sin que se le pida.

Es el estado que **EVAL-1** verifica de forma repetible.

## 7.5 CI de la semilla

Cada release de la semilla exige en la entrega del ítem de release:

1. `node fase-5-workboard/verify-workboard.mjs _dev/workboard` en verde.
2. `node fase-5-workboard/verify-mount.mjs --self .` en verde — la semilla es determinista consigo misma: git limpio y commitado, hook activo y ejecutable, CHANGELOG ↔ tags coherentes desde la política de v2.0.0 (exención declarada: si el CHANGELOG porta el marcador `HISTORIAL-COMPRIMIDO` — historial comprimido por decisión del operador, [2.8.0] — la comparación se omite y el aviso aparece en la salida).
3. `node fase-7-evals/demo-modos-fallo.mjs` en verde — los modos de fallo siguen detectándose.
4. La sesión de evals de comportamiento (EVAL-1, y EVAL-3/4 si no estaban diferidas con dueño) registrada en la evidencia del ítem de release.
5. `CHANGELOG.md` actualizado.
6. `main` permanece intocado hasta que el operador integre (en el repo-semilla, el operador decide la integración directa en `main` — véase la corrección expresa de §5.3 en el decision_log de SEED-022).

## 7.6 Desmontaje de la semilla (principio 15)

La semilla fue **material de construcción**: se copió, jamás se enlazó. Al aprobarse 7.1–7.2 con los diferibles con dueño:

1. **Entrada de procedencia** en `docs/conocimiento/` (única traza permitida):
   > «Harness montado desde `orquestador-seed` vX.Y.Z el `<fecha ISO-8601>` en modo `<sembrar|parasitar>`. Sin dependencias hacia la semilla.»
2. **Re-verificar el criterio 15** después de escribir la entrada (es la excepción declarada; nada más debe aparecer).
3. **Borrar el directorio de la semilla** (el clon en el destino o junto a él).
4. Confirmar que el destino queda autónomo: red de contratos + workboard + protocolos, sin dependencias externas. `verify-mount` (f)(g) comprueba la procedencia y el desmontaje registrado por código.

Si el destino necesita re-montar, actualizar o auditar el harness en el futuro, se clona la semilla de nuevo (misma versión o mayor, según [CHANGELOG](CHANGELOG.md) de la semilla): nada dentro del destino recordará la sesión anterior.
