import { chromium } from 'playwright-core';
const CHROME = process.env.E2E_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = '/home/user/whatsgoingon/docs/store/screenshots';
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.62 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e.message)));
await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
const tap = async (t) => { await page.getByText(t, { exact: true }).first().click(); await page.waitForTimeout(400); };
const btn = async (re) => { await page.locator('[role="button"]').filter({ hasText: re }).first().click(); await page.waitForTimeout(500); };
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n); };

// The onboarding is one question per screen now, so the store gets its greeting
// and one representative question rather than the old all-in-one form.
await shot('01-welcome');
await btn(/Let.s go/);
await tap('11th grade'); await page.waitForTimeout(300);
await shot('01b-one-question');
await tap('Not decided yet'); await page.waitForTimeout(300);
await btn(/^Skip$/);
await tap('Not sure'); await page.waitForTimeout(300);
await tap('Texas');
await shot('02-state-guarantee');
await btn(/^Next$/);
await tap('UT Austin'); await page.waitForTimeout(300);
// Walk the rest, answering "no" to every yes/no and skipping every list.
for (let i = 0; i < 20; i++) {
  const t = await page.evaluate(() => document.body.innerText);
  if (/Price my route to/.test(t)) break;
  if (/Are you in the IB|Did you study A Levels|another college\?|non-traditional/.test(t)) { await tap('No'); await page.waitForTimeout(300); continue; }
  await btn(/None of these|^Next$|^Skip$/);
}
await btn(/^Price my route to/);
// The salad plays once before the routes; let it finish.
await page.waitForTimeout(3000);
await shot('03-routes');
await page.getByText('See the plan, row by row →').first().click();
await page.waitForTimeout(600);
await shot('04-plan-map');
await tap('See the full breakdown');
await shot('05-breakdown');

// The answer a student in one of the 48 states without campus pricing gets.
// Worth photographing precisely because it is the app declining to overreach.
// A saved plan reopens on the map, which is right for a student and wrong here.
await page.evaluate(() => localStorage.clear());
await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await btn(/Let.s go/);
await tap('12th grade'); await page.waitForTimeout(300);
await tap('Not decided yet'); await page.waitForTimeout(300);
await btn(/^Skip$/);
await tap('Not sure'); await page.waitForTimeout(300);
await tap('Another state');
await tap('OH');
await shot('06-any-state');
await b.close();
console.log('ERRORS:', errs.join('; ') || 'none');
