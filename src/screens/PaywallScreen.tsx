/**
 * PaywallScreen — the one place the app asks for money.
 *
 * The saving is the largest thing here because the saving is the argument: the
 * packet is worth buying only in proportion to what it protects. Everything
 * else on this screen is there to keep that argument honest — what the unlock
 * actually contains, and, just as prominently, what it does not.
 *
 * No countdown, no "3 people are viewing", no price struck through. A student
 * deciding whether to spend money on their own degree deserves the plain case.
 *
 * Two props decide which screen this is. `alreadyOwned` removes the ask
 * entirely — a student who has paid is shown what they own and a way back to
 * their plan, never a second buy button. `priceLabel` is the store's own
 * localised price, and is null until the store answers; we quote the real price
 * when we have it and say plainly that the store will show it when we do not.
 * We never invent a figure in between.
 */
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { PaywallScreenProps } from '../ui/contracts.ts';
import { money, theme } from '../ui/theme.ts';
import { MINOR_PURCHASE_NOTICE } from '../disclaimer.ts';

interface Benefit {
  title: string;
  body: string;
}

const BENEFITS: readonly Benefit[] = [
  {
    title: 'The advisor packet, as a PDF',
    body:
      'Your whole plan on one page — every course and exam, what it costs, what it clears, and the campus policy it rests on. Built to be handed to a counsellor who can confirm or correct it in one sitting.',
  },
  {
    title: 'A source on every single line',
    body:
      'Each row prints its source link, the date we last read that page, and how far we trust it. A row nobody has confirmed prints as unconfirmed — the packet does not launder it into a fact.',
  },
  {
    title: 'Re-checks when the sources move',
    body:
      'Transfer policy changes between catalogue years. When we re-read a page your plan depends on and it has changed, your packet is rebuilt against the new source. No second charge.',
  },
];

/**
 * Printed above the benefits, not below them. If the limits only surface after
 * payment — or after enough scrolling to count as the same thing — the pitch
 * was a lie.
 */
const LIMITS: readonly string[] = [
  'It does not turn an unverified row into a verified one. Unconfirmed rows stay marked unconfirmed — printing them honestly is the product.',
  'It is not advice from your campus. Where a counsellor contradicts this packet, the counsellor is right.',
  'It cannot promise a campus will honour anything. We show you the policy and the day we read it; the decision stays theirs.',
];

function BenefitRow(props: { index: number; benefit: Benefit }) {
  return (
    <View style={styles.benefit}>
      <Text style={styles.benefitNum}>{props.index + 1}</Text>
      <View style={styles.benefitText}>
        <Text style={styles.benefitTitle}>{props.benefit.title}</Text>
        <Text style={styles.benefitBody}>{props.benefit.body}</Text>
      </View>
    </View>
  );
}

export function PaywallScreen(props: PaywallScreenProps) {
  const {
    schoolAge, savingUsd, priceLabel, alreadyOwned, busy, error,
    onPurchase, onRestore, onDismiss,
  } = props;
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  // A saving of zero or less is not an anchor, it is a hole. Never dress one up
  // as a number — say there isn't one and let the packet stand on its own.
  // Non-finite is the same hole wearing a number: money(Infinity) prints "$∞".
  const anchored = Number.isFinite(savingUsd) && savingUsd > 0;

  // Null is "the store has not answered yet"; a blank string is the same
  // ignorance wearing a value, and would print "One payment of  ." on a screen
  // whose whole job is not overclaiming. Both fall back to the honest wording.
  const price = priceLabel !== null && priceLabel.trim().length > 0 ? priceLabel.trim() : null;

  // Same argument either way — the saving is only real if a counsellor signs
  // off on it — but it is no longer a pitch once the packet is theirs.
  const heroSub = anchored
    ? `That figure is only worth anything if your campus agrees with it. ${
        alreadyOwned ? 'Your packet is' : 'The advisor packet is'
      } what you take to them to find out — before you pay a registration fee.`
    : `${
        alreadyOwned ? 'Your packet' : 'The packet'
      } is still the fastest way to get a counsellor to check that for themselves, on paper, with sources.`;

  // Quote the store's own figure once we have it, in the store's own currency
  // and formatting. Until then, promise only what we can stand behind: that the
  // store will show the price and ask before charging.
  const priceNote = alreadyOwned
    ? 'Already yours. The packet is a one-time unlock rather than a subscription, so nothing renews and nothing further is charged — including the re-checks when your sources move.'
    : price !== null
      ? `One payment of ${price}, not a subscription. Your store asks you to confirm before anything is charged — we never see your card.`
      : 'One payment, not a subscription. Your store shows the price and asks you to confirm before anything is charged — we never see your card.';

  // The price belongs on the button too: a student should know what they are
  // agreeing to at the moment they tap, not one paragraph earlier.
  const buyText = price === null ? 'Unlock advisor packet' : `Unlock advisor packet · ${price}`;
  const buyLabel =
    price === null ? 'Unlock the advisor packet' : `Unlock the advisor packet for ${price}`;

  return (
    <View style={styles.root}>
      {/* This app is built for people who may be 14. Asking one of them for
          money without saying this first is not something to leave to a store's
          age rating. It sits above everything, including the price. */}
      {schoolAge && !alreadyOwned && (
        <View style={styles.minorNotice}>
          <Text style={styles.minorNoticeText}>{MINOR_PURCHASE_NOTICE}</Text>
        </View>
      )}
      <View style={styles.header}>
        {/* Dismiss stays live even mid-purchase: a request that hangs must never
            leave a student trapped on the screen that wants their money. */}
        <Pressable
          onPress={onDismiss}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={
            alreadyOwned ? 'Go back to your plan' : 'Close without buying'
          }
          style={({ pressed }) => [styles.dismissTop, pressed && styles.pressed]}
        >
          {/* "Not now" is an answer to a question. Once the student owns the
              packet there is no question left to decline. */}
          <Text style={styles.dismissTopText}>{alreadyOwned ? 'Done' : 'Not now'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, wide && styles.contentWide]}
      >
        {/* First thing in the scroll, above even the saving: a student who has
            already paid should learn that before they read one word of pitch. */}
        {alreadyOwned && (
          <View style={styles.owned}>
            <Text style={styles.ownedTitle}>You already own the advisor packet</Text>
            <Text style={styles.ownedBody}>
              This unlock is active on your store account, so there is nothing to buy and nothing
              further to pay. Head back to your plan and export the packet whenever you need it.
            </Text>
          </View>
        )}

        <View style={[styles.hero, anchored ? styles.heroAnchored : styles.heroFlat]}>
          {/* "could", not "is about to": the figure is a projection off data of
              mixed confidence, and this screen cannot see that confidence. */}
          <Text style={styles.heroLabel}>
            {anchored ? 'Your plan could save you' : 'No saving found on your plan yet'}
          </Text>
          {anchored ? (
            <Text
              // A six-figure saving at 48pt overruns a 320pt-wide phone. Shrink
              // to fit rather than truncate: a clipped "$120,0" is a wrong number.
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={[styles.heroNumber, { fontSize: wide ? 64 : 48 }]}
              accessibilityLabel={`Your plan could save you ${money(savingUsd)}`}
            >
              {money(savingUsd)}
            </Text>
          ) : (
            <Text style={styles.heroNoNumber}>
              Nothing in our data beats paying your campus outright for these requirements.
            </Text>
          )}
          <Text style={styles.heroSub}>{heroSub}</Text>
        </View>

        {/* Above the pitch, not below it. The CTA is pinned to the footer, so a
            student can buy without ever scrolling; anything placed after three
            benefit paragraphs is fine print, whatever we style it like. */}
        <Text style={styles.sectionTitle}>What the advisor packet will not do</Text>
        <View style={styles.limits}>
          {LIMITS.map(l => (
            <Text key={l} style={styles.limitText}>
              {l}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {alreadyOwned ? 'What your unlock includes' : 'What unlocking buys'}
        </Text>
        {BENEFITS.map((b, i) => (
          <BenefitRow key={b.title} index={i} benefit={b} />
        ))}

        <Text style={styles.priceNote}>{priceNote}</Text>
      </ScrollView>

      <View style={styles.footer}>
        {/* Trimmed, because `error: string | null` also admits "" — which would
            paint a red box with nothing in it and no way to dismiss it. Shown
            in every state, including `alreadyOwned`: this screen is
            presentational, and an error the app deliberately handed it is not
            ours to rule stale. A student whose store call really did fail must
            not be left on a screen that says nothing happened. */}
        {error !== null && error.trim().length > 0 && (
          <View
            style={styles.errorBox}
            accessibilityRole="alert"
            // The box appears after a tap, so a screen reader has to be told.
            accessibilityLiveRegion="assertive"
          >
            <Text style={styles.errorText}>{error.trim()}</Text>
          </View>
        )}

        {alreadyOwned ? (
          // No buy button, and no restore link either — there is nothing left
          // to restore. The one action is the way onward, and it stays live
          // whatever the store is doing.
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Go back to your plan"
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          >
            <Text style={styles.ctaText}>Back to your plan</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={onPurchase}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={buyLabel}
              accessibilityState={{ disabled: busy, busy }}
              style={({ pressed }) => [
                styles.cta,
                busy && styles.ctaBusy,
                pressed && styles.pressed,
              ]}
            >
              {busy && <ActivityIndicator size="small" color={theme.color.bg} />}
              <Text style={styles.ctaText}>{busy ? 'Talking to the store…' : buyText}</Text>
            </Pressable>

            <View style={styles.secondaryRow}>
              <Pressable
                onPress={onRestore}
                disabled={busy}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Restore a purchase made earlier"
                accessibilityState={{ disabled: busy }}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Text style={[styles.secondaryText, busy && styles.secondaryDisabled]}>
                  Restore purchases
                </Text>
              </Pressable>
              <Text style={styles.secondaryDivider}>·</Text>
              <Pressable
                onPress={onDismiss}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Keep using the app without the packet"
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Text style={styles.secondaryText}>Keep looking for free</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

// A max-width column keeps the phone layout intact on a Galaxy Tab rather than
// stretching every line to the bezel.
const COLUMN = 640;

const styles = StyleSheet.create({
  minorNotice: {
    marginHorizontal: theme.space.md, marginTop: theme.space.md,
    padding: theme.space.md, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.color.warn,
    backgroundColor: theme.color.surface,
  },
  minorNoticeText: { ...theme.font.body, color: theme.color.warn, lineHeight: 20 },
  root: { flex: 1, backgroundColor: theme.color.bg },

  header: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
  },
  dismissTop: { paddingVertical: theme.space.xs, paddingHorizontal: theme.space.sm },
  dismissTopText: { ...theme.font.body, color: theme.color.textMuted },

  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.lg,
    gap: theme.space.md,
  },
  contentWide: { paddingHorizontal: theme.space.lg },

  // Reads as a receipt, not an offer: the accent border says "settled", and it
  // deliberately does not compete with the saving directly below it.
  owned: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.color.accent,
    padding: theme.space.md,
    gap: theme.space.xs,
  },
  // Accent stays on the border only: the theme reserves that green for money,
  // and the saving in the hero below must remain the loudest thing on screen.
  ownedTitle: { ...theme.font.heading, color: theme.color.text },
  ownedBody: { ...theme.font.small, color: theme.color.text, lineHeight: 20 },

  hero: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.space.lg,
    gap: theme.space.xs,
  },
  heroAnchored: { backgroundColor: theme.color.accentDim, borderColor: theme.color.accent },
  // No saving, no green: the surface must not imply a win that isn't there.
  heroFlat: { backgroundColor: theme.color.surface, borderColor: theme.color.border },
  heroLabel: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroNumber: { ...theme.font.display, color: theme.color.accent },
  heroNoNumber: { ...theme.font.title, color: theme.color.text, lineHeight: 30 },
  heroSub: { ...theme.font.body, color: theme.color.text, lineHeight: 21, marginTop: theme.space.xs },

  sectionTitle: {
    ...theme.font.heading,
    color: theme.color.text,
    marginTop: theme.space.sm,
  },

  benefit: {
    flexDirection: 'row',
    gap: theme.space.md,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
  },
  benefitNum: {
    ...theme.font.mono,
    color: theme.color.accent,
    minWidth: 16,
    lineHeight: 21,
  },
  benefitText: { flex: 1, gap: theme.space.xs },
  benefitTitle: { ...theme.font.heading, color: theme.color.text },
  benefitBody: { ...theme.font.small, color: theme.color.textMuted, lineHeight: 20 },

  limits: {
    backgroundColor: theme.color.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.color.warn,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  limitText: { ...theme.font.small, color: theme.color.text, lineHeight: 20 },

  priceNote: {
    ...theme.font.small,
    color: theme.color.textMuted,
    lineHeight: 20,
    marginTop: theme.space.xs,
  },

  footer: {
    width: '100%',
    maxWidth: COLUMN,
    alignSelf: 'center',
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.md,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    gap: theme.space.sm,
  },

  errorBox: {
    backgroundColor: theme.color.surfaceAlt,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.color.danger,
    borderLeftWidth: 5,
    padding: theme.space.md,
  },
  errorText: { ...theme.font.body, color: theme.color.danger, lineHeight: 21 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.sm,
    backgroundColor: theme.color.accent,
    borderRadius: theme.radius.md,
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.md,
  },
  // Dimmed, not hidden — the button stays where the thumb left it.
  ctaBusy: { opacity: 0.6 },
  ctaText: { ...theme.font.heading, color: theme.color.bg, flexShrink: 1 },

  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  secondaryText: {
    ...theme.font.small,
    color: theme.color.textMuted,
    textDecorationLine: 'underline',
    paddingVertical: theme.space.xs,
  },
  secondaryDisabled: { opacity: 0.5 },
  secondaryDivider: { ...theme.font.small, color: theme.color.border },

  pressed: { opacity: 0.7 },
});
