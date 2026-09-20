/**
 * InputScreen — the first thing a student sees.
 *
 * Deliberately not a form: three questions, answered by tapping. The only typing
 * is a unit count, plus an optional name for the advisor packet that nothing
 * here waits for. Everything factual on this screen (a campus's CLEP policy, an
 * exam's price, a residency minimum) is quoted from the dataset and carries its
 * own provenance badge, because a student who acts on a wrong transfer-credit
 * claim loses real money and a real semester.
 *
 * A campus's claims do not share a source. Its exam policy is published and
 * checked; its residency minimum is not. So each sentence here carries the row
 * that backs that sentence and no other, and no figure borrows a neighbour's
 * credibility.
 */
import { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import type {
  CreditAvailability,
  CreditKind,
  CreditRecognition,
  CreditSource,
  Institution,
  Jurisdiction,
  Provenance,
  StateCode,
  StudentInput,
} from '../types.ts';
import type { InputScreenProps } from '../ui/contracts.ts';
// Shared, not local: "is this claim backed?" has to mean the same thing on every
// screen and in the packet, or one of them quietly disagrees with the rest.
import { checkedOn, isBacked, linkable, noteText } from '../ui/provenance.ts';
import { confidenceColor, confidenceLabel, money, theme } from '../ui/theme.ts';
import { hasContact, waitlistMailto } from '../contact.ts';

/** Section order is pedagogical: exams first, because they are the cheap surprise. */
const CREDIT_GROUPS: ReadonlyArray<{ kind: CreditKind; title: string; blurb: string }> = [
  { kind: 'clep', title: 'CLEP exams', blurb: 'Credit by exam — not every campus takes it' },
  { kind: 'dsst', title: 'DSST exams', blurb: 'Free for serving members at a DANTES site — and refused outright by some campuses' },
  { kind: 'ap', title: 'AP exams', blurb: 'Scores you already hold from high school' },
  { kind: 'ib', title: 'IB exams', blurb: 'Higher Level only, score 5 or better — Standard Level is not modelled' },
  {
    kind: 'a_level',
    title: 'A Levels (Cambridge · AICE)',
    blurb: 'Grade A–C. Accepted by UC by name; Florida calls the same exams AICE',
  },
  {
    kind: 'dlpt',
    title: 'DLPT language ratings',
    blurb: 'Defense Language Institute — free, and only if you serve',
  },
  {
    kind: 'uexcel',
    title: 'UExcel (retired 2022)',
    blurb: 'Nobody can sit one any more. Tick it only if you already hold the score',
  },
  { kind: 'cc_course', title: 'Community college courses', blurb: 'Courses you have already passed' },
  {
    kind: 'alt_provider',
    title: 'Third-party course providers',
    blurb: 'Sophia, Study.com, Saylor and the rest — cheapest credit there is, and the ' +
      'easiest to waste',
  },
];

/** A dead or unopenable source URL must never take the screen down with it. */
const openSource = (url: string): void => {
  void Linking.openURL(url).catch(() => undefined);
};

/**
 * The residency sentence, written to match how far the figure behind it is
 * actually backed.
 *
 * The minimum and the campus's exam policy are separate claims from separate
 * sources, and the minimum is the unconfirmed one. Stating it flat and hanging a
 * "needs confirming" badge underneath reads as a footnote on a fact, so when
 * nobody has checked the number the sentence itself says so.
 */
function residencySentence(inst: Institution, unitsInResidence: number): string {
  // A zero minimum is missing data, not a school with no residency rule.
  if (inst.residency_min_units <= 0) {
    return (
      `We have no residency minimum on file for ${inst.name}. Assume there is one and confirm ` +
      `it before you plan around transferred credit.`
    );
  }

  const shortBy = Math.max(0, inst.residency_min_units - unitsInResidence);

  if (!isBacked(inst.residency_provenance)) {
    return (
      `We have ${inst.residency_min_units} units on file as the minimum ${inst.name} makes you ` +
      `earn on campus, and nobody has confirmed that against the campus itself. ` +
      (shortBy > 0
        ? `If it holds you are ${shortBy} short, and transferring in more credit does not reduce it.`
        : 'If it holds, you have met it.')
    );
  }

  return (
    `${inst.name} requires ${inst.residency_min_units} units earned on campus to graduate.` +
    (shortBy > 0
      ? ` You are ${shortBy} short — transferring in more credit does not reduce this.`
      : ' You have met that minimum.')
  );
}

/**
 * Provenance, never decoration: the badge states how far we trust the claim it
 * sits next to, and opens the source that backs it. Anything short of a
 * confirmed source is drawn dashed and dim so it cannot be mistaken for fact,
 * and a row with no usable URL stays flat rather than pretending to be a link.
 */
function SourceBadge({ p, compact }: { p: Provenance; compact?: boolean }): ReactElement {
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
      accessibilityLabel={`${label}, last checked ${checkedOn(p)}. Open source.`}
      style={({ pressed }) => [
        styles.badge,
        { borderColor: color },
        shaky && styles.badgeShaky,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.badgeText, { color }]} numberOfLines={1}>
        {label}
        {compact === true ? '' : ` · ${checkedOn(p)}`} ↗
      </Text>
    </Pressable>
  );
}

function InstitutionCard(
  { inst, systemLabel, selected, onPress }: {
    inst: Institution;
    /** The system's short name. Never `inst.system`, which is a dataset key. */
    systemLabel: string;
    selected: boolean;
    onPress: () => void;
  },
): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      // Screen readers report a radio through `checked`; `selected` alone is silent.
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={`${inst.name}, ${systemLabel}`}
      style={({ pressed }) => [
        styles.instCard,
        selected && styles.instCardOn,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowTop}>
        <Text style={[styles.instName, selected && styles.instNameOn]} numberOfLines={3}>
          {inst.name}
        </Text>
        {/* Neutral chip on purpose — the palette's colours mean confidence, and
            confidence colours never double as decoration. */}
        <View style={styles.chip}>
          <Text style={styles.chipText}>{systemLabel}</Text>
        </View>
      </View>
      <View style={styles.rowBottom}>
        <Text style={[styles.instFact, inst.refuses.includes('clep') && styles.instFactCold]}>
          {inst.refuses.includes('clep') ? 'No CLEP credit' : 'Accepts CLEP'}
        </Text>
        {/* The fact beside it is this campus's exam policy, so the badge is the
            exam-policy row — not the campus's other, unconfirmed figures. */}
        <SourceBadge p={inst.exam_policy_provenance} compact />
      </View>
    </Pressable>
  );
}

/**
 * "ACE recommended" is the most misread phrase in this whole category.
 *
 * ACE and NCCRS review a course and RECOMMEND credit. Neither is an accreditor;
 * neither can make any college award anything. A student who reads the phrase
 * as "counts everywhere" buys a subscription against a promise nobody made, so
 * the recommendation is printed next to the price — where the decision is — and
 * worded as a recommendation rather than as a status.
 */
/**
 * Said on the row, not in the group header.
 *
 * A student scanning for something cheap will read a price before a heading,
 * and "$0" on a retired exam is an invitation to go and look for it. The reason
 * it cannot be bought has to travel with the price.
 */
const AVAILABILITY_LABEL: Record<Exclude<CreditAvailability, 'open'>, string> = {
  retired: 'Retired — no longer offered. Existing scores still transfer.',
  restricted: 'Not open to the public — you must be eligible to sit it.',
};

const RECOGNITION_LABEL: Record<CreditRecognition, string> = {
  ace: 'ACE recommends credit',
  nccrs: 'NCCRS recommends credit',
  ace_and_nccrs: 'ACE and NCCRS both recommend credit',
};

function CreditRow(
  { src, held, strandedAt, onToggle }:
  { src: CreditSource; held: boolean; strandedAt: string | null; onToggle: () => void },
): ReactElement {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: held }}
      accessibilityLabel={src.name}
      style={({ pressed }) => [styles.creditRow, held && styles.creditRowOn, pressed && styles.pressed]}
    >
      <View style={[styles.box, held && styles.boxOn]}>
        {held && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={styles.creditBody}>
        <Text style={[styles.creditName, strandedAt !== null && styles.creditNameDead]}>
          {src.name}
        </Text>
        <View style={styles.creditMeta}>
          {/* A $0 row is a real case (a waived fee), and "free" is the truth there. */}
          <Text style={styles.creditCost}>
            {src.cost_usd > 0 ? money(src.cost_usd) : 'no fee on file'}
          </Text>
          <SourceBadge p={src.provenance} compact />
        </View>
        {src.availability !== undefined && src.availability !== 'open' && (
          <Text style={styles.unavailable}>{AVAILABILITY_LABEL[src.availability]}</Text>
        )}
        {src.recognition !== undefined && (
          <Text style={styles.recognition}>
            {RECOGNITION_LABEL[src.recognition]} — a recommendation, not a guarantee.
            {src.transcript_provider !== undefined && src.transcript_provider !== '' &&
              ` Credit arrives on: ${src.transcript_provider}.`}
          </Text>
        )}
        {strandedAt !== null && (
          <Text style={styles.deadTag}>Worth nothing at {strandedAt}</Text>
        )}
      </View>
    </Pressable>
  );
}

/**
 * The quiet failure, and the reason it gets a block of its own.
 *
 * This campus DOES award credit for the CLEP the student holds — it counts toward
 * the degree — and it still clears no general-education requirement. Nothing looks wrong:
 * the exams are accepted, the rows above read normally, and the student has
 * satisfied nothing. Stranded credit is money already spent, so this sits a step
 * below it: amber rather than danger red, no headline figure, no bar that follows
 * the student down the page. Deliberately styled, though — never left to fall
 * through to the plain body treatment, because a warning nobody would think to go
 * looking for cannot be drawn as an aside.
 *
 * The wording is the engine's own `credit_not_toward_ge` sentence, split in two so
 * the exams can be named. The claim rests on the campus's published exam policy
 * and carries that row's badge, nothing else.
 */
function NotTowardGeNotice(
  { inst, exams }: { inst: Institution; exams: CreditSource[] },
): ReactElement {
  const shaky = !isBacked(inst.exam_policy_provenance);
  const note = noteText(inst.exam_policy_provenance);
  const one = exams.length === 1;

  return (
    <View style={[styles.noGe, shaky && styles.noGeShaky]} accessibilityRole="alert">
      <Text style={styles.noGeKicker}>⚠  CREDIT YOU HOLD · CLEARS NO REQUIREMENT</Text>
      <Text style={styles.noGeHead}>
        {inst.name} counts {one ? 'this exam' : `these ${exams.length} exams`} toward your degree,
        but {one ? 'it does' : 'they do'} not clear any general-education requirement.
      </Text>
      {exams.map(s => (
        <Text key={s.id} style={styles.noGeItem} numberOfLines={3}>
          ·  {s.name} — no general-education area
        </Text>
      ))}
      <Text style={styles.noGeBody}>
        You still have to satisfy {one ? 'that requirement' : 'those requirements'} another way.
      </Text>
      {note !== null && <Text style={styles.noGeNote}>{note}</Text>}
      {shaky && (
        <Text style={styles.noGeNote}>
          We have not confirmed this against {inst.name}&apos;s own page. Check it with the campus
          before you plan around {one ? 'this exam' : 'these exams'}.
        </Text>
      )}
      <SourceBadge p={inst.exam_policy_provenance} />
    </View>
  );
}

/**
 * The state row.
 *
 * It sits above the campus picker and not inside it because the state is the
 * more valuable answer in most of the country: a statewide guarantee is worth
 * more than any one campus's exam table, and it is true before the student has
 * chosen a university. A state we hold no guarantee for says so in the same
 * place, rather than printing nothing and leaving the silence to be read as
 * "there is nothing to know".
 */
function StateChip(
  { label, on, onPress, wide }: {
    label: string; on: boolean; onPress: () => void; wide?: boolean;
  },
): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
      style={[styles.stateChip, wide === true && styles.stateChipNarrow, on && styles.stateChipOn]}
    >
      <Text style={[styles.stateChipText, on && styles.stateChipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function StateRow(
  { states, unmapped, selected, onSelect }: {
    states: Jurisdiction[];
    unmapped: Jurisdiction[];
    selected: StateCode;
    onSelect: (code: StateCode) => void;
  },
): ReactElement {
  const all = [...states, ...unmapped];
  const chosen = all.find(j => j.code === selected);
  const chosenIsUnmapped = unmapped.some(j => j.code === selected);
  // Opens itself when the student is already standing in an unmapped state, so
  // a restored plan does not hide the row that explains what they are looking at.
  const [showAll, setShowAll] = useState<boolean>(chosenIsUnmapped);

  return (
    <View>
      <View style={styles.stateRow}>
        {states.map(j => (
          <StateChip
            key={j.code}
            label={j.name}
            on={j.code === selected}
            onPress={() => onSelect(j.code)}
          />
        ))}
        <StateChip
          label={showAll ? 'Fewer states' : 'Another state'}
          on={chosenIsUnmapped}
          onPress={() => setShowAll(v => !v)}
        />
      </View>

      {showAll && (
        <View style={styles.stateGrid}>
          {unmapped.map(j => (
            <StateChip
              key={j.code}
              label={j.code}
              wide
              on={j.code === selected}
              onPress={() => onSelect(j.code)}
            />
          ))}
        </View>
      )}

      {chosen !== undefined && chosen.transfer_guarantee !== null && (
        <View
          style={[
            styles.guarantee,
            // "We checked and there is no statewide rule" is a finding a student
            // can act on, and it is not good news. Printing it under a green
            // rule headed THE STATEWIDE RULE would be the app contradicting
            // itself in two lines.
            chosen.statewide_framework === 'none' && styles.guaranteeNone,
          ]}
        >
          <Text style={styles.guaranteeKicker}>
            {chosen.statewide_framework === 'none'
              ? 'NO STATEWIDE RULE — WE LOOKED'
              : 'THE STATEWIDE RULE'}
          </Text>
          <Text style={styles.guaranteeText}>{chosen.transfer_guarantee}</Text>
          <SourceBadge p={chosen.transfer_provenance} />
        </View>
      )}

      {/* Not an error state, and — since the statewide layer landed — usually
          not an empty one either. Most states now get their actual transfer
          rule above; what is missing is campus pricing, and saying "we have not
          mapped Ohio" directly under a paragraph about Ohio Transfer 36 would
          be the app contradicting itself. */}
      {chosen !== undefined && chosenIsUnmapped && (
        <View style={styles.notMapped}>
          <Text style={styles.notMappedKicker}>
            {chosen.transfer_guarantee !== null
              ? `NO CAMPUS PRICING FOR ${chosen.name.toUpperCase()} YET`
              : `WE HAVE NOT MAPPED ${chosen.name.toUpperCase()}`}
          </Text>
          <Text style={styles.notMappedText}>
            {chosen.transfer_guarantee !== null
              ? `The rule above applies to every public campus in ${chosen.name}. What we do ` +
                `not hold yet is the campuses themselves and the requirement list behind them, ` +
                `so we cannot price a plan here without making the numbers up.`
              : `We hold no campuses or requirements for ${chosen.name}, so there is nothing ` +
                `here we could price for you without making it up.`}
          </Text>
          <Text style={styles.notMappedText}>
            {chosen.transfer_guarantee !== null
              ? 'Two things are true anyway, wherever you are: AP and CLEP exams are national, ' +
                'and Modern States can cover a CLEP exam fee outright.'
              : 'Two things are true anyway, wherever you are: AP and CLEP exams are national, ' +
                'and Modern States can cover a CLEP exam fee outright. Your state very likely ' +
                'has a transferable general-education core as well — we have not confirmed ' +
                'which, so we will not describe it.'}
          </Text>
          <SourceBadge p={chosen.transfer_provenance} />
          {hasContact() && (
            <Pressable
              onPress={() => openSource(waitlistMailto(chosen))}
              accessibilityRole="button"
              accessibilityLabel={`Ask us to map ${chosen.name}`}
              style={({ pressed }) => [styles.waitlist, pressed && styles.pressed]}
            >
              <Text style={styles.waitlistText}>Tell me when {chosen.name} is ready  ›</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * What actually decides whether third-party credit is worth anything.
 *
 * It is not the course and it is not the price. It is whose transcript the
 * credit lands on, and whether the receiving college accepts that company's
 * paperwork — a question most students never think to ask, because every
 * provider's marketing answers a different one.
 *
 * The accreditation half is stated carefully. The federal government stopped
 * classifying accreditors as "regional" or "national" in July 2020; the
 * categories a student will still be told about do not formally exist. What
 * still exists is the behaviour: institutions discriminate between accreditors
 * when deciding what to accept, and that behaviour is what costs money.
 * Repeating the old labels as though they were current would be wrong, and
 * pretending the distinction stopped mattering would be worse.
 */
function ThirdPartyNotice({ inst }: { inst: Institution | null }): ReactElement {
  return (
    <View style={styles.thirdParty}>
      <Text style={styles.thirdPartyTitle}>Before you buy a subscription</Text>
      <Text style={styles.thirdPartyText}>
        These are the cheapest credits in this app, and the easiest to waste. The credit is
        posted to the provider's own transcript, so your college is not asking "was that
        course any good?" — it is asking "do we accept this company's paperwork?". Those are
        different questions with different answers.
      </Text>
      <Text style={styles.thirdPartyText}>
        {inst !== null && inst.refuses.includes('alt_provider')
          ? `${inst.name} answers no, in writing. Nothing in this section will count there.`
          : inst !== null
            ? `We have no published policy on file for ${inst.name} either way. Ask the ` +
              'registrar, in writing, before you pay for anything here.'
            : 'Pick your campus above and we will tell you what we know about it.'}
      </Text>
      <Text style={styles.thirdPartyText}>
        You will also see schools sorted into "regionally" and "nationally" accredited. The
        US Department of Education stopped making that distinction in July 2020 and the
        formal categories no longer exist — but plenty of institutions still behave as though
        they do when deciding what to accept. Ask about the specific provider by name rather
        than about accreditation in the abstract.
      </Text>
    </View>
  );
}

export function InputScreen(
  {
    states, unmappedStates, selectedState, onSelectState, systems,
    institutions, creditSources, value, onChange, onSubmit, onBack,
  }: InputScreenProps,
): ReactElement {
  // Local text state so the field can sit empty mid-edit instead of snapping to 0.
  const [unitsText, setUnitsText] = useState<string>(
    value.units_in_residence > 0 ? String(value.units_in_residence) : '',
  );
  // …but the prop is the source of truth. If the parent resets or restores the
  // input, re-seed the field instead of editing on top of a stale number.
  const [lastUnitsProp, setLastUnitsProp] = useState<number>(value.units_in_residence);
  if (value.units_in_residence !== lastUnitsProp) {
    setLastUnitsProp(value.units_in_residence);
    if ((unitsText === '' ? 0 : Number(unitsText)) !== value.units_in_residence) {
      setUnitsText(value.units_in_residence > 0 ? String(value.units_in_residence) : '');
    }
  }

  const target = institutions.find(i => i.id === value.target_institution_id);

  // System ids are dataset keys — `FL-SUS` is not something to show a student.
  const systemLabel = (inst: Institution): string =>
    systems.find(sy => sy.id === inst.system)?.short_name ?? inst.system;

  // 32 campuses is more than anyone wants to scroll past to reach the one they
  // already have in mind. The chosen campus always stays visible, so a search
  // typed after choosing cannot make the selection look lost.
  const [campusQuery, setCampusQuery] = useState<string>('');
  const q = campusQuery.trim().toLowerCase();
  const visibleInstitutions = q === ''
    ? institutions
    : institutions.filter(i =>
        i.id === value.target_institution_id ||
        i.name.toLowerCase().includes(q) ||
        systemLabel(i).toLowerCase().includes(q));

  const patch = (next: Partial<StudentInput>): void => onChange({ ...value, ...next });

  const toggleCredit = (id: string): void => {
    patch({
      held_credit_ids: value.held_credit_ids.includes(id)
        ? value.held_credit_ids.filter(x => x !== id)
        : [...value.held_credit_ids, id],
    });
  };

  const setUnits = (text: string): void => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 3);
    setUnitsText(digits);
    const parsed = digits === '' ? 0 : Number(digits);
    setLastUnitsProp(parsed); // our own edit, not a parent reset — do not re-seed on it
    patch({ units_in_residence: parsed });
  };

  // No local mirror and no validation: the field is driven straight from the prop,
  // and an empty box means "no name" rather than an empty name on the packet. Only
  // a genuinely empty box clears it, so a space typed mid-name is not swallowed.
  const setName = (text: string): void => {
    patch({ student_name: text === '' ? undefined : text });
  };

  // The whole product in one variable: credit the student already paid for that
  // this campus will not look at.
  const stranded: CreditSource[] =
    target !== undefined && target.refuses.includes('clep')
      ? creditSources.filter(s => s.kind === 'clep' && value.held_credit_ids.includes(s.id))
      : [];
  const strandedUsd = stranded.reduce((n, s) => n + s.cost_usd, 0);

  // The other half of the same policy, and the half nothing on screen betrays:
  // this campus DOES award credit for the CLEP the student holds, and that credit
  // still clears no general-education requirement — the engine's `credit_not_toward_ge`.
  // Exactly one of these two lists can be non-empty: stranded needs a published
  // CLEP refusal, this needs the absence of one.
  const notTowardGe: CreditSource[] =
    target !== undefined && !target.refuses.includes('clep')
      ? creditSources.filter(s => s.kind === 'clep' && value.held_credit_ids.includes(s.id))
      : [];

  // Both CLEP claims rest on the campus's exam policy and on nothing else. The
  // residency minimum and the transfer cap are separate rows at their own
  // confidence, and may not borrow this badge.
  const strandedClaimShaky =
    target !== undefined && !isBacked(target.exam_policy_provenance);
  // What could bite the student, if the exam-policy row carries such a note.
  const examPolicyNote =
    target === undefined ? null : noteText(target.exam_policy_provenance);

  // With a waived or unknown fee the dollar total is $0 — shouting "$0" would read
  // as "nothing lost". Count the exams instead; the units are the loss either way.
  const strandedHeadline =
    strandedUsd > 0
      ? money(strandedUsd)
      : stranded.length === 1
        ? '1 exam'
        : `${stranded.length} exams`;
  const strandedNoun = stranded.length === 1 ? 'this exam' : `these ${stranded.length} exams`;

  // The residency figure is a claim of its own, and an unconfirmed one: the block
  // that states it has to look unconfirmed rather than leaning on a badge to
  // qualify a flat sentence.
  //
  // Two ways that figure can fail to be solid, and a confirmed source only
  // settles the first: the row may be unconfirmed, or we may hold no figure at
  // all. A published residency source does not turn a missing minimum into a
  // fact, so a zero reads as unconfirmed here whatever the row behind it says.
  const residencyMissing = target !== undefined && target.residency_min_units <= 0;
  const residencyShaky =
    target !== undefined && (residencyMissing || !isBacked(target.residency_provenance));
  // Confidence colour carries meaning, so it is picked from what we actually
  // have: with no figure on file the block is precisely "needs confirming",
  // whatever confidence the row claims.
  const residencyRuleColor =
    target === undefined
      ? theme.color.border
      : residencyMissing
        ? theme.color.needsCheck
        : confidenceColor(target.residency_provenance.confidence);

  const groups = CREDIT_GROUPS
    .map(g => ({ kind: g.kind, title: g.title, blurb: g.blurb, rows: creditSources.filter(s => s.kind === g.kind) }))
    .filter(g => g.rows.length > 0);

  // The stranded-credit alert sits next to the campus that causes it, but the
  // taps that trigger it happen further down the page. A warning the student has
  // already scrolled past is fine print, so a pinned bar follows them until they
  // have actually looked at it.
  const scrollRef = useRef<ScrollView | null>(null);
  const scrollTop = useRef<number>(0);
  const viewportH = useRef<number>(0);
  const alertBox = useRef<{ y: number; h: number } | null>(null);
  const [alertOnScreen, setAlertOnScreen] = useState<boolean>(false);

  const recomputeAlertVisibility = (): void => {
    const box = alertBox.current;
    const view = viewportH.current;
    const top = scrollTop.current;
    // "Seen" means a usable slice of the card is on screen, not one stray pixel.
    const seen =
      box !== null &&
      view > 0 &&
      box.y + Math.min(box.h, 72) < top + view &&
      box.y + box.h > top;
    setAlertOnScreen(prev => (prev === seen ? prev : seen));
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    scrollTop.current = e.nativeEvent.contentOffset.y;
    viewportH.current = e.nativeEvent.layoutMeasurement.height;
    recomputeAlertVisibility();
  };

  const onScrollLayout = (e: LayoutChangeEvent): void => {
    viewportH.current = e.nativeEvent.layout.height;
    recomputeAlertVisibility();
  };

  const onAlertLayout = (e: LayoutChangeEvent): void => {
    const { y, height } = e.nativeEvent.layout;
    alertBox.current = { y, h: height };
    recomputeAlertVisibility();
  };

  const scrollToAlert = (): void => {
    const box = alertBox.current;
    if (box === null) return;
    scrollRef.current?.scrollTo({ y: Math.max(0, box.y - theme.space.md), animated: true });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        // The optional name field is the last interactive element on the page, so
        // the soft keyboard opens straight over it. iOS insets the scroll view for
        // the keyboard only when asked; on Android the window resizes and the
        // scroll view shrinks with it. Dragging dismisses the keyboard either way.
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onLayout={onScrollLayout}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.backRow}
        >
          {/* The onboarding answers change how everything below is priced — a
              student who mis-tapped their fee-waiver status needs a way back to
              it that does not involve reloading the app. */}
          <Text style={styles.backText}>‹ Your answers</Text>
        </Pressable>
        <Text style={styles.kicker}>DEGREE ROUTE PLANNER</Text>
        {/* What this app actually prices is the requirements the student still has
            to clear, at the target campus's own per-unit rate — never a whole
            degree. The hook has to promise exactly that much, or the next screen's
            baseline line reads as a walk-back of the first thing we said. */}
        <Text style={styles.title}>What is the credit you still need going to cost you?</Text>
        <Text style={styles.sub}>Three taps. No account, no transcript upload.</Text>

        {/* 1 — target */}
        <Text style={styles.qNum}>1</Text>
        <Text style={styles.qText}>Where are you trying to graduate from?</Text>
        <StateRow
          states={states}
          unmapped={unmappedStates}
          selected={selectedState}
          onSelect={onSelectState}
        />
        {institutions.length > 0 && (
          <Text style={styles.qHintText}>
            {institutions.length} public campus{institutions.length === 1 ? '' : 'es'}. Type to
            narrow the list.
          </Text>
        )}
        {institutions.length > 0 && (
          <TextInput
            style={styles.search}
            value={campusQuery}
            onChangeText={setCampusQuery}
            placeholder="Search campuses"
            placeholderTextColor={theme.color.textMuted}
            accessibilityLabel="Search campuses by name"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        )}
        {institutions.length === 0 ? (
          // Silent when the state is simply unmapped — StateRow has already
          // said so, far better than a second paragraph could. This line is
          // for the case it was written for: the dataset failed to load.
          null
        ) : (
          <View style={styles.instGrid} accessibilityRole="radiogroup">
            {visibleInstitutions.length === 0 && (
              <Text style={styles.empty}>
                No campus matches “{campusQuery.trim()}”. Clear the search to see all
                {' '}{institutions.length}.
              </Text>
            )}
            {visibleInstitutions.map(inst => (
              <InstitutionCard
                key={inst.id}
                inst={inst}
                systemLabel={systemLabel(inst)}
                selected={inst.id === value.target_institution_id}
                onPress={() => patch({ target_institution_id: inst.id })}
              />
            ))}
          </View>
        )}

        {/* The single most valuable sentence the app says. It is drawn dashed
            while the underlying policy row is unverified — loud, but honest. */}
        {target !== undefined && stranded.length > 0 && (
          <View
            style={[styles.alert, strandedClaimShaky && styles.alertShaky]}
            accessibilityRole="alert"
            onLayout={onAlertLayout}
          >
            <Text style={styles.alertKicker}>⚠  CREDIT YOU ALREADY HOLD</Text>
            <Text style={styles.alertMoney} numberOfLines={1} adjustsFontSizeToFit>
              {strandedHeadline}
            </Text>
            <Text style={styles.alertHead}>
              stranded. {target.name} awards no credit for {strandedNoun}.
            </Text>
            {stranded.map(s => (
              <Text key={s.id} style={styles.alertItem} numberOfLines={3}>
                ✗  {s.name} —{' '}
                {s.cost_usd > 0 ? `${money(s.cost_usd)} spent, 0 units here` : '0 units here'}
              </Text>
            ))}
            {examPolicyNote !== null && <Text style={styles.alertNote}>{examPolicyNote}</Text>}
            {strandedClaimShaky && (
              <Text style={styles.alertNote}>
                We have not confirmed this against {target.name}&apos;s own page. Check it with the
                campus before you pay for another exam — or before you write these off.
              </Text>
            )}
            {/* This card claims one thing — that the campus awards no credit for
                these exams — so it carries the row that backs that one claim. */}
            <SourceBadge p={target.exam_policy_provenance} />
          </View>
        )}

        {/* Questions 2 and 3 exist to be answered ABOUT a campus, so in a state
            we have not mapped there is nothing to ask. Rendering them anyway
            produced "No credit sources are loaded, so there is nothing to tick
            here yet" — an apology for a bug, printed to a student whose only
            mistake was living in Ohio. */}
        {institutions.length > 0 && (
        <>
        {/* 2 — what they hold */}
        <Text style={styles.qNum}>2</Text>
        <Text style={styles.qText}>What credit do you already have?</Text>
        <Text style={styles.qHint}>Tap everything you have passed. Skip anything you are unsure of.</Text>
        {groups.length === 0 ? (
          <Text style={styles.empty}>
            No credit sources are loaded, so there is nothing to tick here yet.
          </Text>
        ) : (
          groups.map(group => (
            <View key={group.kind} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupBlurb}>{group.blurb}</Text>
              {group.rows.map(src => (
                <CreditRow
                  key={src.id}
                  src={src}
                  held={value.held_credit_ids.includes(src.id)}
                  strandedAt={
                    target !== undefined && target.refuses.includes(src.kind)
                      ? target.name
                      : null
                  }
                  onToggle={() => toggleCredit(src.id)}
                />
              ))}
              {/* Sits with the exams it is about: the student ticks a CLEP row
                  here, so the consequence has to appear here rather than back up
                  beside question 1, where they would never see it arrive. */}
              {group.kind === 'clep' && target !== undefined && notTowardGe.length > 0 && (
                <NotTowardGeNotice inst={target} exams={notTowardGe} />
              )}
              {group.kind === 'alt_provider' && <ThirdPartyNotice inst={target ?? null} />}
            </View>
          ))
        )}

        {/* 3 — residency */}
        <Text style={styles.qNum}>3</Text>
        <Text style={styles.qText}>
          {target === undefined
            ? 'How many units have you already earned at your target school?'
            : `How many units have you already earned at ${target.name}?`}
        </Text>
        <View style={styles.unitsRow}>
          <TextInput
            value={unitsText}
            onChangeText={setUnits}
            inputMode="numeric"
            keyboardType="number-pad"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={theme.color.textMuted}
            selectTextOnFocus
            style={styles.unitsInput}
            accessibilityLabel="Units already earned at your target school"
          />
          <Text style={styles.unitsUnit}>units</Text>
        </View>
        {target !== undefined && (
          <View
            style={[
              styles.residency,
              // Unverified data has to look unverified. A confirmed minimum keeps
              // the quiet grey rule; anything less — an unconfirmed row, or no
              // figure at all — is ruled dashed in the colour of how far it
              // actually goes, so the block cannot be read as settled.
              residencyShaky && styles.residencyShaky,
              residencyShaky && { borderLeftColor: residencyRuleColor },
            ]}
          >
            <Text style={styles.residencyText}>
              {residencySentence(target, value.units_in_residence)}
            </Text>
            {/* The residency row, never the exam policy: this block states the
                minimum and nothing else, and the exam-policy source does not
                cover it. */}
            <SourceBadge p={target.residency_provenance} />
          </View>
        )}
        </>
        )}

        {/* Deliberately not a fourth question: it changes nothing the app works
            out, and a name box that looks required is a name box that stops
            people. No numeral, no card, no validation — just an underline. */}
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>Your name — optional</Text>
          <TextInput
            value={value.student_name ?? ''}
            onChangeText={setName}
            placeholder="Leave blank to sign it by hand"
            placeholderTextColor={theme.color.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="name"
            textContentType="name"
            returnKeyType="done"
            maxLength={60}
            style={styles.nameInput}
            accessibilityLabel="Your name, optional. Printed on the advisor packet."
            accessibilityHint="You can leave this empty. It does not affect your plan."
          />
          <Text style={styles.nameHint}>
            Only used to print your name on the advisor packet, so an advisor reading it knows
            whose plan it is. It never leaves this phone unless you share the packet yourself.
          </Text>
        </View>

        {/* The next screen does carry confidence on every figure, but not always as
            a badge: some of it lands as a caveat line or an unconfirmed, dimmed
            skin on the card. Promising a badge on each one is a promise the screen
            does not keep, and an honesty screen cannot afford a false detail. */}
        <Text style={styles.closer}>
          Nothing here is a promise. Every figure on the next screen is shown with how far we
          trust the rows it rests on, and anything nobody has checked against a source says so.
        </Text>
      </ScrollView>

      {/* Follows the student down the page until they have actually seen the card. */}
      {target !== undefined && stranded.length > 0 && !alertOnScreen && (
        <View style={styles.stickyWrap}>
          <Pressable
            onPress={scrollToAlert}
            accessibilityRole="button"
            accessibilityLabel={`${strandedHeadline} stranded at ${target.name}: credit you already hold that earns nothing there. Show me why.`}
            style={({ pressed }) => [
              styles.stickyAlert,
              strandedClaimShaky && styles.alertShaky,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.stickyMoney} numberOfLines={1} adjustsFontSizeToFit>
              {strandedHeadline}
            </Text>
            <Text style={styles.stickyText} numberOfLines={3}>
              stranded at {target.name}. Tap to see which{' '}
              {stranded.length === 1 ? 'exam' : 'exams'}.
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Pressable
          onPress={onSubmit}
          disabled={target === undefined}
          accessibilityRole="button"
          accessibilityState={{ disabled: target === undefined }}
          style={({ pressed }) => [
            styles.cta,
            target === undefined && styles.ctaOff,
            pressed && target !== undefined && styles.pressed,
          ]}
        >
          <Text style={[styles.ctaText, target === undefined && styles.ctaTextOff]} numberOfLines={2}>
            {/* "Pick a school to start" is unanswerable in a state with no
                schools in it, and reads as the student's fault. Name the actual
                next move instead. */}
            {target !== undefined
              ? `Price my route to ${target.name}`
              : institutions.length === 0
                ? 'Pick a state we have mapped'
                : 'Pick a school to start'}
          </Text>
        </Pressable>
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
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.xl,
  },

  qHintText: {
    ...theme.font.small, color: theme.color.textMuted,
    marginTop: theme.space.xs, marginBottom: theme.space.sm,
  },
  search: {
    ...theme.font.body, color: theme.color.text,
    borderWidth: 1, borderColor: theme.color.border, borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.md, paddingVertical: theme.space.sm,
    marginBottom: theme.space.sm,
  },
  backRow: { paddingVertical: theme.space.xs, marginBottom: theme.space.xs },
  backText: { ...theme.font.body, color: theme.color.textMuted },
  kicker: {
    ...theme.font.small,
    color: theme.color.textMuted,
    letterSpacing: 2,
    marginBottom: theme.space.sm,
  },
  title: { ...theme.font.title, color: theme.color.text },
  sub: { ...theme.font.body, color: theme.color.textMuted, marginTop: theme.space.sm },

  qNum: {
    ...theme.font.small,
    color: theme.color.bg,
    backgroundColor: theme.color.textMuted,
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    overflow: 'hidden',
    marginTop: theme.space.xl,
  },
  qText: { ...theme.font.heading, color: theme.color.text, marginTop: theme.space.sm },
  qHint: { ...theme.font.small, color: theme.color.textMuted, marginTop: theme.space.xs },
  empty: {
    ...theme.font.small,
    color: theme.color.warn,
    marginTop: theme.space.md,
    lineHeight: 19,
  },

  instGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    marginTop: theme.space.md,
  },
  instCard: {
    flexGrow: 1,
    flexBasis: 240,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  instCardOn: { borderColor: theme.color.accent, backgroundColor: theme.color.surfaceAlt },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.sm },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  instName: { ...theme.font.heading, color: theme.color.text, flex: 1 },
  instNameOn: { color: theme.color.accent },
  instFact: { ...theme.font.small, color: theme.color.textMuted },
  instFactCold: { color: theme.color.warn },
  chip: {
    backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  },
  chipText: { ...theme.font.mono, color: theme.color.textMuted, letterSpacing: 1 },

  recognition: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2 },
  unavailable: { ...theme.font.small, color: theme.color.warn, marginTop: 2 },
  thirdParty: {
    marginTop: theme.space.sm,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surfaceAlt,
    borderLeftWidth: 3,
    borderLeftColor: theme.color.warn,
  },
  thirdPartyTitle: {
    ...theme.font.heading, color: theme.color.text, marginBottom: theme.space.xs,
  },
  thirdPartyText: {
    ...theme.font.small, color: theme.color.textMuted, marginBottom: theme.space.sm,
  },

  stateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.xs,
    marginTop: theme.space.sm,
  },
  stateChip: {
    backgroundColor: theme.color.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
  },
  // Two-letter codes in a 48-item grid: narrower, fixed width so the grid reads
  // as a grid rather than as ragged prose.
  stateChipNarrow: { paddingHorizontal: theme.space.sm, minWidth: 58, alignItems: 'center' },
  stateChipOn: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  stateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.xs,
    marginTop: theme.space.xs,
  },
  notMapped: {
    marginTop: theme.space.sm,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderLeftWidth: 3,
    // Muted, not amber: we are not warning them about a risk, we are telling
    // them the truth about our own coverage.
    borderLeftColor: theme.color.textMuted,
  },
  notMappedKicker: {
    ...theme.font.small, color: theme.color.textMuted, letterSpacing: 2,
    marginBottom: theme.space.xs,
  },
  notMappedText: {
    ...theme.font.body, color: theme.color.text, marginBottom: theme.space.sm,
  },
  waitlist: {
    marginTop: theme.space.sm,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.color.accent,
    alignSelf: 'flex-start',
  },
  waitlistText: { ...theme.font.body, color: theme.color.accent },
  stateChipText: { ...theme.font.body, color: theme.color.textMuted },
  stateChipTextOn: { color: theme.color.accent },
  guarantee: {
    marginTop: theme.space.sm,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    borderLeftWidth: 3,
    borderLeftColor: theme.color.accent,
  },
  guaranteeNone: { borderLeftColor: theme.color.textMuted },
  guaranteeKicker: {
    ...theme.font.small, color: theme.color.textMuted, letterSpacing: 2,
    marginBottom: theme.space.xs,
  },
  guaranteeText: { ...theme.font.body, color: theme.color.text, marginBottom: theme.space.sm },

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

  alert: {
    marginTop: theme.space.lg,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.danger,
    borderRadius: theme.radius.lg,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  alertShaky: { borderStyle: 'dashed' },
  alertKicker: {
    ...theme.font.small,
    color: theme.color.danger,
    fontWeight: '700',
    letterSpacing: 1,
  },
  alertMoney: { ...theme.font.display, color: theme.color.danger },
  alertHead: { ...theme.font.heading, color: theme.color.text, marginTop: -theme.space.xs },
  alertItem: { ...theme.font.body, color: theme.color.danger },
  alertNote: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  // Padding on the wrapper, not margins on the bar: a '100%' width plus a
  // horizontal margin would hang off the edge of a narrow phone.
  stickyWrap: { paddingHorizontal: theme.space.md, paddingBottom: theme.space.sm },
  stickyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.danger,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  stickyMoney: { ...theme.font.title, color: theme.color.danger, flexShrink: 0 },
  stickyText: { ...theme.font.small, color: theme.color.text, flex: 1, lineHeight: 18 },

  // A step below `alert` on every axis — amber not danger red, a 12pt radius not
  // 16, no display figure — but still a 2pt ruled card, because the whole problem
  // with this case is that nothing about it looks wrong.
  noGe: {
    marginTop: theme.space.xs,
    marginBottom: theme.space.sm,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.warn,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  noGeShaky: { borderStyle: 'dashed' },
  noGeKicker: {
    ...theme.font.small,
    color: theme.color.warn,
    fontWeight: '700',
    letterSpacing: 1,
  },
  noGeHead: { ...theme.font.heading, color: theme.color.text },
  noGeItem: { ...theme.font.body, color: theme.color.warn },
  noGeBody: { ...theme.font.body, color: theme.color.text, lineHeight: 21 },
  noGeNote: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  group: { marginTop: theme.space.md },
  groupTitle: { ...theme.font.heading, color: theme.color.text },
  groupBlurb: {
    ...theme.font.small,
    color: theme.color.textMuted,
    marginTop: 2,
    marginBottom: theme.space.sm,
  },

  creditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.md,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    marginBottom: theme.space.sm,
  },
  creditRowOn: { borderColor: theme.color.accent, backgroundColor: theme.color.surfaceAlt },
  box: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  tick: { color: theme.color.accent, fontSize: 15, fontWeight: '700' },
  creditBody: { flex: 1, gap: theme.space.xs },
  creditName: { ...theme.font.body, color: theme.color.text },
  creditNameDead: { color: theme.color.textMuted, textDecorationLine: 'line-through' },
  creditMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: theme.space.sm },
  creditCost: { ...theme.font.mono, color: theme.color.textMuted },
  deadTag: { ...theme.font.small, color: theme.color.danger, fontWeight: '600' },

  unitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    marginTop: theme.space.md,
  },
  unitsInput: {
    ...theme.font.title,
    color: theme.color.text,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    minWidth: 110,
    textAlign: 'center',
  },
  unitsUnit: { ...theme.font.body, color: theme.color.textMuted },
  residency: {
    marginTop: theme.space.sm,
    gap: theme.space.sm,
    borderLeftWidth: 2,
    borderLeftColor: theme.color.border,
    paddingLeft: theme.space.md,
  },
  // Border colour is set at the call site, from the row's own confidence.
  residencyShaky: { borderStyle: 'dashed' },
  residencyText: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  // Quieter than question 3 on every axis — muted label, no card, body type
  // rather than the big numeral face — so it reads as an aside, not a step.
  nameBlock: { marginTop: theme.space.xl, gap: theme.space.xs },
  nameLabel: { ...theme.font.small, color: theme.color.textMuted },
  nameInput: {
    ...theme.font.body,
    color: theme.color.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
    paddingVertical: theme.space.sm,
    // Touch target: the underline is subtle, so the row still has to be tappable.
    minHeight: 44,
  },
  nameHint: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 19 },

  closer: {
    ...theme.font.small,
    color: theme.color.textMuted,
    marginTop: theme.space.xl,
    lineHeight: 19,
  },

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
    paddingHorizontal: theme.space.md,
    alignItems: 'center',
  },
  ctaOff: { backgroundColor: theme.color.surfaceAlt },
  ctaText: { ...theme.font.heading, color: theme.color.bg, textAlign: 'center' },
  ctaTextOff: { color: theme.color.textMuted },

  pressed: { opacity: 0.7 },
});
