# Rule: Code style (Align)

- **Stack:** React Native 0.81 + Expo SDK 54, **Expo Router v6** (file-based routing),
  TypeScript 5.9, **NativeWind** (Tailwind for RN). Icons via Feather
  (`@expo/vector-icons`) — never hand-author SVG paths.
- **Package manager: pnpm only.** npm/yarn are blocked by the preinstall hook. Respect
  `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` (supply-chain defense — do not
  disable). Use workspace `catalog:` versions rather than repeating version strings.
- **Routing:** screens live in `artifacts/mobile/app/` — `(onboarding)/`, `(tabs)/`,
  and pushed detail screens at `app/*.tsx`. One screen per file.
- **State:** product data flows through `AppContext` (mock data today); wizard state
  through `OnboardingContext`; confirmations through `ConfirmContext`. Don't introduce a
  new global store without cause.
- **API layer is generated:** `lib/api-spec/openapi.yaml` is the source of truth; Zod
  schemas (`lib/api-zod`) and React Query hooks (`lib/api-client-react`) are generated
  via orval. **Do not edit generated files.**
- **Styling:** reference tokens (see `design-system.md` rule); no hardcoded hex/px.
  Co-locate component styles; props typed and documented; prefer composition over flags.
- **Typecheck before done:** `pnpm run typecheck` (workspace) or per package
  `cd artifacts/mobile && pnpm typecheck`. There are no tests.
