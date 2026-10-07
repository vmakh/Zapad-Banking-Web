# Banking UX — implementation in the web prototype

Date: 2026-09-29. Source: [research](BANKING_UX_BEST_PRACTICES_RESEARCH.md).
Scope: `artifacts/zapad-webapp`; local changes only. Mobile runtime is unchanged by this work.

## Explicit demo contract

The prototype uses **persisted local previews**, not a financial ledger. Confirming saves a stable reference and a snapshot of the reviewed details in Activity → Local previews. It never debits accounts, changes investments or loan principal, schedules bank payments, or claims settlement. Sample bank history remains a separate May 2026 dataset. Local previews show their actual creation date. Demo fees/rates are not current Montenegro tariffs.

Local storage is isolated by profile and included in the existing Settings reset. Do not enter real recipient data. This client-only storage is not encrypted banking storage or a server authorization boundary. Approval roles are explicitly selectable demo roles.

## Implemented paths

| Research practices | Implemented behavior |
|---|---|
| 1, 2 | Payments → New recipient; normalized IBAN, supported-country length and MOD-97; explicit identity-not-verified message; optional saving after confirmation; duplicate detection by normalized IBAN, not name. Saved recipients enter the amount step directly. Existing fictional fixture recipients remain distinguishable from validated new inputs. |
| 3, 4, 21 | Full source/recipient IBAN, sending/receiving amount, demo fee, total and reference before confirmation; Edit retains inputs; total including fee checked against available funds. Demo has no claimed delivery date. |
| 5, 6, 25 | Stable local intent ID; repeated confirm saves one snapshot; lost-response scenario records Status unknown; status check resolves the same reference; Business still requires approval after recovery. Storage failure cannot produce success. Draft autosave and explicit resume/discard survive refresh. |
| 7 | Searchable bounded account picker, owner/currency/IBAN/bank/BIC, individual copy and labeled Copy all. Removed unsupported request amount, share-link CTA and decorative QR placeholder. No claim that copying details receives money. |
| 8, 9, 12 | Available source shown; own-account transfer excludes the same account and different currencies; FX is a separate path. Savings deposit/withdrawal identifies both sides. Local previews do not double-count goals, balances or analytics. |
| 10, 15, 26 | Activity searches sample amount/reference as well as text; separate searchable preview records include detailed snapshot, event log and downloadable text explicitly marked not proof of payment. Unrecognized-payment link carries transaction context to Help and provides card-management access. Real support remains explicitly disconnected. |
| 13, 14 | Existing shared freeze state retained; confirmation now explains that freezing does not cancel subscriptions, merchant contracts or completed payments. |
| 18, 20 | Business transfer preview awaits a separate reviewer. Self-approval/rejection is blocked; rejection requires a reason; terminal decisions cannot be reversed by repeated clicks. Sample invoice details can create an isolated approval preview. Approval never claims payment release. Drafts, contacts, records and reset are profile-scoped. |
| 22, 23, 24 | Existing shared tokens/components, single primary action per active step, keyboard-operable selectors, named inputs, explicit review headings, focus on step change, scrollable dialog body and visible footer. Narrow viewport checked. |
| 25 | FX demo quote expires after 60 seconds of review and requires refresh; confirmation rechecks expiry. No bank operation is simulated as successful offline. Local preview persistence itself does not need a network. |
| 27 | Loan payment has source, amount, interest/principal breakdown, due date, limits, editable review and persistent preview. No fabricated effective rate or early-settlement offer. |
| 28 | Investment preview has product, minimum, risk, funding account, balance check, editable review and record; distinguishes no-order preview from execution. Removed exchange celebration. |

## Existing behavior retained

Savings goals allocate existing savings balances; validation and local persistence remain in the existing goal model. Privacy mode continues to mask balances; preview export is disabled while amounts are hidden. Exchange, loan and investment calculators retain their illustrative assumptions. Existing responsive navigation, card controls and statement export are reused.

## Deliberate boundaries / work still requiring product or infrastructure decisions

These are not implemented production capabilities:

- Live Verification of Payee (match/close/no-match), actual fees and arrival estimates, receiving-amount mode, route eligibility, SEPA/instant execution and settlement/refund states.
- Server idempotency, atomic cross-tab/device writes, actual offline reconciliation, authenticated business permissions, approval documents and multi-round policies. The local demo is not a secure payment engine.
- Passkeys/device binding, lost-device recovery, KYC and telephone call verification (16, 29).
- Partial payroll/batch execution and retry per failed item (19); bill preview retains an all-bills summary and does not claim a batch engine.
- New recurring-payment management, bank-backed automatic savings, configurable analytics periods/categories (11, 12, 14), real notification delivery (17).
- Money-request links/QR, live support/disputes, OCR/AI extraction and conversational spending search (7, 26, 29).
- Verified effective loan rates, early-settlement quotes, tradable investment quotes and order execution (27, 28).

These need confirmed product rules or integrations. The UI explicitly identifies unavailable behavior instead of showing false verification, payment success or support submission. Full screen-reader conformance, 200% zoom coverage across all routes and moderated user studies have not been completed in this implementation pass.

## Verification

Automated model tests: `node --test tests/banking-preview.test.cjs` — 15 cases: normalization/check digits, duplicate intent, recovery, approval/rejection rules, write failure, recipient deduplication, profile reset, balance-plus-fee checks, FX expiry, invalid totals, malformed records, invalid JSON and saved-recipient validation. Both read and write boundaries validate complete preview records; valid entries remain available alongside corrupted entries.

Draft restoration: `node --test tests/transfer-draft.test.cjs` — 5 cases covering unfinished input preservation, malformed field types/lengths/currencies, and exclusion of unknown fields. Form state no longer spreads unchecked storage data.

Combined current model verification: banking-preview, banking-preferences, transfer-draft, zapad-edge-cases, statement-export and zapad-loan-math — 46 passing tests (2026-09-30). The older renderer suite has been preserved intact under `docs/qa/legacy-tests/zapad-logic.test.cjs.txt`, outside automatic test discovery. It could not execute without its missing harness and obsolete rendering APIs. The [coverage disposition](qa/legacy-tests/README.md) tracks all 25 unique original scenarios (50 duplicated registrations) and explicitly retains unverified UI/mobile work. These model tests do not establish full application coverage.

Required checks: `npm run lint:design-system`, `npm run test:design-system`, `npm run check:ui-registry`, `npm run build --prefix artifacts/zapad-webapp`.

The current web model suite runs with `npm run test:zapad:web` and is now a required step in `.github/workflows/design-system.yml`. This adds coverage for payment review, preview persistence, approval recovery, draft restoration, goal limits, privacy text, loan arithmetic and statement CSV exports. The workflow has been updated locally; a remote CI result is not yet available. The archived renderer suite above remains migration evidence; its unverified scenarios are not reported as passed.

Browser checks completed: new DE IBAN with lowercase/spaces → amount → full review → simulated lost response → same-reference recovery → Activity; business self-approval disabled → separate reviewer → recorded approval; loan source and review breakdown; savings source/destination; draft amount/note restoration after reload. Loan review measured at 390px viewport: 366px dialog, within viewport, body scrolls and footer remains visible.

Screenshots: [preview history](qa/zapad-color-hierarchy/banking-preview-history.png), [business approval](qa/zapad-color-hierarchy/banking-approval.png), [narrow review](qa/zapad-color-hierarchy/banking-review-narrow.png).

Payment-link recovery (2026-09-29): reproduced a Personal Receive link with `source=b-operating` silently opening Main account while its invalid-link warning was obscured by the sheet. Payments now prevents automatic dialog/sheet opening when an action, source or recipient is invalid, and discards that invalid link context when the user manually starts a new action. Browser verified: invalid cross-profile source and missing recipient open no dialog; manual Receive and New recipient remain usable; valid Personal USD and Business Tax reserve links select their exact account and beneficiary. Existing profile/query remount keys already prevent stale selection across valid navigation, so ReceiveSheet state was not changed. Evidence: `qa/visual-audit-2026-09-29/invalid-payment-link.png`. Design-system checks, 23 current web model tests and web build passed; the new route behavior was checked in the browser, not covered by those model tests.

Saved-recipient validation (2026-09-29): three new regression tests first reproduced acceptance of malformed render fields, duplicate recipient IDs/IBANs and invalid writes. The reader now validates every persisted field, supported receiving currency and IBAN checksum, rejects fixture-ID impersonation and deduplicates custom entries. The writer rejects invalid records and an existing ID targeting another IBAN; normalized-IBAN duplicate detection and profile-specific storage remain intact. Corrupt data is filtered on read, not destructively rewritten. All 26 current web model tests pass, including storage failure and profile isolation. These tests use isolated in-memory storage and do not alter the user's saved recipients.

Keyboard focus recovery (2026-09-29, research practice 23): reproduced Enter → New recipient → Escape leaving focus on BODY. Shared DialogContent and SheetContent now capture the opening control before autofocus and restore it after closing when it still exists. Explicit per-screen autofocus handlers retain priority; removed controls do not receive focus. Browser verification: New recipient returns to its opener; Receive returns after its exit animation; the second card's Spending limits returns to the second Limits button, not the first. Shift+Tab remains in the open dialog. No card preference or payment was submitted. Required design-system checks and web build passed. This verifies those keyboard paths, not full screen-reader or zoom conformance.

Strict source typecheck (2026-09-29): added web `tsconfig.json` and `npm run typecheck --prefix artifacts/zapad-webapp`, covering all `src` under strict checking without emitting code. CI runs it before model tests. React declaration packages now match React 18; React DOM and canvas-confetti declarations are explicit development dependencies. The first check exposed an undefined toast in Savings, incorrect profile narrowing, an overly narrow analytics icon type and an incompatible entrypoint import; all were fixed. Typecheck, 26 model tests, design-system checks and production build pass locally. This source check excludes third-party declarations (`skipLibCheck`) and Vite configuration; a remote CI run has not occurred.

Dependency remediation (2026-09-29): npm audit initially reported eight affected web package groups. Updated React Router 7.13.0 → 7.18.4 and Vite 6.4.2 → 6.4.3, including the pnpm Vite override. Compatible transitive updates resolve tar, postcss, nanoid, browserslist, baseline-browser-mapping and Babel advisories. No forced major-version update was used. The repeat audit reports zero known vulnerabilities across 405 packages; evidence: [dependency audit](qa/visual-audit-2026-09-29/dependency-audit.json). CI now runs `npm audit --audit-level=high --prefix artifacts/zapad-webapp`. Audit data is time-specific and does not prove absence of application vulnerabilities or cover the separate root/mobile dependency trees.

Post-update verification: strict TypeScript, 26 web model tests, design-system checks, registry consistency and Vite production build pass. A temporary localhost preview of that build was checked in the browser: Home → Receive retains source details, Accounts navigation and browser Back work, Cards renders, switching Personal → Business retains the Cards route, and Business Home loads. No console errors were recorded during these smoke paths. The temporary preview was stopped; the user's original development server was not replaced. A remote CI run remains unverified.

Card/goal persistence verification (2026-09-29): added five tests against the actual data modules with isolated storage. Valid card preferences survive a new module instance, profiles stay separate, failed writes leave cached card/goal values unchanged, and goal allocation conserves total savings after reload. Two initially failing tests exposed invalid card-limit writes and sub-cent values accepted on hydration. Shared model validation now enforces finite 0–1,000,000 limits with cent precision, known card IDs, boolean controls and only editable preference fields. A corrupt limit group falls back to fixture limits while retaining a valid frozen state. The new suite is included in the existing web CI command; it does not alter browser/user data.

Bills end-to-end verification (2026-09-29): on isolated preview origin port 5195, confirmed Personal (€105.30, Main account, Alex Demo) and Business (€265.30, Operating account, Demo Corp DOO) through review, confirmation and Activity detail. References, amount, zero fee and profile-specific bill notes match the reviewed values; no console errors. Only local preview records were created on that separate origin; no bank request or change to the user's port-5193 demo data. Temporary server and QA tab closed.

### Transfer draft recovery — 2026-09-29

Reproduced via isolated port 5195: a new-recipient form remained editable under the saved-draft prompt; typing replaced the prior draft before any recovery decision. Restoring an incomplete new IBAN then incorrectly opened the amount step.

The recovery decision now replaces the form until Resume or Discard is chosen. Autosave and close-save explicitly exclude pending recovery; closing preserves the stored draft. Resume returns new/incomplete recipient details to the recipient form, existing saved recipients to amount, and missing recipient IDs to selection. Discard failure keeps recovery pending. Added a model regression for the resume-step rules.

Browser proof: saved `QA Protected original` / `DE89`, closed and reopened the recovery chooser, resumed with both values intact on the new-recipient step; explicit Discard opened empty fields. Screenshot: `docs/qa/visual-audit-2026-09-29/transfer-draft-recovery.png`. No data on the user's port 5193 was changed.

Additional recovery proof: a saved Luka transfer for €12.34 resumed from the New recipient shortcut with Luka and €12.34 intact on the amount step. Validation passed: strict typecheck, design-system lint and tests, registry check, 32 web model tests, and production build. Temporary server and browser tab stopped after verification.

### Unavailable funding accounts — 2026-09-29

Code audit found that TransferDraft substituted the first fixture account for any missing stored source ID, allowing the substituted account into the review validator. The selector now stays empty for an unavailable source, shows an explicit recovery message, hides the quote and insufficient-funds calculation, and requires a fresh funding-account choice. `canReviewPayment` accepts an absent source safely and rejects non-finite balances. A regression first failed with an undefined-source exception, then passed alongside all 33 web model tests and strict typecheck. Current fixtures cannot remove accounts through the UI, so the stale-account scenario is model/source verified, not claimed as a browser reproduction.

### Analytics → contributing activity — 2026-09-29

Closed a research-practice 11 gap: View transactions previously opened unfiltered history although the chart counted only completed EUR outgoings excluding FX. Chart and Activity now share `isSpendingTransaction`; the drilldown carries `view=spending` and optional exact category, shows the rules and integer-cent total, excludes local previews, and offers Back to overview / Clear filters. Category labels are keyboard-accessible links. Aggregation sums cents to avoid floating-point residue.

Browser verified on isolated port 5195: Personal total €180.67 / four contributing transactions; Food €3.50 / Caffe Aroma; Business €320.40 / AWS Europe. Clear filters restores all six Business sample transactions and separate local previews. Evidence: `qa/visual-audit-2026-09-29/spending-drilldown.png`. Strict typecheck, 34 model tests, design-system lint/tests, registry and production build passed. This remains fixed May 2026 sample analytics, not configurable net cash flow or live reporting.

### Activity filter recovery and styled status selector — 2026-09-29

Centralized query interpretation in `activityFilters`. Spending always uses Completed even if a manually combined link carries Pending; incompatible status/view/category or cross-profile account parameters produce the existing visible recovery notice. Unknown categories no longer silently zero the list. Generated analytics links discard stale search/status/detail/preview parameters. Standard Activity now uses the shared Radix status selector rather than native OS option styling.

Browser proof on isolated 5195: `view=spending&status=Pending` shows the notice and four EUR outgoings totaling €180.67; Clear filters returns eight sample operations; selecting Pending in the styled menu leaves exactly Wizz Air (€119.99). Screenshot: `qa/visual-audit-2026-09-29/activity-status-dropdown.png`. Typecheck and all 35 model tests pass.

### Card settings save/cancel and amount precision — 2026-09-29

Isolated production-preview browser check on port 5195: edited second Personal card (Mastercard 9013) online limit 1000 → 777.25 and International Off → On. Cancel retained 1000/Off on reopen; Save persisted 777.25/On after reload. First Visa remained 2000/On. Disabling Mastercard's separate Online switch persisted after reload without changing its 777.25 limit. Business Virtual 7711 remained 3000/Off. User data on 5193 was not changed.

The flow exposed a visible precision bug: card summary rounded 777.25 to 777 while the saved dialog retained cents. Summary now preserves cents for fractional limits, adds the explicit Daily spending limits caption, and numeric inputs expose step 0.01 / maximum 1,000,000. Verified in the rebuilt production preview: `qa/visual-audit-2026-09-29/card-limit-precision.png`. Typecheck, 35 model tests, design-system gates and build pass. This is manual browser coverage of save/cancel/isolation, not an automated end-to-end suite.

### Visible online-payment preference — 2026-09-29

Cards previously showed the same Online button and saved amount whether online payments were enabled or disabled. The action now says Online on/off; disabled cards explain that the stored numerical limit applies once online payments are enabled again. Accessible names include the card identity and preference, with last digits omitted in privacy mode. Browser verified on isolated 5195: stored Mastercard Off is visible; Save On immediately updates the button and removes the disabled explanation; privacy mode removes its digits from the accessible name. Screenshot: `qa/visual-audit-2026-09-29/card-online-status.png`. All required checks (strict typecheck, 35 model tests, design-system lint/tests, registry, build) passed. The UI reflects a local preference, not live authorization or a guarantee that a transaction can execute.

### Statement period recovery and narrow privacy review — 2026-09-29

Reproduced `month=2025-12` silently showing May 2026. Unsupported month values now show an unavailable-period state with an empty period selector and explicit View May statements recovery; an open preview is also constrained to the current valid period/account filter. Browser verified the rebuilt output and explicit recovery. April retains its honest no-samples state; Savings May opens zero posted transactions. At 390×600, Main account's six-row statement has a scrollable body (346px viewport / 517px content), visible download footer and masked amounts in privacy mode. Evidence: `qa/visual-audit-2026-09-29/statement-unavailable-period.png`.

Download execution remains unverified: the in-app browser download-event wait timed out and reset its tool session; no filesystem path was returned. This is not proof that download succeeded or failed. Existing CSV model tests verify row content and masking, not browser file delivery. All 35 model tests, strict typecheck, design-system lint/tests, registry and production build pass.

### Statement download delivery confirmed — 2026-09-29

Resolved the preceding verification uncertainty using actual browser-downloaded files. The prior Savings download exists in Downloads (308 bytes, correct account/May metadata, zero posted rows). Fresh browser Download CSV clicks produced separate Main account files: `(1).csv` in privacy mode has all six Amount cells `Hidden`; `(2).csv` with visible amounts has exactly -42.18, -3.50, +3200, -500, -120, -14.99 and only Completed row IDs 1,2,3,5,7,8. CSV parsing assertions were run against the downloaded files, not regenerated strings. No browser event wait was needed. Evidence: `qa/visual-audit-2026-09-29/statement-download-verification.json` and `statement-download-verified.png`. This supersedes the prior unverified-delivery note for these checked IAB paths; it does not establish every browser's download behavior.

### App-wide keyboard entry and route focus — 2026-09-29

Added a first-tab Skip to main content link and focusable named main landmark. Enter focuses main without changing the hash route. Section navigation moves focus into the new main content after idle; query-filter edits do not retrigger it, initial load is not forced, and open dialogs retain their focus. Mobile menu selection restores focus to new content while Escape/cancel restores the menu trigger. Browser proof: first Tab reaches skip link, Enter preserves `#/personal` and focuses `main-content`; keyboard Cards transition focuses main; mobile Accounts transition focuses main after sheet closes; Escape returns Open navigation menu. Visual verification caught the skip link under the sticky header at equal z-index; raising its focused layer fixes visibility. Screenshot: `qa/visual-audit-2026-09-29/skip-to-content.png`. This is keyboard-path evidence, not full screen-reader conformance.

## 2026-09-30 — Preserve account identity in currency exchange

Home's Exchange action now carries the selected account ID. Exchange resolves exact source/destination accounts rather than the first account sharing their currency. Both menus expose account names, currencies, round flags and shortened account identifiers, including multiple EUR balances. Invalid or cross-profile IDs remain unselected with an explicit recovery message; they never fall back to the main balance. Same-currency selections and amounts above the selected account's balance cannot be reviewed. Changing accounts invalidates the review; each new exchange intent has a new identifier. Step changes focus the next heading so a scrolled form does not strand the user below review content.

Evidence: 37 web model tests, including exact Savings selection, unknown/empty/cross-profile IDs, missing destination, empty/single-account collections and reversed account selection. Browser QA on the isolated 5195 origin completed Home → Savings → Exchange → local confirmation → Activity: source Savings ending 3003, destination USD ending 3002, EUR100 → USD108.50. A personal link with business source b-operating stayed blocked; selecting both accounts recovered. EUR→EUR stayed disabled; EUR8400.01 against Savings EUR8400 showed the balance error and disabled Review. Mobile account menu inspected at390×844. Review heading focus verified in DOM and screenshot. No real conversion or balance mutation occurs.

Screenshots: `qa/visual-audit-2026-09-29/exchange-account-selection-mobile.png`, `qa/visual-audit-2026-09-29/exchange-savings-review.png` (directory retained for the ongoing audit).

## 2026-09-30 — Predictable decimal input in transfer and exchange

TransferModal and ExchangePage use text inputs with decimal keyboard hints and a shared canonicalizer accepting one comma as a decimal separator. Their financial validation remains strict: grouping separators, mixed separators, exponent notation, negatives and sub-cent values are not interpreted as valid money. Both forms explain the accepted format; invalid transfer entry exposes aria-invalid. Existing calculations and saved drafts receive canonical dot decimals.

Browser evidence on isolated5195: exchange input100,50 reviews100.50EUR→109.04USD; own-account transfer100,50 reviews exactlyEUR100.50, feeEUR0.00; mixed1.234,56 disablesReview. No confirmation submitted in this verification. Model coverage includes both separators, unfinished input, ambiguous formats and the fee-inclusive one-cent balance boundary. Screenshot: `qa/visual-audit-2026-09-29/decimal-transfer-review.png`.


## 2026-09-30 — Deep-link overlay exit and transfer draft lifecycle

Reproduced Receive deep-link Escape leaving focus on BODY. Shared overlay focus recovery now uses focusable main content when no connected opener exists, while preserving explicit close handlers and avoiding fallback behind another open dialog. Browser verified on isolated5195: direct USD Receive → Close focuses MAIN / Main content; Payments Receive money → Escape returns to Receive money after the exit animation; Between accounts → Resume → Review → Escape returns to its opener and retains Main→Savings EUR100.50. Reopening resumes100.50. Confirm local preview → Close → Between accounts opens blank amount with no recovery prompt, proving completed draft cleanup under normal storage. This does not prove failure-path cleanup or a complete route/origin matrix.


## 2026-09-30 — Recover committed transfers when draft cleanup fails

A transfer draft now retains its stable intent ID. Confirmation first persists that recovery reference and refuses to create a preview if this write fails. On reopening, a matching profile-scoped preview takes precedence over the stale draft: the existing result/status is shown, rather than another editable transfer. Cleanup failure is disclosed; recovery retries clearing the stale draft without creating a new preview. Legacy drafts without an ID remain readable and gain one before confirmation. Unknown, awaiting-approval and rejected states retain their original meaning. This does not add cross-tab atomicity or server idempotency.

Model tests inject a write failure after preview persistence and prove same-reference recovery, one stored record, type/profile isolation and preservation of unknown/business states. Intent parsing rejects malformed IDs. Browser normal-path regression on isolated5195: Main→Savings EUR0.25 → Save and close → Resume → Review → Confirm → reopen blank amount/no recovery prompt, no console errors. The injected failure path is model-tested, not a browser fault-injection run. Strict types, design-system gates, registry and web build pass;41 web tests pass.


## 2026-09-30 — Calculator input semantics and linked labels

Loan input validation now checks raw strings before numeric conversion, so clearing the annual rate cannot silently create a zero-interest estimate. Empty/negative rate, non-positive or sub-cent principal, and fractional/zero/exponent terms produce field-specific errors and suppress estimates. Explicit zero interest remains supported. Loan and savings calculator labels are linked to input IDs; invalid fields expose aria-invalid and associated error descriptions.

Browser verification on isolated5195: blank loan rate shows the annual-rate error and three dash results; explicit0 with EUR10000 /36months shows EUR277.78 monthly, EUR10000 total and EUR0 interest. Clicking Rate focuses its input. Clicking APY focuses its input; clearing it marks only that field invalid and suppresses savings outputs. Screenshot: `qa/visual-audit-2026-09-29/loan-calculator-required-rate.png`. This verifies DOM accessibility relationships and focus, not a screen-reader audit. The added raw-input regression brings the web model suite to42 passing tests. Typecheck, design lint/tests, registry consistency and web build passed.


## 2026-09-30 — Expanded investment research and valuation context

Expanded the Mobbin plugin comparison to16 distinct screens across13 products, including a brokerage, bank investment UI, aggregators and crypto products. `INVESTMENTS_UX_REVIEW.md` records each inspected screen, applicability and rejected patterns. One repeated Gemini reference is counted once. The comparison supports clearer semantics rather than fabricated investment cash, security-level holdings or benchmark data.

Investment overview now places capital-risk context in the introduction and distinguishes portfolio value from available cash next to the valuation date. Removed allocation width entrance animation and locale-formatted CSS percentages; bars use raw numeric proportions immediately. Browser on isolated5195: Personal at1280×720 and390×844 inspected visually, no main horizontal overflow at390;7D changes accessible chart endpoints to May5→May11; Business retains EUR100000 with its own allocations and the same context. Evidence: `qa/visual-audit-2026-09-29/investment-valuation-context.png` and `investment-valuation-context-mobile.png`. Strict types, design lint/tests, registry consistency and web build passed. No new financial model or execution behavior was added.


## 2026-09-30 — Payment entry origin and contextual exit

Reproduced Home USD → Receive → Close landing on generic Payments. Home and account-detail Send/Receive links now carry a small origin enum. Closing resolves only a profile-owned source and known Home/Accounts destination; arbitrary URLs and cross-profile account IDs cannot become return destinations. The original source defines the return context, independently of an account picked inside the form. Direct payment links without an origin retain Payments as their destination. Closing a manually opened Payments form no longer rewrites an already-empty query string, retaining recipient search and the connected opener.

Browser matrix on isolated5195 (no payment confirmation):

| Profile / entry | Exit / state | Observed destination |
|---|---|---|
| Personal Home, USD → Receive | Pick Savings, Close | Home with original USD selected |
| Personal Home, USD → Transfer | Existing draft prompt, Escape | Home with USD selected; draft not discarded |
| Personal USD details → Receive | Escape | USD account detail sheet |
| Personal USD details → Send | Existing draft prompt, Escape | USD account detail sheet |
| Business Home, Operating → Receive | Escape | Home with Operating selected |
| Business Home, Operating → Transfer | Select Techno, change source to Tax reserve, Escape | Home retains Operating as original context |
| Business Operating details → Receive | Escape | Operating account detail sheet |
| Business Operating details → Send | Recipient step, Escape | Operating account detail sheet |
| Personal Payments, search Luka → recipient | Draft prompt, Escape | Payments; search still Luka |
| Personal Payments, search Luka → Bills | Escape | Payments; search still Luka |
| Personal Payments, search Luka → QR | Escape | Payments; search still Luka |

An empty-amount Business selection did not produce a resume prompt on reopening; this pass does not claim draft persistence for that state. Populated draft/review/result recovery remains covered by the separate checks above. Model regression checks known origins, account ownership and rejection of unknown/external destinations. Total43 model tests; typecheck, design gates, registry and build passed. Screenshot: `qa/visual-audit-2026-09-29/payment-origin-return.png`. Exchange has a separate route and is not covered by this exit fix.


## 2026-09-30 — Clipboard completion and failure feedback

Account details previously announced IBAN copied without awaiting Clipboard API completion. All three clipboard entry points now use a shared awaited result: account IBAN, Receive individual/all details, and transaction reference. Unsupported API, synchronous failure and rejected permission requests return failure; UI clears prior copied state and offers manual selection/copy rather than announcing success. No clipboard read or automatic copy occurs on page load.

A regression test holds the write pending and proves success is not emitted early, then exercises resolved, rejected, throwing and unavailable adapters. Browser normal paths on isolated5195 verified actual clipboard contents after completion: account IBAN `ME25 9900 0000 0000 3001 01`; Receive Copy all includes Beneficiary, IBAN, Currency, Bank and BIC labels/values; Retail Demo reference is exactly `ZB-P-1`. Failure states are covered with isolated adapters, not by changing browser permissions. Screenshot: `qa/visual-audit-2026-09-29/clipboard-account-verified.png`. All44 web model tests, strict types, design-system checks, registry and build pass.


## 2026-09-30 — FX origin and savings overflow acceptance fixes

Home Exchange links now retain a separate original account ID. Editing/swapping the currency pair preserves this return context in the URL, including reload; a profile-owned, known origin resolves the back action, otherwise Payments is the safe destination. Browser verified Personal Savings→FX→Swap→reload→Home returns Savings; Business Operating→FX→Swap→Home returns Operating. Payments→FX→Payments works in both profiles. No conversion was confirmed.

Savings calculator now uses a finite, cent-precision-bounded estimate. Overflow suppresses all results with an associated status message explaining how to recover, rather than silently showing dashes. Zero principal, zero rate and zero duration remain valid. Browser Business test5000 /100% /10000years shows the error and three dashes; changing rate to0 clears the error and shows5000 /0interest /0%growth. Screenshot: `qa/visual-audit-2026-09-29/savings-calculator-overflow.png`. Two added regression cases bring the suite to46 passing tests. Typecheck, required design gates, registry and web build passed.


## 2026-09-30 — Visible keyboard focus verification

Quiet surface rules removing box shadows also removed ring-based keyboard focus from secondary buttons and selectors. Added a token-based 2px outline with 2px offset for focus-visible controls inside the workspace, dialogs and sheets; it remains visible independently of shadows. Browser evidence confirms the Statements account selector and Receive account picker now have a solid outline. Keyboard checks exercised searchable account selection, statement opening, access to Download CSV, dialog Tab wrapping, Escape dismissal and return to the Receive opener. Evidence: `qa/visual-audit-2026-09-29/keyboard-verification.json` and `keyboard-focus-visible.png`. Design lint/tests, mobile integrity, registry298 and production build passed after this CSS change.

Actual200% native browser zoom and VoiceOver remain unverified: native access reported a locked Mac, and Codex app automation is prohibited. User clarification for unlocking and temporary VoiceOver use is pending; no permission is inferred. These keyboard checks do not establish screen-reader or full WCAG conformance.

The design hook's goal-progress width-animation finding is resolved by removal of the transition. No ignore or suppression was added.


## 2026-09-30 — Native zoom attempt interrupted

Chrome's dedicated Banking zoom QA tab was navigated from the stopped5195 server to the restored5193 prototype. Native AX confirmed Zoom:110% after the first zoom increment. Subsequent input returned a different foreground window (Chrome profile picker), so no200% result is established. The bound browser then reported unavailable when resetting the specific QA tab to100%; restoration is unverified. Native input stopped immediately. No profile was selected or modified. Actual200% and VoiceOver remain outstanding; do not report this attempt as passed.


## 2026-09-30 — Actual Chrome200% zoom verified

A fresh dedicated Chrome QA tab successfully reached native Zoom:200%, confirmed by the browser AX toolbar rather than CSS scaling or viewport emulation. At a1398×867 CSS-pixel100% viewport,200% yielded699×433 and devicePixelRatio4. All13 routes in both profiles were measured only after their expected heading became visible: document and main scrollWidth equaled699 throughout. This proves absence of page/main horizontal overflow in those26 loaded states, not every nested element or full accessibility conformance.

Personal Receive fits horizontally with a scrollable740px body inside a434px sheet; keyboard focus reaches Close. Main-account statement fits inside the viewport, its body scrolls, and Tab reaches the fully visible Download CSV button (y341.5,height44 within433px). Home and statement screenshots were visually inspected. Evidence: `zoom-200-native.txt`, `zoom-200-routes.json`, `zoom-200-dialogs.json`, `zoom-200-home.png`, `zoom-200-receive.png`, `zoom-200-statement.png`. Native Zoom:100% was then confirmed (1398×867,dpr2), saved as `zoom-reset-native.txt`, and the dedicated QA tab closed. This supersedes the earlier unverified zoom/restoration attempt. VoiceOver remains untested, with its temporary activation confirmation pending. No implementation changed in this verification pass.
