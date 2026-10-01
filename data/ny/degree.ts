import type { Provenance, SystemDegree } from '../../src/types.ts';

/**
 * What a SUNY or CUNY bachelor's degree is made of, beyond general education.
 * Neither system sets a residency rule centrally, so that rule says so and
 * quotes the campuses we read rather than inventing a systemwide number.
 */

const SUNY_GE: Provenance = {
  source_url: 'https://system.suny.edu/academic-affairs/academic-policies/general-education/suny-ge/',
  as_of: '2026-10-01',
  confidence: 'published',
};

const SUNY_1300: Provenance = {
  source_url: 'https://www.suny.edu/sunypp/documents.cfm?doc_id=163',
  as_of: '2026-10-01',
  confidence: 'published',
};

const PATHWAYS: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/gened/',
  as_of: '2026-10-01',
  confidence: 'published',
};

const CUNY_CPL: Provenance = {
  source_url: 'https://www.cuny.edu/academics/academic-policy/credit-prior-learning/',
  as_of: '2026-10-01',
  confidence: 'published',
};

export const newYorkDegrees: SystemDegree[] = [
  {
    system: 'SUNY',
    total_units: 120,
    ge_units: 30,
    rules: [
      {
        id: 'suny-total',
        block: 'total',
        title: 'Total credits',
        text: 'A SUNY bachelor’s (BA or BS) is 120 credits.',
        provenance: SUNY_GE,
      },
      {
        id: 'suny-ge',
        block: 'ge',
        title: 'SUNY General Education',
        text:
          'At least 30 credits within your first 60, covering at least seven of ten knowledge ' +
          'areas — Communication, Diversity, Mathematics and Natural Sciences among them.',
        provenance: SUNY_GE,
      },
      {
        id: 'suny-residency',
        block: 'residency',
        title: 'Credit earned at your campus',
        text:
          'Set by each campus, not by SUNY: 30 of your credits at the University at Buffalo, 36 ' +
          'after your 57th credit at Stony Brook. Credit by exam never counts toward it.',
        provenance: SUNY_1300,
      },
      {
        id: 'suny-competencies',
        block: 'graduation',
        title: 'Core competencies',
        text:
          'Every SUNY degree also builds three competencies into its courses: critical thinking ' +
          'and reasoning, information literacy, and — from fall 2026 — civic discourse.',
        provenance: SUNY_GE,
      },
    ],
  },
  {
    system: 'CUNY',
    total_units: null,
    ge_units: 30,
    rules: [
      {
        id: 'cuny-total',
        block: 'total',
        title: 'Total credits',
        text: 'Set by each CUNY college and program.',
        provenance: PATHWAYS,
      },
      {
        id: 'cuny-common-core',
        block: 'ge',
        title: 'Pathways Common Core',
        text:
          '30 credits, the same at every CUNY college: 12 of Required Core and 18 of Flexible ' +
          'Core across five areas.',
        provenance: PATHWAYS,
      },
      {
        id: 'cuny-residency',
        block: 'residency',
        title: 'Credit earned at your college',
        text:
          'Set by each college: at least 31 credits at Baruch, 30 at Hunter. Credit for prior ' +
          'learning, exams included, never counts toward it.',
        provenance: CUNY_CPL,
      },
      {
        id: 'cuny-college-option',
        block: 'graduation',
        title: 'College Option',
        text:
          'Bachelor’s students take 6 to 12 more general-education credits defined by their ' +
          'own college, on top of the Common Core.',
        provenance: PATHWAYS,
      },
    ],
  },
];
