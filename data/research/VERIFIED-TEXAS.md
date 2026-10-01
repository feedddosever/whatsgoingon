# Texas verification: data/tx/*

Read on 2026-10-01 (every URL below was opened that day through TinyFish fetch/search, unless marked otherwise).
Nothing below comes from memory. If a source could not be opened, the item says so.

**Context that affects several items**
- THECB amended 19 TAC §§4.22, 4.25, 4.28–4.31 under SB 37 (89th Leg.). They were adopted without changes and took effect on **11 Feb 2026**. Source: Texas Register, 6 Feb 2026, https://www.sos.state.tx.us/texreg/archive/February62026/Adopted%20Rules/19.EDUCATION.html. Quote: "adopts amendments to, Title 19, Part 1, Chapter 4, Subchapter B, §§4.22, 4.25, 4.28 - 4.31 ... without changes to the proposed text as published in the November 7, 2025, issue ... Effective date: February 11, 2026".
- Under SB 37, every university's governing board had to re-certify its core by 1 Jan 2027, and campuses cut core course lists in Aug–Sep 2026:
  - Texas A&M removed "103 at the flagship campus" (KBTX, 7 Sep 2026, https://www.kbtx.com/2026/09/07/more-than-350-courses-removed-texas-ams-core-curriculum-system-wide/).
  - UH presented a reduced core list to its Regents on 20 Aug 2026 (https://www.uh.edu/provost/about/news-communications/_2026/core-curriculum-update-2026.php).
  - UT Austin announced a new core starting fall 2027 (https://news.utexas.edu/2026/08/13/new-core-curriculum-refocuses-undergraduate-education-at-ut-austin/).
  - The UH provost letter adds: "the Texas Higher Education Coordinating Board will recommend a new statewide core curriculum to the Texas Legislature in January. If approved ... all universities will undergo another revision of their core curriculum next summer."
  - **Consequence:** every course-to-area mapping in this file is a snapshot of autumn 2026 and is expected to change in 2027.

---

## 1. TX_SPLIT (data/tx/core.ts): component-area hours

- **App claims:** Communication 6, Math 3, Life & Physical Sciences 6, Language/Philosophy/Culture 3, Creative Arts 3, American History 6, Government 6, Social & Behavioral Sciences 3, Component Area Option 6. Total 42. Marked `needs_check`; the cited source is board.thecb.state.tx.us/apps/tcc/.
- **VERDICT: CONFIRMED.** The split is in the rule text itself. The Feb 2026 amendment (proposal published 7 Nov 2025, adopted without changes) kept all nine figures.
- **Sources:**
  - 19 TAC §4.28(b)(3)–(4): https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-4-28
  - Amended text as proposed (adopted unchanged): https://www.sos.state.tx.us/texreg/archive/November72025/Proposed%20Rules/19.EDUCATION.html
- **Quote (§4.28(b)(3)–(4)):** "(A) Communication (6 SCH). ... (B) Mathematics (3 SCH). ... (C) Life and Physical Sciences (6 SCH). ... (D) Language, Philosophy, and Culture (3 SCH). ... (E) Creative Arts (3 SCH). ... (F) American History (6 SCH). ... (G) Government/Political Science (6 SCH). ... (H) Social and Behavioral Sciences (3 SCH). ... (4) Component Area Option (6 SCH)." §4.28(a)(1): "no less than 42 lower-division semester credit hours."
- **Recommended source_url:** https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-4-28 (or the SOS rule viewer). Confidence can move to `statute`/`published`.
- **Caveats to note in the app:**
  - Campuses lay the same 42 hours out differently:
    - Texas A&M lists "Mathematics – 6 SCH" and "Life and Physical Sciences – 9 SCH". Its footnotes say these courses count as "either the Mathematics or the Component Area Option".
    - Texas Tech's catalog lists Communication 9, Mathematics 6 and Life & Physical Sciences 8.
    - UT Austin fills 090 with its First-Year Signature Course and has a separate "Natural Science & Technology, Part II (093)".
  - So "Component Area Option 6" is the state shape. At most universities, a generic course will not land in a generic "option" bucket.
  - The statewide core may be replaced in 2027 (see Context).

## 2. TX_EXAM_MAPPING / TX_IB_DSST (data/tx/acceptance-rules.ts)

**App claims:** every Texas public university gives the same treatment:
- AP: minimum score 3, the area shown below, 3–4 SCH.
- CLEP: minimum score 50, the area shown below, 3 SCH.
- IB HL: minimum score 5. DSST: minimum score 400. A-Level: minimum score 0.

**VERDICT: CORRECTED.** The "common case" is wrong for a large share of rows at all three campuses whose charts I could read. Some exams get no credit at all, some need a higher score, and some land in a different area. Some campuses refuse the exam family entirely.

**Sources read (2026-10-01):**
- UT Austin: https://testingservices.utexas.edu/search-undergraduate-exams (pages 0–8). Core list: https://generaleducation.utexas.edu/core-courses/current-core-list ("2026-2027 core course list (Current)").
- Texas A&M AP/IB/DSST: https://testing.tamu.edu/credits/index.html. CLEP: https://testing.tamu.edu/exams/clep/clep-exams-actual.html. Core list: https://catalog.tamu.edu/undergraduate/general-information/university-core-curriculum/ (current catalog page; this may predate the Sept 2026 removals).
- Texas Tech: https://www.depts.ttu.edu/testing/uce.php. Core list: https://catalog.ttu.edu/preview_degree_planner.php?catoid=2&poid=682&print. **Warning:** this core list is the *2016-17* catalog page, the only one I could load. The 2026-27 catalog PDF timed out, so the TTU area mappings below are lower-confidence.
- University of Houston: **chart not readable.**
  - The UH catalog's Credit by Examination page (https://publications.uh.edu/content.php?catoid=63&navoid=24344) returned empty content on every attempt. A browser-automation run never started; it was still PENDING after about 40 minutes.
  - Confirmed only: "UH will award course credit to students who earn a score of 3 and higher in AP tests" (https://www.uh.edu/undergraduate-admissions/apply/transfer/transferring-credit/).
  - UH accepts CLEP and DSST exams (it has CLEP and DSST institution codes, per https://www.uh.edu/casa/testing-services/student/).
  - Per-exam course and area: **UNVERIFIABLE** for UH.

**CLEP acceptance at all:**
- UT Austin: yes, but only a short list. Quote: "UT Austin awards credit for the eight (8) CLEP exams listed. We do not award credit for any CLEP exam not listed on the table." Listed exams:
  - American Government (+ UT Texas Government test)
  - American or English Literature (+ UT essay)
  - Calculus
  - College Algebra
  - German
  - Introductory Psychology
  - Introductory Sociology
  - Macroeconomics
  - Microeconomics
- Texas A&M: yes, 16 exams. There is no College Composition, College Mathematics, Humanities, American Literature, Natural Sciences or Biology.
- Texas Tech: yes. There is no College Mathematics, Introductory Sociology, Humanities, American Literature or Natural Sciences. Composition is the essay version only: "After September 30, 2023, CLEP College Composition Modular will no longer be accepted".
- UH: accepts CLEP; the exam list is unverified.

### AP rows (app minimum 3 everywhere)

"Core area" is the area the awarded course occupies on that campus's core list. ✓ = matches the app. ✗ = does not match.

| App row (area, SCH) | UT Austin | Texas A&M | Texas Tech |
|---|---|---|---|
| ap-english-lang (comm, 3) | 3–5 → RHE 306 → Communication 010 ✓ | 3 → ENGL 104 (Comm) ✓; 4 → ENGL 104+241 | 3 → ENGL 1301 (Comm) ✓; 4 → 1301+1302 |
| ap-english-lit (comm, 3) | **✗** 3 → E 314T (not on core list); 4–5 → E 316P = **Humanities 040** (LPC), not Comm | 3 → ENGL 104 (Comm) ✓; 4 → +ENGL 203 (Comm) | 3 → ENGL 1301 (Comm) ✓ |
| ap-calculus-ab (math, 3) | 3–4 → M 408K/N/R (4 SCH), Math 020 ✓; 5 → M 408C | 3 → MATH 142 (Math) ✓; 4 → MATH 151 (4) | 3 → MATH 1451 (4 SCH) Math ✓ |
| ap-calculus-bc (math, 3) | 3–4 → M 408C ✓ | 3 → MATH 151 (4) ✓ | 3 → MATH 1451+1452 (8) ✓ |
| ap-statistics (math, 3) | 3–5 → EDP 308 / SDS 301 / STA 309: Math ✓ *only if* SDS 301 or EDP 308 is claimed ("STA 309 does NOT fulfill the Mathematics requirement in the core curriculum") | 3 → STAT 201 (Math) ✓ | 3 → MATH 2300 (Math) ✓ |
| ap-biology (LPS, 4) | 3–4 → BIO 311C (030) ✓ | 3 → BIOL 113 (3 SCH, LPS) ✓; 4 → BIOL 111+112 | 3 → BIOL 1401+1402 (8) LPS ✓ |
| ap-chemistry (LPS, 4) | 3 → CH 301N (030) ✓ | 3 → CHEM 119 (4) LPS ✓ | 3 → CHEM 1305/1306 + labs (8) ✓ |
| ap-physics-1 (LPS, 4) | 3–5 → PHY 302K+105M (030) ✓ | **✗** 3 → PHYS 205, **not on core list**; 4 → PHYS 201 (LPS) | 3 → PHYS 1403 (LPS) ✓ |
| ap-environmental-science (LPS, 4) | 3–5 → GEO 302P (030) ✓ (3 SCH) | **✗** 3 → GEOS 105, **not on core list** | **✗** 3 → NRM 1300, listed under **Social & Behavioral Sciences** (2016-17 core list) |
| ap-spanish (LPC, 3) | **✗** 3 → SPN 601D; no foreign-language course is on UT's core list | **✗** 3 → SPAN 101+102 (not core); **score 4** adds SPAN 201 (LPC) | **✗** 3 → SPAN 1501+1502; not on the 2016-17 LPC list |
| ap-european-history (LPC, 3) | **✗** 3–5 → HIS 309L, not on UT core list | 3 → HIST 102 (LPC) ✓ | 3 → HIST 1301 Western Civ II (LPC) ✓ |
| ap-art-history (arts, 3) | 3 → ARH 301 (VAPA 050) ✓ | 3 → ARTS 149 (Creative Arts) ✓ | 3 → ARTH 2302 (Creative Arts) ✓ |
| ap-us-history (US hist, 3) | 3–5 → HIS 315L (060) ✓ | 3 → HIST 105 **and** 106 (6 SCH) ✓, so the app under-counts | 3 → HIST 2300+2301 (6 SCH) ✓, so the app under-counts |
| ap-us-government (govt, 3) | **Partly:** GOV 310L (070) *only* with a passing "UT Austin Test on Texas Government"; "a score of at least 3 does not guarantee credit" | 3 → POLS 206 (Gov) ✓ | 3 → POLS 1301 (Gov) ✓ |
| ap-comparative-government (option, 3) | **✗ No credit** ("with the exceptions of AP Comparative Government, AP Research, and AP Seminar") | **✗** 3 → POLS 229, not on core list | **✗** not on TTU chart, so no credit |
| ap-psychology (SBS, 3) | 3–5 → PSY 301 (080) ✓ | 3 → PBSI 107 (SBS) ✓ | 3 → PSY 1300 (SBS) ✓ |
| ap-macroeconomics (SBS, 3) | 3 → ECO 301; 4–5 → ECO 304L, both 080 ✓ | 3 → ECON 203 (SBS) ✓ | **✗ minimum score 4** → ECO 2302 (SBS) |
| ap-microeconomics (option, 3) | Area ✗: ECO 301/304K are SBS 080; UT's 090 is the signature course | Area ✗: ECON 202 is SBS | **✗ minimum score 4** → ECO 2301 (SBS) |
| ap-human-geography (option, 3) | Area ✗: GRG 305 is SBS 080 | Area ✗: GEOG 201 is SBS | Area ✗: GEOG 2300 is SBS |

Key quotes:
- UT: "UT Austin awards credit for at least one course for all AP exams with a score of 3 or higher with the exceptions of AP Comparative Government, AP Research, and AP Seminar."
- TTU: "| ECO 2301 | AP: Microeconomics | 4 | 3 |" and "| ECO 2302 | AP: Macroeconomics | 4 | 3 |".
- TAMU: "| Physics 1 | 3 | PHYS 205 | 4 | / | 4 | PHYS 201 | 4 |" and "| Environmental Science | 3 | GEOS 105 | 3 |".

### CLEP rows (app minimum 50, 3 SCH)

| App row | UT Austin | Texas A&M | Texas Tech |
|---|---|---|---|
| clep-college-composition (comm) | **✗ no credit** | **✗ no credit** | 50 → ENGL 1301 (Comm) ✓; 59 → 1301+1302 |
| clep-college-algebra (math) | **✗** 50 → M 301, which "cannot be applied to the core curriculum" | 50 → MATH 102 (Math core) ✓ | 50 → MATH 1320 (Math) ✓ |
| clep-college-mathematics (math) | **✗ no credit** | **✗ no credit** | **✗ no credit** |
| clep-american-government (govt) | **Partly:** GOV 310L only with the UT Texas Government test; "no minimum satisfactory scores are listed" | 50 → POLS 206 ✓ | 50 → POLS 1301 ✓ |
| clep-history-us-1 (US hist) | **✗ no credit** | 50 → HIST 105 ✓ | 50 → HIST 2300 ✓ |
| clep-intro-psychology (SBS) | 50 → PSY 301 ✓ | 50 → PBSI 107 ✓ | 50 → PSY 1300 ✓ |
| clep-intro-sociology (SBS) | 50 → SOC 302 (080) ✓ | 50 → SOCI 205 ✓ | **✗ no credit** |
| clep-macroeconomics (option) | Area ✗: 50 → ECO 301, 60 → ECO 304L, both SBS | Area ✗: ECON 203 is SBS | Area ✗: ECO 2302 is SBS |
| clep-humanities (LPC) | **✗ no credit** | **✗ no credit** | **✗ no credit** |
| clep-american-literature (LPC) | **Partly:** "American or English Literature, plus UT Austin Essay" → E 316P (Humanities 040); no published cut score | **✗ no credit** | **✗ no credit** (TTU lists Analyzing & Interpreting Literature → ENGL 2307 instead) |
| clep-natural-sciences (LPS) | **✗ no credit** | **✗ no credit** | **✗ no credit** |
| clep-biology (LPS) | **✗ no credit** | **✗ no credit** | 50 → BIOL 1401+1402 (8 SCH) ✓ |

Score floor: Texas Tech's CLEP Chemistry 4-hour level needs 65; Texas A&M accepts 45 for CHEM 119. Neither is an app row.

### IB / DSST / A-Level (TX_IB_DSST)

- **DSST: CORRECTED.**
  - Texas A&M's DANTES list has six exams: Art of the Western World, Astronomy, Business Law II, Physical Geology, Principles of Statistics and Lifespan Developmental Psychology. **None of the app's 8 DSST rows is on it.**
  - UT Austin's exam search lists no DSST. Texas Tech's chart lists no DSST.
  - So all 8 DSST rows award nothing at UT Austin, Texas A&M or Texas Tech. They should not be presented as the "common case".
- **A-Level: UNVERIFIABLE / no published credit.** No A-Level entries appear on the UT Austin, Texas A&M or Texas Tech charts I read. The app's `min_score: 0` A-Level rows have no support.
- **IB: PARTLY.** Texas A&M grants most HL credit at **4**; the app's 5 is conservative, which is safe. Area mismatches mirror the AP rows:
  - Geography → GEOG 201 is SBS, not option.
  - "History HL" maps by region: Americas → HIST 105 (American History); Europe → HIST 102 (LPC); Africa/Asia → HIST 289. So the app's single `ib-history-hl → tx-us-history` row is wrong unless the paper is History of the Americas.
  - At UT Austin, IB rows exist but were not mapped row by row.

**Recommendation:** drop the statewide "common case" for exams. Keep per-campus rows where a chart was read. Mark AP Comparative Government, CLEP College Mathematics, Humanities and Natural Sciences, and all DSST and A-Level rows as no credit or unknown. Do not assume they clear an area.

## 3. TX_COURSE_MAPPING: TCCNS course → component area

- **Source:** Austin Community College, Core Curriculum Course List (catalog in effect for 2026–2027), https://catalog.austincc.edu/academic-planning/core-curriculum-general-education/core-curriculum-course-list/
- **VERDICT: PARTLY (one area corrected, one course not offered at ACC).**

| Course | App area | ACC 2026-27 area | Verdict |
|---|---|---|---|
| ENGL 1301, 1302 | Communication | "Communication (Code 010)" | CONFIRMED |
| **SPCH 1315** | **Component Area Option** | **Communication (Code 010)**, and also listed under Component Area Option (090) | **CORRECTED.** Its named area is Communication. ACC: "courses listed in two areas are first used to satisfy the named subject area ... then ... applied toward meeting the Component Area Option". Texas Tech also lists COMS 2300 [TCCNS SPCH 1315] under Communication. |
| MATH 1314, 1332 | Mathematics | Mathematics (020) | CONFIRMED |
| BIOL 1406 | Life & Phys Sci | Life and Physical Sciences (030) | CONFIRMED |
| CHEM 1411 | Life & Phys Sci | **Not on ACC's list.** ACC offers CHEM 1311 + 1111 separately. | PARTLY. Search snippets (not opened in full) show CHEM 1411 under Life & Physical Sciences at San Antonio College ("Life and Physical Sciences (30) Core ... CHEM 1411 - General Chemistry I"), Dallas College, Collin, Lee, Tyler JC and Ranger 2026-27. Texas Tech maps TCCNS CHEM 1411 to its core LPS course CHEM 1307/1107. |
| PHIL 1301 | LPC | Language, Philosophy and Culture (040) | CONFIRMED |
| ARTS 1301 | Creative Arts | Creative Arts (050) | CONFIRMED |
| HIST 1301, 1302 | American History | American History (060) | CONFIRMED |
| GOVT 2305, 2306 | Government | Government/Political Science (070) | CONFIRMED |
| PSYC 2301, SOCI 1301 | SBS | Social and Behavioral Sciences (080) | CONFIRMED |

Quotes: "Communication (Code 010) - 6 Credits/2 Courses Required ENGL 1301 English Composition I ENGL 1302 English Composition II ENGL 2311 Technical and Business Writing SPCH 1315 Public Speaking".

The THECB TCC WebCenter link the app cites (board.thecb.state.tx.us/apps/tcc/) was not opened. THECB's current page is https://www.highered.texas.gov/new-program-development/texas-core-curriculum/ (seen in search only, not opened).

## 4. TX_CC_COST (data/tx/courses.ts)

- **App claims:**
  - $124/SCH "statewide middle".
  - Range from "$77/SCH at College of the Mainland" to "$164/SCH at South Texas College".
- **VERDICT: CORRECTED / PARTLY.**
- **Source:** THECB, *Tuition and Fees Data – Community Colleges 2018-2025* (Fall 2025 column), https://reportcenter.highered.texas.gov/reports/data/tuition-and-fees-data-community-colleges-2018-2025/ (search listing dated 23 Sept 2026).
- **Quote:** "reflects the average amounts charged to resident undergraduate students enrolled in exactly 15 semester credit hours (SCH) per semester ... STATEWIDE AVERAGE ... $2,107" (Fall 2025).
- **Fall 2025 figures, ÷15, across 50 districts:**
  - Statewide average: **$140.47/SCH**.
  - Median: **$131.30/SCH**. Interquartile range ≈ $113–$160/SCH.
  - Lowest: **Collin $67.13**, then Tarrant $72.33, Alvin $75.73, **College of the Mainland $77.00** (the app's $77 is right for Mainland, but Mainland is not the floor).
  - **South Texas College is $181.20**, not $164.
  - Highest: **Clarendon $248.00**, then Wharton $245.33, Blinn $229.00.
- **Important caveat:** the THECB series says "resident", not "in-district", and it does not match published in-district rates for at least one college.
  - THECB shows Austin CC Fall 2025 at $1,766 / 15 = $117.73/SCH.
  - ACC itself says "In-district ACC students pay $67 in tuition plus $18 in various fees, for a total of $85 per credit hour. Out-of-district students pay an additional $201" (https://admissions.austincc.edu/tuition-costs/, search snippet; corroborated by catalog.austincc.edu tuition page snippet).
  - So the THECB average likely blends in some out-of-district charges for some colleges. It is an upper-leaning estimate of in-district cost.
- **Correct value to ship:**
  - Keep the price as a range, roughly **$67–$248/SCH** (Fall 2025, THECB "resident").
  - $124 is defensible as an *in-district* middle only if it is labelled an estimate. THECB's own "resident" median is $131 and its average is $140.
  - Replace "$164 at South Texas College" with $181 (Fall 2025). No 2026-27 statewide table was found.

## 5. TX_COST ($300/SCH estimate) (data/tx/institutions.ts)

- **VERDICT: CORRECTED.** $300/SCH is low for every campus checked. Resident tuition plus mandatory fees at 15 SCH comes to about **$360–$450/SCH**, 2026-27.

| Campus | 2026-27 resident figure (source quote) | ≈ per SCH at 15 SCH | Structure |
|---|---|---|---|
| UT Austin | Traditional flat rate, 12+ hours, per semester: Liberal Arts **$5,429**, Natural Sciences $5,883, Engineering $6,484, Business **$6,788**. Catalog: https://catalog.utexas.edu/general-information/registration-tuition-and-fees/tuition-and-fees/tables-tuition-for-fall-and-spring/. COA: "Tuition $10,858-$13,576" per year (https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/) | $362–$453 (at 15 SCH; less per SCH at 18) | **Flat rate by college** at 12+ hours. The registrar says the flat rates are "based on the average per-hour charges for tuition and fees" (search snippet, registrar.utexas.edu/schedules/269/tuition). Longhorn Fixed Tuition is higher (Liberal Arts $6,377, Business $7,878). |
| Texas A&M | **UNVERIFIABLE.** The catalog page "Texas A&M Tuition and Required Fees per Semester Credit Hour" has no figures in its static text; it points to the JS calculator at tuition.tamu.edu, which I could not run. | — | Locked or variable rate plans for freshmen. |
| U of Houston | "Combination of Tuition and Consolidated Fees ... per Semester Credit Hour": Liberal Arts/Education **$361.86/SCH**; Arts, Social Sciences, NSM **$385.59**; Business/Engineering **$420.57**; Nursing $484.82. Plus mandatory fees per semester: Student Services $260, Rec $121, UC $135 (= $516 per semester, about $34/SCH at 15). https://www.uh.edu/financial/undergraduate/tuition-fees/tuition/ and .../required-fees/ | ≈ $396–$455 (non-nursing) | Per SCH; 4-year fixed-rate option (e.g., 2027 transfer cohort, Liberal Arts, $5,669.38 per term) |
| Texas Tech | Statutory $50 + designated **$213/SCH** (fixed plan $319). Differentials: Engineering $90, Business $70; others $48/$38/$21. Many per-SCH fees, several capped: IT $23.50, Library $21, Fin/Records $7, Advising $4, Student Services $37.50 (cap $150), Health $25 (cap $100), Rec $25 (cap $100), Union $23.25 (cap $93), etc. https://www.depts.ttu.edu/studentbusinessservices/feeInfo/documents/tuition-fees/2026-2028_TTU_Schedule_of_Fees_Published.pdf. COA tuition & fees: **$11,852**/yr (https://www.depts.ttu.edu/financialaid/costtoattend.php) | My calculation from the fee schedule: about $362 before differential. COA basis: $11,852 ÷ 30 = **$395** | Per SCH plus capped fees |
| UNT | Fall 2026–Summer 2027: statutory $50 + "Board Designated Tuition for the Traditional Tuition Plan ... $230.11 per credit hour" (Save & Soar $234.71) + college differentials ($6–$45). https://studentaccounting.unt.edu/tuition-and-fees.html. 2026-27 COA: "Tuition and Fees $12,092", "Based on Resident rate for Fall/Spring, 15 hours per semester" (https://financialaid.unt.edu/undergraduate.html) | **$403** | Per SCH (Traditional) or Save & Soar; "Full-time Flat Rate" exists |
| Texas State | "A resident undergraduate student taking 15 credit hours pays a total of **$6,129.45** in tuition and fees" (Fall 2026). Designated tuition $257.36/SCH (Guaranteed Price Plan $288.24). https://www.sbs.txst.edu/sbs-policies/tuition-and-fee-definitions.html | **$408.63** | Per SCH |

- **App note is stale:** it says designated tuition is "$213/SCH at Texas Tech and $230.11/SCH at UNT for 2025-26". Both figures are still current for 2026-27. The problem is that mandatory fees add about $100–$150/SCH on top, not about $20–$40.
- **Recommended value:** about **$400/SCH** as a statewide middle (2026-27, resident, 15 SCH, tuition plus mandatory fees), with range about $360–$455.
- **Recommended cost source:** the Texas State SBS page or the UNT COA page. Both state a 15-SCH total.

## 6. TX_RESIDENCY (30 SCH)

- **App claims:** 30 SCH, citing the SACSCOC 25% floor.
- **VERDICT: PARTLY.** 30 SCH (25%) is the floor everywhere checked, but several campuses add more.

| Campus | Requirement (verbatim) | Source |
|---|---|---|
| UT Austin | "At least 60 hours, including 21 hours of upper-division coursework, must be completed in residence at the University; at least 24 of the last 30 hours must be completed in residence at the University." This is the Bachelor of Arts, Plan I policy (College of Natural Sciences); search snippets show the same 60-hour rule for Liberal Arts BA/BS degrees. **60, not 30.** | https://catalog.utexas.edu/undergraduate/programs/astronomy-ba/ |
| Texas A&M | "A minimum of 25% of coursework applying to a degree must be completed in residence ... Upper-level Residence Requirement: A minimum of 36 semester hours of 300- and/or 400-level coursework must be successfully completed in residence at Texas A&M ... A minimum of 12 of these 36 semester hours must be in the major." **36 upper-level hours, more than 30.** | https://catalog.tamu.edu/undergraduate/general-information/degree-information/ |
| U of Houston | "students must complete at least 30 semester credit hours in residence at UH" and "Of the 36 required advanced hours, at least 18 credit hours must be UH courses." | https://www.uh.edu/undergraduate-admissions/apply/transfer/transferring-credit/ ; https://www.uh.edu/transfer-advising-program/steps-to-transferring/six-things-every-transfer-must-know/ |
| Texas Tech | **UNVERIFIABLE from the catalog.** The 2026-27 catalog PDF timed out. The search snippet of that PDF reads "... 30 hours of the degree must be taken in residence ...". The Arts & Sciences BGS pages (snippet) say "At least 30 hours must be taken in residence." | https://www.depts.ttu.edu/officialpublications/pdfs/2026-27-catalog-ttu.pdf (snippet only) |
| UTSA | "A minimum of 25 percent of the total number of semester credit hours required for a bachelor's degree must be completed at UT San Antonio ... Of the minimum 39 upper-division semester credit hours required in all degree programs, 18 must be earned in UT San Antonio courses. At least 6 semester credit hours of upper-division coursework in the major must be completed at UT San Antonio." | https://catalog.utsa.edu/undergraduate/bachelorsdegreeregulations/degreerequirements/minimumutsaresidencerequirements/ (2026-28 catalog) |
| UNT | "Twenty-five percent of the university minimum of 120 semester hours (i.e., 30 hours) must be earned in residence at UNT." Also "A minimum of 36 semester hours of advanced work, 24 of which must be completed at UNT." | https://vpaa.unt.edu/advising/degrees/requirements.html |

- **Fix:**
  - Set `residency_min_units` to 60 for ut-austin and 36 (upper-division) for texas-am.
  - Keep 30 as the 25% floor elsewhere.
  - Add the upper-division-in-residence rules (UH 18, UTSA 18, UNT 24, TAMU 36) to the residency note, because they bind a transfer student harder than the 30.

## 7. TX_TRANSFER_CAP (66 SCH)

- **App claims:** a 66-SCH ceiling "is widely applied ... but is not confirmed", and "We found no statewide cap in the Coordinating Board's transfer rules". The same claim appears in the comment in transfer-policy.ts.
- **VERDICT: CORRECTED.** There *is* a statewide rule, but it is permissive: a ceiling on what a university is *obliged* to accept, not a ban on accepting more.
- **Source:** 19 TAC §4.25(f) (amended eff. 8 Apr 2021, and in the Feb 2026 package), https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-4-25
- **Quote:** "(f) An institution of higher education is not required to accept in transfer, or apply toward a degree program, more than sixty-six (66) semester credit hours of lower-division academic credit. Institutions of higher education, however, may choose to accept additional semester credit hours."
- **Note:** this rule caps *lower-division* credit from any source, not "community-college credit".

| Campus | Policy | Source |
|---|---|---|
| UT Austin | **UNVERIFIABLE.** No UT page opened. A third-party blog (transfercredit.org) says 66; it is not a primary source. | — |
| Texas A&M | **UNVERIFIABLE.** Not found on TAMU pages in the time available. | — |
| U of Houston | "A maximum of 66 lower division (freshman and sophomore-level) semester credit hours may be transferred as course credit. There is no limitation to the number of upper division ... semester credit hours that can transfer to UH." | https://www.uh.edu/undergraduate-admissions/apply/transfer/transferring-credit/ |
| Texas Tech | **80, not 66:** "a maximum of 80 semester credit hours from two-year colleges may be applied towards degree requirements. Students may apply up to 90 semester credit hours provided that a minimum of 10 degree applicable hours are upper division (3xxx/4xxx) and from a four-year institution." | https://www.depts.ttu.edu/registrar/teo/teo_transferGuidelines.php |
| UTSA (bonus) | "Transfer credit for community college work may not exceed 66 semester credit hours." | https://catalog.utsa.edu/undergraduate/bachelorsdegreeregulations/transferringcourses/ |
| Stephen F. Austin (seen in search only, not opened) | SFA newsroom, Nov 2024: "increased its accepted transfer credit limit from 66 to 90 credit hours" | https://www.sfasu.edu/about-sfa/newsroom/2024/sfa-expands-accepted-transfer-credit-hours-enhance-student-success |

- **Fix:**
  - Cite 19 TAC §4.25(f) as the statewide default: 66 lower-division SCH is the most a university must take.
  - Set texas-tech to 80.
  - Note that SFA (90, unconfirmed) and others may exceed 66.
  - Rewrite the transfer-policy.ts comment: "nothing we read supports it as a state rule" is wrong.

## 8. Texas Fields of Study (data/tx/degree.ts): Business Administration & Sociology

- **App claims:**
  - Courses and campus directed electives come from the July 2023 documents.
  - Both rows are `needs_check` because the tracker marks them "revised August 2026".
- **VERDICT: UNVERIFIABLE (the revised documents are not published). The app matches the July 2023 documents exactly.**
- **Tracker** (https://www.highered.texas.gov/texas-direct/, read 2026-10-01):
  - "\*Business Administration | Completed", "\*Sociology | Completed", and "\*Revised as of August 2026 based upon submitted corrections".
  - Its links for both FOS point to the same report-center URLs the app cites.
- **I fetched both linked documents fresh** (ttl=0). Each is still headed "July 2023":
  - https://reportcenter.highered.texas.gov/training-materials/presentations/revised-field-of-study-for-business-administration/
  - https://reportcenter.highered.texas.gov/training-materials/presentations/revised-field-of-study-for-sociology/
  - A report-center search restricted to 2026 returned nothing.
- **Business, July 2023 document:**
  - Core: ECON 2301, MATH 1324.
  - Foundation: ECON 2302, ACCT 2301, ACCT 2302, BUSI 1301.
  - Directed electives: "2 courses: 6 SCH/8 SCH".
  - **Matches the app's course list.** Campus electives match the app row for row. Examples: "Texas Tech University BUSI 2305 ... MATH 1325"; "The University of Texas at Austin MATH 2313 - Calculus I (3 SCH version) ... MATH 2314"; "Texas A&M University-Texarkana ... (Revised selections, June 2023) MATH 1325 ... BCIS 1305 ... BUSI 2301 ... MATH 1342".
  - The document also lists TAMU-Central Texas and Sul Ross–Rio Grande College, which the app does not model.
- **Sociology, July 2023 document:**
  - Core: SOCI 1301. Foundation: SOCI 1306, SOCI 2301, SOCI 2319. Directed electives 9 SCH.
  - The "any ACGM course" list is Sam Houston, Tarleton, TAMU-CC, TAMU-Kingsville, TAMU-Texarkana, TWU, UH, UH-Clear Lake and UH-Downtown. **It matches the app's `campus_any` exactly.**
  - Campus electives match. Examples: Texas Tech revised (June 2023) "MATH 1342 ... MATH 1314 ... SPCH 1315"; UT Austin "MATH 1342" only; UNT "ANTH 2351 ... GEOG 1303 ... SOCI 2336".
  - The document also lists TAMU-Central Texas (MATH 1342, SOCI 2326, SOCI 2336), which the app does not model.
- **What the "August 2026 corrections" changed cannot be determined from any public document.** Keep both rows `needs_check` and keep the note. Optionally ask THECB (brittni.hollis@highered.texas.gov, the contact on the Texas Direct page).

---

## Corrections summary

1. **19 TAC §4.28 split: confirmed.** It can be promoted with the Cornell/SOS citation. The amendment took effect 11 Feb 2026 and kept the split. Warn that the statewide core may be redesigned in 2027.
2. **Exam mappings: wrong in many places.** See the tables in §2. In short:
   - **No credit (UT Austin):** AP Comparative Gov; CLEP College Composition, College Mathematics, US History I, Humanities, Natural Sciences, Biology.
   - **UT Austin, credit but not core:** AP Spanish, AP European History, CLEP College Algebra (M 301 "cannot be applied to the core").
   - **UT Austin, wrong area:** AP English Lit is Humanities (LPC) at 4–5 and not core at 3.
   - **Texas A&M, no credit:** CLEP Composition, College Mathematics, Humanities, American Literature, Natural Sciences, Biology.
   - **Texas A&M, not core:** AP Environmental Science (GEOS 105), AP Physics 1 at score 3 (PHYS 205), AP Comparative Gov (POLS 229), AP Spanish at 3.
   - **Texas Tech, no credit:** CLEP College Mathematics, Intro Sociology, Humanities, American Literature, Natural Sciences; AP Comparative Gov.
   - **Texas Tech, score 4 needed:** AP Macro and AP Micro.
   - **Texas Tech, other:** AP Environmental Science lands in Social & Behavioral Sciences; AP Spanish is not core.
   - **"Option" rows** (AP Micro, AP Human Geography, CLEP Macro) are Social & Behavioral Sciences at all three campuses.
   - **Under-counted hours:** AP US History gives 6 SCH at Texas A&M and Texas Tech (app: 3).
   - **DSST:** none of the 8 rows earns credit at UT Austin, Texas A&M or Texas Tech.
   - **A-Level:** no published credit at those three.
   - **UH:** chart unverifiable.
3. **SPCH 1315 → Communication** (also allowed in the option area), not option-only. CHEM 1411 is not offered at ACC but is core at other colleges.
4. **Community-college cost:**
   - Fall 2025 THECB "resident" figures: average $140.47/SCH, median $131.30/SCH, range $67 (Collin) to $248 (Clarendon).
   - South Texas College is $181, not $164.
   - The THECB series is not purely in-district (ACC in-district is $85/SCH).
5. **University cost:** $300/SCH → about **$400/SCH** (range about $360–$455).
   - UT Austin uses a flat rate by college ($5,429–$6,788 per semester at 12+ hours).
   - UH and Texas State are per SCH including fees.
   - Texas A&M is unverified.
6. **Residency:**
   - UT Austin is **60 hours** in residence; Texas A&M is **36 upper-level hours** (plus 25%); UH requires 30 plus 18 of 36 advanced hours; UTSA requires 25% plus 18 upper-division; UNT requires 30 plus 24 advanced.
   - Texas Tech's 30 is a snippet only.
7. **Transfer cap:** a statewide rule exists, 19 TAC §4.25(f): universities must accept no more than 66 lower-division SCH but may accept more. **Texas Tech is 80** (90 with 10 upper-division). UH and UTSA are 66. UT Austin and Texas A&M are unverified. The "no statewide cap" note is wrong.
8. **FOS Business and Sociology:** the revised August 2026 documents are not published. The linked documents are still July 2023, and the app matches them exactly. Keep `needs_check`.
