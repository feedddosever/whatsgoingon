# California verification: Degree Route `data/ca/`

All sources below were opened on **2026-10-01** with TinyFish `fetch_content`. Quotes are verbatim
from the fetched text. Nothing here is from memory. No repo files were edited.

Summary of verdicts

| # | Item | Verdict |
|---|------|---------|
| 1 | UC_COST | PARTLY: tuition and fees confirmed, campus-fee figure wrong |
| 2 | CSU_COST | PARTLY: tuition confirmed; $2,194 is CSU's published average but it is a 2025-26 figure |
| 3 | ASSIST / CLEP_POLICY | CORRECTED: CLEP College Composition earns 0 units at CSU; "31 of 33" not reproducible; source URL is 404 |
| 4 | CAL_GETC_IB | CORRECTED: mechanism confirmed; 3 of 13 subject rows are wrong, 1 is unsafe for UC |
| 5 | CAL_GETC_ALEVEL | CORRECTED: A-Levels are not in the Cal-GETC exam tables at all; the "Cambridge 2013" rule is UCSB-only |
| 6 | CSU_DSST | PARTLY: no systemwide DSST policy; DSST is only named on a veterans page |
| 7 | BERKELEY_LS | CONFIRMED (quote below) |
| 8 | AP to Cal-GETC rows | 18 of 19 rows CONFIRMED; AP Environmental Science units CORRECTED (4 to 3) |

---

## 1. UC_COST (`data/ca/institutions.ts`)

**App claim:** "$15,588 systemwide tuition and fees plus ~$1,650 campus-based fees", divided by 30 units, is about $575 per unit (`UC_PER_UNIT = 575`). Source is the LAO 2026-27 UC budget report.

**VERDICT: PARTLY.** The $15,588 figure is correct. The ~$1,650 campus-fee figure does not match any published source I found.

- UCOP 2026-27 fee schedule, for residents in the cohort first enrolled in 2026-27: tuition **$14,202** plus Student Services Fee **$1,386** = **$15,588**.
  - URL: https://www.ucop.edu/operating-budget/_files/fees/202627/2026-27.pdf ("Source: Office of the President, Budget Analysis and Planning, 6/17/26")
  - Quote: "UG Cohort First Enrolled in AY 2026-27 $14,202" (Tuition) and "UG Cohort First Enrolled in AY 2026-27 $1,386" (Student Services Fee).
  - Caveat: the PDF says "Figures for tuition and fees represent currently approved or proposed amounts and may not be final."
  - Cohort note: UC uses the Tuition Stability Plan, so continuing cohorts pay less. For example, the 2025-26 cohort pays $13,602 + $1,332 = $14,934. A transfer student entering UC in 2026-27 is in the 2026-27 cohort. UCLA adds: "your tuition/fee costs will be based on the year you were admitted to the University of California (UC) system".
- Average campus fee, from the LAO EdBudget table "Tuition and Fees by Higher Education Segment" (January 2026, published 2026-01-24):
  - URL: https://lao.ca.gov/Education/EdBudget/Details/1036
  - Quote: "Undergraduate tuition and fees c | $14,436 | $14,934 | $15,588" and "Average campus fee d | 1,726 | 1,812 | 1,852". The columns are 2024-25 actual, 2025-26 actual and 2026-27 assumed. Footnote: "For 2026-27, we assume campus fees increase on average by 5 percent. UC amount reflects average for undergraduates".
  - **UC average campus fee is $1,852 (2026-27 assumed) or $1,812 (2025-26 actual), not ~$1,650.**
- Campus examples:
  - **Berkeley**, 2026-27 cohort, per semester (https://registrar.berkeley.edu/tuition-fees/fee-schedule/): "Berkeley Campus Fee | 936.00", "Transit Fee | 236.00", "Instructional Resilience & Enhancement Fee | 141.00".
    - That comes to $1,313 per semester, or **$2,626 per year**. This excludes the waivable health insurance fee ($2,533 per semester) and the one-time $250 document fee.
    - Systemwide fees plus campus fees = $18,214. This matches the snippet on admissions.berkeley.edu "Tuition and Fees $18,214", which was seen in a search result only and not opened.
  - **UCLA**, new students in 2026-27 (https://financialaid.ucla.edu/go/coa): "University Fees (UC Systemwide Tuition: $15,588, Campus fees: $842) $16,430".
  - UC Admissions now shows **2027-28** figures, not 2026-27: "UC Tuition | $16,278", "Campus fees | $1,900" (https://admission.universityofcalifornia.edu/tuition-financial-aid/tuition-cost-of-attendance/).
- Source problem: the app's LAO report URL (`/Publications/Report/2026-27-budget-university-of-california`) returned **HTTP 500** on 2026-10-01. That may be temporary, but I could not read the "$1,650" in it.

**Recomputed with the file's own method (÷ 30 semester units):**

| Basis | Annual | Per unit |
|---|---|---|
| Systemwide $15,588 + LAO average campus fee $1,852 (2026-27) | $17,440 | **≈ $581** |
| Systemwide $15,588 + $1,812 (2025-26 actual average) | $17,400 | ≈ $580 |
| UCLA ($15,588 + $842) | $16,430 | ≈ $548 |
| Berkeley ($15,588 + $2,626) | $18,214 | ≈ $607 |

**Recommended value:** `UC_PER_UNIT ≈ 581`. The current 575 is about $6 per unit low. Note that the spread between campuses (about $548 to $607) is larger than the error. The best source for the systemwide figure is the UCOP PDF, and for the average campus fee the LAO EdBudget table.

---

## 2. CSU_COST

**App claim:** "$6,838 systemwide tuition plus ~$2,194 average campus fees" for 2026-27, which comes to about $301 per unit.

**VERDICT: PARTLY.** The tuition is confirmed. $2,194 is CSU's own published average, but CSU labels it as based on 2025-26.

- https://www.calstate.edu/apply/paying-for-college/csu-costs/tuition-and-fees/Pages/basic-tuition-and-fees.aspx
  - Quote: "The table below shows the 2026-27 tuition levels ... Undergraduate 6.1+ units $3,419 $6,838 / 0-6 units $1,981 $3,962".
  - These are per semester and per year respectively. Students taking 6 or fewer units pay $3,962 per year.
- https://www.calstate.edu/csu-system/about-the-csu/facts-about-the-csu/Pages/student-costs.aspx
  - Quote: "CSU Tuition and Fees: 2026-27* Undergraduate: $6,838 ... (Campus mandatory fees add an average of $2,194** to student costs.) ... **Based on 2025-26 tuition."
- LAO EdBudget (https://lao.ca.gov/Education/EdBudget/Details/1036)
  - Quote: "Undergraduate tuition | $6,084 | $6,450 | $6,838" and "Average campus fee d | 1,981 | 2,194 | 2,304".
  - So **$2,194 is the 2025-26 actual** and **$2,304 is LAO's 2026-27 assumption**. The footnote says the CSU average "reflects average for both undergraduate and graduate students."
- The app's LAO CSU report URL also returned **HTTP 500** on 2026-10-01.

**Recomputed:**
- ($6,838 + $2,194) ÷ 30 = $9,032 ÷ 30 = **$301**. This matches the file, but uses a 2025-26 fee.
- ($6,838 + $2,304) ÷ 30 = $9,142 ÷ 30 = **≈ $305**.

**Recommendation:**
- Keep 301 but relabel the fee as "2025-26 average (CSU)", or use 305 with the LAO 2026-27 assumption.
- Point `source_url` at calstate.edu rather than the LAO page that returned 500.

---

## 3. ASSIST / CLEP_POLICY (`data/ca/acceptance-rules.ts`)

**App claim:** "CLEP cannot be used for Cal-GETC. CSU accepts 31 of 33 CLEP exams toward a degree (capped at 30 units, some needing higher scores), but not against the GE transfer pattern. UC awards no CLEP credit whatsoever."

The CLEP rows are:
- `clep-college-composition`: min 50, **3 units**, areas []
- `clep-college-algebra`: min 50, 3 units, areas []
- `clep-intro-psychology`: min 50, 3 units, areas []

**VERDICT: CORRECTED.**

**(a) "CLEP cannot be used for Cal-GETC": CONFIRMED.**
- Cal-GETC Standards v1.4, §6.3 (https://icas-ca.org/wp-content/uploads/2026/07/Cal-GETC_Standards_1v4_Final_r.pdf). Quote: "6.3 College Level Examination Program (CLEP) CLEP cannot be used for Cal-GETC."
- The same document, §3, says: "Although CLEP cannot be used for Cal-GETC (Section 6.3), the CSU has a system-wide policy for CLEP exams and awarding transfer credit for admission or towards the completion of CSU GE based on these exams."

**(b) CSU CLEP table.** Source is the CSU Systemwide Credit for External Examinations policy (PolicyStat 20781575, Effective 6/25/2026). The old link https://calstate.policystat.com/policy/17947386/latest/ redirects to /policy/20781575/latest/.
- Policy quote: "This CSU-approved list of external examinations does not apply to Cal-GETC certification areas."
- **`clep-college-composition` is WRONG.** The chart reads: "CLEP College Composition | 50 | 0 | 0 | n/a" and "CLEP College Composition - Modular | 50 | 0 | 0 | n/a". CSU awards **0 units**, so the app's 3 units over-credits a student.
- `clep-college-algebra` is confirmed at 3 units: "CLEP College Algebra | 50 | 3 | 3 | 2". It also counts toward **CSU GE Area 2**, but not toward Cal-GETC.
- `clep-intro-psychology` is confirmed at 3 units: "CLEP Introductory Psychology | 50 | 3 | 3 | 4". It also counts toward **CSU GE Area 4**.
- **"31 of 33" cannot be reproduced from the CSU chart.**
  - The chart lists more than 33 CLEP titles, including discontinued ones.
  - Titles carrying 0 degree units: College Composition, College Composition Modular, College Mathematics, English Composition (no essay), English Composition (with essay), Freshman College Composition, Social Sciences and History.
  - Titles granting units but no CSU GE area: Financial Accounting, Information Systems, Intro to Educational Psychology, Intro Business Law, Principles of Accounting, Management, Marketing, and the Level I language exams.
  - Recommendation: drop the count and cite the chart.
- **"some needing higher scores": CONFIRMED.** Language Level II needs higher scores, e.g. "CLEP French Level II4 | 59 | 9 | 3 | 3B", "CLEP Spanish Level II4 | 63".
- **"not against the GE transfer pattern" is MISLEADING.** CLEP does count toward **CSU GE** areas (for example Algebra counts for Area 2 and US History I for 4+US-1). It does not count toward **Cal-GETC**. The note should say "not toward Cal-GETC". The rows' `satisfies_areas: []` is correct, because those are Cal-GETC areas.

**(c) The 30-unit cap is CONFIRMED, and AP and IB are excluded from it.**
- Source: CSU Credit for Prior Learning Policy, PolicyStat 17652222, Effective 3/4/2025 (https://calstate.policystat.com/policy/17652222/latest/).
- Quote: "Except for International Baccalaureate and Advanced Placement Tests, no more than 30 semester (45 quarter) total units of credit shall be applied to the calculation of admission eligibility or to the degree on the basis of passing standardized exams. Advanced Placement and International Baccalaureate are excluded from this limit."
- So IB, not just AP, also stacks outside the cap.

**(d) Dead source URL.**
- `https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx` returns **404**.
- It is used by `CSU_EXAM_POLICY`, `CLEP_POLICY` and `CSU_DSST`.
- Live replacements:
  - https://www.calstate.edu/apply/transfer/Pages/External-Exam-Credit.aspx. Its table is rendered by JavaScript and the static text still says "academic year 2025-2026".
  - https://calstate.policystat.com/policy/20781575/latest/ (preferred).

---

## 4. CAL_GETC_IB

**App claim:** "Cal-GETC certification requires a Higher Level score of 5 or better, and an acceptable IB score counts as 3 semester units toward certification ... UC awards 8 quarter units per HL exam ... the IB diploma at 30+ adds 6 more."

**VERDICT: CORRECTED.** The mechanism is confirmed, but three subject rows are wrong and one is unsafe for UC.

**Mechanism: CONFIRMED.**
- Cal-GETC v1.4 §6.2 quotes:
  - "A score of 5, 6 or 7 on Higher Level exams is required to grant credit for Cal-GETC certification."
  - "An acceptable IB score for Cal-GETC equates to either 3 semester or 4 quarter units for certification purposes."
- UC IB page (https://admission.universityofcalifornia.edu/admission-requirements/ap-exam-credits/ib-credits.html) quotes:
  - "UC awards students who complete the IB diploma with a score of 30 or above with 6 quarter (4 semester) units ... Students who receive IB certificates with scores of 5, 6 or 7 on Higher Level exams will receive 8 quarter (5.3 semester) units per exam."
  - "Designated IB Higher Level exams passed with scores of 5 or higher can be used to meet portions of the seven-course pattern for transfer students, but not the English composition requirements."

**Cal-GETC v1.4 §6.2.1 IB (HL) table, verbatim:**

| IB exam | Cal-GETC area |
|---|---|
| IB Biology HL | 5B |
| IB Chemistry HL | 5A |
| IB Economics HL | 4 |
| IB Geography HL | 4 |
| IB History (any region) HL | 3B or 4 |
| IB Language A: Literature (any language, except English) HL | 3B |
| IB Language A: Language and Literature (any language, except English) HL | 3B |
| IB Language A: Literature (any language) HL | 3B |
| IB Language A: Language and Literature (any language) HL | 3B |
| IB Mathematics: Analysis and Approaches HL | 2 |
| IB Mathematics: Applications and Interpretation HL | "2 (may not be at all UC)" |
| IB Physics HL | 5A |
| IB Psychology HL | 4 |
| IB Theatre HL | 3A |

**Row-by-row comparison with `IB_RULES`:**

| App row | Standard | Verdict |
|---|---|---|
| ib-english-a-hl → 1A | Language A HL → **3B only**; UC: "not the English composition requirements" | **WRONG: remove the 1A row** |
| ib-english-a-hl → 3B | 3B | CONFIRMED |
| ib-mathematics-aa-hl → 2 | 2 | CONFIRMED |
| ib-mathematics-ai-hl → 2 | "2 (may not be at all UC)"; UC IB page: "No credit is awarded for the Mathematics Applications and Interpretations exam offered 2021 and later." | **UNSAFE FOR UC.** Valid for Cal-GETC certification, but UC gives no degree credit. Flag it, or limit it to CSU. |
| ib-visual-arts-hl → 3A | **Not in the Cal-GETC table.** CSU chart: "IB Visual Arts HL \| 5 \| 6 \| 0 \| n/a" | **WRONG: remove** |
| ib-spanish-b-hl → 3B | **Language B not in the Cal-GETC table.** CSU chart: "IB Language B (any language) HL5 \| 4 \| 6 \| 0 \| n/a" | **WRONG: remove.** Language B HL 5+ is only for the language-other-than-English proficiency requirement, not an area. |
| ib-history-hl → 4 | 3B **or** 4 | Under-claims. Safe, but a 3B alternative row could be added. |
| ib-economics-hl → 4 | 4 | CONFIRMED |
| ib-psychology-hl → 4 | 4 | CONFIRMED |
| ib-geography-hl → 4 | 4 | CONFIRMED |
| ib-chemistry-hl → 5A | 5A (no 5C) | CONFIRMED |
| ib-physics-hl → 5A | 5A (no 5C) | CONFIRMED |
| ib-biology-hl → 5B | 5B (no 5C) | CONFIRMED. The app was right not to add a lab. |
| min_score 5, 3 units | 5, 3 semester units | CONFIRMED |

Missing from the app but listed in the table: IB Theatre HL → 3A.

---

## 5. CAL_GETC_ALEVEL

**App claim:** "UC grants credit at grade A, B or C, up to 12 quarter (8 semester) units per exam. For general-education credit the exam must be a Cambridge International A Level taken in 2013 or later." The 12 `ALEVEL_RULES` map A-Levels to Cal-GETC areas (1A, 3B, 2, 3A, 4, 5A, 5B), at 3 units each, **for all UC and CSU campuses**.

**VERDICT: CORRECTED.**

- **UC degree credit: CONFIRMED.**
  - Source: https://admission.universityofcalifornia.edu/admission-requirements/ap-exam-credits/a-levels.html
  - Quote: "UC grants credit for GCE and Singapore-Cambridge Advanced Level exams on which a student earns a grade of A, B, or C. This credit toward UC graduation requirements may receive elective credit only, or specific subject credit and/or credit toward general education requirements, as determined by a UC campus." Also: "UC grants up to 12 quarter (8 semester) units of credit for each of the following GCE and Singapore-Cambridge A-level exams*".
  - These are degree units decided by each campus, not Cal-GETC area clearance.
- **Cal-GETC has no A-Level external-exam table. WRONG to map A-Levels to Cal-GETC areas.**
  - Cal-GETC v1.4 §6 covers only 6.1 AP, 6.2 IB, 6.3 CLEP (not allowed) and 6.4 Other Exams.
  - Quote from §6.4: "Other College Board and ACT exams cannot be used to satisfy Cal-GETC requirements".
  - The only mention of A-Levels is in the language-other-than-English proficiency appendix: "'A' Level exams in languages other than English with a grade of 'A,' 'B,' or 'C.'"
  - So none of the 12 `ALEVEL_RULES` area mappings is supported by the Cal-GETC Standards.
  - The CSU external-exam chart (PolicyStat 20781575) also contains **no A-Level rows**, so A-Level rules at CSU campuses have no systemwide basis either.
  - Recommendation: set `satisfies_areas: []` (or remove the rows) for all A-Levels. Optionally keep UC degree units at 8 semester units with "campus decides" wording.
- **"Cambridge International, taken 2013 or later" is NOT systemwide UC policy. It is a UCSB rule.**
  - Source: UCSB College of Engineering GEAR (https://engineering.ucsb.edu/sites/default/files/docs/GEAR%20Final%20for%20College.pdf)
  - Quote: "Any general education credit or UCSB course equivalents listed in the chart below will be awarded only for Cambridge International A Level exams taken in 2013 or later, not for exams administered by any other agency."
  - UC's systemwide page accepts "GCE and Singapore-Cambridge" A-Levels.
  - The same sentence appears in the `UC_EXAM_POLICY` note (marked `published`, institutions.ts). It should be removed or attributed to UCSB.
- **Related Berkeley L&S restriction.** Berkeley L&S does not let exams count for breadth. Source: https://lsadvising.berkeley.edu/degree-requirements. Quote: "Students admitted in Fall 2018 and beyond may not use high school exam scores (i.e. AP, IB, GCE) for breadth."

---

## 6. CSU_DSST

**App claim:** "CSU accepts credit by examination from testing centres including CLEP and DSST ... DSST is not part of the Cal-GETC external-exam standard, so it is modelled here as clearing nothing." The rows give 8 DSST exams at min 400, 3 units, areas [].

**VERDICT: PARTLY.**

- **There is no systemwide DSST policy.** The CSU Systemwide Credit for External Examinations policy covers only "the College-Level Examination Program, the International Baccalaureate, the College Board Advanced Placement Examinations and the Defense Language Proficiency Test". DSST is not in the chart, so there is no systemwide passing score, unit value or CSU GE area for any DSST exam.
- **Where DSST is mentioned:** only on the CSU Troops-to-College veterans page (https://www.calstate.edu/attend/student-services/troops-to-college/applying-to-the-csu/pages/credit-for-prior-learning.aspx).
  - Quote: "Generally, students are granted credit for: ... external exams such as DSST and College-Level Examination Program (CLEP)".
  - It also says: "Veterans Affairs contacts at every CSU campus can tell you about specific campus policies related to credit for prior learning, as well as academic credit for external exams."
- **CPL Policy (PolicyStat 17652222):** ACE-recommended credit is awarded "as appropriate for a student's academic objectives" and "Each campus shall determine the extent to which units ... shall be applied as major, general education, or elective credit". DSST would also fall under the 30-unit cap for standardized exams other than AP and IB.
- **Cal-GETC:** DSST is not an allowed Cal-GETC exam. §6 has no DSST, and §6.4 limits other exams. `satisfies_areas: []` is correct.
- **What is unverifiable:** the `min_score: 400` and `units_granted: 3` per DSST exam at every CSU. There is no systemwide figure, and it is campus-by-campus. Keep the rows `needs_check`, and change the note to "no systemwide CSU DSST policy; campus decides; the only systemwide mention is the veterans page".
- **Source URL** is the same 404 link as in item 3.

---

## 7. BERKELEY_LS (`data/ca/degree.ts`)

**App claim:** "At Berkeley's College of Letters & Science it is 120 semester units, including transfer and exam credit." This was read from a search summary.

**VERDICT: CONFIRMED.** The page itself was opened.

- URL: https://lsadvising.berkeley.edu/degree-requirements
- Quote: "**120 total semester units**. This includes transfer credit admitted to the Berkeley record and advanced high school units admitted to your college record. Of the 120 total, the following is required: **36 upper division units** ..."
- `confidence` can move to `published`. "Advanced high school units" is the page's wording for exam credit.
- Aside: the same page states the L&S senior residence rule as "After you become a senior (with 90 semester units earned toward your B.A. degree), you must complete: 1. At least 24 units in residence as an L&S student. 2. At least 2 semesters in residence ...". That is college-specific and stricter in form than the UC Senate wording the app uses for `uc-residence`. This is not a contradiction, just more detail.

---

## 8. AP → Cal-GETC rows (spot-check of all 19 `AP_RULES`)

**Source:** Cal-GETC Standards v1.4 §6.1 and §6.1.1 (URL as in item 3).

Rules quoted from §6.1:
- "There is no equivalent AP exam for Cal-GETC Area 1B"
- "Students earning a score of 3, 4 or 5 in a Physical or Biological Science AP examination earn credit toward Cal-GETC Area 5A ... or 5B ... and also meet the Cal-GETC 5C (Laboratory) requirement"
- "Generally, an acceptable AP score for Cal-GETC equates to either 3 semester or 4 quarter units"
- "An exception is that AP exams in Biology, Chemistry, Physics 1, or Physics 2 allow CCC campuses to apply 4 semester or 5 quarter units to Cal-GETC Area 5 certification. **AP exams in Environmental Science, Physics C: Mechanics and Physics C: Electricity/Magnetism only allow CCC campuses to apply 3 semester or 4 quarter units to Cal-GETC certification.**"

| App row | Table (verbatim) | Verdict |
|---|---|---|
| ap-english-lang → 1A, 3u | "English Language and Composition 1A" | CONFIRMED |
| ap-english-lit → 1A / 3B, 3u | "English Literature and Composition 1A or 3B" | CONFIRMED |
| ap-calculus-ab → 2, 3u | "Calculus AB 2" | CONFIRMED |
| ap-calculus-bc → 2, 3u | "Calculus BC 2" | CONFIRMED |
| ap-art-history → 3A / 3B, 3u | "Art History 3A or 3B" | CONFIRMED |
| ap-spanish → 3B, 3u | "Spanish Language and Culture 3B" | CONFIRMED |
| ap-european-history → 3B / 4, 3u | "European History 3B or 4" | CONFIRMED |
| ap-psychology → 4, 3u | "Psychology 4" | CONFIRMED |
| ap-macroeconomics → 4, 3u | "Macroeconomics 4" | CONFIRMED |
| ap-microeconomics → 4, 3u | "Microeconomics 4" | CONFIRMED |
| ap-human-geography → 4, 3u | "Human Geography 4" | CONFIRMED |
| ap-comparative-government → 4, 3u | "Comparative Government and Politics 4" | CONFIRMED |
| ap-biology → 5B+5C, 4u | "Biology 5B and 5C"; 4 units allowed | CONFIRMED |
| ap-chemistry → 5A+5C, 4u | "Chemistry 5A and 5C"; 4 units allowed | CONFIRMED |
| ap-physics-1 → 5A+5C, 4u | "Physics 1: Algebra-Based 5A and 5C"; 4 units allowed | CONFIRMED |
| **ap-environmental-science → 5A+5C, 4u** | "Environmental Science 5A and 5C"; **only 3 semester units** for Cal-GETC | **CORRECTED: units 4 → 3.** Areas are correct. |
| Min score 3 | "A score of 3, 4 or 5 is required" | CONFIRMED |
| No AP for 1B, 1C, 6 | Table has no 1B, 1C or 6 entries; 1B is stated explicitly | CONFIRMED |

Notes:
- The AP Environmental Science units matter because Area 5 needs **7 semester units** ("(At least 2 courses: 7 semester or 9 quarter units)", §9.5).
- The CSU chart does give APES 4 units for CSU GE ("AP Environmental Science7 | 3 | 4 | 4 | 5A+5C"). That is a CSU GE figure, not a Cal-GETC one.
- The CSU chart is consistent with Cal-GETC for the other AP rows. One exception: CSU GE places AP English Literature in "1A+3B" (6 units, both areas). That is CSU GE only, and the app correctly models the Cal-GETC "1A or 3B".

---

## Other things noticed (outside the eight items)

- `UC_EXAM_POLICY` (marked `published`) carries the UCSB-only "Cambridge International, 2013 or later" sentence as if it were UC-wide. See item 5.
- `CSU_EXAM_POLICY` (marked `published`) says "AP is not counted in that cap". The policy excludes **AP and IB** from the 30-unit cap.
- The `CSU_EXAM_POLICY`, `CLEP_POLICY` and `CSU_DSST` source URL (`.../credit-by-exam.aspx`) is a dead link (404).
- The LAO report URLs for UC and CSU 2026-27 returned HTTP 500 on 2026-10-01. https://lao.ca.gov/Education/EdBudget/Details/1036 works and carries the same series.
