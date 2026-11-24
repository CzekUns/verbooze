import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roadIndex,roadConflicts,buildingsOverlap} from './building-position-audit.mjs';

const box=(x0,y0,x1,y1)=>({id:1,p:[x0,y0,x1,y0,x1,y1,x0,y1,x0,y0]});
const road={id:7,n:'Test',t:'residential',w:4,p:[-30,0,30,0]};
test('road audit catches an entire street crossing a building even when every corner is outside the asphalt',()=>{
 const hits=roadConflicts(box(-20,-15,20,15),roadIndex([road]));
 assert.equal(hits.length,1);assert.equal(hits[0].centerline,true);
 assert.equal(roadConflicts(box(-20,12,20,20),roadIndex([road])).length,0);
});
test('audit includes raised roofs beyond a physically clear footprint',()=>{
 const building={...box(-10,8,10,20),h:12,art:{seed:1,type:'house'}};
 const hits=roadConflicts(building,roadIndex([road]));
 assert.equal(hits.length,1);assert.equal(hits[0].footprint,false);
});
test('complete polygon intersection detects crossing thin buildings; separated buildings remain clear',()=>{
 assert.equal(buildingsOverlap(box(-10,-1,10,1),box(-1,-10,1,10)),true);
 assert.equal(buildingsOverlap(box(0,0,4,4),box(5,0,9,4)),false);
});

import {readFile} from 'node:fs/promises';
import {placeBuildings,placeInferredBuildings} from '../building-placement.mjs';
import {prepareCityStyles,applyPiazzaRoofStudies} from '../city-art.mjs';
import {applySurveyDrafts} from './visual-profiles.mjs';
import {infillOnPitch} from '../football-pitches.mjs';
import {SpatialIndex,polygonBounds,auditPositions,containsPoi} from './building-position-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const [map,placement,infill,town,piazza,report]=await Promise.all([
 '../data/melito-map.json','../data/building-placement.json','../data/urban-infill.json',
 './town-visuals.json','./piazza-santo-stefano.json','./building-position-review.json'
].map(read));

test('every reviewed building clears complete road widths and neighbours after real runtime transforms',()=>{
 const originals=map.buildings.map(b=>b.p.slice());
 const mapped=placeBuildings(map,placement),synthetic=placeInferredBuildings(infill.buildings.filter(b=>!infillOnPitch(b)),map,placement);
 prepareCityStyles(mapped,map.pois);applySurveyDrafts(mapped,[town,piazza]);applyPiazzaRoofStudies(mapped);prepareCityStyles(synthetic,[]);
 for(const b of synthetic)b.art.renderHeight=b.h;
 const buildings=[...mapped,...synthetic],roads=roadIndex(map.roads),occupied=new SpatialIndex();
 for(const b of buildings)occupied.add(b,polygonBounds(b.p));
 const revised=buildings.filter(b=>placement.reviewed[b.id]);
 assert.equal(revised.length,report.changes.length);
 for(const b of revised){
  assert.equal(roadConflicts(b,roads).length,0,'road or roof overlap '+b.id);
  const bb=polygonBounds(b.p),near=occupied.query([bb[0]-.3,bb[1]-.3,bb[2]+.3,bb[3]+.3]);
  assert.ok(!near.some(q=>q.id!==b.id&&buildingsOverlap(b,q,.3)),'neighbour overlap '+b.id);
  assert.equal(containsPoi(b,map.pois),false,'covered a POI '+b.id);
 }
 assert.deepEqual(map.buildings.map(b=>b.p),originals);
 const conflicts=auditPositions(buildings,roads);
 assert.equal(conflicts.length,report.after.conflicting);
 assert.equal(conflicts.filter(b=>b.roads.some(r=>r.centerline)).length,report.after.centerline);
 assert.equal(conflicts.filter(b=>b.roads.some(r=>r.footprint)).length,report.after.footprint);
 assert.ok(report.after.centerline<report.before.centerline,'whole-street blockers must improve');
});
