const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loanSchedule, loanEstimate } = require('../src/app/utils/loanMath.ts');
test('schedule balances reconcile and reflect the displayed rate', () => {
  let balance = 8420;
  for (const row of loanSchedule(balance, 5.2, 320, 8)) {
    assert.equal(row.interest, Math.round(balance * .052 / 12 * 100) / 100);
    assert.ok(Math.abs(row.total - row.principal - row.interest) < .001);
    assert.equal(row.remaining, Math.round((balance - row.principal) * 100) / 100);
    balance = row.remaining;
  }
});
test('calculator handles zero interest and rejects invalid terms and negative values', () => {
  assert.deepEqual(loanEstimate(1200, 0, 12), { monthly: 100, total: 1200, interest: 0 });
  for (const input of [[-1,5,12],[100, -2,12],[100,5,0],[100,5,1.5],[Infinity,5,12]]) assert.equal(loanEstimate(...input),null);
  assert.ok(Math.abs(loanEstimate(10000, 5.2, 36).monthly - 300.61) < .02);
});
