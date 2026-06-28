# Information architecture

Reflects the live routes in [`artifacts/mobile/app/`](../artifacts/mobile/app/)
(Expo Router, file-based).

## Navigation map

```
Onboarding  (app/(onboarding))
  welcome → signup → goal → risk → link (Plaid) → ready → Goals

Tabs  (app/(tabs))
  Goals    (index.tsx)  — Life-First Dashboard: goal cards, Alignment Score, Next Action
  Money    (money.tsx)  — Guided Accounts: unified feed, alignment indicators, Predictive Guidance
  Invest   (invest.tsx) — Mindful Investing: consolidated portfolio, goal mapping, drift
  Alerts   (alerts.tsx) — Goal Alignment & Alerts: nudges + celebrations
  Profile  (profile.tsx)— Settings, privacy, connected institutions, data export

Detail screens  (pushed from tabs)
  account-detail · add-account · transaction-detail · spending-detail
  goal-editor · budget-editor · subscriptions-detail
  holding-detail · portfolio-performance · rebalance-plan · rebalance-detail
  alert-impact · info-detail
```

## Core objects & relationships

Defined in [`artifacts/mobile/context/AppContext.tsx`](../artifacts/mobile/context/AppContext.tsx):

| Object | Key fields | Relates to |
|---|---|---|
| `Goal` | `targetAmount`, `currentAmount`, `targetDate`, `status` (ahead / on-track / slightly-behind / at-risk), `monthlyContribution` | the spine — Transactions, Holdings, and Alerts reference it |
| `Transaction` | `merchant`, `amount`, `category`, `account`, `alignment` (aligned / neutral / out-of-sync) | belongs to a `ConnectedAccount`; rolls up to category trends → guidance |
| `Holding` | `ticker`, `value`, `allocation`, `assetClass` (equity / fixed-income / cash / alternative) | mapped to a `Goal`; drift measured vs. reference allocation |
| `ConnectedAccount` | `institution`, `type` (checking / savings / investment / credit / mortgage), `balance`, `lastSync` | source of Transactions and Holdings |
| `Alert` | `type` (nudge / celebration / warning / info), `body`, `goalId?`, `actionLabel?` | optionally tied to a `Goal` |
| `BudgetCategoryMeta` | `name`, `spent`, `trend`, `recommendedBudget` | aggregates Transactions per category |

## State architecture

- **`AppContext`** — all product data as static mock data (the prototype is not wired
  to the live API).
- **`OnboardingContext`** — wizard progress through the onboarding flow.
- **`ConfirmContext`** — global confirmation dialog.

The API contract (for future wiring) is the source-of-truth OpenAPI spec in
[`lib/api-spec/openapi.yaml`](../lib/api-spec/openapi.yaml); Zod schemas and TanStack
Query hooks are generated from it (do not edit generated files).
