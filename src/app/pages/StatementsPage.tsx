import { CurrencyFlag } from "../components/zapad/CurrencyIcon";
import { usePrivacy } from "../contexts/PrivacyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { FileText, ChevronRight, Download } from "lucide-react";
import { useAppProfile } from "../hooks/useAppProfile";
import { getAccounts } from "../data/accounts";
import { getTransactions } from "../data/transactions";
import { Button } from "../components/ui/button";
import { downloadFile } from "../utils/exportFiles";
import { statementCsv } from "../utils/statementExport";
import { formatMoney } from "../utils/format";
import { PAGE_MAX_WIDTH } from "../utils/paths";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";

export function StatementsPage() {
 const { profile } = useAppProfile();
 const { isPrivate } = usePrivacy();
 const [params, setParams] = useSearchParams();
 const accounts = getAccounts(profile.kind);
 const requestedAccount = params.get("account") ?? "all";
 const accountValid = requestedAccount === "all" || accounts.some(account => account.id === requestedAccount);
 const accountId = accountValid ? requestedAccount : "all";
 const requestedMonth = params.get("month") ?? "2026-05";
 const period = requestedMonth === "2026-04" ? "April 2026" : requestedMonth === "2026-05" ? "May 2026" : "";
 const setParam = (key: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set(key,value); return next; }, {replace:true});
 const setAccountId = (value: string) => setParam("account",value);
 const setPeriod = (value: string) => setParam("month",value === "April 2026" ? "2026-04" : "2026-05");
 const [previewId, setPreviewId] = useState<string | null>(null);
 const preview = period === "May 2026" ? accounts.find(a=>a.id===previewId && (accountId === "all" || a.id === accountId)) : undefined;
 const filtered = accounts.filter(a=>accountId === "all" || a.id === accountId);
 const transactions = preview?.id === accounts[0].id ? getTransactions(profile.kind).filter(t=>t.status === "Completed") : [];
 return <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-6")}>
  <header><h1 className="text-3xl font-medium">Statements</h1><p className="text-slate-500 mt-2">View sample statements by account and period.</p></header>
  {!accountValid && <p role="status" className="text-sm text-slate-600">Account not found in this profile. Showing all accounts.</p>}
  <div className="flex flex-wrap gap-5 bg-white rounded-2xl p-5 border border-slate-200">
   <div className="flex-1 min-w-48 space-y-2">
    <label htmlFor="statement-account" className="block text-sm text-muted-foreground">Account</label>
    <Select value={accountId} onValueChange={setAccountId}>
     <SelectTrigger id="statement-account" className="min-h-12 rounded-xl"><SelectValue /></SelectTrigger>
     <SelectContent><SelectItem value="all">All accounts</SelectItem>{accounts.map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{a.name} · {a.currency}</SelectItem>)}</SelectContent>
    </Select>
   </div>
   <div className="flex-1 min-w-48 space-y-2">
    <label htmlFor="statement-period" className="block text-sm text-muted-foreground">Period</label>
    <Select value={period} onValueChange={setPeriod}>
     <SelectTrigger id="statement-period" className="min-h-12 rounded-xl"><SelectValue placeholder="Choose a period" /></SelectTrigger>
     <SelectContent><SelectItem value="May 2026">May 2026</SelectItem><SelectItem value="April 2026">April 2026</SelectItem></SelectContent>
    </Select>
   </div>
  </div>
  <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">{period === "May 2026" ? filtered.map(a=><button key={a.id} onClick={()=>setPreviewId(a.id)} className="flex items-center gap-4 p-5 text-left w-full hover:bg-slate-50"><FileText className="size-6 text-blue-600"/><span className="flex-1"><strong className="block">{a.name}</strong><span className="text-sm text-slate-500">May 2026 · {a.currency} · {a.ibanShort}</span></span><span className="text-sm">View</span><ChevronRight className="size-4"/></button>) : <div className="p-10 text-center"><h2 className="font-semibold">{period === "April 2026" ? "No statements for April" : "This statement period is unavailable"}</h2><p className="text-slate-500 mt-2">This prototype contains May samples only.</p><button className="text-blue-700 mt-4 min-h-11" onClick={()=>setPeriod("May 2026")}>View May statements</button></div>}</div>
  <p className="text-sm text-slate-500">Sample documents, not official bank statements. Download the displayed statement as CSV.</p>
  <Dialog open={!!preview} onOpenChange={open=>!open && setPreviewId(null)}>
   <DialogContent className="statement-dialog sm:max-w-xl flex flex-col overflow-hidden">
    <DialogHeader className="shrink-0">
     <DialogTitle className="break-words">{preview?.name}</DialogTitle>
     <DialogDescription className="break-words">May 2026 · {preview?.currency} · {preview?.ibanShort}</DialogDescription>
    </DialogHeader>
    <section aria-label="Statement transactions" tabIndex={0} className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline focus-visible:outline-ring rounded-lg">
     <p className="text-sm text-muted-foreground mb-3">Sample statement · {transactions.length} posted transactions</p>
     {transactions.length ? <ul className="divide-y divide-border">
      {transactions.map(t=><li key={t.id} className="flex flex-wrap justify-between gap-x-4 gap-y-2 py-4">
       <span className="min-w-0 flex-1 basis-40 break-words"><strong className="block">{t.merchant}</strong><small className="text-muted-foreground">{t.date}</small></span>
       <span className="max-w-full break-words tabular-nums">{isPrivate ? "•••" : formatMoney(t.amount,t.currency)}</span>
      </li>)}
     </ul> : <p className="py-8 text-center text-muted-foreground">No posted activity for this account.</p>}
    </section>
    <DialogFooter className="shrink-0 border-t border-border pt-4 sm:items-center">
     <p className="text-xs text-muted-foreground flex-1">{isPrivate ? "Amounts will remain hidden in the download." : "Sample data only. Not an official bank statement."}</p>
     <Button onClick={() => preview && downloadFile(`zapadbanka-sample-statement-${preview.id}-2026-05.csv`, statementCsv(preview, transactions, isPrivate), "text/csv;charset=utf-8")}>
      <Download className="size-4" /> Download CSV
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 </div>;
}
