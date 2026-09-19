/**
 * Screen prop contracts. Screens are presentational: they receive data and
 * callbacks, never reach into the engine or the dataset themselves. App.tsx owns
 * all state and is the only place the engine is called.
 */
import type {
  Institution, Route, StudentInput, CreditSource, GeArea, StudentProfile,
  AreaChoice, PlanItem,
} from '../types.ts';
import type { PathwayCost } from '../engine.ts';

export interface ProfileScreenProps {
  value: StudentProfile;
  onChange: (next: StudentProfile) => void;
  onSubmit: () => void;
}

export interface InputScreenProps {
  /** Back to the onboarding answers, which change how this plan is priced. */
  onBack: () => void;
  institutions: Institution[];
  creditSources: CreditSource[];
  value: StudentInput;
  onChange: (next: StudentInput) => void;
  onSubmit: () => void;
}

export interface RoutesScreenProps {
  institution: Institution;
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
  /** Sends the plan to a parent or guardian, framed for them rather than an advisor. */
  onShareWithGuardian: () => void;
  /** Clears the saved plan and returns to the first question. */
  onStartOver: () => void;
  onBack: () => void;
}

export interface RouteDetailScreenProps {
  institution: Institution;
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
}
