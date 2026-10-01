# Degree Route

Which college credit will your campus actually take? Degree Route takes a
state, a campus and the credit a student already holds, prices the
general-education requirements they still owe at that campus's own rate, and
shows the cheapest, fastest and lowest-risk ways to clear them. Every claim
carries a source link, the date it was read and a confidence level; anything
not yet confirmed is marked with a "?".

Built with Expo SDK 57 / React Native 0.86 / TypeScript for RevenueCat
Shipaton 2026.

- **Web app:** https://whatsgoingon-hazel.vercel.app (landing page at `/start`)
- **Privacy / Terms:** `/privacy` and `/terms` on the same host

## Run it

    npm install
    npm test            # engine and validation tests
    npm run typecheck
    npm run demo        # prints the CLEP-at-UC scenario
    npm run build:web && npm run serve:web   # then open http://127.0.0.1:8080

Keys and store setup: [`SETUP.md`](SETUP.md). Conventions for working in the
code: [`AGENTS.md`](AGENTS.md).

## The Android APK is a debug build — on purpose

The APK that `.github/workflows/android-apk.yml` builds for Degree Route is a
**debug** build, and its purchases are **simulated**. That is deliberate:

- It is configured with a RevenueCat **Test Store** key (`test_…`). The Test
  Store fakes the purchase flow against the products and offering in the
  RevenueCat dashboard (`lifetime`, `monthly`, entitlement `collegemaps_pro`),
  so the paywall, the unlock, restore and Customer Center can all be tried on a
  phone. **No money moves.**
- The RevenueCat Android SDK only accepts a Test Store key in a **debuggable**
  build. In a release build it shows an error and closes the app — a guard so a
  test key can never reach a store by accident. A debug build is the setup
  RevenueCat intends for Test Store; we do not switch the guard off.
- A React Native debug build normally waits for a developer's Metro server.
  `scripts/debug-apk.mjs` makes this one self-contained: the JavaScript is
  bundled in exactly as for release, and the developer menu and overlays are
  off. To a user it behaves like the release app.

**Not for a store upload.** For the Galaxy Store or Google Play, put that
store's own key (`galx_…` / `goog_…`) in the `EXPO_PUBLIC_REVENUECAT_KEY` secret:
the same workflow then builds a normal release APK. Details in
[`docs/BUILD-APK.md`](docs/BUILD-APK.md).

## Where things are

| Path | What's in it |
|---|---|
| `App.tsx`, `src/` | The app: screens, the planning engine (`src/engine.ts`), purchases |
| `data/` | The dataset, as typed modules — `data/us/` national, `data/ca`, `tx`, `fl`, `ny`, `pa` per state |
| `data/research/` | Research of record, verification reports and the corrections ledger |
| `data/GAPS.md` | What the dataset does not know, per state (generated: `npm run gaps:write`) |
| `docs/DEVPOST.md`, `docs/HACKATHON.md` | Shipaton submission copy and plan |
| `docs/BUILD-APK.md` | Building the Android APK |
| `docs/store/` | Icon, screenshots, marketing images, thumbnail |
| `hackathons/06-…`, `07-…` | The original idea assessment and product spec |
| `scripts/` | Landing-page build, audit, gap report, preflight, screenshots, APK patch |

## Licence

MIT — see [`LICENSE`](LICENSE).
