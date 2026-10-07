import { cn } from "../ui/utils";
import { CurrencyFlag } from "./CurrencyIcon";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { ArrowUpDown, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { profiles } from "./TopBar";
import confetti from "canvas-confetti";
import { formatNumber } from "../../utils/format";

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RATES: Record<string, Record<string, number>> = {
  EUR: { USD: 1.087, GBP: 0.851, CHF: 0.967, BAM: 1.956, RSD: 117.0 },
  USD: { EUR: 0.920, GBP: 0.783, CHF: 0.890, BAM: 1.799, RSD: 107.6 },
  GBP: { EUR: 1.175, USD: 1.277, CHF: 1.136, BAM: 2.297, RSD: 137.4 },
  CHF: { EUR: 1.034, USD: 1.124, GBP: 0.880, BAM: 2.025, RSD: 121.0 },
  BAM: { EUR: 0.511, USD: 0.556, GBP: 0.435, CHF: 0.494, RSD: 59.82 },
  RSD: { EUR: 0.00855, USD: 0.00929, GBP: 0.00728, CHF: 0.00826, BAM: 0.01672 },
};

const CURRENCY_META: Record<string, { label: string }> = {
  EUR: { label: "Euro" },
  USD: { label: "US Dollar" },
  GBP: { label: "British Pound" },
  CHF: { label: "Swiss Franc" },
  BAM: { label: "BAM" },
  RSD: { label: "Serbian Dinar" },
};

function getRate(from: string, to: string): number {
  if (from === to) return 1;
  return RATES[from]?.[to] ?? 1;
}

export function ExchangeModal({ open, onOpenChange }: ExchangeModalProps) {
  const { profileId } = useOutletContext<{ profileId: string }>();
  const isBusiness =
    profiles.find((p) => p.id === profileId)?.kind === "business";

  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromAmount, setFromAmount] = useState("1000");
  const [toAmount, setToAmount] = useState("");
  const [lastUpdated, setLastUpdated] = useState(5);

  const brandColor = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-white";

  const rate = getRate(fromCurrency, toCurrency);

  useEffect(() => {
    const num = parseFloat(fromAmount);
    if (!isNaN(num)) {
      setToAmount((num * rate).toFixed(2));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCurrency, toCurrency, rate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((n) => n + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    const prevFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(prevFrom);
    setFromAmount(toAmount || "0");
  };

  const handleConfirm = () => {
    setStep("success");
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: isBusiness
        ? ["#ff6a13", "#ffa155", "#1e293b"]
        : ["#0a3d91", "#1862c7", "#ffffff"],
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setFromCurrency("EUR");
      setToCurrency("USD");
      setFromAmount("1000");
    }, 300);
  };

  const currencies = Object.keys(CURRENCY_META);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-4xl border border-slate-200/60 shadow-panel">
        {step === "form" && (
          <div className="p-8 md:p-10">
            <DialogHeader className="mb-7">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                    Exchange
                  </DialogTitle>
                  <DialogDescription className="text-sm font-normal text-slate-500 mt-1">
                    Illustrative rates · Simulated exchange.
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 uppercase tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Demo
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              {/* From */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 focus-within:bg-white focus-within:border-slate-300 focus-within:shadow-sm transition-all">
                <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-3">
                  You pay
                </div>
                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="border-0 bg-transparent px-0 h-11 text-4xl font-semibold shadow-none focus-visible:ring-0 text-slate-900 w-0 flex-1 min-w-0"
                    placeholder="0"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="h-11 w-auto min-w-27.5 font-medium rounded-sm border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-900 gap-2 shrink-0">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <CurrencyFlag currency={fromCurrency} />
                          <span>{fromCurrency}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {currencies
                        .filter((c) => c !== toCurrency)
                        .map((c) => (
                          <SelectItem key={c} value={c} className="rounded-xl cursor-pointer py-2.5">
                            <span className="flex items-center gap-3 font-medium">
                              <CurrencyFlag currency={c} />
                              <span>{c}</span>
                              <span className="text-slate-400 font-semibold">{CURRENCY_META[c].label}</span>
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center py-1 relative z-10">
                <button
                  onClick={handleSwap}
                  className={cn("size-11 rounded-full", brandColor, brandText, "flex items-center justify-center shadow-lg ring-4 ring-white zb-active-scale-95")}
                >
                  <ArrowUpDown className="size-4" />
                </button>
              </div>

              {/* To */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all">
                <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-3">
                  You receive
                </div>
                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  <div className="text-4xl font-semibold text-slate-900 w-0 flex-1 min-w-0 tabular-nums truncate">
                    {toAmount || "0.00"}
                  </div>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="h-11 w-auto min-w-27.5 font-medium rounded-sm border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-900 gap-2 shrink-0">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <CurrencyFlag currency={toCurrency} />
                          <span>{toCurrency}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {currencies
                        .filter((c) => c !== fromCurrency)
                        .map((c) => (
                          <SelectItem key={c} value={c} className="rounded-xl cursor-pointer py-2.5">
                            <span className="flex items-center gap-3 font-medium">
                              <CurrencyFlag currency={c} />
                              <span>{c}</span>
                              <span className="text-slate-400 font-semibold">{CURRENCY_META[c].label}</span>
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Rate info */}
            <div className="mt-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <TrendingUp className="size-4 text-emerald-500" />
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </div>
              <span className="text-xs font-normal text-slate-400">
                Updated {lastUpdated}s ago
              </span>
            </div>

            <div className="mt-2 flex items-start gap-2.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
              <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-blue-700">
                Demo quote only. No real exchange is submitted.
              </p>
            </div>

            <Button
              onClick={() => {
                if (!fromAmount || parseFloat(fromAmount) <= 0) {
                  toast.error("Enter a valid amount");
                  return;
                }
                setStep("confirm");
              }}
              className={cn("w-full mt-6 h-14 px-8 rounded-lg font-medium text-lg shadow-md transition-all hover:shadow-lg zb-hover-lift", brandColor, brandHover, brandText)}
            >
              Review Exchange
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-8 md:p-10">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Confirm exchange
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-1">
                This is a binding exchange at the current rate.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 mb-7 overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm font-normal text-slate-500">You pay</span>
                <span className="text-base font-semibold text-slate-900">
                  <CurrencyFlag currency={fromCurrency} /> {formatNumber(parseFloat(fromAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm font-normal text-slate-500">You receive</span>
                <span className="text-base font-semibold text-emerald-600">
                  <CurrencyFlag currency={toCurrency} /> {formatNumber(parseFloat(toAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm font-normal text-slate-500">Rate</span>
                <span className="text-sm font-medium text-slate-700">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm font-normal text-slate-500">Fee</span>
                <span className="text-sm font-medium text-emerald-600">Free</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Button>
              <Button
                onClick={handleConfirm}
                className={cn("h-12 px-6 rounded-lg font-medium shadow-md transition-all hover:shadow-lg", brandColor, brandHover, brandText)}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-5 bg-white min-h-105">
            <div data-slot="supporting-surface" className={cn("size-24 rounded-full", brandColor, "flex items-center justify-center shadow-lg")}>
              <CheckCircle2 className={cn("size-12", brandText)} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Exchanged!
            </h2>
            <p className="text-slate-500 font-semibold text-lg max-w-65 leading-snug">
              <CurrencyFlag currency={fromCurrency} />{" "}
              {formatNumber(parseFloat(fromAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurrency} →{" "}
              <CurrencyFlag currency={toCurrency} />{" "}
              {formatNumber(parseFloat(toAmount) || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 w-full h-14 px-8 rounded-lg font-medium text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-md"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
