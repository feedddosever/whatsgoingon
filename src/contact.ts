import type { Jurisdiction } from './types.ts';

/**
 * The one address a student or a parent can reach a human on.
 *
 * Empty by default, and that is deliberate: a `mailto:` pointing at a made-up
 * address is worse than no button at all, because it looks like a way to get
 * help and silently is not. Every surface that offers to open a mail client
 * checks `hasContact()` first and renders nothing when there is no address,
 * exactly as the paywall does with a missing RevenueCat key.
 *
 * Set EXPO_PUBLIC_SUPPORT_EMAIL before building for a store. Remember that
 * Metro inlines EXPO_PUBLIC_* at transform time — `build:web` passes `--clear`
 * for this reason (see AGENTS.md).
 */
export const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '';

export const hasContact = (): boolean => SUPPORT_EMAIL.trim() !== '';

/**
 * "Tell me when my state is ready."
 *
 * The 48 states we have not mapped are the app's largest gap and its most
 * honest question: someone in Ohio has told us, by tapping, exactly which
 * dataset to build next and that they want it. That is worth more than any
 * analytics event we are not collecting.
 *
 * It opens the student's own mail client rather than posting anywhere. The app
 * keeps its promise — no server, no account, nothing uploaded — and what
 * arrives is a message a person chose to send, from an address they chose to
 * send it from. The subject carries the state so the inbox sorts itself.
 */
export function waitlistMailto(jur: Jurisdiction): string {
  const subject = `Map ${jur.name}`;
  const body =
    `I am planning for college in ${jur.name} and Degree Route does not cover it yet.\n\n` +
    `Please let me know when it does.\n\n` +
    `(Anything you add here helps us pick what to build next — the campus you ` +
    `are aiming for, whether you are a student, a parent or a counsellor.)\n`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}
