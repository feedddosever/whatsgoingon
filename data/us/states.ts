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


/**
 * The statewide layer, for the states we have not built campus pricing for.
 *
 * This is the half of the product that scales. A statewide transfer guarantee
 * applies to every public campus in the state at once, it is the single most
 * valuable thing we can tell most students, and — unlike per-campus tuition and
 * per-exam articulation — it is one fact rather than four hundred. So a student
 * in Ohio gets Ohio Transfer 36 today, while campus-level planning is still
 * only California, Texas and Florida.
 *
 * Every row here is `needs_check`. They were assembled from search results
 * rather than read out of the statute, the board policy or the agreement
 * itself, and the difference between those two things is the entire product.
 * Confirming one is a matter of reading one document; until someone does, the
 * app says where it came from and how far it goes, and never more.
 *
 * A state absent from this table is not a state without a transfer policy — the
 * Education Commission of the States counts at least 31 with a transferable
 * lower-division core. It is a state we have not confirmed one for, which is a
 * fact about us and not about them, and the UI says so in those words.
 */
interface StatewideRule {
  programme: string;
  guarantee: string;
  source_url: string;
}

const STATEWIDE: Partial<Record<StateCode, StatewideRule>> = {
  AL: {
    programme: 'Alabama Transfers (formerly STARS)',
    guarantee:
      'Alabama Transfers is the statewide articulation and transfer planning system: it publishes course equivalents and degree requirements for every state-funded four-year institution, by major.',
    source_url: 'https://alabamatransfers.com/about/agsc-stars',
  },
  AZ: {
    programme: 'Arizona General Education Curriculum (AGEC)',
    guarantee:
      'Complete the AGEC — up to 35 credits, offered at every Arizona community college — with a 2.5 GPA and you are guaranteed admission to ASU, NAU and the University of Arizona with general education 100% complete.',
    source_url: 'https://www.aztransfer.com/about/agec.html',
  },
  AR: {
    programme: 'Arkansas Course Transfer System (ACTS)',
    guarantee:
      'Courses listed as comparable in ACTS are guaranteed to transfer for full credit to any Arkansas public institution.',
    source_url: 'https://adhe.edu/institutions/arkansas-transfer-and-articulation',
  },
  CO: {
    programme: 'gtPathways',
    guarantee:
      'More than 300 lower-division courses across 20 subject areas are guaranteed to transfer between Colorado public institutions, and the receiving institution must apply them to general education or major requirements.',
    source_url: 'https://highered.colorado.gov/Academics/Transfers/gtPathways/Curriculum/Courses.aspx',
  },
  GA: {
    programme: 'USG Core Curriculum, Areas A–F',
    guarantee:
      'Complete the core curriculum at a University System of Georgia institution and you are guaranteed full credit on transfer, provided you do not change major. Each institution\'s core is 60 semester hours: 42 in Areas A–E and 18 in Area F.',
    source_url: 'https://www.usg.edu/curriculum/transfer-hub/',
  },
  IL: {
    programme: 'Illinois Articulation Initiative (IAI)',
    guarantee:
      'The IAI General Education Core Curriculum — 12 to 13 courses, 37 to 41 credit hours — transfers as a package among more than 100 participating Illinois institutions, public and private.',
    source_url: 'https://itransfer.org/about/',
  },
  IN: {
    programme: 'Indiana College Core / STGEC',
    guarantee:
      'Under Senate Enrolled Act 182 (2012), 30 credit hours of approved general education completed at any Indiana public institution transfer to any other as a block toward its general education core.',
    source_url: 'https://transferin.net/ways-to-earn-credit/statewide-transfer-general-education-core-stgec/',
  },
  KY: {
    programme: 'Kentucky General Education Transfer Policy',
    guarantee:
      'Complete a 33-credit-hour general education programme and you are \'fully general education certified\' — that certification is accepted by any other Kentucky public college or university.',
    source_url: 'https://cpe.ky.gov/policies/academicaffairs/genedtransferpolicy.pdf',
  },
  LA: {
    programme: 'Louisiana Transfer Degree (AALT / ASLT)',
    guarantee:
      'Finish a Louisiana Transfer associate degree and you enter a Louisiana public university as a junior, with all 60 non-developmental credits transferring.',
    source_url: 'https://www.laregents.edu/wp-content/uploads/2025/12/2024-2025-Articulation-and-Transfer-Report.pdf',
  },
  MA: {
    programme: 'MassTransfer General Education Foundation',
    guarantee:
      'Complete the 34-credit MassTransfer General Education Foundation with a 2.0 or better and it transfers whole to any Massachusetts public institution — with or without the associate degree. The receiving institution may add no more than six further credits.',
    source_url: 'https://www.mass.edu/masstransfer/gened/home.asp',
  },
  MI: {
    programme: 'Michigan Transfer Agreement (MTA)',
    guarantee:
      'Complete 30 credits under the MTA, with at least a 2.0 in each course, and they satisfy many or all general education requirements at participating Michigan four-year institutions.',
    source_url: 'https://www.mitransfer.org/michigan-transfer-agreement',
  },
  MN: {
    programme: 'Minnesota Transfer Curriculum (MnTC)',
    guarantee:
      'Complete the 40-credit MnTC at any participating college and every lower-division general education requirement is satisfied at any Minnesota public baccalaureate institution.',
    source_url: 'https://www.minnstate.edu/admissions/transfer.html',
  },
  MS: {
    programme: 'Mississippi Articulation and Transfer Tool (MATT)',
    guarantee:
      'MATT is the statewide articulation agreement: it names, per degree programme, which community college courses each of the eight public universities accepts.',
    source_url: 'https://matttransfertool.com/',
  },
  MO: {
    programme: 'CORE 42',
    guarantee:
      'A block of at least 42 credit hours transfers whole and is treated as meeting general education at every Missouri public institution. CORE 42 courses carry a MOTR number that guarantees one-to-one transfer.',
    source_url: 'https://dhewd.mo.gov/higher-education/academic-affairs/core-42',
  },
  NY: {
    programme: 'SUNY Transfer Paths',
    guarantee:
      'A New York resident who earns an A.A. or A.S. at a SUNY or CUNY two-year college is guaranteed the opportunity to continue full-time at a SUNY baccalaureate campus. SUNY Transfer Paths cover 68 majors, and every SUNY four-year must accept those courses toward the major.',
    source_url: 'https://www.suny.edu/attend/get-started/transfer-students/suny-transfer-policies/',
  },
  NC: {
    programme: 'Comprehensive Articulation Agreement (CAA)',
    guarantee:
      'Earn an Associate in Arts or Associate in Science and the CAA guarantees junior standing and 60–61 semester hours on admission to a UNC System university.',
    source_url: 'https://www.nccommunitycolleges.edu/students/enrollment-and-registration/university-transfer/articulation-agreements/comprehensive-articulation-agreement/',
  },
  OH: {
    programme: 'Ohio Transfer 36',
    guarantee:
      'Thirty-six credit hours of general education guaranteed to transfer among all Ohio public institutions of higher education.',
    source_url: 'https://transfercredit.ohio.gov/initiatives-upd/ohio-transfer-36',
  },
  OR: {
    programme: 'Core Transfer Map (CTM)',
    guarantee:
      'At least eight courses totalling at least 30 credits, taken at any Oregon community college, transfer and meet at least 30 credits of general education at any Oregon public university.',
    source_url: 'https://www.oregon.gov/highered/about/transfer/pages/transfer-compass.aspx',
  },
  TN: {
    programme: 'Tennessee Transfer Pathways (TTP)',
    guarantee:
      'Tennessee Transfer Pathways are agreements confirming that named community college courses meet major-preparation requirements at Tennessee public universities, with a transfer admission guarantee attached.',
    source_url: 'https://www.tntransferpathway.org/',
  },
  VA: {
    programme: 'Passport and the Uniform Certificate of General Studies',
    guarantee:
      'The 16-credit Passport and the 31-credit UCGS both transfer whole: every course satisfies a lower-division general education requirement at any Virginia public institution.',
    source_url: 'https://www.transfervirginia.org/content/general-education-transfer-credit-agreementpassport-and-ucgs',
  },
  WA: {
    programme: 'Direct Transfer Agreement (DTA)',
    guarantee:
      'Earn a DTA associate degree at a Washington public two-year college and you have completed the general education or core requirements of any Washington public four-year, normally entering with junior standing.',
    source_url: 'https://www.sbctc.edu/colleges-staff/programs-services/transfer/direct-transfer-agreement.aspx',
  },
  WV: {
    programme: 'Core Coursework Transfer Agreement',
    guarantee:
      'West Virginia\'s Higher Education Policy Commission and its Community and Technical College System maintain an agreement making core coursework transferable between the two-year and four-year public sectors.',
    source_url: 'https://www.wvhepc.edu/',
  },
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
).map(code => {
  const full = MAPPED[code];
  if (full !== undefined) return full;

  const name = STATE_NAMES[code];
  const rule = STATEWIDE[code];
  if (rule === undefined) {
    return {
      code, name,
      framework_id: null,
      transfer_guarantee: null,
      transfer_provenance: NOT_MAPPED(name),
      fee_waiver: null,
      dual_enrollment: null,
    };
  }

  return {
    code, name,
    // No framework: we hold the guarantee, not the requirement list it refers
    // to. Pointing at a framework we cannot enumerate would let the engine
    // plan against an empty area list and call the result a complete plan.
    framework_id: null,
    transfer_guarantee: `${rule.programme}. ${rule.guarantee}`,
    transfer_provenance: {
      source_url: rule.source_url,
      as_of: '2026-09-19',
      confidence: 'needs_check',
      note:
        `Read from ${rule.programme} materials rather than from the statute or board ` +
        'policy itself, so confirm it before you rely on it. We do not yet hold ' +
        `${name}'s campuses or its requirement list, so we cannot price a plan here — ` +
        'only tell you the rule that applies to all of them.',
    },
    fee_waiver: null,
    dual_enrollment: null,
  };
});
