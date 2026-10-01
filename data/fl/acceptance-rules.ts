import type { AcceptanceRule, Provenance } from '../../src/types.ts';
import { floridaInstitutions } from './institutions.ts';

const ALL = floridaInstitutions.map(i => i.id);

/**
 * Florida is where this app's thesis is most obviously true, and where an
 * earlier version of this file was most obviously wrong.
 *
 * The MECHANISM is statute: rule 6A-10.024 lists passing scores and course
 * equivalents, and every state university and college must award them. The
 * first version of this file assumed that *any* award on that table cleared a
 * general-education core area. **It does not.** The table awards credit for a
 * named course, and only some of those courses carry the `core` tag.
 *
 * Eleven rows here used to claim a core area they do not get — AP
 * Microeconomics, Human Geography, Comparative Government, Spanish, European
 * History, CLEP Sociology, Humanities, American Literature among them. A
 * student reading those would have believed a requirement was handled, been
 * awarded the credit, and still owed the requirement. That is the exact failure
 * this product exists to prevent, and it shipped.
 *
 * They are now `satisfies_areas: []` — credit toward the degree, clearing
 * nothing — which is the same shape as CLEP at a CSU and produces the same
 * `credit_not_toward_ge` warning.
 */
const FL_EXAM_MAPPING: Provenance = {
  source_url: 'https://www.flbog.edu/wp-content/uploads/2026/06/ACC-Credit-by-Exam-Equivalencies-List.pdf',
  as_of: '2026-10-01',
  confidence: 'needs_check',
  note:
    'Articulation Coordinating Committee credit-by-exam equivalencies, August 2026 edition ' +
    '(rule 6A-10.024). Florida publishes ONE statewide table that every public institution ' +
    'must follow, and up to 45 credit-by-exam credits are guaranteed to transfer. Award and ' +
    'core are separate questions: the table names a course, and only some of those courses ' +
    'carry the core tag. We read the June 2026 copy; a change notice was filed before the ' +
    'final text was adopted, so read your own exam’s row before relying on it.',
};

/** Awarded, and specifically NOT part of the general-education core. */
const FL_NOT_CORE: Provenance = {
  ...FL_EXAM_MAPPING,
  note:
    'The August 2026 table awards credit for this exam, but the course it awards is NOT a ' +
    'general-education core course. The credit counts toward your degree and clears no ' +
    'core area — which is the easiest thing in this whole app to misread, because nothing ' +
    'about it looks like a refusal. ' + FL_EXAM_MAPPING.note,
};

const FL_COURSE_MAPPING: Provenance = {
  source_url: 'https://flrules.org/gateway/readFile.asp?sid=0&tid=28628694&type=1&file=6A-14.0303.doc',
  as_of: '2026-10-01',
  confidence: 'published',
  note:
    'General Education Core Course Options, set statewide by rule 6A-14.0303 (effective ' +
    '8/27/2024) and Board of Governors Regulation 8.005. The list is reviewed every four ' +
    'years: AMH X010, LIT X000 and OCE X001 were added for 2024-25 and SYG X000 and ' +
    'MGF X106 came off. Take the course number your college lists for this area.',
};

/**
 * [source, areas cleared, credits, minimum score, note].
 *
 * Every row is modelled at the lowest score at which it clears what it claims,
 * with the credits awarded at that score. Where the table lets the college pick
 * between a core course and a non-core one, the row clears nothing: we cannot
 * know which the college will pick, and under-claiming is the only safe
 * direction. An empty area list is a deliberate claim, not a gap.
 *
 * An earlier version of this file asked for a 4 on the AP sciences and
 * Calculus. That was a misreading — "min. 4 credits" in the table is a credit
 * count, not a score — and it told every student with a 3 they had nothing.
 */
const EXAM_RULES: ReadonlyArray<readonly [string, string[], number, number | null, string]> = [
  // ---- AP: Communication ----
  ['ap-english-lang', ['fl-comm'], 3, 3, 'Awards ENC X101 at a 3, and ENC X101 with X102 (6 credits) at 4 or 5.'],
  // At a 3 the college may award a literature course instead of ENC X101, and
  // only ENC X101 is core. At 4 or 5 ENC X101 is guaranteed.
  ['ap-english-lit', ['fl-comm'], 3, 4,
    'At a 3 the college may award ENC X101 or a literature course, and only ENC X101 is ' +
    'core. At 4 or 5 it awards ENC X101, which clears Communication.'],
  ['clep-college-composition', ['fl-comm'], 6, 50, 'Awards ENC X101 and ENC X102.'],

  // ---- AP: Mathematics ----
  ['ap-calculus-ab', ['fl-math'], 4, 3, 'Awards MAC X311, a 4-credit core course, at any score of 3 or higher.'],
  ['ap-calculus-bc', ['fl-math'], 4, 3, 'Awards MAC X311 at a 3, and MAC X311 with X312 (8 credits) at 4 or 5.'],
  ['clep-college-algebra', ['fl-math'], 3, 50, 'Awards MAC X105.'],
  ['clep-college-mathematics', ['fl-math'], 3, 50, 'Awards MGF X130.'],

  // ---- AP: Social Sciences ----
  ['ap-psychology', ['fl-social'], 3, 3, 'Awards PSY X012.'],
  ['ap-us-government', ['fl-social'], 3, 3, 'Awards POS X041, which also meets the civic-literacy requirement.'],
  ['ap-macroeconomics', ['fl-social'], 3, 3, 'Awards ECO X013.'],
  ['clep-intro-psychology', ['fl-social'], 3, 50, 'Awards PSY X012.'],
  ['clep-american-government', ['fl-social'], 3, 50, 'Awards POS X041 (civics).'],
  ['clep-history-us-1', ['fl-social'], 3, 50, 'Awards AMH X010 (civics), core since 2024-25.'],
  ['clep-macroeconomics', ['fl-social'], 3, 50, 'Awards ECO X013.'],

  // ---- AP: Humanities ----
  ['ap-art-history', ['fl-hum'], 3, 3, 'Awards ARH X000 at a 3, and 6 credits at 4 or 5.'],

  // ---- AP: Natural Sciences ----
  ['ap-biology', ['fl-nat'], 4, 3, 'Awards BSC X005C, a 4-credit core lab course, at a 3; more at 4 or 5.'],
  ['ap-chemistry', ['fl-nat'], 4, 3, 'Awards CHM X020C, a 4-credit core lab course, at a 3; more at 4 or 5.'],
  ['ap-physics-1', ['fl-nat'], 4, 3, 'Awards PHY X053C, a 4-credit core lab course.'],
  ['ap-environmental-science', ['fl-nat'], 3, 3,
    'Awards EVR X001. An exam taken before September 2025 awards ISC X051, which is not core.'],
  ['clep-biology', ['fl-nat'], 3, 50, 'Awards BSC X005, without lab credit.'],

  // ---- AP and CLEP: credit, no core area ----
  // AP Statistics awards STA X014 or STA X023, the college's choice, and only
  // STA X023 is core.
  ['ap-statistics', [], 3, 3,
    'Awards STA X014 or STA X023, at the college’s choice, and only STA X023 is core. Ask ' +
    'which one your college awards — if it is STA X023, this clears Mathematics.'],
  // AP US History at 4 or 5 awards two core courses; we cannot model score tiers
  // yet, so the row shows the floor.
  ['ap-us-history', [], 3, 3,
    'At a score of 3 this awards AMH X000, which is not a core course. At 4 or 5 it awards ' +
    'AMH X010 and AMH X020, which ARE core and also satisfy civic literacy. We cannot model ' +
    'score tiers yet, so this row shows the floor. If you scored 4 or 5, you have more than ' +
    'this says.'],
  ['ap-microeconomics', [], 3, 3, 'Awards ECO X023, which is not a core course.'],
  ['ap-human-geography', [], 3, 3, 'Awards GEO X400 or X420, neither of which is core.'],
  ['ap-comparative-government', [], 3, 3, 'Awards CPO X001 or X002, neither of which is core.'],
  ['ap-spanish', [], 3, 3,
    'Awards one semester of intermediate language at a score of 3, two at 4 or 5. Neither ' +
    'is a core course.'],
  ['ap-european-history', [], 3, 3, 'Awards EUH X009 at a score of 3, and EUH X000 with X001 at 4 or 5. None is core.'],
  ['clep-intro-sociology', [], 3, 50, 'Awards SYG X000, which was REMOVED from the core course list for 2024-25.'],
  ['clep-humanities', [], 3, 50, 'Awards HUM X235 or HUM X250, neither of which is core.'],
  ['clep-american-literature', [], 3, 50, 'Awards AML X000, which is not core.'],

  // ---- IB: credit starts at 4 (3 credits); 5 to 7 earns 6 credits ----
  ['ib-mathematics-aa-hl', ['fl-math'], 3, 4, 'Awards MAC X105 at a 4; 6 credits at 5 or higher.'],
  ['ib-psychology-hl', ['fl-social'], 3, 4, 'Awards PSY X012 at a 4; 6 credits at 5 or higher.'],
  // At a 4 Economics awards ECO X000, which is not core.
  ['ib-economics-hl', ['fl-social'], 6, 5, 'Awards ECO X013 and ECO X023 at 5 or higher. A 4 awards ECO X000, which is not core.'],
  ['ib-biology-hl', ['fl-nat'], 3, 4, 'Awards core biology at a 4; 6 credits at 5 or higher.'],
  ['ib-chemistry-hl', ['fl-nat'], 3, 4, 'Awards CHM X020C at a 4; 6 credits at 5 or higher.'],
  ['ib-physics-hl', ['fl-nat'], 3, 4, 'Awards PHY X020C at a 4; 6 credits at 5 or higher.'],
  // "Language A: Literature" — LIT X000 is Humanities, and at a 4 the college may
  // award ENC X141 instead, which is not core.
  ['ib-english-a-hl', ['fl-hum'], 6, 5,
    'Awards ENC X141 and LIT X000 at 5 or higher, and LIT X000 clears Humanities. At a 4 ' +
    'the college may award ENC X141 alone, which is not core.'],
  ['ib-mathematics-ai-hl', [], 3, 4,
    'A 4 awards MAC X140, which is not core. At 5 or higher it clears Mathematics only if ' +
    'the college picks STA X023.'],
  ['ib-history-hl', [], 3, 4,
    'Awards WOH X030, which is not core. Only the History of the Americas option, at 5 or ' +
    'higher, adds a core American history course.'],
  ['ib-geography-hl', [], 3, 4, 'Awards GEA X000, or GEO X200 and X400 at 5 or higher. None is core.'],
  ['ib-visual-arts-hl', [], 3, 4, 'Awards ART X012 or ART X014, which are not core.'],
  ['ib-spanish-b-hl', [], 3, 4, 'Awards elementary language credit, which is not core.'],

  // ---- Cambridge A Level: any passing grade, A to E ----
  ['alevel-english-literature', ['fl-comm'], 6, null, 'Awards ENC X101 and X102, or ENC X102 and LIT X100.'],
  ['alevel-mathematics', ['fl-math'], 6, null, 'Awards MAC X311 and another mathematics course.'],
  ['alevel-psychology', ['fl-social'], 6, null, 'Awards PSY X012 and another psychology course.'],
  ['alevel-economics', ['fl-social'], 6, null, 'Awards ECO X013 and ECO X023.'],
  ['alevel-biology', ['fl-nat'], 7, null, 'Awards BSC X010C and more at the college’s discretion.'],
  ['alevel-chemistry', ['fl-nat'], 8, null, 'Awards CHM X020C and CHM X045C.'],
  ['alevel-physics', ['fl-nat'], 8, null, 'Awards PHY X053C and PHY X054C.'],
  ['alevel-history', [], 6, null,
    'Only the US History paper (AMH X029 and AMH X020) clears a core area; the European and ' +
    'International papers award world-history credit that is not core.'],
  ['alevel-geography', [], 6, null, 'Awards GEO X200 and GEO X400, which are not core.'],
  ['alevel-art-design', [], 6, null, 'The table names no course; the credit is not core.'],
  ['alevel-spanish', [], 6, null, 'Awards two semesters of intermediate language, which is not core.'],

  // ---- DSST: 400 to pass, 3 credits each ----
  ['dsst-college-algebra', ['fl-math'], 3, 400, 'Awards MAC X105 for exams taken after 16 May 2018.'],
  ['dsst-general-anthropology', ['fl-social'], 3, 400, 'Awards ANT X000.'],
  ['dsst-principles-public-speaking', [], 3, 400, 'Awards SPC X600. Public speaking is not part of Florida’s Communication core.'],
  ['dsst-substance-abuse', [], 3, 400, 'Awards HSC X140 or HSC X150, which are not core.'],
  ['dsst-introduction-to-world-religions', [], 3, 400, 'Awards REL X300, which is not core.'],
  ['dsst-environment-humanity', [], 3, 400, 'Awards EVR X002 or ISC X003, which are not core.'],
  ['dsst-history-of-the-vietnam-war', [], 3, 400, 'Awards AMH X059, which is not core.'],
  ['dsst-principles-of-supervision', [], 3, 400, 'Awards MAN X124 or MNA X345, which are not core.'],

  // ---- DLPT: language credit, which is never core ----
  ['dlpt-spanish', [], 6, 3, 'Awards two semesters of elementary language at 3 or 3+, and 9 credits at 4 or 5.'],
  ['dlpt-arabic', [], 6, 3, 'Awards two semesters of elementary language at 3 or 3+, and 9 credits at 4 or 5.'],
  ['dlpt-korean', [], 6, 3, 'Awards two semesters of elementary language at 3 or 3+, and 9 credits at 4 or 5.'],
  ['dlpt-russian', [], 6, 3, 'Awards a semester each of elementary and intermediate language at 3 or 3+, and 9 credits at 4 or 5.'],
  ['dlpt-chinese-mandarin', [], 6, 3, 'Awards two semesters of elementary language at 3 or 3+, and 9 credits at 4 or 5.'],
];

/**
 * CLEP Natural Sciences has NO row in the table at all — "no direct
 * equivalent". There is no guaranteed credit, so there is no rule, and the
 * engine correctly falls through to "we have no record of how this campus
 * treats it". A rule granting elective credit would be inventing a policy.
 */

/** SYG X000 and MGF X106 both came off the core course list for 2024-25. */
const COURSE_RULES: ReadonlyArray<readonly [string, string[]]> = [
  ['fl-enc-1101', ['fl-comm']],
  ['fl-enc-1102', ['fl-comm']],
  ['fl-mac-1105', ['fl-math']],
  ['fl-mgf-1106', []],
  ['fl-sta-2023', ['fl-math']],
  ['fl-psy-2012', ['fl-social']],
  ['fl-syg-2000', []],
  ['fl-pos-2041', ['fl-social']],
  ['fl-amh-2020', ['fl-social']],
  ['fl-arh-2000', ['fl-hum']],
  ['fl-phi-2010', ['fl-hum']],
  ['fl-lit-2000', ['fl-hum']],
  ['fl-bsc-1005', ['fl-nat']],
  ['fl-chm-1020', ['fl-nat']],
  ['fl-ast-1002', ['fl-nat']],
];

const rules: AcceptanceRule[] = [];
for (const inst of ALL) {
  for (const [src, areas, units, score, why] of EXAM_RULES) {
    const base = areas.length === 0 ? FL_NOT_CORE : FL_EXAM_MAPPING;
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: score,
      units_granted: units, satisfies_areas: [...areas],
      provenance: { ...base, note: `${why} ${base.note}` },
    });
  }
  for (const [src, areas] of COURSE_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: null,
      units_granted: 3, satisfies_areas: [...areas],
      provenance: areas.length === 0
        ? {
            ...FL_COURSE_MAPPING,
            note: 'This course came OFF the statewide core list for 2024-25. It still ' +
              'carries credit and no longer clears a core area. ' + FL_COURSE_MAPPING.note,
          }
        : FL_COURSE_MAPPING,
    });
  }
}

export const floridaRules: AcceptanceRule[] = rules;
