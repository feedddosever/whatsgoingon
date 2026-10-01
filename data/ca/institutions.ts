import type { Institution, Provenance } from '../../src/types.ts';

/**
 * cost_per_unit_usd is DERIVED, and the derivation matters:
 *
 *   CSU 2026-27: $6,838 systemwide tuition + ~$2,194 average campus fees
 *                = ~$9,032/yr ÷ 30 units = ~$301/unit
 *   UC  2026-27: $15,588 systemwide tuition and fees + ~$1,852 average campus fees
 *                = ~$17,440/yr ÷ 30 units = ~$581/unit
 *
 * Neither system actually charges per unit — both charge tiered flat rates, so a
 * full-time student pays the same for 12 units as for 18. Dividing by 30 is
 * closest to true for a student adding a term's worth of GE and OVERSTATES the
 * saving for someone already enrolled full time. See data/VERIFICATION.md 8a.
 */
const UC_PER_UNIT = 581;
const CSU_PER_UNIT = 301;

/** Confirmed 2026-09-18. Covers exam policy ONLY — not residency, not caps. */
const UC_EXAM_POLICY: Provenance = {
  source_url:
    'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'UC accepts only AP, IB and A-Level exams. A-Levels earn degree credit (grades A\u2013C) ' +
    'but appear nowhere in the Cal-GETC standards, so they clear no general-education area. ' +
    'It awards no credit for CLEP, DSST or DLPT, and ' +
    'does not honour credit posted to a third-party transcript (Sophia, Study.com, ' +
    'StraighterLine, Saylor). Build a UC plan on AP/IB only.',
};

const CSU_EXAM_POLICY: Provenance = {
  source_url: 'https://calstate.policystat.com/policy/20781575/latest/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CSU\u2019s systemwide external-exam chart (effective 25 June 2026): most CLEP exams earn ' +
    'units toward a CSU degree, capped at 30 units, but CLEP cannot satisfy Cal-GETC. Some ' +
    'earn nothing at all \u2014 College Composition and College Mathematics among them. AP ' +
    'and IB are outside the 30-unit cap.',
};

/**
 * Residency and transfer caps are NOT covered by the exam-policy sources above,
 * and nobody has confirmed them. They carry their own provenance so a warning
 * resting on them cannot borrow the exam policy's credibility.
 */
const UC_RESIDENCY: Provenance = {
  // Senate Regulation 630, read 2026-09-28. Not the exam-policy page: that one
  // does not cover residency, and linking it would answer a different question.
  source_url: 'https://senate.universityofcalifornia.edu/bylaws-regulations/regulations/rpart3.html',
  as_of: '2026-09-28',
  confidence: 'published',
  note:
    'UC Senate Regulation 630: 24 of your final 30 semester units (35 of the final 45 quarter ' +
    'units) must be earned in residence in the UC college that awards the degree.',
};

const UC_TRANSFER_CAP: Provenance = {
  source_url:
    'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/preparing-to-transfer/transfer-credit.html',
  as_of: '2026-09-27',
  confidence: 'published',
  note:
    'UC accepts up to 70 semester (105 quarter) units for lower-division coursework ' +
    'completed at any non-UC school. How exam credit interacts with that limit is not ' +
    'confirmed here.',
};

const CSU_RESIDENCY: Provenance = {
  source_url: 'https://www.law.cornell.edu/regulations/california/5-CCR-40403',
  as_of: '2026-09-28',
  confidence: 'statute',
  note:
    'Title 5 \u00a7 40403: 30 semester units at the campus granting the degree, 24 of them ' +
    'upper-division and 12 in the major.',
};

const CSU_TRANSFER_CAP: Provenance = {
  source_url: 'https://www.calstate.edu/apply',
  as_of: '2026-09-27',
  confidence: 'published',
  note:
    'The CSU can accept a maximum of 70 transferable semester (105 quarter) units from ' +
    'community colleges.',
};


/**
 * The per-unit figure is derived, not published. Both systems charge tiered flat
 * rates, so this is an estimate that is closest to true for a student adding a
 * term's worth of GE and overstates the saving for someone already full-time.
 */
const UC_COST: Provenance = {
  source_url: 'https://www.ucop.edu/operating-budget/_files/fees/202627/2026-27.pdf',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Derived: $15,588 systemwide tuition and Student Services Fee for a 2026-27 entering ' +
    'resident (UC Office of the President), plus $1,852 average campus fees (Legislative ' +
    'Analyst\u2019s Office), divided by 30 units. Campus fees run from about $842 (UCLA) to ' +
    '$2,626 (Berkeley), and UC charges a flat rate rather than per unit, so this is an ' +
    'estimate rather than a price.',
};

const CSU_COST: Provenance = {
  source_url: 'https://www.calstate.edu/apply/paying-for-college/csu-costs/tuition-and-fees/Pages/basic-tuition-and-fees.aspx',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Derived: $6,838 systemwide 2026-27 tuition plus $2,194 average campus fees (CSU\u2019s own ' +
    'figure, based on 2025-26; the Legislative Analyst assumes $2,304 for 2026-27), divided ' +
    'by 30 units. CSU charges a flat rate rather than per unit, so this is an estimate rather ' +
    'than a price.',
};

const uc = (id: string, name: string, tag: boolean): Institution => ({
  id,
  name,
  system: 'UC',
  cost_per_unit_usd: UC_PER_UNIT,
  residency_min_units: 24,
  max_transfer_units: 70,
  // Published, and the most expensive fact in the dataset: UC awards nothing
  // for CLEP, nothing for DSST, and nothing posted to a third-party transcript.
  // From UC's own sentence, quoted below: it accepts AP, IB and A-Level and
  // nothing else. Everything outside that list is a refusal we can point at.
  refuses: ['clep', 'dsst', 'dlpt', 'alt_provider'],
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
  // CSU publishes no refusal for any family. That is NOT acceptance — what a
  // given exam clears is an acceptance rule, and CLEP's clears nothing.
  refuses: [],
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
