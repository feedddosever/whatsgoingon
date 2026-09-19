import type {
  AcceptanceRule, AreaChoice, CreditKind, GeArea, GeFramework, Institution,
  CreditSource, Jurisdiction, PlanItem, Route, RouteKind, RouteWarning,
  StudentInput, StudentProfile, System,
} from './types.ts';

export interface Dataset {
  /** One row per state, including the states we have not mapped. */
  jurisdictions: Jurisdiction[];
  frameworks: GeFramework[];
  systems: System[];
  institutions: Institution[];
  areas: GeArea[];
  creditSources: CreditSource[];
  rules: AcceptanceRule[];
}

/**
 * Institution -> system -> framework -> state. Three lookups the engine used to
 * not need, because there was only one of each.
 *
 * Each throws rather than returning a default. A campus whose system is missing
 * from the dataset is a broken dataset, and the failure a student must never
 * see is the quiet one: a plan built against the wrong state's requirements,
 * priced in the wrong state's dollars, that looks entirely normal on screen.
 */
export function systemFor(ds: Dataset, inst: Institution): System {
  const sys = ds.systems.find(s => s.id === inst.system);
  if (sys === undefined) throw new Error(`institution ${inst.id}: unknown system ${inst.system}`);
  return sys;
}

export function frameworkFor(ds: Dataset, inst: Institution): GeFramework {
  const sys = systemFor(ds, inst);
  const fw = ds.frameworks.find(f => f.id === sys.framework_id);
  if (fw === undefined) throw new Error(`system ${sys.id}: unknown framework ${sys.framework_id}`);
  return fw;
}

export function jurisdictionFor(ds: Dataset, inst: Institution): Jurisdiction {
  const sys = systemFor(ds, inst);
  const jur = ds.jurisdictions.find(j => j.code === sys.state);
  if (jur === undefined) throw new Error(`system ${sys.id}: unknown state ${sys.state}`);
  return jur;
}

/** Confidence levels the lowest-risk route is willing to stake a student's money on. */
const TRUSTED = new Set(['statute', 'published']);

const byId = <T extends { id: string }>(xs: T[], id: string): T | undefined =>
  xs.find(x => x.id === id);

/** A CLEP exam is instant; a community college course costs you a term. */
const termsFor = (kind: CreditKind): number => (kind === 'cc_course' ? 1 : 0);

/**
 * What this credit actually costs THIS student, in THIS state.
 *
 * Two kinds of waiver take a sticker price to zero, and they do not travel the
 * same way:
 *   - Modern States "Freshman Year for Free" covers the CLEP exam fee, and it is
 *     national, so it applies wherever the student is;
 *   - a community-college fee waiver is a creature of state law. California has
 *     the College Promise Grant; Texas and Florida have no statewide equivalent,
 *     so a waiver-eligible student there still pays tuition.
 *
 * Zeroing a course fee in a state that has no waiver would under-price every
 * route in that state and reorder the results in the student's face. The
 * jurisdiction decides, not the credit kind.
 *
 * "Unsure" deliberately pays full price: we quote what they will be charged if
 * the waiver does not come through, and flag it as worth checking.
 */
export function effectiveCost(
  src: CreditSource,
  profile: StudentProfile,
  jur: Jurisdiction,
): number {
  if (profile.waiver !== 'eligible') return src.cost_usd;
  if (src.kind === 'clep') return 0; // Modern States, nationwide
  if (src.kind === 'cc_course' && jur.fee_waiver !== null) return 0;
  return src.cost_usd; // AP has no equivalent blanket waiver anywhere
}

function toPlanItem(
  rule: AcceptanceRule,
  src: CreditSource,
  profile: StudentProfile,
  jur: Jurisdiction,
): PlanItem {
  return {
    credit_source_id: src.id,
    kind: src.kind,
    label: src.name,
    cost_usd: effectiveCost(src, profile, jur),
    units: rule.units_granted,
    satisfies_areas: rule.satisfies_areas,
    // The rule's provenance governs: what matters is what THIS school accepts,
    // not what the exam claims to be worth.
    provenance: rule.provenance,
  };
}

/**
 * Credits the target institution will actually honour.
 *
 * The refusal gate is the whole point of the product: a student can hold a
 * pile of CLEP credit that a UC campus will not look at, and no amount of
 * course-level articulation data will tell them that.
 */
function candidatesFor(ds: Dataset, inst: Institution, profile: StudentProfile): PlanItem[] {
  const jur = jurisdictionFor(ds, inst);
  const items: PlanItem[] = [];
  for (const rule of ds.rules) {
    if (rule.institution_id !== inst.id) continue;
    const src = byId(ds.creditSources, rule.credit_source_id);
    if (!src) continue;
    if (!willLookAt(inst, src)) continue;
    items.push(toPlanItem(rule, src, profile, jur));
  }
  return items;
}

/**
 * Whether this campus will even look at credit of this kind.
 *
 * These are the most valuable rows in the dataset, because they are the ones a
 * student discovers too late: UC awards nothing for CLEP, nothing for DSST, and
 * nothing for credit posted to a third-party transcript. All of it is policy we
 * can point at, so it is enforced here rather than left to an acceptance rule
 * that happens not to exist — an absent rule means "we have no record", which
 * is a different sentence and a much weaker one.
 */
function willLookAt(inst: Institution, src: CreditSource): boolean {
  return !inst.refuses.includes(src.kind);
}

/**
 * Advice that depends on who the student is rather than where they are going.
 * Kept separate from the route constraints so it cannot drown them out.
 */
function profileWarnings(
  profile: StudentProfile,
  inst: Institution,
  jur: Jurisdiction,
  framework: GeFramework,
  routeCost: number,
): RouteWarning[] {
  const out: RouteWarning[] = [];

  if (profile.budget_usd !== null && routeCost > profile.budget_usd) {
    out.push({
      kind: 'budget_exceeded',
      message:
        `This route costs $${routeCost.toLocaleString('en-US')}, which is ` +
        `$${(routeCost - profile.budget_usd).toLocaleString('en-US')} over the ` +
        `$${profile.budget_usd.toLocaleString('en-US')} you set. The cheaper routes may fit.`,
    });
  }

  // The statewide guarantee, where the state has one. It is usually worth more
  // than every exam on the plan put together, and no campus page will tell a
  // student about it because it is not any one campus's to give.
  if (jur.transfer_guarantee !== null) {
    out.push({
      kind: 'opportunity',
      message: `${jur.name}: ${jur.transfer_guarantee}`,
      provenance: jur.transfer_provenance,
    });
  }

  // Still in high school: dual enrolment is the cheapest college credit there
  // is, and the programme — and whether it is free — is set by the state.
  const inSchool =
    profile.year === 'grade_9' || profile.year === 'grade_10' || profile.year === 'grade_11';
  if (inSchool && jur.dual_enrollment !== null) {
    out.push({
      kind: 'opportunity',
      message:
        `You are still in high school, so ${jur.dual_enrollment.name} is open to you. ` +
        `${jur.dual_enrollment.note} Ask your counsellor before you pay for any of the ` +
        'credit below.',
      provenance: jur.dual_enrollment.provenance,
    });
  } else if (inSchool) {
    out.push({
      kind: 'opportunity',
      message:
        'You are still in high school, so dual enrolment is almost certainly the cheapest ' +
        `credit available to you. We have not mapped ${jur.name}'s programme, so ask your ` +
        'counsellor what it is called and what it costs before paying for anything below.',
      provenance: jur.transfer_provenance,
    });
  }

  if (profile.waiver === 'unsure') {
    out.push({
      kind: 'opportunity',
      message:
        'Prices below assume you pay in full. ' +
        (jur.fee_waiver !== null
          ? `If you qualify for the ${jur.fee_waiver.name} it waives community-college ` +
            'fees entirely, and Modern States can cover CLEP exam fees. Both are worth ' +
            'ten minutes to check.'
          : `We know of no statewide community-college fee waiver in ${jur.name}, so the ` +
            'course prices below stand. Modern States can still cover CLEP exam fees, ' +
            'and your college may have its own aid — both are worth ten minutes to check.'),
      provenance: jur.fee_waiver?.provenance,
    });
  }

  if (profile.field === 'stem' || profile.field === 'health') {
    out.push({
      kind: 'major_sequence',
      message:
        `${profile.field === 'health' ? 'Health' : 'STEM'} majors run on locked course ` +
        'sequences that general-education planning cannot compress, and they often want ' +
        'higher exam scores than the general-education minimum. This plan covers ' +
        `${framework.name} only — it says nothing about your major requirements.`,
    });
  }

  return out;
}

/**
 * The framework areas this institution actually requires.
 *
 * This one line is what scopes a national dataset to one campus. Areas name the
 * systems that require them, so a Texas campus reaches only Texas Core areas
 * even though every state's areas share the array — no state filter, no
 * per-state dataset, and no way for the two to leak into each other.
 */
function areasRequiredBy(ds: Dataset, inst: Institution): GeArea[] {
  return ds.areas.filter(a => a.applies_to.includes(inst.system));
}

/** Areas the student still has to clear at this institution. */
function unmetAreas(ds: Dataset, inst: Institution, held: string[]): string[] {
  const cleared = new Set<string>();
  for (const rule of ds.rules) {
    if (rule.institution_id !== inst.id) continue;
    if (!held.includes(rule.credit_source_id)) continue;
    const src = byId(ds.creditSources, rule.credit_source_id);
    if (!src) continue;
    if (!willLookAt(inst, src)) continue; // held, but worthless here
    for (const area of rule.satisfies_areas) cleared.add(area);
  }
  return areasRequiredBy(ds, inst).map(a => a.id).filter(id => !cleared.has(id));
}

/**
 * What the credit a student already holds is actually worth here.
 *
 * Two distinct failures, and the second one is the easier to miss:
 *   - the school awards no credit for it at all;
 *   - the school awards credit, but it clears no general-education requirement.
 *
 * CLEP at a CSU is the second case. The campus "accepts" it — it counts toward
 * the degree, capped at 30 units — yet it cannot satisfy Cal-GETC, so a Californian student
 * planning their transfer around it clears nothing. Saying nothing here would
 * leave them believing a requirement was handled.
 */
function heldCreditWarnings(
  ds: Dataset,
  inst: Institution,
  framework: GeFramework,
  held: string[],
): RouteWarning[] {
  const out: RouteWarning[] = [];

  for (const id of held) {
    const src = byId(ds.creditSources, id);
    if (!src) continue;

    const rules = ds.rules.filter(
      r => r.institution_id === inst.id && r.credit_source_id === id,
    );

    if (rules.length === 0) {
      // We hold no rule for this pair. A campus that rejects CLEP outright is
      // explicit policy and can be stated; anything else, we simply do not know,
      // and saying "this campus counts it toward your degree" would be inventing
      // a policy on the student's behalf.
      if (!willLookAt(inst, src)) {
        out.push({
          kind: 'stranded_credit',
          message:
            src.kind === 'alt_provider'
              ? `${inst.name} does not award credit for anything posted to a third-party ` +
                `transcript, including ${src.name}. You already hold it; it will not count here.`
              : `${inst.name} does not award credit for ${src.name}. ` +
                `You already hold it; it will not count here.`,
          provenance: inst.exam_policy_provenance,
        });
      } else {
        out.push({
          kind: 'unverified_data',
          message:
            `We have no record of how ${inst.name} treats ${src.name}. ` +
            `Do not assume it counts — ask before you rely on it.`,
        });
      }
      continue;
    }

    // A rule exists. Does any of it clear something we are planning against?
    if (!rules.some(r => r.satisfies_areas.length > 0)) {
      out.push({
        kind: 'credit_not_toward_ge',
        message:
          `${inst.name} counts ${src.name} toward your degree, but it does not clear any ` +
          `${framework.name} requirement. You still have to satisfy that requirement ` +
          `another way.`,
        provenance: rules[0].provenance,
      });
    }
  }

  return out;
}

/**
 * Every credit this institution will accept for one requirement, cheapest first.
 * This is what the plan map offers when a student wants to change a choice.
 */
export function optionsForArea(
  ds: Dataset,
  input: StudentInput,
  areaId: string,
): PlanItem[] {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) return [];
  return candidatesFor(ds, inst, input.profile)
    .filter(c => c.satisfies_areas.includes(areaId))
    .sort((a, b) => a.cost_usd - b.cost_usd);
}

function pickPerArea(
  candidates: PlanItem[],
  areas: string[],
  rank: (a: PlanItem, b: PlanItem) => number,
  overrides: Record<string, AreaChoice>,
): { chosen: PlanItem[]; skipped: string[]; cleared: Set<string> } {
  const chosen: PlanItem[] = [];
  const skipped: string[] = [];
  const cleared = new Set<string>();
  /**
   * One exam, one use. AP English Literature clears 1A *or* 3B — the standard
   * offers a choice, not two credits — so spending it on both would build a plan
   * that cannot actually be executed.
   */
  const spent = new Set<string>();

  for (const area of areas) {
    // Already covered by an earlier pick that cleared several areas at once,
    // e.g. AP Biology carrying its own 5C laboratory.
    if (cleared.has(area)) continue;

    const override = overrides[area];
    if (override?.kind === 'skip') {
      skipped.push(area);
      continue;
    }

    const forArea = candidates.filter(
      c => c.satisfies_areas.includes(area) && !spent.has(c.credit_source_id),
    );

    let picked: PlanItem | undefined;
    if (override?.kind === 'use') {
      // A stale override — the student's choice is no longer offered here,
      // usually because they changed campus. Fall through to our own pick
      // rather than silently dropping the requirement.
      picked = forArea.find(c => c.credit_source_id === override.credit_source_id);
    }
    picked ??= [...forArea].sort(rank)[0];

    if (picked !== undefined) {
      chosen.push(picked);
      spent.add(picked.credit_source_id);
      for (const a of picked.satisfies_areas) cleared.add(a);
    }
  }

  return { chosen, skipped, cleared };
}

const RANKERS: Record<RouteKind, (a: PlanItem, b: PlanItem) => number> = {
  cheapest: (a, b) => a.cost_usd - b.cost_usd,
  fastest: (a, b) => {
    const ta = termsFor(a.kind), tb = termsFor(b.kind);
    return ta !== tb ? ta - tb : a.cost_usd - b.cost_usd;
  },
  // Cost is the tiebreak, never the driver: this route exists to be trustworthy.
  lowest_risk: (a, b) => a.cost_usd - b.cost_usd,
};

export function planRoute(ds: Dataset, input: StudentInput, kind: RouteKind): Route {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) throw new Error(`unknown institution: ${input.target_institution_id}`);

  let candidates = candidatesFor(ds, inst, input.profile);
  if (kind === 'lowest_risk') {
    candidates = candidates.filter(c => TRUSTED.has(c.provenance.confidence));
  }

  const areas = unmetAreas(ds, inst, input.held_credit_ids);
  const { chosen: items, skipped, cleared } = pickPerArea(
    candidates, areas, RANKERS[kind], input.plan_overrides ?? {},
  );

  // Only the areas this campus actually requires: a rule may clear something
  // that is not on this student's list, and counting it would inflate the plan.
  const areasCleared = areas.filter(a => cleared.has(a));
  const areasUnmet = areas.filter(a => !areasCleared.includes(a) && !skipped.includes(a));
  const totalUnits = items.reduce((n, i) => n + i.units, 0);

  const warnings: RouteWarning[] = [];

  const framework = frameworkFor(ds, inst);
  warnings.push(...heldCreditWarnings(ds, inst, framework, input.held_credit_ids));
  warnings.push(...profileWarnings(
    input.profile, inst, jurisdictionFor(ds, inst), framework,
    items.reduce((n, i) => n + i.cost_usd, 0),
  ));

  if (inst.max_transfer_units !== null && totalUnits > inst.max_transfer_units) {
    warnings.push({
      kind: 'transfer_cap',
      message:
        `This route transfers in ${totalUnits} units but ${inst.name} caps transfer credit ` +
        `at ${inst.max_transfer_units}. Units above the cap are lost.`,
      provenance: inst.transfer_cap_provenance,
    });
  }

  if (input.units_in_residence < inst.residency_min_units) {
    warnings.push({
      kind: 'residency',
      message:
        `${inst.name} requires at least ${inst.residency_min_units} units earned on campus to graduate. ` +
        `You have ${input.units_in_residence}. Transferring in more credit does not reduce this.`,
      provenance: inst.residency_provenance,
    });
  }

  // Unmet areas are reported through `areas_unmet`, which is structured data each
  // surface can render well. Emitting a warning saying the same thing made a
  // student read the same sentence twice on one screen.

  if (kind === 'lowest_risk' && areasCleared.length === 0 && areas.length > 0) {
    warnings.push({
      kind: 'unverified_data',
      message:
        `We have not yet confirmed any credit for ${inst.name} against its own published ` +
        `policy, so there is nothing here we would stake your money on. The other routes ` +
        `show what may be possible — treat them as questions for your advisor.`,
    });
  }

  return {
    kind,
    items,
    total_cost_usd: items.reduce((n, i) => n + i.cost_usd, 0),
    total_units: totalUnits,
    areas_cleared: areasCleared,
    areas_unmet: areasUnmet,
    areas_skipped: skipped,
    warnings,
  };
}

export const planAllRoutes = (ds: Dataset, input: StudentInput): Route[] =>
  (['cheapest', 'fastest', 'lowest_risk'] as RouteKind[]).map(k => planRoute(ds, input, k));


/**
 * The do-nothing path: what the student pays to clear their remaining
 * requirements at the target institution's own per-unit rate, buying no
 * transfer credit at all.
 *
 * This is the number the saving is measured against, so it is deliberately
 * conservative — it prices only the areas the student still has to clear, not a
 * whole degree.
 */
export function baselineCost(ds: Dataset, input: StudentInput): number {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) throw new Error(`unknown institution: ${input.target_institution_id}`);

  const unmet = unmetAreas(ds, inst, input.held_credit_ids);
  const units = unmet.reduce((n, id) => n + (byId(ds.areas, id)?.required_units ?? 0), 0);
  return units * inst.cost_per_unit_usd;
}

/**
 * What a route actually saves: the price of the requirements it clears, minus
 * what the route costs.
 *
 * NOT `baseline - route.total_cost_usd`. That subtraction credits a route for
 * requirements it never touched, and it fails hardest exactly where it matters —
 * an empty route (nothing confirmed enough to recommend) came out showing the
 * LARGEST saving of the three, because it spent nothing. A card reading
 * "saves $9,933" above a plan that clears nothing is the most misleading thing
 * this app could put on screen.
 */
export function routeSaving(ds: Dataset, input: StudentInput, route: Route): number {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) throw new Error(`unknown institution: ${input.target_institution_id}`);

  const clearedUnits = route.areas_cleared.reduce(
    (n, id) => n + (byId(ds.areas, id)?.required_units ?? 0),
    0,
  );
  const avoided = clearedUnits * inst.cost_per_unit_usd;
  return Math.max(0, avoided - route.total_cost_usd);
}

export interface PathwayCost {
  kind: CreditKind;
  /** Requirements this pathway alone could clear at the target campus. */
  areas_covered: number;
  areas_required: number;
  total_cost_usd: number;
}

/**
 * What each kind of credit would cost if a student leaned on it alone.
 *
 * This is what turns "dual enrolment is cheap" from a slogan into a number they
 * can act on: it prices THEIR requirements at THIS campus, and says plainly how
 * many of them each route can and cannot reach. No single route clears
 * everything, which is the point — they stack.
 */
export function pathwayCosts(ds: Dataset, input: StudentInput): PathwayCost[] {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) return [];

  const required = unmetAreas(ds, inst, input.held_credit_ids);
  const candidates = candidatesFor(ds, inst, input.profile);
  const kinds: CreditKind[] = ['ap', 'ib', 'cc_course', 'clep', 'dsst', 'alt_provider'];

  return kinds.map(kind => {
    let covered = 0;
    let total = 0;
    const seen = new Set<string>();
    const spentHere = new Set<string>();
    for (const area of required) {
      if (seen.has(area)) continue; // cleared by an earlier multi-area pick
      const forArea = candidates
        .filter(c => c.satisfies_areas.includes(area) && c.kind === kind
          && !spentHere.has(c.credit_source_id))
        .sort((a, b) => a.cost_usd - b.cost_usd);
      const best = forArea[0];
      if (best !== undefined) {
        // Charged once even when it clears two requirements.
        spentHere.add(best.credit_source_id);
        total += best.cost_usd;
        for (const a of best.satisfies_areas) {
          // Guard against counting an area twice when two picks overlap on it.
          if (required.includes(a) && !seen.has(a)) { seen.add(a); covered += 1; }
        }
      }
    }
    return {
      kind,
      areas_covered: covered,
      areas_required: required.length,
      total_cost_usd: total,
    };
  });
}
