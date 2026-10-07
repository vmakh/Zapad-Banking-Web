import { cn } from "../components/ui/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Send, Receipt, QrCode, ArrowLeftRight, ArrowDownLeft, ChevronRight } from "lucide-react";
import { useAppProfile } from "../hooks/useAppProfile";
import { getAccounts } from "../data/accounts";
import { getRecipients } from "../data/recipients";
import { TransferModal } from "../components/zapad/TransferModal";
import { ReceiveSheet } from "../components/zapad/ReceiveSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { paymentReturnPath } from "../utils/paymentOrigin";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function PaymentsPage() {
  const [params] = useSearchParams();
  return <PaymentsContent key={params.toString()} />;
}
function PaymentsContent() {
  const { profile, profileSlug } = useAppProfile();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const action = params.get("action");
  const invalidLink = (action && !["send","pay","transfer","receive"].includes(action)) || (params.has("recipient") && params.get("recipient") !== "new" && !getRecipients(profile.kind).some(r => r.id === params.get("recipient"))) || (params.has("source") && !getAccounts(profile.kind).some(a => a.id === params.get("source")));
  const [modalType, setModalType] = useState<"send" | "pay" | "transfer" | null>(!invalidLink && (action === "send" || action === "pay" || action === "transfer") ? action : null);
  const [recipient, setRecipient] = useState(!invalidLink ? params.get("recipient") ?? "" : "");
  const [receive, setReceive] = useState(!invalidLink && action === "receive");
  const [qr, setQr] = useState(false);
  const [search, setSearch] = useState("");
  const start = (type: "send" | "pay" | "transfer", id = "") => { setRecipient(id); setModalType(type); };
  const closePayment = () => {
    setModalType(null);
    setRecipient("");
    setReceive(false);
    const returnPath = !invalidLink ? paymentReturnPath(profileSlug, params, getAccounts(profile.kind).map(a => a.id)) : null;
    if (returnPath) navigate(returnPath, { replace: true });
    else if (params.size) setParams({}, { replace: true });
  };
  const actions = [
    {id:"send",label:"Transfer",copy:"To a new or saved recipient",icon:Send,run:()=>start("send")},
    {id:"pay",label:"Bills",copy:"Utilities, invoices and services",icon:Receipt,run:()=>start("pay")},
    {id:"qr",label:"QR",copy:"Unavailable in this prototype",icon:QrCode,run:()=>setQr(true)},
    {id:"exchange",label:"Exchange",copy:"Between your currency accounts",icon:ArrowLeftRight,run:()=>navigate(profilePath(profileSlug,"exchange"))},
  ];
  const recipients = getRecipients(profile.kind).filter(r=>`${r.name} ${r.iban}`.toLowerCase().includes(search.toLowerCase()));
  return <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-7")}>
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-medium">Payments</h1><p className="text-slate-500 mt-2">{profile.name} · {profile.kind === "business" ? "Business" : "Personal"}</p></div><Button onClick={()=>start("send")}><Send className="size-4" />Transfer</Button></header>
    {invalidLink && <p role="status" className="text-sm text-slate-600">This payment link contains unavailable details. Nothing was opened. Choose an action below to select an account and recipient.</p>}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{actions.filter(a=>a.id!=="send").map(a=><button key={a.id} onClick={a.run} className="payment-choice min-h-20 sm:min-h-36 flex items-center gap-4 sm:block rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-left"><a.icon className="size-5 shrink-0 sm:size-6 sm:mb-4" /><span className="min-w-0"><strong className="block text-base sm:text-lg">{a.label}</strong><span className="block mt-1 text-sm text-slate-600">{a.copy}</span></span></button>)}</div>
    <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={()=>setReceive(true)}><ArrowDownLeft className="size-4"/>Receive money</Button><Button variant="outline" onClick={()=>start("transfer")}><ArrowLeftRight className="size-4"/>Between accounts</Button></div>
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden"><div className="p-5 space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Recipients</h2><Button variant="outline" onClick={()=>start("send","new")}>New recipient</Button></div><Input aria-label="Search recipients" placeholder="Search name or IBAN" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="divide-y divide-slate-100">{recipients.map(r=><button key={r.id} onClick={()=>start("send",r.id)} className="w-full flex gap-4 items-center px-5 py-4 text-left hover:bg-slate-50"><span className={cn("size-11 rounded-full flex items-center justify-center", r.color)}>{r.initials}</span><span className="flex-1"><strong className="block">{r.name}</strong><span className="text-sm text-slate-500">Receives {r.currency} · •••• {r.iban.replace(/\s/g,"").slice(-4)}</span></span><ChevronRight className="size-5"/></button>)}{!recipients.length && <p className="p-8 text-center text-slate-500">No recipients found. Add a new recipient by IBAN.</p>}</div></section>
    <TransferModal open={modalType !== null} type={modalType ?? "send"} initialRecipient={recipient} initialSource={!invalidLink ? params.get("source") ?? undefined : undefined} onOpenChange={open=>{if(!open)closePayment();}}/>
    <ReceiveSheet open={receive} onClose={closePayment} profileKind={profile.kind} initialAccountId={!invalidLink ? params.get("source") ?? undefined : undefined}/>
    <Dialog open={qr} onOpenChange={setQr}><DialogContent><DialogHeader><DialogTitle>QR payment</DialogTitle><DialogDescription>Scanning is not connected in this prototype. No payment details have been read.</DialogDescription></DialogHeader><button className="min-h-12 rounded-xl bg-blue-50 text-blue-700" onClick={()=>{setQr(false);start("send");}}>Choose a recipient instead</button></DialogContent></Dialog>
  </div>;
}
