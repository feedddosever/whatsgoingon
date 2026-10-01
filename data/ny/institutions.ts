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
    'the most common rule among the campuses we read, but some ask for 36 to 45, and we have ' +
    'not read this campus’s rule. Confirm with the registrar.',
};

const UNCONFIRMED_CAP: Provenance = {
  source_url: '',
  as_of: '',
  confidence: 'needs_check',
  note:
    'We have not read this campus’s limit on transfer credit. Campuses we did read range ' +
    'from no set maximum (Baruch, Queens, City Tech) down to 60 credits from a two-year ' +
    'college (SUNY Oswego). Ask yours.',
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

/** A figure seen only in a search snippet, or contradicted by another page on the same site. */
const unsettled = (source_url: string, note: string): Provenance => ({
  source_url, as_of: '2026-10-01', confidence: 'needs_check', note,
});

export const newYorkInstitutions: Institution[] = [
  // ---- SUNY --------------------------------------------------------------
  make('SUNY', 'u-buffalo', 'University at Buffalo', {
    residency: [30, page(
      'https://www.buffalo.edu/registrar/degree-conferral/undergraduate-degree-application-conferral.html',
      '120 credits for a bachelor’s, 30 of which must be completed at UB.',
    )],
    cap: [null, unsettled(
      'https://catalogs.buffalo.edu/content.php?catoid=11&navoid=571',
      'The catalog we read (2024-25, archived) states no maximum on transfer credit, and UB ' +
      'admissions says it accepts all college-level credit from accredited colleges. The ' +
      'current catalog was not read.',
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
    residency: [44, page(
      'https://www.binghamton.edu/harpur/advising/transfer-credit/policies.html',
      '44 credits in residence for a Harpur College (arts and sciences) degree. The School of ' +
      'Management asks for 40.',
    )],
    exam: withNote({ ...SUNY_EXAM, source_url: 'https://www.binghamton.edu/harpur/advising/transfer-credit/clep.html' },
      'Binghamton (Harpur College) awards CLEP credit for subject exams only, never the general ' +
      'exams such as Humanities; gives no writing credit for any exam; and does not let CLEP ' +
      'fill the World Language requirement. At most 32 exam credits from all sources.'),
  }),
  make('SUNY', 'u-albany', 'University at Albany', {
    residency: [30, page(
      'https://www.albany.edu/undergraduate-bulletin/requirements-for-bachelors-degree.php',
      'At least 30 of the last 60 graduation credits at Albany. Exam credit does not count.',
    )],
    cap: [90, page(
      'https://www.albany.edu/undergraduate-bulletin/requirements-for-bachelors-degree.php',
      'At most 90 transfer credits; Albany no longer distinguishes two-year from four-year ' +
      'colleges.',
    )],
    exam: withNote({ ...SUNY_EXAM, source_url: 'https://www.albany.edu/undergraduate-education/students/credit-prior-learning' },
      'At Albany, AP Biology, US History and European History need a 5 for a named course; a ' +
      '3 or 4 earns elective credit only.'),
  }),
  make('SUNY', 'suny-geneseo', 'SUNY Geneseo', {
    residency: [30, page(
      'https://www.geneseo.edu/registrar/graduation/',
      'At least 30 credits in residence at Geneseo.',
    )],
    cap: [64, page(
      'https://www.geneseo.edu/registrar/graduation/',
      'For students entering fall 2025 or later: at most 64 credits from two-year colleges ' +
      '(plus up to 15 upper-level major credits), 90 from four-year. The admissions page ' +
      'still says 60; the registrar’s rule is the one the degree audit uses.',
    )],
  }),
  make('SUNY', 'suny-new-paltz', 'SUNY New Paltz', {
    residency: [30, page(
      'https://catalog.newpaltz.edu/undergraduate/degree-requirements/',
      'At least 30 credits in residence; transfer and exam credit do not count toward it.',
    )],
    cap: [70, page(
      'https://catalog.newpaltz.edu/undergraduate/academic-policies/transfer-credits/',
      'At most 70 credits from a two-year college and 90 from a four-year one.',
    )],
  }),
  make('SUNY', 'suny-oswego', 'SUNY Oswego', {
    residency: [30, unsettled(
      'https://catalog.oswego.edu/content.php?catoid=65&navoid=9008',
      'A minimum of 30 credit hours at Oswego — seen in a search snippet of the catalog; the ' +
      'page itself did not load.',
    )],
    cap: [60, unsettled(
      'https://ww1.oswego.edu/extended-learning/prior-learning-assessmentcredits-prior-learning',
      'Two Oswego pages say 60 credits from a two-year college; the admissions FAQ says 90 ' +
      'from any college. We use the lower figure until the registrar settles it.',
    )],
  }),
  make('SUNY', 'suny-cortland', 'SUNY Cortland', {
    residency: [30, page(
      'https://www2.cortland.edu/offices/advisement-and-transition/transfer-credit-services/new-students/transfer-credit-policies.dot',
      'At least 30 credits at Cortland, plus half the major and half any minor.',
    )],
    cap: [64, page(
      'https://www2.cortland.edu/offices/advisement-and-transition/transfer-credit-services/new-students/transfer-credit-policies.dot',
      'At most 64 credits from two-year colleges, exam credit included; 90 in total.',
    )],
  }),
  make('SUNY', 'suny-oneonta', 'SUNY Oneonta', {
    residency: [45, unsettled(
      'https://catalog.oneonta.edu/content.php?catoid=29&navoid=1836',
      '45 credits in residence, 30 of them among the last 60 — seen in a search snippet of the ' +
      'catalog; the page itself did not load.',
    )],
    cap: [75, page(
      'https://suny.oneonta.edu/admissions/transfer',
      'At most 75 credits from an accredited institution.',
    )],
  }),
  make('SUNY', 'suny-plattsburgh', 'SUNY Plattsburgh', {
    residency: [36, page(
      'https://catalog.plattsburgh.edu/content.php?catoid=18&navoid=3466',
      'At least 36 credits through Plattsburgh coursework, and 30 of the last 36. Exam credit ' +
      'does not count.',
    )],
    cap: [67, page(
      'https://www.plattsburgh.edu/admissions/transfer/transferring-credit.html',
      'Up to 67 transfer credits from two-year colleges (84 in total).',
    )],
  }),
  make('SUNY', 'suny-brockport', 'SUNY Brockport', {
    residency: [30, page(
      'https://www.brockport.edu/live/profiles/5376-residency-requirement-policy',
      'At least 30 credits at Brockport, 12 of them among the last 30.',
    )],
    cap: [64, page(
      'https://www.brockport.edu/academics/catalogs/degrees/',
      'At most 64 credits from a two-year college, 90 in total. One admissions page says 75; ' +
      'the catalog and the college’s policy both say 64.',
    )],
  }),
  make('SUNY', 'buffalo-state', 'Buffalo State University', {
    residency: [32, page(
      'https://undergraduate.catalog.buffalostate.edu/gened',
      'At least 32 credits at Buffalo State, including the last 16.',
    )],
    cap: [66, page(
      'https://undergraduate.catalog.buffalostate.edu/about/policies',
      'At most 66 credits from associate-degree programs, 90 in total.',
    )],
  }),
  make('SUNY', 'farmingdale-state', 'Farmingdale State College', {
    residency: [30, page(
      'https://www.farmingdale.edu/policies/?pid=214166',
      'At least 30 of the last 60 credits at Farmingdale, 15 of them in the major.',
    )],
  }),
  make('SUNY', 'purchase-college', 'Purchase College', {
    cap: [75, page(
      'https://www.purchase.edu/live/blurbs/2159-transfer-credit',
      'BA and BS programs: at most 75 lower-level credits, 90 in total. Several BFA and MusB ' +
      'programs accept far less — Dance, Acting and Film take at most 36 general-education ' +
      'credits.',
    )],
  }),
  make('SUNY', 'suny-esf', 'SUNY College of Environmental Science and Forestry', {
    residency: [30, page(
      'https://www.esf.edu/catalog/current/policies.php',
      'At least 30 credits at ESF.',
    )],
    cap: [90, page(
      'https://www.esf.edu/catalog/current/policies.php',
      'At most 90 transfer credits toward a bachelor’s.',
    )],
  }),
  make('SUNY', 'suny-poly', 'SUNY Polytechnic Institute', {
    residency: [30, page(
      'https://webapp.sunypoly.edu/undergrad-catalog-2026-2027/academic-requirements-policies/residency-requirements/',
      'At least 30 credits at SUNY Poly, 12 of them in the major.',
    )],
    cap: [76, unsettled(
      'https://connect.sunypoly.edu/portal/MVCC_office_portal',
      '76 lower-division credits plus up to 18 upper-division — seen in a search snippet of a ' +
      'transfer-partner page, not the catalog.',
    )],
  }),
  make('SUNY', 'suny-fredonia', 'SUNY Fredonia', {
    residency: [45, page(
      'https://fredonia.smartcatalogiq.com/2025-2026/catalog/academic-policies/transfer-credit',
      '45 credits in residence at Fredonia.',
    )],
    cap: [66, page(
      'https://fredonia.smartcatalogiq.com/2025-2026/catalog/academic-policies/transfer-credit',
      'Entering fall 2023 or later: at most 66 lower-division transfer credits, plus 9 ' +
      'upper-division.',
    )],
  }),
  make('SUNY', 'suny-empire-state', 'SUNY Empire State University', {
    residency: [30, page(
      'https://catalog.sunyempire.edu/undergraduate/academic-policies-procedures/degree-credit-residency-policy/',
      'At least 30 credits at SUNY Empire for a bachelor’s.',
    )],
    cap: [90, page(
      'https://catalog.sunyempire.edu/undergraduate/transfer-credit/',
      'Up to 90–93 credits of advanced standing, depending on the degree; we use 90.',
    )],
  }),

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
  make('CUNY', 'brooklyn-college', 'Brooklyn College', {
    residency: [30, page(
      'https://www.brooklyn.edu/admissions-aid/transfer/how-to-apply/requirements-and-deadlines/',
      'At least 30 credits at Brooklyn College, including 15 advanced credits in the major.',
    )],
  }),
  make('CUNY', 'queens-college', 'Queens College', {
    residency: [30, page(
      'https://qc-undergraduate.catalog.cuny.edu/academics/curriculum',
      'At least 30 credits in residence. A 2025 advising page says 45 if you transfer in 75 ' +
      'credits or fewer — ask the registrar which applies to you.',
    )],
    cap: [null, page(
      'https://www.qc.cuny.edu/admissions/tce/',
      'No cap on the number of transfer credits awarded.',
    )],
  }),
  make('CUNY', 'city-college-ny', 'The City College of New York', {
    residency: [30, page(
      'https://www.ccny.cuny.edu/advising/degree-information',
      'At least 30 credits at City College, and 60% of the major.',
    )],
    cap: [90, unsettled(
      'https://www.ccny.cuny.edu/admissions/undergraduate-transfer-credit-evaluations',
      'At most 90 transfer credits wherever you studied — seen in a search snippet of this ' +
      'page; the answer sits in a collapsed FAQ we could not read.',
    )],
    exam: withNote({ ...CUNY_EXAM, source_url: 'https://www.ccny.cuny.edu/admissions/college-level-examination-program-clep-equivalencies-guidelines' },
      'City College designates only two CLEP exams for Pathways — College Composition and ' +
      'American Literature (US Experience); every other CLEP exam is elective credit. At most ' +
      '32 credits from exams and pre-college work combined.'),
  }),
  make('CUNY', 'john-jay', 'John Jay College of Criminal Justice', {
    residency: [30, page(
      'https://www.jjay.cuny.edu/admissions/undergraduate-admissions/apply/transfer-students/transfer-advanced-standing-credits',
      'At least 30 credits at John Jay, including half the major.',
    )],
  }),
  make('CUNY', 'lehman', 'Lehman College', {
    residency: [30, page(
      'https://lehman-undergraduate.catalog.cuny.edu/academic-services-and-policies/academic-policies/transfer-credit',
      'At least 30 credits at Lehman, plus half the major or program.',
    )],
    cap: [70, page(
      'https://lehman-undergraduate.catalog.cuny.edu/academic-services-and-policies/academic-policies/epermit',
      'At most 70 credits from community colleges.',
    )],
    exam: withNote({ ...CUNY_EXAM, source_url: 'https://www.lehman.edu/admissions/alternative-credit-options/' },
      'Lehman exempts you from a course only for an AP 4 or 5, and does not accept CLEP for ' +
      'the foreign-language requirement.'),
  }),
  make('CUNY', 'college-staten-island', 'College of Staten Island', {
    residency: [30, page(
      'https://www.csi.cuny.edu/students/registrar/frequently-asked-questions',
      'At least 30 credits at CSI, plus half the major.',
    )],
    cap: [90, page(
      'https://www.csi.cuny.edu/students/registrar/frequently-asked-questions',
      'At most 90 transfer credits.',
    )],
  }),
  make('CUNY', 'city-tech', 'New York City College of Technology', {
    residency: [30, page(
      'https://citytech.catalog.cuny.edu/academic-policies/degree-reqs',
      'At least 30 credits in residence, 15 of them required courses in the major.',
    )],
    cap: [null, page(
      'https://www.citytech.cuny.edu/transfer/tce-faqs.aspx',
      'No limit on the number of credits that may be transferred.',
    )],
    exam: withNote({ ...CUNY_EXAM, source_url: 'https://www.citytech.cuny.edu/transfer/tce-faqs.aspx' },
      'City Tech does not accept CLEP for lab sciences or math courses.'),
  }),
  make('CUNY', 'york-college-cuny', 'York College', {
    residency: [40, page(
      'https://york-undergraduate.catalog.cuny.edu/acpoliciesandregs/gradreqs',
      'At least 40 credits in residence at York, plus half the major.',
    )],
    cap: [68, page(
      'https://york-undergraduate.catalog.cuny.edu/admissions/transfer',
      'At most 68 credits from a non-CUNY two-year college and 80 from a non-CUNY senior ' +
      'college. No figure is printed for CUNY community colleges.',
    )],
    exam: withNote({ ...CUNY_EXAM, source_url: 'https://york-undergraduate.catalog.cuny.edu/admissions/transfer' },
      'York credits exams that test specific subjects rather than general knowledge — which ' +
      'reads as no credit for CLEP’s general exams — and at most 16 exam credits (20 for ' +
      'nursing).'),
  }),
  make('CUNY', 'medgar-evers', 'Medgar Evers College', {
    residency: [30, page(
      'https://mec.catalog.cuny.edu/academic-requirements-regulations-policies/academic-residency-requirements',
      'At least 30 credits at Medgar Evers, 25 of them in the major.',
    )],
    cap: [90, page(
      'https://mec.catalog.cuny.edu/admission-to-the-college/transfer-of-credits',
      'At most 90 credits toward a bachelor’s.',
    )],
  }),
  make('CUNY', 'cuny-sps', 'CUNY School of Professional Studies', {
    residency: [15, page(
      'https://sps.cuny.edu/admissions/undergraduate-admission/transfer-credit',
      'At least 15 credits at CUNY SPS. Some programs, such as the nursing BS, ask for more.',
    )],
    cap: [105, page(
      'https://sps.cuny.edu/admissions/undergraduate-admission/transfer-credit',
      'Up to 105 credits from accredited colleges, exams, credentials and portfolio assessment.',
    )],
  }),
];
