# /audit-tokens

Scan `src/components/` for hardcoded visual values (hex colors, px spacing, raw
font sizes) that should reference tokens. Report each with the suggested token
from `tokens/semantic.json`, and flag any missing tokens to add.
