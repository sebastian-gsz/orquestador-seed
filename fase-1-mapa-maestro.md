# Fase 1 — Mapa maestro `docs/ARCHITECTURE.md`

El punto de entrada único e ineludible. Todo agente empieza aquí y desciende por hipervínculos. Cinco secciones, siempre en este orden.

**Instrucciones de construcción**:

1. Copia la plantilla de abajo al destino como `docs/ARCHITECTURE.md` y sustituye los marcadores `<...>`.
2. §2 *Topología*: dibuja el árbol real del destino; cada nodo relevante lleva un comentario `→ [enlace relativo a su ARCHITECTURE.md]`. Respeta las exclusiones de la Fase 0 (nada de artefactos de herramienta en la topología). Si el nodo aún no tiene contrato, créalo en F4 (parasitar) o cuando nazca (sembrar) antes de cerrar F7.
3. §3 *Tabla de ruteo*: una fila por tronco raíz, rama raíz o fruto. Estados posibles: `contract` e `implemented` (ver Fase 4). Una **semilla** (directorio sin contrato propio) solo entra en esta tabla si es de primer nivel del proyecto.
4. §4 *Leyes universales*: las 12 de la plantilla son el mínimo viable, no se recortan; añade las 2–4 leyes de stack de la Fase 0 (leyes 13+).
5. La regla de oro (bloque *quote*) es obligatoria: prohíbe leer código antes del contrato.
6. El mapa maestro **no referencia la semilla**: todo contenido va ya resuelto (principio 15).

````markdown
---
title: ARCHITECTURE.md — Raíz del proyecto (Mapa central)
Rol: Coordinador de contexto / Software Architect Senior
Objetivo: Ser el PUNTO DE ENTRADA único e ineludible para cualquier agente (LLM o programático). Define las reglas de comportamiento globales, el mapa de navegación del repositorio y el protocolo de lectura.
Lectura obligatoria: SÍ — es el primer archivo que debe leerse antes de tocar cualquier código.
---

# 🗺️ Mapa central de arquitectura — <NOMBRE DEL PROYECTO>

> **Regla de oro para agentes**: NO leas scripts "a ciegas". Este repositorio se navega como un árbol:
> cada directorio relevante tiene su propio `ARCHITECTURE.md` que actúa de **contrato local** (reglas de
> comportamiento + estado actual + mapa de archivos). Lee desde la raíz hacia abajo, detente en el nodo
> que cubre tu tarea y **solo entonces** abre código. Si la información del nodo no es suficiente, realiza
> una auditoría propia (listar directorio, abrir los archivos mínimos), pero siempre partiendo del
> contrato, nunca de cero.

## 1. Protocolo de lectura

1. **Empieza aquí.** Identifica el nodo que cubre tu tarea en la tabla de ruteo de nodos (§3).
   **Desciende por hipervínculos** hasta su `ARCHITECTURE.md`.
2. **Respeta los contratos de los nodos**: normas, estructura, estado actual y antipatrones locales.
3. **Audita solo lo necesario**: si el contrato del nodo no basta, lista el directorio y abre los archivos
   mínimos; documenta las carencias, propone la solución y pide permiso al owner antes de escribir en
   cualquier `ARCHITECTURE.md` (ver §5, mantenimiento).
4. **Nunca subas conocimiento local al tronco**: las particularidades de una rama viven en su nodo; las
   normas universales, arriba. Cascada estricta.

## 2. Topología general del repositorio

```text
<repo>/
├── docs/                     # ⬅ Tronco raíz documental → [docs/ARCHITECTURE.md]
│   ├── workboard/            #     Rama raíz: gestión de trabajo y ciclo de tareas → [workboard/ARCHITECTURE.md]
│   ├── runbooks/             #     Rama raíz: procedimientos y bitácoras → [runbooks/ARCHITECTURE.md]
│   ├── conocimiento/         #     Rama raíz: decisiones, SOP y protocolos → [conocimiento/ARCHITECTURE.md]
│   └── templates/architecture/ # Plantillas reutilizables; artefactos, no nodo contractual.
├── AGENTS.md                 # Stub de convención: redirige a este mapa central (no duplica contenido).
├── <tronco-1>/               # ⬅ Tronco raíz: <responsabilidad> NODO → [<tronco-1>/ARCHITECTURE.md]
│   └── <rama-o-fruto>/       #     Rama/Fruto → [enlace]
└── <tronco-2>/               # ⬅ Tronco raíz → [<tronco-2>/ARCHITECTURE.md]
```

## 3. Tabla de ruteo de nodos (¿A dónde voy?)

Estados de nodo:

- **contract**: contrato vigente del nodo. Define reglas, compromisos, términos y condiciones,
  estructura, límites y responsabilidades; no documenta un estado operativo detallado.
- **implemented**: contrato vigente más documentación del estado operativo aprobado y funcional.
  Incluye el mapa de archivos y el grafo de dependencias entre archivos, imports, clases,
  funciones y flujos.

| Nodo | Nivel | Estado | Descripción | Enlace |
|---|---|---|---|---|
| Raíz (este archivo) | Tronco maestro | — | Mapa central y leyes universales, protocolo de lectura, topología y mantenimiento. | — |
| `docs/` | Tronco raíz documental | contract | Contrato de documentación y navegación de los dominios documentales. | [↘](ARCHITECTURE.md) |
| `docs/workboard/` | Rama raíz | contract | Dominio exclusivo para gestionar tareas, claims, bloqueos, trazabilidad y cierres. | [↘](workboard/ARCHITECTURE.md) |
| `docs/runbooks/` | Rama raíz | contract | Contrato de runbooks reutilizables y bitácoras de ejecuciones reales. | [↘](runbooks/ARCHITECTURE.md) |
| `docs/conocimiento/` | Rama raíz | contract | Decisiones arquitectónicas, SOP del operador y protocolos de optimización. | [↘](conocimiento/ARCHITECTURE.md) |
| `<tronco-1>/` | Tronco raíz | contract | <responsabilidad transversal del tronco>. | [↘](../<tronco-1>/ARCHITECTURE.md) |
| `<tronco-1>/<fruto>/` | Fruto | implemented | <comportamiento específico del fruto>. | [↘](../<tronco-1>/<fruto>/ARCHITECTURE.md) |

**Enlaces de contexto general**:

- [README.md](../README.md): visión de producto y estado global del proyecto.
- [AGENTS.md](../AGENTS.md) → Stub de convención que **redirige** a este mapa central (no duplica
  contenido). Las reglas viven SOLO en los archivos `ARCHITECTURE.md`.

## 4. Leyes universales del proyecto (aplican a TODOS los nodos)

1. **Cascada de contexto**: un `ARCHITECTURE.md` padre dicta normas globales; los hijos solo añaden
   particularidades, nunca las contradicen.
2. **DRY demostrable**: lógica repetida se extrae al nivel compartido inmediatamente superior, solo
   con dos o más usos reales; nada de capas compartidas por anticipación.
3. **Modularidad estricta**: 1 archivo = 1 responsabilidad; ideal 20–80 líneas; más de 500 líneas
   obliga a refactor. El tamaño es señal de diseño, no sustituto de la separación conceptual.
4. **Testeabilidad**: parsers y validaciones sin red ni disco; tests unitarios con mocks; nada depende
   de producción.
5. **Configuración centralizada**: rutas/URLs/límites vía entorno + helpers del nodo; prohibido
   hardcodear fuera de los módulos de constantes.
6. **Enrutamiento obligatorio y notificación ascendente minimal**: todo nodo nuevo debe aparecer en la
   topología (§2) y en la tabla de ruteo (§3) de su tronco maestro, con enlaces bidireccionales
   padre↔hijo. La actualización ascendente se limita a la fila de ruteo: nombre, descripción de una
   línea y enlace. El detalle jamás asciende y jamás se propaga a nodos hermanos; quien necesite más,
   desciende por los hipervínculos. Una semilla solo se añade a esta tabla si pasa a ser nodo de
   primer nivel del proyecto.
7. **Precedencia y conflicto**: un descendiente puede especializar las reglas de sus padres, pero no
   contradecirlas ni relajarlas. Ante contradicción prevalece el contrato superior; el agente detiene
   la acción, documenta el conflicto y solicita resolución antes de modificar código o arquitectura.
8. **Límite de la especialización**: especializar = concretar una regla general para el dominio local,
   añadir una restricción necesaria o definir una responsabilidad propia. No permite cambiar el
   significado de `contract` o `implemented`, alterar la fuente de verdad del workboard ni sustituir
   una obligación superior.
9. **Estado de trabajo aparte**: los contratos nunca alojan backlog, tareas, claims ni pendientes;
   eso vive exclusivamente en `docs/workboard/`.
10. **Verificación por archivo**: todo nodo declara los comandos para verificar un solo archivo —
    tipo estático, formato, lint y test unitario por ruta (ver plantilla de fruto, §6). El build
    completo se ejecuta solo a petición explícita. Verificación barata = siempre se verifica: tras
    cada cambio se ejecutan los comandos de los archivos tocados.
11. **Clasifica antes de implementar**: todo ítem de trabajo declara su clase de problema dominante
    (`datos | red | cómputo | agente`) y consulta el protocolo canónico correspondiente en
    `docs/conocimiento/protocolos/` antes de diseñar. La elección del patrón y los umbrales
    aplicados se registran en el `decision_log` del ítem con su justificación.
12. **Anti-abstracción especulativa**: no se crean capas compartidas, protocolos especializados ni
    parámetros de nodo sin responsabilidad o caso real demostrable.

## 5. Mantenimiento de la red (obligatorio al trabajar)

- **Si creas un directorio con lógica propia**, crea su `ARCHITECTURE.md` usando la guía y plantillas
  de [templates/architecture](templates/architecture/README.md): front-matter
  (`title/Rol/Objetivo/Nivel/Estado/Padre`), enlaces *↑ Padre* y *↓ Hijos* cuando correspondan,
  alcance, contrato local y mapa. Un nodo `implemented` añade únicamente el estado operativo aprobado
  y su grafo de dependencias; los estados de tareas pertenecen exclusivamente al workboard.
- **Si modificas comportamiento** descrito en un nodo (nuevo script, nueva variable de entorno, cambio
  de flujo), **actualiza únicamente el `ARCHITECTURE.md` de ese nodo en la misma entrega**. Si el
  cambio altera la topología, actualiza además el `ARCHITECTURE.md` del padre —limitado a su fila de
  ruteo— y, cuando proceda, este mapa maestro.
- **Auto-mejora del harness**: la segunda vez que un agente repite el mismo error, añade la regla o
  antipatrón correspondiente al contrato del nodo (o a la tabla de anti-patrones local) **en la misma
  entrega** de la corrección. El harness aprende de sus propios fallos o deja de funcionar.
  **Tríada de refuerzo**: al corregir manualmente cualquier violación del harness, decide en la misma
  entrega qué refuerzo preventivo deja — una *regla* (contrato/antipatrón), un *check* (verificador
  del workboard), un *hook* (determinista, en el pre-commit: lo que debe pasar siempre se mecaniza,
  no solo se recomienda) o una *eval* (escenario de la batería de F7 §7.3). Si el fallo puede
  repetirse, no se corrige solo una vez.

---
*Fin del mapa central. Descarga el nodo que corresponda a tu tarea antes de escribir una sola línea de código.*
````
