import type { Institution, Provenance } from '../../src/types.ts';

/**
 * cost_per_unit_usd is DERIVED, and the derivation matters:
 *
 *   CSU 2026-27: $6,838 systemwide tuition + ~$2,194 average campus fees
 *                = ~$9,032/yr ÷ 30 units = ~$301/unit
 *   UC  2026-27: $15,588 systemwide tuition and fees + ~$1,650 campus-based fees
 *                = ~$17,238/yr ÷ 30 units = ~$575/unit
 *
 * Neither system actually charges per unit — both charge tiered flat rates, so a
 * full-time student pays the same for 12 units as for 18. Dividing by 30 is
 * closest to true for a student adding a term's worth of GE and OVERSTATES the
 * saving for someone already enrolled full time. See data/VERIFICATION.md 8a.
 */
const UC_PER_UNIT = 575;
const CSU_PER_UNIT = 301;

/** Confirmed 2026-09-18. Covers exam policy ONLY — not residency, not caps. */
const UC_EXAM_POLICY: Provenance = {
  source_url:
    'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'UC accepts only AP, IB and A-Level exams. It awards no credit for CLEP or DSST, and ' +
    'does not honour credit posted to a third-party transcript (Sophia, Study.com, ' +
    'StraighterLine, Saylor). Build a UC plan on AP/IB only.',
};

const CSU_EXAM_POLICY: Provenance = {
  source_url: 'https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'CSU accepts CLEP toward a degree, capped at 30 units, but CLEP cannot satisfy ' +
    'Cal-GETC. AP is not counted in that cap, so AP and CLEP can stack.',
};

/**
 * Residency and transfer caps are NOT covered by the exam-policy sources above,
 * and nobody has confirmed them. They carry their own provenance so a warning
 * resting on them cannot borrow the exam policy's credibility.
 */
const UC_RESIDENCY: Provenance = {
  // Deliberately blank: the exam-policy page does not cover residency, and
  // linking it would send a student to a page that cannot answer their question.
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note: 'Minimum units earned on campus. Unconfirmed — ask the campus registrar.',
};

const UC_TRANSFER_CAP: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'UC is widely reported to cap community-college transfer at 70 semester units, but this ' +
    'is unconfirmed, as is how it interacts with exam credit.',
};

const CSU_RESIDENCY: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note: 'Minimum units earned on campus. Unconfirmed — ask the campus registrar.',
};

const CSU_TRANSFER_CAP: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note: 'Transfer-unit cap unconfirmed against a CSU source.',
};


/**
 * The per-unit figure is derived, not published. Both systems charge tiered flat
 * rates, so this is an estimate that is closest to true for a student adding a
 * term's worth of GE and overstates the saving for someone already full-time.
 */
const UC_COST: Provenance = {
  source_url: 'https://lao.ca.gov/Publications/Report/2026-27-budget-university-of-california',
  as_of: '2026-09-18',
  confidence: 'needs_check',
  note:
    'Derived from $15,588 systemwide tuition and fees plus ~$1,650 campus-based fees, ' +
    'divided by 30 units. UC charges a tiered flat rate, not per unit, so treat this as ' +
    'an estimate rather than a price.',
};

const CSU_COST: Provenance = {
  source_url: 'https://lao.ca.gov/Publications/Report/2026-27-budget-california-state-university',
  as_of: '2026-09-18',
  confidence: 'needs_check',
  note:
    'Derived from $6,838 systemwide tuition plus ~$2,194 average campus fees, divided by ' +
    '30 units. CSU charges a tiered flat rate, not per unit, so treat this as an estimate ' +
    'rather than a price.',
};

const uc = (id: string, name: string, tagNote: string): Institution => ({
  id,
  name,
  system: 'UC',
  cost_per_unit_usd: UC_PER_UNIT,
  cost_provenance: UC_COST,
  residency_min_units: 24,
  max_transfer_units: 70,
  accepts_clep: false,
  exam_policy_provenance: { ...UC_EXAM_POLICY, note: UC_EXAM_POLICY.note + ' ' + tagNote },
  residency_provenance: UC_RESIDENCY,
  transfer_cap_provenance: UC_TRANSFER_CAP,
});

const csu = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'CSU',
  cost_per_unit_usd: CSU_PER_UNIT,
  cost_provenance: CSU_COST,
  residency_min_units: 30,
  max_transfer_units: 70,
  accepts_clep: true,
  exam_policy_provenance: CSU_EXAM_POLICY,
  residency_provenance: CSU_RESIDENCY,
  transfer_cap_provenance: CSU_TRANSFER_CAP,
});

const TAG = 'This campus participates in UC TAG: guaranteed transfer admission if you sign a ' +
  'TAG in the Sept 1-30 window and meet its terms.';
const NO_TAG = (n: string) => `${n} does NOT participate in UC TAG.`;

export const institutions: Institution[] = [
  uc('uc-berkeley', 'UC Berkeley', NO_TAG('Berkeley')),
  uc('ucla', 'UCLA', NO_TAG('UCLA')),
  uc('uc-davis', 'UC Davis', TAG),
  uc('uc-irvine', 'UC Irvine', TAG),
  csu('csu-long-beach', 'CSU Long Beach'),
  csu('san-jose-state', 'San Jose State University'),
];
