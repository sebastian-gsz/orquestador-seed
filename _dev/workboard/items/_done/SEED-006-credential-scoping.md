---
id: SEED-006
title: "Estándar de seguridad: aislamiento de credenciales por servicio"
status: done
priority: P1
class: agente
node: fase-6-dominios/protocolos
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T14:00:00+02:00
updated_at: 2026-10-24T14:30:00+02:00
closed_at: 2026-10-24T14:30:00+02:00
closed_reason: null
touches:
  - fase-6-dominios/protocolos/
  - SEED.md
  - fase-3-plantillas/trunk.md
  - README.md
  - fase-7-verificacion.md
blocks: [SEED-007]
blocked_by: []
acceptance:
  - "Nuevo protocolo protocolos/secretos.md con formato canónico (árbol de decisión, defaults, antipatrones): regla de una frase, tres vectores de fuga, tabla por situación, compañeros inseparables y auditoría «test de los dos greps»"
  - "protocolos/README.md: fila en el índice y regla de doble consulta (presencia de secreto → secretos.md además de la clase dominante)"
  - "red.md: referencia al protocolo en las reglas de credenciales/sesión"
  - "SEED.md: principio 10 ampliado con el aislamiento por servicio"
  - "trunk.md §5: cada secreto pertenece a un solo servicio"
  - "README y F7 criterio 14 actualizados a 5 protocolos"
  - "verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] secretos.md"
  - "[x] README de protocolos (índice + doble consulta)"
  - "[x] red.md cross-ref"
  - "[x] SEED.md principio 10"
  - "[x] trunk.md §5"
  - "[x] README + F7 conteo"
external:
  - null
decision_log:
  - "2026-10-24T14:10:00+02:00 (zcode): el estándar entra como quinto protocolo (transversal, disparador por presencia de secreto) en lugar de sección de red.md o 13.ª ley — así no se renumera nada y la doble consulta queda obligatoria vía el índice de protocolos."
---

## Contexto

Estándar de seguridad aportado por el operador tras una auditoría real de código: **aislamiento de credenciales por servicio** (credential scoping, mínimo privilegio aplicado a secretos). Regla en una frase: *un secreto pertenece a exactamente un servicio — viaja únicamente en las peticiones dirigidas a ese servicio, y en ninguna más*. Se activa cuando se cumplen dos condiciones: **hay un secreto Y el código habla con más de un destino**.

## Notas

- Es transversal: no es una «clase de cuello de botella» sino un disparador por presencia de secreto — por eso es protocolo aparte con doble consulta, no una sección de `red.md`.
- El ejemplo de origen: la clave de NVD viaja solo en las llamadas a NVD_BASE; las llamadas a EPSS y KEV van sin cabeceras.
- Recursos: ninguno (trabajo documental).

## Evidencia

- `fase-6-dominios/protocolos/secretos.md`: protocolo completo con formato canónico — regla en una frase + metáfora de la llave, árbol de decisión con ejemplo anti-patrón/correcto, los 3 vectores de fuga (logs de terceros, redirects con cabeceras personalizadas, intermediarios), tabla por situación, compañeros inseparables (env, no logs, HTTPS), auditoría «test de los dos greps» y tabla de defaults.
- `protocolos/README.md`: fila en el índice (clase transversal) + paso 5 de la clasificación: doble consulta obligatoria ante presencia de secreto.
- `red.md`: nueva regla transversal de aislamiento de credenciales con referencia a `secretos.md`.
- `SEED.md`: principio 10 ampliado con el aislamiento por servicio.
- `fase-3-plantillas/trunk.md` §5: cada secreto pertenece a un solo servicio.
- `README.md` (semilla): «cuatro» → «cinco protocolos», bullet de secretos, doble consulta en la ley 11, árbol actualizado; `fase-7-verificacion.md` criterio 14: 5 archivos + README.
- Entrega directa justificada (documental) en `feature/harness`, sin worktree ni PR.
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
