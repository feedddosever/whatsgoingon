import type { MajorPrep, MajorPrepGap, Provenance, SystemDegree } from '../../src/types.ts';

/**
 * What a Florida State University System bachelor's degree is made of, beyond
 * the general-education core. Statute rows were read from the Florida Senate's
 * own 2025 Statutes on the as_of date.
 */

const S_1007_25: Provenance = {
  source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.25',
  as_of: '2026-09-28',
  confidence: 'statute',
};

const RULE_6A_10_030: Provenance = {
  source_url: 'http://flrules.elaws.us/fac/6a-10.030',
  as_of: '2026-09-28',
  confidence: 'published',
  note:
    'State Board of Education rule 6A-10.030, effective 21 February 2023, read from an ' +
    'unofficial compilation of the Florida Administrative Code — hence not marked as law.',
};

const SACSCOC: Provenance = {
  source_url: 'https://sacscoc.org/app/uploads/2024/01/2024PrinciplesOfAccreditation.pdf',
  as_of: '2026-09-28',
  confidence: 'published',
  note: 'SACSCOC accredits every public university in Texas and Florida.',
};

export const floridaDegrees: SystemDegree[] = [
  {
    system: 'FL-SUS',
    total_units: 120,
    ge_units: 36,
    rules: [
      {
        id: 'fl-total',
        block: 'total',
        title: 'Total hours',
        text:
          'No more than 120 semester hours, including 36 hours of general education, unless ' +
          'the Board of Governors has approved a longer program.',
        provenance: S_1007_25,
      },
      {
        id: 'fl-ge',
        block: 'ge',
        title: 'General education',
        text:
          '36 semester hours across communication, mathematics, social sciences, humanities ' +
          'and natural sciences — including at least one statewide core course in each of the ' +
          'five. Every public college and university must accept a core course on transfer.',
        provenance: S_1007_25,
      },
      {
        id: 'fl-residency',
        block: 'residency',
        title: 'Credit earned at the university',
        text:
          'At least 25 percent of the hours for your degree must come from instruction at the ' +
          'university awarding it — 30 hours of a 120-hour degree.',
        provenance: SACSCOC,
      },
      {
        id: 'fl-lower-division',
        block: 'upper_division',
        title: 'Half the degree can be lower-division',
        text:
          'At least half of the hours required for a degree must be achievable through ' +
          'lower-division courses, unless a program is approved otherwise.',
        provenance: S_1007_25,
      },
      {
        id: 'fl-civic',
        block: 'graduation',
        title: 'Civic literacy',
        text:
          'Students entering from 2021-22 must pass both a civic literacy course and a civic ' +
          'literacy assessment. Exam credit such as AP can count toward the course.',
        provenance: S_1007_25,
      },
      {
        id: 'fl-writing-math',
        block: 'graduation',
        title: 'Writing and math (the old “Gordon Rule”)',
        text:
          'Before upper division: 6 hours of English plus 6 more hours of writing-intensive ' +
          'courses, and 6 hours of math at college algebra or above — each with a C or higher. ' +
          'AP, IB and dual-enrolment credit count to the extent awarded.',
        provenance: RULE_6A_10_030,
      },
      {
        id: 'fl-prereqs',
        block: 'major',
        title: 'Common prerequisites',
        text:
          'The state publishes the lower-division prerequisites for each bachelor’s program, ' +
          'and every state university and college must offer and accept them.',
        provenance: S_1007_25,
      },
    ],
  },
];

/**
 * Florida's Common Prerequisites Manual, 2026-27 edition. The manual is a
 * JavaScript app, so it was read through an automated browser rather than a
 * plain fetch; each row names the page and the university entry it came from.
 * Common prerequisites are the same at every state university by law
 * (s. 1007.25(7)) unless the Board of Governors approved an exception.
 *
 * Course numbers keep the manual's "x": it stands for the level digit, which
 * varies by college — ACG x021 is ACG 2021 at most of them.
 */
const cpm = (programId: string, university: string): Provenance => ({
  source_url: `https://cpm.flvc.org/programs/year/2026/${programId}`,
  as_of: '2026-09-28',
  confidence: 'published',
  note: `Read from the ${university} entry in the 2026-27 manual.`,
});

const CPM = 'Florida common prerequisites';

export const floridaMajorPrep: MajorPrep[] = [
  {
    id: 'fl-cpm-business',
    systems: ['FL-SUS'],
    fields: ['business'],
    major: 'Business administration and management',
    programme: CPM,
    courses: [
      'MAC x233 Calculus for Business & Social Sciences I',
      'ECO x023 Principles of Microeconomics',
      'ECO x013 Principles of Macroeconomics (also general-education core)',
      'ACG x071 Managerial Accounting I',
      'ACG x021 Accounting Principles',
      'STA x023 Statistical Methods I (also general-education core)',
      'CGS x100 Applications for Business',
    ],
    note: 'Two of these also count toward your general-education core.',
    provenance: cpm('3654', 'University of Florida'),
  },
  {
    id: 'fl-cpm-psychology',
    systems: ['FL-SUS'],
    fields: ['social_sciences'],
    major: 'Psychology',
    programme: CPM,
    courses: [
      'PSY x012 Introduction to Psychology (also general-education core)',
      'STA x023 Statistical Methods I (also general-education core)',
      'BSC x005 General Biology (also general-education core)',
      'One more psychology course (any PSY number)',
    ],
    note:
      'Listed for FAMU, FGCU, FSU, UF, USF, FAU, FIU, UCF, UNF and UWF. Three of the four ' +
      'also count toward your general-education core.',
    provenance: cpm('3527', 'University of Florida'),
  },
  {
    id: 'fl-cpm-nursing',
    systems: ['FL-SUS'],
    fields: ['health'],
    major: 'Nursing (pre-licensure BSN)',
    programme: CPM,
    courses: [
      'BSC x085C Anatomy & Physiology I (also general-education core)',
      'BSC x086C Anatomy & Physiology II',
      'CHM x020 General Chemistry for Liberal Studies I (also general-education core)',
      'DEP x004 Developmental Psychology across the Life Span',
      'STA x023 Statistical Methods I (also general-education core)',
      'PSY x012 Introduction to Psychology (also general-education core)',
      'MCB x010C Introductory Microbiology',
      'HUN x201 Human Nutrition',
    ],
    note:
      'Listed for FAMU, FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF. The manual adds that a ' +
      'course requiring one of these as a direct prerequisite may count as an alternative.',
    provenance: cpm('3620', 'University of Florida'),
  },
  {
    id: 'fl-cpm-biology',
    systems: ['FL-SUS'],
    fields: ['stem', 'health'],
    major: 'Biology',
    programme: CPM,
    courses: [
      'General biology I and II with labs (BSC x010 / x011, or botany and zoology alternatives)',
      'General chemistry I and II with labs (CHM x045 / x046)',
      'Organic chemistry I and II with labs (CHM x210 / x211)',
      'Physics I and II — algebra-based (PHY x053 / x054) or calculus-based (PHY x048 / x049)',
      'Calculus I — any of several versions (MAC x311, x241 life-science, x233 business, and others)',
      'A second math or statistics course (for example MAC x312, MAC x234 or STA x023)',
    ],
    note:
      'Listed for FAMU, FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF. The manual notes that ' +
      'the University of Florida does not require organic chemistry or physics before transfer.',
    provenance: {
      ...cpm('3459', 'University of Florida'),
      confidence: 'needs_check',
      note:
        'The manual lists alternative courses within each block; this is our summary of those ' +
        'blocks, read through an automated browser. Check the exact options with the university.',
    },
  },
  {
    id: 'fl-cpm-english',
    systems: ['FL-SUS'],
    fields: ['arts_humanities'],
    major: 'English language and literature',
    programme: CPM,
    courses: [
      'ENC x101 English Composition (also general-education core)',
      'ENC x102 Composition II',
    ],
    note:
      'Listed for FAMU, FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF. These two are the ' +
      'only common prerequisites the manual names for the major.',
    provenance: cpm('3444', 'University of Florida'),
  },
  {
    id: 'fl-cpm-history',
    systems: ['FL-SUS'],
    fields: ['arts_humanities', 'social_sciences'],
    major: 'History',
    programme: CPM,
    courses: [
      'AMH x010 Introductory Survey to 1877 (also general-education core)',
      'One history course (any AMH, AFH, ASH, EUH, HIS, LAH or WOH number)',
      'A second history course from the same list, not a repeat of the first',
    ],
    note:
      'Listed for FAMU, FAU, FGCU, FIU, FSU, UCF, UF, UNF, USF and UWF. The manual suggests ' +
      'WOH x012 World History I or AMH x091 African American History for the two open ' +
      'choices, and UWF recommends AMH 2010, AMH 2020, EUH 1000, EUH 1001 or HIS 2050.',
    provenance: {
      ...cpm('3704', 'University of Florida'),
      confidence: 'needs_check',
      note:
        'Track 1 of the 2026-27 manual, read through an automated browser. The two open ' +
        'choices are our summary of the alternatives listed — check the exact options with ' +
        'the university.',
    },
  },
  {
    id: 'fl-cpm-cs',
    systems: ['FL-SUS'],
    fields: ['stem'],
    major: 'Computer science (one track of several)',
    programme: CPM,
    courses: [
      'MAC x311 Calculus I (also general-education core)',
      'MAC x312 Calculus with Analytic Geometry II',
      'MAD x104 Discrete Mathematics',
      'COP x001 Introduction to Computer Programming II',
      'COP x271C (title not shown in the manual)',
      'COP x710 Database Design / Architecture',
      'CDA x201 Sequential Circuits',
      'QMB x100 Basic Business Statistics',
      'PHY x048C General Physics with Calculus I (also general-education core)',
      'PHY x049C General Physics with Calculus II',
      'BSC x010C General Biology (also general-education core)',
    ],
    note:
      'This is the track listed for Florida Polytechnic, UNF and UWF. The manual lists other ' +
      'computer science tracks for other universities, which we have not read — check yours.',
    provenance: {
      ...cpm('3344', 'Florida Polytechnic / UNF / UWF'),
      confidence: 'needs_check',
      note:
        'Read from the 2026-27 manual\u2019s track shared by Florida Polytechnic, UNF and UWF; ' +
        'one course showed no title. Other universities\u2019 tracks were not read.',
    },
  },
];

export const floridaMajorPrepGaps: MajorPrepGap[] = [];
