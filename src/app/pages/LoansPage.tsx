import { normalizeDecimalInput } from "../utils/decimalInput";
import { useI18n } from "../i18n/I18nProvider";
import { ProductPreviewDialog } from "../components/zapad/ProductPreviewDialog";
import { validMoney } from "../utils/goalRules";
import { loanSchedule, loanEstimate, loanInputErrors } from "../utils/loanMath";
import { cn } from "../components/ui/utils";
import { useState, useId, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Progress } from "../components/ui/progress";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { TrendDownIcon as TrendingDown } from "@phosphor-icons/react/dist/csr/TrendDown";
import { CalendarBlankIcon as Calendar } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { CheckCircleIcon as CheckCircle2 } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { BankIcon as Landmark } from "@phosphor-icons/react/dist/csr/Bank";
import { CalculatorIcon as Calculator } from "@phosphor-icons/react/dist/csr/Calculator";
import { ClockIcon as Clock } from "@phosphor-icons/react/dist/csr/Clock";
import { WarningCircleIcon as AlertCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { toast } from "sonner";
import { usePrivacy } from "../contexts/PrivacyContext";
import { profiles } from "../components/zapad/TopBar";
import { formatMoney, formatNumber } from "../utils/format";
import { PAGE_MAX_WIDTH } from "../utils/paths";

const LOAN_OUTSTANDING = 8420;
const LOAN_ORIGINAL = 15000;
const LOAN_MONTHLY = 320;
const SCHEDULE = loanSchedule(LOAN_OUTSTANDING, 5.2, LOAN_MONTHLY, 8).map((row, index) => ({
  ...row, month: new Date(2026, index + 4, 25), status: index === 0 ? "current" : "upcoming",
}));
const PAYMENT_INTEREST = SCHEDULE[0].interest;

function PaymentDialog({open,onClose}:{open:boolean;onClose:()=>void;isBusiness:boolean}) {
  const { t, intlLocale } = useI18n();
  const dueDate = new Date(2026, 4, 25).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" });
  return <ProductPreviewDialog open={open} onClose={onClose} title="Loan payment" options={[{name:"Loan LN-2024-0482"}]} initialAmount="320.00" details={amount=>[[t("Interest"),formatMoney(Math.min(amount,PAYMENT_INTEREST))],[t("Principal"),formatMoney(Math.max(0,amount-PAYMENT_INTEREST))],[t("Due date"),dueDate]]} maximum={LOAN_OUTSTANDING+PAYMENT_INTEREST} explanation="Illustrative payment allocation: interest first, then principal. This is not an early-settlement quote; product fees and effective rate require verified terms."/>;
}

function ScheduleSheet({ open, onClose, isPrivate }: { open: boolean; onClose: () => void; isPrivate: boolean }) {
  const { t, intlLocale } = useI18n();
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="p-8">
          <SheetHeader className="mb-7 text-left">
            <SheetTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              {t("Repayment schedule")}
            </SheetTitle>
            <SheetDescription>{t("Illustrative monthly payments at {rate}% p.a.; balances after each payment.", { rate: formatNumber(5.2) })}</SheetDescription>
          </SheetHeader>

          <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 overflow-hidden mb-5">
            <div className="hidden sm:grid grid-cols-4 gap-3 px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <span>{t("Month")}</span>
              <span className="text-right">{t("Principal")}</span>
              <span className="text-right">{t("Interest")}</span>
              <span className="text-right">{t("After payment")}</span>
            </div>
            {SCHEDULE.map((row) => (
              <div
                key={row.month.toISOString()}
                className={cn("grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3.5", row.status === "current" ? "bg-accent" : "")}
              >
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-sm font-medium text-slate-900">{row.month.toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}</div>
                  {row.status === "current" && (
                    <span className="text-micro font-medium text-accent-foreground uppercase tracking-wide">{t("Current")}</span>
                  )}
                </div>
                <div className="min-w-0 sm:text-right font-semibold text-sm text-slate-700">
                  <span className="block sm:hidden text-xs font-normal text-muted-foreground mb-1">{t("Principal")}</span>
                  {isPrivate ? "•••" : formatMoney(row.principal)}
                </div>
                <div className="min-w-0 sm:text-right font-semibold text-sm text-rose-600">
                  <span className="block sm:hidden text-xs font-normal text-muted-foreground mb-1">{t("Interest")}</span>
                  {isPrivate ? "•••" : formatMoney(row.interest)}
                </div>
                <div className="col-span-2 sm:col-span-1 min-w-0 sm:text-right font-medium text-sm text-slate-900">
                  <span className="block sm:hidden text-xs font-normal text-muted-foreground mb-1">{t("After payment")}</span>
                  {isPrivate ? "•••" : formatMoney(row.remaining)}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs font-normal text-slate-400 text-center">
            {t("Illustrative next 8 payments. PDF export is unavailable.")}
          </p>
          <Button
            onClick={() => toast.info(t("Schedule preview only — PDF export is not connected"))}
            className="w-full mt-4 h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            {t("PDF export unavailable")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LoanCalculator({ isBusiness }: { isBusiness: boolean }) {
  const { t } = useI18n();
  const fieldId = useId();
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5.2");
  const [months, setMonths] = useState("36");

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  const n = Number(months);
  const errors = loanInputErrors(principal, rate, months);
  const estimate = Object.values(errors).some(Boolean) ? null : loanEstimate(Number(principal), Number(rate), n);

  return (
    <Card className="p-7 border-slate-200/60 rounded-4xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2.5">
        <Calculator className="size-5 text-slate-400" /> {t("Loan calculator")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3 mb-5">
        {[
          { error: errors.principal, label: "Amount (€)", value: principal, onChange: setPrincipal, placeholder: "10000" },
          { error: errors.rate, label: "Rate (% p.a.)", value: rate, onChange: setRate, placeholder: "5.2" },
          { error: errors.months, label: "Term (months)", value: months, onChange: setMonths, placeholder: "36" },
        ].map((f, index) => (
          <div key={f.label} className="space-y-2">
            <Label htmlFor={`${fieldId}-${index}`} className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t(f.label)}</Label>
            <Input
              inputMode="decimal"
              id={`${fieldId}-${index}`}
              aria-invalid={!!f.error}
              aria-describedby={f.error ? `${fieldId}-${index}-error` : undefined}
              value={f.value}
              onChange={(e) => f.onChange(normalizeDecimalInput(e.target.value))}
              placeholder={f.placeholder}
              className="h-11 rounded-lg border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm"
            />
            {f.error && <p id={`${fieldId}-${index}-error`} className="text-sm text-destructive">{t(f.error)}</p>}
          </div>
        ))}
      </div>
      {!estimate && !Object.values(errors).some(Boolean) && <p role="status" className="text-sm text-destructive mb-4">{t("These values are too large to calculate. Reduce the amount, rate or term.")}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Monthly", value: estimate ? formatMoney(estimate.monthly) : "—", highlight: true },
          { label: "Total repaid", value: estimate ? formatMoney(estimate.total, "EUR", { decimals: 0 }) : "—" },
          { label: "Total interest", value: estimate ? formatMoney(estimate.interest, "EUR", { decimals: 0 }) : "—", dim: true },
        ].map((r) => (
          <div key={r.label} className="py-4 border-t border-border">
            <div className="text-xs font-medium uppercase tracking-wide mb-1 text-muted-foreground">{t(r.label)}</div>
            <div className="text-xl font-semibold text-foreground">{r.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function LoansPage() {
  const { t, intlLocale } = useI18n();
  const { isPrivate } = usePrivacy();
  const { profileId } = useOutletContext<{ profileId: string }>();
  const isBusiness = profiles.find((p) => p.id === profileId)?.kind === "business";

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-primary-foreground";

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applicationAmount, setApplicationAmount] = useState("10000");
  const [applicationTerm, setApplicationTerm] = useState("36");
  const applicationAmountValid = validMoney(applicationAmount) && Number(applicationAmount) <= (isBusiness ? 150000 : 25000);
  const applicationTermValid = Number.isInteger(Number(applicationTerm)) && Number(applicationTerm) >= 12 && Number(applicationTerm) <= 60;
  const applicationValid = applicationAmountValid && applicationTermValid;
  const applicationErrorId = useId();
  const [applyStep, setApplyStep] = useState<"form" | "success">("form");
  const resultTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (applyStep === "success") resultTitle.current?.focus();
  }, [applyStep]);

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Loans")}</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {t("Manage your loans and credit facilities")}
          </p>
        </div>
        <Button onClick={() => setApplyOpen(true)} className="h-11 px-5">
          {t("Apply for loan")}
        </Button>
      </div>

      {/* Active loan */}
      <Card className="p-8 border-slate-200/60 bg-white rounded-4xl shadow-sm">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{isBusiness ? t("Business loan") : t("Personal loan")}</h3>
            <p className="text-sm font-normal text-slate-400 mt-1">{t("Loan ID: {id}", { id: "LN-2024-0482" })}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-md bg-muted">
            {t("Active")}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Outstanding", value: formatMoney(LOAN_OUTSTANDING, "EUR", { decimals: 0 }) },
            { label: "Original", value: formatMoney(LOAN_ORIGINAL, "EUR", { decimals: 0 }) },
            { label: "Interest rate", value: t("{rate}% APR", { rate: formatNumber(5.2) }), highlight: true },
            { label: "Monthly", value: formatMoney(LOAN_MONTHLY, "EUR", { decimals: 0 }) },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0 py-3">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                {t(stat.label)}
              </div>
              <div className="text-xl font-semibold break-words text-foreground">
                {isPrivate ? "•••" : stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 mb-7">
          <div className="flex justify-between text-xs font-medium uppercase text-slate-400 tracking-wide">
            <span>{t("Repayment progress")}</span>
            <span className="text-slate-700">{Math.round((1 - LOAN_OUTSTANDING / LOAN_ORIGINAL) * 100)}%</span>
          </div>
          <Progress value={Math.round((1 - LOAN_OUTSTANDING / LOAN_ORIGINAL) * 100)} aria-label={t("Loan repayment")} />
          <div className="flex items-center justify-between text-sm font-normal text-slate-500">
            <span>{t("{amount} remaining", { amount: isPrivate ? "•••" : formatMoney(LOAN_OUTSTANDING, "EUR", { decimals: 0 }) })}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> {t("Next: {date}", { date: new Date(2026, 4, 25).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" }) })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setScheduleOpen(true)}
            className="h-12 px-6 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            {t("View schedule")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPaymentOpen(true)}
            className="h-12 px-6 rounded-lg font-medium bg-accent text-accent-foreground hover:bg-accent/80"
          >
            {t("Make payment")} <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </Card>

      {/* Illustrative loan offer */}
      <div className="border-y border-border py-6">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-muted-foreground mb-2">
              {t("Illustrative loan offer")}
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {isBusiness
                ? t("Working capital up to {amount}", { amount: formatMoney(150_000, "EUR", { decimals: 0 }) })
                : t("Personal loan up to {amount}", { amount: formatMoney(25_000, "EUR", { decimals: 0 }) })}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("{rate}% APR · 12–60 months · Preview only", { rate: formatNumber(isBusiness ? 4.2 : 4.9) })}
            </p>
          </div>
          <Button
            onClick={() => setApplyOpen(true)}
            variant="outline"
            className="shrink-0 h-11 px-5"
          >
            {t("Apply now")} <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      <LoanCalculator isBusiness={isBusiness} />

      {/* Modals */}
      {paymentOpen && <PaymentDialog open={paymentOpen} onClose={() => setPaymentOpen(false)} isBusiness={isBusiness} />}
      <ScheduleSheet open={scheduleOpen} onClose={() => setScheduleOpen(false)} isPrivate={isPrivate} />

      <Dialog open={applyOpen} onOpenChange={(v) => { if (!v) { setApplyStep("form"); setApplyOpen(false); } }}>
        <DialogContent className="sm:max-w-sm rounded-4xl p-8 border border-slate-200/60 shadow-xl">
          {applyStep === "form" ? (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-semibold text-slate-900">{t("Apply for a loan")}</DialogTitle>
                <DialogDescription className="text-sm font-normal text-slate-500 mt-1">
                  {t("Demo preview only. No credit decision or application will be sent.")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mb-7">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-widest">{t("Loan amount (€)")}</Label>
                  <Input aria-label={t("Loan amount (€)")} aria-invalid={!applicationAmountValid} aria-describedby={!applicationAmountValid ? applicationErrorId : undefined} inputMode="decimal" value={applicationAmount} onChange={e => setApplicationAmount(normalizeDecimalInput(e.target.value))} className="h-12 rounded-lg border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-widest">{t("Term (months)")}</Label>
                  <Input aria-label={t("Term (months)")} aria-invalid={!applicationTermValid} aria-describedby={!applicationTermValid ? applicationErrorId : undefined} inputMode="decimal" value={applicationTerm} onChange={e => setApplicationTerm(e.target.value)} className="h-12 rounded-lg border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm" />
                </div>
              </div>
              {!applicationValid && <p id={applicationErrorId} role="alert" className="text-sm text-slate-600">{t("Enter an amount within the advertised offer and a whole term of 12–60 months.")}</p>}
              <Button disabled={!applicationValid} onClick={() => applicationValid && setApplyStep("success")} className={cn("w-full h-12 px-6 rounded-lg font-medium shadow-sm", brandBg, brandHover, brandText)}>
                {t("Preview application")}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="size-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-10" />
              </div>
              <DialogTitle ref={resultTitle} tabIndex={-1} className="text-xl font-semibold text-slate-900">{t("Application preview complete")}</DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-sm max-w-55">
                {t("No application was submitted. This demo does not send SMS or email.")}
              </DialogDescription>
              <Button onClick={() => { setApplyStep("form"); setApplyOpen(false); }} className="w-full h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm mt-2">
                {t("Done")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
