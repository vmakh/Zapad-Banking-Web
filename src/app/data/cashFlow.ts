import type { ProfileKind } from "./types";

export type CashFlowPeriod = "month" | "quarter" | "year";

// Independent illustrative 2026 scenario, never account activity or balances.
const BUSINESS_SCENARIO = [
  [8200, 6400], [9600, 7200], [15200, 10300], [22600, 14100],
  [19400, 12000], [27800, 16400], [21600, 14800], [13200, 9600],
  [20500, 12500], [18100, 11200], [23900, 15800], [14700, 10900],
] as const;

const PERSONAL_SCENARIO = [
  [3200, 1820], [3200, 1640], [3450, 2160], [3200, 1890],
  [3200, 2050], [3650, 2480], [3200, 2310], [3200, 2180],
  [3400, 1940], [3200, 1830], [3200, 2090], [4100, 2670],
] as const;

// Explicit prior-year comparison fixtures; not bank history or posted transactions.
const PREVIOUS_SCENARIOS = {
  personal: [
    [3000, 1750], [3000, 1580], [3250, 2050], [3100, 1820],
    [3100, 1950], [3500, 2350], [3100, 2200], [3100, 2080],
    [3200, 1850], [3100, 1760], [3100, 1980], [3900, 2520],
  ],
  business: [
    [7800, 6100], [9100, 6900], [14400, 9800], [21400, 13400],
    [18400, 11400], [26400, 15600], [20500, 14100], [12500, 9100],
    [19500, 11900], [17200, 10700], [22700, 15000], [13900, 10300],
  ],
} as const;

/** Deterministic daily illustration whose cents reconcile to the monthly total. */
function distribute(total: number, days: number, offset: number): number[] {
  const weights = Array.from({ length: days }, (_, day) => ((day * 7 + offset) % 11) + 1);
  const sum = weights.reduce((acc, value) => acc + value, 0);
  const cents = weights.map(weight => Math.floor(total * 100 * weight / sum));
  cents[days - 1] += total * 100 - cents.reduce((acc, value) => acc + value, 0);
  return cents.map(value => value / 100);
}

export function getCashFlow(profileKind: ProfileKind, period: CashFlowPeriod, selectedMonth = 4) {
  const scenario = profileKind === "business" ? BUSINESS_SCENARIO : PERSONAL_SCENARIO;
  // Bounded 2026 sample; callers select a zero-based month.
  const month = Math.max(0, Math.min(11, Math.trunc(Number.isFinite(selectedMonth) ? selectedMonth : 4)));
  if (period === "month") {
    const days = new Date(2026, month + 1, 0).getDate();
    const income = distribute(scenario[month][0], days, 3);
    const spending = distribute(scenario[month][1], days, 8);
    return income.map((value, day) => ({ month, day: day + 1, income: value, spending: -spending[day] }));
  }
  const first = period === "quarter" ? Math.floor(month / 3) * 3 : 0;
  const end = period === "quarter" ? first + 3 : 12;
  return scenario.slice(first, end).map(([income, spending], index) => ({ month: first + index, day: 1, income, spending: -spending }));
}

export type CashFlowSelection = { period: CashFlowPeriod; selectedMonth: number };
const selectionKey = (kind: ProfileKind) => `zapadbanka-${kind}-cashflow-selection-v1`;

export function readCashFlowSelection(profileKind: ProfileKind): CashFlowSelection {
  const fallback: CashFlowSelection = { period: "year", selectedMonth: 4 };
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(selectionKey(profileKind)) ?? "null");
    if (!saved || typeof saved !== "object") return fallback;
    const value = saved as Record<string, unknown>;
    if (value.version !== 1 || value.year !== 2026 ||
      (value.period !== "month" && value.period !== "quarter" && value.period !== "year") ||
      typeof value.selectedMonth !== "number" || !Number.isInteger(value.selectedMonth) ||
      value.selectedMonth < 0 || value.selectedMonth > 11) return fallback;
    return { period: value.period, selectedMonth: value.selectedMonth };
  } catch {
    return fallback;
  }
}

export function saveCashFlowSelection(profileKind: ProfileKind, selection: CashFlowSelection): void {
  try {
    localStorage.setItem(selectionKey(profileKind), JSON.stringify({ version: 1, year: 2026, ...selection }));
  } catch {
    // Storage restrictions must not block period controls in the current view.
  }
}

export function cashFlowChange(current: number, previous: number) {
  const difference = (Math.round(current * 100) - Math.round(previous * 100)) / 100;
  return { difference, percent: previous === 0 ? (current === 0 ? 0 : null) : difference / previous * 100 };
}

/** Compare complete adjacent periods using explicit 2025 boundary fixtures. */
export function getCashFlowComparison(profileKind: ProfileKind, period: CashFlowPeriod, selectedMonth: number) {
  const month = Math.max(0, Math.min(11, Math.trunc(Number.isFinite(selectedMonth) ? selectedMonth : 4)));
  const first = period === "quarter" ? Math.floor(month / 3) * 3 : month;
  const previousYear = period === "year" || first === 0 ? 2025 : 2026;
  const count = period === "year" ? 12 : period === "quarter" ? 3 : 1;
  const previousStartMonth = previousYear === 2025 ? 12 - count : first - count;
  const current = getCashFlow(profileKind, period, month);
  const previous = previousYear === 2026 ? getCashFlow(profileKind, period, previousStartMonth)
    : PREVIOUS_SCENARIOS[profileKind].slice(previousStartMonth, previousStartMonth + count).map(([income, spending], index) => ({ month: previousStartMonth + index, day: 1, income, spending: -spending }));
  const sum = (rows: typeof current, metric: "income" | "spending") => rows.reduce((total, row) => total + Math.round(Math.abs(row[metric]) * 100), 0) / 100;
  return {
    previousYear,
    previousStartMonth,
    previousEndMonth: previousStartMonth + count - 1,
    income: cashFlowChange(sum(current, "income"), sum(previous, "income")),
    spending: cashFlowChange(sum(current, "spending"), sum(previous, "spending")),
  };
}

/** Align bars by day-of-month, month-of-quarter, or month-of-year. */
export function getCashFlowPointComparison(profileKind: ProfileKind, period: CashFlowPeriod, month: number, day: number) {
  const offset = period === "year" ? 12 : period === "quarter" ? 3 : 1;
  const previousYear = month - offset < 0 ? 2025 : 2026;
  const previousMonth = (month - offset + 12) % 12;
  const previousDay = period === "month" ? day : 1;
  const scenario = previousYear === 2025 ? PREVIOUS_SCENARIOS[profileKind]
    : profileKind === "business" ? BUSINESS_SCENARIO : PERSONAL_SCENARIO;
  const prior = scenario[previousMonth];
  const days = new Date(previousYear, previousMonth + 1, 0).getDate();
  if (previousDay > days) return null;
  const previousIncome = period === "month" ? distribute(prior[0], days, 3)[previousDay - 1] : prior[0];
  const previousSpending = period === "month" ? distribute(prior[1], days, 8)[previousDay - 1] : prior[1];
  const current = getCashFlow(profileKind, period === "month" ? "month" : "year", month).find(row => row.month === month && row.day === day);
  if (!current) return null;
  return {
    previousYear, previousMonth, previousDay,
    income: { previous: previousIncome, ...cashFlowChange(current.income, previousIncome) },
    spending: { previous: previousSpending, ...cashFlowChange(-current.spending, previousSpending) },
  };
}
