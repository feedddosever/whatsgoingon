/**
 * Is this thing actually submittable?
 *
 * Every other check in this repo answers a question about the DATA. This one
 * answers the question about the submission, because "what is still missing?"
 * kept being answered from memory and kept being wrong — the icon was called a
 * blocker after it was fixed, and the legal pages were called done while their
 * contact line was still a placeholder.
 *
 * Exits non-zero when something would actually stop a submission. Warnings are
 * things a human has to do that no script can verify.
 *
 *   npm run preflight
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const has = (p) => existsSync(join(ROOT, p));

const blockers = [];
const warnings = [];
const ok = [];

const check = (label, condition, fix) => {
  if (condition) ok.push(label);
  else blockers.push(`${label} — ${fix}`);
};
const soft = (label, condition, fix) => {
  if (condition) ok.push(label);
  else warnings.push(`${label} — ${fix}`);
};

// ---- Next Gen: the category that needs no store release ----
check('LICENSE present', has('LICENSE'),
  'Next Gen requires a public repo with a licence file');
check('Repo is public', true, 'verified by hand: github.com/feedddosever/whatsgoingon');
check('Devpost copy written', has('docs/DEVPOST.md'), 'write docs/DEVPOST.md');
check('Demo video script written', has('docs/DEMO-VIDEO.md'), 'write docs/DEMO-VIDEO.md');
soft('Demo video RECORDED and public', false,
  'nothing here can check this. Shoot it — docs/DEMO-VIDEO.md is the shot list');
soft('Academic email verified on Devpost', false,
  'Next Gen is lost on this alone. Verify it on the profile, not just enter it');

// ---- Anything that needs a store release ----
const email = (process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '').trim();
check('Support address configured', email !== '',
  'set EXPO_PUBLIC_SUPPORT_EMAIL. It fills the app, /privacy, /terms and the '
  + 'store listing from one place. Every store requires a monitored address');
for (const f of ['PRIVACY.md', 'TERMS.md']) {
  check(`${f} has no unresolved TODO`, !/TODO before publishing/.test(read(f)),
    'resolve it before submitting');
}
check('eas.json present', has('eas.json'), 'needed to build the APK');
check('APK build documented', has('docs/BUILD-APK.md'), 'write docs/BUILD-APK.md');

// ---- Store assets ----
check('Icon is not the Expo template',
  has('assets/icon.png') && statSync(join(ROOT, 'assets/icon.png')).size > 50_000
    && has('scripts/art/icon.html'),
  'the template icon reads as abandoned on a listing');
const shots = ['01-questions', '02-state-guarantee', '03-routes', '04-plan-map',
  '05-breakdown', '06-any-state'];
check(`${shots.length} store screenshots`,
  shots.every(s => has(`docs/store/screenshots/${s}.png`)),
  'run `node scripts/shots.mjs` against a served build');
soft('Tablet screenshots', false,
  'the phone set exists. Galaxy Store wants tablet shots too — take them on the Tab S6 Lite');
check('Link-preview card', has('docs/store/og.png'), 'render docs/store/og.png');

// ---- RevenueCat: the SDK is mandatory for every category ----
const cfg = read('src/purchases/config.ts');
check('Entitlement id set', /ENTITLEMENT_ID = '[^']+'/.test(cfg), 'set it in config.ts');
check('Both platform SDKs wired',
  has('src/purchases/revenuecat.ts') && has('src/purchases/revenuecat.web.ts'),
  'native and web implementations are both required');
soft('A purchase completed on hardware', false,
  'the paywall and Customer Center have never run on a device. One sandbox '
  + 'purchase on camera is worth more to a RevenueCat judge than any other five seconds');

// ---- The product itself ----
soft('#BuildInPublic posting started', false,
  'judged on the journey you posted. Worth nothing without a posting history');

const label = (n) => `${n}`.padStart(2, ' ');
console.log(`\n✓ ${label(ok.length)} ready`);
for (const o of ok) console.log(`     ${o}`);
if (warnings.length > 0) {
  console.log(`\n·  ${label(warnings.length)} need a human — no script can verify these`);
  for (const w of warnings) console.log(`     ${w}`);
}
if (blockers.length > 0) {
  console.log(`\n✗ ${label(blockers.length)} would stop a submission`);
  for (const b of blockers) console.log(`     ${b}`);
}
console.log('');
process.exit(blockers.length > 0 ? 1 : 0);
