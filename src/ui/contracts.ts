/**
 * Screen prop contracts. Screens are presentational: they receive data and
 * callbacks, never reach into the engine or the dataset themselves. App.tsx owns
 * all state and is the only place the engine is called.
 */
import type { Institution, Route, StudentInput, CreditSource, GeArea } from '../types.ts';

export interface InputScreenProps {
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

export interface RouteDetailScreenProps {
  institution: Institution;
  route: Route;
  /** So the screen can print "Humanities" rather than the bare code "3B". */
  areas: GeArea[];
  /** True once the advisor packet has been unlocked. */
  unlocked: boolean;
  onUnlock: () => void;
  onExportPacket: () => void;
  onBack: () => void;
}

export interface PaywallScreenProps {
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
