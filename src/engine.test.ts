import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  planRoute, planAllRoutes, baselineCost, routeSaving, optionsForArea, pathwayCosts,
  effectiveCost, frameworkFor, jurisdictionFor, systemFor,
} from './engine.ts';
import { california, unitedStates } from './dataset.ts';
import type { StudentProfile } from './types.ts';

const ds = california;
const us = unitedStates;

/** A neutral profile: nothing waived, no budget, nothing field-specific. */
const PLAIN: StudentProfile = {
  year: 'in_college', field: 'undecided', budget_usd: null, waiver: 'not_eligible',
};
const withProfile = (p: Partial<StudentProfile> = {}): StudentProfile => ({ ...PLAIN, ...p });


test('CLEP credit is excluded at a UC campus that does not accept it', () => {
  const route = planRoute(ds, { profile: PLAIN,
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
  const route = planRoute(ds, { profile: PLAIN,
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
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'uc-berkeley',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.ok(
    route.items.some(i => i.satisfies_areas.includes('1A')),
    'area 1A must still be planned for, since the CLEP credit is worthless here',
  );
});

test('CLEP clears no Cal-GETC area at ANY institution', () => {
  // CLEP cannot be used for Cal-GETC. CSU counts it toward a degree (capped at
  // 30 units); UC awards it nothing. Neither clears a GE transfer requirement,
  // so no CLEP row may ever be planned against an area.
  for (const inst of ds.institutions) {
    for (const rule of ds.rules) {
      if (rule.institution_id !== inst.id) continue;
      if (!rule.credit_source_id.startsWith('clep-')) continue;
      assert.deepEqual(
        rule.satisfies_areas, [],
        `${rule.credit_source_id} claims ${rule.satisfies_areas.join()} at ${inst.name}`,
      );
    }
  }
});

test('holding CLEP does not clear an area even at a CSU campus', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.ok(
    route.items.some(i => i.satisfies_areas.includes('1A')),
    'area 1A is still unmet — the CLEP credit did not clear it',
  );
});

test('AP clears Cal-GETC areas at both UC and CSU', () => {
  for (const id of ['uc-berkeley', 'csu-long-beach']) {
    const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: id, held_credit_ids: ['ap-english-lang'], units_in_residence: 30,
    }, 'cheapest');
    assert.equal(
      route.items.some(i => i.satisfies_areas.includes('1A')), false,
      `AP should have cleared area 1A at ${id}`,
    );
  }
});

test('Cal-GETC area 1C is offered at CSU but not at UC', () => {
  // Oral Communication is a CSU-only requirement under Cal-GETC.
  const has1C = (inst: string) =>
    ds.rules.some(r => r.institution_id === inst && r.satisfies_areas.includes('1C'));
  assert.equal(has1C('csu-long-beach'), true);
  assert.equal(has1C('uc-berkeley'), false);
});

test('cheapest route picks the lowest-cost option for an area', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'cheapest');

  const area2 = route.items.find(i => i.satisfies_areas.includes('2'));
  // AP ($99) undercuts the CCC course ($138), and CLEP is not a candidate at all
  // because it cannot clear a Cal-GETC area. That ordering is data, not logic —
  // the synthetic test below pins the logic itself.
  assert.equal(area2?.credit_source_id, 'ap-calculus-ab');
});

test('cheapest and fastest diverge when the cheap option costs a term', () => {
  // Synthetic: the course is cheaper but takes a term; the exam is instant.
  // This is the real-world case once a fee waiver (California College Promise
  // Grant) or a Modern States voucher shifts the cost ordering.
  const synthetic = {
    jurisdictions: [{
      code: 'CA' as const, name: 'Test', framework_id: 'f',
      statewide_framework: 'unknown' as const, transfer_guarantee: null,
      transfer_provenance: { source_url: '', as_of: '', confidence: 'published' as const },
      fee_waiver: null, dual_enrollment: null,
    }],
    frameworks: [{
      id: 'f', name: 'F', full_name: 'Framework', state: 'CA' as const, total_units: 3,
      provenance: { source_url: '', as_of: '', confidence: 'published' as const },
    }],
    systems: [{
      id: 'CSU', name: 'Test system', short_name: 'CSU', state: 'CA' as const,
      framework_id: 'f',
    }],
    institutions: [{
      id: 'x', name: 'X', system: 'CSU' as const, residency_min_units: 0,
      cost_per_unit_usd: 400, max_transfer_units: null, refuses: [],
      cost_provenance: { source_url: '', as_of: '', confidence: 'published' as const },
      exam_policy_provenance: { source_url: '', as_of: '', confidence: 'published' as const },
      residency_provenance: { source_url: '', as_of: '', confidence: 'published' as const },
      transfer_cap_provenance: { source_url: '', as_of: '', confidence: 'published' as const },
    }],
    areas: [{ id: '2', name: 'Math', required_units: 3, framework_id: 'f',
      applies_to: ['CSU' as const],
      provenance: { source_url: '', as_of: '', confidence: 'published' as const } }],
    creditSources: [
      { id: 'clep-fast', kind: 'clep' as const, name: 'Exam', cost_usd: 95,
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
      { id: 'ccc-cheap', kind: 'cc_course' as const, name: 'Course', cost_usd: 0,
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
    ],
    rules: [
      { institution_id: 'x', credit_source_id: 'clep-fast', min_score: 50,
        units_granted: 3, satisfies_areas: ['2'],
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
      { institution_id: 'x', credit_source_id: 'ccc-cheap', min_score: null,
        units_granted: 3, satisfies_areas: ['2'],
        provenance: { source_url: '', as_of: '', confidence: 'published' as const } },
    ],
  };

  const input = { profile: PLAIN, target_institution_id: 'x', held_credit_ids: [], units_in_residence: 0 };
  assert.equal(planRoute(synthetic, input, 'cheapest').items[0].credit_source_id, 'ccc-cheap');
  assert.equal(planRoute(synthetic, input, 'fastest').items[0].credit_source_id, 'clep-fast');
});

test('fastest route prefers the exam over a term-long course', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'fastest');

  const area2 = route.items.find(i => i.satisfies_areas.includes('2'));
  assert.equal(area2?.credit_source_id, 'ap-calculus-ab', 'an exam costs zero terms');
});

test('residency shortfall is reported and cannot be transferred away', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 12,
  }, 'cheapest');

  assert.ok(route.warnings.some(w => w.kind === 'residency'));
});

test('lowest-risk route stakes nothing on unconfirmed data', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  }, 'lowest_risk');

  // The invariant is "everything here is backed", NOT "there is something here".
  // An empty safe route is a truthful answer when nothing is confirmed yet, and
  // the student must be told why rather than shown a blank screen.
  for (const item of route.items) {
    assert.ok(
      item.provenance.confidence === 'statute' || item.provenance.confidence === 'published',
      `${item.credit_source_id} is ${item.provenance.confidence} and must not appear here`,
    );
  }

  if (route.items.length === 0) {
    assert.ok(
      route.warnings.some(w => w.kind === 'unverified_data'),
      'an empty safe route must explain itself',
    );
  }
});

test('lowest-risk never beats cheapest on the areas they both clear', () => {
  // Comparing route TOTALS is meaningless: lowest-risk can look cheaper purely
  // because it covers fewer areas. Certainty costs money, so the real invariant
  // is per-area — and this is also why a route card must never show cost without
  // showing coverage next to it.
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const cheapest = planRoute(ds, input, 'cheapest');
  const safest = planRoute(ds, input, 'lowest_risk');

  assert.ok(safest.areas_cleared.length < cheapest.areas_cleared.length,
    'with unconfirmed rows excluded, the safe route should cover less');

  for (const item of safest.items) {
    const rival = cheapest.items.find(i => i.satisfies_areas.some(a => item.satisfies_areas.includes(a)));
    assert.ok(rival, `cheapest should also clear ${item.satisfies_areas.join('+')}`);
    assert.ok(item.cost_usd >= rival.cost_usd,
      `safe pick for ${item.satisfies_areas.join('+')} undercuts the cheapest pick`);
  }
});

test('all three routes are produced and are internally consistent', () => {
  const routes = planAllRoutes(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  });

  assert.equal(routes.length, 3);
  for (const r of routes) {
    assert.equal(r.total_cost_usd, r.items.reduce((n, i) => n + i.cost_usd, 0));
    assert.equal(r.total_units, r.items.reduce((n, i) => n + i.units, 0));
    // NOT one area per item: a science exam clears its area and the 5C
    // laboratory in one sitting, so cleared areas can outnumber items.
    assert.ok(r.areas_cleared.length >= r.items.length);
    assert.equal(new Set(r.areas_cleared).size, r.areas_cleared.length,
      'an area must not be reported cleared twice');
    assert.equal(
      new Set(r.items.map(i => i.credit_source_id)).size, r.items.length,
      'the same credit must never be spent twice in one route',
    );
  }
});

test('no warning leaks developer-facing language to a student', () => {
  // The lowest-risk route once told students the "dataset is not ready to ship".
  const leaks = /ship|dataset|unverified row|TODO|FIXME/i;
  for (const id of ['uc-berkeley', 'csu-long-beach']) {
    for (const r of planAllRoutes(ds, { profile: PLAIN,
    target_institution_id: id, held_credit_ids: [], units_in_residence: 0,
    })) {
      for (const w of r.warnings) {
        assert.ok(!leaks.test(w.message), `developer language in: ${w.message}`);
      }
    }
  }
});

test('baseline prices only the areas still unmet, at the school\'s own rate', () => {
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  };
  const all = baselineCost(ds, input);
  assert.ok(all > 0, 'a student with no credit faces the full bill');

  // Clearing an area must reduce the baseline by exactly that area's units.
  const withCredit = baselineCost(ds, {
    ...input, held_credit_ids: ['ap-english-lang'],
  });
  const inst = ds.institutions.find(i => i.id === 'csu-long-beach')!;
  const area1A = ds.areas.find(a => a.id === '1A')!;
  assert.equal(all - withCredit, area1A.required_units * inst.cost_per_unit_usd);
});

test('a saving is never negative — routes cost less than doing nothing', () => {
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: [],
    units_in_residence: 30,
  };
  const base = baselineCost(ds, input);
  for (const r of planAllRoutes(ds, input)) {
    assert.ok(r.total_cost_usd <= base, `${r.kind} costs more than doing nothing`);
  }
});

test('a warning cites the row it actually rests on, not the row next to it', () => {
  // Institution provenance is per claim. A residency warning must not borrow the
  // exam policy's confirmed status — that would badge an unchecked number
  // "Published policy".
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'uc-berkeley',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 0,
  }, 'cheapest');

  const inst = ds.institutions.find(i => i.id === 'uc-berkeley')!;

  const stranded = route.warnings.find(w => w.kind === 'stranded_credit');
  assert.equal(stranded?.provenance, inst.exam_policy_provenance);
  assert.equal(stranded?.provenance?.confidence, 'published');

  const residency = route.warnings.find(w => w.kind === 'residency');
  assert.equal(residency?.provenance, inst.residency_provenance);
  assert.equal(residency?.provenance?.confidence, 'needs_check',
    'the residency figure is unconfirmed and must not claim otherwise');
});

test('CLEP held against a CSU warns that it clears no Cal-GETC requirement', () => {
  // The quiet failure: the campus accepts the credit, so nothing looks wrong,
  // but it satisfies no requirement the student is planning against.
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  const w = route.warnings.find(x => x.kind === 'credit_not_toward_ge');
  assert.ok(w, 'a CSU student holding CLEP must be told it clears no Cal-GETC area');
  assert.match(w.message, /does not clear any Cal-GETC requirement/);

  // And it must NOT be reported as stranded — CSU does count it toward the degree.
  assert.equal(route.warnings.some(x => x.kind === 'stranded_credit'), false);
});

test('AP held against a CSU raises no credit warning at all', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: ['ap-english-lang'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.equal(
    route.warnings.some(w => w.kind === 'stranded_credit' || w.kind === 'credit_not_toward_ge'),
    false,
    'AP clears a Cal-GETC area, so there is nothing to warn about',
  );
});

test('the app never invents a policy it has no record of', () => {
  // ccc-comm-1 (Cal-GETC area 1C) has rules only at the CSU campuses, because 1C
  // is a CSU-only requirement. Holding it against a UC target must NOT produce
  // "UC Berkeley counts CCC Communication Studies 1 toward your degree" — nothing
  // in the dataset says that, and asserting it is exactly the certainty this
  // product must never imply.
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'uc-berkeley',
    held_credit_ids: ['ccc-comm-1'],
    units_in_residence: 30,
  }, 'cheapest');

  assert.equal(
    route.warnings.some(w => w.kind === 'credit_not_toward_ge'), false,
    'no rule exists for this pair, so no claim may be made about what it counts for',
  );

  const unknown = route.warnings.find(w => w.kind === 'unverified_data');
  assert.ok(unknown, 'the student should be told we have no record');
  assert.match(unknown.message, /no record of how/);
});

test('credit_not_toward_ge cites the rule that backs it, not the campus row', () => {
  const route = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach',
    held_credit_ids: ['clep-college-composition'],
    units_in_residence: 30,
  }, 'cheapest');

  const w = route.warnings.find(x => x.kind === 'credit_not_toward_ge');
  const rule = ds.rules.find(
    r => r.institution_id === 'csu-long-beach' && r.credit_source_id === 'clep-college-composition',
  );
  assert.equal(w?.provenance, rule?.provenance);
});

test('an unconfirmed row never carries a source link that cannot answer it', () => {
  // A residency badge linking to the exam-policy page sends a student to a page
  // that does not mention residency. Blank is honest; a wrong link is not.
  for (const inst of ds.institutions) {
    for (const p of [inst.residency_provenance, inst.transfer_cap_provenance]) {
      if (p.confidence === 'needs_check' || p.confidence === 'unverified') {
        assert.equal(p.source_url, '', `${inst.name} links an unconfirmed claim to a source`);
      }
    }
  }
});

test('a route that clears nothing saves nothing', () => {
  // The trap: saving computed as (baseline - route cost) credits a route for
  // requirements it never touched, so the empty safe route showed the biggest
  // number on screen.
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const safest = planRoute(ds, input, 'lowest_risk');
  if (safest.items.length === 0) {
    assert.equal(routeSaving(ds, input, safest), 0);
    assert.ok(baselineCost(ds, input) > 0, 'and it is not because the baseline is zero');
  }
});

test('saving is never more than the requirements a route actually clears', () => {
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const inst = ds.institutions.find(i => i.id === 'csu-long-beach')!;

  for (const r of planAllRoutes(ds, input)) {
    const clearedUnits = r.areas_cleared.reduce(
      (n, id) => n + (ds.areas.find(a => a.id === id)?.required_units ?? 0), 0);
    assert.ok(
      routeSaving(ds, input, r) <= clearedUnits * inst.cost_per_unit_usd,
      `${r.kind} claims a saving larger than the work it does`,
    );
    assert.ok(routeSaving(ds, input, r) >= 0, `${r.kind} reports a negative saving`);
  }
});

test('a fuller route saves more than a narrower one', () => {
  const input = { profile: PLAIN,
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const cheapest = planRoute(ds, input, 'cheapest');
  const safest = planRoute(ds, input, 'lowest_risk');
  if (safest.areas_cleared.length < cheapest.areas_cleared.length) {
    assert.ok(
      routeSaving(ds, input, cheapest) > routeSaving(ds, input, safest),
      'the route doing more work must not report the smaller saving',
    );
  }
});

test('a CSU-only requirement is not imposed on a UC student', () => {
  // Cal-GETC area 1C (Oral Communication) is a CSU requirement, not a UC one.
  // Listing it as unmet at a UC campus sends the student to solve something that
  // does not apply — and its units inflate their baseline, overstating the saving.
  const uc = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'uc-berkeley', held_credit_ids: [], units_in_residence: 30,
  }, 'cheapest');
  assert.equal(uc.areas_unmet.includes('1C'), false, '1C must not be required at UC');
  assert.equal(uc.areas_cleared.includes('1C'), false);

  const csu = planRoute(ds, { profile: PLAIN,
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  }, 'cheapest');
  assert.ok(
    csu.areas_cleared.includes('1C') || csu.areas_unmet.includes('1C'),
    '1C IS required at CSU and must appear somewhere',
  );
});

test('the baseline excludes requirements the campus does not impose', () => {
  const ucBase = baselineCost(ds, { profile: PLAIN,
    target_institution_id: 'uc-berkeley', held_credit_ids: [], units_in_residence: 30,
  });
  const inst = ds.institutions.find(i => i.id === 'uc-berkeley')!;
  const ucUnits = ds.areas
    .filter(a => a.applies_to.includes('UC'))
    .reduce((n, a) => n + a.required_units, 0);
  assert.equal(ucBase, ucUnits * inst.cost_per_unit_usd);

  const area1C = ds.areas.find(a => a.id === '1C')!;
  assert.equal(area1C.applies_to.includes('UC'), false, 'guards the premise of this test');
});

test('a fee waiver actually changes what the student pays', () => {
  const base = {
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const full = planRoute(ds, { ...base, profile: PLAIN }, 'cheapest');
  const waived = planRoute(
    ds, { ...base, profile: withProfile({ waiver: 'eligible' }) }, 'cheapest');

  assert.ok(full.total_cost_usd > 0, 'guards the premise');
  assert.ok(
    waived.total_cost_usd < full.total_cost_usd,
    'CCPG waives CCC fees and Modern States covers CLEP — the price must move',
  );
  for (const item of waived.items) {
    if (item.credit_source_id.startsWith('ccc-')) {
      assert.equal(item.cost_usd, 0, 'CCPG waives the community-college enrolment fee');
    }
  }
});

test('"unsure" pays full price but is told to check', () => {
  const input = {
    profile: withProfile({ waiver: 'unsure' }),
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const route = planRoute(ds, input, 'cheapest');
  const plain = planRoute(ds, { ...input, profile: PLAIN }, 'cheapest');

  assert.equal(route.total_cost_usd, plain.total_cost_usd,
    'we quote what they will be charged if the waiver does not come through');
  assert.ok(
    route.warnings.some(w => w.kind === 'opportunity' && /Promise Grant/.test(w.message)),
    'and we tell them it is worth checking',
  );
});

test('a budget is compared against what the route actually costs', () => {
  const base = {
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  const tight = planRoute(ds, { ...base, profile: withProfile({ budget_usd: 50 }) }, 'cheapest');
  assert.ok(tight.warnings.some(w => w.kind === 'budget_exceeded'));

  const roomy = planRoute(
    ds, { ...base, profile: withProfile({ budget_usd: 100000 }) }, 'cheapest');
  assert.equal(roomy.warnings.some(w => w.kind === 'budget_exceeded'), false);

  const unsaid = planRoute(ds, { ...base, profile: PLAIN }, 'cheapest');
  assert.equal(unsaid.warnings.some(w => w.kind === 'budget_exceeded'), false,
    'no budget given is not a budget of zero');
});

test('a high-schooler is told about dual enrolment; a college student is not', () => {
  const base = {
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  for (const year of ['grade_9', 'grade_10', 'grade_11'] as const) {
    const r = planRoute(ds, { ...base, profile: withProfile({ year }) }, 'cheapest');
    assert.ok(
      r.warnings.some(w => w.kind === 'opportunity' && /dual enrolment/i.test(w.message)),
      `${year} can still reach free college units`,
    );
  }
  const senior = planRoute(ds, { ...base, profile: withProfile({ year: 'in_college' }) }, 'cheapest');
  assert.equal(
    senior.warnings.some(w => /dual enrolment/i.test(w.message)), false,
    'already enrolled — that door has closed, do not waste their attention',
  );
});

test('locked-sequence fields get a caution; others are not nagged', () => {
  const base = {
    target_institution_id: 'csu-long-beach', held_credit_ids: [], units_in_residence: 30,
  };
  for (const field of ['stem', 'health'] as const) {
    const r = planRoute(ds, { ...base, profile: withProfile({ field }) }, 'cheapest');
    assert.ok(r.warnings.some(w => w.kind === 'major_sequence'));
  }
  for (const field of ['business', 'arts_humanities', 'undecided'] as const) {
    const r = planRoute(ds, { ...base, profile: withProfile({ field }) }, 'cheapest');
    assert.equal(r.warnings.some(w => w.kind === 'major_sequence'), false);
  }
});

test('every campus in the dataset can actually be planned for', () => {
  // A campus added to the list with no acceptance rules would render an app that
  // silently offers nothing at that school.
  assert.ok(ds.institutions.length >= 32, 'all UC and CSU campuses should be present');
  for (const inst of ds.institutions) {
    const route = planRoute(ds, {
      profile: PLAIN, target_institution_id: inst.id,
      held_credit_ids: [], units_in_residence: 30,
    }, 'cheapest');
    assert.ok(route.items.length > 0, `${inst.name} produced an empty plan`);
    assert.equal(route.areas_unmet.length, 0, `${inst.name} left requirements unmet`);
  }
});

test('a student can swap the credit used for a requirement', () => {
  const base = {
    profile: PLAIN, target_institution_id: 'csu-long-beach',
    held_credit_ids: [], units_in_residence: 30,
  };
  const options = optionsForArea(ds, base, '2');
  assert.ok(options.length > 1, 'area 2 should offer a choice');

  const ours = planRoute(ds, base, 'cheapest').items.find(i => i.satisfies_areas.includes('2'));
  const theirs = options.find(o => o.credit_source_id !== ours?.credit_source_id);
  assert.ok(theirs, 'guards the premise');

  const edited = planRoute(ds, {
    ...base,
    plan_overrides: { '2': { kind: 'use', credit_source_id: theirs.credit_source_id } },
  }, 'cheapest');

  const picked = edited.items.find(i => i.satisfies_areas.includes('2'));
  assert.equal(picked?.credit_source_id, theirs.credit_source_id);
  assert.equal(edited.areas_unmet.includes('2'), false, 'the requirement is still covered');
});

test('a skipped requirement is neither priced nor reported as unmet', () => {
  const base = {
    profile: PLAIN, target_institution_id: 'csu-long-beach',
    held_credit_ids: [], units_in_residence: 30,
  };
  const full = planRoute(ds, base, 'cheapest');
  const edited = planRoute(ds, { ...base, plan_overrides: { '2': { kind: 'skip' } } }, 'cheapest');

  assert.ok(edited.areas_skipped.includes('2'));
  assert.equal(edited.areas_unmet.includes('2'), false, 'skipping is a decision, not a gap');
  assert.equal(edited.items.some(i => i.satisfies_areas.includes('2')), false);
  assert.ok(edited.total_cost_usd < full.total_cost_usd, 'and it is not charged for');
});

test('an override that no longer applies falls back instead of dropping the area', () => {
  // The student picked something at a CSU, then switched to a UC where that
  // credit is not accepted. Dropping the requirement silently would be worse
  // than quietly re-planning it.
  const edited = planRoute(ds, {
    profile: PLAIN, target_institution_id: 'uc-berkeley',
    held_credit_ids: [], units_in_residence: 30,
    plan_overrides: { '1A': { kind: 'use', credit_source_id: 'clep-college-composition' } },
  }, 'cheapest');

  assert.ok(
    edited.items.some(i => i.satisfies_areas.includes('1A')),
    'area 1A must still be planned for',
  );
  assert.equal(
    edited.items.some(i => i.credit_source_id === 'clep-college-composition'), false,
    'and must not use credit this campus rejects',
  );
});

test('optionsForArea never offers credit the campus will not honour', () => {
  for (const inst of ds.institutions.filter(i => i.system === 'UC')) {
    for (const area of ds.areas) {
      for (const o of optionsForArea(ds, {
        profile: PLAIN, target_institution_id: inst.id,
        held_credit_ids: [], units_in_residence: 30,
      }, area.id)) {
        assert.ok(!o.credit_source_id.startsWith('clep-'), `${inst.name} offered CLEP`);
      }
    }
  }
});

test('pathway costs price a student\'s own requirements, per kind of credit', () => {
  const input = {
    profile: withProfile({ year: 'grade_10', waiver: 'eligible' }),
    target_institution_id: 'uc-davis', held_credit_ids: [], units_in_residence: 0,
  };
  const paths = pathwayCosts(ds, input);
  const byKind = new Map(paths.map(p => [p.kind, p]));

  // CLEP cannot satisfy Cal-GETC anywhere, so leaning on it alone clears
  // nothing. If this ever reports coverage, the CLEP rules have regressed.
  assert.equal(byKind.get('clep')?.areas_covered, 0);

  const ccc = byKind.get('cc_course');
  assert.ok(ccc && ccc.areas_covered > 0, 'community college should cover requirements');
  assert.equal(ccc.total_cost_usd, 0, 'and cost nothing for a fee-waiver student');

  const ap = byKind.get('ap');
  assert.ok(ap && ap.areas_covered > 0);
  assert.ok(ap.total_cost_usd > 0, 'AP exam fees are not waived by CCPG');

  for (const p of paths) {
    assert.ok(p.areas_covered <= p.areas_required, `${p.kind} covers more than exists`);
    assert.ok(p.total_cost_usd >= 0);
  }
});

test('no exam-only pathway clears everything', () => {
  // Community college can now cover every requirement — adding a Cal-GETC area 4
  // course closed the last gap, which is why a fee-waiver student reaches $0.
  // The substantive claim is narrower and still holds: exams alone cannot finish
  // the job, because no AP exam satisfies 1B or area 6 and CLEP satisfies
  // nothing. A student told otherwise would stop looking too early.
  for (const id of ['uc-davis', 'csu-long-beach']) {
    const paths = pathwayCosts(ds, {
      profile: PLAIN, target_institution_id: id,
      held_credit_ids: [], units_in_residence: 0,
    });
    assert.ok(paths.length > 0);
    for (const p of paths.filter(x => x.kind === 'ap' || x.kind === 'clep')) {
      assert.ok(
        p.areas_covered < p.areas_required,
        `${p.kind} claims full coverage at ${id}, but 1B and area 6 have no exam route`,
      );
    }
  }
});

test('a fee waiver can take a complete plan to zero', () => {
  // The point of asking about the waiver at all. Before area 4 had a
  // community-college route, an eligible student cleared everything else free
  // and was still charged for one AP exam.
  const base = {
    target_institution_id: 'uc-davis', held_credit_ids: [], units_in_residence: 30,
  };
  const waived = planRoute(ds, { ...base, profile: withProfile({ waiver: 'eligible' }) }, 'cheapest');
  assert.equal(waived.total_cost_usd, 0, 'every requirement should have a free route');
  assert.equal(waived.areas_unmet.length, 0, 'and the plan should still be complete');

  const paying = planRoute(ds, { ...base, profile: PLAIN }, 'cheapest');
  assert.ok(paying.total_cost_usd > 0, 'while a student without the waiver still pays');
});

test('a science exam clears its area AND the laboratory, and is charged once', () => {
  // The correction that mattered most: AP Biology was recorded as clearing 5B
  // alone, so the plan sent a student to sit a lab they had already satisfied.
  const bio = ds.rules.find(
    r => r.credit_source_id === 'ap-biology' && r.institution_id === 'uc-davis',
  );
  assert.ok(bio);
  assert.deepEqual([...bio.satisfies_areas].sort(), ['5B', '5C']);

  const route = planRoute(ds, {
    profile: PLAIN, target_institution_id: 'uc-davis',
    held_credit_ids: [], units_in_residence: 30,
    plan_overrides: { '5B': { kind: 'use', credit_source_id: 'ap-biology' } },
  }, 'cheapest');

  const picks = route.items.filter(i => i.credit_source_id === 'ap-biology');
  assert.equal(picks.length, 1, 'one exam, one line on the plan, one fee');
  assert.ok(route.areas_cleared.includes('5B') && route.areas_cleared.includes('5C'));
  assert.equal(route.areas_unmet.includes('5C'), false, 'the lab must not be asked for twice');
});

test('an either/or exam is spent on one requirement, never both', () => {
  // The standard offers AP English Literature for 1A OR 3B. Spending it on both
  // would build a plan that cannot actually be executed.
  const litRules = ds.rules.filter(
    r => r.credit_source_id === 'ap-english-lit' && r.institution_id === 'uc-davis',
  );
  assert.equal(litRules.length, 2, 'guards the premise: it is offered for two areas');

  const route = planRoute(ds, {
    profile: PLAIN, target_institution_id: 'uc-davis',
    held_credit_ids: [], units_in_residence: 30,
    plan_overrides: {
      '1A': { kind: 'use', credit_source_id: 'ap-english-lit' },
      '3B': { kind: 'use', credit_source_id: 'ap-english-lit' },
    },
  }, 'cheapest');

  assert.equal(
    route.items.filter(i => i.credit_source_id === 'ap-english-lit').length, 1,
    'the same exam must not appear twice even when asked for twice',
  );
  // The requirement it could not be spent on falls back to something else
  // rather than being dropped.
  assert.ok(route.areas_cleared.includes('1A') && route.areas_cleared.includes('3B'));
});

test('no AP exam is claimed to satisfy 1B or area 6', () => {
  // The Cal-GETC table is explicit: an English score of 3-5 meets 1A and
  // expressly NOT 1B, and no AP exam satisfies ethnic studies. Inventing one
  // would send a student to buy an exam that cannot do the job.
  for (const r of ds.rules) {
    if (!r.credit_source_id.startsWith('ap-')) continue;
    assert.equal(r.satisfies_areas.includes('1B'), false, `${r.credit_source_id} claims 1B`);
    assert.equal(r.satisfies_areas.includes('6'), false, `${r.credit_source_id} claims area 6`);
    assert.equal(r.satisfies_areas.includes('1C'), false, `${r.credit_source_id} claims 1C`);
  }
});

test('the laboratory requirement exists and applies to both systems', () => {
  const lab = ds.areas.find(a => a.id === '5C');
  assert.ok(lab, 'Cal-GETC Area 5C was missing from the dataset entirely');
  assert.ok(lab.applies_to.includes('UC') && lab.applies_to.includes('CSU'));

  // Area 5 totals 7 semester units across 5A, 5B and the lab.
  const area5 = ds.areas.filter(a => a.id.startsWith('5'));
  assert.equal(area5.reduce((n, a) => n + a.required_units, 0), 7);
});

test('every AP mapping is backed by a published source, not an inference', () => {
  for (const r of ds.rules) {
    if (!r.credit_source_id.startsWith('ap-')) continue;
    if (r.satisfies_areas.length === 0) continue;
    assert.equal(
      r.provenance.confidence, 'published',
      `${r.credit_source_id} is still ${r.provenance.confidence}`,
    );
    assert.match(r.provenance.source_url, /^https?:\/\//);
    assert.notEqual(r.provenance.as_of.trim(), '');
  }
});

// ---------------------------------------------------------------------------
// National dataset: the invariants that stop one state's rules reaching another
// ---------------------------------------------------------------------------

test('every institution resolves to a system, a framework and a jurisdiction', () => {
  for (const inst of us.institutions) {
    const sys = systemFor(us, inst);
    const fw = frameworkFor(us, inst);
    const jur = jurisdictionFor(us, inst);
    assert.equal(fw.state, sys.state, `${inst.id}: framework and system disagree on state`);
    assert.equal(jur.code, sys.state, `${inst.id}: jurisdiction and system disagree on state`);
    assert.equal(jur.framework_id, fw.id, `${inst.id}: jurisdiction points at another framework`);
  }
});

test('no campus can be handed another state\'s requirements', () => {
  // The whole safety argument for one shared dataset. If this fails, a student
  // is being priced against a framework their campus has never heard of.
  for (const inst of us.institutions) {
    const fw = frameworkFor(us, inst);
    const required = us.areas.filter(a => a.applies_to.includes(inst.system));
    assert.ok(required.length > 0, `${inst.id} requires nothing at all`);
    for (const a of required) {
      assert.equal(
        a.framework_id, fw.id,
        `${inst.id} (${fw.id}) was handed ${a.id} from ${a.framework_id}`,
      );
    }
  }
});

test('ids are unique across the whole country', () => {
  for (const [label, ids] of [
    ['institution', us.institutions.map(i => i.id)],
    ['area', us.areas.map(a => a.id)],
    ['credit source', us.creditSources.map(c => c.id)],
    ['system', us.systems.map(s => s.id)],
    ['framework', us.frameworks.map(f => f.id)],
    ['state', us.jurisdictions.map(j => j.code)],
  ] as ReadonlyArray<readonly [string, string[]]>) {
    assert.equal(new Set(ids).size, ids.length, `duplicate ${label} id`);
  }
  assert.equal(us.jurisdictions.length, 51, 'all 50 states and DC, mapped or not');
});

test('every rule points at rows that exist, in the right framework', () => {
  const areaById = new Map(us.areas.map(a => [a.id, a] as const));
  for (const r of us.rules) {
    const inst = us.institutions.find(i => i.id === r.institution_id);
    assert.ok(inst, `rule references unknown institution ${r.institution_id}`);
    assert.ok(
      us.creditSources.some(c => c.id === r.credit_source_id),
      `rule references unknown credit source ${r.credit_source_id}`,
    );
    const fw = frameworkFor(us, inst);
    for (const areaId of r.satisfies_areas) {
      const area = areaById.get(areaId);
      assert.ok(area, `rule at ${inst.id} clears unknown area ${areaId}`);
      assert.equal(
        area.framework_id, fw.id,
        `rule at ${inst.id} (${fw.id}) clears ${areaId} from ${area.framework_id}`,
      );
    }
  }
});

test('a fee waiver only zeroes a course where the state actually has one', () => {
  // The bug this exists to prevent is silent: waive a fee in a state with no
  // waiver and every route there is under-priced, in the student's favour, on
  // a screen that looks entirely normal.
  const eligible = withProfile({ waiver: 'eligible' });
  const course = { id: 'c', kind: 'cc_course' as const, name: 'Course', cost_usd: 300,
    provenance: { source_url: '', as_of: '', confidence: 'published' as const } };
  const exam = { id: 'e', kind: 'clep' as const, name: 'Exam', cost_usd: 95,
    provenance: { source_url: '', as_of: '', confidence: 'published' as const } };

  const ca = us.jurisdictions.find(j => j.code === 'CA');
  const tx = us.jurisdictions.find(j => j.code === 'TX');
  assert.ok(ca && tx);
  assert.ok(ca.fee_waiver !== null, 'California has the College Promise Grant');
  assert.equal(tx.fee_waiver, null, 'Texas has no statewide equivalent');

  assert.equal(effectiveCost(course, eligible, ca), 0);
  assert.equal(effectiveCost(course, eligible, tx), 300, 'Texas has no fee to waive');
  // Modern States is national, so the exam is free in both.
  assert.equal(effectiveCost(exam, eligible, ca), 0);
  assert.equal(effectiveCost(exam, eligible, tx), 0);
});

test('the same CLEP exam is worth nothing in California and clears an area in Florida', () => {
  // The single fact that justifies leaving California. If this stops being
  // true, either the data regressed or the claim was never ours to make.
  const clep = 'clep-college-composition';

  const uc = us.institutions.find(i => i.id === 'uc-berkeley');
  assert.ok(uc && uc.refuses.includes('clep'), 'UC awards no CLEP credit at all');

  const caCleared = us.rules
    .filter(r => r.credit_source_id === clep && r.institution_id.startsWith('csu-'))
    .flatMap(r => r.satisfies_areas);
  assert.deepEqual(caCleared, [], 'CLEP cannot satisfy Cal-GETC anywhere');

  const flCleared = us.rules
    .filter(r => r.credit_source_id === clep && r.institution_id === 'u-florida')
    .flatMap(r => r.satisfies_areas);
  assert.ok(flCleared.length > 0, 'Florida awards general-education credit for CLEP');
  assert.ok(flCleared.every(a => a.startsWith('fl-')));
});

test('a Texas plan is priced in Texas and built from Texas requirements', () => {
  const input = {
    profile: PLAIN, target_institution_id: 'ut-austin',
    held_credit_ids: [], units_in_residence: 0,
  };
  const route = planRoute(us, input, 'cheapest');
  assert.ok(route.areas_cleared.length > 0);
  for (const a of [...route.areas_cleared, ...route.areas_unmet]) {
    assert.ok(a.startsWith('tx-'), `${a} is not a Texas component area`);
  }
  // 42 SCH at $300 is the whole core priced at UT Austin's own rate.
  assert.equal(baselineCost(us, input), 42 * 300);
  assert.ok(routeSaving(us, input, route) > 0);
});

test('every campus in the country plans without blowing up or inventing money', () => {
  const profiles = [
    PLAIN,
    withProfile({ waiver: 'eligible', year: 'grade_10' }),
    withProfile({ field: 'stem', budget_usd: 100 }),
  ];
  for (const inst of us.institutions) {
    for (const profile of profiles) {
      const input = {
        profile, target_institution_id: inst.id,
        held_credit_ids: [], units_in_residence: 0,
      };
      const base = baselineCost(us, input);
      assert.ok(Number.isFinite(base) && base >= 0, `${inst.id}: bad baseline`);
      for (const route of planAllRoutes(us, input)) {
        assert.ok(Number.isFinite(route.total_cost_usd) && route.total_cost_usd >= 0,
          `${inst.id}/${route.kind}: bad cost`);
        assert.equal(
          route.total_cost_usd,
          route.items.reduce((n, i) => n + i.cost_usd, 0),
          `${inst.id}/${route.kind}: total does not match its items`,
        );
        assert.equal(new Set(route.areas_cleared).size, route.areas_cleared.length);
        assert.equal(
          new Set(route.items.map(i => i.credit_source_id)).size, route.items.length,
          `${inst.id}/${route.kind}: a credit was spent twice`,
        );
        assert.ok(routeSaving(us, input, route) >= 0, `${inst.id}/${route.kind}: negative saving`);
        // The lowest-risk route stakes nothing on an unconfirmed row.
        if (route.kind === 'lowest_risk') {
          for (const item of route.items) {
            assert.ok(['statute', 'published'].includes(item.provenance.confidence),
              `${inst.id}: lowest-risk recommended a ${item.provenance.confidence} row`);
          }
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// The statewide layer, and the credit that arrives on someone else's transcript
// ---------------------------------------------------------------------------

test('a statewide guarantee always says where it came from', () => {
  // The guarantee is the most quotable sentence in the app — a student repeats
  // it to a counsellor. An unsourced one is a rumour with our name on it.
  for (const jur of us.jurisdictions) {
    if (jur.transfer_guarantee === null) continue;
    // A URL where one exists, and otherwise a named authority in the note —
    // "Wis. Stat. § 36.31(2m)(b)" is a better, more stable source than most
    // campus explainer pages, and several of these rules have no canonical URL.
    const url = jur.transfer_provenance.source_url.trim();
    const note = jur.transfer_provenance.note ?? '';
    assert.ok(
      /^https?:\/\//.test(url) || /Authority: \S/.test(note),
      `${jur.code} states a guarantee with neither a URL nor a named authority`,
    );
    assert.notEqual(jur.transfer_provenance.as_of.trim(), '', `${jur.code} has no as_of`);
    assert.ok(
      (jur.transfer_provenance.note ?? '').trim() !== '',
      `${jur.code} has no note saying how far the claim goes`,
    );
  }
});

test('a state only claims a framework when the areas behind it exist', () => {
  // 25 states carry a statewide guarantee; 3 carry a requirement list. Pointing
  // a state at a framework we cannot enumerate would let the engine plan
  // against an empty area list and call the result a complete plan.
  for (const jur of us.jurisdictions) {
    if (jur.framework_id === null) continue;
    const fw = us.frameworks.find(f => f.id === jur.framework_id);
    assert.ok(fw, `${jur.code} points at unknown framework ${jur.framework_id}`);
    assert.ok(
      us.areas.some(a => a.framework_id === fw.id),
      `${jur.code} claims ${fw.id}, which has no areas`,
    );
  }
});

test('most of the country now gets a real statewide answer', () => {
  const withGuarantee = us.jurisdictions.filter(j => j.transfer_guarantee !== null);
  assert.ok(
    withGuarantee.length >= 25,
    `only ${withGuarantee.length} states carry a statewide rule`,
  );
  assert.equal(us.jurisdictions.length, 51);
});

test('UC strands third-party transcript credit, and says so', () => {
  // The same shape of failure as CLEP-at-UC, and the same price: a student buys
  // a Sophia subscription for credit their campus will not look at.
  const sophia = us.creditSources.find(c => c.id === 'alt-sophia');
  assert.ok(sophia && sophia.kind === 'alt_provider');

  const input = {
    profile: PLAIN, target_institution_id: 'uc-berkeley',
    held_credit_ids: ['alt-sophia'], units_in_residence: 0,
  };
  const route = planRoute(us, input, 'cheapest');
  const stranded = route.warnings.filter(w => w.kind === 'stranded_credit');
  assert.equal(stranded.length, 1, 'UC must say it will not count');
  assert.match(stranded[0].message, /third-party transcript/);

  // And it is never quietly planned with, either.
  assert.ok(!route.items.some(i => i.kind === 'alt_provider'));
});

test('a campus with no published refusal says it has no record, not yes', () => {
  // Absence of a refusal is not acceptance. CSU has published nothing about
  // Sophia, and inventing a policy on the student's behalf is the failure this
  // whole dataset is built to avoid.
  const input = {
    profile: PLAIN, target_institution_id: 'csu-long-beach',
    held_credit_ids: ['alt-sophia'], units_in_residence: 0,
  };
  const warnings = planRoute(us, input, 'cheapest').warnings;
  assert.ok(warnings.some(w => w.kind === 'unverified_data' && /no record/.test(w.message)));
  assert.ok(!warnings.some(w => w.kind === 'stranded_credit'));
});

test('every third-party provider names its transcript and who recommends it', () => {
  const alt = us.creditSources.filter(c => c.kind === 'alt_provider');
  assert.ok(alt.length >= 5);
  for (const c of alt) {
    assert.ok(c.recognition !== undefined, `${c.id} does not say who recommends it`);
    assert.ok(
      (c.transcript_provider ?? '').trim() !== '',
      `${c.id} does not say whose transcript the credit lands on`,
    );
    assert.ok(c.provenance.source_url.startsWith('http'), `${c.id} has no source`);
  }
});

test('third-party providers survive a state slice even with no rule behind them', () => {
  // They have no acceptance rules anywhere, so a slice that filtered unused
  // sources would drop them — and the UC warning that justifies listing them
  // at all can only fire for a source the student can actually tick.
  assert.ok(california.creditSources.some(c => c.kind === 'alt_provider'));
});

test('UC takes IB and refuses DSST, in the same plan', () => {
  // The whole reason exam FAMILY is a first-class concept. One campus, one
  // student, two exam types, opposite answers — and until IB existed in the
  // dataset this student could not describe themselves at all.
  const input = {
    profile: PLAIN, target_institution_id: 'uc-berkeley',
    held_credit_ids: ['ib-biology-hl', 'dsst-college-algebra'], units_in_residence: 0,
  };
  const route = planRoute(us, input, 'cheapest');

  const stranded = route.warnings.filter(w => w.kind === 'stranded_credit');
  assert.equal(stranded.length, 1, 'exactly one of the two is refused');
  assert.match(stranded[0].message, /DSST Fundamentals of College Algebra/);

  // The IB score is honoured: area 5B is no longer on the list to solve.
  const owed = [...route.areas_cleared, ...route.areas_unmet, ...route.areas_skipped];
  assert.ok(!owed.includes('5B'), 'IB Biology should have cleared 5B before planning began');

  // And nothing DSST-shaped was quietly planned with.
  assert.ok(!route.items.some(i => i.kind === 'dsst'));
});

test('DSST at a CSU counts toward the degree and clears nothing', () => {
  // The same quiet failure as CLEP, and it has to read the same way: the credit
  // posts, the transcript looks right, and no requirement has moved.
  const input = {
    profile: PLAIN, target_institution_id: 'csu-long-beach',
    held_credit_ids: ['dsst-college-algebra'], units_in_residence: 0,
  };
  const warnings = planRoute(us, input, 'cheapest').warnings;
  assert.ok(warnings.some(w => w.kind === 'credit_not_toward_ge'));
  assert.ok(!warnings.some(w => w.kind === 'stranded_credit'));
});

test('a refusal is by family, and covers every exam in it', () => {
  const uc = us.institutions.find(i => i.id === 'uc-berkeley');
  assert.ok(uc);
  // UC's own sentence is "AP, IB and A-Level" and nothing else, so everything
  // outside that list is a refusal we can point at rather than a silence.
  assert.deepEqual(
    [...uc.refuses].sort(),
    ['alt_provider', 'clep', 'dlpt', 'dsst', 'uexcel'],
  );
  for (const accepted of ['ap', 'ib', 'a_level'] as const) {
    assert.ok(!uc.refuses.includes(accepted), `UC should accept ${accepted}`);
  }

  // No rule may exist for a family a campus refuses — a rule would say "here is
  // what it is worth" about credit the campus will not look at.
  for (const inst of us.institutions) {
    for (const r of us.rules.filter(x => x.institution_id === inst.id)) {
      const src = us.creditSources.find(c => c.id === r.credit_source_id);
      assert.ok(src, `rule references unknown source ${r.credit_source_id}`);
      assert.ok(
        !inst.refuses.includes(src.kind),
        `${inst.id} refuses ${src.kind} yet holds a rule for ${src.id}`,
      );
    }
  }
});

test('every IB row is Higher Level, and every exam family is reachable', () => {
  // Standard Level is deliberately absent: UC credit and the Cal-GETC standard
  // are both written for HL, so an SL row would promise something nobody said.
  for (const c of us.creditSources.filter(s => s.kind === 'ib')) {
    assert.match(c.name, /Higher Level/, `${c.id} is not marked Higher Level`);
    assert.ok(c.id.endsWith('-hl'), `${c.id} does not read as Higher Level`);
  }
  // Each family must be offerable somewhere, or it is dead weight in the picker.
  for (const kind of ['ap', 'ib', 'clep', 'dsst', 'cc_course', 'alt_provider']) {
    assert.ok(
      us.creditSources.some(c => c.kind === kind),
      `no credit sources at all for ${kind}`,
    );
  }
});

test('a retired or restricted exam is never recommended, only counted', () => {
  // UExcel cannot be bought since August 2022 and the DLPT has no civilian
  // route in. Both still carry Florida rules, so both would be planned with if
  // availability were not gated — sending a student to buy a discontinued exam.
  const fl = { profile: PLAIN, target_institution_id: 'u-florida',
    held_credit_ids: [], units_in_residence: 0 };
  for (const kind of ['cheapest', 'fastest', 'lowest_risk'] as const) {
    const route = planRoute(us, fl, kind);
    assert.ok(
      !route.items.some(i => i.kind === 'uexcel' || i.kind === 'dlpt'),
      `${kind} recommended something nobody can sit`,
    );
  }
  assert.ok(!optionsForArea(us, fl, 'fl-comm').some(o => o.kind === 'uexcel'));

  // …but a score already held still clears its area.
  const held = { ...fl, held_credit_ids: ['uexcel-english-composition'] };
  const route = planRoute(us, held, 'cheapest');
  const touched = [...route.areas_cleared, ...route.areas_unmet, ...route.areas_skipped];
  assert.ok(!touched.includes('fl-comm'), 'a held UExcel score should have cleared fl-comm');
});

test('UC accepts A Level by name, and that is the point of having it', () => {
  const input = {
    profile: PLAIN, target_institution_id: 'uc-berkeley',
    held_credit_ids: ['alevel-biology'], units_in_residence: 0,
  };
  const route = planRoute(us, input, 'cheapest');
  assert.ok(!route.warnings.some(w => w.kind === 'stranded_credit'));
  const touched = [...route.areas_cleared, ...route.areas_unmet, ...route.areas_skipped];
  assert.ok(!touched.includes('5B'), 'A Level Biology should have cleared 5B');
});

test('prices carry a date once they have been checked', () => {
  // A price with no `as_of` is a number nobody can date, and these move: CLEP
  // went $95 to $97 between cycles and the dataset did not notice for a while.
  for (const c of us.creditSources) {
    if (c.cost_usd === 0) continue; // free rows make no price claim
    assert.notEqual(
      c.provenance.as_of.trim(), '',
      `${c.id} quotes ${c.cost_usd} with no date on the source`,
    );
  }
});

test('every jurisdiction says which of the three things it knows', () => {
  // "There is no statewide rule" is a finding. "We have not looked" is an
  // admission. Collapsing them would have the app print THE STATEWIDE RULE
  // above a sentence saying there isn't one.
  for (const j of us.jurisdictions) {
    if (j.statewide_framework === 'unknown') {
      assert.equal(j.transfer_guarantee, null, `${j.code} claims a rule it calls unknown`);
      continue;
    }
    assert.ok(
      (j.transfer_guarantee ?? '').trim() !== '',
      `${j.code} is marked ${j.statewide_framework} with nothing to say`,
    );
  }
  const yes = us.jurisdictions.filter(j => j.statewide_framework === 'yes');
  assert.ok(yes.length >= 44, `only ${yes.length} states carry a statewide rule`);
});

test('a quarter-credit state says so, because every unit here is a semester unit', () => {
  // Oregon and Washington count in quarter credits. Everything the engine
  // computes assumes semester units, so a quarter state that did not say so
  // would be wrong by a factor of 1.5 with nothing to complain about.
  for (const code of ['OR', 'WA'] as const) {
    const j = us.jurisdictions.find(x => x.code === code);
    assert.ok(j, `${code} missing`);
    assert.match(
      j.transfer_provenance.note ?? '', /QUARTER credits/,
      `${code} counts in quarter credits and does not say so`,
    );
  }
});

test('Florida awards credit that clears no core area, and says which', () => {
  // The bug this test exists for: every Florida exam row used to claim a core
  // area. The August 2026 table awards a named COURSE, and only some of those
  // courses are core. Eleven rows were overclaiming.
  const notCore = us.rules.filter(r =>
    r.institution_id === 'u-florida' && r.satisfies_areas.length === 0);
  assert.ok(notCore.length >= 9, `only ${notCore.length} Florida rows clear nothing`);

  for (const id of ['ap-microeconomics', 'ap-human-geography', 'ap-comparative-government',
    'ap-spanish', 'ap-european-history', 'clep-intro-sociology', 'clep-humanities',
    'clep-american-literature', 'ap-us-history']) {
    const r = us.rules.find(x => x.institution_id === 'u-florida' && x.credit_source_id === id);
    assert.ok(r, `${id} has no Florida rule`);
    assert.deepEqual(r.satisfies_areas, [], `${id} still claims a Florida core area`);
  }

  // AP English Literature awards ENC X101, which is Communication, not Humanities.
  const lit = us.rules.find(r =>
    r.institution_id === 'u-florida' && r.credit_source_id === 'ap-english-lit');
  assert.deepEqual(lit?.satisfies_areas, ['fl-comm']);

  // CLEP Natural Sciences has no row in the table at all — so no rule, and the
  // engine falls through to "we have no record" rather than inventing credit.
  assert.equal(
    us.rules.find(r =>
      r.institution_id === 'u-florida' && r.credit_source_id === 'clep-natural-sciences'),
    undefined,
  );

  // The AP sciences and Calculus need a 4, and award 4 credits, not 3.
  for (const id of ['ap-biology', 'ap-chemistry', 'ap-physics-1', 'ap-calculus-ab']) {
    const r = us.rules.find(x => x.institution_id === 'u-florida' && x.credit_source_id === id);
    assert.equal(r?.min_score, 4, `${id} should need a 4 in Florida`);
    assert.equal(r?.units_granted, 4, `${id} should award 4 credits in Florida`);
  }
});
