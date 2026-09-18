import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Dataset } from './engine.ts';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f: string) => JSON.parse(readFileSync(join(here, '..', 'data', 'ca', f), 'utf8'));

export function loadCalifornia(): Dataset {
  return {
    institutions: read('institutions.json'),
    // Cal-GETC rows carry no provenance of their own yet; the pattern itself is
    // a published statewide standard and gets one row in VERIFICATION.md.
    areas: read('cal-getc.json'),
    creditSources: read('credit-sources.json'),
    rules: read('acceptance-rules.json'),
  };
}
