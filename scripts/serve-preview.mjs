import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/ancient-numbers/')) {
      res.writeHead(404);
      res.end('Use /ancient-numbers/');
      return;
    }
    const relative = decodeURIComponent(url.pathname.slice('/ancient-numbers/'.length));
    let path = resolve(root, relative);
    if (path !== resolve(root) && !path.startsWith(resolve(root) + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    let data = await readFile(path);
    const ext = extname(path);
    res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream');
    if (/html|js|css|svg/.test(ext) && req.headers['accept-encoding']?.includes('gzip')) {
      data = gzipSync(data);
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
    }
    res.setHeader('Content-Length', data.length);
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(join(root, '404.html')));
  }
});
server.listen(4322, '127.0.0.1', () =>
  console.log('Static preview: http://127.0.0.1:4322/ancient-numbers/'),
);
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
