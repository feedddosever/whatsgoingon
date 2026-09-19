import type { CreditSource, Provenance } from '../../src/types.ts';

/**
 * Florida College System courses, by Statewide Course Numbering System prefix.
 * Like Texas's TCCNS, SCNS is what lets one row stand for the whole state.
 */
const FL_CC_COST: Provenance = {
  source_url: 'https://www.fldoe.org/file/19874/2526-SFRF.pdf',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Florida College System per-credit-hour rates for Fall 2025-26 run roughly $68.53 ' +
    'to $82.78 across colleges; $76 is the middle. If you are a dual-enrolment student, ' +
    'Florida Statutes 1007.271 exempts you from registration, tuition and laboratory ' +
    'fees entirely, and this row costs you nothing.',
};

const PER_CREDIT = 76;

const course = (id: string, name: string, hours: number): CreditSource => ({
  id, kind: 'cc_course', name, cost_usd: PER_CREDIT * hours, provenance: FL_CC_COST,
});

export const floridaCourses: CreditSource[] = [
  course('fl-enc-1101', 'ENC 1101 Composition I (3 credits)', 3),
  course('fl-enc-1102', 'ENC 1102 Composition II (3 credits)', 3),
  course('fl-mac-1105', 'MAC 1105 College Algebra (3 credits)', 3),
  course('fl-mgf-1106', 'MGF 1106 Mathematics for Liberal Arts (3 credits)', 3),
  course('fl-sta-2023', 'STA 2023 Statistics (3 credits)', 3),
  course('fl-psy-2012', 'PSY 2012 General Psychology (3 credits)', 3),
  course('fl-syg-2000', 'SYG 2000 Introductory Sociology (3 credits)', 3),
  course('fl-pos-2041', 'POS 2041 American Government (3 credits)', 3),
  course('fl-amh-2020', 'AMH 2020 United States History since 1877 (3 credits)', 3),
  course('fl-arh-2000', 'ARH 2000 Art Appreciation (3 credits)', 3),
  course('fl-phi-2010', 'PHI 2010 Introduction to Philosophy (3 credits)', 3),
  course('fl-lit-2000', 'LIT 2000 Introduction to Literature (3 credits)', 3),
  course('fl-bsc-1005', 'BSC 1005 Biological Science (3 credits)', 3),
  course('fl-chm-1020', 'CHM 1020 Chemistry for Liberal Studies (3 credits)', 3),
  course('fl-ast-1002', 'AST 1002 Descriptive Astronomy (3 credits)', 3),
];
