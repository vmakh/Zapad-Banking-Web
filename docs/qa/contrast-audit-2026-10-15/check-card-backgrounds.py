import json, math
from pathlib import Path
from PIL import Image
p=Path(__file__).resolve().parent
def lum(c):
    c=[x/255 for x in c]
    c=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c]
    return sum(a*b for a,b in zip(c,[.2126,.7152,.0722]))
def ratio(a,b):
    x,y=lum(a),lum(b)
    return (max(x,y)+.05)/(min(x,y)+.05)
results=[]
for card in json.loads((p/'card-captures.json').read_text()):
    image=Image.open(p/card['filename']).convert('RGB')
    for t in card['texts']:
        r=t['rect']
        fg=[int(x) for x in t['color'].removeprefix('rgb(').removesuffix(')').split(',')]
        badge=t['text'] in ['Personal','Business','Virtual','Frozen']
        lines=[math.ceil(r['top'])+1,math.floor(r['bottom'])-1] if badge else [math.floor(r['top'])-1,math.ceil(r['bottom'])+1]
        samples=[image.getpixel((x,y)) for y in lines for x in range(math.ceil(r['left'])+2,math.floor(r['right'])-2)]
        worst=min(samples,key=lambda bg:ratio(fg,bg))
        results.append({'card':card['filename'],'label':t['text'],'foreground':fg,'sampledBackground':worst,'ratio':round(ratio(fg,worst),3),'method':'Background strips outside text line boxes; inside badge padding for badge text. Raster spot check, not exact gradient certification.'})
(p/'card-spot-checks.json').write_text(json.dumps(results,indent=2))
for name in sorted(set(x['card'] for x in results)):
    worst=min((x for x in results if x['card']==name),key=lambda x:x['ratio'])
    print(name,worst['label'],worst['ratio'])
