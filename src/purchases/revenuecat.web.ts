/**
 * Web purchases, via RevenueCat Web Billing (@revenuecat/purchases-js).
 *
 * Metro picks this file over revenuecat.ts when bundling for web. It exposes the
 * same surface as the native wrapper so App.tsx never learns which one it got.
 *
 * This is NOT a substitute for the native SDK. Web Billing sells through
 * RevenueCat's own checkout; a Galaxy Store build still needs
 * react-native-purchases and the Samsung store key.
 */
import { ErrorCode, Purchases, PurchasesError } from '@revenuecat/purchases-js';
import type { Offering, Package } from '@revenuecat/purchases-js';

import { ENTITLEMENT_ID } from './config.ts';

export { ENTITLEMENT_ID } from './config.ts';

/**
 * Web Billing has no device account to fall back on, so the app user id IS the
 * receipt. Lose it and a paying student silently loses access on their next
 * page load, with nothing to restore from — there is no store to ask.
 *
 * So it is generated once and persisted. localStorage throws in some privacy
 * modes, so every access is guarded; an in-memory id still lets the current
 * session complete a purchase.
 */
const USER_ID_KEY = 'degree-route.rc-app-user-id';
let memoryUserId: string | null = null;

function readStored(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Private mode. The id still lives in memory for this session.
  }
}

function appUserId(): string {
  const stored = readStored(USER_ID_KEY);
  if (stored !== null && stored !== '') return stored;
  if (memoryUserId !== null) return memoryUserId;

  const fresh = Purchases.generateRevenueCatAnonymousAppUserId();
  memoryUserId = fresh;
  writeStored(USER_ID_KEY, fresh);
  return fresh;
}

/** A cancelled purchase is a choice, not a failure. */
function isCancellation(e: unknown): boolean {
  return e instanceof PurchasesError && e.errorCode === ErrorCode.UserCancelledError;
}

/** Never let a raw SDK error reach the UI. */
function readable(e: unknown, fallback: string): Error {
  if (e instanceof PurchasesError) return new Error(e.message || fallback);
  if (e instanceof Error) return new Error(e.message || fallback);
  return new Error(fallback);
}

export async function configurePurchases(apiKey: string): Promise<void> {
  if (apiKey.trim() === '') return; // No key: the app runs, purchases do not.
  if (Purchases.isConfigured()) return;
  try {
    Purchases.configure({ apiKey, appUserId: appUserId() });
  } catch (e) {
    throw readable(e, 'Could not start the purchase system.');
  }
}

const ready = (): boolean => Purchases.isConfigured();

export async function hasAdvisorPacket(): Promise<boolean> {
  if (!ready()) return false;
  try {
    return await Purchases.getSharedInstance().isEntitledTo(ENTITLEMENT_ID);
  } catch (e) {
    throw readable(e, 'Could not check your purchases.');
  }
}

/** Cheapest package in the current offering, for display only. Never throws. */
export async function getAdvisorPacketPrice(): Promise<string | null> {
  if (!ready()) return null;
  try {
    const offering = (await Purchases.getSharedInstance().getOfferings()).current;
    const pkg = firstPackage(offering);
    return pkg?.webBillingProduct.currentPrice.formattedPrice ?? null;
  } catch {
    return null;
  }
}

function firstPackage(offering: Offering | null): Package | null {
  if (offering === null) return null;
  return offering.availablePackages[0] ?? null;
}

/**
 * Opens RevenueCat's hosted paywall, which renders the configured offering
 * (lifetime and monthly) and runs checkout.
 *
 * Our own PaywallScreen still makes the case for the packet; this handles the
 * part that has to be right — price display, product choice, and payment.
 *
 * Resolves true once the entitlement is actually active, false when the student
 * backs out. Rejects only on a real failure.
 */
export async function purchaseAdvisorPacket(): Promise<boolean> {
  if (!ready()) {
    throw new Error('Purchases are not available here yet.');
  }
  try {
    const result = await Purchases.getSharedInstance().presentPaywall({});
    return result.customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    if (isCancellation(e)) return false;
    throw readable(e, 'The purchase did not go through. Nothing was charged.');
  }
}

/**
 * Web Billing has no store account to restore from — entitlements follow the app
 * user id. This re-checks that id, which recovers a purchase after a reload on
 * the same browser. It cannot recover one made in a different browser, and the
 * UI says so rather than implying otherwise.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!ready()) {
    throw new Error('Purchases are not available here, so there is nothing to restore.');
  }
  try {
    return await Purchases.getSharedInstance().isEntitledTo(ENTITLEMENT_ID);
  } catch (e) {
    throw readable(e, 'Could not check for an earlier purchase.');
  }
}
