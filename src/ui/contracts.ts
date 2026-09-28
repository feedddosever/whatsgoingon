/**
 * Screen prop contracts. Screens are presentational: they receive data and
 * callbacks, never reach into the engine or the dataset themselves. App.tsx owns
 * all state and is the only place the engine is called.
 */
import type {
  Institution, Route, StudentInput, CreditSource, GeArea, GeFramework,
  Jurisdiction, StateCode, StudentProfile, System, AreaChoice, PlanItem, TransferPolicy,
} from '../types.ts';
import type { PathwayCost } from '../engine.ts';
import type { SaladVariant } from './SaladScene.tsx';

/**
 * The onboarding, one question at a time. Order is fixed; which questions appear
 * depends on the answers (IB subjects only after "yes, I am in IB") and on the
 * state (Texas has no DLPT rules, so it is never asked there).
 */
export type OnboardingStep =
  | 'welcome' | 'year' | 'field' | 'budget' | 'waiver'
  | 'state' | 'campus'
  | 'clep' | 'ap' | 'ib_q' | 'ib' | 'alevel_q' | 'alevel' | 'dsst' | 'dlpt'
  | 'cc_q' | 'cc' | 'alt_q' | 'alt'
  | 'residency' | 'name';

/** Credit families asked about with a yes/no before any list is shown. */
export type GatedKind = 'ib' | 'a_level' | 'cc_course' | 'alt_provider';

/**
 * Where the student is in the onboarding, and their yes/no answers.
 *
 * Held by App rather than the screen so that "‹ back" from the routes returns to
 * the question they left, not to the greeting. The yes/no answers live here and
 * not in StudentInput because they change nothing the engine computes: a "yes"
 * with no subject ticked is the same plan as a "no".
 */
export interface OnboardingNav {
  step: OnboardingStep;
  gates: Partial<Record<GatedKind, boolean>>;
}

export interface OnboardingScreenProps {
  nav: OnboardingNav;
  onNav: (next: OnboardingNav) => void;
  /**
   * The states we hold campuses for, each with its statewide guarantee.
   *
   * State comes before campus because in most of the country it is the more
   * valuable answer: "finish the Texas core anywhere and it transfers whole" is
   * worth more than any single campus's exam table, and it is true before the
   * student has chosen a university at all.
   */
  states: Jurisdiction[];
  /**
   * The states we have NOT mapped — every one of them, not a curated few.
   *
   * They used to be hidden, which meant a student in Ohio saw three states and
   * silently concluded the app was not for them. Showing all 51 turns the
   * largest gap in the dataset into the most useful question the app can ask:
   * which state should exist next, asked of the person who wants it.
   */
  unmappedStates: Jurisdiction[];
  selectedState: StateCode;
  onSelectState: (code: StateCode) => void;
  /**
   * So a campus row can be chipped "UC" or "Texas public" rather than with the
   * raw system id. System ids are dataset keys and were never meant to be read
   * by a student; `FL-SUS` on a card is a leak, not a label.
   */
  systems: System[];
  /** Already narrowed to `selectedState` by the caller. */
  institutions: Institution[];
  creditSources: CreditSource[];
  /**
   * The free-CLEP voucher row. Not something a student "holds", so it is kept
   * out of the provider question; the CLEP question mentions it in one line and
   * the plan carries the detail.
   */
  freeClep: CreditSource | null;
  /** What the chosen campus's system publishes about credit from other colleges. */
  transferPolicy: TransferPolicy | null;
  value: StudentInput;
  onChange: (next: StudentInput) => void;
  onSubmit: () => void;
}

export interface PreparingScreenProps {
  /** Which salad. Picked at random by the caller, so the screen stays pure. */
  variant: SaladVariant;
  /** Named in the first status line: "Reading UCLA's policies". */
  campusName: string;
  /** Called once, when the animation ends or the student taps to skip. */
  onDone: () => void;
}

export interface RoutesScreenProps {
  institution: Institution;
  /** The state framework this campus runs on, so the copy can name it. */
  framework: GeFramework;
  /** The campus's system, for its human-readable short name. */
  system: System;
  routes: Route[];
  /** So this screen names requirements the same way RouteDetailScreen does. */
  areas: GeArea[];
  /** Cost of the do-nothing path, used to show the saving. */
  baselineCostUsd: number;
  onSelectRoute: (route: Route) => void;
  onBack: () => void;
}

export interface PlanMapScreenProps {
  institution: Institution;
  /** The state framework this campus runs on, so the copy can name it. */
  framework: GeFramework;
  /** The campus's system, for its human-readable short name. */
  system: System;
  route: Route;
  areas: GeArea[];
  profile: StudentProfile;
  /** Every credit this campus accepts for one requirement, cheapest first. */
  optionsFor: (areaId: string) => PlanItem[];
  /** What each kind of credit would cost if leaned on alone. */
  pathways: PathwayCost[];
  /** The student's own choice for a requirement, if they made one. */
  choiceFor: (areaId: string) => AreaChoice | undefined;
  /** null resets the requirement back to our recommendation. */
  onChoose: (areaId: string, choice: AreaChoice | null) => void;
  onOpenDetail: () => void;
  /**
   * The free-CLEP voucher, for the card that explains it. The onboarding only
   * says "you can take them for free" and points here; this is where the how
   * lives. Null hides the card.
   */
  freeClep: CreditSource | null;
  /** Sends the plan to a parent or guardian, framed for them rather than an advisor. */
  onShareWithGuardian: () => void;
  /** Clears the saved plan and returns to the first question. */
  onStartOver: () => void;
  onBack: () => void;
}

export interface RouteDetailScreenProps {
  institution: Institution;
  /** The state framework this campus runs on, so the copy can name it. */
  framework: GeFramework;
  /** The campus's system, for its human-readable short name. */
  system: System;
  route: Route;
  /** So the screen can print "Humanities" rather than the bare code "3B". */
  areas: GeArea[];
  /** True once the advisor packet has been unlocked. */
  unlocked: boolean;
  /**
   * Opens RevenueCat's Customer Center — cancel, change plan, request a refund.
   * Null where the platform has no equivalent, so the screen can omit the
   * affordance instead of offering one that fails.
   */
  onManageSubscription: (() => void) | null;
  onUnlock: () => void;
  onExportPacket: () => void;
  /** Same evidence, framed for a parent or guardian rather than an advisor. */
  onShareWithGuardian: () => void;
  onBack: () => void;
}

export interface PaywallScreenProps {
  /**
   * True when the student told us they are still in school, so they may be a
   * minor. Not a gate — the store's age rating is a separate decision — but
   * someone who may be 14 should not be asked for money without being told to
   * involve a parent first.
   */
  schoolAge: boolean;
  /** Headline saving to anchor the price against. */
  savingUsd: number;
  /** The store's own localised price, once known. Null until the store answers. */
  priceLabel: string | null;
  /** True when the entitlement is already active — show a restored state, not a buy button. */
  alreadyOwned: boolean;
  busy: boolean;
  error: string | null;
  onPurchase: () => void;
  onRestore: () => void;
  onDismiss: () => void;
  /**
   * TEMPORARY testing unlock (see TESTING_UNLOCK in purchases/config.ts).
   * Null hides it — which is what every real build must do.
   */
  onTestingUnlock: (() => void) | null;
}
