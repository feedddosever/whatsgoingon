# Verification: national layer (data/us/exams.ts, data/us/alt-credit.ts)

All pages were read on **2026-10-01** with TinyFish `fetch_content`/`search`, unless a row says otherwise.
Verdicts: CONFIRMED / CORRECTED / PARTLY / UNVERIFIABLE. Nothing below is from memory. Where only a
search-result snippet was seen and the page itself was not opened, the row says "snippet only".

---

## 1. AP_FEE (exams.ts) — VERDICT: CONFIRMED (fee) + additions

**App claim** (`AP_FEE.note`, `cost_usd: 99`):
> "The standard school-ordered fee in the US, held at $99 for 2026-27. It excludes late and cancellation fees. Reductions exist for low-income students and many high schools pay outright"

**Sources**
- https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees (the app's own URL; page title "2027 AP Exam Fees")
  - "The cost per AP Exam will remain the same in 2026-27."
  - "AP Exam (including AP Seminar and AP Research) taken in the U.S., U.S. territories, Canada, and DoWEA schools* | **$99**"; outside the U.S. **$129**
  - "Late order fee … Exams ordered between November 14 and March 12 … **$40** per exam in addition to the exam fee"
  - "Unused/canceled exam fee … **$40** per exam … including an exam ordered for a student who qualifies for a College Board fee reduction."
  - "you may be eligible for a $37 College Board fee reduction per AP Exam."
  - "Your school may require you to pay a higher fee than listed in the table to cover proctoring and administration costs."
- https://apcentral.collegeboard.org/exam-administration-ordering-scores/ordering-fees/exam-fees
  - "School rebate | **$9 per exam**"; "College Board fee reduction for eligible students | **$37 per exam**"
  - "Late-testing fee | **$40 per exam** in addition to base exam fee as applicable … Most reasons for late testing don't incur an additional late-testing fee."
  - New for 2026-27: unused/canceled fee waived for AP Business with Personal Finance and AP Cybersecurity.
- https://counselors.collegeboard.org/media/pdf/mar-28790-quick-reference-guide-2026-2027-digital.pdf
  - "College Board provides a $37 fee reduction per exam for eligible students. Schools are expected to forgo their $9 rebate for these students, resulting in a cost of $53 per exam"

**Result:** $99 confirmed for 2026-27. Fee-reduced price is **$53** (CB $37 reduction + school forgoes $9 rebate); states may reduce further. Late order $40, unused/canceled $40, late-testing $40 (most reasons exempt). Schools may charge above $99. Safe to promote to `published`.

---

## 2. CLEP_FEE (exams.ts) — VERDICT: CONFIRMED ($97), source URL BROKEN, voucher wording CORRECTED

**App claim** (`CLEP_FEE`, `cost_usd: 97`, confidence already `published`):
> "$97 to College Board as of the 2025-26 cycle — it was $95 — plus a test-centre or remote-proctoring administration fee that is not included here. A Modern States voucher can take the College Board half to $0."

**Sources**
- App's `source_url` https://clep.collegeboard.org/clep-exam-policy → **HTTP 404 (page_not_found)**. Replace it.
- https://clep.collegeboard.org/register-for-an-exam — "Exams cost only $97 plus your test center or remote proctoring administration fee"
- https://clep.collegeboard.org/my-clep-professional-portal/voucher-ordering-program-overview — "The CLEP registration fee for the 2025-26 academic year is $97." / "The remote proctoring service fee is $30."
- Quick Reference Guide **2026-27** (URL above) — "CLEP exams: $97 | CLEP remote proctoring fee: $30 / Most test centers also charge an administration fee."
- https://clep.collegeboard.org/clep-benefits-for-everyone — "The U.S. government pays exam fees for active-duty military and eligible spouses and civil service employees."

**Result:** $97 confirmed and still current for 2026-27 (2026-27 Quick Reference Guide). Remote proctoring = **$30** (College Board figure). Test-centre fee is set by each centre; College Board publishes no figure. The "$95 before" claim was **not verified** (no source opened). On the voucher: a Modern States voucher also covers the $30 remote-proctoring fee, and Modern States **pays back** test-centre fees (see item 7f). "Takes the College Board half to $0" understates it. Also: DANTES pays CLEP for eligible military.

---

## 3. IB_FEE (exams.ts) — VERDICT: PARTLY (per-subject figure roughly right; registration-fee claim UNSUPPORTED and probably outdated)

**App claim** (`cost_usd: 128`):
> "Per-subject fee for the May 2026 session, around $124-$133 depending on the school's published scale. … A full diploma candidate also pays a one-off registration fee of roughly $172 on top of six subject fees"

**Official IBO fee schedule for the US:** UNVERIFIABLE. https://ibo.org/become-an-ib-school/fees-and-services/ says "Candidate and authorized schools can find fee information by logging into the Programme Resource Centre." The assessment-fees page (…/assessment-fees-and-services/) returned `bot_blocked` (a browser-automation retry was still queued when this report was written).

**IBO's own published structure (UK only, GBP)**: https://ibo.org/university-admission/governments-collaborate-with-the-ib/qualification-regulatory-information/ (updated 19 Feb 2026):
> "DP subject assessment and core fees | Candidate subject fee 76 | Extended essay 60 | Theory of knowledge 30 | Creativity Activity and Service 7"
This lists **no per-candidate registration fee**. Core fees (EE/TOK/CAS) appear in its place. This is the UK schedule, but the fee *structure* is IB-wide.

**US school-published figures:**
- App source https://huron.a2schools.org/ib/11th-and-12th-grade-dp-and-cp/dp-exam-fees-class-of-2026-and-beyond — "Beginning with the May 2026 exam session … **$130 per exam**" (flat; page says "Communication updated September 2026"). It does **not** show a "$124-$133" scale or any $172 registration fee.
- https://sfhs.forsyth.k12.ga.us/academics/advanced-studies/international-baccalaureate/assessments-in-ib — "For 2027 Testing, the International Baccalaureate (IB) charges **$135.00** for each exam." IB late fee "$45 … after November 1st, 2026"; "$165 late registration fee" after Jan 2027.
- https://fhs.hseschools.org/academics/ib — "There is a $140 fee per IB assessment" (includes school mark-up).
- Snippet only, not opened: Allen ISD "IB Exam fees - $132" (2026-27); FRHSD "Starting with May 2027 exams, fees are $126.50 per exam".
- Snippet only: a May 2019 school letter gave "Registration fee: $172 … Exam fee (per exam): $119". That looks like where **$172** comes from, and it is a 2019 figure.

**Result:** For May 2026, $128 is close but the app's own source says **$130**. For May 2027, one school quotes IB's charge as **$135**/exam. The **"$172 registration fee" should be removed.** It matches a 2019 school letter, and IBO's current published structure has subject + core fees and no registration fee. The US core-fee amounts are UNVERIFIABLE. Suggested value: $130 for 2026 or $135 for 2027, sourced to Huron or South Forsyth, and keep `needs_check` because the figures come from schools, not IBO.

---

## 4. DSST_FEE (exams.ts) — VERDICT: PARTLY ($100 confirmed; DANTES rule CORRECTED)

**App claim** (`cost_usd: 100`):
> "$100 to DSST, plus a test-centre administration fee that is commonly $25-$50 … **Free for eligible active-duty service members** at a DANTES-funded site, which waives both — first attempt only."

**Sources**
- https://getcollegecredit.com/about-dsst/ — "The cost for each DSST exam is $100. Administering institutions may charge a test administration fee according to their school policy." Also: "ACE CREDIT has evaluated and recommended college credit for all 30+ DSST exams."
- https://getcollegecredit.com/find-a-test-center/ — "The test fee is $100 per exam. This fee does not include any administrative costs the testing site may require." Remote/online registration exists ("To register for a remotely proctored DSST Exam"). The home page says "Remote Proctoring Now Available for Service members!" **No civilian remote-proctoring fee is published**, so that fee is UNVERIFIABLE.
- https://www.dantes.mil/dsst/ (DANTES, primary):
  - Eligibility: "All actively serving members of the U.S. Military Services, **including the National Guard, Reserve components, Coast Guard, and Coast Guard Reserve** members must have and maintain a valid … (CAC)". Also **U.S. Coast Guard spouses**.
  - Not funded: "Inactive Guard, Inactive Reserve … Military Retirees … Separated/Discharged Veterans … Spouses, Dependents … of active duty Army, Marine Corps, Navy, and Air Force".
  - "DANTES provides upfront funding of DSST test fees for the first attempt on all exam titles." / "Retests are not funded by DANTES … a three-month wait and self-payment".
  - Two centre types: "**Fully-Funded**: … DANTES funds the administration and test fees" vs "**Test Fee Only**: … DANTES funds the test fee. Service members are responsible for paying the administration fee."
- https://getcollegecredit.com/institutions/dantes-fully-funded/ — fully funded sites are "reimbursed $30 (or $35 if located outside of the U.S.)". Also: "The VA will reimburse the DSST exam fee ($100) and the testing center administrative fee" (Post-9/11 GI Bill, veterans).

**Corrections**
- "active-duty" is too narrow. Funding covers all *actively serving* members, including Guard, Reserve and Coast Guard, plus Coast Guard spouses. Veterans and retirees are **not** DANTES-funded, though veterans can be reimbursed through the VA GI Bill.
- "a DANTES-funded site, which waives both" is true only at **Fully-Funded** sites. At "Test Fee Only" sites the member pays the admin fee.
- Retest wait: DANTES says **three months** for a previously DANTES-funded retest. getcollegecredit says 30 days for all takers. The two sources disagree; prefer DANTES for military.
- "commonly $25-$50" centre fee: UNVERIFIABLE from a primary source. One centre (snippet only, simplexunited.com) charges $45, and DANTES pays fully funded sites $30.
- Out of scope, but noticed: the current DSST exam list on getcollegecredit.com has **"Environmental Science"** and no "Environment and Humanity". Row `dsst-environment-humanity` may use a retired title. The other 7 DSST titles in the app all appear on the current list.

---

## 5. ALEVEL_FEE (exams.ts) — VERDICT: CORRECTED ($125 looks like an AS-Level fee) / official figure UNVERIFIABLE

**App claim** (`cost_usd: 125`, source = UC A-levels page):
> "Entry fees are set by the exam series and collected by the school or the centre … the figure here is indicative only. UC grants credit at grade A, B or C, up to 12 quarter (8 semester) units per exam — and for GENERAL EDUCATION credit the exam must be a Cambridge International A Level taken in 2013 or later"

**Sources**
- https://help.cambridgeinternational.org/hc/en-gb/articles/203545141-How-much-does-it-cost-for-a-student-to-take-Cambridge-exams — "it is not our policy to provide learners with the fees that we charge schools. Please contact schools individually". So no candidate-facing official figure exists.
- https://www.cambridgeinternational.org/why-choose-us/join-cambridge/our-fees/ — "Cambridge International AS & A Level: we charge a fee for each exam entry."
- US school figure, https://ciecambridge.net/testing/ (Center for International Education, Miami-Dade, 2025-26 page): "Cambridge International AS (except Global Perspectives) – **$124.80** / Cambridge International A level - **$201.85** / Global Perspectives AS – $218.85". These are charged to students who miss an exam.
- Official Cambridge "Fees list: USA" PDFs exist on Florida school-board BoardDocs (Lee 2022-23; Palm Beach "October 2025 to September 2026"). Both returned `target_unreachable`, and a browser run timed out. **Not read.**
- The app's source (UC A-levels page, https://admission.universityofcalifornia.edu/admission-requirements/ap-exam-credits/a-levels.html) has **no fee** in it. It confirms "grade of A, B, or C" and "up to 12 quarter (8 semester) units", but it speaks of "GCE and Singapore-Cambridge Advanced Level exams" and **does not mention the 2013-or-later GE rule**. That rule appears at campus level, e.g. UCSB catalogue (snippet only): "General Education Credit – Only for Cambridge International exams taken 2013 or later."

**Result:** $125 matches the **AS** Level figure ($124.80). The rows are full **A Level** exams, and the only US figure found for those is **$201.85**. The price should go to ~$202, or the rows should say plainly that no candidate price is published. Change the source to a fee source and cite the 2013 rule to UCSB or the Cal-GETC standards rather than the UC A-levels page.

---

## 6. DLPT_FEE (exams.ts) — VERDICT: PARTLY (restriction confirmed; eligibility CORRECTED; source URL is an empty template)

**App claim** (`cost_usd: 0`, `availability: 'restricted'`):
> "Administered by the Defense Language Institute Foreign Language Center to service members and government-sponsored personnel. There is no fee to the candidate and no route for a civilian to register … if you hold a rating, it is worth real credit"

**Sources**
- App URL https://www.acenet.edu/National-Guide/Pages/Course.aspx?org=Defense+Language+Institute renders an **empty course template** (no data). A working example: https://www.acenet.edu/National-Guide/Pages/Course.aspx?org=Defense+Language+Institute&cid=f683306f-92c4-ea11-a812-000d3a33232a — "DLPT Generations III, IV, 5 Reading: Proficiency Level Rating: 2 … ACE ID: DLI-0282 … ACE Credit Recommendation Period: 10/1/2024 - 9/30/2034 … Lower-Division Baccalaureate 4 Foreign Language".
- https://www.dliflc.edu/first-time-college-credit-for-military-foreign-language-exam/ (2018) — "The Institute does not provide open enrollment to the public." / "Those in the military service are eligible to take the DLPT, even if they have not attended DLI, but they must go through their chain of command to obtain permission".
- DLIFLC fact sheet (hosted by Fort Hood): https://home.army.mil/hood/2517/6546/2326/DLPT_DLI_GUIDE-ACE_Credit.pdf — "DLPT/OPI ACE credit recommendation program is intended for US military personnel who require a language to perform their military duties. **Civilians, faculty, contractors, and staff are not eligible to receive ACE credit recommendations for their DLPT performance**". Also: "Credit recommendations are only available for some languages … DLPT III, DLPT IV format after 1 October 1990 or DLPT5 after 1 July 2005."
- https://www.dliflc.edu/administration/registrar/transcripts-records/ — ACE credit requested via "FORM 420 DLPT/OPI ACE Credit Recommendation Request".

**Result:** "No public route" is confirmed. **Correction:** "if you hold a rating, it is worth real credit" holds only for **US military personnel**. Government civilians, contractors and DLI faculty who sit the DLPT get **no** ACE credit recommendation. "No fee to the candidate" is UNVERIFIABLE: no page states a fee or the absence of one. That is plausible but unread. Replace the source URL with a specific `cid` URL or the DLIFLC page.

---

## 7. alt-credit.ts

The rows' shared source (`DEGREEFORUM`, degreeforum.miraheze.org) is a community wiki and was not used. Each provider's own page was used instead. Recommendation: change each row's `source_url` to the provider URL below.

### 7a. alt-sophia — VERDICT: CONFIRMED (price/ACE) + one omission
**App:** `cost_usd: 99`, `recognition: 'ace'`; "$99/month with no cap on how many courses you finish in that month, and no proctoring fee".
- https://www.sophia.org/plans-and-pricing/ — "With plans starting at just $99 a month"; "Sophia has 115+ partner schools that have agreed to accept transfer credits". The free trial has no time limit, "up to the first course Challenge".
- Snippets only (sophia.org): "take as many courses as you want, **up to two at a time**, for a $99 monthly membership"; "Sophia's ACE® and DEAC-recommended courses".
- https://www.sophia.org/blog/higher-education/ — "Sophia Learning has no proctored exams. All assessments are open book"; "Sophia's courses have been accepted for credit … thanks to our ACE recommendation. Yet Sophia's courses are not accredited."
- **Add:** a limit of two courses enrolled at a time, and DEAC recommendation alongside ACE. Multi-month plans appear only on partner subdomains (snippet: "$299 For four months … $799 Per year"); not verified for sophia.org.

### 7b. alt-studycom — VERDICT: CONFIRMED (one sub-claim unverified)
**App:** `cost_usd: 95`, `recognition: 'ace_and_nccrs'`; "The only row here carrying BOTH ACE and NCCRS … Final exams are open-book, unproctored and graded immediately."
- https://study.com/college/faq.html — "Our College Saver plan costs $95.00 per month, and users can pause their account at anytime." / "College Saver Pro plan costs $235.00 per month" / "up to 2 courses at a time with College Saver" / "Study.com offers over 225 courses recommended for college credit by ACE and NCCRS" / "final exam (always open-book and non-proctored)" / pass mark "at least 210 points (70%)".
- "graded immediately": UNVERIFIABLE (not stated). "The only row … BOTH" becomes true only after the Saylor fix in 7d. Today the data contradicts it.

### 7c. alt-straighterline — VERDICT: PARTLY
**App:** `cost_usd: 178`; "a monthly fee AND a per-course fee (about $99 + $79), so the arithmetic only works if you are taking few courses slowly. Some finals are proctored. Larger partner-school network than the others."
- https://www.straighterline.com/how-it-works/how-much-does-it-cost/ — "$99/month + cost of course … Add as many courses as you need for just $79* each" / "*One-time fee. Courses typically cost $79, with prices ranging from **$69 to $249**." / "180+ partner schools".
- https://www.straighterline.com/pricing/ — **Semester Plan $699 / 4 months** and **Annual Plan $1,499 / year**, "Complete access to 27 of our most popular courses", "No per-course fees", "Currently available only to new students". ACE: "StraighterLine courses are recommended by the American Council on Education (ACE)".
- https://www.straighterline.com/blog/want-to-cheat-on-a-straighterline-exam-forget-about-it — "StraighterLine no longer uses live proctoring for final exams … Respondus LockDown Browser." Snippet only (help centre): "Starting in early February 2026, all quantitative final exams … will require Honorlock."
- **Corrections:** $99 + $79 = $178 is confirmed as typical, but course fees range from $69 to $249. The "arithmetic only works if … few courses" line ignores the flat $699 and $1,499 plans. "Some finals are proctored" should become "no live proctoring; LockDown Browser, and Honorlock on quantitative finals". "Larger network" is PARTLY: StraighterLine lists 180+ partners and Sophia 115+; Study.com's partner count was not found.

### 7d. alt-saylor — VERDICT: CORRECTED (recognition)
**App:** `cost_usd: 5`, `recognition: 'ace_and_nccrs'`; "the proctored final costs about $5".
- https://www.saylor.org/Credit — "The only cost associated with earning ACE Recommended Credit is a $5 USD proctoring fee per exam attempt" / "You may take each proctored ACE Recommended Credit Final Exam up to 3 times total." Proctoring is by SmarterProctoring.
- https://www.saylor.org/TuitionFees — "$5 USD proctoring fee per exam attempt".
- https://www.nationalccrs.org/organizations/saylor-academy — "The Saylor Academy, was an NCCRS member from November 2012 to **December 2023**." Member Status: "**Former Member**".
- **Correction:** `recognition` should be **`'ace'`**. NCCRS no longer applies to Saylor. $5 is confirmed and is charged per attempt, up to 3 attempts. Saylor now calls itself "Saylor University".

### 7e. alt-teex — VERDICT: PARTLY
**App:** `cost_usd: 0`, `recognition: 'ace'`; "roughly 10 to 13 credits at no cost … unproctored, and DHS/FEMA-funded".
- https://teex.org/program/nerrtc-online-training/ — "The course is funded through the DHS/FEMA Homeland Security National Training Program and is offered at no cost." Snippet: "Tracks are certified by the American Council on Education".
- https://teex.org/resources/earn-college-credit/ — "TEEX has had over 100 of its courses reviewed by the American Council on Education (ACE)." ACE transcripts go through Credly.
- Confirmed: free DHS/FEMA-funded online courses, ACE-reviewed. UNVERIFIABLE: the "10 to 13 credits" total, "unproctored", and open-to-all eligibility. Not checked: whether a FEMA SID or citizenship is required. Note that ACE review covers TEEX courses generally (>100, many of them paid or in person), not only the free ones.

### 7f. alt-modern-states — VERDICT: CORRECTED (under-sells the voucher; `recognition` field questionable)
**App:** `cost_usd: 0`, `recognition: 'ace'`; "a free preparation course and a voucher covering the CLEP exam fee".
- https://modernstates.org/faq/ — "Any learner who takes and completes a Modern States course is eligible for a voucher … that covers the cost of the associated CLEP exam." Eligibility: "Anyone 13 and older"; "pass quizzes in a course with an average of 75%, and score at least 75% on the final exam" (retries allowed). Vouchers are "valid for one-time use … only by the learner who earned the voucher and for the exam for which it was issued." On centre fees, the FAQ says "some test centers may charge an additional administration fee that students must pay separately."
- https://helpdesk.modernstates.org/support/solutions/articles/151000218566-clep-test-center-reimbursement-policy (modified Aug 19) — "Modern States is happy to reimburse eligible CLEP test center fees for learners who have completed one of our courses, received a Modern States CLEP voucher code, and used that voucher code to register". Conditions: receipt + score report + voucher number; "Requests must be submitted within one (1) year of your exam date"; paid by cheque in USD; "approximately 8-10 weeks". Exam fees paid before getting the voucher are **not** reimbursed.
- https://helpdesk.modernstates.org/support/solutions/articles/151000202555-clep-remote-proctoring-technical-requirements-guide — "your Modern States voucher covers the costs of remote proctoring".
- **Result:** The voucher covers the **$97 exam fee and the $30 remote-proctoring fee**. The **test-centre fee is paid upfront and then reimbursed** by Modern States, if claimed with receipts within one year. Realistic out-of-pocket is $0 after reimbursement. The FAQ's "pay separately" means "pay up front". Modern States' own courses are not shown anywhere as ACE-reviewed. The credit is CLEP's, and CLEP's ACE status was not verified this session. `recognition: 'ace'` is UNVERIFIABLE as stated; consider a CLEP-specific value.

---

## Summary of corrections

1. **CLEP_FEE source_url** `clep.collegeboard.org/clep-exam-policy` returns 404 → use `https://clep.collegeboard.org/register-for-an-exam`. Remote proctoring is $30. The Modern States voucher covers exam + remote proctoring, and centre fees are reimbursed.
2. **IB_FEE**: drop the "~$172 registration fee" (a 2019 figure; IBO's current structure has subject + core fees). The app's own source says **$130** flat for May 2026, not "$124-$133". One school quotes **$135** for May 2027.
3. **DSST_FEE**: DANTES funds all *actively serving* members (Guard/Reserve/CG) + CG spouses, not only "active-duty". Both fees are waived only at **Fully-Funded** sites; at Test-Fee-Only sites the member pays the admin fee. DANTES retest wait is three months. The "$25-$50" centre fee is unverified. `dsst-environment-humanity` may be a retired title (current list: "Environmental Science").
4. **ALEVEL_FEE**: $125 matches the **AS** fee ($124.80). A full A Level is **$201.85** at the only US school found. The cited UC page carries no fee and no 2013 rule.
5. **DLPT_FEE**: civilians, contractors and faculty get **no** ACE credit for the DLPT; only US military do. The source URL renders an empty template. "No fee" is unverified.
6. **alt-saylor**: `recognition` must be `'ace'`, not `'ace_and_nccrs'`. NCCRS membership ended December 2023.
7. **alt-straighterline**: course fee $69–$249 (typically $79). Flat $699 (4-month) and $1,499 (annual) plans exist. No live proctoring (LockDown Browser; Honorlock for quantitative finals).
8. **alt-sophia**: add the two-courses-at-a-time limit; also DEAC-recommended.
9. **alt-modern-states**: the voucher also covers remote proctoring, and centre fees are reimbursable. The `recognition: 'ace'` basis is unverified.
10. **alt-studycom**: confirmed ($95, ACE+NCCRS, open-book unproctored final). "Graded immediately" is unverified.
11. **alt-teex**: free and ACE confirmed. "10-13 credits" and "unproctored" are unverified.
12. **AP_FEE**: confirmed $99. Add: fee-reduced cost $53, and $40 late-order, unused and late-testing fees.
