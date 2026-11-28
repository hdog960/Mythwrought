// Original-game rendering of an upper-section pool from its supported bank.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { ShatteredPeaksStrataWorld } from '../../src/manual-biomes/shattered-peaks-strata.mjs';
import { surveySkywaterPool } from '../../src/manual-biomes/shattered-peaks-skywater.mjs';

const root = process.cwd(), seed = 179, x = -361, z = 34;
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'shattered-peaks-skywater');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const terrain = new ShatteredPeaksStrataWorld(seed), pool = surveySkywaterPool(terrain, x, z);
assert.equal(pool.cells.length, 9);
const [sx, sz] = pool.shores[0];
const camera = [sx, terrain.terraceColumn(sx, sz).topY + 1, sz];
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { ShatteredPeaksStrataWorld } from './manual-biomes/shattered-peaks-strata.mjs';\n" +
  "import { surveySkywaterPool, openSkywaterPoolWitness } from './manual-biomes/shattered-peaks-skywater.mjs';\n" +
  game.replace(marker, marker + `\n    const mode=developerWorldFixtures&&new URLSearchParams(location.search).get('skywater-proof');
    if(mode){
      const terrain=new ShatteredPeaksStrataWorld(${seed});
      storageReadOnly=true;
      return mode==='wet'?openSkywaterPoolWitness(terrain,surveySkywaterPool(terrain,${x},${z})):new Pack2LiveWorld(terrain);
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
  const rows = [], errors = [], diagnostics = new Set();
  for (const mode of ['dry', 'wet']) {
    const context = await browser.newContext({ viewport: { width: 956, height: 440 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?skywater-proof=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    const fence = await page.evaluate(({ camera, origin }) => {
      const api = window.__mythwroughtTest, d = document.querySelector('#scene').dataset;
      const frame = Number(d.renderedFrames ?? 0);
      api.teleportCave(...camera);
      api.aimAt(...origin);
      return frame;
    }, { camera, origin: pool.origin });
    const settled = await page.waitForFunction(({ camera: [x, , z], fence, wet }) => {
      const d = document.querySelector('#scene').dataset, center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
      return d.chunkCenter?.startsWith(center + '|') && Number(d.renderedFrames) > fence + 4 &&
        Number(d.pendingChunks) === 0 && Number(d.loadedChunks) === 25 && Number(d.waterSections) === Number(wet);
    }, { camera, fence, wet: mode === 'wet' }, { timeout: 30000 });
    await settled.dispose();
    const state = await page.evaluate(origin => {
      const canvas = document.querySelector('#scene'), d = canvas.dataset, api = window.__mythwroughtTest;
      return { id: api.block(...origin), pose: api.m5ObservedPose(), owners: Number(d.loadedChunks),
        waterOwners: Number(d.waterSections), upperOwners: Number(d.upperGpuOwners), upperBytes: Number(d.upperGpuBytes),
        error: canvas.getContext('webgl2').getError(), worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
    }, pool.origin);
    assert.equal(state.pose.seed, seed);
    assert.equal(state.id, mode === 'wet' ? 76 : terrain.get(...pool.origin));
    assert.equal(state.error, 0);
    assert.ok(state.upperOwners <= 8 && state.upperBytes <= 7077888);
    assert.deepEqual(state.worldKeys, []);
    const file = mode + '.png', screenshot = await page.screenshot({ path: resolve(out, file) });
    rows.push({ mode, file, sha256: digest(screenshot), ...state });
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.notEqual(rows[0].sha256, rows[1].sha256);
  const report = { seed, chromium: browser.version(), origin: pool.origin, camera,
    originalSha256: digest(game), injectedSha256: digest(injected), diagnostics: [...diagnostics], rows };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
