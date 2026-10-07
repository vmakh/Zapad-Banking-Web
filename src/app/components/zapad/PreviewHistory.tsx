import { useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { getPreviews, resolvePreview } from "../../utils/paymentPreview";
import type { ProfileKind } from "../../data/types";
import { cn } from "../ui/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { downloadFile } from "../../utils/exportFiles";
import { toast } from "sonner";

export function PreviewHistory({kind, accountId=""}:{kind:ProfileKind;accountId?:string}) {
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const [params,setParams] = useSearchParams();
  const [revision,setRevision] = useState(0);
  const [search,setSearch] = useState("");
  const [actor,setActor] = useState("Demo Corp DOO");
  const [reason,setReason] = useState("");
  const {isPrivate} = usePrivacy();
  const records=getPreviews(kind);
  const selected=records.find(r=>r.id===params.get("preview"));
  const visibleRecords=records.filter(r=>(!accountId||r.sourceId===accountId||r.destinationId===accountId)&&`${r.recipient} ${r.id} ${r.note} ${r.amount}`.toLowerCase().includes(search.toLowerCase()));
  const closePreview=()=>setParams(previous=>{const next=new URLSearchParams(previous);next.delete("preview");return next;},{replace:true});
  const amount=(value:number,currency:string)=>isPrivate?"•••":formatMoney(value,currency);
  const update=(action:"check"|"approve"|"reject")=>{
    if(!selected)return;
    try{resolvePreview(kind,selected.id,action,actor,reason);setRevision(revision+1);setReason("");}catch(e){toast.error((e as Error).message);}
  };
  return <section className="rounded-xl border border-border bg-card p-6 space-y-4" aria-label="Local preview history">
    <div><h2 className="text-xl font-semibold">Local previews</h2><p className="text-sm text-muted-foreground mt-1">Saved on this device. These are not bank transactions and do not change balances or spending analytics.</p></div>
    <Input aria-label="Search local previews" placeholder="Search recipient, amount or reference" value={search} onChange={e=>setSearch(e.target.value)}/>
    {visibleRecords.map(r=><Button key={r.id} variant="ghost" className={cn("w-full h-auto min-h-14 flex-wrap justify-between text-left whitespace-normal gap-3", selected?.id===r.id && "bg-accent text-accent-foreground")} aria-haspopup="dialog" aria-expanded={selected?.id===r.id} onClick={event=>{lastTrigger.current=event.currentTarget;setReason("");setParams(previous=>{const next=new URLSearchParams(previous);next.set("preview",r.id);return next;},{replace:true});}}><span className="min-w-0 break-words">{r.title} · {r.recipient}<small className="block text-muted-foreground">{r.status} · {new Date(r.createdAt).toLocaleString()}</small></span><span>{amount(r.total,r.currency)}</span></Button>)}
    {records.length > 0 && !visibleRecords.length && <p role="status" className="text-sm text-muted-foreground">No previews match this account or search.</p>}
    {!records.length && <p className="text-sm text-muted-foreground">No previews yet. Confirm a demo transfer to keep its reference here.</p>}
    {params.has("preview") && !selected && <p role="status">This preview is unavailable on this device or belongs to another profile.</p>}
    <Sheet open={!!selected} onOpenChange={open=>{if(!open)closePreview();}}>
     <SheetContent className="w-full sm:max-w-lg overflow-y-auto" onCloseAutoFocus={event=>{if(lastTrigger.current?.isConnected){event.preventDefault();lastTrigger.current.focus();}}}>
      {selected && <>
      <SheetHeader className="p-6 pr-12 border-b border-border">
       <SheetTitle>{selected.title} · {selected.status}</SheetTitle>
       <SheetDescription>Local preview only. No money was moved and balances are unchanged.</SheetDescription>
      </SheetHeader>
      <div className="px-6 pb-6 space-y-4">
      <dl className="text-sm space-y-3">{[["Reference",selected.id],["From",selected.source],["To",`${selected.recipient} · ${selected.iban}`],["Amount",amount(selected.amount,selected.currency)],["Demo fee",amount(selected.fee,selected.currency)],["Total debit preview",amount(selected.total,selected.currency)],["Recipient gets",amount(selected.received,selected.targetCurrency)],["Note",selected.note||"None"],["Initiator",selected.initiator]].map(([label,value])=><div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{label}</dt><dd className="min-w-0 max-w-full break-words">{isPrivate && ["From","To"].includes(label)?"Details hidden":value}</dd></div>)}</dl>
      <ol className="space-y-2 text-sm text-muted-foreground" aria-label="Preview event log">{selected.events.map((event,i)=><li key={i}>{event}</li>)}</ol>
      {selected.status==="Status unknown" && <><p>Do not create another transfer. Check the stored intent using this reference.</p><Button onClick={()=>update("check")}>Check existing status</Button></>}
      {selected.status==="Awaiting approval" && <div className="space-y-3"><p className="text-sm">Demo policy: a separate reviewer must decide. Approval saves a decision only; no payment is released. Changes require a new reviewed preview.</p><Select value={actor} onValueChange={setActor}><SelectTrigger aria-label="Demo reviewer role"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Demo Corp DOO">Initiator · Demo Corp DOO</SelectItem><SelectItem value="Demo finance reviewer">Demo finance reviewer</SelectItem></SelectContent></Select><Textarea aria-label="Rejection reason" placeholder="Reason required for rejection" maxLength={500} value={reason} onChange={e=>setReason(e.target.value)}/><div className="flex flex-wrap gap-3"><Button disabled={actor===selected.initiator} onClick={()=>update("approve")}>Approve preview</Button><Button variant="outline" disabled={actor===selected.initiator||!reason.trim()} onClick={()=>update("reject")}>Reject with reason</Button></div></div>}
      <Button variant="outline" disabled={isPrivate} onClick={()=>downloadFile(`${selected.id}-preview.txt`,`ZapadBanka LOCAL PREVIEW — NOT PROOF OF PAYMENT\n${JSON.stringify(selected,null,2)}`,"text/plain;charset=utf-8")}>Download preview record</Button>
      </div>
      </>}
     </SheetContent>
    </Sheet>
  </section>;
}
