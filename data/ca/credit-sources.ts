import type { CreditSource } from '../../src/types.ts';

/**
 * Costs are the sticker price. Two waivers routinely take them to zero and are
 * modelled as notes until the engine supports eligibility:
 *   - California College Promise Grant (CCPG) waives the CCC $46/unit fee.
 *   - Modern States "Freshman Year for Free" covers the CLEP exam fee.
 */
export const creditSources: CreditSource[] = [
  // ---- AP: the only exam credit that works everywhere, including at UC ----
  {
    id: 'ap-english-lang',
    kind: 'ap',
    name: 'AP English Language & Composition (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
      note:
        'Exam fee not covered by the 2026-27 research brief. Fee reductions exist for ' +
        'low-income students and many CA high schools subsidise the exam outright.',
    },
  },
  {
    id: 'ap-calculus-ab',
    kind: 'ap',
    name: 'AP Calculus AB (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },
  {
    id: 'ap-psychology',
    kind: 'ap',
    name: 'AP Psychology (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },

  {
    id: 'ap-english-lit',
    kind: 'ap',
    name: 'AP English Literature & Composition (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },
  {
    id: 'ap-art-history',
    kind: 'ap',
    name: 'AP Art History (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },
  {
    id: 'ap-biology',
    kind: 'ap',
    name: 'AP Biology (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },
  {
    id: 'ap-chemistry',
    kind: 'ap',
    name: 'AP Chemistry (score 3+)',
    cost_usd: 99,
    provenance: {
      source_url: 'https://apstudents.collegeboard.org/exam-policies-guidelines/exam-fees',
      as_of: '',
      confidence: 'needs_check',
    },
  },

  // ---- CLEP: cannot satisfy Cal-GETC anywhere, and UC rejects it entirely ----
  {
    id: 'clep-college-composition',
    kind: 'clep',
    name: 'CLEP College Composition',
    cost_usd: 95,
    provenance: {
      source_url: 'https://clep.collegeboard.org/clep-exam-policy',
      as_of: '2026-09-18',
      confidence: 'published',
      note:
        'Modern States "Freshman Year for Free" supplies a voucher covering the exam fee, ' +
        'which can take this to $0. Worth taking only if the destination is a CSU or a ' +
        'private — it cannot satisfy Cal-GETC, and UC awards no CLEP credit at all.',
    },
  },
  {
    id: 'clep-college-algebra',
    kind: 'clep',
    name: 'CLEP College Algebra',
    cost_usd: 95,
    provenance: {
      source_url: 'https://clep.collegeboard.org/clep-exam-policy',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Modern States voucher can cover the exam fee.',
    },
  },
  {
    id: 'clep-intro-psychology',
    kind: 'clep',
    name: 'CLEP Introductory Psychology',
    cost_usd: 95,
    provenance: {
      source_url: 'https://clep.collegeboard.org/clep-exam-policy',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Modern States voucher can cover the exam fee.',
    },
  },

  // ---- Community college courses: the workhorse of every cheap CA pathway ----
  {
    id: 'ccc-engl-1a',
    kind: 'ccc_course',
    name: 'Community college English 1A (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note:
        'CCC enrollment fee has been $46/unit since summer 2012 and the Governor proposes ' +
        'no increase for 2026-27, so 3 units = $138. The California College Promise Grant ' +
        'waives this fee entirely for eligible students — check before assuming you pay it.',
    },
  },
  {
    id: 'ccc-math-1',
    kind: 'ccc_course',
    name: 'Community college Math 1, Quantitative Reasoning (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'CCPG waives the $46/unit enrollment fee for eligible students.',
    },
  },
  {
    id: 'ccc-comm-1',
    kind: 'ccc_course',
    name: 'Community college Communication Studies 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'CCPG waives the $46/unit enrollment fee for eligible students.',
    },
  },
  {
    id: 'ccc-ethnic-studies-1',
    kind: 'ccc_course',
    name: 'Community college Ethnic Studies 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 6. CCPG waives the $46/unit enrollment fee.',
    },
  },
  {
    id: 'ccc-engl-1b',
    kind: 'ccc_course',
    name: 'Community college English 1B, Critical Thinking (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 1B. CCPG waives the $46/unit enrollment fee for eligible students.',
    },
  },
  {
    id: 'ccc-hum-1',
    kind: 'ccc_course',
    name: 'Community college Humanities 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 3B. CCPG waives the $46/unit enrollment fee.',
    },
  },
  {
    id: 'ccc-art-1',
    kind: 'ccc_course',
    name: 'Community college Art History 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 3A. CCPG waives the $46/unit enrollment fee.',
    },
  },
  {
    id: 'ccc-physics-1',
    kind: 'ccc_course',
    name: 'Community college Physical Science 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 5A. CCPG waives the $46/unit enrollment fee.',
    },
  },
  {
    id: 'ccc-biology-1',
    kind: 'ccc_course',
    name: 'Community college Biology 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note: 'Cal-GETC area 5B. CCPG waives the $46/unit enrollment fee.',
    },
  },
];
