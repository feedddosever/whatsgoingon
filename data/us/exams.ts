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
  as_of: '',
  confidence: 'needs_check' as const,
  note:
    'Exam fee not confirmed against a current College Board page. Fee reductions exist ' +
    'for low-income students and many high schools pay the fee outright — ask before ' +
    'budgeting for it.',
};

const CLEP_FEE = {
  source_url: 'https://clep.collegeboard.org/clep-exam-policy',
  as_of: '2026-09-18',
  confidence: 'published' as const,
  note:
    'Exam fee. A Modern States voucher can take it to $0. What the credit is WORTH ' +
    'depends entirely on the state: it clears general-education requirements in Florida ' +
    'by rule, cannot satisfy Cal-GETC at all, and UC awards no CLEP credit whatsoever.',
};

const IB_FEE = {
  source_url: 'https://www.ibo.org/programmes/diploma-programme/assessment-and-exams/',
  as_of: '',
  confidence: 'needs_check' as const,
  note:
    'Per-subject exam fee, not confirmed against a current IB page \u2014 IB publishes fees ' +
    'through schools rather than to candidates, and most candidates never see a bill ' +
    'because the school registers them. Treat the figure as indicative.',
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
  { id: 'clep-college-composition', kind: 'clep', name: 'CLEP College Composition', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-college-algebra', kind: 'clep', name: 'CLEP College Algebra', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-college-mathematics', kind: 'clep', name: 'CLEP College Mathematics', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-intro-psychology', kind: 'clep', name: 'CLEP Introductory Psychology', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-intro-sociology', kind: 'clep', name: 'CLEP Introductory Sociology', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-american-government', kind: 'clep', name: 'CLEP American Government', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-history-us-1', kind: 'clep', name: 'CLEP History of the United States I', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-macroeconomics', kind: 'clep', name: 'CLEP Principles of Macroeconomics', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-humanities', kind: 'clep', name: 'CLEP Humanities', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-american-literature', kind: 'clep', name: 'CLEP American Literature', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-natural-sciences', kind: 'clep', name: 'CLEP Natural Sciences', cost_usd: 95, provenance: CLEP_FEE },
  { id: 'clep-biology', kind: 'clep', name: 'CLEP Biology', cost_usd: 95, provenance: CLEP_FEE },


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
  { id: 'ib-biology-hl', kind: 'ib', name: 'IB Biology, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-chemistry-hl', kind: 'ib', name: 'IB Chemistry, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-physics-hl', kind: 'ib', name: 'IB Physics, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-mathematics-aa-hl', kind: 'ib', name: 'IB Mathematics: Analysis & Approaches, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-mathematics-ai-hl', kind: 'ib', name: 'IB Mathematics: Applications & Interpretation, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-english-a-hl', kind: 'ib', name: 'IB Language A: Literature, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-history-hl', kind: 'ib', name: 'IB History, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-economics-hl', kind: 'ib', name: 'IB Economics, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-psychology-hl', kind: 'ib', name: 'IB Psychology, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-geography-hl', kind: 'ib', name: 'IB Geography, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-visual-arts-hl', kind: 'ib', name: 'IB Visual Arts, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },
  { id: 'ib-spanish-b-hl', kind: 'ib', name: 'IB Spanish B, Higher Level (score 5+)', cost_usd: 130, provenance: IB_FEE },

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
];
