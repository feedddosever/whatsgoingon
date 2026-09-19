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

/**
 * IB and DSST in Florida, where both are covered by the SAME binding rule as AP
 * and CLEP.
 *
 * Section 1007.27(2) names AP, AICE, IB, DSST, DLPT, UExcel and CLEP together,
 * and 6A-10.024 sets one table for all of them that every state university and
 * college must follow. So a DSST — worth nothing at all at a UC — is worth
 * whatever that table says here, and the university does not get a vote.
 *
 * We model two of those seven families. AICE, DLPT and UExcel are real gaps.
 */
const IB_DSST_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['ib-english-a-hl', ['fl-comm'], 5],
  ['ib-mathematics-aa-hl', ['fl-math'], 5],
  ['ib-mathematics-ai-hl', ['fl-math'], 5],
  ['ib-history-hl', ['fl-social'], 5],
  ['ib-psychology-hl', ['fl-social'], 5],
  ['ib-economics-hl', ['fl-social'], 5],
  ['ib-geography-hl', ['fl-social'], 5],
  ['ib-visual-arts-hl', ['fl-hum'], 5],
  ['ib-spanish-b-hl', ['fl-hum'], 5],
  ['ib-biology-hl', ['fl-nat'], 5],
  ['ib-chemistry-hl', ['fl-nat'], 5],
  ['ib-physics-hl', ['fl-nat'], 5],
  ['dsst-principles-public-speaking', ['fl-comm'], 400],
  ['dsst-college-algebra', ['fl-math'], 400],
  ['dsst-general-anthropology', ['fl-social'], 400],
  ['dsst-substance-abuse', ['fl-social'], 400],
  ['dsst-introduction-to-world-religions', ['fl-hum'], 400],
  ['dsst-environment-humanity', ['fl-nat'], 400],
  // AICE is Florida's name for these Cambridge exams, and 1007.27(2) names it
  // alongside AP, IB, DSST, DLPT, UExcel and CLEP under one binding table.
  ['alevel-english-literature', ['fl-comm'], 0],
  ['alevel-mathematics', ['fl-math'], 0],
  ['alevel-history', ['fl-social'], 0],
  ['alevel-psychology', ['fl-social'], 0],
  ['alevel-economics', ['fl-social'], 0],
  ['alevel-geography', ['fl-social'], 0],
  ['alevel-art-design', ['fl-hum'], 0],
  ['alevel-spanish', ['fl-hum'], 0],
  ['alevel-biology', ['fl-nat'], 0],
  ['alevel-chemistry', ['fl-nat'], 0],
  ['alevel-physics', ['fl-nat'], 0],
  // Retired and restricted, and still worth credit here: the statute names both.
  ['uexcel-english-composition', ['fl-comm'], 0],
  ['uexcel-college-algebra', ['fl-math'], 0],
  ['uexcel-introduction-to-psychology', ['fl-social'], 0],
  ['uexcel-introduction-to-sociology', ['fl-social'], 0],
  ['uexcel-world-population', ['fl-social'], 0],
  ['dlpt-spanish', ['fl-hum'], 0],
  ['dlpt-arabic', ['fl-hum'], 0],
  ['dlpt-korean', ['fl-hum'], 0],
  ['dlpt-russian', ['fl-hum'], 0],
  ['dlpt-chinese-mandarin', ['fl-hum'], 0],
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
  for (const [src, areas, score] of IB_DSST_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: score,
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
