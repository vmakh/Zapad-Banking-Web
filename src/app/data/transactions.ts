import { getPrimaryAccount } from "./accounts";
import {
  Banknote,
  Building2,
  Coffee,
  Plane,
  Repeat,
  ShoppingBag,
  Zap,
} from "lucide-react";
import type { ProfileKind, Transaction } from "./types";

const personalTransactions: Transaction[] = [
  { id: "1", merchant: "Retail Demo", meta: "Card ··4821 · Groceries", category: "Shopping", amount: -42.18, currency: "EUR", status: "Completed", icon: ShoppingBag, iconBg: "bg-violet-100 text-violet-700", date: "Today, 14:22" },
  { id: "2", merchant: "Caffe Aroma", meta: "Card ··4821 · Cafe", category: "Food", amount: -3.5, currency: "EUR", status: "Completed", icon: Coffee, iconBg: "bg-amber-100 text-amber-700", date: "Today, 09:14" },
  { id: "3", merchant: "Salary · Demo Corp DOO", meta: "Incoming SEPA transfer", category: "Income", amount: 3200.0, currency: "EUR", status: "Completed", icon: Banknote, iconBg: "bg-emerald-100 text-emerald-700", date: "Yesterday" },
  { id: "4", merchant: "Utility Co Demo", meta: "Utility · scheduled", category: "Bills", amount: -68.4, currency: "EUR", status: "Scheduled", icon: Zap, iconBg: "bg-yellow-100 text-yellow-700", date: "May 14" },
  { id: "5", merchant: "FX EUR → USD", meta: "Exchange · rate 1.087", category: "Exchange", amount: -500, currency: "EUR", status: "Completed", icon: Repeat, iconBg: "bg-orange-100 text-brand-business", date: "May 9" },
  { id: "6", merchant: "Wizz Air", meta: "Online · Travel", category: "Travel", amount: -119.99, currency: "EUR", status: "Pending", icon: Plane, iconBg: "bg-sky-100 text-sky-700", date: "May 8" },
  { id: "7", merchant: "John Sample", meta: "Outgoing transfer", category: "Transfer", amount: -120, currency: "EUR", status: "Completed", icon: Banknote, iconBg: "bg-slate-100 text-slate-700", date: "May 7" },
  { id: "8", merchant: "Netflix", meta: "Subscription", category: "Entertainment", amount: -14.99, currency: "EUR", status: "Completed", icon: ShoppingBag, iconBg: "bg-rose-100 text-rose-700", date: "May 6" },
];

const businessTransactions: Transaction[] = [
  { id: "1", merchant: "Invoice INV-2034 · Techno d.o.o.", meta: "International payment", category: "Outgoing", amount: -4820.0, currency: "EUR", status: "Waiting for approval", icon: Building2, iconBg: "bg-rose-100 text-rose-700", date: "Today, 11:02" },
  { id: "2", merchant: "Stripe Payouts", meta: "Incoming · Settlement", category: "Income", amount: 12450.32, currency: "EUR", status: "Completed", icon: Banknote, iconBg: "bg-emerald-100 text-emerald-700", date: "Today, 08:30" },
  { id: "3", merchant: "Payroll · 4 employees", meta: "Bulk payment · Scheduled", category: "Payroll", amount: -8940.0, currency: "EUR", status: "Scheduled", icon: Banknote, iconBg: "bg-blue-100 text-brand-personal", date: "May 15" },
  { id: "4", merchant: "AWS Europe", meta: "Card ··1102 · Cloud", category: "Software", amount: -320.4, currency: "EUR", status: "Completed", icon: Building2, iconBg: "bg-slate-100 text-slate-700", date: "May 10" },
  { id: "5", merchant: "Client · Alfa doo", meta: "Incoming SEPA", category: "Income", amount: 4800, currency: "EUR", status: "Completed", icon: Banknote, iconBg: "bg-emerald-100 text-emerald-700", date: "May 5" },
  { id: "6", merchant: "Office rent", meta: "Scheduled payment", category: "Bills", amount: -1200, currency: "EUR", status: "Scheduled", icon: Building2, iconBg: "bg-amber-100 text-amber-700", date: "May 8" },
];

export function getTransactions(kind: ProfileKind): Transaction[] {
  return kind === "business" ? businessTransactions : personalTransactions;
}

/** The current sample dataset belongs to the primary EUR account only. */
export function getAccountTransactions(kind: ProfileKind, accountId: string): Transaction[] {
  return accountId === getPrimaryAccount(kind).id ? getTransactions(kind) : [];
}

/** Demo flow totals for dashboard hero stats */
export function getFlowSummary(kind: ProfileKind): {
  inTotal: number;
  outTotal: number;
  pendingCount: number;
} {
  const txs = getTransactions(kind);
  let inTotal = 0;
  let outTotal = 0;
  let pendingCount = 0;

  for (const t of txs) {
    const status = t.status.toLowerCase();
    if (status.includes("pending") || status.includes("waiting")) {
      pendingCount += 1;
    }
    if (t.amount > 0) inTotal += t.amount;
    else outTotal += Math.abs(t.amount);
  }

  return { inTotal, outTotal, pendingCount };
}

export const accountActivity = Object.fromEntries(
  (["personal", "business"] as const).map(kind => [kind, getTransactions(kind).filter(tx => tx.status === "Completed").map(tx => ({ id: tx.id, desc: tx.merchant, amount: tx.amount, date: tx.date, positive: tx.amount > 0 }))])
) as Record<ProfileKind, { id: string; desc: string; amount: number; date: string; positive: boolean }[]>;
