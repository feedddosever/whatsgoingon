import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import type { AreaChoice, Route, RouteKind, StudentInput } from './src/types.ts';
import { baselineCost, optionsForArea, planAllRoutes, routeSaving } from './src/engine.ts';
import { california } from './src/dataset.ts';
import { theme } from './src/ui/theme.ts';
import { ProfileScreen } from './src/screens/ProfileScreen.tsx';
import { InputScreen } from './src/screens/InputScreen.tsx';
import { RoutesScreen } from './src/screens/RoutesScreen.tsx';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen.tsx';
import { PlanMapScreen } from './src/screens/PlanMapScreen.tsx';
import { exportAdvisorPacket } from './src/packet/advisorPacket.ts';
import { PaywallScreen } from './src/screens/PaywallScreen.tsx';
import { NATIVE_API_KEY, WEB_API_KEY } from './src/purchases/config.ts';
import {
  CUSTOMER_CENTER_AVAILABLE,
  configurePurchases,
  getAdvisorPacketPrice,
  hasAdvisorPacket,
  presentCustomerCenter,
  purchaseAdvisorPacket,
  restorePurchases,
} from './src/purchases/revenuecat';

/** Public SDK key for this platform. Web Billing and the stores use different ones. */
const RC_KEY = Platform.OS === 'web' ? WEB_API_KEY : NATIVE_API_KEY;

type Screen = 'profile' | 'input' | 'routes' | 'map' | 'detail';

const EMPTY_INPUT: StudentInput = {
  profile: {
    year: 'grade_12',
    field: 'undecided',
    budget_usd: null,
    waiver: 'unsure',
  },
  target_institution_id: '',
  held_credit_ids: [],
  units_in_residence: 0,
};

/**
 * App owns all state and is the only caller of the engine; every screen below is
 * presentational. That boundary is what lets the engine be tested in Node with
 * no React in the room.
 *
 * Purchases run through RevenueCat on both platforms: react-native-purchases on
 * a device, @revenuecat/purchases-js on web. Metro picks the implementation, so
 * nothing here knows which one it got.
 *
 * With no API key configured the app still works end to end — the paywall simply
 * reports that purchases are unavailable. Nothing crashes and nothing is hidden.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('profile');
  const [input, setInput] = useState<StudentInput>(EMPTY_INPUT);
  /**
   * The chosen route is held as its KIND, not as a Route object. Editing the
   * plan re-runs the engine, and a stored Route would be a snapshot of the plan
   * before the edit — the map would show a stale choice back to the student who
   * just made it.
   */
  const [selectedKind, setSelectedKind] = useState<RouteKind | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [priceLabel, setPriceLabel] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (RC_KEY === '') return;
        await configurePurchases(RC_KEY);
        const owned = await hasAdvisorPacket();
        if (alive) setUnlocked(owned);
        const price = await getAdvisorPacketPrice();
        if (alive) setPriceLabel(price);
      } catch {
        // A purchase system that will not answer at launch means "locked", not
        // "crash". An unhandled rejection here would take the app down on open.
        if (alive) setUnlocked(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /**
   * Android's hardware back button. Without this the whole four-screen flow is a
   * trap on a real device: back from the detail screen quits the app instead of
   * returning, and everything the student typed is gone. Web and iOS have their
   * own gestures, so the listener is Android-only.
   *
   * Returning true means "handled, do not exit". At the first screen we return
   * false so back does what the user expects and leaves.
   */
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const PREVIOUS: Record<Screen, Screen | null> = {
      profile: null,
      input: 'profile',
      routes: 'input',
      map: 'routes',
      detail: 'map',
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const back = PREVIOUS[screen];
      if (back === null) return false;
      setScreen(back);
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  const institution = useMemo(
    () => california.institutions.find(i => i.id === input.target_institution_id) ?? null,
    [input.target_institution_id],
  );

  // Recomputed only when the student's answers change — the engine is pure.
  const routes = useMemo(
    () => (institution ? planAllRoutes(california, input) : []),
    [institution, input],
  );
  const baseline = useMemo(
    () => (institution ? baselineCost(california, input) : 0),
    [institution, input],
  );

  const selected: Route | null =
    selectedKind === null ? null : routes.find(r => r.kind === selectedKind) ?? null;

  const setOverride = useCallback((areaId: string, choice: AreaChoice | null) => {
    setInput(prev => {
      const next = { ...(prev.plan_overrides ?? {}) };
      if (choice === null) delete next[areaId];
      else next[areaId] = choice;
      return { ...prev, plan_overrides: next };
    });
  }, []);


  const handleExport = useCallback(() => {
    if (!institution || !selected) return;
    // exportAdvisorPacket rejects if rendering or sharing fails. The screen's
    // callback is synchronous, so the rejection has to be caught here or the tap
    // silently does nothing.
    exportAdvisorPacket({
      institution,
      route: selected,
      areas: california.areas,
      studentName: input.student_name,
    }).catch((e: unknown) => {
      Alert.alert(
        'Could not create the packet',
        e instanceof Error ? e.message : 'Something went wrong building the PDF.',
      );
    });
  }, [institution, selected, input.student_name]);

  const handlePurchase = useCallback(async () => {
    setBusy(true);
    setPurchaseError(null);
    try {
      const ok = await purchaseAdvisorPacket();
      if (ok) {
        setUnlocked(true);
        setPaywallOpen(false);
      }
      // false means the student backed out. That is a choice, not an error, and
      // must not raise a red alert at them.
    } catch (e) {
      setPurchaseError(e instanceof Error ? e.message : 'Purchase failed.');
    } finally {
      setBusy(false);
    }
  }, []);

  const handleRestore = useCallback(async () => {
    setBusy(true);
    setPurchaseError(null);
    try {
      const ok = await restorePurchases();
      if (ok) {
        setUnlocked(true);
        setPaywallOpen(false);
      } else {
        // An answer, not a failure — but saying nothing makes the link look broken.
        setPurchaseError('No earlier purchase found for this browser or store account.');
      }
    } catch (e) {
      setPurchaseError(e instanceof Error ? e.message : 'Could not restore purchases.');
    } finally {
      setBusy(false);
    }
  }, []);

  /**
   * One of the products is a monthly subscription, so a student must be able to
   * cancel it from inside the app. Null where the platform cannot, rather than
   * an affordance that throws.
   */
  const handleManage = useCallback(() => {
    presentCustomerCenter().catch((e: unknown) => {
      Alert.alert(
        'Could not open subscription management',
        e instanceof Error ? e.message : 'Something went wrong.',
      );
    });
  }, []);

  let body = null;
  if (paywallOpen) {
    body = (
      <PaywallScreen
        savingUsd={selected === null ? 0 : routeSaving(california, input, selected)}
        priceLabel={priceLabel}
        alreadyOwned={unlocked}
        busy={busy}
        error={purchaseError}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onDismiss={() => { setPaywallOpen(false); setPurchaseError(null); }}
      />
    );
  } else if (screen === 'map' && institution && selected) {
    body = (
      <PlanMapScreen
        institution={institution}
        route={selected}
        areas={california.areas}
        profile={input.profile}
        optionsFor={(areaId) => optionsForArea(california, input, areaId)}
        choiceFor={(areaId) => input.plan_overrides?.[areaId]}
        onChoose={setOverride}
        onOpenDetail={() => setScreen('detail')}
        onBack={() => setScreen('routes')}
      />
    );
  } else if (screen === 'detail' && institution && selected) {
    body = (
      <RouteDetailScreen
        institution={institution}
        route={selected}
        areas={california.areas}
        unlocked={unlocked}
        onManageSubscription={
          unlocked && CUSTOMER_CENTER_AVAILABLE && RC_KEY !== '' ? handleManage : null
        }
        onUnlock={() => { setPurchaseError(null); setPaywallOpen(true); }}
        onExportPacket={handleExport}
        onBack={() => setScreen('map')}
      />
    );
  } else if (screen === 'routes' && institution) {
    body = (
      <RoutesScreen
        institution={institution}
        routes={routes}
        areas={california.areas}
        baselineCostUsd={baseline}
        onSelectRoute={(r) => { setSelectedKind(r.kind); setScreen('map'); }}
        onBack={() => setScreen('input')}
      />
    );
  } else if (screen === 'input') {
    body = (
      <InputScreen
        onBack={() => setScreen('profile')}
        institutions={california.institutions}
        creditSources={california.creditSources}
        value={input}
        onChange={setInput}
        onSubmit={() => { if (institution) setScreen('routes'); }}
      />
    );
  } else {
    body = (
      <ProfileScreen
        value={input.profile}
        onChange={(profile) => setInput(prev => ({ ...prev, profile }))}
        onSubmit={() => setScreen('input')}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/* edges includes bottom: react-native's own SafeAreaView is a no-op on
          Android, which would put the sticky CTAs under the gesture bar. */}
      <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
        {body}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg },
});
