/** en-US: thousands with commas, dot as decimal separator (e.g. 28,430.18) */

const LOCALE = "en-US";

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

export function formatInteger(value: number): string {
  return value.toLocaleString(LOCALE, { maximumFractionDigits: 0 });
}

const moneyFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function coerceMoneyAmount(value: number): number | null {
  if (!Number.isFinite(value)) return null;
  return value;
}

/** Split balance for large hero typography (whole part includes grouping separators). */
export function formatMoneyParts(value: number): {
  sign: string;
  whole: string;
  cents: string;
} {
  const amount = coerceMoneyAmount(value);
  if (amount === null) {
    return { sign: "", whole: "—", cents: "00" };
  }

  const sign = amount < 0 ? "-" : "";
  const parts = moneyFormatter.formatToParts(Math.abs(amount));
  const whole = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const cents = parts.find((p) => p.type === "fraction")?.value ?? "00";
  return { sign, whole, cents };
}

/** Fluid hero balance — scales with viewport, never overflows the card. */
export function heroBalanceMainSizeClass(whole: string): string {
  const digits = whole.replace(/\D/g, "").length;
  if (digits > 7) return "text-[clamp(1.5rem,3.2vw,2.25rem)]";
  if (digits > 5) return "text-[clamp(1.625rem,3.8vw,2.625rem)]";
  return "text-[clamp(1.875rem,4.5vw,3.25rem)]";
}

export function heroBalanceCentsSizeClass(whole: string): string {
  const digits = whole.replace(/\D/g, "").length;
  if (digits > 7) return "text-[clamp(0.8125rem,1.8vw,1.125rem)]";
  if (digits > 5) return "text-[clamp(0.875rem,2vw,1.25rem)]";
  return "text-[clamp(1rem,2.2vw,1.375rem)]";
}

export function heroBalanceSymbolSizeClass(whole: string): string {
  const digits = whole.replace(/\D/g, "").length;
  if (digits > 5) return "text-[clamp(1rem,2.2vw,1.5rem)]";
  return "text-[clamp(1.125rem,2.5vw,1.75rem)]";
}

export function currencySymbol(currency: string): string {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "GBP") return "£";
  return `${currency} `;
}

export function formatMoney(
  amount: number,
  currency: string = "EUR",
  options?: {
    decimals?: number;
    showPlus?: boolean;
    hideSymbol?: boolean;
  },
): string {
  const coerced = coerceMoneyAmount(amount);
  const symbol = options?.hideSymbol ? "" : currencySymbol(currency);
  if (coerced === null) {
    return `${symbol}—`;
  }

  const decimals = options?.decimals ?? 2;
  const formatted = Math.abs(coerced).toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  let sign = "";
  if (coerced < 0) sign = "-";
  else if (options?.showPlus && coerced > 0) sign = "+";
  return `${sign}${symbol}${formatted}`;
}

/** Compact labels: €4.8k, €32k, €1.2M */
export function formatMoneyCompact(value: number, currency: string = "EUR"): string {
  const sym = currencySymbol(currency);
  const coerced = coerceMoneyAmount(value);
  if (coerced === null) {
    return `${sym}—`;
  }

  const abs = Math.abs(coerced);
  if (abs >= 1_000_000) {
    return `${sym}${(abs / 1_000_000).toLocaleString(LOCALE, { maximumFractionDigits: 1 })}M`;
  }
  if (abs >= 1_000) {
    return `${sym}${(abs / 1_000).toLocaleString(LOCALE, { maximumFractionDigits: 1 })}k`;
  }
  return formatMoney(abs, currency, { decimals: 0 });
}

/** Account card balance — scales down for long amounts so nothing clips. */
export function accountBalanceSizeClass(value: number): string {
  const digits = formatMoneyParts(value).whole.replace(/\D/g, "").length;
  if (digits > 7) return "text-base sm:text-lg font-extrabold tracking-tight leading-tight";
  if (digits > 5) return "text-lg sm:text-xl font-extrabold tracking-tight leading-tight";
  return "text-xl sm:text-2xl font-extrabold tracking-tighter leading-tight";
}
