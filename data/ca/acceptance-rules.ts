import type { AcceptanceRule, Provenance } from '../../src/types.ts';

const UC_IDS = ['uc-berkeley', 'ucla', 'uc-davis', 'uc-irvine'];
const CSU_IDS = ['csu-long-beach', 'san-jose-state'];
const ALL_IDS = [...UC_IDS, ...CSU_IDS];

/**
 * That AP is accepted against Cal-GETC is confirmed. WHICH area each individual
 * exam clears is not — that mapping was inferred, not read off the standard, so
 * it stays `needs_check`. The distinction matters: a student who takes AP Art
 * History expecting it to clear area 3A has spent $99 on our inference.
 */
const AP_MAPPING: Provenance = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '',
  confidence: 'needs_check',
  note:
    'CONFIRMED: AP at score 3+ is accepted by UC, CSU and CCC and may be applied to ' +
    'Cal-GETC. NOT CONFIRMED: that this particular exam clears this particular area — ' +
    'check the Cal-GETC v1.4 standard and the campus catalogue. Campuses also decide ' +
    'separately whether an exam satisfies a MAJOR requirement.',
};

const ASSIST = (note: string): Provenance => ({
  source_url: 'https://assist.org/',
  as_of: '',
  confidence: 'needs_check',
  note,
});

const CLEP_POLICY: Provenance = {
  source_url: 'https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'CLEP cannot be used for Cal-GETC. CSU accepts 31 of 33 CLEP exams toward a degree ' +
    '(capped at 30 units, some needing higher scores), but not against the GE transfer ' +
    'pattern. UC awards no CLEP credit whatsoever.',
};

/** Exam -> Cal-GETC area. AP is the only exam credit that works at both UC and CSU. */
const AP_AREAS: ReadonlyArray<readonly [string, string]> = [
  ['ap-english-lang', '1A'],
  ['ap-calculus-ab', '2'],
  ['ap-art-history', '3A'],
  ['ap-english-lit', '3B'],
  ['ap-psychology', '4'],
  ['ap-chemistry', '5A'],
  ['ap-biology', '5B'],
];

/** CCC course -> Cal-GETC area. Articulation is institution-pair specific, always. */
const CCC_AREAS: ReadonlyArray<readonly [string, string, string]> = [
  ['ccc-engl-1a', '1A', 'Confirm this exact course against this exact campus on ASSIST.'],
  ['ccc-engl-1b', '1B', 'Critical thinking. Confirm on ASSIST.'],
  ['ccc-math-1', '2', 'Math articulation frequently depends on the major. Confirm on ASSIST.'],
  ['ccc-art-1', '3A', 'Confirm on ASSIST.'],
  ['ccc-hum-1', '3B', 'Confirm on ASSIST.'],
  ['ccc-physics-1', '5A', 'Confirm on ASSIST.'],
  ['ccc-biology-1', '5B', 'Confirm on ASSIST.'],
  ['ccc-ethnic-studies-1', '6', 'Cal-GETC area 6. Confirm the specific course on ASSIST.'],
];

const rules: AcceptanceRule[] = [];

for (const inst of ALL_IDS) {
  for (const [src, area] of AP_AREAS) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 3, units_granted: 3, satisfies_area: area,
      provenance: AP_MAPPING,
    });
  }
  for (const [src, area, note] of CCC_AREAS) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: null, units_granted: 3, satisfies_area: area,
      provenance: ASSIST(note),
    });
  }
}

/**
 * CLEP rows exist so the app can say what a student's CLEP credit is worth —
 * which, against Cal-GETC, is nothing. Deliberately not area-clearing.
 */
for (const inst of CSU_IDS) {
  for (const src of ['clep-college-composition', 'clep-college-algebra', 'clep-intro-psychology']) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 50, units_granted: 3, satisfies_area: null,
      provenance: CLEP_POLICY,
    });
  }
}

// Area 1C (Oral Communication) is a CSU requirement under Cal-GETC and not a UC
// one, so a UC-bound student gains nothing from it.
for (const inst of CSU_IDS) {
  rules.push({
    institution_id: inst, credit_source_id: 'ccc-comm-1',
    min_score: null, units_granted: 3, satisfies_area: '1C',
    provenance: ASSIST('Cal-GETC area 1C is required for CSU and not for UC. Confirm on ASSIST.'),
  });
}

export const acceptanceRules: AcceptanceRule[] = rules;
