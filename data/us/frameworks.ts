import type { GeFramework, Provenance } from '../../src/types.ts';

/**
 * The statewide general-education frameworks this app can plan against.
 *
 * A framework is the precondition for the whole product. Where a state
 * legislates one, "what do I still have to take?" has a single answer for every
 * public campus in the state, and credit can be planned against it. Where it
 * does not, the question has 40 answers and this app has nothing honest to say
 * beyond the national exam pathways — which is exactly what it says.
 */

const CAL_GETC: Provenance = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '2026-09-18',
  confidence: 'published',
  note:
    'Cal-GETC v1.4, effective 2026, replaced IGETC and CSU GE Breadth under AB 928. ' +
    'Area 1C (Oral Communication) is required for CSU and not for UC. Area 5 ' +
    'totals 7 semester units across 5A, 5B and the 5C laboratory. ' +
    'CLEP cannot be used to satisfy any Cal-GETC area.',
};

const SUNY_GE: Provenance = {
  source_url: 'https://system.suny.edu/academic-affairs/academic-policies/general-education/suny-ge/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'SUNY Board of Trustees Resolution 2021-48 as amended by 2024-64. At least 30 credits of ' +
    'SUNY GE in the first 60, across at least 7 of 10 knowledge areas, 4 of them required.',
};

const CUNY_PATHWAYS: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/gened/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CUNY Pathways Common Core, since fall 2013: 12 credits of Required Core and 18 of ' +
    'Flexible Core, the same at every CUNY college.',
};

const PA_TCF: Provenance = {
  source_url: 'https://collegetransfer.pa.gov/Transfer-Information/General-Education-Courses',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'Pennsylvania’s 30-Credit Transfer Framework under Article XX-C of the Public School Code: ' +
    'six categories of foundation courses every participating institution must accept. ' +
    'Planned here for the ten PASSHE universities.',
};

const TX_CORE: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_61.822',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Texas Education Code 61.822 requires every public institution to adopt a core ' +
    'curriculum of no fewer than 42 semester credit hours, and requires a receiving ' +
    'institution to substitute a completed core for its own. Eight foundational ' +
    'component areas total 36 SCH; the Component Area Option adds 6.',
};

const FL_CORE: Provenance = {
  source_url: 'https://www.flsenate.gov/laws/statutes/2024/1007.25',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Florida Statutes 1007.25 sets the general education core, and State Board rule ' +
    '6A-14.0303 names the course options in each of five subject areas. Every student ' +
    'entering a Florida College System or State University System institution must ' +
    'complete at least one core course in each area. The associate in arts requires ' +
    '36 semester hours of general education in total, of which these five are the ' +
    'statewide-guaranteed core; the remaining hours are set by the institution.',
};

export const frameworks: GeFramework[] = [
  {
    id: 'cal-getc',
    name: 'Cal-GETC',
    full_name: 'California General Education Transfer Curriculum',
    state: 'CA',
    total_units: 34,
    provenance: CAL_GETC,
  },
  {
    id: 'tx-core',
    name: 'Texas Core',
    full_name: 'Texas Core Curriculum',
    state: 'TX',
    total_units: 42,
    provenance: TX_CORE,
  },
  {
    id: 'fl-core',
    name: 'Florida GE Core',
    full_name: 'Florida General Education Core',
    state: 'FL',
    total_units: 15,
    provenance: FL_CORE,
  },
  {
    id: 'suny-ge',
    name: 'SUNY GE',
    full_name: 'SUNY General Education Framework',
    state: 'NY',
    // Seven areas priced at one 3-credit course each; SUNY's own figure is 30
    // credits, the rest set by the campus. See data/ny/core.ts.
    total_units: 21,
    provenance: SUNY_GE,
  },
  {
    id: 'cuny-pathways',
    name: 'CUNY Pathways',
    full_name: 'CUNY Pathways Common Core',
    state: 'NY',
    // 30 credits; the Flexible Core's sixth any-area course is not modelled.
    total_units: 27,
    provenance: CUNY_PATHWAYS,
  },
  {
    id: 'pa-tcf',
    name: 'PA Transfer Framework',
    full_name: 'Pennsylvania 30-Credit Transfer Framework',
    state: 'PA',
    // Six categories priced at one course each; the framework itself runs to 30
    // credits. See data/pa/core.ts.
    total_units: 18,
    provenance: PA_TCF,
  },
];
