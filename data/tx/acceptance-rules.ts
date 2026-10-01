import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { texasInstitutions } from './institutions.ts';

/**
 * Two things are true about Texas at once, and the dataset has to hold both.
 *
 * The STRUCTURE is statutory and strong: the core transfers as a block, and a
 * public university may not demand an AP score above 3 without evidence. The
 * MAPPING is not: Texas has no statewide table saying which exam clears which
 * component area. Each campus publishes its own — and when three of them were
 * read side by side on 2026-10-01, the "common case" this file used to apply
 * everywhere turned out wrong in a large share of rows.
 *
 * So there are now two layers:
 *
 *   - UT Austin, Texas A&M and Texas Tech carry THEIR OWN charts, read at source.
 *   - Every other campus gets a common case cut down to what those three charts
 *     agree on, still `needs_check`. An exam none of the three credits (DSST,
 *     A-Level, CLEP Humanities, Natural Sciences and College Mathematics, AP
 *     Comparative Government) has no common-case row at all: "we have no record"
 *     is the honest sentence, and a claimed area was not.
 *
 * Course and area mappings are an autumn-2026 snapshot: under S.B. 37 (2025)
 * UT Austin, Texas A&M and UH cut or rebuilt their core lists in Aug-Sep 2026.
 */

const TX_EXAM_MAPPING: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_51.968',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Texas sets a statutory floor on the AP SCORE (3, under TEC 51.968(c-1)) but no statewide ' +
    'table of which exam clears which component area. This is the case at the campuses whose ' +
    'charts we read (UT Austin, Texas A&M, Texas Tech), not your campus’s chart. Confirm it ' +
    'with the registrar before you skip a course.',
};

const TX_IB: Provenance = {
  ...TX_EXAM_MAPPING,
  note:
    'TEC 51.968’s score floor covers Advanced Placement only, so IB is campus policy. Texas A&M ' +
    'grants most Higher Level credit at a 4 (we ask a 5). History HL counts as American History ' +
    'only for the History of the Americas paper. Confirm with the registrar.',
};

const TX_COURSE_MAPPING: Provenance = {
  source_url: 'https://catalog.austincc.edu/academic-planning/core-curriculum-general-education/core-curriculum-course-list/',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'TCCNS numbers are statewide; core approval is per college. These areas are Austin ' +
    'Community College’s 2026-27 core list. Check the course against your own college’s core list.',
};

const chart = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'published', note,
});

const UT = chart(
  'https://testingservices.utexas.edu/search-undergraduate-exams',
  'UT Austin’s credit-by-exam search and its 2026-27 core list. UT credits only eight CLEP exams ' +
  'and no AP Comparative Government; UT’s Component Area Option is its First-Year Signature ' +
  'Course, which no exam can fill.',
);
const UT_GOV = {
  ...UT, confidence: 'needs_check' as const,
  note:
    'UT Austin awards GOV 310L only with a passing score on its own Texas Government test as ' +
    'well, and says a qualifying score "does not guarantee credit". ' + (UT.note ?? ''),
};
const UT_LIT_ESSAY = {
  ...UT, confidence: 'needs_check' as const,
  note: 'UT Austin requires its own essay as well, and publishes no cut score. ' + (UT.note ?? ''),
};
const UT_STATS = {
  ...UT,
  note:
    'Counts toward Mathematics only if you claim SDS 301 or EDP 308 — STA 309 does not fulfil ' +
    'the core Mathematics requirement. ' + (UT.note ?? ''),
};
const TAMU = chart(
  'https://testing.tamu.edu/credits/index.html',
  'Texas A&M’s AP, IB and CLEP credit charts and its core curriculum list. A&M takes 16 CLEP ' +
  'exams — not College Composition, College Mathematics, Humanities, American Literature, ' +
  'Natural Sciences or Biology.',
);
const TTU = {
  ...chart(
    'https://www.depts.ttu.edu/testing/uce.php',
    'Texas Tech’s credit-by-exam chart (credit and course confirmed). The core area for each ' +
    'course is from the only Texas Tech core list that would load, an older catalog — confirm it.',
  ),
  confidence: 'needs_check' as const,
};

type Row = readonly [string, string[], number, number];   // [source, areas, credits, min score]

/** The common case for every campus without its own chart here. */
const COMMON: ReadonlyArray<Row> = [
  ['ap-english-lang', ['tx-comm-1'], 3, 3],
  ['ap-english-lit', ['tx-comm-1'], 3, 3],
  ['ap-calculus-ab', ['tx-math'], 4, 3],
  ['ap-calculus-bc', ['tx-math'], 4, 3],
  ['ap-statistics', ['tx-math'], 3, 3],
  ['ap-biology', ['tx-life-phys-1'], 4, 3],
  ['ap-chemistry', ['tx-life-phys-2'], 4, 3],
  ['ap-physics-1', ['tx-life-phys-2'], 4, 3],
  ['ap-environmental-science', [], 3, 3],   // a different area at each campus read
  ['ap-spanish', [], 3, 3],                 // credit, but core only at a 4 at one of three
  ['ap-european-history', ['tx-lang-phil'], 3, 3],
  ['ap-art-history', ['tx-arts'], 3, 3],
  ['ap-us-history', ['tx-us-history-1'], 3, 3],
  ['ap-us-government', ['tx-govt-1'], 3, 3],
  ['ap-psychology', ['tx-social'], 3, 3],
  ['ap-macroeconomics', ['tx-social'], 3, 3],
  ['ap-microeconomics', ['tx-social'], 3, 3],
  ['ap-human-geography', ['tx-social'], 3, 3],
  ['clep-college-composition', ['tx-comm-1'], 3, 50],
  ['clep-college-algebra', ['tx-math'], 3, 50],
  ['clep-american-government', ['tx-govt-1'], 3, 50],
  ['clep-history-us-1', ['tx-us-history-1'], 3, 50],
  ['clep-intro-psychology', ['tx-social'], 3, 50],
  ['clep-intro-sociology', ['tx-social'], 3, 50],
  ['clep-macroeconomics', ['tx-social'], 3, 50],
  ['clep-biology', ['tx-life-phys-1'], 3, 50],
];

const COMMON_IB: ReadonlyArray<Row> = [
  ['ib-english-a-hl', ['tx-comm-1'], 3, 5],
  ['ib-mathematics-aa-hl', ['tx-math'], 3, 5],
  ['ib-mathematics-ai-hl', ['tx-math'], 3, 5],
  ['ib-biology-hl', ['tx-life-phys-1'], 3, 5],
  ['ib-chemistry-hl', ['tx-life-phys-2'], 3, 5],
  ['ib-physics-hl', ['tx-life-phys-2'], 3, 5],
  ['ib-spanish-b-hl', ['tx-lang-phil'], 3, 5],
  ['ib-visual-arts-hl', ['tx-arts'], 3, 5],
  ['ib-history-hl', ['tx-us-history-1'], 3, 5],
  ['ib-psychology-hl', ['tx-social'], 3, 5],
  ['ib-economics-hl', ['tx-social'], 3, 5],
  ['ib-geography-hl', ['tx-social'], 3, 5],
];

/** UT Austin, from its own chart. An empty area list is credit outside the core. */
const UT_AUSTIN: ReadonlyArray<readonly [string, string[], number, number, Provenance]> = [
  ['ap-english-lang', ['tx-comm-1'], 3, 3, UT],
  ['ap-english-lit', ['tx-lang-phil'], 3, 4, UT],     // a 3 earns E 314T, not on the core list
  ['ap-calculus-ab', ['tx-math'], 4, 3, UT],
  ['ap-calculus-bc', ['tx-math'], 4, 3, UT],
  ['ap-statistics', ['tx-math'], 3, 3, UT_STATS],
  ['ap-biology', ['tx-life-phys-1'], 4, 3, UT],
  ['ap-chemistry', ['tx-life-phys-2'], 4, 3, UT],
  ['ap-physics-1', ['tx-life-phys-2'], 4, 3, UT],
  ['ap-environmental-science', ['tx-life-phys-2'], 3, 3, UT],
  ['ap-spanish', [], 3, 3, UT],
  ['ap-european-history', [], 3, 3, UT],
  ['ap-art-history', ['tx-arts'], 3, 3, UT],
  ['ap-us-history', ['tx-us-history-1'], 3, 3, UT],
  ['ap-us-government', ['tx-govt-1'], 3, 3, UT_GOV],
  ['ap-psychology', ['tx-social'], 3, 3, UT],
  ['ap-macroeconomics', ['tx-social'], 3, 3, UT],
  ['ap-microeconomics', ['tx-social'], 3, 3, UT],
  ['ap-human-geography', ['tx-social'], 3, 3, UT],
  ['clep-college-algebra', [], 3, 50, UT],            // M 301 "cannot be applied to the core"
  ['clep-american-government', ['tx-govt-1'], 3, 50, UT_GOV],
  ['clep-intro-psychology', ['tx-social'], 3, 50, UT],
  ['clep-intro-sociology', ['tx-social'], 3, 50, UT],
  ['clep-macroeconomics', ['tx-social'], 3, 50, UT],
  ['clep-american-literature', ['tx-lang-phil'], 3, 50, UT_LIT_ESSAY],
];

/** Texas A&M, from its own charts. */
const TEXAS_AM: ReadonlyArray<readonly [string, string[], number, number]> = [
  ['ap-english-lang', ['tx-comm-1'], 3, 3],
  ['ap-english-lit', ['tx-comm-1'], 3, 3],
  ['ap-calculus-ab', ['tx-math'], 3, 3],
  ['ap-calculus-bc', ['tx-math'], 4, 3],
  ['ap-statistics', ['tx-math'], 3, 3],
  ['ap-biology', ['tx-life-phys-1'], 3, 3],
  ['ap-chemistry', ['tx-life-phys-2'], 4, 3],
  ['ap-physics-1', ['tx-life-phys-2'], 4, 4],          // a 3 earns PHYS 205, not core
  ['ap-environmental-science', [], 3, 3],              // GEOS 105, not core
  ['ap-spanish', ['tx-lang-phil'], 3, 4],              // SPAN 201 at a 4
  ['ap-european-history', ['tx-lang-phil'], 3, 3],
  ['ap-art-history', ['tx-arts'], 3, 3],
  ['ap-us-history', ['tx-us-history-1', 'tx-us-history-2'], 6, 3],
  ['ap-us-government', ['tx-govt-1'], 3, 3],
  ['ap-comparative-government', [], 3, 3],             // POLS 229, not core
  ['ap-psychology', ['tx-social'], 3, 3],
  ['ap-macroeconomics', ['tx-social'], 3, 3],
  ['ap-microeconomics', ['tx-social'], 3, 3],
  ['ap-human-geography', ['tx-social'], 3, 3],
  ['clep-college-algebra', ['tx-math'], 3, 50],
  ['clep-american-government', ['tx-govt-1'], 3, 50],
  ['clep-history-us-1', ['tx-us-history-1'], 3, 50],
  ['clep-intro-psychology', ['tx-social'], 3, 50],
  ['clep-intro-sociology', ['tx-social'], 3, 50],
  ['clep-macroeconomics', ['tx-social'], 3, 50],
];

/** Texas Tech, from its own chart (core areas from an older core list). */
const TEXAS_TECH: ReadonlyArray<readonly [string, string[], number, number]> = [
  ['ap-english-lang', ['tx-comm-1'], 3, 3],
  ['ap-english-lit', ['tx-comm-1'], 3, 3],
  ['ap-calculus-ab', ['tx-math'], 4, 3],
  ['ap-calculus-bc', ['tx-math'], 4, 3],
  ['ap-statistics', ['tx-math'], 3, 3],
  ['ap-biology', ['tx-life-phys-1', 'tx-life-phys-2'], 8, 3],
  ['ap-chemistry', ['tx-life-phys-1', 'tx-life-phys-2'], 8, 3],
  ['ap-physics-1', ['tx-life-phys-2'], 4, 3],
  ['ap-environmental-science', ['tx-social'], 3, 3],   // NRM 1300, a social-science course there
  ['ap-spanish', [], 3, 3],
  ['ap-european-history', ['tx-lang-phil'], 3, 3],
  ['ap-art-history', ['tx-arts'], 3, 3],
  ['ap-us-history', ['tx-us-history-1', 'tx-us-history-2'], 6, 3],
  ['ap-us-government', ['tx-govt-1'], 3, 3],
  ['ap-psychology', ['tx-social'], 3, 3],
  ['ap-macroeconomics', ['tx-social'], 3, 4],
  ['ap-microeconomics', ['tx-social'], 3, 4],
  ['ap-human-geography', ['tx-social'], 3, 3],
  ['clep-college-composition', ['tx-comm-1'], 3, 50],
  ['clep-college-algebra', ['tx-math'], 3, 50],
  ['clep-american-government', ['tx-govt-1'], 3, 50],
  ['clep-history-us-1', ['tx-us-history-1'], 3, 50],
  ['clep-intro-psychology', ['tx-social'], 3, 50],
  ['clep-macroeconomics', ['tx-social'], 3, 50],
  ['clep-biology', ['tx-life-phys-1', 'tx-life-phys-2'], 8, 50],
];

/**
 * Community-college courses by TCCNS number. A course listed twice is an
 * either/or the engine resolves: SPCH 1315 sits in Communication and may
 * instead fill the Component Area Option.
 */
const COURSE_RULES: ReadonlyArray<readonly [string, string[], number]> = [
  ['tx-engl-1301', ['tx-comm-1'], 3],
  ['tx-engl-1302', ['tx-comm-2'], 3],
  ['tx-spch-1315', ['tx-comm-2'], 3],
  ['tx-spch-1315', ['tx-option-1'], 3],
  ['tx-math-1314', ['tx-math'], 3],
  ['tx-math-1332', ['tx-math'], 3],
  ['tx-biol-1406', ['tx-life-phys-1'], 4],
  ['tx-chem-1411', ['tx-life-phys-2'], 4],
  ['tx-phil-1301', ['tx-lang-phil'], 3],
  ['tx-arts-1301', ['tx-arts'], 3],
  ['tx-hist-1301', ['tx-us-history-1'], 3],
  ['tx-hist-1302', ['tx-us-history-2'], 3],
  ['tx-govt-2305', ['tx-govt-1'], 3],
  ['tx-govt-2306', ['tx-govt-2'], 3],
  ['tx-psyc-2301', ['tx-social'], 3],
  ['tx-soci-1301', ['tx-social'], 3],
];

const rules: AcceptanceRule[] = [];
const push = (inst: string, src: string, areas: string[], units: number, score: number | null, p: Provenance): void => {
  rules.push({
    institution_id: inst, credit_source_id: src, min_score: score,
    units_granted: units, satisfies_areas: [...areas], provenance: p,
  });
};

for (const { id } of texasInstitutions) {
  if (id === 'ut-austin') {
    for (const [src, areas, units, score, p] of UT_AUSTIN) push(id, src, areas, units, score, p);
    for (const [src, areas, units, score] of COMMON_IB) push(id, src, areas, units, score, TX_IB);
  } else if (id === 'texas-am') {
    for (const [src, areas, units, score] of TEXAS_AM) push(id, src, areas, units, score, TAMU);
    for (const [src, areas, units, score] of COMMON_IB) {
      // A&M maps IB History by region; only the Americas paper is American History.
      push(id, src, src === 'ib-history-hl' ? [] : areas, units, score, TX_IB);
    }
  } else if (id === 'texas-tech') {
    for (const [src, areas, units, score] of TEXAS_TECH) push(id, src, areas, units, score, TTU);
    for (const [src, areas, units, score] of COMMON_IB) push(id, src, areas, units, score, TX_IB);
  } else {
    for (const [src, areas, units, score] of COMMON) push(id, src, areas, units, score, TX_EXAM_MAPPING);
    for (const [src, areas, units, score] of COMMON_IB) push(id, src, areas, units, score, TX_IB);
  }
  for (const [src, areas, units] of COURSE_RULES) push(id, src, areas, units, null, TX_COURSE_MAPPING);
}

export const texasRules: AcceptanceRule[] = rules;
