import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { BehaviorController } from '../../src/mobs/behavior.mjs';
import { MobCombat, DemoTarget, ObjectAccess } from '../../src/mobs/combat.mjs';
import { arena } from './fixture.mjs';

const clear = () => ({ biome: 'cave', light: .4, hazard: false });

function encounters(world = arena()) {
  const query = createWorldQuery(world, { resident: () => true, observe: clear });
  const engine = new MobEngine(query);
  const goblin = engine.spawn('goblin', [-2.5, -34, .5]);
  const behavior = new BehaviorController(engine, query);
  const combat = new MobCombat(engine, query, behavior);
  const target = new DemoTarget([1.5, -34, .5]);
  return { world, query, engine, goblin, behavior, combat, target };
}

test('Goblin pursues, visibly winds up, applies damage with cooldown and disengages', () => {
  const { combat, goblin, engine, target, behavior } = encounters();
  let windup = false;
  const hits = [];
  for (let i = 0; i < 170; i++) {
    combat.advance(FIXED_STEP, target);
    windup ||= behavior.state(goblin) === 'prepare-attack';
    if (combat.events.some(event => event.type === 'damage')) hits.push(i);
  }
  assert.ok(windup && hits.length >= 2);
  assert.ok(hits[1] - hits[0] >= 33);
  assert.equal(target.health, 100 - hits.length * 7);
  assert.ok(engine.get(goblin).position[0] > -1);
  let disengaged = false;
  for (let i = 0; i < 170; i++) {
    combat.advance(FIXED_STEP);
    disengaged ||= behavior.state(goblin) === 'disengage';
  }
  assert.ok(disengaged);
  assert.equal(target.health, 100 - hits.length * 7);
});

test('adding a solid wall during a windup prevents the hit and changes no save bytes', () => {
  const { combat, goblin, world, target, behavior } = encounters();
  target.place([-1.3, -34, .5]);
  for (let i = 0; i < 20; i++) combat.advance(FIXED_STEP, target);
  assert.equal(behavior.state(goblin), 'prepare-attack');
  for (const y of [-34, -33]) world.set(-2, y, 0, BLOCK.STONE);
  const original = JSON.stringify(world.base.save());
  for (let i = 0; i < 45; i++) combat.advance(FIXED_STEP, target);
  assert.equal(target.health, 100);
  assert.equal(JSON.stringify(world.base.save()), original);
});

test('approved nearby doors are requested through a capability gate without mining', () => {
  const world = arena();
  assert.ok(world.placePack2(0, -34, 0, 67, { rotation: 0, open: false }));
  world.set(1, -34, 0, BLOCK.STONE);
  const original = JSON.stringify(world.base.save());
  const door = { id: 'demo-door', kind: 'door', position: [.5, -34, .5] };
  const query = createWorldQuery(world, { resident: () => true,
    observe: () => ({ ...clear(), objects: [door, { ...door, id: 'wall', kind: 'mine' }] }) });
  const engine = new MobEngine(query);
  const goblin = engine.spawn('goblin', [.5, -34, -.5]);
  const deer = engine.spawn('deer', [.5, -34, -1.5]);
  const access = new ObjectAccess(query, (id, action) =>
    id === 'demo-door' && action === 'open' &&
    world.updatePack2State(0, -34, 0, { rotation: 0, open: true }));
  assert.equal(access.request(engine.get(goblin), 'wall'), false);
  assert.equal(access.request(engine.get(goblin), 'forged'), false);
  assert.equal(access.request(engine.get(deer), 'demo-door'), false);
  assert.equal(access.request(engine.get(goblin), 'demo-door'), true);
  assert.equal(world.getPack2State(0, -34, 0).open, true);
  assert.equal(JSON.stringify(world.base.save()), original);
});
