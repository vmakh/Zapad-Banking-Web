/** Annual compounding estimate. Reject results outside reliable cent precision. */
export function savingsEstimate(principal: number, annualRate: number, years: number) {
  if (![principal, annualRate, years].every(value => Number.isFinite(value) && value >= 0)) return null;
  const finalAmount = principal === 0 ? 0 : principal * Math.pow(1 + annualRate / 100, years);
  const interest = finalAmount - principal;
  const growth = principal > 0 ? interest / principal * 100 : 0;
  if (![finalAmount, interest, growth].every(Number.isFinite) || finalAmount > Number.MAX_SAFE_INTEGER / 100) return null;
  return { finalAmount, interest, growth };
}
