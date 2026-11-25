/* Offline, exact road/volume audit. No changes to OSM or in-game startup work. */
import {visualRoadWidth} from '../road-widths.mjs';
import {DRIVE_ROAD_TYPES,pointInFootprint} from '../road-clearance.mjs';
import {roadFootprintDistance,footprintsClear} from '../urban-infill.mjs';
import {buildingVolume} from '../building-volume.mjs';

export function closed(path){
 const p=path.slice();if(p[0]!==p.at(-2)||p[1]!==p.at(-1))p.push(p[0],p[1]);return p;
}
export function polygonBounds(p){
 let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
 for(let i=0;i<p.length;i+=2){x0=Math.min(x0,p[i]);x1=Math.max(x1,p[i]);y0=Math.min(y0,p[i+1]);y1=Math.max(y1,p[i+1]);}
 return [x0,y0,x1,y1];
}
export class SpatialIndex{
 constructor(cell=64){this.cell=cell;this.grid=new Map();}
 keys(box){const out=[];for(let x=Math.floor(box[0]/this.cell);x<=Math.floor(box[2]/this.cell);x++)for(let y=Math.floor(box[1]/this.cell);y<=Math.floor(box[3]/this.cell);y++)out.push(`${x},${y}`);return out;}
 add(item,box){for(const k of this.keys(box)){if(!this.grid.has(k))this.grid.set(k,new Set());this.grid.get(k).add(item);}return item;}
 remove(item,box){for(const k of this.keys(box))this.grid.get(k)?.delete(item);}
 query(box){const found=new Set();for(const k of this.keys(box))for(const q of this.grid.get(k)||[])found.add(q);return [...found];}
}
export function projectedPolygons(b){
 const p=closed(b.p),v=buildingVolume(b);if(!v)return [p];
 // Santa Maria is drawn by its exclusive asset, inside its mapped bounding box.
 if(b.id===733703815||b.art?.ruinPool)return [p];
 const roof=p.map((value,i)=>value-(i%2?v.dy:v.dx)),polys=[p,roof];
 for(let i=2;i<p.length;i+=2)polys.push([p[i-2],p[i-1],p[i],p[i+1],roof[i],roof[i+1],roof[i-2],roof[i-1],p[i-2],p[i-1]]);
 return polys;
}
export function roadIndex(roads){
 const index=new SpatialIndex();
 for(const road of roads){
  if(!DRIVE_ROAD_TYPES.has(road.t)||!road.p)continue;
  for(let i=2;i<road.p.length;i+=2){
   const s={ax:road.p[i-2],ay:road.p[i-1],bx:road.p[i],by:road.p[i+1],roadId:road.id,name:road.n||'',type:road.t,radius:visualRoadWidth(road)/2};
   const r=s.radius+1;index.add(s,[Math.min(s.ax,s.bx)-r,Math.min(s.ay,s.by)-r,Math.max(s.ax,s.bx)+r,Math.max(s.ay,s.by)+r]);
  }
 }
 return index;
}
export function roadConflicts(b,index,{margin=.5}={}){
 const polys=projectedPolygons(b),box=polygonBounds(polys.flat()),hits=new Map();
 for(const seg of index.query(box)){
  const base=roadFootprintDistance(polys[0],seg),distance=Math.min(...polys.map(p=>roadFootprintDistance(p,seg)));
  if(distance>=seg.radius+margin-1e-6)continue;
  const hit={roadId:seg.roadId,name:seg.name,type:seg.type,penetration:Math.round((seg.radius+margin-distance)*100)/100,footprint:base<seg.radius,centerline:base<.01};
  const old=hits.get(seg.roadId);if(!old||old.penetration<hit.penetration)hits.set(seg.roadId,hit);
 }
 return [...hits.values()].sort((a,b)=>b.penetration-a.penetration);
}
export function buildingsOverlap(a,b,pad=.4){return !footprintsClear(closed(a.p),closed(b.p),pad);}
export function translateBuilding(b,dx,dy){
 const p=b.p.map((v,i)=>Math.round((v+(i%2?dy:dx))*10)/10),box=polygonBounds(p);
 return {...b,p,bounds:box,art:b.art?{...b.art,x0:box[0],y0:box[1],x1:box[2],y1:box[3],cx:(box[0]+box[2])/2,cy:(box[1]+box[3])/2}:undefined};
}
export function auditPositions(buildings,index){
 return buildings.flatMap(b=>{const roads=roadConflicts(b,index);return roads.length?[{id:b.id,name:b.n||'',inferred:b.id<0,bounds:polygonBounds(b.p),roads}]:[];});
}
export function containsPoi(b,pois){return pois.some(p=>p.p?.length===2&&pointInFootprint(p.p[0],p.p[1],b));}
