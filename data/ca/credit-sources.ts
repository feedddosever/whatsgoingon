import type { CreditSource } from '../../src/types.ts';

/**
 * California community-college courses. The AP and CLEP rows that used to sit
 * above these moved to `data/us/exams.ts`: they are national, and keeping a
 * national exam in a state folder meant every new state duplicated it — along
 * with a note explaining what it is worth in California, which is exactly the
 * kind of claim that must not travel.
 *
 * $46/unit is the statutory California community-college enrolment fee, so a
 * 3-unit course is $138. The California College Promise Grant waives it.
 */
export const cccCourses: CreditSource[] = [
  // ---- Community college courses: the workhorse of every cheap CA pathway ----
  {
    id: 'ccc-engl-1a',
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    id: 'ccc-soc-1',
    kind: 'cc_course',
    name: 'Community college Sociology 1 (3 units)',
    cost_usd: 138,
    provenance: {
      source_url:
        'https://lao.ca.gov/Publications/Report/2026-27-budget-california-community-colleges',
      as_of: '2026-09-18',
      confidence: 'published',
      note:
        'Cal-GETC area 4. Without a community-college route to area 4, a student with a ' +
        'fee waiver cleared every other requirement free and was still charged for an AP ' +
        'exam here. CCPG waives the $46/unit enrolment fee.',
    },
  },
  {
    id: 'ccc-ethnic-studies-1',
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    kind: 'cc_course',
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
    kind: 'cc_course',
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
