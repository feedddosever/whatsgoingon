import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { floridaInstitutions } from './institutions.ts';

const ALL = floridaInstitutions.map(i => i.id);

/**
 * Florida is where this app's thesis is most obviously true, and where the
 * honest confidence level is most easily overclaimed.
 *
 * The MECHANISM is statute: rule 6A-10.024 lists passing scores and course
 * equivalents, and institutions must award them. The specific rows below were
 * NOT read off that list — the equivalency PDF is not reachable from this
 * build environment — so they are the common case, marked `needs_check`, and
 * the lowest-risk route will decline to stake a student's money on any of them.
 *
 * Fixing that is a matter of reading one document, not of gathering data from
 * 400 campuses, which is precisely what makes Florida worth having.
 */
const FL_EXAM_MAPPING: Provenance = {
  source_url: 'https://www.flbog.edu/wp-content/uploads/2024/06/Credit-by-Exam-Equivalencies-List.pdf',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Florida publishes ONE statewide table that every public institution must follow ' +
    '(rule 6A-10.024). This row has not yet been checked against it. Look your exam up ' +
    'on that list before you rely on it — unlike almost anywhere else, the answer there ' +
    'is binding on the university.',
};

const FL_COURSE_MAPPING: Provenance = {
  source_url: 'https://www.fldoe.org/policy/articulation/general-edu-core-course-options.stml',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'General Education Core Course Options are set statewide by rule 6A-14.0303. This ' +
    'course is a common option for this area; confirm it appears on the current list.',
};

const AP_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['ap-english-lang', ['fl-comm'], 3],
  ['ap-english-lit', ['fl-hum'], 3],
  ['ap-calculus-ab', ['fl-math'], 3],
  ['ap-calculus-bc', ['fl-math'], 3],
  ['ap-statistics', ['fl-math'], 3],
  ['ap-psychology', ['fl-social'], 3],
  ['ap-us-history', ['fl-social'], 3],
  ['ap-us-government', ['fl-social'], 3],
  ['ap-macroeconomics', ['fl-social'], 3],
  ['ap-microeconomics', ['fl-social'], 3],
  ['ap-human-geography', ['fl-social'], 3],
  ['ap-comparative-government', ['fl-social'], 3],
  ['ap-art-history', ['fl-hum'], 3],
  ['ap-spanish', ['fl-hum'], 3],
  ['ap-european-history', ['fl-hum'], 3],
  ['ap-biology', ['fl-nat'], 3],
  ['ap-chemistry', ['fl-nat'], 3],
  ['ap-physics-1', ['fl-nat'], 3],
  ['ap-environmental-science', ['fl-nat'], 3],
];

/**
 * The row that justifies the whole product. The identical CLEP exam clears
 * nothing against Cal-GETC, is refused outright by UC, and here clears a
 * general-education core area under a rule the university cannot opt out of.
 * A student holding CLEP credit and choosing between states is being handed
 * thousands of dollars by that difference, and nothing else tells them.
 */
const CLEP_RULES: ReadonlyArray<readonly [string, string[]]> = [
  ['clep-college-composition', ['fl-comm']],
  ['clep-college-algebra', ['fl-math']],
  ['clep-college-mathematics', ['fl-math']],
  ['clep-intro-psychology', ['fl-social']],
  ['clep-intro-sociology', ['fl-social']],
  ['clep-american-government', ['fl-social']],
  ['clep-history-us-1', ['fl-social']],
  ['clep-macroeconomics', ['fl-social']],
  ['clep-humanities', ['fl-hum']],
  ['clep-american-literature', ['fl-hum']],
  ['clep-natural-sciences', ['fl-nat']],
  ['clep-biology', ['fl-nat']],
];

const COURSE_RULES: ReadonlyArray<readonly [string, string[]]> = [
  ['fl-enc-1101', ['fl-comm']],
  ['fl-enc-1102', ['fl-comm']],
  ['fl-mac-1105', ['fl-math']],
  ['fl-mgf-1106', ['fl-math']],
  ['fl-sta-2023', ['fl-math']],
  ['fl-psy-2012', ['fl-social']],
  ['fl-syg-2000', ['fl-social']],
  ['fl-pos-2041', ['fl-social']],
  ['fl-amh-2020', ['fl-social']],
  ['fl-arh-2000', ['fl-hum']],
  ['fl-phi-2010', ['fl-hum']],
  ['fl-lit-2000', ['fl-hum']],
  ['fl-bsc-1005', ['fl-nat']],
  ['fl-chm-1020', ['fl-nat']],
  ['fl-ast-1002', ['fl-nat']],
];

const rules: AcceptanceRule[] = [];
for (const inst of ALL) {
  for (const [src, areas, units] of AP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: 3,
      units_granted: units, satisfies_areas: [...areas], provenance: FL_EXAM_MAPPING,
    });
  }
  for (const [src, areas] of CLEP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: 50,
      units_granted: 3, satisfies_areas: [...areas], provenance: FL_EXAM_MAPPING,
    });
  }
  for (const [src, areas] of COURSE_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: null,
      units_granted: 3, satisfies_areas: [...areas], provenance: FL_COURSE_MAPPING,
    });
  }
}

export const floridaRules: AcceptanceRule[] = rules;
