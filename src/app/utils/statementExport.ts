import type { BankAccount, Transaction } from "../data/types";
import { csvCell } from "./exportFiles";

/** Export the same sample and privacy state shown in the statement dialog. */
export function statementCsv(account: BankAccount, transactions: Transaction[], isPrivate: boolean) {
  const rows: (string | number)[][] = [
    ["Sample statement — not an official bank statement"],
    ["Period", "May 2026"],
    ["Account", account.name],
    ["IBAN", account.iban],
    ["Account currency", account.currency],
    ["Amounts", isPrivate ? "Hidden by privacy setting" : "Visible"],
    ["Posted transactions", transactions.length],
    [],
    ["Transaction ID", "Sample date", "Description", "Details", "Category", "Amount", "Currency", "Status"],
    ...transactions.map(t => [t.id, t.date, t.merchant, t.meta, t.category, isPrivate ? "Hidden" : t.amount, t.currency, t.status]),
  ];
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
}
