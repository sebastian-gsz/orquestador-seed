---
id: SEED-020
title: "Autocorrección ascendente: hallazgos de destinos → issues del repo oficial"
status: done
priority: P2
class: agente
regimen: produccion
timebox: null
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-25T02:10:00+02:00
updated_at: 2026-10-31T03:22:00+01:00
closed_at: 2026-10-31T03:22:00+01:00
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-6-dominios/protocolos/agente.md
  - fase-6-dominios/runbooks/
  - fase-1-mapa-maestro.md
  - fase-7-verificacion.md
  - SEED.md
  - CHANGELOG.md
blocks: []
blocked_by: []
acceptance:
  - "Debate resuelto por el operador: ¿se incorpora la vía ascendente (destino → issue en el repo oficial) al corpus? ¿En qué forma y con qué formato mínimo de issue?"
  - "Si se aprueba: regla redactada en el corpus — mapa maestro §5 (cuádruple de refuerzo + issue ascendente), protocolo agente (auto-mejora) y/o contrato del workboard, con el formato de issue: qué pasó · evidencia · corrección local aplicada · propuesta de mejora · destino y versión de semilla"
  - "Si se aprueba: primera issue real abierta en el repo oficial con el caso de este ítem (duplicado de closed_at)"
  - "Release del corpus con la mejora (CHANGELOG vX.Y.Z + verificador en verde en _dev/workboard)"
subtasks:
  - "[x] Debate del operador: adoptar la vía ascendente (2026-10-31 — canal sugerido como ítem permanente, opt-out por cancelación, credencial en almacén git)"
  - "[x] Redactar la regla y el formato de issue (SEED.md §0.1/§6.7/§1.15, mapa §5, protocolo agente regla 7 + antipatrón, contrato §3.11/§3.12, SCHEMA, README, F7 criterio 17)"
  - "[x] Mecánica del canal: canal.md + open-issue.mjs + checks del verificador (demostrados sobre fixture: 6 rutas, rojo/verde según disposición) + runbook de credencial"
  - "[x] Abrir la issue del caso closed_at y enlazarla en external (issue #1, abierta con la identidad del canal — cuenta secundaria projekte-uhm)"
  - "[x] Release con la mejora (CHANGELOG v2.1.0 + tag v2.1.0 + verificador en verde en _dev/workboard)"
external:
  - https://github.com/sebastian-gsz/orquestador-seed/issues/1
  - https://sebastian-gsz.atlassian.net/browse/ZCJ-32 (issue Jira de la migración, prueba final 2026-11-15)
decision_log:
  - "2026-10-25T02:10:00+02:00 · operador (J. Sebastián G. Sánchez) · Ítem creado por orden del operador tras el montaje de gsc-server (v2.0.0, modo parasitar, 2026-10-25): el hallazgo de aquel destino no debe quedar solo en workboards locales; la propuesta es que ascienda como issue al repo oficial."
  - "2026-10-25T02:25:00+02:00 · operador (J. Sebastián G. Sánchez) · Decisión: el refuerzo local (regla en el SCHEMA del workboard de gsc-server) se retira — un defecto de mecánica del corpus no es asunto del destino. El hallazgo y su solución viven exclusivamente en esta vía ascendente (este ítem); la corrección definitiva para futuros destinos llega con la release que la incorpore."
  - "2026-10-31T02:31:16+01:00 · operador (J. Sebastián G. Sánchez) · Se aprueba la vía ascendente (resuelve el primer criterio de aceptación). Forma decidida por el operador: el canal se **sugiere** en cada montaje como ítem permanente del workboard del destino («Configurar el canal de issues ascendentes», creado por F5, ambos modos), sin bloquear el montaje; la credencial (cuenta secundaria de GitHub, PAT con permiso de escritura de issues en repositorios externos) se **sugiere** con el runbook correspondiente y vive en el almacén de credenciales de git, fuera del repo; al cerrarse el ítem del canal, el canal queda activo (canal.md con el repo upstream). El opt-out es la cancelación del ítem con motivo — decisión explícita, nunca omisión. La issue se abre con la identidad de la cuenta secundaria. La enmienda del principio 15 (el canal es la segunda traza permitida junto a la procedencia) queda aprobada con esta decisión."
  - "2026-10-31T02:31:16+01:00 · zcode · Ampliación de alcance trazable (contrato §4.3.2), por instrucciones del operador de hoy: se añaden a touches `fase-1-mapa-maestro.md` (el mapa §5 recoge el canal), `fase-7-verificacion.md` (criterio 17 de la checklist) y `fase-6-dominios/runbooks/` (runbook de creación de la credencial). Sin conflicto con SEED-022 (toca fase-0/fase-7): no está reclamado; trabajará sobre los archivos actualizados."
  - "2026-10-31T02:31:16+01:00 · zcode · Nota de diseño: en un harness de archivos + verificadores no hay eventos push — la «activación» del canal al completar el ítem se materializa como estado comprobado: el cierre escribe `canal.md` (upstream) y ese estado es lo que `open-issue.mjs` y el verificador comprueban en cada ejecución. Misma garantía, cero magia."
---

## Contexto

**Informe de campo** (destino: `mcp-server-gsc` / gsc-server, montaje del 2026-10-25 en modo parasitar, semilla v2.0.0):

### Problema encontrado

Al cerrar ítems (`done`), la edición del front-matter añadía líneas nuevas de `closed_at`/`closed_reason` **sin sustituir** las `null` existentes. Con claves duplicadas, el parser del verificador se queda con la **última** ocurrencia (`null`) y reporta «cerrado sin closed_at» (exit 1). Ocurrió dos veces en la misma sesión; lo detectó el propio verificador.

### Solución aplicada localmente (refuerzo preventivo)

Regla nueva en el SCHEMA del workboard del destino (`docs/workboard/SCHEMA.md`, regla de la sección «Reglas»): *«Al cambiar el estado a done/cancelled, sustituye las líneas existentes de closed_at/closed_reason; jamás añadas una segunda ocurrencia del campo. Con claves duplicadas el verificador lee la última (null) y reporta "cerrado sin closed_at"»*. Evidencia completa en el ítem DOC-001 (`items/_done/`) de ese destino.

- Estado del refuerzo local: esta regla fue retirada del destino el 2026-10-25 por decisión del operador (ver `decision_log`) — la corrección definitiva viaja con el corpus.

### Propuesta del operador — automatizar la automejora vía repo oficial

Cuando un destino (parásito o siembra) encuentre una errata o una mejora del corpus, **no debe quedar solo en el workboard local** (ni el del destino ni el de la semilla): se levanta una **issue en el repo oficial** de la semilla explicando qué pasó, con la evidencia y cómo puede mejorar el corpus. La issue abre el **debate primero** — ¿el hallazgo es real? ¿la mejora es necesaria? — y, si se acepta, la corrección entra en la siguiente release. Así el sistema se autocorrige de forma continua y centralizada: cada destino corregido alimenta al corpus y **todos los destinos futuros nacen con el fix**.

Alternativas consideradas: (a) solo refuerzo local — descartada: el aprendizaje muere al borrar la semilla o se queda aislado en un destino; los siguientes montajes reproducen la misma errata; (b) solo workboard de la semilla — descartada: el hallazgo llega sin el contexto del destino real y no deja traza consultable abierta al debate. La vía elegida es complementaria al refuerzo local inmediato (que sigue aplicando en el destino en la misma entrega): el refuerzo local mitiga hoy; la issue institucionaliza el aprendizaje mañana.

## Clasificación y protocolo

- **Clase de problema**: `agente` (ley 11 del mapa maestro).
- **Protocolo aplicado**: `fase-6-dominios/protocolos/agente.md` (auto-mejora del harness, regla 7) — este ítem extiende su cuádruple de refuerzo con la vía ascendente propuesta.
- **Umbrales especializados**: ninguno — defaults canónicos.

## Notas

- La issue del caso closed_at quedó **pendiente de abrir** contra `sebastian-gsz/orquestador-seed` (origin) hasta que el operador apruebe la vía ascendente — no se abren issues sin decisión expresa.
- Si se aprueba, evaluar también el flujo inverso de trazabilidad: la release que cierra la issue referencia al destino que la reportó (sin secretos, principio 10).
- El refuerzo local del caso (regla SCHEMA en gsc-server) fue aplicado durante el montaje y **retirado el 2026-10-25 por decisión del operador** (ver `decision_log`): este ítem es la única vía viva del hallazgo. La solución para futuros destinos llega con la release del corpus.

## Evidencia (al cierre)

- **Debate resuelto** (criterio 1): decisión del operador del 2026-10-31 en `decision_log` — vía ascendente aprobada; forma: canal sugerido como ítem permanente en cada montaje, opt-out por cancelación con motivo, credencial en el almacén de git fuera del repo.
- **Regla redactada en el corpus con el formato de issue** (criterio 2): release v2.1.0 (tag `v2.1.0`) — SEED.md §0.1 (fila nueva), §6 regla 7 y principio 15 enmendado; mapa maestro §5; protocolo `agente` regla 7 + antipatrón; contrato del workboard §3.11 (informe de campo) y §3.12 (canal); SCHEMA (campo `external`); README (paso de montaje F5); F7 criterio 17. Formato: *qué pasó · evidencia · corrección local aplicada · propuesta de mejora · destino y versión de semilla*.
- **Primera issue real abierta** (criterio 3): [orquestador-seed#1](https://github.com/sebastian-gsz/orquestador-seed/issues/1) — caso closed_at, con el formato del canal. Abierta con `open-issue.mjs` de extremo a extremo (canal.md → credencial vía `git credential fill` → API; el token jamás apareció en salida ni archivos). Identidad del canal: cuenta secundaria `projekte-uhm` (token classic, scope único `public_repo`, almacenado en `~/.git-credentials` con permisos 600 — sin valores en este ítem, principio 10).
- **Release con la mejora** (criterio 4): CHANGELOG v2.1.0 + tag `v2.1.0` + verificador en verde en `_dev/workboard` (exit 0 en cada commit vía hook pre-commit).
- Mecánica adicional: checks §3.11/§3.12 demostrados sobre fixture (6 rutas rojo/verde) y runbook de credencial v1.1.0 con los hallazgos de la auditoría previa (un fine-grained PAT no apunta a repos de otro usuario → classic con scope mínimo según visibilidad; una credencial por host).
- **No verificado**: la corrección del caso (regla SCHEMA «sustituye, no dupliques» + check de claves duplicadas en `verify-workboard.mjs`) aún no viaja en ninguna release — queda abierta como debate en la issue #1; la release que la incorpore cerrará la issue referenciando a este destino.
