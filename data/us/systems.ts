import type { System } from '../../src/types.ts';

/**
 * Public systems, and the framework each one runs on.
 *
 * The California ids stayed `UC` and `CSU` rather than being renamed to
 * `ca-uc`/`ca-csu`: those ids are written into every Cal-GETC area's
 * `applies_to` list and into plans already saved on students' devices, and
 * renaming them would have silently emptied a restored plan's requirement list.
 */
export const systems: System[] = [
  { id: 'UC',        name: 'University of California',      short_name: 'UC',     state: 'CA', framework_id: 'cal-getc' },
  { id: 'CSU',       name: 'California State University',   short_name: 'CSU',    state: 'CA', framework_id: 'cal-getc' },
  { id: 'TX-PUBLIC', name: 'Texas public universities',     short_name: 'Texas public', state: 'TX', framework_id: 'tx-core' },
  { id: 'FL-SUS',    name: 'Florida State University System', short_name: 'Florida SUS', state: 'FL', framework_id: 'fl-core' },
];
