# Fase 0 — Decisiones previas

Antes de crear archivos en el destino, fija las decisiones de esta fase. Quedarán plasmadas en el mapa maestro (F1) y el workboard (F5). La primera decisión es el **modo de despliegue**, que determina todo lo demás.

## 0.1 Modo de despliegue (sembrar vs parasitar)

Criterio verificable:

- **Parasitar** si el destino contiene código de producto sin contratar (directorios con lógica propia y sin `ARCHITECTURE.md`).
- **Sembrar** si el destino está vacío, es nuevo, o solo contiene un esqueleto sin lógica de producto.

En caso dudoso (p. ej. un repo con esqueleto y un módulo avanzado): **parasitar** — el modo conservador siempre es parasitar, porque nunca toca producto. Registrar: modo elegido + justificación (esta decisión se archiva en la entrada de procedencia de F7).

## 0.2 Operador / owner

Quién detenta la autoridad de aprobación: aprobación de runbooks, SOP y protocolos especializados; resolución de conflictos entre contratos; liberación y reasignación de claims abandonados. Un solo rol; puede ser una persona o el usuario final.

## 0.3 Zona horaria oficial

Una sola para todas las marcas temporales del destino. Regla: siempre ISO-8601 **con offset** (`2026-10-23T11:00:00+02:00`).

## 0.4 Idioma documental

Uno solo para toda la documentación del destino (la semilla está escrita en español; se recomienda mantenerlo salvo decisión expresa del operador).

## 0.5 Inventario de troncos (con exclusiones)

Listar los directorios de primer nivel del destino con responsabilidad propia: serán los troncos raíz del mapa maestro (p. ej. `etl/`, `ansible/`, `docs/`).

**Exclusiones obligatorias** (principio 16): jamás se inventarían, contratan ni auditan como nodos:

- Directorios de control de versiones y metadatos del entorno (`.git/` y equivalentes).
- Dependencias, entornos virtuales y módulos instalados (`.venv/`, `node_modules/`, collections o paquetes vendidos).
- Salidas de build y artefactos compilados (`dist/`, `build/`, `__pycache__/`, `target/`).
- Cachés y artefactos de sesión de herramientas de trabajo (directorios de planes, estado de IDE/agentes, etc.).
- Activos binarios sin lógica propia (imágenes, capturas, datos de muestra sin procesamiento).

**Método**: listar el primer nivel; para cada directorio anotar responsabilidad observable y prioridad de contratación. Solo se contratan los que existan; nada de nodos hipotéticos. En modo sembrar, el inventario se hace sobre la visión de producto del operador (troncos declarados, no creados de antemano sin responsabilidad).

## 0.6 Prefijos de dominio para los IDs del workboard

2–4 letras mayúsculas por ámbito técnico (ejemplo del origen: `ETL`, `COR`, `GES`, `ANS`, `DOC`, `REP`). Regla: `COR-006` = dominio Cortizo, ítem 6. Un ítem = un prefijo según el nodo principal que toca; tareas transversales usan el prefijo de su capa.

## 0.7 Leyes universales de stack

La plantilla del mapa maestro (F1) trae 12 leyes universales, independientes del stack. Añade 2–4 leyes propias del stack del destino (ejemplos del origen: orquestadores tontos — `main.py` legible en <15 s; configuración centralizada en `constants.py` + `.env`; parsers sin red ni disco).

## Resultado de la fase

| Decisión | Valor | Dónde queda plasmada |
|---|---|---|
| Modo | sembrar \| parasitar | F7 (procedencia) · F4 si parasitar |
| Operador | `<nombre/rol>` | F1 (§5 mantenimiento) · F5/F6 contratos |
| Zona horaria | `<tz>` | F5 (SCHEMA) · todos los timestamps |
| Idioma | `<idioma>` | todo el destino |
| Troncos inventariados | `<lista>` | F1 (§2, §3) · F4 (ítems de onboarding) |
| Prefijos de ID | `<lista>` | F5 (README, SCHEMA) |
| Leyes de stack | `<2–4>` | F1 (§4, leyes 13+) |
