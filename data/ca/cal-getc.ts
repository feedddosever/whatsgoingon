import type { GeArea } from '../../src/types.ts';

/**
 * Cal-GETC replaced IGETC and CSU GE Breadth from Fall 2025. The pattern is a
 * single statewide standard, so every area shares one provenance record rather
 * than carrying its own.
 */
const CAL_GETC_SOURCE = {
  source_url: 'https://icas-ca.org/cal-getc/',
  as_of: '',
  confidence: 'unverified' as const,
  note:
    'Confirm the current area list, unit minimums, and whether area 1C is genuinely CSU-only.',
};

export const calGetcAreas: GeArea[] = [
  { id: "1A", name: "English Composition", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "1B", name: "Critical Thinking / Composition", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "1C", name: "Oral Communication (CSU only)", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "2", name: "Mathematical Concepts & Quantitative Reasoning", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "3A", name: "Arts", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "3B", name: "Humanities", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "4", name: "Social & Behavioral Sciences", required_units: 6, provenance: CAL_GETC_SOURCE },
  { id: "5A", name: "Physical Science", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "5B", name: "Biological Science", required_units: 3, provenance: CAL_GETC_SOURCE },
  { id: "6", name: "Ethnic Studies", required_units: 3, provenance: CAL_GETC_SOURCE },
];
