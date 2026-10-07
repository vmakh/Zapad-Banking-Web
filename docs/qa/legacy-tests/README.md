# Retired Zapad renderer tests

Audit date: 2026-09-29. This is retained historical source, **not passing coverage**.

`zapad-logic.test.cjs.txt` was moved intact from `tests/zapad-logic.test.cjs`. It contains 50 test registrations: two copies of 25 unique scenario names. The original file has no imports or `setup()` implementation. Its first web test extracts a removed `validate()` function by regex; the rest calls the previous mobile renderer's `validViews`, `renderHome`, `navigate`, `state` and HTML-event helpers. Those APIs are absent from the current React mobile prototype. Adding imports alone would not make these tests meaningful.

This retirement removes an unrunnable historical file from automatic test discovery. It does not mark the old scenarios passed, replace them with skipped assertions, or change the protected mobile runtime. Git history and the exact original text remain available.

## Coverage disposition

Each row represents one unique original scenario. Model coverage verifies the named data contract only; it does not establish the original UI flow. Existing mobile spec files are listed as candidates where applicable, **not reported as run during this audit**.

| Original scenario | Current evidence / remaining work |
|---|---|
| Web transfers reject missing and cross-currency destinations | Executable `tests/zapad-edge-cases.test.cjs` checks `canReviewPayment` for missing, same-account and wrong-currency destinations. |
| All 22 routes render in both profiles | Old route count is obsolete. Web visual audit covers 13 routes × 2 profiles × 2 widths; current mobile route matrix needs its own browser run. |
| Spending shares and drilldown totals agree | Shared spending predicate has regression coverage for non-posted, income, other currencies and FX exclusions. Browser drilldown matches Personal €180.67 / four items, Food €3.50 / one item and Business €320.40 / one item. Rounded percentage-sum regression remains open. |
| Statements retain account and clear profile context | Web uses profile-scoped account query parameters. Mobile `account-summary.spec.ts` is a candidate; exact switch scenario remains to be verified. |
| Bills use profile-specific totals | Verified on isolated production preview: Personal €105.30 and Business €265.30, correct fixture names/source/initiator from Bills → Review → Confirm → Activity details; no console errors. Browser evidence: `../visual-audit-2026-09-29/business-bills-preview.png`. This is a browser check, not automated regression. |
| Unsupported promises are honest previews | Explicit preview contract and prior web browser checks documented in `docs/BANKING_UX_IMPLEMENTATION.md`; legacy regex expectations are not portable. |
| Product slider edits selected-card limits | No corresponding web slider; `banking-preferences.test.cjs` covers model isolation. Mobile `logic-edges.spec.ts` covers selected-card Back behavior, not run here. |
| Physical/virtual card opening preview | Current opening UI differs. Mobile `banking-completeness.spec.ts` / `banking.spec.ts` are candidates; exact legacy flow not verified here. |
| Send modes and cancellation return | Eleven web entry/exit cases verified on isolated5195 across Personal/Business Home, Accounts and Payments: Send/Receive restore original account context; recipient/Bills/QR preserve Payments search. See implementation log. Review/result and Exchange exits are separate checks. |
| Online and Limits are independent | Manual production-preview browser check confirms Cancel retains 1000/Off, Save persists 777.25/On after reload on Mastercard 9013, disabling Online preserves its numeric limit, and Visa/Business remain unchanged. Automated end-to-end regression remains open. |
| Bills/QR shortcuts preserve origins | Old Home/Products/Menu layout no longer matches web IA. Equivalent current entry points need an explicit origin matrix. |
| Completed payment clears draft; review preserves it | Verified on isolated5195: Between accounts review → Escape preserves Main→Savings and100.50; reopening resumes the same values. Confirm local preview → Close → reopen starts with blank amount and no recovery prompt. Failed-cleanup recovery now has executable model evidence: a persisted intent resolves the existing preview, preserving unknown/approval states. Browser fault injection and other dismissal/origin combinations remain open. |
| Card settings has independent Online control | Present in current Cards UI; not a substitute for save/cancel flow verification. |
| New recipient replaces form history; Back discards abandoned form | Current web intentionally autosaves drafts. Original discard expectation conflicts with the approved recovery model; verify explicit resume/discard instead. |
| Every route has tabs/Back escape | Web sidebar and contextual Back paths inspected previously; complete current mobile return matrix not run here. |
| All rendered entry actions respond | Broad previous assertion is not proof for current components. Current route audit and focused flow checks are partial evidence. |
| IA puts savings, recipients and catalog in expected sections | Current web navigation is desktop-specific; mobile `ux-audit.spec.ts` / `action-visibility.spec.ts` are candidates. |
| Statements filter/open/recover | Web CSV tests cover empty data; account/period browser filtering remains distinct UI coverage. |
| Payment exit restores origin/account after source change | Verified Business Home Operating → Transfer → change source to Tax reserve → Escape returns to Home with Operating selected. Original context and edited funding source are separate. Personal Receive alternate-account close also retains original USD Home context. |
| Recipient directory cancellation returns to directory | Verified Personal Payments search Luka → recipient draft prompt → Escape retains Luka filter and Payments context; no draft discarded. |
| Recipient shortcut starts fresh transfer | Verified on isolated port 5195: a New recipient shortcut first offers Resume/Discard; Resume restores Luka and €12.34 on the amount step, closing recovery preserves the draft, and explicit Discard opens empty fields. Incomplete IBAN resumes recipient details. Browser evidence: `../visual-audit-2026-09-29/transfer-draft-recovery.png`. |
| Mobile goals persist, allocate cents, isolate profiles | Current mobile `bank.test.mjs` / banking specs are candidates. Web `banking-preferences.test.cjs` verifies current web goals, not mobile. |
| Mobile card controls persist but revealed data does not | Web preference persistence verified; mobile reveal persistence must be checked against current runtime. |
| Corrupt mobile goals and failed writes | Web storage-failure model tests cover the web implementation only. Current mobile `bank.test.mjs` needs separate verification. |
| Mobile export escaping and combined filters | Web CSV formula/quote escaping is tested. Current mobile `exports.test.mjs` and activity-filter flows need separate verification. |

## Active checks

- Web: `npm run test:zapad:web` (46 actual model tests as of 2026-09-30), `npm run typecheck --prefix artifacts/zapad-webapp`.
- Design system: root lint/test/registry commands.
- Mobile: use its own package scripts and protected-runtime checks; do not run web Tailwind configuration against it.

The remaining UI and mobile cases above stay open. A green current model suite does not close them.
