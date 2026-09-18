import type { AreaChoice, StudentInput } from './types.ts';

/**
 * Anything can be in storage — an older build, a half-written value, something
 * a user edited by hand. Validate rather than trust, because a malformed plan
 * that type-asserts its way in would crash the screen that renders it.
 */
export function isStudentInput(v: unknown): v is StudentInput {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;

  if (typeof o.target_institution_id !== 'string') return false;
  if (!Array.isArray(o.held_credit_ids)) return false;
  if (!o.held_credit_ids.every(x => typeof x === 'string')) return false;
  if (typeof o.units_in_residence !== 'number' || !Number.isFinite(o.units_in_residence)) return false;

  const p = o.profile;
  if (typeof p !== 'object' || p === null) return false;
  const prof = p as Record<string, unknown>;
  if (typeof prof.year !== 'string' || typeof prof.field !== 'string') return false;
  if (typeof prof.waiver !== 'string') return false;
  if (prof.budget_usd !== null && typeof prof.budget_usd !== 'number') return false;

  if (o.plan_overrides !== undefined) {
    if (typeof o.plan_overrides !== 'object' || o.plan_overrides === null) return false;
    for (const choice of Object.values(o.plan_overrides as Record<string, unknown>)) {
      if (typeof choice !== 'object' || choice === null) return false;
      const c = choice as Partial<AreaChoice>;
      if (c.kind === 'use') {
        if (typeof (c as { credit_source_id?: unknown }).credit_source_id !== 'string') return false;
      } else if (c.kind !== 'skip') {
        return false;
      }
    }
  }

  return true;
}

