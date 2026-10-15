import { localizedMerchant, localizedTransactionMeta } from "../i18n/display";
import { formatDate } from "../utils/date";
import { useI18n } from "../i18n/I18nProvider";
import { CurrencyFlag } from "../components/zapad/CurrencyIcon";
import { usePrivacy } from "../contexts/PrivacyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { FileTextIcon as FileText } from "@phosphor-icons/react/dist/csr/FileText";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { DownloadSimpleIcon as Download } from "@phosphor-icons/react/dist/csr/DownloadSimple";
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
 const { t } = useI18n();
 const { profile } = useAppProfile();
 const { isPrivate } = usePrivacy();
 const [params, setParams] = useSearchParams();
 const accounts = getAccounts(profile.kind);
 const requestedAccount = params.get("account") ?? "all";
 const accountValid = requestedAccount === "all" || accounts.some(account => account.id === requestedAccount);
 const accountId = accountValid ? requestedAccount : "all";
 const requestedMonth = params.get("month") ?? "2026-05";
 const period = ["2026-04", "2026-05"].includes(requestedMonth) ? requestedMonth : "";
 const setParam = (key: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set(key,value); return next; }, {replace:true});
 const setAccountId = (value: string) => setParam("account",value);
 const setPeriod = (value: string) => setParam("month", value);
 const [previewId, setPreviewId] = useState<string | null>(null);
 const preview = period === "2026-05" ? accounts.find(a=>a.id===previewId && (accountId === "all" || a.id === accountId)) : undefined;
 const filtered = accounts.filter(a=>accountId === "all" || a.id === accountId);
 const transactions = preview?.id === accounts[0].id ? getTransactions(profile.kind).filter(tx=>tx.status === "Completed") : [];
 return <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-6")}>
  <header><h1 className="text-3xl font-medium">{t("Statements")}</h1><p className="text-slate-500 mt-2">{t("View sample statements by account and period.")}</p></header>
  {!accountValid && <p role="status" className="text-sm text-slate-600">{t("Account not found in this profile. Showing all accounts.")}</p>}
  <div data-bank-surface className="flex flex-wrap gap-5 bg-white rounded-2xl p-5 border border-slate-200">
   <div className="flex-1 min-w-0 basis-48 space-y-2">
    <label htmlFor="statement-account" className="block text-sm text-muted-foreground">{t("Account")}</label>
    <Select value={accountId} onValueChange={setAccountId}>
     <SelectTrigger id="statement-account" className="min-h-12 rounded-xl"><SelectValue /></SelectTrigger>
     <SelectContent><SelectItem value="all">{t("All accounts")}</SelectItem>{accounts.map(a=><SelectItem key={a.id} value={a.id}><CurrencyFlag currency={a.currency} />{t(a.name)} · {a.currency}</SelectItem>)}</SelectContent>
    </Select>
   </div>
   <div className="flex-1 min-w-0 basis-48 space-y-2">
    <label htmlFor="statement-period" className="block text-sm text-muted-foreground">{t("Period")}</label>
    <Select value={period} onValueChange={setPeriod}>
     <SelectTrigger id="statement-period" className="min-h-12 rounded-xl"><SelectValue placeholder={t("Choose a period")} /></SelectTrigger>
     <SelectContent><SelectItem value="2026-05">{t("May 2026")}</SelectItem><SelectItem value="2026-04">{t("April 2026")}</SelectItem></SelectContent>
    </Select>
   </div>
  </div>
  <div data-bank-surface className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">{period === "2026-05" ? filtered.map(a=><button key={a.id} onClick={()=>setPreviewId(a.id)} className="grid grid-cols-1 sm:flex sm:items-center gap-3 sm:gap-4 p-5 text-left w-full hover:bg-slate-50"><FileText className="hidden sm:block size-6 shrink-0 text-primary-text" aria-hidden="true"/><span className="min-w-0 flex-1"><strong className="block">{t(a.name)}</strong><span className="text-sm text-slate-500">{t("May 2026")} · {a.currency} · {a.ibanShort}</span></span><span className="inline-flex items-center gap-2 text-sm">{t("View")}<ChevronRight className="size-4 shrink-0" aria-hidden="true"/></span></button>) : <div className="p-10 text-center"><h2 className="font-semibold">{period === "2026-04" ? t("No statements for April") : t("This statement period is unavailable")}</h2><p className="text-slate-500 mt-2">{t("This prototype contains May samples only.")}</p><button className="text-primary-text mt-4 min-h-11" onClick={()=>setPeriod("2026-05")}>{t("View May statements")}</button></div>}</div>
  <p className="text-sm text-slate-500">{t("Sample documents, not official bank statements. Download the displayed statement as CSV.")}</p>
  <Dialog open={!!preview} onOpenChange={open=>!open && setPreviewId(null)}>
   <DialogContent className="statement-dialog sm:max-w-xl flex flex-col overflow-hidden">
    <DialogHeader className="shrink-0">
     <DialogTitle className="break-words">{preview ? t(preview.name) : ""}</DialogTitle>
     <DialogDescription className="break-words">{t("May 2026")} · {preview?.currency} · {preview?.ibanShort}</DialogDescription>
    </DialogHeader>
    <section aria-label={t("Statement transactions")} tabIndex={0} className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline focus-visible:outline-ring rounded-lg">
     <p className="text-sm text-muted-foreground mb-3">{transactions.length === 1 ? t("Sample statement · {count} posted transaction", { count: transactions.length }) : t("Sample statement · {count} posted transactions", { count: transactions.length })}</p>
     {transactions.length ? <ul className="divide-y divide-border">
      {transactions.map(tx=><li key={tx.id} className="flex flex-wrap justify-between gap-x-4 gap-y-2 py-4">
       <span className="min-w-0 flex-1 basis-40 break-words"><strong className="block">{localizedMerchant(tx.merchant)}</strong><small className="text-muted-foreground">{formatDate(tx.date)}</small></span>
       <span className="max-w-full break-words tabular-nums">{isPrivate ? "•••" : formatMoney(tx.amount,tx.currency)}</span>
      </li>)}
     </ul> : <p className="py-8 text-center text-muted-foreground">{t("No posted activity for this account.")}</p>}
    </section>
    <DialogFooter className="shrink-0 border-t border-border pt-4 sm:items-center">
     <p className="text-xs text-muted-foreground flex-1">{isPrivate ? t("Amounts will remain hidden in the download.") : t("Sample data only. Not an official bank statement.")}</p>
     <Button onClick={() => preview && downloadFile(`zapadbanka-sample-statement-${preview.id}-2026-05.csv`, statementCsv(preview, transactions, isPrivate, { t, date: formatDate, merchant: localizedMerchant, meta: localizedTransactionMeta }), "text/csv;charset=utf-8")}>
      <Download className="size-4" /> {t("Download CSV")}
     </Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 </div>;
}
