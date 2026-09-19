import type { GeArea, Provenance } from '../../src/types.ts';

/**
 * Florida's general education core: five subject areas, at least one course in
 * each, identical at every Florida College System and State University System
 * institution.
 *
 * Fifteen hours is a smaller framework than California's or Texas's, and the
 * number is easy to misread. The associate in arts requires 36 semester hours
 * of general education in total; these five areas are the part the STATE
 * guarantees, and the remaining 21 hours are set by the institution. Planning
 * credit against the guaranteed part and against the institution's part are
 * different problems, and this app only does the first honestly.
 */
const FL_CORE: Provenance = {
  source_url: 'https://www.flsenate.gov/laws/statutes/2024/1007.25',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Florida Statutes 1007.25 with State Board rule 6A-14.0303. Students entering a ' +
    'Florida College System or State University System institution must complete at ' +
    'least one general education core course in each of communication, mathematics, ' +
    'social sciences, humanities and natural sciences. The associate in arts requires ' +
    '36 semester hours of general education overall — these 15 are the statewide core ' +
    'within it, not the whole requirement.',
};

const area = (id: string, name: string): GeArea => ({
  id, name, required_units: 3,
  framework_id: 'fl-core',
  applies_to: ['FL-SUS'],
  provenance: FL_CORE,
});

export const floridaCoreAreas: GeArea[] = [
  area('fl-comm', 'Communication'),
  area('fl-math', 'Mathematics'),
  area('fl-social', 'Social Sciences'),
  area('fl-hum', 'Humanities'),
  area('fl-nat', 'Natural Sciences'),
];
