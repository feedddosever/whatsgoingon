# Shipaton 2026 — "College Cost Arbitrage" idea assessment

**Verdict: viable, via Next Gen + Peace Prize, if scoped down. Not viable for the Grand Prize.**

Deadline **Sept 30** (13 days). Sources: RevenueCat blog, shipaton.com/next-gen,
shipaton.com/blog/how-we-judge-shipaton (read via search — shipaton.com is
egress-blocked in this container).

---

## Store strategy — CORRECTED (Galaxy Store changes this)

An earlier version of this file said the store-release categories were
unreachable. **That was wrong.** Confirmed:

- Supported stores are **App Store, Google Play, _and Samsung Galaxy Store_**.
- **RevenueCat natively supports Samsung IAP** — Android SDK 10.7.0+, **React Native SDK 10.3.0+**.
- Samsung sponsors a **"Best App for Galaxy"** category: publish to Galaxy Store in-window, give a live listing URL, and describe Galaxy-specific optimization (foldables, Samsung features).
- **Galaxy Store has no equivalent of Google Play's 12-tester / 14-day closed-testing rule** — that policy is Google's, for new personal developer accounts. It's the thing that made a Sept 30 Play release impossible; Galaxy Store routes around it entirely.

**But the beta shortcut is dead:** TestFlight and testing-track builds explicitly
do **not** count as a release. First *public* version must go live Aug 1–Sept 30.

**Two known Galaxy Store risks:**
1. Review turnaround (typically days, not hours) — submit by ~Sept 25, not Sept 29.
2. **Galaxy Store test purchases require a physical Galaxy device** with a Samsung account. No emulator support. If there's no Galaxy hardware on hand, IAP cannot be verified end-to-end.

## Next Gen — the guaranteed floor

Confirmed requirements:

- Demo video + **public open-source repo with a license file**
- **No store release, no paid developer account**
- Verifiable **academic email** on Devpost — ✅ confirmed available
- Store submission is *allowed but not judged* in this category
- **RevenueCat SDK is still mandatory** — all submissions must use it for IAP, subscriptions, or ads

This is a mobile event. Expo / React Native, not web.

**Strategy: Next Gen is the floor, Galaxy Store is the multiplier.**
Next Gen alone needs no store at all. Publishing to Galaxy Store additionally
unlocks Peace Prize, Design Award, HAMM and Best App for Galaxy — all of which
require an in-window store release.

## Category fit — this is the strong part

One app can enter multiple categories. This idea stacks unusually well:

| Category | Fit | Why |
|---|---|---|
| **Next Gen** | ★★★ | Student-only field, no store release. The anchor. |
| **RevenueCat Peace Prize** | ★★★ | Judged on **impact / feasibility / reach**. "Keeps students out of debt" is close to a perfect fit — arguably the best-matched category in the whole event for this idea. |
| **#BuildInPublic** ($30k/$20k/$10k) | ★★ | Judged on the *journey you post*, not the app. Nearly free to stack — just post daily from day one. |
| **Design Award** ($15k/$10k/$5k) | ★★ | Live if the UI is genuinely good. |
| **HAMM** (monetization) | ★ | Weak — see below. |
| **Grand Prize** ($100k) | ✗ | Needs real growth metrics — downloads, revenue, conversion. Impossible in 13 days. |

**Judging reality:** judges decide mostly from **description, video and
screenshots**, and expect the elevator pitch **in the first two minutes**.

---

## The monetization tension

Students are the classic high-need/no-budget segment, and the SDK requirement
means you need a paywall. But **Next Gen and Peace Prize don't reward revenue** —
so target those and don't contort the product chasing HAMM.

Best monetization angle if you want one that isn't cynical: **charge the parent,
not the student.** A one-time unlock for the full exportable plan. Parents of
college-bound kids pay for this; 17-year-olds don't.

---

## The thing that will actually make or break it: data accuracy

The entire value proposition is institution-specific policy, and it's messier
than it looks:

- **CLEP:** ACE only *recommends* credit. **Each institution sets its own policy** — which exams, minimum score, how many credits, and whether it clears a specific GEC requirement or only dumps elective credit.
- **Transfer:** articulation agreements are institution-pair and state specific. A few states have statewide systems (CA's ASSIST, FL, TX common course numbering); most don't.
- **Residency rules:** most colleges require a minimum number of credits earned in-residence, which **caps** how much you can transfer in. This silently invalidates a lot of naive "just CLEP everything" advice.
- **Aid interaction:** excess transfer credit can affect scholarship eligibility, athletic eligibility, and the 150% SAP rule.
- **Major sequencing:** engineering and nursing sequences often can't be compressed the way generic advice implies.

**Wrong advice here costs a real student real money.** Five CLEP exams a target
school won't accept is ~$500 and a wasted semester. That's not a hackathon bug,
it's a harm — and it's also the credibility axis judges will probe.

**Mitigation, and it's also the winning move:** scope to **one state or ~20–50
curated institutions**, cite the source and "as-of" date on every claim, and
**say the coverage limit out loud in the video**. Generate plans by **retrieval
over a curated dataset, never freeform LLM generation** — a hallucinated transfer
policy is the one failure mode that turns this from impressive to dangerous.
Judges reward honest scope; overclaiming coverage is how this loses.

---

## Cut the career-pathing half

Two products in 13 days means neither is good.

- **Savings engine:** sharp, novel, underserved, and *demonstrable with a number*.
- **Career pathing:** vague, crowded, and claimed by every student app in existence.

The pitch "we cut your degree cost by $18,400 and a full year" is a killer first
line. Adding "...and career guidance" makes it weaker, not stronger.

Keep career interest as a *single input* that constrains the major/course plan.
Don't build it as a second feature.

---

## What the winning demo looks like

Input target school + intended major + credits already held →
output a concrete plan with **a dollar figure and a timeline**:

> Bridgewater State, Computer Science, 0 credits
> → 7 GECs via CLEP ($595) + 4 at Massasoit CC ($2,760) + transfer
> → **$21,400 saved, graduate 2 semesters early**
> → every line citing the school's own published policy + as-of date

A number on screen in the first 30 seconds is exactly what wins video-judged
categories.

---

## Build plan (13 days, solo, Expo + RevenueCat)

| Days | Work |
|---|---|
| 1–2 | Curate the policy dataset for one state. **This is the moat and the risk — do it first.** |
| 3–5 | Plan engine: constraint solver over requirements, residency caps, CLEP eligibility |
| 6–8 | Expo app: onboarding, plan view, per-line source citations |
| 9 | RevenueCat SDK + paywall on plan export |
| 10–11 | Design pass (Design Award is live if this is good) |
| 12 | Demo video — budget a **full day**, it's most of the score |
| 13 | Repo hygiene, license file, Devpost submission |

Post daily from day 1 for #BuildInPublic. It's the cheapest prize on the board.

---

## Honest risk list

1. **Academic email** — unverified. Blocks Next Gen entirely if absent.
2. **Dataset is the whole product.** If day 1–2 slips, everything downstream is a UI over nothing.
3. **Store-release categories are gone.** Accept it; don't burn days trying.
4. **Crowded adjacent space.** "Scholarship finder" is saturated — the credit-arbitrage angle is the differentiator, so lead with it and never say the word "scholarship" first.
