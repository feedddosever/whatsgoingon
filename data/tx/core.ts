import type { GeArea, Provenance } from '../../src/types.ts';

/**
 * The Texas Core Curriculum: eight Foundational Component Areas totalling 36
 * semester credit hours, plus a six-hour Component Area Option, for 42 in all.
 *
 * Texas Education Code 61.822 is unusually generous to a planner. The core is
 * not merely recommended, it is required of every public institution, and a
 * completed core MUST be substituted by the receiving institution. That makes
 * the block — not the individual course — the unit that matters here, and it is
 * why a Texas plan is worth building before a student picks a university at all.
 */
const TX_CORE: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_61.822',
  as_of: '2026-09-19',
  confidence: 'statute',
  note:
    'Texas Education Code 61.822: every public institution adopts a core curriculum of ' +
    'no fewer than 42 semester credit hours, and a completed core transfers as a block ' +
    'that the receiving institution must substitute for its own.',
};

/**
 * Hours per component area, read in the rule itself: 19 TAC § 4.28, amended
 * effective 11 February 2026 with the split unchanged.
 *
 * The engine treats an area as cleared or not, with no partial credit, so a
 * six-hour area is TWO three-hour halves here. Left whole, one 3-hour exam
 * cleared all six hours of Communication — a plan that looked cheaper than it
 * was, which is the one error this app exists to prevent. A credit worth six
 * hours (AP U.S. History at Texas A&M or Texas Tech) clears both halves.
 */
const TX_SPLIT: Provenance = {
  source_url: 'https://www.law.cornell.edu/regulations/texas/19-Tex-Admin-Code-SS-4-28',
  as_of: '2026-10-01',
  confidence: 'statute',
  note:
    '19 TAC § 4.28: Communication 6, Mathematics 3, Life & Physical Sciences 6, Language, ' +
    'Philosophy & Culture 3, Creative Arts 3, American History 6, Government/Political Science ' +
    '6, Social & Behavioral Sciences 3, and a Component Area Option of 6 — 42 in all. Each ' +
    'university chooses which courses fill each area, and some lay the option hours out ' +
    'differently. The Coordinating Board will recommend a new statewide core to the ' +
    'Legislature in January 2027.',
};

const area = (id: string, name: string, units: number): GeArea => ({
  id, name, required_units: units,
  framework_id: 'tx-core',
  applies_to: ['TX-PUBLIC'],
  provenance: TX_SPLIT,
});

export const texasCoreAreas: GeArea[] = [
  { ...area('tx-comm-1', 'Communication (1 of 2)', 3), provenance: TX_CORE },
  area('tx-comm-2', 'Communication (2 of 2)', 3),
  area('tx-math', 'Mathematics', 3),
  area('tx-life-phys-1', 'Life & Physical Sciences (1 of 2)', 3),
  area('tx-life-phys-2', 'Life & Physical Sciences (2 of 2)', 3),
  area('tx-lang-phil', 'Language, Philosophy & Culture', 3),
  area('tx-arts', 'Creative Arts', 3),
  area('tx-us-history-1', 'American History (1 of 2)', 3),
  area('tx-us-history-2', 'American History (2 of 2)', 3),
  area('tx-govt-1', 'Government / Political Science (1 of 2)', 3),
  area('tx-govt-2', 'Government / Political Science (2 of 2)', 3),
  area('tx-social', 'Social & Behavioral Sciences', 3),
  area('tx-option-1', 'Component Area Option (1 of 2)', 3),
  area('tx-option-2', 'Component Area Option (2 of 2)', 3),
];
