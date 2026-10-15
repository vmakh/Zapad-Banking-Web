import { catalogs } from "./catalog";
import { DEFAULT_LOCALE, isLocale, locales, LOCALE_STORAGE_KEY, resolveLocale, type Locale } from "./locales";
export { resolveLocale } from "./locales";

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch { /* Browser privacy settings may disable storage. */ }
  return typeof navigator === "undefined" ? "en" : resolveLocale(navigator.languages ?? []);
}

let currentLocale = initialLocale();
const listeners = new Set<() => void>();
export const getLocale = () => currentLocale;
export const getIntlLocale = () => locales.find(locale => locale.id === currentLocale)?.intl ?? "sr-Latn-ME";
export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Switching always works in memory, even if the browser blocks persistence. */
export function setLocale(value: string): boolean {
  if (!isLocale(value)) return false;
  let saved = true;
  try { localStorage.setItem(LOCALE_STORAGE_KEY, value); } catch { saved = false; }
  if (currentLocale !== value) {
    currentLocale = value;
    listeners.forEach(listener => listener());
  }
  return saved;
}

export type TranslationValues = Record<string, string | number | undefined>;
export function translate(locale: Locale, source: string, values?: TranslationValues): string {
  const translated = catalogs[locale]?.[source] ?? source;
  // Callback replacement preserves literal $, braces and other characters in user data.
  return translated.replace(/\{(\w+)\}/g, (token, key: string) => values && key in values ? String(values[key] ?? "") : token);
}
export function t(source: string, values?: TranslationValues): string {
  return translate(currentLocale ?? DEFAULT_LOCALE, source, values);
}
