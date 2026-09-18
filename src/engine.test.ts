import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planRoute, planAllRoutes } from './engine.ts';
import { loadCalifornia } from './load.ts';

const ds = loadCalifornia();

test('CLEP credit is excluded at a UC campus that does not accept it', () => {
  const route = planRoute(ds, {
    target_institution_id: 'uc-berkeley',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'cheapest');

  assert.equal(
    route.items.some(i => i.credit_source_id.startsWith('clep-')),
    false,
    'no CLEP item may appear in a UC route',
  );
});

test('holding CLEP credit for a UC target produces a stranded-credit warning', () => {
  const route = planRoute(ds, {
    target_institution_id: 'uc-berkeley',
    held_credit_ids: ['clep-college-composition', 'clep-college-algebra'],
    units_in_residence: 30,
  }, 'cheapest');

  const stranded = route.warnings.filter(w => w.includes('does not award credit'));
  assert.equal(stranded.length, 2, 'each stranded CLEP credit warns separately');
  assert.match(stranded[0], /will not count here/);
});

test('held CLEP credit does NOT clear an area at a UC campus', () => {
  // The trap: a student believes area 1A is done. It is not.
  const route = planRoute(ds, {
    target_institution_id: 'uc-berkeley',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.ok(
    route.items.some(i => i.satisfies_area === '1A'),
    'area 1A must still be planned for, since the CLEP credit is worthless here',
  );
});

test('the same CLEP credit does clear an area at a CSU campus', () => {
  const route = planRoute(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.equal(
    route.items.some(i => i.satisfies_area === '1A'),
    false,
    'area 1A is already cleared, so nothing should be planned for it',
  );
});

test('cheapest route picks the lowest-cost option for an area', () => {
  const route = planRoute(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'cheapest');

  const area2 = route.items.find(i => i.satisfies_area === '2');
  // In the seeded data the CLEP fee undercuts CCC enrolment fees. That ordering
  // is data, not logic — the synthetic test below pins the logic itself.
  assert.equal(area2?.credit_source_id, 'clep-college-algebra');
});

test('cheapest and fastest diverge when the cheap option costs a term', () => {
  // Synthetic: the course is cheaper but takes a term; the exam is instant.
  // This is the real-world case once a fee waiver (California College Promise
  // Grant) or a Modern States voucher shifts the cost ordering.
  const synthetic = {
    institutions: [{
      id: 'x', name: 'X', system: 'CSU' as const, residency_min_units: 0,
      max_transfer_units: null, accepts_clep: true,
      provenance: { source_url: '', as_of: '', confidence: 'published' as const },
    }],
    areas: [{ id: '2', name: 'Math', required_units: 3 }],
    creditSources: [
      { id: 'clep-fast', kind: 'clep' as const, name: 'Exam', cost_usd: 95,
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
      { id: 'ccc-cheap', kind: 'ccc_course' as const, name: 'Course', cost_usd: 0,
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
    ],
    rules: [
      { institution_id: 'x', credit_source_id: 'clep-fast', min_score: 50,
        units_granted: 3, satisfies_area: '2',
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
      { institution_id: 'x', credit_source_id: 'ccc-cheap', min_score: null,
        units_granted: 3, satisfies_area: '2',
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
    ],
  };

  const input = { target_institution_id: 'x', held_credit_ids: [], units_in_residence: 0 };
  assert.equal(planRoute(synthetic, input, 'cheapest').items[0].credit_source_id, 'ccc-cheap');
  assert.equal(planRoute(synthetic, input, 'fastest').items[0].credit_source_id, 'clep-fast');
});

test('fastest route prefers the exam over a term-long course', () => {
  const route = planRoute(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'fastest');

  const area2 = route.items.find(i => i.satisfies_area === '2');
  assert.equal(area2?.credit_source_id, 'clep-college-algebra', 'exam costs zero terms');
});

test('residency shortfall is reported and cannot be transferred away', () => {
  const route = planRoute(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 12,
  }, 'cheapest');

  assert.ok(route.warnings.some(w => /requires at least 30 units earned on campus/.test(w)));
});

test('lowest-risk route refuses to stake anything on unverified data', () => {
  const route = planRoute(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'lowest_risk');

  // Every seeded row is currently `unverified`, so this route must be empty and
  // must say so. When the dataset is verified this test's meaning inverts.
  assert.equal(route.items.length, 0, 'nothing is trustworthy yet');
  assert.ok(route.areas_unmet.length > 0);
});

test('all three routes are produced and are internally consistent', () => {
  const routes = planAllRoutes(ds, {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  });

  assert.equal(routes.length, 3);
  for (const r of routes) {
    assert.equal(r.total_cost_usd, r.items.reduce((n, i) => n + i.cost_usd, 0));
    assert.equal(r.total_units, r.items.reduce((n, i) => n + i.units, 0));
    assert.equal(r.areas_cleared.length, r.items.length);
  }
});
