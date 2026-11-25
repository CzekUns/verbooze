# Verbooze

Portale indipendente di videogiochi. Prima versione: un'unica landing dedicata a GAM — Grand Asse Mediano: Melito.

## Cloudflare Pages
Collegare la repository privata a Cloudflare Pages, branch `main`, framework None, nessun comando di build, cartella di output `/` (radice della repository).

La landing usa un artwork GAM locale e collega il gioco ospitato in questa repository: `./grandassemediano/`. GAM è stato importato da Effettokarmagra; lo sviluppo prosegue qui. Nessun tracking, pubblicità o link social ancora attivi. La pulizia di radio, marchi e negozi per il lancio commerciale resta da completare.

Test: `node --test grandassemediano/*.test.mjs grandassemediano/survey/*.test.mjs`. Per istruzioni e passaggio di consegne leggere `AGENTS.md` e `grandassemediano/WORK_LOG.md`.
