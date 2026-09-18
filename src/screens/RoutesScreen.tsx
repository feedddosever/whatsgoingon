/**
 * RoutesScreen — the three plans, side by side.
 *
 * The saving is the hook, so it is the largest thing on the screen. Everything
 * else here exists to keep that number from becoming a lie: the weakest row
 * behind each route, the note saying what could bite the student, and the
 * warnings that say this campus will not honour credit the student already holds.
 */
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type {
  Confidence,
  Institution,
  PlanItem,
  Provenance,
  Route,
  RouteKind,
} from '../types.ts';
import type { RoutesScreenProps } from '../ui/contracts.ts';
import { confidenceColor, confidenceLabel, money, theme } from '../ui/theme.ts';

const KIND_LABEL: Record<RouteKind, string> = {
  cheapest: 'Cheapest',
  fastest: 'Fastest',
  lowest_risk: 'Lowest-risk',
};

const KIND_BLURB: Record<RouteKind, string> = {
  cheapest: 'The least money, however many terms it takes.',
  fastest: 'Exams instead of semesters — the fewest terms before you finish.',
  // Said plainly, not apologetically: refusing to bet on an unchecked row is the
  // feature being sold, so the smaller number is the honest one.
  lowest_risk:
    'Only credit backed by California statute or a published campus policy. It usually saves less — that is the point.',
};

const RANK: Record<Confidence, number> = {
  statute: 0,
  published: 1,
  needs_check: 2,
  unverified: 3,
};

const isTrusted = (c: Confidence): boolean => c === 'statute' || c === 'published';

/** A route is only as good as its worst row, so that is the row we put on the card. */
function weakestItem(route: Route): PlanItem | null {
  let worst: PlanItem | null = null;
  for (const item of route.items) {
    if (worst === null || RANK[item.provenance.confidence] > RANK[worst.provenance.confidence]) {
      worst = item;
    }
  }
  return worst;
}

const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Only an http(s) source can be opened; anything else would be a dead link. */
const linkable = (url: string): boolean => /^https?:\/\//i.test(url.trim());

/** No error surface exists on this screen, and a dead link must not take it down. */
const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

/** Seeded rows carry an empty as_of. Saying so is the honest reading. */
const checkedOn = (asOf: string): string =>
  asOf.trim() === '' ? 'not yet opened' : `read ${asOf.trim()}`;

const policyLine = (inst: Institution): string => {
  const clep = inst.accepts_clep ? 'accepts CLEP' : 'does not accept CLEP';
  const cap =
    inst.max_transfer_units === null
      ? 'no transfer cap'
      : `${inst.max_transfer_units}-unit transfer cap`;
  return `${inst.system} · ${clep} · ${cap} · ${inst.residency_min_units} units must be earned on campus`;
};

interface ProvenanceBadgeProps {
  provenance: Provenance;
  label?: string;
  /** Suppressed only where the same note is already printed a few lines above. */
  showNote?: boolean;
}

function ProvenanceBadge(props: ProvenanceBadgeProps) {
  const { source_url, as_of, confidence, note } = props.provenance;
  const tint = confidenceColor(confidence);
  const text =
    props.label === undefined
      ? confidenceLabel(confidence)
      : `${props.label} — ${confidenceLabel(confidence)}`;
  const trimmedNote = note === undefined ? '' : note.trim();

  return (
    <View style={styles.provBlock}>
      <View style={styles.provRow}>
        <View
          style={[styles.badge, { borderColor: tint }, !isTrusted(confidence) && styles.badgeSoft]}
        >
          <View style={[styles.badgeDot, { backgroundColor: tint }]} />
          <Text style={[styles.badgeText, { color: tint }]}>{text}</Text>
        </View>
        {linkable(source_url) ? (
          <Pressable
            onPress={() => openSource(source_url)}
            hitSlop={10}
            accessibilityRole="link"
            accessibilityLabel={
              as_of.trim() === ''
                ? 'Open the source page. Nobody has read it yet.'
                : `Open the source page, last read ${as_of.trim()}`
            }
          >
            {/* An empty as_of means nobody has opened the page. Say it rather than hide it. */}
            <Text style={styles.sourceLink}>source · {checkedOn(as_of)}</Text>
          </Pressable>
        ) : (
          // A row with no usable URL stays flat rather than pretending to be a link
          // that silently does nothing when tapped.
          <Text style={styles.sourceDead}>no source on file</Text>
        )}
      </View>
      {/* `note` is where the dataset records what could bite the student — a score
          minimum, a cap, a claim that has to be confirmed. Dropping it would turn
          provenance back into the decoration this product refuses to make it. */}
      {props.showNote !== false && trimmedNote !== '' && (
        <Text style={styles.provNote}>{trimmedNote}</Text>
      )}
    </View>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{props.value}</Text>
      <Text style={styles.statLabel}>{props.label}</Text>
    </View>
  );
}

interface RouteCardProps {
  route: Route;
  savingUsd: number;
  institutionName: string;
  /** Warnings this route adds on top of the ones already banner-ed above. */
  extraWarnings: string[];
  sharedWarningCount: number;
  headline: boolean;
  onPress: () => void;
}

function RouteCard(props: RouteCardProps) {
  const {
    route,
    savingUsd,
    institutionName,
    extraWarnings,
    sharedWarningCount,
    headline,
    onPress,
  } = props;
  const worst = weakestItem(route);
  const trusted = worst !== null && isTrusted(worst.provenance.confidence);
  const shaky = route.items.filter(i => !isTrusted(i.provenance.confidence)).length;
  const areasTotal = route.areas_cleared.length + route.areas_unmet.length;
  const empty = route.items.length === 0;
  const settled = empty && route.areas_unmet.length === 0;

  // A route that costs more than the baseline has not saved "nothing" — it has
  // lost money, and rounding that up to zero is the sort of flattery this app exists
  // to refuse.
  const savingText =
    savingUsd > 0
      ? `Saves ${money(savingUsd)}`
      : savingUsd < 0
        ? `Costs ${money(-savingUsd)} more than doing nothing`
        : 'Saves nothing against the baseline';

  const summary = empty
    ? `${KIND_LABEL[route.kind]} route. Nothing we would recommend. ${plural(route.warnings.length, 'warning')}.`
    : `${KIND_LABEL[route.kind]} route. ${savingText}. Costs ${money(route.total_cost_usd)}, ` +
      `${plural(route.total_units, 'unit')}, clears ${route.areas_cleared.length} of ${areasTotal} areas, ` +
      `${plural(route.warnings.length, 'warning')}.`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={summary}
      accessibilityHint="Opens the full plan, row by row"
      style={({ pressed }) => [
        styles.card,
        // Being the biggest saving never buys a card the confirmed-data treatment:
        // the "unsure" skin is applied last so it cannot be overridden by it.
        headline && (trusted ? styles.cardHeadline : styles.cardHeadlineUnsure),
        !trusted && styles.cardUnsure,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardKind}>{KIND_LABEL[route.kind]}</Text>
        {headline && (
          // The pill borrows the accent only when the rows underneath earn it.
          <Text style={[styles.pill, trusted ? styles.pillTrusted : styles.pillUnsure]}>
            Biggest saving
          </Text>
        )}
      </View>
      <Text style={styles.cardBlurb}>{KIND_BLURB[route.kind]}</Text>

      {empty ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>
            {settled ? 'Nothing left to buy.' : 'Nothing here we would stake your money on.'}
          </Text>
          <Text style={styles.emptyBody}>
            {settled
              ? `Credit you already hold clears every area at ${institutionName}.`
              : route.kind === 'lowest_risk'
                ? `Every row that could clear ${route.areas_unmet.join(', ')} is still unconfirmed, so this route will not put your money on any of it.`
                : `No credit in our data clears ${route.areas_unmet.join(', ')} at ${institutionName}.`}
          </Text>
        </View>
      ) : (
        <View style={styles.cardBody}>
          <Text
            style={[
              styles.cardSaving,
              trusted && savingUsd > 0 ? styles.cardSavingTrusted : styles.cardSavingUnsure,
            ]}
          >
            {savingText}
          </Text>
          {!trusted && savingUsd > 0 && (
            <Text style={styles.cardSavingCaveat}>
              Not a confirmed figure — it rests on rows nobody has checked against the source.
            </Text>
          )}
          <View style={styles.statRow}>
            <Stat label="Total cost" value={money(route.total_cost_usd)} />
            <Stat label="Units" value={String(route.total_units)} />
            <Stat label="Areas cleared" value={`${route.areas_cleared.length} of ${areasTotal}`} />
          </View>
        </View>
      )}

      {extraWarnings.length > 0 ? (
        <View style={styles.cardWarn}>
          <Text style={styles.cardWarnCount}>
            {plural(extraWarnings.length, 'warning')} on this route
          </Text>
          {/* Never clamped: a warning the student cannot finish reading is a warning
              that did not do its job. */}
          <Text style={styles.cardWarnText}>{extraWarnings[0]}</Text>
          {extraWarnings.length > 1 && (
            <Text style={styles.cardWarnMore}>+{extraWarnings.length - 1} more in the full plan</Text>
          )}
        </View>
      ) : (
        <Text style={styles.cardWarnNone}>
          {sharedWarningCount > 0
            ? `Nothing beyond the ${sharedWarningCount === 1 ? 'warning' : `${sharedWarningCount} warnings`} above.`
            : 'No warnings on this route.'}
        </Text>
      )}

      {worst !== null && (
        <View style={styles.evidence}>
          <Text style={styles.evidenceLabel}>
            Weakest row: {worst.label}
            {shaky > 0 ? ` · ${shaky} of ${route.items.length} rows unconfirmed` : ''}
          </Text>
          <ProvenanceBadge provenance={worst.provenance} />
        </View>
      )}

      <Text style={styles.cardCta}>
        {empty ? 'Open it anyway — the warnings still apply →' : 'See the plan, row by row →'}
      </Text>
    </Pressable>
  );
}

export function RoutesScreen(props: RoutesScreenProps) {
  const { institution, routes, baselineCostUsd, onSelectRoute, onBack } = props;
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  const savingOf = (r: Route): number => baselineCostUsd - r.total_cost_usd;

  // A route with no items "saves" the whole baseline while delivering nothing,
  // so it can never be the headline.
  let best: Route | null = null;
  for (const r of routes) {
    if (r.items.length === 0) continue;
    if (best === null || savingOf(r) > savingOf(best)) best = r;
  }

  // Warnings that bind every route are institution-level facts, not consequences
  // of the choice being made here — they belong above the cards, not inside one.
  // Deduped: a student holding two stranded credits can produce the same sentence
  // twice, and a repeated warning reads as a rendering bug rather than a fact.
  const shared: string[] = [];
  if (routes.length > 0) {
    for (const w of routes[0].warnings) {
      if (shared.includes(w)) continue;
      if (routes.every(r => r.warnings.includes(w))) shared.push(w);
    }
  }

  const bestWorst = best === null ? null : weakestItem(best);
  const bestTrusted = bestWorst !== null && isTrusted(bestWorst.provenance.confidence);
  const heroSaving = best === null ? 0 : Math.max(savingOf(best), 0);
  // The accent is the theme's colour for money we can vouch for. A figure resting
  // on unchecked rows does not get to wear it, however large it is.
  const heroConfident = bestTrusted && heroSaving > 0;

  const caveats: string[] = [];
  if (best === null) {
    caveats.push(`No route in our data buys you anything at ${institution.name} yet.`);
  } else {
    if (savingOf(best) <= 0) {
      caveats.push('Nothing here beats paying for these requirements outright.');
    }
    if (bestWorst !== null && !isTrusted(bestWorst.provenance.confidence)) {
      caveats.push(
        `This figure leans on rows marked "${confidenceLabel(bestWorst.provenance.confidence).toLowerCase()}". Treat it as a ceiling, not a promise.`,
      );
    }
    if (best.areas_unmet.length > 0) {
      caveats.push(
        `It still leaves ${best.areas_unmet.join(', ')} unsolved — ${plural(best.areas_unmet.length, 'area')} you have to clear some other way.`,
      );
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, wide && styles.contentWide]}
    >
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to your details"
      >
        <Text style={styles.back}>‹ Your details</Text>
      </Pressable>

      <View style={styles.instBlock}>
        <Text style={styles.instName}>{institution.name}</Text>
        <Text style={styles.instMeta}>{policyLine(institution)}</Text>
        <ProvenanceBadge provenance={institution.provenance} label="Campus policy" />
      </View>

      <View style={[styles.hero, heroConfident ? styles.heroTrusted : styles.heroUnsure]}>
        <Text style={styles.heroLabel}>
          {best === null
            ? 'Possible saving'
            : heroSaving > 0
              ? `Take the ${KIND_LABEL[best.kind].toLowerCase()} route and save`
              : 'Best saving available'}
        </Text>
        <Text
          style={[
            styles.heroNumber,
            heroConfident ? styles.heroNumberTrusted : styles.heroNumberUnsure,
            { fontSize: wide ? 56 : theme.font.display.fontSize },
          ]}
          accessibilityLabel={`Saving: ${money(heroSaving)}`}
        >
          {money(heroSaving)}
        </Text>
        <Text style={styles.heroSub}>
          against {money(baselineCostUsd)} — what these requirements cost at {institution.name} if
          you buy none of this credit.
        </Text>
        {caveats.map(c => (
          <Text key={c} style={styles.heroCaveat}>
            {c}
          </Text>
        ))}
      </View>

      {shared.length > 0 && (
        <View style={styles.alert} accessibilityRole="alert">
          <Text style={styles.alertKicker}>Read before you spend anything</Text>
          {shared.map(w => (
            <Text key={w} style={styles.alertText}>
              {w}
            </Text>
          ))}
          <Text style={styles.alertFooter}>
            {shared.length === 1 ? 'This applies' : 'These apply'} to every route below. What we
            know about this campus, and how well we know it:
          </Text>
          {/* The note is already printed under the campus header a few lines up. */}
          <ProvenanceBadge provenance={institution.provenance} showNote={false} />
        </View>
      )}

      {routes.length > 0 && (
        <Text style={styles.sectionTitle}>
          {routes.length === 3 ? 'Three ways there' : `${plural(routes.length, 'way')} there`}
        </Text>
      )}

      {routes.map((route, i) => (
        <RouteCard
          key={`${route.kind}-${i}`}
          route={route}
          savingUsd={savingOf(route)}
          institutionName={institution.name}
          extraWarnings={route.warnings.filter(w => !shared.includes(w))}
          sharedWarningCount={shared.length}
          headline={route === best && savingOf(route) > 0}
          onPress={() => onSelectRoute(route)}
        />
      ))}

      <Text style={styles.footnote}>
        Every figure here comes from a row with a source and a date. None of it is advice from your
        campus — take the plan to an advisor before you pay for anything.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.color.bg },
  content: {
    padding: theme.space.md,
    paddingBottom: theme.space.xl,
    gap: theme.space.md,
    // On a tablet a full-width column reads badly; cap it and centre it instead.
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  contentWide: { paddingHorizontal: theme.space.lg },

  back: { ...theme.font.body, color: theme.color.textMuted, paddingVertical: theme.space.xs },

  instBlock: { gap: theme.space.xs },
  instName: { ...theme.font.title, color: theme.color.text },
  instMeta: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  hero: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.space.lg,
    gap: theme.space.xs,
  },
  heroTrusted: { backgroundColor: theme.color.accentDim, borderColor: theme.color.accent },
  heroUnsure: { backgroundColor: theme.color.surface, borderColor: theme.color.border },
  heroLabel: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroNumber: { ...theme.font.display },
  heroNumberTrusted: { color: theme.color.accent },
  // Still the largest thing on screen — just not printed in the colour that means
  // "money we have confirmed".
  heroNumberUnsure: { color: theme.color.text },
  heroSub: { ...theme.font.body, color: theme.color.text, lineHeight: 21 },
  heroCaveat: {
    ...theme.font.small,
    color: theme.color.warn,
    lineHeight: 19,
    marginTop: theme.space.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.color.warn,
    paddingLeft: theme.space.sm,
  },

  alert: {
    backgroundColor: theme.color.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.danger,
    borderLeftWidth: 6,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  alertKicker: {
    ...theme.font.small,
    color: theme.color.danger,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  alertText: { ...theme.font.heading, color: theme.color.text, lineHeight: 23 },
  alertFooter: { ...theme.font.small, color: theme.color.textMuted },

  sectionTitle: {
    ...theme.font.heading,
    color: theme.color.text,
    marginTop: theme.space.sm,
  },

  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  cardHeadline: { borderColor: theme.color.accent, borderStyle: 'solid' },
  // Marked out as the biggest number without being dressed as a confirmed one:
  // weight only, no accent, and the dashed unsure skin still lands on top.
  cardHeadlineUnsure: { borderWidth: 2 },
  // Dashed, dimmer, flatter: unverified must not read as solid.
  cardUnsure: {
    borderStyle: 'dashed',
    borderColor: theme.color.unverified,
    backgroundColor: theme.color.bg,
  },
  cardPressed: { backgroundColor: theme.color.surfaceAlt },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.sm,
  },
  // Text does not shrink by default in a row, so a large system font size would
  // push the pill off the card instead of wrapping.
  cardKind: { ...theme.font.heading, color: theme.color.text, flexShrink: 1 },
  pill: {
    ...theme.font.small,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    overflow: 'hidden',
    flexShrink: 0,
  },
  pillTrusted: { color: theme.color.accent, borderColor: theme.color.accent },
  pillUnsure: { color: theme.color.textMuted, borderColor: theme.color.unverified },
  cardBlurb: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  cardBody: { gap: theme.space.sm },
  cardSaving: { ...theme.font.title },
  cardSavingTrusted: { color: theme.color.accent },
  // Money we cannot vouch for is not printed in the colour that means "money".
  cardSavingUnsure: { color: theme.color.textMuted },
  cardSavingCaveat: { ...theme.font.small, color: theme.color.needsCheck, lineHeight: 18 },

  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.md },
  stat: { minWidth: 96, flexShrink: 1 },
  statValue: { ...theme.font.heading, color: theme.color.text },
  statLabel: { ...theme.font.small, color: theme.color.textMuted },

  emptyBox: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.color.border,
    padding: theme.space.md,
    gap: theme.space.xs,
  },
  emptyTitle: { ...theme.font.heading, color: theme.color.text },
  emptyBody: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  cardWarn: {
    borderLeftWidth: 4,
    borderLeftColor: theme.color.warn,
    paddingLeft: theme.space.sm,
    gap: 2,
  },
  cardWarnCount: {
    ...theme.font.small,
    color: theme.color.warn,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardWarnText: { ...theme.font.small, color: theme.color.text, lineHeight: 19 },
  cardWarnMore: { ...theme.font.small, color: theme.color.textMuted },
  cardWarnNone: { ...theme.font.small, color: theme.color.textMuted },

  evidence: {
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    paddingTop: theme.space.sm,
    gap: theme.space.xs,
  },
  evidenceLabel: { ...theme.font.small, color: theme.color.textMuted },

  provBlock: { gap: theme.space.xs },
  provRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.space.sm },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
    flexShrink: 1,
  },
  badgeSoft: { borderStyle: 'dashed' },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { ...theme.font.small, fontWeight: '600', flexShrink: 1 },
  sourceLink: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textDecorationLine: 'underline',
  },
  // Not underlined: nothing here is tappable, and it must not look like it is.
  sourceDead: { ...theme.font.small, color: theme.color.unverified, fontStyle: 'italic' },
  provNote: {
    ...theme.font.small,
    color: theme.color.warn,
    lineHeight: 18,
    borderLeftWidth: 2,
    borderLeftColor: theme.color.border,
    paddingLeft: theme.space.sm,
  },

  cardCta: { ...theme.font.small, color: theme.color.textMuted, marginTop: theme.space.xs },

  footnote: {
    ...theme.font.small,
    color: theme.color.textMuted,
    lineHeight: 19,
    marginTop: theme.space.sm,
  },
});
