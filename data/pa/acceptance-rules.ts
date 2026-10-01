import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { pennsylvaniaInstitutions } from './institutions.ts';

/**
 * Pennsylvania guarantees the CREDIT by law and recommends — but does not
 * fix — where it lands. The statewide standards set minimum scores every PASSHE
 * university must award (AP 3, CLEP 50) and suggest an equivalent course, which
 * is what the area below follows; whether that course fills general education
 * at your university is still its call, so every exam row is `needs_check`.
 *
 * Framework courses are the strong case: the framework is the list every
 * participating institution must accept toward graduation, and PASSHE applies
 * framework-aligned credits to general education.
 */

const PA_EXAM_MAPPING: Provenance = {
  source_url: 'https://collegetransfer.pa.gov/Administrators/Credit-for-Prior-Learning',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Pennsylvania’s statewide standards oblige every PASSHE university to award credit at ' +
    'this score and recommend the course it should count as — which is what this mapping ' +
    'follows. Whether that course fills your university’s general education is still its ' +
    'decision. Check the university’s own chart before you skip a course.',
};

const NO_STATE_STANDARD: Provenance = {
  ...PA_EXAM_MAPPING,
  source_url: 'https://www.iup.edu/orientation/placement-testing/equivalency-resources/clep-exam-equivalency-chart.html',
  note:
    'The statewide standards set no minimum score for this exam, so a PASSHE university is not ' +
    'obliged to take it. Indiana University of Pennsylvania does (CLEP Humanities counts as ' +
    'ENGL 121 at 50); others may not. ' + PA_EXAM_MAPPING.note,
};

const PA_COURSE: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/BOG_Policies/Policy%201999-01-A.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'A course on the 30-Credit Transfer Framework must be accepted toward graduation by every ' +
    'participating institution, and PASSHE Board Policy 1999-01-A applies framework-aligned ' +
    'credits to general education. Check that your college lists this course against the ' +
    'framework on PA College Transfer.',
};

/** [source, area, minimum score, credits]. */
const EXAMS: ReadonlyArray<readonly [string, string, number, number]> = [
  ['ap-english-lang', 'pa-comp', 3, 3],
  ['ap-english-lit', 'pa-hum', 3, 3],
  ['ap-calculus-ab', 'pa-math', 3, 3],
  ['ap-calculus-bc', 'pa-math', 3, 3],
  ['ap-statistics', 'pa-math', 3, 3],
  ['ap-biology', 'pa-sci', 3, 3],
  ['ap-chemistry', 'pa-sci', 3, 3],
  ['ap-physics-1', 'pa-sci', 3, 3],
  ['ap-psychology', 'pa-soc', 3, 3],
  ['ap-us-government', 'pa-soc', 3, 3],
  ['ap-us-history', 'pa-soc', 3, 3],
  ['ap-european-history', 'pa-soc', 3, 3],
  ['ap-macroeconomics', 'pa-soc', 3, 3],
  ['ap-microeconomics', 'pa-soc', 3, 3],
  ['ap-art-history', 'pa-hum', 3, 3],
  ['ap-spanish', 'pa-hum', 3, 3],
  ['clep-college-composition', 'pa-comp', 50, 3],
  ['clep-college-algebra', 'pa-math', 50, 3],
  ['clep-intro-psychology', 'pa-soc', 50, 3],
  ['clep-intro-sociology', 'pa-soc', 50, 3],
  ['clep-american-government', 'pa-soc', 50, 3],
  ['clep-history-us-1', 'pa-soc', 50, 3],
  ['clep-macroeconomics', 'pa-soc', 50, 3],
  ['clep-biology', 'pa-sci', 50, 3],
  ['clep-american-literature', 'pa-hum', 50, 3],
];

const COURSES: ReadonlyArray<readonly [string, string, number]> = [
  ['pa-cc-eng-comp', 'pa-comp', 3],
  ['pa-cc-public-speaking', 'pa-speech', 3],
  ['pa-cc-statistics', 'pa-math', 3],
  ['pa-cc-college-algebra', 'pa-math', 3],
  ['pa-cc-biology', 'pa-sci', 4],
  ['pa-cc-astronomy', 'pa-sci', 3],
  ['pa-cc-psychology', 'pa-soc', 3],
  ['pa-cc-american-government', 'pa-soc', 3],
  ['pa-cc-us-history', 'pa-soc', 3],
  ['pa-cc-macroeconomics', 'pa-soc', 3],
  ['pa-cc-philosophy', 'pa-hum', 3],
  ['pa-cc-music', 'pa-hum', 3],
  ['pa-cc-spanish', 'pa-hum', 3],
];

const rules: AcceptanceRule[] = [];
for (const inst of pennsylvaniaInstitutions) {
  for (const [src, area, score, credits] of EXAMS) {
    rules.push({
      institution_id: inst.id, credit_source_id: src, min_score: score,
      units_granted: credits, satisfies_areas: [area], provenance: PA_EXAM_MAPPING,
    });
  }
  rules.push({
    institution_id: inst.id, credit_source_id: 'clep-humanities', min_score: 50,
    units_granted: 3, satisfies_areas: ['pa-hum'], provenance: NO_STATE_STANDARD,
  });
  for (const [src, area, credits] of COURSES) {
    rules.push({
      institution_id: inst.id, credit_source_id: src, min_score: null,
      units_granted: credits, satisfies_areas: [area], provenance: PA_COURSE,
    });
  }
}

export const pennsylvaniaRules: AcceptanceRule[] = rules;
