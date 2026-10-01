import type { MajorPrep, MajorPrepGap, Provenance, SystemDegree } from '../../src/types.ts';

/**
 * What a Texas public bachelor's degree is made of, beyond the 42-hour core.
 *
 * Statute rows were read on the as_of date from the statute text itself
 * (Justia / texas.public.law mirrors of the Education Code); the accreditor's
 * rules from SACSCOC's 2024 Principles of Accreditation, which bind every
 * public university in Texas.
 */

const TEC_51_301: Provenance = {
  source_url:
    'https://law.justia.com/codes/texas/education-code/title-3/subtitle-a/chapter-51/subchapter-f/section-51-301/',
  as_of: '2026-09-28',
  confidence: 'statute',
};

const TEC_51_302: Provenance = {
  source_url: 'https://texas.public.law/statutes/tex._educ._code_section_51.302',
  as_of: '2026-09-28',
  confidence: 'statute',
};

const TEC_61_0515: Provenance = {
  source_url:
    'https://law.justia.com/codes/texas/education-code/title-3/subtitle-b/chapter-61/subchapter-c/section-61-0515/',
  as_of: '2026-09-28',
  confidence: 'statute',
  note:
    'Amended by S.B. 530 (2025): a university may not require more than its accreditor’s ' +
    'minimum unless it finds a compelling academic reason.',
};

const SACSCOC: Provenance = {
  source_url: 'https://sacscoc.org/app/uploads/2024/01/2024PrinciplesOfAccreditation.pdf',
  as_of: '2026-09-28',
  confidence: 'published',
  note: 'SACSCOC accredits every public university in Texas and Florida.',
};

const THECB_CORE: Provenance = {
  source_url: 'https://www.highered.texas.gov/transfer-dispute/',
  as_of: '2026-09-27',
  confidence: 'published',
};

const TEXAS_DIRECT: Provenance = {
  source_url: 'https://www.highered.texas.gov/texas-direct/',
  as_of: '2026-09-28',
  confidence: 'published',
};

export const texasDegrees: SystemDegree[] = [
  {
    system: 'TX-PUBLIC',
    total_units: 120,
    rules: [
      {
        id: 'tx-total',
        block: 'total',
        title: 'Total hours',
        text:
          'A university may not require more than its accreditor’s minimum without a ' +
          'compelling academic reason. For every Texas public university that accreditor is ' +
          'SACSCOC, whose minimum for a bachelor’s is 120 semester credit hours.',
        provenance: TEC_61_0515,
      },
      {
        id: 'tx-core',
        block: 'ge',
        title: 'Texas Core Curriculum',
        text:
          '42 semester credit hours. Complete it at any Texas public college and it transfers ' +
          'as a block in place of the university’s own core.',
        provenance: THECB_CORE,
      },
      {
        id: 'tx-residency',
        block: 'residency',
        title: 'Credit earned at the university',
        text:
          'At least 25 percent of the hours for your degree must come from instruction at the ' +
          'university awarding it — 30 hours of a 120-hour degree. That is the floor: UT Austin ' +
          'asks 60, and Texas A&M 36 upper-division hours.',
        provenance: SACSCOC,
      },
      {
        id: 'tx-government',
        block: 'graduation',
        title: 'Government / political science',
        text:
          '6 semester hours covering the U.S. and Texas constitutions. No public college in ' +
          'Texas may award a bachelor’s without it.',
        provenance: TEC_51_301,
      },
      {
        id: 'tx-history',
        block: 'graduation',
        title: 'American history',
        text:
          '6 semester hours of American history, of which up to 3 may be Texas history. Required ' +
          'for any degree from a public college in Texas.',
        provenance: TEC_51_302,
      },
      {
        id: 'tx-fos',
        block: 'major',
        title: 'Field of Study',
        text:
          'Finish a Field of Study and the core at a Texas public college and the courses ' +
          'transfer as a block into your major. Transfer with it half done and each finished ' +
          'course still counts, though the university may add lower-division courses.',
        provenance: TEXAS_DIRECT,
      },
    ],
  },
];

const fos = (path: string, revisedSince: boolean): Provenance => ({
  source_url: `https://reportcenter.highered.texas.gov/${path}/`,
  as_of: '2026-09-28',
  confidence: revisedSince ? 'needs_check' : 'published',
  ...(revisedSince
    ? {
        note:
          'The Coordinating Board lists this Field of Study as revised in August 2026; the ' +
          'courses and campus electives here are from the July 2023 document, the newest we ' +
          'could read.',
      }
    : {}),
});

const FOS = 'Texas Field of Study';

// Course names as the Lower-Division Academic Course Guide Manual words them.
const BUSI_2305 = 'BUSI 2305 Business Statistics';
const BCIS_1305 = 'BCIS 1305 Business Computer Applications';
const MATH_1325 = 'MATH 1325 Calculus for Business & Social Sciences';
const BUSI_2301 = 'BUSI 2301 Business Law';
const MATH_1342 = 'MATH 1342 Elementary Statistical Methods';
const MATH_1314 = 'MATH 1314 College Algebra';
const STATS_AND_APPS = [BUSI_2305, BCIS_1305];

const PSYC = (n: string, name: string): string => `PSYC ${n} ${name}`;
const ABNORMAL = PSYC('2320', 'Abnormal Psychology');
const ADOLESCENT = PSYC('2307', 'Adolescent Psychology');
const CHILD = PSYC('2308', 'Child Psychology');
const PERSONALITY = PSYC('2316', 'Psychology of Personality');
const ADJUSTMENT = PSYC('2315', 'Psychology of Adjustment');
const BIOPSYCH = PSYC('2330', 'Biological Psychology');
const SEXUALITY = PSYC('2306', 'Human Sexuality');

const CHEM_1405 = 'CHEM 1405 Introductory Chemistry I';
const CHEM_1411 = 'CHEM 1411 General Chemistry I';
const ENGL_2311 = 'ENGL 2311 Technical & Business Writing';
const PHIL_2306 = 'PHIL 2306 Introduction to Ethics';
const SOCI_1301 = 'SOCI 1301 Introduction to Sociology';
const BIOL_1406 = 'BIOL 1406 Biology for Science Majors I';

const SOC_PSYCH = 'SOCI 2326 Social Psychology';
const CRIMINOLOGY = 'SOCI 2336 Criminology';
const DRUGS = 'SOCI 2340 Drug Use & Abuse';
const SOC_SEXUALITY = 'SOCI 2306 Human Sexuality';

export const texasMajorPrep: MajorPrep[] = [
  {
    id: 'tx-fos-business',
    systems: ['TX-PUBLIC'],
    fields: ['business'],
    major: 'Business administration (also accounting, finance, marketing)',
    programme: FOS,
    courses: [
      'ECON 2301 Principles of Macroeconomics',
      'MATH 1324 Mathematics for Business & Social Sciences',
      'ECON 2302 Principles of Microeconomics',
      'ACCT 2301 Principles of Financial Accounting',
      'ACCT 2302 Principles of Managerial Accounting',
      'BUSI 1301 Business Principles',
      'Two directed electives chosen by your university (6–8 hours)',
    ],
    campus_extras: {
      'angelo-state': STATS_AND_APPS,
      'lamar': STATS_AND_APPS,
      'midwestern-state': [BCIS_1305, ENGL_2311],
      'prairie-view-am': [BCIS_1305, MATH_1314],
      'sam-houston-state': STATS_AND_APPS,
      'stephen-f-austin': [BUSI_2305, 'BUSI 2304 Business Report Writing & Correspondence'],
      'sul-ross-state': [BCIS_1305, MATH_1325],
      'tarleton-state': STATS_AND_APPS,
      'texas-am-international': [BUSI_2305, MATH_1325],
      'texas-am': STATS_AND_APPS,
      'texas-am-galveston': [BUSI_2305, BCIS_1305, MATH_1325, BUSI_2301],
      'texas-am-commerce': [BCIS_1305, MATH_1325],
      'texas-am-corpus-christi': [BUSI_2305, BCIS_1305, MATH_1325],
      'texas-am-kingsville': STATS_AND_APPS,
      'texas-am-san-antonio': [BUSI_2305, BCIS_1305, BUSI_2301],
      'texas-am-texarkana': [MATH_1325, BCIS_1305, BUSI_2301, MATH_1342],
      'texas-southern': [BUSI_2305, MATH_1325],
      'texas-state': STATS_AND_APPS,
      'texas-tech': [BUSI_2305, MATH_1325],
      'texas-womans': ['BUSI 1307 Personal Finance', MATH_1342],
      'ut-dallas': [MATH_1325, BUSI_2301],
      'ut-el-paso': [BUSI_2305, MATH_1325],
      'ut-tyler': STATS_AND_APPS,
      'ut-rio-grande-valley': STATS_AND_APPS,
      'u-houston': STATS_AND_APPS,
      'u-houston-clear-lake': STATS_AND_APPS,
      'u-houston-downtown': STATS_AND_APPS,
      'u-houston-victoria': [BUSI_2305, BCIS_1305, 'SPCH 1321 Business & Professional Communication'],
      'unt': STATS_AND_APPS,
      'unt-dallas': STATS_AND_APPS,
      'ut-austin': ['MATH 2313 Calculus I', 'MATH 2314 Calculus II'],
      'ut-arlington': STATS_AND_APPS,
      'ut-san-antonio': [BUSI_2305, BCIS_1305, MATH_1325],
      'ut-permian-basin': STATS_AND_APPS,
      'west-texas-am': [BUSI_2305, MATH_1325],
    },
    provenance: fos('training-materials/presentations/revised-field-of-study-for-business-administration', true),
  },
  {
    id: 'tx-fos-psychology',
    systems: ['TX-PUBLIC'],
    fields: ['social_sciences'],
    major: 'Psychology',
    programme: FOS,
    courses: [
      'PSYC 2301 General Psychology',
      'PSYC 2314 Lifespan & Growth Development',
      'PSYC 2317 Statistical Methods in Psychology',
      'PSYC 2319 Social Psychology',
      'Two directed electives chosen by your university (6–8 hours)',
    ],
    campus_extras: {
      'angelo-state': [ABNORMAL, ADOLESCENT, CHILD, PERSONALITY],
      'lamar': [CHILD, ADJUSTMENT],
      'midwestern-state': [BIOPSYCH, SEXUALITY],
      'prairie-view-am': [CHILD, PERSONALITY],
      'sam-houston-state': ['SPCH 1321 Business & Professional Communication', 'PHIL 2303 Introduction to Formal Logic'],
      'stephen-f-austin': [ABNORMAL, BIOPSYCH],
      'sul-ross-state': [SEXUALITY, ADJUSTMENT],
      'tarleton-state': [ABNORMAL, BIOPSYCH],
      'texas-am-international': [ABNORMAL, BIOPSYCH, CHILD, ADJUSTMENT],
      'texas-am': [BIOPSYCH, SEXUALITY],
      'texas-am-commerce': [SEXUALITY, ADJUSTMENT],
      'texas-am-corpus-christi': [ADOLESCENT, CHILD, ADJUSTMENT],
      'texas-am-kingsville': [SEXUALITY, ADOLESCENT, CHILD, ADJUSTMENT],
      'texas-am-san-antonio': [CHILD, ADJUSTMENT],
      'texas-am-texarkana': [ABNORMAL, PERSONALITY],
      'texas-southern': [SEXUALITY, ADJUSTMENT],
      'texas-state': [ABNORMAL, BIOPSYCH],
      'texas-tech': ['ENGL 1301 Composition I', MATH_1314],
      'texas-womans': [ABNORMAL, BIOPSYCH, ADOLESCENT],
      'ut-arlington': [ABNORMAL, SEXUALITY, PERSONALITY],
      'ut-dallas': [SEXUALITY, ADJUSTMENT],
      'ut-el-paso': [ABNORMAL, SEXUALITY, PERSONALITY],
      'ut-san-antonio': [ABNORMAL, BIOPSYCH],
      'ut-tyler': [SEXUALITY, CHILD],
      'ut-permian-basin': [ABNORMAL, SEXUALITY],
      'u-houston': [BIOPSYCH, PERSONALITY],
      'u-houston-clear-lake': [ABNORMAL, BIOPSYCH, SEXUALITY, ADOLESCENT, CHILD, PERSONALITY,
        PSYC('2389', 'Academic Cooperative')],
      'u-houston-downtown': [ABNORMAL, BIOPSYCH],
      'u-houston-victoria': [ABNORMAL, BIOPSYCH],
      'unt': [BIOPSYCH, ADJUSTMENT],
      'unt-dallas': [ABNORMAL, PERSONALITY],
      'west-texas-am': ['ENGL 1301 Composition I', SOCI_1301],
    },
    campus_any: ['ut-rio-grande-valley'],
    note: 'Where a university named fewer than two electives, it takes any course from the state list for the rest.',
    provenance: fos('agency-publication/miscellaneous/revised-fos-psychology-final', false),
  },
  {
    id: 'tx-fos-nursing',
    systems: ['TX-PUBLIC'],
    fields: ['health'],
    major: 'Nursing (BSN)',
    programme: FOS,
    courses: [
      'PSYC 2301 General Psychology',
      'ENGL 1301 Composition I',
      'ENGL 1302 Composition II',
      'MATH 1342 Elementary Statistical Methods',
      'BIOL 2401 Anatomy & Physiology I',
      'BIOL 2402 Anatomy & Physiology II',
      'PSYC 2314 Lifespan Growth & Development',
      'BIOL 2420 Microbiology for Non-Science Majors',
      'BIOL 1322 Nutrition & Diet Therapy',
      'Two directed electives chosen by your university (6–8 hours)',
    ],
    campus_extras: {
      'angelo-state': [ENGL_2311, CHEM_1405],
      'lamar': [CHEM_1405, MATH_1314],
      'sam-houston-state': [CHEM_1411, MATH_1314],
      'stephen-f-austin': [CHEM_1405],
      'sul-ross-state': [ENGL_2311, CHEM_1405],
      'tarleton-state': [ENGL_2311, CHEM_1405],
      'texas-am-international': [MATH_1314, CHEM_1405, CHEM_1411],
      'texas-am': [ENGL_2311, CHEM_1405, PHIL_2306, BIOL_1406, 'BIOL 2421 Microbiology for Science Majors'],
      'texas-am-commerce': [ENGL_2311, CHEM_1405],
      'texas-am-corpus-christi': [CHEM_1405],
      'texas-am-texarkana': [MATH_1314, SOCI_1301],
      'texas-state': ['CHEM 1311 General Chemistry I (lecture)', MATH_1314, 'BIOL 1306 Biology for Science Majors I (lecture)'],
      'texas-womans': [CHEM_1405],
      'ut-austin': [PHIL_2306, 'SPCH 1318 Interpersonal Communication'],
      'ut-arlington': [ENGL_2311, PHIL_2306],
      'ut-el-paso': [BIOL_1406, CHEM_1411],
      'ut-tyler': [CHEM_1405, ENGL_2311],
      'ut-permian-basin': [ENGL_2311, 'SOCI 2319 Minority Studies', 'HUMA 2319 American Minority Studies'],
      'ut-rio-grande-valley': [CHEM_1405, SOCI_1301],
      'u-houston': [CHEM_1405, SOCI_1301],
      'west-texas-am': [CHEM_1405, MATH_1314, SOCI_1301],
    },
    campus_any: ['midwestern-state', 'prairie-view-am', 'u-houston-victoria'],
    note:
      'Six of these (20 hours) also count toward the Texas core. Where a university named ' +
      'fewer electives than it needs, it takes any course from the state list for the rest.',
    provenance: fos('agency-publication/miscellaneous/revised-fos-nursing-final', false),
  },
  {
    id: 'tx-fos-sociology',
    systems: ['TX-PUBLIC'],
    fields: ['social_sciences'],
    major: 'Sociology',
    programme: FOS,
    courses: [
      SOCI_1301,
      'SOCI 1306 Social Problems',
      'SOCI 2301 Marriage and Family',
      'SOCI 2319 Minority Studies',
      'Directed electives chosen by your university (9 hours)',
    ],
    campus_extras: {
      'angelo-state': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'lamar': [MATH_1342, SOC_PSYCH, CRIMINOLOGY, SOC_SEXUALITY, DRUGS],
      'midwestern-state': [MATH_1342, SOC_PSYCH, CRIMINOLOGY, DRUGS],
      'prairie-view-am': [SOC_SEXUALITY, SOC_PSYCH, CRIMINOLOGY],
      'stephen-f-austin': ['ANTH 2351 Cultural Anthropology', SOC_PSYCH, CRIMINOLOGY],
      'texas-am-international': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'texas-am': [SOC_PSYCH, CRIMINOLOGY, MATH_1342],
      'texas-am-commerce': [MATH_1342, CRIMINOLOGY],
      'texas-southern': [SOC_SEXUALITY, SOC_PSYCH, CRIMINOLOGY],
      'texas-state': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'texas-tech': [MATH_1342, MATH_1314, 'SPCH 1315 Public Speaking'],
      'ut-austin': [MATH_1342],
      'ut-arlington': [SOC_PSYCH, CRIMINOLOGY, 'SPCH 1315 Public Speaking'],
      'ut-san-antonio': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'ut-permian-basin': [SOC_PSYCH, CRIMINOLOGY, DRUGS],
      'ut-dallas': [MATH_1314, MATH_1342, SOC_PSYCH],
      'ut-el-paso': [MATH_1342, SOC_PSYCH, CRIMINOLOGY, DRUGS],
      'ut-rio-grande-valley': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'unt': ['ANTH 2351 Cultural Anthropology', 'GEOG 1303 World Regional Geography', CRIMINOLOGY],
      'unt-dallas': [MATH_1342, SOC_PSYCH, CRIMINOLOGY],
      'west-texas-am': [SOC_PSYCH, CRIMINOLOGY, 'PSYC 2301 General Psychology'],
    },
    campus_any: [
      'sam-houston-state', 'tarleton-state', 'texas-am-corpus-christi', 'texas-am-kingsville',
      'texas-am-texarkana', 'texas-womans', 'u-houston', 'u-houston-clear-lake', 'u-houston-downtown',
    ],
    note: 'Where a university named fewer electives than it needs, it takes any course from the state list for the rest.',
    provenance: fos('training-materials/presentations/revised-field-of-study-for-sociology', true),
  },
];

/**
 * Fields the state has not finished, stated as findings. The tracker is the
 * Coordinating Board's own Texas Direct page.
 */
export const texasMajorPrepGaps: MajorPrepGap[] = [
  {
    systems: ['TX-PUBLIC'],
    fields: ['stem'],
    text:
      'Texas has no finished statewide Field of Study for computer science or biology yet — both ' +
      'are waiting on universities’ directed electives. Engineering’s subcommittee meets in ' +
      'fall 2026; the old engineering Fields of Study stay in force until 31 August 2027.',
    provenance: TEXAS_DIRECT,
  },
  {
    systems: ['TX-PUBLIC'],
    fields: ['arts_humanities'],
    text:
      'English and the History B.A. Fields of Study are still waiting on universities’ ' +
      'directed electives, so there is no finished statewide list for them yet.',
    provenance: TEXAS_DIRECT,
  },
];
