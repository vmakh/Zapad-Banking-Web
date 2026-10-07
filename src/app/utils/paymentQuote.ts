import { validMoney } from "./goalRules";
// Illustrative rates shared with the mobile concept; never live banking quotes.
const rates: Record<string, number> = { EUR_GBP: .8532, GBP_EUR: 1.1718, EUR_USD: 1.085, USD_EUR: .9217, GBP_USD: 1.2713, USD_GBP: .7866 };
export function demoRate(from: string, to: string): number {
  return from === to ? 1 : rates[`${from}_${to}`] ?? 0;
}
export function paymentQuote(amount: number, from: string, to: string, ownAccount = false) {
  const rate = demoRate(from, to);
  const fee = ownAccount ? 0 : Math.round(Math.max(2.49, amount * .0035) * 100) / 100;
  return { rate, fee, received: Math.round(amount * rate * 100) / 100, total: Math.round((amount + fee) * 100) / 100 };
}

export function canReviewPayment(amount: string, source: {id: string; currency: string; balance: number} | undefined, target: {id: string; currency: string} | undefined, ownAccount = false) {
  const number = Number(amount);
  if (!source || !Number.isFinite(source.balance) || !validMoney(amount) || !target) return false;
  if (ownAccount && (source.id === target.id || source.currency !== target.currency)) return false;
  const quote = paymentQuote(number, source.currency, target.currency, ownAccount);
  return quote.rate > 0 && quote.total <= source.balance;
}
