# Fase 4 — Onboarding de nodos existentes (modo parasitar)

**Solo aplica en modo parasitar.** En modo sembrar los nodos nacen ya contratados conforme se crean y esta fase se omite.

El parasitaje es **exclusivamente documental**: jamás modifica código de producto (regla 1 del manifiesto). Toda la fase se ejecuta sobre el workboard montado en F5 — los ítems de onboarding son las primeras tareas reales del harness.

## 4.1 Inventario con exclusión de artefactos

El inventario clasifica **estructura, no calidad**: decide qué es tronco, rama, fruto o semilla, pero no juzga modularidad, duplicación ni abstracción — ese juicio pertenece a la [Fase 4b](fase-4b-diagnostico.md), que solo puede ejecutarse cuando el nodo ya está contratado (entendido).

Con las decisiones de F0:

1. Lista el primer nivel del destino y clasifica cada directorio: tronco con responsabilidad propia / semilla pasiva / **excluido** (principio 16: VCS, dependencias, builds, cachés de sesión, activos binarios sin lógica).
2. Para cada tronco, anota: responsabilidad observable, nivel de madurez del código (producción / activo / legacy) y prioridad de contratación.
3. El resultado es la cola de contratación. Nada de nodos hipotéticos: solo lo que existe.

## 4.2 Ítems de onboarding por dominio

Un ítem por dominio técnico (no uno por archivo). Patrón (tomado del origen, donde `ETL-001…004`, `ANS-001…004` y `GES-001` contrataron los nodos existentes por lotes):

```markdown
---
id: <DOM>-001
title: "Contratar <tronco>: contrato de nodo y enrutamiento"
status: open
priority: P1
node: <ruta/del/tronco>
touches: [<ruta/del/tronco>/, docs/ARCHITECTURE.md]
acceptance:
  - "Contrato del nodo creado con la plantilla de nivel correcto, sin marcadores"
  - "Enlaces bidireccionales padre↔hijo resueltos"
  - "Topología (§2) y tabla de ruteo (§3) del mapa maestro actualizadas"
  - "Cero modificaciones de código de producto"
---
```

El trabajo de cada ítem: crear el contrato del tronco con [la plantilla trunk](fase-3-plantillas/trunk.md), enlazarlo desde el mapa maestro, y crear un `ARCHITECTURE.md` por rama/fruto existente con [branch](fase-3-plantillas/branch.md)/[fruit](fase-3-plantillas/fruit.md) — siempre top-down.

## 4.3 Contratación top-down

1. **Troncos primero**: cada tronco recibe su contrato transversal (alcance, cláusulas, topología local, dependencias, validación, T&C).
2. **Ramas después**: donde exista un subdominio con reglas de colocación.
3. **Frutos al final**: un contrato por sistema con implementación real.
4. **Regla de decisión** — ¿un directorio necesita contrato?
   - SÍ, si tiene lógica o responsabilidad propia que un agente necesite entender antes de tocar código.
   - NO, si es un agrupador pasivo (assets, datos, salidas). Ese es el estado de **semilla**: sin contrato; lo adquiere cuando desarrolla responsabilidad independiente y real.
5. **Promoción honesta**: un nodo nace `contract`. Solo se promueve a `implemented` cuando su mapa de archivos y grafo funcional están **contrastados** con el código real; lo no verificado se declara como límite. Un `implemented` con afirmaciones no contrastadas es mentira documental.

## 4.4 Ejemplo de cláusulas transversales de tronco

Extraídas del tronco ETL del origen — valen para casi cualquier dominio de automatización (adaptar):

- Extrae a `core/` la infraestructura reutilizable por cualquier sector (config común, excepciones, clientes genéricos, persistencia).
- Extrae a `common_<sector>/` la lógica de dominio compartida por **dos o más proveedores** del sector.
- En el directorio del proveedor quedan selectores, payloads, tokens, autenticación y reglas exclusivas de su fuente.
- `core/` no puede importar de un proveedor; el proveedor sí consume `core/` y su `common_<sector>/`.
- No se crea una capa compartida nueva por anticipación: debe existir responsabilidad común demostrable.
- Orquestadores (`main.py`) delgados: coordinan etapas; no contienen lógica de extracción/parsing/validación.

## 4.5 Cierre de la fase

- Cada ítem de onboarding cierra con evidencia: contratos creados, enlaces resueltos, mapa maestro actualizado, cero cambios de producto.
- Las mejoras de código detectadas durante la lectura de contratos **no se ejecutan**: se registran como ítems nuevos (`open`) para después del montaje.
- Al cerrar el último ítem: la red de contratos está completa, `INDEX.md` queda vacío, y la Fase 7 puede ejecutarse.
- **Siguiente paso recomendado** (especialmente en monolitos o código poco abstraído): ejecutar la [Fase 4b — diagnóstico estructural](fase-4b-diagnostico.md) por tronco, que convierte las violaciones a las leyes en ítems de mejora abiertos, sin tocar código ni contratos.
- **Adopción graduada**: las primeras tareas reales del destino pueden nacer como exploración (régimen `EXP-`, contrato del workboard §4.6) y graduarse a producción con la aprobación del operador — el harness se valida antes de confiarle trabajo de producción.
