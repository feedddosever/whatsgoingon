# Setup

## What runs today, with no configuration

    npm install
    npm test          # 28 engine tests
    npm run typecheck
    npm run demo      # prints the CLEP-at-UC scenario to the terminal

To see the real UI in a browser:

    npx expo export --platform web --output-dir /tmp/web
    cd /tmp/web && python3 -m http.server 8099

The whole flow works without a store: pick a campus, pick held credit, compare
routes, open the detail screen. Only the purchase itself needs configuration.

## What needs you

### 1. RevenueCat keys — TWO of them, for two different SDKs

Copy `.env.example` to `.env`. There are two keys because there are two SDKs:

| Platform | Package | Env var | Sells through |
|---|---|---|---|
| Web (Vercel) | `@revenuecat/purchases-js` | `EXPO_PUBLIC_REVENUECAT_WEB_KEY` | RevenueCat Web Billing |
| Android / Galaxy | `react-native-purchases` | `EXPO_PUBLIC_REVENUECAT_KEY` | the store's own IAP |

Metro picks the implementation: `src/purchases/revenuecat.web.ts` on web,
`revenuecat.ts` on a device. `App.tsx` never learns which one it got.

**The web key does not give you Galaxy Store purchases.** For the store build you
need the **Amazon/Samsung** key — not the Google Play one, and not the web one.

A `test_…` web key is **sandbox**: nothing is really charged.

Dashboard must define an entitlement with the identifier **`collegemaps_pro`**
exactly, plus the `lifetime` and `monthly` products. A mismatched entitlement id
is the worst configuration bug available here: the purchase completes, the
student is charged, and nothing unlocks. The native wrapper detects that exact
case and says so rather than failing silently.

Without keys the app runs end to end; the paywall just reports that purchases
are unavailable. Nothing crashes.

**Changing a key? The build script passes `--clear` for a reason** — see
AGENTS.md. Metro inlines `EXPO_PUBLIC_*` at transform time and caches the result,
so a cached build will happily ship the old key.

### 2. Galaxy Store publishing

Shipaton's supported stores are App Store, Google Play and **Samsung Galaxy
Store**. Galaxy Store has no equivalent of Google Play's 12-tester / 14-day
closed-testing rule, which is what makes a late release feasible.

- `app.json` sets `android.package` to **`com.degreeroute.app`**. **Change this
  before you publish if you want a different id — it is permanent once listed.**
- Galaxy Store test purchases require a **physical Galaxy device** signed in with
  a Samsung account. No emulator. Your Tab S6 Lite works.
- Submit with a few days of margin; review is measured in days.

### 3. Decisions I made that are yours to overrule

| Thing | Current | Note |
|---|---|---|
| App name | **Degree Route** | Store-facing, easy to change now |
| Bundle id | `com.degreeroute.app` | **Permanent once published** |
| Navigation | None — plain state machine | Four linear screens; no router config to get wrong |
| Theme | Dark only | |

## The one thing still blocking a truthful headline number

`data/VERIFICATION.md` lists every unconfirmed row. The consequential ones:

1. **Per-exam Cal-GETC mappings.** That AP counts toward Cal-GETC is confirmed.
   *Which area each specific exam clears* is inferred, not read off the standard.
   Until those are confirmed the **lowest-risk route is empty by design** — it
   only draws on confirmed rows, and it says so rather than guessing.
2. **Residency minimums and the 70-unit transfer cap.** Labelled
   "needs confirming" with no source link, because linking the exam-policy page
   would send a student somewhere that cannot answer them.
3. **Per-unit tuition.** Derived from published annual figures. Neither UC nor
   CSU charges per unit, so it is an estimate and the UI calls it one.

Confirming (1) is the highest-value hour of work available: it turns the
lowest-risk route from empty into the app's most trustworthy screen.
