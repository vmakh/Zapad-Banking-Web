import { getTransferRecovery } from "../../utils/transferRecovery";
import { normalizeDecimalInput } from "../../utils/decimalInput";
import { CurrencyFlag } from "./CurrencyIcon";
import { validMoney } from "../../utils/goalRules";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../ui/utils";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppProfile } from "../../hooks/useAppProfile";
import { getRecipients, saveRecipient } from "../../data/recipients";
import { getAccounts } from "../../data/accounts";
import type { Recipient } from "../../data/types";
import { formatMoney } from "../../utils/format";
import { paymentQuote, canReviewPayment } from "../../utils/paymentQuote";
import { ibanError, normalizeIban, savePreview, resolvePreview, type PreviewRecord } from "../../utils/paymentPreview";
import { readDemo, writeDemo } from "../../utils/demoStorage";
import { profilePath } from "../../utils/paths";
import { toast } from "sonner";
import { transferDraftStep, type TransferDraft as Draft } from "../../utils/transferDraft";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; initialRecipient?: string; initialSource?: string; type?: "send" | "transfer" | "pay" }
export function TransferModal(props: Props) {
  const { profileSlug } = useAppProfile();
  if (props.open && props.type === "pay") return <BillsDraft key={profileSlug} {...props} />;
  return props.open ? <TransferDraft key={`${profileSlug}-${props.type}-${props.initialRecipient ?? ""}`} {...props} /> : null;
}
function TransferDraft({ open, onOpenChange, initialRecipient = "", initialSource, type = "send" }: Props) {
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { isPrivate } = usePrivacy();
  const accounts = getAccounts(profile.kind);
  const recipients = getRecipients(profile.kind);
  const own = type === "transfer";
  const draftKey = `draft:${profile.kind}:${type}`;
  const [recovery] = useState(() => getTransferRecovery(profile.kind, type));
  const intent = useRef(recovery.draft?.intentId ?? crypto.randomUUID());
  const blank: Draft = {intentId: intent.current, recipientId: initialRecipient, sourceId: accounts.find(a=>a.id===initialSource)?.id ?? accounts[0].id, destinationId:"",amount:"",note:"",name:"",iban:"",currency:"EUR",save:false};
  const [draft, setDraft] = useState<Draft>(blank);
  const [savedDraft, setSavedDraft] = useState<Draft | null>(recovery.record ? null : recovery.draft);
  const [step, setStep] = useState(recovery.record ? "result" : own || recipients.some(r=>r.id===initialRecipient) ? "amount" : initialRecipient === "new" ? "new" : "recipient");
  const [search, setSearch] = useState("");
  const [scenario, setScenario] = useState("normal");
  const [record, setRecord] = useState<PreviewRecord | null>(recovery.record);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (recovery.record && !writeDemo(draftKey, null)) setError("Your existing preview was recovered. The old draft could not be cleared; no duplicate was created.");
  }, [recovery, draftKey]);
  useEffect(() => { heading.current?.focus(); }, [step, savedDraft]);
  useEffect(() => {
    if (!savedDraft && !record && (draft.amount || draft.name || draft.iban || draft.note)) {
      if (!writeDemo(draftKey,draft)) setError("Could not autosave on this device. Keep the dialog open to preserve your entries.");
    }
  }, [draft,draftKey,record,savedDraft]);
  const change = (patch: Partial<Draft>) => { setDraft(d=>({...d,...patch})); setError(""); };
  const selectedSource = accounts.find(a=>a.id===draft.sourceId);
  const source = selectedSource ?? accounts[0];
  const newRecipient: Recipient = {id:`custom-${normalizeIban(draft.iban)}`, name:draft.name.trim(), iban:normalizeIban(draft.iban), currency:draft.currency, initials:draft.name.trim().slice(0,2).toUpperCase(),color:"bg-muted text-muted-foreground",bank:"Not verified",lastSent:""};
  const recipient = draft.recipientId === "new" ? newRecipient : recipients.find(r=>r.id===draft.recipientId);
  const destination = accounts.find(a=>a.id===draft.destinationId);
  const target = own ? destination : recipient;
  const quote = paymentQuote(Number(draft.amount),source.currency,target?.currency ?? source.currency,own);
  const valid = canReviewPayment(draft.amount,selectedSource,target,own) && (draft.recipientId !== "new" || (!ibanError(draft.iban) && !!draft.name.trim()));
  const duplicate = recipients.find(r=>normalizeIban(r.iban)===normalizeIban(draft.iban));
  const newError = ibanError(draft.iban);
  const close = (value: boolean) => {
    if (!value && !savedDraft && !record && (draft.amount || draft.name || draft.iban || draft.note)) {
      if (!writeDemo(draftKey,draft)) { setError("Could not save your draft. Keep this dialog open or discard it explicitly."); return; }
      toast.info("Draft saved on this device");
    }
    onOpenChange(value);
  };
  const confirm = () => {
    if (!valid || locked.current) return;
    locked.current = true;
    try {
      if (!writeDemo(draftKey, { ...draft, intentId: intent.current })) throw new Error("Could not save the recovery reference. No preview was created; try again.");
      const created = savePreview({id:intent.current,kind:profile.kind,createdAt:new Date().toISOString(),title:own?"Between accounts":"Transfer",sourceId:source.id,destinationId:own?destination?.id:undefined,source:`${source.name} · ${source.iban}`,recipient:target?.name ?? "",iban:target?.iban ?? "",amount:Number(draft.amount),currency:source.currency,fee:quote.fee,total:quote.total,received:quote.received,targetCurrency:target!.currency,note:draft.note,status:scenario==="unknown"?"Status unknown":isBusiness?"Awaiting approval":"Preview saved",initiator:profile.name,events:["Review confirmed locally. No bank request sent; balances unchanged."]});
      setRecord(created); setStep("result");
      if (!writeDemo(draftKey,null)) setError("Preview saved, but the draft could not be cleared. Reopening will recover this same reference.");
      if (draft.save && draft.recipientId === "new") {
        try { saveRecipient(profile.kind,newRecipient); } catch { toast.error("Preview saved, but the recipient could not be saved."); }
      }
    } catch (e) { setError((e as Error).message); locked.current=false; }
  };
  const pricing = <><SummaryRow label="Recipient gets" value={formatMoney(quote.received,target?.currency)} />{source.currency!==target?.currency && <SummaryRow label="Illustrative rate" value={`1 ${source.currency} = ${quote.rate.toFixed(4)} ${target?.currency}`} />}<SummaryRow label="Demo fee" value={formatMoney(quote.fee,source.currency)} /><SummaryRow label="Total debit preview" value={formatMoney(quote.total,source.currency)} bold /><SummaryRow label="Delivery" value="Not scheduled · local preview only" /></>;
  return <Dialog open={open} onOpenChange={close}><DialogContent className="bank-transfer-dialog sm:max-w-lg p-0 gap-0 overflow-hidden">
    <DialogHeader className="p-6 pr-14 border-b border-border"><DialogTitle ref={heading} tabIndex={-1}>{savedDraft?"Continue your draft?":step==="result"?record?.status:step==="review"?"Review transfer":step==="new"?"New recipient":own?"Between accounts":"Send money"}</DialogTitle><DialogDescription>{profile.name} · Local prototype · No real money moves</DialogDescription></DialogHeader>
    <div className="bank-transfer-body p-6 space-y-5">
      {savedDraft && <div className="space-y-4"><p className="text-sm text-muted-foreground">You have an unfinished transfer for this profile. Resume it, or discard it to start a new transfer. Closing this dialog keeps your saved draft.</p><div className="flex flex-wrap gap-3"><Button onClick={()=>{setDraft({...blank,...savedDraft});setStep(transferDraftStep(savedDraft,own,recipients.map(r=>r.id)));setSavedDraft(null);setError("");}}>Resume draft</Button><Button variant="outline" onClick={()=>{if(writeDemo(draftKey,null)){setSavedDraft(null);setError("");}else setError("Could not discard the saved draft.");}}>Discard saved draft</Button></div></div>}
      {!savedDraft && <>
      {step==="recipient" && <><Button variant="outline" className="w-full" onClick={()=>setStep("new")}><Plus className="size-4"/>New recipient by IBAN</Button><Input aria-label="Search recipients" placeholder="Search name or IBAN" value={search} onChange={e=>setSearch(e.target.value)}/><div className="divide-y divide-border">{recipients.filter(r=>`${r.name} ${normalizeIban(r.iban)}`.toLowerCase().includes(search.replace(/\s/g, "").toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())).map(r=><button key={r.id} className="flex items-center gap-3 w-full text-left py-4" onClick={()=>{change({recipientId:r.id});setStep("amount");}}><span className="flex-1 min-w-0"><strong className="block break-words">{r.name}</strong><small className="text-muted-foreground">{r.currency} · {r.iban.slice(-7)}</small></span><ChevronRight className="size-5"/></button>)}</div><p className="text-xs text-muted-foreground">Can't find someone? Use New recipient by IBAN.</p></>}
      {step==="new" && <><label className="block space-y-2"><span>Recipient name</span><Input autoComplete="off" maxLength={120} value={draft.name} onChange={e=>change({name:e.target.value})}/></label><label className="block space-y-2"><span>IBAN</span><Input value={draft.iban} onChange={e=>change({iban:e.target.value})} onBlur={()=>change({iban:normalizeIban(draft.iban)})} aria-invalid={!!draft.iban && !!newError} aria-describedby="iban-feedback" maxLength={48}/></label><p id="iban-feedback" className="text-sm text-muted-foreground">{draft.iban ? newError || "IBAN format and check digits are valid. Recipient identity has not been verified." : "Spaces and lowercase letters are accepted. Use demo details, not personal data."}</p>{duplicate && <p role="status" className="text-sm">Already saved as {duplicate.name}. Continuing uses that recipient.</p>}<label className="block space-y-2"><span>Receiving currency</span><Select value={draft.currency} onValueChange={v=>change({currency:v})}><SelectTrigger aria-label="Receiving currency"><SelectValue/></SelectTrigger><SelectContent>{["EUR","USD","GBP"].map(c=><SelectItem key={c} value={c}><CurrencyFlag currency={c} />{c}</SelectItem>)}</SelectContent></Select></label><label className="flex gap-3 items-center text-sm"><input type="checkbox" checked={draft.save} onChange={e=>change({save:e.target.checked})}/>Save recipient on this device after confirmation</label><div className="flex gap-3"><Button variant="outline" onClick={()=>setStep("recipient")}>Back</Button><Button disabled={!draft.name.trim() || !!newError} onClick={()=>{change({recipientId:duplicate?.id ?? "new"});setStep("amount");}}>Continue to amount</Button></div></>}
      {step==="amount" && <>
        {!own && <div className="flex items-center justify-between gap-3"><span className="min-w-0 break-words">{recipient?.name}<small className="block text-muted-foreground">{recipient?.iban}</small></span><Button variant="ghost" onClick={()=>setStep("recipient")}>Change</Button></div>}
        <label className="block space-y-2"><span>From account</span><Select value={selectedSource?.id ?? ""} onValueChange={v=>change({sourceId:v,destinationId:""})}><SelectTrigger aria-label="From account"><SelectValue placeholder="Choose an account">{selectedSource && <><CurrencyFlag currency={selectedSource.currency}/>{selectedSource.name} · {selectedSource.currency}</>}</SelectValue></SelectTrigger><SelectContent>{accounts.map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{a.name} · {isPrivate?"•••":formatMoney(a.balance,a.currency)}</SelectItem>)}</SelectContent></Select>{selectedSource && <small className="block text-muted-foreground">Available: {isPrivate ? "•••" : formatMoney(selectedSource.balance, selectedSource.currency)}</small>}</label>
        {!selectedSource && <p role="alert" className="text-sm text-destructive">The saved funding account is unavailable. Choose an account to continue; no replacement has been selected.</p>}
        {own && <label className="block space-y-2"><span>To account</span><Select value={draft.destinationId} onValueChange={v=>change({destinationId:v})}><SelectTrigger aria-label="To account"><SelectValue placeholder="Choose an account"/></SelectTrigger><SelectContent>{accounts.filter(a=>a.id!==source.id && a.currency===source.currency).map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{a.name} · {a.currency}</SelectItem>)}</SelectContent></Select><small className="block text-muted-foreground">For different currencies, <Link className="underline" to={profilePath(profileSlug,"exchange")}>open Exchange</Link>.</small></label>}
        <label className="block space-y-2"><span>You send{selectedSource ? ` · ${selectedSource.currency}` : ""}</span><Input aria-label="Transfer amount" type="text" inputMode="decimal" aria-invalid={!!draft.amount && !validMoney(draft.amount)} aria-describedby="transfer-amount-format" value={draft.amount} onChange={e=>change({amount:normalizeDecimalInput(e.target.value)})}/></label>
        <p id="transfer-amount-format" className="text-xs text-muted-foreground">Use a dot or comma for decimals, without thousands separators.</p>
        {draft.amount && !validMoney(draft.amount) && <p role="alert">Enter a positive amount with up to two decimal places.</p>}
        {selectedSource && validMoney(draft.amount) && target && <div className="text-sm">{pricing}</div>}
        {selectedSource && quote.total>source.balance && <p role="alert" className="text-sm text-destructive">Insufficient funds for the amount plus fee.</p>}
        <label className="block space-y-2"><span>Note / reference (optional)</span><Input aria-label="Payment note" maxLength={280} value={draft.note} onChange={e=>change({note:e.target.value})}/></label>
        <p className="text-xs text-muted-foreground">Fees and rates are illustrative test values, not current bank tariffs. No live name verification or bank authorization is connected.</p>
      </>}
      {step==="review" && <><div className="text-sm"><SummaryRow label="From" value={`${source.name} · ${source.iban}`}/><SummaryRow label="To" value={`${target?.name} · ${target?.iban}`}/><SummaryRow label="You send" value={formatMoney(Number(draft.amount),source.currency)}/>{pricing}<SummaryRow label="Reference" value={draft.note || "None"}/></div><p className="text-sm text-muted-foreground">Confirming saves a preview in Activity. Balances stay unchanged. {isBusiness?"Business previews require a separate reviewer; approval does not release a payment.":"No payment is submitted."}</p><details className="text-sm"><summary className="cursor-pointer">Demo recovery scenario</summary><Select value={scenario} onValueChange={setScenario}><SelectTrigger aria-label="Demo recovery scenario" className="mt-3"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="normal">Normal local confirmation</SelectItem><SelectItem value="unknown">Simulate lost response</SelectItem></SelectContent></Select></details></>}
      {step==="result" && record && <div className="space-y-4"><CheckCircle2 className="size-8 text-muted-foreground"/><p role="status">{record.status==="Status unknown"?"The simulated response was lost. Check the existing reference; do not create another transfer.":"Preview saved on this device. No money moved."}</p><SummaryRow label="Reference" value={record.id}/><SummaryRow label="To" value={`${record.recipient} · ${record.iban}`}/><SummaryRow label="Total preview" value={formatMoney(record.total,record.currency)}/>{record.status==="Status unknown" && <Button variant="outline" onClick={()=>{try{setRecord({...resolvePreview(profile.kind,record.id,"check",profile.name)});}catch(e){setError((e as Error).message);}}}>Check existing status</Button>}<Button variant="outline" asChild><Link to={profilePath(profileSlug,`transactions?preview=${record.id}`)}>View in Activity</Link></Button></div>}
      </>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
    {!savedDraft && ["amount","review","result"].includes(step) && <div className="bank-transfer-footer flex flex-wrap gap-3 p-5 border-t border-border">{step!=="result" && <Button variant="outline" onClick={()=>{if(step==="review")setStep("amount");else if(own)close(false);else setStep("recipient");}}>{step==="review"?"Edit details":own?"Save and close":"Back"}</Button>}<Button className="flex-1" disabled={step!=="result" && !valid} onClick={()=>{if(step==="result")onOpenChange(false);else if(step==="amount")setStep("review");else confirm();}}>{step==="result"?"Done":step==="review"?"Confirm local preview":"Review transfer"}</Button></div>}
  </DialogContent></Dialog>;
}
function SummaryRow({label,value,bold=false}:{label:string;value:string;bold?:boolean}) {
  return <div className={cn("flex justify-between gap-4 py-2 border-b border-border text-sm",bold&&"font-semibold")}><span className="text-muted-foreground shrink-0">{label}</span><span className="text-right wrap-anywhere min-w-0">{value}</span></div>;
}
function BillsDraft({open,onOpenChange}: Props) {
  const {profile,isBusiness}=useAppProfile();
  const {isPrivate}=usePrivacy();
  const accounts=getAccounts(profile.kind).filter(a=>a.currency==="EUR");
  const [sourceId,setSourceId]=useState(accounts[0].id);
  const [step,setStep]=useState("bills");
  const [intent]=useState(()=>crypto.randomUUID());
  const [error,setError]=useState("");
  const bills=isBusiness ? [{name:"Office electricity",amount:146.2},{name:"Business internet",amount:80.2},{name:"Office water",amount:38.9}] : [{name:"EPCG electricity",amount:46.2},{name:"Telekom Montenegro",amount:40.2},{name:"Vodovod Budva",amount:18.9}];
  const total=bills.reduce((sum,b)=>sum+b.amount,0);
  const source=accounts.find(a=>a.id===sourceId)!;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="bank-transfer-dialog sm:max-w-lg p-0 gap-0 overflow-hidden">
    <DialogHeader className="p-6 pr-14 border-b border-slate-100"><DialogTitle>{step==="success"?"Demo bills confirmed":step==="review"?"Review bill payment":"Upcoming bills"}</DialogTitle><DialogDescription>{profile.name} · {isBusiness?"Business":"Personal"}</DialogDescription></DialogHeader>
    <div className="bank-transfer-body p-6 space-y-5">{step==="success"?<div className="space-y-3"><p>No money moved. A local bill-payment preview was saved in Activity.</p><p className="text-sm break-all">Reference: {intent}</p><Button variant="outline" asChild><Link to={profilePath(profile.kind,`transactions?preview=${intent}`)}>View in Activity</Link></Button></div>:<>
      <div className="text-sm">{bills.map(b=><SummaryRow key={b.name} label={b.name} value={formatMoney(b.amount,"EUR")}/>)}</div>
      {step==="bills"?<label className="block space-y-2"><span>From account</span><Select value={sourceId} onValueChange={setSourceId}><SelectTrigger aria-label="From account" className="w-full min-h-12 border border-slate-300 rounded-xl px-3"><SelectValue /></SelectTrigger><SelectContent>{accounts.map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{a.name} · {isPrivate ? "•••" : formatMoney(a.balance,"EUR")}</SelectItem>)}</SelectContent></Select></label>:<SummaryRow label="From" value={`${source.name} · ${source.ibanShort}`}/>}
      <div className="text-sm"><SummaryRow label="Fee" value="€0.00"/><SummaryRow label="Total" value={formatMoney(total,"EUR")} bold/></div>
      {total>source.balance&&<p role="alert">Insufficient funds. Choose another account.</p>}
      <p className="text-sm text-slate-500">Review all three bills together. Confirmation is simulated; no payment is scheduled.</p>
    </>}</div>
    {error&&<p role="alert" className="p-5 text-destructive">{error}</p>}<div className="bank-transfer-footer p-5 border-t border-slate-100 flex gap-3">{step==="review"&&<Button variant="outline" className="h-12" onClick={()=>setStep("bills")}>Edit</Button>}<Button className={cn("h-12 flex-1 text-white", isBusiness?"bg-brand-business":"bg-brand-personal")} disabled={step!=="success"&&total>source.balance} onClick={()=>{if(step==="success")onOpenChange(false);else if(total<=source.balance){ if(step==="bills")setStep("review");else try {savePreview({id:intent,kind:profile.kind,createdAt:new Date().toISOString(),title:"Bills",sourceId:source.id,source:`${source.name} · ${source.iban}`,recipient:"Utility bills",iban:"Demo bill references",amount:total,currency:"EUR",fee:0,total,received:total,targetCurrency:"EUR",note:bills.map(b=>`${b.name}: ${b.amount}`).join("; "),status:"Preview saved",initiator:profile.name,events:["All three demo bills reviewed. No payment scheduled or submitted."]});setStep("success");}catch(e){setError((e as Error).message);} }}}>{step==="success"?"Done":step==="review"?"Confirm local preview":"Review all bills"}</Button></div>
  </DialogContent></Dialog>;
}
