import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { newYorkInstitutions } from './institutions.ts';

/**
 * New York, like Texas, guarantees the CREDIT and leaves the MAPPING to the
 * campus. SUNY Policy 1300 and CUNY Policy 1.21 both promise credit for an AP 3
 * and a passing CLEP score; neither says which requirement it fills, and the
 * campus charts we read mostly give a 3 elective credit only (Baruch says so
 * outright) and map a 4 or 5 to a course.
 *
 * So every exam row below asks for a 4 on AP — the score at which the charts
 * we read start naming a course — and every one is `needs_check`. The
 * lowest-risk route will not put a student's money on any of them, which is the
 * honest reading of the policy.
 *
 * Community-college courses are the opposite case: a course a SUNY campus
 * approved for a SUNY GE area meets that area at every SUNY campus, and a
 * Pathways requirement met at one CUNY college counts as met at every other.
 * That is published system policy, so those rows are `published`.
 */

const SUNY_EXAM_MAPPING: Provenance = {
  source_url: 'https://www.suny.edu/sunypp/documents.cfm?doc_id=163',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'SUNY guarantees the credit (Policy 1300: AP 3+, CLEP subject exams) but not which SUNY ' +
    'GE area it fills — each campus decides, and the larger campuses often give an AP 3 ' +
    'elective credit only. This mapping is the common case at a 4 or higher, not your ' +
    'campus’s published chart. Check it before you skip a course.',
};

const CUNY_EXAM_MAPPING: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/credits-tranfer/',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'CUNY guarantees the credit (Policy 1.21: AP 3+, CLEP 50+) but each college designates ' +
    'which Pathways area it fills, and Baruch gives an AP 3 elective credit only. This ' +
    'mapping is the common case at a 4 or higher on AP, not your college’s designation. ' +
    'Check it in CUNY’s transfer tool or with the registrar.',
};

const SUNY_COURSE: Provenance = {
  source_url: 'https://transfer.suny.edu/students/seamless-transfer/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'SUNY Seamless Transfer: a course completed on a SUNY campus for a SUNY GE category, with ' +
    'a C or better, must be accepted by any other SUNY campus as meeting that category. Make ' +
    'sure the course you take is on your community college’s approved SUNY GE list.',
};

const CUNY_COURSE: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/credits-tranfer/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'A Pathways requirement fulfilled at one CUNY college counts as fulfilled at any other, and ' +
    'courses passed for credit at any CUNY college transfer for credit at every other. Take a ' +
    'course your community college has designated for this Pathways area.',
};

/** CLEP's general exams, which two SUNY campuses we read refuse outright. */
const CLEP_GENERAL = new Set([
  'clep-college-composition', 'clep-humanities', 'clep-natural-sciences', 'clep-college-mathematics',
]);
const REFUSES_CLEP_GENERAL = new Set(['stony-brook', 'binghamton']);

/** [source, SUNY area, CUNY area, minimum score, credits]. Null = no area. */
const EXAMS: ReadonlyArray<readonly [string, string | null, string | null, number, number]> = [
  ['ap-english-lang', 'ny-suny-comm', 'ny-cuny-comp-1', 4, 3],
  ['ap-english-lit', 'ny-suny-hum-arts', 'ny-cuny-comp-2', 4, 3],
  ['ap-calculus-ab', 'ny-suny-math', 'ny-cuny-math', 4, 4],
  ['ap-calculus-bc', 'ny-suny-math', 'ny-cuny-math', 4, 4],
  ['ap-statistics', 'ny-suny-math', 'ny-cuny-math', 4, 3],
  ['ap-biology', 'ny-suny-nat', 'ny-cuny-lps', 4, 4],
  ['ap-chemistry', 'ny-suny-nat', 'ny-cuny-lps', 4, 4],
  ['ap-physics-1', 'ny-suny-nat', 'ny-cuny-lps', 4, 4],
  ['ap-environmental-science', 'ny-suny-nat', 'ny-cuny-sci-world', 4, 3],
  ['ap-art-history', 'ny-suny-hum-arts', 'ny-cuny-creative', 4, 3],
  ['ap-us-history', 'ny-suny-soc-us', 'ny-cuny-us', 4, 3],
  ['ap-us-government', 'ny-suny-soc-us', 'ny-cuny-us', 4, 3],
  ['ap-psychology', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 4, 3],
  ['ap-macroeconomics', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 4, 3],
  ['ap-microeconomics', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 4, 3],
  ['ap-human-geography', 'ny-suny-soc-us', 'ny-cuny-world', 4, 3],
  ['ap-comparative-government', 'ny-suny-world', 'ny-cuny-world', 4, 3],
  ['ap-european-history', 'ny-suny-world', 'ny-cuny-world', 4, 3],
  ['ap-spanish', 'ny-suny-world', 'ny-cuny-world', 4, 3],
  ['clep-college-composition', 'ny-suny-comm', 'ny-cuny-comp-1', 50, 3],
  ['clep-college-algebra', 'ny-suny-math', 'ny-cuny-math', 50, 3],
  ['clep-college-mathematics', 'ny-suny-math', 'ny-cuny-math', 50, 3],
  ['clep-biology', 'ny-suny-nat', 'ny-cuny-lps', 50, 3],
  ['clep-natural-sciences', 'ny-suny-nat', 'ny-cuny-sci-world', 50, 3],
  ['clep-humanities', 'ny-suny-hum-arts', 'ny-cuny-creative', 50, 3],
  ['clep-american-literature', 'ny-suny-hum-arts', 'ny-cuny-creative', 50, 3],
  ['clep-history-us-1', 'ny-suny-soc-us', 'ny-cuny-us', 50, 3],
  ['clep-american-government', 'ny-suny-soc-us', 'ny-cuny-us', 50, 3],
  ['clep-intro-psychology', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 50, 3],
  ['clep-intro-sociology', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 50, 3],
  ['clep-macroeconomics', 'ny-suny-soc-us', 'ny-cuny-ind-soc', 50, 3],
];

const SUNY_COURSES: ReadonlyArray<readonly [string, string, number]> = [
  ['ny-sunycc-comp', 'ny-suny-comm', 3],
  ['ny-sunycc-dei', 'ny-suny-dei', 3],
  ['ny-sunycc-stats', 'ny-suny-math', 3],
  ['ny-sunycc-bio', 'ny-suny-nat', 4],
  ['ny-sunycc-humanities', 'ny-suny-hum-arts', 3],
  ['ny-sunycc-arts', 'ny-suny-hum-arts', 3],
  ['ny-sunycc-psych', 'ny-suny-soc-us', 3],
  ['ny-sunycc-us-history', 'ny-suny-soc-us', 3],
  ['ny-sunycc-world-history', 'ny-suny-world', 3],
  ['ny-sunycc-language', 'ny-suny-world', 3],
];

const CUNY_COURSES: ReadonlyArray<readonly [string, string]> = [
  ['ny-cunycc-comp-1', 'ny-cuny-comp-1'],
  ['ny-cunycc-comp-2', 'ny-cuny-comp-2'],
  ['ny-cunycc-math', 'ny-cuny-math'],
  ['ny-cunycc-lps', 'ny-cuny-lps'],
  ['ny-cunycc-world', 'ny-cuny-world'],
  ['ny-cunycc-us', 'ny-cuny-us'],
  ['ny-cunycc-creative', 'ny-cuny-creative'],
  ['ny-cunycc-ind-soc', 'ny-cuny-ind-soc'],
  ['ny-cunycc-sci-world', 'ny-cuny-sci-world'],
];

const rules: AcceptanceRule[] = [];
for (const inst of newYorkInstitutions) {
  const isSuny = inst.system === 'SUNY';
  for (const [src, sunyArea, cunyArea, score, credits] of EXAMS) {
    // A refusal we can point at: no rule, and the campus's exam-policy note says why.
    if (isSuny && REFUSES_CLEP_GENERAL.has(inst.id) && CLEP_GENERAL.has(src)) continue;
    const area = isSuny ? sunyArea : cunyArea;
    rules.push({
      institution_id: inst.id, credit_source_id: src, min_score: score,
      units_granted: credits, satisfies_areas: area === null ? [] : [area],
      provenance: isSuny ? SUNY_EXAM_MAPPING : CUNY_EXAM_MAPPING,
    });
  }
  if (isSuny) {
    for (const [src, area, credits] of SUNY_COURSES) {
      rules.push({
        institution_id: inst.id, credit_source_id: src, min_score: null,
        units_granted: credits, satisfies_areas: [area], provenance: SUNY_COURSE,
      });
    }
  } else {
    for (const [src, area] of CUNY_COURSES) {
      rules.push({
        institution_id: inst.id, credit_source_id: src, min_score: null,
        units_granted: 3, satisfies_areas: [area], provenance: CUNY_COURSE,
      });
    }
  }
}

export const newYorkRules: AcceptanceRule[] = rules;
