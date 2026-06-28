# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

"Align" — a goals-driven personal finance mobile app prototype. The core thesis: render every financial screen through the lens of user-defined life goals, not accounts. This is a prototype/case study; the mobile app runs on mock data via `AppContext` and is not wired to the real API.

## Design & Product Workspace

Alongside the code, this repo carries a product-design deep-dive workspace. Read these
before changing UI, copy, or tokens:

| Path | What's there |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | Design north star, product principles, palette, motion |
| [`design-tokens.json`](./design-tokens.json) + [`tokens/`](./tokens/) | Source-of-truth tokens (3-tier). Mirror of [`artifacts/mobile/constants/colors.ts`](./artifacts/mobile/constants/colors.ts) — keep in sync |
| [`design-system/`](./design-system/) | Foundations, component inventory, patterns, usage do/don'ts |
| [`docs/`](./docs/) | Brief, PRD, ADR decision log, personas, IA, success metrics, constraints, open questions |
| [`.claude/rules/`](./.claude/rules/) | Loadable rules: design-system, accessibility, code-style, content-voice |
| [`reference/`](./reference/) | Research synthesis, brand, moodboards, flows |

**Never hardcode visual values** — reference a token. **Status never rides on hue
alone.** `error-600` is for genuine system errors only, never spend overruns
(`caution-600` is the strongest behavioral risk signal).

## Commands

```bash
# Install (pnpm only — npm/yarn blocked by preinstall hook)
pnpm install

# Typecheck entire workspace
pnpm run typecheck

# Build entire workspace
pnpm run build

# Run mobile app (web mode, local)
cd artifacts/mobile && pnpm web

# Run API server
cd artifacts/api-server && pnpm dev

# Run mockup sandbox (Vite + shadcn/ui)
cd artifacts/mockup-sandbox && pnpm dev

# Typecheck a single package
cd artifacts/mobile && pnpm typecheck
cd artifacts/api-server && pnpm typecheck
```

There are no tests. The root `build` script runs `typecheck` then recursive `build` across all packages.

## Monorepo Layout

```
artifacts/
  mobile/           # Expo Router React Native app — the main product
  api-server/       # Express 5 REST API (skeleton; minimal routes)
  mockup-sandbox/   # Vite + shadcn/ui component preview tool
lib/
  api-spec/         # openapi.yaml — source of truth for API contracts
  api-zod/          # Zod schemas generated from openapi.yaml via orval
  api-client-react/ # TanStack Query hooks generated from openapi.yaml via orval
  db/               # Drizzle ORM schema and config
scripts/            # Workspace tooling
```

## Architecture

### Mobile App (`artifacts/mobile`)

Expo Router v6 with file-based routing:
- `app/(onboarding)/` — welcome → signup → goal → risk → link → ready
- `app/(tabs)/` — Goals, Money, Invest, Alerts, Profile (bottom tab navigator)
- `app/*.tsx` — detail screens pushed from tabs (account-detail, transaction-detail, goal-editor, holding-detail, etc.)

**State:** All app data lives in `context/AppContext.tsx` as React Context with static mock data. Types (`Goal`, `Transaction`, `Alert`, `Holding`, `ConnectedAccount`) are defined there. `OnboardingContext.tsx` tracks onboarding wizard state. `ConfirmContext.tsx` provides a global confirmation dialog.

**Styling:** NativeWind (Tailwind for React Native). Design tokens follow the product design system — teal-600 (`#2C7A7B`) primary, navy-900 (`#0F2A4A`) headlines, sand-50 (`#FAF7F2`) page surface. `error-600` is for genuine errors only, never for spend overruns.

**Key constraint:** Every numeric output (projections, scores) must be source-traceable. No black-box outputs.

### API Layer (code-generated)

`lib/api-spec/openapi.yaml` is the single source of truth. **Do not edit generated files directly.**

- `lib/api-zod/src/generated/` — Zod schemas, regenerated via orval
- `lib/api-client-react/src/generated/` — TanStack Query hooks, regenerated via orval
- To regenerate: see `lib/api-spec/orval.config.ts`

### API Server (`artifacts/api-server`)

Express 5, ESM, built with esbuild (`build.mjs`). Currently only has a `/health` route. Pino for logging.

### Mockup Sandbox (`artifacts/mockup-sandbox`)

Standalone Vite + React + shadcn/ui app for UI component previewing. Independent of the mobile app — uses Recharts, Radix UI, Tailwind 4. The `mockupPreviewPlugin.ts` is a custom Vite plugin for live preview.

## Package Manager Constraints

- **pnpm only** — `npm`/`yarn` are blocked by the preinstall hook
- `pnpm-workspace.yaml` enforces `minimumReleaseAge: 1440` (packages must be published ≥1 day before install — supply-chain defense). Do not disable. Use `minimumReleaseAgeExclude` for narrow exceptions.
- Shared dependency versions are managed via the workspace `catalog:` in `pnpm-workspace.yaml` — reference catalog versions in package.json with `"catalog:"` rather than repeating version strings.

## TypeScript

`tsconfig.base.json` at the root sets shared compiler options. Each package extends it. The root `typecheck:libs` script runs `tsc --build` for the `lib/` packages (project references); `typecheck` then runs each artifact's own check.

## Regulatory Constraints (baked into product)

- No personalized investment advice (SEC Investment Advisers Act boundary)
- Investing screens must carry: *"Educational reference, not personalized investment advice."*
- Allowed: educational reference allocations, goal projections with disclosed assumptions, factual drift observations
- Not allowed: "You should buy X / sell Y" or any specific securities recommendation
