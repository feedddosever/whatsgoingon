import type { CreditSource, Provenance } from '../../src/types.ts';

/**
 * Pennsylvania community-college courses on the 30-Credit Transfer Framework.
 * The framework names course TITLES rather than numbers, and each college lists
 * its own course against each title on PA College Transfer.
 */
const PA_CC_COST: Provenance = {
  source_url: 'https://www.hacc.edu/Admissions/TuitionandDueDates/index.cfm',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Pennsylvania community colleges set their own rates, and the price depends on whether ' +
    'your school district sponsors the college. For a sponsoring-district resident in 2026-27: ' +
    'HACC $237 a credit with fees, Community College of Philadelphia $208. $220 is the middle. ' +
    'Without a sponsoring district the rate is far higher — HACC charges $342.25.',
};

const PER_CREDIT = 220;

const course = (id: string, name: string, credits = 3): CreditSource => ({
  id, kind: 'cc_course', name: `${name} (${credits} credits)`,
  cost_usd: PER_CREDIT * credits, provenance: PA_CC_COST,
});

export const paCourses: CreditSource[] = [
  course('pa-cc-eng-comp', 'English Composition I'),
  course('pa-cc-public-speaking', 'Public Speaking'),
  course('pa-cc-statistics', 'Statistics'),
  course('pa-cc-college-algebra', 'College Algebra'),
  course('pa-cc-biology', 'General Biology I', 4),
  course('pa-cc-astronomy', 'Introduction to Astronomy'),
  course('pa-cc-psychology', 'General Psychology'),
  course('pa-cc-american-government', 'American Government'),
  course('pa-cc-us-history', 'U.S. History I'),
  course('pa-cc-macroeconomics', 'Principles of Macroeconomics'),
  course('pa-cc-philosophy', 'Introduction to Philosophy'),
  course('pa-cc-music', 'Introduction to Music'),
  course('pa-cc-spanish', 'Elementary Spanish I'),
];
