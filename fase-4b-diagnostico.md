# Fase 4b — Diagnóstico estructural (parasitaje profundo)

**Opcional pero recomendado en repos monolíticos o con poca auto-abstracción.** La contratación (F4) documenta *lo que es*; este módulo evalúa *cómo está construido* y lo deja como backlog priorizable. Dos fronteras inviolables:

1. **El diagnóstico no refactoriza**: cero modificaciones de código durante el montaje. Cada hallazgo se convierte en un ítem del workboard — el primer backlog real del harness, que el operador triaja y ejecuta después, con el ciclo normal (claim, evidencia, cierre).
2. **El diagnóstico no edita contratos**: un hallazgo no prueba que el contrato esté mal; prueba que el *código* difiere de las leyes. Solo se toca un contrato si el diagnóstico revela que el contrato mismo mintió sobre el código (eso sí es un bug documental, regla 11).

**Momento de ejecución**: por tronco, justo después de cerrar su onboarding (contratos existentes ⇒ nodo entendido — nunca se diagnostica un nodo sin contrato). Incremental y acotado, no una gran pasada final.

## 1. Rúbrica: las leyes universales como hallazgos

La rúbrica ya existe: son las leyes del mapa maestro. Cada ley define un hallazgo buscable:

| Ley | Hallazgo buscable | Evidencia típica |
|---|---|---|
| 3 — Modularidad | Archivos > 500 líneas; archivos con más de una responsabilidad | Métricas + mapa del contrato |
| 2 — DRY demostrable | Lógica repetida en ≥ 2 frutos (candidato a `common_<sector>/`); infraestructura repetida en ≥ 2 troncos (candidato a `core/`) | Grafo de llamadas / auditoría acotada |
| 4 — Testeabilidad | Lógica con red, disco o reloj embebidos donde debía ser pura | Grafo de llamadas + auditoría |
| 5 — Configuración | Rutas/URLs/límites hardcodeados fuera de constantes | `grep` + auditoría |
| 10 — Verificación | Nodos sin comandos de verificación por archivo declarables | Revisión del contrato |
| Ley de stack (p. ej. orquestadores delgados) | `main.py` con lógica de negocio; configuración dispersa | Contrato + grafo |
| Dirección de dependencias | Fruto→fruto sin capa común, capas invertidas, ciclos de import | **Grafo de código** (su fuerte) |
| Acoplamiento entre proveedores | Un proveedor importando de otro | **Grafo de código** |

## 2. Fuentes de evidencia, en orden de preferencia

### 2.1 Grafo de código — CodeGraph (recomendado como acelerador)

[Indexado local de 30+ lenguajes](https://github.com/colbymchenry/codegraph), 100% local, sin API keys, actualización incremental. El harness **no depende de él** (principio de cero dependencias): sin grafo, se trabaja con 2.2 y 2.3 y se documenta el límite de cobertura.

**Exclusión obligatoria (principio 16)**: el índice de la herramienta (`.codegraph/`, `.codegraph-wsl/`, o el que resulte de `CODEGRAPH_DIR`) es un artefacto de herramienta — jamás se contrata, jamás aparece en topología ni ruteo, y se añade a `.gitignore` del destino si el operador lo autoriza.

| Hallazgo | Consulta típica |
|---|---|
| Radio de impacto de un símbolo (antes de proponer moverlo) | `codegraph impact <símbolo>` |
| Dirección de dependencias y acoplamiento | `codegraph callers <símbolo>` / `codegraph callees <símbolo>` |
| Contexto de un archivo o símbolo sin abrirlo | `codegraph node <símbolo>` · `codegraph explore <pregunta>` |
| Tests afectados por una propuesta de refactor | `codegraph affected <archivos>` |
| Cobertura del índice antes de confiar en él | `codegraph status` · `codegraph files <ruta>` |

Como MCP del agente diagnosticador: `codegraph serve --mcp` (stdio; una sola herramienta `codegraph_explore` por defecto). Límite documentado por el propio proyecto: menos llamadas ≠ menos contexto acumulado — sigue rigiendo el presupuesto de lecturas del protocolo `agente`.

**Honestidad de capacidades**: el grafo resuelve dependencias, llamadas e impacto; **no detecta duplicación ni código muerto en bloque**. Para duplicación: herramienta dedicada opcional (p. ej. `jscpd`) con las mismas exclusiones, o auditoría acotada. Para código muerto: derivable por consulta símbolo a símbolo (sin llamadores), solo sobre sospechas concretas.

### 2.2 Los contratos recién creados

El mapa de archivos y el grafo funcional de cada fruto `implemented` ya son evidencia de primer nivel (se contrastaron con el código al promocionar). El diagnóstico parte de ahí.

### 2.3 Auditoría manual acotada

Solo sobre sospechas concretas con evidencia previa; **≤ 3 archivos por sospecha** (presupuesto de lecturas del protocolo `agente`). Sin sospecha previa no hay lectura exploratoria: eso es exactamente lo que el harness prohíbe.

## 3. De hallazgo a ítem

Cada hallazgo se registra como ítem nuevo del workboard:

```markdown
---
id: <DOM>-0XX
title: "Mejora: <qué, concreto y pequeño>"
status: open
priority: P2
class: <clase del refactor, no del diagnóstico>
node: <ruta/del/nodo>
touches: [<archivos afectados, según el grafo de impacto>]
acceptance:
  - "Criterio medible (p. ej. «archivo X ≤ 200 líneas sin perder cobertura»)"
---
## Contexto
Ley violada: <ley N>. Evidencia: <métrica/consulta/grafo + resultado>.
## Propuesta (recomendación — autoría ≠ aprobación)
<Remedio propuesto en una o dos líneas. El operador decide si, cuándo y cómo.>
```

**Guardas anti-inundación** (el diagnóstico no puede hundir el repo en ruido):

- Sin evidencia no hay hallazgo: la intuición se anota como sospecha en las notas del ítem de diagnóstico, no como ítem de mejora.
- DRY: solo con **≥ 2 usos reales** demostrados; una sola aparición no es hallazgo (ley 12, en ambas direcciones).
- Nada de mega-refactors: «reescribir X» no es un ítem; se descompone en pasos concretos y pequeños (ley 3).
- Prioridad por defecto `P2`; **el agente no se autoasigna P0 ni P1** — el operador triaja.
- Volumen esperado: si un tronco genera más de ~10 ítems de mejora, el diagnóstico está fiscalizando en vez de diagnosticar — subir el umbral de evidencia y reportar el patrón sistémico como un solo ítem (p. ej. «el tronco X carece de capa común: 14 duplicaciones detectadas»).

## 4. Cierre de la fase

- Los ítems de onboarding (F4) quedan cerrados; **los ítems de mejora quedan abiertos** — son el punto de partida operativo: el operador prioriza en `INDEX.md` y el harness los ejecuta como cualquier tarea (clasificación, protocolo, claim, evidencia).
- Los ítems de diagnóstico (el trabajo de diagnosticar) se cierran con evidencia: N hallazgos convertidos en M ítems, cobertura declarada (qué se analizó con grafo, qué con contrato, qué quedó sin cubrir).
- El desmontaje de la semilla (F7) no los afecta: los ítems viven en el workboard del destino, no en la semilla.
