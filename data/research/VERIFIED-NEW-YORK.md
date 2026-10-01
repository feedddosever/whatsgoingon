# New York verification — needs_check items in data/ny/

Read date for every source below: **2026-10-01** (all fetched via TinyFish `fetch_content`, two acalog catalog pages via `run_web_automation`). Quotes are verbatim from the fetched text. "Snippet" means only a search-result snippet was seen, not the page body — never treat that as a primary read.

Verdict key: **CONFIRMED** (primary source matches app) · **CORRECTED** (primary source gives a different value) · **PARTLY** (part matches / source conflicts / only snippet) · **UNVERIFIABLE** (no primary source found or readable).

How the app encodes "unknown" today (data/ny/institutions.ts `make()`): residency defaults to **30** with `UNCONFIRMED_RESIDENCY`; transfer cap defaults to **`null` (= no cap)** with `UNCONFIRMED_CAP`. So every campus below that publishes a cap is a correction from "no cap".

---

## ITEM 1 — Residency and transfer caps

### SUMMARY TABLE

| Campus | App residency | Verified residency | Verdict | App cap | Verified cap | Verdict |
|---|---|---|---|---|---|---|
| Binghamton | 30 | **44** (Harpur); 40 (School of Mgmt, snippet) | CORRECTED | null | no overall cap stated; 32 exam-credit max | PARTLY (no cap stated on Harpur page; catalog unreadable) |
| University at Albany | 30 | 30 (of last 60) | CONFIRMED | null | **90** total, no 2-yr/4-yr distinction | CORRECTED |
| SUNY Geneseo | 30 | 30 | CONFIRMED | null | **64** from 2-yr (Fall 2025+ entrants), 90 total | CORRECTED (admissions page still says 60) |
| SUNY New Paltz | 30 | 30 | CONFIRMED | null | **70** from 2-yr, 90 from 4-yr | CORRECTED |
| SUNY Oswego | 30 | 30 (catalog snippet only) | PARTLY | null | **60** from 2-yr (two pages) vs 90 (admissions FAQ) | CORRECTED → 60, conflict flagged |
| SUNY Cortland | 30 | 30 (+½ major, ½ minor) | CONFIRMED | null | **64** from 2-yr (incl. exam credit), 90 total | CORRECTED |
| SUNY Oneonta | 30 | **45** (catalog snippet only; page unreadable) | PARTLY (likely CORRECTED) | null | **75** total from any accredited institution | CORRECTED |
| SUNY Brockport | 30 | 30 (+12 of last 30) | CONFIRMED | null | **64** from 2-yr ("Ever."), 90 total; admissions page says 75 | CORRECTED → 64, conflict flagged |
| Buffalo State | 30 | **32** incl. last 16 | CORRECTED | null | **66** from associate programs, 90 total | CORRECTED |
| Farmingdale | 30 | 30 of last 60 (15 in major) | CONFIRMED | null | not found | UNVERIFIABLE |
| Purchase College | 30 | not found | UNVERIFIABLE | null | **75 lower-level**, 90 total (BA/BS); BFA/MusB far lower | CORRECTED |
| SUNY ESF | 30 | 30 | CONFIRMED | null | **90** total | CORRECTED |
| SUNY Poly | 30 | 30 (12 in major), 2026-27 catalog | CONFIRMED | null | 76 lower-division + 18 upper (snippet only) | PARTLY |
| SUNY Fredonia | 30 | **45** | CORRECTED | null | **66** lower-division + 9 upper-division (Fall 2023+) | CORRECTED |
| SUNY Empire State | 30 | 30 | CONFIRMED | null | **90–93** advanced standing (bachelor's) | CORRECTED |
| University at Buffalo (cap only) | — | (30 already sourced) | — | null | no maximum stated | CONFIRMED (no cap stated) — catalog read is the archived 2024-25 edition |
| SUNY Plattsburgh (residency only) | 30 | **36** (30 of last 36 also) | CORRECTED | 67 (sourced) | 67 / 84 re-confirmed in 2025-26 catalog | CONFIRMED |
| Brooklyn College | 30 | 30 | CONFIRMED | null | not found | UNVERIFIABLE |
| Queens College | 30 | 30 (catalog); a 2025 advising page says 45 if ≤75 transferred | CONFIRMED w/ conflict | null | **no cap** | CONFIRMED |
| City College (CCNY) | 30 | 30 (+60% of major) | CONFIRMED | null | 90 (snippet of page updated 07/06/2026; FAQ body collapsed) | PARTLY → 90 |
| John Jay | 30 | 30 (+50% of major) | CONFIRMED | null | no overall cap found; 45 max from external non-college sources incl. standardized tests | UNVERIFIABLE (overall) |
| Lehman | 30 | 30 (+½ major/minor) | CONFIRMED | null | **70** from community colleges | CORRECTED |
| College of Staten Island | 30 | 30 (+½ of major) | CONFIRMED | null | **90** | CORRECTED |
| City Tech | 30 | 30 (15 in major) | CONFIRMED | null | **no limit** | CONFIRMED |
| York College | 30 | **40** | CORRECTED | null | **68** from a non-CUNY two-year college; 80 from non-CUNY senior; none stated for CUNY | CORRECTED (partly) |
| Medgar Evers | 30 | 30 (25 in major) | CONFIRMED | null | **90** (bachelor's) | CORRECTED |
| CUNY SPS | 30 | **15** | CORRECTED | null | **105** | CORRECTED |

### Per-campus sources and quotes (SUNY)

**Binghamton** — residency CORRECTED 30 → 44 (Harpur College, which is where most arts & sciences majors sit).
- https://www.binghamton.edu/harpur/advising/transfer-credit/policies.html — "You must complete 44 credits in residence (through Harpur College) to receive a Harpur College degree from Binghamton University." and "Students are allowed to transfer up to 32 credits from exams (AP, IB, CLEP, A-Level, etc.)". No overall transfer maximum on this page.
- School of Management (snippet only, not opened): https://www.binghamton.edu/som/student-resources/undergraduate-academic-advising/transfer/ — "Students must complete at least 40 credits in residence at Binghamton".
- catalog.binghamton.edu academic-policies page returned empty (acalog); overall cap UNVERIFIABLE.

**University at Albany** — residency CONFIRMED 30; cap CORRECTED null → 90.
- https://www.albany.edu/undergraduate-bulletin/requirements-for-bachelors-degree.php — "The University requires degree candidates to earn a minimum of 30 of their last 60 graduation credits in courses at the Albany campus." / "Since Albany requires at least 30 credits to be completed at the University, the most transfer credit that can be applied toward graduation is 90 credits. (Since some SUNY and other technical and community colleges now award baccalaureate degrees, the University no longer distinguishes between "two-year" and baccalaureate-granting institutions in determining the maximum credits that may be transferred.)" Exam credit "shall not be applied to University, major or minor residence requirements".
- https://www.albany.edu/registrar/students/transfer-credits — "A maximum of 90 transfer credits can be applied toward your bachelor's degree requirements."

**SUNY Geneseo** — residency CONFIRMED 30; cap CORRECTED null → 64 from two-year / 90 total.
- https://www.geneseo.edu/registrar/graduation/ — for "Students who entered Geneseo in Fall 2025 or later": "A maximum of 64 credits (plus up to 15 additional upper-level major courses) can be transferred from two-year institutions, and a maximum of 90 credits are transferable from a four-year institution." and "Complete a minimum of 30 credits in residence at Geneseo". (Earlier cohorts: 60.)
- https://www.geneseo.edu/registrar/pre-college-credit/ — "Students may transfer a maximum of 64 credits from a two-year, degree-granting institution (including no more than a total of 30 AP, IB, and CLEP credits)."
- CONFLICT: https://www.geneseo.edu/transfer_admissions/transfer-credit-information/ (pub 2026-07-14) still says "Geneseo will accept up to 60 credits from two-year colleges, up to 90 credits from four-year schools" and "you must take at least 30 credits at Geneseo". Registrar (degree audit owner) wins; 64.

**SUNY New Paltz** — residency CONFIRMED 30; cap CORRECTED → 70 from two-year / 90.
- https://catalog.newpaltz.edu/undergraduate/academic-policies/transfer-credits/ — "SUNY New Paltz will accept a maximum of 70 credits from an accredited two-year college and a maximum of 90 credits from an accredited four-year college or university."
- https://catalog.newpaltz.edu/undergraduate/degree-requirements/ — "At least 30 credits in residence"; transfer credits and "Credit earned through examination" do not count toward residency.

**SUNY Oswego** — residency PARTLY (30, snippet only); cap CORRECTED → 60 from two-year (pages conflict).
- https://ww1.oswego.edu/extended-learning/prior-learning-assessmentcredits-prior-learning — "Students can apply a maximum of 30 testing credits within the maximum of 60 credits allowed from a two-year school (i.e. Max of 30 AP credits & 30 credits from OCC)."
- https://ww1.oswego.edu/business/students — "SUNY Oswego accepts a maximum of 60 credits from a two-year college; an additional 30 may be transferred in from a four-year college."
- CONFLICT: https://ww1.oswego.edu/admissions/undergraduate-admissions/how-apply/transfer-suny-oswego — "The maximum number of credits that can be applied from a two-year or four-year institution is 90."
- Residency: catalog snippet only (catalog.oswego.edu catoid=65 navoid=9008, acalog page returned empty): "Complete a minimum of 30 credit hours at SUNY Oswego."
- Recommendation: use 60 (the lower, two-page figure) and keep needs_check with the conflict noted. A lower cap prices more credits at the four-year rate, i.e. errs against the student's favour, not in it.

**SUNY Cortland** — residency CONFIRMED 30; cap CORRECTED → 64 / 90.
- https://www2.cortland.edu/offices/advisement-and-transition/transfer-credit-services/new-students/transfer-credit-policies.dot — "64 credits maximum from two-year colleges. This maximum credit limit includes not only coursework but also credit by exam." / "The maximum number of transfer credit hours accepted is 90." / Residency: "all students must complete in residency: Half of the required coursework in the major; Half of the required coursework in any declared minor; 30 credit hours minimum". Also: "30 credits maximum from credit-granting tests such as AP, IB, CLEP".

**SUNY Oneonta** — residency PARTLY (45 per catalog snippet; page itself unreadable); cap CORRECTED → 75.
- https://suny.oneonta.edu/admissions/transfer — "A maximum of 75 credits can be transferred from a regionally accredited institution."
- Residency snippet only: https://catalog.oneonta.edu/content.php?catoid=29&navoid=1836 — "Oneonta residency requirements: 45 s.h. must be earned in residence. 30 s.h. of the last 60 s.h. must be earned in residence." (acalog page returned empty to fetch; not opened.) Do not ship 45 as `published` until someone opens that page; but 30 is very likely wrong.

**SUNY Brockport** — residency CONFIRMED 30; cap CORRECTED → 64 from two-year / 90.
- https://www.brockport.edu/academics/catalogs/degrees/ — "Students may transfer a maximum of 64 credit hours from a two-year college. A minimum of 56 credits must be earned from a four year college." / "A minimum of 30 credit hours must be completed at the College at Brockport."
- https://www.brockport.edu/live/profiles/5373-getting-the-credit-you-deserve-policy (rev. 2019-09-24) — "The maximum number of credits that can be applied to your Brockport baccalaureate degree from other sources is 90, no more than 64 of which can come from a two-year college. Ever."
- https://www.brockport.edu/live/profiles/5376-residency-requirement-policy (rev. 2024-04-18) — "a student must earn a minimum of 30 credits at SUNY Brockport, where only 90 credits overall can be transfer credits." and "12 of the last 30 credits must also be earned at SUNY Brockport".
- CONFLICT: https://www.brockport.edu/admissions/transfer/planning-guide/policies/ — "You can transfer a maximum of 75 credits from any accredited two-year college" (same page later says "up to the maximum of 64 credits"). Catalog + policy say 64.

**Buffalo State** — residency CORRECTED 30 → 32; cap CORRECTED → 66 from associate / 90.
- https://undergraduate.catalog.buffalostate.edu/gened — "At least 32 credits must be taken at Buffalo State, including the last 16 credits".
- https://undergraduate.catalog.buffalostate.edu/about/policies — "A maximum of 90 credit hours may be transferred from other regionally accredited baccalaureate degree-granting institutions, and with no more than 66 credit hours from associate degree programs."
- https://suny.buffalostate.edu/admissions/transfer — "A maximum of 90 total credits can be transferred."

**Farmingdale** — residency CONFIRMED 30 (of last 60); cap UNVERIFIABLE.
- https://www.farmingdale.edu/policies/?pid=214166 — "Candidates for a baccalaureate degree must complete a minimum of 30 of the last 60 credits at the college, with 15 of those credits in the major. At least 9 of the 15 major credits must be taken at the 300/400 level." / "credits earned through advanced standing {e.g., credit by evaluation, advanced placement, etc.) do not fulfill the minimum residency requirements." No numeric transfer maximum on this policy page.

**Purchase College** — residency UNVERIFIABLE; cap CORRECTED → 75 lower-level (90 total) for BA/BS.
- https://www.purchase.edu/live/blurbs/2159-transfer-credit — "A maximum of 90 credits—including a maximum of 75 lower-level (freshman-sophomore) credits—may be accepted in transfer to an undergraduate BA or BS program at SUNY Purchase. The maximum of 90 can only be achieved if the student has at least 15 junior and/or senior level credits." BFA/MusB: Dance/Acting/Film "may transfer a maximum of 36 general education ("core") credits"; Music "a maximum of 66 credits"; visual-arts BFAs "A maximum of 75 credits". "A maximum of 30 AP credits will be accepted." Community-college credit is lower-level, so for a CC transfer the effective cap is 75 (BA/BS).

**SUNY ESF** — residency CONFIRMED 30; cap CORRECTED → 90.
- https://www.esf.edu/catalog/current/policies.php — "Students cannot apply more than 90 transfer credits towards their bachelor's degree requirements and must complete at least 30 residential credits at SUNY ESF". "CPL credit does not count towards residency requirements."

**SUNY Poly** — residency CONFIRMED 30; cap PARTLY.
- https://webapp.sunypoly.edu/undergrad-catalog-2026-2027/academic-requirements-policies/residency-requirements/ — "SUNY Poly maintains a minimum residency requirement of 30 semester hours, of which a minimum of 12 semester hours must be in the major."
- Cap, snippet only: https://connect.sunypoly.edu/portal/MVCC_office_portal — "You can transfer 76 lower division credit hours (100/200-level courses) and up to an additional 18 upper division credit hours". Not opened; not in catalog page read.

**SUNY Fredonia** — residency CORRECTED 30 → 45; cap CORRECTED → 66 lower-division + 9 upper.
- https://fredonia.smartcatalogiq.com/2025-2026/catalog/academic-policies/transfer-credit — "Students entering Fredonia in FALL 2023 or later: may apply a maximum of 66 transfer credits at the lower-division (Fredonia equivalent courses at the 100/200 level) towards their baccalaureate degree; may apply an additional 9 credits at the upper-division" / "including a residency requirement of 45 semester hours of credit at Fredonia." (No 2026-27 edition exists at the smartcatalog URL — 404.) Same 66/9 on https://www.fredonia.edu/admissions-aid/transfer.

**SUNY Empire State** — residency CONFIRMED 30; cap CORRECTED → 90–93.
- https://catalog.sunyempire.edu/undergraduate/academic-policies-procedures/degree-credit-residency-policy/ (effective 9/1/2024) — "For a bachelor's degree, a minimum of 30 credits must be taken at SUNY Empire." / "Assessed prior learning (including CPL and PLE) does not count toward the residency requirement."
- https://catalog.sunyempire.edu/undergraduate/transfer-credit/ — "In our baccalaureate programs students may include up to 90-93 credits of advanced standing, depending on the overall number of credits required in the degree." Recommend 90 (conservative).

**University at Buffalo — cap** — CONFIRMED "no cap stated" (with caveat).
- https://catalogs.buffalo.edu/content.php?catoid=11&navoid=571 (read via automation; page header "2024-2025 Undergraduate Catalog [ARCHIVED CATALOG]") — no transfer maximum stated; residency "A student must complete a minimum of 30 undergraduate credit hours (the equivalent of one full year of study) at the University at Buffalo in order to earn a degree from the university."
- https://www.buffalo.edu/admissions/apply/transfer.html (snippet) — "UB accepts all college-level credits from regionally accredited two- and four-year degree-granting institutions."
- The current catalog edition was not read. The "64 from a two-year college" figure remains unsourced (third-party blog only).

**SUNY Plattsburgh — residency** — CORRECTED 30 → 36.
- https://catalog.plattsburgh.edu/content.php?catoid=18&navoid=3466 (2025-2026 catalog, read via automation) — "A minimum of 36 credit hours must be completed through coursework offered by SUNY Plattsburgh, with the exception of active duty service members who must complete a minimum of 30 credit hours at SUNY Plattsburgh. Credit earned through examinations may not be counted toward this requirement." / "A student must earn 30 of the last 36 credits in courses through SUNY Plattsburgh." / "Students may transfer a maximum of 67 credit hours from a two-year college." (cap 67/84 re-confirmed).

### Per-campus sources and quotes (CUNY)

**Brooklyn** — residency CONFIRMED 30; cap UNVERIFIABLE.
- https://www.brooklyn.edu/admissions-aid/transfer/how-to-apply/requirements-and-deadlines/ — "Candidates for a bachelor's degree are required to complete at least 30 credits at Brooklyn College, including: ... No fewer than 15 credits in advanced courses in the major department". No transfer maximum on this page or on /admissions-aid/transfer/transfer-credits/.

**Queens** — residency CONFIRMED 30 (conflict noted); cap CONFIRMED none.
- https://qc-undergraduate.catalog.cuny.edu/academics/curriculum — "a minimum of 30 credits in residence at Queens College during the student's undergraduate career for each degree".
- https://www.qc.cuny.edu/admissions/tce/ (2026-07-27) — "While there's no cap on the number of transfer credits awarded, students must still complete at least 30 credits at Queens College to receive a degree."
- CONFLICT: https://www.qc.cuny.edu/fye/transfer-students/ (2025-05-05) — "If you transfer in 75 or fewer credits, you must attain at minimum of 120 credits with at least 45 credits in residency". Catalog + admissions say 30; the 45 line is an advising page and may be stale — worth one registrar question.

**City College** — residency CONFIRMED 30; cap PARTLY 90.
- https://www.ccny.cuny.edu/advising/degree-information — "Residency requirement: completion of 30 credits of their degree at City College. In addition, at least 60% of the major (50% required for a minor) must be completed in residency at City College."
- Cap from search snippet of https://www.ccny.cuny.edu/admissions/undergraduate-transfer-credit-evaluations (page "Last Updated: 07/06/2026"): "A maximum of 90 transfer credits may be applied to your CCNY undergraduate degree regardless of what school you previously attended." The FAQ answer is collapsed and did not appear in the fetched body. Same page body: "Incoming Freshman may receive a maximum of 32 credits through AP, A Level, College Now, or CAPE examinations".

**John Jay** — residency CONFIRMED 30; overall cap UNVERIFIABLE.
- https://www.jjay.cuny.edu/admissions/undergraduate-admissions/apply/transfer-students/transfer-advanced-standing-credits — "Transfer students must complete at least 30 credits at John Jay to receive a degree, including at least 50% of the credits in the student's major program of study." / "A maximum of 45 credits may be granted for verifiable college level learning from external, non-college sources, such as law enforcement or fire academies, military, or standardized tests."

**Lehman** — residency CONFIRMED 30; cap CORRECTED → 70 from community colleges.
- https://lehman-undergraduate.catalog.cuny.edu/academic-services-and-policies/academic-policies/transfer-credit — "at least 30 credits as well as at least half of the credits in the major or in an interdisciplinary program, minor or certificate be completed at Lehman College."
- https://lehman-undergraduate.catalog.cuny.edu/academic-services-and-policies/academic-policies/epermit — "A student may not transfer more than 70 credits from community colleges." (Sits in the e-Permit section; a Senate document dated May 6, 2026 revising the e-Permit policy repeats it per snippet.)

**College of Staten Island** — residency CONFIRMED 30; cap CORRECTED → 90.
- https://www.csi.cuny.edu/students/registrar/frequently-asked-questions — "The maximum number of credits that can transfer is 90 credits." / "30 credits at CSI for residency".
- https://csi-undergraduate.catalog.cuny.edu/policies/credit-for-prior-learning — "All students must complete a minimum of 30 credits at the College, including at least one-half of the credits required for the major/core".

**City Tech** — residency CONFIRMED 30; cap CONFIRMED none.
- https://www.citytech.cuny.edu/transfer/tce-faqs.aspx — "No, there is no limit on the number of credits that may be transferred to City Tech. However, in order to complete either an associate or baccalaureate degree at City Tech, a student must complete a minimum of 30 credits at the College and 15 of those must be in their major."
- https://citytech.catalog.cuny.edu/academic-policies/degree-reqs — baccalaureate "A minimum of 30 credits must be completed in residence, at least 15 of which must be from among those listed as "Required Courses in the Major"".

**York** — residency CORRECTED 30 → 40; cap CORRECTED (partly).
- https://york-undergraduate.catalog.cuny.edu/acpoliciesandregs/gradreqs — "To qualify for a degree from York College, students must successfully complete a minimum of 40 in residency credits at York College and at least half of their credits in their major program must be taken at York College." Also: "Students who receive credit(s) based upon examinations, life experience and/or military service must still complete a minimum of 90 credits in college courses."
- https://york-undergraduate.catalog.cuny.edu/admissions/transfer — "a maximum of 68 credits will be accepted from a two-year non-CUNY college or degree program. A maximum of 80 credits will be accepted from a non-CUNY senior college." (No cap stated for CUNY community colleges — so for the app's CUNY-CC student, the cap is effectively bounded only by the 40-credit residency, i.e. 80.)

**Medgar Evers** — residency CONFIRMED 30; cap CORRECTED → 90.
- https://mec.catalog.cuny.edu/admission-to-the-college/transfer-of-credits — "The maximum number of credits that may be transferred toward a Baccalaureate degree is 90."
- https://mec.catalog.cuny.edu/academic-requirements-regulations-policies/academic-residency-requirements — "For a baccalaureate degree, a minimum of thirty (30) credits must be completed at Medgar Evers College, of which at least twenty-five (25) must be in the student's major area of study."

**CUNY SPS** — residency CORRECTED 30 → 15; cap CORRECTED → 105.
- https://sps.cuny.edu/admissions/undergraduate-admission/transfer-credit — "all bachelor's degree candidates are eligible to transfer up to 105 academic credits from accredited institutions, approved credit for prior learning exams, credentials, and portfolio assessment, and/or ACE evaluated military training. To earn a bachelor's degree at the CUNY School of Professional Studies (CUNY SPS), students must successfully complete at least 15 academic credits at CUNY SPS while matriculated." (Older CUNY documents say 90 max / 30 residency for the SPS BS in Nursing specifically — program-level rule.)

Also: the `UNCONFIRMED_CAP` note text ("Campuses we did read range from no set maximum (Baruch) to 67 from a two-year college (SUNY Plattsburgh)") is now wrong as a range — the lowest two-year caps found are **60 (Oswego)** and **64 (Geneseo, Cortland, Brockport)**.

---

## ITEM 2 — SUNY_EXAM_MAPPING / CUNY_EXAM_MAPPING

Overall verdict: **PARTLY**. Several rows are contradicted by campus charts that print a gen-ed designation. The single most important correction: **CLEP College Composition does not fill SUNY GE Communication at either SUNY campus that prints a GE column** (Albany, New Paltz). At CUNY, **City College's CLEP chart gives Pathways credit for only two CLEP exams** (College Composition, American Literature); everything else is "Required Liberal Arts" elective credit.

### Sources read
- **Albany** — https://www.albany.edu/undergraduate-education/students/credit-prior-learning : AP table (course only, **no GE column**); CLEP table **with a "General Education Category" column**. "CLEP's Subject Examinations and General Examinations can be taken by anyone." (So Albany does not refuse CLEP general exams.)
- **New Paltz** — AP: https://webapps.newpaltz.edu/transferequivalencies/equivalencies/source/10000 ; CLEP: https://webapps.newpaltz.edu/transferequivalencies/equivalencies/source/10001 — both print GE 4 and **GE 5** (GE 5 = "students who matriculated at SUNY New Paltz beginning or after Fall 2023"; page notes "Transfer equivalency pages are in the process of being updated with GE 5 courses"). "Any course not listed below will be evaluated for the appropriate transfer equivalent."
- **Geneseo** — AP chart PDF "Effective Fall 2016" https://www.geneseo.edu/wp-content/uploads/2018/12/AP-Credits-SUNY-Geneseo.pdf (registrar labels it for students who started before 2018-19; **no current chart found**); course prefixes carry Geneseo's gen-ed letter (S/ social science, N/ natural science, R/ quantitative reasoning, F/ fine arts, U/ US history, L/ language — letter meanings are inference from Geneseo convention, not stated in the PDF). CLEP PDF https://www.geneseo.edu/wp-content/uploads/2018/12/CLEP-Credits-SUNY-Geneseo.pdf (undated, posted 2018). Grade B — dated.
- **Oswego** — AP/CLEP tables live in acalog catalog pages (catoid=65 navoid=8960; CLEP catoid=62 navoid=8488) that fetch returns empty. A browser run was queued but had not started when this was written. **UNVERIFIABLE.** Oswego: "Any undergraduate at Oswego may receive a maximum of 30 semester hours of credit ... via proficiency examinations." (https://ww1.oswego.edu/admissions/undergraduate-admissions/how-apply/proficiency-examsadvanced-placement)
- **CCNY** — CLEP: https://www.ccny.cuny.edu/admissions/college-level-examination-program-clep-equivalencies-guidelines (Last Updated 06/03/2026), **has a "REQUIREMENT DESIGNATIONS" column**. AP: https://www.ccny.cuny.edu/admissions/advanced-placement-ap-equivalencies-guidelines (Last Updated 09/11/2026), no designation column, but some equivalents are explicit Pathways placeholders (FCUS = "Flexcore Us Exp&Div", FCWG = "Flexcore Wrld Cult", RCMQ = "Required Core - Mathematical & Quantitative Reasoning"). "A combined maximum of 32 credits can be transferred for pre-college course work and transfer credit for examinations."
- **John Jay** — AP: https://www.jjay.cuny.edu/academics/undergraduate-programs/credit-prior-learning/credit-exam/ap-exams ; CLEP: https://www.jjay.cuny.edu/academics/undergraduate-programs/credit-prior-learning/credit-exam/clep-exams/clep-equivalency-table ("Updated 5/15/2022"). Course equivalents only, except CLEP science rows say "(Life & Phys)" / "(Sci World)". Policy: "If the equivalent course for a CLEP exam satisfies a general education, major, or minor requirement, then that CLEP exam may be used to satisfy that requirement."
- **Lehman** — https://www.lehman.edu/admissions/alternative-credit-options/ : "Undergraduate students who have completed Advanced Placement (AP) courses ... and have passed the AP exam ... with grades of 4 or 5 are welcome to submit their scores ... students will be exempt from taking the equivalent courses". Per-exam AP/CLEP lists are behind links ("click here") / CUNY Transfer Explorer, not read. "Lehman College only accepts CPL that we have evaluated and listed through CUNY Transfer Explorer." Lehman language page (snippet): "We do not accept CLEP scores in fulfillment of the foreign language requirement."
- **Queens** — https://www.qc.cuny.edu/admissions/credit-for-prior-learning/ : policy only — "When no specific course exists, the College shall give credit for prior learning to satisfy degree program requirements (general education or major or minor). General elective credit will only be given when no other option is available." Per-exam chart not found. **UNVERIFIABLE** per exam.
- **Brooklyn AP** — still only in CUNY Transfer Explorer (JavaScript); **UNVERIFIABLE** (prior research's CLEP table stands).

### New refusals / restrictions found (not in the app)
- **York College (CUNY)** — https://york-undergraduate.catalog.cuny.edu/admissions/transfer : "Credits will be awarded for the examinations listed above, which evaluate knowledge in specific subjects rather than general knowledge." and "A maximum of 16 credits can be earned in this manner; however, nursing majors may earn up to 20 credits." → reads as a refusal of CLEP **general** exams (Humanities, College Composition, College Mathematics, Natural Sciences) and a **16-credit exam cap**. Add `york-college-cuny` to `REFUSES_CLEP_GENERAL` (needs_check: the sentence does not name titles).
- **City Tech (CUNY)** — https://www.citytech.cuny.edu/transfer/tce-faqs.aspx : "College Level Examination Program (CLEP) - minimum score of 50 (we do not accept CLEP for lab sciences or math courses)". → CLEP College Algebra, College Mathematics, Biology (and likely Natural Sciences) earn no math/lab-science credit at City Tech. AP min 3.
- **John Jay** — "College Composition Modular with Optional Essay | not accepted".
- **Lehman** — AP 4 or 5 required for course exemption (admissions page), which sits oddly with CUNY Policy 1.21's 3+ floor; treat Lehman AP 3 as elective-at-best.
- **CCNY** — 32-credit cap on exam + pre-college credit.
- **Geneseo** — CLEP minimums above 50 (55–70) on its (2018) chart; College Mathematics, Humanities, Natural Sciences not listed.

### Row-by-row: SUNY (app min / area → what the charts say)

| App row | App | Albany | New Paltz (GE 5) | Geneseo (2016 AP / 2018 CLEP) | Verdict |
|---|---|---|---|---|---|
| AP English Lang | 4 → Communication | 3+ AENG 100Z + AENG E10 (6 cr); GE not printed | 3–5 ENG160; **GE blank** | 3,4 ENGL 1TR (elective); 5 ENGL 101; no GE letter | UNVERIFIED — no chart prints Communication; flag |
| AP English Lit | 4 → Hum/Arts | 3+ AENG 121Z + AENG 100Z (6); GE not printed | 3–5 ENG160 or ENG193; **GE blank** | 3,4 ENGL 1TR; 5 ENGL 101; no GE letter | UNVERIFIED — no chart prints Humanities |
| AP Calculus AB | 4 → Math (4 cr) | 4/5 AMAT 112 + E10 (6); 3 AMAT 106 + E10 | 3 MAT181 or ELT000 **Mathematics**; 4/5 MAT251 **Mathematics** | 4,5 R/MATH 221 (4) | CONFIRMED (NP, Geneseo) |
| AP Calculus BC | 4 → Math (4) | 4/5 AMAT 112+113 (8) | 3 MAT251; 4/5 MAT251+252 **Mathematics** | 4,5 R/MATH 221+222 (8) | CONFIRMED; credits understated (8 typical) |
| AP Statistics | 4 → Math (3) | 3+ AMAT 108 (3) | 3–5 MAT241 **Mathematics** | 4,5 R/MATH 262 | CONFIRMED (NP fills at 3) |
| AP Biology | 4 → Nat Sci (4) | **5** for courses; 3–4 = ABIO E00+E01 elective (8) | 3 BIO293 **Natural Science**; 4/5 BIO202+212 | 4 N/BIOL 105+106 | PARTLY — Albany needs 5 for a course |
| AP Chemistry | 4 → Nat Sci | 3+ ACHM 115+116 (8) | 3 CHE293; 4 CHE201+211 **Natural Science** | 4,5 N/CHEM (8) | CONFIRMED |
| AP Physics 1 | 4 → Nat Sci | 4/5 APHY 105+106 (4); 3 elective | 3 PHY293; 4/5 PHY221+231 **Natural Science** | 4,5 N/PHYS 113+114 | CONFIRMED |
| AP Env Sci | 4 → Nat Sci (3) | 3+ AENV 105 (3) | 3 GLG120 **Natural Science** | 4,5 N/ENVR 1TR (4) | CONFIRMED |
| AP Art History | 4 → Hum/Arts | 3+ AARH 170+171 (6) | 3–5 ARH201+202 **The Arts** | 4,5 F/ARTH 1TR | CONFIRMED (Arts) |
| AP US History | 4 → Soc/US | **5** for AHIS 100+101; 3–4 AHIS E10+E11 elective | 3–5 HIS221 or 222 **US History & Civic Engmnt** | 3–5 S/U/HIST 150+151 | PARTLY — Albany needs 5 for a course |
| AP US Gov | 4 → Soc/US | 3+ RPOS 101 | 3 POL193; 4/5 POL216 **US History & Civic Engmnt** | 4,5 S/U/PLSC 110 | CONFIRMED |
| AP Psychology | 4 → Soc/US | 3+ APSY 101 | 3 PSY101 or ELT000; 4/5 PSY101 **Social Sciences** | 4,5 S/PSYC 100 | CONFIRMED |
| AP Macro / Micro | 4 → Soc/US | 3+ AECO 111 / 110 | 3–5 ECO207 / ECO206 **Social Sciences** | 4,5 S/ECON 112 / 110 | CONFIRMED |
| AP Human Geography | 4 → Soc/US | 3+ AGOG 102 | 3–5 GEO201 **Social Sciences** | 4,5 S/GEOG 102 | CONFIRMED |
| AP Comparative Gov | 4 → World | 3+ RPOS E10 (elective) | 3 POL293; 4/5 POL229 **World History & Global Aw** | 4,5 S/PLSC 120 (**social science**) | PARTLY — Geneseo gives Social, not World |
| AP European History | 4 → World | **5** for AHIS 130+131; 3–4 elective | 3–5 HIS214 **World History & Global Aw** | 3–5 S/HIST 106 (**social science**) | PARTLY — Albany needs 5; Geneseo gives Social |
| AP Spanish Lang | 4 → World | 3/4 ASPN 100+101 (8); 5 ASPN 103+E10 | 3 SPA201; 4/5 SPA201+202 **World Languages 3** | 4 SPAN 1TR + L/SPAN 2TR | CONFIRMED (World Languages) |
| CLEP College Composition | 50 → **Communication** | 50 AENG 100Z+E10 (6); **GE column blank** | 50 ENG160+ENG193; **GE blank** | 55 ENGL 1TR (elective) | **CORRECTED — does not fill Communication** at the two campuses that print GE; refused at Binghamton/Stony Brook. Recommend area `null`. |
| CLEP College Algebra | 50 → Math | 50 AMAT E00 **Mathematics and Quantitative Reasoning** | 50 MAT152 **Mathematics** | **70** MATH 1TR (no GE) | PARTLY — Geneseo min 70 |
| CLEP College Mathematics | 50 → Math | 50 AMAT E00 **Mathematics and QR** | 50 MAT120 — **GE blank** | not listed | PARTLY (Albany yes, NP no) |
| CLEP Biology | 50 → Nat Sci (3) | 50 ABIO E00+E01 (**6 cr**) **Natural Sciences** | 50 BIO201+202 **Natural Science Lecture** | 55 BIOL 1TR | CONFIRMED area (Albany/NP); Geneseo 55 |
| CLEP Natural Sciences | 50 → Nat Sci | 50 ABIO E00+ACAS E10 (6) **Natural Sciences** | 50 ELT000×2; GE 4 "Natural Science Course", **GE 5 blank** | not listed | PARTLY |
| CLEP Humanities | 50 → Hum/Arts | 50 ACAS E10 **The Arts or Humanities** | not listed | not listed | PARTLY (Albany yes; SB/Bing refuse) |
| CLEP American Literature | 50 → Hum/Arts | 50 AENG E10 **Humanities** | not listed | 55 ENGL 1TR | PARTLY |
| CLEP History of US I | 50 → Soc/US | 50 AHIS 100 **US History and Civic Engagement** + **DEISJ** | 50 HIS221 **US History & Civic Engmnt** | 60 HIST 1TR | CONFIRMED (Albany also grants DEI — app does not) |
| CLEP American Government | 50 → Soc/US | 50 RPOS 101 **US History and Civic Engagement** | 50 POL216 **US History & Civic Engmnt** | 55 PLSC 1TR | CONFIRMED |
| CLEP Intro Psychology | 50 → Soc/US | 50 APSY 101 **Social Sciences** | 50 PSY101 **Social Sciences** | 60 S/PSYC 100 | CONFIRMED (Geneseo 60) |
| CLEP Intro Sociology | 50 → Soc/US | 50 ASOC 115 **Social Sciences** | 50 SOC100 **Social Sciences** | 60 SOCL 1TR | CONFIRMED (Geneseo 60) |
| CLEP Macroeconomics | 50 → Soc/US | 50 AECO 111 **Social Sciences** | 50 ECO207 **Social Sciences** | 60 ECON 1TR | CONFIRMED (Geneseo 60) |

Note on "AP 4 vs 3" at SUNY: New Paltz fills the GE area at **3** for nearly every row; Albany often needs **5** (Bio, US Hist, Euro Hist) for a course and gives elective credit below that. So "4" is neither the floor nor safe at Albany. The app's 4 is a reasonable middle but should not be described as "the score at which the charts start naming a course".

### Row-by-row: CUNY

| App row | App | City College | John Jay | Verdict |
|---|---|---|---|---|
| AP English Lang | 4 → Comp I | 4 ENGL 11000 Freshman Composition (= "Required Core - English Composition" per CCNY CLEP table); 3 HUM 99902 elective | 3 ENG 101 & ENG 201 (6 cr) | CONFIRMED at 4 (CCNY); JJ gives both comps at 3 (Pathways not printed) |
| AP English Lit | 4 → **Comp II** | 4 WHUM 10100 World Humanities 1 (= "Flexible Core - World Cultures & Global Issues" per CCNY CLEP table); 3 elective | 3 LIT 230 & LIT elective | **CORRECTED/flag** — neither campus maps it to English Composition II |
| AP Calculus AB | 4 → Math (4) | 4 MATH 20100 (4); 3 MATH 99902 elective (BC's AB-subscore 3 → RCMQ Required Core Math) | 3 MAT 141 (3); 4 MAT 151 (4) | CONFIRMED at 4 |
| AP Calculus BC | 4 → Math (4) | 4 MATH 20100+21200 (8); 3 MATH 20100 (4) | 3 MAT 151; 4 MAT 151+152 (8) | CONFIRMED; credits 8 at 4 |
| AP Statistics | 4 → Math (3) | 3 MATH 17300 (4) | 3 MAT 108; 4 STA 250 | CONFIRMED (at 3) |
| AP Biology | 4 → LPS (4) | 4 BIO 10100+10200 (8); 3 BIO 10004 Human Biology (3) | 3 BIO 103 + BIO elective (9) | course confirmed; Pathways not printed |
| AP Chemistry | 4 → LPS | 4 CHEM 10301+10401 (8); 3 CHEM 11000 | 3 CHE 103 + elective (9) | course confirmed |
| AP Physics 1 | 4 → LPS | 4 PHYS 20300 (4); 3 elective | 3 PHY 101 (4) | course confirmed |
| AP Env Sci | 4 → Sci World (3) | 3 EAS 10400 (3) | 3 ENV 108 (3) | course confirmed |
| AP Art History | 4 → Creative | 3 ART 10000 (3) | 3 ART 101 (3) | course confirmed |
| AP US History | 4 → US Exp | 3 **FCUS 10000 Flexcore US Exp&Div** (3); 4 USSO 10100 (3) | 3 HIS 201 & HIS 202 (6) | CONFIRMED (CCNY fills it at 3) |
| AP US Gov | 4 → US Exp | 3 PSC 10100 | 3 POL 101 | course confirmed |
| AP Psychology | 4 → Ind & Soc | 3 PSY 10200 | 3 PSY 101 | course confirmed |
| AP Macro / Micro | 4 → Ind & Soc | 3 ECO 10350 / 10250 | 3 ECO 120 / 125 | course confirmed |
| AP Human Geography | 4 → World | 3 **HUM 99902 elective** | 3 **SSC elective** | **CORRECTED/flag** — elective only at both |
| AP Comparative Gov | 4 → World | 4 PSC 10300; 3 elective | 3 POL 257 | course confirmed |
| AP European History | 4 → World | 3 **FCWG 10000 Flexcore World Cult**; 4 HIST 20400+206 (6) | 3 HIS 203 & 205 (6) | CONFIRMED (CCNY at 3) |
| AP Spanish Lang | 4 → World | 3 SPAN 12400; 4 SPAN 22600 | 3 SPA 101 & 102 (6) | course confirmed |
| CLEP College Composition | 50 → Comp I | 50 ENGL 11000 **"Required Core - English Composition"** | 50 ENG 101 & ENG 201 (6) | CONFIRMED (refused as "general" at York) |
| CLEP College Algebra | 50 → Math | 50 SCI 99902 **"Required Liberal Arts"** | 50 MAT 105 | **CORRECTED at CCNY** (elective); City Tech refuses CLEP for math |
| CLEP College Mathematics | 50 → Math | 50 SCI 99902 "Required Liberal Arts" | 50 MAT 106 | **CORRECTED at CCNY**; City Tech refuses; York refuses (general) |
| CLEP Biology | 50 → LPS | 50 SCI 99902 "Required Liberal Arts" | 50 "BIO elective (Life & Phys) BIO elective (Sci World)" (6) | CONFIRMED at JJ; **CORRECTED at CCNY**; City Tech refuses (lab science) |
| CLEP Natural Sciences | 50 → Sci World | 50 SCI 99902 "Required Liberal Arts" | 50 "SCI elective (Life & Phys) SCI elective (Sci World)" (6) | CONFIRMED at JJ; **CORRECTED at CCNY**; York refuses (general) |
| CLEP Humanities | 50 → Creative | 50 HUM 99902 "Required Liberal Arts" | 50 HUM elective | **CORRECTED** — elective at both; York refuses |
| CLEP American Literature | 50 → **Creative** | 50 ENGL 15500 **"Flexible Core - US Experience in its Diversity"** | 50 LIT 233 | **CORRECTED at CCNY** (US Experience, not Creative) |
| CLEP History of US I | 50 → US Exp | 50 HUM 99902 "Required Liberal Arts" | 50 HIS 201 | **CORRECTED at CCNY** (elective) |
| CLEP American Government | 50 → US Exp | 50 SSC 99902 "Required Liberal Arts" | 50 POL 101 | **CORRECTED at CCNY** |
| CLEP Intro Psych / Intro Soc / Macro | 50 → Ind & Soc | 50 SSC 99902 "Required Liberal Arts" (each) | 50 PSY 101 / SOC 101 / ECO 120 | **CORRECTED at CCNY** |

Queens, Brooklyn (AP), Lehman (per-exam): UNVERIFIABLE — charts are in CUNY Transfer Explorer (JS) or behind unread links.

Recommendation: the `CUNY_EXAM_MAPPING` note claims a "common case"; on the evidence, CCNY treats 11 of 13 listed CLEP exams as elective. Consider pricing CUNY CLEP rows (other than College Composition) as `satisfies_areas: []` at City College, or per-campus overrides, and keep `needs_check`.

---

## ITEM 3 — SUNY_CC_COST ($190/credit)

Verdict: **CORRECTED** (as a per-course price). $190 is SUNY's typical *full-time annual* tuition ÷ 30 and is still accurate as that (SUNY smarttrack 2026-27: community college tuition **"$5,690"** In-State/In-District — https://www.suny.edu/smarttrack/tuition-and-fees/, "2026-27 Typical Expenses ... (as of August 2026)"). But a student buying one or two courses pays the **part-time per-credit** rate, which at every college checked is $211–$252, well above $190. Under-pricing a course is the "in the student's favour" error AGENTS.md warns about.

2026-27 resident (with Certificate of Residence) part-time tuition per credit, tuition only, fees excluded:

| College | Per credit | Full-time | Source / quote |
|---|---|---|---|
| Monroe CC | **$223** | — | https://www.monroecc.edu/etsdbs/MCCatPub.nsf/Online+Catalog+by+title/tuition-and-fees-2026-2027?OpenDocument — "Tuition and Fees 2026-2027 ... New York State resident* \| $223 per credit hour"; "*New York State residents must have a Certificate of Residence on file" |
| SUNY Erie | **$217** | $5,200/yr | https://www.ecc.edu/admissions-and-aid/tuition-fees.html — "full-time (per academic year): $5,200.00 part-time (per credit hour): $217.00" (page lists Fall 2026 due dates; academic year not printed on the rate table). Plus $25/credit technology fee. |
| Nassau CC | **$250** | $2,995/sem | https://www.ncc.edu/payingforcollege/ — "Academic Year 2026-2027 ... Nassau County Resident \| 2995.00 \| 250.00" |
| Suffolk CCC | **$252** | $3,025/sem | Board resolution https://www3.sunysuffolk.edu/Boards/Archive/3482.pdf — "approved for the 2026–2027 academic year ... Tuition, Residents (per credit) $252 $252"; also https://www.sunysuffolk.edu/apply-enroll/tuition-and-fees/index.jsp "Tuition, Residents $252 per credit" |
| Onondaga CC | **$232** | $2,781/sem | https://www.sunyocc.edu/tuition — "2026/2027 Resident Tuition & Fees ... Tuition \| $2,781/semester \| $232/credit hour" (+$25/credit tech fee) |
| Hudson Valley CC | not published (2025-26 was $211) | **$2,654.50/sem** | https://www.hvcc.edu/about/news/archives/2026/07/rensselaer-county-legislature-approves-hudson-valley-community-colleges-202627-budget.html (July 15, 2026) — "Full-time New York State residents will pay $2,654.50 per semester, an increase of $126.50." Part-time 2026-27 rate not stated → PARTLY |
| SUNY Niagara (prior research) | $227 | $2,724/sem | sunyniagara.edu/tuition/rates/ |

Median of the six published part-time rates (217, 223, 227, 232, 250, 252) = **$229.50**. Full-time-equivalent per credit (annual FT ÷ 30): Erie $173, Nassau $200, Suffolk $202, Onondaga $185, HVCC $177 — median ≈ $185, consistent with SUNY's $5,690.

**Suggested defensible value: $230/credit** (median part-time resident rate, tuition only), with a note that full-time students pay roughly $175–$200/credit-equivalent, that mandatory fees ($4–$25/credit at the colleges above) are extra, and that without a Certificate of Residence the rate doubles. If the app wants one number that never under-prices a single course, $250 (Nassau/Suffolk) is the conservative ceiling among those checked.

---

## ITEM 4 — CUNY $305 / $210 and SUNY $295

- **CUNY senior $305/credit (resident, part-time)** — CONFIRMED. https://www.cuny.edu/financial-aid/tuition-and-college-costs/ — "New York State Resident \| $3,465 per semester \| $305 per credit \| $305 per credit". The rate table carries no year label; the same page shows "Nine Month Student Budgets 2026-2027", so it is the current page for 2026-27.
- **CUNY community college $210/credit (NYC resident, part-time)** — CONFIRMED. Same page — "New York City Resident \| $2,400 per semester \| $210 per credit \| $210 per credit"; footnote: "Students who live in NY State but do not live in New York City may be eligible for the same tuition".
- **SUNY state-operated $295/credit** — CONFIRMED (consistent). SUNY smarttrack 2026-27 (as of August 2026) lists resident tuition "$7,070" (= 2 × $3,535); the $295/credit figure itself is from SUNY policy 7815 and UB's Fall 2026 page already cited in data/research/NEW-YORK.md — not re-opened this pass.

---

## Open items left for a human
1. Oneonta residency (45?) — open https://catalog.oneonta.edu/content.php?catoid=29&navoid=1836 in a browser.
2. Oswego two-year cap (60 vs 90) and Oswego AP/CLEP GE tables — acalog pages need a browser.
3. Binghamton overall transfer cap; Farmingdale cap; Purchase residency; Brooklyn cap; John Jay overall cap.
4. Queens 30 vs 45 residency (catalog vs FYE page).
5. CCNY "90" cap: open the collapsed FAQ.
6. Current (post-2018) Geneseo AP chart; Queens/Brooklyn/Lehman per-exam Pathways designations (CUNY Transfer Explorer).
7. HVCC 2026-27 part-time per-credit rate.
