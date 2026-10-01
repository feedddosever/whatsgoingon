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

const provider = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'published',
  note: note + ' The price is the provider\u2019s own; whether YOUR college accepts the credit is ' +
    'a separate question \u2014 check its transfer policy before you buy anything.',
});

export const altCreditSources: CreditSource[] = [
  {
    id: 'alt-sophia',
    kind: 'alt_provider',
    name: 'Sophia Learning \u2014 one month, unlimited courses',
    cost_usd: 99,
    recognition: 'ace',
    transcript_provider: 'Sophia Learning',
    provenance: provider('https://www.sophia.org/plans-and-pricing/',
      '$99 a month with no cap on how many courses you finish in that month (two at a time), ' +
      'no proctored exams, ACE-recommended. Widely used to fill general education at the ' +
      '"Big 3".'),
  },
  {
    id: 'alt-studycom',
    kind: 'alt_provider',
    name: 'Study.com College Saver \u2014 one month',
    cost_usd: 95,
    recognition: 'ace_and_nccrs',
    transcript_provider: 'Study.com',
    provenance: provider('https://study.com/college/faq.html',
      '$95 a month. The only row here carrying BOTH ACE and NCCRS recommendations, which ' +
      'widens the set of colleges that may take it. Final exams are open-book and unproctored.'),
  },
  {
    id: 'alt-straighterline',
    kind: 'alt_provider',
    name: 'StraighterLine \u2014 one month plus one course',
    cost_usd: 178,
    recognition: 'ace',
    transcript_provider: 'StraighterLine',
    provenance: provider('https://www.straighterline.com/pricing/',
      'Priced differently from the others: $99 a month plus a per-course fee of $69\u2013$249 ' +
      '(about $79 for most). Flat plans \u2014 $699 for four months or $1,499 a year, no ' +
      'per-course fees \u2014 are cheaper if you take many. Finals run in a lockdown browser.'),
  },
  {
    id: 'alt-saylor',
    kind: 'alt_provider',
    name: 'Saylor Academy course \u2014 free, $5 to sit the exam',
    cost_usd: 5,
    recognition: 'ace',
    transcript_provider: 'Saylor Academy',
    provenance: provider('https://www.saylor.org/TuitionFees',
      'A non-profit. The courses are free; each proctored final attempt costs $5, up to three ' +
      'attempts. ACE-recommended (it left NCCRS in December 2023). The cheapest credit in this ' +
      'dataset by a wide margin.'),
  },
  {
    id: 'alt-teex',
    kind: 'alt_provider',
    name: 'TEEX course \u2014 free, ACE-recommended',
    cost_usd: 0,
    recognition: 'ace',
    transcript_provider: 'Texas A&M Engineering Extension Service',
    provenance: provider('https://teex.org/resources/earn-college-credit/',
      'Texas A&M Engineering Extension Service online courses are free (DHS/FEMA-funded) and ' +
      'ACE-reviewed. Genuinely free, and genuinely narrow \u2014 the subject range is small, so ' +
      'it fills gaps rather than a degree.'),
  },
  {
    id: 'alt-modern-states',
    kind: 'alt_provider',
    name: 'Modern States \u2014 free CLEP course and exam voucher',
    cost_usd: 0,
    recognition: 'none',
    transcript_provider: 'none \u2014 it pays for a CLEP exam instead',
    provenance: {
      source_url: 'https://modernstates.org/faq/',
      as_of: '2026-10-01',
      confidence: 'published',
      note:
        'The odd one out, and the best deal here. Modern States issues no credit itself: it ' +
        'gives you a free preparation course and, once you average 75% on its quizzes and ' +
        'final, a voucher covering the $97 CLEP fee and the $30 remote-proctoring fee (a ' +
        'test-centre fee is reimbursed if you claim within a year). So the credit arrives as ' +
        'CLEP and is judged by your college\u2019s CLEP policy rather than by any third-party ' +
        'transcript rule \u2014 which is why it works in places Sophia and Study.com do not.',
    },
  },
];
