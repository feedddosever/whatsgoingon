import type { Institution, Provenance } from '../../src/types.ts';

/**
 * cost_per_unit_usd is a statewide middle, and Texas universities genuinely do
 * charge by the semester credit hour, so it is the right shape of number here.
 *
 * It was $300 until 2026-10-01, built from designated tuition alone. Read with
 * mandatory fees, a resident taking 15 hours pays about $360–$455 a credit
 * hour in 2026-27: Texas State $408.63, UNT about $403, Texas Tech about $395,
 * UH $396–$455, UT Austin $362–$453 on its flat rate.
 */
const TX_PER_UNIT = 400;

const TX_COST: Provenance = {
  source_url: 'https://www.sbs.txst.edu/sbs-policies/tuition-and-fee-definitions.html',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'A statewide middle for 2026-27 tuition and mandatory fees at 15 hours: Texas State ' +
    '$408.63 a credit hour, UNT about $403, Texas Tech about $395, UH $396\u2013$455 by college, ' +
    'UT Austin $362\u2013$453 on its flat rate. Your campus and college set the real figure.',
};

const TX_EXAM_POLICY: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_51.968',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Texas Education Code 51.968 requires every public institution offering freshman ' +
    'courses to adopt an AP credit policy, and 51.968(c-1) bars it from demanding a ' +
    'score above 3 unless its chief academic officer has evidence a higher score is ' +
    'needed. That is a floor on the SCORE. Which course the credit maps to is still the ' +
    'campus\u2019s decision, and CLEP is not covered by this statute at all.',
};

const TX_RESIDENCY: Provenance = {
  source_url: 'https://sacscoc.org/app/uploads/2024/01/2024PrinciplesOfAccreditation.pdf',
  as_of: '2026-09-28',
  confidence: 'needs_check',
  note:
    '30 is the accreditor\u2019s floor \u2014 SACSCOC requires at least 25 percent of a degree\u2019s ' +
    'hours from the awarding university. Several Texas universities ask for more, often as ' +
    'upper-division hours in residence. Confirm with the registrar.',
};

/** 19 TAC \u00a7 4.25(f): the most a university is obliged to accept. */
const TX_TRANSFER_CAP: Provenance = {
  source_url: 'https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-4-25',
  as_of: '2026-10-01',
  confidence: 'statute',
  note:
    '19 TAC \u00a7 4.25(f): a university is not required to accept more than 66 semester credit ' +
    'hours of lower-division credit, though it may choose to accept more. So 66 is the most ' +
    'you can count on; your university may take more \u2014 ask.',
};

const page = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'published', note,
});

interface Known { residency?: [number, Provenance]; cap?: [number, Provenance] }

const KNOWN: Record<string, Known> = {
  'ut-austin': {
    residency: [60, page('https://catalog.utexas.edu/undergraduate/programs/astronomy-ba/',
      'At least 60 hours, including 21 upper-division hours, must be completed in residence at ' +
      'UT Austin, and at least 24 of the last 30. Read on a College of Natural Sciences degree ' +
      'page; Liberal Arts degrees state the same 60.')],
  },
  'texas-am': {
    residency: [36, page('https://catalog.tamu.edu/undergraduate/general-information/degree-information/',
      'At least 36 hours of 300- and 400-level coursework in residence at Texas A&M, 12 of them ' +
      'in the major, and at least 25% of the degree.')],
  },
  'u-houston': {
    residency: [30, page('https://www.uh.edu/undergraduate-admissions/apply/transfer/transferring-credit/',
      'At least 30 hours in residence at UH, and 18 of the 36 required advanced hours must be UH ' +
      'courses.')],
    cap: [66, page('https://www.uh.edu/undergraduate-admissions/apply/transfer/transferring-credit/',
      'At most 66 lower-division hours transfer as course credit; there is no limit on ' +
      'upper-division hours.')],
  },
  'ut-san-antonio': {
    residency: [30, page('https://catalog.utsa.edu/undergraduate/bachelorsdegreeregulations/degreerequirements/minimumutsaresidencerequirements/',
      'At least 25% of the degree at UTSA, and 18 of the 39 upper-division hours in UTSA courses.')],
    cap: [66, page('https://catalog.utsa.edu/undergraduate/bachelorsdegreeregulations/transferringcourses/',
      'Transfer credit for community-college work may not exceed 66 hours.')],
  },
  'unt': {
    residency: [30, page('https://vpaa.unt.edu/advising/degrees/requirements.html',
      '30 hours in residence at UNT, and 24 of the 36 advanced hours.')],
  },
  'texas-tech': {
    cap: [80, page('https://www.depts.ttu.edu/registrar/teo/teo_transferGuidelines.php',
      'Up to 80 hours from two-year colleges count toward a degree \u2014 90 if at least 10 ' +
      'upper-division hours come from a four-year institution.')],
  },
};

const tx = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'TX-PUBLIC',
  cost_per_unit_usd: TX_PER_UNIT,
  residency_min_units: KNOWN[id]?.residency?.[0] ?? 30,
  max_transfer_units: KNOWN[id]?.cap?.[0] ?? 66,
  refuses: [],
  exam_policy_provenance: TX_EXAM_POLICY,
  residency_provenance: KNOWN[id]?.residency?.[1] ?? TX_RESIDENCY,
  transfer_cap_provenance: KNOWN[id]?.cap?.[1] ?? TX_TRANSFER_CAP,
  cost_provenance: TX_COST,
});

/** The public universities of Texas. */
export const texasInstitutions: Institution[] = [
  tx('ut-austin', 'UT Austin'),
  tx('ut-arlington', 'UT Arlington'),
  tx('ut-dallas', 'UT Dallas'),
  tx('ut-el-paso', 'UT El Paso'),
  tx('ut-permian-basin', 'UT Permian Basin'),
  tx('ut-rio-grande-valley', 'UT Rio Grande Valley'),
  tx('ut-san-antonio', 'UT San Antonio'),
  tx('ut-tyler', 'UT Tyler'),
  tx('stephen-f-austin', 'Stephen F. Austin State University'),

  tx('texas-am', 'Texas A&M University'),
  tx('texas-am-galveston', 'Texas A&M at Galveston'),
  tx('prairie-view-am', 'Prairie View A&M University'),
  tx('tarleton-state', 'Tarleton State University'),
  tx('texas-am-international', 'Texas A&M International University'),
  tx('texas-am-commerce', 'Texas A&M University-Commerce'),
  tx('texas-am-corpus-christi', 'Texas A&M University-Corpus Christi'),
  tx('texas-am-kingsville', 'Texas A&M University-Kingsville'),
  tx('texas-am-san-antonio', 'Texas A&M University-San Antonio'),
  tx('texas-am-texarkana', 'Texas A&M University-Texarkana'),
  tx('west-texas-am', 'West Texas A&M University'),

  tx('u-houston', 'University of Houston'),
  tx('u-houston-clear-lake', 'University of Houston-Clear Lake'),
  tx('u-houston-downtown', 'University of Houston-Downtown'),
  tx('u-houston-victoria', 'University of Houston-Victoria'),

  tx('unt', 'University of North Texas'),
  tx('unt-dallas', 'University of North Texas at Dallas'),

  tx('texas-state', 'Texas State University'),
  tx('sam-houston-state', 'Sam Houston State University'),
  tx('lamar', 'Lamar University'),
  tx('sul-ross-state', 'Sul Ross State University'),

  tx('texas-tech', 'Texas Tech University'),
  tx('angelo-state', 'Angelo State University'),
  tx('midwestern-state', 'Midwestern State University'),

  tx('texas-womans', "Texas Woman's University"),
  tx('texas-southern', 'Texas Southern University'),
];
