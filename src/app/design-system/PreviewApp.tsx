import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter,RouterProvider,Outlet,useParams,useNavigate,useLocation, type RouteObject } from 'react-router';
import { I18nProvider } from '../i18n/I18nProvider';
import { PrivacyProvider } from '../contexts/PrivacyContext';
import { InboxProvider } from '../contexts/InboxContext';
import { getProfileBySlug } from '../data/profiles';
import type { ProfileSlug } from '../data/types';
import type { AppOutletContext } from '../hooks/useAppProfile';
import { RootLayout } from '../components/layout/RootLayout';
import { ProfileRedirect } from '../components/routing/ProfileRedirect';
import { Toaster } from '../components/ui/sonner';
import { Foundations } from './Foundations';
import { Controls } from './Controls';
import { Content } from './Content';
import { Navigation } from './Navigation';
import { Overlays } from './Overlays';
import { Bank } from './Bank';
import { gallerySections } from './catalogue';

class PreviewError extends Component<{children:ReactNode},{error:string}> {
  state={error:''};
  static getDerivedStateFromError(error:Error){return {error:error.message};}
  render(){return this.state.error?<main className="p-6"><h1>Preview could not load</h1><p role="alert">{this.state.error}</p></main>:this.props.children;}
}
function PreviewLayout(){
  const {profile:slug}=useParams();
  const navigate=useNavigate();
  const location=useLocation();
  const profileSlug:ProfileSlug=slug==='business'?'business':'personal';
  const profile=getProfileBySlug(profileSlug);
  const context:AppOutletContext={profile,profileSlug,profileId:profile.id,isBusiness:profile.kind==='business',setProfileSlug:next=>navigate(`/${next}`)};
  return <PrivacyProvider><InboxProvider profileKind={profile.kind}><div className="bank-workspace min-h-screen" data-bank-profile={profileSlug} data-gallery-preview><main className="p-4 sm:p-6"><Outlet context={context}/>{location.pathname!==`/${profileSlug}`&&<p role="status" className="mt-6 text-xs text-muted-foreground">Preview route: {location.pathname}</p>}</main><Toaster/></div></InboxProvider></PrivacyProvider>;
}
const pages:RouteObject[]=[
 {index:true,lazy:async()=>({Component:(await import('../pages/DashboardPage')).DashboardPage})},
 {path:'payments',lazy:async()=>({Component:(await import('../pages/PaymentsPage')).PaymentsPage})},
 {path:'accounts/:accountId?',lazy:async()=>({Component:(await import('../pages/AccountsPage')).AccountsPage})},
 {path:'cards/:cardId?',lazy:async()=>({Component:(await import('../pages/CardsPage')).CardsPage})},
 {path:'exchange',lazy:async()=>({Component:(await import('../pages/ExchangePage')).ExchangePage})},
 {path:'loans',lazy:async()=>({Component:(await import('../pages/LoansPage')).LoansPage})},
 {path:'savings',lazy:async()=>({Component:(await import('../pages/SavingsPage')).SavingsPage})},
 {path:'savings/goals/:goalId',lazy:async()=>({Component:(await import('../pages/SavingsPage')).SavingsPage})},
 {path:'investments',lazy:async()=>({Component:(await import('../pages/InvestmentsPage')).InvestmentsPage})},
 {path:'statements',lazy:async()=>({Component:(await import('../pages/StatementsPage')).StatementsPage})},
 {path:'transactions',lazy:async()=>({Component:(await import('../pages/TransactionsPage')).TransactionsPage})},
 {path:'inbox',lazy:async()=>({Component:(await import('../pages/InboxPage')).InboxPage})},
 {path:'settings',lazy:async()=>({Component:(await import('../pages/SettingsPage')).SettingsPage})},
 {path:'help',lazy:async()=>({Component:(await import('../pages/HelpPage')).HelpPage})},
];
export function renderPreview(sample:string,state:string,profile:ProfileSlug){
  const group=gallerySections.find(entry=>entry.id===sample)?.group;
  function Specimen(){
    const props={sample,state};
    const example=group==='Основи'?<Foundations {...props}/>:group==='Контроли'?<Controls {...props}/>:group==='Вміст'?<Content {...props}/>:group==='Структура'||group==='Навігація'?<Navigation {...props}/>:group==='Меню й попапи'?<Overlays {...props}/>:<Bank {...props}/>;
    return <div data-gallery-sample={sample} data-gallery-state={state}>{example}</div>;
  }
  const full=sample==='app-layout';
  const router=createMemoryRouter(full?[{path:'/',Component:ProfileRedirect},{path:'/:profile',Component:RootLayout,children:pages}]:[{path:'/:profile',Component:PreviewLayout,children:[{index:true,Component:Specimen},{path:'*',Component:Specimen}]}],{initialEntries:[full&&state==='redirect'?'/':`/${profile}${full&&state!=='home'&&state!=='redirect'?`/${state}`:''}`]});
  createRoot(document.getElementById('root')!).render(<PreviewError><I18nProvider><RouterProvider router={router}/>{full&&<Toaster/>}</I18nProvider></PreviewError>);
}
