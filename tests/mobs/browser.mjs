import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const origin = process.env.MOB_PREVIEW_URL || 'http://127.0.0.1:4176/mob-preview/';
const output = resolve(process.env.MOB_EVIDENCE || 'artifacts/mob-preview');
const source = execFileSync('git', ['rev-parse','HEAD'], { encoding: 'utf8' }).trim();
const dirty = Boolean(execFileSync('git', ['status','--porcelain=v1','--','src/mobs','mob-preview','tests/mobs'],
  { encoding: 'utf8' }).trim());
if (dirty && process.env.MOB_DEBUG !== '1') throw Error('Commit the exact preview source before collecting evidence');
const viewports = [[667,375],[844,390],[932,430],[956,440]];
const sizes = process.env.MOB_DEBUG === '1' ? viewports.slice(0, 1) : viewports;
const fixtureSave = JSON.stringify({ schema: 1, seed: 179, edits: [[10,-35,-2,0]] });
const seedKey = 'mythwrought-v002-world-179';
const hashes = [];
const scenarios = [];
const performance = [];
const executablePath = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch({ executablePath, args: [
  '--no-sandbox', '--disable-dev-shm-usage', '--enable-webgl', '--use-gl=angle',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader'
] });
await mkdir(output, { recursive: true });
const step = (page, count, state) => page.evaluate(([n, stop]) => {
  if (!window.mobPreview.step(n, stop)) throw Error('Preview step failed');
  return window.mobPreview.inspect();
}, [count, state]);
const click = (page, selector) => page.locator(selector).click();
const command = (page, action) => click(page, '[data-action="' + action + '"]');
const choose = (page, species) => click(page, '[data-species="' + species + '"]');
const horizontal = (a,b) => Math.hypot(a[0]-b[0], a[2]-b[2]);

function framedPixels(pixels, baseline, canvas) {
  let count = 0, minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  const cx = canvas.x + canvas.width / 2, cy = canvas.y + canvas.height / 2;
  for (let y = Math.floor(cy - 85); y < Math.ceil(cy + 85); y++) {
    for (let x = Math.floor(cx - 85); x < Math.ceil(cx + 85); x++) {
      const index = (y * pixels.width + x) * 4;
      const difference = [0,1,2].reduce((sum, channel) =>
        sum + Math.abs(pixels.data[index+channel] - baseline.data[index+channel]), 0);
      if (difference <= 18) continue;
      count++;
      minX = Math.min(minX,x); maxX = Math.max(maxX,x); minY = Math.min(minY,y); maxY = Math.max(maxY,y);
    }
  }
  return { count, bounds: count ? [minX,minY,maxX,maxY] : null };
}

async function capture(page, viewport, tag, evidence, assertions) {
  assert.equal(evidence.glError, 0);
  assert.equal(evidence.contextLost, false);
  assert.equal(evidence.schema1Untouched, true);
  assert.ok(evidence.draw.actors >= 1);
  const [width, height] = viewport;
  const filename = evidence.species + '-' + tag + '-' + width + 'x' + height + '.png';
  const path = join(output, filename);
  await page.screenshot({ path, animations: 'disabled' });
  const data = await readFile(path);
  const png = PNG.sync.read(data);
  assert.deepEqual([png.width, png.height], viewport);
  const canvas = await page.locator('canvas').boundingBox();
  await page.evaluate(() => window.mobPreview.showSubject(false));
  const baseline = PNG.sync.read(await page.screenshot({ animations: 'disabled' }));
  await page.evaluate(() => window.mobPreview.showSubject(true));
  const framing = framedPixels(png, baseline, canvas);
  assert.ok(framing.count >= 120, filename + ' missing visible centered creature ' + JSON.stringify(framing));
  hashes.push({ filename, source, species: evidence.species, scenario: tag, viewport,
    dimensions: [png.width,png.height], sha256: createHash('sha256').update(data).digest('hex'),
    state: evidence.state, position: evidence.mob.position, camera: framing,
    glError: evidence.glError, contextLost: evidence.contextLost, assertions });
}

try {
  for (const [width,height] of sizes) {
    const viewport = [width,height];
    const context = await browser.newContext({ viewport: { width,height }, hasTouch: true, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.addInitScript(([key, bytes]) => {
        localStorage.setItem(key, bytes);
        localStorage.setItem(key + '-backup-v009', bytes);
        localStorage.setItem(key + '-integrity-v009', 'synthetic-baseline-journal');
      }, [seedKey, fixtureSave]);
      await page.goto(origin + '?test=1');
      await page.waitForFunction(() => window.mobPreview?.inspect().graphics === true, null, { timeout: 20000 });
      const initial = await step(page,0);
      await capture(page, viewport, 'clearing', initial, ['Species model and production voxel mesh rendered']);
      await command(page, 'approach');
      const fleeing = await step(page,20,'flee');
      assert.equal(fleeing.state,'flee');
      const moved = await step(page,14);
      assert.ok(horizontal(initial.mob.position,moved.mob.position) > .35);
      await capture(page, viewport, 'flee-response', moved, ['Approach drove the flee state', 'Physics moved the deer']);
      await command(page, 'withdraw');

      await choose(page, 'goblin');
      await capture(page, viewport, 'outpost', await step(page,0), ['Goblin and the authentic Pack 2 outpost door rendered']);
      await command(page, 'door');
      const opened = await step(page,0);
      assert.equal(opened.doorOpen,true);
      assert.equal(opened.revision,1);
      await command(page,'encounter');
      const windup = await step(page,220,'prepare-attack');
      assert.equal(windup.state,'prepare-attack');
      assert.ok(windup.mob.position[2] > 1.5);
      assert.equal(windup.target.health,100);
      await capture(page,viewport,'windup',windup, ['Exact door identity was opened', 'Goblin traversed physical terrain', 'Windup preceded damage']);
      const attack = await step(page,30,'attack');
      assert.equal(attack.target.health,93);
      assert.ok(attack.events.some(event => event.type === 'damage' && event.amount === 7));
      await command(page,'withdraw');
      const disengaged = await step(page,160,'disengage');
      assert.equal(disengaged.state,'disengage');
      assert.equal(disengaged.target.health,93);

      await choose(page,'glownewt');
      await capture(page,viewport,'wetland',await step(page,0), ['Original Glownewt model rendered in the wetland']);
      await command(page,'near');
      await command(page,'bond');
      const bonded = await step(page,1);
      assert.deepEqual(bonded.companions.map(slot => slot.id),[bonded.mob.id]);
      await command(page,'move');
      const following = await step(page,75);
      assert.equal(following.state,'follow');
      assert.ok(horizontal(bonded.mob.position,following.mob.position) > 1.5);
      await capture(page,viewport,'follow',following, ['Bond recorded the original ID', 'Glownewt physically followed the guide']);
      await command(page,'stay');
      await command(page,'move');
      const stayed = await step(page,35);
      assert.equal(stayed.state,'stay');
      assert.ok(horizontal(stayed.mob.position,following.mob.position) < .03);
      await command(page,'follow');
      const resumed = await step(page,85);
      assert.ok(horizontal(stayed.mob.position,resumed.mob.position) > .8);
      await command(page,'down');
      const down = await step(page,1);
      assert.equal(down.state,'downed');
      await capture(page,viewport,'downed',down,['Stay held position', 'Follow resumed', 'Downing retained the bonded ID']);
      await command(page,'near');
      await step(page,40);
      await command(page,'rescue');
      const rescued = await step(page,1);
      assert.equal(rescued.mob.id,bonded.mob.id);
      assert.equal(rescued.state,'follow');
      assert.ok(rescued.mob.health > 0);
      await capture(page,viewport,'rescued',rescued,['Rescue restored health and the same Glownewt resumed following']);

      await choose(page,'deer');
      await choose(page,'glownewt');
      assert.equal((await step(page,0)).mob.id,bonded.mob.id);
      const storage = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage)
        .map(key => [key,localStorage.getItem(key)])));
      assert.deepEqual(storage,{[seedKey]:fixtureSave,[seedKey+'-backup-v009']:fixtureSave,
        [seedKey+'-integrity-v009']:'synthetic-baseline-journal'});
      let contextRecovered = false;
      if (width === 667) {
        assert.equal(await page.evaluate(() => window.mobPreview.context()), true);
        await page.waitForFunction(() => window.mobPreview.inspect().contextLost);
        await page.waitForFunction(() => window.mobPreview.inspect().losses === 1);
        const loss = await page.evaluate(() => window.mobPreview.inspect());
        assert.equal(await page.evaluate(() => window.mobPreview.context(true)),true);
        await page.waitForFunction(() => window.mobPreview.inspect().restores === 1);
        const restored = await step(page,0);
        assert.equal(restored.glError,0);
        assert.equal(restored.contextLost,false);
        assert.ok(restored.frames > loss.frames);
        assert.deepEqual(restored.resources,loss.resources);
        contextRecovered = true;
        await choose(page,'deer');
        for (const count of [0,24]) {
          const result = await page.evaluate(n => window.mobPreview.benchmark(n,60),count);
          assert.equal(result.emptyAfterDispose,true);
          assert.equal(result.active,count ? 16 : 0);
          assert.equal(result.dormant,count ? 8 : 0);
          assert.equal(result.liveAfterStress,count);
          performance.push(result);
        }
      }
      const started = await step(page,0);
      await page.evaluate(() => window.mobPreview.teardown());
      const stopped = await page.evaluate(() => ({
        stepped: window.mobPreview.step(1), resources: window.mobPreview.resources()
      }));
      assert.equal(stopped.stepped,false);
      assert.deepEqual(stopped.resources,{buffers:0,arrays:0,programs:0,bytes:0});
      assert.ok(started.resources.buffers > 0);
      assert.deepEqual(errors,[]);
      scenarios.push({viewport, screenshots:hashes.filter(entry=>entry.viewport[0]===width).length,
        contextRecovered, storageUnchanged:true, pageErrors:errors});
      console.log(width+'x'+height+': Deer, Goblin, Glownewt and storage assertions passed');
    } finally {
      await context.close();
    }
  }
  await writeFile(join(output,'manifest.json'),JSON.stringify({
    source, dirty, browser:browser.version(), renderer:'Chromium ANGLE SwiftShader WebGL2',
    mobileViewportEmulation:true, physicalDevice:false, scenarios, performance, screenshots:hashes
  },null,2)+'\n');
} finally {
  await browser.close();
}
