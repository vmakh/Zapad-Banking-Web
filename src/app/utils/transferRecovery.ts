import type { ProfileKind } from "../data/types";
import { readDemo } from "./demoStorage";
import { getPreviews } from "./paymentPreview";
import { parseTransferDraft } from "./transferDraft";

/** A committed preview wins over a stale draft left by failed cleanup. */
export function getTransferRecovery(kind: ProfileKind, type: "send" | "transfer" | "pay") {
  const draft = parseTransferDraft(readDemo<unknown>(`draft:${kind}:${type}`, null));
  const record = draft?.intentId ? getPreviews(kind).find(preview => preview.id === draft.intentId) ?? null : null;
  return { draft, record };
}
