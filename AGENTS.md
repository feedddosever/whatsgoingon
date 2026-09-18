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

## Checks

    npm test        # engine tests
    npm run typecheck
    npm run demo    # prints the CLEP-at-UC scenario
