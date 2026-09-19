/**
 * Renders the icon HTML sources in `scripts/art/` to PNG through the same
 * Chromium the e2e driver uses.
 *
 * HTML rather than a binary: the next icon change should be an edit to a shape,
 * not a redraw, and the source belongs in git where it can be reviewed.
 *
 * Usage (from the repo root, so playwright-core resolves):
 *   node scripts/art/render.mjs '[{"html":"/abs/path.html","w":1024,"h":1024,"out":"assets/icon.png"}]'
 *
 * Pass "transparent": true for the adaptive-icon layers — `omitBackground`
 * only drops the page's DEFAULT background, so the source must also declare
 * `background: transparent` or the PNG comes back opaque.
 */
import { chromium } from 'playwright-core';
const CHROME = process.env.E2E_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const jobs = JSON.parse(process.argv[2]);
const b = await chromium.launch({ executablePath: CHROME });
for (const j of jobs) {
  const p = await b.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await p.goto('file://' + j.html);
  if (j.js) await p.evaluate(j.js);
  await p.waitForTimeout(200);
  await p.locator('#c').screenshot({ path: j.out, omitBackground: !!j.transparent });
  await p.close();
  console.log('wrote', j.out);
}
await b.close();
