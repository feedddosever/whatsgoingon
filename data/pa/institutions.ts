import type { Institution, Provenance } from '../../src/types.ts';

/**
 * The ten universities of the Pennsylvania State System of Higher Education
 * (PASSHE). The Board sets in-state undergraduate tuition systemwide, and the
 * residency rule is a system standard, so one row of provenance serves all ten.
 */

const PASSHE_COST: Provenance = {
  source_url: 'https://www.commonwealthu.edu/cost-and-aid/tuition-cost',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'PASSHE in-state undergraduate tuition for 2026-27 is $4,169 a semester full-time, $347 ' +
    'a credit, set by the Board for every university. PASSHE has said it will roll the rate ' +
    'back if the state budget funds it. Mandatory and technology fees ($2,058–$4,118 and ' +
    '$518–$970 a year) are extra and excluded.',
};

const PASSHE_EXAM: Provenance = {
  source_url: 'https://collegetransfer.pa.gov/Administrators/Credit-for-Prior-Learning',
  as_of: '2026-10-01',
  // The Department of Education's page quoting the statute; the statute itself
  // was not opened, so this is not marked as law.
  confidence: 'published',
  note:
    '24 P.S. § 20-2002-C(d), added in 2017: community colleges and PASSHE universities must ' +
    'award credit, and apply it toward graduation, at the statewide minimum scores — 3 on AP, ' +
    '50 on CLEP for the exams that have a standard. Which course the credit counts as, and ' +
    'whether it fills general education, a major or an elective, is each university’s call.',
};

const PASSHE_RESIDENCY: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/PS%202016-24-A%20Graduation%20Residency%20Requirements.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'PASSHE Procedure/Standard 2016-24-A: at least 30 of your last 60 credits from the ' +
    'university granting the degree, and a university may not require more than 30. At least ' +
    'half the credits of your major must also come from a State System university.',
};

const PASSHE_CAP: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/BOG_Policies/Policy%201999-01-A.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'No separate cap on community-college credit. With an associate in arts or science in a ' +
    'parallel or statewide program-to-program major, you will not be required to complete more ' +
    'than 60 further credits for a 120-credit degree (Board Policy 1999-01-A). Without one, the ' +
    '30-credit residency rule is what limits you.',
};

const passhe = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'PASSHE',
  cost_per_unit_usd: 347,
  cost_provenance: PASSHE_COST,
  residency_min_units: 30,
  residency_provenance: PASSHE_RESIDENCY,
  max_transfer_units: null,
  transfer_cap_provenance: PASSHE_CAP,
  refuses: [],
  exam_policy_provenance: PASSHE_EXAM,
});

export const pennsylvaniaInstitutions: Institution[] = [
  passhe('west-chester', 'West Chester University'),
  passhe('iup', 'Indiana University of Pennsylvania'),
  passhe('slippery-rock', 'Slippery Rock University'),
  passhe('millersville', 'Millersville University'),
  passhe('kutztown', 'Kutztown University'),
  passhe('east-stroudsburg', 'East Stroudsburg University'),
  passhe('shippensburg', 'Shippensburg University'),
  passhe('commonwealth-u', 'Commonwealth University (Bloomsburg, Lock Haven, Mansfield)'),
  passhe('pennwest', 'PennWest University (California, Clarion, Edinboro)'),
  passhe('cheyney', 'Cheyney University'),
];
