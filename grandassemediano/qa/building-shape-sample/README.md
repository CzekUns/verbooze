# Un palazzo campione nella forma — 25 novembre 2026

Il primo intervento su colori e dettagli lasciava il contorno molto frastagliato. Su richiesta dell'utente è stato ridisegnato **un solo corpo edilizio**, ID OSM 733704038, vicino a Via Roma. È una proposta di geometria di gioco, non una correzione cartografica o un rilievo fotografico.

| Aspetto | Prima | Campione |
| --- | --- | --- |
| Contorno | 18 segmenti, piccoli rientri e sporgenze | Quattro lati continui, corpo regolare |
| Superficie del corpo di gioco | 261,085 unità² | 264,88 unità² (+1,45%) |
| Altezza sorgente | 13 | 13 |
| Palette | Rosa spento del primo pilota | Identica |
| Balconi | Segni piatti nel piano della parete | Soletta sporgente 0,9 unità, spessore, ringhiera e ombra |
| Collisione a terra | Vecchio contorno frastagliato | Nuovo corpo regolare |

Originale OSM conservato nel file mappa. `building-shape-sample.mjs` conserva inoltre l'impronta di gioco precedente per il confronto e si applica solo se ID e sagoma attesa coincidono. Gli altri edifici conservano la propria geometria. Trasformazione prima di stili e indici, per allineare rendering, collisioni e ricerca delle porte.

## Confronti autentici

| Vista | Prima | Dopo |
| --- | --- | --- |
| Desktop 1280×720 | [prima](before-desktop-campione.png) | [campione](after-desktop-campione.png) |
| Telefono emulato 844×390 | [prima](before-mobile-campione.png) | [campione](after-mobile-campione.png) |

[Notte desktop](night-desktop-campione.png) · [Notte telefono emulato](night-mobile-campione.png).

Camera focalizzata su `(1123,1285)`, zoom 8,4, stessa camera dall'alto, 11:00 sereno; notte alle 21:30. Il protagonista resta allo spawn valido, fuori dal palazzo; viene inquadrato il campione fermando il rendering dopo il caricamento. Nessuna deformazione o generazione delle immagini di prova. Il prima è acquisito dal worktree del commit c02df79; il dopo dal codice aggiornato. I JSON delle acquisizioni non riportano pageerror o HTTP >=400.

**700 test superati.** Verificati isolamento a un solo edificio, area/altezza, aggiornamento della collisione, sorgente immutata, assenza di conflitti con strade/POI/vicini e sporgenza effettiva dei balconi. Il margine del corpo dall'asfalto è almeno 1,5 unità; corpi vicini separati di almeno 1. Controllati nel browser sia giorno sia notte, desktop e telefono emulato. Android fisico non verificato; nessuna affermazione di eliminazione degli altri problemi aperti.

Nel gioco: PAUSA → NOVITÀ → «Palazzo campione: sagoma regolare e balconi sporgenti» → VAI A VEDERE. Pagina versione 225. La nuova sagoma va valutata prima di estenderla agli altri palazzi.
