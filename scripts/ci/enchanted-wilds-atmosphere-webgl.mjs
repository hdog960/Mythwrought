// Green-blue regional fog on supported cameras in the original WebGL renderer.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { WildsFamilyResearchWorld, wildsRegionAt } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { collides } from '../../src/voxel.mjs';

const seed = 179, root = process.cwd(), source = new WildsFamilyResearchWorld(seed);
const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'wilds-atmosphere');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const cameras = [
  ['ancientwood', -104, 9, -424], ['moonveil-groves', 88, 8, -760], ['sporewilds', 184, 5, -744],
  ['starlight-glades', -24, 11, -760], ['whispering-ruinwood', -136, 10, -728]
].map(([name, x, y, z], index) => {
  assert.equal(wildsRegionAt(x, z, seed), index);
  assert.equal(collides(source, x + .5, y + .01, z + .5), false);
  assert.equal(collides(source, x + .5, y - .02, z + .5), true);
  return { name, position: [x, y, z] };
});
let y = 1;
while (y <= 19 && (collides(source, .5, y + .01, .5) || !collides(source, .5, y - .02, .5))) y++;
assert.ok(y <= 19);
cameras.push({ name: 'plains-control', position: [0, y, 0] });

const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
let injected = game;
function hook(before, after) {
  assert.equal(injected.split(before).length, 2, before);
  injected = injected.replace(before, after);
}
const load = '  function loadWorld(seed){';
hook(load, "  const wildsFog=developerWorldFixtures&&new URLSearchParams(location.search).get('wilds-fog');\n" +
  load + `\n    if(wildsFog){storageReadOnly=true;return new Pack2LiveWorld(new WildsFamilyResearchWorld(${seed}));}`);
hook('const atmosphere=sampleSkyAtmosphere(sampleSkyClock(skyClock,now));',
  'const atmosphere=sampleSkyAtmosphere(wildsFog?SKY_DAY_MS/2:sampleSkyClock(skyClock,now));');
hook('const s6Mood=sampleS6BiomeSky(atmosphere,s6Biome);',
  'const baseMood=sampleS6BiomeSky(atmosphere,s6Biome);\n' +
  "      const s6Mood=wildsFog==='candidate'?sampleWildsTerrainFog(baseMood,player.x,player.z,world.seed):baseMood;");
injected = "import { WildsFamilyResearchWorld } from './manual-biomes/enchanted-wilds-family-source.mjs';\n" +
  "import { sampleWildsTerrainFog } from './manual-biomes/enchanted-wilds-atmosphere.mjs';\n" + injected;
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
  for (const mode of ['baseline', 'candidate']) {
    const context = await browser.newContext({ viewport: { width: 640, height: 300 }, serviceWorkers: 'block' });
    await context.addInitScript(() => {
      const gl = WebGL2RenderingContext.prototype, names = new WeakMap();
      const locate = gl.getUniformLocation, set = gl.uniform3fv;
      window.__wildsUniforms = {};
      gl.getUniformLocation = function (program, name) {
        const location = locate.call(this, program, name);
        if (location && (name === 'uFog' || name === 'uSkyLight')) names.set(location, name);
        return location;
      };
      gl.uniform3fv = function (location, values, ...rest) {
        const name = names.get(location);
        if (name) window.__wildsUniforms[name] = Array.from(values);
        return set.call(this, location, values, ...rest);
      };
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?wilds-fog=' + mode);
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    for (const { name, position } of cameras) {
      const fence = await page.evaluate(at => {
        const frame = Number(document.querySelector('#scene').dataset.renderedFrames);
        window.__mythwroughtTest.teleportCave(...at);
        window.__mythwroughtTest.setOrientation(0, -.02);
        return frame;
      }, position);
      const ready = await page.waitForFunction(({ position: [x, , z], fence }) => {
        const d = document.querySelector('#scene').dataset;
        return d.chunkCenter?.startsWith(Math.floor(x / 16) + ',' + Math.floor(z / 16)) &&
          Number(d.loadedChunks) === 25 && Number(d.pendingChunks) === 0 && Number(d.renderedFrames) > fence + 12;
      }, { position, fence }, { timeout: 35000 });
      await ready.dispose();
      const state = await page.evaluate(() => {
        const canvas = document.querySelector('#scene'), d = canvas.dataset;
        return { ...window.__wildsUniforms, daylight: Number(d.skyDaylight), moons: Number(d.skyMoonCount),
          owners: Number(d.loadedChunks), upperOwners: Number(d.upperGpuOwners), upperBytes: Number(d.upperGpuBytes),
          error: canvas.getContext('webgl2').getError(), worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
      });
      assert.equal(state.error, 0);
      assert.equal(state.daylight, 1);
      assert.ok(state.upperOwners <= 8 && state.upperBytes <= 7077888);
      assert.deepEqual(state.worldKeys, []);
      const file = mode + '-' + name + '.png';
      const shot = await page.screenshot({ path: resolve(out, file) });
      rows.push({ mode, name, position, file, sha256: digest(shot), ...state });
    }
    await context.close();
  }
  const palettes = new Set();
  for (const [index, camera] of cameras.entries()) {
    const baseline = rows[index], candidate = rows[index + cameras.length];
    assert.deepEqual(candidate.uSkyLight, baseline.uSkyLight);
    assert.equal(candidate.moons, baseline.moons);
    if (camera.name === 'plains-control') assert.deepEqual(candidate.uFog, baseline.uFog);
    else {
      assert.notDeepEqual(candidate.uFog, baseline.uFog);
      palettes.add(candidate.uFog.join(','));
    }
  }
  assert.equal(palettes.size, 5);
  assert.deepEqual(errors, []);
  const report = { seed, chromium: browser.version(), mainSha256: digest(game), injectedSha256: digest(injected),
    diagnostics: [...diagnostics], palettes: palettes.size, rows };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
