import type { Provenance, TransferPolicy } from '../../src/types.ts';

/**
 * How the Florida State University System treats courses taken at another
 * college. Both statutes were opened and read on the as_of date, which is what
 * `statute` means in this project.
 */
const S_1007_23: Provenance = {
  source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.23',
  as_of: '2026-09-27',
  confidence: 'statute',
};

const S_1007_24: Provenance = {
  source_url: 'https://www.flsenate.gov/Laws/Statutes/2025/1007.24',
  as_of: '2026-09-27',
  confidence: 'statute',
};

export const floridaTransferPolicies: TransferPolicy[] = [
  {
    system: 'FL-SUS',
    points: [
      {
        text:
          'Graduate with an associate in arts from a Florida College System institution and ' +
          'you have met all general-education requirements, and must be admitted to the upper ' +
          'division of a state university — except limited-access, teacher-certification and ' +
          'audition programs.',
        provenance: S_1007_23,
      },
      {
        text:
          'A course judged equivalent under the Statewide Course Numbering System must be ' +
          'given credit at the receiving institution, and counts toward requirements exactly ' +
          'as it would for a student who took it there.',
        provenance: S_1007_24,
      },
      {
        text:
          'Transferred general-education courses must be applied to general-education ' +
          'requirements first, before any of them are counted as electives.',
        provenance: S_1007_24,
      },
    ],
  },
];
