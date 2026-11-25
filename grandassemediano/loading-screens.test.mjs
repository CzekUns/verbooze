import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {LOADING_SCREENS,LOADING_SCREEN_STORAGE_KEY,chooseLoadingScreen,applyLoadingScreen,GAM_LOADING_SCREEN,setLoadingProgress,LOADING_PHASES} from './loading-screens.mjs';

function dimensions(bytes){
 if(bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a')return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
 assert.equal(bytes.readUInt16BE(0),0xffd8,'firma JPEG');
 for(let i=2;i<bytes.length-10;){
  if(bytes[i]!==0xff){i++;continue;}
  const marker=bytes[i+1];
  if(marker===0xd8||marker===0xd9){i+=2;continue;}
  const length=bytes.readUInt16BE(i+2);
  if([0xc0,0xc1,0xc2,0xc3].includes(marker))return [bytes.readUInt16BE(i+7),bytes.readUInt16BE(i+5)];
  i+=2+length;
 }
 throw new Error('dimensioni JPEG non trovate');
}

test('collegamento all’avvio e anteprima da NOVITÀ con sfumatura sotto il testo',async()=>{
 const [game,html,novita]=await Promise.all(['game.mjs','index.html','novita.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
 assert.match(game,/loading-screens\.mjs\?v=1001/);
 assert.match(game,/applyLoadingScreen\(\);loadMotorcycleSprites/);
 assert.match(game,/entry\.prova==='caricamento'/);
 assert.match(game,/loading-preview-close/);
 assert.ok(Number(game.match(/novita\.mjs\?v=(\d+)/)?.[1])>=20);
 assert.ok(Number(html.match(/game\.mjs\?v=(\d+)/)?.[1])>=220);
 assert.match(html,/--loading-desktop/);assert.match(html,/--loading-mobile/);
 assert.match(html,/\.loading::before\{[^}]*linear-gradient/);
 assert.match(html,/id="loading-scene-title"/);
 assert.match(novita,/id:'caricamento-artwork'/);
});

test('GAM ufficiale è lo sfondo di default, unico artwork distribuito',async()=>{
 const properties=new Map(),loading={style:{setProperty:(k,v)=>properties.set(k,v)},dataset:{}};
 const document={getElementById:id=>id==='loading'?loading:null};
 assert.equal(applyLoadingScreen({document}),GAM_LOADING_SCREEN);
 assert.equal(loading.dataset.screen,'gam');
 assert.match(properties.get('--loading-desktop'),/gam-loading\.webp/);
 const bytes=await readFile(new URL(GAM_LOADING_SCREEN.desktop,import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(bytes.length<400_000);
});
test('il progresso avanza solo con operazioni completate, si azzera e resta entro i limiti',()=>{
 const css=new Map(),attrs=new Map(),label={textContent:''};
 const bar={style:{setProperty:(k,v)=>css.set(k,v)},setAttribute:(k,v)=>attrs.set(k,v)};
 const document={getElementById:id=>id==='loading-bar'?bar:label};
 const values=Array.from({length:LOADING_PHASES+1},(_,i)=>setLoadingProgress(i,{document}));
 assert.deepEqual(values,[0,11,22,33,44,56,67,78,89,100]);
 assert.equal(css.get('--loading-progress'),'100%');
 assert.equal(attrs.get('aria-valuenow'),'100');
 assert.equal(label.textContent,'100%');
 assert.equal(setLoadingProgress(-1,{document}),0);
 assert.equal(setLoadingProgress(99,{document}),100);
});
