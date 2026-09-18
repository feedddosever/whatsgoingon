# Dataset verification worklist

**Every row in `data/ca/` is currently marked `unverified`.** They were seeded
from model knowledge with a May 2026 cutoff, and this container's egress proxy
blocks `assist.org`, `calstate.edu`, `universityofcalifornia.edu`,
`clep.collegeboard.org` and `cccco.edu` — so none of it could be checked against
a primary source here.

The engine is built so this is **a data task, not a code task**. Fill in
`as_of` and raise `confidence`, and the lowest-risk route lights up on its own.
No engine change required.

## The rule

`confidence` may only be raised by a human who has opened the source URL:

| Level | Means |
|---|---|
| `statute` | Guaranteed by California law (cite the code section) |
| `published` | On the institution's own published policy page |
| `needs_check` | Plausible, not confirmed — never shown to a student as a promise |
| `unverified` | Seeded, untouched. **Default. Do not ship in this state.** |

`npm test` fails the lowest-risk route while unverified rows remain, so the
dataset cannot quietly ship half-checked.

## Priority order

### P0 — RESOLVED 2026-09-18

Confirmed from a 2026-27 California research brief citing LAO budget reports, the
Cal-GETC v1.4 standard, CSU PolicyStat and UC admissions policy. Rows raised to
`published` with `as_of: 2026-09-18`.

**1. Does UC award credit for CLEP? — NO. Confirmed.**
UC accepts only AP, IB and A-Level. It awards nothing for CLEP or DSST, and does not
honour credit posted to a third-party transcript (Sophia, Study.com, StraighterLine,
Saylor). The product's central claim holds.

**2. Cal-GETC — confirmed.** v1.4, effective 2026, replaced IGETC and CSU GE Breadth
under AB 928. Area 1C (Oral Communication) is CSU-only.

**3. CSU CLEP acceptance — confirmed, and it overturned a modelling assumption.**
CSU accepts 31 of 33 CLEP exams toward a degree, **capped at 30 units** — but
**CLEP cannot satisfy Cal-GETC**. The dataset previously had CLEP clearing Cal-GETC
areas at CSU. That was wrong, and it was the kind of wrong that costs a student money:
it would have told them to buy an exam that cannot do the job they were buying it for.
All CLEP rows now carry `satisfies_area: null`.

**4. CCC enrolment fee — confirmed.** $46/unit, unchanged since summer 2012, no increase
proposed for 2026-27. 3 units = $138.

### P0-NEW — opened by the same brief

**A. CLEP at CSU is accepted but clears no Cal-GETC area, and the app does not say so.**
`strandedCredits()` only fires when `accepts_clep` is false, so a student holding CLEP
and targeting a CSU gets no warning at all — their credit silently clears nothing. They
need to be told it counts toward the degree (30-unit cap) but not toward Cal-GETC.
**This is now the most valuable unbuilt warning in the app.**

**B. Per-field provenance.** `Institution.provenance` is one record covering several
independent claims. The exam policy is now `published`; `residency_min_units` and
`max_transfer_units` in the same row are still unconfirmed, and a residency warning
therefore renders a `published` badge it has not earned. The caveat is spelled out in
each row's `note` as a stopgap. The real fix is provenance per field.

**C. Missing pathways the brief documents and the engine cannot express:**
- **ADT (Associate Degree for Transfer)** — guarantees CSU admission with junior standing.
- **UC TAG** — guaranteed transfer at Davis, Irvine, Merced, Riverside, Santa Barbara,
  Santa Cruz. Berkeley, UCLA and San Diego do **not** participate. Currently only a note.
- **Fee waivers** — CCPG waives the CCC $46/unit fee; Modern States covers the CLEP exam
  fee. Both can take a route's cost to **$0** and would likely reorder every route.
- **IB** — accepted by UC, CSU and CCC; not yet in the dataset.
- **Dual enrolment / CCAP** — tuition-free college units for high schoolers, up to 15
  units/term. For the pre-enrolment student this app targets, this may be the single
  largest saving available and it is entirely unmodelled.

### P1 — needed for a credible plan

**4. Residency minimums.** Seed: UC 24 semester units, CSU 30. Confirm per campus.

**5. Transfer unit caps.** Seed: 70 semester units from CCC. Confirm, and confirm
how it interacts with exam credit.

**6. CCC → UC/CSU course articulation.** Every `ccc_course` row must be confirmed
on **ASSIST.org**, which is the authoritative source. Course-to-course
articulation is institution-pair specific; nothing here can be generalised.

### P2 — materially changes the numbers

**7. Fee waivers — these can take cost to $0 and are currently missing.**
- **California College Promise Grant** waives CCC enrolment fees for eligible students.
- **Modern States "Freshman Year for Free"** can cover the CLEP exam fee.

Both are real, both are large, and neither is modelled yet. They likely **invert
the cheapest route** for most eligible students, which is exactly the kind of
result worth putting on screen.

**8. Current CCC per-unit enrolment fee.** Seed assumes $138 for 3 units.

**8a. Per-unit tuition at each UC/CSU campus (`cost_per_unit_usd`).**
Seed assumes **$490/unit UC, $396/unit CSU**. These drive `baselineCost()`, which is
the "do nothing" figure the headline saving is measured against — so an error here
inflates or deflates the single number the whole product is selling.

**Known modelling simplification:** UC and CSU charge **tiered flat-rate tuition**, not
per unit. A full-time student pays the same whether they take 12 units or 18. Treating
tuition as linear per-unit is an approximation that is closest to true for part-time
students and overstates the saving for full-timers. Either confirm a defensible per-unit
figure and keep the approximation (documenting it in the app), or move to a tier model.
**Do not put the headline saving on screen until this is settled** — it is the most
scrutinised number in the demo.

**9. CLEP sitting fees.** Test centres charge on top of the exam fee.

### P3 — known gaps, deliberately not seeded

- **ADT / AA-T / AS-T** (SB 1440): guarantees CSU junior standing. This is a
  `statute`-grade row and probably the strongest thing that could be added.
- **UC TAG**: transfer admission guarantee, offered by some UC campuses.
- **Major-specific lower-division sequences** — the engine models GE only. An
  engineering or nursing sequence cannot be compressed the way GE can, and the
  app should not imply otherwise.
- **Financial aid interactions** — excess credit can affect eligibility and the
  150% SAP rule.

## How to verify a row

1. Open `source_url`. If it 404s or redirects, find the real page and update it.
2. Confirm the claim **on that page**, not from a summary or a search snippet.
3. Set `as_of` to today's date.
4. Raise `confidence` to `published`, or `statute` with the code section in `note`.
5. Put what could bite the student in `note` — residency caps, aid impact, score minimums.
6. Run `npm test`.

A row whose source cannot be found stays `unverified` and is **removed from the
shipped dataset**. An empty app that is correct beats a full one that is not —
a student who takes five exams their target school won't accept is out roughly
$500 and a semester.
