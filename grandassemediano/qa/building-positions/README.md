# Revisione delle posizioni — 24 novembre 2026

Controllati tutti i **2.599 edifici caricati**: 2.056 OSM e 543 segnaposto sintetici dopo l'esclusione dei campetti. Sono correzioni della mappa di gioco, non rilievi urbanistici. Le sagome originali OSM sono conservate nel file sorgente.

| Misura | Prima | Dopo |
| --- | ---: | ---: |
| Edifici con corpo o volume visivo nell'asfalto (margine 0,5 m) | 675 | 76 |
| Impronta fisica nell'asfalto | 182 | 47 |
| Impronta fisica sulla linea centrale di almeno una strada | 39 | 16 |

**599 correzioni:** 321 spostamenti senza riduzione e 278 riduzioni uniformi con eventuale spostamento: 103 al 85%, 95 al 70%, 80 al 55% delle dimensioni orizzontali iniziali. Sagome complete, senza tagli o deformazioni di un singolo asse. Alcuni arretramenti sono sostanziali: massimo 36 m aggiuntivi, 48 m totali dalla sagoma sorgente. Le altezze stilizzate restano quelle del renderer.

Ogni posizione accettata libera l'intero corridoio stradale e il tetto, non sovrappone l'impronta a edifici vicini (0,4 m di distanza), non copre POI, resta nel confine comunale e fuori dai campetti. I palazzi con nome o con POI interni sono esclusi dagli spostamenti automatici per preservare luoghi e ingressi. La trasformazione viene applicata prima degli stili, indici spaziali, porte e collisioni; nessuna ricerca geometrica pesante all'avvio.

I **76 casi residui**, inclusi 16 sulla linea centrale, sono elencati con ID OSM, strade e motivo nel [rapporto completo](../../survey/building-position-review.json). Non sono dichiarati risolti: 15 sono edifici con nome/POI da trattare singolarmente, gli altri non hanno trovato spazio entro i limiti. Nessuna cancellazione o maschera aggiunta per nasconderli.

## Confronto autentico, stessa camera

| Luogo | Prima | Dopo |
| --- | --- | --- |
| Via Papa Giovanni XXIII / Via Madonelle — desktop | [prima](before-desktop-733704795.png) | [dopo](after-desktop-733704795.png) |
| Stesso incrocio — telefono emulato | [prima](before-mobile-733704795.png) | [dopo](after-mobile-733704795.png) |
| Via Antonio De Curtis — desktop | [prima](before-desktop-733703279.png) | [dopo](after-desktop-733703279.png) |
| Stessa zona — telefono emulato | [prima](before-mobile-733703279.png) | [dopo](after-mobile-733703279.png) |

Chrome headless, desktop 1280×720 a zoom 4; mobile emulato 844×390 a zoom 3; ore 11, sereno. I frame sono fermati dopo il caricamento: confronto geometrico, non prova manuale di guida o touch. Nei JSON di acquisizione nessun pageerror o risposta HTTP >=400. Android fisico non verificato.

## Riproduzione

`node grandassemediano/survey/review-building-positions.mjs` ricostruisce il rapporto dalla posizione precedente conservata in `baseline-placement.json`; può richiedere alcuni minuti. Il generatore produce il rapporto e non pubblica né sovrascrive la tabella runtime. I test ricontrollano tutte le 599 correzioni applicando la tabella runtime effettiva, verificano collisioni tra vicini, asfalto, POI e conteggi residui.

## Trasferimento in Verbooze

Le immagini `after-*` sono state riacquisite nella copia `grandassemediano/` di Verbooze, entrando dalla sua landing e verificando la conclusione del caricamento ufficiale. Ore, meteo, posizioni e zoom sono quelli del confronto originario. Risultati: `verbooze-after.json`; suite Verbooze **687/687**. La correzione include gli spigoli verticali ed è adattata alle modifiche del caricamento introdotte dopo la prima lavorazione.
