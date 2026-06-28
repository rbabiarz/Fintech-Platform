# Constraints

## Regulatory (baked into the product)

Align operates at the boundary between financial *information* and *personalized
investment advice* (SEC Investment Advisers Act). These are hard constraints, encoded
in copy and UI — not guidelines.

- **Allowed:** educational reference allocations, factual observations about portfolio
  drift, goal projections with disclosed assumptions.
- **Not allowed (MVP):** "You should buy X," "Sell Y," or any specific securities
  recommendation — these require RIA registration.
- **Required:** every investing surface carries the persistent disclosure
  *"Educational reference, not personalized investment advice."*
- Investing is **read-only** at MVP — no trade execution, no money movement.

## Product (founder principles — non-negotiable)

- **Compassion over shame:** no streaks, leaderboards, deficit framing, or
  stoplight-red for spending. Coral/amber is the strongest behavioral risk signal.
- **Show the math:** every numeric output is source-traceable in one tap.
- **Low-noise:** ≤ 1 push notification / 24h by default; celebrations are first-class.

## Platform

- **Targets:** iOS and Android via Expo; web build via `react-native-web`.
- **Framework:** React Native 0.81, Expo SDK 54, Expo Router v6, TypeScript 5.9.
- **Styling:** NativeWind (Tailwind for RN); tokens mirror
  [`artifacts/mobile/constants/colors.ts`](../artifacts/mobile/constants/colors.ts).
- **Accessibility:** WCAG 2.2 AA; honor `prefers-reduced-motion`; meaning never via
  color alone; hit targets ≥ 44×44.

## Technical

- **Monorepo:** pnpm workspaces; **pnpm only** (npm/yarn blocked by preinstall hook).
- **Supply-chain defense:** `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` — do not
  disable; use `minimumReleaseAgeExclude` for narrow exceptions.
- **API contract:** `lib/api-spec/openapi.yaml` is the single source of truth; Zod
  schemas and React Query hooks are generated (do not edit generated files).
- **Prototype state:** the mobile app runs on mock data via `AppContext` — not wired
  to the live API.

## Out of scope

See non-goals in [`brief.md`](./brief.md).
