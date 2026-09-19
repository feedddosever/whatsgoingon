import type { Institution, Provenance } from '../../src/types.ts';

/**
 * cost_per_unit_usd is DERIVED, and Texas derives more honestly than California
 * does: Texas public universities genuinely DO charge per semester credit hour,
 * so a per-unit figure is the right shape of number here rather than an
 * artefact of dividing a flat rate.
 *
 * What it is not is uniform. Statutory tuition is fixed at $50/SCH statewide;
 * board-designated tuition is set campus by campus and was $213/SCH at Texas
 * Tech and $230.11/SCH at UNT for 2025-26, before mandatory fees. $300 is the
 * middle of that range with fees, and it is an estimate until each campus is
 * read individually.
 */
const TX_PER_UNIT = 300;

const TX_COST: Provenance = {
  source_url: 'https://www.depts.ttu.edu/studentbusinessservices/feeInfo/documents/tuition-fees/2024-2026/2024-2026-Undergraduate-and-Graduate-Schedule.pdf',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Derived: $50/SCH statutory tuition (fixed statewide) plus board-designated tuition ' +
    'of roughly $213-$230/SCH at Texas Tech and UNT for 2025-26, plus mandatory fees. ' +
    'Designated tuition is set per campus, so this is a statewide middle rather than ' +
    'your price. Check your campus before you trust the saving.',
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
    'campus’s decision, and CLEP is not covered by this statute at all.',
};

const TX_RESIDENCY: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'Texas public universities commonly require the last 30 semester credit hours in ' +
    'residence. Unconfirmed per campus — ask the registrar.',
};

const TX_TRANSFER_CAP: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'A 66-SCH ceiling on community-college credit is widely applied in Texas but is not ' +
    'confirmed here, and it is not the same thing as the core-curriculum block transfer, ' +
    'which is statutory.',
};

const tx = (id: string, name: string): Institution => ({
  id,
  name,
  system: 'TX-PUBLIC',
  cost_per_unit_usd: TX_PER_UNIT,
  residency_min_units: 30,
  max_transfer_units: 66,
  accepts_clep: true,
  exam_policy_provenance: TX_EXAM_POLICY,
  residency_provenance: TX_RESIDENCY,
  transfer_cap_provenance: TX_TRANSFER_CAP,
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
