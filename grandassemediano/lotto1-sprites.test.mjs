/* Lotto 1 (2026-10-21, Claude + CODEX-GH): costruttore di fantasia Aurora 2005 and costruttore di fantasia Luna III 2011 in the traffic.
 * Atlas drawn by code by CODEX-GH (assets/vehicles/sources/aurora-selce-16-genera.py); PROVISIONAL art. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import {EXTRA_CAR_ATLASES,EXTRA_CAR_VARIANTS,CAR_TRAFFIC_SPRITE_IDS,CAR_TRAFFIC_STRIDE,CAR_PARKED_SPRITE_IDS,CAR_ATLAS_CELL,carDrawSize} from './car-sprites.mjs';
import {handlingProfile} from './vehicle-handling.mjs';
import {vehicleShape} from './traffic-collision.mjs';
import {NOVITA,novitaAvailable} from './novita.mjs';

const ATLAS='@aurora-selce-atlas';
const ALBA=['white','red','blue','silver','graphite','black','lightblue','beige'];
const LUNA=['white','red','silver','graphite','black','blue','beige','purple'];
const IDS=[...ALBA.map(c=>'aurora-'+c),...LUNA.map(c=>'selce-'+c)];

// Minimal reader of a non-interlaced 8-bit RGBA PNG (colour type 6), enough for the alpha channel.
function decodeRGBA(bytes){
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);
 assert.equal(bytes[24],8,'8-bit samples');assert.equal(bytes[25],6,'true RGBA PNG');assert.equal(bytes[28],0,'not interlaced');
 const idats=[];let at=8;
 while(at<bytes.length){
  const len=bytes.readUInt32BE(at),tag=bytes.toString('ascii',at+4,at+8);
  if(tag==='IDAT')idats.push(bytes.subarray(at+8,at+8+len));
  at+=12+len;if(tag==='IEND')break;
 }
 const raw=inflateSync(Buffer.concat(idats)),stride=w*4,px=Buffer.alloc(h*stride),prev=Buffer.alloc(stride);
 let c=0;
 for(let y=0;y<h;y++){
  const f=raw[c++],row=Buffer.from(raw.subarray(c,c+stride));c+=stride;
  for(let x=0;x<stride;x++){
   const a=x>=4?row[x-4]:0,b=prev[x],d=x>=4?prev[x-4]:0;
   if(f===1)row[x]=(row[x]+a)&255;else if(f===2)row[x]=(row[x]+b)&255;
   else if(f===3)row[x]=(row[x]+Math.floor((a+b)/2))&255;
   else if(f===4){const p=a+b-d,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-d);row[x]=(row[x]+(pa<=pb&&pa<=pc?a:pb<=pc?b:d))&255;}
   else assert.equal(f,0,'known filter');
  }
  row.copy(px,y*stride);row.copy(prev);
 }
 return {w,h,alpha:(x,y)=>px[y*stride+x*4+3]};
}

test('lotto 1: the atlas is a 160x240 RGBA PNG with 16 cells, transparent corners and solid bodies',async()=>{
 const path=EXTRA_CAR_ATLASES[ATLAS];
 assert.equal(path,'./assets/vehicles/aurora-selce-16-rgba.png');
 const bin=await readFile(new URL(path,import.meta.url));
 const png=decodeRGBA(bin);
 assert.equal(png.w,160);assert.equal(png.h,240);
 assert.ok(bin.length<40000,'compact for mobile');
 assert.deepEqual(CAR_ATLAS_CELL,{width:40,height:60,columns:4,rows:4});
 for(let i=0;i<16;i++){
  const ox=i%4*40,oy=Math.floor(i/4)*60;
  for(const [x,y] of [[0,0],[39,0],[0,59],[39,59],[1,1],[38,58]])assert.equal(png.alpha(ox+x,oy+y),0,'cell '+i+' corner '+x+','+y);
  // Bonnet, cabin and boot are all solid pixels down the middle of the car.
  for(const y of [12,30,48])assert.equal(png.alpha(ox+20,oy+y),255,'cell '+i+' body at y='+y);
  let opaque=0;for(let y=0;y<60;y++)for(let x=0;x<40;x++)if(png.alpha(ox+x,oy+y)===255)opaque++;
  assert.ok(opaque>900&&opaque<2000,'cell '+i+' has a car-sized body: '+opaque);
 }
 // The generator and the preview sheet travel with the atlas, the preview is not used by the game.
 assert.ok((await readFile(new URL('./assets/vehicles/sources/fictional-cars-master.png',import.meta.url))).length>1000);
});

test('lotto 1: 16 variant ids, two models with eight colours each on the right cells',()=>{
 assert.equal(IDS.length,16);
 for(const id of IDS)assert.ok(EXTRA_CAR_VARIANTS[id],'variant '+id);
 ALBA.forEach((color,i)=>assert.deepEqual(EXTRA_CAR_VARIANTS['aurora-'+color],{index:i,model:'aurora',color,atlas:ATLAS}));
 LUNA.forEach((color,i)=>assert.deepEqual(EXTRA_CAR_VARIANTS['selce-'+color],{index:8+i,model:'selce',color,atlas:ATLAS}));
 assert.equal(Object.keys(EXTRA_CAR_VARIANTS).filter(id=>EXTRA_CAR_VARIANTS[id].atlas===ATLAS).length,16);
 // Same footprint as the Alba 188 and the Luna 2003 they drive beside.
 assert.deepEqual(carDrawSize('aurora-red'),carDrawSize('alba-red'));
 assert.deepEqual(carDrawSize('selce-purple'),carDrawSize('luna-white'));
});

test('lotto 1: both models are in the AI traffic and in the parked cars, with their own driving profile',()=>{
 for(const id of IDS){
  assert.ok(CAR_TRAFFIC_SPRITE_IDS.includes(id),'traffic '+id);
  assert.ok(CAR_PARKED_SPRITE_IDS.includes(id),'parked '+id);
 }
 // The traffic picks ids with stride CAR_TRAFFIC_STRIDE (game.mjs): over a full cycle every new variant is spawned.
 const seen=new Set();for(let i=0;i<CAR_TRAFFIC_SPRITE_IDS.length;i++)seen.add(CAR_TRAFFIC_SPRITE_IDS[(i*CAR_TRAFFIC_STRIDE)%CAR_TRAFFIC_SPRITE_IDS.length]);
 for(const id of IDS)assert.ok(seen.has(id),'spawned '+id);
 const alba=handlingProfile({model:'aurora-blue'}),luna=handlingProfile({model:'selce-beige'});
 assert.equal(alba.model,'aurora');assert.equal(luna.model,'selce');
 const p188=handlingProfile({model:'alba-blue'}),y2003=handlingProfile({model:'luna-white'});
 for(const k of ['accel','top','brake','grip','steer'])assert.equal(alba[k],p188[k],'Aurora ~ Alba 188: '+k);
 for(const k of ['accel','top','brake','grip','steer'])assert.equal(luna[k],y2003[k],'Luna 2011 ~ Luna 2003: '+k);
 // Collision box of the standard car (no model-specific shape).
 assert.deepEqual(vehicleShape({model:'aurora-white'}),vehicleShape({model:'alba-white'}));
 assert.deepEqual(vehicleShape({model:'selce-red'}),vehicleShape({model:'alba-white'}));
});

test('lotto 1: NOVITÀ entry, registers and cache versions',async()=>{
 const entry=NOVITA.find(e=>e.id==='lotto1-auto');
 assert.ok(entry,'novita lotto1-auto');
 assert.match(entry.cosa,/Aurora/);assert.match(entry.cosa,/Luna/);
 const roads=[{n:'Via Roma',p:[100,100,200,100,300,100,400,100]}];
 assert.deepEqual(entry.trova({roads,traffic:[],cars:[]}),{x:300,y:100});
 assert.equal(novitaAvailable(entry,{traffic:[{model:'aurora-red'}]}),true);
 const read=f=>readFile(new URL('./'+f,import.meta.url),'utf8');
 const [game,page,doc,log,visual]=await Promise.all(['game.mjs','index.html','NOVITA_DA_APPROVARE.md','WORK_LOG.md','VISUAL_PROGRESS.md'].map(read));
 assert.ok(doc.includes('`lotto1-auto`'));
 assert.match(log,/lotto 1 grafica: Aurora e Luna III/);assert.match(log,/PROVVISORIA/);
 assert.match(visual,/Aurora/);
 const v=(src,mod)=>Number((src.match(new RegExp(mod.replace('.','\\.')+'\\?v=(\\d+)'))||[])[1]);
 assert.ok(v(game,'car-sprites.mjs')>=114,'car-sprites v114');
 assert.ok(v(game,'vehicle-handling.mjs')>=6,'vehicle-handling v006');
 assert.ok(v(game,'novita.mjs')>=3,'novita v003');
 assert.ok(v(page,'game.mjs')>=200,'game v200');
 for(const f of ['garages.mjs','tuning.mjs','street-professions.mjs'])assert.ok(v(await read(f),'car-sprites.mjs')>=114,f);
 for(const f of ['driving-controls.mjs','motorcycles.mjs','city-audio.mjs','roads.mjs'])assert.ok(v(await read(f),'vehicle-handling.mjs')>=6,f);
});
