# Design decisions (ADR log) — Align

Append-only record of meaningful choices. Newest at top. Each entry names the
alternative we rejected so reviewers debate the decision, not the artifact.

## ADR-005 — Coral/amber as the strongest risk signal; red reserved for system errors
- **Date:** 2026-06-28
- **Status:** Accepted
- **Context:** Behavioral states (overspending, drift, at-risk goal) traditionally use
  stoplight red, which reads as failure and triggers avoidance.
- **Decision:** `caution-600` (`#B45309`) is the strongest behavioral risk signal.
  `error-600` (`#B91C1C`) is reserved for genuine system errors (failed sync, broken
  link) only.
- **Alternative rejected:** Conventional red/amber/green stoplight — clearer at a
  glance but violates "compassion over shame" and over-alarms.
- **Consequences:** Status must also carry an icon + label so severity reads without
  relying on a single muted hue.

## ADR-004 — Alignment indicator is a triad with icon + label, not color alone
- **Date:** 2026-06-28
- **Status:** Accepted
- **Context:** Per-transaction "alignment" (aligned / neutral / out-of-sync) is a core
  novel concept and must be legible to colorblind users.
- **Decision:** Each state pairs a color with a Feather icon and a text label
  (`check-circle` / `minus-circle` / `alert-circle`). Encoded in
  [`tokens/semantic.json`](../tokens/semantic.json).
- **Alternative rejected:** Color-coded dot only — compact but fails accessibility and
  is ambiguous.
- **Consequences:** Slightly more horizontal space per transaction row.

## ADR-003 — Investing is read-only with a persistent educational disclosure
- **Date:** 2026-06-28
- **Status:** Accepted
- **Context:** Allocation guidance risks crossing into personalized advice (SEC IAA).
- **Decision:** No trade execution; drift is flagged vs. an *educational reference*
  allocation; every investing surface carries *"Educational reference, not personalized
  investment advice."*
- **Alternative rejected:** Actionable rebalancing with one-tap trades — higher utility
  but requires RIA registration; out of scope for MVP. See [`constraints.md`](./constraints.md).
- **Consequences:** Invest tab informs and projects; it never instructs.

## ADR-002 — One "Next Action" card, not a list of recommendations
- **Date:** 2026-06-28
- **Status:** Accepted
- **Context:** Multiple simultaneous recommendations create decision paralysis and noise.
- **Decision:** Surface a single highest-impact Next Action on the Goals dashboard, with
  inline "Why?" reasoning.
- **Alternative rejected:** A ranked recommendation feed — more thorough but noisier and
  conflicts with the low-noise principle.
- **Consequences:** Requires a reliable impact-ranking heuristic behind the scenes.

## ADR-001 — Goals are the navigational spine, not accounts
- **Date:** 2026-06-28
- **Status:** Accepted
- **Context:** Account-centric PFM tools fail to answer "what does this mean for my life?"
- **Decision:** The primary tab is Goals; Money, Invest, and Alerts all render state
  relative to goals.
- **Alternative rejected:** Accounts-first navigation (industry default) — familiar but
  reinforces the retrospective, balance-centric framing Align exists to replace.
- **Consequences:** Every object model and screen must carry a goal relationship.
