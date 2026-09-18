import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StudentInput } from './types.ts';
import { isStudentInput } from './planValidate.ts';

/**
 * The student's plan, kept between sessions.
 *
 * A plan is something you build over weeks — you check a policy, talk to an
 * advisor, come back and change one line. Losing it on app close would make the
 * editing this app just gained pointless.
 *
 * Storage is best-effort on purpose: a failed read or write must never stop a
 * student from planning. Worst case they start fresh.
 */
const KEY = 'degree-route.plan.v1';

/** Bumped when the shape changes, so an old payload is dropped, not misread. */
const VERSION = 1;

interface Saved {
  version: number;
  input: StudentInput;
}

export async function loadPlan(): Promise<StudentInput | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const saved = parsed as Partial<Saved>;
    if (saved.version !== VERSION) return null;
    return isStudentInput(saved.input) ? saved.input : null;
  } catch {
    return null; // Unreadable storage is the same as no plan.
  }
}

export async function savePlan(input: StudentInput): Promise<void> {
  try {
    const payload: Saved = { version: VERSION, input };
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Quota, private mode, a locked store. Not worth interrupting anyone over.
  }
}

export async function clearPlan(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Same.
  }
}
