import type { Institution } from '../../src/types.ts';

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

/**
 * Systemwide CLEP policy, now confirmed: UC awards no CLEP credit at all, and
 * CSU accepts it toward a degree but never against Cal-GETC.
 */
const UC_POLICY = {
  source_url: 'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/',
  as_of: '2026-09-18',
  confidence: 'published' as const,
  note:
    'UC accepts only AP, IB and A-Level exams. It awards no credit for CLEP or DSST, and ' +
    'does not honour credit posted to a third-party transcript (Sophia, Study.com, ' +
    'StraighterLine, Saylor). Build a UC plan on AP/IB only. ' +
    'CAVEAT: the residency minimum and transfer-unit cap in this row are NOT yet confirmed ' +
    'against a UC source — only the exam policy is.',
};

const CSU_POLICY = {
  source_url: 'https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx',
  as_of: '2026-09-18',
  confidence: 'published' as const,
  note:
    'CSU accepts CLEP toward a degree, capped at 30 units, but CLEP cannot satisfy ' +
    'Cal-GETC. AP is not counted in that cap, so AP and CLEP can stack. ' +
    'CAVEAT: the residency minimum and transfer-unit cap in this row are NOT yet confirmed ' +
    'against a CSU source — only the exam policy is.',
};

export const institutions: Institution[] = [
  {
    id: 'uc-berkeley',
    name: 'UC Berkeley',
    system: 'UC',
    cost_per_unit_usd: UC_PER_UNIT,
    residency_min_units: 24,
    max_transfer_units: 70,
    accepts_clep: false,
    provenance: {
      ...UC_POLICY,
      note: UC_POLICY.note + ' Berkeley does NOT participate in UC TAG.',
    },
  },
  {
    id: 'ucla',
    name: 'UCLA',
    system: 'UC',
    cost_per_unit_usd: UC_PER_UNIT,
    residency_min_units: 24,
    max_transfer_units: 70,
    accepts_clep: false,
    provenance: {
      ...UC_POLICY,
      note: UC_POLICY.note + ' UCLA does NOT participate in UC TAG.',
    },
  },
  {
    id: 'uc-davis',
    name: 'UC Davis',
    system: 'UC',
    cost_per_unit_usd: UC_PER_UNIT,
    residency_min_units: 24,
    max_transfer_units: 70,
    accepts_clep: false,
    provenance: {
      ...UC_POLICY,
      note:
        UC_POLICY.note +
        ' Davis participates in UC TAG: a guaranteed transfer admission if you sign a TAG ' +
        'in the Sept 1-30 window and meet its terms.',
    },
  },
  {
    id: 'uc-irvine',
    name: 'UC Irvine',
    system: 'UC',
    cost_per_unit_usd: UC_PER_UNIT,
    residency_min_units: 24,
    max_transfer_units: 70,
    accepts_clep: false,
    provenance: {
      ...UC_POLICY,
      note: UC_POLICY.note + ' Irvine participates in UC TAG (apply Sept 1-30).',
    },
  },
  {
    id: 'csu-long-beach',
    name: 'CSU Long Beach',
    system: 'CSU',
    cost_per_unit_usd: CSU_PER_UNIT,
    residency_min_units: 30,
    max_transfer_units: 70,
    accepts_clep: true,
    provenance: CSU_POLICY,
  },
  {
    id: 'san-jose-state',
    name: 'San Jose State University',
    system: 'CSU',
    cost_per_unit_usd: CSU_PER_UNIT,
    residency_min_units: 30,
    max_transfer_units: 70,
    accepts_clep: true,
    provenance: CSU_POLICY,
  },
];
