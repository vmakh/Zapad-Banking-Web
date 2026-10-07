export type TransferDraft = {
  intentId?: string;
  recipientId: string; sourceId: string; destinationId: string; amount: string;
  note: string; name: string; iban: string; currency: string; save: boolean;
};

// Drafts may be unfinished, but every restored value must be safe for form controls.
// Payment validity is checked separately when the user reviews the transfer.
export function parseTransferDraft(value: unknown): TransferDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const r = value as Record<string, unknown>;
  const limits = { recipientId: 160, sourceId: 160, destinationId: 160, amount: 64, note: 280, name: 120, iban: 48, currency: 3 };
  for (const [field, limit] of Object.entries(limits)) {
    if (typeof r[field] !== "string" || r[field].length > limit) return null;
  }
  if (!["EUR", "USD", "GBP"].includes(r.currency as string) || typeof r.save !== "boolean") return null;
  if (r.intentId !== undefined && (typeof r.intentId !== "string" || !/^[a-zA-Z0-9-]{1,160}$/.test(r.intentId))) return null;
  return {
    ...(r.intentId === undefined ? {} : { intentId: r.intentId as string }),
    recipientId: r.recipientId as string, sourceId: r.sourceId as string,
    destinationId: r.destinationId as string, amount: r.amount as string,
    note: r.note as string, name: r.name as string, iban: r.iban as string,
    currency: r.currency as string, save: r.save,
  };
}

// New recipient details must be reviewed before resuming the amount step.
export function transferDraftStep(draft: TransferDraft, own: boolean, recipientIds: string[]): "amount" | "new" | "recipient" {
  if (own) return "amount";
  if (draft.recipientId === "new" || (!draft.recipientId && (draft.name || draft.iban))) return "new";
  return recipientIds.includes(draft.recipientId) ? "amount" : "recipient";
}
