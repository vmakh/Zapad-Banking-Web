const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function environment(saved, languages = ['en-GB'], blocked = false) {
  const cache = new Map();
  const data = new Map(saved ? [['zapadbanka-locale', saved]] : []);
  const localStorage = {
    getItem(key) { if (blocked) throw Error('Storage blocked'); return data.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); data.set(key, value); },
  };
  function load(file) {
    const filename = path.resolve(file);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    if (filename.endsWith('.json')) module.exports = JSON.parse(fs.readFileSync(filename, 'utf8'));
    else {
      const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
      vm.runInNewContext(code, {
        module, exports: module.exports, localStorage, navigator: { languages }, Intl, Date,
        require: name => load(path.resolve(path.dirname(filename), name + (path.extname(name) ? '' : '.ts'))),
      });
    }
    return module.exports;
  }
  return { load, data, reload() { cache.clear(); return load("src/app/i18n/runtime.ts"); } };
}

test('locale resolves browser variants, prefers saved choice and handles unavailable storage', () => {
  const runtime = environment('uk', ['de-DE']).load('src/app/i18n/runtime.ts');
  assert.equal(runtime.getLocale(), 'uk');
  assert.equal(runtime.resolveLocale(['fr-FR', 'sr-Latn-RS']), 'sr-Latn');
  assert.equal(runtime.resolveLocale(['sr-RS']), 'sr-Cyrl');
  assert.equal(runtime.resolveLocale(['me-ME']), 'cnr-Latn');
  assert.equal(runtime.resolveLocale(['fr-FR']), 'cnr-Latn');
  assert.equal(environment('bad', ['sq-AL']).load('src/app/i18n/runtime.ts').getLocale(), 'sq');
  const blocked = environment(undefined, ['uk-UA'], true).load('src/app/i18n/runtime.ts');
  assert.equal(blocked.getLocale(), 'uk');
  assert.equal(blocked.setLocale('de'), false);
  assert.equal(blocked.getLocale(), 'de');
});

test('language changes notify subscribers, persist and preserve interpolation values literally', () => {
  const e = environment('en');
  const runtime = e.load('src/app/i18n/runtime.ts');
  let notifications = 0;
  const stop = runtime.subscribeLocale(() => notifications++);
  assert.equal(runtime.setLocale('uk'), true);
  assert.equal(e.data.get('zapadbanka-locale'), 'uk');
  assert.equal(notifications, 1);
  assert.equal(runtime.t('Good afternoon, {name}', { name: 'Alex $& {other}' }), 'Добрий день, Alex $& {other}');
  assert.equal(runtime.t('Unknown fallback {value}', { value: '<script>' }), 'Unknown fallback <script>');
  assert.equal(runtime.setLocale('invalid'), false);
  assert.equal(runtime.getLocale(), 'uk');
  stop();
  runtime.setLocale('en');
  assert.equal(notifications, 1);
});

test('every selected language survives a fresh runtime and Ukrainian keeps its UA label', () => {
  const e = environment('en', ['de-DE']);
  const { locales } = e.load('src/app/i18n/locales.ts');
  let runtime = e.load('src/app/i18n/runtime.ts');
  for (const selected of locales) {
    assert.equal(runtime.setLocale(selected.id), true);
    runtime = e.reload();
    assert.equal(runtime.getLocale(), selected.id, `${selected.id} must survive reload`);
    const restored = e.load('src/app/i18n/locales.ts').locales.find(item => item.id === runtime.getLocale());
    assert.equal(restored.short, selected.short);
    if (selected.id === 'uk') {
      assert.equal(restored.short, 'UA');
      assert.equal(runtime.t('Settings'), 'Налаштування');
    }
  }
});

test('money and dates change locale without changing values or decimal input semantics', () => {
  const e = environment('en');
  const runtime = e.load('src/app/i18n/runtime.ts');
  const format = e.load('src/app/utils/format.ts');
  const date = e.load('src/app/utils/date.ts');
  assert.equal(format.formatMoney(1234.56), '€1,234.56');
  runtime.setLocale('de');
  assert.equal(format.formatMoney(1234.56), '1.234,56 €');
  assert.equal(format.formatMoneyParts(1234.56).decimal, ',');
  assert.match(date.formatDate('2026-05-11', { month: 'long', day: 'numeric' }), /11\. Mai/);
  assert.equal(format.formatMoney(-12.5, 'EUR', { showPlus: true }), '-12,50 €');
});

test('Cyrillic transliteration preserves placeholders, brands and financial codes', () => {
  const { toCyrillic } = environment().load('src/app/i18n/regional.ts');
  assert.equal(toCyrillic('Štednja · {name} · EUR · ZapadBanka'), 'Штедња · {name} · EUR · ZapadBanka');
  assert.equal(toCyrillic('Njegoš, Ljiljana, Džep'), 'Његош, Љиљана, Џеп');
});

test('sample goal and transaction labels translate without translating user content', () => {
  const e = environment('uk');
  const { localizedGoalName, localizedMerchant } = e.load('src/app/i18n/display.ts');
  assert.equal(localizedGoalName({ id: 'vacation', name: 'My holiday' }), 'My holiday');
  assert.equal(localizedGoalName({ id: 'custom-goal', name: 'Holiday goal' }), 'Holiday goal');
  assert.notEqual(localizedGoalName({ id: 'vacation', name: 'Holiday goal' }), 'Holiday goal');
  assert.equal(localizedMerchant('Caffe Aroma'), 'Caffe Aroma');
  assert.equal(localizedMerchant('Salary · Demo Corp DOO'), 'Зарплата · Demo Corp DOO');
});

test('every offered language has complete nonempty copy and matching interpolation parameters', () => {
  const e = environment('en');
  const { catalogs } = e.load('src/app/i18n/catalog.ts');
  const { locales } = e.load('src/app/i18n/locales.ts');
  const sources = JSON.parse(fs.readFileSync('src/app/i18n/source.json', 'utf8'));
  const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const locale of locales.filter(item => item.id !== 'en')) {
    for (const source of sources) {
      const translated = catalogs[locale.id]?.[source];
      assert.ok(typeof translated === 'string' && translated.trim(), `${locale.id}: ${source}`);
      assert.deepEqual(placeholders(translated), placeholders(source), `${locale.id}: ${source}`);
    }
    assert.notEqual(catalogs[locale.id].Settings, 'Settings');
  }
});

test('invoice alerts interpolate the formatted amount rather than a fixed English currency string', () => {
  const e = environment('uk');
  const runtime = e.load('src/app/i18n/runtime.ts');
  const { formatMoney } = e.load('src/app/utils/format.ts');
  const amount = formatMoney(4820, 'EUR');
  assert.equal(runtime.t('Invoice {reference} · {amount}', { reference: 'INV-2034', amount }), `Рахунок INV-2034 · ${amount}`);
  runtime.setLocale('de');
  assert.equal(runtime.t('Invoice {reference} · {amount}', { reference: 'INV-2040', amount: formatMoney(1250.5, 'EUR') }), 'Rechnung INV-2040 · 1.250,50 €');
});

test('Ukrainian instructions use the same activity destination as navigation', () => {
  const { catalogs } = environment('uk').load('src/app/i18n/catalog.ts');
  assert.equal(catalogs.uk.Activity, 'Операції');
  for (const [source, translation] of Object.entries(catalogs.uk)) {
    if (/\bActivity\b/.test(source)) assert.doesNotMatch(translation, /Активн/iu, source);
  }
});

test('inbox monetary values and rates follow the selected locale and remain maskable', () => {
  const e = environment('uk');
  const runtime = e.load('src/app/i18n/runtime.ts');
  const { localizedMessageBody } = e.load('src/app/i18n/display.ts');
  const { maskMoneyInText } = e.load('src/app/utils/privacyText.ts');
  const invoice = { body: 'Review demo invoice INV-2034 for {amount} to Techno d.o.o. Any approval is a local preview; no payment is processed.', bodyAmount: 4820 };
  const body = localizedMessageBody(invoice);
  assert.ok(body.includes('4 820,00 EUR'));
  assert.ok(body.includes('INV-2034'));
  const masked = maskMoneyInText(body);
  assert.ok(masked.includes('INV-2034'));
  assert.ok(!masked.includes('820'));
  const rate = { body: 'The sample savings account uses an illustrative {rate}% APY. This is a demo value, not a current bank offer.', bodyRate: 1.8 };
  assert.ok(localizedMessageBody(rate).includes('1,8%'));
  runtime.setLocale('de');
  assert.ok(localizedMessageBody(invoice).includes('4.820,00 €'));
  assert.equal(localizedMessageBody({ body: 'User-entered 120.00 EUR' }), 'User-entered 120.00 EUR');
});
