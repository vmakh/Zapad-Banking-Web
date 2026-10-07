import type { BankAccount, ProfileKind } from "./types";

const personalAccounts: BankAccount[] = [
  {
    id: "p-main",
    name: "Main account",
    iban: "ME25 9900 0000 0000 3001 01",
    ibanShort: "ME25 ··· 3001",
    balance: 28430.18,
    currency: "EUR",
    type: "Current account",
    gradient: "from-brand-personal to-brand-personal-light",
    textClass: "text-white",
    accent: "linear-gradient(135deg,var(--brand-personal),var(--brand-personal-light))",
  },
  {
    id: "p-usd",
    name: "USD account",
    iban: "ME25 9900 0000 0000 3002 02",
    ibanShort: "ME25 ··· 3002",
    balance: 12480.55,
    currency: "USD",
    type: "Current account",
    gradient: "from-[#0e7a52] to-[#22b27a]",
    textClass: "text-white",
    accent: "linear-gradient(135deg,#0e7a52,#22b27a)",
  },
  {
    id: "p-savings",
    name: "Savings",
    iban: "ME25 9900 0000 0000 3003 03",
    ibanShort: "ME25 ··· 3003",
    balance: 8400.0,
    currency: "EUR",
    type: "Savings account",
    gradient: "from-brand-personal to-brand-personal-light",
    textClass: "text-white",
    accent: "linear-gradient(135deg,var(--brand-personal),var(--brand-personal-light))",
  },
  { id: "p-gbp", name: "GBP account", iban: "ME25 9900 0000 0000 3004 04", ibanShort: "Account ··· 3004", balance: 0, currency: "GBP", type: "Current account", gradient: "from-brand-personal to-brand-personal-light", textClass: "text-white", accent: "var(--brand-personal)" },
];

const businessAccounts: BankAccount[] = [
  {
    id: "b-operating",
    name: "Operating account",
    iban: "ME25 9900 0000 0000 2001 01",
    ibanShort: "ME25 ··· 2001",
    balance: 142180.42,
    currency: "EUR",
    type: "Current account",
    gradient: "from-brand-business to-brand-business-light",
    textClass: "text-slate-900",
    accent: "linear-gradient(135deg,var(--brand-business),var(--brand-business-light))",
  },
  {
    id: "b-usd",
    name: "USD payouts",
    iban: "ME25 9900 0000 0000 2002 02",
    ibanShort: "ME25 ··· 2002",
    balance: 38420.13,
    currency: "USD",
    type: "Current account",
    gradient: "from-[#0e7a52] to-[#22b27a]",
    textClass: "text-white",
    accent: "linear-gradient(135deg,#0e7a52,#22b27a)",
  },
  {
    id: "b-tax",
    name: "Tax reserve",
    iban: "ME25 9900 0000 0000 2003 03",
    ibanShort: "ME25 ··· 2003",
    balance: 18620.0,
    currency: "EUR",
    type: "Savings account",
    gradient: "from-brand-business to-brand-business-light",
    textClass: "text-slate-900",
    accent: "linear-gradient(135deg,var(--brand-business),var(--brand-business-light))",
  },
];

export function getAccounts(kind: ProfileKind): BankAccount[] {
  return kind === "business" ? businessAccounts : personalAccounts;
}

export function getAccountById(kind: ProfileKind, id: string): BankAccount | undefined {
  return getAccounts(kind).find((a) => a.id === id);
}

const PRIMARY_ACCOUNT_ID: Record<ProfileKind, string> = {
  personal: "p-main",
  business: "b-operating",
};

/** Main / operating account shown in dashboard hero */
export function getPrimaryAccount(kind: ProfileKind): BankAccount {
  const account = getAccountById(kind, PRIMARY_ACCOUNT_ID[kind]);
  if (!account) throw new Error(`Primary account missing for ${kind}`);
  return account;
}

export function getTotalEurBalance(kind: ProfileKind): number {
  return getAccounts(kind)
    .filter((a) => a.currency === "EUR")
    .reduce((sum, a) => sum + a.balance, 0);
}

export const ACCOUNT_TYPES = [
  { id: "current_eur", label: "Current account (EUR)", desc: "Everyday banking, SEPA payments, instant transfers", fee: "Free" },
  { id: "current_usd", label: "Current account (USD)", desc: "Hold and spend US dollars, international wire transfers", fee: "€2/month" },
  { id: "savings", label: "Savings account", desc: "Earn 1.8% APY on EUR deposits", fee: "Free" },
  { id: "fixed", label: "Fixed-term deposit", desc: "Earn 3.2% APY — locked for 12 months", fee: "Free" },
] as const;
