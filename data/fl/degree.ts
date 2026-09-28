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
];

export const floridaMajorPrepGaps: MajorPrepGap[] = [];
