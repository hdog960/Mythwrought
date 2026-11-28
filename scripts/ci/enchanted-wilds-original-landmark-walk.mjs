// Natural source mounted in the original read-only game fixture. All walking
// after initial placement uses the actual keyboard controller and renderer.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { WildsFamilyResearchWorld } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { inspectWildsLandmarkWalk } from '../../src/manual-biomes/enchanted-wilds-landmark-walk.mjs';

const root = process.cwd(), out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'wilds-original-landmark-walk');
const seed = 179, source = new WildsFamilyResearchWorld(seed);
const directions = [[0, 1], [-1, 0], [0, -1], [1, 0]];
const sites = [
  [-25, -778], [-135, -726], [-136, -697], [-139, -584], [-10, -583], [154, -570]
].map(([x, z]) => {
  const landmark = source.wildsSource.landmark(Math.floor(x / 16), Math.floor(z / 16));
  const route = inspectWildsLandmarkWalk(source, landmark);
  assert.ok(route);
  return { name: landmark.name, origin: landmark.origin, route,
    direction: directions[landmark.turn], cell: landmark.cells[0] };
});
const game = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
const marker = '  function loadWorld(seed){';
assert.equal(game.split(marker).length, 2);
const injected = "import { WildsFamilyResearchWorld } from './manual-biomes/enchanted-wilds-family-source.mjs';\n" +
  game.replace(marker, marker + `\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('wilds-walk-fixture')){
      storageReadOnly=true;return new Pack2LiveWorld(new WildsFamilyResearchWorld(${seed}));
    }`);
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = resolve(root, pathname === '/' ? 'index.html' : '.' + pathname);
    if (!file.startsWith(root + sep)) throw Error('Outside fixture checkout');
    const bytes = pathname === '/src/main.mjs' ? injected : await readFile(file);
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
  const browserContext = await browser.newContext({ viewport: { width: 956, height: 440 }, serviceWorkers: 'block' });
  const page = await browserContext.newPage(), errors = [], diagnostics = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) diagnostics.push(message.text()); });
  await page.goto('http://127.0.0.1:' + server.address().port + '/?wilds-walk-fixture=1', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady, null, { timeout: 30000 });
  if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();

  const pose = () => page.evaluate(() => window.__mythwroughtTest.m5ObservedPose());
  async function walk(key, from, direction, distance, returning = false) {
    await page.keyboard.down(key);
    try {
      await page.waitForFunction(({ from, direction: [dx, dz], distance, returning }) => {
        const p = window.__mythwroughtTest.m5ObservedPose();
        const progress = (p.x - from.x) * dx + (p.z - from.z) * dz;
        return returning ? progress <= .42 : progress >= distance - .25;
      }, { from, direction, distance, returning }, { timeout: 20000, polling: 'raf' });
    } finally {
      await page.keyboard.up(key);
    }
    return pose();
  }
  const results = [];
  for (const site of sites) {
    const from = await page.evaluate(({ route, direction: [dx, dz] }) => {
      const api = window.__mythwroughtTest;
      api.teleportCave(Math.floor(route.from.x), route.from.feet, Math.floor(route.from.z));
      api.setOrientation(Math.atan2(dx, dz), -.12);
      return api.m5ObservedPose();
    }, site);
    assert.equal(from.seed, seed);
    await page.waitForFunction(({ x, z }) => {
      const data = document.querySelector('#scene').dataset;
      return data.chunkCenter?.startsWith(Math.floor(x / 16) + ',' + Math.floor(z / 16)) && Number(data.pendingChunks) === 0;
    }, from, { timeout: 25000 });
    assert.equal(await page.evaluate(([x, y, z]) => window.__mythwroughtTest.block(x, y, z), site.cell), site.cell[3]);
    const end = await walk('w', from, site.direction, site.route.distance);
    const file = site.name.toLowerCase().replaceAll(' ', '-') + '.png';
    const image = await page.screenshot({ path: resolve(out, file) });
    const returned = await walk('s', from, site.direction, site.route.distance, true);
    assert.ok(Math.abs(end.feet - from.feet) < .15 && Math.abs(returned.feet - from.feet) < .15);
    const settled = await page.evaluate(() => {
      const canvas = document.querySelector('#scene'), gl = canvas.getContext('webgl2');
      return { glError: gl.getError(), owners: Number(canvas.dataset.loadedChunks),
        worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
    });
    assert.equal(settled.glError, 0);
    assert.ok(settled.owners <= 25);
    assert.deepEqual(settled.worldKeys, []);
    results.push({ name: site.name, from, end, returned, file, sha256: createHash('sha256').update(image).digest('hex'), ...settled });
  }
  assert.deepEqual(errors, []);
  const report = { seed, chromium: browser.version(), diagnostics, results };
  await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
