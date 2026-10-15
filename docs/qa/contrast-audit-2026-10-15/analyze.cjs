const fs=require('node:fs');
const dir=__dirname;
const zlib=require('node:zlib');
const snapshots=JSON.parse(fs.existsSync(dir+'/raw.json')?fs.readFileSync(dir+'/raw.json','utf8'):zlib.gunzipSync(fs.readFileSync(dir+'/raw.json.gz')).toString());
function color(s){if(!s||s==='none'||s==='transparent')return [0,0,0,0];const n=s.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)?.map(Number)||[];if(s.startsWith('rgb'))return [n[0],n[1],n[2],n[3]??1];if(s.startsWith('color(srgb '))return [n[0]*255,n[1]*255,n[2]*255,n[3]??1];if(s.startsWith('oklab')||s.startsWith('oklch')){let [L,a,b,alpha=1]=n;if(s.startsWith('oklch')){let C=a,h=b*Math.PI/180;a=C*Math.cos(h);b=C*Math.sin(h);}const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,z=(L-.0894841775*a-1.291485548*b)**3;const linear=[4.0767416621*l-3.3077115913*m+.2309699292*z,-1.2684380046*l+2.6097574011*m-.3413193965*z,-.0041960863*l-.7034186147*m+1.707614701*z];return [...linear.map(c=>255*Math.max(0,Math.min(1,c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055))),alpha];}return null;}
const over=(a,b)=>{const alpha=a[3]+b[3]*(1-a[3]);return alpha?[0,1,2].map(i=>(a[i]*a[3]+b[i]*b[3]*(1-a[3]))/alpha).concat(alpha):[0,0,0,0];};
const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
function pixels(chain,fg){let front=fg,back=[0,0,0,0];for(const s of chain){const bg=color(s.background);if(!bg)return null;front=over(front,bg);back=over(back,bg);front[3]*=+s.opacity;back[3]*=+s.opacity;}return {foreground:over(front,[255,255,255,1]),background:over(back,[255,255,255,1])};}
const rows=[];
for(const shot of snapshots)for(const el of shot.elements){const s=el.chain[0];function add(kind,paint,threshold){const fg=color(paint);if(!fg||!fg[3])return;const p=pixels(kind==='outline-candidate'?el.chain.slice(1):el.chain,fg);if(!p)return;rows.push({sample:shot.sample,state:shot.state,profile:shot.profile,url:shot.url,kind,label:el.label,selector:el.selector,slot:el.slot,paint,foreground:p.foreground.slice(0,3).map(Math.round),background:p.background.slice(0,3).map(Math.round),ratio:ratio(p.foreground,p.background),threshold,passes:ratio(p.foreground,p.background)>=threshold,disabled:el.disabled,review:el.chain.some(s=>s.image!=='none')?'gradient/image':el.chain.some(s=>+s.opacity<1)&&!el.disabled?'opacity/manual':null,functional:el.functional,role:el.role||el.tag,fontSize:s.fontSize,fontWeight:s.fontWeight,hover:el.hover,focus:el.focus});}
if(el.text&&!el.ariaHidden&&el.tag!=='svg')add('text',s.color,parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.6667&&+s.fontWeight>=700)?3:4.5);
if(el.tag==='input'||el.tag==='textarea'){if(el.value)add('value',s.color,4.5);else if(el.placeholder)add('placeholder',el.placeholderStyle,4.5);}
for(const paint of el.paints)add('icon',paint,3);
if(parseFloat(s.borderWidth)>0&&['input','textarea','button','checkbox','radio','switch','slider','combobox'].includes(el.role||el.tag))add('boundary-candidate',s.border,3);
if(parseFloat(s.outlineWidth)>0&&s.outlineStyle!=='none')add('outline-candidate',s.outline,3);
}
fs.writeFileSync(dir+'/measurements.json',JSON.stringify(rows));
const failing=rows.filter(r=>!r.passes&&!r.disabled&&!r.review);
const groups=new Map();for(const r of failing){const key=[r.kind,r.profile,r.paint,r.background.join(',')].join('|');if(!groups.has(key))groups.set(key,{kind:r.kind,profile:r.profile,paint:r.paint,bg:r.background,ratio:r.ratio,locations:[]});const g=groups.get(key);if(g.locations.length<6)g.locations.push(`${r.sample}/${r.state}: ${r.label}`);}
console.log(JSON.stringify({snapshots:snapshots.length,rows:rows.length,failing:failing.length,disabled:rows.filter(r=>r.disabled).length,manual:rows.filter(r=>r.review).length,groups:[...groups.values()]},null,2));
