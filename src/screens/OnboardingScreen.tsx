/**
 * OnboardingScreen — the first thing a student sees, one question at a time.
 *
 * It used to be two long forms: four profile questions on one screen, then a
 * page with every exam family on it at once. Nothing on either was wrong, and a
 * seventeen-year-old looking at thirty checkboxes and a paragraph about
 * accreditation still closed the app. So: a greeting, then one question per
 * screen, most of them a single tap that moves on by itself. Families a student
 * is unlikely to have (IB, A Levels, other colleges, third-party providers) are
 * asked as a yes/no first, and the list only appears after a yes.
 *
 * What did NOT change is the rule the whole product rests on. Everything
 * factual here — a campus's exam policy, an exam's price, a residency minimum,
 * a transfer rule — is quoted from the dataset and carries its own provenance
 * badge, because a student who acts on a wrong transfer-credit claim loses real
 * money and a real semester. Each sentence carries the row that backs that
 * sentence and no other, and no figure borrows a neighbour's credibility.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  BackHandler,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  CreditAvailability,
  CreditKind,
  CreditRecognition,
  CreditSource,
  FieldOfStudy,
  Institution,
  Jurisdiction,
  Provenance,
  SchoolYear,
  StateCode,
  StudentInput,
  TransferPolicy,
  WaiverStatus,
} from '../types.ts';
import type {
  GatedKind, OnboardingNav, OnboardingScreenProps, OnboardingStep,
} from '../ui/contracts.ts';
// Shared, not local: "is this claim backed?" has to mean the same thing on every
// screen and in the packet, or one of them quietly disagrees with the rest.
import { checkedOn, isBacked, linkable, noteText } from '../ui/provenance.ts';
import { confidenceColor, confidenceLabel, money, theme } from '../ui/theme.ts';
import { PressScale, ProgressBar, Stagger, StepTransition, Wave } from '../ui/motion.tsx';
import { hasContact, waitlistMailto } from '../contact.ts';

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
  const limited = inst.refuses.includes('clep');
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      // Screen readers report a radio through `checked`; `selected` alone is silent.
      accessibilityState={{ checked: selected, selected }}
      // The screen reader keeps the specific fact the short label trades away.
      accessibilityLabel={
        `${inst.name}, ${systemLabel}. ` +
        (limited ? 'Limited options available: awards no CLEP credit.' : 'Multiple choices available.')
      }
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
        {/* Worded as the choice the student has, not as the policy behind it:
            the policy itself is one tap away on the badge, and the CLEP
            question later names it outright if they hold an exam it strands. */}
        <Text style={[styles.instFact, limited && styles.instFactCold]}>
          {limited ? 'Limited options available' : 'Multiple choices available'}
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
              ? 'One thing is true anyway, wherever you are: AP and CLEP exams are national, ' +
                'so a score you earn travels with you.'
              : 'One thing is true anyway, wherever you are: AP and CLEP exams are national, ' +
                'so a score you earn travels with you. Your state very likely has a ' +
                'transferable general-education core as well — we have not confirmed which, ' +
                'so we will not describe it.'}
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
const STANCE_LEAD: Record<string, string> = {
  published_refusal: 'has published that it awards no credit for these',
  evaluate_on_request_by_law: 'gives you a legal right to have this evaluated on request — '
    + 'ask before your first term, in writing',
  official_partner: 'has named institutions with signed provider agreements',
  system_policy_permits: 'lets its campuses grant this; each campus still decides',
  agreement_only: 'has one institution that takes it, and only from providers it has '
    + 'agreements with',
  no_record: 'has published nothing we have found either way',
};

function ThirdPartyNotice(
  { inst, jurisdiction }: { inst: Institution | null; jurisdiction: Jurisdiction | null },
): ReactElement {
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
            : 'Pick your campus first and we will tell you what we know about it.'}
      </Text>
      {jurisdiction !== null && (
        <Text style={styles.thirdPartyText}>
          {jurisdiction.name} {STANCE_LEAD[jurisdiction.third_party.kind]}.{' '}
          {jurisdiction.third_party.detail}
          {jurisdiction.third_party.kind === 'no_record'
            ? ' Nothing published is not the same as a refusal — it means nobody has said, '
              + 'and you will have to ask.'
            : ''}
        </Text>
      )}
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


/* ------------------------------------------------------------------------ */
/* The questions                                                             */
/* ------------------------------------------------------------------------ */

/**
 * Every question still changes the plan. A question the student answers must
 * visibly alter what they are shown, or it is a tax on their attention before
 * they have been given anything.
 *
 *   year    -> which pathways are still reachable (dual enrolment closes at 12)
 *   field   -> whether locked major sequences apply to them
 *   budget  -> whether a route is affordable, not merely cheap
 *   waiver  -> what the credit actually costs them; can take a route to $0
 */
const YEARS: ReadonlyArray<readonly [SchoolYear, string, string]> = [
  ['grade_9', '9th grade', 'Every route is still open to you'],
  ['grade_10', '10th grade', 'Dual enrolment is still in reach'],
  ['grade_11', '11th grade', 'The best year to start banking credit'],
  ['grade_12', '12th grade', 'AP deadlines matter now'],
  ['in_college', 'Already in college', 'We will plan around what you have'],
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

/** The order questions are asked in. Exams first: they are the cheap surprise. */
const ORDER: readonly OnboardingStep[] = [
  'welcome', 'year', 'field', 'budget', 'waiver', 'state', 'campus',
  'clep', 'ap', 'ib_q', 'ib', 'alevel_q', 'alevel', 'dsst', 'dlpt',
  'cc_q', 'cc', 'alt_q', 'alt', 'residency', 'name',
];

/** The families whose list follows a yes, and the step that asks the yes. */
const GATE_OF: Partial<Record<OnboardingStep, GatedKind>> = {
  ib_q: 'ib', alevel_q: 'a_level', cc_q: 'cc_course', alt_q: 'alt_provider',
};

const GATED_KINDS: readonly GatedKind[] = ['ib', 'a_level', 'cc_course', 'alt_provider'];

/** The family each list step shows. */
const LIST_OF: Partial<Record<OnboardingStep, CreditKind>> = {
  clep: 'clep', ap: 'ap', ib: 'ib', alevel: 'a_level', dsst: 'dsst', dlpt: 'dlpt',
  cc: 'cc_course', alt: 'alt_provider',
};

const LIST_COPY: Record<CreditKind, readonly [string, string]> = {
  clep: ['Have you passed any CLEP exams?',
    'Tap every exam you have passed. None yet? That is fine — just carry on.'],
  ap: ['Any AP exam scores?',
    'Tap each AP exam you have passed. Skip anything you are unsure of.'],
  ib: ['Which IB subjects did you take at Higher Level?',
    'Score 5 or better. Standard Level is not modelled yet, so leave those out.'],
  a_level: ['Which A Level subjects did you take?',
    'Grade A to C. Florida calls the same Cambridge exams AICE.'],
  dsst: ['Taken any DSST exams?',
    'Credit by exam, a lot like CLEP — and refused outright by some campuses.'],
  dlpt: ['Do you hold a DLPT language rating?',
    'Only if you have served — the Defense Language Institute runs these.'],
  cc_course: ['Which courses have you passed?',
    'Tap each one that matches a course on your transcript.'],
  alt_provider: ['Which provider?',
    'Pick the one your credit came from.'],
};

const GATE_COPY: Record<GatedKind, readonly [string, string]> = {
  ib: ['Are you in the IB programme?',
    'Or have you taken IB exams on their own. If yes, we will ask which subjects next.'],
  a_level: ['Did you study A Levels?',
    'Cambridge International or AICE. If yes, we will ask which subjects next.'],
  cc_course: ['Have you taken courses at another college?',
    'A community college, dual enrolment, or another university.'],
  alt_provider: ['Do you have credits from non-traditional systems?',
    'Online course providers rather than a college — Sophia, Study.com and the like.'],
};

interface StepContext {
  /** Institutions in the chosen state. Zero means the state is unmapped. */
  hasCampuses: boolean;
  hasTarget: boolean;
  gate: (k: GatedKind) => boolean | undefined;
  hasRows: (k: CreditKind) => boolean;
}

/**
 * Which questions this student will be asked, in order. Pure, so a tap can
 * work out where it leads using the answer it is about to record — a "yes" to
 * IB has to lead to the IB subjects, which are not in the list until it lands.
 */
function buildSteps(c: StepContext): OnboardingStep[] {
  const out: OnboardingStep[] = ['welcome', 'year', 'field', 'budget', 'waiver', 'state'];
  if (!c.hasCampuses) return out;
  out.push('campus');
  if (!c.hasTarget) return out;
  for (const s of ORDER.slice(ORDER.indexOf('clep'), ORDER.indexOf('residency'))) {
    const gated = GATE_OF[s];
    if (gated !== undefined) {
      if (c.hasRows(gated)) out.push(s);
      continue;
    }
    const kind = LIST_OF[s];
    if (kind === undefined || !c.hasRows(kind)) continue;
    // A family behind a yes/no is only listed after a yes.
    const gated2 = GATED_KINDS.find(g => g === kind);
    if (gated2 !== undefined && c.gate(gated2) !== true) continue;
    out.push(s);
  }
  out.push('residency', 'name');
  return out;
}

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

function Choice(
  { label, hint, selected, onPress, wide }: {
    label: string; hint?: string; selected: boolean; onPress: () => void; wide?: boolean;
  },
): ReactElement {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={hint === undefined ? label : `${label}. ${hint}`}
      style={[styles.choiceOuter, wide === true && styles.choiceWide]}
      contentStyle={[styles.choice, selected && styles.choiceOn]}
    >
      <View style={styles.choiceInner}>
        <View style={styles.choiceBody}>
          <Text style={[styles.choiceLabel, selected && styles.choiceLabelOn]} numberOfLines={2}>
            {label}
          </Text>
          {hint !== undefined && <Text style={styles.choiceHint} numberOfLines={2}>{hint}</Text>}
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </View>
    </PressScale>
  );
}

/**
 * What the chosen campus's system publishes about credit from another college,
 * sentence by sentence, each with the page it came from.
 *
 * The closing line is not boilerplate. A published rule tells a student what a
 * college has promised; it does not tell them what that college will do with
 * THEIR transcript, and the gap between the two is where a semester goes.
 */
function TransferPolicyCard(
  { policy, inst }: { policy: TransferPolicy | null; inst: Institution },
): ReactElement {
  return (
    <View style={styles.policy}>
      <Text style={styles.policyKicker}>HOW {inst.name.toUpperCase()} TREATS CREDIT FROM OTHER COLLEGES</Text>
      {policy === null || policy.points.length === 0 ? (
        <Text style={styles.policyText}>
          We have not read {inst.name}&apos;s transfer policy yet, so we will not guess at it.
        </Text>
      ) : (
        policy.points.map((pt, i) => (
          <View key={i} style={styles.policyPoint}>
            <Text style={styles.policyText}>{pt.text}</Text>
            <SourceBadge p={pt.provenance} />
          </View>
        ))
      )}
      <View style={styles.policyFinal}>
        <Text style={styles.policyFinalText}>
          The final decision on your credit is made by {inst.name} when it evaluates your
          transcript — not by this app. Use this to know what to ask, then ask.
        </Text>
      </View>
    </View>
  );
}

/**
 * The single most valuable sentence the app says: credit the student already
 * paid for that this campus will not look at. Drawn dashed while the policy row
 * behind it is unverified — loud, but honest.
 */
function StrandedAlert(
  { inst, stranded }: { inst: Institution; stranded: CreditSource[] },
): ReactElement {
  const usd = stranded.reduce((n, s) => n + s.cost_usd, 0);
  // With a waived or unknown fee the dollar total is $0 — shouting "$0" would
  // read as "nothing lost". Count the exams instead.
  const headline = usd > 0 ? money(usd) : stranded.length === 1 ? '1 exam' : `${stranded.length} exams`;
  const noun = stranded.length === 1 ? 'this exam' : `these ${stranded.length} exams`;
  const shaky = !isBacked(inst.exam_policy_provenance);
  const note = noteText(inst.exam_policy_provenance);
  return (
    <View style={[styles.alert, shaky && styles.alertShaky]} accessibilityRole="alert">
      <Text style={styles.alertKicker}>⚠  CREDIT YOU ALREADY HOLD</Text>
      <Text style={styles.alertMoney} numberOfLines={1} adjustsFontSizeToFit>{headline}</Text>
      <Text style={styles.alertHead}>stranded. {inst.name} awards no credit for {noun}.</Text>
      {stranded.map(s => (
        <Text key={s.id} style={styles.alertItem} numberOfLines={3}>
          ✗  {s.name} — {s.cost_usd > 0 ? `${money(s.cost_usd)} spent, 0 units here` : '0 units here'}
        </Text>
      ))}
      {note !== null && <Text style={styles.alertNote}>{note}</Text>}
      {shaky && (
        <Text style={styles.alertNote}>
          We have not confirmed this against {inst.name}&apos;s own page. Check it with the campus
          before you pay for another exam — or before you write these off.
        </Text>
      )}
      <SourceBadge p={inst.exam_policy_provenance} />
    </View>
  );
}

/* ------------------------------------------------------------------------ */
/* The screen                                                                */
/* ------------------------------------------------------------------------ */

/** Long enough to see the choice light up; short enough not to feel like waiting. */
const ADVANCE_MS = 260;

export function OnboardingScreen(
  {
    nav, onNav, states, unmappedStates, selectedState, onSelectState, systems,
    institutions, creditSources, freeClep, transferPolicy, value, onChange, onSubmit,
  }: OnboardingScreenProps,
): ReactElement {
  const target = institutions.find(i => i.id === value.target_institution_id);
  const jurisdiction =
    [...states, ...unmappedStates].find(j => j.code === selectedState) ?? null;

  // System ids are dataset keys — `FL-SUS` is not something to show a student.
  const systemLabel = (inst: Institution): string =>
    systems.find(sy => sy.id === inst.system)?.short_name ?? inst.system;

  /** The rows a question lists. The voucher is not credit anyone holds. */
  const rowsOf = (k: CreditKind): CreditSource[] =>
    creditSources.filter(s => s.kind === k && s.id !== freeClep?.id);

  const holdsKind = (k: CreditKind, held: readonly string[]): boolean =>
    rowsOf(k).some(s => held.includes(s.id));

  const contextFor = (v: StudentInput, gates: OnboardingNav['gates']): StepContext => ({
    hasCampuses: institutions.length > 0,
    hasTarget: institutions.some(i => i.id === v.target_institution_id),
    // A held subject is a yes, whether or not the question was ever answered —
    // a restored plan must not hide the subjects the student already ticked.
    gate: k => gates[k] ?? (holdsKind(k, v.held_credit_ids) ? true : undefined),
    hasRows: k => rowsOf(k).length > 0,
  });

  const steps = buildSteps(contextFor(value, nav.gates));
  // The longest path still possible: a campus chosen, and every unanswered
  // yes/no counted as a yes. The total can then only shrink as the student
  // answers — a finish line that moves away from them reads as a trick.
  const current = contextFor(value, nav.gates);
  const fullSteps = buildSteps({
    ...current,
    hasTarget: institutions.length > 0,
    gate: k => current.gate(k) !== false,
  });

  // A step that no longer applies (the state changed under it, or a restored
  // gate was lost) falls back to the last question before it that still does.
  const step: OnboardingStep = steps.includes(nav.step)
    ? nav.step
    : [...steps].reverse().find(s => ORDER.indexOf(s) <= ORDER.indexOf(nav.step)) ?? 'welcome';
  const index = steps.indexOf(step);
  const questionCount = fullSteps.length - 1; // the greeting is not a question
  const progress = questionCount <= 0 ? 0 : Math.min(1, index / questionCount);

  const [direction, setDirection] = useState<1 | -1>(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const goTo = (to: OnboardingStep, gates: OnboardingNav['gates'] = nav.gates): void => {
    if (timer.current !== null) { clearTimeout(timer.current); timer.current = null; }
    setDirection(ORDER.indexOf(to) >= ORDER.indexOf(step) ? 1 : -1);
    onNav({ step: to, gates });
  };

  /** Where "next" leads, worked out against the answers about to be recorded. */
  const nextAfter = (v: StudentInput, gates: OnboardingNav['gates']): OnboardingStep | null => {
    const list = buildSteps(contextFor(v, gates));
    const i = list.indexOf(step);
    return i >= 0 && i + 1 < list.length ? list[i + 1] ?? null : null;
  };

  const next = (): void => {
    const to = nextAfter(value, nav.gates);
    if (to !== null) goTo(to);
  };
  const back = (): void => {
    const to = index > 0 ? steps[index - 1] : undefined;
    if (to !== undefined) goTo(to);
  };

  /** Record a single-choice answer, let it light up, then move on by itself. */
  const answerAndAdvance = (v: StudentInput, gates: OnboardingNav['gates'] = nav.gates): void => {
    if (v !== value) onChange(v);
    const to = nextAfter(v, gates);
    if (gates !== nav.gates) onNav({ step, gates });
    if (to === null) return;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      setDirection(1);
      onNav({ step: to, gates });
    }, ADVANCE_MS);
  };

  // Android's hardware back walks back through the questions; at the greeting
  // it does what back always does and leaves.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (index <= 0) return false;
      back();
      return true;
    });
    return () => sub.remove();
  });

  const patch = (p: Partial<StudentInput>): StudentInput => ({ ...value, ...p });
  const setProfile = (p: Partial<StudentInput['profile']>): StudentInput =>
    patch({ profile: { ...value.profile, ...p } });

  const toggleCredit = (id: string): void => {
    onChange(patch({
      held_credit_ids: value.held_credit_ids.includes(id)
        ? value.held_credit_ids.filter(x => x !== id)
        : [...value.held_credit_ids, id],
    }));
  };

  /** A "no" clears anything already ticked in that family: the answer is the answer. */
  const answerGate = (k: GatedKind, yes: boolean): void => {
    const gates = { ...nav.gates, [k]: yes };
    const ids = new Set(rowsOf(k).map(s => s.id));
    const v = yes ? value : patch({ held_credit_ids: value.held_credit_ids.filter(x => !ids.has(x)) });
    answerAndAdvance(v, gates);
  };

  // Local text so the box can sit empty mid-edit instead of snapping to 0.
  const [unitsText, setUnitsText] = useState<string>(
    value.units_in_residence > 0 ? String(value.units_in_residence) : '',
  );
  const setUnits = (text: string): void => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 3);
    setUnitsText(digits);
    onChange(patch({ units_in_residence: digits === '' ? 0 : Number(digits) }));
  };

  // 32 campuses is more than anyone wants to scroll past to reach the one they
  // already have in mind. The chosen campus always stays visible.
  const [campusQuery, setCampusQuery] = useState<string>('');
  const q = campusQuery.trim().toLowerCase();
  const visibleInstitutions = q === ''
    ? institutions
    : institutions.filter(i =>
        i.id === value.target_institution_id ||
        i.name.toLowerCase().includes(q) ||
        systemLabel(i).toLowerCase().includes(q));

  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

  const heldIn = (k: CreditKind): number =>
    rowsOf(k).filter(s => value.held_credit_ids.includes(s.id)).length;

  // Both CLEP consequences rest on the campus's exam policy and nothing else.
  // Exactly one can apply: stranded needs a published refusal, the other needs
  // the absence of one.
  const heldClep = rowsOf('clep').filter(s => value.held_credit_ids.includes(s.id));
  const refusesClep = target !== undefined && target.refuses.includes('clep');
  const stranded = refusesClep ? heldClep : [];
  const notTowardGe = target !== undefined && !refusesClep ? heldClep : [];

  /* ---- the body of each question ---- */

  const question = (title: string, hint?: string): ReactElement => (
    <>
      <Text style={styles.qText} accessibilityRole="header">{title}</Text>
      {hint !== undefined && <Text style={styles.qHint}>{hint}</Text>}
    </>
  );

  const creditList = (k: CreditKind): ReactElement => (
    <View style={styles.list}>
      {rowsOf(k).map(src => (
        <CreditRow
          key={src.id}
          src={src}
          held={value.held_credit_ids.includes(src.id)}
          strandedAt={target !== undefined && target.refuses.includes(src.kind) ? target.name : null}
          onToggle={() => toggleCredit(src.id)}
        />
      ))}
    </View>
  );

  let body: ReactNode = null;
  const gateKind = GATE_OF[step];
  const listKind = LIST_OF[step];

  if (step === 'welcome') {
    body = (
      <View style={styles.welcome}>
        <Stagger>
          {[
            <Wave key="w"><Text style={styles.wave}>👋</Text></Wave>,
            <Text key="t" style={styles.welcomeTitle}>Hi! Let&apos;s find the cheapest way to your degree.</Text>,
            <Text key="s" style={styles.welcomeSub}>
              We will ask a few quick questions, one at a time. Most take a single tap, and you
              can skip anything you are not sure about.
            </Text>,
            <View key="p" style={styles.promises}>
              {['No account, no sign-up', 'Nothing leaves your phone', 'About two minutes'].map(p => (
                <View key={p} style={styles.promise}>
                  <Text style={styles.promiseTick}>✓</Text>
                  <Text style={styles.promiseText}>{p}</Text>
                </View>
              ))}
            </View>,
          ]}
        </Stagger>
      </View>
    );
  } else if (step === 'year') {
    body = (
      <>
        {question('Where are you in school right now?', 'This decides which routes are still open to you.')}
        <View style={styles.choices} accessibilityRole="radiogroup">
          {YEARS.map(([id, label, hint]) => (
            <Choice key={id} label={label} hint={hint} wide
              selected={value.profile.year === id}
              onPress={() => answerAndAdvance(setProfile({ year: id }))} />
          ))}
        </View>
      </>
    );
  } else if (step === 'field') {
    body = (
      <>
        {question('What are you thinking of studying?',
          'Broad is fine, and "not decided yet" is a perfectly good answer. We only use this to ' +
          'warn you when a major has a locked sequence that planning cannot shorten.')}
        <View style={styles.choicesGrid} accessibilityRole="radiogroup">
          {FIELDS.map(([id, label]) => (
            <Choice key={id} label={label}
              selected={value.profile.field === id}
              onPress={() => answerAndAdvance(setProfile({ field: id }))} />
          ))}
        </View>
      </>
    );
  } else if (step === 'budget') {
    body = (
      <>
        {question('Roughly how much could you put toward credit?',
          'Not tuition — just exams and community-college courses. Leave it empty if you would ' +
          'rather not say.')}
        <View style={styles.budgetRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.budgetInput}
            value={value.profile.budget_usd === null ? '' : String(value.profile.budget_usd)}
            onChangeText={t => {
              const digits = t.replace(/[^0-9]/g, '');
              const n = digits === '' ? null : Number(digits);
              onChange(setProfile({ budget_usd: n !== null && Number.isFinite(n) && n > 0 ? n : null }));
            }}
            placeholder="no limit"
            placeholderTextColor={theme.color.textMuted}
            inputMode="numeric"
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={next}
            selectTextOnFocus
            accessibilityLabel="Budget in dollars"
          />
        </View>
      </>
    );
  } else if (step === 'waiver') {
    // Asked before the student has picked a state, so it cannot name their
    // waiver yet. Community-college fee waivers are state law, and the plan
    // names the one that applies — or says plainly the state has none.
    body = (
      <>
        {question('Do you qualify for a college fee waiver?',
          'Some states waive community-college fees for students who qualify, and that can take ' +
          'a whole route to $0. We will name your state’s waiver — or tell you it has none — ' +
          'once you pick a campus.')}
        <View style={styles.choices} accessibilityRole="radiogroup">
          {WAIVERS.map(([id, label, hint]) => (
            <Choice key={id} label={label} hint={hint} wide
              selected={value.profile.waiver === id}
              onPress={() => answerAndAdvance(setProfile({ waiver: id }))} />
          ))}
        </View>
      </>
    );
  } else if (step === 'state') {
    body = (
      <>
        {question('Which state do you want to graduate in?',
          'Transfer rules are set state by state, so this is the answer that matters most.')}
        <StateRow
          states={states}
          unmapped={unmappedStates}
          selected={selectedState}
          onSelect={onSelectState}
        />
      </>
    );
  } else if (step === 'campus') {
    body = (
      <>
        {question('Which campus are you aiming for?',
          `${institutions.length} public campus${institutions.length === 1 ? '' : 'es'} in ` +
          `${jurisdiction?.name ?? 'this state'}. Type to narrow the list.`)}
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
              onPress={() => answerAndAdvance(patch({ target_institution_id: inst.id }))}
            />
          ))}
        </View>
      </>
    );
  } else if (gateKind !== undefined) {
    const [title, hint] = GATE_COPY[gateKind];
    const answer = contextFor(value, nav.gates).gate(gateKind);
    body = (
      <>
        {question(title, hint)}
        <View style={styles.choices} accessibilityRole="radiogroup">
          <Choice label="Yes" wide selected={answer === true} onPress={() => answerGate(gateKind, true)} />
          <Choice label="No" wide selected={answer === false} onPress={() => answerGate(gateKind, false)} />
        </View>
        {/* Worth knowing whether or not they have taken a course yet: the plan
            will suggest community-college courses either way. Folded away so
            the question stays one question. */}
        {gateKind === 'cc_course' && target !== undefined && (
          <>
            <Pressable
              onPress={() => setPolicyOpen(o => !o)}
              accessibilityRole="button"
              accessibilityState={{ expanded: policyOpen }}
              style={({ pressed }) => [styles.more, pressed && styles.pressed]}
            >
              <Text style={styles.moreText}>
                {policyOpen
                  ? 'Hide transfer rules'
                  : `How does ${target.name} treat credit from other colleges?  ›`}
              </Text>
            </Pressable>
            {policyOpen && <TransferPolicyCard policy={transferPolicy} inst={target} />}
          </>
        )}
      </>
    );
  } else if (listKind !== undefined) {
    const [title, hint] = LIST_COPY[listKind];
    body = (
      <>
        {question(title, hint)}
        {/* One line, and only where it is true: at a campus that refuses CLEP
            a free exam is still worth nothing, and saying otherwise would be
            the app talking a student into stranded credit. */}
        {listKind === 'clep' && !refusesClep && freeClep !== null && (
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              💡  By the way, you can take them for free! Your plan shows you how.
            </Text>
            <SourceBadge p={freeClep.provenance} compact />
          </View>
        )}
        {/* Before anything is ticked, say why every row below is struck
            through — the campus card only said "limited options". */}
        {listKind === 'clep' && target !== undefined && refusesClep && stranded.length === 0 && (
          <View style={styles.heads}>
            <Text style={styles.headsText}>
              Heads up: {target.name} awards no credit for CLEP. Tick any you have passed anyway
              and we will show you exactly what they are worth there.
            </Text>
            <SourceBadge p={target.exam_policy_provenance} compact />
          </View>
        )}
        {listKind === 'clep' && target !== undefined && stranded.length > 0 && (
          <StrandedAlert inst={target} stranded={stranded} />
        )}
        {creditList(listKind)}
        {listKind === 'clep' && target !== undefined && notTowardGe.length > 0 && (
          <NotTowardGeNotice inst={target} exams={notTowardGe} />
        )}
        {listKind === 'cc_course' && target !== undefined && (
          <TransferPolicyCard policy={transferPolicy} inst={target} />
        )}
        {listKind === 'alt_provider' && (
          <ThirdPartyNotice inst={target ?? null} jurisdiction={jurisdiction} />
        )}
      </>
    );
  } else if (step === 'residency') {
    const residencyMissing = target !== undefined && target.residency_min_units <= 0;
    // Two ways that figure can fail to be solid, and a confirmed source only
    // settles the first: the row may be unconfirmed, or we may hold no figure.
    const residencyShaky =
      target !== undefined && (residencyMissing || !isBacked(target.residency_provenance));
    const ruleColor =
      target === undefined ? theme.color.border
        : residencyMissing ? theme.color.needsCheck
          : confidenceColor(target.residency_provenance.confidence);
    body = (
      <>
        {question(
          target === undefined
            ? 'How many units have you already earned at your target school?'
            : `How many units have you already earned at ${target.name}?`,
          'Zero is the usual answer if you have not started there yet.')}
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
            returnKeyType="next"
            onSubmitEditing={next}
            style={styles.unitsInput}
            accessibilityLabel="Units already earned at your target school"
          />
          <Text style={styles.unitsUnit}>units</Text>
        </View>
        {target !== undefined && (
          <View style={[styles.residency, residencyShaky && styles.residencyShaky,
            residencyShaky && { borderLeftColor: ruleColor }]}>
            <Text style={styles.residencyText}>
              {residencySentence(target, value.units_in_residence)}
            </Text>
            {/* The residency row, never the exam policy: this block states the
                minimum and nothing else. */}
            <SourceBadge p={target.residency_provenance} />
          </View>
        )}
      </>
    );
  } else if (step === 'name') {
    body = (
      <>
        {question('Last one — what should we call you?',
          'Optional. It is only printed on the advisor packet, so an advisor knows whose plan it ' +
          'is. It never leaves this phone unless you share the packet yourself.')}
        <TextInput
          value={value.student_name ?? ''}
          // An empty box means "no name" rather than an empty name on the packet.
          onChangeText={t => onChange(patch({ student_name: t === '' ? undefined : t }))}
          placeholder="Your name (or leave it blank)"
          placeholderTextColor={theme.color.textMuted}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="name"
          returnKeyType="done"
          maxLength={60}
          style={styles.nameInput}
          accessibilityLabel="Your name, optional. Printed on the advisor packet."
        />
        {/* Some of the next screen's confidence lands as a caveat line or a
            dimmed card rather than a badge. Promising a badge on each figure
            would be a promise the screen does not keep. */}
        <Text style={styles.closer}>
          Nothing here is a promise. Every figure on the next screen is shown with how far we
          trust the rows it rests on, and anything nobody has checked against a source says so.
        </Text>
      </>
    );
  }

  /* ---- the button at the bottom ---- */

  let cta: { label: string; enabled: boolean; onPress: () => void };
  if (step === 'welcome') {
    cta = { label: 'Let’s go', enabled: true, onPress: next };
  } else if (step === 'state') {
    cta = institutions.length > 0
      ? { label: 'Next', enabled: true, onPress: next }
      // "Next" is unanswerable in a state with no campuses in it, and reads as
      // the student's fault. Name the actual next move instead.
      : { label: 'Pick a state we have mapped', enabled: false, onPress: next };
  } else if (step === 'campus') {
    cta = { label: target === undefined ? 'Pick a campus to continue' : 'Next', enabled: target !== undefined, onPress: next };
  } else if (step === 'name') {
    cta = {
      label: target === undefined ? 'Pick a campus first' : `Price my route to ${target.name}`,
      enabled: target !== undefined,
      onPress: onSubmit,
    };
  } else if (listKind !== undefined) {
    cta = { label: heldIn(listKind) > 0 ? 'Next' : 'None of these — skip', enabled: true, onPress: next };
  } else if (step === 'budget') {
    cta = { label: value.profile.budget_usd === null ? 'Skip' : 'Next', enabled: true, onPress: next };
  } else if (gateKind !== undefined) {
    const answered = contextFor(value, nav.gates).gate(gateKind) !== undefined;
    cta = { label: answered ? 'Next' : 'Skip', enabled: true, onPress: next };
  } else {
    cta = { label: 'Next', enabled: true, onPress: next };
  }

  return (
    <View style={styles.root}>
      {step !== 'welcome' && (
        <View style={styles.header}>
          <Pressable
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Previous question"
            hitSlop={12}
            style={({ pressed }) => [styles.headerBack, pressed && styles.pressed]}
          >
            <Text style={styles.headerBackText}>‹</Text>
          </Pressable>
          <ProgressBar progress={progress} />
          <Text style={styles.headerCount}>{index} of {questionCount}</Text>
        </View>
      )}

      <ScrollView
        key={step}
        style={styles.scroll}
        contentContainerStyle={[styles.content, step === 'welcome' && styles.contentWelcome]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <StepTransition motionKey={step} direction={direction}>
          {body}
        </StepTransition>
      </ScrollView>

      <View style={styles.footer}>
        <PressScale
          onPress={cta.onPress}
          disabled={!cta.enabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: !cta.enabled }}
          style={styles.ctaOuter}
          contentStyle={[styles.cta, !cta.enabled && styles.ctaOff]}
        >
          <Text style={[styles.ctaText, !cta.enabled && styles.ctaTextOff]} numberOfLines={2}>
            {cta.label}
          </Text>
        </PressScale>
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
  contentWelcome: { flexGrow: 1, justifyContent: 'center' },

  header: {
    width: '100%', maxWidth: COLUMN, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: theme.space.md,
    paddingHorizontal: theme.space.md, paddingTop: theme.space.sm,
  },
  headerBack: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerBackText: { fontSize: 30, lineHeight: 32, color: theme.color.text },
  headerCount: { ...theme.font.mono, color: theme.color.textMuted, minWidth: 52, textAlign: 'right' },

  welcome: { paddingVertical: theme.space.lg },
  wave: { fontSize: 56, marginBottom: theme.space.md },
  welcomeTitle: { ...theme.font.display, fontSize: 34, lineHeight: 40, color: theme.color.text },
  welcomeSub: {
    ...theme.font.body, fontSize: 17, lineHeight: 25, color: theme.color.textMuted,
    marginTop: theme.space.md,
  },
  promises: { marginTop: theme.space.lg, gap: theme.space.sm },
  promise: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  promiseTick: {
    color: theme.color.bg, backgroundColor: theme.color.accent, fontWeight: '700',
    width: 22, height: 22, borderRadius: 11, textAlign: 'center', lineHeight: 22,
    overflow: 'hidden', fontSize: 13,
  },
  promiseText: { ...theme.font.body, color: theme.color.text },

  choices: { gap: theme.space.sm },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  choiceOuter: { flexGrow: 1, flexShrink: 1, flexBasis: '45%' },
  choiceWide: { flexBasis: '100%' },
  choice: {
    borderWidth: 1, borderColor: theme.color.border, borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    paddingVertical: theme.space.md, paddingHorizontal: theme.space.md,
    minHeight: 56, justifyContent: 'center',
  },
  choiceOn: { borderColor: theme.color.accent, backgroundColor: theme.color.accentDim },
  choiceInner: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  choiceBody: { flex: 1 },
  choiceLabel: { ...theme.font.heading, color: theme.color.text },
  choiceLabelOn: { color: theme.color.accent },
  choiceHint: { ...theme.font.small, color: theme.color.textMuted, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.color.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn: { borderColor: theme.color.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.color.accent },

  list: { gap: theme.space.sm, marginTop: theme.space.xs },

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

  tip: {
    borderRadius: theme.radius.md, backgroundColor: theme.color.accentDim,
    padding: theme.space.md, gap: theme.space.sm, marginBottom: theme.space.md,
  },
  tipText: { ...theme.font.body, color: theme.color.text, lineHeight: 21 },

  heads: {
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.color.warn,
    padding: theme.space.md, gap: theme.space.sm, marginBottom: theme.space.md,
  },
  headsText: { ...theme.font.body, color: theme.color.text, lineHeight: 21 },

  more: { paddingVertical: theme.space.md },
  moreText: { ...theme.font.body, color: theme.color.accent },

  policy: {
    marginTop: theme.space.md, padding: theme.space.md, gap: theme.space.md,
    borderRadius: theme.radius.md, backgroundColor: theme.color.surface,
    borderWidth: 1, borderColor: theme.color.border,
  },
  policyKicker: { ...theme.font.small, color: theme.color.textMuted, letterSpacing: 1.2 },
  policyPoint: { gap: theme.space.xs },
  policyText: { ...theme.font.body, color: theme.color.text, lineHeight: 21 },
  policyFinal: {
    borderLeftWidth: 3, borderLeftColor: theme.color.warn,
    paddingLeft: theme.space.sm,
  },
  policyFinalText: { ...theme.font.small, color: theme.color.text, lineHeight: 19, fontWeight: '600' },

  search: {
    ...theme.font.body, color: theme.color.text,
    borderWidth: 1, borderColor: theme.color.border, borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.md, paddingVertical: theme.space.sm,
    marginBottom: theme.space.sm,
  },

  // One question per screen, so the question IS the headline.
  qText: { ...theme.font.title, color: theme.color.text, lineHeight: 31 },
  qHint: {
    ...theme.font.body, color: theme.color.textMuted,
    marginTop: theme.space.sm, marginBottom: theme.space.md, lineHeight: 21,
  },
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
  nameInput: {
    ...theme.font.title,
    color: theme.color.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
    paddingVertical: theme.space.sm,
    // Touch target: the underline is subtle, so the row still has to be tappable.
    minHeight: 44,
  },

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
  ctaOuter: { width: '100%', maxWidth: COLUMN, alignSelf: 'center' },
  cta: {
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
