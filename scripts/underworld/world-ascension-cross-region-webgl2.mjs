// Real keyboard and renderer check for one source-protected gallery portal.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { baseBlock, VoxelWorld } from '../../src/voxel.mjs';
import { FourRegionWorld, fourRegionProfile, M7_ENVIRONMENT_GENERATOR } from '../../src/manual-biomes/profile-world.mjs';
import { surveyCrossRegionGallery } from '../../src/living-underworld/cross-region-gallery.mjs';

const release = 'aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7';
const root = resolve(process.env.UNIFIED_GAME_SOURCE ?? '');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), release);
const seed = 179, source = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
const legacy = new VoxelWorld(seed);
const proposal = surveyCrossRegionGallery(source, { rx: -3, rz: -9, level: 0, axis: 'x', reach: 16,
  originalProtected: (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed) });
assert.equal(proposal?.cuts.size, 297);
const load = file => import(pathToFileURL(resolve(root, 'src', file)).href);
const [P, { VEILREACH_GENERATOR }] = await Promise.all(['manual-biomes/profile-world.mjs', 'environment-ground.mjs'].map(load));
const current = new P.FourRegionWorld(seed, P.fourRegionProfile(seed, VEILREACH_GENERATOR));
const checked = [...proposal.support, ...proposal.clearance];
for (const key of checked) {
  const point = key.split(',').map(Number);
  assert.equal(current.get(...point), source.get(...point), key);
}
const { x, feet, z } = proposal.route[0], start = [x, feet, z];
const cuts = JSON.stringify([...proposal.cuts]);
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { fourRegionProfile as portalProfile } from './manual-biomes/profile-world.mjs';\n" +
  "const verifiedPortalCuts=new Set(await (await fetch('/__portal/cuts.json')).json());\n" +
  game.replace(marker, marker + `\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('portal-walk')){
      const source=new FourRegionWorld(${seed},portalProfile(${seed},VEILREACH_GENERATOR));
      const get=(x,y,z)=>verifiedPortalCuts.has([x,y,z].join(','))?0:source.get(x,y,z);
      const witness=Object.create(source,{
        get:{value:get},naturalAndLandmarkBlock:{value:get},
        upperSourceProfile:{value:source.upperSourceProfile},
        upperNaturalRevision:{value:source.upperNaturalRevision},
        upperNaturalOccupied:{value:key=>source.upperNaturalOccupied(key)},
        upperSupportedCells:{value:(...cell)=>source.upperSupportedCells(...cell)},
        save:{value(){throw Error('Portal witness is read-only');}}
      });
      storageReadOnly=true;return new Pack2LiveWorld(witness);
    }`);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    const bytes = path === '/src/main.mjs' ? injected : path === '/__portal/cuts.json' ? cuts : await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'underworld-region-portal');
await mkdir(out, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 956, height: 440 }, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [], diagnostics = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
  });
  await page.goto('http://127.0.0.1:' + server.address().port + '/?portal-walk=1');
  await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
  if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
  await page.evaluate(start => {
    const api = window.__mythwroughtTest;
    api.teleportCave(...start);
    api.setOrientation(Math.PI / 2, 0);
  }, start);
  const pose = () => page.evaluate(() => window.__mythwroughtTest.m5ObservedPose());
  const before = await pose();
  assert.equal(before.seed, seed);
  const shots = [];
  async function capture(file) {
    const position = await pose();
    const settled = await page.waitForFunction(({ x, z }) => {
      const d = document.querySelector('#scene').dataset;
      const center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
      return d.chunkCenter?.startsWith(center + '|') && Number(d.loadedChunks) === 27 &&
        Number(d.pendingChunks) === 0 && Number(d.renderedMeshVertices) > 0;
    }, position, { timeout: 30000 });
    await settled.dispose();
    const state = await page.evaluate(() => {
      const canvas = document.querySelector('#scene');
      return { center: canvas.dataset.chunkCenter, owners: Number(canvas.dataset.loadedChunks),
        error: canvas.getContext('webgl2').getError(),
        worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
    });
    assert.equal(state.error, 0);
    assert.deepEqual(state.worldKeys, []);
    const screenshot = await page.screenshot({ path: resolve(out, file) });
    shots.push({ file, sha256: digest(screenshot), position, ...state });
  }
  async function walk(key, target) {
    await page.keyboard.down(key);
    try {
      const result = await page.waitForFunction(({ key, target }) => {
        const p = window.__mythwroughtTest.m5ObservedPose();
        return p.onGround && (key === 'w' ? p.x >= target : p.x <= target);
      }, { key, target }, { timeout: 20000, polling: 'raf' });
      await result.dispose();
    } finally {
      await page.keyboard.up(key);
    }
    return pose();
  }
  await capture('start.png');
  const far = await walk('w', before.x + 31.4);
  await capture('across.png');
  const returned = await walk('s', before.x + .45);
  await capture('returned.png');
  assert.ok(far.x > proposal.portal.x && returned.x < proposal.portal.x);
  assert.ok(Math.abs(far.feet - before.feet) < .12 && Math.abs(returned.feet - before.feet) < .12);
  assert.deepEqual(errors, []);
  const report = { release, seed, chromium: browser.version(), portal: proposal.portal,
    verifiedSourceCells: checked.length, cuts: proposal.cuts.size, diagnostics: [...diagnostics],
    originalSha256: digest(game), injectedSha256: digest(injected), cutsSha256: digest(cuts), shots };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
