import {sampleBalconySlabs,drawSampleBalconies} from './building-shape-sample.mjs?v=001';
/* Approved aesthetic direction, first eight ordinary Via Roma buildings only.
 * Palette and facades are fictional styling, not photographic observations.
 * Footprints, height, collisions and the high top-down camera stay unchanged. */
import {pointInFootprint} from './road-clearance.mjs?v=100';

const profiles={
 cream:{family:'palazzina',wall:'#d9cfb7',roof:'#aaa99d',shutter:'#405c50',balcony:'separate',pitched:false},
 pink:{family:'palazzina',wall:'#cbb4a8',roof:'#a9a69d',shutter:'#4b6054',balcony:'separate',pitched:false},
 modern:{family:'condominio',wall:'#c9c8bd',roof:'#a3a79f',shutter:'#49575a',balcony:'continuous',pitched:false},
 ochre:{family:'casa',wall:'#d2bc96',roof:'#aaaea1',shutter:'#466052',balcony:'separate',pitched:false},
 older:{family:'casa-storica',wall:'#d0c2a6',roof:'#ac7052',shutter:'#4a6555',balcony:'none',pitched:true}
};
export const VIA_ROMA_PILOT=Object.freeze([
 [733704085,'older'],[733704038,'pink'],[733704138,'modern'],[733704135,'cream'],
 [733704185,'ochre'],[733704239,'older'],[733704361,'cream'],[733704281,'pink']
].map(([id,key])=>Object.freeze({id,...profiles[key]})));
const byId=new Map(VIA_ROMA_PILOT.map(p=>[p.id,p]));
export function applyViaRomaStylePilot(buildings){
 let changed=0;
 for(const b of buildings){
  const p=byId.get(b.id),a=b.art;
  if(!p||!a||a.surveyStatus==='photo-verified'||a.glass||a.ruinPool)continue;
  a.shapeSample=!!b.shapePilot;a.stylePilot=p;a.facadeTint=p.wall;a.roofTint=p.roof;a.roof=p.pitched&&b.roof!=='flat';
  delete a.windowPanes;changed++;
 }
 return changed;
}
// Shared geometry for daytime rendering AND illuminated windows at night.
export function pilotFacadeWindows(art,volume,length,edgeIndex){
 const rows=Math.min(volume.stories,3),depth=Math.hypot(volume.dx,volume.dy);
 const columns=Math.max(1,Math.min(12,Math.floor(length/6.8))),spacing=length/(columns+1),storey=depth/rows;
 const width=Math.min(2.1,spacing*.4),height=Math.min(1.8,storey*.5),windows=[];
 for(let row=0;row<rows;row++)for(let column=1;column<=columns;column++){
  const door=row===rows-1&&column===Math.ceil(columns/2)&&length>10;
  windows.push({x:spacing*column,y:(row+.48)*storey,w:width,h:height,row,column,door,
   seed:(art.seed+row*97+column*131+edgeIndex*17)>>>0});
 }
 return {windows,rows,depth,storey};
}
export function drawPilotFacade(c,a,v,f,edgeX,edgeY,length,zoom){
 if(zoom<1.1||length<2.6)return;
 const profile=a.stylePilot,layout=pilotFacadeWindows(a,v,length,0);
 c.save();c.beginPath();c.moveTo(f.x1,f.y1);c.lineTo(f.x2,f.y2);c.lineTo(f.x3,f.y3);c.lineTo(f.x4,f.y4);c.closePath();c.clip();c.transform(edgeX/length,edgeY/length,v.dx/layout.depth,v.dy/layout.depth,f.x1,f.y1);
 // Subtle continuous floor bands, not independent random window positions.
 for(let row=1;row<layout.rows;row++){
  c.fillStyle='#7b7e7240';c.fillRect(0,row*layout.storey-.2,length,.35);
  c.fillStyle='#eee6d23d';c.fillRect(0,row*layout.storey+.15,length,.18);
 }
 if(zoom<1.3){c.restore();return;}
 for(const w of layout.windows){
  if(w.door){
   const height=Math.min(3,layout.storey*.78),y=layout.depth-height;
   c.fillStyle='#ece5d3';c.fillRect(w.x-1.25,y-.25,2.5,height+.3);
   c.fillStyle='#454e48';c.fillRect(w.x-1,y,2,height);
   c.fillStyle='#969a88';c.fillRect(w.x-.08,y,.16,height);continue;
  }
  const x=w.x-w.w/2,y=w.y-w.h/2;
  c.fillStyle='#eee8d6';c.fillRect(x-.22,y-.2,w.w+.44,w.h+.4);
  c.fillStyle='#334649';c.fillRect(x,y,w.w,w.h);
  c.fillStyle='#a4b4ad';c.fillRect(x+.2,y+.15,w.w*.27,w.h*.65);
  c.fillStyle='#c8c4ad';c.fillRect(w.x-.08,y,.16,w.h);
  if(profile.family!=='condominio'&&w.column%3===1){
   c.fillStyle=profile.shutter;c.fillRect(x-.8,y,.5,w.h);c.fillRect(x+w.w+.3,y,.5,w.h);
  }
  if(!a.shapeSample&&w.row<layout.rows-1&&profile.balcony!=='none'){
   const span=profile.balcony==='continuous'?Math.min(5.3,length/(Math.ceil(length/6.8)+1)*.8):3.8;
   const bx=w.x-span/2,by=w.y+w.h*.6;
   c.fillStyle='#e2d8c2';c.fillRect(bx,by,span,.38);
   c.fillStyle='#3f4b46';c.fillRect(bx,by-.9,span,.18);
   for(let j=0;j<=4;j++)c.fillRect(bx+j*span/4,by-.9,.13,.9);
  }
 }
 c.restore();
 if(a.shapeSample)drawSampleBalconies(c,sampleBalconySlabs(a,v,f,edgeX,edgeY,length,layout.windows));
}
export function drawPilotRoof(c,b,a){
 const p=a.stylePilot;
 c.save();c.beginPath();for(let i=0;i<b.p.length;i+=2)i?c.lineTo(b.p[i],b.p[i+1]):c.moveTo(b.p[i],b.p[i+1]);c.closePath();c.clip();
 c.fillStyle=p.roof;c.fillRect(a.x0,a.y0,a.w,a.h);
 c.strokeStyle=p.pitched?'#684b3c70':'#626e6538';c.lineWidth=.2;c.beginPath();
 const step=p.pitched?2.7:9;
 for(let y=a.y0+step;y<a.y1;y+=step){c.moveTo(a.x0,y);c.lineTo(a.x1,y);}
 if(!p.pitched)for(let x=a.x0+step;x<a.x1;x+=step){c.moveTo(x,a.y0);c.lineTo(x,a.y1);}
 else for(let row=0,y=a.y0;y<a.y1;row++,y+=step)for(let x=a.x0+(row%2)*2.4;x<a.x1;x+=4.8){c.moveTo(x,y);c.lineTo(x,y+step);}
 c.stroke();
 if(p.pitched){
  c.fillStyle='#46372f22';c.fillRect(a.x0,a.y0+a.h/2,a.w,a.h/2);
  c.strokeStyle='#d3a27b';c.lineWidth=.5;c.beginPath();c.moveTo(a.x0,a.y0+a.h/2);c.lineTo(a.x1,a.y0+a.h/2);c.stroke();
 }else{
  // One stairwell only, and only if all four corners fit the actual roof.
  const w=Math.min(5,a.w*.22),h=Math.min(4,a.h*.2);
  for(const [u,v] of [[.28,.3],[.7,.3],[.5,.6],[.25,.7],[.7,.7]]){
   const x=a.x0+a.w*u-w/2,y=a.y0+a.h*v-h/2;
   if(![[x-1,y-1],[x+w+1,y-1],[x+w+1,y+h+2],[x-1,y+h+2]].every(([px,py])=>pointInFootprint(px,py,b)))continue;
   c.fillStyle='#626c6255';c.fillRect(x+.7,y+.8,w,h+1);
   c.fillStyle=p.wall;c.fillRect(x,y,w,h+1);
   c.fillStyle='#dad6c6';c.fillRect(x,y,w,h);
   c.fillStyle='#515e55';c.fillRect(x+w*.43,y+h,.9,1.1);break;
  }
 }
 c.restore();
}
