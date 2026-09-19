import type { Institution, Provenance } from '../../src/types.ts';

/**
 * Florida charges per credit hour and publishes the components, so this figure
 * is built by addition rather than by dividing an annual total:
 *
 *   $105.07 resident undergraduate tuition
 * + $ 44.17 tuition differential
 * + $  6.76 capital improvement trust fund
 * + $  5.25 student financial aid fee
 * + $  5.25 technology fee
 *   -------
 *   $166.50 per credit hour
 *
 * Deliberately conservative: it omits activity, athletic and health fees, which
 * are set locally and push the real figure higher. Understating the price of
 * doing nothing understates the saving, which is the direction this app should
 * err in.
 */
const FL_PER_UNIT = 167;

const FL_COST: Provenance = {
  source_url: 'https://policy.ufl.edu/regulation/3-0375/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Built from the University of Florida 2025-26 per-credit-hour schedule and applied ' +
    'across the State University System. Tuition itself is uniform statewide; the ' +
    'differential and local fees are not, so your campus will differ. Activity, ' +
    'athletic and health fees are excluded, so the real cost of a credit hour is higher ' +
    'than this.',
};

/**
 * Florida is the strongest exam-credit jurisdiction in this dataset, and it is
 * not close. Elsewhere a campus DECIDES what an exam is worth; in Florida the
 * state publishes the table and the institution MUST award what it says.
 */
const FL_EXAM_POLICY: Provenance = {
  source_url: 'https://www.flbog.edu/wp-content/uploads/2024/06/Credit-by-Exam-Equivalencies-List.pdf',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Section 1007.27(2), Florida Statutes, and State Board rule 6A-10.024: the ' +
    'Articulation Coordinating Committee sets passing scores and course equivalents for ' +
    'AP, AICE, IB, DSST, DLPT, UExcel and CLEP, and state universities and colleges ' +
    'MUST award the listed credit even if they do not offer the course. Courses marked ' +
    'core on that list are general education core courses. Up to 45 credit-by-exam ' +
    'credits count toward guaranteed transfer. CLEP is worth real general-education ' +
    'credit here — the opposite of California.',
};

const FL_RESIDENCY: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note: 'Minimum hours earned at the university. Unconfirmed — ask the registrar.',
};

const FL_TRANSFER_CAP: Provenance = {
  source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.23',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'An associate in arts is 60 semester hours and transfers whole with junior standing. ' +
    'Separately, no more than 45 credit-by-exam hours count toward guaranteed transfer. ' +
    'The interaction of the two is not confirmed here.',
};

const fl = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'FL-SUS',
  cost_per_unit_usd: FL_PER_UNIT,
  residency_min_units: 30,
  max_transfer_units: 60,
  accepts_clep: true,
  accepts_third_party_transcript: true,
  exam_policy_provenance: FL_EXAM_POLICY,
  residency_provenance: FL_RESIDENCY,
  transfer_cap_provenance: FL_TRANSFER_CAP,
  cost_provenance: FL_COST,
});

/** All twelve institutions of the Florida State University System. */
export const floridaInstitutions: Institution[] = [
  fl('u-florida', 'University of Florida'),
  fl('florida-state', 'Florida State University'),
  fl('u-south-florida', 'University of South Florida'),
  fl('u-central-florida', 'University of Central Florida'),
  fl('florida-international', 'Florida International University'),
  fl('florida-atlantic', 'Florida Atlantic University'),
  fl('u-north-florida', 'University of North Florida'),
  fl('u-west-florida', 'University of West Florida'),
  fl('florida-am', 'Florida A&M University'),
  fl('florida-gulf-coast', 'Florida Gulf Coast University'),
  fl('new-college-florida', 'New College of Florida'),
  fl('florida-poly', 'Florida Polytechnic University'),
];
