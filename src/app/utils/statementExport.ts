import type { BankAccount, Transaction } from "../data/types";
import { csvCell } from "./exportFiles";

/** Export the same sample and privacy state shown in the statement dialog. */
export function statementCsv(account: BankAccount, transactions: Transaction[], isPrivate: boolean, localization?: { t: (value: string) => string; date: (value: string) => string; merchant?: (value: string) => string; meta?: (value: string) => string }) {
  const t = localization?.t ?? ((value: string) => value);
  const date = localization?.date ?? ((value: string) => value);
  const rows: (string | number)[][] = [
    [t("Sample statement — not an official bank statement")],
    [t("Period"), t("May 2026")],
    [t("Account"), t(account.name)],
    ["IBAN", account.iban],
    [t("Account currency"), account.currency],
    [t("Amounts"), t(isPrivate ? "Hidden by privacy setting" : "Visible")],
    [t("Posted transactions"), transactions.length],
    [],
    ["Transaction ID", "Sample date", "Description", "Details", "Category", "Amount", "Currency", "Status"].map(t),
    // Numeric CSV cells stay canonical decimal values for spreadsheet import.
    ...transactions.map(tx => [tx.id, date(tx.date), localization?.merchant?.(tx.merchant) ?? tx.merchant, localization?.meta?.(tx.meta) ?? t(tx.meta), t(tx.category), isPrivate ? t("Hidden") : tx.amount, tx.currency, t(tx.status)]),
  ];
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
}
