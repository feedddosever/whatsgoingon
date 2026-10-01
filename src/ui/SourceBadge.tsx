/**
 * The provenance badge: how far we trust the claim beside it, and a tap that
 * opens the page it came from.
 *
 * Shared because "is this claim backed?" has to look the same on every screen —
 * a badge drawn one way in the onboarding and another on the degree screen would
 * be two answers to one question. Anything short of a confirmed source is drawn
 * dashed and dim so it cannot be mistaken for fact, and a row with no usable URL
 * stays flat rather than pretending to be a link.
 */
import type { ReactElement } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Provenance } from '../types.ts';
import { isBacked, linkable } from './provenance.ts';
import { confidenceColor, confidenceLabel, confidenceSpoken, theme } from './theme.ts';

/** A dead or unopenable source URL must never take the screen down with it. */
export const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

// `compact` is kept for callers; no badge prints a date any more.
export function SourceBadge({ p }: { p: Provenance; compact?: boolean }): ReactElement {
  const color = confidenceColor(p.confidence);
  // Anything a human has not confirmed against its source is drawn as a sketch.
  const shaky = !isBacked(p);
  const label = confidenceLabel(p.confidence);

  if (!linkable(p.source_url)) {
    return (
      <View style={[styles.badge, styles.badgeDead, { borderColor: color }]}>
        <Text style={[styles.badgeText, { color }]} numberOfLines={1}>
          {label} · no source on file
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => openSource(p.source_url)}
      hitSlop={8}
      accessibilityRole="link"
      accessibilityLabel={`${confidenceSpoken(p.confidence)}. Open source.`}
      style={({ pressed }) => [
        styles.badge,
        { borderColor: color },
        shaky && styles.badgeShaky,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.badgeText, { color }]} numberOfLines={1}>
        {label} ↗
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  // Unconfirmed data is drawn as a sketch, not a statement.
  badgeShaky: { borderStyle: 'dashed', opacity: 0.85 },
  // Nothing to open: flat, dotted, and it says so rather than baiting a tap.
  badgeDead: { borderStyle: 'dotted', opacity: 0.7 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
