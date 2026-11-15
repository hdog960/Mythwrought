'use strict';
// Infrastructure-only neutral response for Chromium's automatic, optional
// favicon lookup during the exact-source Pack 1 GPU gallery test.
// This does NOT change the candidate test, game code, block definitions,
// WebGL2 rendering, real network assets, or any non-favicon permission.
const http = require('node:http');
const {syncBuiltinESMExports} = require('node:module');
const sourceCreateServer = http.createServer;
http.createServer = function(requestListener, ...other) {
  if (typeof requestListener !== 'function')
    return sourceCreateServer.apply(this, arguments);
  const wrappedListener = (request, response) => {
    if (request.method === 'GET' && request.url === '/favicon.ico') {
      response.writeHead(204, {'Cache-Control':'no-store'});
      response.end();
      process.stdout.write('PACK1_INFRA_AUX_FAVICON_204 GET /favicon.ico\n');
      return;
    }
    // Preserve the source server's own 403 policy for every other path.
    return requestListener(request, response);
  };
  return sourceCreateServer.call(this, wrappedListener, ...other);
};
syncBuiltinESMExports();
