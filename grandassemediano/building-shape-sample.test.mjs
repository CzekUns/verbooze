import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SHAPE_SAMPLE_ID,SHAPE_SAMPLE_PATH,SAMPLE_BALCONY_DEPTH,applyBuildingShapeSample,sampleBalconySlabs} from './building-shape-sample.mjs';
import {placeBuildings,placeInferredBuildings} from './building-placement.mjs';
import {prepareCityStyles} from './city-art.mjs';
import {applySurveyDrafts} from './survey/visual-profiles.mjs';
import {applyViaRomaStylePilot,pilotFacadeWindows} from './building-style-pilot.mjs';
import {buildingVolume,exposedFacade,facadePoints,signedFootprintArea} from './building-volume.mjs';
import {pointInFootprint} from './road-clearance.mjs';
import {roadIndex,roadConflicts,buildingsOverlap,containsPoi} from './survey/building-position-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const [map,placement,infill,town,piazza]=await Promise.all(['./data/melito-map.json','./data/building-placement.json','./data/urban-infill.json','./survey/town-visuals.json','./survey/piazza-santo-stefano.json'].map(read));
const sourceShape=map.buildings.find(b=>b.id===SHAPE_SAMPLE_ID).p.slice();
const placed=placeBuildings(map,placement),result=applyBuildingShapeSample(placed),old=placed.find(b=>b.id===SHAPE_SAMPLE_ID),sample=result.find(b=>b.id===SHAPE_SAMPLE_ID);
prepareCityStyles(result,map.pois);applySurveyDrafts(result,[town,piazza]);applyViaRomaStylePilot(result);
test('only the sample changes shape: source geometry, other buildings and floor height remain intact',()=>{
 assert.equal(result.length,placed.length);assert.equal(result.filter((b,i)=>b!==placed[i]).length,1);
 assert.deepEqual(sample.p,SHAPE_SAMPLE_PATH);assert.equal(sample.p.length,10);assert.ok(old.p.length>30);
 assert.deepEqual(sample.shapePilot.originalPlacedFootprint,old.p);assert.equal(old.shapePilot,undefined);assert.equal(sample.h,old.h);
 const ratio=Math.abs(signedFootprintArea(sample.p)/signedFootprintArea(old.p));assert.ok(ratio>.95&&ratio<1.05,'mass should keep the same approximate area');
 assert.equal(sample.art.shapeSample,true);assert.equal(sample.art.stylePilot.family,'palazzina');
 const stale={...old,p:old.p.map((x,i)=>i===0?x+.2:x)};assert.equal(applyBuildingShapeSample([stale])[0],stale);
 assert.equal(applyBuildingShapeSample(result).find(b=>b.id===SHAPE_SAMPLE_ID),sample,'idempotent');
});
test('drawing and collision use the regular body: former jagged corner is walkable, new body remains solid',()=>{
 assert.equal(pointInFootprint(1112,1300,old),true);assert.equal(pointInFootprint(1112,1300,sample),false);
 assert.equal(pointInFootprint(1123,1285,sample),true);assert.equal(pointInFootprint(1123,1285,old),true);
 assert.deepEqual(map.buildings.find(b=>b.id===SHAPE_SAMPLE_ID).p,sourceShape);
});
test('the new complete mass clears asphalt, POIs and every neighbour',()=>{
 assert.equal(roadConflicts(sample,roadIndex(map.roads),{margin:1.5}).length,0);
 assert.equal(containsPoi(sample,map.pois),false);
 const neighbours=[...result,...placeInferredBuildings(infill.buildings,map,placement)].filter(b=>b.id!==SHAPE_SAMPLE_ID);
 assert.ok(!neighbours.some(b=>buildingsOverlap(sample,b,1)));
});
test('upper floor balconies genuinely project out of the facade; slab overhangs stay clear of roads and neighbours',()=>{
 const v=buildingVolume(sample),p=sample.p,roads=roadIndex(map.roads);let count=0;
 for(let j=2;j<p.length;j+=2){
  const ex=p[j]-p[j-2],ey=p[j+1]-p[j-1],len=Math.hypot(ex,ey);
  if(!exposedFacade(ex,ey,v))continue;
  const windows=pilotFacadeWindows(sample.art,v,len,j).windows;
  const slabs=sampleBalconySlabs(sample.art,v,facadePoints(p,j,v),ex,ey,len,windows);
  for(const s of slabs){
   count++;assert.ok(Math.abs(Math.hypot(s.frontLeft[0]-s.left[0],s.frontLeft[1]-s.left[1])-SAMPLE_BALCONY_DEPTH)<1e-8);
   // Slab coordinates here are relative to the lifted roof, same as the renderer.
   const polygon=[s.left,s.right,s.frontRight,s.frontLeft,s.left].map(([x,y])=>[x-v.dx,y-v.dy]).flat();
   assert.equal(roadConflicts({id:-99,p:polygon},roads).length,0);
   assert.ok(!result.filter(b=>b.id!==SHAPE_SAMPLE_ID).some(b=>buildingsOverlap({p:polygon},b,.1)));
  }
 }
 assert.ok(count>=4,'visible projecting balconies on upper storeys');
});
