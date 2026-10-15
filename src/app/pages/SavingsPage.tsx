import { FieldFeedback } from "../components/ui/field-feedback";
import { normalizeDecimalInput } from "../utils/decimalInput";
import { localizedGoalName } from "../i18n/display";
import { useI18n } from "../i18n/I18nProvider";
import { savingsEstimate } from "../utils/savingsMath";
import { toast } from "sonner";
import { ProductPreviewDialog } from "../components/zapad/ProductPreviewDialog";
import { validMoney } from "../utils/goalRules";
import { getAccounts } from "../data/accounts";
import { cn } from "../components/ui/utils";
import { GoalDialog } from "../components/zapad/GoalDialog";
import { useState, useId } from "react";
import { useNavigate, useParams } from "react-router";
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
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { PiggyBankIcon as PiggyBank } from "@phosphor-icons/react/dist/csr/PiggyBank";
import { TrendUpIcon as TrendingUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import { TargetIcon as Target } from "@phosphor-icons/react/dist/csr/Target";
import { CalculatorIcon as Calculator } from "@phosphor-icons/react/dist/csr/Calculator";
import { CheckCircleIcon as CheckCircle2 } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { MoneyIcon as Banknote } from "@phosphor-icons/react/dist/csr/Money";
import { LockSimpleIcon as Lock } from "@phosphor-icons/react/dist/csr/LockSimple";
import { LockSimpleOpenIcon as Unlock } from "@phosphor-icons/react/dist/csr/LockSimpleOpen";
import { usePrivacy } from "../contexts/PrivacyContext";
import { useAppProfile } from "../hooks/useAppProfile";
import { useGoals, unallocatedSavings } from "../data/goals";
import { formatMoney, formatNumber } from "../utils/format";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

function DepositDialog({open,onClose,account,operation}:{open:boolean;onClose:()=>void;account:{name:string;rate:string;balance?:number}|null;isBusiness:boolean;operation:"Deposit"|"Withdraw"}) {
  const { t } = useI18n();
  if (open && account?.name === "Fixed deposit 12m") {
    return <ProductPreviewDialog open={open} onClose={onClose} title="Fixed deposit" options={[{name:account.name}]} explanation="Illustrative 12-month deposit · Product preview only" details={() => [[t("APY"), `${formatNumber(Number(account.rate))}%`], [t("Term (months)"), "12"]]} />;
  }
 return open && account ? <ProductPreviewDialog open={open} onClose={onClose} title={operation === "Withdraw" ? "Savings withdrawal" : "Savings deposit"} options={[{name:account.name}]} savings={account.name} direction={operation==="Withdraw"?"withdraw":"deposit"} explanation="Savings goals allocate the existing savings balance; they do not create extra funds. Interest estimates exclude taxes and changes in rates."/> : null;
}

function ApyCalculator({ isBusiness }: { isBusiness: boolean }) {
  const { t } = useI18n();
  const fieldId = useId();
  const [principal, setPrincipal] = useState("5000");
  const [rate, setRate] = useState("3.2");
  const [years, setYears] = useState("1");

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  const valid = [principal, rate, years].every(value => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0);
  const estimate = valid ? savingsEstimate(Number(principal), Number(rate), Number(years)) : null;
  const error = !valid ? "Enter non-negative amounts, a rate and a duration."
    : !estimate ? "These values are too large to calculate reliably. Reduce the deposit, rate or duration." : "";

  return (
    <Card className="p-7 border-slate-200/60 rounded-4xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2.5">
        <Calculator className="size-5 text-slate-400" /> {t("Returns calculator")}
      </h3>
      <div data-form-fields="calculator" className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3 mb-5">
        {[
          { label: "Initial deposit (€)", value: principal, onChange: setPrincipal },
          { label: "APY (%)", value: rate, onChange: setRate },
          { label: "Duration (years)", value: years, onChange: setYears },
        ].map((f, index) => (
          <div key={f.label} className="space-y-2">
            <Label htmlFor={`${fieldId}-${index}`} className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t(f.label)}</Label>
            <Input
              inputMode="decimal" min="0" id={`${fieldId}-${index}`}
              aria-invalid={!f.value.trim() || !Number.isFinite(Number(f.value)) || Number(f.value) < 0}
              aria-describedby={error ? `${fieldId}-error` : undefined}
              value={f.value}
              onChange={(e) => f.onChange(normalizeDecimalInput(e.target.value))}
              className="h-11 rounded-lg border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm"
            />
          </div>
        ))}
      </div>
      {error && <FieldFeedback tone="error" id={`${fieldId}-error`} role="status" className="text-sm text-slate-600 mb-4">{t(error)}</FieldFeedback>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Final balance", value: estimate ? formatMoney(estimate.finalAmount) : "—", highlight: true },
          { label: "Interest earned", value: estimate ? formatMoney(estimate.interest) : "—" },
          { label: "Growth", value: estimate ? `+${formatNumber(estimate.growth, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : "—", positive: true },
        ].map((r) => (
          <div key={r.label} className="rounded-lg p-4 bg-muted border border-border">
            <div className="text-xs font-medium uppercase tracking-wide mb-1 text-muted-foreground">{t(r.label)}</div>
            <div className="text-xl font-semibold text-foreground">{r.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SavingsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const { profileSlug, isBusiness } = useAppProfile();

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-primary-foreground";

  const [operation, setOperation] = useState<"Deposit" | "Withdraw">("Deposit");
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAccount, setDepositAccount] = useState<{ name: string; rate: string; balance?: number } | null>(null);

  const savingsAccounts = getAccounts(isBusiness ? "business" : "personal")
    .filter(account => account.type === "Savings account")
    .map(account => ({ name: account.name, balance: account.balance, rate: "1.8", iban: account.ibanShort, status: "Active", icon: PiggyBank, color: "bg-orange-100 text-orange-600" }));

  const kind = isBusiness ? "business" : "personal";
  const goals = useGoals(kind);
  const [creatingGoal, setCreatingGoal] = useState(false);
  const { goalId } = useParams();
  const selectedGoal = goals.find(goal => goal.id === goalId);
  const openDeposit = (acc: { name: string; rate: string; balance?: number }, mode: "Deposit" | "Withdraw" = "Deposit") => {
    setOperation(mode);
    setDepositAccount(acc);
    setDepositOpen(true);
  };

  if (goalId && !selectedGoal) return <div className="p-8 space-y-4"><h1 className="text-2xl font-semibold">{t("Goal not found")}</h1><p>{t("This goal is not available in this profile.")}</p><Button variant="outline" onClick={() => navigate(profilePath(profileSlug, "savings"))}>{t("Back to savings")}</Button></div>;

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Savings")}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(profilePath(profileSlug, "accounts?open=new"))} className="h-11 px-4 text-muted-foreground">
            {t("Open account")}
          </Button>
          <Button onClick={() => setCreatingGoal(true)} className="h-11 px-5">
            <Plus className="size-4" /> {t("New goal")}
          </Button>
        </div>
      </div>

      {/* Savings goals preview */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{t("Savings goals")}</h2>
        </div>
        <p className="text-sm text-slate-600">{t("{count} goals · {amount} unallocated savings", { count: goals.length, amount: isPrivate ? "•••" : formatMoney(unallocatedSavings(kind)) })}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <button data-bank-surface type="button" onClick={() => navigate(profilePath(profileSlug, `savings/goals/${goal.id}`))} key={localizedGoalName(goal)} className="text-left p-5 rounded-xl bg-white border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div data-slot="functional-icon" className="shrink-0 size-9 rounded-action-inner bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Icon className="size-4" />
                    </div>
                    <span className="font-semibold text-slate-900 wrap-anywhere min-w-0">{localizedGoalName(goal)}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-400 shrink-0 ml-2">{pct}%</span>
                </div>
                <Progress value={pct} aria-label={t("{goal} saved", { goal: localizedGoalName(goal) })} className="mb-2" />
                <div className="flex justify-between text-xs font-normal text-slate-400">
                  <span>{isPrivate ? "•••" : formatMoney(goal.current, "EUR")}</span>
                  <span>{isPrivate ? "•••" : formatMoney(goal.target, "EUR")}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Savings accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{t("Your savings accounts")}</h2>
        <div className="grid grid-cols-1 gap-4">
          {savingsAccounts.map((acc) => {
            const Icon = acc.icon;
            const isLocked = acc.status.startsWith("Locked");
            return (
              <Card key={acc.name} className="p-7 border-slate-200/60 bg-white rounded-4xl shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div data-slot="functional-icon" className="size-11 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{t(acc.name)}</div>
                      <div className="text-xs font-normal text-slate-400 mt-0.5">{acc.iban}</div>
                    </div>
                  </div>
                  <span className={cn("text-xs font-medium px-3 py-1.5 rounded-full", isLocked ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100")}>
                    {isLocked ? <span className="flex items-center gap-1"><Lock className="size-3" /> {t(acc.status)}</span> : t(acc.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 border-y border-border">
                  <div className="py-3 min-w-0">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{t("Balance")}</div>
                    <div className="text-xl font-semibold text-slate-900">
                      {isPrivate ? "•••" : formatMoney(acc.balance, "EUR", { decimals: 0 })}
                    </div>
                  </div>
                  <div className="py-3 min-w-0">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{t("APY")}</div>
                    <div className="text-xl font-semibold text-foreground">{formatNumber(Number(acc.rate))}%</div>
                  </div>
                  <div className="py-3 min-w-0">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{t("Est. annual interest")}</div>
                    <div className="text-xl font-semibold text-slate-900">
                      {isPrivate ? "•••" : formatMoney(acc.balance * parseFloat(acc.rate) / 100, "EUR", { decimals: 0 })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  {!isLocked ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openDeposit(acc, "Withdraw")}
                        className="h-11 px-5 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      >
                        <Unlock className="size-4 mr-2" /> {t("Withdraw")}
                      </Button>
                      <Button variant="outline"
                        onClick={() => openDeposit(acc)}
                        className="h-11 px-5 rounded-lg font-medium"
                      >
                        <Banknote className="size-4 mr-2" /> {t("Deposit")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-11 px-5 rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 col-span-2"
                      onClick={() => toast.info(t("Fixed deposit"), { description: t("Demo deposit locked until December 2026. Early withdrawal is unavailable in this preview.") })}
                    >
                      {t("View details")}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {(selectedGoal || creatingGoal) && <GoalDialog key={selectedGoal?.id ?? "new"} kind={kind} goalId={selectedGoal?.id} onClose={() => { setCreatingGoal(false); if (selectedGoal) navigate(profilePath(profileSlug, "savings")); }} />}

      {/* Deposit product */}
      <div className="border-y border-border py-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{t("Earn {rate}% APY on EUR deposits", { rate: formatNumber(3.2) })}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("Illustrative 12-month deposit · Product preview only")}
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 h-11 px-5"
            onClick={() => openDeposit({ name: "Fixed deposit 12m", rate: "3.2" })}
          >
            {t("Open account")} <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      <ApyCalculator isBusiness={isBusiness} />

      <DepositDialog
        key={`${operation}-${depositAccount?.name}`}
        operation={operation}
        open={depositOpen}
        onClose={() => { setDepositOpen(false); setDepositAccount(null); }}
        account={depositAccount}
        isBusiness={isBusiness}
      />
    </div>
  );
}
