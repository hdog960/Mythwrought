// Pair the original game and the detached D1 surface plan on the same seed.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';

const root = resolve(process.env.P0_CURRENT_SOURCE ?? '');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const researchPath = '/src/manual-biomes/forgotten-sands-restored-ground.mjs';
const [P, V] = await Promise.all(['src/manual-biomes/profile-world.mjs', 'src/voxel.mjs']
  .map(file => import(pathToFileURL(resolve(root, file)).href)));
const seed = 10301, profile = P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR);
const Restored = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight);
const baseline = new P.FourRegionWorld(seed, profile), candidate = new Restored(seed, profile);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function cameraFor(cell) {
  const [x, y, z] = cell;
  for (const [dx, dz] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, 2], [2, -2]]) {
    for (const feet of [y + 1, y + 2, y, y - 1]) {
      const camera = [x + dx, feet, z + dz];
      const eye = [camera[0] + .5, feet + 1.55, camera[2] + .5];
      const direction = [x + .5, y + .94, z + .5].map((value, axis) => value - eye[axis]);
      if (![baseline, candidate].every(world => !V.collides(world, eye[0], feet + .01, eye[2]) &&
          V.collides(world, eye[0], feet - .02, eye[2]) &&
          V.raycast(world, eye, direction, 6)?.hit.every((value, axis) => value === cell[axis]))) continue;
      const [a, b, c] = direction;
      return { camera, angles: [Math.atan2(a, c), Math.atan2(b, Math.hypot(a, c))] };
    }
  }
  return null;
}
const scenes = [];
for (const [name, before, after, bounds] of [
  ['golden-sandstone', 256, 261, [680, 710, -235, -205]],
  ['red-dune', 259, 257, [447, 569, -110, 110]],
  ['dry-pan', 259, 258, [447, 569, -110, 110]]
]) {
  const [x0, x1, z0, z1] = bounds;
  let scene;
  survey: for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
    const column = baseline._columnPlan(x, z), y = Math.max(...column.keys());
    if (column.get(y) !== before || candidate.get(x, y, z) !== after) continue;
    const cell = [x, y, z], point = cameraFor(cell);
    if (!point) continue;
    scene = { name, cell, before, after, ...point };
    break survey;
  }
  assert.ok(scene, 'No original camera at ' + name);
  scenes.push(scene);
}

const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
const research = await readFile(resolve('.', '.' + researchPath), 'utf8');
const marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { createRestoredDesertResearchWorld } from './manual-biomes/forgotten-sands-restored-ground.mjs';\n" +
  "import { fourRegionProfile as sandsProfile } from './manual-biomes/profile-world.mjs';\n" +
  "import { terrainHeight as sandsTerrainHeight } from './voxel.mjs';\n" +
  game.replace(marker, marker + `\n    const sandsMode=developerWorldFixtures&&new URLSearchParams(location.search).get('sands-ground');
    if(sandsMode){
      const World=sandsMode==='candidate'?createRestoredDesertResearchWorld(FourRegionWorld,sandsTerrainHeight):FourRegionWorld;
      storageReadOnly=true;return new Pack2LiveWorld(new World(${seed},sandsProfile(${seed},M8_MOUNTAIN_GENERATOR)));
    }`);
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    const bytes = path === '/src/main.mjs' ? injected : path === researchPath ? research : await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'forgotten-sands-restored-ground');
await mkdir(out, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const rows = [], errors = [], diagnostics = new Set();
  for (const mode of ['baseline', 'candidate']) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?sands-ground=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => window.__mythwroughtTest.m5ObservedPose().seed), seed);
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    for (const scene of scenes) {
      const result = await page.evaluate(({ camera, angles }) => {
        const game = window.__mythwroughtTest;
        const frame = Number(document.querySelector('#scene').dataset.renderedFrames);
        game.teleportCave(...camera);
        game.setOrientation(...angles);
        return frame;
      }, scene);
      const settled = await page.waitForFunction(({ camera: [x, , z], result }) => {
        const d = document.querySelector('#scene').dataset, center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
        return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|')) &&
          Number(d.renderedFrames) > result + 4 && Number(d.loadedChunks) === 25 && Number(d.pendingChunks) === 0;
      }, { camera: scene.camera, result }, { timeout: 30000 });
      await settled.dispose();
      const state = await page.evaluate(cell => {
        const canvas = document.querySelector('#scene'), gl = canvas.getContext('webgl2');
        return { id: window.__mythwroughtTest.block(...cell), target: document.querySelector('#targetInfo').textContent,
          error: gl.getError(), owners: Number(canvas.dataset.loadedChunks),
          worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
      }, scene.cell);
      assert.equal(state.id, mode === 'baseline' ? scene.before : scene.after);
      assert.equal(state.error, 0);
      assert.deepEqual(state.worldKeys, []);
      const file = mode + '-' + scene.name + '.png';
      const image = await page.screenshot({ path: resolve(out, file) });
      rows.push({ mode, ...scene, file, sha256: digest(image), ...state });
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  const report = { game: P0_TILE_BASE, chromium: browser.version(), mainSha256: digest(game), injectedSha256: digest(injected),
    seed, readOnly: true, diagnostics: [...diagnostics], rows };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
