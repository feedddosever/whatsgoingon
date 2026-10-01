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

The number that decided it: the same three exams (CLEP College Composition,
College Algebra and Introductory Psychology) that are worth **$0** at UC
Berkeley clear **three of the five** general-education requirements at the
University of Florida, dropping what that student still owes from $2,505 to
$1,002. Same exams. Same scores. Same week.

### What it does

You answer a few quick questions, one per screen — year in school, rough field,
what you can spend, whether you qualify for a fee waiver — pick a state and a
campus, and say which credit you already hold. Degree Route
then prices **the requirements you still have to clear**, at that campus's own
per-unit rate, and shows three ways to clear them:

- **Cheapest** — the least money, however many terms it takes
- **Fastest** — exams instead of semesters
- **Lowest risk** — *only* credit backed by statute or a published campus policy

For a student with nothing banked (figures from the engine, 2026-10-01):

| | Do nothing | Cheapest route | Saving |
|---|---|---|---|
| UC Berkeley (Cal-GETC) | $18,011 | $969 | **$17,042** |
| UT Austin (Texas Core, 42 SCH) | $16,800 | $2,457 | **$13,143** |
| Baruch College, CUNY (Pathways) | $8,235 | $1,408 | **$6,827** |
| West Chester, PASSHE (30-Credit Framework) | $6,246 | $1,145 | **$5,101** |
| University of Florida (GE Core) | $2,505 | $487 | **$2,018** |

"Do nothing" is the general-education requirements priced at the campus's own
per-credit rate. Whatever a route leaves unmet is priced back in at that rate, so
a plan that clears less can never look cheaper than it is.

Then the part that matters more than the saving: **every claim on screen carries
its provenance** — a source URL, the date it was last read, and a confidence
level. Anything unconfirmed is marked with an amber "?" and excluded from the
lowest-risk route by construction, not by convention.

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
compile error. It currently holds **119 public universities across five
states**, 52 requirement areas in six frameworks, 145 credit sources across
**eight credit families** — AP, IB, Cambridge A Level (what Florida calls AICE),
CLEP, DSST, DLPT, community-college courses and third-party providers — and
about **6,000 acceptance rules**. That is every family in Florida's
credit-by-exam statute still being sat today, plus the two that are not exams at
all.

Coverage is deliberately two-tiered and the app never blurs them. Campus-level
planning — the part that produces a number — is California, Texas, Florida, New
York (SUNY and CUNY, each against its own framework) and Pennsylvania (the
PASSHE universities). On top of that sits a **statewide layer**: every other
state carries its actual statewide transfer rule (Ohio Transfer 36, the
Illinois Articulation Initiative, the Michigan Transfer Agreement, Missouri's
CORE 42, Arizona's AGEC…), or says plainly that it has none — Delaware and DC
don't. That rule applies to every public campus in the state at once and is
usually the most valuable thing a student can be told.

Before submitting we re-read the dataset against its primary sources — statutes,
system policies and campus catalogs — and corrected what was wrong. 41 of the 46
statewide rules are now read at source; the rest stay marked "?". The full
corrections ledger is in `data/research/MASTER-LIST.md`.

RevenueCat powers the one-time advisor-packet unlock on both platforms:
`react-native-purchases` + `react-native-purchases-ui` (Paywalls and Customer
Center) on device, `@revenuecat/purchases-js` (Web Billing) on the web. Metro's
platform resolution picks the implementation, so nothing in the app knows which
one it got. With no key configured the app still runs end to end and the paywall
simply reports that purchases are unavailable — it does not crash and it does not
hide anything.

95 tests, and the ones worth naming are invariants rather than examples: *no
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

**The app tells you when it does not know.** Until we had read Texas's and
Florida's sources, the lowest-risk route there came back *empty*, and said so:
"We have not yet confirmed any credit for UT Austin against its own published
policy, so there is nothing here we would stake your money on." We could have
made those states look as strong as California by relaxing one confidence level.
Instead we read the sources — and the reading cut both ways. It caught rows that
over-claimed (Texas exam rows that UT Austin's own chart contradicts, and New
York CLEP rows that City College treats as electives), and rows that
under-claimed (Florida had been asking for a 4 on AP sciences where the state
table awards credit at a 3).

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

- **Read the adopted text of Florida's exam table.** We read the June 2026 copy
  of the Rule 6A-10.024 equivalencies; the adopted version is a document our
  tools could not open. Confirming it promotes every Florida exam row from "?"
  to statute in one pass.
- **Close the open questions in the verification reports** — each one in
  `data/research/VERIFIED-*.md` ends with the items a person has to check by
  hand (a registrar call, a page that needs a browser).
- **Campus pricing for the next states**, starting where the statewide rule is
  strongest: Ohio, Illinois, Michigan and Missouri cover the largest student
  populations.
- **Third-party credit providers** (Sophia, Study.com, Saylor, StraighterLine,
  TEEX, Modern States) are listed with price, who recommends them and — the
  field that actually decides their worth — whose transcript the credit lands
  on. UC publishes a refusal for all of them, so a UC-bound student is told
  before they subscribe. See `docs/CREDIT-SOURCES.md`.
- **Out-of-state coursework.** A student who studied in one state and is heading
  to another is currently told to retake requirements they may already hold. The
  app can now show them both states and still cannot connect them — which got
  *more* pressing with five states in the dataset, not less.
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
| **RevenueCat Peace Prize** | **Yes** | Judged on impact / feasibility / **reach**. Lead with the five-state coverage and the statutory guarantees. Needs an in-window store release. |
| **#BuildInPublic** | Yes, if you post | Judged on the journey you posted, not the app. Worth nothing without a posting history. |
| **Design Award** | Yes | Judged on interface and interaction craft. The dark plan map, the amber "?" badges, the one-question-at-a-time onboarding and the salad-and-salt preparing animation are the case. |
| **HAMM** (monetization) | Optional | Costs nothing to enter, but there is no revenue data: the build runs on RevenueCat's Test Store. The answer below explains the model honestly. |
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
> purchases are unavailable. The submitted Android APK is a debug build on
> purpose: it uses a RevenueCat Test Store key, which the SDK accepts only in
> debuggable builds, so judges can run the whole purchase flow without real
> money. See the README.

## Award-specific answers (paste into the form)

Fields not listed here — Grand Prize, #BuildInPublic, Catvertising, Best Game,
Influencer, Kotlin, Most Viral, Galaxy, Replit, OneSignal, Layers, Funnel
Vision — stay blank: there is no post-launch growth data, no public posting
history, and none of those sponsors' SDKs is integrated.

### HAMM — monetization

> Degree Route's planner is free and complete: every student can see their
> routes, every price, every source and every warning without paying. The one
> thing for sale is the advisor packet — a printable page of the whole plan,
> every row with its source link, the date we read it and how far we trust it,
> with the unconfirmed rows set apart at the top for a counsellor to check.
> There is also a version framed for a parent or guardian, carrying the same
> evidence.
>
> It is a one-time unlock, not a subscription, sold through RevenueCat under one
> entitlement on both platforms: react-native-purchases with RevenueCat Paywalls
> and Customer Center on Android, and RevenueCat Web Billing (purchases-js) on
> the web.
>
> Why this model: the information that saves a student money should never be
> behind a paywall — a student who has already bought the wrong exams is told so
> on the first screen, free. What is worth paying for is the artefact you carry
> into an advisor's office, and a transfer is a decision you make once, so a
> recurring charge for it would earn refunds rather than revenue. The buyer is
> often a parent, which is why the packet has a parent version.
>
> The paywall leads with the student's own projected saving, prints what the
> packet does NOT do above what it does, quotes the store's real localised price
> or says plainly that the store will show it, and has no countdowns, fake
> scarcity or struck-through prices. Users are school-age, so a notice addressed
> to minors sits above the price, and the dismiss button stays live even
> mid-purchase.
>
> Results: the submitted build runs against RevenueCat's Test Store, so there is
> no real conversion or revenue data yet.

### RevenueCat Peace Prize

> A student who acts on wrong transfer-credit advice loses real money and a real
> semester, and the advice is wrong in a specific way: it is written nationally
> and enforced locally. The University of California awards no CLEP credit at
> all, while the same exams clear general-education requirements at a Florida
> university. Nobody lies to the student; the blog post was simply true
> somewhere else.
>
> Degree Route takes a state, a campus and the credit a student already holds,
> and prices the general-education requirements they still owe at that campus's
> own per-credit rate — then shows the cheapest, fastest and lowest-risk ways to
> clear them. For a UT Austin student with nothing banked, those requirements
> cost $16,800 at the campus's tuition rate; the cheapest route the app finds
> costs $2,457. At UC Berkeley it is $18,011 against $969.
>
> The design choice that matters most is honesty about what we don't know. Every
> claim carries a source link, the date it was read and a confidence level;
> anything unconfirmed is marked with a "?" and kept out of the lowest-risk
> route by construction. Where we have no record of a campus's policy, the app
> says "we have no record" rather than guessing. Before launch we re-read our
> own dataset against primary sources — statutes, system policies and campus
> catalogs — and corrected what was wrong, including errors that under-priced
> routes in the student's favour, the kind nobody reports.
>
> Reach: campus-level pricing for California, Texas, Florida, New York and
> Pennsylvania — 119 public universities — plus every other state's statewide
> transfer guarantee, the single most valuable sentence most students are never
> told; 41 of those 46 statewide rules have been read at their source. The
> planner is free, accessible (screen-reader labels throughout, reduce-motion
> respected), and the code is open source under MIT.

### Design Award

> - One question per screen. Onboarding asks one thing at a time — year, field,
>   budget, fee waiver, state, campus, credit held — so a 16-year-old is never
>   staring at a form.
> - A pause, not a spinner. The engine finishes instantly, so the beat before
>   the answer is deliberate: a salt shaker seasons a salad once, then the
>   routes arrive. A tap skips it; with reduce-motion on it becomes a still
>   frame for under a second.
> - The plan is a map, not a verdict. The plan map lays out every requirement;
>   tap one to see every other credit that campus accepts for it, swap it, or
>   mark it as handled — the engine re-plans and re-prices on the spot, and the
>   plan persists on the device.
> - Uncertainty you can see. Unconfirmed data wears an amber dashed "?" badge —
>   short enough to sit on every row, impossible to mistake for a confirmed fact
>   — and screen readers announce it as "Not yet confirmed".
> - An honest paywall. The student's own saving is the hero number (shrunk to
>   fit rather than clipped — a truncated "$120,0" is a wrong number), the
>   limits are printed above the benefits, and there are no countdowns or fake
>   scarcity.
> - Responsive layouts for phone and tablet in both orientations, and a print
>   layout for the advisor packet.

### Additional notes for judges

> 1. The Android APK is a debug build, on purpose. It uses RevenueCat's Test
>    Store key, which the SDK only accepts in debuggable builds, so judges can
>    run the full purchase flow without real money. The README explains this.
> 2. While `TESTING_UNLOCK` is on, the paywall shows a clearly labelled "skip
>    payment" button so judges can reach the advisor packet without completing a
>    purchase. It unlocks for the current session only and saves nothing.
>    (Delete this note if it has been switched off.)
> 3. The web version runs the same app with RevenueCat Web Billing:
>    https://whatsgoingon-hazel.vercel.app (start at /start).
> 4. The RevenueCat entitlement is named collegemaps_pro, from an earlier
>    working title. It is internal only; the app and listing say Degree Route.
> 5. A "?" badge marks data we have not yet confirmed against a primary source.
>    The research behind every number, including a ledger of the corrections we
>    made to our own data, is in data/research/ in the public repo:
>    https://github.com/feedddosever/whatsgoingon

## Pre-submit checklist

- [ ] Academic email added and **verified** on the Devpost profile (Next Gen is
      lost on this alone)
- [ ] Repo public, `LICENSE` present at the root — ✅ both already true
- [ ] Demo video uploaded to YouTube/Vimeo, **public, not unlisted-only**, and
      under the length cap
- [ ] Screenshots attached — `docs/store/screenshots/` (phone captures) or
      `docs/store/marketing/` (captioned, 1080×1920)
- [ ] Thumbnail attached — `docs/store/thumbnail-3x2.png` (1500×1000)
- [ ] Vercel link opened and confirmed current
- [ ] Every figure in this file re-checked against `npm run demo`
- [x] `PRIVACY.md` and `TERMS.md` now render to public URLs at `/privacy` and
      `/terms`, generated from the Markdown at build time — ✅ done
- [ ] A real support address in both, and in `EXPO_PUBLIC_SUPPORT_EMAIL` —
      **still required for the store release, and the Peace Prize needs the
      store release**
