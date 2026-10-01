import type { Provenance, TransferPolicy } from '../../src/types.ts';

/**
 * How PASSHE universities treat courses taken at another college. Board Policy
 * 1999-01-A and Procedure 2022-54 were read on the system's own site.
 */
const POLICY_1999_01_A: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/BOG_Policies/Policy%201999-01-A.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
};

const PROCEDURE_2022_54: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/2022-54%20Student%20Transfer.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
};

export const pennsylvaniaTransferPolicies: TransferPolicy[] = [
  {
    system: 'PASSHE',
    points: [
      {
        text:
          'Transfer from a Pennsylvania community college with an associate degree and admission ' +
          'to a State System university is guaranteed, subject to capacity.',
        provenance: POLICY_1999_01_A,
      },
      {
        text:
          'With an associate in arts or science in a parallel or statewide program-to-program ' +
          'major, you get full junior standing and will not have to complete more than 60 further ' +
          'credits for a 120-credit degree.',
        provenance: POLICY_1999_01_A,
      },
      {
        text:
          '30 credits aligned with the statewide 30-Credit Transfer Framework complete general ' +
          'education, except a signature course, a course your major prescribes, or requirements ' +
          'built into advanced major courses.',
        provenance: PROCEDURE_2022_54,
      },
      {
        text:
          'Credit from an accredited college cannot be rejected for its grade, for having no ' +
          'equivalent course, or for being taken online.',
        provenance: PROCEDURE_2022_54,
      },
    ],
  },
];
