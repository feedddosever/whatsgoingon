import type { CreditSource } from '../../src/types.ts';

export const creditSources: CreditSource[] = [
  {
    id: "clep-college-composition",
    kind: "clep",
    name: "CLEP College Composition",
    cost_usd: 95,
    provenance: {
      source_url: "https://clep.collegeboard.org/clep-exam-policy",
      as_of: "",
      confidence: "unverified",
      note:
        "Exam fee only; test centres charge an additional sitting fee. Modern States 'Freshman Year for Free' can cover the fee entirely \u2014 verify and surface this, it can take cost to $0.",
    },
  },
  {
    id: "clep-college-algebra",
    kind: "clep",
    name: "CLEP College Algebra",
    cost_usd: 95,
    provenance: {
      source_url: "https://clep.collegeboard.org/clep-exam-policy",
      as_of: "",
      confidence: "unverified",
    },
  },
  {
    id: "clep-intro-psychology",
    kind: "clep",
    name: "CLEP Introductory Psychology",
    cost_usd: 95,
    provenance: {
      source_url: "https://clep.collegeboard.org/clep-exam-policy",
      as_of: "",
      confidence: "unverified",
    },
  },
  {
    id: "ccc-engl-1a",
    kind: "ccc_course",
    name: "Community college English 1A",
    cost_usd: 138,
    provenance: {
      source_url: "https://www.cccco.edu/",
      as_of: "",
      confidence: "unverified",
      note:
        "CCC enrollment fee is set per unit statewide; 3 units at the current per-unit rate. Confirm the current rate and whether the student qualifies for the California College Promise Grant, which can waive it entirely.",
    },
  },
  {
    id: "ccc-math-1",
    kind: "ccc_course",
    name: "Community college Math 1 (Quantitative Reasoning)",
    cost_usd: 138,
    provenance: {
      source_url: "https://www.cccco.edu/",
      as_of: "",
      confidence: "unverified",
    },
  },
];
