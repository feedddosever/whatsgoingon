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

### P0 — blocks everything

**1. Does UC award credit for CLEP?**
The seed says **no**, systemwide. This single row drives the entire demo and the
product's core claim. If it's wrong, the pitch is wrong.
→ `admission.universityofcalifornia.edu`, UC credit-by-exam policy.

**2. Cal-GETC areas and unit minimums.**
Cal-GETC replaced IGETC and CSU GE Breadth from Fall 2025. Confirm the current
area list, unit minimums, and whether area 1C is genuinely CSU-only.
→ ICAS / CCC Chancellor's Office Cal-GETC standards.

**3. CSU CLEP acceptance, per campus.**
The seed treats CSU as uniformly CLEP-accepting. It is not — exam lists, minimum
scores and unit grants vary by campus. Verify Long Beach and San Jose State
individually, not from the systemwide page.

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
