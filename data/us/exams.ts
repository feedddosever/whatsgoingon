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
];
