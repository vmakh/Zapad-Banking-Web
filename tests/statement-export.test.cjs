const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const cache = {};
function load(name) {
  if (cache[name]) return cache[name];
  const source = fs.readFileSync(`src/app/utils/${name}.ts`, 'utf8');
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    module, exports: module.exports, require: value => load(value.replace('./', '')),
  });
  return cache[name] = module.exports;
}
const { statementCsv } = load('statementExport');
const account = { name: 'Main account', iban: 'DE89370400440532013000', currency: 'EUR' };
const transaction = { id: 'sample-1', date: 'May 6', merchant: 'Shop, "Demo"', meta: '=HYPERLINK("bad")', category: 'Shopping', amount: -42.18, currency: 'EUR', status: 'Completed' };
test('CSV preserves all rows, signed amounts and safely quotes spreadsheet text', () => {
  const rows = Array.from({length: 100}, (_, i) => ({...transaction, id: `sample-${i}`}));
  const csv = statementCsv(account, rows, false);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"Posted transactions","100"'));
  assert.ok(csv.includes('"sample-99"'));
  assert.ok(csv.includes('"Shop, ""Demo"""'));
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));
  assert.ok(csv.includes('"-42.18","EUR","Completed"'));
});
test('privacy mode masks exported amounts and empty statements retain metadata', () => {
  const csv = statementCsv(account, [transaction], true);
  assert.ok(!csv.includes('-42.18'));
  assert.ok(csv.includes('"Hidden","EUR"'));
  const empty = statementCsv(account, [], false);
  assert.ok(empty.includes('"Posted transactions","0"'));
  assert.ok(empty.includes(account.iban));
  assert.ok(empty.includes('not an official bank statement'));
});
