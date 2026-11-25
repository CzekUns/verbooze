"""Pack ImageGen masters: proportional nearest-neighbour resizing, alpha quantization,
paint palette conversion and atlas layout. No creative redraw. Requires Pillow + numpy.
Run from repository root: python3 grandassemediano/scripts/pack-fictional-fleet.py
"""
from pathlib import Path
from PIL import Image,ImageOps
import numpy as np,json,re
ROOT=Path(__file__).resolve().parents[1];V=ROOT/'assets/vehicles';S=V/'sources'
def cut(image,index,cols,rows):
 w,h=image.size;x=index%cols;y=index//cols
 im=image.crop((round(x*w/cols),round(y*h/rows),round((x+1)*w/cols),round((y+1)*h/rows)))
 a=np.array(im);a[:,:,3]=np.where(a[:,:,3]>=240,255,0).astype('uint8');im=Image.fromarray(a);return im.crop(im.getbbox())
# ImageGen grid has unequal visual gutters. Explicit non-overlapping cell rectangles
# exclude neighbouring silhouettes while keeping each complete car, without stretching.
master=Image.open(S/'fictional-cars-master.png').convert('RGBA')
cars=[]
for top,bottom in [(25,330),(365,660),(690,1030),(1050,1445)]:
 for left,right in [(25,245),(300,520),(570,795),(830,1080)]:
  im=master.crop((left,top,right,bottom));a=np.array(im);a[:,:,3]=np.where(a[:,:,3]>=240,255,0).astype('uint8');im=Image.fromarray(a);cars.append(im.crop(im.getbbox()))

util=[cut(Image.open(S/'fictional-utility-master.png').convert('RGBA'),i,4,2) for i in range(8)]
PAINTS=['#d6d5cb','#a23b3d','#426a99','#939d9c','#525b60','#33363b','#75a999','#b49c76']
COLORS={'white':'#d6d5cb','red':'#a23b3d','blue':'#426a99','silver':'#939d9c','graphite':'#525b60','black':'#33363b','mint':'#75a999','champagne':'#b49c76','navy':'#304661','lightblue':'#7fa5b8','burgundy':'#703647','yellow':'#c5a34f','green':'#5c8763','cream':'#c2b48d','beige':'#aa9670','purple':'#795f8a','sand':'#ad9c74','bronze':'#987956','grey':'#8d959b','nightblue':'#324763','pacificblue':'#4b879a','sunsetred':'#c26b57','orange':'#c77c39','sharkgrey':'#6a7c81','virtualblue':'#638fad','darkblue':'#35516d','orangepower':'#bf783d','darkgreen':'#466750','brown':'#80644b','white-stripe':'#b8d1d0','white-edilizia':'#bcb6a0','white-frutta':'#b9c79f'}
code=(ROOT/'car-sprites.mjs').read_text()
MODEL_COLORS={m:re.findall(r"'([^']+)'",c) for m,c in re.findall(r"model:'([^']+)'[^}]*?colors:\[([^]]+)\]",code)}
MODEL_COLORS['alba']=['white','red','blue','silver','graphite','black','mint','champagne']
MODEL_COLORS['luna']=['white','black','silver','graphite','navy','lightblue','burgundy','champagne']
def painted(im,paint):
 a=np.array(im);rgb=[int(paint[i:i+2],16) for i in (1,3,5)];r,g,b=[a[:,:,i].astype(float) for i in range(3)]
 mask=(g>r*1.2)&(b>r*1.15)&(g>=b*.98)&(g<b*1.3)&(a[:,:,3]>0);shade=np.clip(g/155,.4,1.35)
 for i,c in enumerate(rgb):a[:,:,i][mask]=np.clip(c*shade[mask],0,255).astype('uint8')
 out=Image.fromarray(a);alpha=out.getchannel('A');q=out.convert('RGB').quantize(colors=40,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGBA');q.putalpha(alpha);return q
def sprite(im,cell=(40,60),box=None,paint=PAINTS[0]):
 x,y,w,h=box or (2,2,cell[0]-4,cell[1]-4);tile=Image.new('RGBA',cell);im=ImageOps.contain(im,(w,h),Image.Resampling.NEAREST);tile.paste(painted(im,paint),(x+(w-im.width)//2,y+(h-im.height)//2));return tile
manifest={}
def atlas(name,masters,cell=(40,60),boxes=None,indexed=False,models=None,paintList=None):
 out=Image.new('RGBA',(cell[0]*4,cell[1]*4));bounds=[]
 for i in range(16):
  model=i//8 if len(masters)==2 else i//4 if len(masters)==4 else 0
  paint=PAINTS[i%8] if len(masters)!=4 else [PAINTS[0],PAINTS[1],PAINTS[5],PAINTS[2]][i%4]
  if paintList:paint=paintList[i%8]
  if models:paint=COLORS[MODEL_COLORS[models[model]][i%8]]
  tile=sprite(masters[model],cell,boxes[model] if boxes else None,paint);out.paste(tile,((i%4)*cell[0],(i//4)*cell[1]));bounds.append(tile.getbbox())
 out=out.quantize(colors=96,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
 if not indexed:out=out.convert('RGBA')
 out.save(V/name,optimize=True);manifest[name]={'cell':list(cell),'alphaBounds':bounds}
pairs=['alba-luna-16colors-rgba.png','nido-vela-16colors-rgba.png','riva-mira-16colors-rgba.png','aurora-selce-16-rgba.png','corallo-faro-16-rgba.png','quarzo-onda-16-rgba.png','iris-sabbia-16-rgba.png','altura-sentiero-16-rgba.png']
names=[['alba','luna'],['nido','vela'],['riva','mira'],['aurora','selce'],['corallo','faro'],['quarzo','onda'],['iris','sabbia'],['altura','sentiero']]
for i,name in enumerate(pairs):atlas(name,cars[i*2:i*2+2],indexed=i==0,models=names[i]);manifest[name]['masterIndices']=[i*2,i*2+1]
for name,im in [('borgo-classica-red.png',cars[2]),('borgo-nuova-white.png',cars[7]),('triciclo-car-top.png',util[0]),('furgone-fritti-top.png',util[3])]:
 out=sprite(im,(88,132),paint=PAINTS[1] if 'red' in name else COLORS['lightblue'] if 'triciclo' in name else PAINTS[0]);out=out.quantize(colors=96,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE);out.save(V/name,optimize=True);manifest[name]={'alphaBounds':[out.getbbox()]}
atlas('cargo-bottega-16-rgba.png',util[2:4],(52,92),[(1,7,50,79),(5,17,42,62)],models=['cargo','bottega'])
atlas('triciclo-food-16-rgba.png',[util[1],util[3]],(56,64),indexed=True,paintList=[COLORS[c] for c in ['lightblue']*4+['green']*4])
atlas('triciclo-classica-16-rgba.png',[util[0],util[1]],(56,64),paintList=[COLORS[c] for c in ['lightblue','green','red','white','grey','yellow','blue','cream']])
atlas('moto-16-40x68-256.png',util[4:8],(40,68),indexed=True)
(S/'fictional-fleet-layout.json').write_text(json.dumps(manifest,indent=2)+'\n')
