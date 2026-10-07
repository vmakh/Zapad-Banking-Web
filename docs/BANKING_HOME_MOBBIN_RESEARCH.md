# Home banking: expanded Mobbin comparison

Date: 2026-09-29. Research through the Mobbin plugin only. Three targeted searches returned 22 screen captures across 12 products. Every returned image was inspected. Multiple states of the same product are not independent endorsements. Screenshots demonstrate layout, not usability outcomes or current feature availability. This document is research and implementation guidance, not a claim that the proposed Home changes have shipped.

## Evidence inventory

| Product / state | Visible evidence | Relevance to Zapad |
|---|---|---|
| [Mercury, privacy mode](https://mobbin.com/screens/dbf9eb63-dcfe-4876-965a-e8a6d8702092) | Send action above balance and Accounts cards; money movement and transactions below; amounts masked | Account access belongs with the overview; privacy covers both summary and rows |
| [Mercury, populated](https://mobbin.com/screens/a17be959-5966-495f-a230-65fcdcc333cf) | Balance and Checking/Savings side by side; Bill Pay and Invoicing below | Business Home prioritizes money and operational work, not decorative card management |
| [Mercury, empty](https://mobbin.com/screens/165fa92f-e286-4c9c-8215-94d43b883300) | Same balance/accounts structure with zero balances and money-movement empty states | Keep spatial structure stable as data arrives |
| [Mercury, Updates open](https://mobbin.com/screens/4d0b03ed-e24b-441f-9087-7c8c00b52a7d) | Visible notice says payment approvals and actionable tasks moved to Tasks; Updates holds account/product news | Actionable work and informational notifications need distinct destinations |
| [Revolut Business, approval](https://mobbin.com/screens/527e615d-ef34-44f5-8bc0-ec652ff85afb) | Selected balance and transactions left; Approvals for a virtual card request right, above widgets | Supports keeping pending work near top; this capture is a card request, not evidence of a payment approval flow |
| [Revolut Business, widgets](https://mobbin.com/screens/ce86e78a-f8da-40a6-b6c2-a7278202f23e) | Selected account above transactions; assets, invoices and cards on right | Separate primary account context from secondary widgets |
| [Revolut Business, compact widgets](https://mobbin.com/screens/4685d9fc-3a0a-402c-bd67-620809b6376a) | Same account/activity relationship with smaller right column | Amount of secondary content can vary without changing the core hierarchy |
| [Revolut Business, Inbox open](https://mobbin.com/screens/7e6026ac-4e5c-46fe-8e0a-9af8c72a9c49) | Notifications overlay Home; underlying selected account and activity remain visible | Useful overlay reference, not a different Home architecture |
| [Revolut personal web](https://mobbin.com/screens/1a949e12-a0cc-489e-b194-ca0a0787978f) | Accounts/Cards tabs; selected currency balance, details, statement and transaction in one surface | Compact account-scoped Home works without a second account table |
| [Monzo, account detail](https://mobbin.com/screens/6c2bac17-2f8f-468d-bc8f-c77b4cf7ea5b) | Account card and actions above daily activity, Back at top | Supports account/activity proximity, but is not evidence for multi-account Home |
| [Monzo, Home](https://mobbin.com/screens/f8295bc6-41ee-463f-987c-4cec448c6fea) | Stacked joint/personal account cards, Activity, then Pots | Account access precedes activity; goals are secondary |
| [N26, setup state](https://mobbin.com/screens/52ecfd8a-5c0a-4a0d-bf1f-518ee3b88767) | Account choices, balance, actions, setup tasks, transactions | Setup can displace activity temporarily; do not copy setup prominence into a populated dashboard |
| [N26, populated Home](https://mobbin.com/screens/c4c4ed50-dda0-4bb5-94fe-25fbdb685a45) | Account choices and balance above Send/Scheduled and Transactions | Strong reference for compact account selection at the top |
| [Starling, recent activity](https://mobbin.com/screens/4c74a579-1ac5-42e6-a65c-241690077a4a) | Personal selector and balance; Spending Spaces/total breakdown; Transactions below | Clearly distinguish available spending balance from total funds |
| [Starling, dated activity](https://mobbin.com/screens/871d829a-d693-44ae-aca4-83795da55d2d) | Same structure with dated transactions and Search & filter | Same product/state family, not independent support; useful long-history variation |
| [Wise, masked](https://mobbin.com/screens/0a9eff62-9a44-4f72-b5db-b4d2f6e1f564) | Send/Add/Request, currency account cards, Transactions, promotion | Currency navigation is part of overview; promotions follow core banking information |
| [Wise, multiple currencies](https://mobbin.com/screens/84b0e0a3-8666-402d-9726-ee539d6ef407) | Total labelled SGD; SGD/USD cards; Transactions below | Any aggregate needs a base-currency label and conversion methodology; do not simply sum Zapad currencies |
| [Rocket Money dashboard](https://mobbin.com/screens/f075dbe0-f75d-4955-9fbb-bca17ef8bb3d) | Spending trend left, account summary right, recent transactions below | Adjacent personal-finance reference; spending-led hierarchy should not automatically replace transactional banking Home |
| [Monarch account detail](https://mobbin.com/screens/d9b0b49f-d1c4-40ce-ae42-68b3ce48cd96) | One account chart and transaction table | Excluded as direct Home evidence |
| [Quicken Transactions](https://mobbin.com/screens/94f243a9-1578-4ef4-bb72-970cb8706e7c) | Persistent account tree and full ledger | Excluded as direct Home evidence; specialist accounting density |
| [QuickBooks Bank transactions](https://mobbin.com/screens/799374e9-c3b3-4dbe-9a44-55bdcff00996) | Pending/Posted/Excluded bank feed and accounting table | Excluded as direct Home evidence; reconciliation task |
| [YNAB All Accounts](https://mobbin.com/screens/33c9541c-2d22-4d3b-9c3a-b7596596443d) | Account tree, cleared/uncleared balances and ledger | Excluded as direct Home evidence; budgeting ledger |

## Current Zapad gaps confirmed in source

`DashboardPage.tsx` renders BalanceHero → five recent transactions → full AccountsStrip → SavingsGoals → Analytics in the left column. The right column contains Needs attention and Card. At a one-column breakpoint the entire right column follows all left-column content. Thus actionable attention items can be below goals and analytics on narrow screens.

BalanceHero shows only the primary account. Transactions reads all transactions in the profile, without an account filter. This is acceptable only as an explicitly profile-wide activity feed; adding an account selector without changing its scope would create an ambiguous relationship.

BalanceHero Transfer and Receive links currently carry the profile but no selected account. Any selector implementation must thread account identity through the action links, recipient/source initialization and Activity deep link. A visual selector alone would be incomplete.

## Proposed implementation contract

1. Keep one account context in the upper balance panel. Use a shared bounded selector with account name, currency and IBAN suffix, an unambiguous selected state and privacy-aware amounts. Make Accounts management available as a secondary link. Avoid a second copy of the selected balance farther down the page.
2. Scope Recent activity and its See all link to the selected account; label it by account name. Zero-activity accounts get an explicit empty state, not another account's transactions.
3. Transfer starts with that source; Receive opens that account's details. Cross-currency exchange remains a distinct flow. Changing profile resets selection to that profile's primary account and cannot carry another profile's account ID.
4. Split attention from the decorative card widget. On desktop attention can remain adjacent to the balance. On narrow screens actionable items must precede long history, goals and analytics. Do not use CSS visual reordering that contradicts keyboard/reading order.
5. Keep the user's single-primary-action rule: Transfer in the main overview; account management, Receive, Exchange and See all secondary. Pending work retains an explicit Review action without another oversized filled CTA.
6. Keep existing mobile-inspired card visuals; this research changes hierarchy, not the established brand palette. Do not imitate Starling's large gradient if it pushes core actions below the fold.

## Acceptance checks before calling this implemented

- Both profiles: primary/non-primary/zero-balance/zero-activity accounts; Personal GBP; Business USD and reserve.
- Account selector remains bounded for many accounts and long names; keyboard selection and visible selected state.
- Balance currency, displayed account, activity scope, Transfer source, Receive details and See all account filter agree.
- Profile change, reload and direct navigation have predictable defaults with no cross-profile leakage.
- Privacy mode masks balances in selector, hero and activity consistently.
- At 390 px and at 200% zoom: balance, account control and main action remain readable; pending attention is not after analytics; no horizontal overflow; focus order matches reading order.
- Wide layout: first viewport contains balance/actions and actionable attention; the start of recent activity is visible at the agreed test viewport. Do not claim every device can fit an unbounded list above the fold.
- Existing preview history stays explicitly separate from settled sample transactions; changing selected account must not mislabel preview amounts as bank activity.

## Limits

No moderated usability study was conducted. Mobbin examples support a design hypothesis, not a universal banking standard. The five adjacent finance/accounting products are identified separately to prevent inflated evidence counts. This pass adds research depth (22 inspected captures), but does not yet implement or verify the proposed account-scoped Home.

## Implementation pass after research

The account-scoped Home is now implemented locally. Dashboard account selection is stored in the route query, validated against the active profile, and defaults to its primary account. The old duplicate AccountsStrip was removed from Home; Manage accounts leads to the full account page. Transfer and Receive carry the selected source ID. Recent activity and See all use the same account scope; existing sample history belongs only to the primary EUR account. Other accounts show an honest empty state.

Attention and balance now form the first grid; activity and the card widget follow. DOM order places attention before activity on narrow layouts. Transaction rows are keyboard-operable. Mobile selector text shows account name/currency without forcing IBAN into a narrow trigger; menu options retain the IBAN suffix. Selector options currently omit balances, so they do not leak amounts in privacy mode.

Browser evidence: Personal USD selection → Receive showed USD account ending 3002; Transfer → Luka used USD account as source. Browser Back restored USD selection. Personal-to-Business switch reset to Operating account. Business Tax reserve → See all showed the matching account filter and empty activity. At 390×844, main clientWidth and scrollWidth were both 390; Transfer/Receive/Exchange and the first attention item were visible. At 1280×720 the beginning of recent activity was visible alongside the card widget. Saved screenshots: `qa/visual-audit-2026-09-29/home-account-context.png` and `home-account-context-mobile.png`.

Still not demonstrated in this pass: all long-name/many-account cases, screen-reader interaction, complete 200% zoom coverage and every account/action combination. Overall analytics, savings goals and the card widget remain profile-level sections; they do not become data for the selected account.
