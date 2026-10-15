import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { ListIcon } from '@phosphor-icons/react/dist/csr/List';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../components/ui/sheet';
import { I18nProvider } from '../i18n/I18nProvider';
import { cn } from '../components/ui/utils';
import { gallerySections, resolveGallerySelection, stateLabels, type GalleryContext } from './catalogue';
import documentationUrl from '../../../docs/DESIGN_SYSTEM.md?url';
import bankMark from '../../assets/zapad-mark.png';
import '../../styles/index.css';
import './gallery.css';

function readSelection() {
  const [id,state] = window.location.hash.slice(1).split('/');
  return resolveGallerySelection(id,state,new URLSearchParams(window.location.search).get('context'));
}
function GalleryApp() {
  const [selection,setSelection] = useState(readSelection);
  const [query,setQuery] = useState('');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [revision,setRevision] = useState(0);
  const [narrow,setNarrow] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeToContent = useRef(false);
  const {section,state,context} = selection;
  useEffect(()=>{
    const sync=()=>{setSelection(readSelection());setRevision(0);};
    const shortcut=(event:KeyboardEvent)=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes((event.target as HTMLElement).tagName)){event.preventDefault();searchRef.current?.focus();}};
    window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);window.addEventListener('keydown',shortcut);
    return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);window.removeEventListener('keydown',shortcut);};
  },[]);
  const select=(id:string,nextState?:string,nextContext:GalleryContext=context)=>{
    const next=resolveGallerySelection(id,nextState??null,nextContext);
    window.history.pushState(null,'',`?context=${next.context}#${next.section.id}/${next.state}`);
    closeToContent.current=mobileOpen;
    setSelection(next);setRevision(0);setMobileOpen(false);
    if(id!==section.id){window.scrollTo({top:0,behavior:'instant'});mainRef.current?.focus({preventScroll:true});}
  };
  const filtered=useMemo(()=>gallerySections.filter(entry=>`${entry.title} ${entry.id} ${entry.modules.join(' ')} ${entry.states.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())),[query]);
  const groups=[...new Set(gallerySections.map(entry=>entry.group))];
  const contexts=context==='compare'?['personal','business'] as const:[context];
  const moduleCount=new Set(gallerySections.flatMap(entry=>entry.modules)).size;
  const catalogue=<>
    <a href="#colors/default" onClick={event=>{event.preventDefault();select('colors');}} className="flex items-center gap-3 px-5 py-6 text-foreground no-underline">
      <img src={bankMark} className="size-9 object-contain" alt=""/><span className="font-semibold">Zapad Banka<span className="block text-xs text-muted-foreground font-normal">Design system · Web</span></span>
    </a>
    <div className="px-4 pb-4"><div className="relative"><MagnifyingGlassIcon className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true"/><Input ref={searchRef} value={query} onChange={event=>setQuery(event.target.value)} aria-label="Знайти компонент" placeholder="Знайти компонент…" className="pl-9 bg-card"/></div></div>
    <nav aria-label="Каталог компонентів" className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
      {groups.map(group=>{const entries=filtered.filter(entry=>entry.group===group);return entries.length>0&&<div key={group}><h2 className="px-3 text-xs font-semibold text-muted-foreground mb-2">{group}</h2>{entries.map(entry=><a key={entry.id} href={`#${entry.id}/${entry.states[0]}`} onClick={event=>{event.preventDefault();select(entry.id);}} aria-current={section.id===entry.id?'page':undefined} className={cn('flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm no-underline transition-colors hover:bg-muted',section.id===entry.id?'bg-accent text-accent-foreground font-semibold':'text-foreground')}><span>{entry.title}</span><span className="text-xs text-muted-foreground tabular-nums">{entry.states.length}</span></a>)}</div>;})}
      {filtered.length===0&&<p role="status" className="px-3 text-sm text-muted-foreground">Компонентів не знайдено</p>}
    </nav>
    <div className="border-t p-5 space-y-3"><p className="text-xs text-muted-foreground">{moduleCount} модулів · {gallerySections.length} груп · {gallerySections.reduce((total,entry)=>total+entry.states.length,0)} станів</p><a href="/#/personal" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-foreground no-underline">Відкрити застосунок<ArrowUpRightIcon className="size-4" aria-hidden="true"/></a></div>
  </>;
  return <div data-gallery-host className="min-h-screen bg-card text-foreground">
    <a href="#gallery-content" onClick={event=>{event.preventDefault();mainRef.current?.focus();}} className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:bg-card focus:rounded-lg focus:p-3">До зразків</a>
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r bg-card">{catalogue}</aside>
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetContent side="left" className="w-72 p-0 gap-0" onCloseAutoFocus={event=>{event.preventDefault();(closeToContent.current?mainRef.current:menuRef.current)?.focus({preventScroll:true});closeToContent.current=false;}}><SheetTitle className="sr-only">Каталог компонентів</SheetTitle><SheetDescription className="sr-only">Пошук і групи дизайн-системи</SheetDescription>{mobileOpen&&catalogue}</SheetContent></Sheet>
    <div className="lg:ml-64">
      <header className="flex items-center justify-between gap-4 border-b px-5 md:px-8 py-4"><span className="text-sm text-muted-foreground">Бібліотека інтерфейсу</span><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">React · Phosphor · Unbounded</span><Button variant="ghost" size="icon" className="lg:hidden" ref={menuRef} aria-label="Відкрити каталог" onClick={()=>setMobileOpen(true)}><ListIcon className="size-5"/></Button></div></header>
      <main id="gallery-content" ref={mainRef} tabIndex={-1} className="max-w-screen-2xl mx-auto p-5 md:p-8 space-y-6 outline-none">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h1 className="text-2xl md:text-3xl font-medium tracking-tight break-words">{section.title}</h1><p className="text-sm leading-relaxed text-muted-foreground mt-3 max-w-2xl">{section.description}</p></div><a href={documentationUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex shrink-0 items-center gap-2 text-sm text-muted-foreground no-underline py-2">Документація<ArrowUpRightIcon className="size-4" aria-hidden="true"/></a></div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-segmented bg-muted p-1" role="group" aria-label="Банківський контекст">{(['compare','personal','business'] as const).map(value=><Button key={value} variant="ghost" size="sm" aria-pressed={context===value} className={cn('min-h-11 rounded-segmented-item',context===value&&'bg-card shadow-sm')} onClick={()=>select(section.id,state,value)}>{value==='compare'?'Порівняння':value==='personal'?'Personal':'Business'}</Button>)}</div>
          <div className="flex flex-wrap items-center gap-3"><Button variant="outline" size="sm" aria-pressed={narrow} onClick={()=>setNarrow(value=>!value)}>{narrow?'360 px':'Адаптивний зразок'}</Button><Button variant="ghost" size="sm" onClick={()=>setRevision(value=>value+1)}><ArrowClockwiseIcon className="size-4" aria-hidden="true"/>Скинути</Button></div>
        </div>
        <div role="group" aria-label="Стани компонента" className="flex flex-wrap gap-2">{section.states.map(value=><Button key={value} variant="outline" size="sm" aria-pressed={state===value} className={cn(state===value&&'bg-accent text-accent-foreground border-primary/30')} onClick={()=>select(section.id,value)}>{stateLabels[value]??value}</Button>)}</div>
        <div data-gallery-panels className={cn('grid gap-6 items-start',context==='compare'?'grid-cols-1 xl:grid-cols-2':'grid-cols-1')}>
          {contexts.map(profile=><section key={profile} className="min-w-0 space-y-3" aria-label={`${section.title} — ${profile==='personal'?'Personal':'Business'}`}>
            <div className="flex items-center justify-between gap-3"><h2 className="text-base font-semibold flex items-center gap-2"><span className={cn('size-2 rounded-full',profile==='personal'?'bg-brand-personal':'bg-brand-business')}/>{profile==='personal'?'Personal banking':'Business banking'}</h2><span className="text-xs text-muted-foreground">Живі компоненти</span></div>
            <div className="rounded-xl border bg-muted p-2 sm:p-4 flex justify-center overflow-hidden"><iframe key={`${section.id}-${state}-${profile}-${revision}`} title={`${section.title} — ${profile==='personal'?'Personal banking':'Business banking'}`} src={`/design-system-preview.html?sample=${section.id}&state=${state}&context=${profile}`} sandbox="allow-scripts allow-same-origin allow-downloads" className={cn('h-gallery-preview border rounded-lg bg-card max-w-full',narrow?'w-90':'w-full')}/></div>
            <p className="text-xs text-muted-foreground break-words"><code>{section.id} / {state}</code> · Дані лише в пам’яті цього зразка</p>
          </section>)}
        </div>
        {section.modules.length>0&&<div className="border-t pt-5 space-y-2"><h2 className="text-sm font-semibold">Джерело компонентів</h2><div className="flex flex-wrap gap-2">{section.modules.map(module=><code key={module} className="text-xs text-muted-foreground rounded-md bg-muted px-2 py-1 break-all">@/app/components/{module}</code>)}</div></div>}
        <footer className="border-t pt-5 pb-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-3"><span>Zapad Banka · Independent portfolio concept</span><span>Ілюстративні дані. Жодних реальних банківських операцій.</span></footer>
      </main>
    </div>
  </div>;
}
createRoot(document.getElementById('root')!).render(<I18nProvider><GalleryApp/></I18nProvider>);
