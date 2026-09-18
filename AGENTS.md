# Working in this repo

## Expo has changed — and you cannot look it up

This project is on **Expo SDK 57 / React Native 0.86 / React 19.2**, which is at or
past most training cutoffs. The usual advice is to read the versioned docs at
docs.expo.dev — **that domain is blocked by this environment's egress proxy**, along
with every other external site.

So: **read the installed type definitions in `node_modules/` instead.** They are
authoritative and they are local. Do not recall an API from memory when
`node_modules/<pkg>/**/*.d.ts` can tell you the truth.

## Conventions

- Relative imports carry their extension (`.ts` / `.tsx`) — `allowImportingTsExtensions`
  is on and the whole codebase relies on it. A missing extension is a compile error.
  **One deliberate exception:** `src/purchases/revenuecat` is imported WITHOUT an
  extension. Metro only applies platform resolution (`.web.ts` over `.ts`) to
  extensionless imports — with `./revenuecat.ts` it bundles the native file into
  the web build, where `react-native-purchases` does not exist. This was verified
  by grepping the built bundle, not assumed. Do not "fix" that import.
- TypeScript is strict. No `any`.
- Screens are presentational: they take props and callbacks. `App.tsx` owns all state
  and is the only caller of the engine.
- The dataset lives in `data/ca/` as **typed TS modules, not JSON** — Metro and Node
  disagree about JSON import syntax, and typed modules turn a malformed row into a
  compile error.

## The one rule that matters

Every factual claim shown to a student carries its `Provenance`: a source URL, an
`as_of` date, and a `confidence` level. Data that is `unverified` must *look*
unverified in the UI.

This is not a style preference. A student who acts on a wrong transfer-credit claim
loses real money and a real semester. See `data/VERIFICATION.md`.

## EXPO_PUBLIC_ vars and the Metro cache

`npm run build:web` passes `--clear` on purpose. Metro caches transformed
modules, and `process.env.EXPO_PUBLIC_*` is inlined at transform time — so
changing a key and rebuilding without clearing bakes the STALE value into the
bundle, silently. That was observed here: the key read as an empty string
through several rebuilds until the cache was cleared.

## Checks

    npm test        # engine + validation tests
    npm run typecheck
    npm run demo    # prints the CLEP-at-UC scenario

For anything touching a screen, build and drive it — typecheck passing is not
the same as working, and most of the real bugs in this project were found this
way rather than by the compiler:

    npm run build:web
    npm run serve:web          # then drive http://127.0.0.1:8080

`scripts/e2e.mjs` has the helpers (`openApp`, `rootCost`, `tapExact`,
`tapButton`). It uses **playwright-core**, not playwright: playwright's
postinstall downloads a browser on every install, which is a slow or failing
step on a deploy host. Point `E2E_CHROME` at a browser if the default path is
wrong.

Ignore `ERR_TUNNEL_CONNECTION_FAILED` console errors in this environment — that
is RevenueCat's API being blocked by the egress proxy, not the app.
