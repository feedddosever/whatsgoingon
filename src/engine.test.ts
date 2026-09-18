import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planRoute, planAllRoutes, baselineCost } from './engine.ts';
import { california } from './dataset.ts';

const ds = california;

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

  const stranded = route.warnings.filter(w => w.kind === 'stranded_credit');
  assert.equal(stranded.length, 2, 'each stranded CLEP credit warns separately');
  assert.match(stranded[0].message, /will not count here/);
  assert.ok(stranded[0].provenance, 'a stranded warning carries the row it rests on');
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
      cost_per_unit_usd: 400, max_transfer_units: null, accepts_clep: true,
      provenance: { source_url: '', as_of: '', confidence: 'published' as const },
    }],
    areas: [{ id: '2', name: 'Math', required_units: 3,
      provenance: { source_url: '', as_of: '', confidence: 'published' as const } }],
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

  assert.ok(route.warnings.some(w => w.kind === 'residency'));
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

test('no warning leaks developer-facing language to a student', () => {
  // The lowest-risk route once told students the "dataset is not ready to ship".
  const leaks = /ship|dataset|unverified row|TODO|FIXME/i;
  for (const id of ['uc-berkeley', 'csu-long-beach']) {
    for (const r of planAllRoutes(ds, {
      target_institution_id: id, held_credit_ids: [], units_in_residence: 0,
    })) {
      for (const w of r.warnings) {
        assert.ok(!leaks.test(w.message), `developer language in: ${w.message}`);
      }
    }
  }
});

test('baseline prices only the areas still unmet, at the school\'s own rate', () => {
  const input = {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  };
  const all = baselineCost(ds, input);
  assert.ok(all > 0, 'a student with no credit faces the full bill');

  // Clearing an area must reduce the baseline by exactly that area's units.
  const withCredit = baselineCost(ds, {
    ...input, held_credit_ids: ['clep-college-composition'],
  });
  const inst = ds.institutions.find(i => i.id === 'csu-long-beach')!;
  const area1A = ds.areas.find(a => a.id === '1A')!;
  assert.equal(all - withCredit, area1A.required_units * inst.cost_per_unit_usd);
});

test('a saving is never negative — routes cost less than doing nothing', () => {
  const input = {
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  };
  const base = baselineCost(ds, input);
  for (const r of planAllRoutes(ds, input)) {
    assert.ok(r.total_cost_usd <= base, `${r.kind} costs more than doing nothing`);
  }
});
