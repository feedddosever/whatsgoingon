import { planAllRoutes } from './engine.ts';
import { california } from './dataset.ts';

const ds = california;
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

function show(label: string, input: Parameters<typeof planAllRoutes>[1]) {
  console.log(`\n${'='.repeat(64)}\n${label}\n${'='.repeat(64)}`);
  for (const r of planAllRoutes(ds, input)) {
    console.log(`\n  ── ${r.kind.toUpperCase().replace('_', '-')} — ${money(r.total_cost_usd)}, ${r.total_units} units`);
    for (const i of r.items) {
      console.log(`     • ${i.label.padEnd(46)} ${money(i.cost_usd).padStart(6)}  area ${i.satisfies_area}  [${i.provenance.confidence}]`);
    }
    if (r.items.length === 0) console.log('     (nothing this route is willing to recommend)');
    for (const w of r.warnings) console.log(`     ⚠  [${w.kind}] ${w.message}`);
  }
}

show('A student holding two CLEP credits who wants UC Berkeley', {
  target_institution_id: 'uc-berkeley',
  held_credit_ids: ['clep-college-composition', 'clep-college-algebra'],
  units_in_residence: 12,
});

show('The same two CLEP credits, aimed at CSU Long Beach instead', {
  target_institution_id: 'csu-long-beach',
  held_credit_ids: ['clep-college-composition', 'clep-college-algebra'],
  units_in_residence: 30,
});
