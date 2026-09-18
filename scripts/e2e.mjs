/**
 * End-to-end driver for the built web bundle.
 *
 * Uses playwright-core rather than playwright on purpose: playwright's
 * postinstall downloads a browser on every install, which is a slow or failing
 * step on a deploy host. The browser is already on this machine, so we point at
 * it instead.
 *
 * Usage: node scripts/e2e.mjs <url>
 */
import { chromium } from 'playwright-core';

const CHROME = process.env.E2E_CHROME
  ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

export async function openApp(url, viewport = { width: 390, height: 844 }) {
  const browser = await chromium.launch({ executablePath: CHROME });
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(`PAGEERROR: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  return { browser, page, errors };
}

export const text = (page) => page.evaluate(() => document.body.innerText);

export const lines = async (page) =>
  (await text(page)).split('\n').map(s => s.trim());

/** The root node's cost on the plan map, read structurally rather than by regex. */
export async function rootCost(page) {
  const l = await lines(page);
  const i = l.findIndex(x => /^(UC|CSU) · \d+ requirement/.test(x));
  return i >= 0 ? l[i + 1] : null;
}

export const tapExact = async (page, label) => {
  await page.getByText(label, { exact: true }).first().click();
  await page.waitForTimeout(300);
};

export const tapButton = async (page, re) => {
  await page.locator('[role="button"]').filter({ hasText: re }).first().click();
  await page.waitForTimeout(500);
};
