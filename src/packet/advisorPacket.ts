/**
 * Advisor packet — the artefact that leaves the phone.
 *
 * Every screen in this app is a conversation with the student; this is the
 * document they email their academic advisor. So it drops the dark theme
 * entirely: black on white, real margins, and every source URL spelled out in
 * full, because a printed hyperlink is a dead end.
 *
 * The document never asserts. Each row states how far we trust it, and the rows
 * we do not trust are lifted into a numbered block whose entire purpose is to be
 * replied to — "item 3 is fine, item 5 is not".
 */
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Confidence, Institution, PlanItem, Provenance, Route, RouteKind } from '../types.ts';
import { confidenceLabel, money } from '../ui/theme.ts';

export interface AdvisorPacketInput {
  institution: Institution;
  route: Route;
  /** Optional: absent, the document prints a rule for the student to sign by hand. */
  studentName?: string;
}

/**
 * The same bar the engine's lowest-risk route uses. Anything below it is not a
 * claim we are willing to make on a student's behalf — it is a question for the
 * advisor, and the packet asks it as one.
 */
const CONFIRMED = new Set<Confidence>(['statute', 'published']);

/**
 * A row is a claim only if it says where it came from. 'published' with an empty
 * source_url is a row nobody can check, so it goes in the confirm list with the
 * rest rather than printing as settled.
 */
const needsConfirming = (p: Provenance): boolean =>
  !CONFIRMED.has(p.confidence) || p.source_url.trim() === '';

const ROUTE_LABEL: Record<RouteKind, string> = {
  cheapest: 'cheapest route',
  fastest: 'fastest route',
  lowest_risk: 'lowest-risk route',
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

/** Only an http(s) source can carry an anchor; anything else prints as plain text. */
const linkable = (url: string): boolean => /^https?:\/\//i.test(url.trim());

/**
 * Seeded rows carry an empty as_of. Saying so is the honest reading — and it is
 * set in the same italic as a missing source, so it cannot be skimmed as a date.
 */
const checkedHtml = (p: Provenance): string =>
  p.as_of.trim() === '' ? '<span class="missing">never</span>' : esc(p.as_of);

/** The same fact as a clause rather than a field value, for running prose. */
const checkedPhrase = (p: Provenance): string =>
  p.as_of.trim() === '' ? 'never checked' : `checked ${p.as_of}`;

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
 * The plan carries the Cal-GETC area id, not its name, and the packet will not
 * invent one: an advisor reads "3B" natively, and a name typed in here would be a
 * second, unsourced copy of a dataset row.
 */
const areaLabel = (area: string | null): string =>
  area === null ? 'Elective credit — clears no area' : `Cal-GETC area ${area}`;

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

/** What this plan assumes about the campus itself — the row behind the warnings. */
function campusPolicyClaim(inst: Institution): string {
  const clep = inst.accepts_clep ? 'awards credit for CLEP' : 'awards no credit for CLEP';
  const cap =
    inst.max_transfer_units === null
      ? 'no transfer-unit cap in our data'
      : `transfer credit capped at ${inst.max_transfer_units} units`;
  return `${inst.name} ${clep}; ${cap}; ${inst.residency_min_units} units must be earned on campus.`;
}

/** Item row plus its source row, kept together as one tbody so a page break cannot split them. */
function itemHtml(item: PlanItem, n: number): string {
  const flagged = needsConfirming(item.provenance);
  const note = item.provenance.note?.trim() ?? '';

  return `
      <tbody class="row${flagged ? ' flagged' : ''}">
        <tr class="item">
          <td class="num">${n}</td>
          <td class="what">${esc(item.label)}${flagged ? '<span class="chip">confirm</span>' : ''}</td>
          <td class="fig">${item.units}</td>
          <td>${esc(areaLabel(item.satisfies_area))}</td>
          <td class="fig">${money(item.cost_usd)}</td>
          <td class="conf${flagged ? ' weak' : ''}">${esc(confidenceLabel(item.provenance.confidence))}</td>
        </tr>
        <tr class="src">
          <td></td>
          <td colspan="5">
            <span class="k">Source</span> ${sourceHtml(item.provenance)}
            <span class="k">Checked</span> ${checkedHtml(item.provenance)}
            ${note === '' ? '' : `<div class="note"><span class="k">Note</span> ${esc(note)}</div>`}
          </td>
        </tr>
      </tbody>`;
}

function planTableHtml(route: Route): string {
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
      ${route.items.map((item, i) => itemHtml(item, i + 1)).join('')}
    </table>`;
}

/**
 * Warnings are the most valuable thing this app says, so in print they get a
 * heavy rule and bold text rather than a colour — an advisor's office printer is
 * usually greyscale. Reproduced exactly as the engine phrased them.
 */
function warningsHtml(warnings: string[], instName: string): string {
  if (warnings.length === 0) {
    return `
    <section class="alert quiet">
      <h2>No blocking constraints found</h2>
      <p>Our data turned up nothing at ${esc(instName)} that would strand or cap this credit.
      That is the absence of a known problem, not a guarantee.</p>
    </section>`;
  }

  return `
    <section class="alert">
      <h2>Read this first — constraints on this plan</h2>
      <ul>
        ${warnings.map(w => `<li>${esc(w)}</li>`).join('')}
      </ul>
    </section>`;
}

/**
 * The reply form. Numbering runs off the plan table so "item 3" means one thing
 * across the whole document, and the campus-policy row is appended after the last
 * table row rather than competing for a number with it.
 */
function confirmHtml(input: AdvisorPacketInput): string {
  const { institution, route } = input;

  const flagged = route.items
    .map((item, i) => ({ item, n: i + 1 }))
    .filter(({ item }) => needsConfirming(item.provenance));

  const campusFlagged = needsConfirming(institution.provenance);
  const campusN = route.items.length + 1;

  const entries: string[] = flagged.map(({ item, n }) => {
    const claim =
      item.satisfies_area === null
        ? `we expect ${units(item.units)} of elective credit, clearing no Cal-GETC area`
        : `we expect it to clear Cal-GETC area ${esc(item.satisfies_area)} for ${units(item.units)}`;

    return `
        <li>
          <span class="n">${n}.</span>
          <div>
            <b>${esc(item.label)}</b> — ${claim}.
            <div class="basis">
              ${esc(confidenceLabel(item.provenance.confidence))} ·
              ${sourceHtml(item.provenance)} · ${esc(checkedPhrase(item.provenance))}
            </div>
          </div>
        </li>`;
  });

  if (campusFlagged) {
    entries.push(`
        <li>
          <span class="n">${campusN}.</span>
          <div>
            <b>Campus policy</b> (not a row in the table above) — ${esc(campusPolicyClaim(institution))}
            <div class="basis">
              ${esc(confidenceLabel(institution.provenance.confidence))} ·
              ${sourceHtml(institution.provenance)} · ${esc(checkedPhrase(institution.provenance))}
            </div>
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

  const body =
    entries.length === 0
      ? `<p>Every row in this plan is backed by statute or by a published policy page we can
         point you at. There is nothing here we are guessing at — but policies change between
         catalogue years, so a confirmation that none of it has moved would still be worth having.</p>`
      : `<p>These are the items we could <b>not</b> confirm against statute or a published
         policy page.${matchesTable}</p>
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

function summaryHtml(route: Route): string {
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
      ? 'No Cal-GETC area is cleared by this plan.'
      : `Clears ${route.areas_cleared.length} Cal-GETC area${route.areas_cleared.length === 1 ? '' : 's'}: ${esc(route.areas_cleared.join(', '))}.`;

  const unmet =
    route.areas_unmet.length === 0
      ? 'Every area in our data is accounted for.'
      : `Still unmet: ${esc(route.areas_unmet.join(', '))}.`;

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
    h1, h2, th, .chip, .k, .total, .facts b, .reply-k, .num, .fig, .conf {
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
    .total-basis { font-size: 8.5px; color: #444; margin-top: 5px; max-width: 150px; }
    .total-basis.flagged {
      color: #000; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
      border: 1.5px solid #000; padding: 2px 4px; display: inline-block;
    }

    .ask { margin: 0 0 12px; font-size: 11px; }

    .alert { border: 3px solid #000; background: #f1f1f1; padding: 11px 13px; margin: 0 0 14px; page-break-inside: avoid; }
    .alert ul { margin: 0; padding-left: 16px; }
    .alert li { font-size: 11px; font-weight: 700; margin-bottom: 5px; }
    .alert li:last-child { margin-bottom: 0; }
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
  const { institution, route, studentName } = input;

  const who =
    studentName !== undefined && studentName.trim() !== ''
      ? esc(studentName.trim())
      : '<span class="fill"></span>';

  // The campus row is evidence too: it is what the engine's warnings rest on.
  const vintage = dataVintage([institution.provenance, ...route.items.map(i => i.provenance)]);
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
  <h1>Transfer credit plan — a request for confirmation</h1>
  <div class="meta">
    <span>Student: ${who}</span><span class="sep">|</span>
    <span>Target: ${esc(institution.name)} (${esc(institution.system)})</span><span class="sep">|</span>
    <span>Plan: ${esc(ROUTE_LABEL[route.kind])}</span><span class="sep">|</span>
    <span>Prepared ${esc(preparedOn)}</span>
  </div>

  <p class="ask">I am planning to earn the credit listed below before I transfer to
  ${esc(institution.name)}, and I would rather find out now than after I have paid for it.
  Some of these rows I could confirm against a published policy; some I could not. Could you
  confirm the numbered items at the foot of this page, and tell me which of them will not
  count here?</p>

  ${warningsHtml(route.warnings, institution.name)}

  ${summaryHtml(route)}

  <h2>The plan</h2>
  ${planTableHtml(route)}

  ${confirmHtml(input)}

  <footer>
    <b>${vintage}</b>
    Transfer and credit-by-exam policies change between catalogue years, and a policy page
    that was accurate when it was read may not be accurate today. This document reports what
    we found and how far we trust it; it is a request for confirmation, not an authority, and
    nothing in it should be relied on until ${esc(institution.name)} confirms it.
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
      dialogTitle: `Advisor packet — ${input.institution.name}`,
    });
  } catch {
    // isAvailableAsync can say yes to a module that still cannot open a sheet.
    // Falling back beats leaving the student holding a PDF they cannot reach.
    await deliverWithoutSharing(uri);
  }
}
