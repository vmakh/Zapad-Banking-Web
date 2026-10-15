# Navigation, status and notice review — 2026-10-15

Reviewed the remaining page titles, accessible labels, semantic Badge/Alert/Sonner contracts, Inbox presentation and related narrow-layout changes. The concurrent standard-button 64px sizing work is excluded. Existing mock/demo wording, privacy and local-preview semantics remain intact.

No blocking review defects found. Added a contrast regression test for every semantic status ink/surface pair (success, warning, attention, info and danger), alongside the existing secondary-text, field-boundary and payment-card identity tests.

## Browser evidence

- 78 Ukrainian page compositions: 13 routes, both profiles, widths 320/768/1440 px. Titles include the selected section and correct profile. No horizontal overflow or hidden horizontal clipping detected.
- 26 German page compositions at 320 px: all routes, both profiles, no detected clipping.
- 18 Badge/Alert compositions: both profiles, all three widths. The Badge specimen includes all six semantic tones; Alert includes informational and destructive variants.
- 24 Sonner renders: default/success/error/info/warning/loading, both profiles at 320 and 1440 px. Actual toast type was checked against the requested type; default is intentionally untyped.
- Keyboard route activation on desktop Personal moves focus to `main-content`. Mobile Business navigation does the same after the closing animation settles, with no dialog remaining.
- Changing Ukrainian to German updates both document language and section title. Switching Business to Personal retains German and updates the profile in the title.
- The toast Undo action is 44px high, works with Enter and displays its local demo result. No banking operation was submitted.
- A Business statement at 320×480 px has a 456px viewport and 771px scrollable content, using whole-dialog vertical scrolling.

The first long browser batch exceeded the tool time limit and was discarded; the counts above refer only to the saved completed batches. Initial mobile-menu closing coordinates are retained alongside the settled focus result. No suppression or hook ignore was added.

Live browser checks used the shared checkout, which also contained the parallel button-size work. The separate staged snapshot excludes that work and passed `npm run check`: lint, TypeScript, 83 tests, regenerated UI registry and production build. Existing chunk-size advisories remain. This is a focused code/UI review; no physical-device, forced-colours emulation or full screen-reader audit is claimed.

[Raw checks](measurements.json) · [Business Inbox screenshot](business-inbox-390.png).
