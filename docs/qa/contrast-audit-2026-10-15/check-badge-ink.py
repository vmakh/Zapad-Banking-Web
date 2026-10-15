import json,math,sys
from PIL import Image
from pathlib import Path
p=Path(__file__).resolve().parent
def lum(c):
 c=[v/255 for v in c];return sum((v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4)*w for v,w in zip(c,[.2126,.7152,.0722]))
def cr(a,b):return (max(lum(a),lum(b))+.05)/(min(lum(a),lum(b))+.05)
results=[]
for card in json.loads((p/'card-captures.json').read_text()):
 im=Image.open(p/card['filename']).convert('RGB')
 for t in card['texts']:
  if t['text'] not in ['Personal','Business','Virtual','Frozen']:continue
  r=t['rect'];fg=[int(x) for x in t['color'][4:-1].split(',')];top=math.ceil(r['top'])+2;bottom=math.floor(r['bottom'])-2;ratios=[]
  for x in range(math.ceil(r['left'])+8,math.floor(r['right'])-8):
   a,b=im.getpixel((x,top)),im.getpixel((x,bottom))
   for y in range(top+3,bottom-2):
    bg=[a[i]+(b[i]-a[i])*(y-top)/(bottom-top) for i in range(3)];pixel=im.getpixel((x,y))
    if all(pixel[i]>=bg[i] for i in range(3)) and max(pixel[i]-bg[i] for i in range(3))>35:ratios.append(cr(fg,bg))
  result={'card':card['filename'],'label':t['text'],'worstRatio':round(min(ratios),3),'glyphPixels':len(ratios),'method':'Raster glyph-mask background interpolated between badge padding strips; approximate spot check.'};results.append(result);print(result)
(p/'badge-ink-checks.json').write_text(json.dumps(results,indent=2))
