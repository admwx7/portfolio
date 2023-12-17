import { context } from 'esbuild';
import fs from 'node:fs';
import http from 'node:http';

import config from './esbuild.config.mjs';

const HOST = 'localhost';
const INTERVAL = 1000;
const PORT = '3000';

const serve = async () => {
  const CTX = await context(config);
  const { host, port } = await CTX.serve({
    servedir: 'dist',
  });
  // Setup a proxy server
  http
    .createServer((req, res) => {
      const { url, method, headers } = req;
      const hasExtension = /.*\..*$/.test(url);
      let path;
      if (hasExtension && !url.endsWith('/index.html')) {
        const parts = url.split('/').reverse();
        for (let i = parts.length - 1; i >= 0; i -= 1) {
          if (['css', 'js', 'assets'].includes(parts[i])) break;
          parts.pop();
        }
        path = `/${parts.reverse().join('/')}`;
      } else if (url.endsWith('esbuild')) {
        path = '/esbuild';
      } else {
        path = '/index.html';
      }

      const options = {
        hostname: host,
        port,
        path,
        method,
        headers,
      };

      // Forward each incoming request to esbuild
      const proxyReq = http.request(options, (proxyRes) => {
        // Redirect 404 to index
        if (proxyRes.statusCode === 404) {
          try {
            const indexFile = fs.readFileSync('dist/index.html');
            res.writeHead(200, {
              // ...proxyRes.headers,
              'Content-Location': '/index.html',
              'Content-Type': 'text/html',
            });
            res.end(indexFile);
            return;
          } catch (e) {
            // eslint-disable-next-line
            console.error('Could not file index file', e);
          }
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      // Forward the body of the request to esbuild
      req.pipe(proxyReq, { end: true });
    })
    .listen(PORT, () => {
      // eslint-disable-next-line
      console.log(`Server available on http://${HOST}:${PORT}`);
    });

  setInterval(() => CTX.rebuild(), INTERVAL);
};

serve();
