import { exchangeReturnPath } from "../utils/paymentOrigin";
import { normalizeDecimalInput } from "../utils/decimalInput";
import { savePreview, isQuoteExpired } from "../utils/paymentPreview";
import { validMoney } from "../utils/goalRules";
import { cn } from "../components/ui/utils";
import { CurrencyFlag } from "../components/zapad/CurrencyIcon";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { resolveExchangeAccounts } from "../utils/exchangeAccounts";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  History,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { usePrivacy } from "../contexts/PrivacyContext";
import { useAppProfile } from "../hooks/useAppProfile";
import { getAccounts } from "../data/accounts";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";
import { formatMoney, formatNumber } from "../utils/format";

import { demoRate as getRate } from "../utils/paymentQuote";

const CURRENCY_META: Record<string, { label: string; change: number }> = {
  EUR: { label: "Euro", change: 0.0 },
  USD: { label: "US Dollar", change: +0.32 },
  GBP: { label: "British Pound", change: -0.18 },
  CHF: { label: "Swiss Franc", change: +0.12 },
  BAM: { label: "BAM", change: 0.0 },
  RSD: { label: "Serbian Dinar", change: -0.09 },
};

const PAIRS = [
  ["EUR", "USD"], ["EUR", "GBP"], ["EUR", "CHF"], ["EUR", "BAM"],
  ["USD", "EUR"], ["GBP", "EUR"], ["RSD", "EUR"],
];

const recentExchanges = [
  { from: "EUR", to: "USD", fromAmt: 500, toAmt: 543.5, date: "May 10" },
  { from: "USD", to: "EUR", fromAmt: 200, toAmt: 184.0, date: "Apr 28" },
];

export function ExchangePage() {
  const { isPrivate } = usePrivacy();
  const navigate = useNavigate();
  const { profile, profileSlug, isBusiness } = useAppProfile();


  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-white";

  const [params, setParams] = useSearchParams();
  const accounts = getAccounts(profile.kind);
  const { source: sourceAccount, destination: destinationAccount, invalidLink } = resolveExchangeAccounts(accounts, params.get("source"), params.get("target"));
  const returnPath = exchangeReturnPath(profileSlug, params, accounts.map(account => account.id));
  const returnLabel = returnPath ? params.get("origin") === "home" ? "Home" : "Account details" : "Payments";
  const fromCurrency = sourceAccount?.currency ?? "";
  const toCurrency = destinationAccount?.currency ?? "";
  const selectAccounts = (sourceId: string, targetId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("source", sourceId);
    nextParams.set("target", targetId);
    setParams(nextParams, { replace: true });
    setStep("form");
    setIntent(crypto.randomUUID());
  };
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) stepHeading.current?.focus();
    previousStep.current = step;
  }, [step]);

  const sourceAvailable = sourceAccount?.balance ?? 0;
  const rate = sourceAccount && destinationAccount && fromCurrency !== toCurrency ? getRate(fromCurrency, toCurrency) : 0;
  const currencies = [...new Set(getAccounts(profile.kind).map(a => a.currency))];
  const amountError = fromAmount !== "" && !validMoney(fromAmount)
    ? "Enter an amount greater than zero with up to two decimal places."
    : sourceAccount && Number(fromAmount) > sourceAvailable
      ? "This amount exceeds the available balance of the selected account." : "";
  const validQuote = validMoney(fromAmount) && Number(fromAmount) <= sourceAvailable && fromCurrency !== toCurrency && !!sourceAccount && !!destinationAccount && rate > 0;

  useEffect(() => {
    const num = parseFloat(fromAmount);
    setToAmount(!Number.isFinite(num) || rate <= 0 ? "" : (num * rate).toFixed(2));
  }, [fromAmount, fromCurrency, toCurrency, rate]);


  const handleSwap = () => {
    if (!sourceAccount || !destinationAccount) return;
    selectAccounts(destinationAccount.id, sourceAccount.id);
    setFromAmount(toAmount || "0");
  };

  const [intent, setIntent] = useState(() => crypto.randomUUID());
  const [reviewedAt, setReviewedAt] = useState(0);
  useEffect(() => {
    setStep("form");
    setReviewedAt(0);
    setIntent(crypto.randomUUID());
  }, [sourceAccount?.id, destinationAccount?.id]);
  const [clock, setClock] = useState(Date.now());
  useEffect(() => { if (step !== "confirm") return; const timer = setInterval(() => setClock(Date.now()),1000); return () => clearInterval(timer); },[step]);
  const expired = isQuoteExpired(reviewedAt,clock);
  const handleConfirm = () => {
    if (!validQuote || isQuoteExpired(reviewedAt)) { toast.error("Quote expired. Refresh and review the quote again."); return; }
    try {
      savePreview({id:intent,kind:profile.kind,createdAt:new Date().toISOString(),title:"Currency exchange",sourceId:sourceAccount!.id,destinationId:destinationAccount!.id,source:`${sourceAccount!.name} · ${sourceAccount!.iban}`,recipient:destinationAccount!.name,iban:destinationAccount!.iban,amount:Number(fromAmount),currency:fromCurrency,fee:0,total:Number(fromAmount),received:Number(toAmount),targetCurrency:toCurrency,note:`Illustrative rate ${rate}. Not a live quote.`,status:"Preview saved",initiator:profile.name,events:["Exchange reviewed locally. No conversion executed; both balances unchanged."]});
      setStep("success");
    } catch(e) { toast.error((e as Error).message); }
  };

  return (
    <div className={cn(PAGE_MAX_WIDTH, "@container mx-auto p-6 md:p-8 space-y-8")}>
      <div>
        <button className="inline-flex min-h-11 items-center text-sm text-primary mb-4" onClick={() => navigate(returnPath ?? profilePath(profileSlug,"payments"), { replace: true })}>← {returnLabel}</button>
        <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">
          Currency exchange
        </h1>
        <p className="text-base font-normal text-slate-500 mt-1.5">
          Illustrative exchange rates · Preview a currency exchange
        </p>
      </div>

      <div className="grid grid-cols-1 @4xl:grid-cols-product-detail gap-6">
        {/* Left — exchange widget */}
        <div className="min-w-0 space-y-5">
          {step === "form" && (
            <Card className="@container p-4 sm:p-8 border-slate-200/60 rounded-4xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-7">
                <h2 ref={stepHeading} tabIndex={-1} className="text-lg font-semibold text-slate-900">Exchange</h2>
                <Badge variant="secondary">Demo rates</Badge>
              </div>

              {invalidLink && <p role="status" className="mb-4 text-sm text-destructive">This link refers to an unavailable account. Select your source and destination accounts to continue.</p>}
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-5 focus-within:bg-white focus-within:border-slate-300 focus-within:shadow-sm transition-all">
                  <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-3">
                    From balance{sourceAccount ? ` · ${sourceAccount.name}` : ""}
                  </div>
                  <div className="flex flex-col items-stretch @sm:flex-row @sm:items-center gap-3 min-w-0">
                    <Input
                      aria-label="Exchange amount"
                      aria-invalid={!!amountError}
                      aria-describedby={amountError ? "exchange-amount-format exchange-amount-error" : "exchange-amount-format"}
                      type="text"
                      inputMode="decimal"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(normalizeDecimalInput(e.target.value))}
                      className="border-0 bg-transparent px-0 h-11 text-3xl md:text-3xl font-semibold shadow-none focus-visible:ring-0 text-slate-900 w-full @sm:w-0 flex-1 min-w-0"
                      placeholder="0"
                    />
                    <Select value={sourceAccount?.id ?? ""} onValueChange={id => selectAccounts(id, destinationAccount?.id ?? "")}>
                      <SelectTrigger aria-label="Source account" className="h-11 w-auto min-w-27.5 font-medium rounded-sm border-slate-200 bg-white shadow-sm text-slate-900 gap-2 shrink-0">
                        <SelectValue placeholder="Choose account">{sourceAccount && <span className="flex items-center gap-2"><CurrencyFlag currency={fromCurrency} /><span>{fromCurrency}</span></span>}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id} className="rounded-xl cursor-pointer py-2.5">
                            <span className="flex items-center gap-3 font-medium">
                              <CurrencyFlag currency={account.currency} />
                              <span>{account.name} · {account.currency}</span>
                              <span className="text-slate-400 font-semibold text-xs">{account.ibanShort}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p id="exchange-amount-format" className="mt-2 text-xs text-muted-foreground">Use a dot or comma for decimals, without thousands separators.</p>
                  {amountError && <p id="exchange-amount-error" role="status" className="mt-2 text-sm text-destructive">{amountError}</p>}
                  <div className="text-xs font-normal text-slate-400 mt-2">
                    {!sourceAccount ? "Choose an account to see its available balance." : isPrivate ? "Available: •••" : `Available: ${formatMoney(sourceAvailable, fromCurrency)}`}
                  </div>
                </div>

                <div className="flex justify-center py-1 relative z-10">
                  <button
                    aria-label="Swap source and destination accounts" disabled={!sourceAccount || !destinationAccount} onClick={handleSwap}
                    className="size-11 rounded-full bg-muted text-foreground border border-border flex items-center justify-center"
                  >
                    <ArrowUpDown className="size-4" />
                  </button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-5 transition-all">
                  <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-3">
                    To balance{destinationAccount ? ` · ${destinationAccount.name}` : ""}
                  </div>
                  <div className="flex flex-col items-stretch @sm:flex-row @sm:items-center gap-3 min-w-0">
                    <div className="text-3xl md:text-3xl font-semibold text-slate-900 w-full @sm:w-0 flex-1 min-w-0 tabular-nums break-words">
                      {rate > 0 ? formatNumber(parseFloat(toAmount) || 0, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) : "—"}
                    </div>
                    <Select value={destinationAccount?.id ?? ""} onValueChange={id => selectAccounts(sourceAccount?.id ?? "", id)}>
                      <SelectTrigger aria-label="Destination account" className="h-11 w-auto min-w-27.5 font-medium rounded-sm border-slate-200 bg-white shadow-sm text-slate-900 gap-2 shrink-0">
                        <SelectValue placeholder="Choose account">{destinationAccount && <span className="flex items-center gap-2"><CurrencyFlag currency={toCurrency} /><span>{toCurrency}</span></span>}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id} className="rounded-xl cursor-pointer py-2.5">
                            <span className="flex items-center gap-3 font-medium">
                              <CurrencyFlag currency={account.currency} />
                              <span>{account.name} · {account.currency}</span>
                              <span className="text-slate-400 font-semibold text-xs">{account.ibanShort}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-2">
                    {sourceAccount && destinationAccount ? fromCurrency === toCurrency ? "Choose accounts in different currencies." : `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}` : "Choose both accounts to see the rate."}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-muted border border-border">
                <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs font-normal text-muted-foreground">
                  Illustrative demo rate. No commission in this simulation; no real exchange is submitted.
                </p>
              </div>

              <Button
                disabled={!validQuote}
                onClick={() => {
                  if (!fromAmount || !Number.isFinite(Number(fromAmount)) || Number(fromAmount) <= 0) {
                    toast.error("Enter a valid amount");
                    return;
                  }
                  if (!sourceAccount || Number(fromAmount) > sourceAvailable) {
                    toast.error("Insufficient funds in the selected currency", { description: "Choose a funded currency account." });
                    return;
                  }
                  if (fromCurrency === toCurrency) { toast.error("Choose two different currencies"); return; }
                  if (!validQuote) return;
                  setReviewedAt(Date.now()); setClock(Date.now()); setStep("confirm");
                }}
                className={cn("w-full mt-6 h-14 px-8 rounded-lg font-medium text-lg shadow-md transition-all hover:shadow-lg zb-hover-lift", brandBg, brandHover, brandText)}
              >
                Review exchange
              </Button>
            </Card>
          )}

          {step === "confirm" && (
            <Card className="@container p-4 sm:p-8 border-slate-200/60 rounded-4xl bg-white shadow-sm">
              <h2 ref={stepHeading} tabIndex={-1} className="text-xl font-semibold text-slate-900 mb-4">Review exchange</h2>
              <p className="text-sm text-muted-foreground mb-4">From {sourceAccount?.name} · {sourceAccount?.ibanShort}<br/>To {destinationAccount?.name} · {destinationAccount?.ibanShort}</p>
              <p role="status" className="text-sm text-muted-foreground mb-4">{expired ? "Quote expired. Refresh before confirming." : "Illustrative quote · valid for 60 seconds after review. No bank request will be sent."}</p>
              {expired && <Button variant="outline" className="mb-4" onClick={()=>{setReviewedAt(Date.now());setClock(Date.now());}}>Refresh demo quote</Button>}
              <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 mb-7 overflow-hidden">
                <div className="flex flex-wrap justify-between items-center gap-2 px-5 py-4">
                  <span className="text-sm font-normal text-slate-500">You pay</span>
                  <span className="font-semibold text-slate-900"><CurrencyFlag currency={fromCurrency} /> {formatNumber(parseFloat(fromAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurrency}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 px-5 py-4">
                  <span className="text-sm font-normal text-slate-500">You receive</span>
                  <span className="font-semibold text-emerald-600"><CurrencyFlag currency={toCurrency} /> {formatNumber(parseFloat(toAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 px-5 py-4">
                  <span className="text-sm font-normal text-slate-500">Rate</span>
                  <span className="font-medium text-slate-700">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 px-5 py-4">
                  <span className="text-sm font-normal text-slate-500">Fee</span>
                  <span className="font-medium text-emerald-600">€0.00 · demo only</span>
                </div>
              </div>
              <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep("form")} className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700">Edit</Button>
                <Button disabled={expired || !validQuote} onClick={handleConfirm} className={cn("h-12 px-6 rounded-lg font-medium shadow-sm", brandBg, brandHover, brandText)}>Confirm in demo</Button>
              </div>
            </Card>
          )}

          {step === "success" && (
            <Card className="p-12 border-slate-200/60 rounded-4xl bg-white shadow-sm flex flex-col items-center text-center gap-5">
              <div data-slot="supporting-surface" className={cn("size-20 rounded-full", brandBg, "flex items-center justify-center shadow-lg")}>
                <CheckCircle2 className={cn("size-10", brandText)} />
              </div>
              <h2 ref={stepHeading} tabIndex={-1} className="text-2xl font-semibold tracking-tight text-slate-900">Demo exchange confirmed</h2>
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-slate-500 font-semibold leading-snug tabular-nums">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <CurrencyFlag currency={fromCurrency} /> {formatNumber(parseFloat(fromAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurrency}
                </span>
                <span aria-hidden="true">→</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <CurrencyFlag currency={toCurrency} /> {formatNumber(parseFloat(toAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </span>
              </p>
              <p className="text-sm text-slate-600">Local preview saved in Activity. No exchange executed; balances are unchanged.</p>
              <Button variant="outline" onClick={()=>navigate(profilePath(profileSlug,`transactions?preview=${intent}`))}>View in Activity</Button>
              <Button onClick={() => { setIntent(crypto.randomUUID()); setFromAmount(""); setStep("form"); }} className="mt-2 w-full h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white">
                New exchange
              </Button>
            </Card>
          )}

          {/* Recent exchanges */}
          <Card className="p-7 border-slate-200/60 rounded-4xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2.5">
              <History className="size-5 text-slate-400" /> Illustrative exchanges
            </h2>
            <div className="space-y-3">
              {recentExchanges.map((ex, i) => (
                <div key={i} className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xl">
                    <CurrencyFlag currency={ex.from} />
                    <ArrowUpDown className="size-3.5 text-slate-400" />
                    <CurrencyFlag currency={ex.to} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">
                      {ex.from} → {ex.to}
                    </div>
                    <div className="text-xs font-normal text-slate-400">{ex.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 text-sm">
                      {isPrivate ? "•••" : `${formatNumber(ex.fromAmt, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${ex.from}`}
                    </div>
                    <div className="text-xs font-semibold text-emerald-600">
                      {isPrivate ? "•••" : `→ ${formatNumber(ex.toAmt, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${ex.to}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — reference rates */}
        <div className="min-w-0 space-y-5">
          <Card className="p-7 border-slate-200/60 rounded-4xl bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Reference rates</h2>
              <Badge variant="secondary">Demo rates</Badge>
            </div>
            <div className="space-y-2">
              {PAIRS.filter(([from, to]) => currencies.includes(from) && currencies.includes(to)).map(([from, to], i) => {
                const r = getRate(from, to);
                const meta = CURRENCY_META[to];
                const isPos = meta.change >= 0;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const source = sourceAccount?.currency === from ? sourceAccount : accounts.find(account => account.currency === from);
                      const destination = destinationAccount?.currency === to ? destinationAccount : accounts.find(account => account.currency === to);
                      if (source && destination) selectAccounts(source.id, destination.id);
                    }}
                    className="w-full flex flex-wrap items-center gap-3 p-3.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="flex items-center gap-1 text-base">
                      <CurrencyFlag currency={from} />
                      <span className="text-slate-300 text-xs">→</span>
                      <CurrencyFlag currency={to} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-900 text-sm">{from}/{to}</div>
                      <div className="text-xs font-normal text-slate-400">1 {from} = {r.toFixed(4)} {to}</div>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full", isPos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                      {isPos ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {meta.change === 0 ? "—" : `${isPos ? "+" : ""}${meta.change}%`}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-7 border-slate-200/60 rounded-4xl bg-slate-50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-sm bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Rate alert</div>
                <p className="text-sm font-normal text-slate-500 mt-1 leading-snug">
                  Rate alerts are unavailable in this prototype.
                </p>
                <Button
                  variant="link"
                  className="px-0 h-auto mt-2 text-sm font-medium text-blue-600 hover:no-underline"
                  disabled
                >
                  Alerts unavailable
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
