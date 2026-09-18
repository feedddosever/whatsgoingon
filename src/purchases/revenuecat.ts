/**
 * Thin, typed wrapper over react-native-purchases.
 *
 * Two rules drive the shape of this module:
 *
 * 1. The UI never sees a raw SDK error. Every genuine failure comes back as an
 *    Error carrying one sentence a student can act on, because the paywall's
 *    only error surface is a line of text.
 * 2. A cancelled purchase is not a failure. It resolves `false` so the paywall
 *    simply stays open — no alert, no red text, nothing to apologise for.
 *
 * Store support: Galaxy Store needs the RevenueCat Android SDK >= 10.7.0, which
 * means react-native-purchases >= 10.3.0 — we are on 10.10.0, so it is covered.
 * Galaxy Store test purchases only run on a *physical* Galaxy device; the
 * emulator carries no Samsung billing client. That, plus Expo Go (where the SDK
 * falls back to a preview shim) and web, is why every call below degrades to
 * "locked" instead of throwing.
 */
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

/** The entitlement configured in the RevenueCat dashboard. */
// Re-exported from config so the native and web implementations can never
// drift onto different entitlement ids.
export { ENTITLEMENT_ID } from './config.ts';
import { ENTITLEMENT_ID } from './config.ts';
import RevenueCatUI from 'react-native-purchases-ui';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';

/** Preferred offering id; we fall back to whatever offering is current. */
const OFFERING_ID = 'advisor_packet';

/**
 * Codes worth translating. Anything not listed falls back to the SDK's own
 * message, which is at least in English and usually names the store's complaint
 * — see readable() for when even that is too developer-facing to show.
 */
const MESSAGE_BY_CODE: Partial<Record<PURCHASES_ERROR_CODE, string>> = {
  [PURCHASES_ERROR_CODE.NETWORK_ERROR]:
    'Could not reach the store. Check your connection and try again.',
  [PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR]:
    'You appear to be offline. Reconnect and try again.',
  [PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR]:
    'The app store had a problem completing this. Nothing was charged — try again in a minute.',
  [PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR]:
    'This device is not allowed to make purchases. Check the store account signed in on it.',
  [PURCHASES_ERROR_CODE.PURCHASE_INVALID_ERROR]:
    'The store rejected the payment method on this account.',
  [PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR]:
    'The advisor packet is not on sale in your store yet.',
  [PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR]:
    'You already own this. Use "Restore purchases" to get it back.',
  [PURCHASES_ERROR_CODE.RECEIPT_ALREADY_IN_USE_ERROR]:
    'This purchase is already attached to another account on this device.',
  // Pending is NOT a purchase. Say so plainly rather than unlock and be wrong.
  [PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR]:
    'Your payment is still pending with the store. Nothing unlocks until it clears — come back and tap Restore.',
  [PURCHASES_ERROR_CODE.CONFIGURATION_ERROR]:
    'In-app purchases are not configured in this build.',
  [PURCHASES_ERROR_CODE.INVALID_CREDENTIALS_ERROR]:
    'In-app purchases are not configured in this build.',
  [PURCHASES_ERROR_CODE.UNSUPPORTED_ERROR]:
    'This device cannot make purchases. Galaxy Store purchases need a physical Galaxy device.',
};

/**
 * The SDK rejects with a plain object, not an Error, so `instanceof` is useless
 * here — check the shape instead.
 */
function asPurchasesError(e: unknown): PurchasesError | null {
  if (typeof e !== 'object' || e === null) return null;
  const candidate = e as Partial<PurchasesError>;
  return typeof candidate.code === 'string' && typeof candidate.message === 'string'
    ? (e as PurchasesError)
    : null;
}

/**
 * Turns anything the SDK throws into one readable sentence.
 *
 * An unmapped `PurchasesError.message` is the store's own complaint and is safe
 * to show. Anything else is not: the SDK also throws plain Errors aimed at
 * developers (`UninitializedPurchasesError` ends in a rev.cat docs URL,
 * `UnsupportedPlatformError` says "not available in the current platform"), and
 * a student cannot act on either. Those get the caller's fallback instead.
 */
function readable(e: unknown, fallback: string): Error {
  const err = asPurchasesError(e);
  if (err === null) return new Error(fallback);
  const mapped = MESSAGE_BY_CODE[err.code];
  if (mapped !== undefined) return new Error(mapped);
  const raw = err.message.trim();
  // A message with a link in it was written for whoever wired up the build.
  const developerFacing = raw.length === 0 || raw.includes('http');
  return new Error(developerFacing ? fallback : raw);
}

/**
 * True only if the SDK is configured AND has a native (or preview) module behind
 * it. `isConfigured` already answers false rather than throwing when the native
 * module is missing, but it is reached through the same bridge, so guard it too.
 */
async function isReady(): Promise<boolean> {
  try {
    return await Purchases.isConfigured();
  } catch {
    return false;
  }
}

const hasEntitlement = (info: CustomerInfo): boolean =>
  info.entitlements.active[ENTITLEMENT_ID] !== undefined;

/**
 * The packet is a one-off unlock, so it is a lifetime package. Falling back to
 * the first available package keeps a dashboard that used a custom identifier
 * working instead of showing a dead button.
 */
function pickPackage(offering: PurchasesOffering): PurchasesPackage | null {
  const first: PurchasesPackage | undefined = offering.availablePackages[0];
  return offering.lifetime ?? first ?? null;
}

/**
 * Our named offering first, then whatever is current. Both are tried for a
 * *package*, not merely for existence: an offering that exists but carries no
 * packages is exactly as useless as no offering at all, and stopping at it
 * would hide a perfectly good current offering behind a dead button.
 */
function pickPurchasable(
  all: Record<string, PurchasesOffering>,
  current: PurchasesOffering | null,
): PurchasesPackage | null {
  const named: PurchasesOffering | undefined = all[OFFERING_ID];
  const fromNamed = named === undefined ? null : pickPackage(named);
  if (fromNamed !== null) return fromNamed;
  return current === null ? null : pickPackage(current);
}

/**
 * Safe to call on every launch. Rejects rather than throws so the caller decides
 * whether a store-less device is worth telling the student about — usually it is
 * not, because the app is fully useful without the packet.
 */
export async function configurePurchases(apiKey: string): Promise<void> {
  // Typed `string`, but it usually arrives from app config, where a missing key
  // is undefined at runtime and `.trim()` would throw a TypeError at launch.
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('In-app purchases are not configured in this build.');
  }
  try {
    // Synchronous in the SDK, and it throws when the native module is absent.
    Purchases.configure({ apiKey });
  } catch (e) {
    throw readable(e, 'Could not start in-app purchases on this device.');
  }
}

/**
 * Resolves false when there is no store to ask — Expo Go, a Galaxy emulator, or
 * a launch where configure failed. "Locked" is the safe wrong answer: a student
 * who really paid gets it back with restorePurchases(), whereas guessing
 * "unlocked" would hand out a packet nobody bought.
 */
export async function hasAdvisorPacket(): Promise<boolean> {
  if (!(await isReady())) return false;
  try {
    return hasEntitlement(await Purchases.getCustomerInfo());
  } catch (e) {
    throw readable(e, 'Could not check your purchases.');
  }
}

/**
 * The store's own localised price string (e.g. "$4.99", "4,99 €"), or null when
 * no store can answer. Never throws: a paywall that cannot name the price is
 * still usable, and the store will state it at the moment of purchase anyway.
 */
export async function getAdvisorPacketPrice(): Promise<string | null> {
  try {
    if (!(await isReady())) return null;
    const offerings = await Purchases.getOfferings();
    const pkg = pickPurchasable(offerings.all, offerings.current);
    return pkg?.product.priceString ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolves true once the entitlement is actually active — not merely once the
 * store said "ok", since a pending payment grants nothing. Resolves false when
 * the student cancels. Rejects only on a real failure.
 */
export async function purchaseAdvisorPacket(): Promise<boolean> {
  if (!(await isReady())) {
    throw new Error('Purchases are unavailable on this device. Galaxy Store needs a real Galaxy phone.');
  }

  let result: PAYWALL_RESULT;
  try {
    // RevenueCat's own paywall, configured in the dashboard. With two products
    // (lifetime and monthly) the product choice, localised pricing and the
    // store's purchase sheet are theirs to get right, not ours — and the same
    // call shape is used on web, so both platforms behave alike.
    result = await RevenueCatUI.presentPaywall({ displayCloseButton: true });
  } catch (e) {
    throw readable(e, 'The purchase did not go through. Nothing was charged.');
  }

  // CANCELLED and NOT_PRESENTED are choices, not faults.
  if (result === PAYWALL_RESULT.CANCELLED || result === PAYWALL_RESULT.NOT_PRESENTED) {
    return false;
  }
  if (result === PAYWALL_RESULT.ERROR) {
    throw new Error('The purchase did not go through. Nothing was charged.');
  }

  // PURCHASED or RESTORED — confirm against the entitlement rather than trusting
  // the paywall's word, because the two can disagree when the dashboard's
  // entitlement id is not ENTITLEMENT_ID.
  let info: CustomerInfo;
  try {
    info = await Purchases.getCustomerInfo();
  } catch (e) {
    throw readable(e, 'The purchase went through but we could not confirm the unlock.');
  }
  if (hasEntitlement(info)) return true;

  // Paid, but the entitlement did not come back. Returning false here would be
  // indistinguishable from a cancellation, so a student who was just charged
  // would watch the paywall close and nothing happen.
  throw new Error(
    'The store took your payment but we could not confirm the unlock yet. Wait a moment, then tap "Restore purchases" — you will not be charged twice.',
  );
}

/**
 * RevenueCat's Customer Center: cancel, change plan, request a refund, recover a
 * missing purchase. Worth wiring precisely because one of the products is a
 * monthly subscription — an app that can take a recurring payment and offers no
 * way to manage it is the kind of thing that earns refund requests and one-star
 * reviews.
 *
 * Native only. The web SDK has no equivalent; see revenuecat.web.ts.
 */
export const CUSTOMER_CENTER_AVAILABLE = true;

export async function presentCustomerCenter(): Promise<void> {
  if (!(await isReady())) {
    throw new Error('Subscription management is unavailable on this device.');
  }
  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (e) {
    throw readable(e, 'Could not open subscription management.');
  }
}

/**
 * Resolves true if the entitlement came back, false if this store account simply
 * has nothing to restore — which is an answer, not an error.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!(await isReady())) {
    throw new Error('Purchases are unavailable on this device, so there is nothing to restore.');
  }
  try {
    return hasEntitlement(await Purchases.restorePurchases());
  } catch (e) {
    throw readable(e, 'Could not restore your purchases. Check that you are signed in to the same store account.');
  }
}
