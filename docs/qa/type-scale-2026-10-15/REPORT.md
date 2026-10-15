# Approved type scale — 2026-10-15

Personal and Business share H1–H6 in locally bundled Unbounded 500 and Paragraph sm/md/lg in Onest 400. Sizes and line heights in px: 40/48, 32/40, 28/36, 24/32, 20/28, 16/24; paragraphs 12/20, 16/24, 20/28. Tracking and after-spacing match the approved table in DESIGN_SYSTEM.md. Last prose blocks have no trailing paragraph gap; layout gap is not doubled. Labels remain 500, amounts 600 and actions 650. Financial totals keep adaptive Onest sizing, tabular figures and an unbroken amount/currency pair.

Canonical tokens live in src/styles/design-system.css. The final semantic rules in index.css override legacy page, mobile and portal typography. Foundations displays all nine roles and a following paragraph to demonstrate real after-spacing. The font comparison page now identifies the 16 px body size.

## Verification

- 208 screen compositions: 13 routes × 2 profiles × 320/390/768/1440 px × Ukrainian/German.
- 60 base popup compositions: transaction details, transfer recipient/own accounts/bills, savings goal create/details, product default/filled/withdraw, Receive; both profiles at 320/768/1440 px.
- 66 additional popup compositions: card details/limits/freeze/new card/wallet/online payments, new account, loan application/repayment, reset settings and search; both profiles at 320/768/1440 px.
- 12 further German popup checks at 320 px, including long transfer and product action labels.
- Live computed family, size, line-height, weight, tracking and after-spacing checked for all nine type roles; Paragraph md = Onest 400, 16/24 px. Portal h2 = Unbounded 500, 32/40 px.

A category caption in mobile transaction history could exceed its amount row. The row now wraps and the category uses the supporting text role, keeping amounts readable. All four 320 px profile/language combinations passed the follow-up check.

Opening Sheet transforms initially report content outside the viewport. Settled panel checks confirm these are animation transients; no ignores or suppressions were added. Raw initial and follow-up measurements are retained separately. Screen measurement viewport sizes were checked against the requested dimensions.

No remaining clipping or horizontal overflow was found in the inspected final compositions. This covers geometry and rendered typography, not a new exhaustive accessibility or functional audit. Local preview fixtures isolate demo data from the user's application state; no banking operation was submitted.

`npm run check` passed: lint, TypeScript, 79 tests, generated registry and production build. The build retains its existing advisory about chunks above 500 kB.
