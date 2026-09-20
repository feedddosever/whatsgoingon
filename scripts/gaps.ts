/**
 * What the dataset does not know, printed from the dataset itself.
 *
 * A hand-written gap list is out of date the day after it is written, and this
 * project's whole argument is that a claim should be checkable. So the gap list
 * is derived: it reads the same rows the app reads, and it cannot drift from
 * them. Run it after any data change.
 *
 *   node --experimental-strip-types scripts/gaps.ts
 *   node --experimental-strip-types scripts/gaps.ts --markdown > data/GAPS.md
 */
import { unitedStates as us } from '../src/dataset.ts';
import type { Institution, Jurisdiction, Provenance } from '../src/types.ts';

const MD = process.argv.includes('--markdown');

const unbacked = (p: Provenance): boolean =>
  p.confidence === 'needs_check' || p.confidence === 'unverified';
const unsourced = (p: Provenance): boolean => p.source_url.trim() === '';

const systemsIn = (code: string) => us.systems.filter(s => s.state === code);
const campusesIn = (code: string): Institution[] => {
  const ids = new Set(systemsIn(code).map(s => s.id));
  return us.institutions.filter(i => ids.has(i.system));
};

type Tier = 'priced' | 'statewide' | 'blank';
const tierOf = (j: Jurisdiction): Tier =>
  campusesIn(j.code).length > 0 ? 'priced'
    : j.transfer_guarantee !== null ? 'statewide'
      : 'blank';

/** What we would have to go and find, for one state, in the order it matters. */
function gapsFor(j: Jurisdiction): string[] {
  const g: string[] = [];
  const tier = tierOf(j);
  const campuses = campusesIn(j.code);

  if (tier === 'blank') {
    g.push('**Does a statewide transferable general-education core exist?** Name it, or '
      + 'establish that the state has none. (ECS counts at least 31 states that do.)');
    g.push('The agreement or statute behind it, as a URL we can print.');
  }

  if (tier !== 'blank' && unbacked(j.transfer_provenance)) {
    g.push('The **primary document** behind the statewide rule — statute, board policy or '
      + 'the agreement itself — to promote it off `needs_check`. Currently assembled from '
      + 'secondary sources.');
  }

  if (tier !== 'blank') {
    g.push('**Conditions attached to the guarantee, as structured data**: minimum GPA, '
      + 'minimum hours in residence at the sending college, whether it covers private '
      + 'institutions, and the catalogue year it takes effect. These are prose in the '
      + 'guarantee today, so nothing can warn on them.');
  }

  if (tier !== 'priced') {
    g.push('**The requirement list**: each area, its name, its required units, and which '
      + 'systems require it — without this nothing can be priced.');
    g.push('**Whether the framework counts semester or quarter credits.** Our arithmetic '
      + 'assumes semester units throughout, so a quarter-credit state would be silently '
      + 'wrong by a factor of 1.5.');
    g.push('**The public campuses**, with the system each belongs to.');
    g.push('**Per-credit cost per campus**, and whether the institution charges per credit '
      + 'or a flat full-time tier.');
    g.push('**Residency minimum** and **transfer-credit cap** per campus.');
    g.push('**AP and CLEP policy**: is there a statewide table (as in Florida), a statutory '
      + 'score floor (as in Texas), or is it campus by campus?');
    g.push('**Community-college course numbering**: is there a statewide common-course '
      + 'system we can name courses by, or is articulation institution-pair specific?');
  }

  if (j.fee_waiver === null) {
    g.push('**A need-based community-college fee waiver**, if the state has one. Absent, a '
      + 'waiver-eligible student here is quoted full price — correct today, but only '
      + 'because we assume none exists.');
  }
  if (j.dual_enrollment === null) {
    g.push('**The dual-enrolment programme**: its name, and whether it is free and for whom. '
      + 'This is the largest saving available to anyone still in high school.');
  }

  // Campus-level rows that are carrying an unconfirmed number today.
  const shaky = new Set<string>();
  for (const c of campuses) {
    if (unbacked(c.cost_provenance)) shaky.add('per-credit cost');
    if (unbacked(c.residency_provenance) || unsourced(c.residency_provenance)) {
      shaky.add('residency minimum');
    }
    if (unbacked(c.transfer_cap_provenance) || unsourced(c.transfer_cap_provenance)) {
      shaky.add('transfer-credit cap');
    }
    if (unbacked(c.exam_policy_provenance)) shaky.add('exam policy');
  }
  if (shaky.size > 0) {
    g.push(`Confirm, for campuses we already price: ${[...shaky].sort().join(', ')}.`);
  }

  const instIds = new Set(campuses.map(c => c.id));
  const rules = us.rules.filter(r => instIds.has(r.institution_id));
  const weak = rules.filter(r => unbacked(r.provenance)).length;
  if (rules.length > 0 && weak > 0) {
    g.push(`Confirm **${weak} of ${rules.length} acceptance rules** still marked `
      + '`needs_check` — these are what the conservative route refuses to use.');
  }

  return g;
}

const byTier: Record<Tier, Jurisdiction[]> = { priced: [], statewide: [], blank: [] };
for (const j of us.jurisdictions) byTier[tierOf(j)].push(j);

const TIER_LABEL: Record<Tier, string> = {
  priced: 'Tier 1 — campus pricing',
  statewide: 'Tier 2 — statewide rule only',
  blank: 'Tier 3 — nothing confirmed',
};

/**
 * Gaps a data audit cannot see, because the FIELD does not exist yet.
 *
 * Everything below needs a type change before any amount of research can be
 * entered, which makes these the ones that block whole states rather than
 * single rows. Maintained by hand — deliberately, since no script can detect
 * the absence of a concept.
 */
const SCHEMA_GAPS: ReadonlyArray<readonly [string, string]> = [
  [
    'Semester vs quarter credits',
    'Every unit in this dataset is assumed to be a semester credit, and nothing '
    + 'records that assumption. Washington counts its transfer degree in QUARTER '
    + 'credits (90 of them to a 60-semester-credit junior standing), and Oregon '
    + 'community colleges are on quarters too. The moment either is priced, every '
    + 'figure on the screen is wrong by a factor of 1.5 and nothing complains. '
    + '`GeFramework` needs a `unit_system`, and the engine needs to convert before '
    + 'it compares. **This is the highest-risk gap in the project.**',
  ],
  [
    'Conditions on a guarantee',
    'Arizona\u2019s AGEC needs a 2.5 GPA. Michigan\u2019s MTA needs a 2.0 in every course. '
    + 'MassTransfer needs a 2.0 overall. Kentucky needs 15 of the 33 hours taken in '
    + 'system. Those conditions are prose inside the guarantee sentence today, so the '
    + 'app can print them but cannot warn on them, and a student below the line is '
    + 'told about a guarantee they do not have. Needs structured '
    + '`min_gpa`, `min_hours_at_sending`, `covers_private`, `effective_catalogue_year`.',
  ],
  [
    'Catalogue year, as distinct from when we read it',
    '`Provenance.as_of` records the day we read a page. It does not record which '
    + 'CATALOGUE YEAR the policy belongs to, and transfer policy is versioned by '
    + 'catalogue year. A row read today can describe a rule that changed in the '
    + 'autumn, and nothing in the model can tell the difference.',
  ],
  [
    'Flat-rate tuition',
    'Both California systems charge a flat full-time rate, not per unit. Our per-unit '
    + 'figure is derived and OVERSTATES the saving for a student already enrolled '
    + 'full time \u2014 the most scrutinised number in the app, and still a guess about '
    + 'the shape of the price. `Institution` needs a pricing model, not just a rate.',
  ],
  [
    'In-district, out-of-district, out-of-state',
    'Community colleges charge all three, and the spread is large \u2014 Texas in-district '
    + 'runs from about $77 to $164 per credit hour. One price per course row cannot '
    + 'express that, so the cheapest pathway in the app is priced at a single guess.',
  ],
  [
    'Score-tiered exam rules',
    'One rule per exam, one outcome. Florida\u2019s table routinely awards MORE at a higher '
    + 'score \u2014 AP US History clears nothing at 3 and two core courses at 4, AP Calculus BC '
    + 'awards 4 credits at 3 and 8 at 4. We model the floor, which under-claims for every '
    + 'student who scored well. `AcceptanceRule` needs score bands.',
  ],
  [
    'A cap on guaranteed exam credit',
    'Florida guarantees transfer of at most 45 credit-by-exam credits; CSU caps CLEP at 30 '
    + 'units; Utah caps each CLEP test at 10. The engine will happily build a plan that '
    + 'exceeds any of them and say nothing. `max_exam_credits_guaranteed` per jurisdiction.',
  ],
  [
    'Exam exclusions from a block, as an enforceable refusal',
    'Cal-GETC bars CLEP. The Michigan Transfer Agreement bars CLEP, IB AND DSST. North '
    + 'Carolina bars non-AP credit when the degree is incomplete. Today these live in prose '
    + 'or in per-campus `refuses`; they are properties of the FRAMEWORK and the engine '
    + 'should enforce them there.',
  ],
  [
    'How a state decides exam credit at all',
    'Four shapes, and they are not interchangeable: a binding statewide table (Florida), a '
    + 'statutory score floor (Texas AP), a system policy (CSU), or nothing but campus '
    + 'discretion (most states). `ExamPolicyKind` would let the app say WHY it is confident '
    + 'rather than only how confident.',
  ],
  [
    'Pricing shapes beyond per-credit',
    '`per_credit`, `per_credit_capped` (Georgia bills to 15), `tiered`, `flat_full_time` '
    + '(both California systems) and `per_contact_hour` (some Michigan colleges) are all in '
    + 'use, plus in-district / out-of-district / out-of-state residency tiers. One number '
    + 'per campus cannot express any of it.',
  ],
  [
    'Aid that must be shown rather than subtracted',
    'Only a need-based waiver and a universal promise can honestly be applied to a price. '
    + 'Programmes gated on age, graduation year, field of study or service \u2014 Oregon '
    + 'Promise, Georgia\u2019s HOPE Career Grant, Maine Free College \u2014 must be surfaced and '
    + 'NOT auto-subtracted, or the app quotes a discount the student may not get.',
  ],
  [
    'Third-party stance is more than yes/no',
    'Published refusal, agreement-only, official partner, system policy permits, '
    + 'evaluate-on-request by law, no record. Today `refuses` expresses the first and last '
    + 'and nothing between, so a state where the law REQUIRES an evaluation looks identical '
    + 'to one where nobody has said anything.',
  ],
  [
    'Letter-graded exams cannot be expressed',
    '`AcceptanceRule.min_score` is a number. A Levels are graded A to E, so every A Level '
    + 'rule carries `min_score: null` and the real requirement \u2014 grade A, B or C \u2014 lives in '
    + 'a prose note the engine cannot read. Nothing can warn a student holding a D.',
  ],
  [
    'AS Level, and IB Standard Level',
    'Both are half of the qualification above them, with their own credit rules, and both '
    + 'are deliberately absent rather than guessed. All seven of Florida\u2019s statutory exam '
    + 'families are now modelled; these two sub-levels are what is left.',
  ],
  [
    'Major-specific pathways',
    'Tennessee\u2019s Transfer Pathways and SUNY\u2019s Transfer Paths are organised by MAJOR, '
    + 'not by general education. We model general education only, so in those states '
    + 'we describe the wrong half of the guarantee.',
  ],
  [
    'Community colleges as destinations',
    'They are credit sources, never targets. In Florida the statutory guarantee '
    + 'attaches to the Associate in Arts rather than to the university, so the thing '
    + 'the state actually promises is a destination we cannot select.',
  ],
  [
    'Per-campus third-party transcript policy',
    'Only UC publishes a position on Sophia, Study.com and the rest. Everywhere else '
    + 'is "we have no record", which is honest and nearly useless. These policies '
    + 'exist; they are just not collected.',
  ],
  [
    'Out-of-state coursework',
    'A student who studied in one state and is heading to another is told to retake '
    + 'requirements they may already hold. The app can now show them both states and '
    + 'still cannot connect them.',
  ],
];

if (MD) {
  console.log('# What the dataset does not know\n');
  console.log('> Generated by `node --experimental-strip-types scripts/gaps.ts --markdown`.');
  console.log('> Do not edit by hand — re-run it. A gap list that can drift from the data');
  console.log('> is the same failure this app exists to prevent.\n');
  console.log(`Counted ${us.jurisdictions.length} jurisdictions, `
    + `${us.institutions.length} campuses, ${us.rules.length} acceptance rules.\n`);

  console.log('## Gaps that need a type change, not research\n');
  console.log('These block whole states rather than single rows: no amount of looking');
  console.log('things up helps until the field exists.\n');
  for (const [title, body] of SCHEMA_GAPS) console.log(`- **${title}.** ${body}`);
  console.log('');

  console.log('## Coverage today\n');
  console.log('| Tier | What a student gets | States |');
  console.log('|---|---|---|');
  console.log(`| **1 — campus pricing** | A priced plan | ${byTier.priced.length} |`);
  console.log(`| **2 — statewide rule** | The rule, no numbers | ${byTier.statewide.length} |`);
  console.log(`| **3 — nothing confirmed** | An honest refusal | ${byTier.blank.length} |`);
  console.log('');

  for (const tier of ['priced', 'statewide', 'blank'] as Tier[]) {
    console.log(`\n## ${TIER_LABEL[tier]}\n`);
    for (const j of byTier[tier]) {
      const gaps = gapsFor(j);
      console.log(`### ${j.name} (${j.code})\n`);
      if (tier === 'priced') {
        console.log(`${campusesIn(j.code).length} campuses priced.\n`);
      }
      for (const g of gaps) console.log(`- [ ] ${g}`);
      console.log('');
    }
  }
} else {
  for (const tier of ['priced', 'statewide', 'blank'] as Tier[]) {
    console.log(`\n=== ${TIER_LABEL[tier]} — ${byTier[tier].length} ===`);
    for (const j of byTier[tier]) {
      console.log(`  ${j.code} ${j.name}: ${gapsFor(j).length} open`);
    }
  }
}
