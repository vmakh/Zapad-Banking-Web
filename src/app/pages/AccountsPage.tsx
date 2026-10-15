import { formatDate } from "../utils/date";
import { Badge } from "../components/ui/badge";
import { localizedMerchant } from "../i18n/display";
import { useI18n } from "../i18n/I18nProvider";
import { copyText } from "../utils/clipboard";
import { cn } from "../components/ui/utils";
import { CurrencyMark } from "../components/zapad/CurrencyIcon";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { DownloadSimpleIcon as Download } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { TrendUpIcon as TrendingUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import { CopyIcon as Copy } from "@phosphor-icons/react/dist/csr/Copy";
import { ChecksIcon as CheckCheck } from "@phosphor-icons/react/dist/csr/Checks";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { ArrowDownLeftIcon as ArrowDownLeft } from "@phosphor-icons/react/dist/csr/ArrowDownLeft";
import { DotsThreeVerticalIcon as MoreVertical } from "@phosphor-icons/react/dist/csr/DotsThreeVertical";
import { BankIcon as Wallet } from "@phosphor-icons/react/dist/csr/Bank";
import { CheckCircleIcon as CheckCircle2 } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { toast } from "sonner";
import { useAppProfile } from "../hooks/useAppProfile";
import { usePrivacy } from "../contexts/PrivacyContext";
import { getAccounts, getAccountById, getTotalEurBalance, ACCOUNT_TYPES } from "../data/accounts";
import { accountActivity } from "../data/transactions";
import { PAGE_MAX_WIDTH, paymentsPath, profilePath, statementsPath } from "../utils/paths";
import { formatMoney } from "../utils/format";
import type { ProfileSlug } from "../data/types";

function AccountDetailSheet({
  open,
  onClose,
  account,
  isBusiness,
  isPrivate,
  profileSlug,
}: {
  open: boolean;
  onClose: () => void;
  account: { id: string; name: string; iban: string; balance: number; currency: string; type: string } | null;
  isBusiness: boolean;
  isPrivate: boolean;
  profileSlug: ProfileSlug;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const txs = account?.id === "p-main" ? accountActivity.personal : account?.id === "b-operating" ? accountActivity.business : [];
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  if (!account) return null;

  const copy = async (text: string) => {
    setCopied(false);
    if (!await copyText(text)) {
      toast.error(t("Could not copy. Select and copy the IBAN manually."));
      return;
    }
    setCopied(true);
    toast.success(t("IBAN copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
        <div className="p-5 sm:p-8">
          <SheetHeader className="mb-7 text-left">
            <SheetTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              {t(account.name)}
            </SheetTitle>
            <SheetDescription className="font-semibold text-slate-500 mt-1">
              {t(account.type)}
            </SheetDescription>
          </SheetHeader>

          {/* Balance card */}
          <div data-slot="supporting-surface" className={cn("rounded-xl p-4 sm:p-6 mb-6 text-white", brandBg)}>
            <div className="text-sm text-inherit mb-2">
              {t("Available balance")}
            </div>
            <div className={cn("text-2xl sm:text-4xl font-semibold tracking-tight mb-4", "text-white")}>
              {isPrivate ? "••••••" : formatMoney(account.balance, account.currency)}
            </div>
            <div className="flex items-center gap-2">
              <code className={cn("font-mono text-sm font-medium min-w-0 break-words", "text-white")}>
                {account.iban}
              </code>
              <button aria-label={t("Copy IBAN")} onClick={() => copy(account.iban)} className="shrink-0 size-11 rounded-lg flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-colors">
                {copied ? <CheckCheck className={cn("size-4", brandText)} /> : <Copy className="size-4 text-white" />}
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { label: "Send", icon: ArrowUpRight },
              { label: "Receive", icon: ArrowDownLeft },
              { label: "Statement", icon: Download },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => {
                    if (a.label === "Statement" && account) {
                      navigate(statementsPath(profileSlug, { account: account.id }));
                    } else if (a.label === "Send") {
                      navigate(`${paymentsPath(profileSlug, "send")}&source=${account.id}&origin=accounts`);
                    } else if (a.label === "Receive") {
                      navigate(`${paymentsPath(profileSlug, "receive")}&source=${account.id}&origin=accounts`);
                    }
                  }}
                  className="flex flex-col items-center gap-2.5 py-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group"
                >
                  <div data-slot="functional-icon" data-icon-role="action" className="size-10 rounded-action-inner bg-white border border-slate-200 flex items-center justify-center zb-group-hover-lift shadow-sm">
                    <Icon className="size-4 text-slate-700" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{t(a.label)}</span>
                </button>
              );
            })}
          </div>

          {/* Recent activity */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-semibold text-slate-900">{t("Recent activity")}</h3>
              <Button onClick={() => navigate(profilePath(profileSlug, `transactions?account=${account.id}`))} variant="ghost" className="text-xs font-medium text-slate-500 hover:text-slate-900 h-8 px-2">
                {t("All transactions")}
              </Button>
            </div>
            <div className="space-y-1">
              {txs.length === 0 && <p className="text-sm text-slate-500 py-4">{t("No activity in this demo account.")}</p>}
              {txs.map((tx) => (
                <div key={tx.id} className="grid grid-cols-1 sm:flex sm:items-center gap-2 sm:gap-4 sm:px-4 py-3.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div data-slot="functional-icon" className={cn("size-10 rounded-full hidden sm:flex items-center justify-center shrink-0", tx.positive ? "bg-emerald-100" : "bg-slate-100")}>
                    {tx.positive ? (
                      <ArrowDownLeft className="size-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="size-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate text-sm">{localizedMerchant(tx.desc)}</div>
                    <div className="text-xs font-normal text-slate-400">{formatDate(tx.date)}</div>
                  </div>
                  <span className={cn("font-semibold text-sm", tx.positive ? "text-emerald-600" : "text-slate-700")}>
                    {isPrivate ? "•••" : formatMoney(tx.amount, account.currency, { showPlus: tx.positive })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OpenAccountDialog({
  open,
  onClose,
  isBusiness,
}: {
  open: boolean;
  onClose: () => void;
  isBusiness: boolean;
}) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "success">("select");
  const resultTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step === "success") resultTitle.current?.focus();
  }, [step]);
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setStep("select"); setSelected(null); onClose(); } }}>
      <DialogContent className="sm:max-w-md rounded-4xl p-0 overflow-hidden border border-slate-200/60 shadow-panel">
        {step === "select" ? (
          <div className="p-8">
            <DialogHeader className="mb-7">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                {t("Open new account")}
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-1">
                {t("Choose the account type that fits your needs.")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mb-7">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.id}
                  aria-pressed={selected === type.id}
                  onClick={() => setSelected(type.id)}
                  className={cn("w-full text-left p-4 rounded-action-inner border-2 transition-all", selected === type.id
                      ? "bg-slate-50"
                      : "border-slate-200 bg-white hover:border-slate-300")}
                  style={selected === type.id ? { borderColor: isBusiness ? "var(--brand-business)" : "var(--brand-personal)" } : {}}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{t(type.label)}</div>
                      <div className="text-xs font-normal text-slate-500 mt-1 leading-snug">{t(type.desc)}</div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 shrink-0 mt-0.5">{t(type.fee)}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              disabled={!selected}
              onClick={() => setStep("success")}
              className={cn("w-full h-12 px-6 rounded-lg font-medium shadow-sm disabled:opacity-50 transition-all hover:shadow-md", brandBg, brandText)}
            >
              {t("Continue")} <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center text-center gap-5">
            <div data-slot="supporting-surface" className={cn("size-20 rounded-full", brandBg, "flex items-center justify-center shadow-lg")}>
              <CheckCircle2 className={cn("size-10", brandText)} />
            </div>
            <DialogTitle ref={resultTitle} tabIndex={-1} className="text-2xl font-semibold tracking-tight text-slate-900">{t("Account preview complete")}</DialogTitle>
            <DialogDescription className="text-slate-500 font-semibold text-base max-w-60 leading-snug">
              {t("No account was opened. This is a simulated confirmation for the portfolio demo.")}
            </DialogDescription>
            <Button
              onClick={() => { setStep("select"); setSelected(null); onClose(); }}
              className="mt-4 w-full h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              {t("Done")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AccountsPage() {
  const { t } = useI18n();
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { accountId } = useParams<{ accountId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const brandColor = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-primary-foreground";

  const accounts = getAccounts(profile.kind);
  const totalBalance = getTotalEurBalance(profile.kind);

  const [detailAccount, setDetailAccount] = useState<(typeof accounts)[0] | null>(null);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);

  useEffect(() => {
    setDetailAccount(accountId ? getAccountById(profile.kind, accountId) ?? null : null);
  }, [accountId, profile.kind]);

  useEffect(() => {
    if (searchParams.get("open") === "new") {
      setOpenAccountDialog(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const detailFromRoute = accountId ? getAccountById(profile.kind, accountId) : null;
  if (accountId && !detailFromRoute) return <div className="p-8 space-y-4"><h1 className="text-2xl font-semibold">{t("Account not found")}</h1><p>{t("This link does not belong to the selected profile or is no longer available.")}</p><Button variant="outline" onClick={() => navigate(profilePath(profileSlug, "accounts"))}>{t("Back to accounts")}</Button></div>;


  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      {accountId && detailFromRoute && (
        <nav aria-label={t("Breadcrumb")} className="text-sm font-normal text-slate-500">
          <Link to={profilePath(profileSlug)} className="hover:text-slate-900 transition-colors">
            {t("Dashboard")}
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link to={profilePath(profileSlug, "accounts")} className="hover:text-slate-900 transition-colors">
            {t("Accounts")}
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 font-medium">{t(detailFromRoute.name)}</span>
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Accounts")}</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {isBusiness ? t("Business accounts · {name}", { name: profile.name }) : t("Personal accounts · {name}", { name: profile.name })}
          </p>
        </div>
        <Button
          onClick={() => setOpenAccountDialog(true)}
          className={cn(brandColor, brandHover, brandText, "rounded-lg h-11 px-5 font-medium shadow-sm transition-all hover:shadow-md")}
        >
          <Plus className="size-4 mr-2" /> {t("Open new account")}
        </Button>
      </div>

      {/* Total balance */}
      <div className="bank-amount-container border-b border-border pb-6">
        <div className="text-sm text-muted-foreground mb-2">
          {t("Total EUR balance")}
        </div>
        <div data-bank-account-amount style={{ "--balance-chars": formatMoney(totalBalance).length } as CSSProperties} className="text-4xl font-semibold tracking-tight text-foreground">
          {isPrivate ? "••••••" : formatMoney(totalBalance)}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {t("Across {count} EUR accounts · Other currencies shown separately", { count: accounts.filter(account => account.currency === "EUR").length })}
        </div>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="w-full text-left group"
          >
            <Card data-bank-account-card className="flex flex-col gap-6 p-5 sm:p-6 border-slate-200/60 bg-white rounded-4xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-6 shrink-0 items-center"><CurrencyMark currency={account.currency} /></div>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight"><button type="button" aria-haspopup="dialog" onClick={() => setDetailAccount(account)} className="bank-account-title text-left hover:underline underline-offset-4">{t(account.name)}</button></h3>
                    <Badge tone="neutral">{t(account.type)}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label={t(account.name)} aria-haspopup="dialog" onClick={() => setDetailAccount(account)} className="shrink-0 text-muted-foreground"><ChevronRight className="size-5" /></Button>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="bank-amount-container flex w-full min-w-0 flex-1 flex-col gap-2">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t("Balance")}</div>
                  <div data-bank-account-amount style={{ "--balance-chars": formatMoney(account.balance, account.currency).length } as CSSProperties} className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                    {isPrivate ? "••••••" : formatMoney(account.balance, account.currency)}
                  </div>
                </div>
                <code className="text-xs font-mono font-medium text-muted-foreground break-words sm:text-right leading-relaxed">
                  {account.iban}
                </code>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(statementsPath(profileSlug, { account: account.id }));
                  }}
                  className="flex-1 h-11 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <Download className="size-4 mr-2" /> {t("Statement")}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); navigate(profilePath(profileSlug, `transactions?account=${account.id}`)); }}
                  className="flex-1 h-11 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <TrendingUp className="size-4 mr-2" /> {t("Activity")}
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <AccountDetailSheet
        open={!!detailAccount}
        onClose={() => {
          setDetailAccount(null);
          if (accountId) navigate(profilePath(profileSlug, "accounts"));
        }}
        account={detailAccount}
        isBusiness={isBusiness}
        isPrivate={isPrivate}
        profileSlug={profileSlug}
      />
      <OpenAccountDialog
        open={openAccountDialog}
        onClose={() => setOpenAccountDialog(false)}
        isBusiness={isBusiness}
      />
    </div>
  );
}
