# Foundations

The visual primitives, all driven by tokens
([`design-tokens.json`](../design-tokens.json) / [`tokens/`](../tokens/)). The runtime
source of truth for the mobile app is
[`artifacts/mobile/constants/colors.ts`](../artifacts/mobile/constants/colors.ts).

## Color

Reference semantic roles, never raw palette values.

| Role | Token | Hex |
|---|---|---|
| Page surface | `bg.page` | `#FAF7F2` |
| Card surface | `bg.card` | `#FFFFFF` |
| Muted surface | `bg.muted` | `#F0EDEA` |
| Heading | `fg.heading` | `#0F2A4A` |
| Body | `fg.default` | `#334155` |
| Secondary text | `fg.muted` | `#64748B` |
| Brand / primary | `brand.default` | `#2C7A7B` |
| Brand tint | `brand.tint` | `#B2DFDB` |
| Positive / aligned | `status.positive` | `#15803D` |
| Caution / drift (strongest behavioral risk) | `status.caution` | `#B45309` |
| Error (system only) | `status.error` | `#B91C1C` |
| Hairline / border | `border.default` | `#E8E4DE` |

**Rules:** one dominant brand moment per viewport; status meaning always pairs an icon
+ label with hue; never saturated red for a behavioral state.

## Typography

Inter (humanist sans), tabular figures for all currency.

| Token | Size | Use |
|---|---|---|
| `type.size.display` | 34px | Hero numbers (alignment score, net worth) |
| `type.size.2xl` | 28px | Screen titles |
| `type.size.xl` | 22px | Section headers, goal titles |
| `type.size.lg` | 18px | Card titles |
| `type.size.base` | 16px | Body |
| `type.size.sm` | 14px | Secondary / metadata |
| `type.size.xs` | 12px | Labels, captions, disclosures |

Weights: 400 regular · 500 medium · 600 semibold · 700 bold. Currency values:
`font-variant-numeric: tabular-nums`.

## Spacing & layout

4px base scale: `space.1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=20 · `6`=24 · `8`=32 ·
`12`=48. Cards use `space.4` internal padding; screen gutters `space.5`.

## Radius

`radius.sm`=8 · `radius.md`=12 (default — cards, inputs; matches `colors.ts` radius:12)
· `radius.lg`=20 · `radius.pill`=9999 (all primary CTAs are pill-shaped).

## Elevation

`shadow.card` for resting cards; `shadow.raised` for sheets, popovers, and the
explainability drawer. Elevation is subtle and navy-tinted, never a hard drop shadow.

## Motion

`motion.duration.fast` 200ms · `base` 240ms · `slow` 280ms, `easing.standard`
`cubic-bezier(0.2, 0, 0, 1)`. Animate to explain a state change or direct attention
only. Respect `prefers-reduced-motion`.
