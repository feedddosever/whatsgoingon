/**
 * The few pieces of motion the onboarding uses, in one place.
 *
 * Plain `Animated` from react-native, not a new dependency: every one of these is
 * an opacity or a transform, which the core driver handles on a device and
 * react-native-web handles in the browser. The native driver is off on web only
 * because react-native-web has none and says so in the console every time.
 *
 * Every animation here is decoration, never information — so each one respects
 * the system's reduce-motion setting and simply lands in its final state.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { AccessibilityRole, AccessibilityState, StyleProp, ViewStyle } from 'react-native';
import { theme } from './theme.ts';

const NATIVE = Platform.OS !== 'web';

/** True when the student has asked their device for less motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(v => { if (alive) setReduced(v); })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { alive = false; sub.remove(); };
  }, []);
  return reduced;
}

/**
 * Slides and fades its children in whenever `motionKey` changes — one question
 * leaving, the next arriving. `direction` is the way the student is travelling,
 * so going back comes in from the left and never feels like going forward.
 */
export function StepTransition(
  { motionKey, direction, children, style }: {
    motionKey: string;
    direction: 1 | -1;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
  },
): ReactElement {
  const reduced = useReducedMotion();
  const t = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduced) { t.setValue(1); return; }
    t.setValue(0);
    Animated.timing(t, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: NATIVE,
    }).start();
  }, [motionKey, reduced, t]);

  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [28 * direction, 0] });
  return (
    <Animated.View style={[style, { opacity: t, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * Children that arrive one after another rather than all at once. Used on the
 * welcome step, where a staggered entrance is the whole of the greeting.
 */
export function Stagger(
  { children, gap = 90 }: { children: ReactNode[]; gap?: number },
): ReactElement {
  const reduced = useReducedMotion();
  const values = useRef(children.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduced) { values.forEach(v => v.setValue(1)); return; }
    Animated.stagger(gap, values.map(v => Animated.timing(v, {
      toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE,
    }))).start();
  }, [reduced, values, gap]);

  return (
    <View>
      {children.map((child, i) => {
        const v = values[i] ?? new Animated.Value(1);
        const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
        return (
          <Animated.View
            key={i}
            style={{ opacity: v, transform: [{ translateY }] }}
          >
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
}

/** A gentle wave, a few times, then stillness — a hello, not a screensaver. */
export function Wave({ children }: { children: ReactNode }): ReactElement {
  const reduced = useReducedMotion();
  const r = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const swing = (to: number): Animated.CompositeAnimation =>
      Animated.timing(r, { toValue: to, duration: 140, easing: Easing.inOut(Easing.quad), useNativeDriver: NATIVE });
    Animated.sequence([
      Animated.delay(300),
      Animated.loop(Animated.sequence([swing(1), swing(-0.6), swing(0)]), { iterations: 3 }),
    ]).start();
  }, [reduced, r]);
  const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ['-18deg', '18deg'] });
  return (
    <Animated.View style={{ alignSelf: 'flex-start', transform: [{ rotate }] }}>
      {children}
    </Animated.View>
  );
}

/**
 * A Pressable that gives under the finger. The scale is small on purpose: the
 * point is to confirm the tap landed, not to make the option dance.
 *
 * Two styles, because the tap target has to be the whole card: `style` places
 * the wrapper that scales (flex basis, margins), `contentStyle` draws the card
 * itself on the Pressable, so padding is tappable rather than dead space.
 */
export function PressScale(
  {
    onPress, children, style, contentStyle, accessibilityRole, accessibilityState,
    accessibilityLabel, disabled,
  }: {
    onPress: () => void;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    accessibilityRole?: AccessibilityRole;
    accessibilityState?: AccessibilityState;
    accessibilityLabel?: string;
    disabled?: boolean;
  },
): ReactElement {
  const reduced = useReducedMotion();
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number): void => {
    if (reduced) return;
    Animated.spring(s, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: NATIVE }).start();
  };
  return (
    <Animated.View style={[style, { transform: [{ scale: s }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => to(0.97)}
        onPressOut={() => to(1)}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
        style={[styles.fill, contentStyle]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

/** The thin bar across the top that fills as the questions are answered. */
export function ProgressBar({ progress }: { progress: number }): ReactElement {
  const reduced = useReducedMotion();
  const w = useRef(new Animated.Value(progress)).current;
  useEffect(() => {
    if (reduced) { w.setValue(progress); return; }
    // Width cannot run on the native driver, and does not need to: it is one
    // short tween per answered question.
    Animated.timing(w, {
      toValue: progress, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, [progress, reduced, w]);
  const width = w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.track} accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}>
      <Animated.View style={[styles.fillBar, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flexGrow: 1 },
  track: {
    height: 4, borderRadius: 2, backgroundColor: theme.color.border, overflow: 'hidden', flex: 1,
  },
  fillBar: { height: 4, borderRadius: 2, backgroundColor: theme.color.accent },
});
