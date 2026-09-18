import type { AcceptanceRule } from '../../src/types.ts';

const CAL_GETC = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '2026-09-18',
  confidence: 'published' as const,
};

const ASSIST = (note: string) => ({
  source_url: 'https://assist.org/',
  as_of: '',
  confidence: 'needs_check' as const,
  note,
});

/**
 * The central rule, and the one most likely to save a student money:
 *
 *   AP satisfies Cal-GETC at both UC and CSU.
 *   CLEP satisfies Cal-GETC NOWHERE, and UC awards it no credit at all.
 *
 * So every CLEP row below carries `satisfies_area: null`. CLEP is not useless —
 * CSU counts it toward a degree, capped at 30 units — but it cannot clear a
 * Cal-GETC area, and the engine plans against Cal-GETC. Recommending a CLEP exam
 * to clear area 1A would be telling a student to buy something that does not do
 * the job they are buying it for.
 */
const AP_RULES: AcceptanceRule[] = [];
for (const inst of ['uc-berkeley', 'ucla', 'uc-davis', 'uc-irvine', 'csu-long-beach', 'san-jose-state']) {
  AP_RULES.push(
    {
      institution_id: inst, credit_source_id: 'ap-english-lang',
      min_score: 3, units_granted: 3, satisfies_area: '1A',
      provenance: {
        ...CAL_GETC,
        note:
          'AP at score 3+ is accepted systemwide by UC, CSU and CCC and may be applied to ' +
          'Cal-GETC. Each campus still decides how it applies to a MAJOR requirement — ' +
          'confirm with the department, not just the registrar.',
      },
    },
    {
      institution_id: inst, credit_source_id: 'ap-calculus-ab',
      min_score: 3, units_granted: 3, satisfies_area: '2',
      provenance: {
        ...CAL_GETC,
        note:
          'Score 3+ clears the Cal-GETC area. STEM majors frequently require a higher score ' +
          'or the course itself for major preparation — check the major, not just the GE list.',
      },
    },
    {
      institution_id: inst, credit_source_id: 'ap-psychology',
      min_score: 3, units_granted: 3, satisfies_area: '4',
      provenance: { ...CAL_GETC, note: 'Score 3+ clears Cal-GETC area 4.' },
    },
  );
}

/**
 * CLEP rows exist so the app can tell a student what their CLEP credit is worth —
 * which, against Cal-GETC, is nothing. They are deliberately not area-clearing.
 */
const CLEP_NOTE =
  'CLEP cannot be used for Cal-GETC. CSU accepts 31 of 33 CLEP exams toward a degree ' +
  '(capped at 30 units, some exams needing higher scores), but not against the GE ' +
  'transfer pattern. UC awards no CLEP credit whatsoever.';

const CLEP_RULES: AcceptanceRule[] = ['csu-long-beach', 'san-jose-state'].flatMap(inst =>
  ['clep-college-composition', 'clep-college-algebra', 'clep-intro-psychology'].map(src => ({
    institution_id: inst,
    credit_source_id: src,
    min_score: 50,
    units_granted: 3,
    satisfies_area: null,
    provenance: {
      source_url: 'https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx',
      as_of: '2026-09-18',
      confidence: 'published' as const,
      note: CLEP_NOTE,
    },
  })),
);

/** Community college courses — articulation is institution-pair specific, always. */
const CCC_RULES: AcceptanceRule[] = [];
for (const inst of ['uc-berkeley', 'ucla', 'uc-davis', 'uc-irvine', 'csu-long-beach', 'san-jose-state']) {
  CCC_RULES.push(
    {
      institution_id: inst, credit_source_id: 'ccc-engl-1a',
      min_score: null, units_granted: 3, satisfies_area: '1A',
      provenance: ASSIST('Confirm this exact CCC course against this exact campus on ASSIST.'),
    },
    {
      institution_id: inst, credit_source_id: 'ccc-math-1',
      min_score: null, units_granted: 3, satisfies_area: '2',
      provenance: ASSIST('Math articulation frequently depends on the major. Confirm on ASSIST.'),
    },
    {
      institution_id: inst, credit_source_id: 'ccc-ethnic-studies-1',
      min_score: null, units_granted: 3, satisfies_area: '6',
      provenance: ASSIST('Cal-GETC area 6. Confirm the specific course on ASSIST.'),
    },
  );
}

// Area 1C (Oral Communication) is CSU-only under Cal-GETC, so this row is not
// offered at UC campuses — a UC-bound student gains nothing from it.
for (const inst of ['csu-long-beach', 'san-jose-state']) {
  CCC_RULES.push({
    institution_id: inst, credit_source_id: 'ccc-comm-1',
    min_score: null, units_granted: 3, satisfies_area: '1C',
    provenance: ASSIST('Cal-GETC area 1C is required for CSU and not for UC. Confirm on ASSIST.'),
  });
}

export const acceptanceRules: AcceptanceRule[] = [...AP_RULES, ...CLEP_RULES, ...CCC_RULES];
