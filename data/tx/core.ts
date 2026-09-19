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
 * Hours per component area are the standard Texas Core allocation. The statute
 * fixes the 42-hour total; the split across component areas comes from the
 * Coordinating Board's core curriculum rules, which we have read in summary
 * rather than in the rule text, so the split carries a lower confidence than
 * the total does.
 */
const TX_SPLIT: Provenance = {
  source_url: 'http://board.thecb.state.tx.us/apps/tcc/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Communication 6, Mathematics 3, Life & Physical Sciences 6, Language/Philosophy/' +
    'Culture 3, Creative Arts 3, American History 6, Government/Political Science 6, ' +
    'Social & Behavioural Sciences 3, Component Area Option 6. Confirm your own ' +
    'campus’s core list on the Coordinating Board’s Texas Core Curriculum WebCenter ' +
    '— institutions choose which courses fill each area.',
};

const area = (id: string, name: string, units: number): GeArea => ({
  id, name, required_units: units,
  framework_id: 'tx-core',
  applies_to: ['TX-PUBLIC'],
  provenance: TX_SPLIT,
});

export const texasCoreAreas: GeArea[] = [
  { ...area('tx-comm', 'Communication', 6), provenance: TX_CORE },
  area('tx-math', 'Mathematics', 3),
  area('tx-life-phys', 'Life & Physical Sciences', 6),
  area('tx-lang-phil', 'Language, Philosophy & Culture', 3),
  area('tx-arts', 'Creative Arts', 3),
  area('tx-us-history', 'American History', 6),
  area('tx-govt', 'Government / Political Science', 6),
  area('tx-social', 'Social & Behavioral Sciences', 3),
  area('tx-option', 'Component Area Option', 6),
];
