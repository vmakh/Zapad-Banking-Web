import { getIntlLocale } from "../i18n/runtime";

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return value.toLocaleString(getIntlLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

export function formatInteger(value: number): string {
  return value.toLocaleString(getIntlLocale(), { maximumFractionDigits: 0 });
}

const moneyFormatter = () => new Intl.NumberFormat(getIntlLocale(), {
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
  decimal: string;
} {
  const amount = coerceMoneyAmount(value);
  if (amount === null) {
    return { sign: "", whole: "—", cents: "00", decimal: new Intl.NumberFormat(getIntlLocale()).formatToParts(1.1).find(part => part.type === "decimal")?.value ?? "." };
  }

  const sign = amount < 0 ? "-" : "";
  const parts = moneyFormatter().formatToParts(Math.abs(amount));
  const whole = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const cents = parts.find((p) => p.type === "fraction")?.value ?? "00";
  const decimal = parts.find(p => p.type === "decimal")?.value ?? ".";
  return { sign, whole, cents, decimal };
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
  return new Intl.NumberFormat(getIntlLocale(), {
    ...(options?.hideSymbol ? {} : { style: "currency", currency }),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: options?.showPlus ? "exceptZero" : "auto",
  }).format(coerced);
}

/** Compact labels: €4.8k, €32k, €1.2M */
export function formatMoneyCompact(value: number, currency: string = "EUR"): string {
  const sym = currencySymbol(currency);
  const coerced = coerceMoneyAmount(value);
  if (coerced === null) {
    return `${sym}—`;
  }

  return new Intl.NumberFormat(getIntlLocale(), {
    style: "currency", currency, notation: "compact", maximumFractionDigits: 1,
  }).format(coerced);
}

/** Account card balance — scales down for long amounts so nothing clips. */
export function accountBalanceSizeClass(value: number): string {
  const digits = formatMoneyParts(value).whole.replace(/\D/g, "").length;
  if (digits > 7) return "text-base sm:text-lg font-extrabold tracking-tight leading-tight";
  if (digits > 5) return "text-lg sm:text-xl font-extrabold tracking-tight leading-tight";
  return "text-xl sm:text-2xl font-extrabold tracking-tighter leading-tight";
}
