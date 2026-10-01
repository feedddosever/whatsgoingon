# Pennsylvania (PASSHE) verification: data/pa/*

Read date for every source: **2026-10-01**. "(automation)" means a TinyFish browser agent read a JavaScript-only page and reported it back. Those rows are official-source but should be eyeballed by a person before promotion.
Nothing here was taken from memory. Where a page could not be read, the item says so.

---

## Summary of corrections and flags

| # | Item | Verdict | One-line |
|---|---|---|---|
| 1 | PA_EXAM_MAPPING (per-university) | **PARTLY** | Minimum scores (3 / 50) hold everywhere a chart exists, but several rows do not land in the category the app assumes at specific universities (see the flag list in 1b). |
| 1a | CLEP College Composition → pa-comp | **PARTLY** | **Not listed** on Kutztown's CLEP chart or on PennWest's CLEP list, although the statute requires credit at 50. |
| 1b | CLEP Humanities → pa-hum | **CORRECTED (note text)** | No published refusal was found. Every chart that exists **accepts** it, but four of them give only an elective with no gen-ed area: ESU (ELEC 299), PennWest ("Humanities Elective"), Commonwealth (HUMN 199), Kutztown (HUMN 880/881). The app's note "others may not [take it]" points the wrong way. The real risk is elective-only credit. |
| 1c | AP Psychology → pa-soc | **PARTLY** | Millersville gives only a **PSYC 1XX elective at a 3** (PSYC 100 needs a 4). ESU puts Psychology in its **Group B – Science**, not Social Science. |
| 1d | AP US History / AP European History → pa-soc | **PARTLY** | Commonwealth gives **HIST 199 "History Transfer"** at a 3. The statewide guidance itself says a 3 may be "a general elective". |
| 1e | AP Calculus AB → pa-math | **PARTLY** | SRU gives **MATH 125 Precalculus** at a 3 (Calculus I needs a 4). Statewide guidance allows "mathematics elective credit" at a 3. |
| 1f | CLEP College Algebra → pa-math | **PARTLY (minor)** | Millersville: MATH 101 with **no G2 tag**. Millersville's math requirement is a separate Foundations "Approved MATH Course", so this may still count there. Not verified. |
| 1h | West Chester AP (automation) | **PARTLY** | The tool showed **no AP equivalency for Statistics, US History or Physics 1**. That may be an automation miss, so a person must check by hand. WCU CLEP: per-exam rows UNVERIFIABLE (run never started). |
| 1i | Coverage gaps | **UNVERIFIABLE** | Cheyney (chart is an unreadable 2018 .docx), PennWest AP (no chart found), SRU CLEP (tool only), WCU CLEP. |
| 1g | Credits (units_granted = 3) | minor | AP Physics 1: the statewide guidance recommends **4** credits, and most charts give 4. AP Biology and AP Chemistry are 4 at several universities. The app understates credits, which is the conservative direction. |
| 2 | Statewide uniform standards | **CONFIRMED** | All 25 standard exams in the file: AP 3 / CLEP 50. **CLEP Humanities has no statewide standard** (confirmed absent from all 8 subject documents and the index page). |
| 3 | Statute, 24 P.S. § 20-2002-C(d) | **CONFIRMED – citable** | Operative text read on palegis.us (automation) and in PDE's TAOC manual reproduction. History note: "(d) added Nov. 6, 2017, P.L.1142, No.55". |
| 4 | PA_CC_COST $220/credit | **CONFIRMED** | 8 colleges, sponsoring/in-district 2026-27 per-credit tuition + mandatory fees: $167.50 to $237–242. Median **$219**, mean ≈ $216. |
| 5 | PASSHE $347/credit; residency 2016-24-A | **CONFIRMED** | Both current. One caveat: PASSHE says base tuition is consistent across "**most**" universities, not all. |

---

## Item 1: per-university AP / CLEP charts (PA_EXAM_MAPPING)

**App's current claim:** every PASSHE university awards credit at AP 3 / CLEP 50 for the 26 exam rows in `acceptance-rules.ts`, and each award satisfies one framework area (pa-comp / pa-math / pa-sci / pa-soc / pa-hum). CLEP Humanities is mapped to pa-hum with the note "The statewide standards set no minimum score for this exam… IUP does (ENGL 121 at 50); others may not."

**Overall verdict: PARTLY.** No university chart requires a score above 3 / 50 for any exam row in the file at the score the app uses. Only two universities publish gen-ed categories on their charts: ESU (attribute codes) and Millersville (G1/G2/G3). Everywhere else the chart gives a course and the gen-ed effect is **not stated**.

### Gen-ed code keys (needed to read ESU and Millersville)
- **ESU** (https://esu.smartcatalogiq.com/en/current/undergraduate-catalog/university-requirements/the-general-education-program/summary-of-general-education-requirements). Quote: "Group A - Arts and Letters (12 credits) … English Language and Literature (AEL) … Fine Arts … (AFA) … Modern Languages (AML) … Group B - Science (12 credits) … Biology (BBI) Chemistry (BCH) Computer Science (BCS) Mathematics (BMA) Physics (BPH) **Psychology (BPS)** … Group C - Social Science (12 credits) … Economics (CED) Geography (CGE) History (CHI) Political Science (CPS) Sociology (CSO)". The required courses are "ENGL 103 (3 credits)", an FYE course and a Wellness course.
- **Millersville** (https://www.millersville.edu/gened/legacy/curriculum-requirements.php). Quotes: "Arts & Humanities courses (G1)" / "Sciences and Mathematics courses (G2)" / "Social Sciences courses (G3)", each "three courses (9 credits total)". Separately, under "FOUNDATIONS FOR LIFELONG LEARNING", the required courses are "ENGL 110: Introduction to College Writing", "COMM 100: Fundamentals of Speech" and "**Approved MATH Course** (3-4 credits): Students choose from an approved list based on their Math Placement Test (MPT) scores and program requirements." Composition and the math requirement are therefore Foundations courses, not G-blocks. That means a math course with no G2 tag (CLEP College Algebra → MATH 101) may still meet the Foundations math requirement. Whether MATH 101 is on the approved list was **not verified**. Caveat: Millersville's gen-ed page (https://www.millersville.edu/gened/, search snippet) says students who began "*before Fall 2026*" follow the Legacy program. The chart codes are Legacy codes, and the new "Gateway" program was **not read**.

### 1.1 Indiana University of Pennsylvania (IUP): CONFIRMED (courses); gen-ed not stated
- AP: https://www.iup.edu/orientation/placement-testing/equivalency-resources/advance-placement-equivalency-chart.html (undated)
- CLEP: https://www.iup.edu/orientation/placement-testing/equivalency-resources/clep-exam-equivalency-chart.html (undated). Quote: "All final decisions are made by the Office of Admissions. Course equivalencies subject to change by the Office of Admissions."

| Exam | Min | IUP course (credits) |
|---|---|---|
| AP Eng Lang | 3 | ENGL 101 Composition 1 (3) |
| AP Eng Lit | 3 | ENGL 121 Humanities Literature (3) |
| AP Calc AB | 3 | MATH 121 … or Math 115 (3) |
| AP Calc BC | 3 | MATH 125 Calc I (3) |
| AP Statistics | 3 | MATH 117 Probability and Stats (3) |
| AP Biology | 3 | BIOL 104 Human Biology (4) |
| AP Chemistry | 3 | CHEM 111 and 112 (8) |
| AP Physics 1 | 3 | PHYS 111/121 General Physics I (4) |
| AP Psychology | 3 | PSYC 101 (3) |
| AP US Gov | 3 | POLI 111 (3) |
| AP US History | 3 | HIST 196 (non-History majors) (3) |
| AP European History | 3 | HIST 197 (non-majors) / HIST 1XX (History majors) (3) |
| AP Macro / Micro | 3 | ECON 121 / ECON 122 (3) |
| AP Art History | 3 | ARHI 101 (3) |
| AP Spanish Lang | 3 | SPAN 201 Intermediate Spanish (3) |
| CLEP College Comp | 50 | ENGL 101 (3) |
| CLEP College Algebra | 50 | MATH 105 (3) |
| CLEP Intro Psych | 50 | PSYC 101 (3) |
| CLEP Intro Sociology | 50 | SOC 151 (3) |
| CLEP American Gov | 50 | PLSC 111 (3) |
| CLEP US History I | 50 | HIST 196 / HIST 204 (History majors) (3) |
| CLEP Macroeconomics | 50 | ECON 121 (3) |
| CLEP Biology | 50 | BIOL 103 (4) |
| CLEP American Literature | 50 | ENGL 212 (3) |
| CLEP Humanities | 50 | ENGL 121 Humanities: Literature (3) |

### 1.2 Millersville: PARTLY
- AP: https://www.millersville.edu/admissions/undergrad/basics/advanced-placement-scores.php. Quote: "Millersville awards credit for Advanced Placement scores of 3 or higher."
- CLEP: https://www.millersville.edu/admissions/undergrad/basics/clep-exam.php. Quote: "Millersville awards credit for CLEP exam scores of a 50 or higher."

| Exam | Min | Course (credits) | Gen-ed as printed | vs app |
|---|---|---|---|---|
| AP Eng Lang | 3 | ENGL 110 English Composition (3) | – | ok |
| AP Eng Lit | 3 | ENGL 230 Intro to Literature (3) | – | ok |
| AP Calc AB | 3 | MATH 151 (4) | G2 | ok |
| AP Calc BC | 3 | MATH 161 (4) | G2 | ok |
| AP Statistics | 3 | MATH 130 (3) | G2 | ok |
| AP Biology | 3 | BIOL 100 (4) | G2 + Lab | ok |
| AP Chemistry | 3 | CHEM 111 (4) | G2 + Lab | ok |
| AP Physics 1 | 3 | PHYS 131 (4) | G2 + Lab | ok |
| **AP Psychology** | **3** | **"PSYC 1XX: Psychology elective" (3); 4,5 → PSYC 100** | **none printed** | **FLAG: elective at 3** |
| AP US Gov | 3 | GOVT 111 (3) | – | ok |
| AP US History | 3 | HIST 106 + HIST 1XX elective (6) | – | ok |
| AP European History | 3 | HIST 101 + HIST 102 (6) | – | ok |
| AP Macro / Micro | 3 | ECON 101 / ECON 102 (3) | – | ok |
| AP Art History | 3 | ART 202 (3) | – | ok |
| AP Spanish Lang | 3 | SPAN 101 (3) | – | ok |
| CLEP College Comp | 50 | ENGL 110 & ENGL 1XX (6, "General Exams (6 credits each)") | G1 | ok |
| **CLEP College Algebra** | **50** | **MATH 101** | **none printed** | **FLAG: no G2** |
| CLEP Psychology | 50 | PSYC 100 | G3 | ok |
| CLEP Sociology | 50 | SOCI 101 | G3 | ok |
| CLEP American Gov | 50 | GOVT 111 | G3 | ok |
| CLEP US History I | 50 | HIST 106 | G3 | ok |
| CLEP Macroeconomics | 50 | ECON 101 | G3 | ok |
| CLEP Biology | 50 | BIOL 100 | "No Lab/G2" | ok |
| CLEP American Literature | 50 | ENGL 236 | G1 | ok |
| CLEP Humanities | 50 | HMFA 1XX & HMFA 2XX (6) | G1 | ok |

### 1.3 Kutztown: PARTLY
- AP: https://www.kutztown.edu/about-ku/administrative-offices/registrar/transfer-credit-center/advanced-placement-(ap)-credits.html. Quote: "Grades of '3' or higher on some AP exams may be considered for credit at KU." Credits are not printed.
- CLEP: https://www.kutztown.edu/about-ku/administrative-offices/registrar/transfer-credit-center/clep-test.html. Quote: "CLEP Exams are no longer administered at Kutztown University, but the credits are still accepted."

| Exam | Min | Course (credits) | vs app |
|---|---|---|---|
| AP Eng Lang | 3 | COMP100 and ENGL880 | ok |
| AP Eng Lit | 3 | ENGL110 and COMP100 | ok (also gives COMP100) |
| AP Calc AB / BC | 3 | MATH181 / MATH181 | ok |
| AP Statistics | 3 | MATH140 | ok |
| AP Biology / Chemistry / Physics 1 | 3 | BIOL104 / CHEM100 / PHYS040 | ok |
| AP Psychology | 3 | PSYC011 | ok |
| AP US Gov | 3 | POLI010 | ok |
| AP US History | 3 | HIST025 | ok |
| AP European History | 3 | HIST014 | ok |
| AP Macro / Micro | 3 | ECON110 / ECON120 | ok (the CLEP chart uses ECON 011/012; the two pages disagree) |
| AP Art History | 3 | ARTH024 | ok |
| AP Spanish Lang | 3 | SPAN101, SPAN102, SPAN103 and SPAN104 | ok |
| **CLEP College Composition** | – | **NOT LISTED** (the table lists 36 CLEP exams; College Composition and College Composition Modular are absent) | **FLAG** |
| CLEP College Algebra | 50 | MATH 105 (3) | ok |
| CLEP Intro Psych / Sociology | 50 | PSYC 011 / SOCI 010 (3) | ok |
| CLEP American Gov | 50 | POLI 010 (3) | ok |
| CLEP US History I | 50 | HIST 025 (3) | ok |
| CLEP Macroeconomics | 50 | ECON 011 (3) | ok |
| CLEP Biology ("General Biology") | 50 | BIOL 104 (4) | ok |
| CLEP American Literature | 50 | ENG 105 Experiences in American Literature (3) | ok |
| **CLEP Humanities** | 50 | **"HUMN 880 Humanities Elective HUMN 881 Humanities Elective" (6)** | **FLAG: elective; gen-ed not stated** |

### 1.4 East Stroudsburg (ESU): PARTLY (the only chart with full gen-ed attributes)
- Policy page: https://www.esu.edu/admission-aid/undergraduate-admissions/freshman-students/college-credits.php. Quotes: "A grade of '3' or higher on any of these examinations will be counted for three credits by East Stroudsburg University." / "Normally CLEP examinations may not be counted toward the student's major field of study."
- AP list: https://www.esu.edu/admission-aid/undergraduate-admissions/documents/ap-courses2022-v2026.pdf
- CLEP list: https://www.esu.edu/admission-aid/undergraduate-admissions/documents/clep-2020-v2026.pdf

| Exam | Min | ESU course (credits) | Attributes as printed | ESU group | vs app |
|---|---|---|---|---|---|
| AP Eng Lang | 3 | ENGL 103 English Composition (3) | (none; ENGL 103 is the required course) | required | ok |
| AP Eng Lit | 3 | ENGL 162 GN (3) | HUEN AEL C | A | ok |
| AP Calc AB | 3 | MATH 140 GN Calculus I (4) | BMA NSMA | B (Science) | ok (math sits in Science at ESU) |
| AP Calc BC | 3 | MATH 140 (4) | BMA NSMA | B | ok |
| AP Statistics | 3 | Math 110 GN General Statistics (3) | NSMA BMA M | B | ok |
| AP Biology | 3 | BIOL 114 (4) | BBI NSBI | B | ok |
| AP Chemistry | 3 | Chem 121 (3) + CHEM 123 lab (1) | BCH NSCH | B | ok |
| AP Physics 1 | 3 | PHYS 131 (4) | NSPH BPH | B | ok |
| **AP Psychology** | 3 | PSY 100 GN General Psychology (3) | **NSPS BPS** | **B – Science** | **FLAG: Science group, not Social Science** |
| AP US Gov | 3 | POLS 120 (3) | SSPS CPS G | C | ok |
| AP US History | 3 | HIST 141 (3) | SSHI CHI G | C | ok |
| AP European History | 3 | HIST 272 GN (3) | SSHI CHI G | C | ok |
| AP Macro / Micro | 3 | ECON 111 / ECON 112 (3) | SSEC CEC G | C | ok |
| AP Art History | 3 | ART 101 GN (3) | AFA A HUFA | A | ok |
| AP Spanish Lang | 3 | MLSP 214 GN Spanish III (3) | HUFL ADV (no AML printed) | unclear | check |
| CLEP College Comp | 50 | ENGL 103 English Composition (listed as **6** credits) | – | required | ok (credits look like an ESU typo; Modular = 3) |
| CLEP College Algebra | 50 | MATH 100 GN Number Sets & Structures (3) | GN | – | ok |
| CLEP Intro Psych | 50 | PSY 101 GN (3) | GN | (B per above) | **same FLAG as AP Psych** |
| CLEP Intro Sociology | 50 | SOC 111 GN (3) | GN | C | ok |
| CLEP American Gov | 50 | POLS 120 GN (3) | GN | C | ok |
| CLEP US History I | 50 | HIST 141 GN (3) | GN | C | ok |
| CLEP Macroeconomics | 50 | ECON 111 GN (3) | GN | C | ok |
| CLEP Biology | 50 | BIOL 105 GN (6) | GN | B | ok |
| CLEP American Literature | 50 | ENGL 162 GN (3) | GN | A | ok |
| **CLEP Humanities** | 50 | **ELEC 299** (3) | **none** | **elective** | **FLAG: elective only, does not fill pa-hum here** |

### 1.5 Shippensburg: CONFIRMED (courses); gen-ed not stated
- https://www.ship.edu/admissions/clep_credit_ap_credit/. Quotes: "Shippensburg University grants advanced placement (AP) and college level examination program (CLEP) credit … based on the guidelines as established by The College Board." / "You may earn up to 30 college credits through CLEP examinations."

| Exam | Min | Course (credits) |
|---|---|---|
| AP Eng Lang / Lit | 3 | ENGL 114 / ENGL 250 (3) |
| AP Calc AB / BC | 3 | MATH 211 / MATH 212 (4) |
| AP Statistics | 3 | MATH 117 (3) |
| AP Biology | 3 (or 4) | BIOL 100 (3); 5 → BIOL 161 (4) |
| AP Chemistry | 3 | CHEM 105 (3) |
| AP Physics 1 | 3 | PHYS 121 and PHYS 123 (4) |
| AP Psychology | 3 | PSYC 101 (3) |
| AP US Gov | 3 | POLI 100 (3) |
| AP US History | 3 | HIST 202 (3) |
| AP European History | 3 | HIST 106 (3) |
| AP Macro / Micro | 3 | ECON 101 / ECON 102 (3) |
| AP Art History | 3 | ART 232 (3) |
| AP Spanish Lang | 3 | SPAN 103 (3); 4/5 → SPAN 202 |
| CLEP College Comp | 50 | ENGL 114 (3). Modular is **not listed**; the app has no Modular row. |
| CLEP College Algebra | 50 | MATH 140B (3) |
| CLEP Intro Psych / Sociology | 50 | PSYC 101 / SOCI 101 (3) |
| CLEP American Gov | 50 | POLI 100 (3) |
| CLEP US History I | 50 | HIST 201 (3) |
| CLEP Macroeconomics | 50 | ECON 101 (3) |
| CLEP Biology ("General Biology") | 50 | BIOL 100 (3) |
| CLEP American Literature | 50 | ENGL 233, ENGL 234 (6) |
| CLEP Humanities | 50 | ART 101 (3) |

### 1.6 Slippery Rock (SRU): PARTLY (AP confirmed; CLEP chart not found)
- AP chart: https://www.sru.edu/documents/admissions/transfer/APEquivalencyChart.pdf ("SRU Transfer Admissions – 04/2026"). Quote: "Students must take and successfully pass the AP exam for the appropriate course, with a score of 3 or higher, to receive university credit. … Some academic departments require a score of 4 or 5 to earn major-specific equivalencies."
- Catalog: https://catalog.sru.edu/academic-policies/credit-by-examination/. Quotes: "Students may qualify to earn a maximum of 45 credits" / "Credits earned by examination may not be used as part of the students' final 30 credits to be earned at the university." / CLEP: "Upon successfully passing an examination with a score at or above the American Council on Education's recommended minimum score, students will receive credit for the corresponding course(s)".

| Exam | Min | SRU course (credits) | vs app |
|---|---|---|---|
| AP Eng Lang | 3 | ENGL 102 Critical Writing (3) | ok |
| AP Eng Lit | 3 | ENGL 104 Critical Reading (3) | ok |
| **AP Calc AB** | 3 | **MATH 125 Precalculus (4)**; 4–5 → MATH 225 Calculus I | **FLAG: precalculus at 3** (still a math course) |
| AP Calc BC | 3 | MATH 225 Calculus I (4) | ok |
| AP Statistics | 3 | STAT 152 (3) | ok |
| AP Biology / Chemistry / Physics 1 | 3 | BIOL 101/100 (4) / CHEM 104/110 (4) / PHYS 201 (4) | ok |
| AP Psychology | 3 | PSYC 105 (3); PSYC 1TR elective for Psych majors | ok |
| AP US Gov | 3 | POLS 101 (3) | ok |
| AP US History | 3 | HIST 201 (3) | ok |
| AP European History | 3 | HIST 152 (3) | ok |
| AP Macro / Micro | 3 | ECON 201 / ECON 202 (3) | ok |
| AP Art History | 3 | ART 225 (3) | ok |
| AP Spanish Lang | 3 | SPAN 101/102/103 (9) | ok |
| All CLEP rows | ACE score (50) | **No published per-exam chart found.** SRU says to search "CLEP – College Level Examination Program" in its transfer-equivalency tool (https://www.sru.edu/admissions/transfer-admissions/transfer-credit-evaluation, search snippet). The tool was **not run**. | UNVERIFIABLE |

### 1.7 Commonwealth University: PARTLY
- AP: https://www.commonwealthu.edu/offices-directory/registrar/ap-exams. Quote: "Evaluation of the AP score and the appropriate credit level and course equivalency, if any, will be determined by departmental policy."
- CLEP: https://www.commonwealthu.edu/offices-directory/registrar/clep

| Exam | Min | Course (credits) | vs app |
|---|---|---|---|
| AP Eng Lang / Lit | 3 | WRIT 103 Foundations in Composition / ENGL 151 Intro to Literature (3) | ok |
| AP Calc AB | 3 | MATH 160 Calculus 1 (4) | ok |
| AP Calc BC | 3 | MATH 160 + MATH 170 (8) | ok |
| AP Statistics | 3 | STAT 141 (3) | ok |
| AP Biology | 3 | BIOL 101 Human Biology (3) | ok |
| AP Chemistry | 3 | CHEM 100 (3) | ok |
| AP Physics 1 | 3 | PHYS 208 (4) | ok |
| AP Psychology | 3 | PSYC 100 (3) | ok |
| AP US Gov | 3 | POLI 110 (3) | ok |
| **AP US History** | 3 | **HIST 199 History Transfer (3)**; 4 → HIST 121 | **FLAG: generic transfer credit at 3** |
| **AP European History** | 3 | **HIST 199 History Transfer (3)** | **FLAG** |
| AP Macro / Micro | 3 | ECON 121 / ECON 122 (3) | ok |
| AP Art History | 3 | ARTH 120 The World of Arts (3) | ok |
| AP Spanish Lang | 3 | SPAN 101 (3) | ok |
| CLEP College Comp | 50 | **WRIT 100 Reading and Writing (3)**. Modular → WRIT 103 Foundations in Composition | check whether WRIT 100 meets the composition requirement (not verified) |
| CLEP College Algebra | 50 | MATH 118 College Algebra (3) | ok |
| CLEP Intro Psych / Sociology | 50 | PSYC 100 / SOCI 101 (3) | ok |
| CLEP American Gov | 50 | POLI 110 (3) | ok |
| CLEP US History I | 50 | HIST 121 (3) | ok |
| CLEP Macroeconomics | 50 | ECON 121 (3) | ok |
| CLEP Biology | 50 | BIOL 101 Human Biology (3) | ok |
| **CLEP American Literature** | 50 | **ENGL 299 English Transfer (3)** | **FLAG: generic transfer credit** |
| **CLEP Humanities** | 50 | **HUMN 199 Humanities Transfer (3)** | **FLAG: generic transfer credit** |

### 1.8 PennWest: PARTLY (CLEP list 2023-24 only; no AP chart found)
- Prior-learning page: https://www.pennwest.edu/admissions/undergraduate/prior-learning-credits.php. Quote: "On MOST College Entrance Examination Board (CEEB) advanced placement tests, if you have received a score of 3, 4, or 5, you can expect credit."
- CLEP list: https://www.pennwest.edu/_resources/docs/admissions/clep-titles-and-equivalents-list.pdf. Quote: "The current scores and course equivalents are for the 2023-2024 academic year."
- **No per-exam AP chart was found.** Searches of pennwest.edu turned up only the policy sentence above. AP rows: UNVERIFIABLE.

| CLEP exam | Min | PennWest course (credits) | vs app |
|---|---|---|---|
| **College Composition** | – | **NOT LISTED** (Modular also absent) | **FLAG** |
| College Algebra | 50 | MATH 1220 (3) | ok |
| Intro Psych / Sociology | 50 | PSYC 1000 / SOC 1000 (3) | ok |
| American Gov | 50 | POLS 1100 (3) | ok |
| US History I | 50 | HIST 1010 (3) | ok |
| Macroeconomics | 50 | ECON 2200 (3) | ok |
| Biology | 50 | BIOL 1101 (3) | ok |
| American Literature | 50 | ENGL 2310 (3) | ok |
| **Humanities** | 50 | **"Humanities Elective" (3)** | **FLAG: elective** |
| (Natural Sciences, not in the app) | 50 | "Social Sciences Elective" | looks like a PennWest data error; noted only |

### 1.9 Cheyney: UNVERIFIABLE (per exam)
- https://cheyney.edu/admissions/special-admissions/advanced-placement-ib/. Quote: "Applicants earning advanced placement grades of 3 or higher are given advanced standing and college credit as appropriate." The linked chart is a 2018 .docx (`.../wp-content/uploads/2018/11/CU_ADVANCE_PLACEMENT__AP_-1.docx`) that the fetcher returned as undecoded binary, so it was **not read**.
- 2025-26 Undergraduate Catalog (https://cheyney1837.wpenginepowered.com/wp-content/uploads/2026/01/2526_Undergraduate-Academic-Catalog_02292025_Amended-1-9-2026.pdf), p. 56. Quote: "Students who take and pass college-level coursework through Prior Learning Exams such as Advanced Placement, International Baccalaureate, DANTES, CLEP and military experience may be eligible to receive credit for specific courses at Cheyney University. **No more than 30 credits may be earned by any combination of these methods.**" There is no CLEP chart.
- Side note, outside this task: the same page says "Only courses with grades of 'C' or higher are considered for evaluation, unless the student has earned an Associate's degree". That appears to conflict with PASSHE Procedure 2022-54 ("may not be rejected for earned grade requirements"), which the app cites.

### 1.10 West Chester (WCU): see the WCU section at the end
- https://www.wcupa.edu/registrar/testcredit.aspx. Quotes: "West Chester University accepts scores in the 50th percentile and above." / "West Chester University only accepts official scores that are sent directly from College Board. We cannot evaluate scores received in any other manner, including on another school's transcript." Per-exam data is only in the JavaScript "External Course Equivalencies Tool".

### Caps on exam credit found (not modelled in the app)
- SRU: maximum 45 exam credits, and none in the final 30 (catalog).
- Shippensburg: "up to 30 college credits through CLEP".
- Cheyney: no more than 30 credits from AP/IB/DANTES/CLEP/military combined.

---

## Item 2: statewide Uniform Standards for Credit for Prior Learning

**App's claim:** the statewide minimum is 3 on AP and 50 on CLEP for every exam row except CLEP Humanities, which has no standard; the area follows the recommended course.
**Verdict: CONFIRMED.**

Index page: https://collegetransfer.pa.gov/Administrators/Credit-for-Prior-Learning. Quotes: "All participating members of the PA College Transfer System must award credit, and apply it toward graduation, for the approved minimum scores." / "The recommended course and credit awards in these documents are not expected to be uniform across all institutions. … the actual credit awarded and the applicability of the credit (i.e., major or elective) will vary between institutions".

Subject documents (each opened; English, Math, Social & Behavioral Sciences and Languages fetched in this session; History, Natural Sciences and Humanities & Fine Arts fetched earlier the same day from the same URLs):
- E = English & Public Speaking, June 21 2021: https://collegetransfer.pa.gov/Portals/6/PAFiles/PDF's/English%20and%20Public%20Speaking%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL%20as%20of%20June%202021.pdf
- M = Mathematics, Mar 21 2022: https://collegetransfer.pa.gov/Portals/6/PAFiles/PDF's/Mathematics%20-%20Credit%20for%20Prior%20Learning%20Standards_Spring%202022.pdf
- S = Social & Behavioral Sciences, Mar 2022: https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Social%20and%20Behavioral%20Sciences%20-%20Credit%20for%20Prior%20Learning%20Standards_FINALspring2022.pdf
- H = History, Oct 15 2020: https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/History%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf
- N = Natural Sciences, Oct 15 2020: https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Natural%20Sciences%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf
- F = Humanities & Fine Arts, 9/30/2021: https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Humanities%20and%20Fine%20Arts%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf
- L = Languages, Oct 14 2020: https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Languages%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf

| Exam (app id) | Doc | Statewide min | Recommended equivalency (verbatim) | App area |
|---|---|---|---|---|
| ap-english-lang | E | 3 | "A score of three should award three credits of a first-year composition course" | pa-comp ✓ |
| ap-english-lit | E | 3 | "a three-credit 'introduction to literature'-type course (not a specific literature survey course)" | pa-hum ✓ |
| ap-calculus-ab | M | 3 | "For individuals with a score of 3, award credit for an applied calculus course. … For schools without an applied calculus course **mathematics elective credit** is an alternative" | pa-math (a 3 may be an elective) |
| ap-calculus-bc | M | 3 | "For individuals with a score of 3, award credit for Calculus I." | pa-math ✓ |
| ap-statistics | M | 3 | "Award credit for an appropriate introductory 3-credit statistics course." | pa-math ✓ |
| ap-biology | N | 3 | "award credit for an equivalent and appropriate 3 -credit biology course" | pa-sci ✓ |
| ap-chemistry | N | 3 | "award credit for an equivalent and appropriate 3 -credit general education chemistry course" | pa-sci ✓ |
| ap-physics-1 | N | 3 | "award credit for an equivalent and appropriate **4-credit** algebra-based physics-1 course" | pa-sci ✓ (app gives 3 credits) |
| ap-psychology | S | 3 | "a college level general or introductory psychology course" | pa-soc ✓ |
| ap-us-government | S | 3 | "a college level US Government and Politics course" | pa-soc ✓ |
| ap-us-history | H | 3 | "colleges ought to be afforded flexibility to decide equivalences for scores of 3, 4, and 5 … **3 represents 3 credits for a general elective at the survey level.** … 3 represents 3 credits for a survey-level course in a General Education/Liberal Studies program that has program outcomes limited to skills-based learning goals." | pa-soc (a 3 may be an elective) |
| ap-european-history | H | 3 | same wording as US History | pa-soc (same caveat) |
| ap-macroeconomics | S | 3 | "a college level principles of macroeconomics course" | pa-soc ✓ |
| ap-microeconomics | S | 3 | "college level principles of microeconomics course" | pa-soc ✓ |
| ap-art-history | F | 3 | "an AP score of 3 is the equivalent to 3 credits for a one-semester survey course (e.g., Intro to Art History)". Note that the minimum-score line is garbled in the PDF: "The score should be a minimum of 3 credits." The table says 3. | pa-hum ✓ |
| ap-spanish | L | 3 | "a score of '3' on the AP exams would be equivalent to the basic language sequence at the college level" | pa-hum ✓ |
| clep-college-composition | E | 50 | "A score of 50 should award a three-credit first-semester composition course" | pa-comp ✓ |
| clep-college-algebra | M | 50 | "Award credit for a 3-credit college algebra course." | pa-math ✓ |
| clep-intro-psychology | S | 50 | "a college level general or introductory psychology course" | pa-soc ✓ |
| clep-intro-sociology | S | 50 | "a college level introductory sociology course" | pa-soc ✓ |
| clep-american-government | S | 50 | "a college level American government course" | pa-soc ✓ |
| clep-history-us-1 | H | 50 | "50 represents 3 credits for a general elective at the survey level" / "50 represents 3 credits for a survey-level course in a General Education/Liberal Studies program that has program outcomes limited to skills-based learning goals" / "61 represent 3 credits for a survey-level course in a … program that has program outcomes that specify conceptual frameworks" | pa-soc (a 50 may be an elective) |
| clep-macroeconomics | S | 50 | "a college level principles macroeconomics course" | pa-soc ✓ |
| clep-biology | N | 50 | "award credit for an appropriate 3 -credit, general education non-lab biology course" | pa-sci ✓ |
| clep-american-literature | E | 50 (table). The body text misprints "a score of 3 or higher"; its rationale says "The score of 50 should be the minimum score" | "A score of 50 or higher should award (3 or 6) credit American literature course." | pa-hum ✓ |
| **clep-humanities** | – | **NO STATEWIDE STANDARD** | The index page and all eight subject documents list no CLEP Humanities. The Humanities & Fine Arts document covers only AP, IB and DSST (Art of the Western World). | the app's flag is correct |

PDE inconsistency to note: the Mathematics PDF cites "24 P.S. § 20-2004-C(d)", while the others cite § 20-2002-C(d). The statute places the duty in 2002-C(d) (see item 3), so the Math PDF is the one in error.

---

## Item 3: statute (Article XX-C, Public School Code of 1949)

**App's claim** (institutions.ts PASSHE_EXAM, confidence `published`): "24 P.S. § 20-2002-C(d), added in 2017: community colleges and PASSHE universities must award credit, and apply it toward graduation, at the statewide minimum scores". The comment there reads "the statute itself was not opened".
**Verdict: CONFIRMED.** The statute text was read and can be cited.

Sources:
1. **Official:** https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?SESSYR=1949&SESSIND=0&ACTNUM=14&SMTHLWIND=&CHPT=20C (1949 Act 14, ch. 20C). The page is JavaScript-only. A TinyFish browser agent (run 908faee1…) read it back on 2026-10-01 **(automation)**. Plain fetch returned only navigation.
2. **Reproduction:** PDE's "Transfer and Articulation Oversight Committee Governance, Policies and Procedures", Introduction, Appendix A ("Revised: 3/26/18"): https://patrac.org/Portals/6/PAFiles/TAOCPolicyManualIntroduction.pdf. The full Article XX-C text there matches the automation read word for word on the quoted sentences.

Operative text (verbatim):
- § 2001-C: **"Public institution of higher education." A community college or an institution which is part of the State System of Higher Education pursuant to Article XX-A.** This confirms that the duty binds community colleges and PASSHE, and not Penn State, Pitt or Temple.
- § 2002-C(d): **"(d) Credit for prior learning.--Each public institution of higher education shall do all of the following: (1) Adopt and make public uniform standards for determining academic credit for prior learning as outlined in paragraph (4) within 18 months of the effective date of this subsection. (2) Agree to award academic credit for prior learning, which is determined to meet the standards established under section 2004-C(c)(6) and apply the credit toward graduation, unless prohibited by external accreditation or licensure."**
- History note (palegis, automation): **"(d) added Nov. 6, 2017, P.L.1142, No.55"** (Act 55 of 2017).
- § 2004-C(c)(6): **"Within one year of the effective date of this paragraph, develop and implement uniform standards for awarding academic credit for prior learning, in consultation with faculty and personnel for public institutions of higher education and institutions that elect to participate under section 2006-C."**
- § 2001-C defines credit for prior learning to include "an Advanced Placement Program exam, International Baccalaureate Diploma Program exam, a College-Level Examination Program exam and Dantes Subject Standardized Tests" (TAOC reproduction).
- For contrast, § 2006.1-C(c)(2) on the state-related universities says: "The manner in which accepted courses apply toward completion of a degree and whether they are counted for general education, major or free elective credit shall be subject to the requirements established by the accepting State-related institution" (TAOC reproduction).

What the statute does **not** say: it requires credit "toward graduation". It does not require that the credit fill general education. The app's existing wording ("Which course the credit counts as, and whether it fills general education, a major or an elective, is each university's call") is consistent with the statute.

Suggested provenance: source_url = the palegis.us URL above, with a note citing "24 P.S. § 20-2002-C(d), added by Act 55 of 2017 (P.L.1142, Nov. 6, 2017)". Consider `statute` confidence **only after a person reads the palegis page by hand**, because the official read was done by automation. Act 55's own PDF/HTM on palegis.us returned empty to plain fetch.

The app's core.ts says "Act 114 of 2006". The TAOC manual says "a 2006 law" and calls it "House Bill 185". That is consistent, but the Act number was not checked against palegis.

---

## Item 4: PA_CC_COST ($220/credit middle)

**App's claim:** a sponsoring-district resident pays HACC $237 and CCP $208 per credit with fees, and $220 is the middle.
**Verdict: CONFIRMED.** $220 is defensible: median of 8 colleges $219, mean ≈ $215.69.

All rates are for 2026-27, per credit, part-time (below the full-time block), sponsoring or in-district resident, tuition plus mandatory per-credit fees. Course, lab and online fees are excluded.

| College | Per credit | Breakdown (verbatim figures) | URL |
|---|---|---|---|
| Community College of Allegheny County (Allegheny County) | **$167.50** | Tuition "$130"; College Fee "$6.00/credit"; student support fee "$8.25/credit"; technology fee "$23.25/credit". Page shows "2026–2027 Cost of Attendance Breakdown … $130/credit" | https://www.ccac.edu/cost-and-aid/tuition-and-cost.php |
| Northampton CC (Northampton County sponsoring districts) | **$207** | 2026-2027 part-time: Tuition "$140", Comprehensive Fee "$30", Technology Fee "$37", Capital Outlay "$0". Full-time flat rate "$3,105" for 12–18 credits | https://www.northampton.edu/cost-and-financial-aid/tuition-and-fees/ |
| Lehigh Carbon CC (sponsoring district) | **$207** | Fall 2026: "Total Tuition and Fees per Credit Hour $207.00 per credit" ($142 + $30 comprehensive + $35 technology). Plus a "$33-per-credit Textbooks+ fee" for Fall/Winter 2026 only, which is excluded | https://www.lccc.edu/paying-for-college/tuition-and-fees/ |
| Community College of Philadelphia (Philadelphia resident) | **$208** | "2026 Fall Term … 1 credit $174 $30 $4 $208" | https://www.ccp.edu/admission-aid/paying-college/tuition-fees |
| Montgomery County CC (county resident) | **$230** | "Fall 2026, Spring 2027, and Summer 2027 … Total* $230.00 per credit" ($171 + $25 + $3 + $31) | https://www.mc3.edu/paying-for-college/tuition-and-other-costs |
| Bucks County CC (county resident) | **$232** | $170 tuition + $4 activity + $0 capital + $21 college services + $37 technology. Heading reads "Academic Year 2026-2027 / Intersession 2026, Spring 2027, Summer 2027". Fall 2026 is not named in the heading. Online courses add a $5 virtual fee | https://www.bucks.edu/payment/tuition/ |
| HACC (sponsored in-state resident) | **$237.00** | "Academic Year 2026-27 … 1 … $189.75 $34.50 $0 $12.75 $237.00" | https://www.hacc.edu/Admissions/TuitionandDueDates/index.cfm |
| Delaware County CC (sponsoring district) | **$232–$242** (midpoint $237) | "Fall 2026 to Summer II 2027 … Total $232-$242" (the instructional support fee varies, $70–$80) | https://www.dccc.edu/admissions-and-financial-aid/admissions/tuition-fees/ |

Sorted: 167.50, 207, 207, 208, 230, 232, 237, 237 → median (208+230)/2 = **$219**.
Non-sponsored PA residents pay roughly double: HACC $342.25, MCCC $421, DCCC $388–398, CCP $348 + $10 capital fee, CCAC $260 + $6.50. The app's "$342.25" for HACC is confirmed.
Suggested note text: "…for a sponsoring-district resident in 2026-27, tuition plus mandatory fees runs from $167.50 a credit (CCAC) to about $237–242 (HACC, Delaware County); the median of eight colleges is $219."

---

## Item 5: PASSHE tuition and residency

**$347/credit: CONFIRMED.**
- https://www.commonwealthu.edu/cost-and-aid/tuition-cost: "Tuition Rates (2026-27) … Undergraduate In-State Tuition $4,169+fees*/semester**" / "Per credit tuition rate for PA Residents is $347" (repeated for each campus) / "** Tuition rates are subject to approval by the Pennsylvania State System of Higher Education Board of Governors and may change without notice."
- https://www.passhe.edu/students/cost.html, "Detailed Rates (2026-2027)": "In-State Tuition | $8,338 | Base full-time undergraduate rate for most students." / "In-State Tech Fee | $518 – $970" / "Mandatory Fees | $2,058 – $4,118". These match the app's note. **Caveat:** "While baseline undergraduate tuition is consistent across **most** of the system universities". The app's "set by the Board for every university" is slightly stronger than PASSHE's own wording.

**Residency P/S 2016-24-A (30 of the last 60): CONFIRMED and current.**
- https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/PS%202016-24-A%20Graduation%20Residency%20Requirements.pdf ("Approved by Chancellor November 6, 2025 … Revised: October 16, 2025"). Quotes: "All first baccalaureate degree students will earn at least 30 of their last 60 credits from the State System university granting their degree; the university shall not require a student to take more than 30 credits." / "All first baccalaureate and associate students will earn at least 50% of credits required for the major (including required cognate courses) from a State System university." / "The State System University shall not require more than 50% of the major credits". Also: "For active-duty service members … The residency requirement of 30 of the last 60 credits will be waived."

---

## West Chester (WCU) per-exam results: PARTLY (automation)

Source: WCU "External Course Equivalencies" tool embedded at https://www.wcupa.edu/registrar/transferCredit.aspx, searched for Institution = "AP". It was read by a TinyFish browser agent (run 5bf1e136…, finished 2026-10-01 17:27Z, 22 steps). **Automation only. A person must re-check this before relying on it.** The tool lists several WCU equivalents per exam, all at minimum score 3 and 3.00 credits. It does not say which applies when (probably major or score). No gen-ed attributes are shown.

| AP exam | Min | WCU equivalent(s) as returned | vs app |
|---|---|---|---|
| English Language & Comp | 3 | WRT 120 Effective Writing I (3) | ok |
| English Literature & Comp | 3 | LIT 165 Topics in Literature (3) | ok |
| Calculus AB | 3 | MAT 161 Calculus I / MAT 143 Brief Calculus / MAT 145 Calculus for the Life Sciences (3) | ok |
| Calculus BC | 3 | MAT 161 / MAT 162 / MAT 108 (3 each) | ok |
| **Statistics** | – | **"NO AP STATISTICS EQUIVALENCY FOUND"** | **FLAG (automation; could be a miss)** |
| Biology | 3 | BIO 110 General Biology I (3) | ok |
| Chemistry | 3 | CHE 103 General Chemistry I / CHE 100 Concepts of Chemistry (3) | ok |
| **Physics 1** | – | **not returned** (only Physics C: Mechanics → PHY 170/PHY 100 and Physics C: E&M → PHY 180/PHY 100) | **FLAG (automation; could be a miss)** |
| Psychology | 3 | PSY 100 Introduction to Psychology / PSY 199 Psychology Transfer Credit (3) | ok (sometimes generic) |
| US Gov & Politics | 3 | PSC 100 (3) | ok |
| **US History** | – | **"NO AP UNITED STATES HISTORY EQUIVALENCY FOUND"** | **FLAG (automation; could be a miss)** |
| European History | 3 | HIS 102 History of Civilization … Modern World (3) | ok |
| Macro / Micro | 3 | ECO 111 / ECO 112 (3) | ok |
| Art History | 3 | ARH 103 ("For students starting WCU Spring 2026 and later") / ARH 104 (3) | ok |
| Spanish Lang & Culture | 3 | SPA 201 / SPA 202 / SPA 301 / SPA 102 (3 each) | ok |

Three common exams came back with no AP equivalency: Statistics, US History and Physics 1. That may be an automation miss, or the list may genuinely lack them. Because the statute requires credit at 3 for all three, treat it as **unverified**, not as a refusal. A person should search the tool by hand.

**WCU CLEP (per exam): UNVERIFIABLE.** A second browser run for Institution = "CLEP" (run 78c310bb…) was still queued when this report was written, and the TinyFish wallet reported a low balance. Only the policy is confirmed: "West Chester University accepts scores in the 50th percentile and above" (https://www.wcupa.edu/registrar/testcredit.aspx). The page also says WCU will not evaluate CLEP scores "received in any other manner, including on another school's transcript". That rule matters for a student who took CLEP at a community college: the scores must come straight from College Board.
