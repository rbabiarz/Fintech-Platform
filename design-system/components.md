# Components

Inventory of Align's components with variants and states. Implemented in the Expo app
([`artifacts/mobile/app/`](../artifacts/mobile/app/) screens compose these); shared
shells live in [`artifacts/mobile/components/`](../artifacts/mobile/components/);
shadcn/ui previews in [`artifacts/mockup-sandbox/`](../artifacts/mockup-sandbox/).

Every component references semantic tokens (never raw hex) and is designed for all
states — default, loading (skeleton), empty, and error.

## Signature components (Align-specific)

### GoalCard
- **Purpose:** render a `Goal` as the unit of the dashboard — progress, projected
  completion date, monthly contribution.
- **Variants:** pinned / standard; hidden (excluded from totals).
- **States:** the four `GoalStatus` pills — Ahead, On Track, Slightly Behind, At Risk.
- **Tokens:** `brand.default`, `bg.card`, `goalStatus.*`. Status pill = color + label.

### AlignmentScore
- **Purpose:** the composite Goal Alignment Score (0–100) with its breakdown (savings
  30% / spending 30% / investing 20% / debt 20%).
- **States:** value + trend (`alignmentTrend`); tap opens the "Why?" breakdown.
- **Accessibility:** the number is never the only signal — the breakdown is reachable
  and the trend is labeled, not just an arrow color.

### NextActionCard
- **Purpose:** the single highest-impact recommendation (ADR-002), with inline "Why?".
- **States:** present / dismissed / none (empty state: "Nothing needs your attention").

### TransactionRow
- **Purpose:** one `Transaction` in the unified feed.
- **Variants:** debit / credit.
- **Alignment indicator:** aligned (`check-circle`, positive) · neutral
  (`minus-circle`) · out-of-sync (`alert-circle`, caution) — icon + label + color,
  user-configurable. See [`tokens/semantic.json`](../tokens/semantic.json).

### PredictiveGuidanceCard
- **Purpose:** translate a category trend into goal-timeline impact in plain language.
- **States:** triggered (with source numbers) / none. Carries a "Why?" affordance that
  shows the trailing-window math. Copy must stay factual (never advice).

### AllocationDriftRow / ProjectionChart
- **Purpose:** Invest tab — drift vs. an *educational reference* allocation;
  conservative / expected / optimistic milestone projection.
- **Required:** persistent disclosure banner *"Educational reference, not personalized
  investment advice."* on any surface that renders these.

### AlertCard
- **Purpose:** one `Alert`.
- **Variants:** nudge · celebration (first-class, ≥ 25% of volume) · warning · info.
- **Required:** "Why am I seeing this?" expansion on every alert.

### AccountCard · HoldingRow
- **Purpose:** `ConnectedAccount` summary (type, balance, lastSync) and `Holding` row
  (ticker, value, allocation, change). Change uses tabular figures + direction label,
  not color alone.

## Primitives

### Button
- **Variants:** primary (teal, pill), secondary (outline), ghost.
- **States:** default, pressed, disabled, loading. All CTAs pill-shaped (`radius.pill`).

### StatusPill · DisclosureBanner · WhyDrawer
- **StatusPill:** label + color for `GoalStatus` / alignment.
- **DisclosureBanner:** the persistent educational disclosure (Invest surfaces).
- **WhyDrawer:** bottom sheet that shows the source math for any number — the UI
  embodiment of "Show the math." Uses `shadow.raised`.

## Iconography

Feather via `@expo/vector-icons` (the codebase standard). Do not hand-author SVG paths.
