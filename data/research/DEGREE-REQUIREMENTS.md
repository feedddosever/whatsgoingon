# Degree requirements and major prep — research of record

Read 2026-09-27/28 for the "What's a degree made of?" screen. Every row in
`data/{ca,tx,fl}/degree.ts` cites one of the pages below; nothing there was
recalled. Scope is deliberate: the **structure** every student is held to (units,
general education, residency, graduation rules) and the **statewide** major prep
each state publishes. Campus-by-campus, major-by-major catalogues are out of
scope — thousands of programs, each revised yearly, and no way to source them
honestly at this size.

## California

| Claim | Source | Grade |
|---|---|---|
| UC: 24 of the final 30 semester units (35 of 45 quarter) in residence | UC Senate Regulation 630 — senate.universityofcalifornia.edu/…/rpart3.html | A (read) |
| UC: Entry Level Writing Requirement; three ways to meet it | SR 636, same page | A |
| UC: American History and Institutions, by exam or course | SR 638, same page | A |
| UC total units are campus-set; Berkeley L&S 120 semester units | lsadvising.berkeley.edu/degree-requirements | C (search summary only) |
| UC Transfer Pathways: 27 majors; course lists for business, CS, mech-E, biological sciences, psychology, economics, English, history | admission.universityofcalifornia.edu/…/transfer-pathways/*.html | A |
| Biological Sciences Pathway replaces four biology Pathways from fall 2027 | biological-sciences.html | A |
| CSU: 120 units exactly for most bachelor's (Title 5 § 40508, § 40500(d)) | law.cornell.edu/regulations/california/5-CCR-40508 | A |
| CSU: major ≥ 24 units, 12 upper-division (§ 40500(b)) | 5-CCR-40500 | A |
| CSU: residence 30 units, 24 upper-division, 12 in major (§ 40403) | 5-CCR-40403 | A |
| CSU: US History, Constitution and American Ideals (§ 40404) | 5-CCR-40404 | A |
| CSU: GE ≥ 43 units, 9 upper-division, CCC certifies ≤ 34 (§ 40405.1) | 5-CCR-40405.1 | A |
| ADT: priority admission to a CSU (not campus/major); 60 more units if similar major; minor courses not covered | calstate.edu/apply/transfer/pages/ccc-associate-degree-for-transfer.aspx | A |

## Texas

| Claim | Source | Grade |
|---|---|---|
| 6 SCH government incl. U.S. and Texas constitutions (TEC § 51.301) | law.justia.com mirror of the statute | A |
| 6 SCH American history, ≤ 3 may be Texas history (TEC § 51.302) | texas.public.law mirror | A |
| Degree length capped at the accreditor's minimum unless a compelling reason (TEC § 61.0515, amended by S.B. 530, 2025) | law.justia.com | A |
| Field of Study: block transfer into the major; partial FOS still counts course by course | highered.texas.gov/texas-direct | A |
| FOS status (Aug 2026): Business*, Communications, Criminal Justice*, Education, History B.S., Kinesiology, Nursing, Political Science*, Psychology, Social Work, Sociology* complete; Biology, CS, English, History B.A. pending electives; Engineering subcommittee fall 2026; legacy engineering FOS extended to 31 Aug 2027 | highered.texas.gov/texas-direct | A |
| Business FOS courses + every university's directed electives | reportcenter…/revised-field-of-study-for-business-administration (July 2023) | B — *revised Aug 2026, newer version not found* |
| Psychology FOS + directed electives | reportcenter…/revised-fos-psychology-final (Oct 2023) | A |
| Nursing FOS + directed electives | reportcenter…/revised-fos-nursing-final (Oct 2023) | A |
| Sociology FOS + directed electives | reportcenter…/revised-field-of-study-for-sociology (July 2023) | B — *revised Aug 2026* |

\* = marked "revised as of August 2026" on the Texas Direct tracker. The rows
built from the older documents are `needs_check` and say why.

## Florida

| Claim | Source | Grade |
|---|---|---|
| Bachelor's ≤ 120 hours incl. 36 GE (s. 1007.25(10)) | flsenate.gov/Laws/Statutes/2025/1007.25 | A |
| GE 36 hours; ≥ 1 core course in each of 5 areas; core accepted on transfer (s. 1007.25(3),(8)) | same | A |
| Civic literacy: course **and** assessment for 2021-22+ entrants (s. 1007.25(5)(b)) | same | A |
| Common prerequisites offered and accepted by all (s. 1007.25(7)) | same | A |
| ≥ half the degree achievable lower-division (s. 1007.25(12)) | same | A |
| Writing (6 English + 6 writing-intensive) and 6 math ≥ college algebra, C or higher, before upper division (Rule 6A-10.030) | flrules.elaws.us (unofficial compilation) | B |
| Business administration & management common prerequisites (program 3654, UF entry) | cpm.flvc.org/programs/year/2026/3654 | A (automated browser) |
| Psychology (3527) | cpm.flvc.org/programs/year/2026/3527 | A (automated browser) |
| Nursing, pre-licensure (3620) | cpm.flvc.org/programs/year/2026/3620 | A (automated browser) |
| Biology (3459) — alternatives per block, summarised by us | cpm.flvc.org/programs/year/2026/3459 | B |
| Computer science — only the Florida Poly / UNF / UWF track (3344); one course untitled | cpm.flvc.org/programs/year/2026/3344 | B |
| English language and literature (3444) — ENC x101 and ENC x102 only | cpm.flvc.org/programs/year/2026/3444 | A (automated browser) |
| History, track 1 (3704) — AMH x010 plus two history courses, alternatives summarised by us | cpm.flvc.org/programs/year/2026/3704 | B |

The manual is a JavaScript single-page app: a plain fetch returns only its
header. It was read with a TinyFish browser run per program — a five-program
run timed out after 118 steps; one program per run finished in 8–12 steps.

## Both Texas and Florida

| Claim | Source | Grade |
|---|---|---|
| Bachelor's ≥ 120 SCH (Standard 9.2); GE ≥ 30 (9.3); ≥ 25 % of hours from the awarding institution (9.4) | sacscoc.org 2024 Principles of Accreditation | A |

## Corrections this research forced

- **UC and CSU residency were `needs_check` with no source.** Both are now backed:
  UC by Senate Regulation 630 (`published`), CSU by Title 5 § 40403 (`statute`).
  The figures (24 and 30) were right; the confidence was understated.
- **Texas and Florida residency (30) now cite SACSCOC** but stay `needs_check`:
  30 is the accreditor's floor (25 % of 120), and a campus may require more.
- **Texas 120-hour rule is not what it was.** TEC § 61.0515 no longer names 120;
  since S.B. 530 (2025) it caps a degree at the accreditor's minimum. The 120
  comes from SACSCOC Standard 9.2, which also allows fewer with justification.
- **A test asserted UC residency was unconfirmed.** It was a snapshot of the data,
  not an invariant; it now checks what it meant — that a residency warning cites
  its own source — and asserts the unconfirmed case on a Texas campus.
