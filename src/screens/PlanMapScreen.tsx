import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AreaChoice, GeArea, PlanItem, Provenance, StudentProfile } from '../types.ts';
import type { PlanMapScreenProps } from '../ui/contracts.ts';
import { confidenceColor, confidenceLabel, money, theme } from '../ui/theme.ts';
import { checkedOn, isBacked, noteText } from '../ui/provenance.ts';
import { DISCLAIMER_SHORT } from '../disclaimer.ts';

/**
 * The plan as something you can explore and change, rather than a verdict.
 *
 * Shape: a single vertical spine with one branch per requirement. A free-form
 * radial mind map is unreadable at 390pt — this keeps the map's properties that
 * matter (see the whole plan, see how each part hangs off the goal, open any
 * branch) at a width a phone actually has.
 *
 * Every branch is editable. A generated plan is a starting point: the student
 * knows things we do not, and the map is where they say so.
 */

type Status = 'chosen' | 'included' | 'skipped' | 'unmet';

interface Branch {
  area: GeArea;
  status: Status;
  item: PlanItem | null;
  /** True when this differs from what we would have picked. */
  edited: boolean;
}

const STATUS_COLOR: Record<Status, string> = {
  chosen: theme.color.accent,
  included: theme.color.accent,
  skipped: theme.color.textMuted,
  unmet: theme.color.warn,
};

const STATUS_LABEL: Record<Status, string> = {
  chosen: 'planned',
  included: 'already covered, at no extra cost',
  skipped: 'you are handling this',
  unmet: 'nothing in our data clears this',
};

/**
 * What to call each kind of credit, and why a high-schooler should care.
 *
 * Priced against the student's own requirements rather than described in the
 * abstract: "dual enrolment is cheap" is a slogan, "it clears 8 of your 9
 * requirements for $0" is something you can act on.
 */
const PATH_COPY: Record<string, readonly [string, string]> = {
  ccc_course: [
    'Community college — free while you are in high school',
    'Dual enrolment (CCAP) waives the enrolment fee entirely for high-school ' +
    'students, up to 15 units a term. The same courses transfer later.',
  ],
  ap: [
    'AP exams',
    'The only exam credit both UC and CSU accept toward Cal-GETC.',
  ],
  clep: [
    'CLEP exams',
    'Cannot satisfy Cal-GETC anywhere, and UC awards no CLEP credit at all.',
  ],
};

function Badge({ p }: { p: Provenance }): ReactElement {
  const shaky = !isBacked(p);
  return (
    <View style={[styles.badge, { borderColor: confidenceColor(p.confidence) }, shaky && styles.badgeShaky]}>
      <Text style={[styles.badgeText, { color: confidenceColor(p.confidence) }]} numberOfLines={1}>
        {confidenceLabel(p.confidence)} · {checkedOn(p)}
      </Text>
    </View>
  );
}

function Option({
  item, selected, onPress,
}: { item: PlanItem; selected: boolean; onPress: () => void }): ReactElement {
  const note = noteText(item.provenance);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      style={[styles.option, selected && styles.optionOn]}
    >
      <View style={styles.optionHead}>
        <Text style={[styles.optionLabel, selected && styles.optionLabelOn]} numberOfLines={3}>
          {selected ? '● ' : '○ '}{item.label}
        </Text>
        <Text style={[styles.optionCost, selected && styles.optionLabelOn]}>
          {item.cost_usd === 0 ? 'free' : money(item.cost_usd)}
        </Text>
      </View>
      <Badge p={item.provenance} />
      {note !== null && <Text style={styles.optionNote}>{note}</Text>}
    </Pressable>
  );
}

export function PlanMapScreen(props: PlanMapScreenProps): ReactElement {
  const {
    institution, route, areas, profile,
    optionsFor, pathways, choiceFor, onChoose,
    onOpenDetail, onShareWithGuardian, onStartOver, onBack,
  } = props;

  const [open, setOpen] = useState<string | null>(null);

  const areaById = new Map(areas.map(a => [a.id, a] as const));
  const nameFor = (id: string): string => {
    const n = areaById.get(id)?.name.trim();
    return n === undefined || n === '' ? `CAL-GETC ${id}` : `CAL-GETC ${id} · ${n}`;
  };

  /**
   * One branch per requirement this campus imposes, in a FIXED order.
   *
   * Grouping by status instead would reorder the list the moment a student
   * changes something — skip a requirement and its node jumps to the bottom,
   * away from the finger that just tapped it. The map has to hold still while
   * it is being edited.
   */
  // One item can clear several requirements at once — AP Biology carries its own
  // 5C laboratory — so it is indexed under every area it covers.
  // First item to cover an area owns it. Two science exams each carry a 5C
  // laboratory, but only one of them is actually supplying it — saying "also
  // clears the lab" on both is true of each exam and misleading about the plan.
  const itemByArea = new Map<string, PlanItem>();
  /** The requirement each credit is listed under, so it is priced in one place. */
  const ownerArea = new Map<string, string>();
  for (const i of route.items) {
    for (const a of i.satisfies_areas) {
      if (!itemByArea.has(a)) {
        itemByArea.set(a, i);
        if (!ownerArea.has(i.credit_source_id)) ownerArea.set(i.credit_source_id, a);
      }
    }
  }
  const skipped = new Set(route.areas_skipped);

  const branches: Branch[] = areas
    .filter(a => a.applies_to.includes(institution.system))
    .map(area => {
      const item = itemByArea.get(area.id) ?? null;
      // A requirement covered by an exam listed under an earlier requirement is
      // 'included', not 'chosen'. Showing AP Chemistry with its $99 under both
      // 5A and 5C reads as buying it twice; the cost is only charged once, and
      // the map has to say so.
      const primary = item === null ? null : ownerArea.get(item.credit_source_id) ?? null;
      const status: Status = skipped.has(area.id)
        ? 'skipped'
        : item === null ? 'unmet'
        : primary === area.id ? 'chosen' : 'included';
      const choice = choiceFor(area.id);
      return { area, status, item, edited: choice !== undefined };
    });

  const editedCount = branches.filter(b => b.edited).length;
  const showHsPaths =
    profile.year === 'grade_9' || profile.year === 'grade_10' || profile.year === 'grade_11';

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.column}>
          <Pressable onPress={onBack} accessibilityRole="button" hitSlop={8} style={styles.backRow}>
            <Text style={styles.backText}>‹ Routes</Text>
          </Pressable>

          <Text style={styles.kicker}>YOUR PLAN</Text>
          <Text style={styles.title}>Every requirement, and how you are clearing it.</Text>
          <Text style={styles.sub}>
            Tap any branch to see what else this campus accepts, or to say you are
            handling it yourself. This is your plan — change it.
          </Text>

          {/* Permanent, not a one-time modal. The app tells students how to spend
              money on credit that might not transfer; the limit of what it knows
              belongs on the same screen as the advice, every time. */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{DISCLAIMER_SHORT}</Text>
          </View>

          {showHsPaths && (
            <View style={styles.pathsCard}>
              <Text style={styles.pathsTitle}>✓  ROUTES STILL OPEN TO YOU</Text>
              <Text style={styles.pathsSub}>
                You are still in high school, so you can start banking credit now.
                Here is what each route would actually do for this plan — they
                stack, and most students use more than one.
              </Text>
              {pathways.map(pw => {
                const copy = PATH_COPY[pw.kind];
                if (copy === undefined) return null;
                const [name, why] = copy;
                const none = pw.areas_covered === 0;
                return (
                  <View key={pw.kind} style={styles.pathRow}>
                    <Text style={styles.pathName}>{name}</Text>
                    <Text style={[styles.pathFigure, none && styles.pathFigureNone]}>
                      {none
                        ? `clears none of your ${pw.areas_required} requirements`
                        : `clears ${pw.areas_covered} of ${pw.areas_required} · ` +
                          `${pw.total_cost_usd === 0 ? 'free' : money(pw.total_cost_usd)}`}
                    </Text>
                    <Text style={styles.pathWhy}>{why}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Root of the map. */}
          <View style={styles.rootNode}>
            <Text style={styles.rootName} numberOfLines={2}>{institution.name}</Text>
            <Text style={styles.rootMeta}>
              {institution.system} · {branches.length} requirement{branches.length === 1 ? '' : 's'}
              {editedCount > 0 ? ` · ${editedCount} changed by you` : ''}
            </Text>
            <Text style={styles.rootCost}>
              {route.total_cost_usd === 0 ? 'nothing to pay yet' : money(route.total_cost_usd)}
            </Text>
          </View>

          {branches.length === 0 && (
            <Text style={styles.empty}>
              No requirements to show for this campus yet.
            </Text>
          )}

          {branches.map((b, i) => {
            const isOpen = open === b.area.id;
            const options = isOpen ? optionsFor(b.area.id) : [];
            const chosenId = b.item?.credit_source_id ?? null;
            const last = i === branches.length - 1;

            return (
              <View key={b.area.id} style={styles.branchRow}>
                {/* The spine: a rail down the left, with a stub into each node.
                    Plain Views rather than SVG — one less native dependency, and
                    it renders identically on web and on a device. */}
                <View style={styles.rail}>
                  <View style={[styles.railLine, last && styles.railLineLast]} />
                  <View style={[styles.railDot, { backgroundColor: STATUS_COLOR[b.status] }]} />
                  <View style={styles.railStub} />
                </View>

                <View style={styles.branchBody}>
                  <Pressable
                    onPress={() => setOpen(isOpen ? null : b.area.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isOpen }}
                    accessibilityLabel={`${nameFor(b.area.id)}, ${STATUS_LABEL[b.status]}. Tap to change.`}
                    style={[styles.node, isOpen && styles.nodeOpen,
                      b.status === 'unmet' && styles.nodeUnmet]}
                  >
                    <Text style={styles.areaName} numberOfLines={2}>{nameFor(b.area.id)}</Text>

                    {b.item !== null ? (
                      <>
                        <View style={styles.nodeLine}>
                          <Text style={styles.chosenLabel} numberOfLines={2}>{b.item.label}</Text>
                          <Text style={b.status === 'included' ? styles.includedCost : styles.chosenCost}>
                            {b.status === 'included'
                              ? 'no extra cost'
                              : b.item.cost_usd === 0 ? 'free' : money(b.item.cost_usd)}
                          </Text>
                        </View>
                        {b.status === 'included' && (
                          <Text style={styles.alsoClears}>
                            Already counted under {nameFor(ownerArea.get(b.item.credit_source_id) ?? '')}
                          </Text>
                        )}
                        {(() => {
                          const alsoOwned = b.item.satisfies_areas.filter(
                            a => a !== b.area.id && itemByArea.get(a) === b.item,
                          );
                          if (alsoOwned.length === 0) return null;
                          return (
                            <Text style={styles.alsoClears}>
                              One sitting also clears {alsoOwned.map(a => nameFor(a)).join(', ')}
                            </Text>
                          );
                        })()}
                        <Badge p={b.item.provenance} />
                      </>
                    ) : (
                      <Text style={[styles.statusText, { color: STATUS_COLOR[b.status] }]}>
                        {STATUS_LABEL[b.status]}
                      </Text>
                    )}

                    <Text style={styles.expandHint}>
                      {isOpen ? 'Close' : b.edited ? 'Your choice · tap to change' : 'Tap to change'}
                    </Text>
                  </Pressable>

                  {isOpen && (
                    <View style={styles.options}>
                      {options.length === 0 && (
                        <Text style={styles.noOptions}>
                          Nothing in our data clears this requirement at {institution.name}.
                          Ask your advisor — this is a gap in our coverage, not a dead end.
                        </Text>
                      )}
                      {options.map(o => (
                        <Option
                          key={o.credit_source_id}
                          item={o}
                          selected={o.credit_source_id === chosenId}
                          onPress={() => {
                            onChoose(b.area.id, { kind: 'use', credit_source_id: o.credit_source_id });
                            setOpen(null);
                          }}
                        />
                      ))}

                      <Pressable
                        onPress={() => { onChoose(b.area.id, { kind: 'skip' }); setOpen(null); }}
                        accessibilityRole="button"
                        style={[styles.option, b.status === 'skipped' && styles.optionOn]}
                      >
                        <Text style={styles.skipText}>
                          {b.status === 'skipped' ? '● ' : '○ '}I am handling this myself
                        </Text>
                        <Text style={styles.optionNote}>
                          Already done, or covered some other way. It stops being priced.
                        </Text>
                      </Pressable>

                      {b.edited && (
                        <Pressable
                          onPress={() => { onChoose(b.area.id, null); setOpen(null); }}
                          accessibilityRole="button"
                          style={styles.reset}
                        >
                          <Text style={styles.resetText}>Reset to our recommendation</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={onOpenDetail} accessibilityRole="button" style={styles.cta}>
          <Text style={styles.ctaText}>See the full breakdown</Text>
        </Pressable>
        <Pressable
          onPress={onShareWithGuardian}
          accessibilityRole="button"
          accessibilityLabel="Send this plan to a parent or guardian"
          style={styles.secondaryCta}
        >
          <Text style={styles.secondaryCtaText}>Send to a parent or guardian</Text>
        </Pressable>
        <Text style={styles.savedNote}>
          Saved on this device. Come back and change it any time.
        </Text>
        <Pressable onPress={onStartOver} accessibilityRole="button" hitSlop={8} style={styles.reset}>
          <Text style={styles.resetText}>Start a new plan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const RAIL_W = 28;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { padding: theme.space.md, paddingBottom: theme.space.xl },
  // Keeps the phone layout intact on a Galaxy Tab instead of stretching lines
  // of text to an unreadable width.
  column: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  backRow: { paddingVertical: theme.space.xs },
  backText: { ...theme.font.body, color: theme.color.textMuted },
  kicker: { ...theme.font.small, color: theme.color.textMuted, letterSpacing: 2, marginTop: theme.space.sm },
  title: { ...theme.font.title, color: theme.color.text, marginTop: theme.space.xs },
  sub: { ...theme.font.body, color: theme.color.textMuted, marginTop: theme.space.xs, lineHeight: 21 },

  pathsCard: {
    marginTop: theme.space.lg, padding: theme.space.md,
    borderRadius: theme.radius.md, borderWidth: 1,
    borderColor: theme.color.accent, backgroundColor: theme.color.accentDim,
  },
  pathsTitle: { ...theme.font.small, color: theme.color.accent, letterSpacing: 1, fontWeight: '700' },
  pathsSub: { ...theme.font.small, color: theme.color.text, marginTop: theme.space.xs, lineHeight: 18 },
  pathRow: { marginTop: theme.space.sm },
  pathName: { ...theme.font.body, color: theme.color.text, fontWeight: '600' },
  pathFigure: { ...theme.font.small, color: theme.color.accent, fontWeight: '700', marginTop: 1 },
  pathFigureNone: { color: theme.color.warn },
  pathWhy: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2, lineHeight: 17 },

  rootNode: {
    marginTop: theme.space.lg, padding: theme.space.md,
    borderRadius: theme.radius.lg, borderWidth: 1,
    borderColor: theme.color.border, backgroundColor: theme.color.surfaceAlt,
  },
  rootName: { ...theme.font.title, color: theme.color.text },
  rootMeta: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2 },
  rootCost: { ...theme.font.heading, color: theme.color.accent, marginTop: theme.space.sm },

  empty: { ...theme.font.body, color: theme.color.textMuted, marginTop: theme.space.lg },

  branchRow: { flexDirection: 'row', alignItems: 'stretch' },
  rail: { width: RAIL_W, alignItems: 'center' },
  railLine: {
    position: 'absolute', top: 0, bottom: 0, left: RAIL_W / 2 - 1,
    width: 2, backgroundColor: theme.color.border,
  },
  railLineLast: { bottom: '55%' },
  railDot: {
    position: 'absolute', top: 30, left: RAIL_W / 2 - 5,
    width: 10, height: 10, borderRadius: 5,
  },
  railStub: {
    position: 'absolute', top: 34, left: RAIL_W / 2 + 5,
    right: 0, height: 2, backgroundColor: theme.color.border,
  },
  branchBody: { flex: 1, paddingTop: theme.space.sm, paddingBottom: theme.space.sm },

  node: {
    padding: theme.space.md, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.color.border, backgroundColor: theme.color.surface,
  },
  nodeOpen: { borderColor: theme.color.accent },
  nodeUnmet: { borderColor: theme.color.warn },
  areaName: { ...theme.font.small, color: theme.color.textMuted, letterSpacing: 0.5 },
  nodeLine: { flexDirection: 'row', alignItems: 'flex-start', marginTop: theme.space.xs, gap: theme.space.sm },
  chosenLabel: { ...theme.font.body, color: theme.color.text, flex: 1, fontWeight: '600' },
  chosenCost: { ...theme.font.body, color: theme.color.accent, fontWeight: '700' },
  statusText: { ...theme.font.body, marginTop: theme.space.xs },
  alsoClears: { ...theme.font.small, color: theme.color.accent, marginTop: 2 },
  includedCost: { ...theme.font.small, color: theme.color.textMuted, fontWeight: '600' },
  expandHint: { ...theme.font.small, color: theme.color.textMuted, marginTop: theme.space.sm },

  options: { marginTop: theme.space.sm, gap: theme.space.sm },
  option: {
    padding: theme.space.md, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.color.border, backgroundColor: theme.color.surfaceAlt,
  },
  optionOn: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  optionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.sm },
  optionLabel: { ...theme.font.body, color: theme.color.text, flex: 1 },
  optionLabelOn: { color: theme.color.accent },
  optionCost: { ...theme.font.body, color: theme.color.textMuted, fontWeight: '700' },
  optionNote: { ...theme.font.small, color: theme.color.textMuted, marginTop: theme.space.xs, lineHeight: 17 },
  noOptions: { ...theme.font.small, color: theme.color.warn, lineHeight: 18 },
  skipText: { ...theme.font.body, color: theme.color.text },
  reset: { paddingVertical: theme.space.sm, alignItems: 'center' },
  resetText: { ...theme.font.small, color: theme.color.textMuted, textDecorationLine: 'underline' },

  badge: {
    alignSelf: 'flex-start', marginTop: theme.space.xs,
    borderWidth: 1, borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm, paddingVertical: 2,
  },
  badgeShaky: { borderStyle: 'dashed', opacity: 0.85 },
  badgeText: { ...theme.font.small, fontWeight: '600' },

  footer: {
    padding: theme.space.md, borderTopWidth: 1,
    borderTopColor: theme.color.border, backgroundColor: theme.color.bg,
  },
  cta: {
    backgroundColor: theme.color.accent, borderRadius: theme.radius.md,
    paddingVertical: theme.space.md, alignItems: 'center',
  },
  ctaText: { ...theme.font.heading, color: theme.color.bg },
  disclaimer: {
    marginTop: theme.space.md, padding: theme.space.sm,
    borderRadius: theme.radius.sm, borderLeftWidth: 3,
    borderLeftColor: theme.color.warn, backgroundColor: theme.color.surface,
  },
  disclaimerText: { ...theme.font.small, color: theme.color.text, lineHeight: 18 },
  secondaryCta: {
    marginTop: theme.space.sm, paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md, borderWidth: 1,
    borderColor: theme.color.border, alignItems: 'center',
  },
  secondaryCtaText: { ...theme.font.body, color: theme.color.text, fontWeight: '600' },
  savedNote: {
    ...theme.font.small, color: theme.color.textMuted,
    textAlign: 'center', marginTop: theme.space.sm,
  },
});
