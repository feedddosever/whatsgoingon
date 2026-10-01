import type { Provenance, TransferPolicy } from '../../src/types.ts';

/**
 * How SUNY and CUNY treat courses taken at another college. Every sentence was
 * read on the system's own page on the as_of date.
 */
const SUNY_POLICIES: Provenance = {
  source_url: 'https://www.suny.edu/attend/get-started/transfer-students/suny-transfer-policies/',
  as_of: '2026-10-01',
  confidence: 'published',
};

const SUNY_1007: Provenance = {
  source_url: 'https://www.suny.edu/sunypp/documents.cfm?doc_id=37',
  as_of: '2026-10-01',
  confidence: 'published',
};

const SUNY_SEAMLESS: Provenance = {
  source_url: 'https://transfer.suny.edu/students/seamless-transfer/',
  as_of: '2026-10-01',
  confidence: 'published',
};

const CUNY_TRANSFER: Provenance = {
  source_url: 'https://www.cuny.edu/about/administration/offices/undergraduate-studies/pathways/credits-tranfer/',
  as_of: '2026-10-01',
  confidence: 'published',
};

export const newYorkTransferPolicies: TransferPolicy[] = [
  {
    system: 'SUNY',
    points: [
      {
        text:
          'Graduate from a SUNY community college with an AA or AS and transfer directly, and you ' +
          'are guaranteed admission to a SUNY four-year campus — a campus, not the one of your ' +
          'choice.',
        provenance: SUNY_POLICIES,
      },
      {
        text:
          'Accepted into a parallel program, an AA or AS graduate gets full junior standing, full ' +
          'credit for general education, and the chance to finish in four more full-time semesters.',
        provenance: SUNY_1007,
      },
      {
        text:
          'General education completed at one SUNY campus meets the same requirement at every ' +
          'other SUNY campus, and approved Transfer Path courses passed with a C or better count ' +
          'toward the major — not just as electives.',
        provenance: SUNY_SEAMLESS,
      },
    ],
  },
  {
    system: 'CUNY',
    points: [
      {
        text:
          'Transfer to a CUNY college with an associate in arts, associate in science or ' +
          'bachelor’s from any regionally accredited college, and the Pathways Common Core ' +
          'counts as complete.',
        provenance: CUNY_TRANSFER,
      },
      {
        text:
          'A Common Core requirement met at one CUNY college counts as met at any other, and ' +
          'courses passed for credit at one CUNY college transfer for credit to every other.',
        provenance: CUNY_TRANSFER,
      },
      {
        text:
          'Bachelor’s students also owe College Option credits on top of the Common Core: 6 if ' +
          'you transfer with an associate degree, 9 with more than 30 credits, 12 with 30 or fewer.',
        provenance: CUNY_TRANSFER,
      },
    ],
  },
];
