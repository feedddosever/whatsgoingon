/**
 * Screen prop contracts. Screens are presentational: they receive data and
 * callbacks, never reach into the engine or the dataset themselves. App.tsx owns
 * all state and is the only place the engine is called.
 */
import type { Institution, Route, StudentInput, CreditSource } from '../types.ts';

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
  /** Cost of the do-nothing path, used to show the saving. */
  baselineCostUsd: number;
  onSelectRoute: (route: Route) => void;
  onBack: () => void;
}

export interface RouteDetailScreenProps {
  institution: Institution;
  route: Route;
  /** True once the advisor packet has been unlocked. */
  unlocked: boolean;
  onUnlock: () => void;
  onExportPacket: () => void;
  onBack: () => void;
}

export interface PaywallScreenProps {
  /** Headline saving to anchor the price against. */
  savingUsd: number;
  busy: boolean;
  error: string | null;
  onPurchase: () => void;
  onRestore: () => void;
  onDismiss: () => void;
}
