/**
 * Prepares the prebuilt android/ project for a DEBUG APK that behaves like a
 * release one. Run after `expo prebuild`, before `./gradlew assembleDebug`.
 *
 * Why a debug build at all: the APK is configured with a RevenueCat Test Store
 * key (`test_…`), which simulates purchases. The RevenueCat Android SDK only
 * accepts a Test Store key in a debuggable build — in a release build it shows
 * an error and closes the app, so a test key can never ship to a store by
 * mistake. A debug build is the setup RevenueCat intends for Test Store.
 *
 * Why the patches: a React Native debug build normally expects a developer's
 * Metro server and embeds no JavaScript. Two changes make it self-contained:
 *
 *   1. `debuggableVariants = []` — the React Native Gradle plugin then bundles
 *      the JavaScript into the debug APK exactly as for release (dev mode off,
 *      Hermes bytecode).
 *   2. `useDevSupport = false` — the app never looks for Metro and shows no
 *      developer menu, red-box or LogBox overlays.
 *
 * Usage: node scripts/debug-apk.mjs [androidDir]
 */
import fs from 'node:fs';
import path from 'node:path';

const ANDROID = process.argv[2] ?? 'android';

function patch(file, from, to, label) {
  const src = fs.readFileSync(file, 'utf8');
  if (src.includes(to)) { console.log(`debug-apk: ${label} — already done`); return; }
  const hits = src.split(from).length - 1;
  if (hits !== 1) {
    // The Expo template changed. Fail the build: an APK without these patches
    // opens to a "cannot connect to Metro" screen on a student's phone.
    console.error(`debug-apk: ${label} — expected 1 match in ${file}, found ${hits}`);
    process.exit(1);
  }
  fs.writeFileSync(file, src.replace(from, to));
  console.log(`debug-apk: ${label}`);
}

patch(
  path.join(ANDROID, 'app', 'build.gradle'),
  '    // debuggableVariants = ["liteDebug", "prodDebug"]',
  '    debuggableVariants = [] // scripts/debug-apk.mjs: embed the JS in debug too',
  'JavaScript bundled into the debug APK',
);

const main = fs.readdirSync(path.join(ANDROID, 'app', 'src', 'main', 'java'), { recursive: true })
  .map(String).find(p => p.endsWith('MainApplication.kt'));
if (main === undefined) { console.error('debug-apk: MainApplication.kt not found'); process.exit(1); }
patch(
  path.join(ANDROID, 'app', 'src', 'main', 'java', main),
  '      context = applicationContext,\n',
  '      context = applicationContext,\n      useDevSupport = false, // scripts/debug-apk.mjs: no Metro, no dev menu\n',
  'developer tools off',
);
