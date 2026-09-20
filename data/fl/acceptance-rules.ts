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
  source_url: 'https://www.fldoe.org/core/fileparse.php/5421/urlt/0078391-acc-cbe.pdf',
  as_of: '2026-09-20',
  confidence: 'needs_check',
  note:
    'Articulation Coordinating Committee credit-by-exam equivalencies, August 2026 edition. ' +
    'Florida publishes ONE statewide table that every public institution must follow, and ' +
    'up to 45 credit-by-exam credits count toward guaranteed transfer. Award and core are ' +
    'separate questions: the table names a course, and only some of those courses carry ' +
    'the core tag. Read your own exam’s row before relying on it.',
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
  source_url: 'https://www.fldoe.org/policy/articulation/general-edu-core-course-options.stml',
  as_of: '2026-09-20',
  confidence: 'needs_check',
  note:
    'General Education Core Course Options, set statewide by rule 6A-14.0303. The list ' +
    'moves: AMH X010, LIT X000 and OCE X001 were added for 2024-25 and SYG X000 and ' +
    'MGF X106 came off. Confirm this course appears on the current list.',
};

/**
 * [source, areas cleared, credits, minimum score].
 *
 * An empty area list is a deliberate claim, not a gap: the table awards this
 * exam credit and the course it awards is not core. Several rows also carry a
 * score or credit count the first version of this file got wrong — the AP
 * sciences and Calculus need a **4**, not a 3, and award 4 credits rather
 * than 3.
 */
const EXAM_RULES: ReadonlyArray<readonly [string, string[], number, number]> = [
  // ---- Communication ----
  ['ap-english-lang', ['fl-comm'], 3, 3],
  // Not Humanities. The only core course this exam can produce is ENC X101,
  // which is Communication — and it is the same course AP Language awards, so
  // the no-duplication rule makes them an either/or rather than two clears.
  ['ap-english-lit', ['fl-comm'], 3, 3],
  ['clep-college-composition', ['fl-comm'], 6, 50],

  // ---- Mathematics ----
  ['ap-calculus-ab', ['fl-math'], 4, 4],
  ['ap-calculus-bc', ['fl-math'], 4, 4],
  ['ap-statistics', ['fl-math'], 3, 3],
  ['clep-college-algebra', ['fl-math'], 3, 50],
  ['clep-college-mathematics', ['fl-math'], 3, 50],

  // ---- Social Sciences ----
  ['ap-psychology', ['fl-social'], 3, 3],
  ['ap-us-government', ['fl-social'], 3, 3],
  ['ap-macroeconomics', ['fl-social'], 3, 3],
  ['clep-intro-psychology', ['fl-social'], 3, 50],
  ['clep-american-government', ['fl-social'], 3, 50],
  ['clep-history-us-1', ['fl-social'], 3, 50],
  ['clep-macroeconomics', ['fl-social'], 3, 50],

  // ---- Humanities ----
  ['ap-art-history', ['fl-hum'], 3, 3],

  // ---- Natural Sciences ----
  ['ap-biology', ['fl-nat'], 4, 4],
  ['ap-chemistry', ['fl-nat'], 4, 4],
  ['ap-physics-1', ['fl-nat'], 4, 4],
  ['ap-environmental-science', ['fl-nat'], 3, 3],
  ['clep-biology', ['fl-nat'], 3, 50],
];

/**
 * Credit, no core area. Every one of these was previously mapped to an area it
 * does not clear.
 *
 * AP United States History is the sharpest of them: at a score of 3 it awards
 * AMH X000, which is not core. At 4 or 5 it awards two core courses. We cannot
 * express a score-tiered rule yet, so the row is modelled at its floor score,
 * where it clears nothing, and the note carries the rest. Under-claiming is the
 * only safe direction.
 */
const AWARDED_NOT_CORE: ReadonlyArray<readonly [string, number, string]> = [
  ['ap-us-history', 3,
    'At a score of 3 this awards AMH X000, which is not a core course. At 4 or 5 it ' +
    'awards AMH X010 and AMH X020, which ARE core and also satisfy civic literacy. We ' +
    'cannot model score tiers yet, so this row shows the floor. If you scored 4 or 5, ' +
    'you have more than this says.'],
  ['ap-microeconomics', 3, 'Awards ECO X023, which is not a core course.'],
  ['ap-human-geography', 3, 'Awards GEO X400 or X420, neither of which is core.'],
  ['ap-comparative-government', 3, 'Awards CPO X001 or X002, neither of which is core.'],
  ['ap-spanish', 3,
    'Awards one semester of intermediate language at a score of 3, two at 4 or 5. ' +
    'Neither is a core course.'],
  ['ap-european-history', 3,
    'Awards EUH X009 at a score of 3, and EUH X000 with X001 at 4 or 5. None is core.'],
  ['clep-intro-sociology', 50,
    'Awards SYG X000, which was REMOVED from the core course list for 2024-25.'],
  ['clep-humanities', 50, 'Awards HUM X235 or HUM X250, neither of which is core.'],
  ['clep-american-literature', 50, 'Awards AML X000, which is not core.'],
];

/**
 * CLEP Natural Sciences has NO row in the table at all — "no direct
 * equivalent". There is no guaranteed credit, so there is no rule, and the
 * engine correctly falls through to "we have no record of how this campus
 * treats it". A rule granting elective credit would be inventing a policy.
 */

/**
 * IB, Cambridge A Level (AICE), DSST, DLPT and UExcel are all named in
 * 1007.27(2) and all sit in the same binding table — but these rows have NOT
 * been audited against the August 2026 edition the way the AP and CLEP rows
 * above have. Treat them as the weaker half of this file.
 */
const UNAUDITED: ReadonlyArray<readonly [string, string[], number]> = [
  ['ib-english-a-hl', ['fl-comm'], 5],
  ['ib-mathematics-aa-hl', ['fl-math'], 5],
  ['ib-mathematics-ai-hl', ['fl-math'], 5],
  ['ib-history-hl', ['fl-social'], 5],
  ['ib-psychology-hl', ['fl-social'], 5],
  ['ib-economics-hl', ['fl-social'], 5],
  ['ib-geography-hl', ['fl-social'], 5],
  ['ib-visual-arts-hl', ['fl-hum'], 5],
  ['ib-spanish-b-hl', ['fl-hum'], 5],
  ['ib-biology-hl', ['fl-nat'], 5],
  ['ib-chemistry-hl', ['fl-nat'], 5],
  ['ib-physics-hl', ['fl-nat'], 5],
  ['dsst-principles-public-speaking', ['fl-comm'], 400],
  ['dsst-college-algebra', ['fl-math'], 400],
  ['dsst-general-anthropology', ['fl-social'], 400],
  ['dsst-substance-abuse', ['fl-social'], 400],
  ['dsst-introduction-to-world-religions', ['fl-hum'], 400],
  ['dsst-environment-humanity', ['fl-nat'], 400],
  ['alevel-english-literature', ['fl-comm'], 0],
  ['alevel-mathematics', ['fl-math'], 0],
  ['alevel-history', ['fl-social'], 0],
  ['alevel-psychology', ['fl-social'], 0],
  ['alevel-economics', ['fl-social'], 0],
  ['alevel-geography', ['fl-social'], 0],
  ['alevel-art-design', ['fl-hum'], 0],
  ['alevel-spanish', ['fl-hum'], 0],
  ['alevel-biology', ['fl-nat'], 0],
  ['alevel-chemistry', ['fl-nat'], 0],
  ['alevel-physics', ['fl-nat'], 0],
  ['uexcel-english-composition', ['fl-comm'], 0],
  ['uexcel-college-algebra', ['fl-math'], 0],
  ['uexcel-introduction-to-psychology', ['fl-social'], 0],
  ['uexcel-introduction-to-sociology', ['fl-social'], 0],
  ['uexcel-world-population', ['fl-social'], 0],
  ['dlpt-spanish', ['fl-hum'], 0],
  ['dlpt-arabic', ['fl-hum'], 0],
  ['dlpt-korean', ['fl-hum'], 0],
  ['dlpt-russian', ['fl-hum'], 0],
  ['dlpt-chinese-mandarin', ['fl-hum'], 0],
];

const FL_UNAUDITED: Provenance = {
  ...FL_EXAM_MAPPING,
  note:
    'NOT yet checked against the August 2026 equivalency table — only the AP and CLEP rows ' +
    'have been. Award and core are separate questions in Florida and several AP and CLEP ' +
    'rows turned out to award credit without clearing a core area, so assume the same is ' +
    'possible here. ' + FL_EXAM_MAPPING.note,
};

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
  for (const [src, areas, units, score] of EXAM_RULES) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: score,
      units_granted: units, satisfies_areas: [...areas], provenance: FL_EXAM_MAPPING,
    });
  }
  for (const [src, score, why] of AWARDED_NOT_CORE) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: score,
      units_granted: 3, satisfies_areas: [],
      provenance: { ...FL_NOT_CORE, note: `${why} ${FL_NOT_CORE.note}` },
    });
  }
  for (const [src, areas, score] of UNAUDITED) {
    rules.push({
      institution_id: inst, credit_source_id: src, min_score: score === 0 ? null : score,
      units_granted: 3, satisfies_areas: [...areas], provenance: FL_UNAUDITED,
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
