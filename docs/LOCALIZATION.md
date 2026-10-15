# Localization

The demo offers 11 languages and 13 language/script choices:

- Montenegrin (`cnr-Latn`, `cnr-Cyrl`)
- Serbian (`sr-Latn`, `sr-Cyrl`), using Ijekavian terminology appropriate to Montenegro
- Bosnian (`bs`), Croatian (`hr`), Albanian (`sq`)
- English (`en`), Ukrainian (`uk`), Russian (`ru`), Turkish (`tr`), German (`de`), Italian (`it`)

This product selection covers local and regional clients and common international audiences. It is not a claim about a legal language requirement. Background: [MONSTAT census language results](https://www.monstat.org/eng/novosti.php?id=4012) and [MONSTAT visitor statistics](https://www.monstat.org/uploads/files/TURIZAM/DIN2025/5prel/TURIZAM_EN_Maj_2025.pdf).

## Behavior

The language-code menu in the top bar and Language in Settings change the same device-level preference. The app first restores a valid saved choice (`zapadbanka-locale`), then checks browser language preferences. Unsupported preferences fall back to Montenegrin Latin. Switching preserves the current route, profile, forms and existing demo state. If storage is blocked, switching still works for the current visit and explains that the choice could not be saved.

`document.lang` and the document title follow the language. All current locales read left to right. `Intl` uses `sr-Latn-ME`/`sr-Cyrl-ME` for Montenegrin number and date formatting because browser support for `cnr` is inconsistent; the selected and declared language remains Montenegrin.

## Authoring

Use `useI18n()` from `src/app/i18n/I18nProvider.tsx` in rendered components. It subscribes to language changes without remounting the application. `t("Source text", { name })` uses English source strings with named placeholders. Translate whole sentences so translators can reorder values. Outside React, `t()` from `runtime.ts` reads the current locale.

Catalog coverage and placeholder parity are tested by `tests/localization.test.cjs`. Add each new source string to `source.json` and every base-language catalog. English uses the source copy. Montenegrin, Serbian, Bosnian and Croatian share Ijekavian copy with explicit regional vocabulary adjustments in `regional.ts`; Cyrillic is derived from catalog copy only, preserving placeholders, brands and financial codes.

Keep route segments, account IDs, filter values, status enums, stored previews and validation identifiers language-independent. Translate their labels at render time. Never translate user-entered notes, payees or custom goal names. `display.ts` localizes only known sample goal names and the descriptive part of sample merchants.

Use the shared number/currency/date utilities. Date-only values are parsed as calendar dates, avoiding UTC day shifts. Sample activity remains anchored to May 2026. Decimal forms accept a dot or comma without guessing thousands separators. CSV headings and display labels are translated, while numeric CSV values remain machine-readable decimal numbers.

Demo notices must retain their meaning in every language: no real settlement, sign-in, bank authorization, notifications or market quotes. Translations are prototype copy, not bank-approved product terms.

## Persistence verification — 15 October 2026

Browser verification confirmed Ukrainian copy and `UA` after reloading Personal, switching to Business, reloading Business and returning to Personal. Repeated the change/reload/profile checks with English and `EN`, then restored Ukrainian in Personal. The label is derived from the same restored locale as the translated interface; Ukrainian uses display code `UA` while its locale ID remains `uk`.

The localization suite also reloads a fresh runtime against retained storage for each of the 13 offered locales, checks the restored locale and short label, and explicitly asserts `UA` and Ukrainian copy. Final `npm run check` passed: 63 tests, lint, TypeScript, registry consistency and production build. Persistence requires browser storage to be available, as described above.
