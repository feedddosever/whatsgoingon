# Getting this onto a Galaxy Tab S6 Lite

**The build cannot happen in this container** — no Android SDK, and the egress
proxy blocks Expo's build servers. Everything below runs on your machine. The
*config* was checked here: `npx expo config` resolves, the Android package is
`com.degreeroute.app`, and the layout was driven at both tablet geometries
(1000×600 and 600×1000) with no horizontal overflow.

---

## Before anything: Expo Go will not work

The app uses `react-native-purchases`, which is native code. **Expo Go cannot
load it.** You need a real build — which is what this page is for. Do not spend
an evening on the QR-code path; it will fail at the first import.

---

## The short path — EAS Build

Runs on Expo's servers. No Android SDK, no Java, no Android Studio.

```bash
npm install -g eas-cli
eas login                 # free Expo account
eas init                  # writes extra.eas.projectId into app.json — commit that
eas build --platform android --profile preview
```

`eas.json` is already set up: both `preview` and `production` use
`buildType: "apk"`. **Do not change that to `app-bundle`** — Google Play wants
an AAB, the Galaxy Store takes an APK, and the Galaxy Store is the path here
precisely because it has no equivalent of Play's 12-tester / 14-day closed-test
rule for new personal accounts.

The first build asks about a keystore. **Say yes and let EAS keep it.** Losing
it means you can never update the listing — you would have to republish under a
new package name.

Budget an hour on the free tier, not five minutes. Do not start this the night
before the deadline.

### Installing on the tablet

The build ends with a URL. Easiest route:

1. Open that URL **in the tablet's browser** and download the `.apk`.
2. Android will ask to allow installs from that browser. Allow it.
3. Tap the downloaded file.

Or over USB, with developer options and USB debugging on:

```bash
adb install -r ~/Downloads/degree-route.apk
```

---

## Three things that will bite

### 1 · Your env vars do not travel

`.env` is gitignored, and EAS builds from a clean checkout on a remote machine.
**Anything you have locally is simply absent in the build.** The app will run —
nothing crashes — but the paywall will report purchases unavailable, the
waitlist button will not render, and the packet will print the default URL.

Set them on the build, not in a file:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_KEY   --value "…"
eas secret:create --scope project --name EXPO_PUBLIC_SUPPORT_EMAIL    --value "…"
eas secret:create --scope project --name EXPO_PUBLIC_APP_URL          --value "https://…"
```

Metro inlines `EXPO_PUBLIC_*` at transform time, so a secret added after a build
needs a **new** build — it is not a runtime setting.

### 2 · Your RevenueCat key is the wrong kind

The key you have (`test_…`) is a **Web Billing** key. It drives
`@revenuecat/purchases-js` on the web build and **will not work on Android.**

An Android build needs a key from a native app in the RevenueCat dashboard —
Google Play, or Amazon/Samsung if you are targeting the Galaxy Store. Those are
different keys for different stores, and the Galaxy Store one is not the Play
one.

Without it the app still runs end to end and the paywall says so honestly. With
the wrong one, it fails at purchase time instead, which is worse. If the
dashboard has no Android app yet, create one before you build.

### 3 · In-app purchases only work through the store

A sideloaded APK cannot complete a real purchase — the billing client needs the
app to be installed from the store it was signed for. To test the paywall and
Customer Center properly you need the build uploaded to Galaxy Store's internal
testing track and installed from there.

This matters for the demo video: a sandbox purchase on camera is the single most
valuable five seconds you can show a RevenueCat judge, and a sideloaded build
cannot produce one.

---

## The long path — local build

Only if EAS is queued badly. Needs **JDK 17** and the Android SDK.

```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
# android/app/build/outputs/apk/release/app-release.apk
```

`prebuild` generates the `android/` directory from `app.json`. It is not
committed here and should not be — regenerate it rather than editing it, or the
next `prebuild --clean` silently discards your changes.

---

## Two permanent decisions

**Package name** `com.degreeroute.app`. It cannot be changed after first
publish, on any store.

**Keystore.** Whoever holds it owns future updates. Let EAS keep it.

---

## Before you build

```bash
npm run preflight   # what is missing for a submission
npm test
npm run typecheck
```

`preflight` will tell you if the support address is still unset. It fills the
app, `/privacy`, `/terms` and the store listing from one variable, and every
store requires a monitored address on the privacy policy.

## What changed for the tablet

`orientation` was `"portrait"`, which would have locked a tablet — usually held
in landscape, often in a keyboard cover — to one rotation. It is now
`"default"`. The layout was already built for both: driven at 1000×600 and
600×1000, same figures, no horizontal overflow.
