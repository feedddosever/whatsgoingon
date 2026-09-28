/**
 * The beat between the last question and the answer: a salt shaker seasoning a
 * salad, once, then the routes.
 *
 * The engine is synchronous and finishes before this screen has drawn a frame,
 * so this is not a spinner hiding work — it is a pause, on purpose, so the
 * answer arrives as an answer rather than as the next form. One pass of the
 * animation and no more; a tap anywhere skips it, and with reduce-motion on it
 * is a still picture for under a second.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { PreparingScreenProps } from '../ui/contracts.ts';
import { LOOP_S, SaladScene } from '../ui/SaladScene.tsx';
import { useReducedMotion } from '../ui/motion.tsx';
import { theme } from '../ui/theme.ts';

/** A still frame with salt mid-air, for reduce-motion. */
const STILL_T = 0.62;
const STILL_MS = 900;

export function PreparingScreen({ variant, campusName, onDone }: PreparingScreenProps): ReactElement {
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  const size = Math.min(width - theme.space.md * 2, 360);
  const [t, setT] = useState<number>(reduced ? STILL_T : 0);
  const done = useRef<boolean>(false);

  const finish = (): void => {
    if (done.current) return;
    done.current = true;
    onDone();
  };

  useEffect(() => {
    if (reduced) {
      setT(STILL_T);
      const id = setTimeout(finish, STILL_MS);
      return () => clearTimeout(id);
    }
    let frame = 0;
    const start = Date.now();
    const tick = (): void => {
      const s = (Date.now() - start) / 1000;
      if (s >= LOOP_S) { finish(); return; }
      setT(s);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `finish` is stable in effect: it only ever calls the latest onDone once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const lines = [
    `Reading ${campusName}’s policies`,
    'Pricing your requirements',
    'Checking every source',
  ];
  const line = lines[Math.min(lines.length - 1, Math.floor((t / LOOP_S) * lines.length))];

  return (
    <Pressable
      onPress={finish}
      style={styles.root}
      accessibilityRole="button"
      accessibilityLabel="Preparing your plan. Tap to skip."
    >
      <View style={styles.centre}>
        <SaladScene t={t} variant={variant} size={size} />
        <Text style={styles.caption}>Preparing your plan</Text>
        <Text style={styles.sub} accessibilityLiveRegion="polite">{line}</Text>
      </View>
      <Text style={styles.skip}>Tap to skip</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg, justifyContent: 'center' },
  centre: { alignItems: 'center', paddingHorizontal: theme.space.md },
  caption: { ...theme.font.title, fontSize: 21, color: theme.color.text, marginTop: theme.space.sm },
  sub: { ...theme.font.body, color: theme.color.textMuted, marginTop: theme.space.xs, minHeight: 20 },
  skip: {
    ...theme.font.small, color: theme.color.textMuted, opacity: 0.6,
    position: 'absolute', bottom: theme.space.lg, alignSelf: 'center',
  },
});
