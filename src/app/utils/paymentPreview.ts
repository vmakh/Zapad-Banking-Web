import type { ProfileKind } from "../data/types";
import { readDemo, writeDemo } from "./demoStorage";

export function isQuoteExpired(reviewedAt: number, now = Date.now()) { return !reviewedAt || now - reviewedAt >= 60000; }

export function normalizeIban(value: string) { return value.replace(/\s/g, "").toUpperCase(); }
export function ibanError(value: string) {
  const iban = normalizeIban(value);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return "Enter an IBAN with a country code, check digits and account number.";
  const lengths: Record<string, number> = { ME:22, GB:22, DE:22, FR:27, IT:27, ES:24, NL:18, AT:20, CH:21, BE:16, IE:22, HR:21, RS:22, BA:20, AL:28, SI:19, PT:25, GR:27, LU:20, FI:18, EE:20, LT:20, LV:21, CY:28, MT:31, SK:24 };
  if (!lengths[iban.slice(0,2)]) return "This demo supports European IBANs only. Choose a supported country.";
  if (iban.length !== lengths[iban.slice(0,2)]) return "The IBAN length does not match its country.";
  let remainder = 0;
  for (const character of iban.slice(4) + iban.slice(0,4)) {
    for (const digit of (/[A-Z]/.test(character) ? String(character.charCodeAt(0)-55) : character)) remainder = (remainder*10+Number(digit))%97;
  }
  return remainder === 1 ? "" : "The IBAN check digits are incorrect. Check the details with the recipient.";
}
export type PreviewRecord = {
  id: string; kind: ProfileKind; createdAt: string; title: string; sourceId: string; destinationId?: string;
  source: string; recipient: string; iban: string; amount: number; currency: string;
  fee: number; total: number; received: number; targetCurrency: string; note: string;
  status: "Preview saved" | "Status unknown" | "Awaiting approval" | "Approved preview" | "Rejected preview";
  initiator: string; reason?: string; events: string[];
};
const previewStatuses = new Set(["Preview saved", "Status unknown", "Awaiting approval", "Approved preview", "Rejected preview"]);
const nonEmptyText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

// Storage is an untyped boundary: validate the complete record before rendering or updating it.
function isPreviewRecord(value: unknown): value is PreviewRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const r = value as Record<string, unknown>;
  if (r.kind !== "personal" && r.kind !== "business") return false;
  if (![r.id, r.title, r.sourceId, r.source, r.recipient, r.initiator].every(nonEmptyText)) return false;
  if (typeof r.createdAt !== "string" || !Number.isFinite(Date.parse(r.createdAt))) return false;
  if (typeof r.iban !== "string" || typeof r.note !== "string") return false;
  if (r.destinationId !== undefined && !nonEmptyText(r.destinationId)) return false;
  if (r.reason !== undefined && typeof r.reason !== "string") return false;
  if (typeof r.status !== "string" || !previewStatuses.has(r.status)) return false;
  if (!Array.isArray(r.events) || !r.events.every(nonEmptyText)) return false;
  if (![r.currency, r.targetCurrency].every(c => typeof c === "string" && /^[A-Z]{3}$/.test(c))) return false;
  const amounts = [r.amount, r.fee, r.total, r.received];
  if (!amounts.every(n => typeof n === "number" && Number.isFinite(n) && Number.isSafeInteger(Math.round(n * 100)))) return false;
  const { amount, fee, total, received } = r as PreviewRecord;
  return amount > 0 && fee >= 0 && total > 0 && received > 0 && Math.round((amount + fee) * 100) === Math.round(total * 100);
}
export function getPreviews(kind: ProfileKind): PreviewRecord[] {
  const value = readDemo<unknown>(`previews:${kind}`, []);
  return Array.isArray(value) ? value.filter((r): r is PreviewRecord => isPreviewRecord(r) && r.kind === kind) : [];
}
export function savePreview(record: PreviewRecord) {
  if (!isPreviewRecord(record)) throw new Error("Invalid preview details or amounts. Return to review.");
  const records = getPreviews(record.kind);
  const existing = records.find(r => r.id === record.id);
  if (existing) return existing;
  if (!writeDemo(`previews:${record.kind}`, [record, ...records])) throw new Error("Could not save on this device. Your draft is unchanged; try again.");
  return record;
}
export function resolvePreview(kind: ProfileKind, id: string, action: "check" | "approve" | "reject", actor: string, reason = "") {
  const records = getPreviews(kind);
  const record = records.find(r => r.id === id);
  if (!record) throw new Error("Preview no longer exists.");
  if (action === "check" && record.status === "Status unknown") {
    record.status = kind === "business" ? "Awaiting approval" : "Preview saved";
    record.events.push("Status checked: local preview found. No payment was submitted.");
  } else if (action !== "check" && record.status === "Awaiting approval") {
    if (actor === record.initiator) throw new Error("The initiator cannot approve or reject their own request.");
    if (action === "reject" && !reason.trim()) throw new Error("Enter a rejection reason.");
    record.status = action === "approve" ? "Approved preview" : "Rejected preview";
    record.reason = reason.trim();
    record.events.push(`${record.status} by ${actor}${record.reason ? `: ${record.reason}` : ""}. No payment released.`);
  } else return record;
  if (!writeDemo(`previews:${kind}`, records)) throw new Error("Could not save the decision. Try again.");
  return record;
}
