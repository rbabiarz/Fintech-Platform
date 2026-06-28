# Product requirements — Align

> Goals-driven PFM mobile app. This PRD reflects the current prototype
> (`artifacts/mobile`), which runs on mock data via `AppContext`. Priorities use
> P0 (must-have for v1) / P1 / P2.

## Goals & non-goals

**Goals**
- Reframe money management around life goals, not account balances.
- Make every number source-traceable in one tap ("Show the math").
- Keep guidance compassionate and low-noise (≤ 1 push / 24h by default).

**Non-goals (v1)** — see [`brief.md`](./brief.md): no trade execution, no personalized
advice, no auto-cancel, no streaks/leaderboards.

## User stories

- As an aspiring homeowner, I want to see whether my plan reaches my goal on time, so
  I can stop second-guessing whether I'm doing enough.
- As an intentional spender, I want to see what a spending trend does to my goal
  timeline, so I can adjust without being shamed.
- As a hands-off investor, I want my accounts mapped to goals with drift flagged, so I
  can stay diversified without becoming an expert.

## Functional requirements

| # | Requirement | Surface | Priority |
|---|---|---|---|
| 1 | Goal cards with progress, projected completion, status pill (Ahead / On Track / Slightly Behind / At Risk) | Goals tab | P0 |
| 2 | Composite **Goal Alignment Score** (0–100) with breakdown | Goals tab | P0 |
| 3 | One **Next Action** card with inline "Why?" reasoning | Goals tab | P0 |
| 4 | Unified transaction feed across linked accounts | Money tab | P0 |
| 5 | Per-transaction **alignment indicator** (aligned / neutral / out-of-sync), user-configurable | Money tab | P0 |
| 6 | **Predictive Guidance** card translating a category trend into goal-timeline impact | Money tab | P0 |
| 7 | Consolidated portfolio across 401(k)/IRA/Roth/taxable/ESPP/529, each mapped to a goal | Invest tab | P0 |
| 8 | **Allocation drift** flagged vs. *educational reference* allocation, with persistent disclosure | Invest tab | P0 |
| 9 | Milestone projection under conservative / expected / optimistic assumptions | Invest tab | P1 |
| 10 | Proactive alerts across 6 categories incl. **celebrations** (≥ 25% of volume); ≤ 1 push/24h | Alerts tab | P0 |
| 11 | "Why am I seeing this?" explanation on every alert | Alerts tab | P0 |
| 12 | Profile: privacy controls, connected institutions, data export | Profile tab | P1 |
| 13 | Onboarding: welcome → signup → goal → risk → link (Plaid) → ready, ending on a live dashboard with explainability drawer open | Onboarding | P0 |

## Constraints

Regulatory, platform, and technical constraints in [`constraints.md`](./constraints.md).

## Open questions

Tracked in [`open-questions.md`](./open-questions.md).
