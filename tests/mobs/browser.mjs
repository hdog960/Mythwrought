import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { familiarWildlife } from '../../src/mobs/familiar-wildlife.mjs';
import { originalWildlife } from '../../src/mobs/original-wildlife.mjs';
import { hostileTactics } from '../../src/mobs/hostile-tactics.mjs';
import { speciesRegistry } from '../../src/mobs/species.mjs';

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
const wildlifeResults = [];
const verifiedIdle = new Set();
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
  const idleTags=['idle','clearing','outpost','wetland','disguise','perched','half-buried','thicket'];
  if (viewport[0]===667 && idleTags.includes(tag) && !verifiedIdle.has(evidence.species)) {
    assert.equal(await page.evaluate(()=>window.mobPreview.animateIdle(.31)),true);
    const animated=PNG.sync.read(await page.screenshot({animations:'disabled'}));
    assert.ok(framedPixels(png,animated,canvas).count>10,filename+' did not animate at rest');
    const physics=await page.evaluate(()=>window.mobPreview.inspect().mob.position);
    assert.deepEqual(physics,evidence.mob.position);
    verifiedIdle.add(evidence.species);
  }
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

async function verifyWildlife(page, viewport) {
  for (const [id, profile] of Object.entries(familiarWildlife)) {
    await page.locator('#wildlife').selectOption(id);
    const initial = await step(page, 0);
    assert.equal(initial.species, id);
    assert.equal(initial.eligibility, true);
    assert.equal(initial.mob.state, 'idle');
    await capture(page, viewport, 'idle', initial, ['Selected species loaded an eligible physical fixture']);
    const signatureState = id === 'mountain-goat' ? 'climb' : profile.activity;
    const signature = await step(page, 130, signatureState);
    assert.equal(signature.state, signatureState, id);
    const actionFrame = await step(page, 4);
    assert.equal(actionFrame.state, signatureState, id);
    await capture(page, viewport, 'signature-' + signatureState, actionFrame,
      ['Behavior state selected the matching model animation']);
    const movementState = id === 'mountain-goat' ? 'climb' : profile.travel;
    assert.equal((await step(page, 125, movementState)).state, movementState, id);
    const movement = await step(page, 16);
    assert.ok(Math.hypot(...movement.mob.position.map((value, axis) => value - initial.mob.position[axis])) > .23,
      id + ' did not move in world coordinates');
    await capture(page, viewport, 'movement-' + movementState, movement,
      ['Fixed-step movement displaced the body in the voxel world']);
    wildlifeResults.push({ species: id, viewport, status: 'PASS', signature: signatureState, movement: movementState });
  }

  await page.locator('#wildlife').selectOption('cow');
  await command(page, 'breed');
  const herd = await step(page, 1);
  assert.equal(herd.actors.filter(entity => entity.species.id === 'cow').length, 3);
  assert.equal(herd.actors.filter(entity => entity.juvenile).length, 1);
  await capture(page, viewport, 'offspring', herd, ['A nearby eligible pair produced one calf']);
  await command(page, 'breed');
  assert.equal((await step(page, 1)).actors.filter(entity => entity.juvenile).length, 1);

  await page.locator('#wildlife').selectOption('horse');
  await command(page, 'near');
  await command(page, 'tame');
  assert.equal((await step(page, 0)).tamed, true);
  await command(page, 'mount');
  const mounted = await step(page, 1);
  assert.ok(mounted.rider);
  await command(page, 'run');
  const ridden = await step(page, 14);
  assert.equal(ridden.state, 'mounted-run');
  assert.ok(horizontal(mounted.mob.position, ridden.mob.position) > .65);
  assert.deepEqual(ridden.target.position, ridden.rider);
  await capture(page, viewport, 'mounted-run', ridden, ['Rider position followed the actual horse body']);
  await command(page, 'halt');
  await command(page, 'dismount');
  assert.equal((await step(page, 1)).rider, null);

  await page.locator('#wildlife').selectOption('fox');
  await command(page, 'prey');
  const stalking = await step(page, 100, 'stalk');
  assert.equal(stalking.state, 'stalk');
  assert.ok(stalking.actors.some(entity => entity.species.id === 'rabbit'));
  await capture(page, viewport, 'stalk', stalking, ['Fox detected and stalked a physically simulated rabbit']);

  await page.locator('#wildlife').selectOption('wolf');
  await command(page, 'near');
  await command(page, 'bond');
  const wolf = await step(page, 1);
  assert.ok(wolf.companions.some(slot => slot.id === wolf.mob.id));
  await command(page, 'threat');
  const defended = await step(page, 3);
  const enemy = defended.actors.find(entity => entity.species.id === 'goblin');
  assert.ok(enemy?.health < enemy?.species.combat.health);
  await command(page, 'stay');
  assert.equal((await step(page, 2)).state, 'stay');
  await command(page, 'down');
  assert.equal((await step(page, 1)).state, 'downed');
  await command(page, 'near');
  await step(page, 32);
  await command(page, 'rescue');
  const rescued = await step(page, 1);
  assert.equal(rescued.state, 'follow');
  assert.equal(rescued.mob.id, wolf.mob.id);
  await capture(page, viewport, 'wolf-rescue', rescued, ['Wolf resumed following with the original bonded identity']);
}

async function verifyOriginalWildlife(page, viewport) {
  for (const [id, profile] of Object.entries(originalWildlife)) {
    await page.locator('#wildlife').selectOption(id);
    const initial = await step(page,0);
    assert.equal(initial.species,id);
    assert.equal(initial.eligibility,true,id);
    assert.equal(initial.mob.state,'idle');
    await capture(page,viewport,'idle',initial,['Original model and eligible world fixture loaded']);
    const signature = await step(page,200,profile.activity);
    assert.equal(signature.state,profile.activity,id);
    await capture(page,viewport,'signature-'+profile.activity,await step(page,4),
      ['Runtime generated the species-specific activity']);
    const started = await step(page,200,profile.travel);
    assert.equal(started.state,profile.travel,id);
    const motion = await step(page,21);
    assert.ok(Math.hypot(...motion.mob.position.map((value,i)=>value-initial.mob.position[i])) > .20,id);
    if (profile.medium) assert.equal(motion.mob.motionMode,profile.medium,id);
    await capture(page,viewport,'movement-'+profile.travel,motion,
      ['World coordinates changed through the collision solver']);

    if (profile.medium==='fly') {
      await command(page,'fly');
      const flying=await step(page,120);
      assert.equal(flying.mob.motionMode,'fly');
      assert.ok(flying.mob.position[1] > initial.mob.position[1] + 1);
      assert.equal(flying.mob.grounded,false);
      await capture(page,viewport,'airborne',flying,['Flight moved and held the body above the terrain']);
      await command(page,'land');
      const landed=await step(page,165);
      assert.equal(landed.mob.grounded,true,id);
      assert.equal(landed.mob.motionMode,'walk',id);
      assert.ok(Math.abs(landed.mob.position[1]-initial.mob.position[1]) < .055,id);
    }
    if (profile.medium==='swim') {
      await command(page,'bank');
      const bank=await step(page,275);
      assert.equal(bank.mob.grounded,true,id);
      assert.equal(bank.mob.motionMode,'walk',id);
      assert.ok(bank.mob.position[0] > -3.7,id);
      await capture(page,viewport,'bank',bank,['Creature exited verified water onto physical ground']);
      await command(page,'pool');
      const pool=await step(page,275);
      assert.equal(pool.mob.motionMode,'swim',id);
    }
    wildlifeResults.push({species:id,viewport,status:'PASS',signature:profile.activity,movement:profile.travel});
  }
}

async function verifyHostiles(page,viewport) {
  for (const [id,tactic] of Object.entries(hostileTactics)) {
    await page.locator('#wildlife').selectOption(id);
    const initial=await step(page,tactic.sleep ? 2:0);
    assert.equal(initial.species,id);
    assert.equal(initial.eligibility,true,id);
    if (tactic.sleep) assert.equal(initial.state,tactic.sleep,id);
    await capture(page,viewport,tactic.sleep??'idle',initial,['Independent hostile model loaded in eligible terrain']);
    if (tactic.climb) {
      await command(page,'wall');
      const climbed=await step(page,19);
      assert.equal(climbed.mob.motionMode,'climb');
      assert.ok(climbed.mob.position[1]>initial.mob.position[1]+.5);
      await capture(page,viewport,'climb',climbed,['Approved cave face changed the actual body altitude']);
      await command(page,'wall');
      assert.equal((await step(page,45)).mob.grounded,true);
    }
    await command(page,'encounter');
    if (tactic.wake) {
      const awake=await step(page,30,tactic.wake);
      assert.equal(awake.state,tactic.wake,id);
      await capture(page,viewport,tactic.wake,awake,['Target triggered the actual foiled disguise or perch transition']);
    }
    const pursuing=await step(page,150,'pursue');
    assert.equal(pursuing.state,'pursue',id);
    const moved=await step(page,18,'prepare-attack');
    assert.ok(Math.hypot(...moved.mob.position.map((value,index)=>value-initial.mob.position[index]))>.16,id);
    if (tactic.medium==='fly') assert.equal(moved.mob.motionMode,'fly',id);
    await capture(page,viewport,'movement-'+tactic.attack,moved,['Pursuit displaced the physical body']);
    const windup=['prepare-attack'].includes(moved.state) ? moved : await step(page,165,'prepare-attack');
    assert.equal(windup.state,'prepare-attack',id);
    assert.equal(windup.target.health,100,id);
    await capture(page,viewport,'windup-'+tactic.attack,windup,['Attack windup preceded damage']);
    const firing=await step(page,60,'attack');
    assert.equal(firing.state,'attack',id);
    if (tactic.attack==='ranged') {
      assert.equal(firing.projectiles.length,1);
      assert.equal(firing.target.health,100);
      await capture(page,viewport,'projectile-flight',firing,['Projectile was in actual flight before impact']);
    }
    const recovering=await step(page,20);
    assert.ok(recovering.target.health < 100,id);
    assert.ok(recovering.events.some(event=>event.type==='damage' && event.source===initial.mob.id),id);
    await command(page,'withdraw');
    const disengaged=await step(page,250,'disengage');
    assert.equal(disengaged.state,'disengage',id);
    assert.equal(disengaged.target.health,recovering.target.health,id);
    await command(page,'hurt');
    const hurt=await step(page,1);
    assert.equal(hurt.state,'hurt');
    assert.ok(hurt.mob.health < hurt.mob.species.combat.health);
    await command(page,'defeat');
    const defeat=await step(page,1);
    assert.equal(defeat.state,'defeat');
    assert.equal(defeat.mob.health,0);
    if (id==='troll' || id==='shardmaw') await capture(page,viewport,'defeat',defeat,
      ['Lethal damage removed the runtime body and retained a brief defeat pose']);
    const despawn=await step(page,45);
    assert.equal(despawn.state,'removed');
    assert.equal(despawn.actors.some(actor=>actor.id===initial.mob.id),false);
    await command(page,'restart');
    const retry=await step(page,0);
    assert.notEqual(retry.mob.id,initial.mob.id);
    assert.equal(retry.mob.health,retry.mob.species.combat.health);
    wildlifeResults.push({species:id,viewport,status:'PASS',attack:tactic.attack,cleanup:true});
  }
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
      await capture(page,viewport,'first-response',fleeing,['Detection led to a genuine flee state']);
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
      const pursuingGoblin=await step(page,120,'pursue');
      const movingGoblin=await step(page,15,'prepare-attack');
      assert.ok(horizontal(pursuingGoblin.mob.position,movingGoblin.mob.position)>.12);
      await capture(page,viewport,'pursuit',movingGoblin,['Goblin moved using the navigable open doorway']);
      const windup = movingGoblin.state==='prepare-attack' ? movingGoblin : await step(page,220,'prepare-attack');
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
        const loads=[
          [0,{},0], [1,{},1], [8,{},8], [16,{activeLimit:16},16],
          [24,{activeLimit:16},16], [24,{activeLimit:24},24],
          [0,{place:'cave',encounter:true},0],
          [8,{place:'cave',encounter:true},8],
          [16,{place:'cave',encounter:true,activeLimit:16},16],
          [24,{place:'cave',encounter:true,activeLimit:24},24]
        ];
        for (const [count,options,active] of loads) {
          const result = await page.evaluate(([n,scene])=>window.mobPreview.benchmark(n,32,scene),[count,options]);
          assert.equal(result.emptyAfterDispose,true);
          assert.equal(result.active,active);
          assert.equal(result.dormant,count-active);
          assert.equal(result.liveAfterStress,count);
          if (options.encounter && count) assert.ok(result.attackEvents>0);
          performance.push(result);
        }
      }
      await verifyWildlife(page, viewport);
      await verifyOriginalWildlife(page,viewport);
      await verifyHostiles(page,viewport);
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
      console.log(width+'x'+height+': all 40 creature scenarios passed');
    } finally {
      await context.close();
    }
  }
  const requiredWidths = [667,844,932];
  const speciesAcceptance = speciesRegistry.map(species => {
    const captures = hashes.filter(image => image.species === species.id);
    const verifiedWidths = [...new Set(captures.map(image => image.viewport[0]))];
    const verified = species.implementation === 'preview' && !dirty && verifiedIdle.has(species.id) &&
      requiredWidths.every(width => captures.filter(image=>image.viewport[0]===width).length>=3 &&
        (['deer','goblin','glownewt'].includes(species.id) ||
          wildlifeResults.some(result=>result.species===species.id && result.viewport[0]===width)));
    return {
      species: species.id, classification: species.classification, registry: 'PASS',
      implementation: species.implementation, staging: verified ? 'PASS' : 'BLOCKED',
      detail: verified ? 'Phase checkpoint scenario gate passed' : species.implementation === 'definition'
        ? 'Implementation and browser scenarios pending' : 'Source-matched viewport matrix pending',
      screenshotCount: captures.length, verifiedWidths, idleAnimation:verifiedIdle.has(species.id)
    };
  });
  assert.equal(verifiedIdle.size,40);
  const exactRun = !dirty && process.env.MOB_DEBUG !== '1';
  const scenarioAcceptance = exactRun && speciesAcceptance.every(entry=>entry.staging==='PASS');
  if (exactRun) {
    assert.equal(scenarioAcceptance,true);
    assert.ok(hashes.length>=360);
  }
  await writeFile(join(output,'species-acceptance.json'),JSON.stringify({
    source, phase: 9, scenarioAcceptance: scenarioAcceptance ? 'PASS' : 'BLOCKED',
    physicalIPhoneAcceptance:'CREATOR_PENDING', species: speciesAcceptance
  },null,2)+'\n');
  await writeFile(join(output,'manifest.json'),JSON.stringify({
    source, dirty, browser:browser.version(), renderer:'Chromium ANGLE SwiftShader WebGL2',
    mobileViewportEmulation:true, physicalDevice:false, scenarios, wildlifeResults, performance, screenshots:hashes
  },null,2)+'\n');
} finally {
  await browser.close();
}
