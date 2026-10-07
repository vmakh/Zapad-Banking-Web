# ZapadBanka web prototype

Standalone React/Vite banking prototype for Personal and Business profiles. Mock data and local previews only; no backend, real authentication, payments or live quotes.

## Run

Requires Node.js 22.18+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:5173/#/personal (or /#/business). To use a different port: `npm run dev -- --host 127.0.0.1 --port 5193`.

## Validate and build

```sh
npm run check
npm run preview
```

The check runs design-system lint, TypeScript, model/design tests, registry validation and production build. Static output goes to `dist/`; it is generated and not included in version control. Hash routing supports static hosting. `vercel.json` is included; configure the repository root as the project root, build command `npm run build`, output `dist`.

## Structure

- `src/`: application, assets, fonts, shared UI and theme.
- `tests/`: banking model and design-system regression tests.
- `scripts/`: standalone lint helpers and UI registry generator.
- `docs/`: research, acceptance and historical QA evidence.
- `DESIGN.md`, `AGENTS.md`: design and development contracts.

The application and all tooling are independent of the original portfolio and mobile app. Historical research/QA documents retain original paths for provenance; these are not build dependencies. VoiceOver testing remains unverified, as recorded in the acceptance audit.

## Move to a new repository

Copy this entire folder, including dotfiles, into an empty repository directory. `node_modules`, build output, local storage, environment secrets and the original Git history are not included.

```sh
git init -b main
git add .
git commit -m "Initial banking prototype"
# Add your new repository URL as origin, then push main.
```

No new remote repository is created by this export. Brand/demo assets and bundled third-party notices are retained; no new distribution license is assigned.
