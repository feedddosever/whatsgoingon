import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import type { Route, StudentInput } from './src/types.ts';
import { baselineCost, planAllRoutes, routeSaving } from './src/engine.ts';
import { california } from './src/dataset.ts';
import { theme } from './src/ui/theme.ts';
import { InputScreen } from './src/screens/InputScreen.tsx';
import { RoutesScreen } from './src/screens/RoutesScreen.tsx';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen.tsx';
import { PaywallScreen } from './src/screens/PaywallScreen.tsx';
import { exportAdvisorPacket } from './src/packet/advisorPacket.ts';
import {
  configurePurchases,
  getAdvisorPacketPrice,
  hasAdvisorPacket,
  purchaseAdvisorPacket,
  restorePurchases,
} from './src/purchases/revenuecat.ts';

/**
 * RevenueCat public SDK key. Safe to ship in the bundle (it is the *public* key),
 * but it is per-store: the Galaxy Store build needs the Amazon/Samsung key, not
 * the Google Play one.
 */
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';

type Screen = 'input' | 'routes' | 'detail';

const EMPTY_INPUT: StudentInput = {
  target_institution_id: '',
  held_credit_ids: [],
  units_in_residence: 0,
};

/**
 * App owns all state and is the only caller of the engine; every screen below is
 * presentational. That boundary is what lets the engine be tested in Node with
 * no React in the room.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('input');
  const [input, setInput] = useState<StudentInput>(EMPTY_INPUT);
  const [selected, setSelected] = useState<Route | null>(null);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [priceLabel, setPriceLabel] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (REVENUECAT_API_KEY) {
          await configurePurchases(REVENUECAT_API_KEY);
          const owned = await hasAdvisorPacket();
          if (alive) setUnlocked(owned);
          // Never throws; a null price just means the paywall stays honest
          // about not knowing it yet.
          const price = await getAdvisorPacketPrice();
          if (alive) setPriceLabel(price);
        }
      } catch {
        // A store that will not answer at launch means "locked", not "crash".
        // hasAdvisorPacket rejects on transient network failure; an unhandled
        // rejection here would take the app down on open.
        if (alive) setUnlocked(false);
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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

  // Credit a route only for the requirements it actually clears — see routeSaving.
  const savingFor = useCallback(
    (r: Route | null) => (r && institution ? routeSaving(california, input, r) : 0),
    [institution, input],
  );

  const handlePurchase = useCallback(async () => {
    setBusy(true);
    setPurchaseError(null);
    try {
      const ok = await purchaseAdvisorPacket();
      if (ok) {
        setUnlocked(true);
        setPaywallOpen(false);
      }
      // ok === false means the student deliberately cancelled. That is not an
      // error and must not raise a red alert at them.
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
        // A false here is an answer, not a failure — but saying nothing makes
        // the restore link look broken.
        setPurchaseError('No earlier purchase found on this store account.');
      }
    } catch (e) {
      setPurchaseError(e instanceof Error ? e.message : 'Could not restore purchases.');
    } finally {
      setBusy(false);
    }
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

  let body = null;
  if (booting) {
    body = (
      <View style={styles.centre}>
        <ActivityIndicator color={theme.color.accent} />
      </View>
    );
  } else if (paywallOpen) {
    body = (
      <PaywallScreen
        savingUsd={savingFor(selected)}
        priceLabel={priceLabel}
        alreadyOwned={unlocked}
        busy={busy}
        error={purchaseError}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onDismiss={() => { setPaywallOpen(false); setPurchaseError(null); }}
      />
    );
  } else if (screen === 'detail' && institution && selected) {
    body = (
      <RouteDetailScreen
        institution={institution}
        route={selected}
        areas={california.areas}
        unlocked={unlocked}
        onUnlock={() => { setPurchaseError(null); setPaywallOpen(true); }}
        onExportPacket={handleExport}
        onBack={() => setScreen('routes')}
      />
    );
  } else if (screen === 'routes' && institution) {
    body = (
      <RoutesScreen
        institution={institution}
        routes={routes}
        areas={california.areas}
        baselineCostUsd={baseline}
        onSelectRoute={(r) => { setSelected(r); setScreen('detail'); }}
        onBack={() => setScreen('input')}
      />
    );
  } else {
    body = (
      <InputScreen
        institutions={california.institutions}
        creditSources={california.creditSources}
        value={input}
        onChange={setInput}
        onSubmit={() => { if (institution) setScreen('routes'); }}
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
