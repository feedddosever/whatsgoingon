/**
 * Audits the shipped dataset against the research of record.
 *
 * `data/research/master-list.json` is where the statewide layer came from, and
 * `data/us/states.ts` is generated from it — which means the two can drift, and
 * a generated file that has silently stopped matching its source is exactly the
 * kind of wrong-but-plausible data this project exists to refuse.
 *
 * So the audit is a program rather than a memory. It reports per state, and
 * exits non-zero on drift so it can gate a commit.
 *
 *   npm run audit
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unitedStates as us } from '../src/dataset.ts';
import type { Jurisdiction, StateCode } from '../src/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

interface ResearchState {
  st: string; name: string; tier: string; framework: string; authority: string;
  credits: string; units: string; conditions: string; exam_policy: string;
  exam_in_block: string; two_year_price: string; waiver: string; waiver_kind: string;
  dual_enrolment: string; alt_credit_stance: string; grade: string; open_items: string;
}

const research: ResearchState[] = JSON.parse(
  readFileSync(join(ROOT, 'data/research/master-list.json'), 'utf8'),
).states;

const byCode = new Map(us.jurisdictions.map(j => [j.code as string, j]));
const systemsIn = (c: string) => us.systems.filter(s => s.state === c);
const campusesIn = (c: string) => {
  const ids = new Set(systemsIn(c).map(s => s.id));
  return us.institutions.filter(i => ids.has(i.system));
};

interface Finding { state: string; severity: 'drift' | 'gap'; what: string }
const findings: Finding[] = [];
const drift = (state: string, what: string) => findings.push({ state, severity: 'drift', what });
const gap = (state: string, what: string) => findings.push({ state, severity: 'gap', what });

/** Words that carry the meaning of a framework name, for a loose match. */
const keywords = (s: string): string[] =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !['the', 'and', 'general', 'education', 'state',
      'statewide', 'transfer', 'core', 'from', 'with', 'that', 'this',
      'programme', 'program', 'none'].includes(w));

for (const r of research) {
  const j: Jurisdiction | undefined = byCode.get(r.st);
  if (j === undefined) { drift(r.st, 'research has this state; the dataset does not'); continue; }

  const hasNone = r.framework.trim().toLowerCase().startsWith('none');
  const expected = hasNone ? 'none' : 'yes';
  if (j.statewide_framework !== expected) {
    drift(r.st, `statewide_framework is "${j.statewide_framework}", research says "${expected}"`);
  }

  // The framework name must still be recognisable in what we print. This is
  // what catches a correction landing in the research and not in the dataset —
  // Georgia's "Areas A-F" surviving after it became Core IMPACTS.
  if (!hasNone) {
    const said = (j.transfer_guarantee ?? '').toLowerCase();
    const missing = keywords(r.framework).filter(w => !said.includes(w));
    if (missing.length > 0 && missing.length >= keywords(r.framework).length / 2) {
      drift(r.st, `guarantee does not mention ${missing.slice(0, 4).join(', ')} — `
        + `research framework is "${r.framework.slice(0, 70)}"`);
    }
  }

  const note = j.transfer_provenance.note ?? '';
  if (!note.includes('Authority:') && !hasNone) {
    drift(r.st, 'no governing authority carried in the provenance note');
  }
  if (r.units.includes('QUARTER') && !note.includes('QUARTER')) {
    drift(r.st, 'research says QUARTER credits; the dataset does not say so');
  }

  // Aid. A programme the research names and the dataset does not hold is a gap
  // worth money to a student, not a cosmetic omission.
  const waiverNamed = r.waiver.trim().toLowerCase();
  const waiverExists = waiverNamed !== '' && !waiverNamed.startsWith('none');
  if (waiverExists && j.fee_waiver === null) {
    gap(r.st, `no fee waiver held; research names "${r.waiver.slice(0, 48)}" (${r.waiver_kind})`);
  }
  if (!waiverExists && j.fee_waiver !== null) {
    drift(r.st, 'dataset holds a fee waiver; research says the state has none');
  }
  const dualNamed = r.dual_enrolment.trim().toLowerCase();
  if (dualNamed !== '' && !dualNamed.startsWith('not confirmed') && j.dual_enrollment === null) {
    gap(r.st, `no dual-enrolment programme held; research names "${r.dual_enrolment.slice(0, 44)}"`);
  }

  if (r.tier === '1' && campusesIn(r.st).length === 0) {
    drift(r.st, 'research calls this tier 1; the dataset has no campuses for it');
  }
  if (r.tier !== '1' && campusesIn(r.st).length > 0) {
    drift(r.st, `dataset prices ${campusesIn(r.st).length} campuses; research calls it tier ${r.tier}`);
  }
}

// Framework-level exam exclusions the research records, asserted against rules.
const clepClearsCalGetc = us.rules.some(r =>
  r.credit_source_id.startsWith('clep-') && r.satisfies_areas.length > 0 &&
  us.areas.some(a => a.framework_id === 'cal-getc' && r.satisfies_areas.includes(a.id)));
if (clepClearsCalGetc) drift('CA', 'a CLEP rule clears a Cal-GETC area; the standard bars CLEP');

const byState = new Map<string, Finding[]>();
for (const f of findings) {
  const list = byState.get(f.state) ?? [];
  list.push(f);
  byState.set(f.state, list);
}

const driftCount = findings.filter(f => f.severity === 'drift').length;
const gapCount = findings.length - driftCount;

console.log(`Audited ${research.length} states against ${us.jurisdictions.length} in the dataset.`);
console.log(`${driftCount} drift, ${gapCount} gaps.\n`);
for (const [state, list] of [...byState].sort()) {
  console.log(`${state}`);
  for (const f of list) console.log(`  ${f.severity === 'drift' ? '✗' : '·'} ${f.what}`);
}
if (findings.length === 0) console.log('Clean.');

// Drift fails; gaps are known work and do not.
process.exit(driftCount > 0 ? 1 : 0);
