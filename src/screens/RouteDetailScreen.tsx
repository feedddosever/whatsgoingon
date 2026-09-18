/**
 * RouteDetailScreen — the trust screen.
 *
 * Every line here is a claim about someone's money and someone's semester, so
 * every line carries the confidence of the row it came from and a way to go read
 * that row's source. The warnings sit above the plan, not under it: a student who
 * scrolls no further than the fold must still learn that the credit they already
 * paid for is worthless at this campus.
 */
import type { ReactElement } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PlanItem, Provenance, RouteKind, RouteWarning, WarningKind } from '../types.ts';
import type { RouteDetailScreenProps } from '../ui/contracts.ts';
import { checkedOn, isBacked, linkable, noteText } from '../ui/provenance.ts';
import { confidenceColor, confidenceLabel, money, theme } from '../ui/theme.ts';

const ROUTE_LABEL: Record<RouteKind, string> = {
  cheapest: 'Cheapest route',
  fastest: 'Fastest route',
  lowest_risk: 'Lowest-risk route',
};

/**
 * Severity is data, not prose.
 *
 * This screen used to recover a warning's severity by matching the engine's
 * wording, so rephrasing one sentence there silently demoted the app's most
 * consequential claim. It now comes off `kind`, and the row the warning rests on
 * travels with the warning instead of being guessed at from the same prose.
 *
 * Three tiers, because two could not hold the middle case:
 *
 *   severe    'stranded_credit' — money the student has already spent, gone.
 *             It alone is drawn in danger red.
 *   elevated  'credit_not_toward_ge' — the campus DOES award this credit, so
 *             nothing on the screen looks wrong, and yet it clears no Cal-GETC
 *             requirement: the student has satisfied nothing and has no way to
 *             tell. Nobody is out of pocket, so it is not red; it is the amber
 *             of the constraint kinds carrying visible extra weight, so it
 *             cannot be skimmed past as one more piece of small print.
 *   plain     the constraint and data-gap kinds. Amber, and loud enough.
 *
 * Every kind is spelled out rather than defaulted, so a kind added to the engine
 * has to be placed here deliberately instead of inheriting the quietest
 * treatment by falling through.
 */
type WarningTier = 'severe' | 'elevated' | 'plain' | 'opportunity';

const WARNING_TIER: Record<WarningKind, WarningTier> = {
  stranded_credit: 'severe',
  credit_not_toward_ge: 'elevated',
  budget_exceeded: 'elevated',
  transfer_cap: 'plain',
  residency: 'plain',
  major_sequence: 'plain',
  unverified_data: 'plain',
  // Not a warning at all: money they could still save. Drawn in the accent
  // colour and sorted last, so it cannot dilute the amber stack above it.
  opportunity: 'opportunity',
};

const tierOf = (w: RouteWarning): WarningTier => WARNING_TIER[w.kind];

const TIER_RANK: Record<WarningTier, number> = { severe: 0, elevated: 1, plain: 2, opportunity: 3 };

/**
 * Most severe first — the cards have to agree with the tiers they are drawn in.
 *
 * The engine emits held-credit warnings in the order the student listed the
 * credit, which used to be harmless: stranded credit was the only loud kind, so
 * it always came out on top by itself. With a second held-credit kind below it,
 * a student holding a course this campus clears nothing with AND a CLEP it will
 * not honour reads the amber card before the red one, under a red strip telling
 * them the red one is the problem. Ordering here is the same judgement the
 * routes screen and the advisor packet already make.
 *
 * Copied before sorting — `warnings` belongs to the route, not to this render —
 * and the sort is stable, so warnings of one tier keep the engine's order.
 */
const bySeverity = (ws: RouteWarning[]): RouteWarning[] =>
  [...ws].sort((a, b) => TIER_RANK[tierOf(a)] - TIER_RANK[tierOf(b)]);

/** Names the shape of the problem before the sentence spells it out. */
const WARNING_KICKER: Record<WarningKind, string> = {
  stranded_credit: '✗  CREDIT YOU ALREADY HOLD',
  credit_not_toward_ge: '⚠  CREDIT YOU HOLD · CLEARS NO REQUIREMENT',
  budget_exceeded: '⚠  OVER YOUR BUDGET',
  transfer_cap: '⚠  BEFORE YOU PAY · TRANSFER CAP',
  residency: '⚠  BEFORE YOU PAY · RESIDENCY',
  major_sequence: '⚠  YOUR MAJOR, NOT YOUR GENERAL EDUCATION',
  unverified_data: '⚠  NOT CONFIRMED YET',
  opportunity: '✓  MONEY YOU COULD STILL SAVE',
};

/** A source that will not open must never take the screen down with it. */
const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

/**
 * A bare Cal-GETC code is advisor shorthand; the student knows the requirement
 * by its name. A code we hold no row for still prints as itself — never as
 * "undefined", and never with a dangling separator behind it.
 */
const areaLabel = (code: string, name: string | null): string =>
  name === null ? `CAL-GETC ${code}` : `CAL-GETC ${code} · ${name}`;

/**
 * Provenance, never decoration: states how far we trust the claim beside it and
 * opens the page that backs it. With no usable source URL the badge stays flat
 * and says so, rather than pretending to be a link.
 */
function SourceBadge({ p }: { p: Provenance }): ReactElement {
  const color = confidenceColor(p.confidence);
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
      accessibilityLabel={`${label}, last checked ${checkedOn(p)}. Open source.`}
      style={({ pressed }) => [
        styles.badge,
        { borderColor: color },
        shaky && styles.badgeShaky,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.badgeText, { color }]} numberOfLines={1}>
        {label} · {checkedOn(p)} ↗
      </Text>
    </Pressable>
  );
}

/**
 * One line of the campus footer, carrying the badge for the one claim it makes.
 *
 * A campus row is three separately-confirmed claims, not one: the exam policy is
 * published and checked, while the residency minimum and the transfer cap are
 * not. Printing all three as a single sentence under a single badge put a
 * "Published policy" stamp beneath two figures nobody has confirmed — the one
 * thing this product must never do. One claim, one line, one badge; and where
 * the claim is unconfirmed the figure itself is drawn in its own confidence
 * colour, so the line reads as unconfirmed before the badge is even read.
 */
function InstFact({ text, p }: { text: string; p: Provenance }): ReactElement {
  const backed = isBacked(p);
  return (
    <View style={styles.instFact}>
      <Text
        style={[styles.instText, !backed && { color: confidenceColor(p.confidence) }]}
        numberOfLines={3}
      >
        {text}
      </Text>
      <SourceBadge p={p} />
    </View>
  );
}

/**
 * Load-bearing, not fine print — so it gets a card, not a footnote.
 *
 * The loudest sentence in the app is still a claim, and a claim with no source
 * shown is exactly the thing this product exists to replace. A warning that
 * quotes a campus policy arrives carrying that campus row and shows it; a
 * warning about a hole in our own data arrives carrying nothing, and must not
 * borrow a source to look better than it is. Either way, anything we cannot
 * vouch for is drawn dashed: loud, but honest about how far it is backed.
 */
function WarningCard(
  { warning, instName }: { warning: RouteWarning; instName: string },
): ReactElement {
  const tier = tierOf(warning);
  const severe = tier === 'severe';
  const backing = warning.provenance ?? null;
  const shaky = backing !== null && !isBacked(backing);
  // Nothing to cite is its own kind of unconfirmed, and looks like one.
  const unsure = backing === null || shaky;
  // The note is where a row says what could bite the student, and it is not
  // interchangeable between warnings: each kind now arrives carrying the
  // provenance of the single claim it rests on — the campus exam policy, the
  // residency minimum, the transfer cap — and each of those rows says something
  // different about what nobody has checked. So every card that rests on a row
  // shows that row's own note, never a neighbour's, and the residency and
  // transfer-cap cards come out dashed and amber beside the solid, published
  // stranded-credit card, which is exactly how certain each one is.
  const note = backing !== null ? noteText(backing) : null;
  return (
    <View
      style={[
        styles.warning,
        tier === 'severe'
          ? styles.warningSevere
          : tier === 'elevated'
            ? styles.warningElevated
            : tier === 'opportunity'
              ? styles.warningOpportunity
              : styles.warningPlain,
        unsure && styles.warningShaky,
      ]}
      accessibilityRole="alert"
    >
      <Text style={[styles.warningKicker, severe ? styles.severeInk : styles.warnInk]}>
        {WARNING_KICKER[warning.kind]}
      </Text>
      {/* Verbatim from the engine: it is written for a student, and
          paraphrasing a hard constraint loses it. */}
      <Text style={styles.warningText}>{warning.message}</Text>

      {note !== null && <Text style={styles.warningNote}>{note}</Text>}

      {shaky && (
        <Text style={styles.warningCaveat}>
          We have not confirmed this against {instName}&apos;s own page. Check it with the campus
          before you pay for anything — or before you write this credit off.
        </Text>
      )}

      {backing !== null && <SourceBadge p={backing} />}
    </View>
  );
}

function ItemCard(
  { item, position, instName, areaName }: {
    item: PlanItem;
    position: number;
    instName: string;
    areaName: (id: string) => string | null;
  },
): ReactElement {
  const shaky = !isBacked(item.provenance);
  const unverified = item.provenance.confidence === 'unverified';
  const note = noteText(item.provenance);
  return (
    <View style={[styles.item, unverified && styles.itemUnverified]}>
      <View style={styles.itemHead}>
        <Text style={styles.itemNum}>{position}</Text>
        <Text style={[styles.itemLabel, unverified && styles.itemLabelShaky]} numberOfLines={3}>
          {item.label}
        </Text>
        <Text style={styles.itemCost}>{money(item.cost_usd)}</Text>
      </View>

      <View style={styles.itemMeta}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{item.units} UNITS</Text>
        </View>
        {/* An item with no area still costs money — say where it lands. */}
        <View style={[styles.chip, styles.chipArea]}>
          <Text style={styles.chipText}>
            {item.satisfies_area === null
              ? 'ELECTIVE · CLEARS NO AREA'
              : areaLabel(item.satisfies_area, areaName(item.satisfies_area))}
          </Text>
        </View>
        <SourceBadge p={item.provenance} />
      </View>

      {note !== null && <Text style={styles.itemNote}>{note}</Text>}

      {shaky && (
        <Text style={styles.itemShakyTag}>
          {unverified
            ? `Not checked against ${instName}. Confirm before you pay for this.`
            : `Plausible but unconfirmed at ${instName}. Ask before you rely on it.`}
        </Text>
      )}
    </View>
  );
}

export function RouteDetailScreen(
  {
    institution, route, areas, unlocked,
    onUnlock, onExportPacket, onManageSubscription, onBack,
  }: RouteDetailScreenProps,
): ReactElement {
  // The only place a Cal-GETC code has a human name. A handful of rows, looked
  // up by hand: a code with no row falls back to the bare code.
  const areaName = (id: string): string | null => {
    const name = areas.find(a => a.id === id)?.name.trim() ?? '';
    return name === '' ? null : name;
  };

  const severeCount = route.warnings.filter(w => tierOf(w) === 'severe').length;
  // Credit the campus does award, that clears nothing. Nothing about it looks
  // wrong, so when no louder warning is there to carry the strip, it says so
  // itself rather than hiding inside a count of "constraints".
  const elevatedCount = route.warnings.filter(w => tierOf(w) === 'elevated').length;
  const hasWarnings = route.warnings.length > 0;
  const orderedWarnings = bySeverity(route.warnings);
  const shakyItems = route.items.filter(i => !isBacked(i.provenance)).length;
  const priced = route.items.length > 0;
  // The biggest number on the screen is only as good as the weakest row under
  // it. It wears the saving colour when every row is backed, and plain ink with
  // the count of unconfirmed rows when it is not — a green promise we cannot
  // keep is worse than no number at all.
  const heroBacked = priced && shakyItems === 0;

  const unmetCount = route.areas_unmet.length;
  const unmetOne = unmetCount === 1;

  const capLine =
    institution.max_transfer_units === null
      ? 'no transfer cap on file'
      : `${institution.max_transfer_units}-unit transfer cap`;
  // A zero minimum is missing data, not a campus without a residency rule.
  const residencyLine =
    institution.residency_min_units > 0
      ? `${institution.residency_min_units} units must be earned on campus`
      : 'no residency minimum on file';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back to your plan"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>← Your plan</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {ROUTE_LABEL[route.kind]}
        </Text>
      </View>

      {/* Pinned outside the ScrollView: the count of things that can bite the
          student stays on screen no matter how far down the plan they read. */}
      {hasWarnings && (
        <View style={styles.stripWrap}>
          <View
            style={[
              styles.strip,
              severeCount > 0
                ? styles.stripSevere
                : elevatedCount > 0
                  ? styles.stripElevated
                  : styles.stripPlain,
            ]}
            accessibilityRole="alert"
          >
            {/* Three lines, because a campus with a long name must not push the
                end of this sentence off the strip. */}
            <Text
              style={[styles.stripText, severeCount > 0 ? styles.severeInk : styles.warnInk]}
              numberOfLines={3}
            >
              {severeCount > 0
                ? `✗  ${severeCount === 1 ? 'Credit you hold is' : `${severeCount} credits you hold are`} worthless at ${institution.name} — read below`
                : elevatedCount > 0
                  ? `⚠  ${elevatedCount === 1 ? 'Credit you hold clears' : `${elevatedCount} credits you hold clear`} no Cal-GETC requirement at ${institution.name} — read below`
                  : `⚠  ${route.warnings.length} ${route.warnings.length === 1 ? 'constraint binds' : 'constraints bind'} this route — read below`}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker} numberOfLines={2}>
          {institution.name.toUpperCase()}
        </Text>

        {/* The hook: the dollar figure is the largest thing on the screen. */}
        <Text
          style={[
            styles.hero,
            heroBacked ? styles.heroBacked : styles.heroUnsure,
            !priced && styles.heroEmpty,
          ]}
          accessibilityLabel={
            priced
              ? `${money(route.total_cost_usd)} total${heroBacked ? '' : `, ${shakyItems} of ${route.items.length} rows unconfirmed`}`
              : 'Nothing to price. This route recommends no steps.'
          }
        >
          {money(route.total_cost_usd)}
        </Text>
        <Text style={styles.heroSub}>
          {/* $0 with nothing behind it is not a bargain, and must not read as one. */}
          {priced
            ? `${route.items.length} ${route.items.length === 1 ? 'step' : 'steps'} · ${route.total_units} units · clears ${route.areas_cleared.length} Cal-GETC ${route.areas_cleared.length === 1 ? 'area' : 'areas'}`
            : 'Nothing to price — this route recommends no steps. See below.'}
        </Text>
        {priced && !heroBacked && (
          <Text style={styles.heroCaveat}>
            Not a quote: {shakyItems} of {route.items.length}{' '}
            {shakyItems === 1 ? 'row below is' : 'rows below are'} unconfirmed, so this total could
            move.
          </Text>
        )}

        {/* Warnings come before the plan. They are the reason the plan looks the
            way it does, and the single most valuable thing the app says — and
            the loudest of them comes first, whatever order they arrived in. */}
        {orderedWarnings.map((w, i) => (
          <WarningCard key={`${w.kind}-${i}`} warning={w} instName={institution.name} />
        ))}

        {/* The only place unmet requirements are reported. The engine used to
            emit a warning saying the same thing, which made the student read one
            sentence twice on a single screen; now this block stands on its own,
            so it states the consequence itself instead of reading like a
            footnote to a card that is no longer above it. */}
        {unmetCount > 0 && (
          <View style={styles.unmet}>
            <Text style={styles.unmetKicker}>
              STILL UNMET · {unmetCount} {unmetOne ? 'AREA' : 'AREAS'}
            </Text>
            <Text style={styles.unmetLead}>
              {unmetOne
                ? 'One Cal-GETC requirement is'
                : `${unmetCount} Cal-GETC requirements are`}{' '}
              still open after this route. You have to clear {unmetOne ? 'it' : 'them'} at{' '}
              {institution.name} some other way, and the total above does not price that.
            </Text>
            <View style={styles.unmetRow}>
              {route.areas_unmet.map(area => (
                <View key={area} style={styles.unmetChip}>
                  <Text style={styles.unmetChipText}>{areaLabel(area, areaName(area))}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.unmetText}>
              Nothing in our data clears {unmetOne ? 'this area' : 'these areas'} at{' '}
              {institution.name}. That is a gap in our dataset, not proof that no option exists —
              ask your advisor.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>The plan</Text>
        <Text style={styles.sectionSub}>
          Every row is what {institution.name} will do with that credit, quoted from its own
          policy. Tap a badge to read the source.
        </Text>

        {route.items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              This route recommends nothing. Either your target is already met, or our data holds
              no option good enough for this route to stake your money on.
            </Text>
          </View>
        ) : (
          route.items.map((item, i) => (
            <ItemCard
              key={`${item.credit_source_id}-${i}`}
              item={item}
              position={i + 1}
              instName={institution.name}
              areaName={areaName}
            />
          ))
        )}

        {shakyItems > 0 && (
          <Text style={styles.closer}>
            {shakyItems} of {route.items.length} {shakyItems === 1 ? 'row is' : 'rows are'} not
            confirmed against a published source. Confirm those with {institution.name} before you
            spend anything. Nothing here is a promise.
          </Text>
        )}

        {/* Three claims, three sources, three badges. The campus identity line
            carries the exam policy — the only one of the three anybody has
            confirmed — and the two figures nobody has confirmed sit on their own
            lines under their own 'needs confirming' badges, instead of being
            covered by a "Published policy" stamp that was never about them. */}
        <View style={styles.instRow}>
          <InstFact
            text={`${institution.name} · ${institution.system} · ${
              institution.accepts_clep ? 'accepts CLEP' : 'awards no CLEP credit'
            }`}
            p={institution.exam_policy_provenance}
          />
          <InstFact text={capLine} p={institution.transfer_cap_provenance} />
          <InstFact text={residencyLine} p={institution.residency_provenance} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {unlocked ? (
          <Pressable
            onPress={onExportPacket}
            accessibilityRole="button"
            accessibilityLabel="Export advisor packet"
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          >
            <Text style={styles.ctaText}>Export advisor packet</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onUnlock}
            accessibilityRole="button"
            accessibilityLabel="Unlock the advisor packet, a one-page PDF your advisor can confirm"
            style={({ pressed }) => [styles.cta, styles.ctaLocked, pressed && styles.pressed]}
          >
            <Text style={styles.ctaLockedText}>🔒  Unlock advisor packet</Text>
          </Pressable>
        )}
        <Text style={styles.footerNote}>
          {unlocked
            ? 'Every row above, with its source and its confidence, on one page.'
            : 'A one-page PDF your advisor can confirm — every row with its source.'}
        </Text>
        {/* One of the plans renews monthly. Someone who can be charged every
            month must be able to cancel without leaving the app. */}
        {onManageSubscription !== null && (
          <Pressable
            onPress={onManageSubscription}
            accessibilityRole="button"
            accessibilityLabel="Manage your subscription, change plan, or request a refund"
            hitSlop={8}
            style={styles.manageRow}
          >
            <Text style={styles.manageText}>Manage subscription</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// A max-width column keeps the phone layout intact on a Galaxy Tab instead of
// stretching every row to the bezel.
const COLUMN = 640;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.xl,
  },

  header: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.sm,
  },
  back: { paddingVertical: theme.space.xs },
  backText: { ...theme.font.body, color: theme.color.textMuted },
  headerTitle: { ...theme.font.heading, color: theme.color.text, flex: 1, textAlign: 'right' },

  stripWrap: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: theme.space.md,
    paddingBottom: theme.space.xs,
  },
  strip: {
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  stripSevere: { borderColor: theme.color.danger, backgroundColor: theme.color.surface },
  // Amber like the plain strip, weighted like the severe one: this is the tier
  // where nothing looks wrong to the student unless the screen says so.
  stripElevated: {
    borderColor: theme.color.warn,
    borderLeftWidth: 8,
    backgroundColor: theme.color.surfaceAlt,
  },
  stripPlain: { borderColor: theme.color.warn, backgroundColor: theme.color.surface },
  stripText: { ...theme.font.small, fontWeight: '700', letterSpacing: 0.5 },
  severeInk: { color: theme.color.danger },
  warnInk: { color: theme.color.warn },

  kicker: {
    ...theme.font.small,
    color: theme.color.textMuted,
    letterSpacing: 2,
    marginBottom: theme.space.xs,
  },
  hero: { ...theme.font.display },
  // The saving colour is reserved for a figure every row behind it supports.
  heroBacked: { color: theme.color.accent },
  heroUnsure: { color: theme.color.text },
  heroEmpty: { color: theme.color.textMuted },
  heroSub: { ...theme.font.body, color: theme.color.textMuted, marginTop: theme.space.xs },
  heroCaveat: {
    ...theme.font.small,
    color: theme.color.needsCheck,
    marginTop: theme.space.xs,
    lineHeight: 19,
  },

  warning: {
    marginTop: theme.space.md,
    borderWidth: 2,
    borderRadius: theme.radius.lg,
    padding: theme.space.md,
    gap: theme.space.sm,
    backgroundColor: theme.color.surface,
  },
  warningSevere: { borderColor: theme.color.danger },
  // Between the two: no money is gone, so it is not red, but credit that counts
  // and clears nothing is invisible to the student unless this card is heavier
  // than the constraints around it.
  warningElevated: {
    borderColor: theme.color.warn,
    borderLeftWidth: 8,
    backgroundColor: theme.color.surfaceAlt,
  },
  warningPlain: { borderColor: theme.color.warn },
  warningOpportunity: { borderColor: theme.color.accent },
  // Still loud, but dashed while the policy row behind it is unconfirmed.
  warningShaky: { borderStyle: 'dashed' },
  warningKicker: { ...theme.font.small, fontWeight: '700', letterSpacing: 1 },
  warningText: { ...theme.font.body, color: theme.color.text, lineHeight: 22 },
  warningNote: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },
  warningCaveat: { ...theme.font.small, color: theme.color.needsCheck, lineHeight: 19 },

  unmet: {
    marginTop: theme.space.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.color.warn,
    paddingLeft: theme.space.md,
    gap: theme.space.sm,
  },
  unmetKicker: { ...theme.font.small, color: theme.color.warn, fontWeight: '700', letterSpacing: 1 },
  // This block is the whole report on unmet requirements now, so its first
  // sentence carries full ink rather than the muted grey of a footnote.
  unmetLead: { ...theme.font.body, color: theme.color.text, lineHeight: 22 },
  unmetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  unmetChip: {
    borderWidth: 1,
    borderColor: theme.color.warn,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    // Every chip here carries an area name now, so every chip can outgrow the
    // row: let it wrap rather than run off the edge of the screen.
    flexShrink: 1,
  },
  unmetChipText: { ...theme.font.mono, color: theme.color.warn, letterSpacing: 1 },
  unmetText: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  sectionTitle: { ...theme.font.title, color: theme.color.text, marginTop: theme.space.xl },
  sectionSub: {
    ...theme.font.small,
    color: theme.color.textMuted,
    marginTop: theme.space.xs,
    marginBottom: theme.space.md,
    lineHeight: 19,
  },

  item: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    marginBottom: theme.space.sm,
    gap: theme.space.sm,
  },
  // Unverified data is drawn as a sketch, not a statement.
  itemUnverified: { borderStyle: 'dashed', backgroundColor: 'transparent', opacity: 0.92 },
  itemHead: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.sm },
  itemNum: {
    ...theme.font.mono,
    color: theme.color.textMuted,
    minWidth: 18,
    paddingTop: 2,
  },
  itemLabel: { ...theme.font.heading, color: theme.color.text, flex: 1 },
  itemLabelShaky: { color: theme.color.textMuted },
  itemCost: { ...theme.font.heading, color: theme.color.accent },
  itemMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: theme.space.sm },
  itemNote: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },
  itemShakyTag: { ...theme.font.small, color: theme.color.warn, fontWeight: '600', lineHeight: 19 },

  chip: {
    backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  },
  // "CAL-GETC 2 · Mathematical Concepts & Quantitative Reasoning" is far wider
  // than a phone, and a chip that cannot shrink runs off the card instead of
  // wrapping — taking the requirement's name with it. Only the area chip needs
  // this; "12 UNITS" always fits and must not be broken across two lines.
  chipArea: { flexShrink: 1 },
  chipText: { ...theme.font.mono, color: theme.color.textMuted, letterSpacing: 1 },

  badge: {
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeShaky: { borderStyle: 'dashed', opacity: 0.85 },
  badgeDead: { borderStyle: 'dashed', opacity: 0.7 },
  badgeText: { fontSize: 11, fontWeight: '600' },

  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
  },
  emptyText: { ...theme.font.body, color: theme.color.textMuted, lineHeight: 22 },

  closer: {
    ...theme.font.small,
    color: theme.color.textMuted,
    marginTop: theme.space.md,
    lineHeight: 19,
  },

  instRow: {
    marginTop: theme.space.xl,
    paddingTop: theme.space.md,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    gap: theme.space.sm,
  },
  instFact: { gap: theme.space.xs },
  instText: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    backgroundColor: theme.color.bg,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
  cta: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    backgroundColor: theme.color.accent,
    borderRadius: theme.radius.md,
    paddingVertical: theme.space.md,
    alignItems: 'center',
  },
  ctaLocked: {
    backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.color.accent,
  },
  ctaText: { ...theme.font.heading, color: theme.color.bg },
  ctaLockedText: { ...theme.font.heading, color: theme.color.accent },
  manageRow: { paddingTop: theme.space.sm, alignItems: 'center' },
  manageText: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textDecorationLine: 'underline',
  },
  footerNote: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textAlign: 'center',
    marginTop: theme.space.sm,
    alignSelf: 'center',
    maxWidth: COLUMN,
  },

  pressed: { opacity: 0.7 },
});
