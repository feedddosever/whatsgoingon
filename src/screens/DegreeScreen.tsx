/**
 * "What's a bachelor's degree made of?"
 *
 * The degree drawn as blocks on one bar — general education, major prep, the
 * major, an optional minor, electives — with the rules that sit on top of them
 * (residency, advanced units, graduation requirements) underneath. Tap a block
 * and a sheet explains it.
 *
 * Two kinds of sentence live here and must never be confused. Facts about the
 * student's system or campus come from the dataset and carry their badge, like
 * everything else in this app. The explanations of what a block IS are general
 * — "a major is often 30 to 50 units" — and are labelled as general guidance,
 * never dressed as a campus's figure.
 */
import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import type { CreditKind, DegreeBlock, DegreeRule, MajorPrep } from '../types.ts';
import type { DegreeScreenProps } from '../ui/contracts.ts';
import { PressScale } from '../ui/motion.tsx';
import { SourceBadge } from '../ui/SourceBadge.tsx';
import { theme } from '../ui/theme.ts';

/**
 * Block colours. None of them is a confidence colour: those mean "how far to
 * trust this", and a block must never read as a verdict on its own data.
 */
const C = {
  ge: '#A78BFA',
  prep: '#F472B6',
  major: '#22D3EE',
  minor: '#FB923C',
  electives: '#94A3B8',
  rule: '#E2E8F0',
} as const;

type Module = 'ge' | 'prep' | 'major' | 'minor' | 'electives' | 'residency' | 'upper' | 'grad';

// Typical sizes, used only where no system figure exists — and labelled so.
const TYPICAL_TOTAL = 120;
const TYPICAL_GE = 36;
const TYPICAL_PREP = 15;
const TYPICAL_MAJOR = 36;
const TYPICAL_MINOR = 18;

const KIND_LABEL: ReadonlyArray<readonly [CreditKind, string]> = [
  ['ap', 'AP exams'],
  ['clep', 'CLEP'],
  ['ib', 'IB'],
  ['a_level', 'A Levels'],
  ['dsst', 'DSST'],
  ['cc_course', 'Community college'],
];

const FIELD_NAME: Record<string, string> = {
  stem: 'STEM',
  business: 'business',
  health: 'health',
  social_sciences: 'the social sciences',
  arts_humanities: 'arts & humanities',
  undecided: 'any field',
};

function General({ children }: { children?: ReactNode }): ReactElement {
  return (
    <View style={styles.general}>
      <Text style={styles.generalText}>{children ?? 'General guidance · varies by campus'}</Text>
    </View>
  );
}

function RuleCard({ rule }: { rule: DegreeRule }): ReactElement {
  return (
    <View style={styles.fact}>
      <Text style={styles.factKey}>{rule.title.toUpperCase()}</Text>
      <Text style={styles.factBody}>{rule.text}</Text>
      {rule.provenance.note !== undefined && <Text style={styles.factNote}>{rule.provenance.note}</Text>}
      <SourceBadge p={rule.provenance} />
    </View>
  );
}

function PrepCard(
  { prep, institutionId, institutionName }:
  { prep: MajorPrep; institutionId: string | null; institutionName: string | null },
): ReactElement {
  const extras = institutionId === null ? undefined : prep.campus_extras?.[institutionId];
  const any = institutionId !== null && (prep.campus_any ?? []).includes(institutionId);
  const hasCampusData = prep.campus_extras !== undefined || prep.campus_any !== undefined;
  return (
    <View style={styles.fact}>
      <Text style={styles.factKey}>{prep.programme.toUpperCase()}</Text>
      <Text style={styles.factValue}>{prep.major}</Text>
      {prep.courses.map(c => (
        <Text key={c} style={styles.bullet}>·  {c}</Text>
      ))}
      {institutionName !== null && extras !== undefined && (
        <Text style={styles.campusLine}>
          {institutionName}’s picks for the electives: {extras.join('; ')}.
        </Text>
      )}
      {institutionName !== null && any && (
        <Text style={styles.campusLine}>
          {institutionName} takes any course from the state list for the electives.
        </Text>
      )}
      {institutionName !== null && hasCampusData && extras === undefined && !any && (
        <Text style={styles.factNote}>
          The source names no electives for {institutionName} — ask the department.
        </Text>
      )}
      {prep.note !== undefined && <Text style={styles.factNote}>{prep.note}</Text>}
      {prep.provenance.note !== undefined && <Text style={styles.factNote}>{prep.provenance.note}</Text>}
      <SourceBadge p={prep.provenance} />
    </View>
  );
}

function Tile(
  { color, name, size, onPress, planned, optional, rule, wide }: {
    color: string; name: string; size: string; onPress: () => void;
    planned?: boolean; optional?: boolean; rule?: boolean; wide?: boolean;
  },
): ReactElement {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${size}. Tap to learn what it is.`}
      style={[styles.tileOuter, wide === true && styles.tileWide]}
      contentStyle={[styles.tile, planned === true && styles.tilePlanned, rule === true && styles.tileRule]}
    >
      <View style={styles.tileTop}>
        <View style={[styles.swatch, { backgroundColor: color }]} />
        {planned === true && <Text style={styles.plannedTag}>WE PLAN THIS</Text>}
        {optional === true && <Text style={styles.optionalTag}>OPTIONAL</Text>}
      </View>
      <Text style={styles.tileName}>{name}</Text>
      <Text style={styles.tileSize}>{size}</Text>
      <Text style={styles.tileTap}>Tap to learn ›</Text>
    </PressScale>
  );
}

export function DegreeScreen(props: DegreeScreenProps): ReactElement {
  const {
    institution, system, framework, frameworkUnits, degree, prep, gaps, field,
    unitsInResidence, wantsMinor, onToggleMinor, backLabel, onBack, onOpenPlan,
  } = props;
  const [open, setOpen] = useState<Module | null>(null);

  const rulesIn = (block: DegreeBlock): DegreeRule[] =>
    degree === null ? [] : degree.rules.filter(r => r.block === block);

  const specific = institution !== null && system !== null;
  const total = degree?.total_units ?? TYPICAL_TOTAL;
  const totalIsTypical = degree === null || degree.total_units === null;
  const ge = degree?.ge_units ?? frameworkUnits ?? TYPICAL_GE;
  const minor = wantsMinor ? TYPICAL_MINOR : 0;
  const electives = Math.max(0, total - ge - TYPICAL_PREP - TYPICAL_MAJOR - minor);

  const segments: ReadonlyArray<readonly [string, number, string]> = [
    ['Gen ed', ge, C.ge],
    ['Prep', TYPICAL_PREP, C.prep],
    ['Major', TYPICAL_MAJOR, C.major],
    ...(wantsMinor ? [['Minor', minor, C.minor] as const] : []),
    ['Electives', electives, C.electives],
  ];

  const where = institution?.name ?? null;
  const totalRule = rulesIn('total')[0];
  const minorRisk = prep.find(p => p.id === 'csu-adt');
  const clearedBy = KIND_LABEL.filter(([k]) => institution === null || !institution.refuses.includes(k));

  /* ---------------- the sheets ---------------- */

  let sheet: { color: string; title: string; lede: string; body: ReactNode; cta?: ReactNode } | null = null;

  if (open === 'ge') {
    sheet = {
      color: C.ge,
      title: 'General education',
      lede: 'The breadth part: writing, math, science, history, the arts. Every student takes it, whatever the major.',
      body: (
        <>
          {specific && framework !== null && (
            <View style={styles.fact}>
              <Text style={styles.factKey}>AT {where?.toUpperCase()}</Text>
              <Text style={styles.factValue}>
                {framework.name} · {frameworkUnits ?? framework.total_units} units
              </Text>
              <Text style={styles.factBody}>
                The requirements this app plans for you, area by area.
              </Text>
              <SourceBadge p={framework.provenance} />
            </View>
          )}
          {rulesIn('ge').map(r => <RuleCard key={r.id} rule={r} />)}
          {!specific && <General>General guidance · usually 30 to 45 units</General>}
          <Text style={styles.h3}>WHAT CAN CLEAR IT{specific ? ` AT ${where?.toUpperCase()}` : ''}</Text>
          <View style={styles.chips}>
            {clearedBy.map(([k, label]) => <Text key={k} style={styles.chip}>{label}</Text>)}
          </View>
          <Text style={styles.h3}>GOOD TO KNOW</Text>
          <Text style={styles.p}>
            This is where cheap credit does the most: one exam can stand in for a whole semester
            course — where your campus accepts it.
          </Text>
          <Text style={styles.p}>
            Some courses count twice — for general education and for your major. Ask your advisor
            which ones.
          </Text>
        </>
      ),
      cta: onOpenPlan === null ? undefined : (
        <Pressable
          onPress={() => { setOpen(null); onOpenPlan(); }}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaText}>See how your plan clears it</Text>
        </Pressable>
      ),
    };
  } else if (open === 'prep') {
    sheet = {
      color: C.prep,
      title: 'Major prep',
      lede:
        'The lower-division courses a major expects before its advanced ones. States publish ' +
        'them so you can take them anywhere — a community college included.',
      body: (
        <>
          {!specific && (
            <>
              <General>General guidance · often 6 to 20 units</General>
              <Text style={styles.p}>Pick a campus and we will show your state’s lists here.</Text>
            </>
          )}
          {specific && field === 'undecided' && (
            <Text style={styles.p}>You haven’t picked a field yet, so here is everything we hold at {system?.name}.</Text>
          )}
          {specific && field !== 'undecided' && (prep.length > 0 || gaps.length > 0) && (
            <Text style={styles.p}>For {FIELD_NAME[field]} at {system?.name}:</Text>
          )}
          {prep.map(p => (
            <PrepCard key={p.id} prep={p} institutionId={institution?.id ?? null} institutionName={where} />
          ))}
          {gaps.map((g, i) => (
            <View key={i} style={[styles.fact, styles.factGap]}>
              <Text style={styles.factKey}>NOT PUBLISHED YET</Text>
              <Text style={styles.factBody}>{g.text}</Text>
              <SourceBadge p={g.provenance} />
            </View>
          ))}
          {specific && prep.length === 0 && gaps.length === 0 && (
            <Text style={styles.p}>
              We hold no statewide list for {FIELD_NAME[field]} at {system?.name}. Your
              department’s degree map is the source — ask for it by name.
            </Text>
          )}
        </>
      ),
    };
  } else if (open === 'major') {
    sheet = {
      color: C.major,
      title: 'Major requirements',
      lede: 'The courses that make the degree a degree in something. Set by your department, not your state.',
      body: (
        <>
          <View style={styles.fact}>
            <Text style={styles.factKey}>TYPICAL SIZE</Text>
            <Text style={styles.factValue}>Often 30–50 units</Text>
            <Text style={styles.factBody}>Mostly advanced courses taken at the university itself.</Text>
            <General />
          </View>
          {rulesIn('major').map(r => <RuleCard key={r.id} rule={r} />)}
          <Text style={styles.h3}>GOOD TO KNOW</Text>
          <Text style={styles.p}>Some majors run in a fixed order. A chain like this can’t be shortened with exams:</Text>
          <View style={styles.seq}>
            {['Calculus I', 'Calculus II', 'Physics I', 'Engineering'].map((s, i, a) => (
              <View key={s} style={styles.seqItem}>
                <Text style={styles.seqBox}>{s}</Text>
                {i < a.length - 1 && <Text style={styles.seqArrow}>›</Text>}
              </View>
            ))}
          </View>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>
              We don’t plan major requirements yet. Your department’s degree map is the source — ask for it by name.
            </Text>
          </View>
        </>
      ),
    };
  } else if (open === 'minor') {
    sheet = {
      color: C.minor,
      title: 'Minor',
      lede:
        'A second, smaller subject next to your major — say, a computer science major with a ' +
        'minor in business. Optional; nobody requires one.',
      body: (
        <>
          <View style={styles.fact}>
            <Text style={styles.factKey}>TYPICAL SIZE</Text>
            <Text style={styles.factValue}>Often 15–24 units</Text>
            <Text style={styles.factBody}>Usually five to eight courses, set by the department that offers it.</Text>
            <General />
          </View>
          <Text style={styles.h3}>DOES IT ADD TIME?</Text>
          <Text style={styles.p}>
            Often not. A minor usually fills space your electives would have taken, so the degree
            stays the same length.
          </Text>
          <Text style={styles.p}>
            It gets tight when your major leaves few electives, or when the minor has its own chain
            of prerequisites.
          </Text>
          {minorRisk !== undefined && (
            <View style={styles.fact}>
              <Text style={styles.factKey}>IF YOU TRANSFER ON AN ADT</Text>
              <Text style={styles.factBody}>
                The CSU’s promise to finish your degree in 60 more units does not cover
                courses you add for a minor.
              </Text>
              <SourceBadge p={minorRisk.provenance} />
            </View>
          )}
          <View style={styles.callout}>
            <Text style={styles.calloutText}>
              Many campuses limit how many courses can count for your major and minor at once, and
              we don’t plan minors yet. Ask the department for its minor requirements.
            </Text>
          </View>
        </>
      ),
    };
  } else if (open === 'electives') {
    sheet = {
      color: C.electives,
      title: 'Electives',
      lede: `Whatever is left to reach ${total} units. Almost any course counts here.`,
      body: (
        <>
          <General />
          <Text style={styles.p}>
            This is where extra exam credit usually lands once your general education is covered —
            and where a minor fits, if you want one.
          </Text>
          <Text style={styles.p}>
            It is also the block a high-unit major squeezes first.
          </Text>
        </>
      ),
    };
  } else if (open === 'residency') {
    const min = institution?.residency_min_units ?? 0;
    const pct = min > 0 ? Math.min(1, unitsInResidence / min) : 0;
    sheet = {
      color: C.rule,
      title: 'Residency',
      lede: 'Not a set of courses — a rule. A minimum number of units you must earn at the university itself.',
      body: (
        <>
          {specific && institution !== null && (
            <View style={styles.fact}>
              <Text style={styles.factKey}>AT {where?.toUpperCase()}</Text>
              {min > 0 ? (
                <>
                  <Text style={styles.factValue}>{min} units on campus</Text>
                  <View style={styles.meter}><View style={[styles.meterFill, { width: `${pct * 100}%` }]} /></View>
                  <Text style={styles.factNote}>You have {unitsInResidence} of {min}.</Text>
                </>
              ) : (
                <Text style={styles.factBody}>We have no figure on file for this campus. Assume there is one.</Text>
              )}
              <SourceBadge p={institution.residency_provenance} />
            </View>
          )}
          {rulesIn('residency').map(r => <RuleCard key={r.id} rule={r} />)}
          <Text style={styles.h3}>WHY IT MATTERS</Text>
          <Text style={styles.p}>
            Transferring more credit in doesn’t shrink it. Cheap credit can only ever cover the
            rest of the degree — plan it there.
          </Text>
        </>
      ),
    };
  } else if (open === 'upper') {
    const rules = rulesIn('upper_division');
    sheet = {
      color: C.rule,
      title: 'Upper-division units',
      lede:
        'Advanced courses — junior and senior level. Campuses require a minimum of them, and ' +
        'exams and community-college courses are lower-division, so they can’t supply it.',
      body: (
        <>
          {rules.map(r => <RuleCard key={r.id} rule={r} />)}
          {rules.length === 0 && <General>General guidance · ask your campus for its figure</General>}
          {system?.id === 'CSU' && (
            <Text style={styles.p}>At a CSU, 24 of the 30 units you must earn on campus are upper-division — see Residency.</Text>
          )}
        </>
      ),
    };
  } else if (open === 'grad') {
    const rules = rulesIn('graduation');
    sheet = {
      color: C.rule,
      title: 'Graduation requirements',
      lede:
        'Rules every student must meet on top of the blocks. Most overlap with general ' +
        'education, so they rarely add courses — but they can decide which courses you pick.',
      body: (
        <>
          {rules.map(r => <RuleCard key={r.id} rule={r} />)}
          {rules.length === 0 && (
            <>
              <General>General guidance · pick a campus to see its rules</General>
              <Text style={styles.p}>Typical examples: a writing requirement, American history or government, a minimum GPA.</Text>
            </>
          )}
          <Text style={styles.p}>Campuses add their own on top — a language, a diversity course. Check your catalogue.</Text>
        </>
      ),
    };
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.column}>
          <Pressable onPress={onBack} accessibilityRole="button" hitSlop={8} style={styles.backRow}>
            <Text style={styles.backText}>‹ {backLabel}</Text>
          </Pressable>
          <Text style={styles.kicker}>HOW A DEGREE WORKS</Text>
          <Text style={styles.title}>What’s a bachelor’s degree made of?</Text>
          <Text style={styles.sub}>
            About {total} units, in a few blocks. Tap any block to see what it is — and which of
            them this app can help you clear.
          </Text>

          <View style={styles.bar} accessibilityLabel={segments.map(([n, u]) => `${n} ${u} units`).join(', ')}>
            {segments.filter(([, u]) => u > 0).map(([name, units, color]) => (
              <View key={name} style={[styles.seg, { flex: units, backgroundColor: color }]}>
                {units >= 12 && <Text style={styles.segText} numberOfLines={1}>{name}</Text>}
              </View>
            ))}
          </View>
          <View style={styles.scale}>
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <Text key={f} style={styles.scaleText}>
                {Math.round(total * f)}{f === 1 ? ' units' : ''}
              </Text>
            ))}
          </View>
          <Text style={styles.note}>
            {specific
              ? `Shown for ${where}. Prep, major${wantsMinor ? ', minor' : ''} and elective sizes are typical, not yours.`
              : 'A typical degree. Pick a campus and the blocks fill in with its own rules.'}
            {totalIsTypical && specific ? ' Total units are set campus by campus here.' : ''}
          </Text>
          {totalRule !== undefined && (
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>{totalRule.text}</Text>
              <SourceBadge p={totalRule.provenance} compact />
            </View>
          )}

          <View style={styles.toggle}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleTitle}>Planning a minor?</Text>
              <Text style={styles.toggleSub}>
                {wantsMinor ? 'Shown — it comes out of your electives.' : 'A second, smaller subject. Optional.'}
              </Text>
            </View>
            <Switch
              value={wantsMinor}
              onValueChange={onToggleMinor}
              trackColor={{ false: theme.color.border, true: theme.color.accent }}
              thumbColor={theme.color.text}
              accessibilityLabel="Planning a minor"
            />
          </View>

          <View style={styles.grid}>
            <Tile color={C.ge} name="General education" planned onPress={() => setOpen('ge')}
              size={specific && framework !== null ? `${ge} units · ${framework.name}` : 'Usually 30–45 units'} />
            <Tile color={C.prep} name="Major prep" onPress={() => setOpen('prep')}
              size={specific && prep.length > 0 ? `${prep.length} statewide list${prep.length === 1 ? '' : 's'}` : 'Often 6–20 units'} />
            <Tile color={C.major} name="Major requirements" onPress={() => setOpen('major')} size="Often 30–50 units" />
            {wantsMinor && (
              <Tile color={C.minor} name="Minor" optional onPress={() => setOpen('minor')} size="Often 15–24 units" />
            )}
            <Tile color={C.electives} name="Electives" onPress={() => setOpen('electives')}
              size={wantsMinor ? 'Less room left' : `About ${electives} units left`} />
          </View>

          <Text style={styles.section}>RULES ON TOP OF THE BLOCKS</Text>
          <View style={styles.grid}>
            <Tile color={C.rule} rule name="Residency" onPress={() => setOpen('residency')}
              size={institution !== null && institution.residency_min_units > 0
                ? `${institution.residency_min_units} units at ${institution.name}`
                : 'A minimum at the university'} />
            <Tile color={C.rule} rule name="Upper-division units" onPress={() => setOpen('upper')}
              size="Advanced-level courses" />
            <Tile color={C.rule} rule wide name="Graduation requirements" onPress={() => setOpen('grad')}
              size={rulesIn('graduation').length > 0
                ? rulesIn('graduation').map(r => r.title).join(' · ')
                : 'A writing rule, history, a minimum GPA…'} />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={sheet !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(null)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.dim} onPress={() => setOpen(null)} accessibilityLabel="Close" />
          {sheet !== null && (
            <View style={styles.sheet}>
              <View style={styles.grab} />
              <ScrollView contentContainerStyle={styles.sheetScroll}>
                <View style={[styles.sheetSwatch, { backgroundColor: sheet.color }]} />
                <Text style={styles.sheetTitle} accessibilityRole="header">{sheet.title}</Text>
                <Text style={styles.lede}>{sheet.lede}</Text>
                {sheet.body}
                {sheet.cta}
                <Pressable onPress={() => setOpen(null)} accessibilityRole="button" style={styles.close}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const COLUMN = 640;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg },
  scroll: { padding: theme.space.md, paddingBottom: theme.space.xl },
  column: { width: '100%', maxWidth: COLUMN, alignSelf: 'center' },
  backRow: { paddingVertical: theme.space.xs, marginBottom: theme.space.xs },
  backText: { ...theme.font.body, color: theme.color.textMuted },
  kicker: { ...theme.font.small, color: theme.color.textMuted, letterSpacing: 2 },
  title: { ...theme.font.title, fontSize: 26, lineHeight: 31, color: theme.color.text, marginTop: theme.space.xs },
  sub: { ...theme.font.body, color: theme.color.textMuted, lineHeight: 21, marginTop: theme.space.sm, marginBottom: theme.space.md },

  bar: { flexDirection: 'row', height: 38, borderRadius: 10, overflow: 'hidden', gap: 2 },
  seg: { alignItems: 'center', justifyContent: 'center' },
  segText: { fontSize: 12, fontWeight: '700', color: theme.color.bg },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginHorizontal: 2 },
  scaleText: { ...theme.font.small, fontSize: 12, color: theme.color.textMuted },
  note: { ...theme.font.small, fontSize: 12, color: theme.color.textMuted, marginTop: theme.space.xs, lineHeight: 17 },
  totalRow: { marginTop: theme.space.sm, gap: theme.space.xs },
  totalText: { ...theme.font.small, color: theme.color.text, lineHeight: 18 },

  toggle: {
    flexDirection: 'row', alignItems: 'center', gap: theme.space.md,
    backgroundColor: theme.color.surface, borderWidth: 1, borderColor: theme.color.border,
    borderRadius: theme.radius.md, padding: theme.space.md, marginVertical: theme.space.md,
  },
  toggleText: { flex: 1 },
  toggleTitle: { ...theme.font.heading, color: theme.color.text },
  toggleSub: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  tileOuter: { flexGrow: 1, flexShrink: 1, flexBasis: '45%' },
  tileWide: { flexBasis: '100%' },
  tile: {
    backgroundColor: theme.color.surface, borderWidth: 1, borderColor: theme.color.border,
    borderRadius: 14, padding: 12, minHeight: 116,
  },
  tilePlanned: { borderColor: theme.color.accent },
  tileRule: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  swatch: { width: 26, height: 6, borderRadius: 3 },
  plannedTag: {
    fontSize: 10, fontWeight: '700', color: theme.color.accent, backgroundColor: theme.color.accentDim,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 99, overflow: 'hidden',
  },
  optionalTag: {
    fontSize: 10, fontWeight: '700', color: theme.color.textMuted, borderWidth: 1,
    borderColor: theme.color.border, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99,
  },
  tileName: { ...theme.font.heading, fontSize: 15, color: theme.color.text },
  tileSize: { ...theme.font.small, color: theme.color.textMuted, marginTop: 4 },
  tileTap: { ...theme.font.small, fontSize: 12, color: theme.color.textMuted, marginTop: 'auto', paddingTop: 8 },
  section: { ...theme.font.small, fontSize: 12, color: theme.color.textMuted, letterSpacing: 1.5, marginTop: theme.space.lg, marginBottom: theme.space.sm },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  dim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    maxHeight: '88%', backgroundColor: theme.color.surface,
    borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1, borderColor: theme.color.border,
    width: '100%', maxWidth: COLUMN + 32, alignSelf: 'center',
  },
  grab: { width: 40, height: 5, borderRadius: 3, backgroundColor: theme.color.border, alignSelf: 'center', marginTop: 10 },
  sheetScroll: { padding: 18, paddingBottom: 28 },
  sheetSwatch: { width: 34, height: 7, borderRadius: 4, marginBottom: 10 },
  sheetTitle: { ...theme.font.title, fontSize: 23, color: theme.color.text },
  lede: { ...theme.font.body, color: theme.color.textMuted, lineHeight: 21, marginTop: 4, marginBottom: 14 },

  fact: { backgroundColor: theme.color.surfaceAlt, borderRadius: theme.radius.md, padding: 12, marginBottom: 12, gap: 4 },
  factGap: { borderLeftWidth: 3, borderLeftColor: theme.color.warn },
  factKey: { ...theme.font.small, fontSize: 11, letterSpacing: 1.4, color: theme.color.textMuted },
  factValue: { ...theme.font.heading, color: theme.color.text },
  factBody: { ...theme.font.body, fontSize: 14, lineHeight: 20, color: theme.color.text },
  factNote: { ...theme.font.small, lineHeight: 18, color: theme.color.textMuted },
  bullet: { ...theme.font.body, fontSize: 14, lineHeight: 20, color: theme.color.text },
  campusLine: { ...theme.font.small, lineHeight: 18, color: theme.color.accent, marginTop: 4 },

  general: {
    alignSelf: 'flex-start', borderWidth: 1, borderColor: theme.color.border, borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3, marginVertical: 4,
  },
  generalText: { fontSize: 11, fontWeight: '700', color: theme.color.textMuted },

  h3: { ...theme.font.small, letterSpacing: 1.4, color: theme.color.textMuted, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  p: { ...theme.font.body, lineHeight: 22, color: theme.color.text, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    ...theme.font.small, color: theme.color.text, backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1, borderColor: theme.color.border, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5, overflow: 'hidden',
  },
  seq: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 10 },
  seqItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seqBox: {
    ...theme.font.small, color: theme.color.text, backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1, borderColor: theme.color.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, overflow: 'hidden',
  },
  seqArrow: { color: theme.color.textMuted },
  callout: { borderLeftWidth: 3, borderLeftColor: theme.color.warn, paddingLeft: 10, marginTop: 8 },
  calloutText: { ...theme.font.body, fontSize: 14, lineHeight: 20, color: theme.color.text },
  meter: { height: 10, borderRadius: 5, backgroundColor: theme.color.border, overflow: 'hidden', marginTop: 6 },
  meterFill: { height: '100%', backgroundColor: C.rule },

  cta: { marginTop: 16, backgroundColor: theme.color.accent, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: 'center' },
  ctaText: { ...theme.font.heading, color: theme.color.bg },
  close: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
  closeText: { ...theme.font.body, color: theme.color.textMuted },
  pressed: { opacity: 0.7 },
});
