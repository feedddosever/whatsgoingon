import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { texasInstitutions } from './institutions.ts';

const ALL = texasInstitutions.map(i => i.id);

/**
 * Two things are true about Texas at once, and the dataset has to hold both.
 *
 * The STRUCTURE is statutory and strong: the core transfers as a block, and a
 * public university may not demand an AP score above 3 without evidence. The
 * MAPPING is not: Texas has no single statewide table saying which exam clears
 * which component area, the way Florida does. Each campus publishes its own.
 *
 * So every rule below is `needs_check`, and the lowest-risk route will decline
 * to recommend any of them. That is the correct answer, not a gap to paper
 * over: what we can promise a Texas student today is the block transfer, not
 * the exam.
 */
const TX_EXAM_MAPPING: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_51.968',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Texas sets a statutory floor on the SCORE (3, under TEC 51.968(c-1)) but not a ' +
    'statewide table of which exam clears which component area. This mapping is the ' +
    'common case, not your campus’s published policy. Confirm it with the registrar ' +
    'before you skip a course.',
};

const TX_COURSE_MAPPING: Provenance = {
  source_url: 'http://board.thecb.state.tx.us/apps/tcc/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'TCCNS numbers are statewide; core approval is per college. Check this course ' +
    'against your college’s core curriculum list on the Coordinating Board WebCenter.',
};

/** [source id, component areas cleared together, semester credit hours]. */
const AP_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['ap-english-lang', ['tx-comm'], 3],
  ['ap-english-lit', ['tx-comm'], 3],
  ['ap-calculus-ab', ['tx-math'], 3],
  ['ap-calculus-bc', ['tx-math'], 3],
  ['ap-statistics', ['tx-math'], 3],
  ['ap-biology', ['tx-life-phys'], 4],
  ['ap-chemistry', ['tx-life-phys'], 4],
  ['ap-physics-1', ['tx-life-phys'], 4],
  ['ap-environmental-science', ['tx-life-phys'], 4],
  ['ap-spanish', ['tx-lang-phil'], 3],
  ['ap-european-history', ['tx-lang-phil'], 3],
  ['ap-art-history', ['tx-arts'], 3],
  ['ap-us-history', ['tx-us-history'], 3],
  ['ap-us-government', ['tx-govt'], 3],
  ['ap-comparative-government', ['tx-option'], 3],
  ['ap-psychology', ['tx-social'], 3],
  ['ap-macroeconomics', ['tx-social'], 3],
  ['ap-microeconomics', ['tx-option'], 3],
  ['ap-human-geography', ['tx-option'], 3],
];

/**
 * CLEP in Texas is a real pathway rather than the dead end it is in California:
 * nothing forbids a Texas public university from applying it to the core, and
 * most do. Nothing REQUIRES it either, which is why these are `needs_check`.
 */
const CLEP_RULES: ReadonlyArray<readonly [string, string[]]> = [
  ['clep-college-composition', ['tx-comm']],
  ['clep-college-algebra', ['tx-math']],
  ['clep-college-mathematics', ['tx-math']],
  ['clep-american-government', ['tx-govt']],
  ['clep-history-us-1', ['tx-us-history']],
  ['clep-intro-psychology', ['tx-social']],
  ['clep-intro-sociology', ['tx-social']],
  ['clep-macroeconomics', ['tx-option']],
  ['clep-humanities', ['tx-lang-phil']],
  ['clep-american-literature', ['tx-lang-phil']],
  ['clep-natural-sciences', ['tx-life-phys']],
  ['clep-biology', ['tx-life-phys']],
];

const COURSE_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['tx-engl-1301', ['tx-comm'], 3],
  ['tx-engl-1302', ['tx-comm'], 3],
  ['tx-spch-1315', ['tx-option'], 3],
  ['tx-math-1314', ['tx-math'], 3],
  ['tx-math-1332', ['tx-math'], 3],
  ['tx-biol-1406', ['tx-life-phys'], 4],
  ['tx-chem-1411', ['tx-life-phys'], 4],
  ['tx-phil-1301', ['tx-lang-phil'], 3],
  ['tx-arts-1301', ['tx-arts'], 3],
  ['tx-hist-1301', ['tx-us-history'], 3],
  ['tx-hist-1302', ['tx-us-history'], 3],
  ['tx-govt-2305', ['tx-govt'], 3],
  ['tx-govt-2306', ['tx-govt'], 3],
  ['tx-psyc-2301', ['tx-social'], 3],
  ['tx-soci-1301', ['tx-social'], 3],
];

const rules: AcceptanceRule[] = [];
for (const inst of ALL) {
  for (const [src, areas, units] of AP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: 3,
      units_granted: units, satisfies_areas: [...areas], provenance: TX_EXAM_MAPPING,
    });
  }
  for (const [src, areas] of CLEP_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: 50,
      units_granted: 3, satisfies_areas: [...areas], provenance: TX_EXAM_MAPPING,
    });
  }
  for (const [src, areas, units] of COURSE_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: null,
      units_granted: units, satisfies_areas: [...areas], provenance: TX_COURSE_MAPPING,
    });
  }
}

export const texasRules: AcceptanceRule[] = rules;
