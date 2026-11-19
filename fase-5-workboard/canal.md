# Canal ascendente de issues (contrato §3.12)

El montaje asigna `item` con el ID del ítem «Configurar el canal de issues ascendentes» que crea en `items/`. El cierre de ese ítem escribe `upstream` (repo oficial del corpus, formato `OWNER/REPO`) y activa el canal; su cancelación (opt-out del operador) deja `upstream: null`. `verify-workboard.mjs` comprueba la coherencia entre este archivo y el ítem.

upstream: null
item: null
