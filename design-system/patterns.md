# Patterns

Composed, reusable solutions built from the components inventory.

## Explainability ("Show the math")
Any computed number — alignment score, projection, guidance, drift — exposes a "Why?"
affordance that opens the `WhyDrawer` with the source inputs and the calculation in
plain language. This is a product principle, not an optional nicety: **no black-box
numbers ship.** Onboarding ends with this drawer auto-opened on the live dashboard.

## Alignment as a first-class signal
The aligned / neutral / out-of-sync triad appears on transactions, category trends,
and guidance. Always rendered as **icon + label + color**, never color alone, and the
mapping is user-configurable per category.

## Compassionate guidance (no shame)
Predictive Guidance states a fact and its consequence, then leaves the choice to the
user — e.g. *"Dining is trending 24% above your goal-aligned pace; at this rate your
home down-payment shifts ~6 weeks."* Never "you overspent," never a red overspent bar.
Overspend uses `status.caution`, not `status.error`.

## Educational disclosure (Invest)
Any surface rendering allocations, drift, or projections carries the persistent
`DisclosureBanner`: *"Educational reference, not personalized investment advice."* Copy
never instructs a buy/sell.

## Low-noise alerts + celebration
Default ≤ 1 push / 24h. Celebrations are a first-class alert type targeting ≥ 25% of
volume — the system surfaces wins, not just warnings.

## Empty, loading, and error states
- **Empty:** name the next step, not the absence ("Add your first goal to see your plan").
- **Loading:** skeletons that match the resting layout; no spinners on cards.
- **Error:** `status.error` reserved here (failed sync, broken Plaid link) — say what
  happened and the recovery step. Never blame the user.

## Onboarding wizard
welcome → signup → goal → risk → link → ready. Linear, resumable via
`OnboardingContext`, with a visible step indicator and the ability to go back.
