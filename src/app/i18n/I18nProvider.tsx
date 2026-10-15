import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getIntlLocale, getLocale, setLocale, subscribeLocale, translate, type TranslationValues } from "./runtime";

export function useI18n() {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, () => "en" as const);
  const t = useMemo(() => (source: string, values?: TranslationValues) => translate(locale, source, values), [locale]);
  return { locale, intlLocale: getIntlLocale(), t, setLocale };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, t } = useI18n();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
    if (!document.querySelector(".bank-workspace")) document.title = `Zapad Banka — ${t("Banking demo")}`;
  }, [locale, t]);
  return children;
}
