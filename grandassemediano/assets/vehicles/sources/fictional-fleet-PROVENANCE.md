# Flotta di fantasia — record di lavorazione

25 novembre 2026, richiesta del proprietario in ChatGPT Work per la bonifica commerciale di Verbooze/GAM. Creazione creativa con ImageGen; nessun catalogo di sprite di terzi importato in questa tranche.

- `fictional-cars-master.png`: originale generato `exec-1521411c-e2fc-474a-bf60-56d3e4e9eba4.png`, 1086×1448 RGBA. Prompt: 16 auto completamente immaginarie, griglia 4×4, muso in alto, pixel art, carrozzeria turchese da ricolorare, vetri/tetti/fanali originali, senza testo/loghi né repliche di modelli commerciali.
- `fictional-utility-master.png`: originale generato `exec-0ad32c92-e803-47d0-b5fb-90214250a7f2.png`, 1536×1024 RGBA. Prompt: griglia 4×2, due tricicli cargo di fantasia, due furgoni inventati, quattro due ruote senza pilota; vista dall'alto, turchese, senza marchi, repliche o scritte.
- Packing riproducibile: `../../../scripts/pack-fictional-fleet.py` (dalla root: `python3 grandassemediano/scripts/pack-fictional-fleet.py`). Crop delle celle complete con intervalli espliciti per i margini non uniformi del master auto; scala proporzionale nearest-neighbour; soglia alpha 240 per eliminare semitrasparenze del master; mappatura delle sole tinte turchesi della carrozzeria ai colori degli ID e quantizzazione. Nessun ridisegno creativo tramite codice.
- `fictional-fleet-layout.json` registra celle e bounds alpha effettivi. Dimensioni dei corpi fisici/guida restano nei moduli di gioco; il crop non modifica tali valori. Confronto indipendente su 228 varianti in `../../../qa/commerciale/mechanics-comparison.json`.
- Nuovi master e atlanti sono identificati con SHA-256 nell'inventario alla radice del gioco. Il record di generazione deve essere conservato dal proprietario insieme ai termini applicabili all'account.

La provenienza da generazione assistita non garantisce esclusività, originalità tutelabile o assenza di diritti di terzi. Esaminare distintività e somiglianze prima del lancio commerciale, come richiesto nell'audit. Gli atlanti di servizio procedurali preesistenti non provengono da questi master e richiedono conferma separata sui contributi.
