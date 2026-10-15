# Mobile / web visual alignment — 14 October 2026

Reference: the current local **Zapad Banka Mobile App Concept** project, especially the final cascade in `src/prototype.css`, `src/Prototype.tsx` and the live `design-system-preview.html` specimens. The mobile project's files were read without modification.

## Changes

- Shared Personal/Business ink, muted text, dividers, paper, selection and field surfaces; both primary actions use solid profile colours.
- Phosphor React 2.1.10 replaces all Lucide imports in the current web `src/`, including primitives, banking screens, portals, card NFC and toast glyphs. Existing historical previews in `output/` still need the Lucide package.
- The Unbounded Medium font files are byte-identical (SHA-1 `6eee2b132b3e2a68294e506ed181fdcd37fec108`). Both products use the same declared Inter/system UI body stack, without a bundled Inter face.
- Matching 17px body/action roles, 15px secondary, 13px footnote, 11px caption, 24px page headings, 20px sections and popup headings. Primary/secondary action labels use weight 650.
- Functional glyphs use transparent surfaces and 24px regular icons; selected navigation uses fill. Identity initials, flags, inline controls and status illustrations retain separate roles.
- Select values wrap and text buttons grow to preserve full financial values and translated labels at the larger font size.

## Browser verification

Compared computed styles of live Personal and Business Payments in mobile and web: ink, muted, line, paper, selection, body family/size and page-title family/size/weight match. Compared primary buttons in both contexts: background, 17px size and 650 weight match. Compared functional icon specimens: transparent backgrounds and 24px glyphs match.

Visited all 13 top-level banking screens in both profiles (26 routes), checking the Unbounded page role, profile action colour/weight and visible functional icon sizes/Phosphor viewBox. A fresh sweep after dependency optimization produced no console errors.

Checked portalled bill dialogs and the receive-details sheet. Narrow checks used an actual 360px viewport: page titles compute to 22px, popup titles to 20px, fields to 17px, with no horizontal page overflow. Confirmed the full selected account balance wraps rather than truncates and the multiline primary button grows to fit its label.

Evidence: [Personal desktop](../../../output/mobile-alignment/personal-desktop.png), [Business popup at 360px](../../../output/mobile-alignment/business-popup-360.png).

## Explicit web adaptations

Desktop navigation and page composition remain web-specific. Business action text stays black (5.10:1 contrast on #CC5C00), rather than the mobile prototype's white (4.12:1); small Business accent text uses the darker derived token. This is not pixel-for-pixel parity across every possible state.

## Project verification

`npm run check` passed: lint, TypeScript, all 59 tests, the generated registry (268 exports) and production build. Vite retains its existing warning about chunks above 500 kB.
