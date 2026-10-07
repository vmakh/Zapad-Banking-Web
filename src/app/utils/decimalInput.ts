/** Canonical decimal input; deliberately does not interpret thousands separators. */
export function normalizeDecimalInput(value: string): string {
  return /^\d*,\d*$/.test(value) ? value.replace(",", ".") : value;
}
