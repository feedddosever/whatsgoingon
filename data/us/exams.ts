import type { CreditSource } from '../../src/types.ts';

/**
 * The national layer: exams that exist independently of any state.
 *
 * AP and CLEP are the same exam in Sacramento, Houston and Tallahassee, so they
 * live here rather than being copied into each state's folder. What differs by
 * state is not the exam — it is what a campus will DO with it, and that is an
 * acceptance rule, not a credit source. Keeping the two apart is what makes a
 * new state a file of rules rather than a fork of the dataset.
 *
 * Costs are the sticker price. Modern States "Freshman Year for Free" supplies a
 * voucher covering the CLEP exam fee nationwide, which is modelled in the
 * engine; AP has no equivalent blanket waiver, though fee reductions exist and
 * many high schools subsidise the exam outright.
 */

const AP_FEE = {
  source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    'The standard school-ordered fee in the US, held at $99 for 2026-27. It excludes late ' +
    'and cancellation fees. Reductions exist for low-income students and many high schools ' +
    'pay outright — ask before budgeting for it.',
};

const CLEP_FEE = {
  source_url: 'https://clep.collegeboard.org/clep-exam-policy',
  as_of: '2026-09-18',
  confidence: 'published' as const,
  note:
    '$97 to College Board as of the 2025-26 cycle \u2014 it was $95 \u2014 plus a test-centre or ' +
    'remote-proctoring administration fee that is not included here. A Modern States ' +
    'voucher can take the College Board half to $0. What the credit is WORTH depends ' +
    'entirely on the state: it clears general-education requirements in Florida by rule, ' +
    'cannot satisfy Cal-GETC at all, and UC awards no CLEP credit whatsoever.',
};

const IB_FEE = {
  source_url: 'https://huron.a2schools.org/ib/11th-and-12th-grade-dp-and-cp/dp-exam-fees-class-of-2026-and-beyond',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    'Per-subject fee for the May 2026 session, around $124-$133 depending on the school\u2019s ' +
    'published scale. The source is a school\u2019s fee schedule rather than IB itself: IB bills ' +
    'the school and the school bills the family, so there is no candidate-facing price list ' +
    'to read. A full diploma candidate also pays a one-off registration fee of roughly $172 ' +
    'on top of six subject fees, which is NOT included here \u2014 this is the marginal cost of ' +
    'one more subject.',
};

const DSST_FEE = {
  source_url: 'https://getcollegecredit.com/about-dsst/',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    '$100 to DSST, plus a test-centre administration fee that is commonly $25-$50 and is ' +
    'not included here. **Free for eligible active-duty service members** at a ' +
    'DANTES-funded site, which waives both \u2014 first attempt only. What the credit is ' +
    'WORTH varies more than any other family here: a CSU will award it toward a degree, ' +
    'and the University of California awards nothing for it at all.',
};

const ALEVEL_FEE = {
  source_url: 'https://admission.universityofcalifornia.edu/admission-requirements/ap-exam-credits/a-levels.html',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    'Cambridge International A Level. Entry fees are set by the exam series and collected ' +
    'by the school or the centre, not by the candidate, so the figure here is indicative ' +
    'only. UC grants credit at grade A, B or C, up to 12 quarter (8 semester) units per ' +
    'exam \u2014 and for GENERAL EDUCATION credit the exam must be a Cambridge International A ' +
    'Level taken in 2013 or later, not one administered by another board. Florida calls ' +
    'this family AICE, after the Cambridge diploma built from these same exams.',
};

const DLPT_FEE = {
  source_url: 'https://www.acenet.edu/National-Guide/Pages/Course.aspx?org=Defense+Language+Institute',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    'Administered by the Defense Language Institute Foreign Language Center to service ' +
    'members and government-sponsored personnel. There is no fee to the candidate and no ' +
    'route for a civilian to register, which is why the app will never suggest one \u2014 but ' +
    'if you hold a rating, it is worth real credit, and Florida names DLPT in the same ' +
    'binding statewide table as AP and CLEP.',
};

const UEXCEL_FEE = {
  source_url: 'https://www.excelsior.edu/start-with-more-credit/transfer-your-uexcel-credit/',
  as_of: '2026-09-19',
  confidence: 'needs_check' as const,
  note:
    'RETIRED. Excelsior stopped offering UExcel exams after 21 August 2022 and accepts no ' +
    'new registrations, so this can never be bought \u2014 it is here because scores already ' +
    'earned still transfer, and Florida\u2019s statute still names UExcel. Colleges are not ' +
    'obliged to award the full credit Excelsior did.',
};

export const examSources: CreditSource[] = [
  // ---- AP: accepted in some form almost everywhere, including at UC ----
  { id: 'ap-english-lang', kind: 'ap', name: 'AP English Language & Composition (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-english-lit', kind: 'ap', name: 'AP English Literature & Composition (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-calculus-ab', kind: 'ap', name: 'AP Calculus AB (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-calculus-bc', kind: 'ap', name: 'AP Calculus BC (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-statistics', kind: 'ap', name: 'AP Statistics (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-art-history', kind: 'ap', name: 'AP Art History (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-spanish', kind: 'ap', name: 'AP Spanish Language & Culture (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-european-history', kind: 'ap', name: 'AP European History (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-us-history', kind: 'ap', name: 'AP United States History (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-us-government', kind: 'ap', name: 'AP United States Government & Politics (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-comparative-government', kind: 'ap', name: 'AP Comparative Government & Politics (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-psychology', kind: 'ap', name: 'AP Psychology (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-macroeconomics', kind: 'ap', name: 'AP Macroeconomics (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-microeconomics', kind: 'ap', name: 'AP Microeconomics (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-human-geography', kind: 'ap', name: 'AP Human Geography (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-biology', kind: 'ap', name: 'AP Biology (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-chemistry', kind: 'ap', name: 'AP Chemistry (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-physics-1', kind: 'ap', name: 'AP Physics 1: Algebra-Based (score 3+)', cost_usd: 99, provenance: AP_FEE },
  { id: 'ap-environmental-science', kind: 'ap', name: 'AP Environmental Science (score 3+)', cost_usd: 99, provenance: AP_FEE },

  // ---- CLEP: cheap, fast, and worth wildly different amounts by state ----
  { id: 'clep-college-composition', kind: 'clep', name: 'CLEP College Composition', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-college-algebra', kind: 'clep', name: 'CLEP College Algebra', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-college-mathematics', kind: 'clep', name: 'CLEP College Mathematics', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-intro-psychology', kind: 'clep', name: 'CLEP Introductory Psychology', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-intro-sociology', kind: 'clep', name: 'CLEP Introductory Sociology', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-american-government', kind: 'clep', name: 'CLEP American Government', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-history-us-1', kind: 'clep', name: 'CLEP History of the United States I', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-macroeconomics', kind: 'clep', name: 'CLEP Principles of Macroeconomics', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-humanities', kind: 'clep', name: 'CLEP Humanities', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-american-literature', kind: 'clep', name: 'CLEP American Literature', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-natural-sciences', kind: 'clep', name: 'CLEP Natural Sciences', cost_usd: 97, provenance: CLEP_FEE },
  { id: 'clep-biology', kind: 'clep', name: 'CLEP Biology', cost_usd: 97, provenance: CLEP_FEE },


  // ---- IB: the family UC accepts and this app could not represent ----
  //
  // Higher Level only, and score 5 or better. Standard Level exams are left out
  // deliberately rather than priced at zero: UC awards credit for HL and the
  // Cal-GETC external-exam standard is written for HL, so an SL row would be a
  // promise nobody made.
  //
  // The cost is the per-subject exam fee. A student sitting the full diploma
  // pays a registration fee on top, and their school usually handles both, so
  // this is the marginal cost of one more subject rather than a bill.
  { id: 'ib-biology-hl', kind: 'ib', name: 'IB Biology, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-chemistry-hl', kind: 'ib', name: 'IB Chemistry, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-physics-hl', kind: 'ib', name: 'IB Physics, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-mathematics-aa-hl', kind: 'ib', name: 'IB Mathematics: Analysis & Approaches, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-mathematics-ai-hl', kind: 'ib', name: 'IB Mathematics: Applications & Interpretation, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-english-a-hl', kind: 'ib', name: 'IB Language A: Literature, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-history-hl', kind: 'ib', name: 'IB History, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-economics-hl', kind: 'ib', name: 'IB Economics, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-psychology-hl', kind: 'ib', name: 'IB Psychology, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-geography-hl', kind: 'ib', name: 'IB Geography, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-visual-arts-hl', kind: 'ib', name: 'IB Visual Arts, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },
  { id: 'ib-spanish-b-hl', kind: 'ib', name: 'IB Spanish B, Higher Level (score 5+)', cost_usd: 128, provenance: IB_FEE },

  // ---- DSST: worthless at a UC, real money at a CSU, free if you serve ----
  //
  // $100 to DSST plus a test-centre administration fee, commonly $25-$50.
  // Priced here at the exam fee alone, because the centre fee varies and a
  // DANTES-funded site waives both for eligible service members.
  { id: 'dsst-principles-public-speaking', kind: 'dsst', name: 'DSST Principles of Public Speaking', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-college-algebra', kind: 'dsst', name: 'DSST Fundamentals of College Algebra', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-introduction-to-world-religions', kind: 'dsst', name: 'DSST Introduction to World Religions', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-general-anthropology', kind: 'dsst', name: 'DSST General Anthropology', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-substance-abuse', kind: 'dsst', name: 'DSST Substance Abuse', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-environment-humanity', kind: 'dsst', name: 'DSST Environment and Humanity', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-history-of-the-vietnam-war', kind: 'dsst', name: 'DSST A History of the Vietnam War', cost_usd: 100, provenance: DSST_FEE },
  { id: 'dsst-principles-of-supervision', kind: 'dsst', name: 'DSST Principles of Supervision', cost_usd: 100, provenance: DSST_FEE },


  // ---- Cambridge International A Level: what Florida calls AICE ----
  //
  // One family, not two. The Cambridge AICE Diploma is assembled from these
  // same Cambridge International AS & A Level subject exams, so modelling AICE
  // separately would invent an exam that does not exist. UC accepts A Level
  // alongside AP and IB, and refuses everything else.
  //
  // AS Level is deliberately absent: it is half an A Level and carries its own
  // credit rules, and guessing them here would be the same mistake as pricing
  // IB Standard Level.
  { id: 'alevel-biology', kind: 'a_level', name: 'Cambridge International A Level Biology (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-chemistry', kind: 'a_level', name: 'Cambridge International A Level Chemistry (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-physics', kind: 'a_level', name: 'Cambridge International A Level Physics (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-mathematics', kind: 'a_level', name: 'Cambridge International A Level Mathematics (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-english-literature', kind: 'a_level', name: 'Cambridge International A Level English Literature (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-history', kind: 'a_level', name: 'Cambridge International A Level History (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-economics', kind: 'a_level', name: 'Cambridge International A Level Economics (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-psychology', kind: 'a_level', name: 'Cambridge International A Level Psychology (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-geography', kind: 'a_level', name: 'Cambridge International A Level Geography (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-art-design', kind: 'a_level', name: 'Cambridge International A Level Art & Design (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },
  { id: 'alevel-spanish', kind: 'a_level', name: 'Cambridge International A Level Spanish (grade A–C)', cost_usd: 125, provenance: ALEVEL_FEE },

  // ---- DLPT: free, valuable, and impossible for a civilian to sit ----
  { id: 'dlpt-spanish', kind: 'dlpt', name: 'DLPT Spanish (listening and reading)', cost_usd: 0,
    availability: 'restricted', provenance: DLPT_FEE },
  { id: 'dlpt-arabic', kind: 'dlpt', name: 'DLPT Arabic (listening and reading)', cost_usd: 0,
    availability: 'restricted', provenance: DLPT_FEE },
  { id: 'dlpt-korean', kind: 'dlpt', name: 'DLPT Korean (listening and reading)', cost_usd: 0,
    availability: 'restricted', provenance: DLPT_FEE },
  { id: 'dlpt-russian', kind: 'dlpt', name: 'DLPT Russian (listening and reading)', cost_usd: 0,
    availability: 'restricted', provenance: DLPT_FEE },
  { id: 'dlpt-chinese-mandarin', kind: 'dlpt', name: 'DLPT Chinese Mandarin (listening and reading)', cost_usd: 0,
    availability: 'restricted', provenance: DLPT_FEE },

  // ---- UExcel: retired in 2022, still on Florida's statute ----
  { id: 'uexcel-english-composition', kind: 'uexcel', name: 'UExcel English Composition (retired exam)', cost_usd: 0,
    availability: 'retired', provenance: UEXCEL_FEE },
  { id: 'uexcel-college-algebra', kind: 'uexcel', name: 'UExcel College Algebra (retired exam)', cost_usd: 0,
    availability: 'retired', provenance: UEXCEL_FEE },
  { id: 'uexcel-introduction-to-psychology', kind: 'uexcel', name: 'UExcel Introduction to Psychology (retired exam)', cost_usd: 0,
    availability: 'retired', provenance: UEXCEL_FEE },
  { id: 'uexcel-introduction-to-sociology', kind: 'uexcel', name: 'UExcel Introduction to Sociology (retired exam)', cost_usd: 0,
    availability: 'retired', provenance: UEXCEL_FEE },
  { id: 'uexcel-world-population', kind: 'uexcel', name: 'UExcel World Population (retired exam)', cost_usd: 0,
    availability: 'retired', provenance: UEXCEL_FEE },
];
