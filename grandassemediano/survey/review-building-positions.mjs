import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {placeBuildings}=await import(root+'building-placement.mjs');
const {prepareCityStyles,applyPiazzaRoofStudies}=await import(root+'city-art.mjs');
const {applySurveyDrafts}=await import(root+'survey/visual-profiles.mjs');
const {infillOnPitch}=await import(root+'football-pitches.mjs');
const {roadIndex,auditPositions,SpatialIndex,polygonBounds,buildingsOverlap,roadConflicts,translateBuilding,containsPoi,closed}=await import(root+'survey/building-position-audit.mjs');
const {pointInFootprint}=await import(root+'road-clearance.mjs');
const read=async p=>JSON.parse(await readFile(root+p));
const [map,placement,infill,town,piazza]=await Promise.all(['data/melito-map.json','qa/building-positions/baseline-placement.json','data/urban-infill.json','survey/town-visuals.json','survey/piazza-santo-stefano.json'].map(read));
const mapped=placeBuildings(map,placement),synthetic=infill.buildings.filter(b=>!infillOnPitch(b));
prepareCityStyles(mapped,map.pois);applySurveyDrafts(mapped,[town,piazza]);applyPiazzaRoofStudies(mapped);prepareCityStyles(synthetic,[]);
for(const b of synthetic)b.art.renderHeight=b.h;
const all=[...mapped,...synthetic],roads=roadIndex(map.roads),before=auditPositions(all,roads);
await writeFile(root+'qa/building-positions/before-audit.json',JSON.stringify(before,null,2));
console.log('Audited '+all.length+' buildings; '+before.length+' road/volume conflicts.');
const occupied=new SpatialIndex(),byId=new Map(all.map(b=>[b.id,b]));for(const b of all)occupied.add(b,polygonBounds(b.p));
const changes=[],unresolved=[],original=new Map(map.buildings.map(b=>[b.id,b]));
// Named buildings and premises containing POIs need entrance-specific review.
const protectedIds=new Set(all.filter(b=>b.n||containsPoi(b,map.pois)).map(b=>b.id));
const border={p:closed(map.border)};
const offsets=[];
for(let radius=1;radius<=36;radius+=1)for(let k=0;k<32;k++){const a=k*Math.PI/16;offsets.push([Math.round(Math.cos(a)*radius*10)/10,Math.round(Math.sin(a)*radius*10)/10]);}
const ranked=before.slice().sort((a,b)=>Number(b.roads.some(r=>r.centerline))-Number(a.roads.some(r=>r.centerline))||b.roads[0].penetration-a.roads[0].penetration||a.id-b.id);
for(const entry of ranked){
 const b=byId.get(entry.id);
 if(protectedIds.has(b.id)){unresolved.push({...entry,reason:'named-building-or-poi'});continue;}
 let chosen=null,reason='no-clear-space-within-36m';
 for(const scale of [1,.85,.7,.55]){
 for(const [dx,dy] of [[0,0],...offsets]){
  const source=original.get(b.id),totalX=(placement.offsets[b.id]?.[0]||0)+dx,totalY=(placement.offsets[b.id]?.[1]||0)+dy;
  if(source&&Math.hypot(totalX,totalY)>48)continue;
  const bb=polygonBounds(b.p),cx=(bb[0]+bb[2])/2,cy=(bb[1]+bb[3])/2;
  const scaled={...b,p:b.p.map((v,i)=>(v-(i%2?cy:cx))*scale+(i%2?cy:cx))};
  const next=translateBuilding(scaled,dx,dy);
  if(roadConflicts(next,roads).length)continue;
  if(infillOnPitch(next)||containsPoi(next,map.pois))continue;
  let inBorder=true;for(let j=0;j<next.p.length;j+=2)if(!pointInFootprint(next.p[j],next.p[j+1],border)){inBorder=false;break;}if(!inBorder)continue;
  const box=polygonBounds(next.p),near=occupied.query([box[0]-.4,box[1]-.4,box[2]+.4,box[3]+.4]);
  if(near.some(q=>q!==b&&buildingsOverlap(next,q)))continue;
  chosen={next,dx,dy,totalX,totalY,scale};break;
 }
 if(chosen)break;
 }
 if(!chosen){unresolved.push({...entry,reason});continue;}
 const {next,dx,dy,totalX,totalY,scale}=chosen;
 occupied.remove(b,polygonBounds(b.p));occupied.add(next,polygonBounds(next.p));byId.set(b.id,next);
 changes.push({id:b.id,inferred:b.id<0,scale,delta:[dx,dy],offset:[Math.round(totalX*10)/10,Math.round(totalY*10)/10],before:entry,afterBounds:polygonBounds(next.p)});
}
const after=auditPositions([...byId.values()],roads);
const report={sourceCreated:map.created,policy:{maxAdditionalShift:36,maxTotalShift:48,minimumScale:.55,roadMargin:.5,buildingGap:.4,protected:'named buildings and POIs; football pitches; municipal border',preserve:'complete shape, area and ID; source OSM immutable'},before:{conflicting:before.length,footprint:before.filter(b=>b.roads.some(r=>r.footprint)).length,centerline:before.filter(b=>b.roads.some(r=>r.centerline)).length},after:{conflicting:after.length,footprint:after.filter(b=>b.roads.some(r=>r.footprint)).length,centerline:after.filter(b=>b.roads.some(r=>r.centerline)).length},changes,unresolved};
await writeFile(root+'survey/building-position-review.json',JSON.stringify(report,null,2));console.log(JSON.stringify({before:report.before,after:report.after,moved:changes.length,largest:changes.slice(0,5)},null,2));
