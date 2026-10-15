export const locales = [
  { id: "cnr-Latn", name: "Crnogorski · Latinica", short: "CG", intl: "sr-Latn-ME" },
  { id: "cnr-Cyrl", name: "Црногорски · Ћирилица", short: "ЦГ", intl: "sr-Cyrl-ME" },
  { id: "sr-Latn", name: "Srpski · Latinica", short: "SR", intl: "sr-Latn-ME" },
  { id: "sr-Cyrl", name: "Српски · Ћирилица", short: "СР", intl: "sr-Cyrl-ME" },
  { id: "bs", name: "Bosanski", short: "BS", intl: "bs-BA" },
  { id: "hr", name: "Hrvatski", short: "HR", intl: "hr-HR" },
  { id: "sq", name: "Shqip", short: "SQ", intl: "sq-AL" },
  { id: "en", name: "English", short: "EN", intl: "en-GB" },
  { id: "uk", name: "Українська", short: "UA", intl: "uk-UA" },
  { id: "ru", name: "Русский", short: "RU", intl: "ru-RU" },
  { id: "tr", name: "Türkçe", short: "TR", intl: "tr-TR" },
  { id: "de", name: "Deutsch", short: "DE", intl: "de-DE" },
  { id: "it", name: "Italiano", short: "IT", intl: "it-IT" },
] as const;

export type Locale = typeof locales[number]["id"];
export const DEFAULT_LOCALE: Locale = "cnr-Latn";
export const LOCALE_STORAGE_KEY = "zapadbanka-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some(locale => locale.id === value);
}

export function resolveLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const code = language.toLowerCase().replaceAll("_", "-");
    const exact = locales.find(locale => locale.id.toLowerCase() === code);
    if (exact) return exact.id;
    const [base] = code.split("-");
    if (base === "cnr" || base === "me") return code.includes("cyrl") ? "cnr-Cyrl" : "cnr-Latn";
    if (base === "sr") return code.includes("latn") ? "sr-Latn" : "sr-Cyrl";
    const match = locales.find(locale => locale.id === base);
    if (match) return match.id;
  }
  return DEFAULT_LOCALE;
}
