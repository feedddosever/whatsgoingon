import type { Provenance, TransferPolicy } from '../../src/types.ts';

/**
 * How UC and CSU treat courses taken at another college.
 *
 * Both pages were opened and read on the as_of date; the sentences below say
 * what those pages say and no more. Neither page is the campus's evaluation of
 * a particular transcript — that happens at admission, and the app says so.
 */
const UC_CREDIT: Provenance = {
  source_url:
    'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/preparing-to-transfer/transfer-credit.html',
  as_of: '2026-09-27',
  confidence: 'published',
};

const CSU_APPLY: Provenance = {
  source_url: 'https://www.calstate.edu/apply',
  as_of: '2026-09-27',
  confidence: 'published',
};

export const californiaTransferPolicies: TransferPolicy[] = [
  {
    system: 'UC',
    points: [
      {
        text:
          'UC accepts up to 70 semester (105 quarter) units for lower-division courses taken ' +
          'at any school that is not a UC.',
        provenance: UC_CREDIT,
      },
      {
        text:
          'Which California community college courses earn UC credit is set by each ' +
          'college’s Transfer Course Agreement with UC. Look your course up on ASSIST.org ' +
          'before you take it, not after.',
        provenance: UC_CREDIT,
      },
      {
        text:
          'Courses from the US military can earn UC credit if the content matched a UC ' +
          'course, but never count toward UC’s minimum admission requirements.',
        provenance: UC_CREDIT,
      },
    ],
  },
  {
    system: 'CSU',
    points: [
      {
        text:
          'The CSU can accept a maximum of 70 transferable semester (105 quarter) units from ' +
          'community colleges.',
        provenance: CSU_APPLY,
      },
      {
        text:
          'Ask the CSU campus to evaluate your transferable coursework. Some campuses do this ' +
          'before admission; otherwise they evaluate your official transcripts when you apply.',
        provenance: CSU_APPLY,
      },
      {
        text:
          'Use ASSIST.org to check which lower-division major courses are worth taking before ' +
          'you transfer.',
        provenance: CSU_APPLY,
      },
    ],
  },
];
