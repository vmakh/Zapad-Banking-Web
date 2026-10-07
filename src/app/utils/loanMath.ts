/** Illustrative monthly schedule; amounts rounded to cents after each payment. */
export function loanSchedule(balance: number, annualRate: number, payment: number, count: number) {
  return Array.from({ length: count }, () => {
    const interest = Math.round(balance * annualRate / 1200 * 100) / 100;
    const total = Math.min(payment, balance + interest);
    const principal = Math.round((total - interest) * 100) / 100;
    balance = Math.max(0, Math.round((balance - principal) * 100) / 100);
    return { principal, interest, total, remaining: balance };
  });
}
export function loanEstimate(principal: number, annualRate: number, months: number) {
  if (![principal, annualRate, months].every(Number.isFinite) || principal <= 0 || annualRate < 0 || months <= 0 || !Number.isInteger(months)) return null;
  const r = annualRate / 1200;
  const monthly = r === 0 ? principal / months : principal * r / (1 - Math.pow(1 + r, -months));
  return Number.isFinite(monthly) && Number.isFinite(monthly * months) ? { monthly, total: monthly * months, interest: monthly * months - principal } : null;
}

/** Validate raw form strings before Number() can turn an empty field into zero. */
export function loanInputErrors(principal: string, rate: string, months: string) {
  return {
    principal: /^\d+(\.\d{1,2})?$/.test(principal) && Number.isFinite(Number(principal)) && Number(principal) > 0
      ? "" : "Enter a positive amount with up to two decimal places.",
    rate: /^\d+(\.\d+)?$/.test(rate) && Number.isFinite(Number(rate)) && Number(rate) >= 0
      ? "" : "Enter a non-negative annual rate. Use 0 for zero interest.",
    months: /^\d+$/.test(months) && Number.isSafeInteger(Number(months)) && Number(months) > 0
      ? "" : "Enter a positive whole number of months.",
  };
}
