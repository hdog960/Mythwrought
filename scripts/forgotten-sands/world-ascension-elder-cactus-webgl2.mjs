// Draw the detached elder through the pinned game's native nonblock pass.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { surveyDesertCactusStand } from '../../src/manual-biomes/forgotten-sands-cactus-stand.mjs';
import { surveyElderCactus } from '../../src/manual-biomes/forgotten-sands-elder-cactus.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = resolve(process.env.P0_CURRENT_SOURCE ?? ''), seed = 10301;
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = file => import(pathToFileURL(resolve(root, 'src', file)).href);
const [P, V] = await Promise.all(['manual-biomes/profile-world.mjs', 'voxel.mjs'].map(load));
const Desert = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight);
const terrain = new Desert(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
const elder = surveyElderCactus(terrain, surveyDesertCactusStand(terrain, 9, -1, 'ancient'));
assert.deepEqual(elder?.anchor, [621, 9, -25]);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
let camera;
for (const [x, z] of [[603, -24], [605, -28], [639, -25], [621, -46]]) {
  for (let feet = 4; feet <= 19; feet++) {
    if (!V.collides(terrain, x + .5, feet + .01, z + .5) && V.collides(terrain, x + .5, feet - .02, z + .5)) {
      camera = [x, feet, z];
      break;
    }
  }
  if (camera) break;
}
assert.ok(camera);
const original = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
let injected = original;
function inject(before, after) {
  assert.equal(injected.split(before).length, 2);
  injected = injected.replace(before, after);
}
const marker = '  function loadWorld(seed){';
inject(marker, '  let elderPreview=null;\n' + marker + `\n    const preview=developerWorldFixtures&&new URLSearchParams(location.search).get('sands-elder-proof');
    if(preview){
      const Source=createRestoredDesertResearchWorld(FourRegionWorld,sandsTerrainHeight);
      const terrain=new Source(${seed},sandsProfile(${seed},M8_MOUNTAIN_GENERATOR));
      const elder=surveyElderCactus(terrain,surveyDesertCactusStand(terrain,9,-1,'ancient'));
      storageReadOnly=true;
      if(preview==='candidate'){
        elderPreview={frame:()=>({objects:[elder.object],hit:null})};
        const view=new Pack2LiveWorld(elder.witness);
        view.stagedNonblockCollision=elder.witness.stagedNonblockCollision;
        return view;
      }
      return new Pack2LiveWorld(terrain);
    }`);
inject('  function stagedScene(){\n    if(storageReadOnly)return null;',
  '  function stagedScene(){\n    if(elderPreview)return elderPreview;\n    if(storageReadOnly)return null;');
injected = "import { createRestoredDesertResearchWorld } from './manual-biomes/forgotten-sands-restored-ground.mjs';\n" +
  "import { surveyDesertCactusStand } from './manual-biomes/forgotten-sands-cactus-stand.mjs';\n" +
  "import { surveyElderCactus } from './manual-biomes/forgotten-sands-elder-cactus.mjs';\n" +
  "import { fourRegionProfile as sandsProfile } from './manual-biomes/profile-world.mjs';\n" +
  "import { terrainHeight as sandsTerrainHeight } from './voxel.mjs';\n" + injected;
const research = new Map(await Promise.all(['restored-ground', 'cactus-stand', 'elder-cactus']
  .map(async name => {
    const file = '/src/manual-biomes/forgotten-sands-' + name + '.mjs';
    return [file, await readFile(resolve('.', '.' + file))];
  })));
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    const bytes = path === '/src/main.mjs' ? injected : research.get(path) ?? await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'forgotten-sands-elder');
await mkdir(out, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const shots = [], errors = [], diagnostics = new Set();
  for (const mode of ['baseline', 'candidate']) {
    const context = await browser.newContext({ viewport: { width: 956, height: 440 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?sands-elder-proof=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    const fence = await page.evaluate(camera => {
      const api = window.__mythwroughtTest, d = document.querySelector('#scene').dataset;
      const old = Number(d.renderedFrames ?? 0);
      api.teleportCave(...camera);
      api.aimAt(622, 16, -25);
      return old;
    }, camera);
    const ready = await page.waitForFunction(({ camera: [x, , z], fence, bytes }) => {
      const d = document.querySelector('#scene').dataset, center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
      return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|')) && Number(d.renderedFrames) > fence + 4 &&
        Number(d.pendingChunks) === 0 && Number(d.loadedChunks) === 25 && Number(d.nonblockGpuBytes) === bytes;
    }, { camera, fence, bytes: mode === 'candidate' ? elder.mesh.byteLength : 0 }, { timeout: 30000 });
    await ready.dispose();
    const state = await page.evaluate(() => {
      const canvas = document.querySelector('#scene'), d = canvas.dataset, gl = canvas.getContext('webgl2');
      return { pose: window.__mythwroughtTest.m5ObservedPose(), owners: Number(d.loadedChunks),
        objects: Number(d.nonblockInstances), bytes: Number(d.nonblockGpuBytes), glError: gl.getError(),
        worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
    });
    assert.equal(state.pose.seed, seed);
    assert.equal(state.glError, 0);
    assert.equal(state.objects, mode === 'candidate' ? 1 : 0);
    assert.deepEqual(state.worldKeys, []);
    const file = mode + '.png', screenshot = await page.screenshot({ path: resolve(out, file) });
    shots.push({ mode, file, sha256: digest(screenshot), ...state });
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.notEqual(shots[0].sha256, shots[1].sha256);
  const report = { seed, game: P0_TILE_BASE, chromium: browser.version(), anchor: elder.anchor, camera,
    originalSha256: digest(original), injectedSha256: digest(injected), diagnostics: [...diagnostics], shots };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
