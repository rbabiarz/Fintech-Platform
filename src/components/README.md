# Components

> **Note:** Align's production components are the Expo Router screens and shared shells
> in [`../../artifacts/mobile/`](../../artifacts/mobile/) (`app/` screens compose UI;
> reusable shells in `artifacts/mobile/components/`). shadcn/ui design explorations live
> in [`../../artifacts/mockup-sandbox/`](../../artifacts/mockup-sandbox/).
>
> This `src/components/` tree is the **design-system reference layer** — standalone,
> token-driven reference implementations and redlines that document the system
> independently of the app. Keep it in sync with the inventory in
> [`../../design-system/components.md`](../../design-system/components.md).

- `primitives/` — atoms (Button, StatusPill, DisclosureBanner).
- `patterns/` — composed pieces (GoalCard, AlignmentScore, NextActionCard,
  TransactionRow, PredictiveGuidanceCard, AlertCard, WhyDrawer).

Conventions: one component per file; reference semantic tokens (never raw hex/px);
follow [`../../.claude/rules/code-style.md`](../../.claude/rules/code-style.md) and the
variant/state model in
[`../../design-system/components.md`](../../design-system/components.md).
