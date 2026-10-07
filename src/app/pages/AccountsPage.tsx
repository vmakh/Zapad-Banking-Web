import { copyText } from "../utils/clipboard";
import { cn } from "../components/ui/utils";
import { CurrencyMark } from "../components/zapad/CurrencyIcon";
import { useEffect, useState } from "react";
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
import {
  Plus,
  Download,
  TrendingUp,
  Copy,
  CheckCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Wallet,
  CheckCircle2,
} from "lucide-react";
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
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const txs = account?.id === "p-main" ? accountActivity.personal : account?.id === "b-operating" ? accountActivity.business : [];
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";

  if (!account) return null;

  const copy = async (text: string) => {
    setCopied(false);
    if (!await copyText(text)) {
      toast.error("Could not copy. Select and copy the IBAN manually.");
      return;
    }
    setCopied(true);
    toast.success("IBAN copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
        <div className="p-8">
          <SheetHeader className="mb-7 text-left">
            <SheetTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              {account.name}
            </SheetTitle>
            <SheetDescription className="font-semibold text-slate-500 mt-1">
              {account.type}
            </SheetDescription>
          </SheetHeader>

          {/* Balance card */}
          <div data-slot="supporting-surface" className={cn("rounded-xl p-6 mb-6 text-white", brandBg)}>
            <div className="text-sm text-inherit mb-2">
              Available balance
            </div>
            <div className={cn("text-4xl font-semibold tracking-tight mb-4", "text-white")}>
              {isPrivate ? "••••••" : formatMoney(account.balance, account.currency)}
            </div>
            <div className="flex items-center gap-2">
              <code className={cn("font-mono text-sm font-medium min-w-0 break-words", "text-white")}>
                {account.iban}
              </code>
              <button aria-label="Copy IBAN" onClick={() => copy(account.iban)} className="shrink-0 size-11 rounded-lg flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-colors">
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
                  <div className="size-10 rounded-action-inner bg-white border border-slate-200 flex items-center justify-center zb-group-hover-lift shadow-sm">
                    <Icon className="size-4 text-slate-700" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{a.label}</span>
                </button>
              );
            })}
          </div>

          {/* Recent activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent activity</h3>
              <Button onClick={() => navigate(profilePath(profileSlug, `transactions?account=${account.id}`))} variant="ghost" className="text-xs font-medium text-slate-500 hover:text-slate-900 h-8 px-2">
                All transactions
              </Button>
            </div>
            <div className="space-y-1">
              {txs.length === 0 && <p className="text-sm text-slate-500 py-4">No activity in this demo account.</p>}
              {txs.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={cn("size-10 rounded-full flex items-center justify-center shrink-0", tx.positive ? "bg-emerald-100" : "bg-slate-100")}>
                    {tx.positive ? (
                      <ArrowDownLeft className="size-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="size-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate text-sm">{tx.desc}</div>
                    <div className="text-xs font-normal text-slate-400">{tx.date}</div>
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
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "success">("select");
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setStep("select"); setSelected(null); onClose(); } }}>
      <DialogContent className="sm:max-w-md rounded-4xl p-0 overflow-hidden border border-slate-200/60 shadow-panel">
        {step === "select" ? (
          <div className="p-8">
            <DialogHeader className="mb-7">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Open new account
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-1">
                Choose the account type that fits your needs.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mb-7">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={cn("w-full text-left p-4 rounded-lg border-2 transition-all", selected === t.id
                      ? "bg-slate-50"
                      : "border-slate-200 bg-white hover:border-slate-300")}
                  style={selected === t.id ? { borderColor: isBusiness ? "var(--brand-business)" : "var(--brand-personal)" } : {}}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{t.label}</div>
                      <div className="text-xs font-normal text-slate-500 mt-1 leading-snug">{t.desc}</div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 shrink-0 mt-0.5">{t.fee}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              disabled={!selected}
              onClick={() => setStep("success")}
              className={cn("w-full h-12 px-6 rounded-lg font-medium shadow-sm disabled:opacity-50 transition-all hover:shadow-md", brandBg, brandText)}
            >
              Continue <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center text-center gap-5">
            <div data-slot="supporting-surface" className={cn("size-20 rounded-full", brandBg, "flex items-center justify-center shadow-lg")}>
              <CheckCircle2 className={cn("size-10", brandText)} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Account preview complete</h2>
            <p className="text-slate-500 font-semibold text-base max-w-60 leading-snug">
              No account was opened. This is a simulated confirmation for the portfolio demo.
            </p>
            <Button
              onClick={() => { setStep("select"); setSelected(null); onClose(); }}
              className="mt-4 w-full h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AccountsPage() {
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { accountId } = useParams<{ accountId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const brandColor = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-white";

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
  if (accountId && !detailFromRoute) return <div className="p-8 space-y-4"><h1 className="text-2xl font-semibold">Account not found</h1><p>This link does not belong to the selected profile or is no longer available.</p><Button variant="outline" onClick={() => navigate(profilePath(profileSlug, "accounts"))}>Back to accounts</Button></div>;


  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      {accountId && detailFromRoute && (
        <nav aria-label="Breadcrumb" className="text-sm font-normal text-slate-500">
          <Link to={profilePath(profileSlug)} className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link to={profilePath(profileSlug, "accounts")} className="hover:text-slate-900 transition-colors">
            Accounts
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 font-medium">{detailFromRoute.name}</span>
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">Accounts</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {isBusiness ? `Business accounts · ${profile.name}` : `Personal accounts · ${profile.name}`}
          </p>
        </div>
        <Button
          onClick={() => setOpenAccountDialog(true)}
          className={cn(brandColor, brandHover, brandText, "rounded-lg h-11 px-5 font-medium shadow-sm transition-all hover:shadow-md")}
        >
          <Plus className="size-4 mr-2" /> Open new account
        </Button>
      </div>

      {/* Total balance */}
      <div className="border-b border-border pb-6">
        <div className="text-sm text-muted-foreground mb-2">
          Total EUR balance
        </div>
        <div className="text-4xl font-semibold tracking-tight text-foreground">
          {isPrivate ? "••••••" : formatMoney(totalBalance)}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Across {accounts.filter(account => account.currency === "EUR").length} EUR accounts · Other currencies shown separately
        </div>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setDetailAccount(account)}
            className="w-full text-left group cursor-pointer"
          >
            <Card className="p-7 border-slate-200/60 bg-white rounded-4xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <CurrencyMark currency={account.currency} />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{account.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-full bg-slate-100">
                        {account.type}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
              </div>

              <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Balance</div>
                  <div className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                    {isPrivate ? "••••••" : formatMoney(account.balance, account.currency)}
                    <span className="text-xl font-medium text-slate-400 ml-2">{account.currency}</span>
                  </div>
                </div>
                <code className="text-xs font-mono font-medium text-muted-foreground break-words sm:text-right leading-relaxed">
                  {account.iban}
                </code>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(statementsPath(profileSlug, { account: account.id }));
                  }}
                  className="flex-1 h-11 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <Download className="size-4 mr-2" /> Statement
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); navigate(profilePath(profileSlug, `transactions?account=${account.id}`)); }}
                  className="flex-1 h-11 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <TrendingUp className="size-4 mr-2" /> Activity
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
