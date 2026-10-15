import { FieldFeedback } from "../ui/field-feedback";
import { normalizeDecimalInput } from "../../utils/decimalInput";
import { useI18n } from "../../i18n/I18nProvider";
import { CurrencyFlag } from "./CurrencyIcon";
import { useState, useRef, useEffect, useId } from "react";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getAccounts } from "../../data/accounts";
import { useAppProfile } from "../../hooks/useAppProfile";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { validMoney } from "../../utils/goalRules";
import { savePreview, type PreviewRecord } from "../../utils/paymentPreview";
import { formatMoney } from "../../utils/format";
import { profilePath } from "../../utils/paths";

type ProductOption = {name:string; min?:number; description?:string};
export function ProductPreviewDialog({open,onClose,title,options,maximum=100000000,initialAmount="",savings,direction="deposit",explanation,details}:{open:boolean;onClose:()=>void;title:string;options:ProductOption[];maximum?:number;initialAmount?:string;savings?:string;direction?:"deposit"|"withdraw";explanation:string;details?:(amount:number)=>Array<[string,string]>}) {
  const { t } = useI18n();
  const {profile,profileSlug}=useAppProfile();
  const {isPrivate}=usePrivacy();
  const accounts=getAccounts(profile.kind).filter(a=>a.currency==="EUR");
  const savingsAccount=accounts.find(a=>a.name===savings);
  const selectable=accounts.filter(a=>a.id!==savingsAccount?.id);
  const [accountId,setAccountId]=useState(selectable[0]?.id ?? "");
  const [product,setProduct]=useState(options[0]?.name ?? "");
  const [amount,setAmount]=useState(initialAmount);
  const [step,setStep]=useState("form");
  const [error,setError]=useState("");
  const [record,setRecord]=useState<PreviewRecord|null>(null);
  const [intent]=useState(()=>crypto.randomUUID());
  const lock=useRef(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const body=useRef<HTMLDivElement>(null);
  const amountErrorId=useId();
  useEffect(()=>{body.current?.scrollTo(0,0);heading.current?.focus();},[step]);
  const counterpart=selectable.find(a=>a.id===accountId);
  const source=savings && direction==="withdraw"?savingsAccount:counterpart;
  const destination=savings ? direction==="withdraw"?counterpart:savingsAccount : undefined;
  const selected=options.find(o=>o.name===product);
  const valid=validMoney(amount)&&!!source&&!!selected&&Number(amount)>=Math.max(.01,selected.min ?? .01)&&Number(amount)<=Math.min(maximum,source.balance)&&(!savings||!!destination);
  const confirm=()=>{if(!valid||lock.current)return;lock.current=true;try{
    setRecord(savePreview({id:intent,kind:profile.kind,createdAt:new Date().toISOString(),title,sourceId:source!.id,destinationId:destination?.id,source:`${source!.name} · ${source!.iban}`,recipient:destination?.name??product,iban:destination?.iban??"Product preview",amount:Number(amount),currency:"EUR",fee:0,total:Number(amount),received:Number(amount),targetCurrency:"EUR",note:explanation,status:"Preview saved",initiator:profile.name,events:["Product terms reviewed. Local preview only; balances, loan principal and holdings unchanged."]}));setStep("result");
  }catch(e){setError((e as Error).message);lock.current=false;}};
  return <Dialog open={open} onOpenChange={v=>!v&&onClose()}><DialogContent className="bank-transfer-dialog sm:max-w-lg p-0 gap-0 overflow-hidden"><DialogHeader className="p-6 pr-14 border-b border-border"><DialogTitle ref={heading} tabIndex={-1}>{step==="result"?t("Preview saved"):step==="review"?t("Review {title}", { title: t(title) }):t(title)}</DialogTitle><DialogDescription>{t("{profile} · Local preview, no real transaction", { profile: profile.name })}</DialogDescription></DialogHeader><div ref={body} data-form-fields className="bank-transfer-body p-6 space-y-6">
    {step==="form" && <>{options.length>1&&<label className="block space-y-2"><span>{t("Product")}</span><Select value={product} onValueChange={setProduct}><SelectTrigger aria-label={t("Product")}><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o.name} value={o.name}>{t(o.name)}</SelectItem>)}</SelectContent></Select></label>}<label className="block space-y-2"><span>{t(savings&&direction==="withdraw"?"Receive into":"Pay from")}</span><Select value={accountId} onValueChange={setAccountId}><SelectTrigger aria-label={t(savings&&direction==="withdraw"?"Receive into":"Pay from")}><SelectValue/></SelectTrigger><SelectContent>{selectable.map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{t(a.name)} · {isPrivate?"•••":formatMoney(a.balance,"EUR")}</SelectItem>)}</SelectContent></Select></label>{savings&&<p className="text-sm">{t(direction==="withdraw"?"From":"To")}: {savingsAccount ? t(savingsAccount.name) : ""} · {savingsAccount?.ibanShort}</p>}<label className="block space-y-2"><span>{t("Amount · EUR")}</span><Input aria-label={t("Preview amount")} aria-invalid={!!amount&&!valid} aria-describedby={amount&&!valid?amountErrorId:undefined} inputMode="decimal" value={amount} onChange={e=>setAmount(normalizeDecimalInput(e.target.value))}/></label>{amount&&!valid&&<FieldFeedback tone="error" id={amountErrorId} role="alert" className="text-sm text-destructive">{selected?.min ? t("Enter an amount within the product limits and available source balance (minimum {minimum}).", { minimum: formatMoney(selected.min) }) : t("Enter an amount within the product limits and available source balance.")}</FieldFeedback>}</>}
    {step==="review" && <dl className="space-y-3 text-sm">{[["Product",t(product)],["From",`${source ? t(source.name) : ""} · ${source?.iban}`],["To",destination?`${t(destination.name)} · ${destination.iban}`:t(product)],["Amount",formatMoney(Number(amount))],...(details?.(Number(amount))??[]),["Demo fee", t("{amount} · actual product fees not quoted", { amount: formatMoney(0) })],["Total preview",formatMoney(Number(amount))],["Execution", t("Not submitted or scheduled")]].map(([label,value])=><div key={label} className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4"><dt className="min-w-0 text-muted-foreground">{t(label)}</dt><dd className="min-w-0 wrap-anywhere sm:text-right tabular-nums">{value}</dd></div>)}</dl>}
    {step!=="result"&&<p className="text-sm text-muted-foreground">{selected?.description ? t(selected.description) : ""} {t(explanation)} {t("Confirming saves a local preview only. No funds move.")}</p>}
    {record&&<><p role="status">{t("Saved on this device. No payment or order was submitted; balances and holdings are unchanged.")}</p><p className="text-sm break-all">{t("Reference: {reference}", { reference: record.id })}</p><Button variant="outline" asChild><Link to={profilePath(profileSlug,`transactions?preview=${record.id}`)}>{t("View in Activity")}</Link></Button></>}
    {error&&<FieldFeedback tone="error" role="alert" className="text-destructive">{t(error)}</FieldFeedback>}
  </div><div className="bank-transfer-footer p-6 border-t border-border flex flex-col sm:flex-row gap-3">{step==="review"&&<Button variant="outline" className="h-auto min-h-11 whitespace-normal" onClick={()=>setStep("form")}>{t("Edit details")}</Button>}<Button className="flex-1 h-auto min-h-11 whitespace-normal" disabled={step!=="result"&&!valid} onClick={()=>{if(step==="result")onClose();else if(step==="form")setStep("review");else confirm();}}>{t(step==="result"?"Done":step==="review"?"Confirm local preview":"Review details")}</Button></div></DialogContent></Dialog>;
}
