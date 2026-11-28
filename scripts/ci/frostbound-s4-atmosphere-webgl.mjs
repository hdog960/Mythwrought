// Read-only loopback fixture using the original renderer and a fixed noon sky.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { collides } from '../../src/voxel.mjs';

const root = process.cwd();
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'frostbound-s4-atmosphere');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const source = new FrostboundSixRegionsCandidate(42);
const cameras = [
  ['frostwood', 0, 512], ['white-expanse', -84, 659], ['glacierlands', -147, 449],
  ['mirrorfrost', 135, 379], ['silverwood', 166, 557], ['blackfrost', -184, 628],
  ['plains-control', 0, 0]
].map(([name, x, z]) => {
  for (let y = 1; y <= 20; y++) {
    if (!collides(source, x + .5, y + .01, z + .5) && collides(source, x + .5, y - .02, z + .5)) {
      return { name, position: [x, y, z] };
    }
  }
  throw Error('No supported camera for ' + name);
});
const original = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
let injected = original;
function inject(before, after) {
  assert.equal(injected.split(before).length, 2, before);
  injected = injected.replace(before, after);
}
const boot = '  function loadWorld(seed){';
inject(boot, "  const frostboundFixture=developerWorldFixtures&&new URLSearchParams(location.search).get('frostbound-atmosphere');\n" +
  boot + "\n    if(frostboundFixture){storageReadOnly=true;return new Pack2LiveWorld(new FrostboundSixRegionsCandidate(42));}");
inject('const atmosphere=sampleSkyAtmosphere(sampleSkyClock(skyClock,now));',
  'const atmosphere=sampleSkyAtmosphere(frostboundFixture?SKY_DAY_MS/2:sampleSkyClock(skyClock,now));');
inject('const s6Mood=sampleS6BiomeSky(atmosphere,s6Biome);',
  "const baseMood=sampleS6BiomeSky(atmosphere,s6Biome);\n" +
  "      const s6Mood=frostboundFixture==='candidate'?sampleFrostboundAtmosphere(baseMood,player.x,player.z,world.seed):baseMood;");
injected = "import { FrostboundSixRegionsCandidate } from './frostbound/s4-silverwood-barrens.mjs';\n" +
  "import { sampleFrostboundAtmosphere } from './frostbound/s4-atmosphere.mjs';\n" + injected;
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
const rows = [], errors = [], diagnostics = new Set();
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const mode of ['baseline', 'candidate']) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, serviceWorkers: 'block' });
    await context.addInitScript(() => {
      const gl = WebGL2RenderingContext.prototype;
      const nativeLocation = gl.getUniformLocation, nativeUniform = gl.uniform3fv, names = new WeakMap();
      window.__fogSamples = {};
      gl.getUniformLocation = function (program, name) {
        const location = nativeLocation.call(this, program, name);
        if (location) names.set(location, name);
        return location;
      };
      gl.uniform3fv = function (location, values, ...rest) {
        const name = names.get(location);
        if (name === 'uFog' || name === 'uSkyLight') window.__fogSamples[name] = Array.from(values);
        return nativeUniform.call(this, location, values, ...rest);
      };
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?frostbound-atmosphere=' + mode,
      { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    for (const { name, position } of cameras) {
      const fence = await page.evaluate(at => {
        const frame = Number(document.querySelector('#scene').dataset.renderedFrames);
        window.__mythwroughtTest.teleportCave(...at);
        window.__mythwroughtTest.setOrientation(0, 0);
        return frame;
      }, position);
      const settled = await page.waitForFunction(({ position: [x, , z], fence }) => {
        const data = document.querySelector('#scene').dataset;
        const center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
        return (data.chunkCenter === center || data.chunkCenter?.startsWith(center + '|')) &&
          Number(data.renderedFrames) > fence + 13 && Number(data.pendingChunks) === 0 &&
          Number(data.loadedChunks) === 25;
      }, { position, fence }, { timeout: 30000 });
      await settled.dispose();
      const state = await page.evaluate(() => {
        const canvas = document.querySelector('#scene'), gl = canvas.getContext('webgl2');
        return { ...window.__fogSamples, fog: JSON.parse(canvas.dataset.skyFog),
          daylight: Number(canvas.dataset.skyDaylight), owners: Number(canvas.dataset.loadedChunks),
          error: gl.getError(), worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
      });
      assert.equal(state.error, 0);
      assert.equal(state.daylight, 1);
      assert.deepEqual(state.worldKeys, []);
      assert.ok(state.uFog.every((value, i) => Math.abs(value - state.fog[i]) <= .00005));
      const file = mode + '-' + name + '.png';
      const image = await page.screenshot({ path: resolve(out, file) });
      rows.push({ mode, name, position, file, sha256: digest(image), ...state });
    }
    await context.close();
  }
  const candidateFog = new Set();
  for (const [index, camera] of cameras.entries()) {
    const baseline = rows[index], candidate = rows[index + cameras.length];
    assert.deepEqual(candidate.uSkyLight, baseline.uSkyLight);
    if (camera.name === 'plains-control') {
      assert.deepEqual(candidate.uFog, baseline.uFog);
    } else {
      assert.notDeepEqual(candidate.uFog, baseline.uFog);
      candidateFog.add(candidate.uFog.join(','));
    }
  }
  assert.equal(candidateFog.size, 6);
  assert.deepEqual(errors, []);
  const report = { chromium: browser.version(), mainSha256: digest(original), injectedSha256: digest(injected),
    seed: 42, readOnly: true, fixedNoon: true, diagnostics: [...diagnostics], rows };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
