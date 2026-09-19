# Devpost submission — copy, ready to paste

Every number below was produced by the engine in this repo, not written by hand.
Reproduce them with `npm run demo`, or by driving the built bundle. If you change
the dataset, re-run and re-check this file before you submit — a wrong figure in
the pitch is the one thing this project cannot afford.

---

## Project name

**Degree Route**

> A note on naming, because it will look like a bug otherwise: the RevenueCat
> entitlement is `collegemaps_pro`, from an earlier working title. Leave it
> alone. It is an internal identifier that must match the dashboard exactly, and
> renaming it breaks purchases for anyone who has already bought. Customers
> never see it. The app, the icon and the store listing all say Degree Route.

## Elevator pitch (≤200 characters)

> Three CLEP exams clear nothing at UC Berkeley and three whole requirements in
> Florida. Degree Route shows which credit your campus will actually honour —
> and cites a source for every claim.

*(197 characters. A shorter alternative if the field is tighter: "Which college
credit will your campus actually honour? Degree Route prices the answer, with a
source on every claim." — 116.)*

---

## About the project

### Inspiration

A friend sat three CLEP exams on the strength of a blog post that said they were
"widely accepted". They were heading to a UC. **The University of California
awards no CLEP credit whatsoever** — not reduced credit, not elective credit,
none. Nobody had lied to them. The blog post was true somewhere else.

That is the whole problem in one sentence: transfer-credit advice is written
nationally and enforced locally, and a student cannot tell which sentence applies
to them until after they have paid.

The number that decided it: the same three exams that are worth **$0** at UC
Berkeley clear **three of the five** general-education requirements at the
University of Florida, dropping what that student still owes from $2,505 to
$1,002. Same exams. Same scores. Same week.

### What it does

You answer four questions — year in school, rough field, what you can spend,
whether you qualify for a fee waiver — pick a state, then a campus. Degree Route
then prices **the requirements you still have to clear**, at that campus's own
per-unit rate, and shows three ways to clear them:

- **Cheapest** — the least money, however many terms it takes
- **Fastest** — exams instead of semesters
- **Lowest risk** — *only* credit backed by statute or a published campus policy

From a first-year at UT Austin with nothing banked:

| | Do nothing | Cheapest route | Saving |
|---|---|---|---|
| UT Austin (Texas Core, 42 SCH) | $12,600 | $859 | **$11,741** |
| UC Berkeley (Cal-GETC) | $17,825 | $969 | **$16,856** |
| University of Florida (GE Core) | $2,505 | $475 | **$2,030** |

Then the part that matters more than the saving: **every claim on screen carries
its provenance** — a source URL, the date it was last read, and a confidence
level. Anything unconfirmed is badged in amber and excluded from the lowest-risk
route by construction, not by convention.

The plan is a map, not a verdict. Tap any requirement to see every other credit
that campus accepts for it, swap it, or say you are handling that one yourself —
the engine re-plans and re-prices on the spot, and the plan persists on the
device.

When you are ready, export an **advisor packet**: a printable page listing every
row, every source, and — set apart at the top — the specific rows an advisor
needs to confirm. There is a second version framed for a parent or guardian, with
**the same evidence and the same unconfirmed rows still marked**. Softening those
for a parent would be exactly the dishonesty the document exists to prevent.

### How we built it

Expo SDK 57 / React Native 0.86 / React 19.2, TypeScript in strict mode, no `any`.

The core is a **pure planning engine** with no React in it — it takes a dataset
and a student, and returns routes. That boundary is why it can be tested in Node
with no renderer, and it is where the real correctness work lives: one credit can
only be spent once (AP English Literature clears 1A *or* 3B, never both), an exam
that clears two requirements is charged once, and a route's unmet requirements
are priced back in so a plan that clears less can never *look* cheaper than it is.

The dataset is typed TypeScript modules rather than JSON, so a malformed row is a
compile error. It currently holds **79 public campuses across three states**, 25 requirement
areas, 97 credit sources across six credit families (AP, IB, CLEP, DSST,
community-college courses and third-party providers) and **4,666 acceptance
rules**.

Coverage is deliberately two-tiered and the app never blurs them. Campus-level
planning — the part that produces a number — is California, Texas and Florida.
On top of that sits a **statewide layer**: 25 of the 51 US jurisdictions carry
their actual statewide transfer rule (Ohio Transfer 36, the Illinois
Articulation Initiative, the Michigan Transfer Agreement, Missouri's CORE 42,
Arizona's AGEC…). That rule applies to every public campus in the state at once
and is usually the most valuable thing a student can be told. The remaining 26
say honestly that we have not confirmed one.

RevenueCat powers the one-time advisor-packet unlock on both platforms:
`react-native-purchases` + `react-native-purchases-ui` (Paywalls and Customer
Center) on device, `@revenuecat/purchases-js` (Web Billing) on the web. Metro's
platform resolution picks the implementation, so nothing in the app knows which
one it got. With no key configured the app still runs end to end and the paywall
simply reports that purchases are unavailable — it does not crash and it does not
hide anything.

57 tests, and the ones worth naming are invariants rather than examples: *no
campus can be handed another state's requirements*; *every rule points at rows
that exist, in the right framework*; *every campus in the country plans without
producing a negative saving or spending a credit twice*.

### Challenges we ran into

**Every interesting bug was a wrong number that looked right.**

An early build showed the lowest-risk route as the *biggest* saver — "$0, saves
$9,933, clears 0 of 10" — because saving was computed as `baseline − cost`, which
credits a route for everything it never touched. An empty plan is the cheapest
plan. Savings now count only what a route actually clears.

The engine invented policy. For a campus/exam pair we held **no rule for**, it
emitted "UC Berkeley counts this toward your degree" — a sentence no source
supported. It now says "We have no record of how UC Berkeley treats this," which
is less satisfying and true.

AP mappings were guessed and the guesses cost money: AP Biology clears 5B **and**
the 5C laboratory, so students were being sent to sit a lab they had already
satisfied. Fixing it meant `satisfies_area: string` had to become
`satisfies_areas: string[]`, because "and" and "or" are genuinely different
things and a single field cannot hold both.

Going national surfaced the nastiest one. `effectiveCost` zeroed community-college
fees for any waiver-eligible student — correct in California, which has the
College Promise Grant, and wrong in Texas and Florida, which have no statewide
equivalent. It would have under-priced **every route in those states, in the
student's favour**: the direction a wrong number never gets caught, because
nobody complains that they saved too much. The waiver is now a property of the
jurisdiction.

And one that ate an afternoon: Metro inlines `process.env.EXPO_PUBLIC_*` at
*transform* time and caches the result, so changing the RevenueCat key and
rebuilding silently baked the stale one into the bundle. The key read as an empty
string through several rebuilds. `build:web` now passes `--clear`.

### Accomplishments that we're proud of

**The app tells you when it does not know.** In Texas and Florida the
lowest-risk route comes back *empty*, and says so: "We have not yet confirmed any
credit for UT Austin against its own published policy, so there is nothing here
we would stake your money on." We could have made those states look as strong as
California by relaxing one confidence level. The whole product would have been
worth less.

Going from one state to three cost **two lines** of engine change, because
scoping is a data invariant rather than a filter — a requirement names the
systems that require it, so a Texas campus cannot reach a Californian
requirement even though both live in the same array. A test asserts it rather
than trusting it.

And the thing we would ship even if nothing else survived: a student who has
already spent $285 on the wrong exams is told so, on the first screen, before
they are asked for anything.

### What we learned

Statewide law is worth more than any campus's policy page, and no campus page
will ever tell you about it — because it is not theirs to give. **Texas Education
Code §61.822** says a completed 42-hour core transfers as a block the receiving
university *must* substitute. **Florida §1007.23** has guaranteed AA holders
university admission since 1972. Those two sentences are worth more to a student
than every exam on their plan put together, and they surface above the routes
now, not beneath them.

We also learned to read the limits as carefully as the promises. Florida
guarantees admission to *a* state university — not the one you want. The app says
that in the same breath as the guarantee.

### What's next for Degree Route

- **Read Florida's Rule 6A-10.024 equivalency table.** One binding document that
  every public institution in the state must follow. Reading it flips every
  Florida AP and CLEP row from "needs confirming" to statute in a single pass,
  and turns Florida's empty lowest-risk route into the strongest demo in the app.
- **Promote the statewide layer from `needs_check` to statute.** All 25 rules
  are one document away each. Ohio Transfer 36, Illinois IAI, Michigan MTA and
  Missouri CORE 42 cover the largest student populations.
- **Campus pricing for those states**, in the same order.
- **Third-party credit providers** (Sophia, Study.com, Saylor, StraighterLine,
  TEEX, Modern States) are listed with price, who recommends them and — the
  field that actually decides their worth — whose transcript the credit lands
  on. UC publishes a refusal for all of them, so a UC-bound student is told
  before they subscribe. See `docs/CREDIT-SOURCES.md`.
- **Out-of-state coursework.** A student who studied in one state and is heading
  to another is currently told to retake requirements they may already hold. The
  app can now show them both states and still cannot connect them — which got
  *more* pressing with three states in the dataset, not less.
- **Community colleges as destinations**, which matters most in Florida, where
  the statutory guarantee attaches to the Associate in Arts rather than to the
  university.

---

## Built With

```
expo · react-native · react · typescript · revenuecat · expo-router-free
node · playwright-core · vercel · android
```

*(Devpost's tag field is comma-separated and lowercase. Add `samsung-galaxy-store`
if the Galaxy release lands before you submit.)*

## Try it out

- **Source (MIT):** https://github.com/feedddosever/whatsgoingon
- **Start here:** https://whatsgoingon-hazel.vercel.app/start
- **The planner itself:** https://whatsgoingon-hazel.vercel.app
- **Privacy / Terms:** `/privacy` and `/terms` on the same host
- **Store listing:** *(add once the Galaxy Store release is live — leave the line
  out entirely rather than writing "coming soon")*

> Before submitting, open the Vercel URL yourself and confirm it is serving the
> current build. A stale deploy behind a live link is worse than no link.

---

## Categories to enter

One app can enter several. Enter these, in this order of expected return:

| Category | Enter? | What the entry has to carry |
|---|---|---|
| **Next Gen Award** | **Yes — the anchor** | Verifiable academic email on Devpost, public repo with a licence file (both already true), demo video. No store release needed. |
| **RevenueCat Peace Prize** | **Yes** | Judged on impact / feasibility / **reach**. Lead with the three-state coverage and the statutory guarantees. Needs an in-window store release. |
| **#BuildInPublic** | Yes, if you post | Judged on the journey you posted, not the app. Worth nothing without a posting history. |
| **Design Award** | Yes | Judged on interface and interaction craft. The dark plan map and the amber provenance badges are the case; motion is the weak spot. |
| **HAMM** (monetization) | No | A one-time $5-ish unlock aimed at parents will not out-monetize anything. Do not contort the product for it. |
| **Grand Prize** | No | Judged on post-release growth numbers. Not manufacturable in the time left. Spend the hour on the video instead. |

## How we use the RevenueCat SDK (they ask; answer specifically)

> Degree Route uses RevenueCat for a single non-consumable unlock — the advisor
> packet — under the entitlement `collegemaps_pro`, with `lifetime` and `monthly`
> products configured. On device we use `react-native-purchases` 10.10 together
> with `react-native-purchases-ui` for both the Paywall and the Customer Center,
> so cancellations and refund requests are handled by RevenueCat rather than by
> us. On the web we use `@revenuecat/purchases-js` 1.63 with Web Billing and a
> persisted anonymous app user id. Metro's platform resolution selects the
> implementation at build time, so the app code is identical on both. Entitlement
> state is checked at launch and gates the packet export; with no API key
> configured the app runs end to end and the paywall reports honestly that
> purchases are unavailable.

## Pre-submit checklist

- [ ] Academic email added and **verified** on the Devpost profile (Next Gen is
      lost on this alone)
- [ ] Repo public, `LICENSE` present at the root — ✅ both already true
- [ ] Demo video uploaded to YouTube/Vimeo, **public, not unlisted-only**, and
      under the length cap
- [ ] The five screenshots from `docs/store/screenshots/` attached
- [ ] Vercel link opened and confirmed current
- [ ] Every figure in this file re-checked against `npm run demo`
- [x] `PRIVACY.md` and `TERMS.md` now render to public URLs at `/privacy` and
      `/terms`, generated from the Markdown at build time — ✅ done
- [ ] A real support address in both, and in `EXPO_PUBLIC_SUPPORT_EMAIL` —
      **still required for the store release, and the Peace Prize needs the
      store release**
