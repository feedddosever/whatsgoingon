/**
 * Advisor packet — the artefact that leaves the phone.
 *
 * Every screen in this app is a conversation with the student; this is the
 * document they email their academic advisor. So it drops the dark theme
 * entirely: black on white, real margins, and every source URL spelled out in
 * full, because a printed hyperlink is a dead end.
 *
 * The document never asserts. Each row states how far we trust it, and the rows
 * we do not trust — along with the questions only the campus can answer — are
 * lifted into a numbered block whose entire purpose is to be replied to:
 * "item 3 is fine, item 5 is not".
 */
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type {
  GeArea, GeFramework, Institution, PlanItem, Provenance, Route, RouteKind, RouteWarning,
  System, WarningKind,
} from '../types.ts';
import { checkedOn, isBacked, linkable, noteText } from '../ui/provenance.ts';
import { confidenceLabel, money } from '../ui/theme.ts';
import { DISCLAIMER_LONG } from '../disclaimer.ts';

export interface AdvisorPacketInput {
  institution: Institution;
  /** Named throughout rather than assumed: this page is read in three states now. */
  framework: GeFramework;
  /** For the campus's system name in the footer, without printing a raw id. */
  system: System;
  route: Route;
  /**
   * The framework's rows, so an area can print under its name and not only its
   * code. An advisor reads "3B" natively; the student holding the printout does
   * not, and this is the document they read together.
   */
  areas: GeArea[];
  /** Optional: absent, the document prints a rule for the student to sign by hand. */
  studentName?: string;
  /**
   * Who is being handed this page.
   *
   * An advisor is being asked to rule on specific rows; a parent or guardian is
   * being asked to understand a decision and its cost. Same evidence either way
   * — a guardian packet that softened the unconfirmed rows would be the exact
   * dishonesty this document exists to prevent — but the ask, and what leads,
   * are different.
   */
  audience?: 'advisor' | 'guardian';
}

/**
 * A row is a claim only if it is backed AND says where it came from.
 * isBacked() is the shared bar — the same one the screens and the engine's
 * lowest-risk route use, so the packet cannot quietly disagree with the app
 * about what counts as confirmed. A 'published' row with an empty source_url is
 * a row nobody can check, so it joins the confirm list rather than printing as
 * settled.
 */
const needsConfirming = (p: Provenance): boolean =>
  !isBacked(p) || p.source_url.trim() === '';

const ROUTE_LABEL: Record<RouteKind, string> = {
  cheapest: 'cheapest route',
  fastest: 'fastest route',
  lowest_risk: 'lowest-risk route',
};

/**
 * How each kind of warning prints. One record, not three parallel ones: a kind's
 * name, its place in the running order and how much weight it carries on paper
 * are a single editorial decision, and splitting them is how a new kind ends up
 * titled but unranked, or ranked but set in the mildest style.
 *
 * Record<WarningKind, …> on purpose — a new kind in the engine has to be given
 * all three here before this file will compile. There is deliberately no default
 * branch to fall through to.
 *
 *   kicker — names the shape of the problem above the sentence that spells it
 *            out, so an advisor skimming the page can tell money already spent
 *            from a hole in our data without reading either one.
 *   rank   — print order. Stranded credit leads because it is the only kind that
 *            is money the student has already spent; the rest follow the order
 *            the engine raises them in. This sorts, it does not filter.
 *   weight — 'severe' is the reversed kicker, the side bar and the larger
 *            sentence. Reserved for stranded credit, which is the one kind that
 *            reports money already gone. 'marked' is the side bar alone, for the
 *            kind with no visible symptom: credit the campus does award, which
 *            clears nothing. Everything else prints 'standard'.
 */
interface WarningStyle {
  kicker: string;
  rank: number;
  weight: 'severe' | 'marked' | 'standard';
}

const WARNING_STYLE: Record<WarningKind, WarningStyle> = {
  stranded_credit: {
    kicker: 'Credit already held · will not count here',
    rank: 0,
    weight: 'severe',
  },
  /**
   * Budget and major-sequence notes are context the student brought, not campus
   * policy, so they print standard and sit below anything about their credit.
   * The opportunity note ranks last: an advisor reading this page is being asked
   * to confirm requirements, and a saving the student has not taken yet is the
   * least urgent line on it.
   */
  budget_exceeded: {
    kicker: 'Over the budget the student set',
    rank: 2,
    weight: 'standard',
  },
  major_sequence: {
    kicker: 'Major requirements · outside this plan',
    rank: 6,
    weight: 'standard',
  },
  opportunity: {
    kicker: 'Saving not yet taken',
    rank: 7,
    weight: 'standard',
  },
  /**
   * The quiet one. The campus DOES award this credit, so the units arrive and
   * nothing on the student's side looks wrong — and the general-education requirement is
   * still open. CLEP at a CSU is exactly this. It ranks under stranded credit,
   * which is money already spent, and over every kind below it, which report a
   * constraint rather than a requirement the student believes is handled; and it
   * is given its own weight rather than printing in the mildest one on the page.
   */
  credit_not_toward_ge: {
    kicker: 'Credit accepted · clears no general-education area',
    rank: 1,
    weight: 'marked',
  },
  transfer_cap: { kicker: 'Transfer-unit cap', rank: 2, weight: 'standard' },
  residency: { kicker: 'Residency requirement', rank: 3, weight: 'standard' },
  unverified_data: { kicker: 'Not confirmed yet', rank: 4, weight: 'standard' },
};

/**
 * Every interpolated value goes through this. A campus called "Cal Poly & Co"
 * must not corrupt the document, and the quote forms matter because escaped text
 * is reused inside href attributes.
 */
const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Seeded rows carry an empty as_of. Saying so is the honest reading — and it is
 * set in the same italic as a missing source, so it cannot be skimmed as a date.
 */
const checkedHtml = (p: Provenance): string =>
  p.as_of.trim() === '' ? '<span class="missing">never</span>' : esc(p.as_of);

/**
 * The same fact as a clause rather than a field value, for running prose. The
 * undated wording is the shared one, so the packet and the screens say the same
 * thing about a row nobody has opened.
 */
const checkedPhrase = (p: Provenance): string =>
  p.as_of.trim() === '' ? checkedOn(p) : `checked ${checkedOn(p)}`;

const units = (n: number): string => `${n} unit${n === 1 ? '' : 's'}`;

/**
 * Local calendar date. toISOString() is UTC, which dates a packet prepared on a
 * California evening as tomorrow — wrong on a document about when things were checked.
 */
function todayLocal(): string {
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * "3B (Humanities)" — the code an advisor reads natively, plus the name the
 * student knows the requirement by. The name is the dataset's row or nothing:
 * a code we hold no area for prints as itself, never as "undefined" and never
 * with an empty bracket after it.
 */
type AreaNamer = (id: string) => string;

function areaNamerFor(areas: GeArea[]): AreaNamer {
  const byId = new Map(areas.map((a): [string, GeArea] => [a.id, a]));
  return (id: string): string => {
    const area = byId.get(id);
    const name = area?.name.trim() ?? '';
    // The advisor's shorthand leads where the framework has one, because that
    // is the token they will look up. Where it does not, our internal id is
    // noise on a page an advisor has to act on, so only the name prints.
    const code = area?.code ?? (area === undefined ? id : null);
    if (name === '') return code ?? id;
    return code === null ? name : `${code} (${name})`;
  };
}

/** What a row claims to clear, as a phrase. Returns text — the caller escapes it. */
const areaLabel = (area: string | null, named: AreaNamer): string =>
  area === null ? 'Elective credit — clears no area' : `General-education area ${named(area)}`;

/** Spelled out in full: this page is going to be printed. */
function sourceHtml(p: Provenance): string {
  const url = p.source_url.trim();
  if (url === '') return '<span class="missing">no source on file</span>';
  const safe = esc(url);
  return linkable(url) ? `<a href="${safe}">${safe}</a>` : safe;
}

/**
 * How old the plan's evidence is, stated plainly rather than averaged into
 * something reassuring. Undated rows are counted out loud.
 */
function dataVintage(sources: Provenance[]): string {
  const dated = sources.map(p => p.as_of.trim()).filter(d => d !== '').sort();
  const undated = sources.length - dated.length;

  if (dated.length === 0) {
    const plural = sources.length === 1 ? '' : 's';
    return `None of the ${sources.length} source${plural} behind this plan has a recorded check date.`;
  }

  const oldest = dated[0];
  const newest = dated[dated.length - 1];
  const span =
    oldest === newest
      ? `Sources last checked ${esc(oldest)}.`
      : `Sources last checked between ${esc(oldest)} and ${esc(newest)}.`;

  return undated === 0
    ? span
    : `${span} ${undated} of ${sources.length} carry no recorded check date at all.`;
}

/**
 * Every distinct row this document rests on, counted once each.
 *
 * Warnings now carry their own provenance, which is a second path the evidence
 * arrives by — leave it out and the footer's vintage line silently describes
 * only the plan table, while the loudest claims on the page go uncounted. Put it
 * in naively and the campus row, which the engine hands to several warnings at
 * once, is counted once per warning and the plan reads as better sourced than it
 * is.
 *
 * So: deduplicate, and by VALUE rather than by object identity. Two warnings
 * sharing one row is the common case today, but the engine is free to build an
 * equal row per warning, and "sources behind this plan" has to mean sources
 * either way.
 */
function distinctSources(input: AdvisorPacketInput): Provenance[] {
  const seen = new Set<string>();
  const out: Provenance[] = [];

  const add = (p: Provenance): void => {
    // JSON, not a joined separator: a source URL is free text and any
    // separator we picked could occur inside one, collapsing two distinct
    // rows into one.
    const key = JSON.stringify([p.confidence, p.source_url.trim(), p.as_of.trim()]);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };

  // The campus is three claims on three independently confirmed rows, not one
  // row: counting only the exam policy would let the published source it rests
  // on stand in for the residency minimum and the transfer cap, and those two are
  // precisely the ones nobody has checked. Equal rows collapse in add().
  add(input.institution.exam_policy_provenance);
  add(input.institution.residency_provenance);
  add(input.institution.transfer_cap_provenance);
  for (const item of input.route.items) add(item.provenance);
  for (const w of input.route.warnings) {
    if (w.provenance !== undefined) add(w.provenance);
  }

  return out;
}

/**
 * What this plan assumes about the campus itself — one entry per claim, each
 * carrying the row it actually rests on.
 *
 * This was a single sentence over a single provenance row, which is how the
 * exam policy's published source came to vouch for the residency minimum and the
 * transfer-unit cap printed beside it. Nobody has confirmed those two. Separate
 * claims, separate rows, separate lines: an advisor can then settle one of them
 * without being asked to stand behind the other two in the same breath.
 */
interface CampusClaim {
  label: string;
  /** Plain text — escaped where it is interpolated, like every other claim here. */
  claim: string;
  provenance: Provenance;
}

function campusClaims(inst: Institution): CampusClaim[] {
  return [
    {
      label: 'Credit-by-exam policy',
      claim: `${inst.name} ${inst.accepts_clep ? 'awards credit for CLEP' : 'awards no credit for CLEP'}.`,
      provenance: inst.exam_policy_provenance,
    },
    {
      label: 'Residency minimum',
      claim: `${inst.residency_min_units} units must be earned on campus at ${inst.name} to graduate.`,
      provenance: inst.residency_provenance,
    },
    {
      label: 'Transfer-unit cap',
      claim:
        inst.max_transfer_units === null
          ? `We hold no transfer-unit cap for ${inst.name}, so this plan treats transfer credit as uncapped.`
          : `${inst.name} caps credit transferred in at ${inst.max_transfer_units} units; units above the cap are lost.`,
      provenance: inst.transfer_cap_provenance,
    },
  ];
}

/** Item row plus its source row, kept together as one tbody so a page break cannot split them. */
function itemHtml(item: PlanItem, n: number, named: AreaNamer): string {
  const flagged = needsConfirming(item.provenance);
  const note = noteText(item.provenance);

  return `
      <tbody class="row${flagged ? ' flagged' : ''}">
        <tr class="item">
          <td class="num">${n}</td>
          <td class="what">${esc(item.label)}${flagged ? '<span class="chip">confirm</span>' : ''}</td>
          <td class="fig">${item.units}</td>
          <td>${esc(item.satisfies_areas.map(a => areaLabel(a, named)).join(' + ')) || 'elective credit'}</td>
          <td class="fig">${money(item.cost_usd)}</td>
          <td class="conf${flagged ? ' weak' : ''}">${esc(confidenceLabel(item.provenance.confidence))}</td>
        </tr>
        <tr class="src">
          <td></td>
          <td colspan="5">
            <span class="k">Source</span> ${sourceHtml(item.provenance)}
            <span class="k">Checked</span> ${checkedHtml(item.provenance)}
            ${note === null ? '' : `<div class="note"><span class="k">Note</span> ${esc(note)}</div>`}
          </td>
        </tr>
      </tbody>`;
}

function planTableHtml(route: Route, named: AreaNamer): string {
  if (route.items.length === 0) {
    return `
      <p class="empty">This route recommends buying no credit at all. Either everything it
      would have suggested is already held, or nothing in our data is trustworthy enough to
      recommend. Anything noted above still applies.</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Credit the student plans to earn</th>
          <th class="fig">Units</th>
          <th>Claims to clear</th>
          <th class="fig">Cost</th>
          <th>How far we trust this</th>
        </tr>
      </thead>
      ${route.items.map((item, i) => itemHtml(item, i + 1, named)).join('')}
    </table>`;
}

/**
 * What a warning rests on. A kind carrying a provenance row prints it in full,
 * like every other claim in this document. A kind that carries none says so
 * plainly rather than going quiet: 'unverified_data' fires precisely because
 * there is no confirmed row to plan against, and an advisor should be able to
 * see that it is our data that stops there, not the campus policy.
 */
function warningBasisHtml(w: RouteWarning): string {
  const p = w.provenance;
  if (p === undefined) {
    return `
          <div class="basis">This one rests on what our data does <b>not</b> contain — there is
          no policy page behind it to cite.</div>`;
  }

  const note = noteText(p);

  // The same bar the plan table applies to a row: a warning resting on something
  // nobody has confirmed must not print in the same weight as one resting on
  // statute. Without this the packet's most consequential sentences would be the
  // only place where 'Unverified' reads exactly like 'Published policy'.
  const confidence = needsConfirming(p)
    ? `<span class="unconfirmed">${esc(confidenceLabel(p.confidence))} — confirm this</span>`
    : esc(confidenceLabel(p.confidence));

  return `
          <div class="basis">
            ${confidence} · ${sourceHtml(p)} · ${esc(checkedPhrase(p))}
            ${note === null ? '' : `<div class="note"><span class="k">Note</span> ${esc(note)}</div>`}
          </div>`;
}

/**
 * Warnings are the most valuable thing this app says, so in print they get a
 * heavy rule and bold text rather than a colour — an advisor's office printer is
 * usually greyscale. The sentence is reproduced exactly as the engine phrased
 * it, because it is written for the student; what this adds above it is the
 * KIND, so nobody has to read a paragraph to find out that "will not count
 * here" is not the same problem as "our data does not cover this".
 */
function warningHtml(w: RouteWarning): string {
  // Money the student has already spent outranks everything else on the page,
  // and greyscale printing means that has to be weight rather than colour. Read
  // off WARNING_STYLE rather than tested inline, so a kind added to the engine
  // cannot quietly inherit the mildest treatment on the page.
  const style = WARNING_STYLE[w.kind];

  return `
        <li class="w ${style.weight}">
          <div class="kind">${esc(style.kicker)}</div>
          <div class="msg">${esc(w.message)}</div>
          ${warningBasisHtml(w)}
        </li>`;
}

function warningsHtml(warnings: RouteWarning[], instName: string): string {
  if (warnings.length === 0) {
    return `
    <section class="alert quiet">
      <h2>No blocking constraints found</h2>
      <p>Our data turned up nothing at ${esc(instName)} that would strand or cap this credit.
      That is the absence of a known problem, not a guarantee.</p>
    </section>`;
  }

  // A copy: route.warnings belongs to the caller, and an export must not
  // reorder the array the screens are rendering from.
  const ordered = [...warnings].sort(
    (a, b) => WARNING_STYLE[a.kind].rank - WARNING_STYLE[b.kind].rank,
  );
  const stranded = ordered.filter(w => w.kind === 'stranded_credit').length;
  const clearsNothing = ordered.filter(w => w.kind === 'credit_not_toward_ge').length;

  // The heading leads with the worst kind present, so the block names its own
  // stakes before the advisor reaches the first bullet. It has to follow the
  // running order below it: credit the campus awards that clears nothing ranks
  // second, and heading a page full of it "constraints on this plan" would
  // describe it as the mildest thing here — which is exactly how it goes unread.
  const heading =
    stranded === 1
      ? 'Read this first — credit already held that will not count here'
      : stranded > 1
        ? `Read this first — ${stranded} credits already held that will not count here`
        : clearsNothing === 1
          ? 'Read this first — credit that counts here but clears no general-education requirement'
          : clearsNothing > 1
            ? `Read this first — ${clearsNothing} credits that count here but clear no general-education requirement`
            : 'Read this first — constraints on this plan';

  return `
    <section class="alert">
      <h2>${esc(heading)}</h2>
      <ul>
        ${ordered.map(w => warningHtml(w)).join('')}
      </ul>
    </section>`;
}

/**
 * The confidence · source · date line every entry in the reply form carries.
 *
 * The list used to be nothing but rows we could not confirm, so every line in it
 * carried the same standing and none of them had to say so. It is mixed now —
 * the registrar questions below are asked about rows that ARE published — so an
 * unconfirmed row takes the same bordered mark it takes everywhere else on the
 * page. Without it 'Needs confirming' and 'Published policy' set identically, in
 * the one block an advisor reads line by line.
 */
const basisLineHtml = (p: Provenance): string => {
  const confidence = needsConfirming(p)
    ? `<span class="unconfirmed">${esc(confidenceLabel(p.confidence))}</span>`
    : esc(confidenceLabel(p.confidence));

  return `
            <div class="basis">
              ${confidence} ·
              ${sourceHtml(p)} · ${esc(checkedPhrase(p))}
            </div>`;
};

/**
 * The reply form. Numbering runs off the plan table so "item 3" means one thing
 * across the whole document, and everything that is not a table row is appended
 * after the last of them rather than competing for a number with it.
 */
function confirmHtml(input: AdvisorPacketInput, named: AreaNamer): string {
  const { institution, route } = input;

  const flagged = route.items
    .map((item, i) => ({ item, n: i + 1 }))
    .filter(({ item }) => needsConfirming(item.provenance));

  const entries: string[] = flagged.map(({ item, n }) => {
    const claim =
      item.satisfies_areas.length === 0
        ? `we expect ${units(item.units)} of elective credit, clearing no general-education area`
        : `we expect it to clear ${esc(item.satisfies_areas.map(a => areaLabel(a, named)).join(' and '))} for ${units(item.units)}`;

    return `
        <li>
          <span class="n">${n}.</span>
          <div>
            <b>${esc(item.label)}</b> — ${claim}.
            ${basisLineHtml(item.provenance)}
          </div>
        </li>`;
  });

  // Numbers for everything that is not a row in the table, handed out in the
  // order the entries are appended.
  let nextN = route.items.length + 1;

  // One entry per campus claim that needs confirming, never one entry covering
  // all three. Asked together, an advisor who can settle the residency minimum
  // has to vouch for the exam policy and the transfer cap to say so — and the
  // three do not rest on the same row or carry the same confidence.
  for (const c of campusClaims(institution)) {
    if (!needsConfirming(c.provenance)) continue;
    entries.push(`
        <li>
          <span class="n">${nextN++}.</span>
          <div>
            <b>${esc(c.label)}</b> (not a row in the table above) — ${esc(c.claim)}
            ${basisLineHtml(c.provenance)}
          </div>
        </li>`);
  }

  /*
   * Credit the campus DOES award that clears no general-education requirement is the one
   * question on this page a registrar can settle in a line, and the one the
   * student cannot see going wrong: the units arrive, the transcript looks
   * healthy, the requirement is still open. So it is asked here even when the
   * row behind it is published — what is being confirmed is not our source but
   * whether anything on the pattern really clears.
   *
   * The engine's sentence is repeated rather than referred to, because this
   * block is a reply form: an item has to be answerable without reading back up
   * the page to find out which credit it is about.
   */
  const registrarQuestions = route.warnings.filter(w => w.kind === 'credit_not_toward_ge');
  for (const w of registrarQuestions) {
    // The warning's own row, never the campus record: the engine attaches the
    // provenance that actually backs this claim.
    const p = w.provenance;
    entries.push(`
        <li>
          <span class="n">${nextN++}.</span>
          <div>
            <b>Credit accepted that clears no general-education area</b> — ${esc(w.message)}
            Is that right, and is there any part of the general-education pattern it does clear?
            ${p === undefined ? '' : basisLineHtml(p)}
          </div>
        </li>`);
  }

  const heading =
    entries.length === 0
      ? 'Nothing here is guesswork — but please confirm it still holds'
      : entries.length === 1
        ? 'Please confirm this one item'
        : `Please confirm these ${entries.length} items`;

  // Only promise that the numbers match the table when some of them came off it:
  // an empty plan with a flagged campus row has no table to match.
  const matchesTable =
    flagged.length === 0
      ? ''
      : ' They are numbered to match the table above, so a reply of "item 3 is fine, item 5 is'
        + ' not" is all that is needed.';

  // Two different asks share this list, and the sentence over it has to describe
  // the ones actually below: an unconfirmed row is a gap in OUR data, while
  // credit that clears nothing is a question only the campus can answer. Saying
  // "we could not confirm these" over a published row would misdescribe it.
  const unconfirmed = entries.length - registrarQuestions.length;
  const lead =
    unconfirmed === 0
      ? `Nothing in this plan rests on a source we could not check. What is listed below is
         credit ${esc(institution.name)} does award that appears to clear no general-education
         requirement — a question for your office rather than a gap in our sources.`
      : registrarQuestions.length === 0
        ? `These are the items we could <b>not</b> confirm against statute or a published
           policy page.`
        : `These are the items we could <b>not</b> confirm against statute or a published
           policy page, together with credit ${esc(institution.name)} does award that appears
           to clear no general-education requirement — those last are questions for your office rather
           than gaps in our sources.`;

  const body =
    entries.length === 0
      ? `<p>Every row in this plan is backed by statute or by a published policy page we can
         point you at. There is nothing here we are guessing at — but policies change between
         catalogue years, so a confirmation that none of it has moved would still be worth having.</p>`
      : `<p>${lead}${matchesTable}</p>
         <ol class="confirm-list">${entries.join('')}</ol>`;

  return `
    <section class="confirm">
      <h2>${heading}</h2>
      ${body}
      <div class="reply">
        <div class="reply-row"><span class="reply-k">Items confirmed</span><span class="rule"></span></div>
        <div class="reply-row"><span class="reply-k">Items that will <b>not</b> count</span><span class="rule"></span></div>
        <div class="reply-row"><span class="reply-k">Advisor &amp; date</span><span class="rule"></span></div>
      </div>
    </section>`;
}

function summaryHtml(route: Route, named: AreaNamer): string {
  const unconfirmed = route.items.filter(i => needsConfirming(i.provenance)).length;

  // The total is a factual claim like any other, and it is the biggest thing on
  // the page — so it says how much of itself is unconfirmed instead of standing
  // alone looking settled.
  const basis =
    route.items.length === 0
      ? ''
      : unconfirmed === 0
        ? `<div class="total-basis">Every row below is confirmed against statute or a published policy.</div>`
        : `<div class="total-basis flagged">${unconfirmed} of ${route.items.length} row${route.items.length === 1 ? '' : 's'} below ${unconfirmed === 1 ? 'is' : 'are'} not confirmed</div>`;

  const cleared =
    route.areas_cleared.length === 0
      ? 'No general-education area is cleared by this plan.'
      : `Clears ${route.areas_cleared.length} general-education area${route.areas_cleared.length === 1 ? '' : 's'}: ${esc(route.areas_cleared.map(a => named(a)).join(', '))}.`;

  // The requirements this plan does not solve reach the packet as data now, not
  // as a warning sentence as well — printing both had the advisor read the same
  // list twice on one page. That makes this the only place they are named, so it
  // names them in full and is set to be seen rather than skimmed past. It is
  // stated once, here, and not repeated under the table.
  const unmet =
    route.areas_unmet.length === 0
      ? 'Every area in our data is accounted for.'
      : `<span class="unmet">Still unsolved after this plan — ${route.areas_unmet.length} general-education area${route.areas_unmet.length === 1 ? '' : 's'}: ${esc(route.areas_unmet.map(a => named(a)).join(', '))}.</span>`;

  return `
    <section class="summary">
      <div>
        <div class="total">${money(route.total_cost_usd)}</div>
        <div class="total-k">Total cost of the credit below</div>
        ${basis}
      </div>
      <div class="facts">
        <div>Expects to transfer in <b>${route.total_units}</b> units across ${route.items.length} item${route.items.length === 1 ? '' : 's'}.</div>
        <div>${cleared}</div>
        <div>${unmet}</div>
      </div>
    </section>`;
}

/**
 * Print stylesheet, not the app's. 612px is expo-print's default page width at
 * 72 PPI, so a px here is a point on paper and the 48px padding is a two-thirds
 * inch margin. Colours are forced to print because the warning block's weight is
 * load-bearing.
 */
const STYLES = `
    @page { size: letter; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; }
    body {
      font: 10.5px/1.5 Georgia, 'Times New Roman', Times, serif;
      padding: 48px 48px 40px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, th, .chip, .k, .total, .facts b, .reply-k, .num, .fig, .conf,
    .alert .kind, .basis .unconfirmed {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    h1 { font-size: 19px; line-height: 1.2; letter-spacing: -0.3px; margin: 0 0 3px; }
    h2 { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px; }
    p { margin: 0 0 7px; }
    a { color: #000; }

    /* The page is a fixed 612px: anything that cannot wrap is clipped off the
       right edge of the PDF, so only the separators get nowrap. */
    .meta {
      font-size: 9.5px; color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;
      overflow-wrap: anywhere;
    }
    .meta .sep { padding: 0 6px; color: #999; white-space: nowrap; }
    .fill { display: inline-block; width: 150px; border-bottom: 1px solid #000; }

    .summary { display: flex; align-items: flex-start; gap: 22px; margin: 14px 0 12px; }
    .total { font-size: 36px; font-weight: 700; letter-spacing: -1.4px; line-height: 1; }
    .total-k { font-size: 8.5px; text-transform: uppercase; letter-spacing: .8px; color: #444; margin-top: 4px; }
    .facts { flex: 1; font-size: 10px; }
    .facts div { margin-bottom: 2px; }
    /* The unsolved requirements are the one fact here that is a hole rather than
       a number, and this line is the only place the document names them. Same
       bordered mark the page uses everywhere else for "look at this". */
    .facts .unmet {
      display: inline-block; font-weight: 700; border: 1.5px solid #000;
      padding: 1px 5px; margin-top: 2px;
    }
    .total-basis { font-size: 8.5px; color: #444; margin-top: 5px; max-width: 150px; }
    .total-basis.flagged {
      color: #000; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
      border: 1.5px solid #000; padding: 2px 4px; display: inline-block;
    }

    .ask { margin: 0 0 12px; font-size: 11px; }

    .alert { border: 3px solid #000; background: #f1f1f1; padding: 11px 13px; margin: 0 0 14px; page-break-inside: avoid; }
    /* Each warning carries its own kicker, so the list drops its bullets rather
       than setting a marker beside a two-line label. */
    .alert ul { margin: 0; padding: 0; list-style: none; }
    .alert li.w { margin-bottom: 9px; page-break-inside: avoid; }
    .alert li.w:last-child { margin-bottom: 0; }
    .alert .kind {
      display: inline-block; font-size: 7.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .6px; border: 1px solid #000; padding: 0 4px; margin-bottom: 3px;
    }
    .alert .msg { font-size: 11px; font-weight: 700; }
    /* .basis breaks URLs anywhere, which is right for a source line and wrong
       for the sentence of a provenance note — so prose wraps normally here and
       only an unbreakable URL is allowed to split. */
    .alert .basis { margin-top: 2px; color: #222; word-break: normal; overflow-wrap: anywhere; }
    /* A claim resting on a row nobody has confirmed gets the same bordered mark
       an unconfirmed row gets in the plan table — in the warning block and in
       the reply form, which now lists confirmed and unconfirmed rows together.
       Greyscale-safe, and it stops 'Unverified' from setting identically to
       'Guaranteed by state law'. */
    .basis .unconfirmed {
      display: inline-block; border: 1px solid #000; padding: 0 3px;
      font-size: 7.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .5px; color: #000; vertical-align: 1px;
    }
    /* Stranded credit is money the student has already spent. On a greyscale
       office printer that has to read as weight: a reversed kicker, a bar down
       the side, and the sentence itself set larger than the others. */
    .alert li.severe { border-left: 5px solid #000; padding-left: 9px; }
    .alert li.severe .kind { background: #000; color: #fff; }
    .alert li.severe .msg { font-size: 13px; line-height: 1.35; }
    /* Credit the campus accepts that clears nothing has no visible symptom — the
       units land, the requirement stays open — so it gets the side bar too, at
       half the weight: more than a constraint the student can see coming, less
       than money already gone. */
    .alert li.marked { border-left: 2px solid #000; padding-left: 9px; }
    .alert.quiet { border-width: 1px; background: #fff; }
    .alert.quiet p { font-weight: 400; margin: 0; }

    table { width: 100%; border-collapse: collapse; }
    thead th {
      font-size: 8px; text-transform: uppercase; letter-spacing: .6px; text-align: left;
      font-weight: 700; padding: 0 5px 4px; border-bottom: 1.5px solid #000;
    }
    tbody.row { page-break-inside: avoid; }
    td { vertical-align: top; padding: 0 5px; overflow-wrap: anywhere; }
    tr.item td { padding-top: 7px; font-size: 10.5px; }
    tr.src td { padding-bottom: 7px; border-bottom: 1px solid #ccc; font-size: 8.5px; color: #333; word-break: break-all; }
    .num { width: 18px; font-size: 10px; font-weight: 700; }
    .fig { text-align: right; white-space: nowrap; font-size: 10px; }
    th.fig { text-align: right; }
    .conf { font-size: 9.5px; width: 92px; }
    .k { font-size: 7.5px; text-transform: uppercase; letter-spacing: .5px; color: #666; margin-right: 2px; }
    .note { margin-top: 2px; }
    .missing { font-style: italic; }
    .empty { font-size: 11px; border: 1px solid #000; padding: 10px 12px; }

    /* Unverified data must not look like confirmed data — greyed, chipped, bolded. */
    tbody.flagged tr td { background: #ebebeb; }
    tbody.flagged tr.item td { border-top: 1px solid #000; }
    .conf.weak { font-weight: 700; }
    .chip {
      display: inline-block; margin-left: 6px; padding: 0 4px;
      border: 1px solid #000; font-size: 7px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .6px; vertical-align: 1px;
    }

    .confirm { border: 1.5px solid #000; padding: 12px 14px; margin-top: 14px; page-break-inside: avoid; }
    .confirm p { font-size: 10.5px; }
    .confirm-list { list-style: none; margin: 9px 0 0; padding: 0; }
    .confirm-list li { display: flex; gap: 8px; margin-bottom: 7px; font-size: 10.5px; }
    .confirm-list .n { font-weight: 700; min-width: 16px; }
    .basis { font-size: 8.5px; color: #333; word-break: break-all; margin-top: 1px; }

    .reply { margin-top: 12px; border-top: 1px solid #000; padding-top: 9px; }
    .reply-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 11px; }
    .reply-row:last-child { margin-bottom: 0; }
    .reply-k { font-size: 8px; text-transform: uppercase; letter-spacing: .7px; white-space: nowrap; }
    .rule { flex: 1; border-bottom: 1px solid #000; height: 13px; }

    footer { margin-top: 16px; padding-top: 9px; border-top: 1px solid #000; font-size: 8.5px; color: #222; }
    footer b { font-size: 9px; }
`;

/**
 * Exported so the document can be checked without a device — the packet is the
 * product, and a PDF is a poor place to discover an escaping bug.
 */
export function buildAdvisorPacketHtml(input: AdvisorPacketInput): string {
  const guardian = input.audience === 'guardian';
  // A guardian needs the comparison the student is actually asking them to
  // approve, so the cost of doing none of this is stated rather than implied.
  const baselineForDisplay =
    input.route.total_cost_usd + input.route.items.reduce((n, i) => n + i.cost_usd, 0) === 0
      ? 0
      : input.route.total_cost_usd;
  const { institution, route, areas, studentName } = input;
  const named = areaNamerFor(areas);

  const who =
    studentName !== undefined && studentName.trim() !== ''
      ? esc(studentName.trim())
      : '<span class="fill"></span>';

  // The campus row and the rows behind the warnings are evidence too, so the
  // vintage line counts them alongside the plan table rather than describing
  // only the part of the page that happens to be a table.
  const vintage = dataVintage(distinctSources(input));
  const preparedOn = todayLocal();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Transfer credit plan — ${esc(institution.name)}</title>
<style>${STYLES}</style>
</head>
<body>
  <h1>${guardian
    ? 'Transfer credit plan — what it costs and what is not yet certain'
    : 'Transfer credit plan — a request for confirmation'}</h1>
  <div class="meta">
    <span>Student: ${who}</span><span class="sep">|</span>
    <span>Target: ${esc(institution.name)} (${esc(input.system.short_name)}) · ${esc(input.framework.full_name)}</span><span class="sep">|</span>
    <span>Plan: ${esc(ROUTE_LABEL[route.kind])}</span><span class="sep">|</span>
    <span>Prepared ${esc(preparedOn)}</span>
  </div>

  <p class="ask">${guardian
    ? `This is my plan for clearing general-education requirements before I transfer to
       ${esc(institution.name)}. It costs ${esc(money(route.total_cost_usd))}, against
       ${esc(money(baselineForDisplay))} to take the same requirements at the campus itself.
       Some rows below are backed by a published policy and some are not, and the ones that
       are not are marked. Before we pay for anything, the numbered items at the foot of this
       page need confirming with the campus — I have not been able to confirm them myself.`
    : `I am planning to earn the credit listed below before I transfer to
       ${esc(institution.name)}, and I would rather find out now than after I have paid for it.
       Some of these rows I could confirm against a published policy; some I could not. Could you
       confirm the numbered items at the foot of this page, and tell me which of them will not
       count here?`}</p>

  ${warningsHtml(route.warnings, institution.name)}

  ${summaryHtml(route, named)}

  <h2>The plan</h2>
  ${planTableHtml(route, named)}

  ${confirmHtml(input, named)}

  <footer>
    <b>${vintage}</b>
    ${esc(DISCLAIMER_LONG)} This document reports what we found and how far we trust it; it is
    a request for confirmation, not an authority, and nothing in it should be relied on until
    ${esc(institution.name)} confirms it.
  </footer>
</body>
</html>`;
}

/**
 * Web has no PDF to hand around: expo-print's web build
 * (node_modules/expo-print/build/ExponentPrint.web.js — read, not recalled) just
 * calls window.print(), which would print the app's own dark screen and resolve
 * with nothing. So print the packet itself, in an offscreen frame.
 */
function printHtmlOnWeb(html: string): void {
  if (typeof document === 'undefined') return;

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  frame.srcdoc = html;

  frame.onload = (): void => {
    const view = frame.contentWindow;
    if (view === null) {
      frame.remove();
      return;
    }
    // The frame has to outlive the dialog — tearing out the document mid-print
    // cancels the job. A browser that never fires afterprint leaves one 0x0
    // node behind, which is the cheaper of the two failures.
    view.onafterprint = (): void => frame.remove();
    view.focus();
    view.print();
  };

  document.body.appendChild(frame);
}

/**
 * Sharing is not everywhere — no share sheet on some builds. The student still
 * needs the document, so hand the PDF to the OS print sheet, which can save or
 * mail it too.
 */
async function deliverWithoutSharing(uri: string): Promise<void> {
  try {
    await Print.printAsync({ uri });
  } catch {
    // iOS rejects when the print window is closed without printing. That is the
    // student changing their mind, not a failure to report.
  }
}

export async function exportAdvisorPacket(input: AdvisorPacketInput): Promise<void> {
  const html = buildAdvisorPacketHtml(input);

  if (Platform.OS === 'web') {
    printHtmlOnWeb(html);
    return;
  }

  // iOS would otherwise add its own print margins on top of the page padding;
  // zeroing them makes the PDF identical on both platforms. Android ignores this
  // field, and the real margin lives in the stylesheet either way.
  const printed: Partial<Print.FilePrintResult> | undefined = await Print.printToFileAsync({
    html,
    margins: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  // Typed Promise<FilePrintResult>, but the module resolves with whatever the
  // native side hands back — web proves the declaration is not a runtime promise.
  // Nothing downstream is worth crashing over a missing uri.
  const uri = printed?.uri;
  if (typeof uri !== 'string' || uri.trim() === '') return;

  if (!(await Sharing.isAvailableAsync())) {
    await deliverWithoutSharing(uri);
    return;
  }

  try {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      // A dialog title is plain text, not markup — it is the one string here that
      // must NOT be escaped, or the advisor sees "Cal Poly &amp; Co".
      dialogTitle: input.audience === 'guardian'
        ? `Plan for ${input.institution.name} — for a parent or guardian`
        : `Advisor packet — ${input.institution.name}`,
    });
  } catch {
    // isAvailableAsync can say yes to a module that still cannot open a sheet.
    // Falling back beats leaving the student holding a PDF they cannot reach.
    await deliverWithoutSharing(uri);
  }
}
