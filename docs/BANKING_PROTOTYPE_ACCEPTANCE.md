# Web prototype acceptance audit

Audit: 30 September 2026. Objective: bring the banking **prototype** to high production quality. This is a requirements-to-evidence audit, not a declaration that a client-only demo is a production bank.

Scope comes from the user's annotated web screens, implementation request for `BANKING_UX_BEST_PRACTICES_RESEARCH.md`, mobile visual foundation, detailed Mobbin research request, and broad visual/flow/edge-case checks. The separate protected mobile runtime is a visual reference; its old renderer's unverified test cases do not become newly required web features.

## Evidence rules

- Source proves an implementation exists; browser evidence proves only the exercised state.
- The base visual audit covers 13 routes ×2 profiles ×2 widths. Later changed surfaces have focused replacement evidence recorded in the implementation log.
- 320px DOM reflow checks are not actual browser zoom or screen-reader testing.
- Model tests cover validation/persistence contracts, not every UI flow.
- Historical failed checks are superseded only where a subsequent verification is recorded (for example statement file delivery).

## User requirements and disposition

| Requirement | Authoritative implementation / evidence | Disposition |
|---|---|---|
| All main screens visually reviewed in both profiles | `qa/visual-audit-2026-09-29/REPORT.md`: 52 base states, route-specific desktop/narrow screenshots; subsequent changed surfaces below | Covered for current fixtures; not every possible dataset |
| Important actions/info in first viewport; proximity and type consistency | Base audit; `help-proximity.png`, `balance-overview-refined.png`, `home-activity-320.png`; shared typography/layout tokens | Implemented and visually checked at reported widths |
| Exchange responsive form and one-line desktop result | ExchangePage account layout/result flex grouping; base Exchange screenshots and later exact-account review/mobile evidence | Implemented; account/quote validation covered separately |
| Account-detail contrast | AccountsPage balance panel inherits foreground; `fixed-narrow-account.png` and account detail/browser screenshots | Implemented |
| Card limits adapt; freeze icon centered | CardsPage responsive limit/action grids and centered confirmation icon; wide/narrow Cards and limits proof | Implemented |
| One main colored CTA, with secondary payment emphasis | Loans Apply primary / Make payment soft; Savings New goal primary; neutral supporting surfaces; base visual review | Implemented within current page/step hierarchy |
| Dropdown styling throughout dialogs and Statements | Shared Radix Select/Popover, statement filters and bounded searchable Receive picker; named keyboard controls | Implemented; keyboard focus paths exercised, full assistive-tech audit outstanding |
| New recipient by IBAN and no redundant saved-recipient step | Payments direct recipient entry and New recipient; TransferModal validation/review; draft/IBAN browser evidence | Implemented and exercised |
| Main banking flows: send, receive, own accounts, bills, FX | `BANKING_UX_IMPLEMENTATION.md` browser paths + preview/draft/quote tests | Covered as local previews; never real execution |
| Receive many accounts and copy all details | Bounded searchable picker; all five labeled fields; actual clipboard content verified | Implemented; generic long list uses bounded component, no claim of synthetic large-list load testing |
| Mobile card visual basis and profile selection | Shared PaymentCard artwork, profile selected tint/avatar and fixed-width trigger; `qa/zapad-color-hierarchy/cards-mobile-foundation-*.png`, profile-switcher screenshots | Implemented |
| Analytics wraps correctly | ExpenseAnalytics container-aware layout; reflow JSON and `analytics-responsive-business.png` | Implemented and checked at320px |
| Demo labels consistent | Exchange labels share presentation; no live-rate claims; matching copy in review/reference sections | Implemented |
| Settings icon/text alignment | SettingsPage matching size-10 icon wrappers and aligned rows; base Settings screenshots | Implemented |
| Return from account-filtered Activity | TransactionsPage Back to accounts; browser observation of filtered Main account Activity | Implemented |
| Statement long content and download | Scrollable body/footer; actual downloaded CSVs parsed, including empty/private states; `statement-download-verification.json` | Implemented and verified for IAB |
| Help proximity / settings grouping | `help-proximity.png`, base Help and Settings audit; current source spacing groups | Implemented |
| Toggle matches profile color rather than success green | Shared Switch/profile tokens; card limits browser state and base snapshots | Implemented |
| Home research through Mobbin; more than three references | `BANKING_HOME_MOBBIN_RESEARCH.md`:22 screens /12 products; placement decisions and links | Delivered |
| Investment research and useful improvements | `INVESTMENTS_UX_REVIEW.md`:16 distinct screens /13 products; date, period, methodology, cash/valuation distinction, first-screen risk; fresh desktop/mobile screenshots | Delivered |
| Local preview details not detached from Activity | PreviewHistory and transaction details sheet; `preview-details-sheet.png`, local preview browser checks | Implemented |
| Round currency/account flags | CurrencyIcon + account, payment, exchange selectors; fresh Home/Receive/Exchange evidence | Implemented |
| Compact Home selector, label attached to balance, improved overview | BalanceHero header/summary/actions; `balance-overview-refined.png` and mobile proof | Implemented |
| Persistence/error edge cases |46 model tests: malformed records, denied writes, duplicate intents, profile isolation, explicit draft recovery, cent boundaries, expiry, required rates and clipboard rejection | Covered for enumerated contracts, not exhaustive state-space |
| Return to entry context after payment dismissal |11-case Personal/Business Home/Accounts/Payments matrix in implementation log; safe origin resolver test | Implemented for Send/Receive and FX; separate source/origin and reload verified |
| Required local engineering gates | Latest successful typecheck, design lint/tests, registry298,46 web tests and production build, recorded in implementation log | Passed locally; remote CI not run |

## Remaining concrete work, in order

1. **FX return context — resolved.** Personal Savings→FX→Swap→reload→Home preserves Savings; Business Operating→FX→Swap→Home preserves Operating. Payments entry returns to Payments in both profiles. Original account is separate from editable source/target; ownership/unknown-origin regression tests pass.
2. **Savings calculator overflow — resolved.** Shared estimate rejects overflow and results beyond reliable cent precision; UI explains recovery. Browser overflow→zero-rate recovery verified, normal and zero-value boundaries covered by model regression.
3. **Actual200% browser zoom — resolved for recorded states.** Native Chrome toolbar confirmed200%;26 loaded route/profile states have no document/main horizontal overflow at699×433 CSS pixels. Personal Receive and statement dialog scroll/access checks passed; Download CSV stays visible. Native100% restoration confirmed. Evidence: `zoom-200-native.txt`, `zoom-200-routes.json`, `zoom-200-dialogs.json`, screenshots and `zoom-reset-native.txt`. This is focused zoom evidence, not full WCAG conformance.
4. **Screen-reader operation remains unverified.** Keyboard focus and actual zoom checks do not establish VoiceOver behavior. The user response to temporary VoiceOver activation is still pending; do not enable it without that response or claim screen-reader coverage.

Do not reopen closed visual decisions merely to make new variants. Both concrete fixes have focused browser and model evidence. The remaining verification gap below must remain explicit; do not claim full WCAG conformance.

## Explicit production-integration boundaries

Live payment settlement, identity/payee verification, server authorization/idempotency, live quotes/fees, notifications, support case submission, security recovery, batch execution, OCR and tradable security data are unavailable and explicitly disclosed. Adding fictional success screens would lower quality. Research recommendations in these areas are retained as future product requirements; the requested artifact remains an interactive prototype, not a live banking service. Mobile certification, cross-browser certification and moderated user research have not been claimed.
