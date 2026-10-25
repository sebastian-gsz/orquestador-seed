# SEED — Manifiesto de la semilla orquestadora

> **Qué construye esta semilla**: un *harness* documental que convierte cualquier repositorio en un entorno orquestado donde uno o varios agentes (LLM o humanos) ejecutan trabajo **sin perder contexto, sin pisarse entre ellos, sin olvidar artefactos y con trazabilidad completa**. No es software: es una red de contratos navegable + un tablero de trabajo con claims atómicos + protocolos de decisión. Se replica copiando los módulos de esta semilla en un orden concreto.

Este manifiesto es el mapa de la semilla: define los principios, el modo de despliegue y el orden de construcción. Cada fase es un módulo autocontenido, ejecutable en una sesión de agente propia.

---

## 0. El problema y la solución

### 0.1 Fallos que este harness elimina

| Fallo típico de agentes | Mecanismo que lo elimina |
|---|---|
| Leer código "a ciegas" y operar con contexto incorrecto | Red de contratos `ARCHITECTURE.md` navegable por hipervínculos; prohibición explícita de abrir código antes del contrato |
| Dos agentes ejecutan la misma tarea o se pisan archivos | Claims atómicos en el workboard; un claim activo por agente; alcance `touches` delimitado; worktree propio por agente paralelo |
| Olvidar actualizar documentación tras cambiar código | Regla de la **misma entrega**: código + contrato + ítem + índice, siempre juntos |
| Backlog disperso en conversaciones, comentarios o listas externas | Fuente única de pendientes: `docs/workboard/`; un backlog en otro sitio es un bug |
| Decisiones y evidencia perdidas al cerrar una sesión | `decision_log` y evidencia de cierre dentro del ítem; los ítems cerrados se archivan, nunca se borran |
| Multiagente caótico | Rol de coordinador único; subtareas no solapadas; evidencia por subtarea; solo el coordinador cierra |
| Deriva documental (contratos obsoletos) | "Un nodo obsoleto es un bug": mantenimiento contractual obligatorio en la misma entrega |
| Consumo descontrolado: el agente re-descubre el repo en cada sesión | Contratos antes que código; presupuesto de lecturas; clasificación del problema; stop conditions |
| Secretos filtrados en documentación | Prohibición explícita + revisión de secretos antes de publicar |

### 0.2 La solución en una frase

> Cada directorio con responsabilidad propia tiene un **contrato** (`ARCHITECTURE.md`) que se lee **antes** que el código; todo el trabajo vive como **ítems** con claim y evidencia en un **workboard** único; y ninguna entrega está completa hasta que **código, contrato, ítem e índice** quedan sincronizados.

### 0.3 Los cuatro dominios de autoridad (separación estricta)

| Dominio | Pregunta que responde | Artefacto | Lo que NUNCA contiene |
|---|---|---|---|
| **Arquitectura** | ¿Cuáles son las reglas, límites y estado aprobado? | `ARCHITECTURE.md` jerárquico por nodo | Backlog, estados de tarea, claims, pendientes |
| **Trabajo** | ¿Qué se hace, quién lo reclama, qué lo bloquea, cómo se verifica y cierra? | `docs/workboard/` | Reglas de arquitectura; puede ser anulada por un contrato superior |
| **Conocimiento y decisiones** | ¿Por qué se decidió así? | `docs/conocimiento/` (decisiones, SOP, protocolos) | Autoridad contractual; una decisión no modifica contratos |
| **Operaciones** | ¿Cómo se ejecuta una operación y qué pasó en ejecuciones reales? | `docs/runbooks/` (runbooks + bitácoras) | Compromisos de trabajo futuro; lo no aprobado por el operador |

### 0.4 Flujo de vida de una tarea

```text
AGENTS.md (entrada obligatoria)
   └─→ docs/ARCHITECTURE.md (mapa maestro, §1 protocolo de lectura)
         └─→ contrato del nodo afectado (descenso por hipervínculos)
               └─→ docs/workboard: ¿existe ítem? ──no──→ crear ítem (alcance, touches, aceptación)
                        │ existe
                        ▼
                   claim atómico (status + claimed_by + claimed_at + INDEX)
                        ▼
                   clasificar el problema (datos | red | cómputo | agente) y aplicar su protocolo
                        ▼
                   ejecutar DENTRO de touches (bloqueos antes: blocked_by, contratos)
                        ▼
                   sincronizar en la MISMA entrega: código ↔ ARCHITECTURE.md del nodo ↔ ítem ↔ INDEX.md
                        ▼
                   cerrar: verificar aceptación → evidencia → limpiar claim → mover a items/_done/ → quitar de INDEX
```

---

## 1. Principios inviolables

Estos diecisiete principios son el alma del harness. Si uno se rompe, el harness deja de funcionar aunque los archivos existan.

1. **Fuente única por dominio**. Cada tipo de conocimiento tiene exactamente un hogar. Duplicar es un bug; enlazar es la forma correcta de compartir.
2. **Contratos antes que código**. Prohibido leer o modificar scripts sin haber leído la cadena de contratos hasta el nodo afectado. La auditoría de código es la excepción, nunca el punto de partida.
3. **Cascada estricta**. Un contrato padre dicta normas; los hijos solo especializan (concretar, restringir, responsabilidades propias). Jamás contradicen ni relajan. Ante contradicción: prevalece el superior, el agente se detiene, documenta el conflicto y escala antes de tocar nada.
4. **Estado de trabajo solo en el workboard**. Ningún `ARCHITECTURE.md` aloja backlog, tareas, claims ni pendientes. Si aparece, es un bug de documentación: se migra al workboard y se deja un puntero corto.
5. **Sincronización en la misma entrega**. Crear, modificar, reclamar, bloquear o cerrar exige actualizar **en la misma entrega** todos los artefactos afectados (ítem, `INDEX.md`, contratos, código). Nunca se edita solo el índice ni solo el ítem.
6. **Claim atómico y único**. Reclamar = cambiar en un solo acto `status`, `claimed_by`, `claimed_at`, `updated_at` + reflejar en `INDEX.md`. Un agente mantiene **un solo claim activo** salvo autorización expresa. Ante colisión gana el primer cambio persistido que conservó el estado previo esperado; el segundo se detiene y registra la colisión.
7. **Evidencia o no existe**. No hay cierre sin verificación de cada criterio de aceptación, sin evidencia registrada y sin límites declarados («No verificado: …»). No existe cierre implícito por antigüedad, comentario o commit.
8. **Nada se borra**. Los ítems cerrados o cancelados se mueven a `items/_done/` con motivo y decisión. Los IDs no se reutilizan. Las bitácoras son históricas: las correcciones conservan trazabilidad, no reescriben el pasado.
9. **Autoría ≠ aprobación**. Lo que redacta un agente (runbooks, SOP, propuestas) es borrador hasta que el operador lo aprueba expresamente.
10. **Secretos fuera**. Credenciales, tokens, cookies y datos personales no entran en ítems, contratos, bitácoras ni logs. Referencia por nombre de variable o `<REDACTED>`. En el código rige además el **aislamiento de credenciales por servicio**: un secreto viaja únicamente en las peticiones dirigidas a su servicio, y en ninguna más (protocolo `secretos`).
11. **Un nodo obsoleto es un bug**. Modificar comportamiento obliga a actualizar el contrato del nodo en la misma entrega; si cambia la topología, además el padre y el mapa maestro.
12. **Nada de abstracción especulativa**. La lógica común solo asciende al nivel compartido cuando existe responsabilidad común **demostrable** (dos o más usos reales). No se crean capas `core/` por anticipación.
13. **Notificación ascendente minimal**. Un cambio local notifica hacia arriba **solo su existencia**: una fila en la tabla de ruteo del padre inmediato (nombre, descripción de una línea, enlace). El detalle jamás asciende y jamás se propaga a nodos hermanos; quien necesite más, desciende por los hipervínculos.
14. **Clasifica antes de implementar**. Todo ítem de trabajo declara su clase de problema dominante (`datos | red | cómputo | agente`), consulta el protocolo canónico correspondiente antes de diseñar, y registra la elección y sus umbrales en `decision_log` con su justificación. Los defaults viajan con los protocolos; la especialización solo con caso real medido.
15. **Semilla sin rastro**. Los módulos de esta semilla **se copian, jamás se enlazan**. Tras el desmontaje, ningún archivo del destino referencia a la semilla; la única traza permitida es una entrada histórica en el dominio de conocimiento (procedencia, sin dependencia funcional).
16. **Artefactos de herramienta fuera**. Los directorios de VCS, dependencias, builds, cachés de sesión y activos sin lógica propia no son contenido del proyecto: jamás se contratan, ni se enlazan como nodos, ni se auditan como dominios.
17. **Explora barato, promueve con autoridad**. La exploración es trabajo legítimo de baja ceremonia: ítems `EXP-` con timebox cuyo producto es un aprendizaje archivado, no un entregable. Solo el operador promueve un experimento a producción (principio 9); ningún código experimental se fusiona sin su ítem de producción.

---

## 2. Modo de despliegue: sembrar o parasitar

La semilla se comporta distinto según el estado del destino. El criterio se fija en la Fase 0 y es verificable:

| | **Sembrar** | **Parasitar** |
|---|---|---|
| **Cuándo** | Repo vacío, nuevo, o sin código de producto | Repo con código de producto sin contratar |
| **Papel de la semilla** | Contenido fundacional: el harness ES el arranque del repo | Material de montaje: el harness se instala ALREDEDOR del código existente |
| **Código de producto** | Nace ya contratado: cada tronco se crea con su contrato `contract` | Se toca **cero**: el parasitaje es exclusivamente documental |
| **Onboarding (F4)** | No aplica: los nodos se contratan conforme nacen | Núcleo del montaje: inventario → ítems stub por dominio → contratos top-down |
| **Estados de nodo** | `contract` al nacer; `implemented` solo cuando haya código contrastado | Ítems de onboarding cierran con contratos `contract`; `implemented` exige contraste con el código real |
| **Prueba de fuego (F7)** | Crear el primer ítem real del producto | Contratar el primer nodo pendiente del inventario, siguiendo el ciclo completo |
| **Diagnóstico (F4b)** | No aplica: nada que diagnosticar, las leyes rigen desde el nacimiento | Recomendado en repos monolíticos o poco abstraídos: rúbrica de leyes + grafo de código (CodeGraph opcional) → ítems de mejora que el operador triaja |

**Regla de oro del parasitaje**: el montaje se ejecuta respetando las reglas que instala. Los ítems de onboarding viven en el workboard, con claim, evidencia y cierre — el parasitaje es la primera demostración del harness funcionando.

---

## 3. Mapa de módulos y dependencias

```text
orquestador-seed/
├── SEED.md                      # este manifiesto
├── fase-0-decisiones.md         # modo + operador + inventario + prefijos + leyes de stack
├── fase-1-mapa-maestro.md       # plantilla del mapa central (12 leyes universales)
├── fase-2-stub-agents.md        # plantilla del stub de entrada con esenciales inline
├── fase-3-plantillas/           # trunk / branch / fruit + protocolo topológico
├── fase-4-onboarding.md         # modo parasitar (no aplica en siembra)
├── fase-4b-diagnostico.md       # diagnóstico estructural post-contratación → ítems de mejora (opcional)
├── fase-5-workboard/            # contrato + SCHEMA + INDEX + plantilla de ítem + verificador
├── fase-6-dominios/             # runbooks · conocimiento · protocolos
└── fase-7-verificacion.md       # checklist + prueba de fuego + desmontaje
```

**Dependencias entre fases** (el workboard se monta antes del onboarding: el parasitaje necesita el tablero donde registrar sus ítems):

```text
F0 decisiones y modo
  └─→ F1 mapa maestro ─→ F2 stub AGENTS.md
        └─→ F3 plantillas de contrato ─→ F5 workboard (motor de trabajo) + verificador
              ├─→ F4 onboarding (solo modo parasitar; usa F5 desde el primer ítem)
              │     └─→ F4b diagnóstico estructural (opcional; recomendado en monolitos)
              │           → ítems de mejora abiertos para el operador
              ├─→ F6 dominios complementarios (opcional; recomendado desde el primer mes)
              └─→ F7 verificación de montaje + prueba de fuego + DESMONTAJE
```

**Esfuerzo estimado**: F0–F3 + F5 ≈ una sesión de agente (1–2 h). F4 ≈ una sesión por cada 2–4 troncos (1–3 h total). F4b ≈ 30–60 min por tronco (opcional). F6 opcional (+30–60 min). F7 ≈ 15–30 min.

**En qué se copia cada módulo al destino**: F1 → `docs/ARCHITECTURE.md`; F2 → `AGENTS.md` (raíz); F3 → `docs/templates/architecture/`; F5 → `docs/workboard/` (el verificador se copia dentro); F6 → `docs/runbooks/`, `docs/conocimiento/` (los protocolos dentro de `docs/conocimiento/protocolos/`). Los módulos de la semilla **no se referencian jamás desde el destino** — se copian con su contenido ya resuelto.

---

## 4. Cómo usar esta semilla

| Modo | Procedimiento |
|---|---|
| **A. Por agente** | Clona la semilla junto al destino y entrega al agente: *«Lee SEED.md y ejecuta las Fases 0→7 sobre el repositorio destino según el modo que corresponda. No toques código de producto.»* |
| **B. Manual** | Sigue los módulos en orden; cada uno dice exactamente qué archivos crear en el destino y con qué contenido. |
| **C. Auditoría** | Usa la checklist de la Fase 7 para evaluar un harness ya montado; las brechas se corrigen con los módulos como referencia. |

---

## 5. Protocolo de desmontaje (resumen)

La Fase 7 lo detalla; el principio es uno: **la semilla no deja rastro**.

1. Checklist estructural completa (incluye: cero referencias a la semilla, cero enlaces colgantes).
2. Prueba de fuego superada (un ciclo completo de tarea real).
3. Entrada de procedencia en `docs/conocimiento/` (versión de semilla, fecha, modo).
4. Borrado del directorio de la semilla.
5. El destino queda autónomo: red de contratos + workboard + protocolos, sin dependencias externas.

---

## 6. Reglas para el agente constructor

1. En modo parasitar, **jamás modifiques código de producto**: el montaje es documental; cualquier mejora de código detectada se anota como ítem para después del desmontaje.
2. El propio montaje usa el workboard: los ítems de onboarding son las primeras tareas del harness, con claim y evidencia.
3. No contrates nodos hipotéticos: solo troncos, ramas y frutos que existan (o que la visión de producto declare en siembra).
4. Respeta las exclusiones del principio 16 al inventariar: VCS, dependencias, builds, cachés de sesión y activos sin lógica propia no son nodos.
5. Todo lo que copies al destino va ya resuelto (marcadores `<...>` sustituidos, plantillas sin secciones vacías): el destino no debe poder distinguir qué módulo de la semilla lo originó.
6. Ante cualquier conflicto entre estos principios y la realidad del destino: detente, documenta y escala al operador. Nunca relajes un principio para que el montaje «quepa».
