/**
 * Purchase identifiers, in one place.
 *
 * These MUST match the RevenueCat dashboard exactly. A mismatched entitlement id
 * is the worst kind of configuration bug: the purchase completes, the student is
 * charged, and nothing unlocks.
 */

/** The entitlement configured in the RevenueCat dashboard. */
export const ENTITLEMENT_ID = 'collegemaps_pro';

/**
 * Public SDK keys. Public by design — they are safe in a shipped bundle — but
 * they are PER PLATFORM and per store:
 *
 *   web     — RevenueCat Web Billing key (a `test_…` key is sandbox, not live)
 *   native  — the store's own key. A Galaxy Store build needs the
 *             Amazon/Samsung key, NOT the Google Play one.
 *
 * Missing key is not an error: the app runs without purchases rather than
 * refusing to start.
 */
export const WEB_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY ?? '';
export const NATIVE_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';

/**
 * TEMPORARY — a "skip payment" button on the paywall, so the advisor packet can
 * be reached and tested while no store key is configured.
 *
 * It unlocks for the current session only (nothing is saved), and it is loud
 * on screen so nobody mistakes a testing build for a real one. `npm run
 * preflight` treats it as a submission blocker. Set to false to remove it.
 */
export const TESTING_UNLOCK = true;
