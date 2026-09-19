/**
 * Builds the static pages that sit beside the app: the landing page, and the
 * privacy policy and terms rendered from the Markdown that is already the
 * single source of truth for both.
 *
 * Why render rather than hand-write HTML copies: every app store requires a
 * PUBLIC URL for the privacy policy, and a second copy of that text is a second
 * copy to forget to update. The Markdown stays canonical; this produces the URL.
 *
 * Vercel checks the filesystem before applying rewrites, so `dist/start/…`
 * serves at `/start` and only genuine misses fall through to the app's SPA
 * rewrite. Nothing in `vercel.json` needs to know these exist.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A deliberately small Markdown subset — headings, paragraphs, lists, rules,
 * bold, italics, code and links — because that is all PRIVACY.md and TERMS.md
 * use. It asserts at the end that nothing unconverted survived, so the day
 * someone adds a table to those files this fails loudly instead of printing
 * pipes at a regulator.
 */
function render(md) {
  const out = [];
  let list = null;      // 'ul' | 'ol' | null
  let para = [];        // soft-wrapped lines awaiting a flush
  let item = [];        // the list item currently being accumulated

  const inline = (t) =>
    esc(t)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, a, b) => `<a href="${b}">${a}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])_([^_]+)_/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  // Markdown paragraphs and list items are SOFT-WRAPPED, so emphasis routinely
  // opens on one line and closes on the next. Rendering line by line left
  // literal asterisks in the middle of the privacy policy. Join first, mark up
  // second — never the other way round.
  const flushItem = () => {
    if (item.length > 0) { out.push(`<li>${inline(item.join(' '))}</li>`); item = []; }
  };
  const flushPara = () => {
    if (para.length > 0) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };
  const closeList = () => {
    flushItem();
    if (list !== null) { out.push(`</${list}>`); list = null; }
  };
  const flushAll = () => { flushPara(); closeList(); };

  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line.startsWith('<!--')) continue;             // editorial notes stay private
    if (line.trim() === '') { flushAll(); continue; }
    if (line === '---') { flushAll(); out.push('<hr>'); continue; }

    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h !== null) {
      flushAll();
      out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
      continue;
    }

    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul !== null || ol !== null) {
      flushPara();
      const kind = ul !== null ? 'ul' : 'ol';
      if (list !== kind) { closeList(); out.push(`<${kind}>`); list = kind; }
      else { flushItem(); }
      item.push((ul ?? ol)[1]);
      continue;
    }

    // A continuation line: part of the open list item, or of the paragraph.
    if (list !== null && item.length > 0) { item.push(line.trim()); continue; }
    para.push(line.trim());
  }
  flushAll();

  const html = out.join('\n');
  // Anything the subset above cannot express must fail the build rather than
  // print raw syntax on a page a regulator or an app reviewer will read.
  const leftover = /\*\*|^\s*\||\|\s*-{3,}|^\s*#{1,6}\s/m.exec(html);
  if (leftover !== null) {
    throw new Error(
      `build-landing: unsupported Markdown reached the output (${leftover[0].trim()}). ` +
      'Extend render() rather than shipping raw syntax on a legal page.',
    );
  }
  return html;
}

const page = (title, body) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — Degree Route</title>
<style>
  :root{--bg:#0B0F14;--text:#F2F6FA;--muted:#8A97A6;--accent:#5BE895;--border:#26313D}
  body{background:var(--bg);color:var(--text);margin:0;
    font:400 17px/1.65 Inter,-apple-system,'Segoe UI',Roboto,sans-serif;
    -webkit-font-smoothing:antialiased}
  main{max-width:680px;margin:0 auto;padding:48px 20px 72px}
  h1{font-size:34px;letter-spacing:-0.5px;line-height:1.15;margin:0 0 24px}
  h2{font-size:22px;margin:36px 0 12px}
  h3{font-size:18px;margin:28px 0 8px}
  p,li{color:var(--muted)} strong{color:var(--text)}
  a{color:var(--accent)} code{background:#1C2530;padding:1px 5px;border-radius:4px;font-size:15px}
  hr{border:0;border-top:1px solid var(--border);margin:32px 0}
  nav{margin:0 0 32px;font-size:15px}
</style>
</head><body><main>
<nav><a href="/start">← Degree Route</a></nav>
${body}
</main></body></html>
`;

function write(path, contents) {
  const full = join(DIST, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
  console.log('wrote', path);
}

if (!existsSync(DIST)) {
  throw new Error('build-landing: dist/ does not exist — run the Expo export first.');
}

write('start/index.html', readFileSync(join(ROOT, 'landing/index.html'), 'utf8'));
for (const [src, slug, title] of [
  ['PRIVACY.md', 'privacy', 'Privacy Policy'],
  ['TERMS.md', 'terms', 'Terms'],
]) {
  write(`${slug}/index.html`, page(title, render(readFileSync(join(ROOT, src), 'utf8'))));
}

const og = join(ROOT, 'docs/store/og.png');
if (existsSync(og)) { copyFileSync(og, join(DIST, 'og.png')); console.log('wrote og.png'); }
else { console.log('og.png not generated yet — skipping (the page falls back to no preview image)'); }
