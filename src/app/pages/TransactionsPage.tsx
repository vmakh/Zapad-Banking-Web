import { localizedMerchant, localizedTransactionMeta } from "../i18n/display";
import { formatDate } from "../utils/date";
import { useI18n } from "../i18n/I18nProvider";
import { activityFilters } from "../utils/activityFilters";
import { isSpendingTransaction } from "../utils/spending";
import { CurrencyFlag } from "../components/zapad/CurrencyIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PreviewHistory } from "../components/zapad/PreviewHistory";
import { Link, useSearchParams } from "react-router";
import { ArrowLeftIcon as ArrowLeft } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { Input } from "../components/ui/input";
import { getAccounts } from "../data/accounts";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

import { cn } from "../components/ui/utils";
import { usePrivacy } from "../contexts/PrivacyContext";
import { useAppProfile } from "../hooks/useAppProfile";
import { getAccountTransactions, getTransactions } from "../data/transactions";
import type { Transaction } from "../data/types";
import { TransactionDetailsSheet } from "../components/zapad/TransactionDetailsSheet";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";
import { formatMoney } from "../utils/format";

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const { t } = useI18n();
  const map: Record<Transaction["status"], "success" | "warning" | "info" | "attention"> = {
    Completed: "success",
    Pending: "warning",
    Scheduled: "info",
    "Waiting for approval": "attention",
  };
  if (status === "Completed") return null;
  return (
    <Badge tone={map[status]}>
      {t(status)}
    </Badge>
  );
}

export function TransactionsPage() {
  const { t, intlLocale } = useI18n();
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { isPrivate } = usePrivacy();
  const [params, setParams] = useSearchParams();
  const allTransactions = getTransactions(profile.kind);
  const accounts = getAccounts(profile.kind);
  const query = params.get("search") ?? "";
  const { spending, status, accountId, category, invalid } = activityFilters(params, accounts.map(a => a.id), allTransactions.filter(isSpendingTransaction).map(tx => tx.category));
  const selectedTx = allTransactions.find(tx => tx.id === params.get("transaction")) ?? null;
  const updateParam = (name: string, value: string) => {
    setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(name, value); else next.delete(name); return next; }, { replace: true });
  };
  const data = (accountId ? getAccountTransactions(profile.kind, accountId) : allTransactions).filter(tx =>
    (!spending || (isSpendingTransaction(tx) && (!category || tx.category === category))) &&
    (!status || tx.status === status) &&
    `${tx.merchant} ${tx.meta} ${tx.category} ${localizedMerchant(tx.merchant)} ${localizedTransactionMeta(tx.meta)} ${t(tx.category)} ${tx.amount} ${formatMoney(tx.amount, tx.currency)} ZB-${isBusiness ? "B" : "P"}-${tx.id.toUpperCase()}`.toLocaleLowerCase(intlLocale).includes(query.trim().toLocaleLowerCase(intlLocale))
  );

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-4 md:p-6 space-y-6")}>
      <div>
        {spending && <Button variant="ghost" asChild className="mb-3 min-h-11 px-0 text-muted-foreground"><Link to={profilePath(profileSlug, "")}><ArrowLeft className="size-4" /> {t("Back to overview")}</Link></Button>}
        {!spending && accountId && (
          <Button variant="ghost" asChild className="mb-3 min-h-11 px-0 text-muted-foreground">
            <Link to={profilePath(profileSlug, "accounts")}><ArrowLeft className="size-4" /> {t("Back to accounts")}</Link>
          </Button>
        )}
        <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">
          {t("Activity")}
        </h1>
        <p className="text-base font-normal text-slate-500 mt-1.5">
          {accountId ? `${t(accounts.find(account => account.id === accountId)?.name ?? "")} · ${profile.name}` : t("Sample activity for {name}", { name: profile.name })}
        </p>
      </div>

      {((params.has("transaction") && !selectedTx) || invalid) && <p role="status" className="text-sm text-slate-600">{t("This link contains an unavailable transaction or filter. Showing the available activity.")}</p>}
      {!spending && <PreviewHistory kind={profile.kind} accountId={accountId} />}
      <Card className="border border-slate-200/60 bg-white rounded-4xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-5 space-y-3 border-b border-slate-100">
          {spending && <div className="space-y-2"><h2 className="text-lg font-semibold">{t(category || "Posted outgoings")} · EUR</h2><p className="text-sm text-muted-foreground">{t("May 2026 sample · Excludes income, pending and scheduled payments, exchanges and local previews.")}</p><p className="font-semibold">{t("Total shown: {amount}", { amount: isPrivate ? "•••" : formatMoney(data.reduce((sum, tx) => sum + Math.round(Math.abs(tx.amount) * 100), 0) / 100, "EUR") })}</p></div>}
          <p className="text-sm text-slate-500">{data.length === 1 ? t("{count} transaction · May 2026 demo", { count: data.length }) : t("{count} transactions · May 2026 demo", { count: data.length })}</p>
          <Input aria-label={t("Search activity")} placeholder={t("Search name, amount, category or reference")} value={query} onChange={e => updateParam("search", e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {!spending && <Select value={status || "all"} onValueChange={value => updateParam("status", value === "all" ? "" : value)}>
              <SelectTrigger aria-label={t("Filter by status")} className="min-h-11"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">{t("All statuses")}</SelectItem>
              {["Completed", "Pending", "Scheduled", "Waiting for approval"].map(value => <SelectItem key={value} value={value}>{t(value)}</SelectItem>)}
              </SelectContent>
            </Select>}
            <Select value={accountId || "all"} onValueChange={value => updateParam("account", value === "all" ? "" : value)}>
              <SelectTrigger aria-label={t("Filter by account")} className="min-h-11"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">{t("All accounts")}</SelectItem>
              {accounts.map(account => <SelectItem key={account.id} value={account.id}><CurrencyFlag currency={account.currency} />{t(account.name)} · {account.currency}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {(query || status || accountId || spending) && <Button variant="ghost" onClick={() => setParams({})}>{t("Clear filters")}</Button>}
        </div>
        {!data.length && <p className="p-8 text-slate-500" role="status">{t("No sample transactions match these filters.")}</p>}
        <div className="divide-y divide-slate-100">
          {data.map((tx) => {
            const Icon = tx.icon;
            const positive = tx.amount > 0;
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => updateParam("transaction", tx.id)}
                className="transaction-history-row w-full px-6 md:px-8 py-5 md:py-6 flex items-center gap-4 hover:bg-slate-50/80 transition-colors text-left group"
              >
                <div data-slot="functional-icon" className={cn("size-12 md:size-14 rounded-2xl flex items-center justify-center shrink-0", tx.iconBg)}>
                  <Icon className="size-5 md:size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base md:text-lg font-medium text-slate-900 truncate">{localizedMerchant(tx.merchant)}</span>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="text-sm font-normal text-slate-500 truncate mt-1">
                    {localizedTransactionMeta(tx.meta)} · {formatDate(tx.date)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={cn(
                      "text-lg md:text-xl font-semibold tabular-nums",
                      positive ? "text-emerald-600" : "text-slate-900",
                    )}
                  >
                    {isPrivate ? (
                      "•••"
                    ) : (
                      formatMoney(tx.amount, tx.currency, { showPlus: positive })
                    )}
                  </div>
                  <div className="text-xs font-normal text-slate-500 mt-1">{t(tx.category)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <TransactionDetailsSheet
        transaction={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && updateParam("transaction", "")}
        isBusiness={isBusiness}
      />
    </div>
  );
}
