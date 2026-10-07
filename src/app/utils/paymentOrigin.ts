import type { ProfileSlug } from "../data/types";

/** Return only to known in-app origins with an account owned by this profile. */
export function paymentReturnPath(profile: ProfileSlug, params: URLSearchParams, accountIds: string[]): string | null {
  const source = params.get("source");
  if (!source || !accountIds.includes(source)) return null;
  if (params.get("origin") === "home") return `/${profile}?account=${encodeURIComponent(source)}`;
  if (params.get("origin") === "accounts") return `/${profile}/accounts/${encodeURIComponent(source)}`;
  return null;
}

/** The editable FX pair must not overwrite its original navigation context. */
export function exchangeReturnPath(profile: ProfileSlug, params: URLSearchParams, accountIds: string[]): string | null {
  const origin = new URLSearchParams({ origin: params.get("origin") ?? "", source: params.get("originAccount") ?? "" });
  return paymentReturnPath(profile, origin, accountIds);
}
