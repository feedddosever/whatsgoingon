import type { GeArea } from '../../src/types.ts';

/**
 * Cal-GETC replaced IGETC and CSU GE Breadth from Fall 2025. The pattern is a
 * single statewide standard, so every area shares one provenance record rather
 * than carrying its own.
 */
const CAL_GETC_SOURCE = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '2026-09-18',
  confidence: 'published' as const,
  note:
    'Cal-GETC v1.4, effective 2026, replaced IGETC and CSU GE Breadth under AB 928. ' +
    'Area 1C (Oral Communication) is required for CSU and not for UC. Area 5 ' +
    'totals 7 semester units across 5A, 5B and the 5C laboratory. ' +
    'CLEP cannot be used to satisfy any Cal-GETC area.',
};

export const calGetcAreas: GeArea[] = [
  { id: "1A", code: "1A", name: "English Composition", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "1B", code: "1B", name: "Critical Thinking / Composition", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  // CSU only: a UC-bound student must not be told to solve this.
  { id: "1C", code: "1C", name: "Oral Communication", required_units: 3, framework_id: 'cal-getc', applies_to: ['CSU'], provenance: CAL_GETC_SOURCE },
  { id: "2", code: "2", name: "Mathematical Concepts & Quantitative Reasoning", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "3A", code: "3A", name: "Arts", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "3B", code: "3B", name: "Humanities", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "4", code: "4", name: "Social & Behavioral Sciences", required_units: 6, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "5A", code: "5A", name: "Physical Science", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "5B", code: "5B", name: "Biological Science", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  // Area 5 totals 7 semester units across 5A, 5B and the laboratory. Several AP
  // science exams clear their science area AND this lab in one sitting.
  { id: "5C", code: "5C", name: "Laboratory Activity", required_units: 1, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
  { id: "6", code: "6", name: "Ethnic Studies", required_units: 3, framework_id: 'cal-getc', applies_to: ['UC', 'CSU'], provenance: CAL_GETC_SOURCE },
];
