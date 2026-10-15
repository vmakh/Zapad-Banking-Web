import { Badge } from "../ui/badge";
import { dateFormatter } from "../../utils/localeFormats";
import { localizedMerchant } from "../../i18n/display";
import { useI18n } from "../../i18n/I18nProvider";
import { useState, useRef } from "react";
import { CaretDownIcon as ChevronDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";
import { useSearchParams } from "react-router";
import { getPreviews, resolvePreview, type PreviewRecord } from "../../utils/paymentPreview";
import { getAccounts } from "../../data/accounts";
import type { ProfileKind } from "../../data/types";
import { cn } from "../ui/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatNumber, formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { downloadFile } from "../../utils/exportFiles";
import { toast } from "sonner";

export function PreviewHistory({kind, accountId=""}:{kind:ProfileKind;accountId?:string}) {
  const { t, intlLocale } = useI18n();
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const [params,setParams] = useSearchParams();
  const [expanded,setExpanded] = useState(false);
  const disclosure = useRef<HTMLButtonElement | null>(null);
  const [revision,setRevision] = useState(0);
  const [search,setSearch] = useState("");
  const [actor,setActor] = useState("Demo Corp DOO");
  const [reason,setReason] = useState("");
  const {isPrivate} = usePrivacy();
  const records=getPreviews(kind);
  const accounts=getAccounts(kind);
  const previewSource=(record: PreviewRecord)=>{
    const account=accounts.find(item=>item.id===record.sourceId);
    return account ? `${t(account.name)} · ${account.iban}` : record.source;
  };
  const previewRecipient=(record: PreviewRecord)=>{
    const account=accounts.find(item=>item.id===record.destinationId);
    return account ? t(account.name) : record.title === "Bills" ? t("Utility bills") : ["Investment", "Loan payment", "Fixed deposit"].includes(record.title) ? t(record.recipient) : record.title === "Invoice approval" ? localizedMerchant(record.recipient) : record.recipient;
  };
  const previewNote=(record: PreviewRecord)=>{
    if (record.title === "Currency exchange") {
      const rate = /^Illustrative rate (\d+(?:\.\d+)?). Not a live quote\.$/.exec(record.note);
      if (rate) return t("Illustrative rate {rate}. Not a live quote.", { rate: formatNumber(Number(rate[1]), { maximumFractionDigits: 4 }) });
    }
    if (["Savings deposit", "Savings withdrawal", "Fixed deposit", "Loan payment", "Investment", "Invoice approval"].includes(record.title)) return t(record.note);
    if (record.title === "Bills") return record.note.split("; ").map(bill => {
      const match = /^(.*): (\d+(?:\.\d+)?)$/.exec(bill);
      return match ? `${t(match[1])}: ${formatMoney(Number(match[2]))}` : bill;
    }).join("; ");
    return record.note;
  };
  const previewEvent=(event: string)=>{
    const decision=event.match(/^(Approved preview|Rejected preview) by (.*?)(?:: (.*))?\. No payment released\.$/);
    if (!decision) return t(event);
    const reviewer=decision[2] === "Demo finance reviewer" ? t("Demo finance reviewer") : decision[2];
    return decision[3]
      ? t("{status} by {reviewer}: {reason}. No payment released.", { status: t(decision[1]), reviewer, reason: decision[3] })
      : t("{status} by {reviewer}. No payment released.", { status: t(decision[1]), reviewer });
  };
  const selected=records.find(r=>r.id===params.get("preview"));
  const visibleRecords=records.filter(r=>(!accountId||r.sourceId===accountId||r.destinationId===accountId)&&`${previewRecipient(r)} ${t(r.title)} ${t(r.status)} ${r.id} ${previewNote(r)} ${r.amount} ${formatMoney(r.amount,r.currency)}`.toLowerCase().includes(search.toLowerCase()));
  const closePreview=()=>setParams(previous=>{const next=new URLSearchParams(previous);next.delete("preview");return next;},{replace:true});
  const amount=(value:number,currency:string)=>isPrivate?"•••":formatMoney(value,currency);
  const downloadPreview=()=>{
    if (!selected) return;
    const rows = [["Reference", selected.id], ["Product", t(selected.title)], ["Status", t(selected.status)],
      ["From", previewSource(selected)], ["To", `${previewRecipient(selected)} · ${t(selected.iban)}`],
      ["Amount", formatMoney(selected.amount, selected.currency)], ["Demo fee", formatMoney(selected.fee, selected.currency)],
      ["Total debit preview", formatMoney(selected.total, selected.currency)], ["Recipient gets", formatMoney(selected.received, selected.targetCurrency)],
      ["Note", previewNote(selected) || t("None")], ["Initiator", selected.initiator === "Demo accounts payable" ? t(selected.initiator) : selected.initiator]];
    const text = [t("ZapadBanka LOCAL PREVIEW — NOT PROOF OF PAYMENT"), dateFormatter({ year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date(selected.createdAt)),
      ...rows.map(([label, value]) => `${t(label)}: ${value}`), "", t("Preview event log"), ...selected.events.map(previewEvent)].join("\n");
    downloadFile(`${selected.id}-preview.txt`, text, "text/plain;charset=utf-8");
  };
  const update=(action:"check"|"approve"|"reject")=>{
    if(!selected)return;
    try{resolvePreview(kind,selected.id,action,actor,reason);setRevision(revision+1);setReason("");}catch(e){toast.error(t((e as Error).message));}
  };
  return <section className="rounded-xl border border-border bg-card p-4" aria-label={t("Local preview history")}>
    <Collapsible open={expanded || params.has("preview")} onOpenChange={setExpanded}>
    <h2><CollapsibleTrigger ref={disclosure} className={cn(buttonVariants({ variant: "ghost" }), "w-full h-auto min-h-11 justify-between gap-3 whitespace-normal text-left")}><span className="text-lg font-semibold">{t("Local previews")} <span className="text-sm font-normal text-muted-foreground">({records.length})</span></span><ChevronDown aria-hidden="true" className={cn("size-4 shrink-0", (expanded || params.has("preview")) && "rotate-180")} /></CollapsibleTrigger></h2>
    <CollapsibleContent className="space-y-3 pt-3">
    <p className="text-sm text-muted-foreground">{t("Saved on this device. These are not bank transactions and do not change balances or spending analytics.")}</p>
    <Input aria-label={t("Search local previews")} placeholder={t("Search recipient, amount or reference")} value={search} onChange={e=>setSearch(e.target.value)}/>
    {visibleRecords.map(r=><Button key={r.id} variant="ghost" className={cn("w-full h-auto min-h-14 flex-wrap justify-between text-left whitespace-normal gap-3", selected?.id===r.id && "bg-accent text-accent-foreground")} aria-haspopup="dialog" aria-expanded={selected?.id===r.id} onClick={event=>{lastTrigger.current=event.currentTarget;setReason("");setParams(previous=>{const next=new URLSearchParams(previous);next.set("preview",r.id);return next;},{replace:true});}}><span className="min-w-0 break-words">{t(r.title)} · {previewRecipient(r)}<span className="mt-2 flex flex-wrap items-center gap-2"><Badge tone={r.status==="Rejected preview"?"danger":r.status==="Approved preview"?"success":r.status==="Awaiting approval"?"attention":r.status==="Status unknown"?"warning":"neutral"}>{t(r.status)}</Badge><small className="text-muted-foreground">{dateFormatter({ year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date(r.createdAt))}</small></span></span><span>{amount(r.total,r.currency)}</span></Button>)}
    {records.length > 0 && !visibleRecords.length && <p role="status" className="text-sm text-muted-foreground">{t("No previews match this account or search.")}</p>}
    {!records.length && <p className="text-sm text-muted-foreground">{t("No previews yet. Confirm a demo transfer to keep its reference here.")}</p>}
    {params.has("preview") && !selected && <p role="status">{t("This preview is unavailable on this device or belongs to another profile.")}</p>}
    </CollapsibleContent>
    </Collapsible>
    <Sheet open={!!selected} onOpenChange={open=>{if(!open)closePreview();}}>
     <SheetContent className="w-full sm:max-w-lg overflow-y-auto" onCloseAutoFocus={event=>{const trigger = lastTrigger.current?.isConnected ? lastTrigger.current : disclosure.current; if(trigger){event.preventDefault();trigger.focus();}}}>
      {selected && <>
      <SheetHeader className="p-6 pr-12 border-b border-border">
       <SheetTitle>{t(selected.title)} · {t(selected.status)}</SheetTitle>
       <SheetDescription>{t("Local preview only. No money was moved and balances are unchanged.")}</SheetDescription>
      </SheetHeader>
      <div className="px-6 pb-6 space-y-4">
      <dl className="text-sm space-y-3">{[["Reference",selected.id],["From",previewSource(selected)],["To",`${previewRecipient(selected)} · ${t(selected.iban)}`],["Amount",amount(selected.amount,selected.currency)],["Demo fee",amount(selected.fee,selected.currency)],["Total debit preview",amount(selected.total,selected.currency)],["Recipient gets",amount(selected.received,selected.targetCurrency)],["Note",previewNote(selected)||t("None")],["Initiator",selected.initiator === "Demo accounts payable" ? t(selected.initiator) : selected.initiator]].map(([label,value])=><div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{t(label)}</dt><dd className="min-w-0 max-w-full break-words">{isPrivate && ["From","To"].includes(label)?t("Details hidden"):value}</dd></div>)}</dl>
      <ol className="space-y-2 text-sm text-muted-foreground" aria-label={t("Preview event log")}>{selected.events.map((event,i)=><li key={i}>{previewEvent(event)}</li>)}</ol>
      {selected.status==="Status unknown" && <><p>{t("Do not create another transfer. Check the stored intent using this reference.")}</p><Button onClick={()=>update("check")}>{t("Check existing status")}</Button></>}
      {selected.status==="Awaiting approval" && <div className="space-y-3"><p className="text-sm">{t("Demo policy: a separate reviewer must decide. Approval saves a decision only; no payment is released. Changes require a new reviewed preview.")}</p><Select value={actor} onValueChange={setActor}><SelectTrigger aria-label={t("Demo reviewer role")}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Demo Corp DOO">{t("Initiator · Demo Corp DOO")}</SelectItem><SelectItem value="Demo finance reviewer">{t("Demo finance reviewer")}</SelectItem></SelectContent></Select><Textarea aria-label={t("Rejection reason")} placeholder={t("Reason required for rejection")} maxLength={500} value={reason} onChange={e=>setReason(e.target.value)}/><div className="flex flex-wrap gap-3"><Button disabled={actor===selected.initiator} onClick={()=>update("approve")}>{t("Approve preview")}</Button><Button variant="outline" disabled={actor===selected.initiator||!reason.trim()} onClick={()=>update("reject")}>{t("Reject with reason")}</Button></div></div>}
      <Button variant="outline" disabled={isPrivate} onClick={downloadPreview}>{t("Download preview record")}</Button>
      </div>
      </>}
     </SheetContent>
    </Sheet>
  </section>;
}
