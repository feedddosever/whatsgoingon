/**
 * RoutesScreen — the three plans, side by side.
 *
 * The saving is the hook, so it is the largest thing on the screen. Everything
 * else here exists to keep that number from becoming a lie: the weakest row
 * behind each route, the note saying what could bite the student, the coverage
 * that says how much of the job the route actually does, and the warnings that
 * say this campus will not honour credit the student already holds.
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
  GeArea,
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
    'Only credit backed by statute or a published campus policy. It usually saves less — that is the point.',
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
 * will never honour. Credit the campus does award but that clears no general-education
 * requirement sits directly behind it — the student has not lost the money, but
 * they have satisfied nothing, and nothing on the plan looks wrong.
 */
const WARNING_RANK: Record<WarningKind, number> = {
  stranded_credit: 0,
  credit_not_toward_ge: 1,
  budget_exceeded: 2,
  transfer_cap: 3,
  unverified_data: 4,
  residency: 5,
  major_sequence: 6,
  // Last: it is good news, and it must not push a real warning down the card.
  opportunity: 7,
};

/** What the student is looking at, before they read the sentence itself. */
const WARNING_TITLE: Record<WarningKind, string> = {
  stranded_credit: 'Credit that will not count here',
  credit_not_toward_ge: 'Counts for the degree, clears no requirement',
  budget_exceeded: 'Over the budget you set',
  transfer_cap: 'Units over the transfer cap',
  residency: 'Units you must earn on campus',
  major_sequence: 'Your major, not your general education',
  unverified_data: 'Not confirmed against the campus',
  opportunity: 'Money you could still save',
};

/**
 * How loudly a warning is drawn. Three tiers, because two were not enough — and
 * the same three RouteDetailScreen names, since one student meeting two
 * vocabularies for one warning is the app disagreeing with itself.
 *
 *   severe   — stranded credit: money already spent that this campus will not honour.
 *   elevated — credit the campus DOES award that clears no general-education requirement.
 *              Nothing looks wrong to the student: the credit is accepted, the plan
 *              reads normally, and they have satisfied no requirement. A warning
 *              nobody would go looking for cannot be drawn as an aside, so it is
 *              filled rather than ruled. Not red — nobody is out of pocket — and
 *              deliberately not the default either.
 *   plain    — the constraints a student can see coming once they are told.
 *
 * A Record rather than a ternary chain: a kind added to the engine has to be
 * placed here deliberately instead of inheriting the quietest treatment by
 * falling through to the default.
 */
type WarningTone = 'severe' | 'elevated' | 'plain' | 'opportunity';

const WARNING_TONE: Record<WarningKind, WarningTone> = {
  stranded_credit: 'severe',
  credit_not_toward_ge: 'elevated',
  budget_exceeded: 'elevated',
  transfer_cap: 'plain',
  residency: 'plain',
  major_sequence: 'plain',
  unverified_data: 'plain',
  // Not a warning: a saving still on the table. Accent, and sorted last.
  opportunity: 'opportunity',
};

const toneOf = (w: RouteWarning): WarningTone => WARNING_TONE[w.kind];

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

/**
 * A bare general-education code is advisor shorthand; the student knows the requirement by
 * its name. RouteDetailScreen already prints "CAL-GETC 3B · Humanities", and one
 * student meeting two vocabularies for one requirement is the app disagreeing
 * with itself, so this screen says it the same way. A code we hold no row for
 * prints as itself — never as "undefined", never with a dangling separator.
 */
const areaLabel = (code: string | null, name: string | null): string =>
  name === null ? (code ?? '') : code === null ? name : `${code} · ${name}`;

const areaNamer =
  (areas: GeArea[]) =>
  (id: string): string => {
    const area = areas.find(a => a.id === id);
    const name = area?.name.trim() ?? '';
    // No area and no name leaves only the id, which is at least something the
    // student can quote back at us.
    return areaLabel(area?.code ?? (area === undefined ? id : null), name === '' ? null : name);
  };

/** "A", "A and B", "A, B and C" — a list a student reads rather than parses. */
const joinAreas = (labels: string[]): string =>
  labels.length < 2
    ? labels.join('')
    : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;

/** No error surface exists on this screen, and a dead link must not take it down. */
const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

/**
 * The campus header used to print exam policy, the transfer cap and the residency
 * minimum as one sentence under one "published policy" badge. Only the first of
 * those three is published: the other two are unconfirmed and carry their own
 * provenance, so they are printed separately and never under that badge.
 */
const examPolicyLine = (inst: Institution, systemLabel: string): string =>
  `${systemLabel} · ${inst.refuses.includes('clep') ? 'does not accept CLEP' : 'accepts CLEP'}`;

const capLine = (inst: Institution): string =>
  inst.max_transfer_units === null
    ? 'No transfer cap on file'
    : `${inst.max_transfer_units}-unit cap on credit transferred in`;

/** A zero minimum is missing data, not a campus without a residency rule. */
const residencyLine = (inst: Institution): string =>
  inst.residency_min_units > 0
    ? `${inst.residency_min_units} units must be earned on campus`
    : 'No residency minimum on file';

/**
 * What a route costs once the requirements it does NOT clear are priced back in.
 *
 * The lowest-risk route drops unconfirmed rows, so it can clear fewer areas and
 * still show a smaller total than the cheapest route. A card reading "$297" next
 * to one reading "$573" looks like the better deal when it is in fact doing less
 * work, and the student pays for the difference at this campus's estimated per-unit rate
 * either way. Pricing the gap — the same arithmetic the baseline uses — makes the
 * cards comparable instead of merely adjacent, and it is why the saving on a
 * narrower route shrinks rather than grows.
 *
 * When an unmet area has no row we can price, nothing is guessed: the gap stays
 * null, the card says so, and it is kept out of the running for the headline.
 */
interface Outlook {
  cleared: number;
  total: number;
  /** Cost of the areas this route leaves the student to clear, at the campus rate. */
  gapUsd: number | null;
  /** Baseline minus (plan + gap). Null when the gap cannot be priced. */
  savingUsd: number | null;
}

function outlookOf(
  route: Route,
  areas: GeArea[],
  perUnitUsd: number,
  baselineUsd: number,
): Outlook {
  let units = 0;
  let priced = true;
  for (const id of route.areas_unmet) {
    const area = areas.find(a => a.id === id);
    if (area === undefined) {
      priced = false;
      continue;
    }
    units += area.required_units;
  }
  const gapUsd = priced ? units * perUnitUsd : null;
  return {
    cleared: route.areas_cleared.length,
    total: route.areas_cleared.length + route.areas_unmet.length,
    gapUsd,
    savingUsd: gapUsd === null ? null : baselineUsd - (route.total_cost_usd + gapUsd),
  };
}

interface RouteEntry {
  route: Route;
  outlook: Outlook;
}

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
  // provenance back into the decoration this product refuses to make it.
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
 * One campus figure and the row that backs it.
 *
 * Kept as data rather than inlined twice, because which of these is set apart as
 * unconfirmed is READ OFF the row (`isBacked`) and never assumed: a figure whose
 * source someone confirms must stop wearing the "not confirmed" kicker, and one
 * nobody has confirmed can never quietly lose it.
 */
interface CampusClaim {
  label: string;
  text: string;
  provenance: Provenance;
}

function CampusClaimLine(props: { claim: CampusClaim }) {
  const { claim } = props;
  return (
    <View style={styles.instClaim}>
      <Text style={styles.instMeta}>{claim.text}</Text>
      <ProvenanceBadge provenance={claim.provenance} label={claim.label} />
    </View>
  );
}

/**
 * What a warning rests on. The engine attaches the row for each claim — the exam
 * policy behind stranded credit, the transfer-cap row behind the cap, the
 * residency row behind residency — so the badge here is whatever backs THIS
 * warning, never the campus header's. `unverified_data` carries no row at all;
 * it is fired by the absence of one, and saying that plainly is the honest
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
  /** Coverage and the coverage-adjusted saving, computed once by the screen. */
  outlook: Outlook;
  institutionName: string;
  /** So this card names a requirement the way every other screen names it. */
  areaName: (id: string) => string;
  /** Warnings this route adds on top of the ones already banner-ed above, most severe first. */
  extraWarnings: RouteWarning[];
  sharedWarningCount: number;
  headline: boolean;
  onPress: () => void;
}

function RouteCard(props: RouteCardProps) {
  const {
    route,
    outlook,
    institutionName,
    areaName,
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
  const topTone: WarningTone | null = top === null ? null : toneOf(top);
  const empty = route.items.length === 0;
  const settled = empty && route.areas_unmet.length === 0;
  const unmetLabels = route.areas_unmet.map(areaName);
  const saving = outlook.savingUsd;
  const gap = outlook.gapUsd;

  // A route that costs more than the baseline has not saved "nothing" — it has
  // lost money, and rounding that up to zero is the sort of flattery this app exists
  // to refuse. The figure is net of what the route leaves unmet, so a route that
  // clears less cannot buy a bigger number by doing less work.
  const savingText =
    saving === null
      ? 'Saving not stated: an area this route leaves open is missing from our data'
      : saving > 0
        ? `Saves ${money(saving)}`
        : saving < 0
          ? `Costs ${money(-saving)} more than doing nothing`
          : 'Saves nothing against the baseline';

  // Coverage travels with every cost on this card. On its own, a total says only
  // how much was spent, never how much of the job it bought.
  const coverageText =
    route.areas_unmet.length === 0
      ? `Clears all ${plural(outlook.total, 'area')} you still owe.`
      : `Clears ${outlook.cleared} of ${outlook.total}. ${joinAreas(unmetLabels)} ` +
        `${route.areas_unmet.length === 1 ? 'is' : 'are'} still yours to clear.`;

  const allInText =
    gap === null
      ? 'Plan cost only: an area this route leaves open is missing from our data, so we cannot ' +
        'say what it leaves you to pay. Do not read this total against the other cards.'
      : route.areas_unmet.length === 0
        ? `${money(route.total_cost_usd)} all-in — this route leaves you nothing further to pay for.`
        : `${money(route.total_cost_usd + gap)} all-in at ${institutionName}: the plan, plus ` +
          `${money(gap)} for the ${plural(route.areas_unmet.length, 'area')} it does not clear, at ` +
          `this campus's estimated per-unit rate. Compare the cards on this number, not on the plan cost.`;

  const summary = empty
    ? `${KIND_LABEL[route.kind]} route. Nothing we would recommend. ${plural(route.warnings.length, 'warning')}.`
    : `${KIND_LABEL[route.kind]} route. Clears ${outlook.cleared} of ${outlook.total} areas. ` +
      `${savingText}. Plan costs ${money(route.total_cost_usd)}` +
      (gap !== null && route.areas_unmet.length > 0
        ? `, and leaves ${money(gap)} of requirements for you to pay for`
        : '') +
      `. ${plural(route.total_units, 'unit')}, ${plural(route.warnings.length, 'warning')}.`;

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
                ? `Every row that could clear ${joinAreas(unmetLabels)} is still unconfirmed, so this route will not put your money on any of it.`
                : `No credit in our data clears ${joinAreas(unmetLabels)} at ${institutionName}.`}
          </Text>
        </View>
      ) : (
        <View style={styles.cardBody}>
          <Text
            style={[
              styles.cardSaving,
              trusted && saving !== null && saving > 0
                ? styles.cardSavingTrusted
                : styles.cardSavingUnsure,
            ]}
          >
            {savingText}
          </Text>
          {/* Directly under the money, before anything else can be skimmed past. */}
          <Text style={styles.cardCoverage}>{coverageText}</Text>
          {!trusted && saving !== null && saving > 0 && (
            <Text style={styles.cardSavingCaveat}>
              Not a confirmed figure — it rests on rows nobody has checked against the source.
            </Text>
          )}
          <View style={styles.statRow}>
            <Stat label="Plan cost" value={money(route.total_cost_usd)} />
            <Stat label="Areas cleared" value={`${outlook.cleared} of ${outlook.total}`} />
            <Stat
              label="Still to pay here"
              value={gap === null ? 'Not priced' : money(gap)}
            />
            <Stat label="Units" value={String(route.total_units)} />
          </View>
          <Text style={styles.cardAllIn}>{allInText}</Text>
        </View>
      )}

      {top !== null ? (
        <View
          style={[
            styles.cardWarn,
            topTone === 'severe' && styles.cardWarnSevere,
            topTone === 'elevated' && styles.cardWarnElevated,
          ]}
        >
          {/* `extraWarnings` excludes the ones banner-ed above, which still bind
              this route — so calling them "N warnings on this route" undercounts
              the route's constraints. Say what the number actually is. */}
          <Text style={[styles.cardWarnCount, topTone === 'severe' && styles.cardWarnCountSevere]}>
            {sharedWarningCount > 0
              ? `${plural(extraWarnings.length, 'warning')} beyond the ${sharedWarningCount} above`
              : `${plural(extraWarnings.length, 'warning')} on this route`}
          </Text>
          <Text style={[styles.cardWarnTitle, topTone === 'severe' && styles.cardWarnTitleSevere]}>
            {WARNING_TITLE[top.kind]}
          </Text>
          {/* Never clamped: a warning the student cannot finish reading is a warning
              that did not do its job. Printed verbatim — it is written for a student. */}
          <Text style={[styles.cardWarnText, topTone === 'elevated' && styles.cardWarnTextElevated]}>
            {top.message}
          </Text>
          {/* Badge AND note, and the badge is the one the engine attached to THIS
              warning — the residency row behind a residency warning, the cap row
              behind the cap. The campus header's published exam-policy badge never
              reaches down here to lend credibility to a claim it does not cover. */}
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
  const {
    institution, framework, system, routes, areas, baselineCostUsd, onSelectRoute, onBack,
  } = props;
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  const areaName = areaNamer(areas);

  // The transfer cap and the residency minimum each carry their own row, and
  // neither is covered by the exam-policy source. Which of them is set apart as
  // unconfirmed comes from its own provenance, so the dashed block can never
  // outlive — or fail to cover — what the data actually says.
  const campusClaims: CampusClaim[] = [
    {
      label: 'Transfer cap',
      text: capLine(institution),
      provenance: institution.transfer_cap_provenance,
    },
    {
      label: 'Units earned on campus',
      text: residencyLine(institution),
      provenance: institution.residency_provenance,
    },
  ];
  const confirmedClaims = campusClaims.filter(c => isBacked(c.provenance));
  const uncheckedClaims = campusClaims.filter(c => !isBacked(c.provenance));

  const entries: RouteEntry[] = routes.map(route => ({
    route,
    outlook: outlookOf(route, areas, institution.cost_per_unit_usd, baselineCostUsd),
  }));

  // The headline goes to the biggest saving NET of what the route leaves unmet.
  // On the raw totals a route that clears fewer areas looks like it saves more,
  // purely because it is doing less; that is the one comparison on this screen a
  // student is most likely to make by eye. A route with no items, or one whose gap
  // we cannot price, is never the headline.
  let best: RouteEntry | null = null;
  let bestSaving = Number.NEGATIVE_INFINITY;
  for (const e of entries) {
    const s = e.outlook.savingUsd;
    if (e.route.items.length === 0 || s === null) continue;
    if (s > bestSaving) {
      best = e;
      bestSaving = s;
    }
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

  const bestWorst = best === null ? null : weakestItem(best.route);
  const bestTrusted = bestWorst !== null && isBacked(bestWorst.provenance);
  const heroSaving = best === null ? 0 : Math.max(bestSaving, 0);
  // The accent is the theme's colour for money we can vouch for. A figure resting
  // on unchecked rows does not get to wear it, however large it is.
  const heroConfident = bestTrusted && heroSaving > 0;

  const caveats: string[] = [];
  if (best === null) {
    caveats.push(`No route in our data buys you anything at ${institution.name} yet.`);
  } else {
    if (bestSaving <= 0) {
      caveats.push('Nothing here beats paying for these requirements outright.');
    }
    if (bestWorst !== null && !isBacked(bestWorst.provenance)) {
      caveats.push(
        `This figure leans on rows marked "${confidenceLabel(bestWorst.provenance.confidence).toLowerCase()}". Treat it as a ceiling, not a promise.`,
      );
    }
    if (best.route.areas_unmet.length > 0) {
      const gap = best.outlook.gapUsd;
      caveats.push(
        `It still leaves ${joinAreas(best.route.areas_unmet.map(areaName))} unsolved — ` +
          `${plural(best.route.areas_unmet.length, 'area')} you have to clear some other way` +
          (gap === null
            ? '.'
            : `. The ${money(gap)} that would cost at ${institution.name}'s own rate is already taken off the figure above.`),
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
        {/* One badge, one claim. This source was read and covers the exam policy —
            nothing else in the campus record. */}
        <Text style={styles.instMeta}>{examPolicyLine(institution, system.short_name)}</Text>
        <ProvenanceBadge provenance={institution.exam_policy_provenance} label="Exam policy" />
        {/* The transfer cap and the residency minimum are NOT covered by that
            source. They used to sit in the same sentence, under the same
            "published policy" badge, which lent them a certainty our data does not
            have. Each carries its own row now, and any of them nobody has
            confirmed is set apart below where that badge cannot reach it. */}
        {confirmedClaims.map(c => (
          <CampusClaimLine key={c.label} claim={c} />
        ))}
        {uncheckedClaims.length > 0 && (
          <View style={styles.instUnchecked}>
            <Text style={styles.instUncheckedKicker}>Not confirmed for this campus</Text>
            {uncheckedClaims.map(c => (
              <CampusClaimLine key={c.label} claim={c} />
            ))}
          </View>
        )}
      </View>

      <View style={[styles.hero, heroConfident ? styles.heroTrusted : styles.heroUnsure]}>
        <Text style={styles.heroLabel}>
          {best === null
            ? 'Possible saving'
            : heroSaving > 0
              ? `Take the ${KIND_LABEL[best.route.kind].toLowerCase()} route and save`
              : 'Best saving available'}
        </Text>
        <Text
          style={[
            styles.heroNumber,
            heroConfident ? styles.heroNumberTrusted : styles.heroNumberUnsure,
            { fontSize: wide ? 56 : theme.font.display.fontSize },
          ]}
          accessibilityLabel={
            best === null
              ? `Saving: ${money(heroSaving)}`
              : `Saving: ${money(heroSaving)}, after what that route leaves unmet is priced back in`
          }
        >
          {money(heroSaving)}
        </Text>
        {/* Says exactly what the baseline is: the general-education areas still unmet, at
            this campus's estimated per-unit rate. Calling it the cost of a degree would be
            the kind of overclaim this screen exists to refuse — and it names the one
            thing that makes the three cards comparable, which is that a route's
            unmet areas are charged back to it at that same rate. */}
        <Text style={styles.heroSub}>
          against {money(baselineCostUsd)} — the {framework.name} areas you have not cleared yet,
          priced at an estimated per-unit rate for {institution.name}. How that rate was derived,
          and how far it can be trusted, is on the campus card above. Whatever a route leaves
          unmet is priced back in at that same rate, so a plan that clears fewer areas cannot
          look cheaper than it is. That is the comparison, not the cost of a whole degree.
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
          {shared.map(w => {
            const tone = toneOf(w);
            return (
              <View
                key={warningKey(w)}
                style={[
                  styles.alertItem,
                  tone === 'elevated' && styles.alertItemElevated,
                  tone === 'opportunity' && styles.alertItemOpportunity,
                ]}
              >
                <Text style={[
                  styles.alertTitle,
                  tone === 'severe' && styles.alertTitleSevere,
                  tone === 'opportunity' && styles.alertTitleOpportunity,
                ]}>
                  {WARNING_TITLE[w.kind]}
                </Text>
                {/* Verbatim: the engine writes these for a student, and a warning the
                    UI paraphrases is a warning the UI can get wrong. */}
                <Text
                  style={[
                    styles.alertText,
                    tone === 'severe' && styles.alertTextSevere,
                    tone === 'opportunity' && styles.alertTextOpportunity,
                  ]}
                >
                  {w.message}
                </Text>
                {/* Every warning shows the row it rests on, note included, and that
                    row is the one the engine attached to this claim. Reaching for
                    the campus record instead once badged a residency warning
                    "published policy" on the strength of a source that only covered
                    exam policy. */}
                <WarningBacking warning={w} />
              </View>
            );
          })}
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

      {entries.map((entry, i) => (
        <RouteCard
          key={`${entry.route.kind}-${i}`}
          route={entry.route}
          outlook={entry.outlook}
          institutionName={institution.name}
          areaName={areaName}
          extraWarnings={bySeverity(
            dedupeWarnings(entry.route.warnings).filter(w => !sharedKeys.has(warningKey(w))),
          )}
          sharedWarningCount={shared.length}
          headline={entry === best && bestSaving > 0}
          onPress={() => onSelectRoute(entry.route)}
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
  // Dashed and set in, so an unconfirmed figure cannot be read as part of the
  // published line above it. Which figures land here comes from their own rows.
  instUnchecked: {
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.color.unverified,
    paddingLeft: theme.space.sm,
    marginTop: theme.space.xs,
    gap: theme.space.xs,
  },
  instUncheckedKicker: {
    ...theme.font.small,
    color: theme.color.unverified,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  instClaim: { gap: theme.space.xs },

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
  // Credit the campus accepts that clears nothing: filled AND ruled, so it reads
  // as its own claim rather than as a footnote to the one above it. Filled in
  // `surface`, which is darker than the banner it sits in — the card's elevated tier
  // fills the other way round for the same reason, because the fill has to be
  // visible against whatever it lands on. Typography alone could not carry this
  // tier here: `alertText` is already weight 600, so a "bolder" message would
  // have rendered identically to a plain one.
  alertItemElevated: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.color.warn,
    padding: theme.space.sm,
  },
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
  // Full-strength ink, not muted: how much of the job a route does is not a
  // footnote to the price, it is half of what the price means.
  cardCoverage: { ...theme.font.small, color: theme.color.text, lineHeight: 19 },
  cardSavingCaveat: { ...theme.font.small, color: theme.color.needsCheck, lineHeight: 18 },
  // The one number that is safe to read across cards, so it is set apart from the
  // plan cost rather than beside it.
  cardAllIn: {
    ...theme.font.small,
    color: theme.color.text,
    fontWeight: '600',
    lineHeight: 19,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    paddingTop: theme.space.xs,
  },

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
  // An opportunity is a saving still on the table, not a problem. Drawing it in
  // the same amber as the constraints would train the student to skim all of it.
  alertItemOpportunity: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  alertTitleOpportunity: { color: theme.color.accent },
  alertTextOpportunity: { color: theme.color.text },
  // Credit the campus does award, clearing no general-education requirement: filled and
  // thick-ruled, because this is the warning a student would never think to look
  // for. Not the red of money already lost, and not the default either.
  cardWarnElevated: {
    borderLeftWidth: 6,
    backgroundColor: theme.color.surfaceAlt,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.space.sm,
    paddingRight: theme.space.sm,
  },
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
  cardWarnTextElevated: { fontWeight: '600' },
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
