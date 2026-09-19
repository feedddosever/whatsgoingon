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
];
