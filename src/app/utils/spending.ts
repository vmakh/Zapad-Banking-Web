import type { Transaction } from "../data/types";

/** Posted EUR outgoings in the fixed May 2026 sample, not net cash flow. */
export function isSpendingTransaction(tx: Pick<Transaction, "status" | "amount" | "currency" | "category">): boolean {
  return tx.status === "Completed" && Number.isFinite(tx.amount) && tx.amount < 0 && tx.currency === "EUR" && tx.category !== "Exchange";
}

export function spendingHref(base: string, category?: string): string {
  const [path, query = ""] = base.split("?");
  const params = new URLSearchParams(query);
  for (const key of ["status", "search", "transaction", "preview"]) params.delete(key);
  params.set("view", "spending");
  if (category) params.set("category", category);
  else params.delete("category");
  return `${path}?${params}`;
}
