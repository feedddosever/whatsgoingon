import type { Dataset } from './engine.ts';
import type { StateCode } from './types.ts';

import { frameworks } from '../data/us/frameworks.ts';
import { systems } from '../data/us/systems.ts';
import { jurisdictions } from '../data/us/states.ts';
import { examSources } from '../data/us/exams.ts';
import { altCreditSources } from '../data/us/alt-credit.ts';

import { institutions as caInstitutions } from '../data/ca/institutions.ts';
import { calGetcAreas } from '../data/ca/cal-getc.ts';
import { cccCourses } from '../data/ca/credit-sources.ts';
import { acceptanceRules as caRules } from '../data/ca/acceptance-rules.ts';

import { texasInstitutions } from '../data/tx/institutions.ts';
import { texasCoreAreas } from '../data/tx/core.ts';
import { texasCourses } from '../data/tx/courses.ts';
import { texasRules } from '../data/tx/acceptance-rules.ts';

import { floridaInstitutions } from '../data/fl/institutions.ts';
import { floridaCoreAreas } from '../data/fl/core.ts';
import { floridaCourses } from '../data/fl/courses.ts';
import { floridaRules } from '../data/fl/acceptance-rules.ts';

/**
 * The dataset, as typed modules rather than JSON: Metro and Node disagree about
 * JSON import syntax, and a typed module makes a malformed row a compile error
 * instead of a runtime surprise.
 *
 * It is one dataset rather than one per state on purpose. Scoping happens
 * through `GeArea.applies_to`, which names systems — a Texas campus's system id
 * appears in no Cal-GETC area, so a Texas plan can never pick up a Californian
 * requirement even though both live in the same array. That is a data
 * invariant, and `engine.test.ts` asserts it rather than trusting it.
 */
export const unitedStates: Dataset = {
  jurisdictions,
  frameworks,
  systems,
  institutions: [...caInstitutions, ...texasInstitutions, ...floridaInstitutions],
  areas: [...calGetcAreas, ...texasCoreAreas, ...floridaCoreAreas],
  creditSources: [
    ...examSources, ...altCreditSources,
    ...cccCourses, ...texasCourses, ...floridaCourses,
  ],
  rules: [...caRules, ...texasRules, ...floridaRules],
};

/**
 * One state's slice: the campuses, requirements, rules and credit sources that
 * a student in that state can actually reach.
 *
 * Rules and credit sources are filtered too, rather than being left in on the
 * grounds that a rule keyed to an out-of-state campus is unreachable anyway.
 * They ARE unreachable by the engine — but not by anything that reads the
 * dataset directly, and the first thing to notice was a test asserting that
 * every AP mapping in California is published, which began failing the moment
 * Texas's deliberately-unconfirmed mappings joined the same array. A slice that
 * is not really a slice quietly changes the meaning of everything asked of it.
 */
export function forState(ds: Dataset, state: StateCode): Dataset {
  const systemIds = new Set(ds.systems.filter(s => s.state === state).map(s => s.id));
  const institutions = ds.institutions.filter(i => systemIds.has(i.system));
  const instIds = new Set(institutions.map(i => i.id));
  const rules = ds.rules.filter(r => instIds.has(r.institution_id));
  const sourceIds = new Set(rules.map(r => r.credit_source_id));
  const refusedKinds = new Set(institutions.flatMap(i => i.refuses));
  return {
    ...ds,
    jurisdictions: ds.jurisdictions.filter(j => j.code === state),
    frameworks: ds.frameworks.filter(f => f.state === state),
    systems: ds.systems.filter(s => systemIds.has(s.id)),
    institutions,
    areas: ds.areas.filter(a => a.applies_to.some(s => systemIds.has(s))),
    // Three reasons to keep a source the rules do not reach.
    //
    // A family some campus here REFUSES: the whole reason to list UExcel is to
    // tell a UC-bound student UC will not look at it, and a source the student
    // cannot tick is a warning that can never fire.
    //
    // And `alt_provider` ALWAYS, regardless of state. Keeping it only where a
    // campus refused it hid the entire third-party section in Florida — the
    // state with the strongest published right in the country, where statute
    // gives a student the right to have that credit evaluated on request before
    // their first term. The app was silent exactly where it had the most to
    // say, because silence had been wired to "nobody objected".
    creditSources: ds.creditSources.filter(
      c => sourceIds.has(c.id) || refusedKinds.has(c.kind) || c.kind === 'alt_provider',
    ),
    rules,
  };
}

/** The California slice, kept as a named export because the demo and the tests use it. */
export const california: Dataset = forState(unitedStates, 'CA');
