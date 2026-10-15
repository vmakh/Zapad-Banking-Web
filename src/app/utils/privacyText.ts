/** Mask monetary values embedded in sample notification copy. */
export function maskMoneyInText(text: string): string {
  return text.replace(/(?:[€$£]|\b(?:EUR|USD|GBP))\s*\d+(?:[.,\u00a0\u202f ]\d+)*|\d+(?:[.,\u00a0\u202f ]\d+)*\s*(?:[€$£]|(?:EUR|USD|GBP)\b)/g, "•••");
}
