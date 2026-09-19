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

const uc = (id: string, name: string, tag: boolean): Institution => ({
  id,
  name,
  system: 'UC',
  cost_per_unit_usd: UC_PER_UNIT,
  residency_min_units: 24,
  max_transfer_units: 70,
  accepts_clep: false,
  accepts_third_party_transcript: false,
  exam_policy_provenance: {
    ...UC_EXAM_POLICY,
    note: UC_EXAM_POLICY.note + ' ' + (tag ? TAG : NO_TAG(name)),
  },
  residency_provenance: UC_RESIDENCY,
  transfer_cap_provenance: UC_TRANSFER_CAP,
  cost_provenance: UC_COST,
});

const csu = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'CSU',
  cost_per_unit_usd: CSU_PER_UNIT,
  residency_min_units: 30,
  max_transfer_units: 70,
  accepts_clep: true,
  accepts_third_party_transcript: true,
  exam_policy_provenance: CSU_EXAM_POLICY,
  residency_provenance: CSU_RESIDENCY,
  transfer_cap_provenance: CSU_TRANSFER_CAP,
  cost_provenance: CSU_COST,
});

const TAG =
  'This campus participates in UC TAG: guaranteed transfer admission if you sign a ' +
  'TAG in the Sept 1-30 window and meet its terms.';
const NO_TAG = (n: string): string =>
  `${n} does NOT participate in UC TAG — the guarantee is not available here.`;

/**
 * Every public four-year campus in California: all 9 UC undergraduate campuses
 * and all 23 CSU campuses.
 *
 * Systemwide policy is genuinely uniform and confirmed — UC awards no CLEP
 * credit anywhere, CSU accepts it toward a degree but never against Cal-GETC.
 * What varies per campus (residency minimums, transfer caps, which exams clear
 * which major requirement) is NOT confirmed and is labelled `needs_check`
 * rather than guessed, because a campus-specific number invented here is
 * exactly the kind of claim that costs a student a semester.
 */
export const institutions: Institution[] = [
  uc("uc-berkeley", "UC Berkeley", false),
  uc("uc-davis", "UC Davis", true),
  uc("uc-irvine", "UC Irvine", true),
  uc("ucla", "UCLA", false),
  uc("uc-merced", "UC Merced", true),
  uc("uc-riverside", "UC Riverside", true),
  uc("uc-san-diego", "UC San Diego", false),
  uc("uc-santa-barbara", "UC Santa Barbara", true),
  uc("uc-santa-cruz", "UC Santa Cruz", true),

  csu("csu-bakersfield", "CSU Bakersfield"),
  csu("csu-channel-islands", "CSU Channel Islands"),
  csu("csu-chico", "CSU Chico"),
  csu("csu-dominguez-hills", "CSU Dominguez Hills"),
  csu("csu-east-bay", "CSU East Bay"),
  csu("csu-fresno", "Fresno State"),
  csu("csu-fullerton", "CSU Fullerton"),
  csu("cal-poly-humboldt", "Cal Poly Humboldt"),
  csu("csu-long-beach", "CSU Long Beach"),
  csu("csu-los-angeles", "Cal State LA"),
  csu("cal-maritime", "Cal State Maritime"),
  csu("csu-monterey-bay", "CSU Monterey Bay"),
  csu("csu-northridge", "CSU Northridge"),
  csu("cal-poly-pomona", "Cal Poly Pomona"),
  csu("csu-sacramento", "Sacramento State"),
  csu("csu-san-bernardino", "CSU San Bernardino"),
  csu("san-diego-state", "San Diego State"),
  csu("san-francisco-state", "San Francisco State"),
  csu("san-jose-state", "San Jose State University"),
  csu("cal-poly-slo", "Cal Poly San Luis Obispo"),
  csu("csu-san-marcos", "CSU San Marcos"),
  csu("sonoma-state", "Sonoma State"),
  csu("csu-stanislaus", "Stanislaus State"),
];
