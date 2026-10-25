---
id: SEED-013
title: "Capa determinista: hooks nativos de git + test-first mode (§6.4)"
status: done
priority: P1
class: agente
node: .
parent: null
claimed_by: null
claimed_at: null
created_at: 2026-10-24T17:30:00+02:00
updated_at: 2026-10-24T18:20:00+02:00
closed_at: 2026-10-24T18:20:00+02:00
closed_reason: null
touches:
  - fase-5-workboard/
  - fase-1-mapa-maestro.md
  - fase-6-dominios/protocolos/agente.md
  - fase-3-plantillas/fruit.md
blocks: [SEED-014]
blocked_by: []
acceptance:
  - "fase-5-workboard/hooks/pre-commit: verificador del workboard (si el nodo está montado), instancia viva _dev, bloqueo de worktrees/.env y de secretos obvios en el diff; degradación con aviso si no hay node"
  - "README del workboard: sección «Capa determinista» con instalación core.hooksPath y lo que bloquea; contrato §2 mapa y §3 regla de requisitos mecanizados (tip 38)"
  - "Tríada ampliada a cuádruple (regla|check|hook|eval) en mapa §5 y agente.md regla 7"
  - "Plantilla de fruto §6.4: test first mode restaurado (perdido en la modularización v1.0.0)"
  - "Hook probado en fixture: commit con INDEX desincronizado BLOQUEADO, commit limpio APROBADO, .env BLOQUEADO"
  - "Hook instalado en la semilla (core.hooksPath) y verify-workboard.mjs verde sobre _dev/workboard"
subtasks:
  - "[x] hooks/pre-commit"
  - "[x] README + contrato"
  - "[x] Tríada cuádruple"
  - "[x] fruto §6.4"
  - "[x] Test en fixture"
  - "[x] Instalación en la semilla"
external:
  - null
decision_log:
  - "2026-10-24T17:20:00+02:00 (operador): nivel 1 (UX de cliente) queda fuera del corpus; nivel 2 se toma en UN solo punto (test-first, cerrando el hueco de la modularización); el tip 13 (logs crudos) se excluye salvo evidencia futura de coste en tokens (tríada lo decidirá)."
  - "2026-10-24T18:10:00+02:00 (zcode): el hook deriva el workboard desde su propia ubicación (dirname/..) — el mismo script sirve para el destino (docs/workboard/hooks) y para la semilla (fase-5-workboard/hooks), sin duplicación."
  - "2026-10-24T18:15:00+02:00 (zcode): verificador se omite con aviso si no hay node — la higiene (worktrees/.env/secretos) sigue activa; sin degradar repos sin node."
---

## Contexto

Tip 38 del corpus: «CLAUDE.md is advisory (~80%). Hooks are deterministic (100%). If something must happen every time, make it a hook.» La semilla tiene reglas (consultivas) y checks (verificador — pero depende de que el agente recuerde ejecutarlo: falló 3 veces la sincronización INDEX↔ítems antes de que el verificador lo detectara). Falta la capa determinista, y en un harness documental basado en git es nativa: los hooks de git.

## Notas

- Recursos: ninguno (script sh sin dependencias más allá de git y node para el verificador; degrada con aviso sin node).
- El tip 13 (logs crudos) se excluye por decisión del operador; la tríada lo traerá si la evidencia muestra coste.

## Evidencia

- `fase-5-workboard/hooks/pre-commit`: 4 verificaciones (verificador del workboard si `items/` existe; instancia viva `_dev/workboard` en la semilla; bloqueo de `worktrees/`/`.env`; bloqueo de secretos obvios con patrones sk-/ghp_/github_pat_/AKIA/xox/PRIVATE KEY).
- README del workboard: sección «Capa determinista» (instalación, qué bloquea, degradación, desinstalación); contrato §2 (fila de `hooks/` en el mapa) y §3 regla 10 (requisitos mecanizados: ~80% reglas / 100% hooks).
- Tríada ampliada a cuádruple (regla | check | hook | eval) en mapa §5 y `agente.md` regla 7.
- `fase-3-plantillas/fruit.md` §6.4: test first mode restaurado.
- **Test en fixture (5 casos, exit codes capturados sin pipes)**: montaje limpio → 0; INDEX desincronizado → BLOQUEADO con «INDEX.md: DOC-001 listado pero está archivado en _done/»; workboard válido → 0; `.env` → BLOQUEADO («contrato §5.1»); secreto `sk-...` → BLOQUEADO («principio 10»). Dos primeros intentos de test fueron inválidos por errores del fixture (sin closed_at; fila con status vacío en vez de eliminada) — corregidos y re-ejecutados.
- **Instalado en la semilla**: `chmod +x` + `git config core.hooksPath fase-5-workboard/hooks` — este mismo ítem se archiva en un commit que pasa por el hook (primera aplicación real).
- `node fase-5-workboard/verify-workboard.mjs _dev/workboard` → código 0.
