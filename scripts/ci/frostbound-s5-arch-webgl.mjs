// Walk supported Glacierlands ice formations in the original read-only game.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { surveyGlacierArch } from '../../src/frostbound/s5-glacier-arch.mjs';
import { surveyGlacierBridge } from '../../src/frostbound/s7-glacier-bridge.mjs';

const root = process.cwd(), seed = 179, x = -97, z = 364, axis = 'z';
const bridge = process.argv.includes('--bridge'), mode = bridge ? 'glacier-bridge' : 'glacier-arch';
const site = { x: -154, z: 332, axis: 'z', span: 9 };
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', bridge ? 'frostbound-s7-bridge' : 'frostbound-s5-arch');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const terrain = new FrostboundSixRegionsCandidate(seed);
const formation = bridge ? surveyGlacierBridge(terrain, site) : surveyGlacierArch(terrain, x, z, axis);
assert.equal(formation.cells.length, bridge ? 33 : 44);
const start = formation.route[bridge ? 1 : 0], endPoint = formation.route.at(-1);
const targetCell = bridge ? [site.x, formation.origin[1], site.z + Math.ceil(site.span / 2)] :
  [x, formation.origin[1] + 7, z];
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { FrostboundSixRegionsCandidate } from './frostbound/s4-silverwood-barrens.mjs';\n" +
  "import { openFrostboundIceFormationWitness, surveyGlacierArch } from './frostbound/s5-glacier-arch.mjs';\n" +
  "import { surveyGlacierBridge } from './frostbound/s7-glacier-bridge.mjs';\n" +
  game.replace(marker, marker + `\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('${mode}')){
      const terrain=new FrostboundSixRegionsCandidate(${seed});
      const formation=${bridge ? `surveyGlacierBridge(terrain,${JSON.stringify(site)})` : `surveyGlacierArch(terrain,${x},${z},'${axis}')`};
      storageReadOnly=true;return new Pack2LiveWorld(openFrostboundIceFormationWitness(terrain,formation));
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
  const viewport = bridge ? { width: 640, height: 300 } : { width: 844, height: 390 };
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [], diagnostics = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
  });
  await page.goto('http://127.0.0.1:' + server.address().port + '/?' + mode + '=1');
  await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
  if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
  const fence = await page.evaluate(({ start, bridge }) => {
    const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
    const frame = Number(canvas.dataset.renderedFrames ?? 0);
    api.teleportCave(...start);
    api.setOrientation(bridge ? 0 : Math.PI / 2, bridge ? -.20 : .09);
    return frame;
  }, { start, bridge });
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
  async function walk(key, target, feet, returning = false) {
    await page.keyboard.down(key);
    try {
      const result = await page.waitForFunction(({ target, feet, returning, bridge }) => {
        const pose = window.__mythwroughtTest.m5ObservedPose();
        const along = bridge ? pose.z : pose.x;
        return (bridge || pose.onGround && Math.abs(pose.feet - feet) < .12) && (returning ? along <= target : along >= target);
      }, { target, feet, returning, bridge }, { timeout: bridge ? 75000 : 20000, polling: 'raf' });
      await result.dispose();
    } catch (error) {
      throw new Error('Glacier walk stopped at ' + JSON.stringify(await pose()) +
        ' while approaching ' + target + ' at feet ' + feet, { cause: error });
    } finally {
      await page.keyboard.up(key);
    }
    if (bridge) {
      const landed = await page.waitForFunction(feet => {
        const pose = window.__mythwroughtTest.m5ObservedPose();
        return pose.onGround && Math.abs(pose.feet - feet) < .12;
      }, feet, { timeout: 10000 });
      await landed.dispose();
    }
    return pose();
  }
  let deckSha256;
  if (bridge) {
    await walk('w', targetCell[2] + .4, formation.origin[1] + 1);
    deckSha256 = digest(await page.screenshot({ path: resolve(out, 'deck.png') }));
  }
  const end = await walk('w', bridge ? endPoint[2] + .4 : before.x + 8.6, endPoint[1]);
  const returned = await walk('s', bridge ? before.z - .02 : before.x + .35, start[1], true);
  assert.ok(Math.abs(end.feet - endPoint[1]) < .12 && Math.abs(returned.feet - start[1]) < .12);
  const state = await page.evaluate(point => {
    const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
    return { targetId: api.block(...point), owners: Number(canvas.dataset.loadedChunks),
      error: canvas.getContext('webgl2').getError(),
      worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
  }, targetCell);
  assert.equal(state.targetId, bridge ? 275 : 276);
  assert.equal(state.error, 0);
  assert.ok(state.owners <= 25);
  assert.deepEqual(state.worldKeys, []);
  assert.deepEqual(errors, []);
  const report = { seed, mode, chromium: browser.version(), originalSha256: digest(game), injectedSha256: digest(injected),
    diagnostics: [...diagnostics], before, end, returned, targetCell, ...state, approachSha256: digest(startView), deckSha256 };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
