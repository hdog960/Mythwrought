// Walk the supported Glacierlands arch in the original read-only game.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { surveyGlacierArch } from '../../src/frostbound/s5-glacier-arch.mjs';

const root = process.cwd(), seed = 179, x = -97, z = 364, axis = 'z';
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'frostbound-s5-arch');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const arch = surveyGlacierArch(new FrostboundSixRegionsCandidate(seed), x, z, axis);
assert.equal(arch.cells.length, 44);
const start = arch.route[0], roof = [x, arch.origin[1] + 7, z];
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { FrostboundSixRegionsCandidate } from './frostbound/s4-silverwood-barrens.mjs';\n" +
  "import { openGlacierArchWitness, surveyGlacierArch } from './frostbound/s5-glacier-arch.mjs';\n" +
  game.replace(marker, marker + `\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('glacier-arch')){
      const terrain=new FrostboundSixRegionsCandidate(${seed});
      const arch=surveyGlacierArch(terrain,${x},${z},'${axis}');
      storageReadOnly=true;return new Pack2LiveWorld(openGlacierArchWitness(terrain,arch));
    }`);
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    const bytes = path === '/src/main.mjs' ? injected : await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await mkdir(out, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [], diagnostics = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
  });
  await page.goto('http://127.0.0.1:' + server.address().port + '/?glacier-arch=1');
  await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
  if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
  const fence = await page.evaluate(start => {
    const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
    const frame = Number(canvas.dataset.renderedFrames ?? 0);
    api.teleportCave(...start);
    api.setOrientation(Math.PI / 2, .09);
    return frame;
  }, start);
  const ready = await page.waitForFunction(({ start: [x, , z], fence }) => {
    const d = document.querySelector('#scene').dataset, center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
    return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|')) &&
      Number(d.renderedFrames) > fence + 4 && Number(d.pendingChunks) === 0 && Number(d.loadedChunks) === 25;
  }, { start, fence }, { timeout: 30000 });
  await ready.dispose();
  const startView = await page.screenshot({ path: resolve(out, 'approach.png') });
  const pose = () => page.evaluate(() => window.__mythwroughtTest.m5ObservedPose());
  const before = await pose();
  assert.equal(before.seed, seed);
  async function walk(key, target, returning = false) {
    await page.keyboard.down(key);
    try {
      const result = await page.waitForFunction(({ target, returning }) => {
        const pose = window.__mythwroughtTest.m5ObservedPose();
        return pose.onGround && (returning ? pose.x <= target : pose.x >= target);
      }, { target, returning }, { timeout: 20000, polling: 'raf' });
      await result.dispose();
    } finally {
      await page.keyboard.up(key);
    }
    return pose();
  }
  const end = await walk('w', before.x + 8.6);
  const returned = await walk('s', before.x + .35, true);
  assert.ok(Math.abs(end.feet - before.feet) < .12 && Math.abs(returned.feet - before.feet) < .12);
  const state = await page.evaluate(point => {
    const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
    return { roofId: api.block(...point), owners: Number(canvas.dataset.loadedChunks),
      error: canvas.getContext('webgl2').getError(),
      worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
  }, roof);
  assert.equal(state.roofId, 276);
  assert.equal(state.error, 0);
  assert.ok(state.owners <= 25);
  assert.deepEqual(state.worldKeys, []);
  assert.deepEqual(errors, []);
  const report = { seed, chromium: browser.version(), originalSha256: digest(game), injectedSha256: digest(injected),
    diagnostics: [...diagnostics], before, end, returned, roof, ...state, approachSha256: digest(startView) };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
