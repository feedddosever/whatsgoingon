# Outstanding work

Everything still to do **other than** publishing the app and submitting to
Shipaton. Ordered by what would hurt most if skipped.

---

## 1. Blocking — someone could be harmed or misled

### 1.1 The app targets minors and takes payments
The onboarding offers **9th grade** as an option, so the intended audience
includes 13–14 year olds, and the paywall can charge them. This needs a
deliberate decision before any store listing:

- [ ] Answer the store's child-directed / age-rating questionnaire honestly.
      Galaxy Store, Play and App Store all ask, and the answer changes what is
      allowed.
- [ ] Decide whether under-16s should see the paywall at all. `profile.year` is
      already known before the paywall is reachable, so gating it is a small
      change.
- [ ] Confirm RevenueCat's own terms on purchases by minors.

This is not a formality. Everything else on this list is about correctness;
this one is about who is on the other side of the screen.

### 1.2 No disclaimer anywhere in the app
The app tells students how to spend money on credit that may not transfer. The
codebase is built around that risk — provenance on every claim, an advisor
packet, confidence badges — but **there is no stated disclaimer**.

- [ ] Add a short, permanent line: this is planning help, not academic advice,
      and every item needs confirming with the campus before paying.
- [ ] It belongs on the plan map and in the advisor packet, not buried in a
      settings screen nobody opens.

### 1.3 Privacy policy and terms do not exist
- [ ] Write a privacy policy. It is genuinely short: plans are stored locally on
      the device, nothing is uploaded, there are no accounts. Say exactly that.
- [ ] Note what RevenueCat receives when a purchase happens.
- [ ] Both need public URLs before a store listing will accept them.
- [ ] Support contact address for the listing.

---

## 2. Data still unconfirmed

Tracked in full in `data/VERIFICATION.md`. The ones that change a number a
student sees:

- [ ] **CCC course articulations** — every `ccc-*` row is `needs_check`.
      Articulation is institution-pair specific and lives on ASSIST; there is no
      shortcut. This is the largest remaining block of unconfirmed data.
- [ ] **Residency minimums** (UC 24 / CSU 30) and the **70-unit transfer cap** —
      unconfirmed, and deliberately carrying no source link because the
      exam-policy page does not cover them.
- [ ] **Per-unit tuition** — derived from annual figures. Neither UC nor CSU
      charges per unit, so the headline saving **overstates** for a student
      already enrolled full time. Either confirm a defensible figure or move to
      a tier model.
- [ ] **Fee waivers are modelled as a blanket "eligible → $0"** for CCPG and
      Modern States. Neither has its eligibility rules encoded, so the app
      cannot tell a student whether they actually qualify.

## 3. Coverage gaps found by audit

- [ ] **Area 4 (Social & Behavioural Sciences) has no community-college option** —
      only AP. A fee-waiver student gets every other requirement free and is
      still charged $99 here, purely because we hold no CCC row for it. Adding
      one is the single cheapest improvement to the headline number.
- [ ] **Area 1B and Area 6 have no AP route at all** (correctly — the standard
      says so), so the lowest-risk route stops at 8 of 10 until the CCC rows
      behind them are confirmed. Same fix as 2.1.
- [ ] **Out-of-state coursework cannot be entered** (`VERIFICATION.md` P2b). A
      student who studied outside California is told to retake requirements they
      may already hold.

## 4. Untested on real hardware

- [ ] **The paywall and Customer Center have never run.** They need a real EAS
      build on the Galaxy Tab — `react-native-purchases-ui` does not work in
      Expo Go, and Galaxy Store IAP cannot be tested on an emulator.
- [ ] **The advisor packet has never been judged as a printed page.** It renders
      and the HTML is escaped, but nobody has looked at the PDF on paper. It is
      the product's keystone artifact.
- [ ] **Android dashed borders**: RN renders `borderStyle: 'dashed'` as solid
      when border widths are uneven. Not reachable today, but it is how
      "unverified" is signalled, so it becomes a real bug the moment a campus
      policy drops to `needs_check`.

## 5. Store assets not started

- [ ] **The icon is still the Expo default.** So is the splash.
- [ ] Screenshots at phone **and** tablet sizes — take the tablet ones on the
      Tab S6 Lite rather than faking them.
- [ ] Store description, category, keywords.
- [ ] Decide the app name and bundle id **before** first publish —
      `com.degreeroute.app` is permanent once listed.

## 6. Keeping it true after launch

- [ ] Every row carries an `as_of` date for a reason. Policies change by catalog
      year, and a stale row looks identical to a fresh one. Set a re-check
      cadence — annually at minimum, ahead of each catalog year.
- [ ] Cal-GETC is at v1.4. When v1.5 lands, the AP table has to be re-read, not
      assumed unchanged.
- [ ] Watch for the Middle Class Scholarship coverage reduction and any CCPG
      threshold changes — both move real numbers.

---

## Deliberately not on this list

**Expanding beyond California.** Cal-GETC is a statewide pattern created by
AB 928; most states have no equivalent, so the engine's core assumption — one GE
pattern, campuses varying only at the edges — would not hold. That is a redesign,
not a data addition, and it should be a decision rather than a drift.
