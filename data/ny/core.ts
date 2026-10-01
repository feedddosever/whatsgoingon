import type { GeArea, Provenance } from '../../src/types.ts';

/**
 * New York runs two general-education frameworks, one per public system, and a
 * campus in one never plans against the other's.
 *
 * SUNY General Education (SUNY GE). Ten knowledge areas, of which a bachelor's
 * student completes at least seven: four named ones, plus any three of the
 * remaining six. The engine has no "any three of six" — an area is required or
 * it is not — so the six are modelled as THREE PAIRS. That is our choice, not
 * SUNY's, and it is chosen to fail safe:
 *
 *   - a plan this app calls complete always covers three different areas, so
 *     it is always valid at SUNY;
 *   - a student with nothing banked is priced at exactly seven areas, which is
 *     SUNY's own minimum;
 *   - the one cost is a student holding two credits in the same pair (say,
 *     Humanities AND The Arts): the app counts only one, and asks for a course
 *     SUNY would not actually require. Wrong toward caution, never toward a
 *     requirement silently left open.
 *
 * Each area is priced as one 3-credit course. SUNY's own figure is 30 credits
 * of GE inside the first 60; the remainder is set by the campus.
 */
const SUNY_GE: Provenance = {
  source_url: 'https://system.suny.edu/academic-affairs/academic-policies/general-education/suny-ge/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'SUNY Board of Trustees Resolution 2021-48, amended by Resolution 2024-64 for students ' +
    'entering from fall 2026. A bachelor’s needs at least 30 SUNY GE credits in the first ' +
    '60, covering at least 7 of 10 knowledge areas: Communication, Diversity: Equity, ' +
    'Inclusion and Social Justice, Mathematics, and Natural Sciences are required; the other ' +
    'three come from Humanities, Social Sciences, The Arts, US History and Civic ' +
    'Engagement, World History and Global Awareness, and World Languages.',
};

/** Why three of SUNY's areas are pairs — said on every one of them. */
const SUNY_PAIRED: Provenance = {
  ...SUNY_GE,
  note:
    'SUNY asks for any three of six areas; this app groups the six into three pairs and ' +
    'asks for one from each pair. Any plan that does that is valid at SUNY. If you already ' +
    'hold two credits from the same pair, SUNY may count both — ask your campus. ' + SUNY_GE.note,
};

const suny = (id: string, name: string, p: Provenance = SUNY_GE): GeArea => ({
  id, name, required_units: 3,
  framework_id: 'suny-ge',
  applies_to: ['SUNY'],
  provenance: p,
});

export const sunyGeAreas: GeArea[] = [
  suny('ny-suny-comm', 'Communication (Written and Oral)'),
  suny('ny-suny-dei', 'Diversity: Equity, Inclusion and Social Justice'),
  suny('ny-suny-math', 'Mathematics and Quantitative Reasoning'),
  suny('ny-suny-nat', 'Natural Sciences and Scientific Reasoning'),
  suny('ny-suny-hum-arts', 'Humanities or The Arts', SUNY_PAIRED),
  suny('ny-suny-soc-us', 'Social Sciences or US History and Civic Engagement', SUNY_PAIRED),
  suny('ny-suny-world', 'World History and Global Awareness or World Languages', SUNY_PAIRED),
];

/**
 * CUNY Pathways Common Core: 12 credits of Required Core and 18 of Flexible
 * Core, the same at every CUNY college.
 *
 * English Composition is two courses, so it is two areas — one exam cannot
 * clear both. The Flexible Core's sixth course "from one of the above areas" is
 * not modelled (the same any-of-five problem as SUNY's); leaving it out prices
 * 27 credits rather than 30, which understates the cost of doing nothing — the
 * direction this app errs in.
 */
const PATHWAYS: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/gened/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CUNY Pathways, required of every CUNY associate (AA/AS) and bachelor’s student since ' +
    'fall 2013: Required Core of English Composition (two courses), Mathematical and ' +
    'Quantitative Reasoning, and Life and Physical Sciences; Flexible Core of one course in ' +
    'each of five areas plus a sixth from any of them, no more than two from one discipline ' +
    '(one at Baruch). Bachelor’s students also take 6–12 College Option credits set by ' +
    'each college.',
};

const cuny = (id: string, name: string): GeArea => ({
  id, name, required_units: 3,
  framework_id: 'cuny-pathways',
  applies_to: ['CUNY'],
  provenance: PATHWAYS,
});

export const cunyPathwaysAreas: GeArea[] = [
  cuny('ny-cuny-comp-1', 'English Composition I'),
  cuny('ny-cuny-comp-2', 'English Composition II'),
  cuny('ny-cuny-math', 'Mathematical and Quantitative Reasoning'),
  cuny('ny-cuny-lps', 'Life and Physical Sciences'),
  cuny('ny-cuny-world', 'World Cultures and Global Issues'),
  cuny('ny-cuny-us', 'U.S. Experience in Its Diversity'),
  cuny('ny-cuny-creative', 'Creative Expression'),
  cuny('ny-cuny-ind-soc', 'Individual and Society'),
  cuny('ny-cuny-sci-world', 'Scientific World'),
];
