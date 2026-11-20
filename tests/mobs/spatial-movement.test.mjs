import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { steerInVolume } from '../../src/mobs/navigation.mjs';
import { arena } from './fixture.mjs';

function fixture(biome = 'forest', resident = () => true) {
  const world = arena({ floor: -3 });
  const query = createWorldQuery(world, {
    resident, observe: () => ({ biome, light: .45, hazard: false, dayPhase: 'dusk' })
  });
  return { world, query, engine: new MobEngine(query) };
}

test('flyers gain altitude, hover, and land using the fixed-step body solver', () => {
  const { query, engine } = fixture();
  const id = engine.spawn('moonmoth', [.5,-2,.5]);
  assert.ok(id);
  for (let i=0; i<25; i++) engine.advance(FIXED_STEP, () => ({ direction: [0,0], vertical: 1, mode: 'fly' }));
  const airborne = engine.get(id);
  assert.ok(airborne.position[1] > -1);
  assert.equal(airborne.grounded, false);
  assert.equal(airborne.motionMode, 'fly');
  for (let i=0; i<30; i++) engine.advance(FIXED_STEP, () => ({ direction: [0,0], mode: 'fly' }));
  assert.deepEqual(engine.get(id).position,airborne.position);
  for (let i=0; i<55; i++) engine.advance(FIXED_STEP, () => [0,0]);
  assert.equal(engine.get(id).grounded,true);
  assert.equal(query.volume(engine.get(id).position,airborne.species.body),'clear');
});

test('air navigation detours around voxels and cannot cross missing chunk data', () => {
  const { world, query, engine } = fixture('alpine', cx => cx < 0);
  for (const y of [-2,-1,0,1]) world.set(-2,y,0,BLOCK.STONE);
  const id = engine.spawn('cloudfinch',[-2.45,-1,.5]);
  assert.ok(id);
  const steering = steerInVolume(query,engine.get(id),[-.5,-.4,.5],'fly');
  assert.ok(steering.direction[1] !== 0 || steering.vertical < 0);
  for (let step=0; step<90; step++) {
    engine.advance(FIXED_STEP,mob => ({ direction: [1,0], vertical: .12, mode:'fly' }));
    assert.equal(query.volume(engine.get(id).position,engine.get(id).species.body),'clear');
  }
  assert.ok(engine.get(id).position[0] < -2.1);
  const seam = engine.spawn('cloudfinch',[-.45,-1,2.5]);
  for (let step=0; step<60; step++) engine.advance(FIXED_STEP,mob =>
    mob.id === seam ? { direction:[1,0], mode:'fly' } : [0,0]);
  assert.ok(engine.get(seam).position[0] <= -.149);
});

test('Pack 2 fluid volume enables swimming and dry terrain restores gravity', () => {
  const { world, query, engine } = fixture('wetland');
  for (const x of [0,1,2]) assert.ok(world.placePack2(x,-2,0,76,{ level:0, flow:'still' }));
  assert.equal(query.medium([.5,-1.2,.5]),'water');
  assert.equal(query.medium([.5,-.8,.5]),'air');
  const id=engine.spawn('reedwhisker',[-.25,-2,.5]);
  for (let step=0; step<30; step++) engine.advance(FIXED_STEP, () => ({direction:[1,0],mode:'swim'}));
  assert.equal(engine.get(id).motionMode,'swim');
  for (let step=0; step<16; step++) engine.advance(FIXED_STEP, () => ({direction:[0,0],vertical:.45,mode:'swim'}));
  assert.ok(engine.get(id).position[1] > -1.8);
  for (let step=0; step<110; step++) engine.advance(FIXED_STEP, () => ({direction:[1,0],mode:'swim'}));
  assert.notEqual(engine.get(id).motionMode,'swim');
  assert.equal(engine.get(id).grounded,true);
});

test('original passive species have distinct geometry and run their staging behaviors', async () => {
  const { createScene } = await import('../../mob-preview/scene.mjs');
  const { meshes } = await import('../../mob-preview/models.mjs');
  const { originalWildlife } = await import('../../src/mobs/original-wildlife.mjs');
  const scene = createScene();
  const silhouettes = new Set();
  for (const [species, profile] of Object.entries(originalWildlife)) {
    assert.ok(scene.select(species), species);
    const initial = scene.snapshot(true);
    assert.equal(initial.eligibility,true,species);
    assert.ok(meshes[species]?.length > 300, species);
    silhouettes.add(Array.from(meshes[species].filter((_,i) => i % 7 < 3)).join(','));
    const states=new Set(), modes=new Set();
    let travel=0;
    for (let step=0; step<205; step++) {
      scene.tick(FIXED_STEP);
      const { mob, state }=scene.snapshot();
      states.add(state);
      modes.add(mob.motionMode);
      travel=Math.max(travel,Math.hypot(...mob.position.map((value,axis)=>value-initial.mob.position[axis])));
    }
    assert.ok(states.has(profile.activity),species+' expected '+profile.activity+' got '+[...states]);
    assert.ok(states.has(profile.travel),species+' expected '+profile.travel+' got '+[...states]);
    assert.ok(travel > .3,species);
    if (profile.medium) assert.ok(modes.has(profile.medium),species);
  }
  assert.equal(silhouettes.size,9);
  scene.dispose();
});

test('fluid declarations without a loaded canonical shape fail closed', () => {
  const query = createWorldQuery({ get: () => 76 }, { resident: () => true });
  assert.equal(query.medium([.5, -2, .5]),'unknown');
  assert.equal(query.volume([.5, -2, .5], { radius:.2,height:.4 }),'unknown');
  assert.equal(new MobEngine(query).spawn('reedwhisker',[.5,-2,.5]),null);
});
