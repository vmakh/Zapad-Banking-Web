import { getIntlLocale } from "../i18n/runtime";

// Some WebKit builds omit Albanian ICU data and silently format sq-AL as English.
// Keep native Intl everywhere it is supported; these fallbacks cover the date,
// currency, percentage and compact-number options used by the banking demo.
export function numberFormatter(options: Intl.NumberFormatOptions = {}, locale = getIntlLocale()) {
  if (!locale.startsWith("sq") || Intl.NumberFormat.supportedLocalesOf(locale).length) {
    return new Intl.NumberFormat(locale, options);
  }
  const native = new Intl.NumberFormat("en-GB", options);
  const formatToParts = (value: number): Intl.NumberFormatPart[] => {
    const parts = native.formatToParts(value);
    const digits = parts.filter(part => part.type === "integer").reduce((sum, part) => sum + part.value.length, 0);
    const currency = parts.find(part => part.type === "currency");
    const compactNames: Record<string, string> = { K: "mijë", M: "mln", B: "mld", T: "bln" };
    const result: Intl.NumberFormatPart[] = [];
    for (const part of parts) {
      if (part.type === "currency") continue;
      if (part.type === "literal" && currency && /^\s+$/.test(part.value)) continue;
      if (part.type === "group") {
        if (digits > 4 || options.useGrouping === true) result.push({ ...part, value: "\u00a0" });
      } else if (part.type === "decimal") result.push({ ...part, value: "," });
      else if (part.type === "compact") {
        result.push({ type: "literal", value: "\u00a0" }, { ...part, value: compactNames[part.value] ?? part.value });
      } else result.push(part);
    }
    if (currency) result.push({ type: "literal", value: "\u00a0" }, currency);
    return result;
  };
  return { formatToParts, format: (value: number) => formatToParts(value).map(part => part.value).join("") };
}

const months = {
  long: ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"],
  short: ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"],
  narrow: ["j", "sh", "m", "p", "m", "q", "k", "g", "sh", "t", "n", "dh"],
};
const weekdays = {
  long: ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"],
  short: ["die", "hën", "mar", "mër", "enj", "pre", "sht"],
  narrow: ["d", "h", "m", "m", "e", "p", "sh"],
};
const englishMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const englishWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const germanWeekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export function dateFormatter(options: Intl.DateTimeFormatOptions = {}, locale = getIntlLocale()): Pick<Intl.DateTimeFormat, "format" | "formatToParts" | "formatRange"> {
  if (!locale.startsWith("sq") || Intl.DateTimeFormat.supportedLocalesOf(locale).length) {
    return new Intl.DateTimeFormat(locale, options);
  }
  const numericMonth = !options.month || options.month === "numeric" || options.month === "2-digit";
  const native = new Intl.DateTimeFormat(numericMonth ? "de-DE" : "en-GB", {
    ...options,
    ...(options.month === "narrow" ? { month: "long" } : {}),
    ...(options.weekday ? { weekday: "long" } : {}),
    ...(options.hour12 === undefined && options.hourCycle === undefined ? { hour12: true } : {}),
  });
  const localize = (part: Intl.DateTimeFormatPart): Intl.DateTimeFormatPart => {
    if (part.type === "month" && !numericMonth) {
      const index = englishMonths.findIndex(month => month === part.value || month.slice(0, 3) === part.value || (month === "September" && part.value === "Sept"));
      const width = options.month as keyof typeof months;
      return { ...part, value: index < 0 ? part.value : months[width][index] };
    }
    if (part.type === "weekday") {
      const index = Math.max(englishWeekdays.indexOf(part.value), germanWeekdays.indexOf(part.value));
      const width = options.weekday ?? "long";
      return { ...part, value: index < 0 ? part.value : weekdays[width][index] };
    }
    if (part.type === "dayPeriod") return { ...part, value: part.value.toLowerCase() === "am" ? "e paradites" : "e pasdites" };
    return part.type === "literal" ? { ...part, value: part.value.replace(/\u202f/g, " ") } : part;
  };
  const formatToParts = (value?: Date | number) => native.formatToParts(value).map(localize);
  return {
    formatToParts,
    format: value => formatToParts(value).map(part => part.value).join(""),
    formatRange: (start, end) => native.formatRangeToParts(start, end).map(localize).map(part => part.value).join(""),
  };
}
