import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json' };

function cameraFor(witness, world, { collides, raycast, BLOCK }) {
  const [x, y, z] = witness.point;
  if (witness.region === 'wilds' &&
      !collides(world, -140.5, 10.01, -724.5) && collides(world, -140.5, 9.98, -724.5)) {
    return { camera: [-141, 10, -725], orientation: [Math.PI / 2, -.12], recordedLandmarkApproach: true };
  }
  const offsets = [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, 2], [2, -2],
    [-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]];
  let fallback;
  for (const [dx, dz] of offsets) for (const feet of [y + 1, y, y + 2, y - 1, y - 2]) {
    const cx = x + dx + .5, cz = z + dz + .5;
    if (collides(world, cx, feet + .01, cz) || !collides(world, cx, feet - .02, cz)) continue;
    const direction = [x + .5 - cx, y + .92 - (feet + 1.55), z + .5 - cz];
    const distance = Math.hypot(...direction);
    const ray = raycast(world, [cx, feet + 1.55, cz], direction, distance + .5);
    const visible = witness.after === BLOCK.AIR ? !ray || ray.distance >= distance :
      ray?.hit.every((value, i) => value === witness.point[i]);
    const [a, b, c] = direction;
    const shot = { camera: [x + dx, feet, z + dz],
      orientation: [Math.atan2(a, c), Math.atan2(b, Math.hypot(a, c))], nativeSightline: Boolean(visible) };
    if (visible) return shot;
    fallback ??= shot;
  }
  if (fallback) return fallback;
  throw Error('No physically supported camera for ' + witness.region);
}

export async function qualifyCompositionWebGL({ root, pins, seed, witnesses, cuts, world, V }) {
  const release = resolve(root, 'release-main');
  const out = resolve(process.env.RUNNER_TEMP ?? 'artifacts', 'world-ascension-composition');
  const original = await readFile(resolve(release, 'src/main.mjs'), 'utf8');
  const marker = '  function loadWorld(seed){';
  assert.equal(original.split(marker).length, 2);
  const injected = "import { loadCompositionFixture } from '/__wa/composition-browser-source.mjs';\n" +
    original.replace(marker, marker + `\n    if(developerWorldFixtures&&new URLSearchParams(location.search).has('world-ascension-proof')){
      storageReadOnly=true;return loadCompositionFixture(${seed});
    }`);
  const scenes = witnesses.map(witness => ({ ...witness, ...cameraFor(witness, world, V) }));
  const cutsJson = JSON.stringify([...cuts]);
  const fixtures = new Map(await Promise.all(['composition-reader.mjs', 'composition-browser-source.mjs']
    .map(async file => ['/__wa/' + file, await readFile(new URL(file, import.meta.url))])));
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const match = /^\/regions\/([a-z-]+)\/(src\/.*\.mjs)$/.exec(pathname);
      const base = match ? resolve(root, match[1]) : release;
      if (match && (!Object.hasOwn(pins, match[1]) || match[1] === 'release-main')) throw Error('Unknown regional source');
      const file = resolve(base, match ? match[2] : '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(base + sep)) throw Error('Outside the fixture checkout');
      const bytes = pathname === '/src/main.mjs' ? injected : pathname === '/__wa/cuts.json' ? cutsJson :
        fixtures.get(pathname) ?? await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await mkdir(out, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { chromium } = createRequire(resolve(root, 'frostbound', 'package.json'))('playwright');
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 956, height: 440 }, serviceWorkers: 'block' });
    const page = await context.newPage(), errors = [], diagnostics = new Set(), shots = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) diagnostics.add(message.text());
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/?world-ascension-proof=1',
      { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__mythwroughtTest?.snapshot()?.graphics?.shaderReady,
      null, { timeout: 30000 });
    const loadedProfile = await page.evaluate(() => window.__mythwroughtTest.fourBiomeProfile());
    assert.equal(loadedProfile?.seed, seed, JSON.stringify({ loadedProfile, errors, diagnostics: [...diagnostics] }));
    assert.match(loadedProfile.generator, /veilreach/);
    if (await page.locator('#closeHelp').isVisible()) await page.locator('#closeHelp').click();
    for (const scene of scenes) {
      const frame = await page.evaluate(({ camera, orientation }) => {
        const api = window.__mythwroughtTest;
        const previous = Number(document.querySelector('#scene').dataset.renderedFrames ?? 0);
        api.teleportCave(...camera);
        api.setOrientation(...orientation);
        return previous;
      }, scene);
      const settled = await page.waitForFunction(({ camera: [x, , z], frame }) => {
        const d = document.querySelector('#scene').dataset;
        const center = Math.floor(x / 16) + ',' + Math.floor(z / 16);
        return (d.chunkCenter === center || d.chunkCenter?.startsWith(center + '|') ||
          d.chunkCenter?.startsWith(center + ':')) &&
          Number(d.renderedFrames) > frame + 4 && Number(d.pendingChunks) === 0 &&
          Number(d.loadedChunks) > 0 && Number(d.renderedMeshVertices) > 0;
      }, { camera: scene.camera, frame }, { timeout: 35000 }).catch(async error => {
        const observation = await page.evaluate(() => {
          const d = document.querySelector('#scene').dataset, api = window.__mythwroughtTest;
          return { pose: api.m5ObservedPose(), center: d.chunkCenter, frames: d.renderedFrames,
            owners: d.loadedChunks, pending: d.pendingChunks, vertices: d.renderedMeshVertices, faults: api.gpuUploadFaults() };
        });
        throw Error('Composition view failed to settle ' + JSON.stringify({
          region: scene.region, camera: scene.camera, frame, observation, errors, diagnostics: [...diagnostics]
        }), { cause: error });
      });
      await settled.dispose();
      const state = await page.evaluate(point => {
        const api = window.__mythwroughtTest, canvas = document.querySelector('#scene');
        const d = canvas.dataset, gl = canvas.getContext('webgl2');
        return { id: api.block(...point), pose: api.m5ObservedPose(), owners: Number(d.loadedChunks),
          upperOwners: Number(d.upperGpuOwners ?? 0), upperBytes: Number(d.upperGpuBytes ?? 0),
          waterOwners: Number(d.waterSections), error: gl.getError(),
          worldKeys: Object.keys(localStorage).filter(key => key.includes('-world-')) };
      }, scene.point);
      assert.equal(state.id, scene.after, scene.region);
      assert.equal(state.error, 0, scene.region);
      assert.ok(state.owners <= (scene.region === 'underworld' ? 27 : 25), scene.region);
      assert.ok(state.upperOwners <= 8 && state.upperBytes <= 7077888, scene.region);
      assert.deepEqual(state.worldKeys, []);
      if (scene.region === 'frostbound') assert.ok(state.waterOwners > 0);
      const file = scene.region + '.png', bytes = await page.screenshot({ path: resolve(out, file) });
      shots.push({ ...scene, ...state, file, screenshotSha256: digest(bytes) });
    }
    assert.deepEqual(errors, []);
    const report = { seed, pins, chromium: browser.version(), profile: loadedProfile, readOnly: true,
      originalSha256: digest(original), injectedSha256: digest(injected), cutsSha256: digest(cutsJson),
      diagnostics: [...diagnostics], shots };
    await writeFile(resolve(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    return report;
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
