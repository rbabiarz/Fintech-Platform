# Rule: Design system (Align)

- **Never hardcode visual values.** Reference a semantic token from
  [`design-tokens.json`](../../design-tokens.json) / [`tokens/semantic.json`](../../tokens/semantic.json).
  If a token is missing, add it at the right tier (primitive → semantic) rather than
  inlining a raw value. The mobile runtime mirror is
  [`artifacts/mobile/constants/colors.ts`](../../artifacts/mobile/constants/colors.ts) —
  keep tokens and that file in sync.
- **Palette discipline:** warm sand surface (`#FAF7F2`), teal brand (`#2C7A7B`), navy
  headlines (`#0F2A4A`). One dominant brand moment per viewport. No second brand color,
  no gradients.
- **Status color is constrained:** `status.caution` (`#B45309`) is the strongest
  behavioral risk signal; `status.error` (`#B91C1C`) is for genuine system errors only
  (failed sync, broken link). Never stoplight red/amber/green for spending or goals.
- **Meaning never rides on hue alone** — pair status with an icon + text label.
- **Radius/type:** default radius 12 (`radius.md`); all CTAs pill-shaped. Inter font;
  tabular figures for all currency.
- **Reuse before creating:** check the inventory in
  [`design-system/components.md`](../../design-system/components.md) first. New components
  follow its variant/state model and design every state (default/loading/empty/error).
