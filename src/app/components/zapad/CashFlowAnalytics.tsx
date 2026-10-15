import { useEffect, useId, useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useI18n } from "../../i18n/I18nProvider";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { formatMoney, formatNumber } from "../../utils/format";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/csr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { getCashFlow, getCashFlowComparison, getCashFlowPointComparison, readCashFlowSelection, saveCashFlowSelection } from "../../data/cashFlow";

import type { ProfileKind } from "../../data/types";

export function CashFlowAnalytics({ profileKind }: { profileKind: ProfileKind }) {
  const { t, intlLocale } = useI18n();
  const { isPrivate } = usePrivacy();
  const id = useId().replace(/:/g, "");
  const [selection, setSelection] = useState(() => readCashFlowSelection(profileKind));
  const { period, selectedMonth } = selection;
  useEffect(() => { saveCashFlowSelection(profileKind, selection); }, [profileKind, selection]);
  const quarter = Math.floor(selectedMonth / 3);
  const firstMonth = period === "quarter" ? quarter * 3 : selectedMonth;
  const previousDisabled = period === "year" || (period === "month" ? selectedMonth === 0 : quarter === 0);
  const nextDisabled = period === "year" || (period === "month" ? selectedMonth === 11 : quarter === 3);
  const data = getCashFlow(profileKind, period, selectedMonth).map(row => ({
    ...row,
    comparison: getCashFlowPointComparison(profileKind, period, row.month, row.day),
    label: new Intl.DateTimeFormat(intlLocale, period === "month" ? { day: "numeric" } : { month: "short" }).format(new Date(2026, row.month, row.day)),
    fullLabel: new Intl.DateTimeFormat(intlLocale, period === "month" ? { day: "numeric", month: "long", year: "numeric" } : { month: "long", year: "numeric" }).format(new Date(2026, row.month, row.day)),
  }));
  const periodLabel = period === "year" ? "2026" : period === "month"
    ? new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(new Date(2026, selectedMonth, 1))
    : new Intl.DateTimeFormat(intlLocale, { month: "short", year: "numeric" }).formatRange(new Date(2026, firstMonth, 1), new Date(2026, firstMonth + 3, 0));
  const maxValue = Math.max(...data.flatMap(row => [row.income, -row.spending]));
  const axisStep = 10 ** Math.floor(Math.log10(maxValue)) / 2;
  const axisMax = Math.ceil(maxValue / axisStep) * axisStep;
  const config = {
    income: { label: t("Income"), color: "var(--bank-cashflow-income)" },
    spending: { label: t("Spending"), color: "var(--bank-cashflow-spending)" },
  };
  const comparison = getCashFlowComparison(profileKind, period, selectedMonth);
  const previousPeriodLabel = comparison && period === "year" ? String(comparison.previousYear) : comparison ? new Intl.DateTimeFormat(intlLocale, { month: "short", year: "numeric" }).formatRange(new Date(comparison.previousYear, comparison.previousStartMonth, 1), new Date(comparison.previousYear, comparison.previousEndMonth + 1, 0)) : "";
  const changeText = (change: NonNullable<typeof comparison>["income"]) => ({
    amount: `${change.difference > 0 ? "+" : ""}${formatMoney(change.difference, "EUR")}`,
    percent: change.percent === null ? t("Percentage unavailable") : formatNumber(change.percent / 100, { style: "percent", signDisplay: "exceptZero", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  });
  const income = data.reduce((total, row) => total + Math.round(row.income * 100), 0) / 100;
  const spending = data.reduce((total, row) => total + Math.round(-row.spending * 100), 0) / 100;

  return <Card className="p-4 md:p-6 min-w-0 space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2>{t("Income and expenses")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("Illustrative scenario · {period} · EUR", { period: periodLabel })}</p>
      </div>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><span className="cashflow-income-key size-2.5 rounded-full" />{t("Income")}</span>
        <span className="flex items-center gap-2"><span className="cashflow-spending-key size-2.5 rounded-full" />{t("Spending")}</span>
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
    <ToggleGroup type="single" value={period} onValueChange={value => { if (value === "month" || value === "quarter" || value === "year") setSelection(previous => ({ ...previous, period: value })); }} aria-label={t("Chart period")} className="cashflow-period-switch">
      <ToggleGroupItem value="month" className="min-h-11 px-4">{t("Month")}</ToggleGroupItem>
      <ToggleGroupItem value="quarter" className="min-h-11 px-4">{t("Quarter")}</ToggleGroupItem>
      <ToggleGroupItem value="year" className="min-h-11 px-4">{t("Year")}</ToggleGroupItem>
    </ToggleGroup>
    <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
      <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label={t("Previous period")} disabled={previousDisabled} onClick={() => setSelection(previous => ({ ...previous, selectedMonth: Math.max(0, previous.selectedMonth - (previous.period === "quarter" ? 3 : 1)) }))}><CaretLeftIcon className="size-5" aria-hidden="true" /></Button>
      <Select value={period === "year" ? "2026" : String(period === "month" ? selectedMonth : quarter)} onValueChange={value => setSelection(previous => ({ ...previous, selectedMonth: previous.period === "quarter" ? Number(value) * 3 + previous.selectedMonth % 3 : Number(value) }))} disabled={period === "year"}>
        <SelectTrigger aria-label={t("Choose chart period")} className="min-h-11 flex-1 min-w-0 sm:min-w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          {period === "year" ? <SelectItem value="2026">2026</SelectItem> : period === "month" ? Array.from({ length: 12 }, (_, month) => <SelectItem key={month} value={String(month)}>{new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(new Date(2026, month, 1))}</SelectItem>) : Array.from({ length: 4 }, (_, index) => <SelectItem key={index} value={String(index)}>{t("Quarter {number}", { number: index + 1 })} · 2026</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label={t("Next period")} disabled={nextDisabled} onClick={() => setSelection(previous => ({ ...previous, selectedMonth: Math.min(11, previous.selectedMonth + (previous.period === "quarter" ? 3 : 1)) }))}><CaretRightIcon className="size-5" aria-hidden="true" /></Button>
    </div>
    </div>
    <div className="space-y-2" aria-live="polite" aria-atomic="true">
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        {(["income", "spending"] as const).map(metric => <div key={metric} className="min-w-0">
          <dt className="text-sm text-muted-foreground">{t(metric === "income" ? "Income" : "Spending")}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{isPrivate ? "••••" : formatMoney(metric === "income" ? income : spending, "EUR")}</dd>
          {comparison && <dd className="mt-2 flex flex-wrap items-center gap-2 text-sm tabular-nums">
            {isPrivate ? <span className="text-muted-foreground">••••</span> : <><span className="text-muted-foreground">{changeText(comparison[metric]).amount}</span><Badge variant="secondary">{changeText(comparison[metric]).percent}</Badge></>}
          </dd>}
        </div>)}
      </dl>
      <p className="text-xs text-muted-foreground">{comparison ? t("Compared with {period}", { period: previousPeriodLabel }) : t("No previous-period data in this illustrative scenario.")}</p>
    </div>
    {isPrivate ? <div className="h-80 flex items-center justify-center rounded-xl bg-muted text-muted-foreground">{t("Chart hidden while balances are private.")}</div> : <>
      <div aria-hidden="true">
        <ChartContainer config={config} className="h-80 w-full aspect-auto">
          <BarChart data={data} stackOffset="sign" maxBarSize={64} barCategoryGap="18%" margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`${id}-income`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--bank-cashflow-income)" stopOpacity={0.85} />
                <stop offset="100%" stopColor="var(--bank-cashflow-income-light)" stopOpacity={0.22} />
              </linearGradient>
              <linearGradient id={`${id}-spending`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--bank-cashflow-spending-light)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--bank-cashflow-spending)" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--bank-line)" strokeDasharray="3 6" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} minTickGap={8} />
            <YAxis domain={[-axisMax, axisMax]} ticks={[-axisMax, -axisMax / 2, 0, axisMax / 2, axisMax]} width={64} axisLine={false} tickLine={false} tickFormatter={value => formatNumber(Math.abs(value), { notation: "compact", maximumFractionDigits: 1 })} />
            <ReferenceLine y={0} stroke="var(--bank-control-line)" />
            <ChartTooltip cursor={{ fill: "var(--bank-material-canvas)", opacity: 0.5 }} content={<ChartTooltipContent className="cashflow-tooltip w-72 max-w-full p-3 gap-3" labelFormatter={(_, entries) => {
              const row = entries?.[0]?.payload as typeof data[number] | undefined;
              if (!row) return null;
              const previous = row.comparison;
              const previousLabel = previous ? new Intl.DateTimeFormat(intlLocale, period === "month" ? { day: "numeric", month: "short", year: "numeric" } : { month: "long", year: "numeric" }).format(new Date(previous.previousYear, previous.previousMonth, previous.previousDay)) : "";
              return <div className="space-y-1"><p>{row.fullLabel}</p><p className="text-xs font-normal text-muted-foreground">{previous ? t("Compared with {period}", { period: previousLabel }) : t("No matching day in the previous month.")}</p></div>;
            }} formatter={(value, name, entry) => {
              const metric = name === "income" ? "income" : "spending";
              const point = (entry.payload as typeof data[number]).comparison?.[metric];
              return <div className="w-full space-y-1.5 border-t border-border pt-2 text-sm">
                <div className="flex items-center justify-between gap-3"><span className="font-medium">{t(metric === "income" ? "Income" : "Spending")}</span><span className="font-semibold tabular-nums">{formatMoney(Math.abs(Number(value)), "EUR")}</span></div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{t("Previous period")}</span><span className="tabular-nums">{point ? formatMoney(point.previous, "EUR") : "—"}</span></div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span>{t("Difference")}</span>{point ? <span className="inline-flex flex-wrap items-center justify-end gap-2 tabular-nums"><span>{changeText(point).amount}</span><Badge variant="secondary">{changeText(point).percent}</Badge></span> : <span>—</span>}</div>
              </div>;
            }} />} />
            <Bar dataKey="income" stackId="cashflow" fill={`url(#${id}-income)`} radius={8} isAnimationActive={false} className="cashflow-bar" />
            <Bar dataKey="spending" stackId="cashflow" fill={`url(#${id}-spending)`} radius={8} isAnimationActive={false} className="cashflow-bar" />
          </BarChart>
        </ChartContainer>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer min-h-11 flex items-center underline underline-offset-4 text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">{t("View chart data")}</summary>
        <div role="region" aria-label={t("Income and expenses")} tabIndex={0} className="max-w-full overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-ring">
        <table className="w-full text-left tabular-nums">
          <caption className="sr-only">{t("Income and expenses")}</caption>
          <thead><tr className="border-b"><th scope="col" className="py-2 font-medium">{t("Period")}</th><th scope="col" className="py-2 text-right font-medium">{t("Income")}</th><th scope="col" className="py-2 text-right font-medium">{t("Spending")}</th></tr></thead>
          <tbody>{data.map(row => <tr key={row.fullLabel} className="border-b"><th scope="row" className="py-2 font-normal">{row.fullLabel}</th><td className="py-2 text-right">{formatMoney(row.income)}</td><td className="py-2 text-right">{formatMoney(-row.spending)}</td></tr>)}</tbody>
        </table>
        </div>
      </details>
    </>}
  </Card>;
}
