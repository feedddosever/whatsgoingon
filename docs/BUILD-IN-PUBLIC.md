# #BuildInPublic — 33 Reels in 11 days

Sept 19 → Sept 29 is eleven posting days, three Reels a day. **Sept 30 is
submission day** and carries no new content — just a live story when you hit
submit.

## Read this before you post anything

**33 Reels while also shipping a store release is a lot.** Be honest with
yourself about it. The series is built so that only one Reel a day is
expensive: if a day goes sideways, **post the A-slot and skip B and C**. Eleven
good A-slots beat thirty-three rushed ones, and the category rewards a genuine
journey posted consistently — not volume.

**The unbreakable rule: every number on screen is real.** This entire product is
an argument that unverified claims cost students money. Inflating a figure in a
Reel to make it land harder would be the exact failure the app exists to
prevent, and a judge who checks — they do check — is checking the one thing you
built the app to be trusted about. If you don't have the number, say the thing
without a number.

Everything below is drawn from what actually happened in this repo. Nothing is
invented for the camera.

---

## Format spec

| | |
|---|---|
| **Aspect / size** | 9:16, 1080×1920 |
| **Length** | **12–18s.** Instagram counts total seconds watched *including replays*, so a 15s Reel watched three times outranks a 45s Reel watched once. Nothing over 30s. |
| **Hook** | On screen by frame 1, spoken by second 2. Never a logo, never "hey guys". |
| **Captions** | Burned in, always. Assume sound off. |
| **Face** | Optional. Screen recording + voice-over carries the whole series. |
| **Cover** | Hook text on the dark background — generate with `node scripts/art/render.mjs` (see `docs/store/reels/`). |
| **Loop** | Last frame should flow into the first, so a replay feels intentional. Replays are counted watch time, and watch time is the #1 signal. |
| **Mirror** | Post the same cut to YouTube Shorts and TikTok. Depending on one algorithm is a single point of failure you don't need. |

**Visual kit** — use the app's own tokens so the feed and the product agree:
background `#0B0F14`, accent `#5BE895`, warning amber `#F5C542`, muted `#8A97A6`.
Big numbers set huge. The recurring motif is a **receipt**: a claim, a source, a
date. That motif *is* the brand.

**Slots**

- **A (≈08:00) — the number.** Stands alone with no context. Highest reach. Screen recording or a static card.
- **B (≈13:00) — the build log.** A bug, a commit, a diff. This is what #BuildInPublic is actually judged on.
- **C (≈19:00) — the why.** Talking head or voice-over over b-roll. Cheapest to shoot.

**Hashtag sets — five maximum, and they are not for reach**

Instagram capped hashtags at **5 per post** in December 2025, and Mosseri has
said plainly that hashtags do not improve reach — they help *search*, and that
is all. So these are five specific tags for topical clarity, not a distribution
strategy. A longer list is not available to you any more, and would not have
helped.

- **SET-1 (build):** #buildinpublic #indiehacker #shipaton #reactnative #devlog
- **SET-2 (student):** #collegehacks #clep #dualenrollment #transferstudent #collegeplanning
- **SET-3 (state):** #texascollege #floridacollege #transfercredit #collegetransfer #communitycollege
- **SET-4 (craft):** #designinpublic #typescript #opensource #uidesign #shipit

**Every caption ends with the same two lines:**

```
Open source, MIT: github.com/feedddosever/whatsgoingon
Built for @revenuecat Shipaton 2026 🐱
```

---

# DAY 1 — Sept 19 · The problem

### R01 · A · "They paid for exams that count for nothing"
**Length** 18s · **Tags** SET-2

- **Hook card:** `3 exams. $285. Worth $0.`
- **Beats:** "A friend sat three CLEP exams because a blog post said they were widely accepted." → *(beat)* → "They were going to a UC." → "The University of California awards no CLEP credit. Not reduced credit. Not elective credit. None." → "Nobody lied to them. That blog post was just true somewhere else."
- **Film:** the app on the UC Berkeley plan, scrolled to the three stranded-credit warnings. Let the third one sit in silence for a full second.
- **Caption:** Transfer-credit advice is written nationally and enforced locally. You find out which sentence applied to you after you've paid. So I'm building the thing that tells you first. Day 1.

### R02 · B · "Day 1 of building in public"
**Length** 18s · **Tags** SET-1

- **Hook card:** `11 days. One app. No growth hacks.`
- **Beats:** what it is in one sentence → the deadline → "I'll post every bug, including the embarrassing ones. Especially those."
- **Film:** terminal, `npm test`, 57 passing. Then the repo tree.
- **Caption:** Shipaton 2026 closes Sept 30. I'm posting 3x a day until then — the wins and the wrong numbers. First wrong number lands tomorrow.

### R03 · C · "Why this and not another to-do app"
**Length** 18s · **Tags** SET-2

- **Hook card:** `A wrong answer here costs a semester.`
- **Beats:** "Most apps, worst case, waste your time. This one, worst case, costs somebody a semester and a few thousand dollars." → "That's why every single claim in it carries a source, a date, and how confident we are." → "It's allowed to say 'I don't know'. Most products aren't."
- **Film:** slow scroll over the provenance badges — green `Published policy`, amber dashed `Needs confirming`.
- **Caption:** Building something where being wrong is expensive changes every decision you make. More on that all week.

---

# DAY 2 — Sept 20 · The turn

### R04 · A · "Same exams. Different state. $1,500 difference."
**Length** 18s · **Tags** SET-3

- **Hook card:** `$2,505 → $1,002. Nothing changed but the state.`
- **Beats:** "Same student. Same three CLEP exams. Same scores." → switch California → Florida in-app → "Florida publishes one statewide table and every public university in the state has to follow it." → "Those exams clear three of five requirements. What she still owes drops from twenty-five-oh-five to a thousand and two."
- **Film:** the real state-switch in the app. Do not cut between states — the switch is the point.
- **Caption:** Florida Rule 6A-10.024 is binding on all 12 state universities. California's Cal-GETC won't take CLEP at all. Identical exam, opposite outcome.

### R05 · B · "The bug that made the empty plan look best"
**Length** 18s · **Tags** SET-1

- **Hook card:** `"$0 · saves $9,933 · clears 0 of 10"`
- **Beats:** "This card shipped in an early build. Read it again." → "Zero dollars. Saves nine thousand. Clears nothing." → "I was computing saving as baseline minus cost — which credits a plan for everything it never touched. **An empty plan is always the cheapest plan.**"
- **Film:** the fixed version beside it. Savings now count only what a route actually clears.
- **Caption:** My worst bugs in this project are all the same shape: a wrong number that looked completely reasonable on screen.

### R06 · C · "Who this is for"
**Length** 18s · **Tags** SET-2

- **Hook card:** `Built for 16-year-olds. Priced for parents.`
- **Beats:** the student does the planning, free → the export that goes to an advisor or a parent is the one paid thing → "17-year-olds don't have $5. Parents of college-bound kids absolutely do."
- **Film:** the guardian packet rendering.
- **Caption:** Everything a student needs is free. The thing a parent wants — evidence on paper — is the unlock.

---

# DAY 3 — Sept 21 · State law is the cheat code

### R07 · A · "Texas can't legally make you retake it"
**Length** 18s · **Tags** SET-3

- **Hook card:** `Finish it once. Anywhere. Statute.`
- **Beats:** "Texas Education Code 61.822." → "Finish the 42-hour core at *any* Texas public college and the receiving university **must** substitute it for its own. You may not be required to take additional core courses." → "That's not a policy. That's the law. And no campus page will tell you, because it isn't theirs to give."
- **Film:** the statewide-rule block in the app with its `Guaranteed by state law` badge.
- **Caption:** The most valuable fact for a Texas student isn't on any university's website — it's in the education code. That's the gap.

### R08 · B · "Two lines were all that tied it to California"
**Length** 18s · **Tags** SET-1

- **Hook card:** `1 state → 3 states. Two lines of engine.`
- **Beats:** "I built this California-only. Adding Texas and Florida changed exactly two lines of the engine." → "Because scoping isn't a filter, it's a data invariant — a requirement names the systems that require it, so a Texas campus *can't reach* a Californian requirement." → "There's a test that asserts it rather than trusting it."
- **Film:** the test name on screen: `no campus can be handed another state's requirements`. Then `79 campuses · 3,150 rules`.
- **Caption:** The cost of going national was never the code. It was the data, and the copy that said "Cal-GETC" where it meant "the framework".

### R09 · C · "The rule that makes the whole thing work"
**Length** 18s · **Tags** SET-4

- **Hook card:** `Source. Date. Confidence. Every claim.`
- **Beats:** the provenance type, read out → "If a row is unverified it has to *look* unverified. That's not a style preference — it's the only reason any of this is safe to act on."
- **Film:** `types.ts` on screen, the `Provenance` interface, then the badge it produces in the UI. Same thing, two places.
- **Caption:** A type in the code that you can see on the screen. That's the whole architecture in one picture.

---

# DAY 4 — Sept 22 · Free money nobody claims

### R10 · A · "Texas made dual credit free and enrolment doubled"
**Length** 18s · **Tags** SET-2

- **Hook card:** `102,000 → 260,000 in one year.`
- **Beats:** "Texas HB 8 created FAST — Financial Aid for Swift Transfer." → "If you're eligible for free or reduced lunch, dual-credit college courses cost you **nothing**." → "First year it ran, enrolment of economically disadvantaged students in dual credit more than doubled."
- **Film:** the app showing the FAST opportunity warning for a 10th grader in Texas.
- **Caption:** The programme works. The problem is nobody's counsellor mentions it in time.

### R11 · B · "The bug that stole money in the student's favour"
**Length** 18s · **Tags** SET-1

- **Hook card:** `The worst bugs are the ones nobody reports.`
- **Beats:** "When I added Texas, every community-college course there came out free for fee-waiver students." → "Because California has the College Promise Grant and I'd hard-coded the waiver into the *credit type*." → "Texas has no statewide equivalent. I was under-pricing every route in the state — **in the student's favour**." → "Nobody complains that they saved too much. That bug would have lived forever."
- **Film:** the diff — `effectiveCost(src, profile)` → `effectiveCost(src, profile, jurisdiction)`.
- **Caption:** Wrong-in-your-favour is the hardest class of bug to find, because your users are never the ones who tell you.

### R12 · C · "Reading the limit as carefully as the promise"
**Length** 18s · **Tags** SET-3

- **Hook card:** `Guaranteed admission. Not to the one you want.`
- **Beats:** "Florida has guaranteed AA holders admission to a state university since 1972. Genuinely great." → "It guarantees admission to **a** state university. Not the campus you want, not the programme you want." → "The app says that in the same breath as the guarantee. If we only printed the good half we'd be the blog post I started this over."
- **Film:** the Florida guarantee text in the app, with the limit visible in the same block.
- **Caption:** Anyone can repeat the headline. The product is in the sentence after it.

---

# DAY 5 — Sept 23 · "Accepted" doesn't mean "useful"

### R13 · A · "Your credit counts. It just clears nothing."
**Length** 18s · **Tags** SET-2

- **Hook card:** `Accepted ≠ useful.`
- **Beats:** "A Cal State will accept your CLEP. Up to 30 units, toward your degree." → "It cannot satisfy a single Cal-GETC general-education requirement." → "So you get credit, your requirement list doesn't move, and nothing on your transcript looks wrong. That's the trap."
- **Film:** the `credit_not_toward_ge` warning in the app, in amber.
- **Caption:** Two different failures and the second is far easier to miss: the school takes your credit and you still owe the requirement.

### R14 · B · "My engine invented a policy"
**Length** 18s · **Tags** SET-1

- **Hook card:** `It made up a rule. Confidently.`
- **Beats:** "For a campus/exam pair I had *no data for*, it printed: 'UC Berkeley counts this toward your degree.'" → "No source said that. The code inferred it from an absence." → "Now it says: 'We have no record of how UC Berkeley treats this.' Less satisfying. True."
- **Film:** both strings side by side.
- **Caption:** The default for missing data must be "I don't know", never a reasonable-sounding guess. Especially when the guess sounds helpful.

### R15 · C · "Free everywhere: Modern States"
**Length** 18s · **Tags** SET-2

- **Hook card:** `A CLEP voucher. Any state. $0.`
- **Beats:** Modern States covers the CLEP exam fee nationwide → "That one's actually national, unlike almost everything else in this app." → but check what your campus does with the credit *first*.
- **Film:** the waiver question, then a route re-pricing to $0.
- **Caption:** Free exam + campus that won't take it = still zero. Order of operations matters.

---

# DAY 6 — Sept 24 · Bugs day

### R16 · A · "$19,550 → $17,825 because of one letter"
**Length** 18s · **Tags** SET-3

- **Hook card:** `1C is CSU only. I was charging UC students for it.`
- **Beats:** "Cal-GETC Area 1C, oral communication, is a **CSU** requirement. UC doesn't require it." → "I was imposing it on UC students — three units they never owed." → "Nineteen-five-fifty down to seventeen-eight-twenty-five, just from reading the standard properly."
- **Film:** the `applies_to: ['CSU']` line, then the baseline before/after.
- **Caption:** Every requirement now names the systems that require it. Turns out that same field is what later let the app go national.

### R17 · B · "AP Biology carries its own lab"
**Length** 18s · **Tags** SET-2

- **Hook card:** `I was sending students to a lab they'd already passed.`
- **Beats:** "I had AP Biology clearing Area 5B. It clears 5B **and** the 5C laboratory." → "So the plan told students to go take a lab they'd already satisfied." → "Fixing it meant one field had to become a list — because AP English Lit clears 1A **or** 3B, and 'and' and 'or' are not the same thing."
- **Film:** `satisfies_area: string` → `satisfies_areas: string[]`, then the map showing one exam spanning two requirements, charged once.
- **Caption:** Six exams in the California data clear two requirements at once. Three more are either/or. One field couldn't hold both — so the type changed.

### R18 · C · "One exam, one use"
**Length** 18s · **Tags** SET-4

- **Hook card:** `You can't spend the same exam twice.`
- **Beats:** AP English Lit clears 1A *or* 3B — your pick → "If the planner spent it on both, it'd build a plan you literally cannot execute." → there's a `Set` in the engine whose entire job is to stop that.
- **Film:** the plan map, swapping the choice, the other requirement re-opening.
- **Caption:** A plan that can't be executed is worse than no plan, because it looks like one.

---

# DAY 7 — Sept 25 · The honesty thesis

### R19 · A · "Watch my app refuse to answer"
**Length** 18s · **Tags** SET-1

- **Hook card:** `The lowest-risk route came back empty.`
- **Beats:** "Texas. Lowest-risk route. Watch." → *(it's empty)* → "'There is nothing here we would stake your money on.'" → "I could've made Texas look as strong as California by relaxing one confidence level. I'd rather ship an empty screen than a confident wrong answer."
- **Film:** the real empty route with its full message.
- **Caption:** Hardest product decision of the build, and the one I'd defend hardest. **This is the pinned post.**

### R20 · B · "48 states that say 'I haven't mapped this'"
**Length** 18s · **Tags** SET-3

- **Hook card:** `All 51. 3 mapped. 48 honest.`
- **Beats:** every US jurisdiction is in the dataset → 3 have campuses and requirements → "the other 48 carry no invented data and an honest 'we haven't mapped this yet', plus where to go and ask." → "Absence of data is data. It belongs in the dataset, not in a 404."
- **Film:** scroll the jurisdictions file.
- **Caption:** A student in Ohio opening a "US" app and being told their state doesn't exist learns nothing. Being told the truth is a real answer.

### R21 · C · "The packet doesn't soften for parents"
**Length** 18s · **Tags** SET-2

- **Hook card:** `Same evidence. Same amber. For everyone.`
- **Beats:** there's an advisor version and a parent version → "Different framing, different ask — a parent's being asked to understand a decision, an advisor's being asked to rule on rows." → "**Same evidence. The unconfirmed rows stay marked in both.** Softening them for a parent is the exact dishonesty the document exists to prevent."
- **Film:** both packets side by side, the amber "confirm these" block present in each.
- **Caption:** It would be so easy to make the parent version look more certain. That's precisely why it doesn't.

---

# DAY 8 — Sept 26 · Craft

### R22 · A · "I shipped Expo's default icon for a week"
**Length** 18s · **Tags** SET-4

- **Hook card:** `This is not my icon. It shipped anyway.`
- **Beats:** the blue Expo "A" with construction guides → "On a store listing that reads as 'unfinished', and it's the first thing a judge sees." → the new one: a bright direct route to a mortarboard, two dim routes wandering to the same place.
- **Film:** old icon → new icon, hard cut, no transition.
- **Caption:** The mark is the product in one drawing: every route ends at the degree, the app just tells you which one costs less.

### R23 · B · "An SVG gradient that renders literally nothing"
**Length** 18s · **Tags** SET-4

- **Hook card:** `My icon's main element was invisible.`
- **Beats:** "The bright green route — the whole point of the icon — wasn't there." → "A linearGradient with default objectBoundingBox units on a **perfectly vertical line** has a zero-width bounding box. The gradient degenerates. The stroke renders as nothing." → "No error. No warning. Just absence." → `gradientUnits="userSpaceOnUse"`.
- **Film:** the broken render, the one-attribute diff, the fixed render.
- **Caption:** Filed under bugs that are only obvious once you know. Now it's a comment in the source so the next person doesn't lose the afternoon.

### R24 · C · "Every screenshot is real"
**Length** 18s · **Tags** SET-4

- **Hook card:** `No mockups. Not one.`
- **Beats:** the five store screenshots are captured from the built bundle by a script → "If a screenshot shows a number, the app produced it." → "For an app about not overclaiming, a mocked-up screenshot would be a weird place to start lying."
- **Film:** `node scripts/shots.mjs` running, files appearing.
- **Caption:** Regenerating the store listing is one command. Which also means it can never quietly drift from the product.

---

# DAY 9 — Sept 27 · The money

### R25 · A · "$12,600 → $859"
**Length** 18s · **Tags** SET-3

- **Hook card:** `$12,600 → $859`
- **Beats:** first-year at UT Austin, nothing banked → the 42-hour core at the university's own rate is $12,600 → cheapest route that clears all nine: $859 → "Eleven thousand seven hundred and forty-one dollars, and every row of it cites where it came from."
- **Film:** the hero number in the app.
- **Caption:** The saving isn't the product. The sources under the saving are. Anyone can print a big green number.

### R26 · B · "Charging the parent, not the student"
**Length** 18s · **Tags** SET-1

- **Hook card:** `The paywall says "ask a parent first."`
- **Beats:** RevenueCat SDK is required for the hackathon, so there's a paywall regardless → "This app is used by people who might be 14. So above the price, before anything else, there's a notice telling them to involve a parent." → one-time unlock, not a subscription.
- **Film:** the paywall with the minor notice above the price, then the Customer Center.
- **Caption:** A paywall you'd be comfortable showing a 14-year-old is a different design problem than a paywall that converts.

### R27 · C · "The number I'm least sure of"
**Length** 18s · **Tags** SET-2

- **Hook card:** `My headline number is an estimate. I say so.`
- **Beats:** "Neither UC nor CSU actually charges per unit — they charge flat tiers." → "So my per-unit figure is derived, and it **overstates** the saving for someone already enrolled full time." → "It's labelled 'needs confirming' in the app, and it's the most scrutinised number in the project."
- **Film:** the cost provenance note, in full, on screen.
- **Caption:** The number that makes the app look best is the one carrying the loudest warning. That's the correct way round.

---

# DAY 10 — Sept 28 · Plumbing

### R28 · A · "Your state has one of these and you don't know it"
**Length** 18s · **Tags** SET-3

- **Hook card:** `31 states. One transferable core. Free.`
- **Beats:** Education Commission of the States: at least 31 states require a transferable lower-division core and guarantee statewide transfer of an associate degree → "Thirty-one. Most students in those states have no idea it exists." → "I've mapped three. Which one should be next?"
- **Film:** the map of what's covered.
- **Caption:** Genuinely asking — comment your state. Next five are picked by enrolment, unless you tell me otherwise.

### R29 · B · "The bundler baked a stale key for three rebuilds"
**Length** 18s · **Tags** SET-1

- **Hook card:** `Right key. Right file. Empty string.`
- **Beats:** "Metro inlines `process.env.EXPO_PUBLIC_*` at *transform* time, then caches the transform." → "So I changed the RevenueCat key, rebuilt, and it silently baked the old one. Three times." → "`--clear` is now permanent in the build script, and the reason is a comment above it."
- **Film:** the package.json line and its comment.
- **Caption:** Also the week I found `.gitignore` had `.env*.local` but not `.env`. Two near-misses, one afternoon.

### R30 · C · "The import you must not 'fix'"
**Length** 18s · **Tags** SET-4

- **Hook card:** `This missing file extension is load-bearing.`
- **Beats:** every relative import in the codebase carries its extension — except one → "Metro only applies platform resolution — `.web.ts` over `.ts` — to **extensionless** imports." → "With the extension it bundled the native purchases module into the web build, where the native SDK doesn't exist." → "Verified by grepping the built bundle, not assumed. There's a comment telling the next person not to tidy it."
- **Film:** the import line and the comment above it.
- **Caption:** Half of senior engineering is leaving notes explaining why the weird thing is the correct thing.

---

# DAY 11 — Sept 29 · Land it

### R31 · A · "One PDF would upgrade an entire state"
**Length** 18s · **Tags** SET-3

- **Hook card:** `One document. Twelve universities. Binding.`
- **Beats:** Florida's Rule 6A-10.024 equivalency table → "One table. Every public institution in the state has to follow it." → "Reading it flips every Florida exam row from 'needs confirming' to statute in a single pass — and turns that empty route into the strongest screen in the app." → "That's the next thing I do."
- **Film:** the amber Florida rows, then the empty lowest-risk route.
- **Caption:** Most data work in this space is 400 campuses. Florida is one document. That's why Florida's in the app.

### R32 · B · "11 days, 3 states, 57 tests"
**Length** 18s · **Tags** SET-1

- **Hook card:** `The whole build, in 18 seconds.`
- **Beats:** rapid montage (18s, hard cuts) — one state → three → the icon swap → the bugs → the empty route → the packet → "79 campuses. 3,150 acceptance rules. 51 states in the dataset. 57 tests." → "Submitting tomorrow."
- **Film:** fast cuts of your own previous Reels. **This is the one that gets watched.** Give it the most editing time of anything in the series.
- **Caption:** Everything I posted this month, in one cut. Open source, MIT, link below — go break it.

### R33 · C · "What I actually learned"
**Length** 18s · **Tags** SET-1

- **Hook card:** `Shipping an "I don't know" screen was the hard part.`
- **Beats:** "Every bug worth talking about here was a wrong number that looked right." → "The empty screen, the amber badges, the number carrying the loudest warning — those are the product. The savings are the marketing." → "If you're building where being wrong is expensive: make 'I don't know' a first-class state in your data model, not a fallback in your UI."
- **Film:** talking head if you have one in you. This is the one worth your face.
- **Caption:** Eleven days of posting. Thanks for watching me debug in public. Submission tomorrow.

---

# DAY 12 — Sept 30 · Submission day

**No new Reels.** Post a live story when you hit submit, and reply to every
comment from R32 and R33 — engagement on the last two does more for the category
than a thirty-fourth Reel would.

If you want one last post, it's the same cut as R32 with `SUBMITTED` stamped
over the final frame.

---

## Shooting efficiency

You cannot shoot 33 Reels one at a time. **Batch by asset, not by day.**

| Session | Shoot | Covers |
|---|---|---|
| **Sun Sept 21, ~2h** | Every in-app screen recording: state switch, plan map edit, empty route, packet, paywall | R01 R04 R07 R13 R15 R19 R21 R25 R26 R31 |
| **Wed Sept 24, ~1h** | Every code/terminal shot: diffs, tests, types, package.json | R02 R05 R08 R11 R14 R17 R23 R29 R30 |
| **Sat Sept 27, ~1h** | Every talking-head C-slot, back to back, one outfit | R03 R06 R09 R12 R18 R24 R27 R33 |
| **Rolling** | Hook cards — generated, not shot | all |

Then each day is: pick the clip, cut, caption, post. Fifteen minutes.

## Generating the hook cards

The A-slot cover cards are rendered from HTML at 1080×1920, same pipeline as the
app icon, so they're consistent and regenerable:

```
node scripts/art/render.mjs "$(cat scripts/art/reels.json)"
```

Output lands in `docs/store/reels/`. Edit the text in
`scripts/art/hook-card.html` — it reads its copy from a `data-` attribute so one
file makes every card.

## If you only do one thing

Post **R19** ("watch my app refuse to answer"). Pin it. It is the single most
distinctive thing about this product, it is the hardest decision you made, and
it is the one a judge will remember after the other thirty-two blur together.
