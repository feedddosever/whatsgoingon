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

### 1. RevenueCat key — required for the paywall only

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_REVENUECAT_KEY`.

It is the **public** SDK key (safe in the bundle) and it is **per store** — a
Galaxy Store build needs the Amazon/Samsung key, not the Google Play one.

In the RevenueCat dashboard, create an entitlement with the identifier
**`advisor_packet`** exactly. If it is named anything else the purchase will
complete, the student will be charged, and the unlock will not appear — the code
detects this case and says so rather than failing silently, but it is a
configuration error worth avoiding.

Without a key the app skips store setup entirely and the paywall reports that
purchases are unavailable. Nothing crashes.

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
