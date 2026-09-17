# Product spec — the degree route planner

Senior-PM pass on the college-savings idea. Career-pathing is cut.

---

## 1. The reframe

**Before:** "an app where students discover how to save money on college."
That's a content product. Content products are judged on comprehensiveness,
which you cannot win in 13 days against the entire internet.

**After:** **Google Maps for your degree.**
Enter your destination — school and major — and it computes the **cheapest legal
route to that exact diploma**, given your credits, your state, and the rules that
actually bind.

Why this reframe earns its keep:

- **It's a computation, not a listicle.** A route planner has a right answer. A tips app has opinions. Judges can *see* a computation working.
- **It gives you alternative routes**, which is the best UI metaphor available here: **Cheapest / Fastest / Lowest-risk**. That third one is the whole product, see §3.
- **It excludes career-pathing automatically.** Maps doesn't pick your destination. You already decided to cut it; this reframe makes the cut structural instead of a judgment call you have to keep re-making at 2am on day 9.
- **It names a category nobody owns.** "Scholarship finder" is a graveyard. "Degree route planner" is empty.

Never say the word "scholarship" first. It anchors you to the crowded thing.

---

## 2. Narrow the user

"Students" is three different products:

| Segment | Savings potential | Verdict |
|---|---|---|
| HS junior/senior, pre-enrollment | **Highest** — every route still open | ✅ **Primary** |
| College freshman / early sophomore | High — most GECs still unfinished | ✅ Secondary |
| Junior+ | Low — credits already sunk | ❌ Out of scope |
| Adult returner | High but totally different rules (prior learning assessment, competency-based) | ❌ v2 |

**Primary user: a high school senior or college freshman who already knows where
they want to end up.** Not "exploring options" — that's the career-pathing
product you just cut.

**And the payer is the parent.** The student feels the pain; the parent has the
credit card. That gap is the single most important product fact here, and §5
is built on it.

---

## 3. The actual insight: sell certainty, not information

Students don't skip CLEP because they've never heard of it. They skip it because
they're **afraid the credit won't count** — and they're right to be. The failure
mode is real: wrong exam, wrong score, residency cap, credit that lands as
elective filler instead of clearing the requirement.

**So the product is not "here's what you could save." It's "here's what to do,
and here's why it will hold."**

Every recommendation in the plan carries:

- A link to **the institution's own published policy page**
- An **"as of" date**
- A **confidence level** — Guaranteed by statute / Published policy / Needs confirmation
- A **"what could bite you"** note — residency minimum, aid impact, major sequencing

And then the feature that makes the whole thing work:

### The advisor packet

A one-page export the student emails to their academic advisor:

> "I'm planning these 7 credits. Please confirm items 3 and 5."

This is the keystone. It:

- **Neutralizes the harm risk.** The app stops being risky internet advice and becomes a tool that makes the *official* process faster. The human who is actually authorized to confirm stays in the loop by design.
- **Is the differentiator.** No competitor produces an artifact for the advisor meeting.
- **Is the natural paywall.** Free gives you the number; paid gives you the document you can act on.
- **Is the best 20 seconds of the demo video.**

**Lowest-risk route** — the third route option — ranks by confidence rather than
dollars: only statute-guaranteed and published-policy items, nothing marked
*needs confirmation*. It will save less. Show it anyway. It is the most
trustworthy thing in the app and it says out loud that you know where the risk is.

---

## 4. Scope: one state, chosen for machine-readable rules

You cannot cover 4,000 institutions in 13 days, and a shallow national dataset is
worse than a deep local one — it fails exactly where a judge pokes it.

Pick a state where transfer is **statutory**, so the rules are deterministic
rather than scraped guesswork:

| State | Why | Notes |
|---|---|---|
| **Florida** | Statewide common course numbering + AA transfer guaranteed to state universities by statute | **Recommended** — cleanest rules to encode |
| **Texas** | Texas Common Course Numbering System, block-transferable core curriculum | Strong alternative |
| **California** | ASSIST.org is the richest articulation dataset anywhere | Richest, also most complex |

**Florida.** The guarantee is in statute, which means your engine's output is
*provably* correct for the transfer leg rather than a best guess — and "the state
of Florida guarantees this" is a much stronger line in a demo video than "most
schools accept this."

State the coverage limit **out loud in the video.** Stated scope reads as
engineering judgment. Discovered scope reads as a bug.

---

## 5. Monetization — the parent is the customer

RevenueCat SDK is mandatory, so there's a paywall regardless. Make it honest:

| Tier | Contents |
|---|---|
| **Free** | Full savings estimate + route comparison. The whole number, no blur. |
| **Paid** | The advisor packet (PDF), per-item source citations, plan re-checks |

**The conversion mechanic:** a **"Send to a parent"** button. The student builds
the plan, hits share, the parent opens a page showing *"$21,400 — here's the
plan"* — and **the parent hits the paywall.** The person with the budget meets
the price at the exact moment they see the saving.

Price as a **one-time unlock (~$29)** with an optional subscription for ongoing
re-checks each semester as policies change. One-time fits the decision shape;
the subscription is what makes it a business rather than a transaction, and the
hybrid is a legitimately interesting answer for the HAMM category.

**Do not blur the number.** Paywalling the estimate kills the shareable moment,
which is the only growth loop a student app gets.

---

## 6. Cut list

Being explicit so these don't creep back in on day 8:

- ❌ **Career pathing** — agreed, gone
- ❌ **Scholarship search** — crowded, low signal, wrong category anchor
- ❌ **Chat interface** — undifferentiated; the plan *is* the interface
- ❌ **National coverage** — one state, deep
- ❌ **Freeform LLM generation of policy** — retrieval over the curated dataset only. A hallucinated transfer rule is the one bug that turns this from impressive into harmful.

---

## 7. Demo video — first 30 seconds

Judges decide from description, video and screenshots, and want the pitch in the
first two minutes. Structure:

1. **0:00–0:10** — "Four-year degree at UF: $94,000. Here's the same diploma for $61,000."
2. **0:10–0:40** — Live input: UF, Computer Science, 0 credits. Plan generates.
3. **0:40–1:10** — Three routes. Tap Lowest-risk: *"this one only uses credit Florida guarantees by statute."*
4. **1:10–1:40** — Tap a line item → the school's own policy page, as-of date, residency-cap warning.
5. **1:40–2:00** — Generate advisor packet. Send to parent. Paywall.
6. **2:00+** — Coverage limits, stated plainly.

The dollar figure must be on screen before the ten-second mark.

---

## 8. Success metrics

| Metric | Definition |
|---|---|
| Activation | % of installs that complete a plan |
| Aha | % who reach the dollar figure |
| Share rate | % who send to a parent — *the* leading indicator |
| Conversion | parent-view → purchase |
| Trust proxy | % who open at least one source citation |

---

## 9. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Dataset slips past day 2 | **Critical** — everything downstream is a UI over nothing | Build it first; hard-stop the scope at one state |
| Wrong advice harms a student | **High** | Confidence levels + advisor packet + never freeform-generate policy |
| No physical Galaxy device | **High** for store categories | Galaxy Store IAP cannot be tested on emulator. Confirm hardware before committing to the store path; Next Gen doesn't need it |
| Galaxy Store review delay | Medium | Submit by ~Sept 25 |
| Reads as "another scholarship app" | Medium | Lead with the route-planner framing; never say scholarship first |

---

## 10. Build order (13 days)

| Days | Work |
|---|---|
| 1–2 | **Florida dataset** — common course numbering, AA transfer statute, CLEP policies for target universities, residency caps. The moat. |
| 3–5 | Route engine: constraint solver + the three route types |
| 6–8 | Expo app — onboarding, route comparison, line-item detail with citations |
| 9 | RevenueCat SDK, paywall, parent-share flow |
| 10 | Advisor packet PDF export |
| 11 | Design pass (Design Award is live if this is genuinely good) |
| 12 | Demo video — **a full day**, it's most of the score |
| 13 | Galaxy Store submission, repo hygiene, license, Devpost |

Post daily from day 1 for #BuildInPublic — $30k/$20k/$10k for work you're doing anyway.

**Category targets:** Next Gen (floor) · Peace Prize (best thematic fit) ·
Best App for Galaxy · #BuildInPublic · Design Award if the UI lands.
