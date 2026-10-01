# Pennsylvania — transfer-credit research (PASSHE + Penn State, Pitt, Temple)

Read date for every row: **2026-10-01** unless stated otherwise.
Grades: **A** = official page opened and read; **B** = official page seen only through a search snippet, or a secondary but authoritative page; **C** = recalled or unverified.
"(automation)" means the page is a JavaScript list that plain fetch could not render, so a TinyFish browser agent opened it and read it back. The source is official, but a script did the reading, so a person should check those rows by hand before promoting them.

---

## 0. Headline findings (read these first)

1. **The statewide AP/CLEP minimum scores bind PASSHE and community colleges. They do not bind Penn State, Pitt or Temple.** The statute's credit-for-prior-learning duty is written for community colleges and PASSHE. PSU, Pitt and Temple are not "fully participating" PA TRAC members, and their published charts differ from the statewide minimums. For example, Penn State gives **no credit at any score** for AP English Language, and Pitt needs a **4** on most AP exams where the state minimum is 3.
2. **Penn State gives no credit for CLEP College Composition or College Composition Modular** (automation, A-). **Temple does not accept CLEP College Composition, College Algebra or Humanities at all**: they are not on its list, and Temple says "Exams that are not listed are not accepted for credit at Temple University". Temple also requires an extra Temple essay before it posts credit for any literature, history or political-science CLEP exam.
3. **Pitt's Dietrich School:** older catalogs said "The Dietrich School does not accept CLEP general examination credits." The 2026-27 Dietrich catalog page I read **no longer contains that sentence and says nothing about CLEP**. Pitt's university-wide Provost regulation (effective Fall 2025) lists CLEP as an allowed source of advanced-standing credit. Treat Dietrich + CLEP as **unknown / needs_check**. Do not treat it as accepted. Pitt's College of General Studies (CGS) does accept CLEP and publishes a chart.
4. **PASSHE has a strong statutory and policy guarantee.** An AA/AS in a P2P or parallel program gives full junior standing, and the student "shall not be required to satisfactorily complete more than 60 credits to earn a 120-credit baccalaureate". 30 framework-aligned credits complete general education. Residency is 30 of the last 60 credits.
5. **There is no statewide community-college fee waiver in Pennsylvania.** What exists is need- or work-conditioned grants (PA State Grant, Grow PA Grant up to $5,000), a PASSHE-only last-dollar pledge starting **fall 2027**, and local programs such as Philadelphia's Catto Scholarship. `fee_waiver` must stay **null**.

---

## 1. Statewide transfer framework (Article XX-C; PA TRAC / "PA College Transfer"; 30-Credit Transfer Framework; P2P)

### 1a. What the law requires
- **Claim:** Pennsylvania's statewide transfer system comes from Article XX-C of the Public School Code of 1949. It requires (i) transfer of at least 30 credits of foundation courses, (ii) full transfer of AA/AS/AFA/AAS degrees into parallel bachelor's degrees, (iii) uniform credit-for-prior-learning standards (AP, IB, CLEP, DSST), and (iv) a one-stop web portal.
  - URL: https://collegetransfer.pa.gov/About-PA-College-Transfer/TAOC-Policies
  - Quote: "The transfer of at least 30 credits of foundation-level courses among the participating institutions. An advising tool called the 30-Credit Transfer Framework allows students to enroll in up to 30 credits of coursework and have those credits transfer and apply toward graduation at any participating institution." / "The full transfer of associate of arts degree, associate of science degree, associate of fine arts degree, or associate of applied science degree into parallel bachelor's degrees at the participating institutions" / "Uniform standards for determining academic credit for prior learning, including an Advanced Placement Program exam, International Baccalaureate Diploma Program exam, a College-Level Examination Program exam, and Dantes Subject Standardized Tests"
  - Grade: **A**
- **Claim (enabling acts):** Act 114 of 2006 added Article XX-C. Act 50 of 2009 added the AA/AS-to-parallel-bachelor's junior-standing requirement.
  - URL: https://www.patrac.org/Portals/6/PAFiles/TAOC_GeneralStatewideP2PAgreement_REV_081811.pdf (PDE/TAOC General Statewide P2P Articulation, last updated Aug 19 2011)
  - Quote: "the General Assembly of the Commonwealth of Pennsylvania enacted Act 114 of 2006, which added to the Public School Code of 1949, Article XX-C entitled 'Transfers of Credits Between Institutions of Higher Education'" … "enacted Act 50 of 2009, which requires institutions participating in the Statewide Transfer System to accept the transfer of Associate of Arts and Associate Science degrees into parallel baccalaureate programs and recognize all competencies attained within the associate degree program"
  - Grade: **A**
  - Inconsistency to note: PASSHE Policy 1999-01-A says "In 2008, legislation amended the Public School Code … adding Article XX-C", and PASSHE Procedure 2022-54 says "2009 legislation … adding Article XX-C". The PDE agreement says Act 114 of **2006**. Cite Act 114 of 2006 plus Act 50 of 2009, and flag the dates for statute verification.
- **Claim (statute text):** I tried to read Article XX-C on palegis.us (1949 Act 14, Chapter 20C). The page is JavaScript-only and returned no statute text. **The statute itself was not read.** Everything above comes from PDE/TAOC and PASSHE documents that quote or describe it.

### 1b. Who must participate
- **Claim:** Participation is mandatory for the 15 community colleges and the 10 PASSHE universities. The PDE page also says the four state-related universities are mandated.
  - URL: https://collegetransfer.pa.gov/About-PA-College-Transfer/TAOC-Policies
  - Quote: "Article XX-C … mandates participation by Pennsylvania's 15 community colleges, the 10 universities in the Pennsylvania State System of Higher Education (PASSHE), and the commonwealth's four state-related universities. Accredited degree-granting Institutions of Higher Education in Pennsylvania may elect to participate."
  - Grade: **A**
- **Conflicting / clarifying source:** the 2011 P2P agreement says state-related universities only *elect* to participate. The current PDE page on state-related universities says PSU, Temple and Pitt meet only the **minimum** requirement: at least 30 framework credits. Lincoln participates fully.
  - URL: https://www.patrac.org/Portals/6/PAFiles/TAOC_GeneralStatewideP2PAgreement_REV_081811.pdf. Quote: "Act 114 of 2006 requires all community colleges in Pennsylvania and Pennsylvania State System of Higher Education (PASSHE) universities to participate in the Statewide Transfer System; … permits independent and state-related institutions of higher education in Pennsylvania … to elect to participate". Grade **A**
  - URL: https://collegetransfer.pa.gov/Student/Transferring-to-a-State-Related-University-in-PA. Quote: "The Commonwealth has four state-related universities that have varying levels of participation in the statewide transfer system and PA TRAC. Lincoln University has elected to participate fully … PSU, Temple and Pitt meet the minimum legislative requirements for state-related universities. Each has identified at least 30 credits from the 30-Credit Transfer Framework that they will accept for transfer from each of the fully participating PA TRAC colleges." Grade **A**
  - URL: https://collegetransfer.pa.gov/About-PA-College-Transfer/Participating-Four-Year-Institutions. The current four-year participant list links Carlow, Cheyney, Commonwealth, East Stroudsburg, IUP, Kutztown, **Lincoln**, Millersville, PennWest, Shippensburg, Slippery Rock and West Chester. **Penn State, Pitt and Temple are not on it.** Grade **A**
  - URL: https://www.psu.edu/resources/transfer-students/pa-college-transfer. Quote: "Penn State participates in the 30-Credit Transfer Framework. These are general education courses that transfer directly to Penn State from other PA College Transfer institutions." The listed PSU courses are ENGL 015, CAS 100, ECON 102, ECON 104, SOC 001, PL SC 001, PSYCH 100, HIST 020, HIST 021, PHIL 001, ART H 100 and MUSIC 005. Grade **A**
  - **Model implication:** P2P junior standing and the statewide AP/CLEP minimums apply to PASSHE and community colleges, plus Lincoln and other opt-ins. For PSU, Pitt and Temple, only a limited framework-course acceptance applies.

### 1c. The 30-Credit Transfer Framework: categories and caps
- **Claim:** Six categories, 3–4 credit courses, at most 30 credits in total.
  - URL: https://collegetransfer.pa.gov/Transfer-Information/General-Education-Courses
  - Quote: "The 30-Credit Transfer Framework provides a list of general education courses that are preapproved by all PA College Transfer schools. Students may select up to 30 credits to transfer toward a degree at any PA College Transfer institution."
  - Categories as printed:
    - **Category 1 (select 1):** English Composition
    - **Category 2 (select 1):** Public Speaking
    - **Category 3 (select no more than 2):** Precalculus, Calculus I, Statistics, College Algebra
    - **Category 4 (select no more than 2):** General Chemistry I and II, General Biology I and II, General Physics I and II, Anatomy and Physiology I and II, Introduction to Astronomy
    - **Category 5 (select no more than 2):** General Psychology, Developmental Psychology, Intro to Sociology, Modern Social Problems, American Government, History of Western Civilization I and II, Principles of Macroeconomics, Principles of Microeconomics, U.S. History I and II
    - **Category 6 (select no more than 2):** Intro to Music, Intro to Theatre, Intro to Philosophy, Ethics, Elementary Spanish I and II, Painting I, Drawing I, Intro, World, or American Literature
  - Grade: **A**
  - My summary of category names (not quoted): English Composition; Public Speaking; Mathematics; Natural & Physical Sciences; Social & Behavioral Sciences; Humanities & Fine Arts. PASSHE Policy 1999-01-A names them "Composition, Public Speaking, Humanities & Arts, Behavioral/Social Sciences, Sciences, and Mathematics".
- **Claim:** Framework courses are 3 or 4 credits each, and together equal one year (30 credits).
  - URL: https://collegetransfer.pa.gov/30-Credit-Transfer-Framework
  - Quote: "Framework courses are worth 3- or 4- credits each and are separated into six broad categories." / "students can earn the equivalent of one full-year of study (30 credits)"
  - Grade: **A**

### 1d. Program-to-Program (P2P): the junior-standing guarantee
- **Claim (PDE):** An AA/AS that matches a statewide P2P program gives junior standing and at least 60 credits applied, but **does not guarantee admission**.
  - URL: https://collegetransfer.pa.gov/PENNSYLVANIA-STATEWIDE-P2P-AGREEMENTS
  - Quote: "Upon acceptance, the student has junior standing, has at least 60 credits applied toward graduation in the parallel bachelor's degree, and is permitted to enter advanced coursework in the major." / "Statewide P2P Agreements do not guarantee admission to a PA TRAC college or the intended major." / "It does not apply to students transferring without an associate degree, transferring into a different major, or transferring to a non-PA TRAC college."
  - Eligible programs listed: Art, Biology, Business, Chemistry, Communications, Computer Science, Criminal Justice, Earth Science, Education: PreK-4, English, Environmental Geoscience, Environmental Science, Geography, Geology, History, Mathematics and Statistics, Meteorology, Modern Languages, Physical Oceanography, Physics, Political Science, Psychology, Social Work, Sociology, Theatre.
  - Grade: **A**
- **Claim (PASSHE goes further):** At PASSHE, admission **is** guaranteed (subject to capacity) for an AA/AS in a parallel or P2P program. The student needs no more than 60 more credits for a 120-credit degree, and general education is deemed satisfied.
  - URL: https://www.passhe.edu/policies/documents/BOG_Policies/Policy%201999-01-A.pdf (Board of Governors Policy 1999-01-A, amended July 11 2024, effective July 2024)
  - Quote: "Undergraduate students who transfer into the State System of Higher Education with an Associate of Arts or an Associate of Science degree … in a parallel academic program or as part of the P2P Statewide agreements will be awarded full junior standing and shall not be required to satisfactorily complete more than 60 credits to earn a 120-credit baccalaureate degree in a P2P or other parallel program, regardless of the courses they took to earn the Associate degree" / "Students who transfer … with an Associate of Science or an Associate of Arts degree, or having completed general education requirements … shall have satisfied the general education requirements at the receiving university. Exceptions may be made for … (a) One signature general education course (up to 3 credits) …; (b) Any prescribed general education course required for the major …; (c) General education overlays satisfied in advanced courses in the major." / "Admission to a State System university is guaranteed for undergraduate students transferring from a Pennsylvania Community College with an associate degree … subject to capacity" / "General education credits aligned with the PA Statewide Transfer Credit Framework will transfer toward the general education requirements at the receiving institution."
  - Grade: **A**
- **Claim:** At PASSHE, 30 framework-aligned credits complete general education, which PASSHE calls "Core-to-Core" transfer.
  - URL: https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/2022-54%20Student%20Transfer.pdf (Procedure/Standard 2022-54, revised July 11 2024)
  - Quote: "Transfer students with at least 30 credits in liberal arts and sciences disciplines, aligned with the 30-Credit Framework, will be considered to have completed a general education program through prior learning and, with three exceptions stipulated in the policy, are not required to satisfy remaining general education requirements at a State System university."
  - Also: "college-level credits from postsecondary institutions with Department of Education-recognized accreditation may not be rejected for earned grade requirements, for lack of equivalent course at the receiving institution, for modality of instruction, or for any other reason."
  - Grade: **A**

---

## 2. PASSHE's universities (after the 2022 integrations)

- **Claim:** PASSHE has 10 universities. Official names:
  1. Cheyney University of Pennsylvania
  2. Commonwealth University of Pennsylvania (campuses: Bloomsburg, Lock Haven, Mansfield; plus Clearfield location)
  3. East Stroudsburg University of Pennsylvania
  4. Indiana University of Pennsylvania
  5. Kutztown University of Pennsylvania
  6. Millersville University of Pennsylvania
  7. PennWest University (campuses: California, Clarion, Edinboro). The PA College Transfer profile uses "Pennsylvania Western University".
  8. Shippensburg University of Pennsylvania
  9. Slippery Rock University of Pennsylvania
  10. West Chester University of Pennsylvania
  - URL: https://www.passhe.edu/news/releases/2026-07-09_PASSHE-universities-pledge-to-cover-tuition-for-eligible-PA-students.html
  - Quote: "The State System universities are Cheyney University of Pennsylvania, Commonwealth University of Pennsylvania, East Stroudsburg University of Pennsylvania, Indiana University of Pennsylvania, Kutztown University of Pennsylvania, Millersville University of Pennsylvania, PennWest University, Shippensburg University of Pennsylvania, Slippery Rock University of Pennsylvania and West Chester University of Pennsylvania."
  - Campus breakdown: https://www.passhe.edu/news/releases/2026-09-23_PASSHE-universities-to-bring-college-closer-to-high-school-students.html. Quote: "Cheyney, Commonwealth (Bloomsburg, Lock Haven and Mansfield), East Stroudsburg, Indiana, Kutztown, Millersville, PennWest (California, Clarion and Edinboro), Shippensburg, Slippery Rock and West Chester universities of Pennsylvania."
  - Grade: **A**
- Integration year (2022) is **C (recalled)**. I did not open a source for the date.

---

## 3. Credit by exam (AP, CLEP, IB)

### 3a. Statewide (TAOC/PDE) uniform minimum scores: binding on PASSHE and community colleges
- **Claim:** A 2017 law (24 P.S. § 20-2002-C(d)) requires community colleges and PASSHE to adopt uniform credit-for-prior-learning standards and to award credit at or above the approved minimums. Which course the credit counts as, and how many credits, is left to each institution.
  - URL: https://collegetransfer.pa.gov/Administrators/Credit-for-Prior-Learning
  - Quote: "In 2017, the Pennsylvania General Assembly passed legislation adding a section to the Pennsylvania Public School Code, 24 P.S. § 20-2002-C(d), requiring Community Colleges and PASSHE institutions to: 1. Adopt and make public uniform standards for determining academic credit for prior learning 2. Agree to award academic credit for prior learning, which is determined to meet the established uniform standards and apply the credit toward graduation, unless prohibited by external accreditation or licensure." / "All participating members of the PA College Transfer System must award credit, and apply it toward graduation, for the approved minimum scores." / "the actual credit awarded and the applicability of the credit (i.e., major or elective) will vary between institutions"
  - Grade: **A**
  - Note: the Mathematics standards PDF cites "24 P.S. § 20-2004-C(d)" while the other subject PDFs cite § 20-2002-C(d). This is an inconsistency in PDE's own documents.
- **Claim:** PASSHE's own transfer procedure adopts these PDE minimums.
  - URL: https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/2022-54%20Student%20Transfer.pdf. Quote: "Minimum scores for credit by exam (including AP, IB, etc.) have been established through a consultative process led by PDE". Grade **A**
- **Minimum scores for the requested exams.** All come from PDE "Uniform Standards for Credit for Prior Learning" PDFs, each opened and read (Grade **A**). The recommended equivalency is PDE guidance, not a binding course mapping.

| Exam | Statewide min | PDE recommended equivalency (guidance) | Source PDF |
|---|---|---|---|
| AP English Language & Composition | 3 | "three credits of a first-year composition course" | [English & Public Speaking, June 21 2021](https://collegetransfer.pa.gov/Portals/6/PAFiles/PDF's/English%20and%20Public%20Speaking%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL%20as%20of%20June%202021.pdf) |
| AP English Literature & Composition | 3 | "three-credit 'introduction to literature'-type course" | same |
| AP Calculus AB | 3 | "applied calculus course" (institution decides) | [Mathematics, Mar 21 2022](https://collegetransfer.pa.gov/Portals/6/PAFiles/PDF's/Mathematics%20-%20Credit%20for%20Prior%20Learning%20Standards_Spring%202022.pdf) |
| AP Statistics | 3 | "appropriate introductory 3-credit statistics course" | same |
| AP Psychology | 3 | "general or introductory psychology course" | [Social & Behavioral Sciences, Mar 2022](https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Social%20and%20Behavioral%20Sciences%20-%20Credit%20for%20Prior%20Learning%20Standards_FINALspring2022.pdf) |
| AP US Government & Politics | 3 | "college level US Government and Politics course" | same |
| AP US History | 3 | institution decides ("colleges ought to be afforded flexibility to decide equivalences for scores of 3, 4, and 5") | [History, Oct 15 2020](https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/History%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf) |
| AP Biology | 3 | "equivalent and appropriate 3-credit biology course" | [Natural Sciences, Oct 15 2020](https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Natural%20Sciences%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf) |
| AP Art History | 3 | (not extracted) | [Humanities & Fine Arts, 9/30/2021](https://collegetransfer.pa.gov/Portals/6/pafiles/pdf's/Humanities%20and%20Fine%20Arts%20-%20Credit%20for%20Prior%20Learning%20Standards_FINAL.pdf) |
| CLEP College Composition / Modular | 50 | "three-credit first-semester composition course" | English PDF |
| CLEP College Algebra | 50 | "3-credit college algebra course" | Math PDF |
| CLEP Introductory Psychology | 50 | "general or introductory psychology course" | SBS PDF |
| CLEP American Government | 50 | "college level American government course" | SBS PDF |
| CLEP History of the United States I | 50 | institution decides | History PDF |
| CLEP Biology | 50 | (not extracted) | Natural Sciences PDF |
| **CLEP Humanities** | **no statewide standard** | The Humanities & Fine Arts PDF covers only AP, IB and DSST exams, and CLEP Humanities appears on no list I read | Humanities PDF |

  - The same documents say: "This document establishes the uniform standard minimum scores for which all PA Transfer System participating institutions will award academic credit".

### 3b. Penn State (University Park). Not bound by the statewide minimums.
- **Policy:** CLEP credit at "fiftieth percentile or higher"; AP credit "may be awarded … depending upon the grades earned".
  - URL: https://bulletins.psu.edu/undergraduate/general-information/academic-information/registration-academic-records/prior-learning-assessment/
  - Quote: "A student who has earned a score equivalent to the fiftieth percentile or higher for performance on the CLEP Examination may receive credit as indicated in the schedule of credits." Grade **A**
  - URL: https://www.psu.edu/admission/undergraduate/credit/clep-credits. Quote: "The list outlines the exact course credit you will receive at Penn State for results equivalent to the American Council on Education (ACE) recommended score or higher." / "the CLEP credit must be useful in a student's program of study." Grade **A**
- **AP chart** (automation, from https://www.psu.edu/admission/undergraduate/credit/ap-credit; Grade **A-, automation**):

| AP exam | 3 | 4 | 5 |
|---|---|---|---|
| English Language & Comp | "No credit is awarded" | "No credit is awarded. With a grade of four or five, a student is invited by the English Department to schedule English 030--Honors Freshman Composition." | same as 4 |
| English Literature & Comp | No credit | English 101 (3 cr) | English 101 (3 cr) |
| Calculus AB | No credit | Mathematics 140 (4 cr) | Mathematics 140 (4 cr) |
| Statistics | Statistics 100 (3 cr) | Statistics 200 (4 cr) | Statistics 200 (4 cr) |
| Psychology | No credit | "Three general credits of Psychology as a Gen Ed-Social Science" | Psychology 100 (3 cr) |
| US History | No credit | "3 general credits of History as a Gen Ed-Humanities and University Requirement – US Cultures" | same |
| US Gov & Politics | No credit | Political Science 1 (3 cr) | Political Science 1 (3 cr) |
| Biology | No credit | Biology 011 and Biology 012 (4 cr) | Biology 110 (4 cr) |
| Art History | Art History 100 (3 cr) | Art History 112 (3 cr) | Art History 112 (3 cr) |

  - Gen Ed designations (GWS/GQ/GS/GH/GN) were returned only where quoted above. The others were not captured.
- **CLEP chart** (automation, from https://www.psu.edu/admission/undergraduate/credit/clep-credits; Grade **A-, automation**). The page does not print a minimum score except where shown; the policy is ACE-recommended score, i.e. 50.
  - **College Composition: "No credit is awarded for this exam."**
  - **College Composition Modular: "No credit is awarded for this exam."**
  - College Algebra: "MATH 021--College Algebra I: 3 Credits"
  - Introductory Psychology: "3 general credits of Psychology as a Gen Ed-Social Science."
  - American Government: "(CLEP exam score 50-63): 3 general credits of Political Science. (CLEP exam score 64-80): 3 Political Science credits as a Gen Ed-Social Science and Gen Ed-US Cultures."
  - History of the United States I: "3 general credits of History as a Gen Ed-Humanities and Gen Ed-US Cultures."
  - Biology: "BIOL 11 - Introductory Biology I: 3 Credits"
  - Humanities: "HUM 100N - Foundations in the Humanities: Understanding the Human Experience (3 cr.)"
- **Tuition trap (relevant to transfer pricing):** "a student's tuition will increase when the Penn State transcript reflects 59.1 total credits. Credits earned from sources such as tests, like AP or IB exams, other colleges or universities, or military credit, are considered transfer credits and are included in the cumulative credit total." Source: https://www.psu.edu/admission/undergraduate/credit/ap-credit. Grade **A**. Exam credit can therefore push a student onto the higher upper-division rate (see §4).

### 3c. University of Pittsburgh (Pittsburgh campus). Not bound by the statewide minimums.
- **AP chart, Dietrich School with Gen Ed mapping.** Updated 6/2022, so it may be stale.
  - URL: https://www.asundergrad.pitt.edu/sites/default/files/assets/AP%20GEN%20ED%20CHART.pdf. Grade **A**. Cross-checked against the admissions chart at https://admissions.pitt.edu/first-year-student/ap-ib-credit/ (Grade **A**), which shows the same minimum scores.

| AP exam | Score | Pitt course / credits | Gen Ed fulfilled |
|---|---|---|---|
| English Language & Comp | 4 | ENGLIT 0000, 3 cr | Elective |
| English Language & Comp | 5 | ENGCMP 0200 + ENGLIT 0000, 6 cr | ENGCMP 0200 Seminar in Composition |
| English Literature & Comp | 4 | ENGLIT 0000, 3 cr | Elective |
| English Literature & Comp | 5 | ENGCMP 0200 + ENGLIT 0000, 6 cr | Seminar in Composition |
| Calculus AB | 4, 5 | MATH 0220, 4 cr | Algebra / Quantitative & Formal Reasoning |
| Statistics | 4, 5 | STAT 1000, 4 cr | Quantitative & Formal Reasoning |
| Psychology | 4, 5 | PSY 0010, 3 cr | Natural Science |
| US History | 4, 5 | HIST 0600 or 0601, 3 cr | Historical Analysis |
| US Gov & Politics | 4, 5 | PS 0200, 3 cr | Social Science |
| Biology | 4 | BIOSC 0150, 3 cr | Natural Science |
| Biology | 5 | BIOSC 0150 + 0160, 6 cr | Natural Science |
| Art History | 3, 4, 5 | HAA 0000, 3 cr | Elective |

  - A 3 earns **nothing** on any of these exams except Art History. The 2026-27 Dietrich catalog adds: "Students may be exempt from the composition requirement with a score of 5 on the AP English: Language and Composition or AP English: Literature and Composition exam." (https://catalog.upp.pitt.edu/content.php?catoid=241&navoid=27487, Grade **A**)
- **CLEP at Dietrich (unclear, needs_check):**
  - Older Pitt catalog (catoid=5, an earlier year that I could not confirm): "The Dietrich School does not accept CLEP general examination credits." URL: https://catalog.upp.pitt.edu/content.php?catoid=5&navoid=59. Grade **A for that edition only**.
  - The **2026-27** Dietrich page (https://catalog.upp.pitt.edu/content.php?catoid=241&navoid=27487) has **no mention of CLEP**. Grade **A** for the absence.
  - Pitt Provost regulation "Advanced Standing Credits" (effective Fall 2025): "The University may award credit toward a University of Pittsburgh degree or certificate for: … Standardized Tests - credit earned through standardized examinations such as the College Level Examination Program (CLEP) … and Advanced Placement Exams." URL: https://www.provost.pitt.edu/advanced-standing-credits. Grade **A**
  - Other Pitt schools found by search only: Swanson Engineering (2025-26) "does not accept CLEP credit for course credits"; SHRS "does NOT accept CLEP general examination credits". Grade **B (search snippet)**.
  - CGS says "Other Pitt schools and colleges may also accept CLEP credits, but **policies vary by school**." (https://www.cgs.pitt.edu/clep-exams, Grade **A**)
- **CLEP at Pitt College of General Studies (CGS)** (URL: https://www.cgs.pitt.edu/clep-exams; Grade **A**). All require a minimum of 50:
  - College Composition / Modular: 3 cr, ENGCMP 0200, Writing. Quote: "You may earn up to 3 CLEP credits for ENGCMP 0200 … The remaining 6 writing credits must be completed at Pitt."
  - Humanities: 3 cr, INTERDIS 0000, "Literature or The Arts"
  - College Algebra: 3 cr, MATH 0031, Algebra
  - Introductory Psychology: 3 cr, PSY 0010, Natural Science
  - American Government: 3 cr, PS 0200, Social Science
  - U.S. History I: 3 cr, HIST 0600, Social Science; History
  - Biology: 6 cr, BIOSC 0150 & 0160, Natural Science
  - Limits: "CLEP general exams must be taken before completing 60 college credits" and "The maximum combined total of CLEP and two-year college credits is 60."

### 3d. Temple University. Not bound by the statewide minimums.
- **AP chart** (URL: https://undergraduate.temple.edu/transfer-info/course-equivalency-tables/ap-equivalencies, "Last Updated: July 2026"; Grade **A**):

| AP exam | Min | Temple equivalent / credits | GenEd |
|---|---|---|---|
| English Language & Comp | 4 | ENG 0802 & English LL elective, 6 | GW |
| English Literature & Comp | 4 | English LL elective, 6 | (none) |
| Calculus AB | 3 | Math 1031, 4 | GQ |
| Calculus AB | 4 / 5 | MATH 1041, 4 | GQ |
| Statistics | 3 | Statistics 2101, 3 | GQ |
| Psychology | 3 | Psychology 1001, 3 | "GB removed effective Spring 2017" (no GenEd) |
| US History | 4 | History 1101 & 1102, 6 | GU |
| US Gov & Politics | 4 | Political Science 1101, 3 | GU |
| Biology | 3 | Biology 1001 & 1002, 8 | GS & GS |
| Biology | 4 | Biology 1011 & 1012, 8 | GS & GS |
| Art History | 4 | Art History 1155 & 1156, 6 | GA |

  - Quote: "Although the AP credits do not transfer as direct equivalents to Temple Gen Ed courses, Temple University will allow students to satisfy the designated Gen Ed area with the AP Credits."
- **CLEP chart** (URL: https://undergraduate.temple.edu/transfer-info/course-equivalency-tables/college-level-examination-program-clep, "Last Updated: (November 2015)", so it may be stale; Grade **A**). All require a minimum of 50:
  - American Government: Political Science 1101, 3 cr, GU
  - Biology: Biology 1011, 4 cr, GS
  - History of the United States I: History 1101, 3 cr, GU
  - Introductory Psychology: Psychology 1061, 3 cr, GB
  - **College Composition: NOT LISTED, so NOT ACCEPTED**
  - **College Algebra: NOT LISTED, so NOT ACCEPTED**
  - **Humanities: NOT LISTED, so NOT ACCEPTED**
  - Quote: "Temple will only award credit as indicated on the chart provided here. Exams that are not listed are not accepted for credit at Temple University, even if the student received credit for the exam at a previous institution." / "Credit for CLEP examinations posted on transcripts from other institutions will not be used to update a student's academic record at Temple." / "all literature, history, and political science CLEP exams require an additional Temple essay in order to receive credit" / "Students admitted with 60 or more credits in transfer will not be approved to use CLEP credits earned after matriculation to fulfill degree requirements."
  - The current Bulletin confirms the "not listed = not accepted" rule: https://bulletin.temple.edu/undergraduate/admissions-information/transfer-students/. Grade **A**

### 3e. PASSHE universities: IUP and West Chester (both bound by the statewide minimums)
- **IUP AP chart** (URL: https://www.iup.edu/orientation/placement-testing/equivalency-resources/advance-placement-equivalency-chart.html; Grade **A**; no date on the page). Every requested exam earns credit at 3:
  - English Language 3: ENGL 101 Composition 1 (3)
  - English Lit 3: ENGL 121 Humanities Literature (3)
  - Calculus AB 3: MATH 121 Calc for Nat Sci and Soc Sci or MATH 115 (3)
  - Statistics 3: MATH 117 Probability and Stats (3)
  - Psychology 3: PSYC 101 General Psychology (3)
  - US History 3 (non-history majors): HIST 196 (3); 5: 6 cr
  - US Gov & Politics 3: POLI 111 (3)
  - Biology 3: BIOL 104 Human Biology (4); 4 or 5: BIOL 201 & 202 (8)
  - Art History 3: ARHI 101 Intro to Art History (3)
  - The page does not show IUP's Liberal Studies (gen-ed) category mapping. **Not found.**
- **IUP CLEP chart** (URL: https://www.iup.edu/orientation/placement-testing/equivalency-resources/clep-exam-equivalency-chart.html; Grade **A**). All require 50:
  - College Composition / Modular: ENGL 101 (3)
  - College Algebra: MATH 105 (3)
  - Introductory Psychology: PSYC 101 (3)
  - American Government: PLSC 111 (3)
  - US History I: HIST 196 (3), or HIST 204 for history majors
  - Biology: BIOL 103 (4)
  - Humanities: ENGL 121 Humanities: Literature (3)
- **West Chester:**
  - CLEP policy (URL: https://www.wcupa.edu/registrar/testcredit.aspx; Grade **A**). Quote: "West Chester University accepts scores in the 50th percentile and above. For CLEP foreign language exams, a score in at least the 63rd percentile is required for the second level of the exam." / "West Chester University only accepts official scores that are sent directly from College Board. We cannot evaluate scores received in any other manner, including on another school's transcript."
  - AP minimum 3: College Board AP policy search snippet, "In order to receive credit, the student must score a minimum of 3." URL: https://apstudents.collegeboard.org/getting-credit-placement/search-policies/college/38. Grade **B**
  - **Per-exam WCU course equivalents and gen-ed categories: NOT FOUND.** WCU publishes them only in a JavaScript "External Course Equivalencies Tool" (search Institution = "AP" or "CLEP"), which I did not run.

---

## 4. Tuition per credit, in-state undergraduate

| Institution | Year | Per credit | Full-time | URL | Grade |
|---|---|---|---|---|---|
| PASSHE (systemwide base) | 2026-27 | **$347** (see note) | $4,169/semester; $8,338/year (12–18 credits) | https://www.passhe.edu/news/releases/2026-07-09_PASSHE-universities-pledge-to-cover-tuition-for-eligible-PA-students.html ; https://www.passhe.edu/students/cost.html | A (FT); per-credit A from CU (below) |
| Commonwealth University (PASSHE example) | 2026-27 | "Per credit tuition rate for PA Residents is $347" | $4,169/sem + fees ~$2,044–2,394/sem | https://www.commonwealthu.edu/cost-and-aid/tuition-cost | A |
| Penn State University Park | Fall 2026 | **$870** (lower division, freshman/sophomore). Upper division "All Other Programs" $938; Science/IST/EMS $1,033; Business, Engineering, Nursing $1,116 | Lower division $10,439/sem; $20,878/yr | https://tuition.psu.edu/rates-effective-2026-fall-semester | A |
| Pitt (Pittsburgh, Dietrich School) | 2026-27 | **$899** (part-time) | $10,797/term; $21,594/yr; mandatory fees $2,152/yr FT | https://www.tuition.pitt.edu/undergraduate/tuition/pittsburgh/dietrich-school-arts-and-sciences | A |
| Temple (College of Liberal Arts / base programs) | 2026-27 | **$849** (part-time, under 12 credits); $566 overload rate above 18 | $10,188/sem; $20,376/yr; plus University Services Fee $549/sem at 9+ credits | https://bursar.temple.edu/sites/bursar/files/Tuition_Rates.pdf | A |
| Community College of Philadelphia (Philadelphia resident) | Fall 2026 | **$174** tuition + $30 technology + $4 general = **$208** | n/a (per-credit) | https://www.ccp.edu/admission-aid/paying-college/tuition-fees | A |
| HACC (sponsored-district PA resident) | 2026-27 | **$189.75** tuition + $34.50 institutional + $12.75 technology = **$237.00** | n/a (per-credit) | https://www.hacc.edu/Admissions/TuitionandDueDates/index.cfm | A |

Notes:
- PASSHE sets only in-state undergraduate tuition systemwide. Quote: "The Board sets in-state undergraduate tuition rates. Each university sets graduate and out-of-state undergraduate tuition rates, along with student room, board and mandatory fees." The PASSHE release gives no per-credit figure. The $347 comes from Commonwealth University's page and matches $4,169 ÷ 12 ≈ $347.4. Other PASSHE universities also charge a mandatory "In-State Tech Fee $518 – $970" and "Mandatory Fees $2,058 – $4,118" per year (https://www.passhe.edu/students/cost.html, Grade A).
- The PASSHE 2026-27 rate carries a rollback promise: "committed to roll back the rate if the state provides sufficient funding". The rate could still fall. **needs_check before shipping.**
- Penn State charges by division. Once a student's transcript reaches **59.1 credits**, including transfer and exam credit, they pay the higher upper-division rate (see §3b).
- CCP for comparison: "Other Pennsylvanians $348 per credit hour", which equals the PASSHE per-credit rate. HACC non-sponsored PA resident pays $342.25 all-in.

---

## 5. Residency requirement and maximum transfer credits

| Institution | Residency (credits that must be earned there) | Max transfer / CC credits | URL | Grade |
|---|---|---|---|---|
| **PASSHE (system standard)** | "All first baccalaureate degree students will earn at least 30 of their last 60 credits from the State System university granting their degree; the university shall not require a student to take more than 30 credits." Also at least 50% of the major from "a State System university". | No separate community-college cap was found. With AA/AS P2P/parallel: "shall not be required to satisfactorily complete more than 60 credits". Without the degree, the effective maximum is 90 of 120 (inferred from 30-credit residency; **not stated explicitly**). | https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/PS%202016-24-A%20Graduation%20Residency%20Requirements.pdf (P/S 2016-24-A, revised Oct 16 2025, approved Nov 6 2025) | A |
| West Chester (PASSHE) | "Students completing their first baccalaureate degree at WCU must take at least 30 of their last 60 credits from WCU. Additionally, at least 50% of the credits required for the major must come from a Pennsylvania State System university." | Not separately stated | https://catalog.wcupa.edu/general-information/admissions-enrollment/undergraduate-admissions/ | A |
| IUP (PASSHE) | "At least 30 credits must be earned at IUP to receive an IUP degree. The final 30 credits must be earned in residence unless the requirement is waived by your college dean." (registrar how-to page; search snippet). The catalog snippet says "30 of their last 60 credits". | Not found | https://www.iup.edu/registrar/howto/pre-approval-for-coursework-at-another-college-or-university.html (A: "If the courses are being taken within the student's last 30 credits, the course must be taken at IUP unless the student's residence requirements for awarding degrees is waived by the college dean."); https://catalog.iup.edu/content.php?catoid=9&navoid=1170 (B, snippet, older catalog) | A/B. The IUP page language ("final 30") is stricter than the system standard ("30 of last 60"); the system standard says the university "shall not require a student to take more than 30 credits". |
| **Penn State** | Senate Policy 83-80.1: "Every candidate for a degree shall earn as a degree candidate at least 36 of the last 60 credits required for a baccalaureate degree … in courses offered by the University". 83-80.5: colleges may require up to 24 major credits at the location. Note: "Revisions to this policy were approved at the June 23, 2026 Senate Meeting. Pending implementation procedures." | No explicit community-college cap found. Effective maximum 84 of 120 (inferred from 36-credit residency; **not stated**). | https://senate.psu.edu/students/policies-and-rules-for-undergraduate-students/82-00-and-83-00-degree-requirements/ | A (the pending revision text was **not read**) |
| **Pitt (Provost, all schools)** | No university-wide "last N credits" rule found in the 2026-27 regulation. Dietrich: "students must earn at least half of the credits for their major(s), minor(s), and certificates(s) … while enrolled as a Dietrich School student." | "the maximum number of advanced standing credits applied toward completion of a degree may not exceed 75% of the credits needed for the degree" (= 90 of 120). Dietrich: "The Dietrich School will accept a maximum of 90 transferrable credits." | https://www.provost.pitt.edu/advanced-standing-credits (effective Fall 2025); https://catalog.upp.pitt.edu/content.php?catoid=241&navoid=27487 | A |
| Pitt (older rule, superseded?) | Older Dietrich catalog: "required to earn their last 30 credits while enrolled in the Dietrich School" | Older: "A maximum of 60 credits can be accepted from accredited community colleges and two-year junior colleges." | https://catalog.upp.pitt.edu/content.php?catoid=5&navoid=59 | A for that old edition. **Neither sentence appears in 2026-27.** Treat the 60-credit CC cap as no longer current, needs_check. |
| Pitt CGS | "Up to 75% of the credits required for the degree may be transferred"; "at least one-half of the major or 15 credits, whichever is greater, at the University of Pittsburgh" | CLEP + two-year credits combined maximum 60 (CGS CLEP page) | https://catalog.upp.pitt.edu/content.php?catoid=241&navoid=27486 ; https://www.cgs.pitt.edu/clep-exams | A |
| **Temple** | "students must complete a minimum of 30 credit hours at Temple … Transfer credits do not count towards academic residency." Latin honors need 60 credits in residence. | No explicit community-college cap found. Effective maximum 90 of 120 (inferred; **not stated**). | https://bulletin.temple.edu/undergraduate/admissions-information/transfer-students/ | A |

---

## 6. Statewide community-college fee waiver / free tuition

- **Conclusion:** I found **no statewide community-college fee waiver or free-tuition programme**. Nothing like California's College Promise Grant turned up. Pennsylvania's `Jurisdiction.fee_waiver` must remain **null**. Grade **B**: this is an absence, built from the programmes found below. I did not find a single official page that states "there is none".
- What exists, none of which is a fee waiver:
  - **Grow PA Scholarship Grant** (Act 89 of 2024 per a search snippet, B). Up to $5,000/year for PA residents at least half-time in an associate or bachelor's programme leading to an in-demand occupation, with a work-in-PA commitment and repayment if the commitment is not met.
    - URL: https://www.pheaa.org/funding-opportunities/grow-pa-scholarship-grant-program
    - Quote: "The Grow PA Grant Program provides grants (maximum award $5,000 per year) to students who meet the qualifying criteria." / "Sign a Master Promissory Note (MPN) agreeing to repay all funds received if the work requirement is not met". Awards are "first-come, first-served".
    - Grade **A**
  - **Grow PA Tuition Waiver.** For **out-of-state** students at PASSHE only: in-state tuition with a work commitment.
    - URL: https://www.pheaa.org/funding-opportunities/grow-pa-tuition-waiver
    - Quote: "The Grow PA Waiver Program provides in-state tuition to out-of-state students at PASSHE schools." Grade **A**
  - **PASSHE Pledge.** Last-dollar tuition coverage at PASSHE universities only, for in-state undergraduates who receive both a Pell Grant and a PA State Grant. It **begins fall 2027**, and details are not final.
    - URL: https://www.passhe.edu/news/releases/2026-07-09_PASSHE-universities-pledge-to-cover-tuition-for-eligible-PA-students.html
    - Quote: "a last-dollar scholarship initiative to cover remaining tuition costs for in-state undergraduate students who receive both a federal Pell Grant and a PA State Grant. The initiative begins in fall 2027." / "Fees, books, housing and meals are not included." / "Each university president will coordinate … to finalize the details". Grade **A**
  - **PA Promise.** **Proposed legislation only** (SB 299, 2025-26 session; earlier HB 1886 pilot). It would cover community college "regardless of the student's household income".
    - URL: https://www.senatorhughes.com/papromise/ (a legislator's advocacy page, so B for status).
    - I found no evidence it was enacted. Grade **B**
  - **Octavius Catto Scholarship** (local, City of Philadelphia, CCP only). Tuition-free last-dollar award plus a stipend for full-time Philadelphia residents with SAI ≤ $8,000.
    - URL: https://www.ccp.edu/admission-aid/paying-college/scholarships/octavius-catto-scholarship
    - Quote: "Catto Scholars attend the College tuition-free" / "Be a Philadelphia resident for at least 12 months" / "document a Student Aid Index (SAI) of $8,000 or less" / "The Catto Scholarship is paid for by the City of Philadelphia." Grade **A**
    - This is local and means-tested, so it must not be modelled as a statewide waiver.

---

## 7. Not found / open items

- The statute text of Article XX-C (palegis.us is JavaScript-only). Who exactly is mandated (state-related or not) conflicts between PDE pages. The P2P agreement and the "state-related" page say PSU, Pitt and Temple are only minimally bound.
- West Chester's per-exam AP and CLEP course equivalents and gen-ed categories (JavaScript tool, not run).
- IUP's AP/CLEP-to-Liberal-Studies category mapping (the charts give courses only).
- Penn State's Gen Ed attribute for several AP/CLEP awards, such as ENGL 101, MATH 140 and STAT 200 (automation did not capture GE suffixes). Penn State's list also does not print CLEP minimum scores. Policy says ACE score, i.e. 50.
- Whether Pitt's Dietrich School currently accepts CLEP. The 2026-27 catalog is silent; the earlier catalog said no.
- The Penn State Senate 83-80 revision approved June 23 2026 is "pending implementation"; its text was not read.
- Temple's CLEP chart says "Last Updated: (November 2015)". The policy is current per the Bulletin, but the chart itself is old.
- Pitt's AP chart PDF is "Updated 6/2022". The admissions page was consistent.
- PASSHE's 2026-27 tuition carries a rollback promise if the state budget funds it, so the rate may change.
- The year PASSHE integrated (2022) is **C, recalled**.
