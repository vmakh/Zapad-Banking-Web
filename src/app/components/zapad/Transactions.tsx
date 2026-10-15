import { localizedMerchant, localizedTransactionMeta } from "../../i18n/display";
import { formatDate } from "../../utils/date";
import { useI18n } from "../../i18n/I18nProvider";
import { useState } from "react";
import { Link } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { MagnifyingGlassIcon as Search } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { cn } from "../ui/utils";
import { formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { getAccountTransactions, getTransactions } from "../../data/transactions";
import type { BankAccount, ProfileKind, Transaction } from "../../data/types";
import { TransactionDetailsSheet } from "./TransactionDetailsSheet";
import { IconScaleSlot } from "./IconScaleSlot";

export function Transactions({
  profileKind,
  limit,
  account,
  viewAllHref,
  compact = false,
}: {
  profileKind: ProfileKind;
  limit?: number;
  account?: BankAccount;
  viewAllHref?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const business = profileKind === "business";
  const { isPrivate } = usePrivacy();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const allData = account ? getAccountTransactions(profileKind, account.id) : getTransactions(profileKind);
  const data = limit ? allData.slice(0, limit) : allData;

  return (
    <Card className="@container border border-slate-200/60 bg-white rounded-4xl overflow-hidden shadow-sm">
      <div
        className={cn(
          "flex flex-wrap gap-3 items-center justify-between border-b border-slate-100",
          compact ? "p-4 md:p-5" : "p-6 md:p-8",
        )}
      >
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">{t("Recent activity")}</h2>
          <p className="text-sm font-normal text-slate-500 mt-1">
            {t(account?.name ?? (business ? "Business accounts" : "Personal accounts"))}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="size-11 rounded-full hover:bg-slate-100 text-slate-600" asChild>
            <Link to={viewAllHref ?? `/${profileKind}/transactions`} aria-label={t("Search transactions")}><Search className="size-5" /></Link>
          </Button>
          {viewAllHref ? (
            <Button variant="ghost" className="h-10 px-5 font-medium text-sm rounded-full hover:bg-slate-100 text-slate-700" asChild>
              <Link to={viewAllHref}>{t("See all")}<ChevronRight className="size-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" className="h-10 px-5 font-medium text-sm rounded-full hover:bg-slate-100 text-slate-700">{t("See all")}<ChevronRight className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {!data.length && <p className="p-5 text-sm text-muted-foreground" role="status">{t("No sample activity for this account.")}</p>}
        {data.map((tx) => {
          const Icon = tx.icon;
          const positive = tx.amount > 0;
          return (
            <div
              key={tx.id}
              role="button"
              tabIndex={0}
              onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedTx(tx); } }}
              onClick={() => setSelectedTx(tx)}
              className={cn(
                "flex items-start @sm:items-center gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group",
                compact ? "px-4 md:px-5 py-3.5 md:py-4" : "px-6 md:px-8 py-5 md:py-6",
              )}
            >
              <IconScaleSlot
                className={cn("rounded-2xl shrink-0", compact ? "size-10 md:size-11" : "size-12 md:size-14")}
                innerClassName={cn("", tx.iconBg)}
              >
                <Icon className={cn(compact ? "size-4 md:size-5" : "size-5 md:size-6")} />
              </IconScaleSlot>
              <div className="flex min-w-0 flex-1 flex-col gap-2 @sm:flex-row @sm:items-center @sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-base md:text-lg font-medium text-slate-900 break-words max-w-full">{localizedMerchant(tx.merchant)}</span>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="text-sm font-normal text-slate-500 break-words mt-1">
                  {localizedTransactionMeta(tx.meta)} <span className="mx-1 text-slate-300">•</span> {formatDate(tx.date)}
                </div>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-left @sm:block @sm:text-right">
                <div
                  className={cn(
                    "text-lg md:text-xl font-semibold tabular-nums tracking-tight",
                    positive ? "text-emerald-600" : "text-slate-900",
                  )}
                >
                  {isPrivate ? (
                    "•••"
                  ) : (
                    <>
                      {formatMoney(tx.amount, tx.currency, { showPlus: positive })}
                    </>
                  )}
                </div>
                <div className="text-xs md:text-sm font-normal text-slate-500 mt-1">{t(tx.category)}</div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
      <TransactionDetailsSheet
        transaction={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
        isBusiness={business}
      />
    </Card>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const { t } = useI18n();
  const map: Record<Transaction["status"], string> = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Scheduled: "bg-sky-50 text-sky-700 border-sky-200",
    "Waiting for approval": "bg-orange-50 text-orange-700 border-orange-200",
  };
  if (status === "Completed") return null;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full", map[status])}>
      {t(status)}
    </Badge>
  );
}
