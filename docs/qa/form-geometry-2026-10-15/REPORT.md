# Form geometry — 2026-10-15

Shared geometry for Personal and Business, including controls in Radix portals:

- Input, SelectTrigger, NativeSelect, default/lg Button: minimum 48 px, Onest 17 px / 1.4. Fields use 12 px inline / 8 px block padding; actions use 16 px inline / 8 px block padding.
- Selects and actions grow for wrapped labels. Textarea starts at 96 px. Command search uses a 48 px target and 17 px text.
- Field labels: 15 px / 500 with normal casing and tracking. Label gaps 8 px; adjacent actions 12 px; independent transfer/product/goal/loan/card-limit form groups 24 px.
- Transfer and product dialog bodies/footers align on 24 px insets. Leading currency adornments retain their dedicated inset. The Change action beside a long recipient name does not shrink into a vertical word.
- Compact/icon controls and larger explicit button variants retain their separate roles.

## Browser verification

Local isolated component previews, Ukrainian locale, both profiles, widths 320 / 768 / 1440 px:

- 78 page checks: Home, Payments, Accounts, Cards, Exchange, Loans, Savings, Investments, Statements, Transactions, Inbox, Settings, Help.
- 48 dialog checks: transfer recipient / own accounts / bills, savings goal create / details, product filled / withdraw, Receive.
- 66 additional checks: card details / limits / freeze / new card / wallet / online payments, new account, credit application / repayment, settings reset, search.
- Long synthetic recipient name, valid demo IBAN and amount/reference fields checked at 320 and 390 px. No banking operation was submitted.

All measured standard form controls met the 48 px minimum; inputs/selects/actions used 17 px. No form-control clipping or horizontal page overflow was found. Long selectors grew to about 66 px at 320 px instead of hiding account names. Focused and disabled controls retained the same geometry.

Bounds are measured alongside computed CSS height to avoid treating opening scale animations as undersized controls. Native single-line input values scroll inside their fields as expected. This is geometry verification, not an exhaustive keyboard/screen-reader audit.

Standing observation outside form scope: the Transactions income summary caption “Надходження” can extend beyond its statistic tile at 320 px. This was left unchanged; it is not a form or popup control. Opening-animation transient coordinates were rechecked after settling and were not counted as defects. No hook ignores or lint suppressions were added. Previously reported layout-transition utilities now list colour/border/shadow properties only.

Raw evidence: [measurements.json](measurements.json). Screenshot: [Business recipient form, 390 px](business-recipient-390.png).
