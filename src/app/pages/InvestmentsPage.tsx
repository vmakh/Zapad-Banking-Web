import { dateFormatter } from "../utils/localeFormats";
import { useI18n } from "../i18n/I18nProvider";
import { ProductPreviewDialog } from "../components/zapad/ProductPreviewDialog";
import { validMoney } from "../utils/goalRules";
import { cn } from "../components/ui/utils";
import { useState, useId, useMemo } from "react";
import { useOutletContext } from "react-router";
import { Card } from "../components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendUpIcon as TrendingUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import { TrendDownIcon as TrendingDown } from "@phosphor-icons/react/dist/csr/TrendDown";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { CheckCircleIcon as CheckCircle2 } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon as Info } from "@phosphor-icons/react/dist/csr/Info";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { toast } from "sonner";
import { usePrivacy } from "../contexts/PrivacyContext";
import { profiles } from "../components/zapad/TopBar";
import { formatMoney, formatNumber } from "../utils/format";
import { PAGE_MAX_WIDTH } from "../utils/paths";

const portfolioHistory = [
  { d: "Jan", v: 24200 },
  { d: "Feb", v: 25100 },
  { d: "Mar", v: 24800 },
  { d: "Apr", v: 26400 },
  { d: "May", v: 27100 },
  { d: "Jun", v: 26700 },
  { d: "Jul", v: 27800 },
  { d: "Aug", v: 28900 },
  { d: "Sep", v: 28100 },
  { d: "Oct", v: 28600 },
  { d: "Nov", v: 29200 },
  { d: "Dec", v: 28400 },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const personalHoldings = [
  { name: "Government bonds", value: 12800, change: 2.4, allocation: 45, color: COLORS[0], fill: COLORS[0] },
  { name: "Corporate bonds", value: 8400, change: 1.8, allocation: 30, color: COLORS[1], fill: COLORS[1] },
  { name: "Index funds", value: 5200, change: -1.2, allocation: 18, color: COLORS[2], fill: COLORS[2] },
  { name: "Precious metals", value: 2000, change: 4.1, allocation: 7, color: COLORS[3], fill: COLORS[3] },
];

const businessHoldings = [
  { name: "T-bills (6m)", value: 50000, change: 1.2, allocation: 50, color: COLORS[0], fill: COLORS[0] },
  { name: "EUR bonds", value: 30000, change: 0.8, allocation: 30, color: COLORS[1], fill: COLORS[1] },
  { name: "Dividend ETF", value: 15000, change: 3.2, allocation: 15, color: COLORS[2], fill: COLORS[2] },
  { name: "Cash equivalents", value: 5000, change: 0.3, allocation: 5, color: COLORS[3], fill: COLORS[3] },
];

const FUNDS = [
  { name: "ZapadBanka Growth Fund", return: "+8.4%", risk: "Medium", min: 500 },
  { name: "Euro Bond Fund", return: "+3.2%", risk: "Low", min: 1000 },
  { name: "Global Equity Index", return: "+12.1%", risk: "High", min: 500 },
];

function PortfolioAreaChart({
  data,
  isPrivate,
  fillId,
}: {
  data: typeof portfolioHistory;
  isPrivate: boolean;
  fillId: string;
}) {
  const { t } = useI18n();
  const stroke = "var(--bank-muted)";
  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.18, max * 0.025);

  const yDomain = useMemo<[number, number]>(
    () => [min - pad, max + pad],
    [min, max, pad],
  );

  return (
    <div className="h-full w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 16, right: 16, bottom: 12, left: 8 }}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={yDomain} />
          <XAxis dataKey="d" ticks={[data[0].d, data[data.length - 1].d]} interval={0} padding={{ left: 20, right: 20 }} axisLine={false} tickLine={false} tick={{ fill: "var(--bank-muted)", fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: stroke, strokeOpacity: 0.2, strokeWidth: 1 }}
            contentStyle={{
              background: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--foreground)",
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--text-xs)",
            }}
            formatter={(v: number) => [
              isPrivate ? "•••" : formatMoney(v, "EUR", { decimals: 0 }),
              t("Value"),
            ]}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#${fillId})`}
            dot={false}
            activeDot={{
              r: 5,
              fill: stroke,
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function InvestDialog({open,onClose}:{open:boolean;onClose:()=>void;isBusiness:boolean}) {
  const { t } = useI18n();
 return open ? <ProductPreviewDialog open={open} onClose={onClose} title="Investment" options={FUNDS.map(f=>({name:f.name,min:f.min,description:t("{risk} risk · Minimum {amount}", { risk: t(f.risk), amount: formatMoney(f.min, "EUR", { decimals: 0 }) })}))} explanation="Capital is at risk. Historical or illustrative returns are not forecasts. Execution prices, custody and fund fees are not quoted in this demo; no order is placed."/> : null;
}

export function InvestmentsPage() {
  const { t, intlLocale } = useI18n();
  const { isPrivate } = usePrivacy();
  const { profileId } = useOutletContext<{ profileId: string }>();
  const isBusiness = profiles.find((p) => p.id === profileId)?.kind === "business";

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-primary-foreground";

  const holdings = isBusiness ? businessHoldings : personalHoldings;
  const holdingsTotal = holdings.reduce((sum, item) => sum + item.value, 0);
  const portfolio = holdings.map(item => ({ ...item, allocation: item.value / holdingsTotal * 100 }));
  const total = portfolio.reduce((s, i) => s + i.value, 0);
  const startingValue = portfolio.reduce((sum, item) => sum + item.value / (1 + item.change / 100), 0);
  const totalChange = total - startingValue;

  const history = portfolioHistory.map((point, index) => ({
    d: dateFormatter({ month: "short", day: "numeric" }).format(new Date(2026, index < 7 ? 3 : 4, [12, 15, 18, 21, 24, 27, 30, 3, 5, 7, 9, 11][index])),
    v: Math.round((total - totalChange + ((point.v - portfolioHistory[0].v) / (portfolioHistory[portfolioHistory.length - 1].v - portfolioHistory[0].v)) * totalChange) * 100) / 100,
  }));

  const [period, setPeriod] = useState<"7D" | "30D">("30D");
  const visibleHistory = period === "7D" ? history.slice(-4) : history;
  const periodStart = visibleHistory[0].v;
  const periodChange = total - periodStart;
  const [investOpen, setInvestOpen] = useState(false);
  const chartFillId = useId().replace(/:/g, "");

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Investments")}</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {t("Sample portfolio overview · Capital is at risk")}
          </p>
        </div>
        <Button
          onClick={() => setInvestOpen(true)}
          className={cn(brandBg, brandHover, brandText, "rounded-lg h-11 px-5 font-medium shadow-sm transition-all hover:shadow-md")}
        >
          <Plus className="size-4 mr-2" /> {t("Invest now")}
        </Button>
      </div>

      {/* Portfolio overview keeps the task button as the only strong colour accent. */}
      <Card className="@container overflow-hidden border-border rounded-xl bg-card shadow-none">
        <div className="grid @3xl:grid-cols-2 items-center">
          <div className="p-6 sm:p-8 min-w-0 space-y-5">
            <div>
              <h2 className="text-base font-medium text-muted-foreground">{t("Total portfolio value")}</h2>
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums text-foreground mt-2 break-words">
                {isPrivate ? "••••••" : formatMoney(total)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium tabular-nums", periodChange >= 0 ? "text-emerald-700" : "text-rose-700")}>
                {periodChange >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                {isPrivate ? "•••" : `${formatMoney(periodChange, "EUR", { showPlus: periodChange >= 0 })} (${formatNumber((periodChange / periodStart) * 100, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)`}
              </span>
              <span className="text-sm text-muted-foreground">{t("change since {date}", { date: dateFormatter({ day: "numeric", month: "long" }).format(new Date(2026, period === "7D" ? 4 : 3, period === "7D" ? 5 : 12)) })}</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground"><p>{t("Demo valuation · {date} · EUR", { date: dateFormatter({ day: "numeric", month: "long", year: "numeric" }).format(new Date(2026, 4, 11)) })}</p><p>{t("Portfolio value is not an available cash balance.")}</p></div>
          </div>
          <div className="min-w-0 p-6 sm:p-8 border-t @3xl:border-t-0 @3xl:border-l border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-foreground">{t("Portfolio value")}</h3>
              <ToggleGroup type="single" value={period} onValueChange={value => { if (value === "7D" || value === "30D") setPeriod(value); }} aria-label={t("Portfolio period")}>
                {(["7D", "30D"] as const).map(value => <ToggleGroupItem key={value} value={value} className="px-4">{value === "7D" ? t("7D") : t("30D")}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
            <div className="h-44" role="img" aria-label={isPrivate ? t("Portfolio history hidden") : t("Illustrative portfolio value from {startValue} on {startDate} to {endValue} on {endDate}", { startValue: formatMoney(visibleHistory[0].v), startDate: visibleHistory[0].d, endValue: formatMoney(total), endDate: visibleHistory[visibleHistory.length - 1].d })}>
              {isPrivate ? <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{t("Portfolio history hidden")}</div> : <PortfolioAreaChart data={visibleHistory} isPrivate={isPrivate} fillId={chartFillId} />}
            </div>
          </div>
        </div>
        <details className="border-t border-border px-6 py-4 text-sm">
          <summary className="cursor-pointer font-medium">{t("About this chart & data")}</summary>
          <p className="mt-3 text-muted-foreground">{t("Illustrative value change, not a live investment return. This model assumes no deposits, withdrawals or distributions and excludes fees and taxes. The chart uses a shortened vertical scale. Historical performance does not predict future results.")}</p>
          {!isPrivate && <table className="w-full mt-4 text-left text-sm"><caption className="text-left text-muted-foreground mb-2">{t("Sample portfolio values · EUR")}</caption><thead><tr><th scope="col" className="py-2">{t("Date (2026)")}</th><th scope="col" className="py-2 text-right">{t("Value")}</th></tr></thead><tbody>{visibleHistory.map(point => <tr key={point.d} className="border-t border-border"><td className="py-2">{point.d}</td><td className="py-2 text-right tabular-nums">{formatMoney(point.v)}</td></tr>)}</tbody></table>}
        </details>
      </Card>

      <div className="grid min-w-0 xl:grid-cols-transaction-detail gap-6">
        {/* Portfolio breakdown */}
        <Card className="p-8 border-slate-200/60 bg-white rounded-4xl shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{t("Asset classes")}</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">{t("Current value · 30-day illustrative change")}</p>
          <div className="space-y-5">
            {portfolio.map((item) => (
              <div key={item.name}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                  <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <div className="size-3 rounded-full" style={{ background: item.color }} />
                    <span className="font-semibold text-slate-900">{t(item.name)}</span>
                    <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", item.change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                      {item.change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {isPrivate ? "•••" : `${item.change >= 0 ? "+" : ""}${formatNumber(item.change)}%`}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      {isPrivate ? "•••" : formatMoney(item.value, "EUR", { decimals: 0 })}
                    </div>
                    <div className="text-xs font-normal text-slate-400">
                      {t("{percent}% of portfolio", { percent: formatNumber(item.allocation, { maximumFractionDigits: 1 }) })}
                    </div>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-muted-foreground/50"
                    style={{ width: `${item.allocation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Portfolio allocation */}
        <div className="min-w-0 space-y-5">
          <Card className="p-7 border-slate-200/60 bg-white rounded-4xl shadow-sm flex flex-col items-center">
            <h3 className="text-base font-semibold text-slate-900 mb-4 self-start">{t("Allocation")}</h3>
            <div className="w-40 max-w-full aspect-square" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie tabIndex={-1} data={portfolio} dataKey="allocation" cx="50%" cy="50%" innerRadius="56%" outerRadius="94%" strokeWidth={3} isAnimationActive={false}>
                    {portfolio.map(item => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2 w-full">
              {portfolio.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="size-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs font-semibold text-slate-600 flex-1 min-w-0 wrap-anywhere">{t(item.name)}</span>
                  <span className="text-xs font-medium text-slate-900">{formatNumber(item.allocation, { maximumFractionDigits: 1 })}%</span>
                </div>
              ))}
            </div>
          </Card>


        </div>
      </div>

      <p className="text-sm text-muted-foreground">{t("Capital is at risk. Asset classes shown here are sample allocations, not individual tradable holdings. Live prices, security identifiers, order history and execution fees are not available in this prototype.")}</p>
      <InvestDialog open={investOpen} onClose={() => setInvestOpen(false)} isBusiness={isBusiness} />
    </div>
  );
}
