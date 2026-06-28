# Usage guidelines

Do / don't for applying the Align system. These encode the founder principles and the
regulatory boundary — they are constraints, not suggestions.

## Color & status
- **Do** pair every status with an icon and a text label so meaning survives without color.
- **Do** use `status.caution` (`#B45309`) as the strongest behavioral risk signal.
- **Don't** use saturated red (`#B91C1C`) for spending or an at-risk goal — that's
  reserved for genuine system errors only.
- **Don't** introduce stoplight green/amber/red, gradients, or a second brand color.

## Tone & content
- **Do** state a fact and its consequence, then leave the choice to the user.
- **Don't** ship shame or deficit framing ("you overspent"), streaks, or leaderboards.
- **Do** make celebrations first-class — surface wins, not only warnings.

## Numbers
- **Do** make every computed number openable to its source math in one tap ("Why?").
- **Do** use tabular figures for all currency.
- **Don't** ship a projection, score, or guidance value without disclosed assumptions.

## Investing (regulatory)
- **Do** label allocations as *educational reference* with the persistent disclosure.
- **Don't** write copy that recommends buying or selling a specific security, or implies
  personalized advice. See [`../docs/constraints.md`](../docs/constraints.md).

## System hygiene
- **Do** reference semantic tokens; add a token at the right tier if one is missing.
- **Don't** hardcode hex/px in component code, or design only the happy path —
  empty / loading / error states are part of done.
