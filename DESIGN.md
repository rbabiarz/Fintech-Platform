# Design — Align

The north star and the rules of taste for Align, a goals-driven personal finance
app. Align renders every financial screen through the lens of the life a person is
trying to build — not the accounts they happen to hold.

> This file holds philosophy and principles. Concrete values live in
> [`design-tokens.json`](./design-tokens.json) / [`tokens/`](./tokens/), and the
> system is documented in [`design-system/`](./design-system/). The runtime source
> of truth for the mobile app's palette is
> [`artifacts/mobile/constants/colors.ts`](./artifacts/mobile/constants/colors.ts).

## North star

> A person opens Align and, in one glance, understands what today's money means for
> the life they're building — and feels steadier, not judged, for having looked.

## Product principles (non-negotiable)

These are set as product constraints, not style preferences. They override visual
convenience when they conflict.

1. **Goals as the spine.** Every screen renders financial state through user-defined
   milestones (home, retirement, education, sabbatical). Accounts and transactions
   are means; goals are the frame.
2. **Show the math.** Every nudge, projection, score, and recommendation surfaces its
   reasoning in plain language through a "Why?" affordance. No black-box numbers ship.
3. **Compassion over shame.** No deficit framing, no streaks, no leaderboards, no
   stoplight-red for overspending. Guidance treats users as adults navigating
   trade-offs. Celebrations are a first-class moment.
4. **Information, not advice.** Projections and *educational reference* allocations
   only — never personalized investment advice. This is a regulatory boundary (SEC
   Investment Advisers Act), encoded in copy and UI. See
   [`docs/constraints.md`](./docs/constraints.md).

## Craft principles

- **Systems, not screens.** A screen is one state of a system. Design empty, loading,
  error, and edge states alongside the happy path.
- **Meaning survives without color.** Alignment and status always pair an icon and a
  text label with their hue. A colorblind user loses nothing.
- **Calm and trust.** The visual language sits deliberately between institutional
  blue-and-serif fintech and aggressive neobank gradients: warm sand surface, teal
  brand, navy headlines, generous space, tabular figures.
- **Tokens over magic numbers.** Color, space, radius, type, and motion trace to a
  token. Hardcoded hex/px in component code is a smell. See
  [`.claude/rules/design-system.md`](./.claude/rules/design-system.md).

## Palette (summary)

Full token set in [`design-tokens.json`](./design-tokens.json). The load-bearing rule:
**coral/amber (`#B45309`) is the strongest risk signal — never saturated red for a
behavioral state.** `error-600` (`#B91C1C`) is reserved for genuine system errors
(failed sync, broken link), never for an overspent category or an at-risk goal.

| Role | Token | Hex |
|---|---|---|
| Page surface | `bg.page` (sand-50) | `#FAF7F2` |
| Card | `bg.card` | `#FFFFFF` |
| Brand / primary | `brand.default` (teal-600) | `#2C7A7B` |
| Brand tint | `brand.tint` (teal-100) | `#B2DFDB` |
| Heading | `fg.heading` (navy-900) | `#0F2A4A` |
| Body text | `fg.default` (slate-700) | `#334155` |
| Aligned / positive | `status.positive` (success-600) | `#15803D` |
| Out-of-sync / drift | `status.caution` (caution-600) | `#B45309` |
| Genuine error only | `status.error` (error-600) | `#B91C1C` |

## Typography

Inter throughout (400 / 500 / 600 / 700) — a humanist sans, no serifs, no
enterprise blue. **All currency values use tabular figures** so columns of money
align and don't jitter on update. Scale and usage in
[`design-system/foundations.md`](./design-system/foundations.md).

## Motion

Eased, 200–280ms (`motion.duration.*`, `easing.standard`). Motion explains a state
change or directs attention — never decorative. `prefers-reduced-motion` is fully
respected: render the end state with no transition.

## How design connects to build

- Foundations and the component inventory live in [`design-system/`](./design-system/).
- The product runs as an Expo Router React Native app in
  [`artifacts/mobile/`](./artifacts/mobile/); shadcn/ui previews live in
  [`artifacts/mockup-sandbox/`](./artifacts/mockup-sandbox/).
- Decisions and their rejected alternatives are logged in
  [`docs/design-decisions.md`](./docs/design-decisions.md).
- Open design questions are tracked in [`docs/open-questions.md`](./docs/open-questions.md).
