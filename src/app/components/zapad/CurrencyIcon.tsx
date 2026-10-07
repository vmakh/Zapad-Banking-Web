import eurFlag from "../../../assets/currency/eu.svg";
import gbpFlag from "../../../assets/currency/gb.svg";
import usdFlag from "../../../assets/currency/us.svg";

const flags: Record<string, string> = { EUR: eurFlag, GBP: gbpFlag, USD: usdFlag };

/** Exact circular SVG artwork used by the mobile currency picker. */
export function CurrencyFlag({ currency }: { currency: string }) {
  const src = flags[currency];
  return src ? <img className="bank-currency-flag" src={src} alt="" aria-hidden="true" width={28} height={28} /> : null;
}

/** Accounts share the same circular currency artwork as currency pickers. */
export function CurrencyMark({ currency }: { currency: string }) {
  return flags[currency] ? <CurrencyFlag currency={currency} /> : <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">{currency}</span>;
}
