import type { Locale } from "./locales";
import cnr from "./locales/cnr.json";
import sq from "./locales/sq.json";
import uk from "./locales/uk.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import { regionalText, toCyrillic } from "./regional";

const mapCatalog = (catalog: Record<string, string>, transform: (text: string) => string) => Object.fromEntries(Object.entries(catalog).map(([key, value]) => [key, transform(value)]));
const sr = mapCatalog(cnr, text => regionalText(text, "sr"));

export const catalogs: Partial<Record<Locale, Record<string, string>>> = {
  "cnr-Latn": cnr,
  "cnr-Cyrl": mapCatalog(cnr, toCyrillic),
  "sr-Latn": sr,
  "sr-Cyrl": mapCatalog(sr, toCyrillic),
  bs: mapCatalog(cnr, text => regionalText(text, "bs")),
  hr: mapCatalog(cnr, text => regionalText(text, "hr")),
  sq, uk, ru, tr, de, it,
};
