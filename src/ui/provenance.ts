/**
 * Shared provenance rules.
 *
 * `Provenance.source_url` and `.as_of` are plain strings using '' as the sentinel
 * for "nobody has opened this source yet". Every screen needs the same two
 * judgements about them, so they live here rather than being re-derived — four
 * copies of this logic is four chances for one screen to quietly disagree with
 * the others about whether a claim is backed.
 */
import type { Provenance } from '../types.ts';

/** True when the URL is something we can actually open. Guards dead links. */
export const linkable = (url: string): boolean => /^https?:\/\//i.test(url.trim());

/** Human phrasing for when a row was last confirmed against its source. */
export const checkedOn = (p: Provenance): string =>
  p.as_of.trim() === '' ? 'never checked' : p.as_of;

/** True when a human has actually confirmed this row against its source. */
export const isBacked = (p: Provenance): boolean =>
  p.confidence === 'statute' || p.confidence === 'published';

/** A note worth showing — present and not just whitespace. */
export const noteText = (p: Provenance): string | null => {
  const t = p.note?.trim();
  return t ? t : null;
};
