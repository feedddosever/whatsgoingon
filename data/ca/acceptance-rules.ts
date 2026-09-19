import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { institutions } from './institutions.ts';

// Derived from the institution list rather than repeated here: a campus added
// there must never silently end up with no acceptance rules at all.
const CSU_IDS = institutions.filter(i => i.system === 'CSU').map(i => i.id);
const ALL_IDS = institutions.map(i => i.id);

/**
 * AP-to-Cal-GETC mappings, read off the Cal-GETC Standards external-exam table
 * rather than inferred. An earlier version of this file guessed them, and the
 * guesses were wrong in ways that would have cost a student money:
 *
 *   - AP Biology was recorded as clearing 5B only. It clears 5B **and** the 5C
 *     laboratory, so a student was being told to go and take a lab they had
 *     already satisfied.
 *   - AP Chemistry likewise clears 5A **and** 5C.
 *   - AP English Literature was recorded as 3B only. It clears 1A **or** 3B.
 *   - AP Art History was recorded as 3A only. It clears 3A **or** 3B.
 *
 * Two rules that the table is explicit about, and that the data must keep:
 * **no AP exam satisfies Area 1B** (critical thinking) — an English score of
 * 3-5 meets 1A and expressly not 1B — and no AP exam satisfies Area 6
 * (ethnic studies) or Area 1C.
 */
const CAL_GETC_AP: Provenance = {
  source_url: 'https://icas-ca.org/wp-content/uploads/2026/07/Cal-GETC_Standards_1v4_Final_r.pdf',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'Cal-GETC Standards v1.4, external-exam table. Score of 3 or higher. The campus ' +
    'still decides separately whether an exam satisfies a MAJOR requirement — confirm ' +
    'that with the department, not just the registrar.',
};

const CAL_GETC_AREAS: Provenance = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '2026-09-18',
  confidence: 'published',
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

/**
 * [credit source, areas cleared together, semester units].
 *
 * A source appearing twice is an EITHER/OR from the standard, not a mistake —
 * the student spends the exam on one of them. The engine enforces that.
 */
const AP_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['ap-english-lang', ['1A'], 3],
  ['ap-english-lit', ['1A'], 3],
  ['ap-english-lit', ['3B'], 3],
  ['ap-calculus-ab', ['2'], 3],
  ['ap-calculus-bc', ['2'], 3],
  ['ap-art-history', ['3A'], 3],
  ['ap-art-history', ['3B'], 3],
  ['ap-spanish', ['3B'], 3],
  ['ap-european-history', ['3B'], 3],
  ['ap-european-history', ['4'], 3],
  ['ap-psychology', ['4'], 3],
  ['ap-macroeconomics', ['4'], 3],
  ['ap-microeconomics', ['4'], 3],
  ['ap-human-geography', ['4'], 3],
  ['ap-comparative-government', ['4'], 3],
  // Science exams carry their own laboratory. This is the correction that
  // matters most: without it the plan sends a student to sit a lab twice.
  ['ap-biology', ['5B', '5C'], 4],
  ['ap-chemistry', ['5A', '5C'], 4],
  ['ap-physics-1', ['5A', '5C'], 4],
  ['ap-environmental-science', ['5A', '5C'], 4],
];

/** CCC course -> area. Articulation is institution-pair specific, always. */
const CCC_RULES: ReadonlyArray<readonly [string, string[], string]> = [
  ['ccc-engl-1a', ['1A'], 'Confirm this exact course against this exact campus on ASSIST.'],
  ['ccc-engl-1b', ['1B'], 'Critical thinking. No AP exam satisfies 1B, so this route is the only one we hold.'],
  ['ccc-math-1', ['2'], 'Math articulation frequently depends on the major. Confirm on ASSIST.'],
  ['ccc-art-1', ['3A'], 'Confirm on ASSIST.'],
  ['ccc-hum-1', ['3B'], 'Confirm on ASSIST.'],
  ['ccc-soc-1', ['4'], 'Cal-GETC area 4. Confirm the specific course on ASSIST.'],
  ['ccc-physics-1', ['5A', '5C'], 'A lecture-plus-lab section clears the laboratory too. Confirm on ASSIST.'],
  ['ccc-biology-1', ['5B', '5C'], 'A lecture-plus-lab section clears the laboratory too. Confirm on ASSIST.'],
  ['ccc-ethnic-studies-1', ['6'], 'Cal-GETC area 6. No exam satisfies it. Confirm the course on ASSIST.'],
];

const rules: AcceptanceRule[] = [];

for (const inst of ALL_IDS) {
  for (const [src, areas, units] of AP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 3, units_granted: units, satisfies_areas: [...areas],
      provenance: CAL_GETC_AP,
    });
  }
  for (const [src, areas, note] of CCC_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: null, units_granted: areas.length > 1 ? 4 : 3, satisfies_areas: [...areas],
      provenance: ASSIST(note),
    });
  }
}

/**
 * CLEP rows exist so the app can say what a student's CLEP credit is worth —
 * which, against Cal-GETC, is nothing. Deliberately area-clearing nothing.
 */
for (const inst of CSU_IDS) {
  for (const src of ['clep-college-composition', 'clep-college-algebra', 'clep-intro-psychology']) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 50, units_granted: 3, satisfies_areas: [],
      provenance: CLEP_POLICY,
    });
  }
}

// Area 1C (Oral Communication) is a CSU requirement under Cal-GETC and not a UC
// one, so a UC-bound student gains nothing from it. No AP exam satisfies it.
for (const inst of CSU_IDS) {
  rules.push({
    institution_id: inst, credit_source_id: 'ccc-comm-1',
    min_score: null, units_granted: 3, satisfies_areas: ['1C'],
    provenance: { ...CAL_GETC_AREAS, note: 'Area 1C is required for CSU and not for UC.' },
  });
}

export const acceptanceRules: AcceptanceRule[] = rules;
