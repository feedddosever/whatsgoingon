import type { ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { FieldOfStudy, SchoolYear, StudentProfile, WaiverStatus } from '../types.ts';
import type { ProfileScreenProps } from '../ui/contracts.ts';
import { theme } from '../ui/theme.ts';

/**
 * Four questions, and every one of them changes the plan.
 *
 * This is deliberately not a profile form. Anything that would only be stored
 * does not belong here: a question the student answers must visibly alter what
 * they are shown, or it is a tax on their attention before they have been given
 * anything.
 *
 *   year    -> which pathways are still reachable (dual enrolment closes at 12)
 *   field   -> whether locked major sequences apply to them
 *   budget  -> whether a route is affordable, not merely cheap
 *   waiver  -> what the credit actually costs them; can take a route to $0
 */

const YEARS: ReadonlyArray<readonly [SchoolYear, string, string]> = [
  ['grade_9', '9th grade', 'Every route still open'],
  ['grade_10', '10th grade', 'Dual enrolment still reachable'],
  ['grade_11', '11th grade', 'Best year to start banking credit'],
  ['grade_12', '12th grade', 'AP deadlines matter now'],
  ['in_college', 'Already in college', 'We plan around what you have'],
];

const FIELDS: ReadonlyArray<readonly [FieldOfStudy, string]> = [
  ['stem', 'STEM'],
  ['business', 'Business'],
  ['health', 'Health'],
  ['social_sciences', 'Social sciences'],
  ['arts_humanities', 'Arts & humanities'],
  ['undecided', 'Not decided yet'],
];

const WAIVERS: ReadonlyArray<readonly [WaiverStatus, string, string]> = [
  ['eligible', 'Yes', 'We will price your plan at the waived rate'],
  ['unsure', 'Not sure', 'We will quote full price and show you what to check'],
  ['not_eligible', 'No', 'We will quote full price'],
];

/** Digits only, and an empty box means "not saying" rather than a budget of $0. */
function parseBudget(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits === '') return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function Choice({
  label, hint, selected, onPress,
}: {
  label: string; hint?: string; selected: boolean; onPress: () => void;
}): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      style={[styles.choice, selected && styles.choiceOn]}
    >
      <Text style={[styles.choiceLabel, selected && styles.choiceLabelOn]} numberOfLines={2}>
        {label}
      </Text>
      {hint !== undefined && (
        <Text style={styles.choiceHint} numberOfLines={2}>{hint}</Text>
      )}
    </Pressable>
  );
}

export function ProfileScreen(props: ProfileScreenProps): ReactElement {
  const { value, onChange, onSubmit } = props;
  const set = (patch: Partial<StudentProfile>): void => onChange({ ...value, ...patch });

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.kicker}>DEGREE ROUTE PLANNER</Text>
        <Text style={styles.title}>First, four quick questions.</Text>
        <Text style={styles.sub}>
          Each one changes the plan we build. Nothing is stored anywhere.
        </Text>

        <Text style={styles.q}>Where are you right now?</Text>
        <View style={styles.grid} accessibilityRole="radiogroup">
          {YEARS.map(([id, label, hint]) => (
            <Choice
              key={id} label={label} hint={hint}
              selected={value.year === id} onPress={() => set({ year: id })}
            />
          ))}
        </View>

        <Text style={styles.q}>What are you heading into?</Text>
        <Text style={styles.qHint}>
          Broad is fine. We only use this to warn you when a major has a locked
          sequence that general-education planning cannot shorten.
        </Text>
        <View style={styles.grid} accessibilityRole="radiogroup">
          {FIELDS.map(([id, label]) => (
            <Choice
              key={id} label={label}
              selected={value.field === id} onPress={() => set({ field: id })}
            />
          ))}
        </View>

        <Text style={styles.q}>What can you spend on credit?</Text>
        <Text style={styles.qHint}>
          Not tuition — just what you can put toward exams and community-college
          courses. Leave it blank if you would rather not say.
        </Text>
        <View style={styles.budgetRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.budgetInput}
            value={value.budget_usd === null ? '' : String(value.budget_usd)}
            onChangeText={t => set({ budget_usd: parseBudget(t) })}
            placeholder="no limit"
            placeholderTextColor={theme.color.textMuted}
            inputMode="numeric"
            selectTextOnFocus
            accessibilityLabel="Budget in dollars"
          />
        </View>

        <Text style={styles.q}>Do you qualify for a fee waiver?</Text>
        <Text style={styles.qHint}>
          The California College Promise Grant waives community-college enrolment
          fees, and Modern States covers CLEP exam fees. Either can take a whole
          route to $0 — this is the question that moves the number most.
        </Text>
        <View style={styles.grid} accessibilityRole="radiogroup">
          {WAIVERS.map(([id, label, hint]) => (
            <Choice
              key={id} label={label} hint={hint}
              selected={value.waiver === id} onPress={() => set({ waiver: id })}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={onSubmit} accessibilityRole="button" style={styles.cta}>
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { padding: theme.space.md, paddingBottom: theme.space.xl },
  kicker: {
    ...theme.font.small, color: theme.color.textMuted,
    letterSpacing: 2, marginBottom: theme.space.sm,
  },
  title: { ...theme.font.title, color: theme.color.text },
  sub: {
    ...theme.font.body, color: theme.color.textMuted,
    marginTop: theme.space.xs, marginBottom: theme.space.lg,
  },
  q: {
    ...theme.font.heading, color: theme.color.text,
    marginTop: theme.space.lg, marginBottom: theme.space.xs,
  },
  qHint: {
    ...theme.font.small, color: theme.color.textMuted,
    marginBottom: theme.space.sm, lineHeight: 18,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  choice: {
    borderWidth: 1, borderColor: theme.color.border, borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    paddingVertical: theme.space.sm, paddingHorizontal: theme.space.md,
    flexGrow: 1, flexShrink: 1, flexBasis: '45%',
  },
  choiceOn: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  choiceLabel: { ...theme.font.body, color: theme.color.text, fontWeight: '600' },
  choiceLabelOn: { color: theme.color.accent },
  choiceHint: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2 },
  budgetRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: theme.color.border, borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface, paddingHorizontal: theme.space.md,
  },
  currency: { ...theme.font.title, color: theme.color.textMuted },
  budgetInput: {
    ...theme.font.title, color: theme.color.text,
    flex: 1, paddingVertical: theme.space.sm, marginLeft: theme.space.xs,
  },
  footer: {
    padding: theme.space.md,
    borderTopWidth: 1, borderTopColor: theme.color.border,
    backgroundColor: theme.color.bg,
  },
  cta: {
    backgroundColor: theme.color.accent, borderRadius: theme.radius.md,
    paddingVertical: theme.space.md, alignItems: 'center',
  },
  ctaText: { ...theme.font.heading, color: theme.color.bg },
});
