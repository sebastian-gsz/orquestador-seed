# Workboard de desarrollo de la semilla (instancia viva)

El contrato canónico es [fase-5-workboard/ARCHITECTURE.md](../../fase-5-workboard/ARCHITECTURE.md) — esta instancia no duplica reglas (una sola fuente por dominio). Procedimiento resumido: [fase-5-workboard/README.md](../../fase-5-workboard/README.md).

La semilla usa su propio harness para desarrollarse: cada mejora se levanta como ítem con claim, `touches`, evidencia y cierre, exactamente como ocurrirá en los destinos.

- Ítems activos: [INDEX.md](INDEX.md) · Archivo histórico: `items/_done/`
- Verificación mecánica (desde la raíz de la semilla): `node fase-5-workboard/verify-workboard.mjs _dev/workboard`
- IDs: prefijo `SEED-###` (no se reutilizan)
- Entorno: git + Node ≥ 18 para el verificador. Sin más dependencias.
