import { copyText } from "../../utils/clipboard";
import { useNavigate } from "react-router";
import { savePreview } from "../../utils/paymentPreview";
import { getAccounts } from "../../data/accounts";
import { Link } from "react-router";
import { profilePath } from "../../utils/paths";
import { cn } from "../ui/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { Transaction } from "../../data/types";
import { readDemo, writeDemo } from "../../utils/demoStorage";
import { escapeHtml, downloadFile } from "../../utils/exportFiles";
import { formatMoney } from "../../utils/format";
import { Receipt, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function TransactionExtras({transaction:t,business,isPrivate}:{transaction:Transaction;business:boolean;isPrivate:boolean}) {
 const navigate=useNavigate();
 const key=`note:${business?"business":"personal"}:${t.id}`;
 const stored=readDemo<unknown>(key,"");
 const [saved,setSaved]=useState(typeof stored==="string"?stored:"");
 const [note,setNote]=useState(saved);
 const [copied,setCopied]=useState(false);
 const reference=`ZB-${business?"B":"P"}-${t.id.toUpperCase()}`;
 const explanation={Completed:"This transaction is complete in the sample history.",Pending:"Awaiting completion. The final status is not yet available in this sample.",Scheduled:"This payment is scheduled in the sample history and has not completed.","Waiting for approval":"This sample payment is awaiting approval. Use the isolated approval preview to record a demo decision. No payment can be released."}[t.status];
 const receipt=()=>{
  const rows=[["Recipient / merchant",t.merchant],["Amount",formatMoney(t.amount,t.currency)],["Status",t.status],["Date in sample history",t.date],["Category",t.category],["Payment details",t.meta],["Reference",reference]];
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Demo transaction ${escapeHtml(reference)}</title><style>body{font:16px system-ui;color:#172132;max-width:720px;margin:48px auto;padding:24px}h1{font-size:28px}p{line-height:1.6;color:#525252}dl{margin:32px 0}dl div{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #ddd;padding:16px 0}dt{color:#525252}dd{margin:0;text-align:right;overflow-wrap:anywhere}@media print{body{margin:0}}</style><h1>ZapadBanka · Demo transaction</h1><p>Simulated data. This is not a bank receipt or proof of payment.</p><dl>${rows.map(([label,value])=>`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>${saved?`<h2>Personal note</h2><p>${escapeHtml(saved)}</p>`:""}<p>Downloaded from the portfolio prototype. Use your browser’s Print command to save a PDF.</p></html>`;
  downloadFile(`${reference}-demo-receipt.html`,html,"text/html;charset=utf-8");
 };
 return <div className="space-y-5">
  <section className="rounded-xl bg-white p-5 space-y-3" aria-label="Transaction status"><div className="flex items-center gap-2 font-semibold"><span className={cn("size-2 rounded-full", t.status==="Completed"?"bg-emerald-600":"bg-amber-600")} />{t.status}</div><p className="text-sm text-slate-600 leading-relaxed">{explanation}</p><div className="flex flex-wrap justify-between items-center gap-2 text-sm"><span className="text-slate-600">{reference}</span><Button variant="ghost" aria-label="Copy transaction reference" onClick={async()=>{setCopied(false);if(await copyText(reference)){setCopied(true);}else{toast.error("Could not copy. Select and copy the reference manually.");}}}>{copied?<Check className="size-4"/>:<Copy className="size-4"/>}{copied?"Copied":"Copy"}</Button></div></section>
  <section className="rounded-xl bg-white p-5 space-y-3"><Label htmlFor="transaction-note">Personal note</Label><Textarea id="transaction-note" rows={3} maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add context for later…"/><div className="flex flex-wrap justify-between items-center gap-2"><span className="text-xs text-slate-500">{note.length}/500 · Only on this device</span><Button variant="outline" disabled={note===saved} onClick={()=>{if(!writeDemo(key,note)){toast.error("Your browser could not save this note");return;}setSaved(note);toast.success("Note saved");}}>Save note</Button></div></section>
  {business&&t.status==="Waiting for approval"&&<Button variant="outline" className="w-full" onClick={()=>{try {const source=getAccounts("business")[0];const r=savePreview({id:`approval-${t.id}`,kind:"business",createdAt:new Date().toISOString(),title:"Invoice approval",sourceId:source.id,source:`${source.name} · ${source.iban}`,recipient:t.merchant,iban:"Sample invoice · bank details not supplied",amount:Math.abs(t.amount),currency:t.currency,fee:0,total:Math.abs(t.amount),received:Math.abs(t.amount),targetCurrency:t.currency,note:t.meta,status:"Awaiting approval",initiator:"Demo accounts payable",events:["Sample invoice copied into an isolated approval preview. Supporting document and bank verification are unavailable."]});navigate(profilePath("business",`transactions?preview=${r.id}`));}catch(e){toast.error((e as Error).message);}}}>Review approval preview</Button>}
  <Button variant="outline" className="w-full" asChild><Link to={profilePath(business?"business":"personal",`help?transaction=${encodeURIComponent(t.id)}`)}>I don't recognize this payment</Link></Button>
  <Button variant="outline" className="w-full" disabled={isPrivate} onClick={receipt}><Receipt className="size-4 mr-2"/>Download demo receipt</Button>
  <p className="text-xs text-slate-500">{isPrivate?"Show balances to download transaction details.":"HTML document · Open and print to save as PDF. Not proof of payment."}</p>
 </div>;
}
