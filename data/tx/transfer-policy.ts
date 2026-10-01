import type { Provenance, TransferPolicy } from '../../src/types.ts';

/**
 * How Texas public universities treat courses taken at another Texas public
 * college. Read from the Coordinating Board's own transfer-dispute page, which
 * quotes the statute and rules verbatim; `published` rather than `statute`
 * because the statute itself was not the page opened.
 *
 * The 66-hour figure is a state rule after all — 19 TAC § 4.25(f), read on
 * 2026-10-01 — but a permissive one: the most a university is OBLIGED to accept,
 * not a ban on accepting more. It lives with each campus in institutions.ts.
 */
const THECB_DISPUTE: Provenance = {
  source_url: 'https://www.highered.texas.gov/transfer-dispute/',
  as_of: '2026-09-27',
  confidence: 'published',
};

const THECB_OVERVIEW: Provenance = {
  source_url:
    'https://reportcenter.highered.texas.gov/agency-publication/miscellaneous/overview-texas-transfer-initiatives/',
  as_of: '2026-09-27',
  confidence: 'published',
  note: 'A Coordinating Board overview dated February 2017. The mechanism is statutory; ' +
    'the programme details it lists may have moved since.',
};

export const texasTransferPolicies: TransferPolicy[] = [
  {
    system: 'TX-PUBLIC',
    points: [
      {
        text:
          'Finish the 42-hour core curriculum at any Texas public college and it transfers as ' +
          'a block: the university must accept it in place of its own core, and cannot make you ' +
          'take more core courses (Texas Education Code 61.822).',
        provenance: THECB_DISPUTE,
      },
      {
        text:
          'Transfer before finishing the core and you still get credit for each core course ' +
          'you completed.',
        provenance: THECB_OVERVIEW,
      },
      {
        text:
          'If a university denies credit for a core or Field of Study course, it must tell you ' +
          'why in writing. You can appeal at the university, then to the Commissioner of Higher ' +
          'Education, who decides within 20 business days.',
        provenance: THECB_DISPUTE,
      },
      {
        text:
          'Credit from a third-party course provider is not protected, even if a community ' +
          'college already counted it. In 2025 the Coordinating Board upheld a university’s ' +
          'refusal of exactly that.',
        provenance: THECB_DISPUTE,
      },
    ],
  },
];
