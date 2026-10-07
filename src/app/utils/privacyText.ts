/** Mask monetary values embedded in sample notification copy. */
export function maskMoneyInText(text: string): string {
  return text.replace(/[€$£]\s*\d(?:[\d,.]*\d)?/g, "•••");
}
