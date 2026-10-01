# Florida verification: `data/fl/*`

All sources below were read on **2026-10-01**. Nothing here comes from memory. Where I could not open a primary source, the item says so.

Verdict key: **CONFIRMED**, **CORRECTED** (the file is wrong; the correct value is given), **PARTLY** (the claim stands but is incomplete or needs a caveat), **UNVERIFIABLE**.

## Summary of corrections

1. **AP Calculus AB, Calculus BC, Biology, Chemistry, Physics 1:** minimum score is **3**, not 4 (4 credits at 3; BC, Bio and Chem reach 8 credits at higher scores). The "min. 4" in MASTER-LIST §10 meant credits. Under-claim.
2. **IB rows:** `ib-english-a-hl` (Literature) → **fl-hum** not fl-comm. `ib-mathematics-ai-hl`, `ib-history-hl`, `ib-geography-hl`, `ib-visual-arts-hl` and `ib-spanish-b-hl` → **[]** (Math AI and History are core only conditionally). All IB rows are **6 credits at 5+** (file: 3). IB credit starts at a score of 4.
3. **A Level rows:** `alevel-history`, `alevel-geography`, `alevel-art-design` and `alevel-spanish` → **[]**. Credits are 6 for most, **7** for Biology and **8** for Chemistry and Physics (file: 3). The passing floor is grade E.
4. **DSST rows:** `principles-public-speaking`, `substance-abuse`, `introduction-to-world-religions` and `environment-humanity` → **[]**. Two rows are missing (`history-of-the-vietnam-war`, `principles-of-supervision`), both credit with no core area.
5. **DLPT rows (all 5):** → **[]**. Min score 3, **6 credits** (9 at 4–5); the file says 3.
6. `ap-statistics` and `ap-english-lit`: the core area is **conditional** on which course the institution awards. Flag them.
7. **FL_CC_COST:** $68.53–$82.78 is a tuition-only range. Verified 2026-27 resident associate tuition plus fees runs **$102.38–$118.22** per credit across four colleges. Use about **$104**, not $76.
8. **FL_COST:** $166.50 is right but is UF's **2026-27** figure (the note says 2025-26). All-in is $214.54; the SUS average is $198.22.
9. **FL_RESIDENCY:** 30 is right everywhere, but as a **last-hours rule**: last 30 at UF, FSU and FIU; 30 of the last 39 at UCF; 30 of the last 60 at USF. Re-source from the catalogs.
10. **FL_TRANSFER_CAP:** governing text found in **rule 6A-10.024(3)(a)1** (60 hours "accepted in total") and **(7)(b)–(c)** (45 exam credits "guaranteed"; beyond that, "at the discretion of the receiving institution").
11. **CPM History:** AMH x010, AMH x091 and WOH x012 apply to **FAMU only**. The other nine universities require **two non-duplicated history courses** from any listed prefix.
12. **CPM CS:** COP x271C means any COP programming course. The "BSC x010C" slot accepts many lab sciences. Physics may be algebra-based. Six other CS tracks exist under CIP 11.0101 (FSU = Track 2); the universities on the others were not read.
13. **CPM Biology:** the generic summary is CONFIRMED. Add UF's MAC x311 note and the four FCS colleges. Per-university badges (FIU requires the full organic sequence; FAMU apparently does not require Organic II; UWF and FAU restrict the math options) were read with low reliability, so keep `needs_check`.

---

## 0. Source caveat for item 1 (read this first)

- The URL the file cites, `https://www.fldoe.org/core/fileparse.php/5421/urlt/0078391-acc-cbe.pdf`, returned `target_unreachable`. So did the current fldoe link, `https://www.fldoe.org/file/5421/0078391-acc-cbe.pdf`, which the fldoe Articulation page links as "ACC Credit-by-Examination List (PDF)". All fldoe.org PDFs were unreachable through the proxy.
- **What I read instead:** the Board of Governors copy at `https://www.flbog.edu/wp-content/uploads/2026/06/ACC-Credit-by-Exam-Equivalencies-List.pdf`, read in full (28 pp.). Every page header reads "Effective August 2026 ~~September 2025~~ - State Board of Education Rule 6A-10.024, F.A.C., and Board of Governors Regulation 6.006". The strikethrough suggests this is the June 2026 *proposed* edition.
- **Rule status:** Rule 6A-10.024 is effective **8/25/2026** (flrules.org history: "...9-23-25, 5-21-26, 8-25-26"). Paragraph (7)(a) incorporates "Articulation Coordinating Committee Credit-by-Examination Equivalencies, Effective August 2026" as Ref-19656. The register shows a **Notice of Change dated 7/14/2026** between the proposed version (6/8/2026) and the adopted version (7/23/2026). The adopted document is a .docx on flrules.org (`readRefFile.asp?refId=19656&filename=2026 Credit-by-Examination 6A-10.024 clean.docx`), and the fetch tool returned it as unreadable binary. **I could not confirm that the adopted text matches the June BOG copy row for row.** The row-level findings below are from the June copy. The adopted edition can only be checked by opening that .docx (or the fldoe PDF) in a normal browser.

---

## 1. FL_EXAM_MAPPING: exam rows vs ACC Credit-by-Exam Equivalencies (Aug 2026 edition, BOG copy)

**App's claim:** the rows in `EXAM_RULES`, `AWARDED_NOT_CORE` and `UNAUDITED` in `data/fl/acceptance-rules.ts`.

**General rules (verbatim, p.1):** "If a student achieves the score listed on an AP, AICE, IB, DSST, DLPT, UExcel (Excelsior), or CLEP exam, state universities and state colleges must award the minimum recommended credit for the course or course numbers listed, even if they do not offer the course. Up to 45 total credit-by-exam credits may be awarded for guaranteed transfer." Also: "Courses designed as core in this document are also designated as a general education core course pursuant to State Board of Education Rule 6A-14.0303".

### 1a. The biggest error: AP sciences and Calculus need a score of 3, not 4. VERDICT: CORRECTED

In the code, "min 4" in MASTER-LIST §10 (which meant **4 credits**) was read as a **minimum score of 4**. The table's columns are "AP Exam Score of 3 | Score of 4 | Score of 5", and each of these rows already awards a core course in the **score-3 column**:

| Row | File: min score / credits | Table (verbatim, score-3 column) | Correct |
|---|---|---|---|
| `ap-calculus-ab` | 4 / 4 | "Calculus AB MAC X311core (min. 4 credits) Same as 3 Same as 3" | **min score 3**, 4 cr, fl-math |
| `ap-calculus-bc` | 4 / 4 | "Calculus BC MAC X311core (min. 4 credits) MAC X311core and X312 (min. 8 credits) Same as 4" | **min score 3** (4 cr); 8 cr at 4–5; fl-math |
| `ap-biology` | 4 / 4 | "Biology BSC X005Ccore or BSC X005/X005Lcore (min. 4 credits)" (score 4: BSC X010C core, 4 cr; score 5: + BSC X011C, min 8) | **min score 3**, 4 cr, fl-nat |
| `ap-chemistry` | 4 / 4 | "Chemistry CHM X020Ccore or CHM X020/X020Lcore (min. 4 credits)" (score 4: CHM X045C core; score 5: + CHM X046, min 8) | **min score 3**, 4 cr, fl-nat |
| `ap-physics-1` | 4 / 4 | "Physics 1 PHY X053C core or PHY X053/ X053Lcore (min 4 credits) Same as 3 Same as 3" | **min score 3**, 4 cr, fl-nat |

This error under-claims. A student with a 3 is currently told they get nothing in the very subjects where Florida awards a 4-credit core course. Section 1007.27(5), F.S., also sets the AP floor at 3: "Postsecondary credit for an advanced course or advanced placement course shall be limited to students who score a minimum of 3". The code comment at `EXAM_RULES` ("the AP sciences and Calculus need a **4**, not a 3") is wrong and should be removed.

### 1b. Remaining AP and CLEP rows (the "audited" half)

| Row | File | Table (verbatim) | Verdict |
|---|---|---|---|
| `ap-english-lang` | fl-comm, 3 cr, ≥3 | "ENC X101 core (min. 3 credits) / ENC X101core and X102 (min. 6 credits) / Same as 4" | CONFIRMED (6 cr at 4–5) |
| `ap-english-lit` | fl-comm, 3, ≥3 | "ENC X101core or course in AML, ENL, or LIT (min. 3 credits) / ENC X101core and either ENC X102 or LIT X005 (min. 6 credits)… Award min. 3 credits if ENC X101 already satisfied." | PARTLY. fl-comm is the only possible core area, but at score 3 the institution may award an AML/ENL/LIT course instead, which is not core. It is guaranteed core only at 4–5 |
| `ap-statistics` | fl-math, 3, ≥3 | "STA X014 or STA X023core (min. 3 credits) Same as 3 Same as 3" | PARTLY. Core only if the institution awards STA X023. Not guaranteed |
| `ap-psychology` | fl-social | "PSY X012 core (min. 3 credits)" | CONFIRMED |
| `ap-us-government` | fl-social | "POS X041core, civics (min. 3 credits)… will have met the course and assessment requirement for civic literacy." | CONFIRMED |
| `ap-macroeconomics` | fl-social | "ECO X013core (min. 3 credits)" | CONFIRMED |
| `ap-art-history` | fl-hum | "ARH X000core (min. 3 credits) / ARH X000core and ARH X050 or X051 (min. 6 credits)… Effective for exams taken after 5/16/2018" | CONFIRMED (6 cr at 4–5) |
| `ap-environmental-science` | fl-nat | "EVR X001 core (min. 3 credits)… Prior to September 2025, exam equivalent to ISC X051." | CONFIRMED (exams before Sept 2025 award ISC X051, which is not core) |
| `ap-us-history` | [], ≥3 | "AMH X000 (min. 3 credits) / AMH X010core, civics and X020 core, civics (min. 6 credits)" | CONFIRMED at the floor; 4–5 clears fl-social and civics, 6 cr |
| `ap-microeconomics` | [] | "ECO X023 (min. 3 credits)" | CONFIRMED |
| `ap-human-geography` | [] | "GEO X400 or GEO X420 (min. 3 credits)" | CONFIRMED |
| `ap-comparative-government` | [] | "CPO X001 or X002 (min. 3 credits)" | CONFIRMED |
| `ap-spanish` | [] | "One semester of intermediate- level language (min. 3 credits) / Two semesters… (min. 6 credits)" | CONFIRMED |
| `ap-european-history` | [] | "EUH X009 (min. 3 credits) / EUH X000 and X001 (min. 6 credits)" | CONFIRMED |
| `clep-college-composition` | fl-comm, 6, ≥50 | "ENC X101core and ENC X102 (min. 6 credits)" | CONFIRMED |
| `clep-college-algebra` | fl-math | "MAC X105core (min. 3 credits)" | CONFIRMED |
| `clep-college-mathematics` | fl-math | "MGF X130 core (min. 3 credits)" | CONFIRMED |
| `clep-intro-psychology` | fl-social | "PSY X012core (min. 3 credits)" | CONFIRMED |
| `clep-american-government` | fl-social | "POS X041core, civics (min. 3 credits)" | CONFIRMED |
| `clep-history-us-1` | fl-social | "AMH X010core, civics (min. 3 credits)… AMH X010 added to general education core, effective 2024-2025." | CONFIRMED |
| `clep-macroeconomics` | fl-social | "ECO X013core (min. 3 credits)" | CONFIRMED |
| `clep-biology` | fl-nat | "BSC X005core (min. 3 credits) No lab credit" | CONFIRMED |
| `clep-intro-sociology` | [] | "SYG X000 (min. 3 credits) SYG X000 removed from general education core effective 2024-2025." | CONFIRMED |
| `clep-humanities` | [] | "HUM X235 or HUM X250 (min. 3 credits)" | CONFIRMED |
| `clep-american-literature` | [] | "AML X000 (min. 3 credits)" | CONFIRMED |
| `clep-natural-sciences` | no rule | "Natural Science No direct equivalent. Recommend specific subject exams instead." | CONFIRMED (no rule is correct) |

CLEP passing score: "Exam Scale Score of 50 for Passing" (the file's 50 is CONFIRMED).

### 1c. The "UNAUDITED" rows: IB, A Level, DSST, DLPT. Most are wrong

Note that the file gives every UNAUDITED row **3 credits**, and many of those rows carry the wrong area.

**IB.** The table header reads "IB Score of 4 Minimum 3 credits per exam. | IB Score of 5-7 Minimum 6 credits per exam." The file uses a minimum of 5, which under-claims because credit starts at 4, and 3 credits, which is **wrong at 5+ (should be 6)**.

| Row | File area | Table (verbatim) | Verdict / correct |
|---|---|---|---|
| `ib-english-a-hl` (named "Language A: Literature") | fl-comm | "English Language A: Literature ENC X141 or LIT X000core (3 credits) / ENC X141 and LIT X000core (6 credits)" | **CORRECTED → fl-hum** (LIT X000 is Humanities core). At 5+: 6 cr. At 4 it is conditional (ENC X141 or LIT X000). For contrast, "English Language A: Language and Literature" → "ENC X101core (min 3 credits) / ENC X101core and ENC X102 (min 6 credits)" would be fl-comm, but that is a different exam |
| `ib-mathematics-aa-hl` | fl-math | "Math Analysis and Approaches (HL) MAC X105core / MAC X105core and MAC X311core or MAC X140 or MAC X147" | CONFIRMED area; credits 6 at 5+; core already at score 4 |
| `ib-mathematics-ai-hl` | fl-math | "Math Applications and Interpretations (HL) MAC X140 / MAC X140 and MAC X147 or STA X023core" | **CORRECTED → [] (conditional)**. Score 4 awards no core-tagged course. At 5+ it is core only if the institution picks STA X023 |
| `ib-history-hl` | fl-social | "History (HL): History of the Americas WOH X030 / WOH X030 and AMH X010core, civics or AMH X020core, civics". Africa/Middle East, Asia/Oceania and Europe HL award only WOH X030 + WOH X031 | **CORRECTED → [] (conditional)**. Core only at 5+ and only for the Americas option. WOH X030 is not core |
| `ib-psychology-hl` | fl-social | "Psychology PSY X012core / PSY X012core and additional course" | CONFIRMED; 6 cr at 5+ |
| `ib-economics-hl` | fl-social | "Economics ECO X000 / ECO X013core and ECO X023" | CONFIRMED at the 5 minimum (score 4 = ECO X000, not core); 6 cr |
| `ib-geography-hl` | fl-social | "Geography GEA X000 / GEO X200 and GEO X400" | **CORRECTED → []** |
| `ib-visual-arts-hl` | fl-hum | "Visual Arts ART X012 or ART X014 (3 credits) / … and additional Art course" | **CORRECTED → []** |
| `ib-spanish-b-hl` | fl-hum | "Spanish: Language B One semester of language credit at Elementary Language II level (min. 3 credits) / Two semesters… (min. 6 credits)" | **CORRECTED → []** |
| `ib-biology-hl` | fl-nat | "Biology (HL) BSC X005Ccore and BSC X010Ccore… (same at 5-7)" | CONFIRMED; core already at score 4 |
| `ib-chemistry-hl` | fl-nat | "Chemistry CHM X020Ccore… / CHM X020Ccore… and CHM X045Ccore" | CONFIRMED |
| `ib-physics-hl` | fl-nat | "Physics (HL) PHY X020Ccore… and PHY X053Ccore…" | CONFIRMED |

**Cambridge AICE A Level.** Passing grades are "A", "B", "C", "D", "E". The file uses null, which is fine. Note that `data/us/exams.ts` labels these "grade A–C", which understates the Florida floor.

| Row | File area | Table (verbatim) | Verdict |
|---|---|---|---|
| `alevel-english-literature` | fl-comm | "English (A-Level) – Literature in English ENC X101core and X102 or ENC X102 and LIT X100 (min. 6 credits)" | CONFIRMED area; **credits 6** |
| `alevel-mathematics` | fl-math | "Mathematics (A-Level) MAC X311core and other Mathematics course (min. 6 credits)" | CONFIRMED; **6 cr** |
| `alevel-history` | fl-social | US: "AMH X029 and AMH X020 core, civics (6 credits)… Course discontinued June 2027"; European: "EUH X031 and EUH XXXX"; International: "WOH X040 and WOH X043" | **CORRECTED → [] (conditional)**. Only the US History paper clears fl-social |
| `alevel-psychology` | fl-social | "PSY X012core and other Psychology course (min. 6 credits)" | CONFIRMED; 6 cr |
| `alevel-economics` | fl-social | "ECO X013core and ECO X023 (min. 6 credits)" | CONFIRMED; 6 cr |
| `alevel-geography` | fl-social | "GEO X200 and GEO X400 (min. 6 credits)" | **CORRECTED → []**; 6 cr |
| `alevel-art-design` | fl-hum | "No number recommendation (min. 6 credits)" | **CORRECTED → []**; 6 cr |
| `alevel-spanish` | fl-hum | "Two semesters of language credit at Intermediate II level (min of 6 credits)" | **CORRECTED → []**; 6 cr |
| `alevel-biology` | fl-nat | "BSC X010C core… and additional credit at institution's discretion… (min 7 credits)" | CONFIRMED; **7 cr** |
| `alevel-chemistry` | fl-nat | "CHM X020Ccore… and CHM X045Ccore… (min 8 credits)" | CONFIRMED; **8 cr** |
| `alevel-physics` | fl-nat | "PHY X053Ccore… and PHY X054C… (min 8 credits)" | CONFIRMED; **8 cr** |

**DSST.** "Suggested Course Number (3 credits per exam)". The passing score for 2008-revised exams is 400. The file's 400 and 3 credits are CONFIRMED.

| Row | File area | Table (verbatim) | Verdict |
|---|---|---|---|
| `dsst-principles-public-speaking` | fl-comm | "Principles of Public Speaking SPC X600 47 400" | **CORRECTED → []**. SPC is not core; the Communication core is ENC X101 or an ENC course with X101 as prerequisite |
| `dsst-college-algebra` | fl-math | "Fundamentals of College Algebra MAC X105core 400 Effective for exams taken after 5/16/2018" (older exams: MAT X033, not core) | CONFIRMED for exams after 5/16/2018 |
| `dsst-general-anthropology` | fl-social | "General Anthropology ANT X000core 47 400" | CONFIRMED |
| `dsst-substance-abuse` | fl-social | "Substance Abuse HSC X140 or HSC X150 49 400" | **CORRECTED → []** |
| `dsst-introduction-to-world-religions` | fl-hum | "Introduction to World Religions REL X300 48 400" | **CORRECTED → []** |
| `dsst-environment-humanity` | fl-nat | "Environment and Humanity EVR X017 or ISC X003 or ISC X143 or ISC X147"; "Environmental Science (Formerly Environment and Humanity) EVR X002 or ISC X003 400" | **CORRECTED → []**. EVR X002 is not EVR X001 |
| **missing** `dsst-history-of-the-vietnam-war` | none | "A History of the Vietnam War AMH X059 44 400" | **Missing row**: credit, [] |
| **missing** `dsst-principles-of-supervision` | none | "Principles of Supervision MAN X124 or MNA X345 46 400" | **Missing row**: credit, [] |

These DSST exams are not in `data/us/exams.ts` but **do** clear a core area. They are worth adding: "Art of the Western World ARH X000core", "Astronomy AST X002core", "Math for Liberal Arts MGF X130 core 400", "Principles of Advanced English ENC X101core 400".

**DLPT.** All five rows (`dlpt-spanish/arabic/korean/russian/chinese-mandarin`) are mapped to fl-hum. **CORRECTED → []**: they award language credit, and no language course is core. The credits are also wrong. "Passing Score 3-3+: Two semesters of elementary language (min. 6 credits) | Passing Score 4-5: Two semesters of elementary language and one semester of intermediate language (min. 9 credits)". Russian at 3-3+ reads "One semester elementary and one semester intermediate language (min. 6 credits)". **Correct: min score 3, 6 credits (9 at 4–5).**

### 1d. Other exams worth adding (not in `data/us/exams.ts`, but core in Florida)
CLEP Chemistry ("CHM X020core or X025 (min. 3 credits) No lab credit", fl-nat); CLEP History of the United States II ("AMH X020core, civics", fl-social); AP Physics C: Mechanics ("PHY X053Ccore…" at score 3, fl-nat); IB Philosophy ("PHI X010core", fl-hum); IB Music ("MUL X010core", fl-hum); IB Theatre ("THE X000core or THE X020", conditional). There is also a new exam family, **FACT** (Florida Advanced Courses and Tests): "FACT College Algebra MAC X105 … For the 2025-26 academic year, passing will be 66% correct."

---

## 2. FL_COURSE_MAPPING: General Education Core Course Options

**Sources:** rule 6A-14.0303, F.A.C., current version **effective 8/27/2024** (flrules.org history "...2-20-24, 8-27-24"; the full text was read from `https://flrules.org/gateway/readFile.asp?sid=0&tid=28628694&type=1&file=6A-14.0303.doc`). I also read the identical list in BOG Regulation 8.005 (amended 01-24-24), `https://www.flbog.edu/wp-content/uploads/2024/01/Regulation_8.005_FINAL.pdf`. The page the file cites, `https://www.fldoe.org/policy/articulation/general-edu-core-course-options.stml`, opened; it confirms that the list sits in 6A-14.0303 and Reg 8.005 and is reviewed every four years.

| Course | File | Rule text (verbatim) | Verdict |
|---|---|---|---|
| ENC 1101 | fl-comm | "(a) Communication: 1. ENC X101 English Composition I" | CONFIRMED |
| ENC 1102 | fl-comm | "2. Any student who successfully completes a course with an ENC prefix for which ENC X101 is an immediate prerequisite shall be considered to have completed the communication core." | CONFIRMED, via the prerequisite clause rather than by name |
| MAC 1105 | fl-math | "(d) Mathematics for students entering… in the 2024-25 academic year and thereafter: 1. MAC X105 College Algebra" | CONFIRMED |
| MGF 1106 | [] | Not in (d). "6. To avoid excess credit hours, successful completion of MGF X106 and X107 prior to the 2024-25 academic year may be used to satisfy the mathematics core in lieu of MGF X130." | CONFIRMED for students entering 2024-25 or later. Caveat: earlier entrants who already passed it keep it (also (3)(e)) |
| STA 2023 | fl-math | "4. STA X023 Statistical Methods" | CONFIRMED |
| PSY 2012 | fl-social | "6. PSY X012 Introduction to Psychology" | CONFIRMED |
| SYG 2000 | [] | Not on (f) Social Sciences list (AMH X010, AMH X020, ANT X000, ECO X013, POS X041, PSY X012) | CONFIRMED |
| POS 2041 | fl-social | "5. POS X041 American Government" | CONFIRMED |
| AMH 2020 | fl-social | "2. AMH X020 Introductory Survey Since 1877" | CONFIRMED |
| ARH 2000 | fl-hum | "(b) Humanities: 1. ARH X000 Art Appreciation" | CONFIRMED |
| PHI 2010 | fl-hum | "5. PHI X010 Introduction to Philosophy" | CONFIRMED |
| LIT 2000 | fl-hum | "3. LIT X000 Introduction to Literature" | CONFIRMED |
| BSC 1005 | fl-nat | "(e) Natural Sciences: 2. BSC X005 General Biology" | CONFIRMED |
| CHM 1020 | fl-nat | "5. CHM X020 Chemistry for Liberal Studies" | CONFIRMED |
| AST 1002 | fl-nat | "1. AST X002 Descriptive Astronomy" | CONFIRMED |

All 15 course rows are right. One nuance in the file's note: the Math, Natural Science and Communication lists each end with an "immediate prerequisite" clause, so any course whose immediate prerequisite is a core course also clears the area (for example MAC 1140 after MAC 1105 at colleges that set that prerequisite). The file under-claims here, which is the safe direction.

---

## 3. FL_CC_COST: Florida College System per-credit cost. VERDICT: CORRECTED

**App's claim:** "Florida College System per-credit-hour rates for Fall 2025-26 run roughly $68.53 to $82.78 across colleges; $76 is the middle." `PER_CREDIT = 76`.

**Findings:**
- The statewide fee report the file cites, `https://www.fldoe.org/file/19874/2526-SFRF.pdf`, and its .xlsx twin were **unreachable/unreadable**. The fldoe Student Fees page lists 2025-2026 as the latest edition; no 2026-27 report is posted.
- **The $68.53–$82.78 range is tuition only, and partly not even associate-degree tuition.** $82.78 is the statutory tuition ceiling: §1009.23(3)(a), F.S., "the standard tuition shall be $71.98 per credit hour", and (4) lets boards set tuition "no more than 10 percent below and 15 percent above". $71.98 × 1.15 = $82.78, which is exactly MDC's tuition line. $68.53 matches Daytona State's **vocational certificate** tuition, not its associate-degree tuition. Statute also authorizes required per-credit fees on top of tuition: financial aid ≤5%, activity ≤10%, technology ≤5%, capital improvement ≤20%.
- **Verified 2026-27 resident associate-degree tuition plus required fees per credit:**
  - Daytona State: "Associate of Arts & Associate of Science Degree Programs… TOTAL **$102.38**" (Tuition & Instructional Fees 2026-2027). https://www.daytonastate.edu/tuition-and-fees/index.html
  - Seminole State: "Fee schedule for 2026-2027… College Credit Fees… Total Credit Hour Rate **$104.08**". https://www.seminolestate.edu/catalog/student-info/residency/fees
  - Miami Dade: "Associate Programs… Total Cost Per Credit **$118.22**" (tuition $82.78, includes $3.00 parking; the year is not labelled, only "current academic year"). https://www.mdc.edu/student-financial-services/tuition-fees/
  - Valencia: "$103.06 per credit hour" for associate courses (search snippet of its official page; the page did not render for me and the year is not labelled).
- **Correct value:** in-state tuition plus required fees at the four colleges I could check runs about **$102–$118 per credit**. A sensible middle is **≈$104** (pending the statewide SFRF, which is the only way to give a true range across all 28 colleges). The current $76 **under-prices the community-college route by about 25%**, which overstates the student's saving, the direction this project tries not to err in. Labs, distance-learning ($8.85–$15/credit) and access fees come on top.

---

## 4. FL_COST: SUS per-credit cost ($167). VERDICT: CONFIRMED (for UF, 2026-27), with corrections to the note

**App's claim:** $105.07 + $44.17 + $6.76 + $5.25 + $5.25 = $166.50 → $167, "Built from the University of Florida 2025-26 per-credit-hour schedule".

**UF Regulation 3.0375 (History ends "…2-26-26 (BOG Approval), 6-11-26 (BOT Amended)").** Verbatim: "(a) Undergraduate Courses Charged per Student Credit Hour 2026-27: Resident Tuition $105.07 | Tuition Differential $44.17 | Capital Improvement Trust Fund $6.76 | Student Financial Aid $5.25 | Technology $5.25". Sum = **$166.50**. https://policy.ufl.edu/regulation/3-0375/

- So the figure is right for **2026-27**. The note's "2025-26" label should say 2026-27.
- UF's local per-credit fees, from UF Reg 3.0372 (https://policy.ufl.edu/regulation/3-0372/): "Health Fee: $16.08 | Athletic Fee: $3.46 | Activity and Service Fee $19.06" and "Transportation Access Fee: $9.44". **UF all-in = $214.54/credit.**
- **Comparison, from the BOG "State University System of Florida, Tuition and Required Fees, 2026-27"** (https://www.flbog.edu/wp-content/uploads/2026/07/2026-2027-SUS-Tuition-and-Fees-Report.pdf), resident undergraduate per hour, all-in: UF $214.54, FSU $216.88, FAMU $194.24, USF $212.65, FAU $208.41, UWF $213.23, UCF $212.28, FIU $218.71, UNF $212.98, FGCU $205.69, NCF $191.10, FL Poly $164.65, **SUS AVG $198.22**.
  - FSU 2026-27 (https://tuition.fsu.edu/tuition-and-fees-0): Tuition $105.07, Differential 49.59, Fin Aid 5.25, CITF 4.76, Technology 5.25 = **$169.92** on the app's five-component basis. "Total Per Credit Hour (PCH) Resident Rate $215.55" (+$20/semester facility fee).
  - USF 2026-27 (BOG report): Tuition $105.07, Differential $46.88, Fin Aid $5.25, CITF $6.76, Technology $5.25 = **$169.21** on the same basis; all-in $212.65.
- The differential varies by campus ($36.38 at FAMU/FGCU up to $52.29 at FIU per the BOG report), and FL Poly's all-in total is $164.65. So "$167 applied across the SUS" is a fair five-component figure, and the note's caveat that local fees push it to about $200–$219 holds. Recommend the note cite the BOG report and say 2026-27.

---

## 5. FL_RESIDENCY: 30 hours. VERDICT: PARTLY (the number is right; the rule is a "last-hours" rule, not just 25%)

**App's claim:** "30 is the accreditor's floor — SACSCOC requires at least 25 percent… A campus may require more."

| Univ. | Rule (verbatim) | Source |
|---|---|---|
| UF | "Residence: The last 30 credits applied to the degree must be completed in residence at the University of Florida. In extenuating circumstances, the last three credits may be waived by petition." Also: "Under most circumstances, students who have already transferred 60 credits from a public/state college may not apply additional public/state college credits toward their degree." | https://catalog.ufl.edu/UGRD/colleges-schools/UGLAS/ (current UF UGRD catalog, CLAS page) |
| FSU | "8. **Hours in Residence**. Completion of the last 30 credit hours at Florida State University… College-Level Examination Program (CLEP) credit earned may be applied to the final 30-hour requirement provided that the student has earned at least 30 credit hours credit at Florida State University." Also "6. … at least 45 credit hours in courses numbered 3000 and above, 30 hours of which need to be taken at Florida State University" and "7. … half of the major course credit hours, in residence" | https://bulletin.fsu.edu/academics/ug-degree-reqs |
| USF | "30/60: Residency requirement (30 of your last 60 must be completed at USF)" (USF Arts & Sciences advising page). Catalog program pages (search snippets, catalog.usf.edu): "USF Academic Residency Requirement - 30 of the last 60 hours earned must be from USF." | https://www.usf.edu/arts-sciences/students/advising/your-degree/index.aspx |
| UCF | "University Minimum Exit Requirements… 30 of the last 39 hours of course work must be completed in residency at UCF. A maximum of 45 hours of extension, correspondence, CLEP, Credit by Exam, and Armed Forces credits permitted." | https://www.ucf.edu/degree/history-ba/ (the same block appears on every UCF degree page) |
| FIU | "Successful completion of at least 120 semester hours… of which at least 25% of the credits and the last 30 semester hours must be completed at the University… In no case may a student graduate with fewer than 25% of the total number of credits required for the degree program from FIU." (Policy 340.065, last revised July 14, 2026) | https://policies.fiu.edu/files/340.065 |

**Correction to the note and to `fl-residency` in degree.ts:** all five require 30, so `residency_min_units: 30` stands. But they are **positional** rules: the *last* 30 at UF, FSU and FIU, 30 of the last 39 at UCF, 30 of the last 60 at USF. They are not a free-floating 25%, so exam or CLEP credit cannot be the final hours at most of them. UCF also caps CLEP and credit by exam at 45 hours toward the degree. The provenance can move from the SACSCOC PDF to these catalogs.

---

## 6. FL_TRANSFER_CAP: 60-hour AA and the 45-credit exam limit. VERDICT: CONFIRMED (governing text found)

**App's claim:** the 60 "rests on some other document we have not opened"; "no more than 45 credit-by-exam hours count toward guaranteed transfer."

- **The 60 hours:** State Board rule **6A-10.024(3)(a)1.**, F.A.C. (the Statewide Articulation Agreement), effective 8/25/2026. https://flrules.org/gateway/readFile.asp?sid=0&tid=31214908&type=1&file=6A-10.024.doc. Verbatim: "Completion of sixty (60) semester hours of college credit courses in an established program of study that includes a general education curriculum of thirty-six (36) semester hours… The sixty (60) semester hours that comprise a completed associate in arts degree shall be accepted in total upon transfer to an upper division program at another public postsecondary institution."
- **The 45 credits:** same rule, **6A-10.024(7)(b)–(c)**. Verbatim: "(b) Transfer of credit by examination is guaranteed for up to forty-five (45) credits, provided that credit was awarded in accordance with the Articulation Coordinating Committee's recommended minimum scores and course equivalents. (c) Transfer of examination credit over forty-five (45) credits is at the discretion of the receiving institution." (7)(g) adds: "All credit by examination that is initially awarded based on… ACC recommended minimum scores and maximum amount of credit is guaranteed to transfer and must be accepted by all public postsecondary institutions."
- §1007.23, F.S. (https://www.flsenate.gov/Laws/Statutes/2025/1007.23), re-read: it guarantees gen-ed completion and upper-division admission ("every associate in arts graduate… shall have met all general education requirements and must be granted admission to the upper division") and contains no 60 or 45 figure. The file's note is correct about that.
- **Wording fix:** the 45 is a *guarantee ceiling*, not a prohibition. Credits beyond 45 are "at the discretion of the receiving institution" (also stated on the ACC list p.1: "Credits earned through Credit by Exam that exceed 45 semester credit hours may be transferred at the discretion of the receiving institution"). The 60 is likewise a guarantee that the AA is "accepted in total", not a statutory cap. Campus caps do exist on top: UF ("students who have already transferred 60 credits from a public/state college may not apply additional public/state college credits") and UCF (max 45 hours of CLEP/credit-by-exam etc.). So `max_transfer_units: 60` is a reasonable model, and the provenance should be 6A-10.024 plus campus catalogs, not §1007.23.

---

## 7. Florida Common Prerequisites (`fl-cpm-*` needs_check rows)

The manual is a JavaScript app: `fetch_content` returns only the site's boilerplate. All readings below come from automated-browser runs on cpm.flvc.org.

### 7a. Biology, `/programs/year/2026/3459`. VERDICT: CONFIRMED (summary accurate), with additions

Browser read (run 3c082efc, completed 2026-10-01): "Program: Biology, General (CIP: 26.0101) Track: 1 Hours: 120". The requirement blocks and options as listed:
1. **Second math/stats:** STAx024 Introd. to Probability and Statistics II (3) | STAx321 Mathematical Statistics (3) | STAx023 Statistical Methods I (GE CORE) (3) | MACx234 Calculus for Business & Soc. Science II (3) | MACx312 Calculus with Analytic Geometry II (4) | MACx282 Engineering Calculus II (4)
2. **Calculus I:** MACx311 Calculus I (GE CORE) (5) | MACx233 Calculus for Business & Soc. Sci. I (3) | MACx253 Calculus for Engineering Technology I (3) | MACx281 Engineering Calculus I (4) | MACx241 Life Science Calculus I (3)
3. **Organic chemistry II:** CHMx211 / x211L / x211C
4. **Physics II:** PHYx054 / x054L / x054C
5. **Physics I:** PHYx053 / x053L / x053C (GE CORE)
6. **Organic chemistry I:** CHMx210 / x210L / x210C
7. **Calculus-based physics alternative:** PHYx048C (GE CORE) / PHYx048 + x048L, PHYx049 (and the algebra-based PHYx053/x054 options)
8. **General chemistry II:** CHMx046C / x046 / x046L
9. **General chemistry I:** CHMx045C (GE CORE) / x045 + x045L | CHMx040, CHMx041 (expanded sequence)
10. **Biology II:** BSCx011C / x011 + x011L | BSCx041C | ZOOx010C / x010 + x010L | BOTx010C / x010 + x010L
11. **Biology I:** BSCx010C (GE CORE) / x010 + x010L | BSCx040C

Institutions (verbatim list): FAMU, FAU, FGCU ("BA, BS, and Bachelor's"), FIU, FSU, **Indian River State College, Miami Dade College, St. Johns River State College, St. Petersburg College**, UCF, UF, UNF, USF, UWF.

Notes (verbatim):
- UF: "UF DOES NOT require CHMX210/X210L & CHMX211/X211L; PHYX053/X053L & PHYX054/X054L to be taken prior to transfer admission. MACX311 & MACX312 are not required for the Bachelor of Arts in Biology track… For all other biology tracks/specializations, MACX311 is required to be taken prior to transfer admission. However, MACX312 is not required to be taken prior to transfer admission."
- FAMU, FAU, FSU, UCF, USF each: "ONLY UWF accepts this alternative common prerequisite choice." (The browser output did not say which alternative. From the block structure it is most likely the zoology/botany substitutes. **Unconfirmed.**)
- UNF: "Biology does require a C or above for each of the prerequisite courses."

**A second browser run** (8f3117ed, 2026-10-01 17:50Z) asked for every per-option "Institution Details" badge. The badges it returned are partly inconsistent: lab-only components are marked "not accepted" almost everywhere, which probably means "not accepted on its own", and the zoology/botany options came back "not accepted" even at UWF, which contradicts the first run's "ONLY UWF accepts" note. Treat the following as **leads, not facts**:
- FIU: the full organic sequence CHM x210 + x210L + x211 + x211L is marked "This alternative is required at the institution".
- FAMU and St. Johns River State: Organic Chemistry II (CHM x211) "Requirement is not accepted by the institution", i.e. apparently not required.
- UWF: only MAC x311 is accepted for Calculus I, none of the second-math alternatives, and Organic I and Physics I are marked "Requirement is not accepted".
- FAU: STA x023 is "not accepted" as the second math/stats course.
- St. Petersburg College: STA x023 "is a preference".
- Zoology/botany substitutes for Biology II appear not to be accepted at nearly all institutions.

The app's six-line summary matches the generic track. Per-university differences are real, so keep `needs_check` and the "check the exact options with the university" note. Suggested additions: "and others" in the Calculus I line = MAC x253, MAC x281; the second-math list also includes STA x024, STA x321 and MAC x282; four FCS baccalaureate colleges also use this track; add UF's MAC x311 note and the "ONLY UWF accepts this alternative" warning. One caveat: the browser output put PHYx054C inside the organic chemistry I block and listed CHM courses inside the physics block. That looks like an extraction artifact, so treat block membership as approximate.

### 7b. History, `/programs/year/2026/3704`. VERDICT: CORRECTED (the summary is right only for FAMU)

Browser read (run 16cf1094, completed 2026-10-01 17:34Z): "CIP Code: 54.0101 Track: 1 Total Hours: 120". Universities: FAMU, FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF, UWF. Notes, verbatim: "Do not duplicate course selection." and "University of West Florida – Bachelor's: UWF recommends AMH 2010, AMH 2020, EUH 1000, EUH 1001, and/or HIS 2050."

The page carries per-institution "Institution Details" lines that change the meaning:
- **Requirement 1 (3 h):** options AFH, AMH, WOH, LAH, ASH, HIS or EUH x000–x999, **or** AMH x091 Survey of African American History. Each open-prefix option is marked "Florida A&M University, Bachelor's: This alternative is not accepted at the institution". AMH x091 is marked "not accepted" at FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF.
- **Requirement 2 (3 h):** options ASH, AMH, EUH, WOH, LAH, AFH or HIS x000–x999, **or** WOH x012 World History I. Same pattern: the open prefixes are not accepted at FAMU, and WOH x012 is not accepted at the other nine.
- **Requirement 3 (3 h):** AMH x010 Introductory Survey to 1877 (GE CORE), marked "Requirement is not accepted by the institution" for FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF.

**Reading:** at **FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF** the common prerequisites are **two history courses from any of AFH/AMH/ASH/EUH/HIS/LAH/WOH, not duplicated**, and **AMH x010 is not a common prerequisite there**. At **FAMU** they are **AMH x091 + WOH x012 + AMH x010**. The app's row presents AMH x010 as required everywhere and treats WOH x012 and AMH x091 as "suggestions", which is the FAMU track misread as universal. Caveat: this rests on an automated browser's reading of the per-institution badges. The pattern is internally consistent, but someone should eyeball the page once before editing.

### 7c. Computer science, `/programs/year/2026/3344`. VERDICT: PARTLY (course list right; alternatives missing; other tracks below)

Browser read (run f10f4331, completed 2026-10-01 17:31Z): "Computer Science (CIP 11.0701) Track Number: 1 Total Hours: 120". Universities: "Florida Polytechnic University - Bachelor of Science; University of North Florida - Bachelor's; University of West Florida - Bachelor's". "There are NO links, tabs, dropdowns, or any other visible references to other tracks… on this page."

Requirements and alternatives (each "x" is the level digit):
1. MAC x311 Calculus I (GE CORE), 5 h | alt MAC x281 Engineering Calculus I
2. MAC x312 Calculus with Analytic Geometry II, 4 h | alt MAC x282 Engineering Calculus II
3. QMB x100 Basic Business Statistics, 3 h | alts STA x100 Programming with Data in R, STA x024, STA x037, STA x122, **STA x023 Statistical Methods I (GE CORE)**
4. MAD x104 Discrete Mathematics, 3 h (no alternative)
5. CDA x201 Sequential Circuits, 3 h | alt CDA x105 Introduction to Computer Systems
6. COP x271C (no title) | alt "COP x000-x999 Computer Programming", i.e. **any COP programming course**
7. COP x710 Database Design/Architecture | alts CGS x540 Database Management, CGS x542
8. COP x001 Introd. to Computer Programming II | alts COP x272C, x270, x334, x25x, x210, x330, x552, x258, x251
9. PHY x049C Gen Phys w/Calculus II, 5 h | alts PHY x049 + x049L, **PHY x054C / x054 + x054L (algebra-based II)**
10. BSC x010C General Biology (GE CORE), 4 h | alts BSC x010/x010L, CHM x045C/x045/x045L, CHM x046/x046C/x046L, BSC x011/x011L/x011C, MCB x000, BSC x085, BSC x050, BSC x005, ANT x511, AST x002, OCE x001. In effect this is **one natural-science course** from a wide list, not biology specifically.
11. PHY x048C General Physics with Calculus I (GE CORE), 5 h | alts PHY x048 + x048L, **PHY x053C / x053 + x053L (algebra-based I)**

Corrections to the app's row: "COP x271C (title not shown in the manual)" should read "any COP programming course (COP x271C or any COP x000–x999)". "BSC x010C General Biology" should read "one lab science (biology, chemistry, astronomy, oceanography, A&P… options)". Physics I/II may be algebra-based. Statistics may be STA x023, which also counts toward the gen-ed core. The universities (FL Poly, UNF, UWF) are CONFIRMED.

**Other CS tracks:** see 7d.

### 7d. Other computer-science tracks in the 2026-27 manual. PARTLY read

Browser search of `https://cpm.flvc.org/manual/2026` for "Computer Science" (run d6cbe73f, 2026-10-01 17:40Z) returned these entries. The results list shows no universities, and the run did not open each page.

| Program (as listed) | CIP | Track | Universities |
|---|---|---|---|
| Computer Science | 11.0701 | 1 | FL Poly, UNF, UWF (read on the program page, 7c) |
| Computer and Information Science - Computer Science | 11.0101 | 1 | not read |
| Computer and Information Science - Computer Science FSU | 11.0101 | 2 | **FSU**, by name. A search-engine snippet of the 2027-28 manual (`cpm.flvc.org/programs/238/246`) reads: "B.S. in Computer Science. Florida State University - Bachelor's. CIP: 11.0101. Track: 2. Hours: 120. Specialized Admissions." |
| Computer and Information Science - Information Systems | 11.0101 | 3 | not read |
| Computer Science | 11.0101 | 4 | not read |
| B.S. in Computer & Information Science | 11.0101 | 5 | not read |
| Computer Science | 11.0101 | 20 | not read |

**Implication for the app:** most SUS computer-science bachelor's degrees (including FSU's) sit under **CIP 11.0101**, not 11.0701. The app's single row covers only FL Poly, UNF and UWF, as its note already says. Which universities (UF, UCF, USF, FIU, FAU, FAMU, FGCU) use Tracks 1, 4, 5 and 20 is **UNVERIFIED**. Each needs one browser run on its program page (open it from `cpm.flvc.org/manual/2026` → search "Computer Science"). I stopped here because the TinyFish wallet reported a low balance.
