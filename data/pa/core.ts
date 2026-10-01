import type { GeArea, Provenance } from '../../src/types.ts';

/**
 * Pennsylvania's 30-Credit Transfer Framework: six categories of foundation
 * courses that every participating college and university must accept toward
 * graduation. At a PASSHE university, 30 framework-aligned credits complete
 * general education outright ("Core-to-Core").
 *
 * Planned only for the ten PASSHE universities. Penn State, Pitt and Temple
 * accept a limited list of framework courses and run their own general
 * education, so pricing them against this framework would describe a
 * requirement list they do not use — they are not mapped here yet.
 *
 * Each category is priced as one 3-credit course. Categories 3 to 6 allow up
 * to two courses each, toward 30 credits in all; leaving the second course out
 * understates the cost of doing nothing, the direction this app errs in.
 */
const PA_TCF: Provenance = {
  source_url: 'https://collegetransfer.pa.gov/Transfer-Information/General-Education-Courses',
  as_of: '2026-10-01',
  // Published, not statute: the statute text would not load, so this rests on
  // the Department of Education's own pages describing it.
  confidence: 'published',
  note:
    'Article XX-C of the Public School Code (Act 114 of 2006) requires the transfer of at ' +
    'least 30 credits of foundation courses among participating institutions. The framework ' +
    'lists them in six categories: English Composition, Public Speaking, Mathematics, ' +
    'Natural Sciences, Social and Behavioral Sciences, and Humanities and Fine Arts. PASSHE ' +
    'Procedure 2022-54: 30 framework-aligned credits complete a PASSHE university’s general ' +
    'education.',
};

const area = (id: string, name: string): GeArea => ({
  id, name, required_units: 3,
  framework_id: 'pa-tcf',
  applies_to: ['PASSHE'],
  provenance: PA_TCF,
});

export const paFrameworkAreas: GeArea[] = [
  area('pa-comp', 'English Composition'),
  area('pa-speech', 'Public Speaking'),
  area('pa-math', 'Mathematics'),
  area('pa-sci', 'Natural Sciences'),
  area('pa-soc', 'Social and Behavioral Sciences'),
  area('pa-hum', 'Humanities and Fine Arts'),
];
