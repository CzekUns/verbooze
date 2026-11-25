/* GAM Melito — compact top-down PNG vehicle skins. Borgo PNGs unchanged.
 * Alba 188 and Luna 2003: 16 recolored cars, clean transparent 4x4 PNG atlas, 40x60/cell.
 * Lotto 1: Aurora 2005 and Luna III 2011, same 4x4 40x60 grid (atlas by CODEX-GH).
 * Lotto 5: Corallo 2016 and FARO 2012, same grid (atlas by CODEX-GH).
 * Lotto 6: Autosalone 01 Quarzo 2012 and costruttore di fantasia Onda 2012, same grid (atlas by CODEX-GH).
 * Lotto 7: costruttore di fantasia Iris 2014 and Sabbia 2012; lotto 8: costruttore di fantasia Altura 2013 and costruttore di fantasia Sentiero 2010 (CODEX-GH).
 * Lotto 9: costruttore di fantasia Cargo II 2010 and costruttore di fantasia Bottega III 2008, work vans on a 4x4 grid with the 52x92 cells of the Q18
 * service atlas (CODEX-GH); the first extra atlas with its own cell size (EXTRA_MODELS «cell» + «body»).
 * Body colors are illustrative, not all factory paint codes verified.
 */
export const CAR_SPRITES=Object.freeze({
 'borgo-nuova-white':'./assets/vehicles/borgo-nuova-white.png',
 'borgo-classica-red':'./assets/vehicles/borgo-classica-red.png',
 'triciclo-car-azzurra':'./assets/vehicles/triciclo-car-top.png',
 'furgone-fritti':'./assets/vehicles/furgone-fritti-top.png',
});
export const CAR_ATLAS_PATH='./assets/vehicles/alba-luna-16colors-rgba.png';
export const CAR_ATLAS_CELL=Object.freeze({width:40,height:60,columns:4,rows:4});
const ALBA=['white','red','blue','silver','graphite','black','mint','champagne'];
const LUNA=['white','black','silver','graphite','navy','lightblue','burgundy','champagne'];
export const CAR_ATLAS_VARIANTS=Object.freeze(Object.fromEntries([
 ...ALBA.map((color,i)=>['alba-'+color,{index:i,model:'alba',color}]),
 ...LUNA.map((color,i)=>['luna-'+color,{index:i+8,model:'luna',color}])
]));
export const CAR_ATLAS_VARIANT_IDS=Object.freeze(Object.keys(CAR_ATLAS_VARIANTS));

/* Additional 4x4 compact atlases, 8 illustrative colors per car generation. */
export const EXTRA_CAR_ATLASES=Object.freeze({
 '@nido-vela-atlas':'./assets/vehicles/nido-vela-16colors-rgba.png',
 '@riva-mira-atlas':'./assets/vehicles/riva-mira-16colors-rgba.png',
 // Lotto 1 (CODEX-GH, 2026-10-21): costruttore di fantasia Aurora 2005 and costruttore di fantasia Luna III 2011, RGBA atlas drawn by
 // code (sources/aurora-selce-16-genera.py). PROVISIONAL art, to be approved by Simone.
 '@aurora-selce-atlas':'./assets/vehicles/aurora-selce-16-rgba.png',
 // Lotto 5 (CODEX-GH, 2026-10-21): costruttore di fantasia Corallo 2016 and Faro 2012, RGBA atlas drawn by code
 // (sources/corallo-faro-16-genera.py, notes in corallo-faro-16-NOTE.md). PROVISIONAL art, to be approved by Simone.
 '@corallo-faro-atlas':'./assets/vehicles/corallo-faro-16-rgba.png',
 // Lotto 6 (CODEX-GH, 2026-10-21): Autosalone 01 Quarzo 2012 and costruttore di fantasia Onda 2012, RGBA atlas drawn by code
 // (sources/quarzo-onda-16-genera.py, notes in quarzo-onda-16-NOTE.md). PROVISIONAL art, to be approved by Simone.
 '@quarzo-onda-atlas':'./assets/vehicles/quarzo-onda-16-rgba.png',
 // Lotto 7 (CODEX-GH, 2026-10-21): costruttore di fantasia Iris 2014 and Sabbia 2012, RGBA atlas drawn by code
 // (sources/iris-sabbia-16-genera.py, notes in iris-sabbia-16-NOTE.md). PROVISIONAL art, to be approved by Simone.
 '@iris-sabbia-atlas':'./assets/vehicles/iris-sabbia-16-rgba.png',
 // Lotto 8 (CODEX-GH, 2026-10-21): costruttore di fantasia Altura 2013 and costruttore di fantasia Sentiero 2010, RGBA atlas drawn by code
 // (sources/altura-sentiero-16-genera.py, notes in altura-sentiero-16-NOTE.md). PROVISIONAL art, to be approved by Simone.
 '@altura-sentiero-atlas':'./assets/vehicles/altura-sentiero-16-rgba.png',
 // Lotto 9 (CODEX-GH, 2026-10-21): costruttore di fantasia Cargo II 2010 and costruttore di fantasia Bottega III 2008, work vans with generic liveries, RGBA
 // atlas 208x368 drawn by code (sources/cargo-bottega-16-genera.py, notes in cargo-bottega-16-NOTE.md): 4x4 cells of
 // 52x92 like the Q18 service atlas, not 40x60. PROVISIONAL art, to be approved by Simone.
 '@cargo-bottega-atlas':'./assets/vehicles/cargo-bottega-16-rgba.png',
});
/* Lotto 9: an extra atlas may declare its own cell (default CAR_ATLAS_CELL, 40x60) and the opaque «body» rectangle
 * [x,y,width,height] inside the cell, the same for all the colours of the model (checked by sources/verifica.py). When
 * «body» is set, only that rectangle is drawn at MODEL_DRAW_SIZE, so the size is the visible body and the damage marks
 * and focus frame hug the van instead of the wide transparent margins of the 52x92 cell. */
const WORK_VAN_CELL=Object.freeze({width:52,height:92,columns:4,rows:4});
const EXTRA_MODELS=Object.freeze([
 {model:'nido',atlas:'@nido-vela-atlas',offset:0,colors:['white','red','blue','silver','black','yellow','green','champagne']},
 {model:'vela',atlas:'@nido-vela-atlas',offset:8,colors:['white','black','red','lightblue','blue','silver','cream','graphite']},
 {model:'riva',atlas:'@riva-mira-atlas',offset:0,colors:['white','red','blue','silver','graphite','black','green','champagne']},
 {model:'mira',atlas:'@riva-mira-atlas',offset:8,colors:['white','black','red','lightblue','blue','silver','yellow','green']},
 {model:'aurora',atlas:'@aurora-selce-atlas',offset:0,colors:['white','red','blue','silver','graphite','black','lightblue','beige']},
 {model:'selce',atlas:'@aurora-selce-atlas',offset:8,colors:['white','red','silver','graphite','black','blue','beige','purple']},
 {model:'corallo',atlas:'@corallo-faro-atlas',offset:0,colors:['white','silver','graphite','sand','bronze','red','blue','black']},
 {model:'faro',atlas:'@corallo-faro-atlas',offset:8,colors:['white','red','silver','graphite','black','blue','yellow','green']},
 {model:'quarzo',atlas:'@quarzo-onda-atlas',offset:0,colors:['white','red','blue','silver','graphite','black','yellow','brown']},
 {model:'onda',atlas:'@quarzo-onda-atlas',offset:8,colors:['white','red','silver','grey','black','nightblue','pacificblue','sunsetred']},
 {model:'iris',atlas:'@iris-sabbia-atlas',offset:0,colors:['white','red','blue','silver','graphite','black','yellow','orange']},
 {model:'sabbia',atlas:'@iris-sabbia-atlas',offset:8,colors:['white','red','silver','sharkgrey','black','virtualblue','darkblue','orangepower']},
 {model:'altura',atlas:'@altura-sentiero-atlas',offset:0,colors:['white','red','silver','graphite','black','blue','bronze','burgundy']},
 {model:'sentiero',atlas:'@altura-sentiero-atlas',offset:8,colors:['white','beige','darkgreen','silver','graphite','black','blue','brown']},
 // Lotto 9: work vans; «white-edilizia» / «white-frutta» carry a generic readable lettering (no real firms).
 {model:'cargo',atlas:'@cargo-bottega-atlas',offset:0,cell:WORK_VAN_CELL,body:Object.freeze([4,7,43,79]),
  colors:['white','white-stripe','grey','blue','red','yellow','darkgreen','white-edilizia']},
 {model:'bottega',atlas:'@cargo-bottega-atlas',offset:8,cell:WORK_VAN_CELL,body:Object.freeze([10,17,32,62]),
  colors:['white','white-stripe','grey','blue','red','yellow','darkgreen','white-frutta']},
]);
export const EXTRA_CAR_VARIANTS=Object.freeze(Object.fromEntries(
 EXTRA_MODELS.flatMap(({model,atlas,offset,colors,cell,body})=>
  colors.map((color,i)=>[model+'-'+color,{index:offset+i,model,color,atlas,...(cell?{cell,body}:{})}]))
));
/* 4x4 atlas: 8 Triciclo market bodies + 8 food vendor stalls.
 * Open awnings belong to stationary vehicles, not AI traffic.
 */
export const MARKET_ATLAS_PATH='./assets/vehicles/triciclo-food-16-rgba.png';
export const MARKET_ATLAS_CELL=Object.freeze({width:56,height:64,columns:4,rows:4});
const MARKET_GROUPS=Object.freeze([
 {model:'triciclo-mercato',ids:['triciclo-azzurra-vuota','triciclo-azzurra-ferro','triciclo-azzurra-ortofrutta','triciclo-azzurra-pesce',
   'triciclo-verde-vuota','triciclo-verde-ferro','triciclo-verde-ortofrutta','triciclo-verde-pesce']},
 {model:'furgone-ambulante',ids:['food-zeppole-panzerotti','food-pere-e-musso','food-panini','food-hot-dog',
   'food-cornetti','food-pizza-portafoglio','food-pizzette-fritte','food-misto']}
]);
export const MARKET_VARIANTS=Object.freeze(Object.fromEntries(MARKET_GROUPS.flatMap((group,g)=>
 group.ids.map((id,i)=>[id,{index:g*8+i,model:group.model,atlas:'@market-atlas'}]))));
export const MARKET_VARIANT_IDS=Object.freeze(Object.keys(MARKET_VARIANTS));
/* Q16: 4x4 atlas of the Triciclo Car (three-wheeler with open bed), same 56x64 cells and shape as the market
 * Tricycles: row 1-2 eight clean paints, row 3-4 the same eight paints «vissute» (worn, rusty). Derived by zone
 * recolouring of the body only from the two approved Tricycles of triciclo-food-16 (glass, tyres, lights and rust
 * untouched). Paints are interpretations, not costruttore di fantasia factory codes. */
export const TRICYCLE_CAR_ATLAS_PATH='./assets/vehicles/triciclo-classica-16-rgba.png';
export const TRICYCLE_CAR_PAINTS=Object.freeze(['azzurra','verde','rossa','bianca','grigia','gialla','blu','crema']);
export const TRICYCLE_CAR_VARIANTS=Object.freeze(Object.fromEntries([
 ...TRICYCLE_CAR_PAINTS.map((paint,i)=>['triciclo-classica-'+paint,{index:i,model:'triciclo-classica',paint,atlas:'@triciclo-car-atlas'}]),
 ...TRICYCLE_CAR_PAINTS.map((paint,i)=>['triciclo-vissuta-'+paint,{index:8+i,model:'triciclo-classica',paint,worn:true,atlas:'@triciclo-car-atlas'}])
]));
export const TRICYCLE_CAR_IDS=Object.freeze(Object.keys(TRICYCLE_CAR_VARIANTS));
/* Q18: 4x4 atlas of two service vehicles, cells 52x92 (same pixel density for both, ~7 px per unit):
 * rows 1-2 a compact high-roof courier van (cab, short bonnet, raised cargo box), rows 3-4 an urban
 * refuse truck with compactor body and rear loader. Hand-placed pixel art drawn by code
 * (sources/servizio-16-genera.py), real alpha; liveries invented and plain: no logos, brands or text. */
export const SERVICE_ATLAS_PATH='./assets/vehicles/servizio-16-rgba.png';
export const SERVICE_ATLAS_CELL=Object.freeze({width:52,height:92,columns:4,rows:4});
export const COURIER_LIVERIES=Object.freeze(['bianco','bianco-fascia-blu','bianco-fascia-verde','argento','grigio-scuro','blu-notte','azzurro','bianco-vissuto']);
export const REFUSE_LIVERIES=Object.freeze(['verde','bianco-verde','bianco-blu','arancio','grigio','verde-scuro','bianco-arancio','verde-vissuto']);
export const SERVICE_VARIANTS=Object.freeze(Object.fromEntries([
 ...COURIER_LIVERIES.map((livery,i)=>['corriere-'+livery,{index:i,model:'corriere',livery,atlas:'@service-atlas'}]),
 ...REFUSE_LIVERIES.map((livery,i)=>['nettezza-'+livery,{index:8+i,model:'nettezza',livery,atlas:'@service-atlas'}])
]));
export const COURIER_IDS=Object.freeze(COURIER_LIVERIES.map(l=>'corriere-'+l));
export const REFUSE_TRUCK_IDS=Object.freeze(REFUSE_LIVERIES.map(l=>'nettezza-'+l));
/* Q19: second 4x4 atlas of service vehicles, same pixel density (~7 px per unit) but taller cells 52x124 so
 * the bus fits: rows 1-2 a flatbed tow truck (short cab with amber light bar, winch, slatted bed, loading
 * ramps), rows 3-4 a short urban bus (light roof with two A/C units and hatches, window bands on both sides,
 * doors on the right). Drawn by code (sources/servizio2-16-genera.py); invented liveries, no logos, no text. */
export const SERVICE2_ATLAS_PATH='./assets/vehicles/servizio2-16-rgba.png';
export const SERVICE2_ATLAS_CELL=Object.freeze({width:52,height:124,columns:4,rows:4});
export const TOW_LIVERIES=Object.freeze(['giallo','arancio','bianco-rosso','rosso','blu','bianco','grigio-arancio','giallo-vissuto']);
export const BUS_LIVERIES=Object.freeze(['arancio','verde-bianco','blu-bianco','rosso','bianco-azzurro','giallo','grigio-verde','arancio-vissuto']);
export const SERVICE2_VARIANTS=Object.freeze(Object.fromEntries([
 ...TOW_LIVERIES.map((livery,i)=>['attrezzi-'+livery,{index:i,model:'attrezzi',livery,atlas:'@service2-atlas'}]),
 ...BUS_LIVERIES.map((livery,i)=>['autobus-'+livery,{index:8+i,model:'autobus',livery,atlas:'@service2-atlas'}])
]));
export const TOW_TRUCK_IDS=Object.freeze(TOW_LIVERIES.map(l=>'attrezzi-'+l));
export const BUS_IDS=Object.freeze(BUS_LIVERIES.map(l=>'autobus-'+l));
export const STREET_VENDOR_VEHICLES=Object.freeze(['triciclo-car-azzurra','furgone-fritti']);
export const CAR_TRAFFIC_SPRITE_IDS=Object.freeze([...CAR_ATLAS_VARIANT_IDS,...Object.keys(EXTRA_CAR_VARIANTS),...STREET_VENDOR_VEHICLES]);
export const CAR_PARKED_SPRITE_IDS=Object.freeze([...CAR_TRAFFIC_SPRITE_IDS,...MARKET_VARIANT_IDS]);
// Lotto 6: the traffic walks the id list with a fixed stride (game.mjs trafficModel). With 98 ids a stride of 7 would
// spawn only 14 models, so the stride is the first odd number from 7 that is coprime with the list length
// (9 with 98 ids; 7 again since lotti 7-8 brought the list to 130 ids and lotto 9 to 146 = 2·73).
const gcd=(a,b)=>b?gcd(b,a%b):a;
export const CAR_TRAFFIC_STRIDE=[7,9,11,13,17,19,23].find(s=>gcd(s,CAR_TRAFFIC_SPRITE_IDS.length)===1);
const MODEL_DRAW_SIZE=Object.freeze({
 'alba':[5.45,8.75],'luna':[5.25,8.55],
 'nido':[4.9,7.6],'vela':[5.15,8],
 'riva':[5.1,8.15],'mira':[4.7,6.45],
 // Lotto 1: same footprint as the Alba 188 / Luna 2003 they stand beside.
 'aurora':[5.45,8.75],'selce':[5.25,8.55],
 // Lotto 5: a little longer (Tipo) and a little wider (FARO) than the Alba 188, kept prudent so they stay in the lane
 // (CODEX-GH proposed [5.88,9.91] and [5.84,9.41], scaled from the real sizes; the atlas bodies fill the cell more than the Alba's).
 'corallo':[5.5,9.2],'faro':[5.55,9],
 // Lotto 6: Quarzo a touch longer than the Alba 188, Onda the widest/longest of the hatchbacks; CODEX-GH's
 // own prudent proposals, kept as they are so both stay inside the lane.
 'quarzo':[5.4,8.9],'onda':[5.6,9.2],
 // Lotto 7: Iris and 208 are Alba 188-sized superminis (CODEX-GH's prudent proposals, kept as they are).
 'iris':[5.5,8.9],'sabbia':[5.4,8.8],
 // Lotto 8: Altura and Sentiero are crossovers, a bit wider and longer than every hatchback but still narrower
 // than the furgone-ambulante (7.9), so they stay inside their lane (CODEX-GH's proposals).
 'altura':[5.8,9.4],'sentiero':[5.7,9.2],
 // Lotto 9: size of the VISIBLE body (the «body» rectangle of the cell is drawn, not the whole 52x92 cell): the Cargo
 // between the Alba 188 (body ~4,4 x 8,5) and the Q18 courier van (body ~6,3 x 10), the Bottega a Alba-length van;
 // both narrower than the courier, so they stay in the lane (CODEX-GH's proposals, kept as they are).
 'cargo':[5.9,9.6],'bottega':[5.5,8.9],
 'triciclo-car-azzurra':[4.1,6.25],'furgone-fritti':[5.65,8.65],
 'triciclo-mercato':[5.7,6.9],'furgone-ambulante':[7.9,9.3],'triciclo-classica':[5.7,6.9],
 // Q18: whole 52x92 cell; the van body is then ~5,7 x 9,4 and the refuse truck ~6,3 x 12,4.
 'corriere':[7.43,13.14],'nettezza':[7.43,13.14],
 // Q19: whole 52x124 cell; the tow truck body is then ~5,7 x 12,3 and the bus ~6,3 x 16,9.
 'attrezzi':[7.43,17.71],'autobus':[7.43,17.71],
});

const cache=new Map();
let attempted=false;
export function loadCarSprites(){
 if(attempted||typeof Image==='undefined')return;
 attempted=true;
 for(const [model,path] of Object.entries({...CAR_SPRITES,'@alba-luna-atlas':CAR_ATLAS_PATH,...EXTRA_CAR_ATLASES,'@market-atlas':MARKET_ATLAS_PATH,'@triciclo-car-atlas':TRICYCLE_CAR_ATLAS_PATH,'@service-atlas':SERVICE_ATLAS_PATH,'@service2-atlas':SERVICE2_ATLAS_PATH})){
  const img=new Image();
  // New atlas is natively transparent: never matte-key or mask at runtime.
  cache.set(model,img);
  img.onerror=()=>console.warn('Optional GAM Melito vehicle PNG unavailable:',model);
  img.src=new URL(path,import.meta.url).href;
 }
}
function loadedImage(model){
 const key=CAR_ATLAS_VARIANTS[model]?'@alba-luna-atlas':(EXTRA_CAR_VARIANTS[model]?.atlas||MARKET_VARIANTS[model]?.atlas||TRICYCLE_CAR_VARIANTS[model]?.atlas||SERVICE_VARIANTS[model]?.atlas||SERVICE2_VARIANTS[model]?.atlas||model);
 return cache.get(key);
}
export function carSpriteReady(model){
 const img=loadedImage(model);
 if(MARKET_VARIANTS[model]||TRICYCLE_CAR_VARIANTS[model])return !!(img?.complete&&img.naturalWidth===224&&img.naturalHeight===256);
 if(SERVICE_VARIANTS[model])return !!(img?.complete&&img.naturalWidth===208&&img.naturalHeight===368);
 if(SERVICE2_VARIANTS[model])return !!(img?.complete&&img.naturalWidth===208&&img.naturalHeight===496);
 if(EXTRA_CAR_VARIANTS[model]?.cell){const c=EXTRA_CAR_VARIANTS[model].cell;return !!(img?.complete&&img.naturalWidth===c.width*c.columns&&img.naturalHeight===c.height*c.rows);}
 if(CAR_ATLAS_VARIANTS[model]||EXTRA_CAR_VARIANTS[model])return !!(img?.complete&&img.naturalWidth===160&&img.naturalHeight===240);
 return !!(img?.complete&&img.naturalWidth>0&&img.naturalHeight>0);
}
// Q23: dimensioni disegnate [larghezza,lunghezza] dello sprite, usate anche dai segni dei danni.
export function carDrawSize(model){
 const variant=CAR_ATLAS_VARIANTS[model]||EXTRA_CAR_VARIANTS[model]||MARKET_VARIANTS[model]||TRICYCLE_CAR_VARIANTS[model]||SERVICE_VARIANTS[model]||SERVICE2_VARIANTS[model];
 return MODEL_DRAW_SIZE[variant?.model||model]||(model==='borgo-nuova-white'?[5.5,8.75]:[5.1,8.55]);
}
export function drawCarSprite(ctx,x,y,angle,model,focused=false){
 if(!model)return false;
 if(!attempted)loadCarSprites();
 const img=loadedImage(model);
 if(!carSpriteReady(model))return false;
 const variant=CAR_ATLAS_VARIANTS[model]||EXTRA_CAR_VARIANTS[model]||MARKET_VARIANTS[model]||TRICYCLE_CAR_VARIANTS[model]||SERVICE_VARIANTS[model]||SERVICE2_VARIANTS[model];
 const [width,length]=carDrawSize(model);
 ctx.save();ctx.translate(x,y);ctx.rotate(angle+Math.PI/2);ctx.imageSmoothingEnabled=false;
 if(variant){
  const {width:sw,height:sh,columns}=SERVICE2_VARIANTS[model]?SERVICE2_ATLAS_CELL:SERVICE_VARIANTS[model]?SERVICE_ATLAS_CELL:MARKET_VARIANTS[model]||TRICYCLE_CAR_VARIANTS[model]?MARKET_ATLAS_CELL:variant.cell||CAR_ATLAS_CELL;
  const sx=(variant.index%columns)*sw,sy=Math.floor(variant.index/columns)*sh;
  // Lotto 9: an extra atlas with a «body» rectangle draws only the opaque part of the cell at [width,length].
  const [bx,by,bw,bh]=variant.body||[0,0,sw,sh];
  ctx.drawImage(img,sx+bx,sy+by,bw,bh,-width/2,-length/2,width,length);
 }else ctx.drawImage(img,-width/2,-length/2,width,length);
 if(focused){
  ctx.strokeStyle='#f5d887';ctx.lineWidth=.18;
  ctx.strokeRect(-width/2-.12,-length/2-.12,width+.24,length+.24);
 }
 ctx.restore();
 return true;
}
