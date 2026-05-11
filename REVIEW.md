# Code Review — Fintech Platform (Align Mobile App)

**Reviewed:** 2026-05-10  
**Scope:** All TypeScript/TSX source files in `artifacts/mobile/` and `artifacts/api-server/`  
**Commits reviewed:** HEAD through `0d55214` (last 4 substantive commits)

---

## Summary

This is a React Native / Expo Router prototype app. The architecture is clean: a single `AppContext` holds mock state, screens are modular, and error boundaries are in place. The issues below are real bugs that will cause incorrect runtime behavior — not style preferences.

---

## Critical Issues

### CR-01: Hard crash when `alerts` array is empty on `AlertImpactScreen`

**File:** `artifacts/mobile/app/alert-impact.tsx:44`  
**Issue:** The screen uses `alerts.find(...) ?? alerts[0]` as a fallback. If `alerts` is empty (all alerts dismissed, or context resets), `alerts[0]` is `undefined`. Every line below that immediately dereferences `alert.type`, `alert.title`, `alert.body`, `alert.goalId` — all of which will throw `TypeError: Cannot read properties of undefined`.

```ts
// Line 44 — crashes if alerts is empty
const alert = alerts.find((a) => a.id === params.id) ?? alerts[0];
const cfg = ALERT_TYPE_CFG[alert.type]; // throws if alert is undefined
```

**Fix:** Guard before dereferencing:
```tsx
const alert = alerts.find((a) => a.id === params.id) ?? alerts[0];
if (!alert) {
  // router.back() in a useEffect, or render a fallback
  return null;
}
```

---

### CR-02: `GoalMapping` in `invest.tsx` uses hardcoded array indexes — crashes if goals array is shorter than expected

**File:** `artifacts/mobile/app/(tabs)/invest.tsx:84-87`  
**Issue:** `goals[1]`, `goals[0]`, `goals[2]` are accessed without bounds-checking. If a user deletes goals (which is supported via `deleteGoal`), or adds goals that shift positions, these accesses silently produce `undefined`. Then `m.goal.id`, `m.goal.emoji`, `m.goal.title` all throw immediately.

```ts
const mappings = [
  { goal: goals[1], account: "Vanguard Brokerage", pct: 80 },
  { goal: goals[0], account: "Marcus HISA", pct: 95 },
  { goal: goals[2], account: "Chase Checking", pct: 65 },
];
```

**Fix:** Look up goals by stable ID and guard:
```ts
const g0 = goals.find((g) => g.id === "g1");
const g1 = goals.find((g) => g.id === "g2");
const g2 = goals.find((g) => g.id === "g3");
const mappings = [g1, g0, g2]
  .filter((g): g is Goal => !!g)
  .map((g, i) => ({ goal: g, account: [...][i], pct: [...][i] }));
```

---

### CR-03: `TransactionDetailScreen` — `useState` called with potentially-undefined value, `useEffect` guard fires too late

**File:** `artifacts/mobile/app/transaction-detail.tsx:54-57`  
**Issue:** `tx` can be `undefined` when the component first renders (if the param doesn't match any transaction). `useState(tx?.category ?? "")` runs unconditionally on mount — that's fine for the default. But the `useEffect` on line 51 that calls `router.back()` runs *after* the first render. On that first render, line 58 (`if (!tx) return null`) is reached, which is safe — but `useState` at line 54 is called before that guard, meaning hook order is consistent. The real problem is the component briefly renders `null` after `useEffect` fires `router.back()`, causing a flash.

More critically, line 58 guards with `if (!tx) return null` after hooks. This is correct React hook ordering (hooks before early returns), but the `useEffect` that calls `router.back()` will not fire on the same render — there's a frame where `tx` is undefined but the component returned `null` already. The `router.back()` will fire next tick. This is a UI correctness issue (blank flash), not a crash, but notable.

**Fix:** Move the `if (!tx) return null` check *entirely* to after the `useEffect` (which it already is — hooks come first). The pattern is actually correct, but a loading state would prevent the blank flash:
```tsx
if (!tx) return <LoadingView />;  // instead of null
```

---

### CR-04: `BudgetEditorScreen` — `setTimeout` navigation leaks if component unmounts

**File:** `artifacts/mobile/app/budget-editor.tsx:127`  
**Issue:** `handleSave` calls `setTimeout(() => router.back(), 480)`. If the user dismisses the modal another way (swipe-to-dismiss, hardware back) before the 480ms expires, `router.back()` fires on an unmounted/inactive screen, potentially double-popping the navigation stack or causing a no-op error.

```ts
function handleSave() {
  // ...saves budgets...
  setSavedAt(Date.now());
  setTimeout(() => router.back(), 480); // leaks if component unmounts
}
```

**Fix:** Use a `useRef` to track mount state and cancel in cleanup, or use `useEffect` with a `savedAt` dependency:
```tsx
useEffect(() => {
  if (!savedAt) return;
  const timer = setTimeout(() => router.back(), 480);
  return () => clearTimeout(timer);
}, [savedAt]);
```

---

### CR-05: `HoldingDetailScreen` — division by hardcoded price produces wrong calculations for every holding except the first

**File:** `artifacts/mobile/app/holding-detail.tsx:41`  
**Issue:** Share count is calculated as `holding.value / 142.18` regardless of which holding is being viewed. `142.18` appears to be a hardcoded price (likely VTSAX's approximate NAV). For VBTLX (bond fund, ~$10/share), IVV (~$500/share), etc., the share count and all downstream calculations (cost basis, total return, per-share cost basis) will be wildly wrong. The "About this holding" card shows these numbers to the user as if they're real.

```ts
const shares = (holding.value / 142.18).toFixed(3); // wrong for every fund except VTSAX
const costBasis = holding.value - holding.change * 12; // also arbitrary
const totalReturn = holding.value - costBasis;
const totalReturnPct = (totalReturn / costBasis) * 100;
```

**Fix:** Either add a `price` field to the `Holding` type and mock data, or remove the per-share math from the display entirely and show only the values that are actually known (total value, change, allocation).

---

## High Severity

### H-01: `SpendingDetailScreen` — period selector is non-functional, always shows the same data

**File:** `artifacts/mobile/app/spending-detail.tsx:24-33`  
**Issue:** The "This month / Last month / Last 3 months" picker updates `period` state but the `categories` derivation on lines 26-29 never uses `period`. All three tabs show identical data. This is a correctness issue — a user switching to "Last month" expects different numbers.

```ts
const [period, setPeriod] = useState<typeof PERIODS[number]>("This month");
// ... period is never used in any data derivation below
const categories = budgetCategories.map((c) => ({
  ...c,
  budget: budgets[c.name] ?? c.recommendedBudget,
}));
```

**Fix:** Either filter/transform data based on `period`, or remove the non-functional picker to avoid misleading users.

---

### H-02: `SubscriptionsDetailScreen` — subscription totals in summary card are out-of-sync with computed total

**File:** `artifacts/mobile/app/(tabs)/money.tsx:178`  
**Issue:** `SubscriptionCard` on the Money screen hardcodes `"Total: $52.97/mo"`. The actual subscription data in `subscriptions-detail.tsx` totals `11.99 + 22.99 + 17.99 = 52.97` — coincidentally matching — but the `SubscriptionCard` list shows only 3 subs while `SubscriptionsDetailScreen` has 6 (adding Adobe, iCloud, NYTimes totaling ~$63). The two screens are independent local state islands with inconsistent data.

Additionally, `SubscriptionsDetailScreen` is the only screen that uses local state for subscriptions — cancelling a subscription there doesn't update any shared context, so the Money screen will continue showing old data after a cancel action.

**Fix:** Move subscription data into `AppContext` with a `cancelSubscription` action, consistent with how goals and alerts are managed.

---

### H-03: `AlertImpactScreen` — bitwise OR used as integer truncation, unreadable and fragile

**File:** `artifacts/mobile/app/alert-impact.tsx:71, 76`  
**Issue:** `shiftWeeks / 4 | 0` uses bitwise OR to floor a float. While technically valid JavaScript, this is precedence-fragile (the `|` has very low precedence) and will produce incorrect results if `shiftWeeks / 4` is ever negative (bitwise OR of a negative float truncates toward zero, not toward negative infinity).

```ts
{ label: "Today's pace", value: `${monthsLeft - shiftWeeks / 4 | 0} months to go` }
//  parsed as: monthsLeft - (shiftWeeks / 4 | 0) — works by accident of precedence
```

**Fix:** Use `Math.floor()`:
```ts
value: `${monthsLeft - Math.floor(shiftWeeks / 4)} months to go`
```

---

### H-04: `GoalEditorScreen` — `deriveStatus` divides by `target` without zero-guard

**File:** `artifacts/mobile/app/goal-editor.tsx:42-48`  
**Issue:** If a user clears the target amount field (which sets `targetAmount` to `0` via `handleAmountInput`), then saves, `deriveStatus(currentAmount, 0)` computes `current / 0 = Infinity`. `Infinity >= 0.95` is `true`, so the status becomes `"ahead"` — semantically wrong. `canSave` guards `targetAmount > 0`, but `handleSave` calls `deriveStatus` which can still receive 0 if called incorrectly.

```ts
function deriveStatus(current: number, target: number): GoalStatus {
  const pct = current / target; // NaN/Infinity if target is 0
```

**Fix:** Guard at the top of `deriveStatus`:
```ts
function deriveStatus(current: number, target: number): GoalStatus {
  if (!target) return "at-risk";
  const pct = current / target;
  // ...
}
```

---

### H-05: `profile.tsx` — `handleExport` and `handleUpgrade` ignore the `confirm()` result, making them no-ops

**File:** `artifacts/mobile/app/(tabs)/profile.tsx:188-204`  
**Issue:** Both `handleExport` and `handleUpgrade` `await confirm(...)` but discard the returned boolean. The user confirming "Request export" does nothing — no export is triggered, no feedback given. Same for "See plans". Since this is a prototype this may be intentional, but the code silently swallows the user's action with no feedback.

```ts
const handleExport = async () => {
  await confirm({ title: "Export your data?", ... }); // result discarded
  // no action taken after confirm
};
```

**Fix:** At minimum, show a toast or navigate somewhere after the user confirms, or remove the confirm if the action isn't implemented.

---

### H-06: `profile.tsx` — hardcoded email `sarah.chen@email.com` shown in export confirmation

**File:** `artifacts/mobile/app/(tabs)/profile.tsx:191`  
**Issue:** The export confirmation message hardcodes `sarah.chen@email.com`. The profile already has a `displayName` derived from context — the email should come from the same source. If this screen is ever shown to a real user, they'll see someone else's email.

```ts
message: "We'll email a download link to sarah.chen@email.com within 24 hours."
```

**Fix:** Pull email from context or a user profile field.

---

## Medium Severity

### M-01: `AppContext` — `AsyncStorage` is imported but never used

**File:** `artifacts/mobile/context/AppContext.tsx:2`  
**Issue:** `AsyncStorage` is imported at the top of `AppContext.tsx` but never referenced anywhere in the file. This is dead code that adds a dependency to the bundle and implies persistence that doesn't exist.

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
```

**Fix:** Remove the import. If persistence is planned, add it explicitly.

---

### M-02: `AppContext` — `Feather` icon component imported only for its type, not rendered

**File:** `artifacts/mobile/context/AppContext.tsx:1`  
**Issue:** `Feather` is imported from `@expo/vector-icons` solely to extract `React.ComponentProps<typeof Feather>["name"]` for the `BudgetCategoryMeta.icon` type. Importing the entire Feather component into the context module for a type-only use inflates the dependency graph.

**Fix:** Use `import type` and extract the Feather name type via a shared type utility, or define the icon type inline as `string` with a comment.

---

### M-03: `invest.tsx` — `AllocationBar` divides by `totalVal` without zero-guard

**File:** `artifacts/mobile/app/(tabs)/invest.tsx:34-39`  
**Issue:** If `holdings` is empty (possible if context is extended or holdings are filtered), `totalVal` is `0` and `val / totalVal` is `NaN`. The bar widths become `"NaN%"` which React Native treats as 0 but TypeScript will complain about the `as \`${number}%\`` cast.

```ts
const totalVal = holdings.reduce((sum, h) => sum + h.value, 0); // 0 if empty
// ...
return { cls, val, pct: (val / totalVal) * 100 }; // NaN if totalVal is 0
```

**Fix:**
```ts
const pct = totalVal > 0 ? (val / totalVal) * 100 : 0;
```

---

### M-04: `rebalance-plan.tsx` — `SubmittedView` uses `router.dismissAll?.()` optional chaining

**File:** `artifacts/mobile/app/rebalance-plan.tsx:477`  
**Issue:** `router.dismissAll?.()` uses optional chaining, suggesting the author is unsure whether this method exists. In Expo Router v3+, `dismissAll` exists. If it doesn't exist (older SDK), the modal stack won't be cleared and the user stays on the submitted screen with no way to dismiss — only `router.replace` fires, which may not clear the modal.

**Fix:** Verify SDK version and either remove the optional chaining (if guaranteed to exist) or add a fallback:
```ts
if (router.dismissAll) {
  router.dismissAll();
} else {
  router.back();
}
router.replace("/(tabs)/invest");
```

---

### M-05: `api-server/app.ts` — CORS is wide open (`cors()` with no options)

**File:** `artifacts/api-server/src/app.ts:28`  
**Issue:** `app.use(cors())` with no configuration allows any origin to call the API. For a fintech prototype this is low-risk (no real data), but if this server is ever connected to real account data, the open CORS policy becomes a high-severity security issue.

```ts
app.use(cors()); // allows * origins
```

**Fix:** Restrict to known origins:
```ts
app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:8081" }));
```

---

### M-06: `budget-editor.tsx` — `handleReset` resets draft but not `appliedSuggestions` correctly

**File:** `artifacts/mobile/app/budget-editor.tsx:113-119`  
**Issue:** `handleReset` does clear `appliedSuggestions` via `setAppliedSuggestions(new Set())`. However, it does not call `resetBudgets()` on the context — it only resets the local `draft` state. The context's `budgets` remain at their previous saved values. This means after a reset + save, the context correctly reflects the recommended values. But if the user resets and then closes without saving, the context state is unchanged (correct), while the reset displayed values could mislead the user about what's "saved". This is a minor UX consistency issue.

More importantly, `handleReset` constructs `fresh` by iterating `budgetCategories` — this is correct — but should also call `resetBudgets()` if the intent is to immediately persist the reset, not just reset the draft.

---

### M-07: `spending-detail.tsx` — division by zero when `c.budget` is 0

**File:** `artifacts/mobile/app/spending-detail.tsx:93`  
**Issue:** `catPct` divides `c.spent` by `c.budget`. A user can set a budget of $0 via the budget editor (`Math.max(0, ...)` allows 0). When budget is 0, `catPct = Infinity`, `Math.min(Infinity, 100) = 100`, and the bar renders at 100% — which looks wrong but doesn't crash. The "Below current spend" warning in the budget editor correctly triggers, but the spending detail will show a misleading full bar for a $0 budget category.

**Fix:**
```ts
const catPct = c.budget > 0 ? Math.min((c.spent / c.budget) * 100, 100) : 100;
```

---

## Low Severity

### L-01: `transaction-detail.tsx` — "Save changes" button does not persist category or goal-link changes

**File:** `artifacts/mobile/app/transaction-detail.tsx:165-192`  
**Issue:** The save button fires haptics and calls `router.back()`. The `category` and `linkedGoalId` state changes are local only — there's no call to any context function to persist the recategorization. The user taps "Save changes" and the UI implies the change was saved, but it's discarded.

---

### L-02: `holding-detail.tsx` — "Buy more" and "Sell" buttons have no `onPress` handlers

**File:** `artifacts/mobile/app/holding-detail.tsx:154-165`  
**Issue:** Both action buttons render without `onPress`. Tapping them does nothing. Given the disclaimer says "Trading actions route to your linked Vanguard brokerage," a user may expect these to work.

---

### L-03: `alerts.tsx` — `formatDate` shows negative diffs for future-dated alerts as "Yesterday" or a date

**File:** `artifacts/mobile/app/(tabs)/alerts.tsx:101-108`  
**Issue:** `diff` is computed as `Math.floor((now - d) / 86400000)`. If `dateStr` is in the future (possible if mock data dates are ahead of the current date), `diff` is negative. `diff === 0` is false, `diff === 1` is false, so the date falls through to `toLocaleDateString` which still shows correctly — but the intent of the guard is wrong for future dates.

The mock data includes dates like `"2026-05-08"` which, relative to today (`2026-05-10`), are 2 days ago — the function will correctly show the formatted date. No current crash, but worth noting for robustness.

---

### L-04: `budget-editor.tsx` — suggestions are hardcoded by category name string match

**File:** `artifacts/mobile/app/budget-editor.tsx:66-89`  
**Issue:** Suggestions find categories by `name === "Dining"` and `name === "Subscriptions"`. If category names in `BUDGET_CATEGORIES` change (they're defined in `AppContext`), the suggestions silently disappear with no error. Should reference by a stable ID or use a shared constant.

---

### L-05: Profile screen — `displayName.charAt(0)` can produce empty string for avatar

**File:** `artifacts/mobile/app/(tabs)/profile.tsx:224`  
**Issue:** `displayName.charAt(0).toUpperCase()` is safe if `displayName` is a non-empty string. `displayName = name || userName` where `userName` is `"Sarah"` (hardcoded in context). If both `name` and `userName` were ever empty strings, the avatar shows no letter. Low risk with current data.

---

_Reviewed 2026-05-10 · Manual review of all mobile TSX screens and API server_
