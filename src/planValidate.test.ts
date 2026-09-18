import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStudentInput } from './planValidate.ts';

const VALID = {
  profile: { year: 'grade_12', field: 'stem', budget_usd: null, waiver: 'unsure' },
  target_institution_id: 'uc-davis',
  held_credit_ids: ['ap-biology'],
  units_in_residence: 0,
};

test('a well-formed saved plan is accepted', () => {
  assert.equal(isStudentInput(VALID), true);
  assert.equal(isStudentInput({ ...VALID, plan_overrides: {} }), true);
  assert.equal(isStudentInput({
    ...VALID,
    plan_overrides: { '2': { kind: 'use', credit_source_id: 'ap-calculus-ab' }, '4': { kind: 'skip' } },
  }), true);
});

test('anything malformed is rejected rather than trusted', () => {
  // Storage holds whatever an older build, a crash, or a user wrote. A bad
  // payload that type-asserts its way in would crash the screen rendering it.
  const bad: unknown[] = [
    null, undefined, 'a string', 42, [],
    { ...VALID, target_institution_id: 123 },
    { ...VALID, held_credit_ids: 'not-an-array' },
    { ...VALID, held_credit_ids: [1, 2] },
    { ...VALID, units_in_residence: 'thirty' },
    { ...VALID, units_in_residence: NaN },
    { ...VALID, units_in_residence: Infinity },
    { ...VALID, profile: null },
    { ...VALID, profile: { ...VALID.profile, year: 7 } },
    { ...VALID, profile: { ...VALID.profile, budget_usd: 'lots' } },
    { ...VALID, plan_overrides: null },
    { ...VALID, plan_overrides: { '2': { kind: 'use' } } },
    { ...VALID, plan_overrides: { '2': { kind: 'nonsense' } } },
    { ...VALID, plan_overrides: { '2': 'use' } },
  ];
  for (const v of bad) {
    assert.equal(isStudentInput(v), false, `accepted bad payload: ${JSON.stringify(v)}`);
  }
});

test('a budget of null is allowed but a missing profile is not', () => {
  assert.equal(isStudentInput({ ...VALID, profile: { ...VALID.profile, budget_usd: null } }), true);
  const { profile, ...noProfile } = VALID;
  assert.equal(isStudentInput(noProfile), false);
});
