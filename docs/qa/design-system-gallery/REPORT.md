# Design-system gallery — implementation and QA record

Date: 2026-10-14. Scope: the web gallery extension in the current working tree. This is a frontend banking demo; no payment settlement, authentication, bank authorization, or live market data was introduced.

## Delivered behavior

The gallery opens at `/design-system.html`, with `?context=compare|personal|business` and `#section/state` deep links. Banking aliases are `/#/design-system`, `/#/personal/design-system`, and `/#/business/design-system`. It provides grouped navigation, search by name/module/state, independent Personal/Business comparison, applicable state selection, an adaptive/360 px preview toggle, and reset by iframe remount. The narrow navigation uses the shared Sheet.

The catalogue lists 71 existing component modules in 62 logical groups and 179 applicable states. The registry's 268 exports compose component families rather than one independent fixture per export. The app-layout group renders 13 real screens and a redirect result. Multi-step banking workflows continue through their existing controls. Button hover/focus fixtures are explicitly labelled pinned appearances; pointer and keyboard interactions remain available.

Each iframe installs memory-only localStorage, sessionStorage and cookie access before loading banking modules. Profile comparison and resets therefore use disposable state rather than persistent banking-demo records. These same-origin previews are an isolation convenience for trusted demo code, not a security sandbox. Clipboard and sample-download actions retain their actual browser effects when activated.

## Evidence and validation limits

Browser evidence supplied by the implementation review:

| Check | Observed result |
| --- | --- |
| All 62 groups, default state | Mounted in the browser smoke check |
| 165 component states in the Business panel of comparison mode | Exercised in the browser sweep |
| 14 app-layout states in Business | 13 screens plus redirect exercised |
| Business Dialog primary action | Computed `#CC5C00` background and black action text |
| Dialog cancellation | Focus returned to the trigger |
| Narrow gallery menu cancellation | Focus returned to the menu trigger |
| Gallery host at 360 px | `scrollWidth` remained 360 px |
| Host title font | Computed Unbounded, weight 500 |

Review captures: [desktop](../../../.impeccable/review/desktop.png) and [mobile](../../../.impeccable/review/mobile.png).

The browser sweep verifies mounting and selected interactions. It does not establish every behavior, every Personal state, every nested workflow, all locale combinations, full assistive-technology support, cross-browser certification, or WCAG conformance. Compare mode renders both profiles, but the exhaustive state sweep observations above refer specifically to Business.

Automated gallery tests verify source-module catalogue coverage, valid unique section/state definitions, invalid-selection recovery, and independent memory Storage. They do not assert that every exported component was independently interacted with. Final `npm run check` passed after the last UI edits: lint, TypeScript, 62 tests (62 passed, 0 failed), registry consistency and production build. `git diff --check` also passed. Vite retains its existing warning about chunks over 500 kB. The production Business hash-route alias redirected to the gallery; its primary swatch was #CC5C00, the documentation link pointed to a bundled Markdown asset, and that production visit logged no console errors.

The initial transition detector reported incumbent sidebar layout-transition warnings. Follow-up hook triage removed the sidebar geometry-transition utilities and their usage: width, position and padding now update immediately; label opacity and control colour/shadow retain their existing safe transitions. No ignore rules were added. The gallery Sidebar specimen also disables transitions locally. Reduced-motion behavior inherits the existing application rules; this record does not claim an exhaustive reduced-motion browser sweep.

## Incumbent consistency

The extension preserves `DESIGN.md`, shared component contracts and normative tokens. It uses the incumbent white canvas/panels, blue Personal/orange Business identities, black Business action foreground, Unbounded titles, UI sans financial text, Phosphor icons and bundled assets. No new dependencies or assets were added. Documentation was extended in `docs/DESIGN_SYSTEM.md` rather than replacing the visual contract.

A pre-existing documentation mismatch remains: `PRODUCT.md` says the current interface is English and other languages are undecided, while the implemented language selector and `docs/DESIGN_SYSTEM.md` document 13 language/script variants. This extension does not resolve or reinterpret that product decision. The gallery host uses Ukrainian catalogue copy and the iframe bootstrap starts specimens in English; language specimens can be explored independently in memory.

Implementation and catalogue: [gallery host](../../../src/app/design-system/gallery.tsx), [catalogue](../../../src/app/design-system/catalogue.ts), [preview bootstrap](../../../src/app/design-system/preview.tsx), [source coverage tests](../../../tests/design-system-gallery.test.cjs). Usage: [design-system documentation](../../DESIGN_SYSTEM.md#11-інтерактивна-вебгалерея).

## Finish review

The independent reviewer scored all three requested corrections resolved: mobile menu focus recovery, removal of the repeated eyebrow, and Unbounded Medium for gallery titles. Final disposition: ship, scoped to those corrections and the supplied desktop/mobile evidence. No detector suppressions were added.
