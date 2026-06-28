# Rule: Accessibility (Align)

Target WCAG 2.2 AA across iOS, Android, and web.

- **Contrast** ≥ 4.5:1 for text (≥ 3:1 for large text and UI/graphical elements).
  Verify teal-on-sand and caution-on-card combinations specifically.
- **Meaning never by color alone.** Alignment (aligned / neutral / out-of-sync), goal
  status, and gain/loss must carry an icon and/or text label in addition to hue.
- **Hit targets** ≥ 44×44px; every interactive element is reachable and has a visible
  focus/pressed state.
- **Reduce motion:** honor `prefers-reduced-motion` — render the end state with no
  transition (motion budget is 200–280ms otherwise).
- **Currency** uses tabular figures so values are scannable and don't shift on update.
- **Labels:** all inputs labeled; icons that carry meaning have accessible labels;
  charts have a text/data equivalent.
- **Explainability is accessible:** the "Why?" affordance and its drawer are keyboard/
  screen-reader reachable — the source math must be available to everyone.
