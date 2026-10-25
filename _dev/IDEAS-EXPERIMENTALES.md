# Ideas experimentales — parking lot del corpus

> **Qué es esta sección**: el aparcamiento de ideas experimentales sobre la evolución del propio corpus. Ciclo de vida: **propuesta** (aquí) → **debate del operador** → si se aprueba, **ítem en el workboard** (`SEED-xxx`) → **release**. Una idea que no pasa el debate muere aquí, sin coste. Nada de lo que vive en este fichero es doctrina todavía — son apuestas a debate, y su presencia aquí no autoriza trabajo (principio 7).

| IDEA | Título | Estado |
|---|---|---|
| [IDEA-1](#idea-1--publicación-limpia-repo-de-trabajo--repo-oficial) | Publicación limpia: repo de trabajo → repo oficial | propuesta — a debate |
| [IDEA-2](#idea-2--upgrade-de-semillas-desplegadas) | Upgrade de semillas desplegadas | propuesta (embrionaria) — a debate |

---

## IDEA-1 — Publicación limpia: repo de trabajo → repo oficial

**Estado**: propuesta — a debate del operador.

### La idea

Todo el trabajo vive en un **repo de trabajo** (el actual: `feature/*` con la historia que haga falta, `develop` ligero). Un **workflow** toma el estado actual de `main` del repo de trabajo — una **captura esencial del árbol**: sin historia, sin tags, sin ruido — y la publica en un **repo oficial** distinto donde únicamente existe `main` con **un único commit por actualización mayor** ("Release vX.Y.Z") y su etiqueta correspondiente. El repo oficial queda impecable por construcción: una rama, un commit por versión, release formal.

### El problema que resuelve

El operador odia la historia sucia: cientos de commits en `feature/*` son aceptables, `develop` debe estar limpio, y `main` solo admite commits directamente proporcionales a un release. Hoy eso se cumple con ceremonia manual (la compactación por `commit-tree` del 2026-10-24) y sin mecanismo que lo imponga — `main` ya acumuló un commit de workboard (`d4bcc58`) que no es de release. La idea automatiza la ceremonia y la vuelve la única vía de entrada al repo oficial.

### Vías de implementación (a decidir si se aprueba)

- **(a) Orphan commit vía `commit-tree` en una Action**: la compactación manual ya probada, automatizada — la Action toma el tree de `main` del work repo, crea el commit huérfano "Release vX.Y.Z" en el repo oficial, etiqueta y pushea (PAT en los secrets del work repo; principio 10 y `secretos.md`).
- **(b) Export por archive**: `git archive`/rsync del árbol + repo fresco + push — más simple, menos control.
- **(c) GitHub API** (blobs/tree/commit/ref): control fino sin git local; más código de workflow.

### Decisiones abiertas para el operador

1. **Disparador**: manual (`workflow_dispatch` con número de versión) o automático (al etiquetar en `develop` del work repo).
2. **Topología**: ¿`main` del work repo queda como "candidato de release" y el repo oficial solo recibe lo aprobado? ¿Qué pasa con los tags locales del work repo (se quedan ahí, no migran)?
3. **Protección del repo oficial**: ¿rama protegida de modo que la vía del workflow sea la única de entrada?
4. **Credenciales**: PAT con qué scopes y dónde vive (secrets del work repo; un secreto → un servicio, `secretos.md`).

### Relación con el corpus

Es la **mecanización del release** — la capa determinista aplicada entre repos: como los hooks imponen el protocolo dentro del repo, el workflow impone la pulcritud entre work repo y repo oficial. Formaliza los papeles: `develop` = integración, `main` (work repo) = candidato, repo oficial = release.

---

## IDEA-2 — Upgrade de semillas desplegadas

**Estado**: propuesta (embrionaria) — a debate del operador.

### La idea

Cada destino (sembrado o parasitado) recibe una **copia del corpus a una versión dada**. Con semanas, meses o años, el corpus evoluciona — más preciso, más óptimo — y las semillas desplegadas quedan obsoletas, con un orden inferior al del corpus actual. La pregunta: **¿cómo procede un corpus nuevo a refactorizar los harness antiguos de la forma más limpia y óptima posible?**

### El problema que resuelve

Existe el canal de **ida** (vía ascendente, SEED-020: los destinos reportan hallazgos) pero falta el de **vuelta**: las mejoras aprobadas llegan con cada release y **no bajan a los destinos ya montados**. Sin upgrade path, cada destino queda congelado en su versión — y cuanto más madura el corpus, mayor la brecha.

### La llave que ya existe

La **entrada de procedencia** en `docs/conocimiento/` cita la versión de semilla montada (v2.0.0 en adelante, obligatoria desde v1.0.0) — es el punto de partida de cualquier upgrade: diff entre la versión montada y el corpus actual, con el `CHANGELOG.md` de la semilla como **manifiesto de migración** (qué cambió, release a release).

### Vías (a decidir si se aprueba)

- **(a) Upgrade evolutivo**: la semilla se monta en modo upgrade sobre el destino — compara la versión montada con la actual y convierte cada diferencia en **ítem del workboard del destino** (claim, decisión del operador, entrega). Nada se sobrescribe sin su ítem: "nada se borra" respeta el trabajo del destino.
- **(b) Upgrade destructivo**: desmontar y re-sembrar con el corpus actual — válido cuando el destino es joven y no tiene trabajo propio irreemplazable.
- **(c) Híbrido**: destructivo para mecánica (hooks, verificador, plantillas — reemplazo directo), evolutivo para contratos con trabajo del destino.

### Decisiones abiertas para el operador

1. ¿Evolutivo o destructivo por defecto (o el híbrido)?
2. ¿El upgrade es una **fase 8** de la semilla o un modo del montaje (parasitar/sembrar/**actualizar**)?
3. ¿Quién acepta cada diferencia — el operador del destino ítem a ítem?

### Anti-especulación (ley 12)

Embrionaria a propósito: el canal descendente se diseña cuando haya **≥ 2 destinos vivos** que lo pidan. Esta idea reserva el problema y su llave (la procedencia versionada); el diseño detallado espera al primer caso real.

---

*Fin del parking lot. Las ideas aprobadas se convierten en ítems del workboard; las descartadas mueren aquí sin coste.*
