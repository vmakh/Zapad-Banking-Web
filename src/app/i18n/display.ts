import type { InboxMessage, SavingsGoal } from "../data/types";
import { t } from "./runtime";
import { formatMoney, formatNumber } from "../utils/format";

export function localizedMessageBody(message: Pick<InboxMessage, "body" | "bodyAmount" | "bodyRate">): string {
  return t(message.body, {
    amount: message.bodyAmount === undefined ? undefined : formatMoney(message.bodyAmount, "EUR"),
    rate: message.bodyRate === undefined ? undefined : formatNumber(message.bodyRate),
  });
}

const sampleGoalNames: Record<string, string> = {
  vacation: "Holiday goal", emergency: "Emergency fund", tax: "Tax reserve", equipment: "Hardware upgrade",
};

/** Translate only unedited sample names; user-created and renamed goals are user content. */
export function localizedGoalName(goal: Pick<SavingsGoal, "id" | "name">): string {
  return sampleGoalNames[goal.id] === goal.name ? t(goal.name) : goal.name;
}

export function localizedMerchant(name: string): string {
  if (name === "Salary · Demo Corp DOO") return t("Salary · {name}", { name: "Demo Corp DOO" });
  if (name === "Invoice INV-2034 · Techno d.o.o.") return t("Invoice {reference} · {name}", { reference: "INV-2034", name: "Techno d.o.o." });
  if (name === "Payroll · 4 employees") return t("Payroll · {count} employees", { count: 4 });
  if (name === "Client · Alfa doo") return t("Client · {name}", { name: "Alfa doo" });
  return name === "Office rent" ? t(name) : name;
}
