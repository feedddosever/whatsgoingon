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
  RouteWarning,
  WarningKind,
} from '../types.ts';
import type { RoutesScreenProps } from '../ui/contracts.ts';
import { checkedOn, isBacked, linkable, noteText } from '../ui/provenance.ts';
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

/**
 * Severity, read off the warning's kind rather than recovered from its wording.
 *
 * A card has room for one warning, so this decides which one the student actually
 * sees: stranded credit first, because it is money already spent that this campus
 * will never honour.
 */
const WARNING_RANK: Record<WarningKind, number> = {
  stranded_credit: 0,
  transfer_cap: 1,
  unverified_data: 2,
  residency: 3,
  unmet_areas: 4,
};

/** What the student is looking at, before they read the sentence itself. */
const WARNING_TITLE: Record<WarningKind, string> = {
  stranded_credit: 'Credit that will not count here',
  transfer_cap: 'Units over the transfer cap',
  residency: 'Units you must earn on campus',
  unmet_areas: 'Nothing in our data clears this',
  unverified_data: 'Not confirmed against the campus',
};

/** The one kind that gets the red treatment: it is the student's money, already spent. */
const isSevere = (w: RouteWarning): boolean => w.kind === 'stranded_credit';

/**
 * Warnings are values, not references: two routes each build their own object for
 * the same institution-level fact. Comparing by identity would call those two
 * different and stamp every shared warning onto every card as well, so they are
 * matched on content. Kinds are a closed set of literals, so the separator
 * cannot be forged by a message.
 */
const warningKey = (w: RouteWarning): string => `${w.kind}::${w.message}`;

/** Most severe first. Never sorted in place — `warnings` belongs to the caller. */
const bySeverity = (ws: RouteWarning[]): RouteWarning[] =>
  [...ws].sort((a, b) => WARNING_RANK[a.kind] - WARNING_RANK[b.kind]);

/**
 * A student holding two stranded credits can produce the same sentence twice, and
 * a repeated warning reads as a rendering bug rather than as a fact.
 */
function dedupeWarnings(ws: RouteWarning[]): RouteWarning[] {
  const seen = new Set<string>();
  const out: RouteWarning[] = [];
  for (const w of ws) {
    const key = warningKey(w);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }
  return out;
}

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

/** No error surface exists on this screen, and a dead link must not take it down. */
const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

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
}

function ProvenanceBadge(props: ProvenanceBadgeProps) {
  const { provenance } = props;
  const { source_url, confidence } = provenance;
  const tint = confidenceColor(confidence);
  const text =
    props.label === undefined
      ? confidenceLabel(confidence)
      : `${props.label} — ${confidenceLabel(confidence)}`;
  // `note` is where the dataset records what could bite the student — a score
  // minimum, a cap, a claim that has to be confirmed. Dropping it would turn
  // provenance back into the decoration this product refuses to make it, and it
  // is never suppressed: the campus row here reads "published policy" while its
  // own note says the residency minimum and the transfer cap in that row are NOT
  // confirmed. A badge shown without that sentence promises what we do not know.
  const note = noteText(provenance);
  // checkedOn() owns the visible phrasing; the screen reader needs a whole
  // sentence, so it asks the row itself whether anyone has opened the page.
  const opened = provenance.as_of.trim() !== '';

  return (
    <View style={styles.provBlock}>
      <View style={styles.provRow}>
        <View
          style={[styles.badge, { borderColor: tint }, !isBacked(provenance) && styles.badgeSoft]}
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
              opened
                ? `Open the source page, last read ${checkedOn(provenance)}`
                : 'Open the source page. Nobody has read it yet.'
            }
          >
            {/* An empty as_of means nobody has opened the page. Say it rather than hide it. */}
            <Text style={styles.sourceLink}>source · {checkedOn(provenance)}</Text>
          </Pressable>
        ) : (
          // A row with no usable URL stays flat rather than pretending to be a link
          // that silently does nothing when tapped.
          <Text style={styles.sourceDead}>no source on file</Text>
        )}
      </View>
      {note !== null && <Text style={styles.provNote}>{note}</Text>}
    </View>
  );
}

/**
 * What a warning rests on. `unmet_areas` and `unverified_data` carry no row —
 * they are fired by the absence of one — and saying that plainly is the honest
 * version of a badge, not a reason to show nothing.
 */
function WarningBacking(props: { warning: RouteWarning }) {
  const { provenance } = props.warning;
  if (provenance === undefined) {
    return <Text style={styles.sourceDead}>no source — this is what our data is missing</Text>;
  }
  return <ProvenanceBadge provenance={provenance} />;
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
  /** Warnings this route adds on top of the ones already banner-ed above, most severe first. */
  extraWarnings: RouteWarning[];
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
  const trusted = worst !== null && isBacked(worst.provenance);
  const shaky = route.items.filter(i => !isBacked(i.provenance)).length;
  // The caller sorts by severity, so the one warning this card has room for is
  // already the one that matters most.
  const top: RouteWarning | null = extraWarnings.length > 0 ? extraWarnings[0] : null;
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

      {top !== null ? (
        <View style={[styles.cardWarn, isSevere(top) && styles.cardWarnSevere]}>
          {/* `extraWarnings` excludes the ones banner-ed above, which still bind
              this route — so calling them "N warnings on this route" undercounts
              the route's constraints. Say what the number actually is. */}
          <Text style={[styles.cardWarnCount, isSevere(top) && styles.cardWarnCountSevere]}>
            {sharedWarningCount > 0
              ? `${plural(extraWarnings.length, 'warning')} beyond the ${sharedWarningCount} above`
              : `${plural(extraWarnings.length, 'warning')} on this route`}
          </Text>
          <Text style={[styles.cardWarnTitle, isSevere(top) && styles.cardWarnTitleSevere]}>
            {WARNING_TITLE[top.kind]}
          </Text>
          {/* Never clamped: a warning the student cannot finish reading is a warning
              that did not do its job. Printed verbatim — it is written for a student. */}
          <Text style={styles.cardWarnText}>{top.message}</Text>
          {/* Badge AND note. The campus row is marked "published policy", but its
              note is the caveat naming the residency minimum and the transfer cap
              as the parts of that row nobody has confirmed — exactly the two
              warnings likeliest to land here. */}
          <WarningBacking warning={top} />
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
  // Matched on kind + message, because each route builds its own object for the
  // same fact and identity would mark none of them as shared.
  const boundEverywhere = (w: RouteWarning): boolean => {
    const key = warningKey(w);
    return routes.every(r => r.warnings.some(x => warningKey(x) === key));
  };
  const shared: RouteWarning[] =
    routes.length === 0
      ? []
      : bySeverity(dedupeWarnings(routes[0].warnings).filter(boundEverywhere));
  const sharedKeys = new Set(shared.map(warningKey));

  const bestWorst = best === null ? null : weakestItem(best);
  const bestTrusted = bestWorst !== null && isBacked(bestWorst.provenance);
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
    if (bestWorst !== null && !isBacked(bestWorst.provenance)) {
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
        {/* Says exactly what the baseline is and nothing more: the Cal-GETC areas
            still unmet, at this campus's own per-unit rate. Calling it the cost of
            a degree would be the kind of overclaim this screen exists to refuse. */}
        <Text style={styles.heroSub}>
          against {money(baselineCostUsd)} — the Cal-GETC areas you have not cleared yet, priced at
          the per-unit rate {institution.name} charges. That is the comparison, not the cost of a
          whole degree.
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
            <View key={warningKey(w)} style={styles.alertItem}>
              <Text style={[styles.alertTitle, isSevere(w) && styles.alertTitleSevere]}>
                {WARNING_TITLE[w.kind]}
              </Text>
              {/* Verbatim: the engine writes these for a student, and a warning the
                  UI paraphrases is a warning the UI can get wrong. */}
              <Text style={[styles.alertText, isSevere(w) && styles.alertTextSevere]}>
                {w.message}
              </Text>
              {/* Every warning shows the row it rests on, note included. Comparing
                  source_url to the campus header's and hiding the note on a match
                  silently stripped the "NOT yet confirmed" caveat off the residency
                  and transfer-cap warnings, leaving them looking like settled
                  published policy. Repetition is the cheaper mistake. */}
              <WarningBacking warning={w} />
            </View>
          ))}
          <Text style={styles.alertFooter}>
            {shared.length === 1 ? 'This applies' : 'These apply'} to every route below.
          </Text>
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
          extraWarnings={bySeverity(
            dedupeWarnings(route.warnings).filter(w => !sharedKeys.has(warningKey(w))),
          )}
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
  alertItem: { gap: theme.space.xs },
  alertTitle: {
    ...theme.font.small,
    color: theme.color.warn,
    fontWeight: '700',
  },
  // Stranded credit is money the student has already spent. It leads the block and
  // it is the only one printed in the colour that means "this one costs you".
  alertTitleSevere: { color: theme.color.danger },
  alertText: { ...theme.font.heading, color: theme.color.text, lineHeight: 23 },
  alertTextSevere: { fontWeight: '700' },
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
  // A card carrying stranded credit reads as loudly as the banner above it: same
  // colour, thicker rule. This is the claim the whole product exists to make.
  cardWarnSevere: { borderLeftWidth: 6, borderLeftColor: theme.color.danger },
  cardWarnCount: {
    ...theme.font.small,
    color: theme.color.warn,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardWarnCountSevere: { color: theme.color.danger },
  cardWarnTitle: { ...theme.font.small, color: theme.color.warn, fontWeight: '600' },
  cardWarnTitleSevere: { color: theme.color.danger },
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
