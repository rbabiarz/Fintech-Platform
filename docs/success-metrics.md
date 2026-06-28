# Success metrics

Aligned to the brief: a user can answer "am I on track, and why?" in a glance, and
returns without dread.

| Metric | Definition | Target | Source |
|---|---|---|---|
| Activation | % of new users who define ≥ 1 goal and link ≥ 1 account in onboarding | ≥ 70% | onboarding funnel |
| Glance comprehension | % who, in usability testing, correctly state their on-track status within 5s of opening Goals | ≥ 80% | moderated testing |
| Explainability engagement | % of guidance/score views where the user opens a "Why?" affordance | ≥ 30% | product analytics |
| Weekly return without dread | WAU/MAU paired with a 1-tap "how did this check-in feel?" sentiment that trends non-negative | rising; sentiment ≥ neutral | analytics + in-app pulse |
| Categorization accuracy | top-1 transaction categorization accuracy (with per-user adaptation) | ≥ 92% | model eval set |
| Celebration share | celebrations as a share of total alert volume | ≥ 25% | alert log |
| Notification restraint | push notifications per user per day | ≤ 1 (default) | notification service |

## Guardrail metrics (must not get worse)

- **Accessibility:** WCAG 2.2 AA contrast and keyboard/focus coverage hold at 100% of
  audited screens.
- **Source-traceability:** 100% of numeric outputs (scores, projections, guidance)
  resolve to their inputs in one tap. No black-box numbers ship.
- **Advice boundary:** 0 strings that recommend buying/selling a specific security
  (regulatory — see [`constraints.md`](./constraints.md)).
- **Tone:** 0 deficit/shame framings (no "you overspent", no red overspent bars).
