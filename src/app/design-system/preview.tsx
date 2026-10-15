import { createPreviewStorage } from './previewStorage';
import { resolveGallerySelection } from './catalogue';
import { resolvePreviewFont } from './fontOptions';
import { isLocale } from '../i18n/locales';
import './font-proposals.css';
import '../../styles/index.css';
import './gallery.css';

// Install before loading React/data modules. Only this iframe's window is changed;
// the browser's persistent storage and the parent document are never touched.
Object.defineProperty(window,'localStorage',{value:createPreviewStorage(),configurable:true});
Object.defineProperty(window,'sessionStorage',{value:createPreviewStorage(),configurable:true});
let cookie='';
Object.defineProperty(document,'cookie',{get:()=>cookie,set:(value:string)=>{cookie=value;},configurable:true});
const params=new URLSearchParams(location.search);
const selected=resolveGallerySelection(params.get('sample'),params.get('state'),params.get('context'));
const profile=selected.context==='business'?'business':'personal';
const locale=params.get('locale');
const font=resolvePreviewFont(params.get('bodyfont'));
if(font)document.documentElement.style.setProperty('--bank-body',`"${font.family}", sans-serif`);
localStorage.setItem('zapadbanka-locale',isLocale(locale)?locale:'en');
localStorage.setItem('zapadbanka-profile-slug',profile);
if(selected.state==='private')localStorage.setItem('zb-hide-balances','1');
if(selected.section.id==='savings-goals'&&selected.state==='empty')localStorage.setItem(`zb-product-v1:goals:${profile}`,'[]');
void import('./PreviewApp').then(({renderPreview})=>renderPreview(selected.section.id,selected.state,profile)).catch(()=>{
  const root=document.getElementById('root');
  if(root){root.setAttribute('role','alert');root.textContent='Preview could not load. Reload the gallery to try again.';}
});
