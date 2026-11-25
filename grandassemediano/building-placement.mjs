/* Precomputed display/collision corrections. Source OSM and road IDs stay intact.
 * schema 1: historical small offsets. schema 2: individually audited full-shape
 * translations / uniform scaling, shared by rendering, collision and entrances. */
import {mapFingerprint} from './urban-infill.mjs?v=1116';

function validPlacement(map,placement){
 return placement&&[1,2].includes(placement.schema)&&placement.sourceCreated===map.created&&
  (placement.schema===1||placement.sourceFingerprint===mapFingerprint(map));
}
function transform(b,dx,dy,scale=1){
 const xs=b.p.filter((_,i)=>i%2===0),ys=b.p.filter((_,i)=>i%2===1);
 const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const p=b.p.map((v,i)=>Math.round(((v-(i%2?cy:cx))*scale+(i%2?cy+dy:cx+dx))*10)/10);
 // No stale derived geometry: game.mjs recalculates art and spatial indices after placement.
 const {art,bounds,...source}=b;
 return {...source,p,placementCorrection:{dx,dy,scale,source:'gameplay-layout-review'}};
}
function reviewed(b,placement){
 const r=placement.reviewed?.[b.id];
 if(!r||![r.dx,r.dy,r.scale].every(Number.isFinite)||Math.hypot(r.dx,r.dy)>48.1||r.scale<.55||r.scale>1)return null;
 return transform(b,r.dx,r.dy,r.scale);
}
export function placeBuildings(map,placement){
 if(!validPlacement(map,placement))return map.buildings;
 return map.buildings.map(b=>{
  const revision=placement.schema===2?reviewed(b,placement):null;if(revision)return revision;
  const offset=placement.offsets?.[b.id];
  if(!Array.isArray(offset)||offset.length!==2)return b;
  const [dx,dy]=offset;
  if(!Number.isFinite(dx)||!Number.isFinite(dy)||Math.hypot(dx,dy)>12.1)return b;
  return transform(b,dx,dy);
 });
}
export function placeInferredBuildings(buildings,map,placement){
 if(placement?.schema!==2||!validPlacement(map,placement))return buildings;
 return buildings.map(b=>reviewed(b,placement)||b);
}
