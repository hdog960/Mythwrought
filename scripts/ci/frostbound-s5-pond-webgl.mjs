// Render the same Mirrorfrost bank and native water with and without ice.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { openMirrorfrostPondWitness, surveyMirrorfrostPond } from '../../src/frostbound/s5-frozen-pond.mjs';
import { Pack2LiveWorld } from '../../src/pack2-world.mjs';
import { collides, raycast } from '../../src/voxel.mjs';

const root = process.cwd(), seed = 179, center = [142, 322];
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'frostbound-s5-pond');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const terrain = new FrostboundSixRegionsCandidate(seed), pond = surveyMirrorfrostPond(terrain, ...center);
assert.equal(pond.ice.length, 57);
const frozen = new Pack2LiveWorld(openMirrorfrostPondWitness(terrain, pond));
const thawed = new Pack2LiveWorld(openMirrorfrostPondWitness(terrain, pond, { iceCover: false }));
const target = [center[0], pond.iceY, center[1]];
let camera, orientation;
for (const [x, y, z] of pond.shore) {
  const feet = y + 1;
  if (![frozen, thawed].every(world =>
    !collides(world, x + .5, feet + .01, z + .5) && collides(world, x + .5, feet - .02, z + .5))) continue;
  const eye = [x + .5, feet + 1.55, z + .5], aim = [target[0] + .5, target[1] + .98, target[2] + .5];
  const [dx, dy, dz] = aim.map((value, axis) => value - eye[axis]);
  if (Math.hypot(dx, dz) < 3 || !raycast(frozen, eye, [dx, dy, dz], 7)?.hit.every((value, i) => value === target[i])) continue;
  camera = [x, feet, z];
  orientation = [Math.atan2(dx, dz), Math.atan2(dy, Math.hypot(dx, dz))];
  break;
}
assert.ok(camera, 'No natural bank camera');
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), anchor = '  function loadWorld(seed){';
assert.equal(game.split(anchor).length, 2);
const injected = "import { FrostboundSixRegionsCandidate } from './frostbound/s4-silverwood-barrens.mjs';\n" +
  "import { openMirrorfrostPondWitness, surveyMirrorfrostPond } from './frostbound/s5-frozen-pond.mjs';\n" +
  game.replace(anchor, anchor + `\n    const pondMode=developerWorldFixtures&&new URLSearchParams(location.search).get('mirrorfrost-pond');
    if(pondMode){
      const terrain=new FrostboundSixRegionsCandidate(${seed});
      const pond=surveyMirrorfrostPond(terrain,${center.join(',')});
      storageReadOnly=true;
      return new Pack2LiveWorld(openMirrorfrostPondWitness(terrain,pond,{iceCover:pondMode==='frozen'}));
    }`);
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
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
  for (const mode of ['thawed', 'frozen']) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?mirrorfrost-pond=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    const fence = await page.evaluate(({ camera, orientation }) => {
      const api = window.__mythwroughtTest;
      const frame = Number(document.querySelector('#scene').dataset.renderedFrames);
      api.teleportCave(...camera);
      api.setOrientation(...orientation);
      return frame;
    }, { camera, orientation });
    const settled = await page.waitForFunction(({ camera: [x, , z], fence }) => {
      const d = document.querySelector('#scene').dataset;
      const center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
      return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|')) &&
        Number(d.renderedFrames) > fence + 4 && Number(d.loadedChunks) === 25 && Number(d.pendingChunks) === 0 &&
        Number(d.waterSections) === 4;
    }, { camera, fence }, { timeout: 30000 });
    await settled.dispose();
    const state = await page.evaluate(({ target }) => {
      const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
      const [x, y, z] = target;
      return { pose: api.m5ObservedPose(), block: api.block(x, y, z), under: api.block(x, y - 1, z),
        label: document.querySelector('#targetInfo').textContent, waterSections: Number(canvas.dataset.waterSections),
        owners: Number(canvas.dataset.loadedChunks), error: canvas.getContext('webgl2').getError(),
        worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
    }, { target });
    assert.equal(state.pose.seed, seed);
    assert.equal(state.error, 0);
    assert.equal(state.under, 76);
    assert.equal(state.block, mode === 'frozen' ? 275 : 0);
    assert.deepEqual(state.worldKeys, []);
    if (mode === 'frozen') assert.match(state.label, /CLEAR LAKE ICE/i);
    const file = mode + '.png';
    const screenshot = await page.screenshot({ path: resolve(out, file) });
    rows.push({ mode, file, sha256: digest(screenshot), ...state });
    await context.close();
  }
  assert.notEqual(rows[0].sha256, rows[1].sha256);
  assert.deepEqual(errors, []);
  const report = { chromium: browser.version(), originalSha256: digest(game), injectedSha256: digest(injected),
    seed, target, camera, readOnly: true, diagnostics: [...diagnostics], rows };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
