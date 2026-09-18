import type { AcceptanceRule } from '../../src/types.ts';

export const acceptanceRules: AcceptanceRule[] = [
  {
    institution_id: "csu-long-beach",
    credit_source_id: "clep-college-composition",
    min_score: 50,
    units_granted: 3,
    satisfies_area: "1A",
    provenance: {
      source_url: "https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx",
      as_of: "",
      confidence: "unverified",
      note:
        "Score minimum applies. Confirm the campus grants this against area 1A specifically, not as unassigned elective credit.",
    },
  },
  {
    institution_id: "csu-long-beach",
    credit_source_id: "clep-college-algebra",
    min_score: 50,
    units_granted: 3,
    satisfies_area: "2",
    provenance: {
      source_url: "https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx",
      as_of: "",
      confidence: "unverified",
      note:
        "Score minimum applies. Some campuses grant elective units only, which does NOT clear area 2.",
    },
  },
  {
    institution_id: "csu-long-beach",
    credit_source_id: "clep-intro-psychology",
    min_score: 50,
    units_granted: 3,
    satisfies_area: "4",
    provenance: {
      source_url: "https://www.calstate.edu/apply/transfer/Pages/credit-by-exam.aspx",
      as_of: "",
      confidence: "unverified",
      note:
        "Score minimum applies. Confirm it maps to area 4 and not to a major-specific requirement.",
    },
  },
  {
    institution_id: "csu-long-beach",
    credit_source_id: "ccc-engl-1a",
    min_score: null,
    units_granted: 3,
    satisfies_area: "1A",
    provenance: {
      source_url: "https://assist.org/",
      as_of: "",
      confidence: "unverified",
      note:
        "ASSIST is the authoritative source for CCC-to-CSU/UC articulation. Every CCC row must be confirmed there.",
    },
  },
  {
    institution_id: "csu-long-beach",
    credit_source_id: "ccc-math-1",
    min_score: null,
    units_granted: 3,
    satisfies_area: "2",
    provenance: {
      source_url: "https://assist.org/",
      as_of: "",
      confidence: "unverified",
      note:
        "Confirm on ASSIST for this campus pair. Math articulation frequently depends on the major.",
    },
  },
  {
    institution_id: "uc-berkeley",
    credit_source_id: "ccc-engl-1a",
    min_score: null,
    units_granted: 3,
    satisfies_area: "1A",
    provenance: {
      source_url: "https://assist.org/",
      as_of: "",
      confidence: "unverified",
      note:
        "Course-to-course articulation is institution-pair specific. Confirm this exact CCC course on ASSIST for this exact campus.",
    },
  },
  {
    institution_id: "uc-berkeley",
    credit_source_id: "ccc-math-1",
    min_score: null,
    units_granted: 3,
    satisfies_area: "2",
    provenance: {
      source_url: "https://assist.org/",
      as_of: "",
      confidence: "unverified",
      note:
        "Confirm on ASSIST for this campus pair. Math articulation frequently depends on the major.",
    },
  },
];
