import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareCityStyles,facadeWindowPanes} from './city-art.mjs';
import {placeBuildings} from './building-placement.mjs';
import {buildingVolume,exposedFacade} from './building-volume.mjs';
import {VIA_ROMA_PILOT,applyViaRomaStylePilot,pilotFacadeWindows} from './building-style-pilot.mjs';
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const [map,placement]=await Promise.all([read('./data/melito-map.json'),read('./data/building-placement.json')]);
const buildings=placeBuildings(map,placement);prepareCityStyles(buildings,map.pois);
test('approved pilot changes only eight ordinary Via Roma styles, preserving footprints and volume',()=>{
 const before=buildings.map(b=>({p:b.p.slice(),height:b.h,volume:buildingVolume(b),art:{...b.art}}));
 assert.equal(applyViaRomaStylePilot(buildings),8);
 assert.equal(buildings.filter(b=>b.art.stylePilot&&b.art.roof).length,2);
 assert.equal(buildings.filter(b=>b.art.stylePilot&&!b.art.roof).length,6);
 for(let i=0;i<buildings.length;i++){
  const b=buildings[i];assert.deepEqual(b.p,before[i].p);assert.equal(b.h,before[i].height);assert.deepEqual(buildingVolume(b),before[i].volume);
  if(!b.art.stylePilot)assert.deepEqual(b.art,before[i].art,'unrelated building '+b.id);
 }
 for(const id of [733703815,733703600])assert.equal(buildings.find(b=>b.id===id).art.stylePilot,undefined);
});
test('photo-verified facades are not overwritten and stale window caches are removed on pilot buildings',()=>{
 const id=VIA_ROMA_PILOT[0].id,verified={id,p:[0,0,20,0,20,20,0,20,0,0],art:{surveyStatus:'photo-verified',facadeTint:'#123456'}};
 assert.equal(applyViaRomaStylePilot([verified]),0);assert.equal(verified.art.facadeTint,'#123456');
 const b={...verified,art:{windowPanes:['stale']}};assert.equal(applyViaRomaStylePilot([b]),1);assert.equal(b.art.windowPanes,undefined);
});
test('night lights use exactly the pilot window grid and never illuminate the entrance door',()=>{
 for(const b of buildings.filter(b=>b.art.stylePilot)){
  const v=buildingVolume(b),expected=[];
  for(let j=2;j<b.p.length;j+=2){
   const ex=b.p[j]-b.p[j-2],ey=b.p[j+1]-b.p[j-1],len=Math.hypot(ex,ey);
   if(len<6||!exposedFacade(ex,ey,v))continue;
   const layout=pilotFacadeWindows(b.art,v,len,j);
   const ox=b.p[j-2]-v.dx,oy=b.p[j-1]-v.dy,at=(x,y)=>[ox+ex/len*x+v.dx/layout.depth*y,oy+ey/len*x+v.dy/layout.depth*y];
   for(const w of layout.windows){
    if(w.door)continue;
    const x=w.x-w.w/2,y=w.y-w.h/2;
    expected.push({seed:w.seed,quad:[...at(x,y),...at(x+w.w,y),...at(x+w.w,y+w.h),...at(x,y+w.h)]});
   }
  }
  assert.deepEqual(facadeWindowPanes(b),expected,'night lights drifted on '+b.id);
 }
});

test('pilot facade clipping encloses the wall, instead of clipping details to the last stroked line',async()=>{
 const {drawPilotFacade}=await import('./building-style-pilot.mjs');
 let path=[],clipped=null,rectangles=0;
 const c={save(){},restore(){},beginPath(){path=[];},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},closePath(){},clip(){clipped=path.slice();},transform(){},fillRect(){rectangles++;}};
 const a={seed:1,stylePilot:VIA_ROMA_PILOT[1]},v={stories:3,dx:0,dy:15};
 const f={x1:0,y1:0,x2:30,y2:0,x3:30,y3:15,x4:0,y4:15};
 drawPilotFacade(c,a,v,f,30,0,30,5);
 assert.deepEqual(clipped,[[0,0],[30,0],[30,15],[0,15]]);assert.ok(rectangles>30,'facade must actually contain windows and balconies');
});
