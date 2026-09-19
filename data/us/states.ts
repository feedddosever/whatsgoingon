import type { AidProgram, Jurisdiction, Provenance, StateCode } from '../../src/types.ts';

/**
 * Every state, including the ones we have not mapped.
 *
 * Listing all 51 is deliberate. A student in Ohio opening a "US" app and being
 * told their state does not exist learns nothing; being told plainly that we
 * have not mapped Ohio's framework yet, that AP and CLEP and dual enrolment
 * work there anyway, and where to go to check, is a true and useful answer.
 * Absence of data is data, and it belongs in the dataset rather than in a
 * crash.
 */

/** Where the count of states with a statewide transfer core comes from. */
const ECS_SURVEY: Provenance = {
  source_url: 'https://www.ecs.org/50-state-comparison-transfer-and-articulation/',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Education Commission of the States reports that at least 31 states require a ' +
    'transferable core of lower-division courses and guarantee statewide transfer of ' +
    'an associate degree. We have mapped three of them. Yours may well have one — we ' +
    'have not confirmed it, so we will not describe it.',
};

const NOT_MAPPED = (name: string): Provenance => ({
  ...ECS_SURVEY,
  note:
    `We have not mapped a statewide general-education framework for ${name}. ` +
    ECS_SURVEY.note,
});

// ---- California -------------------------------------------------------------

const CCPG: AidProgram = {
  name: 'California College Promise Grant',
  note:
    'Waives the California community-college enrolment fee ($46/unit) entirely for ' +
    'eligible students. There is no income cut-off to look up before applying — the ' +
    'community college decides, and applying costs nothing.',
  provenance: {
    source_url: 'https://www.cccco.edu/Students/Pay-for-College/California-College-Promise-Grant',
    as_of: '2026-09-18',
    confidence: 'published',
  },
};

const CCAP: AidProgram = {
  name: 'dual enrolment (CCAP)',
  note:
    'College and Career Access Pathways partnerships let a high-school student take ' +
    'community-college courses with the enrolment fee waived, up to 15 units a term. ' +
    'It is the largest saving available to anyone still in high school.',
  provenance: {
    source_url: 'https://www.cccco.edu/Students/Dual-Enrollment',
    as_of: '2026-09-18',
    confidence: 'needs_check',
  },
};

// ---- Texas ------------------------------------------------------------------

const FAST: AidProgram = {
  name: 'Financial Aid for Swift Transfer (FAST)',
  note:
    'Created by HB 8 (2023). A high-school student who is or recently was eligible for ' +
    'free or reduced-price lunch takes dual-credit courses at a participating Texas ' +
    'public college at NO cost. Enrolment of economically disadvantaged students in ' +
    'dual credit more than doubled in the programme’s first year.',
  provenance: {
    source_url: 'https://www.highered.texas.gov/student-financial-aid-programs/fast',
    as_of: '2026-09-19',
    confidence: 'published',
  },
};

// ---- Florida ----------------------------------------------------------------

const FL_DUAL: AidProgram = {
  name: 'dual enrolment',
  note:
    'Florida Statutes 1007.271 exempts a dual-enrolment student from registration, ' +
    'tuition and laboratory fees outright. Not a discount and not means-tested — the ' +
    'fees do not apply. This is the cheapest college credit available anywhere in the ' +
    'dataset.',
  provenance: {
    source_url: 'https://www.flsenate.gov/laws/statutes/2024/1007.271',
    as_of: '2026-09-19',
    confidence: 'statute',
  },
};

const STATE_NAMES: Record<StateCode, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const MAPPED: Partial<Record<StateCode, Jurisdiction>> = {
  CA: {
    code: 'CA',
    name: 'California',
    framework_id: 'cal-getc',
    transfer_guarantee:
      'Complete Cal-GETC at a California community college and every UC and CSU campus ' +
      'accepts it as their lower-division general education, whole.',
    transfer_provenance: {
      source_url: 'https://icas-ca.org/cal-getc/',
      as_of: '2026-09-18',
      confidence: 'published',
      note:
        'AB 928 required a single lower-division transfer pattern for UC and CSU. ' +
        'Cal-GETC replaced IGETC and CSU GE Breadth from Fall 2025.',
    },
    fee_waiver: CCPG,
    dual_enrollment: CCAP,
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    framework_id: 'tx-core',
    transfer_guarantee:
      'Finish the 42-hour Texas Core at ANY Texas public college and the whole block ' +
      'transfers: the receiving university must substitute it for its own core and may ' +
      'not make you retake it.',
    transfer_provenance: {
      source_url: 'https://texas.public.law/statutes/tex._educ._code_section_61.822',
      as_of: '2026-09-19',
      confidence: 'statute',
      note:
        'Texas Education Code 61.822(c): a completed core curriculum "may be transferred ' +
        'to any other institution of higher education and must be substituted for the ' +
        'receiving institution’s core curriculum", and the student "may not be required ' +
        'to take additional core curriculum courses". This is the single most valuable ' +
        'fact in the Texas dataset: it is the block that matters, not the course.',
    },
    // Texas has no statewide need-based waiver of community-college tuition
    // comparable to the CCPG. Saying otherwise would price a Texas plan wrong.
    fee_waiver: null,
    dual_enrollment: FAST,
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    framework_id: 'fl-core',
    transfer_guarantee:
      'Earn an Associate in Arts at a Florida public college and you are guaranteed ' +
      'admission to a state university with junior standing and 60 credits toward the ' +
      'bachelor’s — though not to the campus or programme of your choice.',
    transfer_provenance: {
      source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.23',
      as_of: '2026-09-19',
      confidence: 'statute',
      note:
        'The statewide articulation agreement has guaranteed AA holders university ' +
        'admission since 1972. Read the limit as carefully as the promise: the guarantee ' +
        'is admission to A state university, not to the one you want.',
    },
    fee_waiver: null,
    dual_enrollment: FL_DUAL,
  },
};

export const jurisdictions: Jurisdiction[] = (
  Object.keys(STATE_NAMES) as StateCode[]
).map(code => MAPPED[code] ?? {
  code,
  name: STATE_NAMES[code],
  framework_id: null,
  transfer_guarantee: null,
  transfer_provenance: NOT_MAPPED(STATE_NAMES[code]),
  fee_waiver: null,
  dual_enrollment: null,
});
