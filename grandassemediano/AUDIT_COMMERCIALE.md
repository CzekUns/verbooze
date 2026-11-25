# GAM — Grand Asse Mediano: audit della distribuzione commerciale

Data: 25 novembre 2026. Ambito esclusivo: `CzekUns/verbooze`, gioco in `grandassemediano/`, landing Verbooze. **Esito: bonifica tecnica implementata e collaudata; lancio commerciale ancora bloccato dai punti documentali sotto. Non è una certificazione di conformità legale.** La gratuità del gioco e l'assenza di loghi non dimostrano che tutti gli asset siano utilizzabili commercialmente.

## Interventi effettuati

| Area | Rimosso | Sostituito / conservato |
|---|---|---|
| Radio | Sei emittenti reali, modulo di streaming, URL, link, controlli e scorciatoie | Effetti/ambiente sintetizzati con Web Audio; `licensed-audio.mjs` vuoto per eventuali contenuti locali autorizzati |
| Fotografie satellitari | Modulo di sovramappa, UI, parametri di avvio e voce NOVITÀ; nessuna tile distribuita | Osservazioni storiche conservate come documentazione da verificare, non come licenza |
| Auto | Denominazioni commerciali, vecchi raster, master e generatori dei modelli reali | PNG di fantasia: sedici sagome passenger, famiglia Borgo, furgoni e tricicli ridisegnati; nuove finestre, fanali e carrozzerie, non sola ricolorazione |
| Moto | Nome dello scooter riconducibile a modello commerciale; vecchio atlante | Quattro famiglie di due ruote ridisegnate in quattro colori |
| Servizi | Nessuna funzione rimossa | Atlanti generici corriere/nettezza e carro attrezzi/autobus conservati: sorgente procedurale presente, concessione del contributo ancora da documentare |
| Attività | Nomi commerciali dei POI e dei fabbricati nel database e nei rilievi; vecchi nomi in cache filtrati | Nomi generici per categoria con ID, coordinate, tipo e funzioni conservati; municipio, chiese e nomi geografici conservati |
| Marchi del progetto | Riferimenti a precedenti marchi/portali nell'interfaccia, nei metadati, nei sorgenti e nei documenti correnti | Verbooze / GAM — Grand Asse Mediano / Melito; soli identificatori legacy necessari alla migrazione isolati in `storage-migration.mjs` |
| Avvio e navigazione | Artwork alternativi non approvati e screenshot storici della distribuzione precedente | Artwork ufficiale GAM e landing approvata identici nei byte; barra basata su nove operazioni reali; ritorno alla landing corretto |
| Spawn | Personaggio disegnato della prima interazione | Primo obiettivo come messaggio, stessa missione e progressione |
| Smartphone | — | Pulsante schermo intero 44×44, ingresso/uscita con gesto utente, API standard/WebKit e avviso per browser incompatibili |

Non sono stati cambiati visibilità della repository o contenuti della repository originale. I precedenti interventi su posizioni e sagome dei palazzi sono preservati; non sono una ricostruzione catastale.

## Flotta e compatibilità dei salvataggi

I master nuovi sono `assets/vehicles/sources/fictional-cars-master.png` e `fictional-utility-master.png`, generati con ImageGen in questa sessione su richiesta di veicoli originali senza marchi o repliche. La pipeline `scripts/pack-fictional-fleet.py` effettua crop completo delle sagome, scala proporzionale nearest-neighbour, quantizzazione dell'alpha e delle tinte, e impaginazione nelle celle originali. Nessun SVG o placeholder sostituisce i nuovi PNG. Tutti i formati di atlante e gli ingombri di mondo restano compatibili; i rettangoli di crop dei due furgoni seguono ora il loro alpha effettivo. Borgo usa due sagome della stessa nuova famiglia già presente nella flotta.

Confronto indipendente con la versione prima della rinomina: **228 varianti** con profili numerici di guida, collisioni e dimensioni di disegno identici (salvo i nomi), risultati in `qa/commerciale/mechanics-comparison.json`. Profili numerici di guida, traffico, parcheggi e collisioni conservati; i nomi cambiano insieme ai riferimenti. La migrazione copia i vecchi progressi nelle nuove chiavi e traduce gli ID dei mezzi posseduti; non elimina il backup e non sovrascrive nuovi salvataggi. Un filtro applicato prima della preparazione della mappa impedisce ai nomi commerciali di rientrare dalle vecchie cache. Il gioco usa lo snapshot locale, senza acquisire dati esterni non revisionati.

Budget degli atlanti RGBA aggiornato a 40 KB ciascuno per il disegno più dettagliato; flotta runtime circa 318 KB complessivi. I master non vengono caricati dal gioco. Trasparenza, dimensioni delle celle, ritaglio, rotazione e presenza dei corpi sono verificati dai test; le vecchie prove sui generatori ritirati sono riferite ai nuovi master effettivi.

## Verifica delle licenze e attribuzioni

Verifiche su fonti primarie il 25 novembre 2026; le condizioni vanno ricontrollate se cambiano dati, servizi o modalità di distribuzione. [ATTRIBUZIONI.md](./ATTRIBUZIONI.md) contiene gli avvisi e i collegamenti per il pubblico.

| Risorsa | Evidenza e condizioni | Stato |
|---|---|---|
| OpenStreetMap | [Copyright OSM](https://www.openstreetmap.org/copyright), [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/), [linee guida OSMF](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines). Riutilizzo anche commerciale, attribuzione e obblighi sulla banca dati derivata | Avviso visibile nel gioco e nei crediti; snapshot derivato, correzioni e strumenti disponibili nella repository e scaricabili con il gioco sotto ODbL. Non estendere automaticamente questa licenza a codice/sprite |
| Confine ISTAT | [Note legali ISTAT](https://www.istat.it/note-legali/) e licenza della fonte intermediaria [geojson-italy](https://github.com/guglielmo/geojson-italy/blob/master/LICENSE): CC BY 4.0, avviso Openpolis | Testo integrale conservato in `licenses/geojson-italy-CC-BY-4.0.txt`; attribuzioni ISTAT, intermediario e Openpolis conservate. Il file dichiara 2026: archiviazione dell'esatta estrazione/versione originaria ancora necessaria |
| Punjab Stories | [LICENSE originale](https://github.com/harmanhanjra/punjab-stories/blob/main/LICENSE), MIT, Copyright (c) 2026 Hnjra | Testo integrale in `licenses/punjab-stories-MIT.txt`; avviso conservato per l'ispirazione/possibile derivazione già dichiarata. Non dimostra licenza sull'intero progetto né sugli asset GAM |
| Nuovi raster di fantasia | Master e trasformazioni riproducibili della sessione; [termini europei OpenAI](https://openai.com/policies/eu-terms-of-use/) | I termini regolano il rapporto utente/fornitore; non certificano originalità, esclusiva o assenza di diritti di terzi. Conservare record di generazione e valutare distintività |
| Artwork ufficiale e grafica storica | Approvazione grafica nei precedenti handoff e note; nessun fascicolo completo di concessioni associato a tutti i file | **Bloccante**: vedere inventario e azioni sotto |
| Audio | Nessun file musicale/registrazione distribuito; oscillatori e rumore sintetizzati in `city-audio.mjs` | Nessuna licenza di emittente o campionamento invocata. Confermare titolarità del codice/contributi; ogni futura musica richiede licenza registrata prima di abilitarla |
| Font | Famiglie di sistema; nessun font binario o webfont scaricato | Nessun font redistribuito. Non usare i nomi di font installati come prova di licenza per futuri file incorporati |
| Librerie | Nessun pacchetto runtime vendorizzato: moduli locali e API browser. Playwright/Chromium sono strumenti di QA, Pillow/NumPy strumenti di packing | Nessun binario di tali strumenti incluso nel gioco; dipendenze di sviluppo non costituiscono licenza sul gioco. Il codice locale richiede verifica delle concessioni dei contributori |
| Foto e materiali online di riferimento | Link nei rilievi; nessuna immagine satellitare incorporata. Campetti, torre e alcune osservazioni derivano da confronto fotografico | **Bloccante documentale**: verificare fonte e condizioni dei dati derivati; consultare il punto specifico sotto |
| Servizi esterni | Radio e sovramappa rimossi; download Overpass automatico rimosso dall'avvio. Nessun ads/analytics/servizio musicale abilitato dal gioco | Zero richieste esterne nelle due sessioni browser registrate. Link di attribuzione sono collegamenti volontari, non fetch automatici. `osm.mjs` resta anche strumento di elaborazione: una futura acquisizione richiede nuova revisione |

## Inventario e revisione visiva

[asset-rights-inventory.csv](./asset-rights-inventory.csv) registra ogni file di asset e sorgente con percorso, dimensione, SHA-256, gruppo, provenienza dichiarata e stato dei diritti. È un inventario verificabile, non un'attribuzione automatica di proprietà. Include anche l'artwork della landing. Gli elementi storici senza concessione completa sono esplicitamente marcati **BLOCCANTE**.

Ispezionati i master nuovi e le tavole degli atlanti; riviste per contatto le altre immagini (persone, animali, banchi, ritratti, monumenti e caricamento). Questa revisione a miniature non equivale a controllare ogni pixel di ogni frame o a una ricerca di similarità/marchi. Nessuna registrazione audio o font incorporato trovato nell'albero corrente degli asset. Vecchi PNG/JPG di caricamento e immagini di QA sono stati rimossi dall'albero corrente per non redistribuire versioni obsolete; la cronologia pubblica git continua a conservarli e **non è stata riscritta**.

## Collaudo realmente eseguito

- Node: `node --test grandassemediano/*.test.mjs grandassemediano/survey/*.test.mjs`: **682/682 passati**, zero fallimenti. Il totale precedente di 700 riguardava anche funzionalità ritirate: non rappresenta una regressione nascosta; test obsolete di radio/satellite/loading sostituiti dai nuovi requisiti.
- Test nuovi: assenza connessioni radio/satellite negli entrypoint, fullscreen standard/non supportato, prima missione messaggio, anonimizzazione idempotente e integrità geometrica della mappa, migrazione salvataggi senza perdita o sovrascrittura.
- Chromium headless, PC 1280×720 e telefono emulato 844×390: caricamento e barra al 100%; fullscreen ingresso/uscita; movimento; auto e moto (salita, accelerazione, frenata, discesa); collisione a piedi con un edificio; presenza NPC e traffico in avanzamento; banca dentro/fuori; bar interno, acquisto al bancone e uscita; prima missione; salvataggio e ricaricamento; menu smartphone; gesto puntatore sulla levetta mobile.
- Minigiochi: apertura/uscita slot, poker, goriziana e biliardo; prima azione slot e poker. Le partite complete, il calcetto e le gare non sono stati rigiocati interamente nel browser in questa sessione; le rispettive logiche restano coperte dalla suite Node.
- Nessun `pageerror`, errore console, risposta HTTP mancante o richiesta esterna nelle sessioni. Dunque nessuna chiamata agli streaming rimossi durante le prove.
- Prove riproducibili in `scripts/qa-commercial.cjs`, risultati e screenshot in [qa/commerciale/](./qa/commerciale/browser-results.json). Il collaudo inietta solo nella risposta del server di test l'accesso allo stato per raggiungere posizioni mirate; non aggiunge API debug al codice distribuito. Gli input e i controlli vengono poi usati nel browser.
- Non verificati: telefono Android/iPhone fisico, Safari/WebKit reale, tutte le dimensioni schermo, sessioni lunghe, ogni negozio/missione, notte/pioggia complete, ogni frame grafico. La disponibilità del fullscreen dipende dal browser; dove non supportato il comando viene disabilitato con spiegazione.

## Criticità residue e azioni prima del lancio commerciale

1. **BLOCCANTE — fascicolo diritti su asset e contributi.** Raccogliere originali, autore, fonte, termini applicabili alla generazione/fornitura e concessioni commerciali per persone, pose, animali, banchi, ritratti, chiesa, torre, mezzi di servizio e artwork ufficiale. Le note di alcuni ritratti dichiarano generazione ma non bastano a completare la catena. Un file privo di logo o un'approvazione estetica non sono una liberatoria. I file sono mantenuti per non eliminare funzionalità, come consentito dalla richiesta, e bloccano il nulla osta commerciale finché non documentati o sostituiti.
2. **BLOCCANTE — rilievi da immagini e confine.** Per `football-pitches.mjs`, posizione della torre, rilievi/survey e `audit-satellite.csv`, documentare la fonte delle misure/osservazioni e se le condizioni consentono la derivazione e la distribuzione prevista, oppure sostituire la fonte con dati indipendenti/autorizzati. Non sostenere che l'ODbL di OSM copra materiale fotografico estraneo. Archiviare URL/versione/hash dell'esatto confine sorgente ISTAT/intermediario e relativo processo di estrazione.
3. **BLOCCANTE — titolarità del codice.** Confermare concessioni dei collaboratori sul codice e sugli asset importati; definire la licenza del progetto per la distribuzione voluta. L'avviso MIT di un motore citato non rilascia automaticamente tutto GAM in MIT.
4. **Valutazione legale di distintività.** Verificare nome GAM/Verbooze, logotipo/artwork ufficiale conservato per richiesta, confezione visiva, nuovi mezzi e luoghi riconoscibili rispetto a marchi, disegni/modelli e altri diritti. La generazione di fantasia riduce riferimenti espliciti, non dà garanzie di non interferenza. Per monumenti/architetture verificare gli eventuali diritti e regimi specifici applicabili.
5. **Monetizzazione futura.** Non è stata integrata pubblicità né un servizio musicale. Prima di abilitarli verificare contratti, privacy/consensi e condizioni del fornitore pertinenti. Slot/poker usano soltanto crediti virtuali: valutare classificazione per età, distribuzione e regole effettivamente applicabili senza presumere che la sola gratuità risolva ogni tema.
6. **QA residuo.** Prova su dispositivi fisici e browser principali; passata completa di missioni, gare, calcetto e interni. Restano i conflitti geometrici storici (76 casi nell'audit di posizionamento, inclusi casi solo visivi) e il passante osservato nell'impronta 733704295. Non sono stati dichiarati risolti dalla bonifica.
7. **Cronologia e pubblicazione.** Gli asset/riferimenti ritirati possono essere recuperati dalla cronologia git pubblica. Non sono stati cancellati dalla storia né modificata la visibilità: la decisione resta al proprietario. Questa distribuzione tecnica non equivale a dichiarare pronto o autorizzato il lancio commerciale.
