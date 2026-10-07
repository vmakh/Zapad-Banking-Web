import type { BankAccount } from "../data/types";

/** Explicit account IDs must never silently fall back to another balance. */
export function resolveExchangeAccounts(accounts: BankAccount[], sourceId: string | null, targetId: string | null) {
  const source = sourceId === null ? accounts[0] : accounts.find(account => account.id === sourceId);
  const destination = targetId === null
    ? accounts.find(account => source && account.currency !== source.currency)
    : accounts.find(account => account.id === targetId);
  return {
    source,
    destination,
    invalidLink: (sourceId !== null && !source) || (targetId !== null && !destination),
  };
}
