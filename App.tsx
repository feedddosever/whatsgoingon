import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import type { AreaChoice, Route, RouteKind, StateCode, StudentInput } from './src/types.ts';
import {
  baselineCost, frameworkFor, optionsForArea, pathwayCosts, planAllRoutes, routeSaving,
  systemFor,
} from './src/engine.ts';
import { forState, unitedStates } from './src/dataset.ts';
import { theme } from './src/ui/theme.ts';
import { ProfileScreen } from './src/screens/ProfileScreen.tsx';
import { InputScreen } from './src/screens/InputScreen.tsx';
import { RoutesScreen } from './src/screens/RoutesScreen.tsx';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen.tsx';
import { PlanMapScreen } from './src/screens/PlanMapScreen.tsx';
import { exportAdvisorPacket } from './src/packet/advisorPacket.ts';
import { clearPlan, loadPlan, savePlan } from './src/storage.ts';
import { isSchoolAge } from './src/disclaimer.ts';
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

/**
 * Only the states we actually hold campuses for. Every state has a row in the
 * dataset — including the ones we have not mapped — but offering a student a
 * state with no campuses behind it would be a picker that leads nowhere.
 */
const STATES_WITH_CAMPUSES = unitedStates.jurisdictions.filter(j =>
  unitedStates.systems.some(sys =>
    sys.state === j.code && unitedStates.institutions.some(i => i.system === sys.id)));

const DEFAULT_STATE: StateCode = 'CA';

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
   * Which state's campuses the picker is showing. Derived from the chosen
   * campus when there is one, so a restored plan reopens on its own state
   * rather than snapping back to California and hiding the campus the student
   * picked last week.
   */
  const [browseState, setBrowseState] = useState<StateCode>(DEFAULT_STATE);
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
  /** Gate the first render so a restored plan does not flash onboarding first. */
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await loadPlan();
      if (!alive) { return; }
      if (saved !== null && saved.target_institution_id !== '') {
        // They already built a plan. Drop them back into it rather than making
        // them answer four questions again to reach the thing they came for.
        setInput(saved);
        setSelectedKind('cheapest');
        setScreen('map');
      }
      setRestoring(false);
    })();
    return () => { alive = false; };
  }, []);

  // Persist every edit. A plan is built over weeks — a policy checked, an
  // advisor asked, one line changed — so losing it on close would make the
  // editing pointless. Never persist the empty starting state over a real plan.
  useEffect(() => {
    if (restoring) return;
    if (input.target_institution_id === '') return;
    void savePlan(input);
  }, [input, restoring]);

  const startOver = useCallback(() => {
    void clearPlan();
    setInput(EMPTY_INPUT);
    setSelectedKind(null);
    setScreen('profile');
  }, []);

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
    () => unitedStates.institutions.find(i => i.id === input.target_institution_id) ?? null,
    [input.target_institution_id],
  );

  /**
   * The framework and the campus list follow the campus, not the picker. A
   * student who chose UT Austin and then tapped "California" to look around
   * must still see a Texas plan until they choose a Texas — sorry, a Californian
   * — campus: the plan is about the campus in it, and nothing else.
   */
  const framework = useMemo(
    () => (institution ? frameworkFor(unitedStates, institution) : null),
    [institution],
  );
  const system = useMemo(
    () => (institution ? systemFor(unitedStates, institution) : null),
    [institution],
  );

  const stateOfChosenCampus = system?.state ?? null;

  // Keep the picker on the state the plan is actually in.
  useEffect(() => {
    if (stateOfChosenCampus !== null && stateOfChosenCampus !== browseState) {
      setBrowseState(stateOfChosenCampus);
    }
    // Intentionally not depending on browseState: this corrects the picker to
    // follow the plan, and depending on it would fight the student's own taps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateOfChosenCampus]);

  const visible = useMemo(() => forState(unitedStates, browseState), [browseState]);

  // Recomputed only when the student's answers change — the engine is pure.
  const routes = useMemo(
    () => (institution ? planAllRoutes(unitedStates, input) : []),
    [institution, input],
  );
  const baseline = useMemo(
    () => (institution ? baselineCost(unitedStates, input) : 0),
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


  const sharePacket = useCallback((audience: 'advisor' | 'guardian') => {
    if (!institution || !selected) return;
    // exportAdvisorPacket rejects if rendering or sharing fails. The screen's
    // callback is synchronous, so the rejection has to be caught here or the tap
    // silently does nothing.
    if (framework === null || system === null) return;
    exportAdvisorPacket({
      institution,
      framework,
      system,
      route: selected,
      areas: unitedStates.areas,
      studentName: input.student_name,
      audience,
    }).catch((e: unknown) => {
      Alert.alert(
        'Could not create the packet',
        e instanceof Error ? e.message : 'Something went wrong building the PDF.',
      );
    });
  }, [institution, framework, system, selected, input.student_name]);

  const handleExport = useCallback(() => sharePacket('advisor'), [sharePacket]);
  const handleShareGuardian = useCallback(() => sharePacket('guardian'), [sharePacket]);

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
  if (restoring) {
    body = (
      <View style={styles.centre}>
        <ActivityIndicator color={theme.color.accent} />
      </View>
    );
  } else if (paywallOpen) {
    body = (
      <PaywallScreen
        schoolAge={isSchoolAge(input.profile.year)}
        savingUsd={selected === null ? 0 : routeSaving(unitedStates, input, selected)}
        priceLabel={priceLabel}
        alreadyOwned={unlocked}
        busy={busy}
        error={purchaseError}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onDismiss={() => { setPaywallOpen(false); setPurchaseError(null); }}
      />
    );
  } else if (screen === 'map' && institution && framework && system && selected) {
    body = (
      <PlanMapScreen
        institution={institution}
        framework={framework}
        system={system}
        route={selected}
        areas={unitedStates.areas}
        profile={input.profile}
        optionsFor={(areaId) => optionsForArea(unitedStates, input, areaId)}
        pathways={pathwayCosts(unitedStates, input)}
        choiceFor={(areaId) => input.plan_overrides?.[areaId]}
        onChoose={setOverride}
        onOpenDetail={() => setScreen('detail')}
        onShareWithGuardian={handleShareGuardian}
        onStartOver={startOver}
        onBack={() => setScreen('routes')}
      />
    );
  } else if (screen === 'detail' && institution && framework && system && selected) {
    body = (
      <RouteDetailScreen
        institution={institution}
        framework={framework}
        system={system}
        route={selected}
        areas={unitedStates.areas}
        unlocked={unlocked}
        onManageSubscription={
          unlocked && CUSTOMER_CENTER_AVAILABLE && RC_KEY !== '' ? handleManage : null
        }
        onUnlock={() => { setPurchaseError(null); setPaywallOpen(true); }}
        onExportPacket={handleExport}
        onShareWithGuardian={handleShareGuardian}
        onBack={() => setScreen('map')}
      />
    );
  } else if (screen === 'routes' && institution && framework && system) {
    body = (
      <RoutesScreen
        institution={institution}
        framework={framework}
        system={system}
        routes={routes}
        areas={unitedStates.areas}
        baselineCostUsd={baseline}
        onSelectRoute={(r) => { setSelectedKind(r.kind); setScreen('map'); }}
        onBack={() => setScreen('input')}
      />
    );
  } else if (screen === 'input') {
    body = (
      <InputScreen
        onBack={() => setScreen('profile')}
        states={STATES_WITH_CAMPUSES}
        selectedState={browseState}
        onSelectState={setBrowseState}
        systems={unitedStates.systems}
        institutions={visible.institutions}
        creditSources={visible.creditSources}
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
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
