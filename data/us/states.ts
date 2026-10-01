import type {
  AidProgram, Jurisdiction, Provenance, StateCode, ThirdPartyStance,
} from '../../src/types.ts';

/**
 * Every state, including the ones we have not mapped.
 *
 * Listing all 51 is deliberate. A student in Ohio opening a "US" app and being
 * told their state does not exist learns nothing; being told plainly that we
 * have not mapped Ohio's framework yet, that AP and CLEP and dual enrolment
 * work there anyway, and where to go to check, is a true and useful answer.
 * Absence of data is data, and it belongs in the dataset rather than in a
 * crash.
 */

/** Where the count of states with a statewide transfer core comes from. */
const ECS_SURVEY: Provenance = {
  source_url: 'https://www.ecs.org/50-state-comparison-transfer-and-articulation/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Education Commission of the States reports that at least 31 states require a ' +
    'transferable core of lower-division courses and guarantee statewide transfer of ' +
    'an associate degree. We have mapped three of them. Yours may well have one — we ' +
    'have not confirmed it, so we will not describe it.',
};

const NOT_MAPPED = (name: string): Provenance => ({
  ...ECS_SURVEY,
  note:
    `We have not mapped a statewide general-education framework for ${name}. ` +
    ECS_SURVEY.note,
});

// ---- California -------------------------------------------------------------

const CCPG: AidProgram = {
  name: 'California College Promise Grant',
  kind: 'need_waiver',
  note:
    'Waives the California community-college enrolment fee ($46/unit) entirely for ' +
    'eligible students. There is no income cut-off to look up before applying — the ' +
    'community college decides, and applying costs nothing.',
  provenance: {
    source_url: 'https://www.cccco.edu/Students/Pay-for-College/California-College-Promise-Grant',
    as_of: '2026-09-18',
    confidence: 'published',
  },
};

const CCAP: AidProgram = {
  name: 'dual enrolment (CCAP)',
  kind: 'other',
  note:
    'College and Career Access Pathways partnerships let a high-school student take ' +
    'community-college courses with the enrolment fee waived, up to 15 units a term. ' +
    'It is the largest saving available to anyone still in high school.',
  provenance: {
    source_url: 'https://www.cccco.edu/Students/Dual-Enrollment',
    as_of: '2026-09-18',
    confidence: 'needs_check',
  },
};

// ---- Texas ------------------------------------------------------------------

const FAST: AidProgram = {
  name: 'Financial Aid for Swift Transfer (FAST)',
  kind: 'need_waiver',
  note:
    'Created by HB 8 (2023). A high-school student who is or recently was eligible for ' +
    'free or reduced-price lunch takes dual-credit courses at a participating Texas ' +
    'public college at NO cost. Enrolment of economically disadvantaged students in ' +
    'dual credit more than doubled in the programme’s first year.',
  provenance: {
    source_url: 'https://www.highered.texas.gov/student-financial-aid-programs/fast',
    as_of: '2026-09-19',
    confidence: 'published',
  },
};

// ---- Florida ----------------------------------------------------------------

const FL_DUAL: AidProgram = {
  name: 'dual enrolment',
  kind: 'universal_promise',
  note:
    'Florida Statutes 1007.271 exempts a dual-enrolment student from registration, ' +
    'tuition and laboratory fees outright. Not a discount and not means-tested — the ' +
    'fees do not apply. This is the cheapest college credit available anywhere in the ' +
    'dataset.',
  provenance: {
    source_url: 'https://www.flsenate.gov/laws/statutes/2024/1007.271',
    as_of: '2026-09-19',
    confidence: 'statute',
  },
};

const STATE_NAMES: Record<StateCode, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};


/**
 * The statewide layer, for the states we have not built campus pricing for.
 *
 * This is the half of the product that scales. A statewide transfer guarantee
 * applies to every public campus in the state at once, it is the single most
 * valuable thing we can tell most students, and — unlike per-campus tuition and
 * per-exam articulation — it is one fact rather than four hundred. So a student
 * in Ohio gets Ohio Transfer 36 today, while campus-level planning is still
 * only California, Texas and Florida.
 *
 * Every row here is `needs_check`. They were assembled from search results
 * rather than read out of the statute, the board policy or the agreement
 * itself, and the difference between those two things is the entire product.
 * Confirming one is a matter of reading one document; until someone does, the
 * app says where it came from and how far it goes, and never more.
 *
 * A state absent from this table is not a state without a transfer policy — the
 * Education Commission of the States counts at least 31 with a transferable
 * lower-division core. It is a state we have not confirmed one for, which is a
 * fact about us and not about them, and the UI says so in those words.
 */
interface StatewideRule {
  programme: string;
  /**
   * Set only when a person has opened the governing document and checked the
   * guarantee sentence against it — `statute` when the statute or regulation
   * text itself was read, `published` when it was the board's or agency's own
   * policy page. Absent, the row stays `needs_check`: assembled from search
   * results and never read at source. See data/research/VERIFIED-STATEWIDE.md.
   */
  verified?: { confidence: 'published' | 'statute'; as_of: string; source_url: string };
  guarantee: string;
  /**
   * The statute, board policy or agreement that actually creates the rule.
   *
   * Carried separately from `source_url` because a citation is often the better
   * source: "Wis. Stat. § 36.31(2m)(b)" is findable and stable in a way a
   * campus explainer page is not, and several of these rules have no single
   * canonical URL at all.
   */
  authority: string;
  /** Empty where we hold a citation but no link. */
  source_url: string;
  /**
   * Oregon and Washington count in QUARTER credits. Everything else here is
   * semester. This was the highest-risk gap in the project — every figure the
   * app computes assumes semester units, and a quarter state priced against
   * that assumption is wrong by a factor of 1.5 with nothing to complain.
   */
  unit_system: 'semester' | 'quarter';
  /** False where the research found the state HAS no statewide instrument. */
  exists?: false;
  /**
   * How far this row is from being promotable, from the research that produced
   * it: A = governing document opened and cross-checked, A− = a research pass
   * reports reading it, B = official explainer or one catalogue, C = recalled.
   *
   * It is NOT a confidence level. Every row here stays `needs_check` until a
   * person opens the source, per VERIFICATION.md. The grade says how much work
   * that promotion would be.
   */
  grade: 'A' | 'A−' | 'B' | 'C' | string;
}

const STATEWIDE: Partial<Record<StateCode, StatewideRule>> = {
  AK: {
    programme: 'UA common general-education core',
    guarantee:
      'UA common general-education core (one public system). ≥ 34 sem (Regents\' Policy ' +
      'P10.04.040; distribution in R10.04.040). A student who completes the GE requirements ' +
      'at one UA university or community college is considered to have completed them at all ' +
      'UA institutions. Partial GE counts by category even where the receiving campus has no ' +
      'matching course (P10.04.062). Credit from outside UA transfers only with C– or better ' +
      '(R10.04.060).',
    authority:
      'UA Regents\' Policy & University Regulation ch. 10.04',
    source_url: 'https://www.alaska.edu/bor/policy-regulations/chapter-10-04-academic-programs.php',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.alaska.edu/bor/policy-regulations/chapter-10-04-academic-programs.php' },
    unit_system: 'semester',
    grade: 'A−',
  },
  AL: {
    programme: 'AGSC General Studies Curriculum',
    guarantee:
      'AGSC statewide general studies curriculum and articulation agreement (Act 94-202; Code ' +
      'of Ala. § 16-5-8(e)). Delivered through Alabama Transfers (formerly STARS). For ' +
      'two-year → four-year public transfer, a transfer guide prescribes the first 60–64 sem. ' +
      'Applicable credits transferred under the agreement \'fulfill degree requirements at the ' +
      'four-year institution as if they were earned\' there, once the student is admitted.',
    authority:
      'Act 94-202; Code of Ala. § 16-5-8(e)',
    source_url: 'https://alabamatransfers.com/about/legislation',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://alabamatransfers.com/about/legislation' },
    unit_system: 'semester',
    grade: 'A−',
  },
  AR: {
    programme: 'State Minimum General Education Core = 15-hour Requisite Core',
    guarantee:
      'State Minimum General Education Core, 35 sem (AHECB, updated April 2026: English Comp ' +
      '6 · Speech 0–3 · Math 3 · lab Science 8 · Fine Arts/Humanities 6–9 · U.S. History 3 · ' +
      'American Government 3 · Social Sciences 3–6), inside a 60-hour state minimum core ' +
      'curriculum. Act 566 of 2025 (new § 6-61-144) adds a 15–16-hour Requisite Core ' +
      '(communication 6 · math or science 3–4 · U.S. History 3 · American Government 3) for ' +
      'the entering class of Fall 2027. A completed AA, AS or AAT, or the completed 60-hour ' +
      'state minimum core, must be accepted in full by a four-year public, with junior ' +
      'standing and no additional lower-division GE (exceptions: major prerequisites, ' +
      'discipline-specific courses, licensure requirements). Whether a D transfers is the ' +
      'receiving university\'s decision (§ 6-61-231).',
    authority:
      'Ark. Code § 6-61-231; Act 566 of 2025 (§ 6-61-144); AHECB minimum core (April 2026)',
    source_url: 'https://arkleg.state.ar.us/Home/FTPDocument?path=%2FACTS%2F2025R%2FPublic%2FACT566.pdf',
    verified: { confidence: 'statute', as_of: '2026-10-01', source_url: 'https://arkleg.state.ar.us/Home/FTPDocument?path=%2FACTS%2F2025R%2FPublic%2FACT566.pdf' },
    unit_system: 'semester',
    grade: 'A',
  },
  AZ: {
    programme: 'AGEC → Reimagined AGEC',
    guarantee:
      'Arizona General Education Curriculum (AGEC). One unified AGEC from the 2026 catalog ' +
      'year, replacing AGEC-A/-B/-S; students on an earlier catalog may still finish those. ' +
      '32–35 sem, C or better in every course. A completed AGEC transfers as a block and ' +
      'satisfies lower-division GE at ASU, NAU and UArizona (ABOR Policy 2-210 § C.1). With a ' +
      '2.5 cumulative GPA it also gives assured general admission to all three.',
    authority:
      'ABOR Policy 2-210; A.R.S. § 15-1824',
    source_url: 'https://www.aztransfer.com/about/agec.html',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.aztransfer.com/about/agec.html' },
    unit_system: 'semester',
    grade: 'B',
  },
  CO: {
    programme: 'gtPathways',
    guarantee:
      'gtPathways (GT Pathways). 31 sem (GT-CO, GT-MA1, GT-AH/HI/SS, GT-SC codes). C– per ' +
      'course; guarantee lasts up to 10 years; Degrees with Designation are 60 + 60.',
    authority:
      'CCHE Policy I-L; C.R.S. 23-1-108(7), 23-1-108.5, 23-1-125',
    source_url: 'https://cdhe.colorado.gov/transfer-agreements',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://cdhe.colorado.gov/transfer-agreements' },
    unit_system: 'semester',
    grade: 'A',
  },
  CT: {
    programme: 'Framework30',
    guarantee:
      'Framework30 (FW30): the CSCU general-education core for CT State transfer degrees, at ' +
      'least 30 credits across ten categories (BR 12-024 / Policy 1.05; Policy 1.26, June ' +
      '2024). A completed Transfer Ticket associate degree gives guaranteed admission and ' +
      'junior standing at Central, Eastern, Southern and Western Connecticut State and ' +
      'Charter Oak with a 2.0 GPA, and is designed to leave only 60 credits of the ' +
      'bachelor\'s. Since June 2024, CT State GE-core courses map category-to-category onto ' +
      'each CSCU four-year\'s GE core, subject to the receiving institution\'s grade rules.',
    authority:
      'CSCU Board of Regents Policy 1.05 (BR 12-024) and Policy 1.26',
    source_url: 'https://www.ct.edu/policies/transfer-and-articulation-policy',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.ct.edu/policies/transfer-and-articulation-policy' },
    unit_system: 'semester',
    grade: 'A−',
  },
  DC: {
    programme: 'none — one public university',
    guarantee:
      'No statewide general-education transfer instrument exists.',
    authority:
      '—',
    source_url: '',
    unit_system: 'semester',
    exists: false,
    grade: 'A',
  },
  DE: {
    programme: 'none — Delaware Tech Connected Degrees',
    guarantee:
      'No statewide general-education transfer instrument. programme-to-programme',
    authority:
      'no statewide instrument',
    source_url: '',
    unit_system: 'semester',
    exists: false,
    grade: 'B',
  },
  GA: {
    programme: 'Core IMPACTS',
    guarantee:
      'Core IMPACTS (USG BoR Policy 3.3.1, approved 2023-10-04, full implementation Fall ' +
      '2024): 42 sem across seven areas (Institutional Priority ≥ 3 · Mathematics ≥ 3 · ' +
      'Citizenship ≥ 3 · Humanities ≥ 6 · Writing ≥ 6 · STEM ≥ 7, incl. ≥ 4 lab, with 10 the ' +
      'norm · Social Sciences ≥ 3). Courses completed in an area at one USG institution or ' +
      'eCore transfer to the same area at any other USG institution, even if the area is ' +
      'incomplete; excess credit is applied to another area.',
    authority:
      'USG Board of Regents Policy 3.3.1',
    source_url: 'https://www.usg.edu/policymanual/section3/C338/',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.usg.edu/policymanual/section3/C338/' },
    unit_system: 'semester',
    grade: 'A',
  },
  HI: {
    programme: 'UH system general-education core',
    guarantee:
      'University of Hawaiʻi system transfer policy (EP 5.209). An AA from any accredited ' +
      'institution satisfies the general-education requirements at every UH baccalaureate ' +
      'campus, and GE completed at one UH campus satisfies GE at any UH campus. A UH ' +
      'Community College AA gives automatic general admission with junior standing to UH ' +
      'Mānoa, Hilo or West Oʻahu (not to selective programs). From Fall 2027 a UH AS does the ' +
      'same for students who declared the AS major in Fall 2025 or later. Within UH, D or ' +
      'better transfers.',
    authority:
      'University of Hawaiʻi Executive Policy EP 5.209',
    source_url: 'https://www.hawaii.edu/policy/ep5.209',
    unit_system: 'semester',
    grade: 'A−',
  },
  IA: {
    programme: 'none statutory — statewide AA/AS Articulation Agreements',
    guarantee:
      'Statewide AA articulation agreement between Iowa\'s community colleges and the three ' +
      'Regent universities (reaffirmed 2026-04-10): an AA of ≥ 60 transferable credits (up to ' +
      '16 CTE), including ≥ 40 GE credits, with a 2.0 GPA, meets GE at the Regent ' +
      'universities, except world-language proficiency set by each university. Without the ' +
      'AA, transfer is course by course.',
    authority:
      'Iowa Code § 260C.14(23), § 262.9(32); IAC 281—ch. 21',
    source_url: 'https://www.iowaregents.edu/media/cms/2025_report_773B8C1064A8D.pdf',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.iowaregents.edu/media/cms/2025_report_773B8C1064A8D.pdf' },
    unit_system: 'semester',
    exists: false,
    grade: 'A−',
  },
  ID: {
    programme: 'GEM — six Ways of Knowing',
    guarantee:
      'GEM — six Ways of Knowing. 36 sem. AA/AS transfers to any Idaho public four-year; ' +
      'others get a GEM course review.',
    authority:
      'SBOE Governing Policies III.N, III.V',
    source_url: '',
    unit_system: 'semester',
    grade: 'B',
  },
  IL: {
    programme: 'IAI General Education Core Curriculum',
    guarantee:
      'IAI General Education Core Curriculum (GECC). 37–41 sem / 12–13 courses. All publics ' +
      'must maintain a complete package; completed package bars further lower-division GE.',
    authority:
      '110 ILCS 152 (P.A. 103-469, eff. 2024-01-01)',
    source_url: 'https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3717&ChapterID=18',
    verified: { confidence: 'statute', as_of: '2026-10-01', source_url: 'https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3717&ChapterID=18' },
    unit_system: 'semester',
    grade: 'A',
  },
  IN: {
    programme: 'Indiana College Core',
    guarantee:
      'Indiana College Core. 30 sem; six competency areas, ≥ 3 each. 2.0 GPA; ≥ 15 credits ' +
      'from the awarding institution; exam credit re-evaluated by the receiver.',
    authority:
      'IC 21-42-3; IC 21-42-5 (Core Transfer Library); SEA 204-2026',
    source_url: 'https://transferin.net/ways-to-earn-credit/statewide-transfer-general-education-core-stgec/',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://transferin.net/ways-to-earn-credit/statewide-transfer-general-education-core-stgec/' },
    unit_system: 'semester',
    grade: 'A',
  },
  KS: {
    programme: 'Systemwide General Education',
    guarantee:
      'Systemwide General Education (seven buckets). 34–35 sem. Completed package transfers ' +
      'as a block; AA/AS/AFA.',
    authority:
      'KBOR Policy ch. III.A.18 (Fall 2024)',
    source_url: 'https://kansasregents.gov/academic_affairs/general-education/students-who-completed-ge',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://kansasregents.gov/academic_affairs/general-education/students-who-completed-ge' },
    unit_system: 'semester',
    grade: 'A−',
  },
  KY: {
    programme: 'General Education Transfer Policy',
    guarantee:
      'Kentucky General Education Transfer Policy (CPE, effective Fall 2012; KRS 164.2951): a ' +
      'statewide minimum of 30 unduplicated sem hours in five categories (Communications 6–9 ' +
      '· Quantitative Reasoning 3–6 · Arts & Humanities 6–9 · Natural Sciences 3–7 · Social & ' +
      'Behavioral Sciences 6–9), certified at three levels (category, core, full). Graduates ' +
      'of a council-approved AA or AS are deemed, on admission to a public university, to ' +
      'have met all GE requirements, and are admitted with junior standing. (KCTCS\'s own GE ' +
      'program is 33 hours, 15 of them at KCTCS for full certification.)',
    authority:
      'KRS 164.2951; CPE General Education Transfer Policy (effective Fall 2012; HB 160 of 2011)',
    source_url: 'https://cpe.ky.gov/policies/academicaffairs/genedtransferpolicy.pdf',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://cpe.ky.gov/policies/academicaffairs/genedtransferpolicy.pdf' },
    unit_system: 'semester',
    grade: 'A',
  },
  LA: {
    programme: 'Board of Regents GE + Louisiana Transfer Degree',
    guarantee:
      'Louisiana Transfer Associate Degree (AA/LT, AS/LT): a 39-hour GE block (English 6 · ' +
      'Math/Analytical Reasoning 6 · Natural Sciences 9 · Humanities 9 · Social/Behavioral 6 ' +
      '· Fine Arts 3) plus 21 hours. With a C or better in every course, it guarantees ' +
      'admission to a Louisiana public four-year, junior standing, transfer of all 60 hours ' +
      'and completion of the GE block.',
    authority:
      'R.S. 17:3161–3169 (Act 356 of 2009); Act 308 of 2022; BoR Academic Affairs Policies ' +
      '2.16, 2.25',
    source_url: 'https://www.laregents.edu/wp-content/uploads/2018/06/Advisors_Guide_to_Transfer_Degree.pdf',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.laregents.edu/wp-content/uploads/2018/06/Advisors_Guide_to_Transfer_Degree.pdf' },
    unit_system: 'semester',
    grade: 'A−',
  },
  MA: {
    programme: 'MassTransfer Gen Ed Foundation',
    guarantee:
      'MassTransfer Gen Ed Foundation. 34 sem (STEM 28). 2.0 for the block; A2B: 2.5 ' +
      'guaranteed admission, 3.0 tuition credit.',
    authority:
      'BHE MassTransfer policy',
    source_url: 'https://www.mass.edu/masstransfer/gened/home.asp',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.mass.edu/masstransfer/gened/home.asp' },
    unit_system: 'semester',
    grade: 'A−/B',
  },
  MD: {
    programme: 'General-education programme and transfer regulations',
    guarantee:
      'Maryland general-education and transfer regulations (COMAR 13B.06.01–.02). A.A./A.S. ' +
      'general education is 28–36 credits across five areas: arts & humanities, social & ' +
      'behavioral sciences, biological & physical sciences (one lab), mathematics, and ' +
      'English composition with C– or better. A receiving Maryland public institution must ' +
      'accept any completed course that met a GE requirement at the sending institution and ' +
      'apply it to the same GE area, or failing that a GE elective, whether or not it has an ' +
      'equivalent course.',
    authority:
      'COMAR 13B.06.01–.02',
    source_url: 'https://regs.maryland.gov/us/md/exec/comar/13B.06.02.09',
    verified: { confidence: 'statute', as_of: '2026-10-01', source_url: 'https://regs.maryland.gov/us/md/exec/comar/13B.06.02.09' },
    unit_system: 'semester',
    grade: 'A−',
  },
  ME: {
    programme: 'MCCS–UMS Block Transfer of General Education',
    guarantee:
      'UMS–MCCS General Education Transfer Block: ≥ 34 credits of general education completed ' +
      'at an MCCS college, with C– or better in every course, block-transfers to the GE ' +
      'requirements at University of Maine System campuses. UMaine, for example, still ' +
      'requires ≥ 3 credits in Human Values & Social Context, a Writing Intensive course in ' +
      'the major, a capstone, and any GE courses the major specifies.',
    authority:
      'inter-system agreement (effective Fall 2015)',
    source_url: 'https://www.maine.edu/students/maine-community-college-transfer-initiatives-resources/',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.maine.edu/students/maine-community-college-transfer-initiatives-resources/' },
    unit_system: 'semester',
    grade: 'B',
  },
  MI: {
    programme: 'Michigan Transfer Agreement',
    guarantee:
      'Michigan Transfer Agreement (MTA): ≥ 30 sem credits in a set distribution (2 English ' +
      'composition, or 1 + 1 communications · 1 mathematics · 2 social sciences · 2 ' +
      'humanities & fine arts · 2 natural sciences incl. 1 lab), with ≥ 2.0 in each course ' +
      'and ≥ 1 credit at the college awarding the MTA. It fulfils a portion of the ' +
      'lower-division GE at participating four-years; all 15 Michigan public universities are ' +
      'listed as participating.',
    authority:
      'MACRAO MTA Guidelines (Fall 2019, ed. Feb 2020); 2012 appropriations boilerplate',
    source_url: 'https://www.mitransfer.org/michigan-transfer-agreement',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.mitransfer.org/michigan-transfer-agreement' },
    unit_system: 'semester',
    grade: 'A',
  },
  MN: {
    programme: 'Minnesota Transfer Curriculum',
    guarantee:
      'Minnesota Transfer Curriculum (MnTC): ≥ 40 sem in 10 goal areas. Completing it at one ' +
      'Minnesota State college or university gives credit for all lower-division GE on ' +
      'admission to another; receivers accept MnTC courses graded A through D–, and ' +
      'recognition of the full MnTC requires a 2.0 cumulative MnTC GPA (Board Policy 3.21; ' +
      'Procedure 3.21.1).',
    authority:
      'Minnesota State Board Policy 3.21 and Procedure 3.21.1',
    source_url: 'https://www.minnstate.edu/board/policy/321.html',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.minnstate.edu/board/policy/321.html' },
    unit_system: 'semester',
    grade: 'A',
  },
  MO: {
    programme: 'CORE 42',
    guarantee:
      'CORE 42. 42 sem (Soc/Behavioral 9 · Written 6 · Oral 3 · Natural Sci 7 · Math 3 · ' +
      'Humanities & Fine Arts 9 · electives 5). CORE 42 Complete transfers as a block; each ' +
      'MOTR course transfers one-to-one; independents may join.',
    authority:
      'RSMo §§ 178.785–178.789; 6 CSR 10-3.020',
    source_url: 'https://dhewd.mo.gov/higher-education/academic-affairs/core-42',
    unit_system: 'semester',
    grade: 'A',
  },
  MS: {
    programme: 'IHL 30-hour core + IHL–MCCB Articulation Agreement',
    guarantee:
      'IHL 30-hour core (Board Policy 512: English Composition 6 · College Algebra, ' +
      'Quantitative Reasoning or higher 3 · Natural Science 6 · Humanities & Fine Arts 9 · ' +
      'Social/Behavioral Science 6). An Associate of Arts graduate of a Mississippi community ' +
      'college who completes the core with C or better in each core course satisfies the IHL ' +
      'core at every IHL university (Policy 517). The receiving university\'s own GE may go ' +
      'beyond the core, and courses articulate through the IHL–MCCB Articulation Agreement ' +
      '(MATT).',
    authority:
      'IHL Board Policies 512 and 517; IHL–MCCB Articulation Agreement',
    source_url: 'https://www.mississippi.edu/sites/default/files/ihl/files/policiesandbylaws.pdf',
    verified: { confidence: 'published', as_of: '2026-10-01', source_url: 'https://www.mississippi.edu/sites/default/files/ihl/files/policiesandbylaws.pdf' },
    unit_system: 'semester',
    grade: 'A−',
  },
  MT: {
    programme: 'MUS Transferable Core',
    guarantee:
      'MUS Transferable Core. 30 sem (natural sci 6 · social sci/history 6 · math 3 · ' +
      'communication 6 · humanities/fine arts 6 · cultural diversity 3). Minimum C– per ' +
      'course; ≥ 20 credits may roll as a partial block; covers MUS, 3 community colleges, 7 ' +
      'tribal colleges.',
    authority:
      'BoR Policy 301.10; 301.5.3; 301.5.5 (common numbering)',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  NC: {
    programme: 'Comprehensive Articulation Agreement — UGETC',
    guarantee:
      'Comprehensive Articulation Agreement — UGETC. UGETC ≥ 30 within a 60–61 sem AA/AS. C ' +
      'or better each course; 2.0 GPA; completed AA/AS → junior status; TAAP guarantees one ' +
      'of 16 campuses, not a named one.',
    authority:
      'S.L. 2013-72; CAA (2014 rev.); Transfer Course List 2026.1',
    source_url: 'https://www.nccommunitycolleges.edu/students/enrollment-and-registration/university-transfer/articulation-agreements/comprehensive-articulation-agreement/',
    unit_system: 'semester',
    grade: 'A',
  },
  ND: {
    programme: 'GERTA — General Education Requirements Transfer Agreement',
    guarantee:
      'GERTA — General Education Requirements Transfer Agreement. ≥ 36 sem (ND: category ' +
      'codes). Completed lower-division GE or AA/AS = GE-complete at any signatory; NDUS + 5 ' +
      'tribal colleges + 1 private.',
    authority:
      'SBHE Policy 403.7; Procedure 403.7.1',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  NE: {
    programme: 'none statutory — Nebraska Transfer Initiative',
    guarantee:
      'No statewide general-education transfer instrument. per agreement',
    authority:
      'signed inter-institutional agreement',
    source_url: '',
    unit_system: 'semester',
    exists: false,
    grade: 'A price · C rest',
  },
  NH: {
    programme: 'none — NH Transfer + dual admission',
    guarantee:
      'No statewide general-education transfer instrument exists.',
    authority:
      '—',
    source_url: '',
    unit_system: 'semester',
    exists: false,
    grade: 'B',
  },
  NJ: {
    programme: 'Comprehensive State-Wide Transfer Agreement',
    guarantee:
      'Comprehensive State-Wide Transfer Agreement (Lampitt Law). 60–64 sem block (AA 45 / AS ' +
      '30 GE, recalled). AA/AS transfers whole as the first half of the bachelor\'s; AAS/AFA ' +
      'generally excluded.',
    authority:
      'N.J.S.A. 18A:62-46 et seq.',
    source_url: '',
    unit_system: 'semester',
    grade: 'A− statute · C rest',
  },
  NM: {
    programme: 'New Mexico General Education Curriculum',
    guarantee:
      'New Mexico General Education Curriculum. 31 sem = 22 fixed + 9 flexible (AAS 15). ' +
      'Fixed-22 courses transfer to the same area; improperly forced repeats must be ' +
      'reimbursed by the receiving institution.',
    authority:
      'NMSA 1978 ch. 21; NMAC 5.55.6 (GE), 5.55.5 (common numbering), 5.55.7 (transfer ' +
      'modules)',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  NV: {
    programme: 'NSHE transfer rules — AA/AS/AB satisfies lower-division GE',
    guarantee:
      'NSHE transfer rules — AA/AS/AB satisfies lower-division GE. AA/AS block. includes ' +
      'statutory US/Nevada constitutions requirement (NRS 396.500, recalled).',
    authority:
      'NSHE Board of Regents Handbook Title 4 ch. 14 (recalled)',
    source_url: '',
    unit_system: 'semester',
    grade: 'A price · C rest',
  },
  NY: {
    programme: 'SUNY General Education Framework + Transfer Paths',
    guarantee:
      'SUNY General Education Framework + Transfer Paths; CUNY Pathways Common Core. SUNY 30 ' +
      'sem in ≥ 7 of 10 areas (4 mandatory); CUNY 12 required + 18 flexible + 6–12 college ' +
      'option. SUNY/CUNY AA/AS graduates guaranteed a SUNY four-year seat (not a named ' +
      'campus); seamless transfer needs C in Transfer Path courses; CUNY AA/AS = Common Core ' +
      'complete.',
    authority:
      'SUNY BoT Res. 2021-48, amended by Res. 2024-64 (new students from Fall 2026); CUNY BoT ' +
      '(2011)',
    source_url: 'https://www.suny.edu/attend/get-started/transfer-students/suny-transfer-policies/',
    unit_system: 'semester',
    grade: 'A− (SUNY) · B (CUNY)',
  },
  OH: {
    programme: 'Ohio Transfer 36',
    guarantee:
      'Ohio Transfer 36. 36–40 sem. Ohio Guaranteed Transfer Pathways: associate → junior ' +
      'standing.',
    authority:
      'ORC § 3333.16 ff.; Ohio Articulation & Transfer Policy (July 2025)',
    source_url: 'https://transfercredit.ohio.gov/initiatives-upd/ohio-transfer-36',
    unit_system: 'semester',
    grade: 'A',
  },
  OK: {
    programme: 'State Regents GE minimum + AA/AS transfer guarantee',
    guarantee:
      'State Regents GE minimum + AA/AS transfer guarantee. 37 sem minimum. AA/AS from a ' +
      'state-system college satisfies all lower-division GE at any state-system university.',
    authority:
      'OSRHE Academic Affairs Policy ch. 3 (rev. 2025-09-04), §§ 3.11, 3.15; 70 O.S. § 3206.1',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  OR: {
    programme: 'Core Transfer Map / Oregon Transfer Module / AAOT / Major Transfer Maps',
    guarantee:
      'Core Transfer Map / Oregon Transfer Module / AAOT / Major Transfer Maps. 30 / 45 / 90 ' +
      'QUARTER credits. CTM transfers as a block if public-university admission requirements ' +
      'are met.',
    authority:
      'SB 233 (2021); ORS 350.423–.429; HB 2998 (2017); OAR 715-025',
    source_url: 'https://www.oregon.gov/highered/about/transfer/pages/transfer-compass.aspx',
    unit_system: 'quarter',
    grade: 'A',
  },
  PA: {
    programme: '30-Credit Transfer Framework + programme-to-programme degrees',
    guarantee:
      '30-Credit Transfer Framework + programme-to-programme degrees. 30 sem. P2P associate ' +
      'degrees give full junior standing; state-related universities participate only partly.',
    authority:
      'Act 114 of 2006; Act 50 of 2009; 24 P.S. § 20-2002-C(d)',
    source_url: '',
    unit_system: 'semester',
    grade: 'A',
  },
  RI: {
    programme: 'Joint Admissions Agreement',
    guarantee:
      'Joint Admissions Agreement (three institutions). ≥ 32 GE credits apply. 2.4 GPA ' +
      'guaranteed admission; up to 30% tuition discount at 3.0+.',
    authority:
      'RIOPC policy S-12',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−/B',
  },
  SC: {
    programme: 'CHE Statewide Articulation Agreement — \'list of 86\' courses + Transfer Blocks',
    guarantee:
      'CHE Statewide Articulation Agreement — \'list of 86\' courses + Transfer Blocks. course ' +
      'list + blocks; AA/AS = ≥ 60 hrs and junior status. CHE audit: only 31 of the 86 code ' +
      'as direct equivalents; a new statewide AA/AS GE agreement is being negotiated.',
    authority:
      'CHE Transfer Policy (May 2022); Proviso 117.152',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−/B',
  },
  SD: {
    programme: 'System General Education Requirements',
    guarantee:
      'System General Education Requirements (six goals). 30 sem (written 6 · oral 3 · social ' +
      'sci 6 · arts & humanities 6 · math 3 · natural sci 6). Completed at one regental ' +
      'campus = complete at all; technical colleges sit under a separate board.',
    authority:
      'SDBOR Policy 2.3.7; Guideline 2.3.7.A (since Fall 2017)',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  TN: {
    programme: '41-hour general-education core + Tennessee Transfer Pathways',
    guarantee:
      '41-hour general-education core + Tennessee Transfer Pathways. 41 core / 60 pathway ' +
      'sem. Completed pathway = all lower-division GE and pre-major met.',
    authority:
      'T.C.A. § 49-7-202 (Complete College Tennessee Act, 2010)',
    source_url: 'https://www.tntransferpathway.org/',
    unit_system: 'semester',
    grade: 'A−/B',
  },
  UT: {
    programme: 'USHE General Education',
    guarantee:
      'USHE General Education. 30–39 sem (recalled). If the sender certifies an area ' +
      'satisfied the receiver may not require more.',
    authority:
      'Board Policy R470; Utah Code Title 53H — § 53H-3-604 (common numbering), § 53H-3-702 ' +
      '(prior learning); formerly 53B-16',
    source_url: '',
    unit_system: 'semester',
    grade: 'A',
  },
  VA: {
    programme: 'Passport and Uniform Certificate of General Studies',
    guarantee:
      'Passport and Uniform Certificate of General Studies. 16 / 30–32 sem. C or better; ' +
      '3-year completion window; Guaranteed Admission Agreements set different GPA floors per ' +
      'university.',
    authority:
      'Code of Va. § 23.1-907',
    source_url: 'https://www.transfervirginia.org/content/general-education-transfer-credit-agreementpassport-and-ucgs',
    unit_system: 'semester',
    grade: 'A',
  },
  VT: {
    programme: 'Vermont Transfer Guarantee',
    guarantee:
      'Vermont Transfer Guarantee (CCV associate → partner colleges) + VSCS transfer policy. ' +
      'CCV GE accepted as a block. CCV associate + GPA 2.0 / 2.5 / 3.0 by receiver — Vermont ' +
      'State University 2.0, min C–; guaranteed admission, junior status, no application fee; ' +
      'includes Champlain, Norwich, Saint Michael\'s.',
    authority:
      'VSCS Policy 108; CCV partnership agreements',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
  WA: {
    programme: 'Direct Transfer Agreement',
    guarantee:
      'Direct Transfer Agreement (DTA) associate. 90 QUARTER credits. 2.0 GPA (recalled); ≤ ' +
      '15 quarter credits restricted electives.',
    authority:
      'ICRC Handbook; RCW 28B.10.054',
    source_url: 'https://www.sbctc.edu/colleges-staff/programs-services/transfer/direct-transfer-agreement.aspx',
    unit_system: 'quarter',
    grade: 'A',
  },
  WI: {
    programme: 'Universal Credit Transfer Agreement — the \'72-Credit Transfer Rule\'',
    guarantee:
      'Universal Credit Transfer Agreement — the \'72-Credit Transfer Rule\'. array of ≥ 72 sem ' +
      'credits of core GE (not 30). Covers UW and WTCS; tribal and private colleges may opt ' +
      'in; no agreement may limit transfer inside UW.',
    authority:
      'Wis. Stat. § 36.31(2m)(b) (revised 2019-11-21; in force from 2022-23); UW SYS 135; ' +
      'agreement revised Fall 2024',
    source_url: '',
    unit_system: 'semester',
    grade: 'A',
  },
  WV: {
    programme: 'Core Coursework Transfer Agreement',
    guarantee:
      'Core Coursework Transfer Agreement. ≤ 35 sem. general-studies hours transfer by area, ' +
      'not as direct equivalents.',
    authority:
      '133 CSR 17 / 135 CSR 17; W. Va. Code § 18B-14-2',
    source_url: 'https://www.wvhepc.edu/',
    unit_system: 'semester',
    grade: 'A',
  },
  WY: {
    programme: 'Statewide Common Course Numbering System + UW University Studies Program',
    guarantee:
      'Statewide Common Course Numbering System + UW University Studies Program. no fixed ' +
      'block; AA/AS aligns to lower-division USP. CCNS courses transfer with identical ' +
      'equivalency (70% content rule).',
    authority:
      '057-4 Wyo. Code R. § 4-4',
    source_url: '',
    unit_system: 'semester',
    grade: 'A−',
  },
};


/**
 * Aid, imported from the research and deliberately NOT all treated alike.
 *
 * `kind` decides whether the engine may subtract a programme from a price or
 * must only show it. Two kinds are safe to apply — a need-tested waiver of the
 * fee itself, and a promise that is genuinely universal in the state. Every
 * other kind is gated on something this app never asks about: how old you are,
 * what year you left school, what you intend to study, whether you served.
 *
 * Subtracting one of those quotes a student a price they may never be offered.
 * That is wrong in their favour, which is the direction nobody reports, so a
 * compound kind is read as its MOST gated half rather than its most generous.
 *
 * Dual-enrolment programmes carry `kind: 'other'` throughout: they are never a
 * discount on the plan the app is pricing, they are a different and usually
 * cheaper way to get the same credit, and they belong on screen as an
 * opportunity rather than in an arithmetic.
 */
const AID: Partial<Record<StateCode,
  { fee_waiver?: AidProgram; dual_enrollment?: AidProgram }>> = {
  AL: {
    dual_enrollment: {
      name: 'ACCS dual enrolment',
      kind: 'other',
      note:
        'ACCS dual enrolment; state CTE scholarships (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  AK: {
    dual_enrollment: {
      name: 'Regents\' Policy ch. 09.02',
      kind: 'other',
      note:
        'Regents\' Policy ch. 09.02; district middle colleges.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  AZ: {
    dual_enrollment: {
      name: 'priced locally',
      kind: 'other',
      note:
        'priced locally.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  AR: {
    fee_waiver: {
      name: 'Arkansas Future Grant',
      kind: 'field_restricted',
      note:
        'Arkansas Future Grant.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Concurrent Challenge Scholarship (recalled)',
      kind: 'other',
      note:
        'Concurrent Challenge Scholarship (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  CO: {
    fee_waiver: {
      name: 'Colorado Promise',
      kind: 'tax_credit',
      note:
        'Colorado Promise — refundable tax credit, ≤ $90k (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Concurrent Enrollment, district-paid (recalled)',
      kind: 'other',
      note:
        'Concurrent Enrollment, district-paid (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  CT: {
    fee_waiver: {
      name: 'Mary Ann Handley Award (formerly PACT)',
      kind: 'recent_grad',
      note:
        'Mary Ann Handley Award (formerly PACT).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'CSCU dual enrolment',
      kind: 'other',
      note:
        'CSCU dual enrolment.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  DE: {
    fee_waiver: {
      name: 'SEED and SEED+ (14 Del. C. ch. 34)',
      kind: 'recent_grad',
      note:
        'SEED and SEED+ (14 Del. C. ch. 34).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'district-paid (recalled)',
      kind: 'other',
      note:
        'district-paid (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  DC: {
    fee_waiver: {
      name: 'DCTAG: up to $15,000/yr and $75,000 lifetime at out-of-state publics from 2026-27 ($3,750/yr private tier)',
      kind: 'portable_grant',
      note:
        'DCTAG: up to $15,000/yr and $75,000 lifetime at out-of-state publics from ' +
        '2026-27 ($3,750/yr private tier).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'OSSE consortium (recalled)',
      kind: 'other',
      note:
        'OSSE consortium (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  GA: {
    fee_waiver: {
      name: 'HOPE Career Grant',
      kind: 'field_restricted',
      note:
        'HOPE Career Grant.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Dual Enrollment, state-funded to 30 hrs (recalled)',
      kind: 'other',
      note:
        'Dual Enrollment, state-funded to 30 hrs (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  HI: {
    fee_waiver: {
      name: 'Hawaiʻi Promise',
      kind: 'need_waiver',
      note:
        'Hawaiʻi Promise.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Early College (free, recalled)',
      kind: 'other',
      note:
        'Early College (free, recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  ID: {
    fee_waiver: {
      name: 'Idaho LAUNCH',
      kind: 'field_restricted',
      note:
        'Idaho LAUNCH.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Advanced Opportunities',
      kind: 'other',
      note:
        'Advanced Opportunities — $4,125/student, ≤ $75/credit, also pays AP/CLEP fees ' +
        '(recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  IL: {
    dual_enrollment: {
      name: 'Dual Credit Quality Act',
      kind: 'other',
      note:
        'Dual Credit Quality Act; priced by district.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  IN: {
    fee_waiver: {
      name: '21st Century Scholars',
      kind: 'field_restricted',
      note:
        '21st Century Scholars; Workforce Ready Grant.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'priority courses free (recalled)',
      kind: 'other',
      note:
        'priority courses free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  IA: {
    fee_waiver: {
      name: 'Last-Dollar Scholarship',
      kind: 'field_restricted',
      note:
        'Last-Dollar Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Senior Year Plus',
      kind: 'other',
      note:
        'Senior Year Plus — Iowa Code ch. 261E.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  KS: {
    fee_waiver: {
      name: 'Kansas Promise',
      kind: 'field_restricted',
      note:
        'Kansas Promise.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Excel in CTE free',
      kind: 'other',
      note:
        'Excel in CTE free; academic not (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  KY: {
    fee_waiver: {
      name: 'Work Ready Kentucky Scholarship',
      kind: 'field_restricted',
      note:
        'Work Ready Kentucky Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Dual Credit Scholarship',
      kind: 'other',
      note:
        'Dual Credit Scholarship — 2 courses (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  LA: {
    fee_waiver: {
      name: 'MJ Foster Promise',
      kind: 'adult',
      note:
        'MJ Foster Promise; TOPS Tech.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'statewide, priced locally',
      kind: 'other',
      note:
        'statewide, priced locally.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  ME: {
    fee_waiver: {
      name: 'Free College Scholarship',
      kind: 'recent_grad',
      note:
        'Free College Scholarship — class of 2026 covered, tuition only, 150% of ' +
        'programme time.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Early College, ≤ 12 free credits/yr (recalled)',
      kind: 'other',
      note:
        'Early College, ≤ 12 free credits/yr (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MD: {
    fee_waiver: {
      name: 'Community College Promise Scholarship',
      kind: 'other',
      note:
        'Community College Promise Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Blueprint for Maryland\'s Future (free, recalled)',
      kind: 'other',
      note:
        'Blueprint for Maryland\'s Future (free, recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MA: {
    fee_waiver: {
      name: 'MassEducate (+ MassReconnect)',
      kind: 'universal_promise',
      note:
        'MassEducate (+ MassReconnect) — $137M FY27 per one legislative source.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'CDEP / Early College',
      kind: 'other',
      note:
        'CDEP / Early College.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MI: {
    fee_waiver: {
      name: 'Community College Guarantee',
      kind: 'recent_grad',
      note:
        'Community College Guarantee; Michigan Reconnect (25+); Tuition Incentive ' +
        'Program.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'district pays most (recalled)',
      kind: 'other',
      note:
        'district pays most (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MN: {
    fee_waiver: {
      name: 'North Star Promise (< $80k)',
      kind: 'need_waiver',
      note:
        'North Star Promise (< $80k).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'PSEO',
      kind: 'other',
      note:
        'PSEO — free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MS: {
    fee_waiver: {
      name: 'HELP grant',
      kind: 'merit',
      note:
        'HELP grant; MTAG.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'statewide, priced locally',
      kind: 'other',
      note:
        'statewide, priced locally.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MO: {
    fee_waiver: {
      name: 'A+ Scholarship',
      kind: 'recent_grad',
      note:
        'A+ Scholarship; Fast Track.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'need-based scholarship (recalled)',
      kind: 'other',
      note:
        'need-based scholarship (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  MT: {
    fee_waiver: {
      name: 'American Indian tuition waiver',
      kind: 'need_waiver',
      note:
        'American Indian tuition waiver.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'One-Two-Free (recalled)',
      kind: 'other',
      note:
        'One-Two-Free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NE: {
    dual_enrollment: {
      name: 'MCC CollegeNow! tuition waived',
      kind: 'other',
      note:
        'MCC CollegeNow! tuition waived; ACE scholarship elsewhere.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NV: {
    fee_waiver: {
      name: 'Nevada Promise',
      kind: 'recent_grad',
      note:
        'Nevada Promise.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'reduced fee',
      kind: 'other',
      note:
        'reduced fee.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NH: {
    dual_enrollment: {
      name: 'Running Start (recalled)',
      kind: 'other',
      note:
        'Running Start (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NJ: {
    fee_waiver: {
      name: 'Community College Opportunity Grant (recalled)',
      kind: 'need_waiver',
      note:
        'Community College Opportunity Grant (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'varies',
      kind: 'other',
      note:
        'varies.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NM: {
    fee_waiver: {
      name: 'Opportunity Scholarship',
      kind: 'universal_promise',
      note:
        'Opportunity Scholarship; Lottery Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'NMSA 21-1-1.2',
      kind: 'other',
      note:
        'NMSA 21-1-1.2; NMAC 6.30.7 — tuition-free.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NY: {
    fee_waiver: {
      name: 'TAP',
      kind: 'field_restricted',
      note:
        'TAP; Excelsior; SUNY/CUNY Reconnect (NYS Opportunity Promise, ages 25–55, ' +
        'high-demand fields, from Fall 2025).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'CUNY College Now',
      kind: 'other',
      note:
        'CUNY College Now; SUNY varies.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  NC: {
    fee_waiver: {
      name: 'Next NC Scholarship',
      kind: 'need_waiver',
      note:
        'Next NC Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Career & College Promise',
      kind: 'other',
      note:
        'Career & College Promise — tuition-free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  OH: {
    dual_enrollment: {
      name: 'College Credit Plus',
      kind: 'other',
      note:
        'College Credit Plus — free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  OK: {
    fee_waiver: {
      name: 'Oklahoma\'s Promise (enrol by grade 11)',
      kind: 'need_waiver',
      note:
        'Oklahoma\'s Promise (enrol by grade 11).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'concurrent-enrolment tuition waiver',
      kind: 'other',
      note:
        'concurrent-enrolment tuition waiver.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  OR: {
    fee_waiver: {
      name: 'Oregon Promise',
      kind: 'recent_grad',
      note:
        'Oregon Promise.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'mostly free / nominal (recalled)',
      kind: 'other',
      note:
        'mostly free / nominal (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  PA: {
    dual_enrollment: {
      name: 'priced by college',
      kind: 'other',
      note:
        'priced by college.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  RI: {
    fee_waiver: {
      name: 'RI Promise (permanent)',
      kind: 'recent_grad',
      note:
        'RI Promise (permanent); Hope Scholarship at RIC (pilot ending with class of ' +
        '2026).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'PrepareRI',
      kind: 'other',
      note:
        'PrepareRI — free (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  SC: {
    fee_waiver: {
      name: 'Lottery Tuition Assistance',
      kind: 'field_restricted',
      note:
        'Lottery Tuition Assistance; SC WINS; Workforce Scholarships for the Future.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'technical-college dual enrolment',
      kind: 'other',
      note:
        'technical-college dual enrolment.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  SD: {
    fee_waiver: {
      name: 'Build Dakota',
      kind: 'field_restricted',
      note:
        'Build Dakota; Freedom Scholarship.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'High School Dual Credit at a reduced rate',
      kind: 'other',
      note:
        'High School Dual Credit at a reduced rate.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  TN: {
    fee_waiver: {
      name: 'Tennessee Promise',
      kind: 'recent_grad',
      note:
        'Tennessee Promise; Tennessee Reconnect.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Dual Enrollment Grant',
      kind: 'other',
      note:
        'Dual Enrollment Grant.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  UT: {
    fee_waiver: {
      name: 'Utah Promise Grant',
      kind: 'need_waiver',
      note:
        'Utah Promise Grant.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: '$5/credit cap (recalled)',
      kind: 'other',
      note:
        '$5/credit cap (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  VT: {
    fee_waiver: {
      name: '802 Opportunity',
      kind: 'need_waiver',
      note:
        '802 Opportunity; Free Degree Promise.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Act 77',
      kind: 'other',
      note:
        'Act 77 — two free courses + Early College.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  VA: {
    fee_waiver: {
      name: 'G3',
      kind: 'field_restricted',
      note:
        'G3.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Passport/UCGS courses at no cost (recalled)',
      kind: 'other',
      note:
        'Passport/UCGS courses at no cost (recalled).',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  WA: {
    fee_waiver: {
      name: 'Washington College Grant',
      kind: 'need_waiver',
      note:
        'Washington College Grant — full award to $83,500 (family of 4), partial to ≈ ' +
        '$139,500.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'Running Start',
      kind: 'other',
      note:
        'Running Start; College in the High School free since 2023.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  WV: {
    fee_waiver: {
      name: 'WV Invests',
      kind: 'field_restricted',
      note:
        'WV Invests.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: '133 CSR 19 pilot',
      kind: 'other',
      note:
        '133 CSR 19 pilot.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  WI: {
    dual_enrollment: {
      name: 'Early College Credit Program',
      kind: 'other',
      note:
        'Early College Credit Program; Start College Now.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
  WY: {
    fee_waiver: {
      name: 'Hathaway',
      kind: 'merit',
      note:
        'Hathaway; Wyoming\'s Tomorrow.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
    dual_enrollment: {
      name: 'W.S. § 21-20-201',
      kind: 'other',
      note:
        'W.S. § 21-20-201.',
        provenance: {
          source_url: '',
          as_of: '2026-09-20',
          confidence: 'needs_check',
          note:
            'From the statewide research in data/research/, not from the programme\u2019s ' +
            'own page. Terms, income ceilings and eligibility years move every cycle \u2014 ' +
            'check the programme itself before you count on it.',
        },
    },
  },
};

/**
 * What each state has published about third-party credit. Compound answers read
 * as their STRONGEST promise, because that is the door a student can try.
 */
const THIRD_PARTY: Record<StateCode, ThirdPartyStance> = {
  AL: {
    kind: 'official_partner',
    detail:
      'Athens State (StraighterLine, Sophia); Alabama State, Alabama A&M (Sophia)',
  },
  AK: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  AZ: {
    kind: 'official_partner',
    detail:
      'ASU Universal Learner Courses: $25 + $400 only if passed, ASU transcript ' +
      'credit (A). Partners: Rio Salado (StraighterLine); Northern Arizona University ' +
      '(Sophia); Univ. of Arizona Global Campus (StraighterLine, Sophia, Saylor, ' +
      'Study.com)',
  },
  AR: {
    kind: 'official_partner',
    detail:
      'Univ. of Arkansas Grantham (StraighterLine; Sophia adviser page); Arkansas ' +
      'State University (Saylor)',
  },
  CA: {
    kind: 'system_policy_permits',
    detail:
      'UC: no credit for third-party transcripts. CSU Credit for Prior Learning ' +
      'Policy (ex-EO 1036): campuses shall credit learning outside formal higher ' +
      'education; ACE-recommended non-collegiate instruction, military or civilian; ' +
      'CSULB caps at 20%',
  },
  CO: {
    kind: 'official_partner',
    detail:
      'I-X lets campuses accept other PLA meeting campus standards. CSU Global ' +
      'partner (StraighterLine, Saylor, Study.com)',
  },
  CT: {
    kind: 'agreement_only',
    detail:
      'Charter Oak State College accepts ACE/NCCRS credit only from providers under ' +
      'agreement — AP, CLEP, CSM Learn, DSST, StraighterLine, Study.com, Sophia; cap ' +
      '90 (bachelor\'s) / 45 (associate)',
  },
  DE: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  DC: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  FL: {
    kind: 'evaluate_on_request_by_law',
    detail:
      'Fla. Stat. § 1004.0961; BOG Reg. 6.020; Rule 6A-14.0304 — must evaluate ' +
      'online/MOOC coursework on request before the first term; policy must describe ' +
      'ACE-recognised credit. FIU is a Saylor partner; Miami Dade accepts ACE but is ' +
      'not a partner',
  },
  GA: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  HI: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  ID: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  IL: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  IN: {
    kind: 'official_partner',
    detail:
      'Purdue Global (StraighterLine, Sophia, Saylor, Study.com); Ivy Tech (Sophia)',
  },
  IA: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  KS: {
    kind: 'official_partner',
    detail:
      'Fort Hays State University (StraighterLine)',
  },
  KY: {
    kind: 'system_policy_permits',
    detail:
      'KCTCS awards credit per ACE\'s National Guide',
  },
  LA: {
    kind: 'official_partner',
    detail:
      'Grambling, McNeese, Southeastern Louisiana (StraighterLine); Southern Univ. at ' +
      'Shreveport (Sophia); LCTCS system, Bossier Parish CC, Central Louisiana ' +
      'Technical CC, South Louisiana CC (Saylor)',
  },
  ME: {
    kind: 'official_partner',
    detail:
      'Univ. of Maine at Presque Isle — YourPace (StraighterLine, Sophia, Study.com)',
  },
  MD: {
    kind: 'official_partner',
    detail:
      'UMGC (StraighterLine, Sophia, Saylor, Study.com); Morgan State (Saylor)',
  },
  MA: {
    kind: 'official_partner',
    detail:
      'Middlesex Community College (Study.com)',
  },
  MI: {
    kind: 'official_partner',
    detail:
      'Central Michigan University (Sophia)',
  },
  MN: {
    kind: 'system_policy_permits',
    detail:
      'Procedure 3.35.1 covers industry credentials, licences, certifications and ' +
      'non-credit instruction',
  },
  MS: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  MO: {
    kind: 'official_partner',
    detail:
      'Univ. of Central Missouri (StraighterLine); Harris-Stowe State (Sophia)',
  },
  MT: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  NE: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  NV: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  NH: {
    kind: 'no_record',
    detail:
      'UNH CPS (ex-Granite State) appeared on an older Saylor list',
  },
  NJ: {
    kind: 'official_partner',
    detail:
      'Thomas Edison State University (StraighterLine, Sophia, Saylor, Study.com — ' +
      'transcript must come direct from Study.com); Rowan — Rohrer College of ' +
      'Business (Sophia adviser page)',
  },
  NM: {
    kind: 'official_partner',
    detail:
      'Central New Mexico CC (StraighterLine, Sophia)',
  },
  NY: {
    kind: 'official_partner',
    detail:
      'SUNY Empire State (StraighterLine, Sophia, Saylor, Study.com; accepts eligible ' +
      'Coursera courses); SUNY Brockport (Sophia); CUNY School of Professional ' +
      'Studies (Saylor)',
  },
  NC: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  ND: {
    kind: 'official_partner',
    detail:
      'Bismarck State College (StraighterLine). UND\'s \'ACE\' wording in the second ' +
      'pass looks like a misreading — treat as unverified',
  },
  OH: {
    kind: 'system_policy_permits',
    detail:
      'Industry-Recognized Credential Transfer Assurance Guides (ITAGs) give ' +
      'guaranteed credit',
  },
  OK: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  OR: {
    kind: 'official_partner',
    detail:
      'Southern Oregon University (StraighterLine)',
  },
  PA: {
    kind: 'no_record',
    detail:
      'Penn State World Campus accepts ACE credit but is not a Saylor partner',
  },
  RI: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  SC: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  SD: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  TN: {
    kind: 'official_partner',
    detail:
      'Tennessee State University (StraighterLine); University of Memphis (Saylor)',
  },
  TX: {
    kind: 'official_partner',
    detail:
      'Dallas College incl. Cedar Valley, Northeast Lakeview (StraighterLine). UT ' +
      'System–Coursera \'Texas Credentials for the Future\' is free but non-credit',
  },
  UT: {
    kind: 'system_policy_permits',
    detail:
      'Statute lets the Board sign articulation agreements with competency-based GE ' +
      'providers; HB 353 (2026) on external transfer',
  },
  VT: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  VA: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  WA: {
    kind: 'no_record',
    detail:
      'Nothing published that we have found.',
  },
  WV: {
    kind: 'system_policy_permits',
    detail:
      '133 CSR 59 covers prior learning, AP, CLEP and micro-credentials',
  },
  WI: {
    kind: 'system_policy_permits',
    detail:
      'Regent policy on extra-institutional learning; SYS Procedure 138.A (PLA)',
  },
  WY: {
    kind: 'no_record',
    detail:
      'UW reviews military ACE transcripts only',
  },
};

const MAPPED: Partial<Record<StateCode, Jurisdiction>> = {
  CA: {
    code: 'CA',
    name: 'California',
    framework_id: 'cal-getc',
    statewide_framework: 'yes',
    transfer_guarantee:
      'Cal-GETC v1.4. Complete it at a California community college and every UC and CSU campus accepts it as their lower-division general education, whole.',
    transfer_provenance: {
      source_url: 'https://icas-ca.org/cal-getc/',
      as_of: '2026-09-18',
      confidence: 'published',
      note:
        'Authority: AB 928; ICAS Cal-GETC Standards v1.4. AB 928 required a single lower-division transfer pattern for UC and CSU. ' +
        'Cal-GETC replaced IGETC and CSU GE Breadth from Fall 2025.',
    },
    fee_waiver: CCPG,
    dual_enrollment: CCAP,
    third_party: THIRD_PARTY.CA,
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    framework_id: 'tx-core',
    statewide_framework: 'yes',
    transfer_guarantee:
      'Texas Core Curriculum. Finish the 42-hour core at ANY Texas public college and the whole block transfers: the receiving university must substitute it for its own core and may not make you retake it.',
    transfer_provenance: {
      source_url: 'https://texas.public.law/statutes/tex._educ._code_section_61.822',
      as_of: '2026-09-19',
      confidence: 'statute',
      note:
        'Authority: TEC §§ 61.821–61.823; 19 TAC ch. 4 subch. B. Texas Education Code 61.822(c): a completed core curriculum "may be transferred ' +
        'to any other institution of higher education and must be substituted for the ' +
        'receiving institution’s core curriculum", and the student "may not be required ' +
        'to take additional core curriculum courses". This is the single most valuable ' +
        'fact in the Texas dataset: it is the block that matters, not the course.',
    },
    // Texas has no statewide need-based waiver of community-college tuition
    // comparable to the CCPG. Saying otherwise would price a Texas plan wrong.
    fee_waiver: null,
    dual_enrollment: FAST,
    third_party: THIRD_PARTY.TX,
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    framework_id: 'fl-core',
    statewide_framework: 'yes',
    transfer_guarantee:
      'General-education core of 5 areas inside a 36-hour GE programme. Earn an Associate in Arts at a Florida public college and you are guaranteed admission to a state university with junior standing and 60 credits toward the bachelor’s — though not to the campus or programme of your choice.',
    transfer_provenance: {
      source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.23',
      as_of: '2026-09-19',
      confidence: 'statute',
      note:
        'Authority: Fla. Stat. §§ 1007.23, 1007.24, 1007.25, 1007.27; Rule 6A-10.024; BOG Reg. 6.006, 8.005. The statewide articulation agreement has guaranteed AA holders university ' +
        'admission since 1972. Read the limit as carefully as the promise: the guarantee ' +
        'is admission to A state university, not to the one you want.',
    },
    fee_waiver: null,
    dual_enrollment: FL_DUAL,
    third_party: THIRD_PARTY.FL,
  },
  NY: {
    code: 'NY',
    name: 'New York',
    // New York runs two frameworks; the SUNY one is the headline, and each CUNY
    // campus plans against CUNY Pathways through its own system.
    framework_id: 'suny-ge',
    statewide_framework: 'yes',
    transfer_guarantee:
      'Two systems, two frameworks: the SUNY General Education Framework with SUNY Transfer Paths, and the CUNY Pathways Common Core. Graduate from a SUNY community college with an AA or AS and you are guaranteed a place at a SUNY four-year campus with junior standing in a parallel program — though not at the campus of your choice. Transfer to CUNY with an AA, AS or bachelor\u2019s from any accredited college and the CUNY Common Core counts as complete.',
    transfer_provenance: {
      source_url: 'https://www.suny.edu/attend/get-started/transfer-students/suny-transfer-policies/',
      as_of: '2026-10-01',
      confidence: 'published',
      note:
        'Authority: SUNY Board of Trustees Res. 2021-48, amended by Res. 2024-64; SUNY Policy 1007; ' +
        'CUNY Board of Trustees Pathways resolution (2011). ' +
        'Both are system policy rather than state statute. The SUNY guarantee is admission to A ' +
        'SUNY four-year campus, not the one you want.',
    },
    // TAP is gated on income and field, so it is shown and never subtracted.
    fee_waiver: AID.NY?.fee_waiver ?? null,
    dual_enrollment: AID.NY?.dual_enrollment ?? null,
    third_party: THIRD_PARTY.NY,
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    framework_id: 'pa-tcf',
    statewide_framework: 'yes',
    transfer_guarantee:
      'The 30-Credit Transfer Framework: courses in six categories that every participating college and university must accept toward graduation. At a State System (PASSHE) university, 30 framework credits complete general education, and an associate degree in a parallel or program-to-program major gives junior standing with no more than 60 credits to go. Penn State, Pitt and Temple take only part of the framework and are not mapped here yet.',
    transfer_provenance: {
      source_url: 'https://collegetransfer.pa.gov/About-PA-College-Transfer/TAOC-Policies',
      as_of: '2026-10-01',
      confidence: 'published',
      note:
        'Authority: Article XX-C of the Public School Code (Act 114 of 2006; Act 50 of 2009); ' +
        '24 P.S. \u00a7 20-2002-C(d); PASSHE Board Policy 1999-01-A and Procedure 2022-54. Read ' +
        'from the Department of Education\u2019s and PASSHE\u2019s own pages; the statute text ' +
        'itself would not load. A statewide program-to-program agreement gives junior standing ' +
        'but does not by itself guarantee admission; PASSHE guarantees admission, subject to ' +
        'capacity.',
    },
    // No statewide community-college fee waiver: Grow PA is a gated grant and the
    // PASSHE Pledge starts in 2027 at PASSHE only.
    fee_waiver: null,
    dual_enrollment: AID.PA?.dual_enrollment ?? null,
    third_party: THIRD_PARTY.PA,
  },
};

export const jurisdictions: Jurisdiction[] = (
  Object.keys(STATE_NAMES) as StateCode[]
).map(code => {
  const full = MAPPED[code];
  if (full !== undefined) return full;

  const name = STATE_NAMES[code];
  const rule = STATEWIDE[code];
  if (rule === undefined) {
    return {
      code, name,
      framework_id: null,
      statewide_framework: 'unknown',
      transfer_guarantee: null,
      transfer_provenance: NOT_MAPPED(name),
      fee_waiver: AID[code]?.fee_waiver ?? null,
      dual_enrollment: AID[code]?.dual_enrollment ?? null,
      third_party: THIRD_PARTY[code],
    };
  }

  return {
    code, name,
    // No framework: we hold the guarantee, not the requirement list it refers
    // to. Pointing at a framework we cannot enumerate would let the engine
    // plan against an empty area list and call the result a complete plan.
    framework_id: null,
    statewide_framework: rule.exists === false ? 'none' : 'yes',
    transfer_guarantee: rule.guarantee,
    transfer_provenance: {
      source_url: rule.verified?.source_url ?? rule.source_url,
      as_of: rule.verified?.as_of ?? '2026-09-20',
      confidence: rule.verified?.confidence ?? 'needs_check',
      note:
        `Authority: ${rule.authority}. ` +
        (rule.unit_system === 'quarter'
          ? `${name} counts in QUARTER credits, not semester credits — multiply by two ` +
            'thirds to compare with a semester figure. '
          : '') +
        (rule.verified !== undefined
          ? `Checked against the governing document on ${rule.verified.as_of}. `
          : `Research grade ${rule.grade}: ` +
            (rule.grade === 'A'
              ? 'the governing document was opened and cross-checked. '
              : rule.grade === 'C'
                ? 'recalled only, and the weakest row in this dataset. '
                : 'read at one remove from the governing document. ') +
            'It is still unconfirmed here until a person opens that source. ') +
        'We do not hold ' +
        `${name}'s campuses or its requirement list, so we cannot price a plan here — ` +
        'only tell you the rule that applies to all of them.',
    },
    fee_waiver: AID[code]?.fee_waiver ?? null,
    dual_enrollment: AID[code]?.dual_enrollment ?? null,
    third_party: THIRD_PARTY[code],
  };
});
