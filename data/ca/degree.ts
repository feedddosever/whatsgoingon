import type { MajorPrep, Provenance, SystemDegree } from '../../src/types.ts';

/**
 * What a UC or CSU bachelor's degree is made of, beyond Cal-GETC.
 *
 * Every row was read on the as_of date from the page it cites: the UC Academic
 * Senate's own Regulations, and the CSU's Title 5 as published by Cornell LII.
 * `statute` is used for Title 5 because it is regulation with the force of law;
 * the UC Senate Regulations are the University's own rules, so `published`.
 */

const UC_SENATE: Provenance = {
  source_url: 'https://senate.universityofcalifornia.edu/bylaws-regulations/regulations/rpart3.html',
  as_of: '2026-09-28',
  confidence: 'published',
};

const BERKELEY_LS: Provenance = {
  source_url: 'https://lsadvising.berkeley.edu/degree-requirements',
  as_of: '2026-10-01',
  confidence: 'published',
  note: '120 total semester units, including transfer credit and advanced high-school units.',
};

const t5 = (section: string): Provenance => ({
  source_url: `https://www.law.cornell.edu/regulations/california/5-CCR-${section}`,
  as_of: '2026-09-28',
  confidence: 'statute',
});

const CSU_ADT: Provenance = {
  source_url: 'https://www.calstate.edu/apply/transfer/pages/ccc-associate-degree-for-transfer.aspx',
  as_of: '2026-09-28',
  confidence: 'published',
};

export const californiaDegrees: SystemDegree[] = [
  {
    system: 'UC',
    total_units: null,
    rules: [
      {
        id: 'uc-total',
        block: 'total',
        title: 'Total units',
        text:
          'Set by each campus, not systemwide. At Berkeley’s College of Letters & Science it is ' +
          '120 semester units, including transfer and exam credit.',
        provenance: BERKELEY_LS,
      },
      {
        id: 'uc-residence',
        block: 'residency',
        title: 'Senior residence',
        text:
          '24 of your final 30 semester units (35 of the final 45 quarter units) must be earned in ' +
          'residence in the UC college or school that awards the degree.',
        provenance: UC_SENATE,
      },
      {
        id: 'uc-elwr',
        block: 'graduation',
        title: 'Entry Level Writing Requirement',
        text:
          'Every UC student must meet it — by the campus placement process, an approved writing ' +
          'score, or at least 3 semester units of transferable English composition before ' +
          'enrolling.',
        provenance: UC_SENATE,
      },
      {
        id: 'uc-ahi',
        block: 'graduation',
        title: 'American History and Institutions',
        text:
          'Required of every bachelor’s candidate: American history and the principles of ' +
          'American institutions under the federal and state constitutions, met by an ' +
          'examination or by an approved course.',
        provenance: UC_SENATE,
      },
    ],
  },
  {
    system: 'CSU',
    total_units: 120,
    ge_units: 43,
    rules: [
      {
        id: 'csu-total',
        block: 'total',
        title: 'Total units',
        text:
          'No fewer and no more than 120 semester units for most bachelor’s degrees. ' +
          'Architecture, music, fine arts and landscape architecture degrees may go higher.',
        provenance: t5('40508'),
      },
      {
        id: 'csu-ge',
        block: 'ge',
        title: 'CSU general education',
        text:
          'At least 43 units in total, 9 of them upper-division. A California community college ' +
          'can certify up to 34 lower-division units of it before you transfer.',
        provenance: t5('40405.1'),
      },
      {
        id: 'csu-residence',
        block: 'residency',
        title: 'Residence',
        text:
          '30 semester units must be earned at the campus granting the degree — 24 of them ' +
          'upper-division and 12 of them in the major. Credit by evaluation does not count ' +
          'toward it.',
        provenance: t5('40403'),
      },
      {
        id: 'csu-major',
        block: 'major',
        title: 'The major',
        text:
          'At least 24 semester units, 12 of them upper-division. The campus sets the maximum.',
        provenance: t5('40500'),
      },
      {
        id: 'csu-american-institutions',
        block: 'graduation',
        title: 'US History, Constitution and American Ideals',
        text:
          'Courses or exams in American history, the US Constitution, and state and local ' +
          'government. A California community college can certify it for you before transfer.',
        provenance: t5('40404'),
      },
    ],
  },
];

const tp = (slug: string): Provenance => ({
  source_url:
    'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/' +
    `uc-transfer-programs/transfer-pathways/${slug}.html`,
  as_of: '2026-09-28',
  confidence: 'published',
});

const PATHWAY = 'UC Transfer Pathway';

/**
 * UC Transfer Pathways: one set of lower-division courses per major that every
 * participating UC campus accepts as preparation. Course names are UC's own;
 * which community-college course matches each is on ASSIST.org.
 */
export const californiaMajorPrep: MajorPrep[] = [
  {
    id: 'uc-tp-business',
    systems: ['UC'],
    fields: ['business'],
    major: 'Business administration',
    programme: PATHWAY,
    courses: [
      'Microeconomics',
      'Macroeconomics',
      'Single variable calculus (one-year sequence)',
      'Statistics',
      'Introduction to business (including finance)',
      'Financial accounting',
      'Managerial accounting',
    ],
    note:
      'Applies at Berkeley, Davis, Irvine, Merced, Riverside and Santa Cruz. UC encourages the ' +
      'STEM calculus; some campuses accept the non-STEM version. UC does not require business ' +
      'law, which some community-college transfer degrees do.',
    provenance: tp('business-administration'),
  },
  {
    id: 'uc-tp-cs',
    systems: ['UC'],
    fields: ['stem'],
    major: 'Computer science',
    programme: PATHWAY,
    courses: [
      'Introduction to programming (computer science I)',
      'Data structures (computer science II)',
      'Computer organization and assembly language',
      'Single variable calculus for STEM majors (one-year sequence)',
      'Multivariable calculus',
      'Discrete mathematics',
      'Linear algebra',
      'Differential equations',
      'Calculus-based physics (one-year sequence with labs)',
    ],
    note:
      'Applies to the general computer science major at all nine undergraduate campuses. The ' +
      'community-college transfer ' +
      'degree in computer science leaves out multivariable calculus, linear algebra and ' +
      'differential equations — take them anyway if UC is the goal.',
    provenance: tp('computer-science'),
  },
  {
    id: 'uc-tp-mech-eng',
    systems: ['UC'],
    fields: ['stem'],
    major: 'Mechanical engineering',
    programme: PATHWAY,
    courses: [
      'Single variable calculus for STEM majors (one-year sequence)',
      'Multivariable calculus',
      'Linear algebra',
      'Differential equations',
      'General chemistry (one-year sequence with labs)',
      'Calculus-based physics (one-year sequence with labs)',
      'Computer programming (one course)',
      'Engineering graphics and design',
      'Circuits with lab',
      'Statics',
    ],
    note: 'Applies at Berkeley, Davis, Irvine, UCLA, Merced, Riverside, San Diego and Santa Barbara.',
    provenance: tp('mechanical-engineering'),
  },
  {
    id: 'uc-tp-bio',
    systems: ['UC'],
    fields: ['stem', 'health'],
    major: 'Biological sciences',
    programme: PATHWAY,
    courses: [
      'General biology with lab (full introductory sequence)',
      'General chemistry with lab (one-year sequence)',
      'Calculus for STEM majors (one-year sequence)',
      'Organic chemistry with lab (one-year sequence)',
    ],
    note:
      'From fall 2027 this one Pathway replaces the separate biochemistry, biology, cell ' +
      'biology and molecular biology Pathways. It covers health-leaning majors too — human ' +
      'biology, exercise sciences, global disease biology, neuroscience (pre-med). Some ' +
      'majors also want a year of calculus-based physics and statistics before graduation.',
    provenance: tp('biological-sciences'),
  },
  {
    id: 'uc-tp-psych',
    systems: ['UC'],
    fields: ['social_sciences'],
    major: 'Psychology',
    programme: PATHWAY,
    courses: [
      'Introduction to psychology',
      'Statistics',
      'Calculus 1 (life sciences version or above)',
      'Biology 1 (STEM version)',
      'One more science course (biology, chemistry or physics)',
      'Two social science courses (anthropology, logic, sociology or modern philosophy)',
    ],
    note: 'Applies at Berkeley, Davis, UCLA, Merced, Riverside, San Diego and Santa Cruz.',
    provenance: tp('psychology'),
  },
  {
    id: 'uc-tp-econ',
    systems: ['UC'],
    fields: ['social_sciences', 'business'],
    major: 'Economics',
    programme: PATHWAY,
    courses: [
      'Microeconomics (one course)',
      'Macroeconomics (one course)',
      'Single variable calculus (one-year sequence)',
    ],
    note:
      'Applies at all nine undergraduate UC campuses. Statistics is not expected before ' +
      'transfer but some campuses require it after.',
    provenance: tp('economics'),
  },
  {
    id: 'uc-tp-english',
    systems: ['UC'],
    fields: ['arts_humanities'],
    major: 'English',
    programme: PATHWAY,
    courses: [
      'Survey of British literature to 1850',
      'Survey of British and/or American literature 1860–present',
      'Two more UC-transferable English courses',
      'A language other than English (1–2 years)',
    ],
    note: 'The language requirement is the usual gap between this and the community-college transfer degree.',
    provenance: tp('english'),
  },
  {
    id: 'uc-tp-history',
    systems: ['UC'],
    fields: ['arts_humanities', 'social_sciences'],
    major: 'History',
    programme: PATHWAY,
    courses: [
      'A yearlong sequence in world history, or European history / western civilization',
      'One course in U.S. history',
      'One history course from a region other than the U.S. or Europe',
    ],
    note: 'UC advises history courses with substantial analytical writing.',
    provenance: tp('history'),
  },
  {
    // Not a course list: the CSU's route is a degree, and the courses are set by
    // each Transfer Model Curriculum, which we have not read. What we hold is the
    // guarantee and its conditions, so that is what is stated.
    id: 'csu-adt',
    systems: ['CSU'],
    fields: ['stem', 'business', 'health', 'social_sciences', 'arts_humanities', 'undecided'],
    major: 'Any major with an Associate Degree for Transfer',
    programme: 'Associate Degree for Transfer (AA-T / AS-T)',
    courses: [
      'A 60-unit AA-T or AS-T at a California community college',
      'At least 18 units in the major or area of emphasis',
      'CSU GE-Breadth or IGETC completed',
    ],
    note:
      'Guarantees priority admission to a CSU — not a particular campus or major. Admitted ' +
      'to a similar major, you finish the bachelor’s in 60 more units, provided you do not ' +
      'repeat courses or add courses for a minor. The exact courses for each major are on ' +
      'ASSIST.org.',
    provenance: CSU_ADT,
  },
];
