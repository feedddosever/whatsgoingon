import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import type { Route, StudentInput } from './src/types.ts';
import { baselineCost, planAllRoutes, routeSaving } from './src/engine.ts';
import { california } from './src/dataset.ts';
import { theme } from './src/ui/theme.ts';
import { ProfileScreen } from './src/screens/ProfileScreen.tsx';
import { InputScreen } from './src/screens/InputScreen.tsx';
import { RoutesScreen } from './src/screens/RoutesScreen.tsx';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen.tsx';
import { exportAdvisorPacket } from './src/packet/advisorPacket.ts';

type Screen = 'profile' | 'input' | 'routes' | 'detail';

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
 * PAYMENT IS STUBBED. The advisor packet unlocks for free. src/purchases/
 * revenuecat.ts is written and tested but deliberately not wired in: it has no
 * web implementation, it needs a real store account and a physical Galaxy device
 * to exercise, and none of that should stand between a student and the document.
 * Restoring it means putting the paywall back in place of grantPacket() below.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('profile');
  const [input, setInput] = useState<StudentInput>(EMPTY_INPUT);
  const [selected, setSelected] = useState<Route | null>(null);
  const [unlocked, setUnlocked] = useState(false);

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
      detail: 'routes',
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

  /** Stands in for the paywall until purchasing is wired up. */
  const grantPacket = useCallback(() => setUnlocked(true), []);

  let body = null;
  if (screen === 'detail' && institution && selected) {
    body = (
      <RouteDetailScreen
        institution={institution}
        route={selected}
        areas={california.areas}
        unlocked={unlocked}
        onUnlock={grantPacket}
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
