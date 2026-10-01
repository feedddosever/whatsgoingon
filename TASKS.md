# Outstanding work

Everything still to do **other than** publishing the app and submitting to
Shipaton. Ordered by what would hurt most if skipped.

---

## 1. Blocking — someone could be harmed or misled

### 1.1 The app targets minors and takes payments
The onboarding offers **9th grade** as an option, so the intended audience
includes 13–14 year olds, and the paywall can charge them. This needs a
deliberate decision before any store listing:

- [x] ~~A purchase notice for school-age students.~~ Anyone who said they are in
      school now sees, above the price, that they should ask a parent or guardian
      and use their payment method. Wording lives in `src/disclaimer.ts`.
- [ ] Answer the store's child-directed / age-rating questionnaire honestly.
      Galaxy Store, Play and App Store all ask, and the answer changes what is
      allowed.
- [ ] Decide whether under-16s should see the paywall at all. `profile.year` is
      already known before the paywall is reachable, so gating it is a small
      change.
- [ ] Confirm RevenueCat's own terms on purchases by minors.

This is not a formality. Everything else on this list is about correctness;
this one is about who is on the other side of the screen.

### 1.2 ~~No disclaimer anywhere in the app~~ DONE

One wording in `src/disclaimer.ts`, used by every surface that states it, so it
cannot drift between screens:

- [x] Permanent on the plan map — not a modal that gets dismissed once.
- [x] In the footer of both printed packets.
- [x] A separate notice on the paywall for school-age students.

### 1.3 Privacy policy and terms — published
- [x] `PRIVACY.md` — plans stay on the device, no accounts, no analytics, no
      advertising; what RevenueCat receives; the web-only warning that clearing
      site data destroys the only record of a purchase.
- [x] `TERMS.md` — not academic or financial advice, not affiliated with any
      institution, confirm in writing before paying, refunds handled by whoever
      took the payment.
- [x] ~~**Both still need a real support email address**~~ Now ONE env var, `EXPO_PUBLIC_SUPPORT_EMAIL`, substituted into both at build time. Still unset — `npm run preflight` fails on it.
- [x] ~~Host both at public URLs~~ `/privacy` and `/terms`, rendered from the Markdown by `scripts/build-landing.mjs`.
- [ ] **CCC course articulations** — most `ccc-*` rows are `needs_check`
      (only Communication Studies 1 is `published`).
      Articulation is institution-pair specific and lives on ASSIST; there is no
      shortcut. This is the largest remaining block of unconfirmed data.
- [ ] **Per-unit tuition** — derived from annual figures. Neither UC nor CSU
      charges per unit, so the headline saving **overstates** for a student
      already enrolled full time. Either confirm a defensible figure or move to
      a tier model.
- [ ] **Fee waivers are modelled as a blanket "eligible → $0"** for CCPG and
      Modern States. Neither has its eligibility rules encoded, so the app
      cannot tell a student whether they actually qualify. The *state* half is
      now right — a waiver-eligible Texan is no longer given a Californian
      discount — but the *student* half is still a yes/no question.
- [ ] **Florida's credit-by-exam list: every row audited against the June 2026
      copy** (2026-10-01, `data/research/VERIFIED-FLORIDA.md`). The adopted text
      is a .docx on flrules.org that our tools could not open — open it by hand
      before promoting any Florida exam row past `needs_check`.
- [ ] **Texas per-campus charts beyond the big three.** UT Austin, Texas A&M and
      Texas Tech have their own exam tables in the dataset; every other Texas
      campus uses the common table. Tuition is a $400/SCH statewide middle.
- [ ] **New York and Pennsylvania open items.** Oneonta's residency and
      Oswego's two-year cap need a registrar answer; Queens residency (30 or 45);
      several SUNY and CUNY per-exam charts sit in tools that need a browser.
      Each report in `data/research/VERIFIED-*.md` ends with its list.
- [ ] **AP US History / AP US Government have no California rule.** Added to the
      national exam list for Texas and Florida; a Californian student holding
      either is correctly told we have no record, which is very likely wrong.
      Confirm against the Cal-GETC Standards table and add the rows.

## 3. Coverage gaps found by audit

- [x] ~~No way to send the plan to a parent or guardian.~~ The advisor packet now
      takes an audience: a guardian gets the cost comparison up front and a
      plain-language ask, with **the same evidence and the same unconfirmed rows
      still marked**. Softening those for a parent would be the dishonesty the
      document exists to prevent.

- [x] ~~**Area 4 has no community-college option.**~~ Added. A fee-waiver student
      now reaches **$0** for a complete plan at a UC, where they were previously
      charged $99 for one AP exam purely because we held no CCC row for area 4.
- [ ] **Area 1B and Area 6 have no AP route at all** (correctly — the standard
      says so), so the lowest-risk route stops at 8 of 10 until the CCC rows
      behind them are confirmed. Same fix as 2.1.
- [ ] **Out-of-state coursework cannot be entered** (`VERIFICATION.md` P2b). A
      student who studied in one state and is heading to another is told to
      retake requirements they may already hold. This got *more* pressing with
      five states in the dataset, not less: the app can now show a student both
      states and still cannot connect them.
- [ ] **No community colleges as destinations, in any state.** They are credit
      sources only. In Florida that is a real gap, because the Associate in Arts
      — not the university — is the thing the statutory guarantee attaches to.
- [x] ~~**47 states and DC have no campuses and say nothing.**~~ Every
      jurisdiction now carries its statewide transfer rule, or says it has none
      (Delaware, DC). The picker offers all 51 and says full access to other
      states is coming.
- [ ] **5 of the 46 statewide rules are still `needs_check`** (DE, DC, HI, ID,
      NV); the other 41 were read at source on 2026-10-01. Promote the rest the
      same way — by reading the document, not by trusting the grade.
- [ ] **Campus pricing is CA/TX/FL/NY/PA only.** Next most valuable by
      enrolment: Illinois (IAI), Georgia (USG Core IMPACTS), North Carolina
      (CAA), Ohio (Ohio Transfer 36).

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

## 5. Store assets

Run `npm run preflight` — it checks these rather than trusting this list.


- [x] ~~**The icon is still the Expo default.**~~ Replaced; HTML source in `scripts/art/`.
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

**Pricing a campus against a framework it only partly uses.** Penn State, Pitt
and Temple accept a limited list of Pennsylvania framework courses and run their
own general education, so they are left out rather than priced against a
requirement list their students do not follow. The same test applies to any
future state.
