# Remaining control styles review — 2026-10-15

Scoped to the remaining styles present at the start of this review: choice controls, field boundaries, positive/secondary text, invalid action outlines and disabled action/native-select states. Concurrent route titles, accessible-name changes and subsequent status/notice work are excluded from this commit.

## Findings and fix

The documented 44×44 px target had been added to checkbox/radio but not to the 40×24 px switch. Extended the same target pseudo-element and label-row spacing to switch. Its visible track remains 40×24 px, thumb 20 px, travel 16 px. Checkbox/radio visuals stay 20 px. The transfer recipient form reuses shared Checkbox and retains its save-recipient behavior.

No remaining blocking findings in the scoped patch. No rules or findings were suppressed.

## Verification

- 78 screen compositions: all 13 routes, both profiles, widths 320/768/1440 px. No horizontal overflow or detected text/control clipping.
- 114 specimen renders for checkbox, radio, switch, inputs, selects and buttons across those profile/width combinations. Raw records include default-state recovery for unsupported requested fixture names; these are not claimed as invalid-button interaction coverage.
- Checkbox Space activation and switch Space activation/deactivation verified. Focus settles to a 2 px profile-accent outline. Switch thumb settles at 16 px when checked.
- The Business recipient form exposes an accessible checkbox name and changes its checked state by keyboard.
- Rendered default choice boundaries against their surrounding canvases: Personal 3.01:1, Business 3.19:1. Field boundaries: 3.15:1 and 3.24:1. Disabled input text against its fill: 5.31:1 and 5.24:1. These are measured pairs, not a claim of complete application accessibility conformance. Disabled boundaries are exempt from active-control contrast requirements; switch foreground colour is not text.

The scoped commit snapshot passed `npm run check`, including lint, TypeScript, 80 tests, regenerated component registry and production build. Existing bundle-size advisories remain. A physical-device or screen-reader audit was not performed.

[Measurements](measurements.json) · [Business recipient checkbox](business-checkbox-390.png).
