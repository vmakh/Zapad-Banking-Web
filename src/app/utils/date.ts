import { getIntlLocale, t } from "../i18n/runtime";

/** Sample activity dates are anchored to May 2026, independent of today's clock. */
export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  let date: Date;
  if (value instanceof Date) date = value;
  else if (typeof value === "number") date = new Date(value);
  else {
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const sample = /^(?:May (\d{1,2})|(\d{1,2}) May)(?:,? 2026)?$/.exec(value);
    const relative = /^(Today|Yesterday), (\d{2}):(\d{2})$/.exec(value);
    if (iso) date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    else if (sample) date = new Date(2026, 4, Number(sample[1] ?? sample[2]));
    else if (relative) return `${t(relative[1])}, ${new Intl.DateTimeFormat(getIntlLocale(), { hour: "2-digit", minute: "2-digit" }).format(new Date(2026, 4, 11, Number(relative[2]), Number(relative[3])))}`;
    else if (/^\d{4}-\d{2}-\d{2}T/.test(value)) date = new Date(value);
    else return t(value);
  }
  if (!Number.isFinite(date.getTime())) return typeof value === "string" ? value : "—";
  return new Intl.DateTimeFormat(getIntlLocale(), options ?? { day: "numeric", month: "short" }).format(date);
}

export function formatDashboardDate(date = new Date(2026, 4, 11)): string {
  return formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function formatAnalyticsMonth(date = new Date(2026, 4, 11)): string {
  return formatDate(date, { month: "long", year: "numeric" });
}
