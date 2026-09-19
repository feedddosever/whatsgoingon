import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasContact, waitlistMailto } from './contact.ts';
import { unitedStates as us } from './dataset.ts';

const ohio = us.jurisdictions.find(j => j.code === 'OH');

test('the waitlist link degrades rather than lying when no address is set', () => {
  // With no EXPO_PUBLIC_SUPPORT_EMAIL the app must not offer a way to get in
  // touch that silently goes nowhere — every caller gates on this.
  assert.equal(hasContact(), false, 'no address is configured in this environment');
});

test('the waitlist link names the state, in both the subject and the body', () => {
  assert.ok(ohio);
  const href = waitlistMailto(ohio);
  assert.match(href, /^mailto:/);
  assert.ok(href.includes(encodeURIComponent('Map Ohio')), 'subject carries the state');
  assert.ok(href.includes(encodeURIComponent('in Ohio')), 'body carries the state');
});

test('every unmapped state can be asked for by name', () => {
  // The link is built for whichever state the student taps, so a state whose
  // name breaks encoding would produce a dead button for exactly the people
  // this feature exists to catch.
  for (const jur of us.jurisdictions) {
    const href = waitlistMailto(jur);
    assert.ok(href.includes(encodeURIComponent(`Map ${jur.name}`)), `${jur.code} subject`);
    assert.doesNotThrow(() => new URL(href), `${jur.code} produced an unparseable link`);
  }
});
