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
    'a credit — the Board’s base rate, which PASSHE says applies at most of its universities. ' +
    'PASSHE has said it will roll the rate back if the state budget funds it. Mandatory and ' +
    'technology fees ($2,058–$4,118 and ' +
    '$518–$970 a year) are extra and excluded.',
};

const PASSHE_EXAM: Provenance = {
  source_url: 'https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?SESSYR=1949&SESSIND=0&ACTNUM=14&SMTHLWIND=&CHPT=20C',
  as_of: '2026-10-01',
  // The statute page is JavaScript-only and was read back by a browser agent,
  // not by a person, so this stays `published` rather than `statute` until
  // someone opens it by hand.
  confidence: 'published',
  note:
    '24 P.S. § 20-2002-C(d), added by Act 55 of 2017: community colleges and PASSHE ' +
    'universities must award credit, and apply it toward graduation, at the statewide minimum scores — 3 on AP, ' +
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

const withNote = (p: Provenance, extra: string): Provenance => ({ ...p, note: `${extra} ${p.note ?? ''}`.trim() });

const passhe = (id: string, name: string, exam: Provenance = PASSHE_EXAM): Institution => ({
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
  exam_policy_provenance: exam,
});

export const pennsylvaniaInstitutions: Institution[] = [
  passhe('west-chester', 'West Chester University'),
  passhe('iup', 'Indiana University of Pennsylvania'),
  passhe('slippery-rock', 'Slippery Rock University', withNote(
    { ...PASSHE_EXAM, source_url: 'https://catalog.sru.edu/academic-policies/credit-by-examination/' },
    'Slippery Rock: at most 45 credits by examination, and none of them may be among your ' +
    'final 30 credits.',
  )),
  passhe('millersville', 'Millersville University'),
  passhe('kutztown', 'Kutztown University'),
  passhe('east-stroudsburg', 'East Stroudsburg University'),
  passhe('shippensburg', 'Shippensburg University', withNote(
    { ...PASSHE_EXAM, source_url: 'https://www.ship.edu/admissions/clep_credit_ap_credit/' },
    'Shippensburg: at most 30 credits through CLEP.',
  )),
  passhe('commonwealth-u', 'Commonwealth University (Bloomsburg, Lock Haven, Mansfield)'),
  passhe('pennwest', 'PennWest University (California, Clarion, Edinboro)'),
  passhe('cheyney', 'Cheyney University', withNote(
    { ...PASSHE_EXAM, source_url: 'https://cheyney1837.wpenginepowered.com/wp-content/uploads/2026/01/2526_Undergraduate-Academic-Catalog_02292025_Amended-1-9-2026.pdf' },
    'Cheyney: no more than 30 credits from AP, IB, DANTES, CLEP and military experience ' +
    'combined.',
  )),
];
