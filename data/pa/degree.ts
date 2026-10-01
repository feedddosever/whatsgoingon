import type { Provenance, SystemDegree } from '../../src/types.ts';

/** What a PASSHE bachelor's degree is made of, beyond general education. */

const POLICY_1999_01_A: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/BOG_Policies/Policy%201999-01-A.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
};

const RESIDENCY: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/PS%202016-24-A%20Graduation%20Residency%20Requirements.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
};

const PROCEDURE_2022_54: Provenance = {
  source_url: 'https://www.passhe.edu/policies/documents/Policies_Procedures_Standards/2022-54%20Student%20Transfer.pdf',
  as_of: '2026-10-01',
  confidence: 'published',
};

export const pennsylvaniaDegrees: SystemDegree[] = [
  {
    system: 'PASSHE',
    total_units: 120,
    rules: [
      {
        id: 'passhe-total',
        block: 'total',
        title: 'Total credits',
        text: 'A PASSHE bachelor’s is a 120-credit degree.',
        provenance: POLICY_1999_01_A,
      },
      {
        id: 'passhe-ge',
        block: 'ge',
        title: 'General education',
        text:
          'Set by each university, but 30 credits aligned with the statewide 30-Credit Transfer ' +
          'Framework complete it for a transfer student.',
        provenance: PROCEDURE_2022_54,
      },
      {
        id: 'passhe-residency',
        block: 'residency',
        title: 'Credit earned at your university',
        text:
          'At least 30 of your last 60 credits at the university granting the degree — and it ' +
          'may not ask for more than 30.',
        provenance: RESIDENCY,
      },
      {
        id: 'passhe-major-half',
        block: 'graduation',
        title: 'Half the major in the State System',
        text: 'At least half the credits of your major must come from a State System university.',
        provenance: RESIDENCY,
      },
    ],
  },
];
