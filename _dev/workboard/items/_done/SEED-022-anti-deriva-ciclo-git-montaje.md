---
id: SEED-022
title: "Montaje determinista: capas de ejecución en código que verifican la compleción del montaje, de cada tarea y de todos sus componentes"
status: done
priority: P1
class: agente
regimen: produccion
timebox: null
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-30T21:55:00+01:00
updated_at: 2026-11-15T18:30:00+01:00
closed_at: 2026-11-15T18:30:00+01:00
closed_reason: "Completado: verify-mount.mjs con checks a-g demostrado sobre fixture, fase-7 mecánica con diferibles con dueño, batería de evals autocontenida, 4 checks de compleción en verify-workboard, reglas anti-deriva y git del montaje, semilla determinista consigo misma (self-check verde, corrección expresa de §5.3). Release v2.3.0."
touches:
  - fase-0-decisiones.md
  - fase-1-mapa-maestro.md
  - fase-5-workboard/README.md
  - fase-5-workboard/ARCHITECTURE.md
  - fase-5-workboard/verify-workboard.mjs
  - fase-5-workboard/verify-mount.mjs
  - fase-7-verificacion.md
  - SEED.md
  - CHANGELOG.md
blocks: []
blocked_by: []
acceptance:
  - "Nuevo verificador de montaje por ejecución (fase-5-workboard/verify-mount.mjs, copiable al destino): comprueba por código, no por lectura — (a) git: ≥ 1 commit, árbol limpio, harness trackeado; (b) core.hooksPath configurado y hook ejecutable; (c) workboard: verify-workboard.mjs con código 0; (d) fidelidad de las copias del destino contra la versión de semilla (hashes de módulos); (e) cero referencias internas colgantes (materiales citados que no viajan con la semilla); (f) entrada de procedencia presente con versión real; (g) estado de desmontaje registrado"
  - "F7 reorganizada alrededor del verificador de montaje: las verificaciones mecánicas de §7.1 se ejecutan por código (la checklist de lectura queda mínima); el ítem de prueba de fuego del destino no puede cerrarse con verify-mount en rojo — la compleción del montaje es un estado comprobado, no un relato"
  - "Definición de Done mecánica del montaje (F7): completo solo cuando verify-mount sale 0 y cada fase tiene su salida verificada registrada; las fases diferibles (F4b, F6, evals, desmontaje) quedan como pendientes explícitas del workboard del destino con dueño declarado, nunca como omisión silenciosa"
  - "Batería de evals autocontenida: la semilla incluye su propio fixture mínimo y los escenarios EVAL-1..5 (eliminada la dependencia de ai-evals.md del corpus, que no viaja con la semilla); EVAL-5 (misma entrega vía commit) bloqueante también en montajes, no solo en releases"
  - "La semilla es determinista consigo misma: aplica a su propio repo las capas que predica — self-check de montaje en verde, hook activo (ya instalado, se verifica), rama de integración develop conforme a su propio §5.3 o corrección expresa de esa regla, historial con commits verificables y CHANGELOG ↔ tag coherentes"
  - "verify-workboard.mjs ampliado con checks de compleción por tarea y sus componentes: cada ruta de touches existe en el repo; decision_log en el front-matter (rechaza bloques sueltos en el cuerpo); fechas plausibles (parámetro de año de nacimiento del destino); en runbooks, last_reviewed no anterior a la última fecha del documento"
  - "Reglas anti-deriva redactadas en fase-1 (§5 del mapa maestro) y fase-5-ARCHITECTURE (§4.3/§4.5): entrega completa = ítem + proyecciones + verificador + commit; alcance colateral = ampliar touches con decision_log antes de tocar cualquier estado documentado fuera de ellos; reconciliación de superficies externas = lectura de verificación del estado resultante en la misma entrega de toda operación con efecto real"
  - "Reglas de montaje actualizadas (fase-0 y fase-5 README): el estado git del destino (commit inicial + hooksPath) es decisión de F0 y paso obligatorio del montaje; su omisión bloquea F7"
  - "Demostración sobre fixture: el nuevo verify-mount detecta como fallo exactamente los modos observados en el informe de campo (montaje sin commits, hook sin instalar, referencia a material inexistente, desmontaje sin registrar)"
  - "Release con la mejora (CHANGELOG + tag) y verificadores en verde en _dev/workboard"
subtasks:
  - "[x] Construir fase-5-workboard/verify-mount.mjs y demostrarlo contra los modos de fallo del informe de campo (fase-7-evals/demo-modos-fallo.mjs: 5 modos + sano, exit 0)"
  - "[x] Reorganizar fase-7 alrededor del verificador de montaje: DoD mecánica, diferibles con dueño, cierre del ítem de prueba de fuego condicionado a exit 0"
  - "[x] Incluir fixture y escenarios EVAL-1..5 autocontenidos (fase-7-evals/); EVAL-5 bloqueante también en montaje"
  - "[x] Determinismo de la propia semilla: self-check en verde, corrección expresa de §5.3 (main directo por decisión del operador), CHANGELOG ↔ tags coherentes desde la política de v2.0.0"
  - "[x] Ampliar verify-workboard.mjs con los 4 checks de compleción por tarea (touches existentes, decision_log en front-matter, fechas plausibles, runbooks last_reviewed) — validados contra el workboard vivo"
  - "[x] Redactar reglas anti-deriva (fase-1 §5.1, fase-5-ARCHITECTURE §4.3.9/§4.5) y las reglas git del montaje (fase-0 §0.8, fase-5 README)"
  - "[x] Release: CHANGELOG + tag + verificadores en verde (v2.3.0)"
external:
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-34 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-10-30T21:55:00+01:00 · ZCode (agente del operador Sebastián) · Ítem creado por orden del operador tras auditar el destino oracle-erp (montaje v2.0.0 en modo sembrar el 2026-10-25): superó F7 con 16/16 y a los 5 días el harness estaba inerte (cero commits, hook sin instalar, INDEX desincronizado). Se aplica la doctrina de SEED-020: el informe de campo asciende a la semilla y la corrección de la mecánica viaja con la release."
  - "2026-10-30T22:31:00+01:00 · operador (J. Sebastián G. Sánchez) · Corrección de alcance: la semilla NO se encarga de arreglar destinos concretos — eso son tareas del propio destino (oracle-erp: DOC-003 en su workboard). Se retira la fase de propagación a destinos que este ítem incluía; el re-montaje o actualización de un destino ya montado es tarea del destino conforme a §7.6. El foco queda en: capas de ejecución en código que verifiquen la compleción de tareas y todos sus componentes, montajes que se completan como deben, y determinismo de la propia semilla."
  - "2026-11-15T16:01:55+01:00 · zcode · Claim por encargo del operador («Si», respuesta a la propuesta de reclamar tras cerrar SEED-021)."
  - "2026-11-15T18:30:00+01:00 · operador (J. Sebastián G. Sánchez) · Corrección expresa de §5.3 para el repo-semilla (alternativa prevista en la aceptación): el repo-semilla opera directamente sobre `main` con integración por decisión expresa del operador (así se ejecutaron v2.1.0, v2.2.0 y v2.3.0); la regla develop como rama de integración rige para los destinos y para trabajo multiagente en ramas feature. El self-check no exige develop en la semilla."
  - "2026-11-15T18:30:00+01:00 · zcode · [via-ascendente] no-asciende — el informe de campo (oracle-erp) ya vive como ítem del propio repo upstream (este ítem); abrir issue duplicaría el workboard del corpus. El destino oracle-erp tiene su corrección local (DOC-003)."
---

## Contexto

**Informe de campo** (destino: `oracle-erp`, montaje del 2026-10-25 en modo **sembrar**, semilla v2.0.0 — motivación, no alcance de este ítem):

El destino fue montado en el modo con máximo compromiso («el harness ES el arranque del repo»), superó la prueba de fuego con 16/16 criterios leídos (DOC-001 del destino) y a los 5 días el harness estaba **inerte y desincronizado**: cero commits (main en `0000000`, todo sin trackear), `core.hooksPath` sin configurar, `INDEX.md` desincronizado tras el cierre de OCI-002 (detectado por el verificador el 2026-10-30), regla de cloud documentada pero inexistente, y la batería de evals «diferida por diseño» porque `ai-evals.md` **no viaja con la semilla** (tampoco existe el fixture que §7.3 describe).

**Lectura de causa raíz (por qué la semilla no ata):**

1. La compleción se juzgó **por relato**, no por código: la F7 es una checklist de lectura que un agente marca a mano. Ninguna capa de ejecución comprueba que lo declarado completo lo está de verdad, con todos sus componentes.
2. La capa determinista (hook) es discrecional en el módulo fase-5 y ninguna verificación la comprueba después: la capa 100% nace apagada y nada la enciende.
3. No existe una **definición de Done mecánica del montaje**: fases diferibles (F4b, F6, evals, desmontaje) quedan diferidas sin dueño ni registro — el montaje «termina» cuando se acaba la sesión, no cuando su estado está verificado.
4. El verificador del workboard solo cubre items↔INDEX↔_done: la compleción de cada tarea con **todos sus componentes** (touches reales, decision_log bien ubicado, fechas plausibles, runbooks al día) no tiene check.
5. La propia semilla no es determinista consigo misma: referencia materiales que no lleva (ai-evals.md, fixture inexistente), no sigue su §5.3 (sin rama develop, historial aplastado en un único commit) y su CHANGELOG describe un proceso (tags, develop) que su git no muestra.

## Clasificación y protocolo

- **Clase de problema**: `agente` (ley 11) — el dominante es el procedimiento de montaje y la auto-verificación del propio agente.
- **Protocolo aplicado**: `fase-6-dominios/protocolos/agente.md` (auto-mejora del harness, regla 7; tríada de refuerzo: regla + check + hook + eval).
- **Umbrales especializados**: ninguno — defaults canónicos.

## Notas

- **Frontera de responsabilidad**: este ítem corrige exclusivamente la semilla (procedimiento de montaje + su propio repo). Los arreglos de un destino concreto son tareas del destino: oracle-erp ya abrió el suyo (DOC-003 en su workboard, 2026-10-30). Un destino ya montado se actualiza re-clonando la semilla conforme a §7.6 — por eso NO hay fase de propagación aquí (decisión del operador en el decision_log).
- **Canal ascendente (SEED-020)**: segunda instancia del canal (hallazgo de destino → corrección de raíz en la semilla → release). Si el operador aprueba allí el formato de issue, este informe se reutiliza.
- Los checks del verificador de montaje deben ser deterministas: sin red, sin estado externo, salidas idénticas ante el mismo árbol (ley 4 del mapa maestro).
- «Determinista» para la propia semilla significa: su estado (git, hook, workboard, evals) es comprobable por código en cualquier momento, sin depender de la memoria de ningún agente.

## Evidencia (al cierre)

Cierre 2026-11-15 — ejecutado por zcode por orden del operador. El self-check detectó deriva REAL en la propia semilla durante la construcción (14 violaciones iniciales: enlaces colgantes `../ARCHITECTURE.md` en contratos que describían un layout de destino inexistente en el repo-semilla, CHANGELOG declarando tags v1.x imposibles) — la tesis del ítem demostrada sobre su propio sujeto.

- **`verify-mount.mjs`** ✔ (nuevo, fase-5-workboard/): checks (a)–(g) por ejecución; modos `--self` (semilla) y destino con `--seed` (fidelidad por hash de módulos mecánicos). Enlaces de contratos-semilla resueltos contra la proyección destino (SEED.md §copiado) — determinista, sin red, sin dependencias.
- **Demostración sobre fixture** ✔ — `fase-7-evals/demo-modos-fallo.mjs`: fixture sano aceptado (exit 0) y cada modo de fallo observado en campo detectado con su violación exacta: sin commits, hook sin instalar, referencia colgante, desmontaje sin registrar, INDEX desincronizado. Salida: «DEMOSTRACIÓN COMPLETA».
- **`verify-workboard.mjs` ampliado** ✔ — 4 checks de compleción: (1) `decision_log` en front-matter (activo; prospectivo — los archivados SEED-002/009 cerraron bajo el SCHEMA antiguo y no se retoca la historia), (2) fechas plausibles (env `VERIFY_WB_MIN_YEAR`), (3) rutas de `touches` existentes (ítems in_progress), (4) runbooks con `last_reviewed` ≥ última fecha del documento. Validados contra el workboard vivo (detectaron el touches aún inexistente de este ítem antes de crear verify-mount).
- **fase-7 reorganizada** ✔ — §7.1 centrada en `verify-mount` (tabla a–g + checklist de lectura mínima de 4 criterios); §7.2 con cierre condicionado a exit 0 y **diferibles con dueño**; §7.3 autocontenida; §7.5 CI ampliada (self-check + demo + CHANGELOG↔tags).
- **Batería autocontenida** ✔ — `fase-7-evals/` (README con EVAL-1..5, `make-fixture.mjs`, `demo-modos-fallo.mjs`); eliminada la dependencia de `ai-evals.md` del corpus (referencias actualizadas en CHANGELOG/SEED-011 — históricas, no viajan); EVAL-5 bloqueante también en montajes.
- **Anti-deriva** ✔ — fase-1 §5.1 (3 reglas); fase-5 ARCHITECTURE §4.3.9 (alcance colateral) y §4.5 (entrega completa + verify-mount en cierre); fase-0 §0.8 (estado git del montaje, decisión de F0, tabla de resultado ampliada); fase-5 README (hook como paso obligatorio, check 4 de remotos).
- **Determinismo de la semilla** ✔ — enlaces colgantes reales corregidos (los contratos enlazaban a `docs/ARCHITECTURE.md` inexistente en el repo-semilla; ahora el check (e) resuelve vía proyección destino y el material proyectado viaja); CHANGELOG ↔ tags coherentes desde la política de v2.0.0 (documentada en la propia entrada); hook con bit de ejecución verificado; corrección expresa de §5.3 en decision_log.
- **Release** ✔ — CHANGELOG `[2.3.0] — 2026-11-15` + tag v2.3.0; `verify-workboard.mjs` en verde; `verify-mount --self` en verde tras el commit; `demo-modos-fallo.mjs` exit 0.
- **Principio 10**: sin secretos; sin valores de tokens.
- **Nota de entrega**: trabajo documental/mecánico directo en `main` por decisión del operador (corrección expresa de §5.3 en decision_log).
