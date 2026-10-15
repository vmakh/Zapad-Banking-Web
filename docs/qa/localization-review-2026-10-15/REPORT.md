# Localization review — 2026-10-15

Reviewed the localization patch separately from the typography/design-system commit.

## Scope

- Shared Albanian fallback formatters are used only when the browser reports that the requested Albanian Intl locale is unsupported. Native Intl remains the path for supported locales.
- Dates, relative times and ranges use the shared helper in activity, cash-flow charts, investment values, loans and local preview history.
- The sample exchange rate is interpolated as a localized number in activity rows, search, transaction details, receipts and statement CSV. Arbitrary user text is unchanged.
- CSV dates/labels/details are localized while numeric amount cells retain canonical spreadsheet values.

## Review and verification

No blocking code-review defects found. The Albanian fallback is deliberately scoped to options used by this demo; it is not a general Intl polyfill.

Fresh browser checks: 208 compositions, covering Home, Transactions, Loans and Investments in both profiles at 390 and 1280 px, for all 13 offered language variants. No clipping or horizontal overflow was reported. Exchange-rate examples: `1,087` for Ukrainian, German and Albanian; `1.087` for English. A Business loan preview in Albanian displayed `25 maj 2026` and localized monetary values. No confirmation or financial submission was performed.

Existing localization QA matrices and their final source-language flag report were also inspected as supporting evidence; fresh checks are retained in this directory independently.

Automated tests cover translation completeness/interpolation for all offered languages, saved language selection, user-text preservation, Albanian formatting with deliberately missing Intl locale support, localized exchange metadata and CSV output in every language. The complete scoped commit snapshot passed `npm run check`: lint, TypeScript, 80 tests, regenerated UI registry and production build. Existing bundle-size advisories are unchanged.

Native-speaker editorial review and physical-device testing were not performed. Unrelated control styling and other workspace changes are excluded from this commit.

Evidence: [fresh browser checks](fresh-browser-checks.json), [Albanian Personal screenshot](albanian-personal-390.png).
