import type { CreditSource, Provenance } from '../../src/types.ts';

/**
 * Third-party credit providers — the cheapest college credit in America, and
 * the easiest to waste money on.
 *
 * Every row here posts its credit to the PROVIDER's transcript, not a
 * college's. So a receiving institution is not asking "is this course good
 * enough?" — it is asking "do we accept this company's paperwork?", and a great
 * many answer no. The University of California answers no in writing, for all
 * of them.
 *
 * ACE and NCCRS review these courses and RECOMMEND credit. Neither is an
 * accreditor and neither can compel anyone. "ACE recommended" read as "counts
 * everywhere" is the single most expensive misunderstanding in this category,
 * which is why `recognition` is carried as data and shown next to the price
 * rather than buried in a note.
 *
 * Prices are monthly subscriptions in most cases, so the real cost depends on
 * how fast the student works — a figure this app cannot know. Each row prices
 * ONE month, and says so.
 */

const DEGREEFORUM: Provenance = {
  source_url: 'https://degreeforum.miraheze.org/wiki/Several_Sources_Of_Cheap_Credit',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Compiled by the Degree Forum wiki community, which tracks these providers closely ' +
    'but is not the provider and is not your college. Prices change; check the ' +
    'provider’s own page before you subscribe, and check your college’s transfer ' +
    'policy before you buy anything at all.',
};

const FREE: Provenance = {
  source_url: 'https://degreeforum.miraheze.org/wiki/Free_Sources_of_Credit',
  as_of: '2026-09-19',
  confidence: 'needs_check',
  note:
    'Free to take. Not free to USE: most colleges charge a fee to post transfer credit, ' +
    'and many will not accept it at all. Confirm acceptance before you spend the hours.',
};

export const altCreditSources: CreditSource[] = [
  {
    id: 'alt-sophia',
    kind: 'alt_provider',
    name: 'Sophia Learning — one month, unlimited courses',
    cost_usd: 99,
    recognition: 'ace',
    transcript_provider: 'Sophia Learning',
    provenance: {
      ...DEGREEFORUM,
      note:
        '$99/month with no cap on how many courses you finish in that month, and no ' +
        'proctoring fee — which is why a determined student can clear several courses ' +
        'for one month’s subscription. Widely used to fill general education at the ' +
        '"Big 3". ' + DEGREEFORUM.note,
    },
  },
  {
    id: 'alt-studycom',
    kind: 'alt_provider',
    name: 'Study.com College Saver — one month',
    cost_usd: 95,
    recognition: 'ace_and_nccrs',
    transcript_provider: 'Study.com',
    provenance: {
      ...DEGREEFORUM,
      note:
        'The only row here carrying BOTH ACE and NCCRS recommendations, which widens the ' +
        'set of colleges that may take it. Final exams are open-book, unproctored and ' +
        'graded immediately. ' + DEGREEFORUM.note,
    },
  },
  {
    id: 'alt-straighterline',
    kind: 'alt_provider',
    name: 'StraighterLine — one month plus one course',
    cost_usd: 178,
    recognition: 'ace',
    transcript_provider: 'StraighterLine',
    provenance: {
      ...DEGREEFORUM,
      note:
        'Priced differently from the others: a monthly fee AND a per-course fee (about ' +
        '$99 + $79), so the arithmetic only works if you are taking few courses slowly. ' +
        'Some finals are proctored. Larger partner-school network than the others. ' +
        DEGREEFORUM.note,
    },
  },
  {
    id: 'alt-saylor',
    kind: 'alt_provider',
    name: 'Saylor Academy course — free, $5 to sit the exam',
    cost_usd: 5,
    recognition: 'ace_and_nccrs',
    transcript_provider: 'Saylor Academy',
    provenance: {
      ...FREE,
      note:
        'A non-profit. The courses are free; the proctored final costs about $5. The ' +
        'cheapest credit in this dataset by a wide margin. ' + FREE.note,
    },
  },
  {
    id: 'alt-teex',
    kind: 'alt_provider',
    name: 'TEEX course — free, ACE-recommended',
    cost_usd: 0,
    recognition: 'ace',
    transcript_provider: 'Texas A&M Engineering Extension Service',
    provenance: {
      ...FREE,
      note:
        'Texas A&M Engineering Extension Service offers roughly 10 to 13 credits at no ' +
        'cost \u2014 sources disagree on the total and the catalogue moves \u2014 unproctored, and ' +
        'DHS/FEMA-funded, which is why it is free to the general public and not just to ' +
        'Texans. Genuinely free, and genuinely narrow — the subject range is ' +
        'small, so it fills gaps rather than a degree. ' + FREE.note,
    },
  },
  {
    id: 'alt-modern-states',
    kind: 'alt_provider',
    name: 'Modern States — free CLEP course and exam voucher',
    cost_usd: 0,
    recognition: 'ace',
    transcript_provider: 'none — it pays for a CLEP exam instead',
    provenance: {
      source_url: 'https://modernstates.org/',
      as_of: '2026-09-19',
      confidence: 'needs_check',
      note:
        'The odd one out, and the best deal here. Modern States does not issue credit at ' +
        'all — it gives you a free preparation course and a voucher covering the CLEP ' +
        'exam fee. So the credit arrives as CLEP, on a College Board score report, and is ' +
        'judged by your college’s CLEP policy rather than by any third-party transcript ' +
        'rule. Which means it works in places Sophia and Study.com do not.',
    },
  },
];
