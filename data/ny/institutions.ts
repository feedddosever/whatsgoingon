import type { Institution, Provenance } from '../../src/types.ts';

/**
 * New York's public four-year campuses: SUNY's state-operated campuses and
 * CUNY's senior and comprehensive colleges.
 *
 * Prices are the systems' own published per-credit rates, which is the right
 * shape of number here: both charge per credit part-time and a flat semester
 * rate from 12 credits. Neither system sets a residency requirement or a
 * transfer cap — each campus does — so those fields are read campus by campus
 * where we opened the page, and marked unconfirmed everywhere else.
 */

const SUNY_COST: Provenance = {
  source_url: 'https://www.suny.edu/sunypp/documents.cfm?doc_id=74',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'SUNY state-operated campuses, resident undergraduate: $295 a credit, or $3,535 a ' +
    'semester full-time, frozen for 2026-27. Campus fees ($1,350–$3,970 a year) are extra ' +
    'and excluded, so the real cost of a credit is higher than this.',
};

const CUNY_COST: Provenance = {
  source_url: 'https://www.cuny.edu/financial-aid/tuition-and-college-costs/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CUNY senior colleges, New York State resident: $305 a credit part-time, $3,465 a ' +
    'semester full-time. College fees are extra and excluded.',
};

/**
 * SUNY Policy 1300 is a floor on CREDIT, not a map to requirements: an AP 3 or a
 * CLEP subject exam at the C-level score is credit at every SUNY campus, but
 * which course or GE area it fills is the campus's decision.
 */
const SUNY_EXAM: Provenance = {
  source_url: 'https://www.suny.edu/sunypp/documents.cfm?doc_id=163',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'SUNY Policy 1300: at least 30 credits from AP (score 3+) and CLEP subject exams count ' +
    'toward a degree at any SUNY campus. CLEP’s general exams carry no such guarantee. ' +
    'Which requirement the credit fills is set by each campus — and at the larger campuses ' +
    'an AP 3 often earns elective credit only. Exam credit never counts toward residency.',
};

const CUNY_EXAM: Provenance = {
  source_url: 'https://www.cuny.edu/academics/academic-policy/credit-prior-learning/',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'CUNY Policy 1.21: every CUNY college shall award credit for an AP score of 3 or higher ' +
    'and a CLEP score of 50 or higher, and may not award credit below those. Which Pathways ' +
    'area the credit fills is designated by each college, and an AP credit can only count ' +
    'toward the Common Core with a 3 or higher. Exam credit does not count toward residency.',
};

const withNote = (p: Provenance, extra: string): Provenance => ({ ...p, note: `${extra} ${p.note ?? ''}`.trim() });

const UNCONFIRMED_RESIDENCY: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'Neither SUNY nor CUNY sets a systemwide residency rule; each campus does. 30 credits is ' +
    'what the campuses we read ask for, but we have not read this campus’s rule. Confirm ' +
    'with the registrar.',
};

const UNCONFIRMED_CAP: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'We have not read this campus’s limit on transfer credit. Campuses we did read range ' +
    'from no set maximum (Baruch) to 67 from a two-year college (SUNY Plattsburgh). Ask yours.',
};

interface Known {
  residency?: [number, Provenance];
  cap?: [number | null, Provenance];
  exam?: Provenance;
}

const make = (
  system: 'SUNY' | 'CUNY',
  id: string,
  name: string,
  known: Known = {},
): Institution => ({
  id,
  name,
  system,
  cost_per_unit_usd: system === 'SUNY' ? 295 : 305,
  cost_provenance: system === 'SUNY' ? SUNY_COST : CUNY_COST,
  residency_min_units: known.residency?.[0] ?? 30,
  residency_provenance: known.residency?.[1] ?? UNCONFIRMED_RESIDENCY,
  max_transfer_units: known.cap === undefined ? null : known.cap[0],
  transfer_cap_provenance: known.cap?.[1] ?? UNCONFIRMED_CAP,
  refuses: [],
  exam_policy_provenance: known.exam ?? (system === 'SUNY' ? SUNY_EXAM : CUNY_EXAM),
});

const page = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'published', note,
});

export const newYorkInstitutions: Institution[] = [
  // ---- SUNY --------------------------------------------------------------
  make('SUNY', 'u-buffalo', 'University at Buffalo', {
    residency: [30, page(
      'https://www.buffalo.edu/registrar/degree-conferral/undergraduate-degree-application-conferral.html',
      '120 credits for a bachelor’s, 30 of which must be completed at UB.',
    )],
  }),
  make('SUNY', 'stony-brook', 'Stony Brook University', {
    residency: [36, page(
      'https://www.stonybrook.edu/credit-eval/policies.html',
      'After reaching junior status (57 credits), at least 36 credits must be completed at ' +
      'Stony Brook.',
    )],
    cap: [84, page(
      'https://www.stonybrook.edu/credit-eval/policies.html',
      'Up to 84 credits of transfer coursework and test credit together count toward a ' +
      'bachelor’s, of which no more than 30 by examination.',
    )],
    exam: withNote(SUNY_EXAM,
      'Stony Brook awards credit for CLEP SUBJECT exams only — not the general exams such as ' +
      'Humanities, College Composition or Natural Sciences.'),
  }),
  make('SUNY', 'binghamton', 'Binghamton University', {
    exam: withNote({ ...SUNY_EXAM, source_url: 'https://www.binghamton.edu/harpur/advising/transfer-credit/clep.html' },
      'Binghamton (Harpur College) awards CLEP credit for subject exams only, never the general ' +
      'exams such as Humanities; gives no writing credit for any exam; and does not let CLEP ' +
      'fill the World Language requirement. At most 32 exam credits from all sources.'),
  }),
  make('SUNY', 'u-albany', 'University at Albany'),
  make('SUNY', 'suny-geneseo', 'SUNY Geneseo'),
  make('SUNY', 'suny-new-paltz', 'SUNY New Paltz'),
  make('SUNY', 'suny-oswego', 'SUNY Oswego'),
  make('SUNY', 'suny-cortland', 'SUNY Cortland'),
  make('SUNY', 'suny-oneonta', 'SUNY Oneonta'),
  make('SUNY', 'suny-plattsburgh', 'SUNY Plattsburgh', {
    cap: [67, page(
      'https://www.plattsburgh.edu/admissions/transfer/transferring-credit.html',
      'Up to 67 transfer credits from two-year colleges (84 in total).',
    )],
  }),
  make('SUNY', 'suny-brockport', 'SUNY Brockport'),
  make('SUNY', 'buffalo-state', 'Buffalo State University'),
  make('SUNY', 'farmingdale-state', 'Farmingdale State College'),
  make('SUNY', 'purchase-college', 'Purchase College'),
  make('SUNY', 'suny-esf', 'SUNY College of Environmental Science and Forestry'),
  make('SUNY', 'suny-poly', 'SUNY Polytechnic Institute'),
  make('SUNY', 'suny-fredonia', 'SUNY Fredonia'),
  make('SUNY', 'suny-empire-state', 'SUNY Empire State University'),

  // ---- CUNY --------------------------------------------------------------
  make('CUNY', 'baruch', 'Baruch College', {
    residency: [31, page(
      'https://enrollmentmanagement.baruch.cuny.edu/undergraduate-admissions/transferstudents/',
      'At least 31 credits must be taken at Baruch for a bachelor’s.',
    )],
    cap: [null, page(
      'https://enrollmentmanagement.baruch.cuny.edu/undergraduate-admissions/transferstudents/',
      'No set limit on the total number of credits awarded for prior coursework.',
    )],
    exam: withNote({ ...CUNY_EXAM, source_url: 'https://enrollmentmanagement.baruch.cuny.edu/undergraduate-admissions/how-credits-transfer/' },
      'At Baruch, since fall 2018 an AP score of 3 earns elective credit only; a 4 or 5 is ' +
      'needed for a course equivalent.'),
  }),
  make('CUNY', 'hunter', 'Hunter College', {
    residency: [30, page(
      'https://www.hunter.cuny.edu/students/admissions/undergraduate/apply/transfer/transfer-credit-policy/',
      'At least 30 credits in residence at Hunter, plus half the credits of the major and minor.',
    )],
    cap: [70, page(
      'https://www.hunter.cuny.edu/students/admissions/undergraduate/apply/transfer/transfer-credit-policy/',
      'At most 70 credits from associate-degree colleges (90 from bachelor’s-degree colleges).',
    )],
  }),
  make('CUNY', 'brooklyn-college', 'Brooklyn College'),
  make('CUNY', 'queens-college', 'Queens College'),
  make('CUNY', 'city-college-ny', 'The City College of New York'),
  make('CUNY', 'john-jay', 'John Jay College of Criminal Justice'),
  make('CUNY', 'lehman', 'Lehman College'),
  make('CUNY', 'college-staten-island', 'College of Staten Island'),
  make('CUNY', 'city-tech', 'New York City College of Technology'),
  make('CUNY', 'york-college-cuny', 'York College'),
  make('CUNY', 'medgar-evers', 'Medgar Evers College'),
  make('CUNY', 'cuny-sps', 'CUNY School of Professional Studies'),
];
