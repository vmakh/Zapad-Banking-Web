import { createElement, useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { PaymentCard } from '../components/zapad/PaymentCard';
import { CurrencyFlag, CurrencyMark } from '../components/zapad/CurrencyIcon';
import { IconScaleSlot } from '../components/zapad/IconScaleSlot';
import { HouseSimpleIcon } from '@phosphor-icons/react/dist/csr/HouseSimple';
import { BankIcon } from '@phosphor-icons/react/dist/csr/Bank';
import { PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/csr/PaperPlaneTilt';
import { CreditCardIcon } from '@phosphor-icons/react/dist/csr/CreditCard';
import { UserIcon } from '@phosphor-icons/react/dist/csr/User';
import { InfoIcon } from '@phosphor-icons/react/dist/csr/Info';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';
import { ReceiptIcon } from '@phosphor-icons/react/dist/csr/Receipt';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { useAppProfile } from '../hooks/useAppProfile';
import { cn } from '../components/ui/utils';
import type { SpecimenProps } from './types';

export function Foundations({sample,state}:SpecimenProps) {
  const {isBusiness}=useAppProfile();
  const [tokens,setTokens]=useState<Record<string,string>>({});
  const [copied,setCopied]=useState('');
  const palette=[['Brand','--bank-accent'],['Primary action','--bank-action'],['Ink','--bank-ink'],['Muted','--bank-muted'],['Line','--bank-line'],['Paper','--bank-paper'],['Selected','--bank-soft'],['Canvas','--card'],['Field','--bank-field'],['Field border','--bank-control-line'],['Action text','--bank-action-ink'],['Error','--bank-error'],['Disabled','--bank-disabled']] as const;
  useEffect(()=>{const style=getComputedStyle(document.documentElement);setTokens(Object.fromEntries(palette.map(([,token])=>[token,style.getPropertyValue(token).trim()])));},[isBusiness]);
  const copy=async(value:string)=>{try{await navigator.clipboard.writeText(value);setCopied(`Copied ${value}`);}catch{setCopied(`Value: ${value}`);}};
  if(sample==='colors')return <div className="space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{palette.map(([label,token])=><button key={token} type="button" className="text-left min-w-0 space-y-2 rounded-lg focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-2" aria-label={`Copy ${label} ${tokens[token]??''}`} onClick={()=>void copy(tokens[token]??'')}><span className="block h-20 rounded-lg border border-border" style={{background:`var(${token})`}}/><span className="block text-sm font-semibold">{label}</span><code className="block text-xs text-muted-foreground break-all">{tokens[token]??token}</code><span className="block text-xs text-muted-foreground break-all">{token}</span></button>)}</div>
    <p role="status" className="text-xs text-muted-foreground min-h-5">{copied||'Select a swatch to copy its live computed value.'}</p>
    <div className="border-t pt-5 space-y-4"><h2>Primary action</h2><Button onClick={()=>setCopied('Illustrative action. No bank request sent.')}>Continue</Button><p className="text-sm text-muted-foreground">Primary action uses --bank-action and --bank-action-ink.</p></div>
    <div className="border-t pt-5 space-y-4"><h2>Card material</h2><PaymentCard name={isBusiness?'Mastercard Business':'Visa Platinum'} last4="4821" expiry="12/28" holder="A. DEMO"/></div>
  </div>;
  if(sample==='typography')return <div className="space-y-6">
    <p className="text-base">Unbounded 500 · Onest 400 · Paragraph md 16 px</p>
    <p className="text-sm text-muted-foreground">Sizes, line heights and paragraph spacing follow a 4 px grid. Tracking is optical, in em. Paragraph spacing is the gap after a prose block; layout gaps are not added twice.</p>
    {[
      {role:'h1',label:'H1',size:40,line:48,spacing:24,tracking:'-.025em'},
      {role:'h2',label:'H2',size:32,line:40,spacing:20,tracking:'-.020em'},
      {role:'h3',label:'H3',size:28,line:36,spacing:16,tracking:'-.015em'},
      {role:'h4',label:'H4',size:24,line:32,spacing:16,tracking:'-.010em'},
      {role:'h5',label:'H5',size:20,line:28,spacing:12,tracking:'-.005em'},
      {role:'h6',label:'H6',size:16,line:24,spacing:8,tracking:'0em'},
      {role:'paragraph-sm',label:'Paragraph Sm',size:12,line:20,spacing:8,tracking:'0em'},
      {role:'paragraph-md',label:'Paragraph Md',size:16,line:24,spacing:12,tracking:'0em'},
      {role:'paragraph-lg',label:'Paragraph Lg',size:20,line:28,spacing:16,tracking:'-.005em'},
    ].map(item=><section key={item.role} className="border-b pb-5 space-y-3">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span>{item.label}</span><code>{item.size}px / {item.line}px · after {item.spacing}px · tracking {item.tracking} · weight {item.role.startsWith('h')?500:400}</code></div>
      {createElement(item.role.startsWith('h')?item.role:'p', {'data-type-style':item.role}, item.role.startsWith('h')?'Ваші фінанси під контролем':'Ваші рахунки, платежі й заощадження — в одному місці. Your accounts, clearly in view.')}
      {createElement('p', {'data-type-style':item.role.startsWith('h')?'paragraph-md':item.role}, 'Наступний абзац демонструє відступ після тексту.')}
    </section>)}
    <p className="text-base">All H1–H6 use the locally bundled Unbounded Medium at 500. Paragraphs use Onest 400. Labels stay 500, financial amounts 600, action labels 650; all controls use the 16 px body size. Full localized amounts retain tabular figures and their container-based sizing.</p>
  </div>;
  if(sample==='geometry')return <div className="space-y-8">
    <section className="space-y-4"><h2>Spacing</h2>{[1,2,3,4,5,6,8,12].map(n=><div key={n} className="flex items-center gap-4"><code className="w-20 text-xs text-muted-foreground">{n*4} px</code><span className="block h-4 bg-accent border border-border rounded-sm" style={{width:`calc(var(--spacing) * ${n})`}}/></div>)}</section>
    <section className="space-y-4"><h2>Surfaces</h2><div className="grid grid-cols-2 gap-4">{[['Control','--bank-control-radius'],['Panel','--bank-panel-radius']].map(([label,token])=><div key={token} className="space-y-3"><div className="h-24 border bg-muted" style={{borderRadius:`var(${token})`}}/><p className="text-sm">{label}</p><code className="text-xs text-muted-foreground">{token}</code></div>)}</div></section>
    <section className="space-y-4"><h2>Touch targets</h2><div className="flex flex-wrap items-center gap-4"><Button size="icon" aria-label="44 pixel target"><CheckIcon/></Button><Button size="xl">52 px minimum</Button></div><p className="text-sm text-muted-foreground">Text controls grow when translated labels wrap.</p></section>
  </div>;
  if(state==='flags')return <div className="space-y-6"><h2>Currency flags</h2><div className="flex flex-wrap items-center gap-6">{['EUR','USD','GBP'].map(currency=><div key={currency} className="space-y-3"><CurrencyFlag currency={currency}/><p className="text-sm">{currency}</p><CurrencyMark currency={currency}/></div>)}</div></div>;
  const icons=[['Home',HouseSimpleIcon],['Accounts',BankIcon],['Payments',PaperPlaneTiltIcon],['Cards',CreditCardIcon],['Profile',UserIcon],['Information',InfoIcon],['Confirm',CheckIcon],['Activity',ReceiptIcon],['Search',MagnifyingGlassIcon]] as const;
  return <div className="space-y-6"><h2>Phosphor · {state==='selected'?'fill':'regular'}</h2><div className="grid grid-cols-3 gap-6">{icons.map(([label,Icon])=><div key={label} className="flex flex-col items-center gap-2 text-center"><IconScaleSlot className="size-10" innerClassName={cn(state==='selected'&&'text-primary-text')}><Icon weight={state==='selected'?'fill':'regular'} className="size-6" aria-hidden="true"/></IconScaleSlot><p className="text-xs text-muted-foreground">{label}</p></div>)}</div><p className="text-sm text-muted-foreground">Functional glyphs: 24 px, transparent surface. Initial-based identities and status illustrations keep their own roles.</p></div>;
}
