const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleValue = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('src/app/data/cashFlow.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
vm.runInNewContext(code, { module: moduleValue, exports: moduleValue.exports });
const { getCashFlow } = moduleValue.exports;
const total = (rows, key) => rows.reduce((sum, row) => sum + Math.round(row[key] * 100), 0);

test('daily scenario reconciles exactly to May and keeps cash-flow direction', () => {
  const daily = getCashFlow('business', 'month');
  const annual = getCashFlow('business', 'year');
  assert.equal(daily.length, 31);
  assert.equal(daily[0].day, 1);
  assert.equal(daily[30].day, 31);
  assert(daily.every(row => row.month === 4 && row.income >= 0 && row.spending <= 0));
  for (const key of ['income', 'spending']) assert.equal(total(daily, key), Math.round(annual[4][key] * 100));
});
test('quarter contains April through June and reconciles to the yearly series', () => {
  const quarter = getCashFlow('business', 'quarter');
  const annual = getCashFlow('business', 'year');
  assert.equal(annual.length, 12);
  assert.deepEqual(Array.from(quarter, row => row.month), [3, 4, 5]);
  for (const key of ['income', 'spending']) assert.equal(total(quarter, key), total(annual.slice(3, 6), key));
});

test('each selected month has the correct number of days and reconciles to annual totals', () => {
  const annual = getCashFlow('business', 'year');
  for (let month = 0; month < 12; month++) {
    const daily = getCashFlow('business', 'month', month);
    assert.equal(daily.length, new Date(2026, month + 1, 0).getDate());
    assert(daily.every(row => row.month === month && row.income >= 0 && row.spending <= 0));
    for (const key of ['income', 'spending']) assert.equal(total(daily, key), Math.round(annual[month][key] * 100));
  }
});
test('each selected quarter includes exactly its three months', () => {
  const annual = getCashFlow('business', 'year');
  for (let quarter = 0; quarter < 4; quarter++) {
    const rows = getCashFlow('business', 'quarter', quarter * 3 + 1);
    assert.deepEqual(Array.from(rows, row => row.month), [quarter * 3, quarter * 3 + 1, quarter * 3 + 2]);
    for (const key of ['income', 'spending']) assert.equal(total(rows, key), total(annual.slice(quarter * 3, quarter * 3 + 3), key));
  }
});

function loadSelection(storage) {
  const instance = { exports: {} };
  vm.runInNewContext(code, { module: instance, exports: instance.exports, localStorage: storage });
  return instance.exports;
}

test('cash-flow selection survives a fresh module with shared browser storage', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const first = loadSelection(storage);
  first.saveCashFlowSelection('business', { period: 'quarter', selectedMonth: 8 });
  const restored = loadSelection(storage).readCashFlowSelection('business');
  assert.equal(restored.period, 'quarter');
  assert.equal(restored.selectedMonth, 8);
  first.saveCashFlowSelection('business', { period: 'month', selectedMonth: 1 });
  assert.equal(loadSelection(storage).readCashFlowSelection('business').selectedMonth, 1);
  assert.equal(loadSelection(storage).readCashFlowSelection('business').period, 'month');
});
test('invalid or unavailable stored selection falls back without breaking the chart', () => {
  for (const raw of ['{', 'null', '{}', JSON.stringify({ version: 1, year: 2025, period: 'month', selectedMonth: 2 }), JSON.stringify({ version: 1, year: 2026, period: 'other', selectedMonth: 4 }), JSON.stringify({ version: 1, year: 2026, period: 'month', selectedMonth: 12 }), JSON.stringify({ version: 1, year: 2026, period: 'month', selectedMonth: 1.5 })]) {
    const selection = loadSelection({ getItem: () => raw }).readCashFlowSelection('business');
    assert.equal(selection.period, 'year');
    assert.equal(selection.selectedMonth, 4);
  }
  const blocked = loadSelection({ getItem() { throw Error('Blocked'); }, setItem() { throw Error('Blocked'); } });
  assert.equal(blocked.readCashFlowSelection('business').period, 'year');
  assert.doesNotThrow(() => blocked.saveCashFlowSelection('business', { period: 'month', selectedMonth: 3 }));
});

test('Personal scenario has independent values and every month reconciles to its annual series', () => {
  const { getCashFlow } = moduleValue.exports;
  const personal = getCashFlow('personal', 'year');
  const business = getCashFlow('business', 'year');
  assert.notEqual(total(personal, 'income'), total(business, 'income'));
  for (let month = 0; month < 12; month++) {
    const daily = getCashFlow('personal', 'month', month);
    assert.equal(daily.length, new Date(2026, month + 1, 0).getDate());
    for (const key of ['income', 'spending']) assert.equal(total(daily, key), Math.round(personal[month][key] * 100));
  }
});
test('profile selections restore independently and preserve the existing Business storage key', () => {
  const values = new Map([['zapadbanka-business-cashflow-selection-v1', JSON.stringify({ version: 1, year: 2026, period: 'quarter', selectedMonth: 10 })]]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const api = loadSelection(storage);
  assert.equal(api.readCashFlowSelection('business').selectedMonth, 10);
  api.saveCashFlowSelection('personal', { period: 'month', selectedMonth: 1 });
  const restored = loadSelection(storage);
  assert.equal(restored.readCashFlowSelection('personal').period, 'month');
  assert.equal(restored.readCashFlowSelection('personal').selectedMonth, 1);
  assert.equal(restored.readCashFlowSelection('business').period, 'quarter');
  assert.equal(restored.readCashFlowSelection('business').selectedMonth, 10);
});

test('monthly comparisons use preceding full month and positive spending magnitudes', () => {
  const comparison = moduleValue.exports.getCashFlowComparison('business', 'month', 4);
  assert.equal(comparison.previousStartMonth, 3);
  assert.equal(comparison.income.difference, -3200);
  assert.equal(comparison.spending.difference, -2100);
  assert(Math.abs(comparison.income.percent - (-3200 / 22600 * 100)) < 1e-9);
  assert(Math.abs(comparison.spending.percent - (-2100 / 14100 * 100)) < 1e-9);
  const personal = moduleValue.exports.getCashFlowComparison('personal', 'month', 1);
  assert.equal(personal.income.difference, 0);
  assert.equal(personal.income.percent, 0);
  assert.equal(personal.spending.difference, -180);
});
test('quarter comparison sums three months and year boundaries use the 2025 illustration', () => {
  const comparison = moduleValue.exports.getCashFlowComparison('business', 'quarter', 4);
  assert.equal(comparison.previousStartMonth, 0);
  assert.equal(comparison.previousEndMonth, 2);
  assert.equal(comparison.income.difference, 36800);
  assert.equal(comparison.spending.difference, 18600);
  for (const kind of ['personal', 'business']) {
    const january = moduleValue.exports.getCashFlowComparison(kind, 'month', 0);
    assert.equal(january.previousYear, 2025);
    assert.equal(january.previousStartMonth, 11);
    const firstQuarter = moduleValue.exports.getCashFlowComparison(kind, 'quarter', 2);
    assert.equal(firstQuarter.previousYear, 2025);
    assert.equal(firstQuarter.previousStartMonth, 9);
    const year = moduleValue.exports.getCashFlowComparison(kind, 'year', 11);
    assert.equal(year.previousYear, 2025);
    assert.equal(year.previousStartMonth, 0);
    assert.equal(year.previousEndMonth, 11);
  }
});
test('zero baseline returns no percentage unless both values are zero', () => {
  assert.equal(moduleValue.exports.cashFlowChange(50, 0).percent, null);
  assert.equal(moduleValue.exports.cashFlowChange(0, 0).percent, 0);
  assert.equal(moduleValue.exports.cashFlowChange(0, 20).percent, -100);
});

test('Personal January, first-quarter and annual comparisons reconcile to the supplied 2025 baseline', () => {
  const compare = moduleValue.exports.getCashFlowComparison;
  assert.equal(compare('personal', 'month', 0).income.difference, -700);
  assert.equal(compare('personal', 'quarter', 0).income.difference, -250);
  assert.equal(compare('personal', 'year', 0).income.difference, 1750);
});

test('bar comparisons use the matching point of the preceding displayed period', () => {
  const compare = moduleValue.exports.getCashFlowPointComparison;
  const year = compare('personal', 'year', 0, 1);
  assert.equal(year.previousYear, 2025);
  assert.equal(year.previousMonth, 0);
  assert.equal(year.income.previous, 3000);
  assert.equal(year.income.difference, 200);
  const quarter = compare('business', 'quarter', 4, 1);
  assert.equal(quarter.previousMonth, 1);
  assert.equal(quarter.income.previous, 9600);
  assert.equal(quarter.income.difference, 9800);
  assert.equal(quarter.spending.previous, 7200);
  const day = compare('personal', 'month', 2, 5);
  const priorDay = getCashFlow('personal', 'month', 1)[4];
  assert.equal(day.previousDay, 5);
  assert.equal(day.income.previous, priorDay.income);
  assert.equal(day.spending.previous, -priorDay.spending);
  assert.equal(compare('personal', 'month', 2, 31), null);
  assert.equal(compare('business', 'month', 4, 31), null);
  assert.equal(compare('personal', 'quarter', 0, 1).previousYear, 2025);
  assert.equal(compare('personal', 'month', 0, 31).previousMonth, 11);
});
