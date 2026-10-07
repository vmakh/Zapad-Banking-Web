import { readDemo, writeDemo } from "../utils/demoStorage";
import { ibanError, normalizeIban } from "../utils/paymentPreview";
import type { ProfileKind, Recipient } from "./types";

const personalRecipients: Recipient[] = [
  { currency: "GBP", id: "1", name: "Ana", iban: "GB00 DEMO 0000 0000 0098 21", initials: "A", color: "bg-blue-100 text-blue-700", bank: "CKB Banka", lastSent: "€120 · 3 days ago" },
  { currency: "EUR", id: "2", name: "Luka", iban: "ME25 9900 0000 0000 0077 12", initials: "L", color: "bg-rose-100 text-rose-700", bank: "ZapadBanka", lastSent: "€45 · 1 week ago" },
  { currency: "GBP", id: "3", name: "Milica", iban: "GB00 DEMO 0000 0000 0044 33", initials: "M", color: "bg-amber-100 text-amber-700", bank: "Erste Bank", lastSent: "€68.40 · 2 weeks ago" },
];

const businessRecipients: Recipient[] = [
  { currency: "EUR", id: "1", name: "Techno d.o.o.", iban: "ME25 9900 0000 0000 0033 11", initials: "TC", color: "bg-violet-100 text-violet-700", bank: "Hipotekarna", lastSent: "€4,200 · 2 days ago" },
  { currency: "EUR", id: "2", name: "Crnogorski Telekom", iban: "ME25 9900 0000 0000 0078 90", initials: "CT", color: "bg-sky-100 text-sky-700", bank: "Erste Bank", lastSent: "€320 · 5 days ago" },
  { currency: "EUR", id: "3", name: "Bob Sample", iban: "ME25 9900 0000 0000 0066 12", initials: "BS", color: "bg-emerald-100 text-emerald-700", bank: "ZapadBanka", lastSent: "€1,800 · 1 week ago" },
  { currency: "EUR", id: "4", name: "Alfa doo", iban: "ME25 9900 0000 0000 0022 44", initials: "AL", color: "bg-orange-100 text-orange-700", bank: "CKB Banka", lastSent: "€650 · 2 weeks ago" },
];

/** Persisted custom recipients are untrusted input; fixture recipients are separate. */
function isSavedRecipient(value: unknown): value is Recipient {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const limits = { id: 100, name: 120, iban: 48, currency: 3, initials: 16, color: 200, bank: 200, lastSent: 120 };
  for (const [field, limit] of Object.entries(limits)) {
    if (typeof record[field] !== "string" || record[field].length > limit) return false;
  }
  const recipient = value as Recipient;
  return recipient.id.startsWith("custom-") && recipient.id.length > 7
    && !!recipient.name.trim() && !!recipient.initials.trim()
    && ["EUR", "USD", "GBP"].includes(recipient.currency)
    && !ibanError(recipient.iban);
}

export function getRecipients(kind: ProfileKind): Recipient[] {
  const stored = readDemo<unknown>(`recipients:${kind}`, []);
  const recipients = [...(kind === "business" ? businessRecipients : personalRecipients)];
  const ids = new Set(recipients.map(recipient => recipient.id));
  const ibans = new Set(recipients.map(recipient => normalizeIban(recipient.iban)));
  if (Array.isArray(stored)) {
    for (const recipient of stored) {
      if (!isSavedRecipient(recipient)) continue;
      const iban = normalizeIban(recipient.iban);
      if (ids.has(recipient.id) || ibans.has(iban)) continue;
      ids.add(recipient.id);
      ibans.add(iban);
      recipients.push(recipient);
    }
  }
  return recipients;
}

export function saveRecipient(kind: ProfileKind, recipient: Recipient) {
  if (!isSavedRecipient(recipient)) throw new Error("Recipient details are invalid.");
  const all = getRecipients(kind);
  const existing = all.find(r => normalizeIban(r.iban) === normalizeIban(recipient.iban));
  if (existing) return existing;
  if (all.some(r => r.id === recipient.id)) throw new Error("Recipient ID already belongs to another account.");
  if (!writeDemo(`recipients:${kind}`, [...all.filter(r => r.id.startsWith("custom-")), recipient])) throw new Error("Could not save recipient on this device.");
  return recipient;
}
