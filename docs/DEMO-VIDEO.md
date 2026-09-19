# Demo video — 2:00 script and shot list

Judges decide largely from the video, the description and the screenshots, and
they expect to know what the app is inside the first two minutes. So this script
spends **zero** seconds on a logo animation, a title card, or "hi, my name is".

The opening is a number, and the number is the product.

**Format:** screen recording of the app, voice-over. No face cam needed. Record
the phone build if the Galaxy release has landed; otherwise record the web build
at phone width (412×915) — it is the same bundle, and `scripts/shots.mjs` already
proves that viewport renders correctly.

**The one thing to get right:** every figure spoken below is real. Do not
re-shoot with a different profile and keep the old voice-over. If you change the
setup, re-run `npm run demo` and re-record the line.

---

## Cold open — 0:00–0:18

> **VO:** "My friend paid for three CLEP exams because a blog post said they were
> widely accepted. They were going to a UC. The University of California awards
> no CLEP credit at all. Not reduced credit. None. Nobody lied to them — that
> blog post was just true somewhere else."

**On screen:** the app already open on the UC Berkeley plan, scrolled to the
stranded-credit warnings, so the first frame is:

> ⚠ UC Berkeley does not award credit for CLEP College Composition. You already
> hold it; it will not count here.

Three of those, stacked. Let them sit for a beat with no narration over the last
one.

**Setup to record this:** four questions → *fee waiver: No* → California → UC
Berkeley → tick CLEP College Composition, CLEP College Algebra, CLEP
Introductory Psychology → Price my route.

---

## The turn — 0:18–0:40

> **VO:** "Same three exams. Same scores. Same week. Here they are in Florida."

**On screen:** back to the state row, tap **Florida**, tap **University of
Florida**, tap **Price my route**. Land on the routes screen.

> **VO:** "Florida publishes one statewide table, and every public university in
> the state has to follow it. Those exams clear three of the five
> general-education requirements. What this student still owes drops from
> twenty-five-oh-five to a thousand and two."

**On screen:** the baseline line, unmodified:
`against $1,002 — the Florida GE Core areas you have not cleared yet…`

> **VO:** "Nothing about the student changed. Only the state did. That's the
> app."

---

## What it actually does — 0:40–1:10

> **VO:** "Four questions. No account, no transcript upload. Pick a state, pick a
> campus, and it prices the requirements you still have to clear — at that
> campus's own rate."

**On screen:** Texas → UT Austin → Price my route. Hold on the hero:

> **TAKE THE CHEAPEST ROUTE AND SAVE $11,741** — against $12,600

> **VO:** "Three ways there. Cheapest. Fastest. And lowest-risk — which is only
> credit backed by statute or a published campus policy."

**On screen:** scroll the three cards, then tap into the plan map.

> **VO:** "Every requirement, and how you're clearing it. Tap any branch to see
> what else that campus takes, swap it, or say you're handling that one
> yourself. It re-plans and re-prices as you go — this is your plan, not our
> verdict."

**On screen:** tap one branch open, pick a different credit, let the root cost
visibly change. **Do this live. Do not cut.** The re-price is the proof.

---

## The part that wins it — 1:10–1:40

> **VO:** "Now the bit I care about most. Every claim carries a source, a date,
> and a confidence level."

**On screen:** hold on the amber dashed badges: `Needs confirming · 2026-09-19`.

> **VO:** "In Texas, we don't have confirmed exam mappings. So watch what the
> lowest-risk route does."

**On screen:** back to routes, open the lowest-risk card. It is **empty**:

> We have not yet confirmed any credit for UT Austin against its own published
> policy, so there is nothing here we would stake your money on.

> **VO:** "It comes back empty, and says so. We could have made Texas look as
> strong as California by relaxing one confidence level. A student who acts on a
> wrong transfer-credit claim loses real money and a real semester — so the app
> is allowed to say 'I don't know'."

> **VO:** "What we *can* promise in Texas is statute: finish the forty-two-hour
> core anywhere in the state and the receiving university has to substitute it.
> That's worth more than every exam on the plan, and no campus page tells you,
> because it isn't theirs to give."

**On screen:** the statewide-rule block under the state picker, with its
`Guaranteed by state law` badge.

---

## Packet and paywall — 1:40–1:55

> **VO:** "When you're ready, it exports an advisor packet — every row, every
> source, and the specific things your advisor needs to confirm, set apart at the
> top. There's a version framed for a parent, with the same evidence and the same
> unconfirmed rows still marked."

**On screen:** tap **Send to a parent or guardian**, show the rendered page,
scroll past the "confirm these" block.

> **VO:** "That export is the one paid thing — a single unlock through
> RevenueCat, one payment, no subscription. Everything else is free, because the
> student who most needs this is the one who can least afford it."

**On screen:** the paywall. Show the price on the button and the line *"One
payment of … not a subscription. Your store asks you to confirm before anything
is charged — we never see your card."*

> If you are recording on device and the entitlement is live, **complete a
> sandbox purchase on camera** and show the packet unlock. That single cut is
> worth more to a RevenueCat judge than any other five seconds in this video. If
> you cannot, do not fake it — hold on the paywall and move on.

---

## Close — 1:55–2:00

> **VO:** "Seventy-nine campuses, three states, and fifty-one states in the
> dataset — including the forty-eight we haven't mapped, which say so. It's open
> source. Link's below."

**On screen:** the icon on the dark background, the repo URL, nothing else.

---

## Recording notes

- **Do not narrate taps.** Never say "now I'm going to tap here." Say what the
  screen means; let the finger do the rest.
- **Record at 60fps if you can.** The plan-map re-price is the only motion in the
  app and it should look smooth.
- **One take per section, cut between.** A fumbled tap inside a section is
  cheaper to re-shoot than a 2-minute single take.
- **Captions.** Judges scrub with sound off. Burn in the spoken numbers at
  minimum — `$17,825 → $969`, `$2,505 → $1,002`, `$12,600 → $859`.
- **Ignore** `ERR_TUNNEL_CONNECTION_FAILED` in the web console — that is
  RevenueCat's API blocked by the dev proxy, not the app. It will not appear in
  a screen recording, but do not open devtools on camera.

## Alternative 60-second cut

If a category caps the length, keep **Cold open** → **The turn** → the empty
lowest-risk route → the repo URL. Drop the plan map, the packet and the paywall.
The contrast and the refusal-to-guess are the whole argument; everything else is
supporting evidence.

## Verified

The exact sequence above was driven through the built web bundle on 2026-09-19
and produces these frames, unedited:

```
--- COLD OPEN (UC Berkeley) ---
against $17,825 — the Cal-GETC areas you have not cleared yet…
UC Berkeley does not award credit for CLEP College Composition. You already hold it; it will not count here.
UC Berkeley does not award credit for CLEP College Algebra. You already hold it; it will not count here.
UC Berkeley does not award credit for CLEP Introductory Psychology. You already hold it; it will not count here.

--- THE TURN (U Florida, same 3 exams held) ---
TAKE THE CHEAPEST ROUTE AND SAVE
against $1,002 — the Florida GE Core areas you have not cleared yet…
```

The "same three exams" claim depends on one detail that is easy to break: the
held-credit ticks survive changing state, because AP and CLEP ids are national
(`data/us/exams.ts`) and only the acceptance rules are per-state. If a future
change makes exam ids state-specific, this video stops being true — and the app
stops being able to answer the question it was built for.
