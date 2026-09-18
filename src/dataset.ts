import type { Dataset } from './engine.ts';
import { institutions } from '../data/ca/institutions.ts';
import { calGetcAreas } from '../data/ca/cal-getc.ts';
import { creditSources } from '../data/ca/credit-sources.ts';
import { acceptanceRules } from '../data/ca/acceptance-rules.ts';

/**
 * The California dataset, as typed modules rather than JSON: Metro and Node
 * disagree about JSON import syntax, and a typed module makes a malformed row a
 * compile error instead of a runtime surprise.
 */
export const california: Dataset = {
  institutions,
  areas: calGetcAreas,
  creditSources,
  rules: acceptanceRules,
};
