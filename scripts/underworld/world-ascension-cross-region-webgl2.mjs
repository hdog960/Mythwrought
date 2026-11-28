// Real keyboard and renderer checks for source-protected underground routes.
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
import { surveySupportedNetworkChamber } from '../../src/living-underworld/supported-network-chamber.mjs';

const release = 'aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7';
const root = resolve(process.env.UNIFIED_GAME_SOURCE ?? '');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), release);
const atmosphereMode = process.argv.includes('--atmosphere');
const chamberMode = atmosphereMode || process.argv.includes('--chamber');
const seed = chamberMode ? 42 : 179;
const source = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
const legacy = new VoxelWorld(seed);
const originalProtected = (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed);
const chamberAt = layer => surveySupportedNetworkChamber(source, { rx: -1, rz: -1, layer, originalProtected });
const proposal = chamberMode ? chamberAt(3) :
  surveyCrossRegionGallery(source, { rx: -3, rz: -9, level: 0, axis: 'x', reach: 16, originalProtected });
assert.equal(proposal?.cuts.size, chamberMode ? 2642 : 297);
const shallow = atmosphereMode ? chamberAt(0) : null;
if (atmosphereMode) assert.equal(shallow?.cuts.size, 2642);
const load = file => import(pathToFileURL(resolve(root, 'src', file)).href);
const [P, { VEILREACH_GENERATOR }] = await Promise.all(['manual-biomes/profile-world.mjs', 'environment-ground.mjs'].map(load));
const current = new P.FourRegionWorld(seed, P.fourRegionProfile(seed, VEILREACH_GENERATOR));
const checked = chamberMode ? [proposal, ...(shallow ? [shallow] : [])].flatMap(({ clearance, deck }) =>
  [...clearance, ...deck.flatMap(({ x, feet, z, headroom }) => [[x, feet - 1, z], [x, feet + headroom, z]])]) :
  [...proposal.support, ...proposal.clearance].map(key => key.split(',').map(Number));
for (const point of checked) {
  assert.equal(current.get(...point), source.get(...point), point.join(','));
}
const route = chamberMode ? proposal.routes[0] : proposal.route;
const { x, feet, z } = route[0], start = [x, feet, z];
const landmark = chamberMode ? proposal.hub : proposal.portal;
const cuts = JSON.stringify([...proposal.cuts, ...(shallow?.cuts ?? [])]);
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8'), marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
let injected = "import { fourRegionProfile as portalProfile } from './manual-biomes/profile-world.mjs';\n" +
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
const atmosphereAsset = '/__portal/depth-atmosphere.mjs';
let atmosphereSource;
if (atmosphereMode) {
  atmosphereSource = (await readFile(new URL('../../src/living-underworld/depth-atmosphere.mjs', import.meta.url), 'utf8'))
    .replace("'./worldwide-network.mjs'", "'/__portal/worldwide-network.mjs'");
  injected = `import { sampleUnderworldAtmosphere } from '${atmosphereAsset}';\n` + injected;
  function hook(before, after) {
    assert.equal(injected.split(before).length, 2, before);
    injected = injected.replace(before, after);
  }
  hook(marker, "  const depthColorFixture=developerWorldFixtures&&new URLSearchParams(location.search).get('portal-walk');\n" + marker);
  hook('const atmosphere=sampleSkyAtmosphere(sampleSkyClock(skyClock,now));',
    'const atmosphere=sampleSkyAtmosphere(depthColorFixture?SKY_DAY_MS/2:sampleSkyClock(skyClock,now));');
  hook('const caveFog=[.053,.068,.088];',
    "const caveMood=depthColorFixture==='depth-candidate'?sampleUnderworldAtmosphere(player.feet):null;\n" +
    '      const caveFog=caveMood?.fog??[.053,.068,.088];');
  hook('skyLight:atmosphere.light,[.76,.81,.91]));', 'skyLight:atmosphere.light,caveMood?.light??[.76,.81,.91]));');
}
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    let bytes;
    if (path === '/src/main.mjs') bytes = injected;
    else if (path === '/__portal/cuts.json') bytes = cuts;
    else if (path === atmosphereAsset && atmosphereMode) bytes = atmosphereSource;
    else if (path === '/__portal/worldwide-network.mjs' && atmosphereMode) {
      bytes = await readFile(new URL('../../src/living-underworld/worldwide-network.mjs', import.meta.url));
    } else bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', atmosphereMode ? 'underworld-depth-atmosphere' :
  chamberMode ? 'underworld-network-chamber' : 'underworld-region-portal');
await mkdir(out, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { chromium } = createRequire(import.meta.url)('playwright');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const viewport = atmosphereMode ? { width: 640, height: 300 } : { width: 956, height: 440 };
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
  if (atmosphereMode) await context.addInitScript(() => {
    const gl = WebGL2RenderingContext.prototype, names = new WeakMap();
    const locate = gl.getUniformLocation, write = gl.uniform3fv;
    window.__underworldUniforms = {};
    gl.getUniformLocation = function (program, name) {
      const location = locate.call(this, program, name);
      if (location && (name === 'uFog' || name === 'uSkyLight')) names.set(location, name);
      return location;
    };
    gl.uniform3fv = function (location, values, ...rest) {
      const name = names.get(location);
      if (name) window.__underworldUniforms[name] = Array.from(values);
      return write.call(this, location, values, ...rest);
    };
  });
  const page = await context.newPage(), errors = [], diagnostics = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
  });
  async function open(mode) {
    await page.goto('http://127.0.0.1:' + server.address().port + '/?portal-walk=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
  }
  const positionAt = at => page.evaluate(at => {
    const api = window.__mythwroughtTest;
    api.teleportCave(...at);
    api.setOrientation(Math.PI / 2, 0);
  }, at);
  const pose = () => page.evaluate(() => window.__mythwroughtTest.m5ObservedPose());
  const shots = [];
  async function capture(file) {
    const position = await pose();
    assert.equal(position.seed, seed);
    const settled = await page.waitForFunction(({ x, feet, z }) => {
      const d = document.querySelector('#scene').dataset;
      const center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
      const current = window.__mythwroughtTest.m5ObservedPose();
      return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|')) &&
        Number(d.loadedChunks) === (feet < 0 ? 27 : 25) && Number(d.pendingChunks) === 0 &&
        Number(d.renderedMeshVertices) > 0 && current.onGround;
    }, position, { timeout: 30000 });
    await settled.dispose();
    const state = await page.evaluate(() => {
      const canvas = document.querySelector('#scene');
      return { center: canvas.dataset.chunkCenter, owners: Number(canvas.dataset.loadedChunks),
        ...window.__underworldUniforms, backdrop: canvas.dataset.skyBackdrop,
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
  if (atmosphereMode) {
    const { findSafeSpawn } = await load('physics.mjs');
    const spawn = findSafeSpawn(current, 0, 0), startShallow = shallow.routes[0][0];
    const cameras = [['shallow', [startShallow.x, startShallow.feet, startShallow.z]], ['deep', start],
      ['surface', [Math.floor(spawn.x), Math.round(spawn.feet), Math.floor(spawn.z)]]];
    for (const mode of ['depth-control', 'depth-candidate']) {
      await open(mode);
      for (const [name, at] of cameras) {
        await positionAt(at);
        await capture(mode + '-' + name + '.png');
      }
    }
    for (const [index, [name]] of cameras.entries()) {
      const control = shots[index], candidate = shots[index + cameras.length];
      assert.equal(candidate.backdrop, name === 'surface' ? 'outdoor' : 'deep-cave');
      for (const field of ['uFog', 'uSkyLight']) {
        assert.equal(candidate[field]?.length, 3);
        if (name === 'surface') assert.deepEqual(candidate[field], control[field]);
        else assert.notDeepEqual(candidate[field], control[field]);
      }
    }
    assert.notDeepEqual(shots[3].uFog, shots[4].uFog);
  } else {
    await open('1');
    await positionAt(start);
    const before = await pose();
    await capture('start.png');
    const far = await walk('w', before.x + route.length - 1.6);
    await capture('across.png');
    const returned = await walk('s', before.x + .45);
    await capture('returned.png');
    assert.ok(far.x > landmark.x && returned.x < landmark.x);
    assert.ok(Math.abs(far.feet - before.feet) < .12 && Math.abs(returned.feet - before.feet) < .12);
  }
  assert.deepEqual(errors, []);
  const report = { release, seed, chromium: browser.version(), ...(chamberMode ? { chamber: landmark } : { portal: landmark }),
    verifiedSourceCells: checked.length, cuts: proposal.cuts.size + (shallow?.cuts.size ?? 0), diagnostics: [...diagnostics],
    originalSha256: digest(game), injectedSha256: digest(injected), cutsSha256: digest(cuts), shots };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
