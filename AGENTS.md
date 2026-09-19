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
- The dataset lives in `data/` as **typed TS modules, not JSON** — Metro and Node
  disagree about JSON import syntax, and typed modules turn a malformed row into a
  compile error. `data/us/` is the national layer (states, systems, frameworks and
  the AP/CLEP exams, which are the same exam everywhere); `data/ca/`, `data/tx/`
  and `data/fl/` hold what is genuinely state-specific.

## Adding a state

One dataset covers the country. Scoping is a data invariant, not a filter:
`GeArea.applies_to` names *systems*, so a Texas campus reaches only Texas areas
even though every state's areas share one array. `engine.test.ts` asserts this
rather than trusting it — if you break it, a student gets priced against a
framework their campus has never heard of, on a screen that looks entirely
normal.

To add a state you write four files and touch three shared ones:

1. `data/<st>/core.ts` — the framework's areas, each with `framework_id` and
   `applies_to`. Give an area a `code` **only** if the state has advisor
   shorthand worth printing; "Cal-GETC 1A" is what a Californian catalogue
   says, while `tx-comm` is our key and printing a key at a student is worse
   than printing nothing.
2. `data/<st>/institutions.ts`, `courses.ts`, `acceptance-rules.ts`.
3. Add the framework to `data/us/frameworks.ts`, the system(s) to
   `data/us/systems.ts`, and the state's real entry to `MAPPED` in
   `data/us/states.ts` (it already has a row; every state does).
4. Register the modules in `src/dataset.ts`.

Never reuse an area id, credit-source id or institution id across states — a
test enforces it. Reuse the *exam* ids from `data/us/exams.ts`; an exam is
national and what differs is the acceptance rule, which is the whole point.

The trap worth naming: `effectiveCost` zeroes a community-college fee only
where `Jurisdiction.fee_waiver` is non-null. California has the College Promise
Grant; Texas and Florida have no statewide equivalent. Waiving a fee in a state
that has none under-prices every route there **in the student's favour**, which
is the direction a wrong number never gets caught.

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
