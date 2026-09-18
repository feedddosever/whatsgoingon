# Building an APK for the Samsung Galaxy Store

**None of the commands below were run in this environment.** The container has no
Android SDK and its egress proxy blocks Expo's build servers, so this is written
from the toolchain's documented behaviour, not from a build I watched succeed.
Expect to hit at least one thing that needs a small adjustment.

`eas.json` in the repo root is real and ready — that part is done.

---

## Why APK and not AAB

Google Play requires an **AAB**. The **Galaxy Store takes an APK**, and that
difference is the whole reason this path exists: Galaxy Store has no equivalent
of Google Play's 12-tester / 14-day closed-testing rule for new personal
developer accounts, which is what makes a late release feasible at all.

Both the `preview` and `production` profiles in `eas.json` are set to
`buildType: "apk"` for exactly this reason. **Do not "fix" that to `app-bundle`.**

---

## The short path (EAS Build — recommended)

Runs on Expo's servers. You need no Android SDK, no Java, no Android Studio.

```bash
npm install -g eas-cli
eas login                      # create a free Expo account if you have none
eas init                       # writes extra.eas.projectId into app.json
eas build --platform android --profile preview
```

The first build asks whether to generate a new Android keystore. **Say yes, and
let EAS keep it.** Losing the keystore means you can never update the listing —
you would have to publish a new app under a new package name. EAS storing it is
the safer default for a solo builder.

The build queues, runs remotely, and ends with a download URL for the `.apk`.
On the free tier expect to wait — budget an hour, not five minutes, and do not
start this the night before the deadline.

To install straight onto the Tab S6 Lite for testing:

```bash
eas build --platform android --profile preview
# then open the build URL on the tablet and install, or:
adb install path/to/your.apk
```

## The long path (local build, no Expo servers)

Only worth it if EAS is queued badly or you want full control. Needs **JDK 17**
and the **Android SDK** installed.

```bash
npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
# output: android/app/build/outputs/apk/release/app-release.apk
```

`expo prebuild` generates the native `android/` directory. It is currently
gitignored on purpose — the project is managed-workflow, and checking in
generated native code means every future Expo upgrade becomes a merge conflict.
If you run prebuild, treat `android/` as build output, not source.

A locally built release APK still needs signing with your own keystore before the
Galaxy Store will accept it.

---

## Galaxy Store submission

1. Register as a seller at **seller.samsungapps.com** (free; business verification
   can take a few days — start this first, it is the slowest step and it is pure
   waiting).
2. Create a new application, upload the APK.
3. Fill in the listing: title, description, screenshots, category, age rating.
   Screenshots at phone **and** tablet sizes — you own a Tab S6 Lite, so take the
   tablet ones there rather than faking them.
4. Submit for review. **Review is measured in days, not hours.**

### Two things that are permanent

- **`android.package` is `com.degreeroute.app`.** Once the listing is live this
  can never change. If you want a different id, change it in `app.json` *before*
  the first upload.
- **The keystore.** See above. Back it up if you manage it yourself.

### Testing in-app purchases

Galaxy Store IAP test purchases require a **physical Galaxy device signed in with
a Samsung account**. No emulator. Your Tab S6 Lite qualifies.

This only matters once purchasing is restored — see `docs/HACKATHON.md`, because
it is not optional for the hackathon.

---

## Before you build

```bash
npm test          # 33 engine tests
npm run typecheck
```

Both should be clean. A red test here becomes a wasted 40-minute build queue.

Bump `expo.version` in `app.json` for each store upload. The Galaxy Store rejects
a re-upload of a version it has already seen.
