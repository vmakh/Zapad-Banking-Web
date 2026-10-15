import { useId } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { isSpendingTransaction, spendingHref } from "../../utils/spending";
import { Link } from "react-router";
import { Card } from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { cn } from "../ui/utils";
import { getTransactions } from "../../data/transactions";
import { formatAnalyticsMonth } from "../../utils/date";
import { formatNumber, formatMoney } from "../../utils/format";
import type { Transaction } from "../../data/types";
import { IconScaleSlot } from "./IconScaleSlot";

type DonutTooltipEntry = {
  name?: string;
  value?: number;
  payload?: { fill?: string };
};

function DonutTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  const { t } = useI18n();
  if (!active || !payload?.length) return null;

  const entry = payload[0] as DonutTooltipEntry;
  const name = entry.name ?? "";
  const value = Number(entry.value ?? 0);
  const color = entry.payload?.fill ?? "#64748b";

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-floating-action pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium text-slate-500">{t(name)}</span>
      </div>
      <p className="text-sm font-normal text-slate-900 tabular-nums pl-4">
        {formatMoney(value)}
      </p>
    </div>
  );
}

/** Matches Pie innerRadius / outerRadius so the center label sits in the donut hole. */
const ANALYTICS_COLOR_CLASSES = ["analytics-color-0", "analytics-color-1", "analytics-color-2", "analytics-color-3", "analytics-color-4", "analytics-color-5"];
const DONUT_INNER_PERCENT = 62;
const DONUT_OUTER_PERCENT = 88;

export function ExpenseAnalytics({
  business,
  transactionsHref,
  compact = false,
}: {
  business: boolean;
  transactionsHref?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const { isPrivate } = usePrivacy();
  const chartId = useId().replace(/:/g, "");
  const colors = ["var(--color-slate-500)", "var(--color-slate-300)", "var(--color-slate-400)", "var(--color-slate-600)", "var(--color-slate-200)", "var(--color-slate-700)"];
  const groups = new Map<string, { name: string; value: number; color: string; fill: string; icon: Transaction["icon"]; bg: string }>();
  for (const tx of getTransactions(business ? "business" : "personal")) {
    if (!isSpendingTransaction(tx)) continue;
    const prior = groups.get(tx.category);
    if (prior) prior.value = (Math.round(prior.value * 100) + Math.round(Math.abs(tx.amount) * 100)) / 100;
    else { const color = colors[groups.size % colors.length]; groups.set(tx.category, { name: tx.category, value: Math.abs(tx.amount), color, fill: color, icon: tx.icon, bg: tx.iconBg }); }
  }
  const data = [...groups.values()];
  const total = data.reduce((acc, item) => acc + Math.round(item.value * 100), 0) / 100;
  return (
    <Card
      className={cn(
        "border border-slate-200/60 bg-white rounded-4xl overflow-hidden shadow-sm",
        compact ? "p-4 md:p-6" : "p-6 md:p-8",
      )}
    >
      <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2", "mb-4")}>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">{t("Analytics")}</h2>
          <p className="text-sm font-normal text-slate-500 mt-1">{t("{month} · Posted outgoings · EUR", { month: formatAnalyticsMonth() })}</p>
        </div>
        {transactionsHref ? (
          <Link
            to={spendingHref(transactionsHref)}
            className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors shrink-0"
          >{t("View transactions →")}</Link>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{t("Excludes income, pending and scheduled payments, currency exchanges and local previews.")}</p>
      <div className={cn("flex flex-wrap items-center", compact ? "gap-5" : "gap-8")}>
        <div className="flex-1 basis-64 min-w-0">
          <div className="relative w-full max-w-64 mx-auto aspect-square isolate">
            {/* Center label — flex centering avoids Safari % inset bugs */}
            <div className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none p-icon-artwork">
              <div className="flex flex-col items-center justify-center rounded-full bg-white shadow-inset-hairline w-full h-full min-w-0 min-h-0 px-2">
                <span className="text-micro sm:text-xs font-medium text-slate-400 uppercase tracking-widest mb-0.5">{t("Spent")}</span>
                <span className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tighter text-slate-900 text-center leading-tight">
                  {isPrivate ? "•••" : formatMoney(total, "EUR")}
                </span>
              </div>
            </div>

            <div aria-hidden="true" className="relative z-2 h-full w-full min-h-50 [&_.recharts-tooltip-wrapper]:!z-30 [&_.recharts-tooltip-wrapper]:pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <defs>
                    {data.map((entry, index) => <linearGradient key={entry.name} id={`${chartId}-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.fill} className={cn("analytics-gradient-start", ANALYTICS_COLOR_CLASSES[index])} />
                      <stop offset="100%" stopColor={entry.fill} className={cn("analytics-gradient-end", ANALYTICS_COLOR_CLASSES[index])} />
                    </linearGradient>)}
                  </defs>
                  <Pie
                    tabIndex={-1}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={`${DONUT_INNER_PERCENT}%`}
                    outerRadius={`${DONUT_OUTER_PERCENT}%`}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    isAnimationActive={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.name} fill={`url(#${chartId}-${index})`} className="outline-none" />
                    ))}
                  </Pie>
                  {!isPrivate && <Tooltip
                    content={<DonutTooltip />}
                    wrapperStyle={{ zIndex: 30, outline: "none" }}
                    allowEscapeViewBox={{ x: true, y: true }}
                  />}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex-1 basis-64 min-w-0 space-y-4">
          {data.map((item, index) => {
            const Icon = item.icon;
            const percent = (item.value / total) * 100;
            return (
              <div key={item.name} className="flex items-center gap-4 group">
                <IconScaleSlot
                  className="size-11 sm:size-12 rounded-md"
                  innerClassName={cn("", item.bg)}
                >
                  <Icon className="size-5" />
                </IconScaleSlot>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 mb-2">
                    {transactionsHref ? <Link className="text-sm font-medium text-slate-900 break-words underline underline-offset-4" to={spendingHref(transactionsHref, item.name)}>{t(item.name)}</Link> : <span className="text-sm font-medium text-slate-900 break-words">{t(item.name)}</span>}
                    <span className="text-sm font-normal text-slate-900 tabular-nums shrink-0">
                      {isPrivate ? "•••" : formatMoney(item.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 bg-slate-100 rounded-full overflow-hidden shadow-inner min-w-0">
                      <div
                        className={cn("analytics-category-fill h-full rounded-full transition-all duration-1000 relative", ANALYTICS_COLOR_CLASSES[index])}
                        style={{ width: `${percent}%`, backgroundColor: item.color }}
                      >
                        <div
                          className="absolute inset-0 bg-white/20 w-full"
                          style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
                        />
                        </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 w-12 text-right tabular-nums shrink-0">
                      {formatNumber(percent, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
