# Zapad Banka web visual foundation

Current implementation reference (reviewed 2026-10-14): [Дизайн-система та правила використання компонентів](docs/DESIGN_SYSTEM.md). The generated [UI component registry](docs/UI_COMPONENTS.md) includes source APIs and direct import locations. The rules below remain the visual contract.

The original mobile prototype was the visual reference. Its adapted materials are bundled here; the mobile source is not a runtime dependency. Keep the desktop information architecture, sidebar, routes and banking interactions; adapt the mobile materials rather than enlarging its phone layout.

- Unbounded Medium for page and task titles; locally bundled variable Onest for controls and financial data (400/500/600/650), approved 2026-10-15. Fonts and licenses are bundled in `src/assets`.
- Personal: solid primary blue `#0034B8`, white action text, pale blue supporting surfaces and navy body text.
- Business: primary orange `#A34900`, approved on 2026-10-15. Primary actions and identity avatars use this shared brand colour with white foreground. `--bank-action` references `--bank-accent`; white/background contrast is 5.98:1. Use the darker derived `--bank-accent-text` for small accent text. Do not restore the earlier purple treatment.
- Phosphor Icons 2.1.10, regular by default and fill for selected navigation; 24px leading functional glyphs on transparent surfaces. Keep initials, currency flags, inline controls and status illustrations distinct by role.
- Mark standalone functional icon wrappers with `data-slot="functional-icon"`, including in dialogs and sheets, so neutral utility backgrounds cannot override their transparent surface. Avatars, result illustrations, frozen-card states and online-status dots retain their own backgrounds; selected card-action indicators use `data-slot="status-icon"`.
- Icon roles use shared `--bank-icon-*` tokens: leading glyphs are 24px in a 32px slot with a 12px text gap; heading glyphs use a 24px slot and 8px gap; action glyphs are 20px in a 24px slot with an 8px gap; icon-only buttons keep their 44px target and 24px glyph. Transaction detail glyphs are 32px in a 48px slot with 16px below. Use `data-icon-role` (or `IconScaleSlot.iconRole`) for exceptions to the leading role. Currency flags, avatars, small status indicators and result illustrations keep their own geometry.
- White navigation; Personal uses cool porcelain panels on a pale blue-grey canvas, while Business uses milk-white panels on a warm canvas. Both use subtle offset shadows. Quiet dividers, 12px controls and 16px panels. Use existing theme tokens and standard spacing utilities.
- Card faces reuse the mobile material colours and brand motif, capped at the existing `max-w-sm` size.
- Theme contracts live in `src/styles/theme.css`; the mobile-to-web component mapping is at the end of `src/styles/index.css`.
- `RootLayout` identifies the workspace with `data-bank-profile`. Root-level CSS propagates its tokens to Radix portals. `Button` exposes `data-variant` so visual changes preserve semantic destructive/outline/ghost variants.

Mobile source and its protected runtime remain untouched. Validate Personal and Business, desktop and narrow layouts, and portalled forms after changes.

## Restraint across product screens

Use colour for primary actions, account identity, financial direction and status. Keep product offers as compact rows with a quiet outline action; do not build promotional hero panels, glow blobs, sparkle badges or duplicate investment CTAs. Use a flat page canvas. Payment card artwork is an explicit exception: preserve the mobile CardArtwork gradients, white bank mark, NFC, masked number and network identity. Keep its existing bounded size; do not flatten it to pale surfaces when quieting controls.

Keep body descriptions regular, labels medium and key amounts/section titles semibold. Show related metrics in a shared row rather than individual coloured tiles. Do not truncate rates or amounts to fit those rows. Avoid decorative hover zoom.

Typography weights are shared across pages and portals: regular 400 for body/help text and form input, medium 500 for labels/navigation, semibold 600 for key amounts and text actions; primary/secondary action labels use the mobile weight 650. All H1–H6 and task titles use the bundled Unbounded Medium at 500. Do not redefine Tailwind medium as 600 or override semibold inside dialogs.

## Primary action hierarchy

Use at most one filled primary action per page or active dialog step. Informational pages may have none. A dialog is a separate task surface; its dimmed background is not a competing action. Loans prioritises Apply for loan; Make payment uses a soft profile-tinted secondary action, Savings prioritises New goal, Payments prioritises Transfer. Secondary and repeated row actions use outline or ghost; an important secondary action may use a soft accent background with accent text. Supporting metrics, calculators, profile avatars, notification counts, and normal progress indicators use neutral surfaces. Retain readable text, visible focus and meaningful error/warning states; do not reduce accessibility contrast to manufacture hierarchy.

The profile switcher preserves profile identity: Personal avatars use blue `#0034B8`, Business avatars use orange `#A34900`, and the current profile has a soft profile-coloured row plus a checkmark. Use each profile's own foreground token even when both avatars appear in the same menu. Do not neutralize these identity avatars with supporting-surface rules.

Typography follows the approved 4px-grid scale across profiles and breakpoints. Unbounded 500: H1 40/48, H2 32/40, H3 28/36, H4 24/32, H5 20/28, H6 16/24 (font size / line height in px). Onest 400: paragraph sm 12/20, md 16/24, lg 20/28. Paragraph after spacing: 8/12/16px; heading after spacing: 24/20/16/16/12/8px. Tracking follows the dedicated semantic tokens; do not round tracking to the 4px grid. Apply paragraph after-spacing within prose; avoid stacking it on layout gaps. Labels/navigation retain weight 500, amounts 600, actions 650. Form text is 16px on all widths; no mobile heading size override. Financial totals retain their independent adaptive sizing.

The complete localized hero balance stays on one line and scales with its panel width and character count, up to 48px. Never split currency codes or truncate amounts. Onest is shared by both profiles; Unbounded remains the page and task title family.

## Information proximity
Keep headings and their content in one section. Use 8–16px between a section heading and its content, and 24–32px between independent sections. Count list-item padding as part of the visible gap. Direct dialog headers rely on the dialog gap; do not add a second bottom margin. Keep labels and descriptions closer to their own value or control than to the next group.

## Control clarity and motion

Field and select backgrounds use `--bank-field`: cool near-white `#F9FBFD` for Personal and warm near-white `#FCFAF7` for Business, including portalled forms. Use `--bank-control-line` for form boundaries and `--bank-line` for quiet panel dividers. Invalid fields retain the mobile error border (`--bank-error`), including in portals. Search opens on activation, never on focus alone. Category filters expose their selected state and use the active profile accent.

Dropdowns and their submenus, select lists, popovers, hover cards, dialogs, sheets and drawers reuse `--bank-material-surface`, `--bank-material-edge` and `--bank-material-shadow`. Root-scoped profile tokens keep portalled surfaces cool near-white in Personal and warm near-white in Business, matching cards with restrained depth. Mobile navigation inside a sheet shares its surface. Preserve overlay dimming, focus indicators and selected/error states.

Menu and select items use `--bank-menu-hover` for pointer/keyboard highlighting and the slightly stronger `--bank-menu-selected` for checked/current rows. Personal uses cool blue washes; Business uses warm cream washes. Selected rows retain profile accent text and their checkmarks. Disabled and destructive items keep their semantic states.

Use the shared `Progress` for financial progress: neutral fill, immediate initial value, and an accessible label. Do not animate known balances or percentages from zero. Respect reduced motion across both the workspace and portalled controls.

## Business material system

Approved on 2026-10-15 as the default across all Business routes: warm flat canvas, near-white panels (`#FFFEFD`), a fine white edge and restrained offset shadows. Personal has its own cool material palette, described below. Business material tokens are defined in `theme.css`; workspace-scoped selectors in `index.css` style shared Card panels, older explicitly marked page surfaces and payment choices. Portalled Business task surfaces inherit the milk-white material without changing form contrast or focus behavior. Navigation and payment card artwork retain their established identity.

Business Home includes the mirrored monthly income/expense chart with an explicitly illustrative 2026 scenario, separate from transaction fixtures and balances. It reuses Card and ChartContainer, hides chart/table with amount privacy and provides a keyboard-accessible data table. Spending analytics appears above activity with soft gradient segments. No URL flag is required; existing `?effects=soft` links remain valid. The gallery marker enables isolated material specimens.

Business cash-flow periods use the shared single-select ToggleGroup: Year (default) shows all 12 months, Quarter and Month initially use the May sample anchor, then allow selecting any quarter or month of 2026 through a shared Select and adjacent-period arrow buttons. The available year (2026) is explicit; navigation is disabled at its boundaries. Switching granularity preserves the selected month and its containing quarter. Daily cents reconcile to the annual monthly series; chart axes, tooltip dates, accessible table and totals follow the selected period.

Business cash-flow mode and selected month persist together in versioned, Business-specific browser storage. Reloading or returning to Home restores the selection. Invalid, obsolete or unavailable storage falls back to Year / May 2026; controls still work when storage is blocked.

## Personal material system

Approved direction on 2026-10-15: pale blue-grey canvas, near-white cool porcelain cards (`#FDFEFE`), a fine white edge and restrained navy-tinted offset shadows across all Personal pages and task surfaces. Keep the established solid blue action/identity colour, navy text, Onest body and Unbounded titles. The balance panel has a quiet ice-blue wash. Spending segments use soft blue, cyan, sage and slate gradients with subtle depth; values and category meanings remain unchanged. Reuse shared surface selectors and Card; only profile tokens and categorical gradient colours differ from Business. Keep Personal navigation, page structure, actions and payment-card artwork. Personal Home uses the shared CashFlowAnalytics component with its own explicitly illustrative 2026 scenario, separate from transactions and balances. Income is blue and spending cyan; monthly/quarterly/yearly controls, arrows, privacy handling and the accessible data table are shared. Each profile stores its selected period independently; existing Business selections are retained.

Cash-flow summaries in both profiles show signed amount differences and percentage changes against the previous complete month, quarter or year, using quiet secondary badges and a localized baseline label. Explicit illustrative 2025 fixtures cover year boundaries and annual comparison; they never enter posted activity or account balances. Spending comparisons use positive expense magnitudes. Privacy hides both absolute changes and percentages; a nonzero change from a zero baseline has no calculable percentage.

Cash-flow bar tooltips show current and previous values plus signed amount/percentage differences for each metric. Year aligns the same month in 2025; Quarter aligns the same position in the previous quarter; Month aligns the same day number in the previous month. Missing calendar days are explicitly unavailable, never shifted or treated as zero. Existing amount privacy removes the chart and its tooltips.

## Segmented controls and button groups

Tabs, Menubar and default ToggleGroup share a 16px outer radius and 4px padding, with a derived 12px segment radius and 44px minimum segment target. Use shared `rounded-segmented` / `rounded-segmented-item` tokens; do not pass independent radius classes. Joined outline groups have no inset: 12px rounding only on exposed end corners, with square internal seams. Investment and cash-flow period selectors reuse ToggleGroup in both profiles. Separate filter/action buttons, standalone Toggle and pagination links retain the shared 12px control radius; account-type choices also use 12px. Circular switch tracks/thumbs retain their native geometry.

Form geometry: shared Input, standard Select/NativeSelect, default/lg Button and balance actions use a 48px minimum, Onest 16px, 12px field inset / 16px button inset and 8px vertical inset. Compact Button/Select use a 44px minimum and 12px horizontal inset; icon-only buttons use a 44px square target with no inset. Explicit xl/2xl actions use 52px/56px minima and 20px horizontal inset. Buttons keep an 8px icon gap. Long select/button labels grow vertically; Textarea starts at 96px. Portal controls share these tokens. Inputs with a leading currency symbol use `data-leading-adornment` to reserve 32px at the start. Keep label-to-field spacing 8px, adjacent actions 12px and independent form groups 24px; task dialog bodies and footers align at 24px.

Form spacing uses `--bank-form-field-gap` (8px), `--bank-form-group-gap` (24px) and `--bank-form-action-gap` (12px). Mark groups with `data-form-fields` and action rows with `data-form-actions`; group children have no extra vertical margins. Existing responsive column classes remain in effect. A standalone field uses `data-form-field`, while a following standalone hint uses `data-form-hint` to stay 8px from its field. Calculator groups retain 24px before their results via `data-form-fields="calculator"`.

Use shared `FieldFeedback` for field hints and errors in manual forms; `FormDescription` and `FormMessage` reuse it for react-hook-form. Both roles use 13px regular text with 1.45 line height, wrapping and an 8px field gap. Hints use `--bank-feedback-ink` (profile-muted text, slightly darker in Business for contrast on warm inset surfaces), errors use `--bank-error` in both profiles and portals. Preserve message IDs, `aria-describedby`, invalid states and live-announcement roles. Set `tone="error"` for validation failures, including dynamic IBAN feedback.

Control states share the same rules in pages and portals: keyboard focus uses one 2px solid profile-accent outline with a 2px offset, without a second shadow ring. Focused/open fields also use an accent border. Invalid fields use `--bank-error` borders and a quiet `--bank-error-surface` wash; their keyboard focus outline stays red. Disabled controls use opaque, readable `--bank-disabled`, `--bank-disabled-ink` and `--bank-disabled-line` tokens, cool in Personal and warm in Business, without hover brightening or reduced whole-control opacity. Preserve native disabled behavior and existing `aria-invalid`/`aria-disabled` semantics.
