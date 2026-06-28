# Research synthesis

> Prototype-stage synthesis. The personas and insights below are the working
> hypotheses encoded in the product; validate against moderated testing before treating
> them as findings (see [`../../docs/success-metrics.md`](../../docs/success-metrics.md)).

## Method
Synthesis of the product thesis and three target personas
([`../../docs/personas.md`](../../docs/personas.md)). Primary user research is a gap —
tracked in [`../../docs/open-questions.md`](../../docs/open-questions.md).

## Themes

1. **People want trajectory, not balances.** The unanswered question across PFM tools
   is "am I on track for the life I want?" — not "what's my balance?" → *Goals as the
   spine.*
2. **Shame causes avoidance.** Red overspent bars and streaks make anxious users stop
   looking. Compassionate, factual framing keeps them engaged. → *Compassion over shame.*
3. **Trust requires transparency.** Users distrust black-box scores and nudges. A score
   they can open and verify earns trust. → *Show the math.*
4. **Multi-account investors want orientation, not advice.** They want consolidation and
   drift awareness, not stock picks — and the legal line matters. → *Information, not
   advice.*

## Implications for design
- Make goals the navigational frame (ADR-001).
- Reserve red for system errors; use caution/amber for behavioral signals (ADR-005).
- Every computed number opens to its source math (explainability pattern).
- Persistent educational disclosure on all investing surfaces (ADR-003).
