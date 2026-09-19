import type { CreditSource, Provenance } from '../../src/types.ts';

/**
 * Texas community-college courses, by their Texas Common Course Numbering
 * System number.
 *
 * TCCNS is the reason these rows can be named at all. In California a
 * community-college course is local and has to be checked pair by pair on
 * ASSIST; in Texas ENGL 1301 is ENGL 1301 at every participating college, which
 * is what lets one row stand for the whole state.
 */
const TX_CC_COST: Provenance = {
  source_url: 'https://reportcenter.highered.texas.gov/reports/data/tuition-and-fees-data-community-colleges/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'In-district tuition varies more in Texas than anywhere else in this dataset — $77/SCH ' +
    'at College of the Mainland, $164/SCH at South Texas College. $124/SCH is a statewide ' +
    'middle, so treat the price as a range. Out-of-district rates are higher again. If you ' +
    'are still in high school, FAST may make this $0 (see the Texas page).',
};

const TCCNS: Provenance = {
  source_url: 'https://www.tccns.org/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Texas Common Course Numbering System. The number is standard statewide; whether ' +
    'your specific college has approved this course for this component area is set in ' +
    'that college’s own core list.',
};

const PER_SCH = 124;

const course = (id: string, name: string, hours: number): CreditSource => ({
  id,
  kind: 'cc_course',
  name,
  cost_usd: PER_SCH * hours,
  provenance: { ...TX_CC_COST, note: TCCNS.note + ' ' + TX_CC_COST.note },
});

export const texasCourses: CreditSource[] = [
  course('tx-engl-1301', 'ENGL 1301 Composition I (3 SCH)', 3),
  course('tx-engl-1302', 'ENGL 1302 Composition II (3 SCH)', 3),
  course('tx-spch-1315', 'SPCH 1315 Public Speaking (3 SCH)', 3),
  course('tx-math-1314', 'MATH 1314 College Algebra (3 SCH)', 3),
  course('tx-math-1332', 'MATH 1332 Contemporary Mathematics (3 SCH)', 3),
  course('tx-biol-1406', 'BIOL 1406 Biology I, with laboratory (4 SCH)', 4),
  course('tx-chem-1411', 'CHEM 1411 General Chemistry I, with laboratory (4 SCH)', 4),
  course('tx-phil-1301', 'PHIL 1301 Introduction to Philosophy (3 SCH)', 3),
  course('tx-arts-1301', 'ARTS 1301 Art Appreciation (3 SCH)', 3),
  course('tx-hist-1301', 'HIST 1301 United States History I (3 SCH)', 3),
  course('tx-hist-1302', 'HIST 1302 United States History II (3 SCH)', 3),
  course('tx-govt-2305', 'GOVT 2305 Federal Government (3 SCH)', 3),
  course('tx-govt-2306', 'GOVT 2306 Texas Government (3 SCH)', 3),
  course('tx-psyc-2301', 'PSYC 2301 General Psychology (3 SCH)', 3),
  course('tx-soci-1301', 'SOCI 1301 Introductory Sociology (3 SCH)', 3),
];
