import { useEffect, useState } from 'react';
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
    <p className="text-sm text-muted-foreground">Unbounded Medium · Onest variable</p>
    {[
      ['Available balance','48 / 600 / 1.1',<p key="balance" className="text-5xl font-semibold tabular-nums break-words">€28,430.18</p>],
      ['Page title','24 / 500 / 1.35',<h1 key="title">Your banking</h1>],
      ['Popup title','20 / 500 / 1.35',<p key="popup" style={{fontFamily:'var(--bank-display)',fontSize:'var(--text-xl)',fontWeight:500,lineHeight:1.35}}>Account details</p>],
      ['Section title','20 / 600 / 1.3',<h2 key="section">Recent activity</h2>],
      ['Body','17 / 400 / 1.4',<p key="body" className="text-base">Your accounts, clearly in view.</p>],
      ['Action','17 / 650 / 1.4',<Button key="action" variant="outline">View account</Button>],
      ['Secondary','15 / 400 / 1.45',<p key="secondary" className="text-sm text-muted-foreground">Available balance · EUR</p>],
      ['Footnote','13 / 400 / 1.4',<p key="footnote" className="text-xs text-muted-foreground">Saved on this device</p>],
      ['Caption','11 / 500 / 1.4',<p key="caption" className="text-caption font-medium text-muted-foreground">DEMO SIMULATION</p>],
    ].map(([label,spec,example])=><div key={String(label)} className="border-b pb-5 space-y-3"><div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{label}</span><code>{spec}</code></div>{example}</div>)}
    <p className="text-sm text-muted-foreground">Onest is bundled locally (400 / 500 / 600 / 650). Amounts use Onest and tabular figures; page and popup titles use Unbounded Medium.</p>
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
