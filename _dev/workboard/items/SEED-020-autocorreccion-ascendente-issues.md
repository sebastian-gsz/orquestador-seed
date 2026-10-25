---
id: SEED-020
title: "Autocorrección ascendente: hallazgos de destinos → issues del repo oficial"
status: open
priority: P2
class: agente
regimen: produccion
timebox: null
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-25T02:10:00+02:00
updated_at: 2026-10-25T02:10:00+02:00
closed_at: null
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-6-dominios/protocolos/agente.md
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
  - "[ ] Debate del operador: adoptar o descartar la vía ascendente"
  - "[ ] Redactar la regla y el formato de issue"
  - "[ ] Abrir la issue del caso closed_at y enlazarla en external"
  - "[ ] Release con la mejora"
external:
  - null
decision_log:
  - "2026-10-25T02:10:00+02:00 · operador (J. Sebastián G. Sánchez) · Ítem creado por orden del operador tras el montaje de gsc-server (v2.0.0, modo parasitar, 2026-10-25): el hallazgo de aquel destino no debe quedar solo en workboards locales; la propuesta es que ascienda como issue al repo oficial."
  - "2026-10-25T02:25:00+02:00 · operador (J. Sebastián G. Sánchez) · Decisión: el refuerzo local (regla en el SCHEMA del workboard de gsc-server) se retira — un defecto de mecánica del corpus no es asunto del destino. El hallazgo y su solución viven exclusivamente en esta vía ascendente (este ítem); la corrección definitiva para futuros destinos llega con la release que la incorpore."
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

- Pendiente de ejecución.
