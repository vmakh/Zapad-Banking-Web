import { getAccountById } from "../data/accounts";
import { getCardById } from "../data/cards";
import { getGoals } from "../data/goals";
import type { PaymentAction, ProfileKind, ProfileSlug } from "../data/types";

function profileKindFromSlug(slug: ProfileSlug): ProfileKind {
  return slug === "business" ? "business" : "personal";
}

/** Keep profile switch from landing on invalid account/card/goal deep links */
export function sanitizePathForProfile(
  pathAfterProfile: string,
  targetSlug: ProfileSlug,
): string {
  let rest = pathAfterProfile || "";
  const kind = profileKindFromSlug(targetSlug);

  const accountMatch = rest.match(/^\/accounts\/([^/?#]+)/);
  if (accountMatch && !getAccountById(kind, accountMatch[1])) {
    rest = "/accounts";
  }

  const cardMatch = rest.match(/^\/cards\/([^/?#]+)/);
  if (cardMatch && !getCardById(kind, cardMatch[1])) {
    rest = "/cards";
  }

  const goalMatch = rest.match(/^\/savings\/goals\/([^/?#]+)/);
  if (goalMatch && !getGoals(kind).some((g) => g.id === goalMatch[1])) {
    rest = "/savings";
  }

  return rest;
}

export function profilePath(profile: ProfileSlug, segment = ""): string {
  const base = `/${profile}`;
  if (!segment) return base;
  return `${base}/${segment.replace(/^\//, "")}`;
}

export function paymentsPath(profile: ProfileSlug, action?: PaymentAction): string {
  const base = profilePath(profile, "payments");
  return action ? `${base}?action=${action}` : base;
}

export function statementsPath(
  profile: ProfileSlug,
  params?: { account?: string; from?: string; to?: string },
): string {
  const base = profilePath(profile, "statements");
  if (!params) return base;
  const search = new URLSearchParams();
  if (params.account) search.set("account", params.account);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  const q = search.toString();
  return q ? `${base}?${q}` : base;
}

export function inboxPath(profile: ProfileSlug, filter?: "unread"): string {
  const base = profilePath(profile, "inbox");
  return filter ? `${base}?filter=unread` : base;
}

export function accountPath(profile: ProfileSlug, accountId: string): string {
  return profilePath(profile, `accounts/${accountId}`);
}

export function cardPath(profile: ProfileSlug, cardId: string): string {
  return profilePath(profile, `cards/${cardId}`);
}

export function goalPath(profile: ProfileSlug, goalId: string): string {
  return profilePath(profile, `savings/goals/${goalId}`);
}

export function navIdFromPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "dashboard";
  const segment = parts[1];
  if (segment === "accounts") return "accounts";
  if (segment === "cards") return "cards";
  if (segment === "savings") return "savings";
  if (segment === "transactions") return "transactions";
  if (segment === "settings" || segment === "help") return segment;
  return segment;
}

/** Shared max width for main content pages */
export const PAGE_MAX_WIDTH = "max-w-[1200px]";
