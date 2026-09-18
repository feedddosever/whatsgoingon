# Shipaton 2026 — what is actually left

Deadline **Sept 30**. Everything below was confirmed from RevenueCat's own pages
earlier in this project; re-check the official rules before you rely on any of it,
because this environment cannot reach shipaton.com.

---

## ⚠ The blocker: payment is stubbed, and the SDK is mandatory

**Every Shipaton submission must use the RevenueCat SDK** for in-app purchases,
subscriptions, or ads. That applies to Next Gen too — the category waives the
*store release*, not the SDK.

Right now the app does not use it. `src/purchases/revenuecat.ts` is written,
reviewed and tested, but `App.tsx` calls `grantPacket()` instead, which unlocks
the advisor packet for free. That was a deliberate decision to keep building, and
**it has to be undone before you submit.**

Restoring it is small: put `PaywallScreen` back in place of `grantPacket()` in
`App.tsx`, wire `purchaseAdvisorPacket` / `restorePurchases` / `getAdvisorPacketPrice`,
and set `EXPO_PUBLIC_REVENUECAT_KEY`. The wiring existed and was removed in one
commit; `git log` has the shape of it.

What it needs from you:

- A RevenueCat account and a **public SDK key for the right store**. Galaxy Store
  needs the Amazon/Samsung key, not the Google Play one.
- An entitlement whose identifier is exactly **`advisor_packet`**. Name it
  anything else and the purchase completes, the student is charged, and nothing
  unlocks. The wrapper detects that specific case and says so rather than failing
  silently, but it is a configuration error worth not making.
- A **physical Galaxy device** to test a real purchase. No emulator. Your Tab
  S6 Lite qualifies.

**Do this first.** It gates every category.

---

## Pick your path

### Path A — Next Gen (student category)

Lowest friction, smallest field, and you have the academic email.

- [ ] **Demo video** — the bulk of the score. See below.
- [ ] **Public repo with a LICENSE file** — done, MIT, in the repo root.
- [ ] **Academic email on Devpost** — you confirmed you have one.
- [ ] **RevenueCat SDK in use** — see the blocker above.
- [ ] No store release required. A store release is *allowed* but is **not judged**
      in this category, so it is not worth burning days on for Next Gen alone.

### Path B — store categories (Peace Prize, Design, Best App for Galaxy, HAMM)

Everything in Path A, plus a real listing:

- [ ] **First public release between Aug 1 and Sept 30** on App Store, Google Play
      or Galaxy Store. TestFlight and testing-track builds explicitly do **not**
      count.
- [ ] Galaxy Store is the realistic route — see `docs/BUILD-APK.md`.
- [ ] Seller registration can take days. **Start it before you need it.**

The **Peace Prize** is the strongest thematic fit in the whole event for this app:
it is judged on impact, feasibility and reach, and "keeps students out of debt"
is close to a perfect match.

**Best App for Galaxy** wants a description of Galaxy-specific optimisation.
You have an S Pen and a large screen — annotating the advisor packet before
sending it is a genuine use of that hardware, not a bolted-on gimmick.

### Path C — #BuildInPublic ($30k / $20k / $10k)

Judged on the journey you post, not the app. Nearly free to stack if you start
posting now. It is the cheapest prize on the board and the only one where the
work you have already done counts directly.

---

## The video (this is most of the score)

Judges decide largely from the description, video and screenshots, and expect the
pitch in the **first two minutes**. Suggested shape:

1. **0:00–0:10** — the number. *"Four-year degree at UC Davis: $17,250 of general
   education. Here it is for $99."*
2. **0:10–0:40** — live input: 11th grade, STEM, fee waiver. Plan generates.
3. **0:40–1:10** — **the moment that sells it.** Pick UC Berkeley, tick two CLEP
   exams. The app says UC awards no CLEP credit at all — money this student was
   about to waste.
4. **1:10–1:30** — the same CLEP against a CSU. Different, quieter warning: the
   campus accepts it, and it still clears no Cal-GETC requirement. This is the
   failure nobody would catch on their own.
5. **1:30–1:50** — tap a line item: the campus's own policy page, an as-of date,
   a confidence badge. Then show a "needs confirming" row looking visibly less
   certain. Say out loud that the app refuses to bluff.
6. **1:50–2:10** — generate the advisor packet, show the PDF.
7. **2:10+** — coverage limits, stated plainly.

Record it on the Tab S6 Lite so the Galaxy angle is visible.

---

## Be honest about the data — it is a strength here

Two things will be obvious to any judge who pokes at it, and both read better
volunteered than discovered:

1. **The lowest-risk route is empty.** By design. It only uses rows confirmed
   against a published source, and the AP exam→Cal-GETC-area mappings are still
   `needs_check`. Confirming those against the Cal-GETC v1.4 standard is roughly
   an hour of work and turns that card from empty into the app's most trustworthy
   screen. **Highest-value hour available before you submit.**
2. **Coverage is one state and a handful of campuses.** Say so in the video.
   Stated scope reads as engineering judgement; discovered scope reads as a bug.

`data/VERIFICATION.md` lists every unconfirmed row in priority order.

---

## Rough order

| When | What |
|---|---|
| First | RevenueCat account, entitlement `advisor_packet`, restore the paywall |
| First | Galaxy Store seller registration (slow, pure waiting) |
| Then | Confirm the AP→area mappings — one hour, biggest single quality win |
| Then | `eas build --profile preview`, install on the Tab, test a real purchase |
| Then | Upload to Galaxy Store, allowing days for review |
| Last | Record the video. Budget a full day; it is most of the score |
| Throughout | Post for #BuildInPublic |

Submit with margin. RevenueCat's own advice is to submit for store review **a
week early**, and the Galaxy Store review clock is not yours to control.
