import type {
  AcceptanceRule, GeArea, Institution, CreditSource,
  PlanItem, Route, RouteKind, RouteWarning, StudentInput,
} from './types.ts';

export interface Dataset {
  institutions: Institution[];
  areas: GeArea[];
  creditSources: CreditSource[];
  rules: AcceptanceRule[];
}

/** Confidence levels the lowest-risk route is willing to stake a student's money on. */
const TRUSTED = new Set(['statute', 'published']);

const byId = <T extends { id: string }>(xs: T[], id: string): T | undefined =>
  xs.find(x => x.id === id);

/** A CLEP exam is instant; a community college course costs you a term. */
const termsFor = (kind: CreditSource['kind']): number => (kind === 'ccc_course' ? 1 : 0);

function toPlanItem(rule: AcceptanceRule, src: CreditSource): PlanItem {
  return {
    credit_source_id: src.id,
    label: src.name,
    cost_usd: src.cost_usd,
    units: rule.units_granted,
    satisfies_area: rule.satisfies_area,
    // The rule's provenance governs: what matters is what THIS school accepts,
    // not what the exam claims to be worth.
    provenance: rule.provenance,
  };
}

/**
 * Credits the target institution will actually honour.
 *
 * The `accepts_clep` gate is the whole point of the product: a student can hold a
 * pile of CLEP credit that a UC campus will not look at, and no amount of
 * course-level articulation data will tell them that.
 */
function candidatesFor(ds: Dataset, inst: Institution): PlanItem[] {
  const items: PlanItem[] = [];
  for (const rule of ds.rules) {
    if (rule.institution_id !== inst.id) continue;
    const src = byId(ds.creditSources, rule.credit_source_id);
    if (!src) continue;
    if (src.kind === 'clep' && !inst.accepts_clep) continue;
    items.push(toPlanItem(rule, src));
  }
  return items;
}

/** The Cal-GETC areas this institution actually requires. */
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
    if (src.kind === 'clep' && !inst.accepts_clep) continue; // held, but worthless here
    if (rule.satisfies_area) cleared.add(rule.satisfies_area);
  }
  return areasRequiredBy(ds, inst).map(a => a.id).filter(id => !cleared.has(id));
}

/**
 * What the credit a student already holds is actually worth here.
 *
 * Two distinct failures, and the second one is the easier to miss:
 *   - the school awards no credit for it at all;
 *   - the school awards credit, but it clears no Cal-GETC requirement.
 *
 * CLEP at a CSU is the second case. The campus "accepts" it — it counts toward
 * the degree, capped at 30 units — yet it cannot satisfy Cal-GETC, so a student
 * planning their transfer around it clears nothing. Saying nothing here would
 * leave them believing a requirement was handled.
 */
function heldCreditWarnings(
  ds: Dataset,
  inst: Institution,
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
      if (src.kind === 'clep' && !inst.accepts_clep) {
        out.push({
          kind: 'stranded_credit',
          message:
            `${inst.name} does not award credit for ${src.name}. ` +
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
    if (!rules.some(r => r.satisfies_area !== null)) {
      out.push({
        kind: 'credit_not_toward_ge',
        message:
          `${inst.name} counts ${src.name} toward your degree, but it does not clear any ` +
          `Cal-GETC requirement. You still have to satisfy that requirement another way.`,
        provenance: rules[0].provenance,
      });
    }
  }

  return out;
}

function pickPerArea(
  candidates: PlanItem[],
  areas: string[],
  rank: (a: PlanItem, b: PlanItem) => number,
): PlanItem[] {
  const chosen: PlanItem[] = [];
  for (const area of areas) {
    const forArea = candidates.filter(c => c.satisfies_area === area).sort(rank);
    if (forArea.length > 0) chosen.push(forArea[0]);
  }
  return chosen;
}

const RANKERS: Record<RouteKind, (a: PlanItem, b: PlanItem) => number> = {
  cheapest: (a, b) => a.cost_usd - b.cost_usd,
  fastest: (a, b) => {
    const ta = termsFor(inferKind(a)), tb = termsFor(inferKind(b));
    return ta !== tb ? ta - tb : a.cost_usd - b.cost_usd;
  },
  // Cost is the tiebreak, never the driver: this route exists to be trustworthy.
  lowest_risk: (a, b) => a.cost_usd - b.cost_usd,
};

/** Credit kind is recoverable from the id prefix the dataset uses. */
function inferKind(item: PlanItem): CreditSource['kind'] {
  if (item.credit_source_id.startsWith('clep-')) return 'clep';
  if (item.credit_source_id.startsWith('ap-')) return 'ap';
  return 'ccc_course';
}

export function planRoute(ds: Dataset, input: StudentInput, kind: RouteKind): Route {
  const inst = byId(ds.institutions, input.target_institution_id);
  if (!inst) throw new Error(`unknown institution: ${input.target_institution_id}`);

  let candidates = candidatesFor(ds, inst);
  if (kind === 'lowest_risk') {
    candidates = candidates.filter(c => TRUSTED.has(c.provenance.confidence));
  }

  const areas = unmetAreas(ds, inst, input.held_credit_ids);
  const items = pickPerArea(candidates, areas, RANKERS[kind]);

  const areasCleared = items.map(i => i.satisfies_area).filter((a): a is string => a !== null);
  const areasUnmet = areas.filter(a => !areasCleared.includes(a));
  const totalUnits = items.reduce((n, i) => n + i.units, 0);

  const warnings: RouteWarning[] = [];

  warnings.push(...heldCreditWarnings(ds, inst, input.held_credit_ids));

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
