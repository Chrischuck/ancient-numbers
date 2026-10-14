import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
const root = new URL('../dist/', import.meta.url);
const walk = async (path) => {
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const p = join(path, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(p)));
    else result.push(p);
  }
  return result;
};
const files = await walk(fileURLToPath(root));
const html = files.filter((f) => f.endsWith('.html'));
assert.equal(
  html.length,
  40,
  'Home, collection, about, 404, and36 system pages must be generated.',
);
for (const p of html) {
  const text = await readFile(p, 'utf8');
  for (const [, url] of text.matchAll(/(?:href|src)="(\/[^\"]*)"/g)) {
    assert.ok(url.startsWith('/ancient-numbers/'), `${p}: unprefixed asset or link ${url}`);
    const pathname = url.split(/[?#]/)[0].replace('/ancient-numbers/', '');
    let target = join(fileURLToPath(root), decodeURIComponent(pathname));
    if (url.endsWith('/') || pathname === '') target = join(target, 'index.html');
    try {
      await stat(target);
    } catch {
      assert.fail(`${p}: missing local target ${url}`);
    }
  }
}
const home = await readFile(new URL('index.html', root), 'utf8');
const scripts = [...home.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) =>
  join(fileURLToPath(root), m[1].replace('/ancient-numbers/', '')),
);
const visited = new Set();
async function countScript(path) {
  if (visited.has(path)) return 0;
  visited.add(path);
  const data = await readFile(path);
  let bytes = gzipSync(data).length;
  for (const [, relative] of data.toString().matchAll(/(?:from|import)\s*["'](\.[^"']+\.js)["']/g))
    bytes += await countScript(join(dirname(path), relative));
  return bytes;
}
let js = 0;
for (const path of scripts) js += await countScript(path);
assert.ok(js < 60 * 1024, `Initial JS exceeds60KB: ${js}`);
let initial = gzipSync(home).length + js;
const fonts = new Set();
for (const [, src] of home.matchAll(/<link[^>]+href="([^"]+\.css)"/g)) {
  const path = join(fileURLToPath(root), src.replace('/ancient-numbers/', ''));
  const data = await readFile(path);
  initial += gzipSync(data).length;
  for (const [, font] of data.toString().matchAll(/url\(([^)]+\.woff2)\)/g))
    fonts.add(join(fileURLToPath(root), font.replace('/ancient-numbers/', '')));
}
for (const font of fonts) initial += (await stat(font)).size;
assert.ok(initial < 250 * 1024, `Initial transfer estimate exceeds250KB: ${initial}`);
assert.ok(!files.some((f) => /server|functions/.test(f)), 'Build must contain only static assets.');
console.log(
  `Verified40 static pages and repository-prefixed links. Initial JS graph: ${(js / 1024).toFixed(1)}KB gzip; initial transfer estimate: ${(initial / 1024).toFixed(1)}KB.`,
);
