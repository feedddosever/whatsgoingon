# MASTER LIST — cheapest route to a US bachelor's degree

Everything from five passes, consolidated for `github.com/feedddosever/whatsgoingon`.

| Pass | What it was | Date |
|---|---|---|
| 1 | California deep-dive (prices, aid, exam credit, pathways) | 2026-09-18 |
| 2 | 51-jurisdiction first pass against the repo's schema | 2026-09-19 |
| 3 | Research run — verification of ~30 jurisdictions | 2026-09-20 |
| 4 | Curation + alternative-credit layer | 2026-09-20 |
| 5 | Research run — the 19 unverified states + provider partner lists | 2026-09-20 |

This file supersedes all earlier ones where they conflict. A machine-readable copy of §§ 3–8 is in `master-list.json`.

## 0. Grades

| Grade | Meaning |
|---|---|
| **A** | Governing document opened and cross-checked in this conversation |
| **A−** | A research run reports reading the governing document; not cross-checked. Two claims of this kind have already turned out wrong (§ 1), so treat as strong leads |
| **B** | Official explainer or one institution's catalogue |
| **C** | Recalled only — marked "(recalled)" inline |

Under the repo's `VERIFICATION.md`, every row is still `needs_check` until a person opens the source. Grades say how far each row is from promotion.

**Row grades:** A: 22, A price · C rest: 2, A−: 16, A− (SUNY) · B (CUNY): 1, A− statute · C rest: 1, A−/B: 4, B: 5.

---

## 1. Corrections ledger — what changed across the passes

| # | Was | Now | Source |
|---|---|---|---|
| 1 | Florida exam rows: any award clears a core area | 19 stand, 1 conditional, **11 earn credit but not the core**; two course rows also off the core (§ 10) | ACC Credit-by-Exam Equivalencies, eff. August 2026 |
| 2 | Florida table = 2024 edition | **August 2026 edition**; 45-credit guaranteed cap; FACT exams added | fldoe.org `0078391-acc-cbe.pdf` |
| 3 | Georgia "Areas A–F" | **Core IMPACTS**, 42 + 18 | BoR Policy 3.3.1 |
| 4 | West Virginia AP rule = Series 15 | Series 15 repealed → **133 CSR 59** | wvhepc.edu |
| 5 | Utah Code 53B-16; "53H is K-12" (pass 3) | **Title 53H is Higher Education** — §§ 53H-3-604, -702, -703 | le.utah.gov correlation table; R472 |
| 6 | Nevada CC $92 (pass 3) / $133.50 (pass 2) | **$136.25** lower-division, 2026-27; universities **$312.75** | TMCC catalogue; BOR-5b |
| 7 | DCTAG $10,000 / $50,000 | **$15,000 / $75,000 from 2026-27** | OSSE, 2026-02-26 |
| 8 | Middle Class Scholarship ceiling $226,600 (pass 1) | **$250,000 income and $250,000 assets** for 2026-27 (independent single $144,000; assets $119,000) | CSU Chico and UCSB aid pages quoting CSAC |
| 9 | Wisconsin UCTA "≥ 30 credits" | **≥ 72 credits** — statute revised 2019-11-21, in force from 2022-23 (pass 5 said "2021 Act 46"; UW dates it 2019) | Wis. Stat. § 36.31(2m)(b); UCTA Fall 2024 |
| 10 | Arkansas § 6-61-218, 35-hour core | Act 566 of 2025 creates a **15-hour Requisite Core** inside the 35; redesign by Fall 2026, in force Fall 2027; operative statute § 6-61-231 | adhe.edu; AHECB State Minimum Core policy |
| 11 | Alabama STARS; 41 hours; ≈ $127 | **Alabama Transfers**; 41–42; **$184** all-in (2025-26, one college) | alabamatransfers.com; cacc.edu |
| 12 | SUNY GE = Res. 2021-48 | amended by **Res. 2024-64** for students entering from Fall 2026 | system.suny.edu |
| 13 | South Carolina "86 transferable courses" | CHE audit: only **31** code as direct equivalents; new agreement in negotiation | che.sc.gov |
| 14 | South Dakota unnumbered GE policy | **SDBOR Policy 2.3.7** | sdbor.edu |
| 15 | Michigan exam exclusion "needs check" | confirmed: **AP in; CLEP, IB, DSST out** | MACRAO Guidelines |
| 16 | North Carolina exam credit in the CAA unknown | **AP 3+ counts within a completed AA/AS** | CAA |
| 17 | Maine Free College — 2026 graduates unknown | **covered; tuition only** | MCCS / FAME |
| 18 | Arizona single AGEC unknown | **Reimagined AGEC** from 2026-27 | AZTransfer, Maricopa |
| 19 | New Hampshire merger unknown | **no merger** | USNH / CCSNH (secondary) |
| 20 | Oregon "30 credits" | **30 quarter credits** = 20 semester | HECC |
| 21 | Saylor partners = Charter Oak, Granite State… (dated page) | current list is different — § 9 | saylor.org partner pages |
| 22 | Study.com partnerships URL | 404 — live directory is `study.com/college/school/index.html` | pass 5 |
| 23 | Idaho "effective catalogue year 2026-27"; NC "$1,323.25 system figure" (pass 3) | withdrawn — unsupported / one college's fees | — |

---

## 2. What the codebase needs before more data goes in

1. **`unit_system: 'semester' | 'quarter'` on `Institution`**, not only on the framework (load from IPEDS). Quarter = semester × 1.5.
2. **Score-tiered exam rules** and a third outcome, **credit-but-not-core** (Florida).
3. **`max_exam_credits_guaranteed`** per jurisdiction (Florida 45; CSU CLEP 30; Utah ≤ 10 per CLEP test).
4. **Exam exclusions from a block** as a refusal the engine enforces: Cal-GETC (CLEP), Michigan MTA (CLEP, IB, DSST), North Carolina (non-AP if the degree is incomplete).
5. **`ExamPolicyKind`**: `statewide_table | statutory_floor | system_policy | campus`.
6. **`PricingModel`**: `per_credit | per_credit_capped | tiered | flat_full_time | per_contact_hour` + `ResidencyTier`.
7. **`AidKind`**: only `need_waiver` and `universal_promise` may be auto-subtracted; promise programmes with age, graduation-year, field or service gates must be shown, not applied.
8. **Structured guarantee conditions**: `min_gpa`, per-course floor, `min_credits_at_sender`, `degree_required`, `covers_private`, `destination_gpa` (Virginia, Vermont, Arizona).
9. **`ThirdPartyStance`**: `published_refusal | agreement_only | official_partner | system_policy_permits | evaluate_on_request_by_law | no_record`, with caps and provider list.
10. **ASU Universal Learner Courses** modelled as an institutional course source, not `alt_provider`.
11. IB, Cambridge/AICE, DSST, DLPT as exam families (Florida, Colorado, Utah, Pennsylvania and Washington have sources).
12. `exams.ts`: CLEP fee is $97 (2025-26), not $95.

---

## 3. Transfer frameworks — all 51

| St | Tier | Framework | Authority | Credits | Units | Grade |
|---|---|---|---|---|---|---|
| AL | 2 | AGSC General Studies Curriculum (Areas I–V), delivered through Alabama Transfers (formerly STARS; renamed Nov 2022) | Act 94-202; Code of Ala. § 16-5-8(e) | 41–42 sem in Areas I–IV (I Written Composition 6 · II Humanities & Fine Arts 12 · III Natural Sciences & Math 11 · IV History/Social/Behavioral 12); Area V pre-major 19–23 | semester | A− |
| AK | 3→2 | UA common general-education core (one public system) | UA Regents' Policy & University Regulation ch. 10.04 | ≥ 34 sem | semester | A− |
| AZ | 2 | AGEC → Reimagined AGEC (AGEC-R) for 2026-27 catalogues; Classic AGEC for continuing students | ABOR Policy 2-210; A.R.S. § 15-1824 (recalled) | ≈ 35 sem | semester | B |
| AR | 2 | State Minimum General Education Core = 15-hour Requisite Core (Act 566 of 2025) + 20 breadth hours, inside a 60-hour state minimum core curriculum. Redesign due Fall 2026, full implementation Fall 2027 | Ark. Code § 6-61-231 (Act 182 of 2009; Act 747 of 2011); Act 566 of 2025; AHECB State Minimum Core policy. § 6-61-218 reported repealed by Act 566 | 35 sem within 60 | semester | A |
| CA | 1 | Cal-GETC v1.4 | AB 928; ICAS Cal-GETC Standards | 34 sem | semester framework; quarter campuses exist | A |
| CO | 2 | gtPathways (GT Pathways) | CCHE Policy I-L; C.R.S. 23-1-108(7), 23-1-108.5, 23-1-125 | 31 sem (GT-CO, GT-MA1, GT-AH/HI/SS, GT-SC codes) | semester | A |
| CT | 3→2 | Framework30 (Section A 24 + Section B 6) and Transfer Tickets | CSCU Transfer & Articulation Policy (2012); BR 24-077 / Policy 1.26 | 30 sem (+ 6 optional) | semester | A− |
| DE | 3 | none — Delaware Tech Connected Degrees (pairwise) | no statewide instrument | — | semester | B |
| DC | 3 | none — one public university (UDC) | — | — | semester | A |
| FL | 1 | General-education core (5 areas) inside a 36-hour GE programme; AA transfer guarantee | Fla. Stat. §§ 1007.23, 1007.24, 1007.25, 1007.27; Rule 6A-10.024; BOG Reg. 6.006, 8.005 | 15 core / 36 GE sem | semester | A |
| GA | 2 | Core IMPACTS (USG); separate USG–TCSG guaranteed course list | BoR Policy 3.3.1; Handbook § 2.4.1 (rev. 2023-10-04; full Fall 2024) | 42 + 18 Field of Study, sem | semester | A |
| HI | 3→2 | UH system general-education core (Foundations + Diversification) | UH Executive Policy EP 5.209 | ≈ 31 sem | semester | A− |
| ID | 3→2 | GEM — six Ways of Knowing | SBOE Governing Policies III.N, III.V | 36 sem | semester | B |
| IL | 2 | IAI General Education Core Curriculum (GECC) | 110 ILCS 152 (P.A. 103-469, eff. 2024-01-01) | 37–41 sem / 12–13 courses | semester; quarter privates participate | A |
| IN | 2 | Indiana College Core | IC 21-42-3; IC 21-42-5 (Core Transfer Library); SEA 204-2026 | 30 sem; six competency areas, ≥ 3 each | semester | A |
| IA | 3 | none statutory — statewide AA/AS Articulation Agreements | Iowa Code § 260C.14(23), § 262.9(32); IAC 281—ch. 21 | ≈ 40 GE within 60–64 sem | semester | A− |
| KS | 3→2 | Systemwide General Education (seven buckets) | KBOR Policy ch. III.A.18 (Fall 2024) | 34–35 sem | semester | A− |
| KY | 2 | General Education Transfer Policy (category / core / full certification) | CPE policy; KRS 164.2951 (HB 160, 2010) | 33 sem | semester | A |
| LA | 2 | Board of Regents GE + Louisiana Transfer Degree (AALT/ASLT) + Universal Transfer Pathways | R.S. 17:3161–3169 (Act 356 of 2009); Act 308 of 2022; BoR Academic Affairs Policies 2.16, 2.25 | 39 GE / 60 sem (English 6 · Math 6 · Natural Sci 9 · Humanities 9 · Fine Arts 3 · Social/Behavioral 6) | semester; Louisiana Tech quarter calendar (unconfirmed) | A− |
| ME | 3→2 | MCCS–UMS Block Transfer of General Education | inter-system agreement (effective Fall 2015) | 34 (UMaine) vs up to 35 (MCCS) sem | semester | B |
| MD | 3→2 | General-education programme and transfer regulations | COMAR 13B.06.01, 13B.06.02; Transfer with Success Act (2021) | 28–36 sem | semester | A− |
| MA | 2 | MassTransfer Gen Ed Foundation | BHE MassTransfer policy | 34 sem (STEM 28) | semester | A−/B |
| MI | 2 | Michigan Transfer Agreement (MTA) | MACRAO MTA Guidelines (Fall 2019, ed. Feb 2020); 2012 appropriations boilerplate | 30 sem | semester; some colleges bill per contact hour | A |
| MN | 2 | Minnesota Transfer Curriculum (MnTC), 10 goal areas | Minnesota State Board Policy 3.21 / Procedure 3.21.1 | 40 sem | semester | A |
| MS | 2 | IHL 30-hour core + IHL–MCCB Articulation Agreement (MATT) | IHL Board Policies 512, 521 | 30 sem (English comp 6 · algebra+ 3 · natural sci 6 · humanities & fine arts 9 · social/behavioral 6) | semester | A− |
| MO | 2 | CORE 42 | RSMo §§ 178.785–178.789; 6 CSR 10-3.020 | 42 sem (Soc/Behavioral 9 · Written 6 · Oral 3 · Natural Sci 7 · Math 3 · Humanities & Fine Arts 9 · electives 5) | semester | A |
| MT | 3→2 | MUS Transferable Core | BoR Policy 301.10; 301.5.3; 301.5.5 (common numbering) | 30 sem (natural sci 6 · social sci/history 6 · math 3 · communication 6 · humanities/fine arts 6 · cultural diversity 3) | semester | A− |
| NE | 3 | none statutory — Nebraska Transfer Initiative | signed inter-institutional agreement | — | semester; Metropolitan CC (Omaha) on quarters | A price · C rest |
| NV | 3→2 | NSHE transfer rules — AA/AS/AB satisfies lower-division GE | NSHE Board of Regents Handbook Title 4 ch. 14 (recalled) | AA/AS block | semester | A price · C rest |
| NH | 3 | none — NH Transfer + dual admission; no CCSNH–USNH merger | — | — | semester | B |
| NJ | 3→2 | Comprehensive State-Wide Transfer Agreement (Lampitt Law) | N.J.S.A. 18A:62-46 et seq. | 60–64 sem block (AA 45 / AS 30 GE, recalled) | semester | A− statute · C rest |
| NM | 3→2 | New Mexico General Education Curriculum | NMSA 1978 ch. 21; NMAC 5.55.6 (GE), 5.55.5 (common numbering), 5.55.7 (transfer modules) | 31 sem = 22 fixed + 9 flexible (AAS 15) | semester | A− |
| NY | 2 | SUNY General Education Framework + Transfer Paths; CUNY Pathways Common Core | SUNY BoT Res. 2021-48, amended by Res. 2024-64 (new students from Fall 2026); CUNY BoT (2011) | SUNY 30 sem in ≥ 7 of 10 areas (4 mandatory); CUNY 12 required + 18 flexible + 6–12 college option | semester | A− (SUNY) · B (CUNY) |
| NC | 2 | Comprehensive Articulation Agreement — UGETC | S.L. 2013-72; CAA (2014 rev.); Transfer Course List 2026.1 | UGETC ≥ 30 within a 60–61 sem AA/AS | semester | A |
| ND | 3→2 | GERTA — General Education Requirements Transfer Agreement | SBHE Policy 403.7; Procedure 403.7.1 | ≥ 36 sem (ND: category codes) | semester | A− |
| OH | 2 | Ohio Transfer 36 | ORC § 3333.16 ff.; Ohio Articulation & Transfer Policy (July 2025) | 36–40 sem | semester | A |
| OK | 3→2 | State Regents GE minimum + AA/AS transfer guarantee | OSRHE Academic Affairs Policy ch. 3 (rev. 2025-09-04), §§ 3.11, 3.15; 70 O.S. § 3206.1 | 37 sem minimum | semester | A− |
| OR | 2 | Core Transfer Map / Oregon Transfer Module / AAOT / Major Transfer Maps | SB 233 (2021); ORS 350.423–.429; HB 2998 (2017); OAR 715-025 | 30 / 45 / 90 QUARTER credits | QUARTER — all community colleges and public universities | A |
| PA | 3→2 | 30-Credit Transfer Framework + programme-to-programme degrees | Act 114 of 2006; Act 50 of 2009; 24 P.S. § 20-2002-C(d) | 30 sem | semester | A |
| RI | 3 | Joint Admissions Agreement (three institutions) | RIOPC policy S-12 | ≥ 32 GE credits apply | semester | A−/B |
| SC | 3→2 | CHE Statewide Articulation Agreement — 'list of 86' courses + Transfer Blocks | CHE Transfer Policy (May 2022); Proviso 117.152 | course list + blocks; AA/AS = ≥ 60 hrs and junior status | semester | A−/B |
| SD | 3→2 | System General Education Requirements (six goals) | SDBOR Policy 2.3.7; Guideline 2.3.7.A (since Fall 2017) | 30 sem (written 6 · oral 3 · social sci 6 · arts & humanities 6 · math 3 · natural sci 6) | semester | A− |
| TN | 2 | 41-hour general-education core + Tennessee Transfer Pathways | T.C.A. § 49-7-202 (Complete College Tennessee Act, 2010) | 41 core / 60 pathway sem | semester | A−/B |
| TX | 1 | Texas Core Curriculum | TEC §§ 61.821–61.823; 19 TAC ch. 4 subch. B | 42 SCH | semester | A |
| UT | 3→2 | USHE General Education | Board Policy R470; Utah Code Title 53H — § 53H-3-604 (common numbering), § 53H-3-702 (prior learning); formerly 53B-16 | 30–39 sem (recalled) | semester | A |
| VT | 3 | Vermont Transfer Guarantee (CCV associate → partner colleges) + VSCS transfer policy | VSCS Policy 108; CCV partnership agreements | CCV GE accepted as a block | semester | A− |
| VA | 2 | Passport and Uniform Certificate of General Studies | Code of Va. § 23.1-907 | 16 / 30–32 sem | semester | A |
| WA | 2 | Direct Transfer Agreement (DTA) associate | ICRC Handbook; RCW 28B.10.054 | 90 QUARTER credits | QUARTER — 34 CTCs, UW, WWU, CWU, EWU, Evergreen; WSU semester | A |
| WV | 2 | Core Coursework Transfer Agreement | 133 CSR 17 / 135 CSR 17; W. Va. Code § 18B-14-2 | ≤ 35 sem | semester | A |
| WI | 3→2 | Universal Credit Transfer Agreement — the '72-Credit Transfer Rule' | Wis. Stat. § 36.31(2m)(b) (revised 2019-11-21; in force from 2022-23); UW SYS 135; agreement revised Fall 2024 | array of ≥ 72 sem credits of core GE (not 30) | semester | A |
| WY | 3→2 | Statewide Common Course Numbering System + UW University Studies Program | 057-4 Wyo. Code R. § 4-4 | no fixed block; AA/AS aligns to lower-division USP | semester | A− |

## 4. Guarantee conditions, residency and caps

| St | Conditions on the guarantee | Residency minimum / transfer cap |
|---|---|---|
| AL | An AGSC-approved transfer guide binds the receiving public university; 6-hour sequence in literature or history; public institutions only | not confirmed |
| AK | Transfers whole within UA; out-of-system minimum grade C–; an associate with ≥ 26 GE credits is GER-complete at UAF | not confirmed |
| AZ | Assured admission at 2.5 per AZTransfer; ABOR 2-121 resident/non-resident split unverified | 64-credit cap (recalled) |
| AR | Completed AA/AS/AAT, or 60 hours including the 35-hour core → no further lower-division GE; grade C guaranteed | not confirmed |
| CA | C or better; ADT = 60 units, 2.0 → CSU admission with junior standing; UC TAG at six campuses | CSU 70 sem units from CCs, 30 in residence; UC 70 sem / 105 quarter, 35 of last 45 quarter units (recalled) |
| CO | C– per course; guarantee lasts up to 10 years; Degrees with Designation are 60 + 60 | 120-credit bachelor's; 60 + 60 |
| CT | Completed Transfer Ticket degree = first 60 of 120; 2.5 GPA = automatic acceptance at CSCU four-years | not confirmed |
| DE | programme-to-programme | not confirmed |
| DC | — | not confirmed |
| FL | AA guarantee attaches to Florida College System institutions | SACSCOC 25% |
| GA | Credit transfers by domain even if the domain is incomplete; STEM ≥ 10 hrs incl. ≥ 4 lab | SACSCOC 25% |
| HI | UH AA satisfies the UH baccalaureate GE core; Foundations transfer systemwide | not confirmed |
| ID | AA/AS transfers to any Idaho public four-year; others get a GEM course review | not confirmed |
| IL | All publics must maintain a complete package; completed package bars further lower-division GE | not confirmed |
| IN | 2.0 GPA; ≥ 15 credits from the awarding institution; exam credit re-evaluated by the receiver | not confirmed |
| IA | AA ≥ 60 hours, 2.0 GPA → lower-division GE met at the Regent universities (named exceptions) | University of Iowa: up to half the degree from two-year colleges |
| KS | Completed package transfers as a block; AA/AS/AFA | not confirmed |
| KY | your GAPS note — 15 of 33 in-system — still unchecked | not confirmed |
| LA | No substitutions in the first 60 hours; no requirements beyond native students'; degree completion not required for pathway courses | not confirmed |
| ME | C– or better; receiving campus may add ≈ 10–11 GE credits | not confirmed |
| MD | Completed GE transfers without course-by-course match; FSAW writing C– | senior publics accept 60–70 CC credits (13B.06.02.08); UMD total cap 90 |
| MA | 2.0 for the block; A2B: 2.5 guaranteed admission, 3.0 tuition credit | not confirmed |
| MI | 2.0 in each course; ≥ 1 credit-bearing course at the awarding college; U-M evaluates course by course | not confirmed |
| MN | 2.0 GPA; U of M honours a completed MnTC by agreement | not confirmed |
| MS | C or better in each core course; AA + core = IHL core met | no more than half the degree from community colleges |
| MO | CORE 42 Complete transfers as a block; each MOTR course transfers one-to-one; independents may join | not confirmed |
| MT | Minimum C– per course; ≥ 20 credits may roll as a partial block; covers MUS, 3 community colleges, 7 tribal colleges | not confirmed |
| NE | per agreement | not confirmed |
| NV | includes statutory US/Nevada constitutions requirement (NRS 396.500, recalled) | not confirmed |
| NH | — | not confirmed |
| NJ | AA/AS transfers whole as the first half of the bachelor's; AAS/AFA generally excluded | half the degree |
| NM | Fixed-22 courses transfer to the same area; improperly forced repeats must be reimbursed by the receiving institution | not confirmed |
| NY | SUNY/CUNY AA/AS graduates guaranteed a SUNY four-year seat (not a named campus); seamless transfer needs C in Transfer Path courses; CUNY AA/AS = Common Core complete | not confirmed |
| NC | C or better each course; 2.0 GPA; completed AA/AS → junior status; TAAP guarantees one of 16 campuses, not a named one | not confirmed |
| ND | Completed lower-division GE or AA/AS = GE-complete at any signatory; NDUS + 5 tribal colleges + 1 private | not confirmed |
| OH | Ohio Guaranteed Transfer Pathways: associate → junior standing | not confirmed |
| OK | AA/AS from a state-system college satisfies all lower-division GE at any state-system university | ≥ 60 hrs at a baccalaureate institution, 30 in residence, 40 upper-division (not re-confirmed) |
| OR | CTM transfers as a block if public-university admission requirements are met | not confirmed |
| PA | P2P associate degrees give full junior standing; state-related universities participate only partly | not confirmed |
| RI | 2.4 GPA guaranteed admission; up to 30% tuition discount at 3.0+ | not confirmed |
| SC | CHE audit: only 31 of the 86 code as direct equivalents; a new statewide AA/AS GE agreement is being negotiated | not confirmed |
| SD | Completed at one regental campus = complete at all; technical colleges sit under a separate board | ≥ 30 credits at the degree-granting university; ≤ 60 from a technical college |
| TN | Completed pathway = all lower-division GE and pre-major met | not confirmed |
| TX | Completed core transfers as a block | 66 SCH (recalled) |
| UT | If the sender certifies an area satisfied the receiver may not require more | not confirmed |
| VT | CCV associate + GPA 2.0 / 2.5 / 3.0 by receiver — Vermont State University 2.0, min C–; guaranteed admission, junior status, no application fee; includes Champlain, Norwich, Saint Michael's | not confirmed |
| VA | C or better; 3-year completion window; Guaranteed Admission Agreements set different GPA floors per university | not confirmed |
| WA | 2.0 GPA (recalled); ≤ 15 quarter credits restricted electives | 90 quarter credits (recalled) |
| WV | general-studies hours transfer by area, not as direct equivalents | not confirmed |
| WI | Covers UW and WTCS; tribal and private colleges may opt in; no agreement may limit transfer inside UW | 72 credits (UW policy, recalled) |
| WY | CCNS courses transfer with identical equivalency (70% content rule) | not confirmed |

## 5. Exam credit and course numbering

| St | Exam-credit policy | Counts inside the GE block? | Course numbering |
|---|---|---|---|
| AL | campus (ACCS board policy for two-years — recalled) | not confirmed | ACCS common numbering (two-year sector) |
| AK | system / campus | not confirmed | GER substitution tables inside UA — not true common numbering |
| AZ | statewide lookup of campus awards — AZTransfer Exam Equivalency Guide (recalled) | not confirmed | SUN crosswalk |
| AR | campus; new AHECB policy defines competency-based equivalency | not confirmed | ACTS crosswalk |
| CA | published: AP and IB count; UC awards no CLEP/DSST; CSU systemwide AP/IB/CLEP/DLPT, CLEP capped at 30 units | AP/IB yes · CLEP barred from Cal-GETC | C-ID crosswalk; AB 1111 common numbering phasing in (recalled) |
| CO | statewide_table — CCHE Policy I-X (rev. 2021-12-02): AP 3 · IB 4 (SL+HL) · CLEP 50 · DSST 400; ≥ 3 credits (4 for GT-SC1); no extra essay | yes | CCCS common numbering + GT codes |
| CT | system | one requirement per course | CT State common numbering |
| DE | campus | n/a | n/a (one community college) |
| DC | campus | n/a | n/a |
| FL | statewide_table — ACC Credit-by-Exam Equivalencies, effective August 2026 (AP, AICE, IB, CLEP, DSST, DLPT, UExcel, FACT) | yes where the table tags the course `core`; 45-credit guaranteed cap | SCNS — statutory common numbering |
| GA | campus; ACE cut scores recommended | by campus | USG core common; TCSG common |
| HI | system | not confirmed | UH-wide alpha/number alignment |
| ID | campus | not confirmed | GEM common-indexed |
| IL | statutory_floor — AP 3 (P.A. 99-358) | AP yes | IAI codes (crosswalk) |
| IN | statutory_floor — AP 3, Cambridge; statewide lookup on TransferIN | re-evaluated by receiver | CTL crosswalk |
| IA | campus | by campus | community-college common numbering + TransferInIowa |
| KS | system — KBOR cut scores | per KBOR | KRSN crosswalk |
| KY | statutory_floor (KRS 164.098, AP 3) + statewide_table (CPE standard scores: AP, CLEP); KCTCS also Cambridge, DSST, IB | yes | KCTCS common numbering |
| LA | system — Regents PLA; Act 308 authorises statewide PLA/competency agreements; score table not confirmed | not confirmed | LCCN — statewide common numbering + Master Course Articulation Matrix |
| ME | campus | not confirmed | none |
| MD | campus; COMAR 13B.02.02 governs non-traditional credit | by receiving institution | none — DSXX designations as crosswalk |
| MA | campus | by campus | none |
| MI | campus | AP yes · CLEP, IB, DSST barred | none |
| MN | statutory_floor — Minn. Stat. §§ 120B.13 (AP 3, IB 4), 120B.131 (CLEP); Procedure 3.35.1 | yes | none (goal-area tags) |
| MS | campus | by campus | MCCB uniform numbering |
| MO | campus | AP/CLEP usable | MOTR crosswalk (statutory) |
| MT | system — Policy 301.19 | not confirmed | MUS-wide common course numbering |
| NE | campus | by campus | none |
| NV | campus | not confirmed | NSHE-wide common numbering |
| NH | CCSNH system | n/a | none |
| NJ | campus | by campus | none |
| NM | campus | where the course is on the CCN matrix | NMCCNS — statewide common numbering, all lower-division |
| NY | campus / system | by campus | none — Transfer Paths as crosswalk |
| NC | CAA clause + NCCCS system policy | AP 3+ yes within a completed AA/AS; others revert to the receiver if the degree is incomplete | NCCCS Combined Course Library |
| ND | system chart — not confirmed | not confirmed | NDUS common numbering |
| OH | statewide_table — AP (ORC 3333.163, score 3) and endorsed CLEP; IB campus; DSST none | yes | OAN crosswalk |
| OK | system — OSRHE prior-learning policy; table not confirmed | not confirmed | uniform numbering (70 O.S. § 3206.1) + Course Equivalency Project crosswalk |
| OR | statewide AP/IB alignment (recalled) | not confirmed | common course numbering rolling out ('Z' courses) |
| PA | system table — TAOC minimum scores for AP, CLEP, DSST, IB (community colleges + PASSHE) | yes | none |
| RI | campus | not confirmed | none |
| SC | campus | by campus | SCTCS internal common codes; SC TRAC crosswalk |
| SD | system — SDBOR AP/CLEP guideline; table not confirmed | not confirmed | SDBOR common catalogue |
| TN | system — TBR policy | per TBR | TBR common numbering |
| TX | statutory_floor — TEC § 51.968 (AP 3) | by campus | TCCNS |
| UT | statewide_table — Board Policy R472: minimum scores and maximum credit for AP, CLEP, DSST, IB (CLEP 50, ≤ 10 sem hrs per test) | yes | statutory common numbering |
| VT | system — VSCS prior-learning policy | yes when already applied to the CCV degree | none — pathway maps |
| VA | campus — § 23.1-906 compels publication; awards differ | by campus | VCCS common numbering |
| WA | statutory_floor — AP 3 · IB 4 · Cambridge E | by campus | CTC common numbering ('&' courses) |
| WV | system — 133 CSR 59 (eff. 2024-08-19); Series 15 repealed | per rule | none |
| WI | UW system — SYS 135; § 36.31(4) military/occupational review | not confirmed | none statewide; WTCS internal numbering |
| WY | campus | not confirmed | true statewide common numbering — UW + seven colleges |

## 6. Two-year prices and pricing shape

`≈` and "(recalled)" mean nobody has opened a fee schedule. Confirmed 2026-27 figures exist only for CA, NC, NV, NE (Metropolitan CC) and, as a delta, VA.

| St | Two-year resident price | Shape | Residency tiers |
|---|---|---|---|
| AL | $184/credit all-in ($131 tuition + $53 fees) — 2025-26, read from one ACCS college; 2026-27 not confirmed | per credit | none (one ACCS rate) |
| AK | not confirmed (≈ $240–250 lower-division, recalled) | per credit | resident / non-resident |
| AZ | ≈ $97/credit Maricopa (recalled) | per credit | county |
| AR | set by each college — not confirmed | per credit | some in-district |
| CA | $46/unit 2026-27; CCC bachelor's $130/unit upper-division (≈ $10,560 whole degree) | per unit (CCC); flat full-time (UC, CSU) | none; non-resident + $351–456/unit |
| CO | not confirmed | per credit | Aims, Colorado Mountain College only |
| CT | not confirmed | flat at 12+ (recalled) | resident / non-resident |
| DE | not confirmed | per credit | resident / non-resident |
| DC | UDC-CC 2026-27 not found | per credit | DC / metro / other |
| FL | ≈ $100–120/credit (statutory $71.98 + fees; recalled) | per credit in both sectors | none |
| GA | not confirmed | per credit to 15 | none |
| HI | not confirmed (≈ $131/credit, recalled) | per credit | resident / non-resident |
| ID | ≈ $140–150/credit (recalled) | per credit | in-district / out-of-district |
| IL | district-set — not confirmed | per credit | in-district / out-of-district / out-of-state |
| IN | Ivy Tech flat full-time (recalled) | flat full-time | none |
| IA | set by each district — not confirmed | per credit | none (one resident rate, recalled) |
| KS | county-set — not confirmed | per credit | county / state / out-of-state |
| KY | ≈ $190/credit (recalled) | per credit | none |
| LA | not confirmed | cap ≈ 12 hrs (recalled) | resident / non-resident |
| ME | ≈ $96/credit (recalled) | per credit | resident / New England regional |
| MD | not confirmed | per credit | in-county / out-of-county / out-of-state |
| MA | fee-heavy; not confirmed | per credit | none |
| MI | district-set — not confirmed | per credit or contact hour | in-district / out-of-district |
| MN | ≈ $205–235/credit (recalled) | per credit | none |
| MS | flat full-time; figure not confirmed | flat full-time | minor |
| MO | district-set — not confirmed | per credit | in-district / out-of-district / out-of-state |
| MT | flat from 12 credits; figures not confirmed | flat from 12 | Dawson, Flathead Valley, Miles have district tiers |
| NE | MCC $72 per quarter credit from Fall 2026 (+ $5 facility); SCC $105 + $20 fees (2025-26) | per credit | none |
| NV | $136.25/credit lower-division, $226.00 upper-division (2026-27) + ≈ $19.50/credit fees at TMCC; universities $312.75; Nevada State $226.00 | per credit | none |
| NH | ≈ $215/credit (recalled) | per credit | resident / New England regional |
| NJ | county-set — not confirmed | per credit | in-county / out-of-county |
| NM | set by each college — not confirmed | per credit | in-district at independent CCs |
| NY | not confirmed | flat full-time | SUNY CCs: Certificate of Residence or non-resident rate |
| NC | $76/credit, 16-credit cap = $1,216/term (2026-27); out-of-state $268 | per credit, capped | none |
| ND | not confirmed | per credit / flat by campus | resident / reciprocity tiers |
| OH | ≈ $130–190/credit (recalled) | per credit | levy-county tiers |
| OK | not confirmed | per credit | resident / non-resident |
| OR | ≈ $125–145 per quarter credit (recalled) | per credit | a few colleges |
| PA | sponsor-district rates — not confirmed | per credit | sponsor / non-sponsor / out-of-state |
| RI | flat full-time; not confirmed | flat full-time | resident / non-resident |
| SC | not confirmed | per credit | in-county / out-of-county / out-of-state |
| SD | not confirmed | per credit | resident / non-resident |
| TN | tiered; 2026-27 not confirmed | tiered (full to 12, small marginal after) | none |
| TX | $77–164/credit in-district (your data) | per credit | in-district / out-of-district / out-of-state |
| UT | not confirmed | tiered table | none |
| VT | not confirmed | per credit | resident / non-resident |
| VA | + $6.70/credit for 2026-27; base not confirmed | per credit | none (NOVA differential) |
| WA | 2025-26: $131.96 per quarter credit for 1–10, ≈ $65.09 for 11–18; 2026-27 not read | tiered | none |
| WV | flat from 12 (recalled) | flat from 12 | none |
| WI | not confirmed | per credit | WTCS: none for residents |
| WY | not confirmed | per credit | none |

## 7. Free-college programmes and dual enrolment

| St | Waiver / free-college programme | Kind | Dual enrolment |
|---|---|---|---|
| AL | none statewide | none | ACCS dual enrolment; state CTE scholarships (recalled) |
| AK | none | none | Regents' Policy ch. 09.02; district middle colleges |
| AZ | none at community colleges (Arizona Promise is university-side, recalled) | none | priced locally |
| AR | Arkansas Future Grant | field_restricted | Concurrent Challenge Scholarship (recalled) |
| CA | California College Promise Grant + California Promise (AB 19) | need_waiver + recent_grad | CCAP — fee-exempt to 15 units |
| CO | Colorado Promise — refundable tax credit, ≤ $90k (recalled) | tax_credit | Concurrent Enrollment, district-paid (recalled) |
| CT | Mary Ann Handley Award (formerly PACT) | recent_grad | CSCU dual enrolment |
| DE | SEED and SEED+ (14 Del. C. ch. 34) | recent_grad + adult | district-paid (recalled) |
| DC | DCTAG: up to $15,000/yr and $75,000 lifetime at out-of-state publics from 2026-27 ($3,750/yr private tier) | portable grant | OSSE consortium (recalled) |
| FL | none statewide | none | § 1007.271 — exempt from tuition and fees |
| GA | HOPE Career Grant | field_restricted | Dual Enrollment, state-funded to 30 hrs (recalled) |
| HI | Hawaiʻi Promise | need_waiver | Early College (free, recalled) |
| ID | Idaho LAUNCH | field_restricted | Advanced Opportunities — $4,125/student, ≤ $75/credit, also pays AP/CLEP fees (recalled) |
| IL | none (MAP is need aid) | none | Dual Credit Quality Act; priced by district |
| IN | 21st Century Scholars; Workforce Ready Grant | need-like + field_restricted | priority courses free (recalled) |
| IA | Last-Dollar Scholarship | field_restricted | Senior Year Plus — Iowa Code ch. 261E |
| KS | Kansas Promise | field_restricted | Excel in CTE free; academic not (recalled) |
| KY | Work Ready Kentucky Scholarship | field_restricted | Dual Credit Scholarship — 2 courses (recalled) |
| LA | MJ Foster Promise; TOPS Tech | adult_promise | statewide, priced locally |
| ME | Free College Scholarship — class of 2026 covered, tuition only, 150% of programme time | recent_grad | Early College, ≤ 12 free credits/yr (recalled) |
| MD | Community College Promise Scholarship | income-capped promise | Blueprint for Maryland's Future (free, recalled) |
| MA | MassEducate (+ MassReconnect) — $137M FY27 per one legislative source | universal_promise | CDEP / Early College |
| MI | Community College Guarantee; Michigan Reconnect (25+); Tuition Incentive Program | recent_grad + adult + need_waiver | district pays most (recalled) |
| MN | North Star Promise (< $80k) | need_waiver | PSEO — free (recalled) |
| MS | HELP grant; MTAG | need + merit | statewide, priced locally |
| MO | A+ Scholarship; Fast Track | recent_grad + adult | need-based scholarship (recalled) |
| MT | American Indian tuition waiver | statutory waiver | One-Two-Free (recalled) |
| NE | none (Nebraska Promise is NU-only) | none | MCC CollegeNow! tuition waived; ACE scholarship elsewhere |
| NV | Nevada Promise | recent_grad | reduced fee |
| NH | none | none | Running Start (recalled) |
| NJ | Community College Opportunity Grant (recalled) | need_waiver | varies |
| NM | Opportunity Scholarship; Lottery Scholarship | universal_promise | NMSA 21-1-1.2; NMAC 6.30.7 — tuition-free |
| NY | TAP; Excelsior; SUNY/CUNY Reconnect (NYS Opportunity Promise, ages 25–55, high-demand fields, from Fall 2025) | need aid + adult/field | CUNY College Now; SUNY varies |
| NC | Next NC Scholarship | need-based | Career & College Promise — tuition-free (recalled) |
| ND | none confirmed | none | not confirmed |
| OH | none | none | College Credit Plus — free (recalled) |
| OK | Oklahoma's Promise (enrol by grade 11) | need-like | concurrent-enrolment tuition waiver |
| OR | Oregon Promise | recent_grad | mostly free / nominal (recalled) |
| PA | none (Grow PA is field + work-in-state) | none | priced by college |
| RI | RI Promise (permanent); Hope Scholarship at RIC (pilot ending with class of 2026) | recent_grad | PrepareRI — free (recalled) |
| SC | Lottery Tuition Assistance; SC WINS; Workforce Scholarships for the Future | near-universal partial + field_restricted | technical-college dual enrolment |
| SD | Build Dakota; Freedom Scholarship | field + work | High School Dual Credit at a reduced rate |
| TN | Tennessee Promise; Tennessee Reconnect | recent_grad + adult | Dual Enrollment Grant |
| TX | none statewide | none | FAST (HB 8) for FRL students |
| UT | Utah Promise Grant | need, funding-limited | $5/credit cap (recalled) |
| VT | 802 Opportunity; Free Degree Promise | need_waiver | Act 77 — two free courses + Early College |
| VA | G3 | field + need | Passport/UCGS courses at no cost (recalled) |
| WA | Washington College Grant — full award to $83,500 (family of 4), partial to ≈ $139,500 | need_waiver | Running Start; College in the High School free since 2023 |
| WV | WV Invests | field_restricted | 133 CSR 19 pilot |
| WI | UW Wisconsin Tuition Promise — 2026-27 status not confirmed | none confirmed | Early College Credit Program; Start College Now |
| WY | Hathaway; Wyoming's Tomorrow | merit + need / adult | W.S. § 21-20-201 |

## 8. Alternative credit — stance and public partners by state

| St | Stance | Detail and public partner institutions |
|---|---|---|
| AL | official_partner | Athens State (StraighterLine, Sophia); Alabama State, Alabama A&M (Sophia) |
| AK | no_record | — |
| AZ | official_partner + own product | ASU Universal Learner Courses: $25 + $400 only if passed, ASU transcript credit (A). Partners: Rio Salado (StraighterLine); Northern Arizona University (Sophia); Univ. of Arizona Global Campus (StraighterLine, Sophia, Saylor, Study.com) |
| AR | official_partner | Univ. of Arkansas Grantham (StraighterLine; Sophia adviser page); Arkansas State University (Saylor) |
| CA | published_refusal (UC) · system_policy_permits (CSU) | UC: no credit for third-party transcripts. CSU Credit for Prior Learning Policy (ex-EO 1036): campuses shall credit learning outside formal higher education; ACE-recommended non-collegiate instruction, military or civilian; CSULB caps at 20% |
| CO | system_policy_permits + official_partner | I-X lets campuses accept other PLA meeting campus standards. CSU Global partner (StraighterLine, Saylor, Study.com) |
| CT | agreement_only | Charter Oak State College accepts ACE/NCCRS credit only from providers under agreement — AP, CLEP, CSM Learn, DSST, StraighterLine, Study.com, Sophia; cap 90 (bachelor's) / 45 (associate) |
| DE | no_record | — |
| DC | no_record | — |
| FL | evaluate_on_request_by_law | Fla. Stat. § 1004.0961; BOG Reg. 6.020; Rule 6A-14.0304 — must evaluate online/MOOC coursework on request before the first term; policy must describe ACE-recognised credit. FIU is a Saylor partner; Miami Dade accepts ACE but is not a partner |
| GA | no_record | — |
| HI | no_record | — |
| ID | no_record | — |
| IL | no_record | — |
| IN | official_partner | Purdue Global (StraighterLine, Sophia, Saylor, Study.com); Ivy Tech (Sophia) |
| IA | no_record | — |
| KS | official_partner | Fort Hays State University (StraighterLine) |
| KY | system_policy_permits | KCTCS awards credit per ACE's National Guide |
| LA | official_partner | Grambling, McNeese, Southeastern Louisiana (StraighterLine); Southern Univ. at Shreveport (Sophia); LCTCS system, Bossier Parish CC, Central Louisiana Technical CC, South Louisiana CC (Saylor) |
| ME | official_partner | Univ. of Maine at Presque Isle — YourPace (StraighterLine, Sophia, Study.com) |
| MD | official_partner | UMGC (StraighterLine, Sophia, Saylor, Study.com); Morgan State (Saylor) |
| MA | official_partner | Middlesex Community College (Study.com) |
| MI | official_partner | Central Michigan University (Sophia) |
| MN | system_policy_permits | Procedure 3.35.1 covers industry credentials, licences, certifications and non-credit instruction |
| MS | no_record | — |
| MO | official_partner | Univ. of Central Missouri (StraighterLine); Harris-Stowe State (Sophia) |
| MT | no_record | — |
| NE | no_record | — |
| NV | no_record | — |
| NH | no_record | UNH CPS (ex-Granite State) appeared on an older Saylor list |
| NJ | official_partner | Thomas Edison State University (StraighterLine, Sophia, Saylor, Study.com — transcript must come direct from Study.com); Rowan — Rohrer College of Business (Sophia adviser page) |
| NM | official_partner | Central New Mexico CC (StraighterLine, Sophia) |
| NY | official_partner | SUNY Empire State (StraighterLine, Sophia, Saylor, Study.com; accepts eligible Coursera courses); SUNY Brockport (Sophia); CUNY School of Professional Studies (Saylor) |
| NC | no_record | — |
| ND | official_partner | Bismarck State College (StraighterLine). UND's 'ACE' wording in the second pass looks like a misreading — treat as unverified |
| OH | system_policy_permits | Industry-Recognized Credential Transfer Assurance Guides (ITAGs) give guaranteed credit |
| OK | no_record | — |
| OR | official_partner | Southern Oregon University (StraighterLine) |
| PA | no_record | Penn State World Campus accepts ACE credit but is not a Saylor partner |
| RI | no_record | — |
| SC | no_record | — |
| SD | no_record | — |
| TN | official_partner | Tennessee State University (StraighterLine); University of Memphis (Saylor) |
| TX | official_partner | Dallas College incl. Cedar Valley, Northeast Lakeview (StraighterLine). UT System–Coursera 'Texas Credentials for the Future' is free but non-credit |
| UT | system_policy_permits | Statute lets the Board sign articulation agreements with competency-based GE providers; HB 353 (2026) on external transfer |
| VT | no_record | — |
| VA | no_record | — |
| WA | no_record | — |
| WV | system_policy_permits | 133 CSR 59 covers prior learning, AP, CLEP and micro-credentials |
| WI | system_policy_permits | Regent policy on extra-institutional learning; SYS Procedure 138.A (PLA) |
| WY | no_record | UW reviews military ACE transcripts only |

### 8.1 State and system rules (all opened in pass 4)

| State | Rule | What it does | Source |
|---|---|---|---|
| **FL** | Fla. Stat. **§ 1004.0961**; BOG Reg. **6.020**; SBE Rule **6A-14.0304** | Every state university and Florida College System institution must have a policy letting students earn credit for **online courses, including MOOCs, completed before initial enrolment**. On request before the first term the institution *shall* evaluate the coursework and award credit where faculty find content and outcomes comparable, the course meets transfer-course quality standards, and it is relevant to the intended programme. The policy must describe credit for **ACE-recognised coursework** and an appeals process | `https://www.flsenate.gov/Laws/Statutes/2025/1004.0961`; `https://www.flbog.edu/wp-content/uploads/6_020_CollegeCredit.pdf`; `https://origin.fldoe.org/core/fileparse.php/9931/urlt/0109045-140304.pdf` |
| **CA — UC** | systemwide admissions policy | Published refusal (already in your data) | — |
| **CA — CSU** | CSU **Credit for Prior Learning Policy** (formerly EO 1036; PolicyStat 9817841, eff. 2021-10-07) | Campuses *shall* apply toward admission and/or the degree credit from examinations, experiential learning, **learning acquired outside formal higher education**, and military training. Campus catalogues implement it as credit for non-collegiate instruction, *military or civilian*, recommended by ACE's National Guide. **Amounts vary by campus** — Long Beach caps prior-learning credit at 20% of programme units (24 of 120). So CSU is `system_policy_permits`, not a refusal and not a guarantee | `https://academics.fresnostate.edu/senate/documents/APM%20218%20Policy%20on%20Credit%20for%20Prior%20Learning.pdf`; `https://www.csulb.edu/academic-senate/credit-for-prior-learning`; `https://www.csusb.edu/veterans/policies-procedures/military-training-credit` |
| **CT** | Charter Oak State College catalogue, *Non-Collegiate Course Providers* | ACE- or NCCRS-recommended courses from non-regionally-accredited providers are **not accepted unless Charter Oak has an agreement with the provider**. Current agreements: AP, CLEP, CSM Learn, DSST, **StraighterLine, Study.com, Sophia**. Cap **90** credits toward a bachelor's, **45** toward an associate, even with an agreement. Consolidated (Acclaim) transcripts not accepted | `https://charteroak.edu/catalog/current/sources_credit/non_collegiate_course_prov.php` |
| **UT** | Utah Code § 53H-3-604 (formerly § 53B-16-105); Board Policy R472; HB 353 (2026) | The statute authorises the Board to sign an **articulation agreement with a regionally accredited competency-based general-education provider** whose courses are as rigorous as the USHE equivalent. HB 353 (2026) adds duties on transfer from institutions *outside* USHE. R472 sets minimum PLA standards system-wide | `https://codes.findlaw.com/ut/title-53b-state-system-of-higher-education/ut-code-sect-53b-16-105/`; HB 353 |
| **OH** | Ohio Articulation & Transfer Policy | **Industry-Recognized Credential Transfer Assurance Guides (ITAGs)** give *guaranteed* credit for approved industry credentials, alongside military (MTAG) and career-technical (CTAG) guides. Policy names DSST and Excelsior exams as PLA methods without statewide alignments | `https://transfercredit.ohio.gov/students/student-programs/advanced-placement`; `https://www.ohiohighered.org/transfer/policy` |
| **MN** | Minnesota State Procedure 3.35.1 | "External assessments" expressly include nationally recognised third-party assessments, **industry credentials, licences, certifications and non-credit instruction**; colleges grant by ACE-equivalent standards. Binds Minnesota State, not the U of M | `https://www.minnstate.edu/board/procedure/335p1.html` |
| **KY** | KCTCS credit-for-prior-learning standards | KCTCS awards credit for business, industry and government training **as recommended in ACE's National Guide** | `https://bigsandy.kctcs.edu/admissions/information-for/credit-for-prior-learning.aspx` |
| **CO** | CCHE Policy I-X | Beyond the exam tables, a campus *may* accept other prior-learning credit that meets campus standards; GT Pathways credit awarded by portfolio must be accepted in transfer by every public institution | I-X PDF (see § 2) |
| **WV** | 133 CSR 59 (eff. 2024-08-19) | One rule covers credit for prior learning, AP, CLEP **and micro-credentials** | `https://www.wvhepc.edu/wp-content/uploads/2024/07/Series-59-Final-File-SOS-2024-07-19.pdf` |
| **PA** | 24 P.S. § 20-2002-C(d) | Uniform prior-learning standards for community colleges + PASSHE; so far exercised for exams only (AP, CLEP, DSST, IB) | `https://collegetransfer.pa.gov/Administrators/Credit-for-Prior-Learning` |

Added by pass 5 (A−): **Wisconsin** — Wis. Stat. § 36.31(4) requires review of military and occupational training, and the Regents' policy on extra-institutional learning plus SYS Procedure 138.A govern the rest. **Louisiana** — Act 308 of 2022 authorises statewide agreements on competency-based and prior-learning credit. **New Mexico** — NMAC 5.55.7 makes the receiving institution reimburse a student forced to repeat a commonly numbered course.

---

## 9. Providers

| Provider | Price | Recommendation body | Partners | Read how |
|---|---|---|---|---|
| Sophia | $99/month (also $299 / 4 months, $799 / year); 2 courses at a time | ACE | "115+", described by Sophia as 1:1 credit *in select degree programmes* | co-branded subdomains (A−) + adviser page (B) |
| Study.com | College Saver $95/month; College Saver Pro $235/month (220+ courses incl. upper-division) | ACE **and** NCCRS | "40+" | directory pages (A−) |
| StraighterLine | $99/month + per-course fee | ACE | "180+" | full list read (A) |
| Saylor Academy | courses free; $5 proctoring per exam attempt, ≤ 3 attempts, 14 days apart | ACE | 28 claimed | partner pages (A−) |
| Coursera certificates | subscription | ACE for Google/IBM certificates (up to ≈ 12 credits) | SUNY Empire accepts eligible courses; UT System deal is non-credit | B |
| ASU Universal Learner | $25 + $400 only if passed and transcripted | none needed — ASU transcript | any college that takes ASU transfer credit | A |
| CLEP / Modern States | $97 exam; Modern States voucher makes it free | College Board | per § 5 | A |

**Public and public-affiliated partners, by provider**

- **StraighterLine:** Athens State (AL) · Rio Salado, UAGC (AZ) · UA Grantham (AR) · CSU Global, Technical College of the Rockies (CO) · Charter Oak (CT) · Purdue Global (IN) · Fort Hays State (KS) · Grambling, McNeese, Southeastern Louisiana (LA) · UMPI (ME) · UMGC (MD) · Univ. of Central Missouri (MO) · Thomas Edison (NJ) · Central New Mexico CC (NM) · SUNY Empire (NY) · Bismarck State (ND) · Southern Oregon (OR) · Tennessee State (TN) · Dallas College, Northeast Lakeview (TX).
- **Sophia:** Alabama State, Alabama A&M, Athens State (AL) · Northern Arizona, UAGC (AZ) · Charter Oak (CT) · Ivy Tech, Purdue Global (IN) · SUSLA (LA) · UMPI (ME) · UMGC (MD) · Central Michigan (MI) · Harris-Stowe State (MO) · Thomas Edison, Rowan–Rohrer (NJ) · Central New Mexico CC (NM) · SUNY Empire, SUNY Brockport (NY) · UA Grantham (AR, adviser page only).
- **Saylor:** Arkansas State (AR) · UAGC (AZ) · CSU Global (CO) · FIU (FL) · Purdue Global (IN) · LCTCS, Bossier Parish CC, Central Louisiana Technical CC, South Louisiana CC (LA) · Morgan State, UMGC (MD) · Thomas Edison (NJ) · CUNY School of Professional Studies, SUNY Empire (NY) · University of Memphis (TN). Accept ACE but not partners: Miami Dade College, Penn State World Campus.
- **Study.com:** UAGC (AZ) · CSU Global (CO) · Charter Oak (CT) · Purdue Global (IN) · UMPI (ME) · UMGC (MD) · Middlesex CC (MA) · Thomas Edison (NJ) · SUNY Empire (NY).

Public-sounding but **private**: UMass Global, University of the Cumberlands, American Public/Military University, Wilmington University, WGU, SNHU, Excelsior.

**The institutions on three or more lists** — the public destinations with a published path for third-party credit, all online: Charter Oak (CT), Thomas Edison (NJ), SUNY Empire (NY), UMGC (MD), UMPI (ME), CSU Global (CO), Purdue Global (IN), UAGC (AZ).

**Warnings to print:** a partner listing is programme-scoped; caps apply (Charter Oak 90/45, CSU Long Beach 20%); Florida's right is to be *evaluated*, on request, before the first term; some registrars need the transcript from the provider itself; third-party credit is ungraded, so it cannot lift a GPA toward a guarantee; nothing found lets third-party credit into a statewide GE block by right.

---

## 10. Florida — row-by-row corrections to `data/fl/acceptance-rules.ts`

| Your row | Your area | What the table awards at the floor score | At higher score | Verdict |
|---|---|---|---|---|
| `ap-english-lang` | fl-comm | ENC X101 `core`, min 3 | 4–5: ENC X101 `core` + X102, min 6 | ✅ keep; 6 credits at 4+ |
| `ap-english-lit` | fl-hum | ENC X101 `core` **or** an AML/ENL/LIT course, min 3 | 4–5: ENC X101 `core` + (ENC X102 or LIT X005), min 6 | ❌ wrong area. The only core course on offer is ENC X101 → **fl-comm**. LIT X005 is exam-unique, not LIT X000 `core`. Either/or with AP Lang under the no-duplication rule |
| `ap-calculus-ab` | fl-math | MAC X311 `core`, **min 4** | same | ✅ area; credits 4 not 3 |
| `ap-calculus-bc` | fl-math | MAC X311 `core`, min 4 | 4–5: + MAC X312, min 8 | ✅ area; 4 / 8 |
| `ap-statistics` | fl-math | STA X014 **or** STA X023 `core`, min 3 | same | ⚠️ core only if the institution posts STA X023 |
| `ap-psychology` | fl-social | PSY X012 `core`, min 3 | same | ✅ |
| `ap-us-history` | fl-social | **AMH X000 — not core**, min 3 | 4–5: AMH X010 `core,civics` + AMH X020 `core,civics`, min 6 | ❌ at score 3; ✅ only at 4+. Needs a score-tiered rule |
| `ap-us-government` | fl-social | POS X041 `core,civics`, min 3 (meets civic-literacy course **and** assessment) | same | ✅ |
| `ap-macroeconomics` | fl-social | ECO X013 `core`, min 3 | same | ✅ |
| `ap-microeconomics` | fl-social | ECO X023 — **not core** | same | ❌ credit yes, core area no |
| `ap-human-geography` | fl-social | GEO X400 or X420 — **not core** | same | ❌ |
| `ap-comparative-government` | fl-social | CPO X001 or X002 — **not core** | same | ❌ |
| `ap-art-history` | fl-hum | ARH X000 `core`, min 3 | 4–5: + ARH X050 or X051, min 6 | ✅ |
| `ap-spanish` | fl-hum | one semester intermediate language, min 3 — **not core** | 4–5: two semesters, min 6 | ❌ |
| `ap-european-history` | fl-hum | EUH X009, min 3 — **not core** | 4–5: EUH X000 + X001, min 6 | ❌ |
| `ap-biology` | fl-nat | BSC X005C `core`, **min 4** | 4: BSC X010C `core`; 5: + BSC X011C, min 8 | ✅ area; credits 4 |
| `ap-chemistry` | fl-nat | CHM X020C `core`, min 4 | 4: CHM X045C `core`; 5: + CHM X046, min 8 | ✅ area; credits 4 |
| `ap-physics-1` | fl-nat | PHY X053C `core`, min 4 | same | ✅ area; credits 4 |
| `ap-environmental-science` | fl-nat | EVR X001 `core`, min 3 | same | ✅ — but exams sat **before Sept 2025** map to ISC X051 instead |
| `clep-college-composition` | fl-comm | ENC X101 `core` + ENC X102, **min 6** | — | ✅; 6 credits |
| `clep-college-algebra` | fl-math | MAC X105 `core`, min 3 | — | ✅ |
| `clep-college-mathematics` | fl-math | MGF X130 `core`, min 3 | — | ✅ |
| `clep-intro-psychology` | fl-social | PSY X012 `core` | — | ✅ |
| `clep-intro-sociology` | fl-social | SYG X000 — **removed from core 2024-25** | — | ❌ |
| `clep-american-government` | fl-social | POS X041 `core,civics` | — | ✅ |
| `clep-history-us-1` | fl-social | AMH X010 `core,civics` (added to core 2024-25) | — | ✅ |
| `clep-macroeconomics` | fl-social | ECO X013 `core` | — | ✅ |
| `clep-humanities` | fl-hum | HUM X235 or HUM X250 — **not core** | — | ❌ |
| `clep-american-literature` | fl-hum | AML X000 — **not core** | — | ❌ |
| `clep-natural-sciences` | fl-nat | **"No direct equivalent"** — no guaranteed credit at all | — | ❌❌ delete; discretionary |
| `clep-biology` | fl-nat | BSC X005 `core`, min 3, **no lab credit** | — | ✅ |

Also off the core since 2024-25: course rows `fl-mgf-1106` (MGF X106) and `fl-syg-2000` (SYG X000). Added to the core: AMH X010, LIT X000, OCE X001; MGF X130 carries the `core` tag.

---

## 11. Quarter-system public institutions

| State | Quarter | Semester exceptions |
|---|---|---|
| WA | all 34 community & technical colleges; UW, WWU, CWU, EWU, Evergreen | WSU |
| OR | all 17 community colleges; all 7 public universities | none |
| CA | UC Davis, Irvine, UCLA, Riverside, San Diego, Santa Barbara, Santa Cruz; Foothill, De Anza, Lake Tahoe CC; Cal Poly SLO until Fall 2026 (recalled) | UC Berkeley, UC Merced, rest of CSU and CCC |
| NE | Metropolitan Community College, Omaha (confirmed — priced per quarter credit) | everything else |
| LA | Louisiana Tech: quarter calendar, semester credit hours (unconfirmed by two passes) | — |

---

## 12. California detail and national money items (pass 1, corrected)

**Prices 2026-27.** CCC $46/unit ($1,380 for 30 units), unchanged since 2012; non-resident + $351–456/unit by district; CCC bachelor's $130/unit upper-division, ≈ $10,560 for the degree. CSU tuition $6,838 + campus fees averaging ≈ $2,194. UC systemwide tuition and fees $15,588 for the entering cohort, locked up to six years; non-resident total $54,848. Calbright is free but certificate-only.

**Aid.** CCPG waives the $46/unit (methods A/B/C; not the $84 bachelor's supplement). California Promise (AB 19): up to two free years for first-time full-time students, college-optional. Cal Grant 2026-27 income ceilings, dependent family of four: A and C **$144,700**, B **$76,100**; assets **$111,900** dependent / **$53,300** independent; FAFSA or CADAA by March 2, community-college second window September 2. Middle Class Scholarship **$250,000** income and asset ceiling. UC Blue and Gold: most families to $100,000 pay no systemwide tuition. College Corps: $10,000 for 450 hours. AB 540 / CADAA opens state aid to undocumented students.

**Exam credit.** AP 3+ everywhere; CLEP at CSU only (cap 30 units), never at UC and never toward Cal-GETC; DSST on neither systemwide list.

**Transfer.** ADT → guaranteed CSU admission with junior standing; UC TAG at Davis, Irvine, Merced, Riverside, Santa Barbara, Santa Cruz; ASSIST.org; CVC Exchange cross-enrolment at $46/unit.

**Cheapest whole-degree routes (California resident).**

| Route | Low income | ≈ $100k family | No aid |
|---|---|---|---|
| Third-party credit + CLEP → UMPI / WGU / TESU | ≈ $0–4,000 | ≈ $4,000–8,000 | ≈ $4,000–8,000 |
| CCC bachelor's | ≈ $0–3,000 | ≈ $8,000–10,560 | ≈ $10,560 |
| AP / dual enrolment → CCC → ADT → CSU | ≈ $0 | ≈ $10,000–15,000 | ≈ $18,000–21,000 |
| CCC → UC via TAG | ≈ $0 | ≈ $0 tuition | ≈ $34,000–36,000 |

Cal Grant does not travel out of state; federal Pell does. UMPI YourPace is $1,800 per 8-week session.

**Employer benefits (2025-26 terms).** Amazon Career Choice — tuition prepaid, $5,250/yr full-time, after 90 days. Walmart Live Better U — tuition, books and fees, day one. Starbucks — ASU Online, first bachelor's. Target and Chipotle via Guild — selected degrees free, otherwise $5,250/yr. UPS — $5,250/yr, $25,000 lifetime. IRS § 127 excludes $5,250/yr.

**Federal changes from 2026 (P.L. 119-21).** Grad PLUS ends for new borrowers; Parent PLUS capped at $50,000; Pell cut off at a Student Aid Index of twice the maximum award; Workforce Pell for 8-week programmes from 2026-07-01; programme-level earnings tests.

---

## 13. Still open, by state

| St | Still open |
|---|---|
| AL | 2026-27 ACCS rate; residency/cap; exam tables |
| AK | tuition; exam tables; flagship third-party stance |
| AZ | ABOR 2-121 GPA; tuition; cap |
| AR | new core category list once adopted; tuition |
| CA | unit_system on institutions; CLEP fee in exams.ts |
| CO | CCCS 2026-27 rate; transcribe exam tables |
| CT | CT State 2026-27 tuition; Handley terms |
| DE | tuition; flagship stance |
| DC | UDC-CC fee schedule |
| FL | apply table to 372 rules; refresh core lists |
| GA | domain hours for STEM / Social Sciences; tuition; 2026 need-based aid bill |
| HI | whether a redesigned GE is in force 2026-27; tuition |
| ID | SBOE policy text; tuition |
| IL | STAR Act / P.A. 102-0187 conditions; tuition |
| IN | Ivy Tech 2026-27 rate |
| IA | per-area GE split; tuition |
| KS | KBOR cut-score table; tuition |
| KY | 15-of-33 rule; tuition |
| LA | LCTCS 2026-27 rate; AP/CLEP matrix |
| ME | signed agreement text; MCCS 2026-27 rate |
| MD | tuition figures; Promise terms |
| MA | enacted FY27 line; tuition |
| MI | tuition |
| MN | tuition |
| MS | flat rate; exam tables |
| MO | tuition |
| MT | tuition; exam table |
| NE | NTI text |
| NV | Handbook ch. 14 text |
| NH | everything |
| NJ | CCOG terms; tuition |
| NM | CNM rate; scholarship 2026-27 terms |
| NY | tuition; CUNY primary text |
| NC | — |
| ND | tuition; exam chart; UND third-party stance |
| OH | transcribe AP/CLEP alignments; tuition |
| OK | current residency numbers; tuition |
| OR | tuition; AP/IB table |
| PA | tuition; transcribe TAOC table |
| RI | CCRI rate |
| SC | LTA 2026-27 per-credit amount; status of the new agreement |
| SD | tuition; exam table |
| TN | TBR 2026-27 fee |
| TX | — |
| UT | GE breakdown; tuition |
| VT | CCV 2026-27 rate; 802 income ceiling |
| VA | VCCS base rate; UCGS total |
| WA | 2026-27 SBCTC schedule |
| WV | tuition |
| WI | WTCS 2026-27 rates; which branch campuses remain open |
| WY | WCCC 2026-27 rate; USP category list |

Cross-cutting: exam tables are located but not transcribed for CO, OH, UT, PA, KY, OR; flagship third-party stances are unread in 23 states; Sophia's full list has not been classified public/private; the 2026-27 fee schedule is unread in 46 jurisdictions.
