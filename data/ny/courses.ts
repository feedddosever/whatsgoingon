import type { CreditSource, Provenance } from '../../src/types.ts';

/**
 * Community-college courses in New York.
 *
 * Neither system has a statewide course-numbering scheme like Texas's TCCNS or
 * Florida's SCNS, so a row here is not one course number — it is "a course your
 * community college has approved for this area". That is the unit both systems
 * guarantee: a SUNY GE area or a Pathways area completed at one campus counts as
 * completed at every other campus of the same system.
 */

const SUNY_CC_COST: Provenance = {
  source_url: 'https://www.suny.edu/smarttrack/tuition-and-fees/',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'SUNY community colleges set their own tuition. SUNY’s 2026-27 figure for a typical ' +
    'community college is $5,690 a year for an in-state student — about $190 a credit over ' +
    '30 credits — and SUNY Niagara, for one, charges $227 a credit part-time. Without a ' +
    'certificate of residence from your county the rate is roughly doubled.',
};

const CUNY_CC_COST: Provenance = {
  source_url: 'https://www.cuny.edu/financial-aid/tuition-and-college-costs/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CUNY community colleges, New York City resident: $210 a credit part-time, $2,400 a ' +
    'semester full-time. New York State residents outside the city can usually pay the same ' +
    'rate by filing a Certificate of Residency.',
};

const SUNY_CC_PER_CREDIT = 190;
const CUNY_CC_PER_CREDIT = 210;

const sunyCc = (id: string, name: string, credits = 3): CreditSource => ({
  id, kind: 'cc_course', name: `${name} (${credits} credits)`,
  cost_usd: SUNY_CC_PER_CREDIT * credits, provenance: SUNY_CC_COST,
});

const cunyCc = (id: string, name: string, credits = 3): CreditSource => ({
  id, kind: 'cc_course', name: `${name} (${credits} credits)`,
  cost_usd: CUNY_CC_PER_CREDIT * credits, provenance: CUNY_CC_COST,
});

export const sunyCcCourses: CreditSource[] = [
  sunyCc('ny-sunycc-comp', 'SUNY CC: English Composition (SUNY GE Communication)'),
  sunyCc('ny-sunycc-dei', 'SUNY CC: a course approved for SUNY GE Diversity'),
  sunyCc('ny-sunycc-stats', 'SUNY CC: Statistics (SUNY GE Mathematics)'),
  sunyCc('ny-sunycc-bio', 'SUNY CC: General Biology (SUNY GE Natural Sciences)', 4),
  sunyCc('ny-sunycc-humanities', 'SUNY CC: a course approved for SUNY GE Humanities'),
  sunyCc('ny-sunycc-arts', 'SUNY CC: a course approved for SUNY GE The Arts'),
  sunyCc('ny-sunycc-psych', 'SUNY CC: Introduction to Psychology (SUNY GE Social Sciences)'),
  sunyCc('ny-sunycc-us-history', 'SUNY CC: a course approved for SUNY GE US History and Civic Engagement'),
  sunyCc('ny-sunycc-world-history', 'SUNY CC: a course approved for SUNY GE World History'),
  sunyCc('ny-sunycc-language', 'SUNY CC: a world-language course approved for SUNY GE'),
];

export const cunyCcCourses: CreditSource[] = [
  cunyCc('ny-cunycc-comp-1', 'CUNY CC: English Composition I (Pathways Required Core)'),
  cunyCc('ny-cunycc-comp-2', 'CUNY CC: English Composition II (Pathways Required Core)'),
  cunyCc('ny-cunycc-math', 'CUNY CC: a Mathematical and Quantitative Reasoning course'),
  cunyCc('ny-cunycc-lps', 'CUNY CC: a Life and Physical Sciences course'),
  cunyCc('ny-cunycc-world', 'CUNY CC: a World Cultures and Global Issues course'),
  cunyCc('ny-cunycc-us', 'CUNY CC: a U.S. Experience in Its Diversity course'),
  cunyCc('ny-cunycc-creative', 'CUNY CC: a Creative Expression course'),
  cunyCc('ny-cunycc-ind-soc', 'CUNY CC: an Individual and Society course'),
  cunyCc('ny-cunycc-sci-world', 'CUNY CC: a Scientific World course'),
];
