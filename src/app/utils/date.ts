const DISPLAY_LOCALE = "en-GB";

export function formatDashboardDate(date = new Date(2026, 4, 11)): string {
  return date.toLocaleDateString(DISPLAY_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatAnalyticsMonth(date = new Date(2026, 4, 11)): string {
  return date.toLocaleDateString(DISPLAY_LOCALE, { month: "long", year: "numeric" });
}
