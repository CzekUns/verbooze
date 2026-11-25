# Via Roma — prima applicazione estetica, 24 novembre 2026

Direzione approvata dal bozzetto: palette più sobria, facciate ordinate, finestre e balconi allineati, tetti più semplici. Questa è la prima implementazione effettiva nel renderer, su otto edifici ordinari. Non è una ricostruzione fotografica. Rimangono la camera molto dall'alto, le sagome, le altezze e le collisioni esistenti; nessun nuovo PNG o edificio speciale sostituito.

| ID OSM | Famiglia stilizzata | Copertura |
| --- | --- | --- |
| 733704085 | Casa storica | Tegole attenuate |
| 733704038 | Palazzina rosa spento | Terrazzo |
| 733704138 | Condominio grigio caldo | Terrazzo |
| 733704135 | Palazzina crema | Terrazzo |
| 733704185 | Casa ocra tenue | Terrazzo |
| 733704239 | Casa storica | Tegole attenuate |
| 733704361 | Palazzina crema | Terrazzo |
| 733704281 | Palazzina rosa spento | Terrazzo |

Il resto della città conserva lo stile precedente. Palette e tipologie sono proposte artistiche. Le facciate photo-verified sono escluse; chiesa e Municipio non appartengono al gruppo. Le nuove pareti usano una griglia comune per finestre, balconi e luci notturne. Tolte le tende da negozio generiche del vecchio renderer sui soli otto fabbricati; non sono stati inventati nuovi negozi.

## Confronti autentici, stessa posizione e stesso zoom

| Vista | Prima | Dopo |
| --- | --- | --- |
| Via Roma nord, desktop | [prima](before-desktop-nord.png) | [dopo](after-desktop-nord.png) |
| Via Roma nord, telefono emulato | [prima](before-mobile-nord.png) | [dopo](after-mobile-nord.png) |
| Via Roma sud, desktop | [prima](before-desktop-sud.png) | [dopo](after-desktop-sud.png) |
| Via Roma sud, telefono emulato | [prima](before-mobile-sud.png) | [dopo](after-mobile-sud.png) |

[Notte desktop](night-desktop-nord.png) · [Notte telefono emulato](night-mobile-nord.png).

Camera nord `(1180,1305)`, sud `(1240,1405)`; desktop 1280×720, zoom 5; telefono emulato 844×390, zoom 4,8. Sereno alle 11:00, prova notturna alle 21:30. Acquisizione dal gioco locale dopo navigazione landing→GAM, mondo fermato per confrontare la medesima camera; personaggi e traffico possono differire. Dati e pageerror/risposte HTTP >=400 nei JSON, nessun errore nelle acquisizioni. Non è un test Android fisico.

**696 test superati.** Le verifiche includono preservazione di geometrie/volumi e isolamento agli otto ID, esclusione delle facciate fotograficamente verificate, corrispondenza tra finestre e luci notturne, ritaglio corretto delle decorazioni alle vere pareti. La suite continua a verificare le precedenti correzioni delle posizioni e dei comandi.

Nel gioco: PAUSA → NOVITÀ → «Via Roma: facciate ordinate e terrazzi puliti» → VAI A VEDERE. Versione pagina 224. Il bozzetto approvato è una direzione artistica: il risultato qui è quello realmente ottenuto con la camera e il renderer del gioco.
