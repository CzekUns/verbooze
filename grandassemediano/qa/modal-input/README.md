# Comandi dietro le schermate — 24 novembre 2026

Quattro difetti riprodotti con Chromium e tasti reali nella copia di Verbooze; stessa prova prima/dopo. L'harness posiziona il protagonista vicino alla Panda iniziale o all'ingresso Banco BPM per rendere i casi ripetibili.

| Prova | Prima | Dopo |
| --- | --- | --- |
| Vicino all'auto, P per pausa, E | Si sale in auto dietro la pausa | Si resta a piedi |
| Vicino all'auto, M per mappa, E | Si sale in auto dietro la mappa | Si resta a piedi |
| Vicino all'auto, messaggio aperto, E | Si sale in auto dietro il messaggio | Si resta a piedi |
| Dentro la banca, P, Esc | Si esce dalla banca; pausa ancora aperta | Si chiude la pausa; si resta in banca |

`before.json` e `after.json` contengono gli stati osservati. Dopo la correzione nessun errore JavaScript nelle prove. Le schermate assorbono anche i tasti di movimento, missione e Rider; la mappa si chiude con M/Esc, i messaggi con Esc/Invio/Spazio. Il telefono conserva navigazione e ritorno alla schermata precedente.

`modal-input.test.mjs` esegue il corpo effettivo del gestore tastiera con callback osservabili, includendo navigazione del telefono, pressione ripetuta e input normali senza finestre. Il test smoke importa il gioco intero e ora inizializza gli attributi `hidden` dal vero HTML: prima la finta pausa risultava aperta fin dall'avvio.

Suite completa: 692/692. Queste prove riguardano la tastiera desktop; non costituiscono collaudo Android o di tutti i minigiochi. Nessuna correzione delle 76 posizioni ancora aperte in questa tranche.
