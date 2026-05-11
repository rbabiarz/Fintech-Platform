# Align — Fintech Platform Case Study

A personal finance mobile app prototype built with React Native / Expo Router and a TypeScript monorepo. The product covers onboarding, goal-based investing, spending/budget management, portfolio rebalancing, and alerts.

## Monorepo Structure

```
artifacts/
  mobile/           # Expo Router React Native app (main product)
  api-server/       # Express 5 REST API
  api-client-react/ # React API client hooks
  api-zod/          # Shared Zod validation schemas
  api-spec/         # API type contracts
  db/               # Drizzle ORM database layer
  mockup-sandbox/   # Vite + shadcn/ui component preview tool
lib/                # Shared internal libraries
scripts/            # Workspace tooling
```

## App Screens

**Onboarding** — welcome → signup → goal setup → risk profile → account linking → ready

**Tabs**
| Tab | Description |
|-----|-------------|
| Home | Dashboard with net worth, account summary |
| Invest | Portfolio holdings, allocation bar, goal mapping |
| Money | Spending overview, budgets, subscriptions |
| Alerts | Actionable financial alerts with impact analysis |
| Profile | User settings, preferences, data export |

**Detail screens** — account detail, holding detail, transaction detail, budget editor, goal editor, rebalance plan, spending detail, subscriptions detail, alert impact

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native, Expo SDK, Expo Router v3 |
| Language | TypeScript 5.9 |
| Styling | NativeWind / Tailwind |
| State | React Context (`AppContext`) with mock data |
| API | Express 5, Pino logger |
| Validation | Zod |
| ORM | Drizzle |
| Package manager | pnpm workspaces |
| Mockup tool | Vite, React, shadcn/ui, Radix UI, Recharts |

## Getting Started

```bash
pnpm install

# Run the mobile app
cd artifacts/mobile
pnpm dev          # Expo dev server (iOS/Android/Web)

# Run the API server
cd artifacts/api-server
pnpm dev

# Run the mockup sandbox
cd artifacts/mockup-sandbox
pnpm dev
```

## Code Review

[REVIEW.md](REVIEW.md) contains a full manual review of the mobile app and API server, covering 5 critical issues, 6 high-severity findings, and 7 medium/low findings with recommended fixes.
