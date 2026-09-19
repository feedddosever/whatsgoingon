/**
 * One wording for the limits of this app, used by every surface that states
 * them — the plan map, the paywall, and both printed packets.
 *
 * It lives in one place because a disclaimer that is paraphrased per screen
 * drifts, and the version a student actually read stops being knowable. The
 * whole product is built on being precise about what we do and do not know;
 * this is that same rule applied to the app itself.
 */

/** Short enough to sit permanently on a screen without being tuned out. */
export const DISCLAIMER_SHORT =
  'Planning help, not academic advice. Confirm every item with the campus before you pay for it.';

/** For the foot of a printed page, where there is room to be exact. */
export const DISCLAIMER_LONG =
  'This is planning help, not academic or financial advice, and it is not affiliated ' +
  'with any college or university. Transfer and credit-by-exam policies change between ' +
  'catalogue years, and a policy page that was accurate when it was read may not be ' +
  'accurate today. Nothing here is a promise that a campus will award credit. Confirm ' +
  'every item with the campus — in writing — before paying for an exam or a course.';

/**
 * Shown to anyone who told us they are still in high school. Not a legal
 * gate — the store's age rating is a separate decision — but a student who
 * may be 14 should not be asked for money without this being on the screen.
 */
export const MINOR_PURCHASE_NOTICE =
  'You told us you are still in school. Ask a parent or guardian before paying for anything, ' +
  'and use their payment method rather than one that is not yours.';

/** True when the profile says school, i.e. the student is plausibly a minor. */
export const isSchoolAge = (year: string): boolean =>
  year === 'grade_9' || year === 'grade_10' || year === 'grade_11' || year === 'grade_12';
