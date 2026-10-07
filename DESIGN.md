# Zapad Banka web visual foundation

The original mobile prototype was the visual reference. Its adapted materials are bundled here; the mobile source is not a runtime dependency. Keep the desktop information architecture, sidebar, routes and banking interactions; adapt the mobile materials rather than enlarging its phone layout.

- Unbounded Medium for page and task titles; system/Inter body stack for controls and financial data. Font and license are bundled in `src/assets`.
- Personal: blue action gradient, pale blue supporting surfaces, navy text.
- Business: solid copper primary action with white text, warm supporting surfaces, slate text. Do not restore the earlier purple treatment.
- White navigation and panels, quiet dividers, 12px controls and 16px panels. Use existing theme tokens and standard spacing utilities.
- Card faces reuse the mobile material colours and brand motif, capped at the existing `max-w-sm` size.
- Theme contracts live in `src/styles/theme.css`; the mobile-to-web component mapping is at the end of `src/styles/index.css`.
- `RootLayout` identifies the workspace with `data-bank-profile`. Root-level CSS propagates its tokens to Radix portals. `Button` exposes `data-variant` so visual changes preserve semantic destructive/outline/ghost variants.

Mobile source and its protected runtime remain untouched. Validate Personal and Business, desktop and narrow layouts, and portalled forms after changes.

## Restraint across product screens

Use colour for primary actions, account identity, financial direction and status. Keep product offers as compact rows with a quiet outline action; do not build promotional hero panels, glow blobs, sparkle badges or duplicate investment CTAs. Use a flat page canvas. Payment card artwork is an explicit exception: preserve the mobile CardArtwork gradients, white bank mark, NFC, masked number and network identity. Keep its existing bounded size; do not flatten it to pale surfaces when quieting controls.

Keep body descriptions regular, labels medium and key amounts/section titles semibold. Show related metrics in a shared row rather than individual coloured tiles. Do not truncate rates or amounts to fit those rows. Avoid decorative hover zoom.

Typography weights are shared across pages and portals: regular 400 for body/help text and form input, medium 500 for labels/actions/navigation, semibold 600 for section headings and key amounts. Page/task titles use the bundled Unbounded Medium at 500. Do not redefine Tailwind medium as 600 or override semibold inside dialogs.

## Primary action hierarchy

Use at most one filled primary action per page or active dialog step. Informational pages may have none. A dialog is a separate task surface; its dimmed background is not a competing action. Loans prioritises Apply for loan; Make payment uses a soft profile-tinted secondary action, Savings prioritises New goal, Payments prioritises Transfer. Secondary and repeated row actions use outline or ghost; an important secondary action may use a soft accent background with accent text. Supporting metrics, calculators, profile avatars, notification counts, and normal progress indicators use neutral surfaces. Retain readable text, visible focus and meaningful error/warning states; do not reduce accessibility contrast to manufacture hierarchy.

The profile switcher preserves mobile identity: Personal avatars are blue, Business avatars copper, and the current profile has a soft profile-coloured row plus a checkmark. Do not neutralize these identity avatars with supporting-surface rules.

Typography sizes are stable across profiles and breakpoints: page titles 24px, section and task titles 18px, page subtitles and shared buttons 14px. Use existing Tailwind text tokens; financial totals retain their separate emphasis. Do not enlarge section titles just because the viewport is wide.

## Information proximity
Keep headings and their content in one section. Use 8–16px between a section heading and its content, and 24–32px between independent sections. Count list-item padding as part of the visible gap. Direct dialog headers rely on the dialog gap; do not add a second bottom margin. Keep labels and descriptions closer to their own value or control than to the next group.
