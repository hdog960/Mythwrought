import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const gameRoot = process.env.P0_CURRENT_SOURCE;
assert.ok(gameRoot, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: gameRoot, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const root = process.cwd(), pinned = resolve(gameRoot), prefix = '/pinned-game/';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<!doctype html><canvas width="64" height="64"></canvas>');
      return;
    }
    const inGame = pathname.startsWith(prefix), directory = inGame ? pinned : root;
    const file = resolve(directory, pathname.slice(inGame ? prefix.length : 1));
    if (!file.startsWith(directory + sep) || !file.endsWith('.mjs')) throw Error('Invalid fixture module');
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + server.address().port + '/');
  const report = await page.evaluate(async () => {
    const require = (ok, message) => { if (!ok) throw Error(message); };
    const worker = new Worker('/tests/forgotten-sands-two-tile/browser-source-worker.mjs', { type: 'module' });
    const messages = [];
    let workerError, frames = 0, frameId = 0;
    const animate = () => { frames++; frameId = requestAnimationFrame(animate); };
    frameId = requestAnimationFrame(animate);
    worker.addEventListener('message', event => messages.push(event.data));
    worker.addEventListener('error', event => { workerError = event.message || 'Source worker failed'; });
    async function expect(type, id) {
      const deadline = performance.now() + 15000;
      while (performance.now() < deadline) {
        if (workerError) throw Error(workerError);
        const failure = messages.find(row => row.type === 'failed');
        if (failure) throw Error(failure.message);
        const match = messages.find(row => row.type === type && row.id === id);
        if (match) return match;
        await new Promise(requestAnimationFrame);
      }
      throw Error('Missing worker response for ' + type);
    }
    const build = { type: 'build', seed: 10301, tiles: [[1, -1], [1, 0]], revision: 'two-tile-replay-v1' };
    try {
      worker.postMessage({ ...build, id: 1 });
      await expect('assembling', 1);
      worker.postMessage({ type: 'cancel', id: 1 });
      await expect('canceled', 1);
      const inFrame = frames;
      worker.postMessage({ ...build, id: 2 });
      const { identity, counts } = await expect('ready', 2);
      const animationFrames = frames - inFrame;
      require(animationFrames > 1, 'The host did not animate while the cold source built');
      require(!messages.some(row => row.type === 'ready' && row.id === 1), 'Canceled build published');
      const gl = document.querySelector('canvas').getContext('webgl2');
      require(gl, 'WebGL2 required');
      const meshes = [];
      for (const site of [0, 1]) {
        worker.postMessage({ type: 'sample', id: 2, manifestSha: identity.manifestSha, site });
        const query = 'meshes-' + site;
        await expect('meshes', 2);
        const index = messages.findIndex(row => row.type === 'meshes' && row.site === site);
        require(index >= 0, 'Unexpected source sample ' + query);
        const [result] = messages.splice(index, 1);
        require(result.manifestSha === identity.manifestSha, 'Stale manifest reached GPU staging');
        for (const { cx, cz, section, vertices } of result.meshes) {
          const buffer = gl.createBuffer();
          require(buffer && vertices instanceof Float32Array && vertices.byteLength > 0, 'Empty mesh transfer');
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
          const bytes = new Uint8Array(vertices.byteLength);
          gl.getBufferSubData(gl.ARRAY_BUFFER, 0, bytes);
          const expected = new Uint8Array(vertices.buffer, vertices.byteOffset, vertices.byteLength);
          require(bytes.every((value, i) => value === expected[i]), 'GPU source bytes differ from worker bytes');
          gl.deleteBuffer(buffer);
          require(gl.getError() === gl.NO_ERROR, 'Browser GPU upload or retirement failed');
          const digest = await crypto.subtle.digest('SHA-256', bytes);
          meshes.push({ cx, cz, section, bytes: bytes.length, sha256: Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('') });
        }
      }
      return { manifest: identity.manifestSha, counts, animationFrames, canceledBuildPublished: false, meshes };
    } finally {
      cancelAnimationFrame(frameId);
      worker.terminate();
    }
  });
  assert.equal(report.manifest, 'a4f9c90de15992a2c4d9833ec18af316101ead86c0485227a42057b475e33249');
  assert.equal(report.meshes.length, 4);
  assert.equal(report.meshes.reduce((sum, row) => sum + row.bytes, 0), 395928);
  const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'forgotten-sands-tile-worker');
  await mkdir(out, { recursive: true });
  await writeFile(resolve(out, 'report.json'), JSON.stringify({ game: P0_TILE_BASE, chromium: browser.version(), ...report }, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
