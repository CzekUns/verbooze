/* One redesigned building mass: artistic game geometry, not surveyed OSM.
 * The source map stays untouched; drawing and collision share the new body. */
export const SHTRICYCLE_SAMPLE_ID=733704038;
const expected=Object.freeze([1133.3,1273.3,1128.1,1277,1130.8,1281.3,1129.3,1282.7,1131.9,1286.7,1129.9,1288,1124.4,1287.9,1124.4,1298,1123.8,1298.7,1111.2,1301.1,1111.7,1294.8,1120.5,1293,1120.5,1287.7,1113.6,1287.2,1116.7,1279.3,1124.8,1280.3,1125,1276.1,1131.2,1269.9,1133.3,1273.3]);
export const SHTRICYCLE_SAMPLE_PATH=Object.freeze([1110.5,1285.4,1129.4,1274.2,1135.5,1284.6,1116.6,1295.8,1110.5,1285.4]);
export const SAMPLE_BALCONY_DEPTH=.9;
export function applyBuildingShapeSample(buildings){
 return buildings.map(b=>{
  if(b.id!==SHTRICYCLE_SAMPLE_ID||b.n||b.p.length!==expected.length||!b.p.every((v,i)=>Math.abs(v-expected[i])<.01))return b;
  const {art,bounds,...source}=b;
  return {...source,p:[...SHTRICYCLE_SAMPLE_PATH],shapePilot:{id:'via-roma-massa-regolare',originalPlacedFootprint:b.p.slice(),source:'artistic-game-geometry'}};
 });
}
// Projecting slabs instead of the flat balcony marks used by other buildings.
export function sampleBalconySlabs(a,v,f,edgeX,edgeY,length,windows){
 if(!a.shapeSample||a.stylePilot.balcony==='none')return [];
 const depth=Math.hypot(v.dx,v.dy),ex=edgeX/length,ey=edgeY/length;
 const nx=ey*v.areaSign*SAMPLE_BALCONY_DEPTH,ny=-ex*v.areaSign*SAMPLE_BALCONY_DEPTH;
 const at=(u,w)=>[f.x1+ex*u+v.dx/depth*w,f.y1+ey*u+v.dy/depth*w];
 const rows=Math.min(v.stories,3),out=[];
 for(const w of windows){
  if(w.door||w.row>=rows-1)continue;
  const half=Math.min(2.2,length*.16),y=w.y+w.h*.62;
  if(w.x-half<.6||w.x+half>length-.6)continue;
  const left=at(w.x-half,y),right=at(w.x+half,y);
  out.push({left,right,frontLeft:[left[0]+nx,left[1]+ny],frontRight:[right[0]+nx,right[1]+ny]});
 }
 return out;
}
export function drawSampleBalconies(c,slabs){
 const polygon=points=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();};
 for(const b of slabs){
  const {left:A,right:B,frontRight:C,frontLeft:D}=b;
  polygon([A,B,C,D].map(([x,y])=>[x+.1,y+.65]));c.fillStyle='#26342e42';c.fill();
  polygon([A,B,C,D]);c.fillStyle='#ded5c4';c.fill();
  polygon([D,C,[C[0],C[1]+.28],[D[0],D[1]+.28]]);c.fillStyle='#94998a';c.fill();
  c.strokeStyle='#3d4b45';c.lineWidth=.14;
  c.beginPath();c.moveTo(D[0],D[1]-.8);c.lineTo(C[0],C[1]-.8);
  c.moveTo(A[0],A[1]-.8);c.lineTo(D[0],D[1]-.8);c.moveTo(B[0],B[1]-.8);c.lineTo(C[0],C[1]-.8);
  for(let j=0;j<=6;j++){const t=j/6,x=D[0]+(C[0]-D[0])*t,y=D[1]+(C[1]-D[1])*t;c.moveTo(x,y-.8);c.lineTo(x,y);}
  c.stroke();
 }
}
