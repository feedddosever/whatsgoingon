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
  source_url: 'https://www.flbog.edu/wp-content/uploads/2026/07/2026-2027-SUS-Tuition-and-Fees-Report.pdf',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Built from the University of Florida 2026-27 per-credit-hour schedule and applied ' +
    'across the State University System. Tuition itself is uniform statewide; the ' +
    'differential is not, so your campus will differ by a few dollars (FSU $169.92, USF ' +
    '$169.21 on the same basis). Activity, athletic and health fees are excluded: with them ' +
    'the system average is $198.22 a credit, and UF’s is $214.54.',
};

const UF_COST: Provenance = {
  source_url: 'https://policy.ufl.edu/regulation/3-0375/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'UF Regulation 3.0375, 2026-27 resident undergraduate: tuition $105.07, differential ' +
    '$44.17, capital improvement $6.76, financial aid $5.25, technology $5.25 — $166.50 a ' +
    'credit. Health, athletic, activity and transportation fees bring it to $214.54 and are ' +
    'excluded here.',
};

/**
 * Florida is the strongest exam-credit jurisdiction in this dataset, and it is
 * not close. Elsewhere a campus DECIDES what an exam is worth; in Florida the
 * state publishes the table and the institution MUST award what it says.
 */
const FL_EXAM_POLICY: Provenance = {
  source_url: 'https://www.flbog.edu/wp-content/uploads/2026/06/ACC-Credit-by-Exam-Equivalencies-List.pdf',
  as_of: '2026-10-01',
  confidence: 'statute',
  note:
    'Section 1007.27(2), Florida Statutes, and State Board rule 6A-10.024: the ' +
    'Articulation Coordinating Committee sets passing scores and course equivalents for ' +
    'AP, AICE, IB, DSST, DLPT, UExcel and CLEP, and state universities and colleges ' +
    'MUST award the listed credit even if they do not offer the course. Courses marked ' +
    'core on that list are general education core courses. Transfer of up to 45 ' +
    'credit-by-exam credits is guaranteed; beyond that it is the receiving university’s ' +
    'call. CLEP is worth real general-education ' +
    'credit here — the opposite of California.',
};

const FL_RESIDENCY: Provenance = {
  source_url: 'https://policies.fiu.edu/files/340.065',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'The five largest universities all ask for 30 hours, and every one of them ties it to ' +
    'the END of the degree — the last 30 at UF, FSU and FIU, 30 of the last 39 at UCF, 30 ' +
    'of the last 60 at USF — so exam credit cannot be your final hours. We have not read ' +
    'this university’s rule. Confirm with the registrar.',
};

const residency = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'published', note,
});

const FL_TRANSFER_CAP: Provenance = {
  source_url: 'https://flrules.org/gateway/readFile.asp?sid=0&tid=31214908&type=1&file=6A-10.024.doc',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'State Board rule 6A-10.024 (the Statewide Articulation Agreement): the 60 semester ' +
    'hours of an associate in arts "shall be accepted in total" on transfer, and transfer ' +
    'of credit by exam is guaranteed for up to 45 credits, with anything beyond at the ' +
    'receiving university’s discretion. Both are guarantees, not limits; we model 60 as ' +
    'the most a community-college route can be counted on to carry. Ask your university ' +
    'whether it takes more.',
};

interface Known {
  cost?: Provenance;
  residency?: Provenance;
  cap?: Provenance;
}

const fl = (id: string, name: string, known: Known = {}): Institution => ({
  id,
  name,
  system: 'FL-SUS',
  cost_per_unit_usd: FL_PER_UNIT,
  residency_min_units: 30,
  max_transfer_units: 60,
  refuses: [],
  exam_policy_provenance: FL_EXAM_POLICY,
  residency_provenance: known.residency ?? FL_RESIDENCY,
  transfer_cap_provenance: known.cap ?? FL_TRANSFER_CAP,
  cost_provenance: known.cost ?? FL_COST,
});

/** All twelve institutions of the Florida State University System. */
export const floridaInstitutions: Institution[] = [
  fl('u-florida', 'University of Florida', {
    cost: UF_COST,
    residency: residency('https://catalog.ufl.edu/UGRD/colleges-schools/UGLAS/',
      'The last 30 credits applied to the degree must be completed at UF.'),
    cap: residency('https://catalog.ufl.edu/UGRD/colleges-schools/UGLAS/',
      'Under most circumstances, a student who has already transferred 60 credits from a ' +
      'public or state college may not apply more public or state college credit.'),
  }),
  fl('florida-state', 'Florida State University', {
    residency: residency('https://bulletin.fsu.edu/academics/ug-degree-reqs',
      'The last 30 credit hours at FSU, plus 30 of your 45 upper-division hours and half ' +
      'the major.'),
  }),
  fl('u-south-florida', 'University of South Florida', {
    residency: residency('https://www.usf.edu/arts-sciences/students/advising/your-degree/index.aspx',
      '30 of your last 60 hours must be earned at USF.'),
  }),
  fl('u-central-florida', 'University of Central Florida', {
    residency: residency('https://www.ucf.edu/degree/history-ba/',
      '30 of the last 39 hours at UCF. At most 45 hours of CLEP, credit by exam, ' +
      'correspondence and military credit count toward the degree.'),
  }),
  fl('florida-international', 'Florida International University', {
    residency: residency('https://policies.fiu.edu/files/340.065',
      'At least 25 percent of the degree and the last 30 semester hours at FIU.'),
  }),
  fl('florida-atlantic', 'Florida Atlantic University'),
  fl('u-north-florida', 'University of North Florida'),
  fl('u-west-florida', 'University of West Florida'),
  fl('florida-am', 'Florida A&M University'),
  fl('florida-gulf-coast', 'Florida Gulf Coast University'),
  fl('new-college-florida', 'New College of Florida'),
  fl('florida-poly', 'Florida Polytechnic University'),
];
