/** Card limits allow zero, but never exponent notation or fractions of a cent. */
export function cardLimitError(value: string): string {
  if (!value.trim()) return "Enter a daily limit. Use 0 to allow no spending.";
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Use a non-negative amount with up to two decimal places.";
  if (Number(value) > 1000000) return "The maximum daily limit is €1,000,000.";
  return "";
}
