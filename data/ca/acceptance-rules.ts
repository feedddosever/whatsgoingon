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
  source_url: 'https://calstate.policystat.com/policy/20781575/latest/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CLEP cannot be used for Cal-GETC (Cal-GETC Standards v1.4, \u00a7 6.3). CSU\u2019s ' +
    'external-exam chart awards units toward the degree for most CLEP exams, capped at 30 ' +
    'units \u2014 but none for College Composition. UC awards no CLEP credit whatsoever.',
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
  // Cal-GETC allows 3 semester units for it, not 4 \u2014 which matters toward Area 5's 7.
  ['ap-environmental-science', ['5A', '5C'], 3],
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

/**
 * IB against Cal-GETC.
 *
 * The MECHANISM is published and worth stating exactly: a Higher Level score of
 * 5 or better is what Cal-GETC certification requires, and an acceptable IB
 * score is worth 3 semester units for certification. UC separately awards 8
 * quarter units per HL exam toward the degree, which is a different number
 * answering a different question, and conflating the two is how a student ends
 * up believing one exam cleared two requirements.
 *
 * The per-subject MAPPING below has NOT been read off the Cal-GETC external-exam
 * table — that document is not reachable from this build environment — so every
 * row is `needs_check` and the conservative route will not touch them.
 *
 * Deliberately under-claimed: the IB sciences are mapped to their science area
 * ONLY, with no laboratory. AP Biology carries its own 5C lab and IB may well
 * too, but "may well" is how this dataset gets a student wrong, and the cost of
 * being wrong here is a lab they still have to take.
 */
const CAL_GETC_IB: Provenance = {
  source_url: 'https://icas-ca.org/wp-content/uploads/2026/07/Cal-GETC_Standards_1v4_Final_r.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'Cal-GETC Standards v1.4, IB table: a Higher Level score of 5 or better counts as 3 ' +
    'semester units toward the area listed. Separately, UC awards 8 quarter units per HL exam ' +
    'toward the degree, and the IB diploma at 30+ adds 6 more: those are degree units, not ' +
    'general-education clearance, and they are not the same thing.',
};

/** DSST is accepted toward a CSU degree and satisfies no Cal-GETC area. */
const CSU_DSST: Provenance = {
  source_url: 'https://www.calstate.edu/attend/student-services/troops-to-college/applying-to-the-csu/pages/credit-for-prior-learning.aspx',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'The CSU names DSST among the external exams its campuses may credit, but its systemwide ' +
    'exam chart covers only AP, IB, CLEP and DLPT, so the score and units are each campus\u2019s ' +
    'decision. DSST is not in the Cal-GETC standards, so it clears no area \u2014 confirm the ' +
    'credit with the campus. The University of California awards no DSST credit whatsoever.',
};

/**
 * A Level against Cal-GETC.
 *
 * UC accepts it by name, which is the whole reason it is here: an A Level
 * student arriving at a UC has credit that CLEP and DSST students do not.
 *
 * `min_score` is null and cannot be otherwise — A Levels are graded A to E, and
 * the field is a number. The grade requirement (A, B or C) lives in the note,
 * which is a gap in the model rather than in the data. Recorded in data/GAPS.md.
 */
const CAL_GETC_ALEVEL: Provenance = {
  source_url: 'https://admission.universityofcalifornia.edu/admission-requirements/ap-exam-credits/a-levels.html',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'UC grants degree credit for A Levels at grade A, B or C, up to 12 quarter (8 semester) ' +
    'units per exam, applied as each campus decides. A Levels do not appear in the Cal-GETC ' +
    'standards at all, so they clear no general-education area \u2014 the credit counts toward ' +
    'your units, not your requirements.',
};

/**
 * A Levels at UC: degree credit, no Cal-GETC area. They were mapped to areas
 * here until 2026-10-01; the Cal-GETC standards have no A-Level table, and the
 * CSU's exam chart has no A-Level rows, so there are no CSU rows at all.
 */
const ALEVEL_SOURCES: ReadonlyArray<string> = [
  'alevel-english-literature', 'alevel-mathematics', 'alevel-art-design', 'alevel-spanish',
  'alevel-history', 'alevel-economics', 'alevel-psychology', 'alevel-geography',
  'alevel-chemistry', 'alevel-physics', 'alevel-biology',
];

/**
 * [source, areas cleared together, semester units], from the Cal-GETC v1.4 IB
 * table. An empty area list is degree credit that clears no area: Visual Arts
 * and Language B are not in the table (Language B HL counts only toward the
 * language-other-than-English proficiency requirement). English A clears 3B and
 * never 1A — UC says IB cannot meet the English composition requirement.
 */
const IB_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['ib-english-a-hl', ['3B'], 3],
  ['ib-mathematics-aa-hl', ['2'], 3],
  ['ib-visual-arts-hl', [], 3],
  ['ib-spanish-b-hl', [], 3],
  ['ib-history-hl', ['4'], 3],
  ['ib-economics-hl', ['4'], 3],
  ['ib-psychology-hl', ['4'], 3],
  ['ib-geography-hl', ['4'], 3],
  ['ib-chemistry-hl', ['5A'], 3],
  ['ib-physics-hl', ['5A'], 3],
  ['ib-biology-hl', ['5B'], 3],
];

/**
 * Mathematics: Applications and Interpretation HL. The Cal-GETC table lists it
 * for Area 2 with the warning that it "may not be at all UC", and UC's own IB page
 * awards it no credit from 2021 on — so it clears Area 2 at a CSU only.
 */
const IB_MATH_AI_CSU: readonly [string, string[], number] = ['ib-mathematics-ai-hl', ['2'], 3];

const rules: AcceptanceRule[] = [];

for (const inst of ALL_IDS) {
  for (const [src, areas, units] of AP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 3, units_granted: units, satisfies_areas: [...areas],
      provenance: CAL_GETC_AP,
    });
  }
  for (const [src, areas, units] of IB_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 5, units_granted: units, satisfies_areas: [...areas],
      provenance: CAL_GETC_IB,
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
// A Levels: UC degree credit only, clearing nothing.
for (const inst of ALL_IDS.filter(id => !CSU_IDS.includes(id))) {
  for (const src of ALEVEL_SOURCES) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: null, units_granted: 8, satisfies_areas: [],
      provenance: CAL_GETC_ALEVEL,
    });
  }
}

// IB Mathematics AI HL clears Area 2 at a CSU, and earns nothing at UC.
for (const inst of CSU_IDS) {
  const [src, areas, units] = IB_MATH_AI_CSU;
  rules.push({
    institution_id: inst, credit_source_id: src,
    min_score: 5, units_granted: units, satisfies_areas: [...areas],
    provenance: CAL_GETC_IB,
  });
}

// CLEP College Composition earns 0 units at CSU, so it has no row: a row would
// say the CSU counts it toward the degree, and the CSU chart says it does not.
for (const inst of CSU_IDS) {
  for (const src of ['clep-college-algebra', 'clep-intro-psychology']) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 50, units_granted: 3, satisfies_areas: [],
      provenance: CLEP_POLICY,
    });
  }
}

/**
 * DSST at a CSU: credit toward the degree, and no Cal-GETC area cleared. The
 * same quiet failure as CLEP, and it needs saying for the same reason — the
 * credit posts, the transcript looks right, and nothing has been satisfied.
 */
for (const inst of CSU_IDS) {
  for (const src of [
    'dsst-principles-public-speaking', 'dsst-college-algebra',
    'dsst-introduction-to-world-religions', 'dsst-general-anthropology',
    'dsst-substance-abuse', 'dsst-environment-humanity',
    'dsst-history-of-the-vietnam-war', 'dsst-principles-of-supervision',
  ]) {
    rules.push({
      institution_id: inst, credit_source_id: src,
      min_score: 400, units_granted: 3, satisfies_areas: [],
      provenance: CSU_DSST,
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
