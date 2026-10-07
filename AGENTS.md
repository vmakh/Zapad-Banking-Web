# Banking web prototype
Before changing UI, read DESIGN.md and docs/UI_COMPONENTS.md. Reuse shared components and tokens; use cn() from src/app/components/ui/utils.ts. Tailwind 4 only. Do not add arbitrary Tailwind values, duplicate primitives, or weaken lint rules.
Run npm run check before completion. Regenerate the component registry with npm run generate:ui-registry after component contract changes.
This is a frontend demo: never imply real payment settlement, authentication, or live market data.
