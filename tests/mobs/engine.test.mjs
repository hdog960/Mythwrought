import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { arena } from './fixture.mjs';

function run(engine, count, heading) {
  for (let i = 0; i < count; i++) engine.advance(FIXED_STEP, () => heading);
}

test('downward gravity settles at the real floor and walking crosses a signed depth seam', () => {
  const world = arena();
  const engine = new MobEngine(createWorldQuery(world, { resident: () => true }), 179);
  const id = engine.spawn('deer', [-1.5, -32, .5]);
  run(engine, 45, [1, 0]);
  const mob = engine.get(id);
  assert.equal(mob.grounded, true);
  assert.ok(Math.abs(mob.position[1] + 34) < .001);
  assert.ok(mob.position[0] > 2);
  assert.ok(mob.yaw > 0);
});

test('physical closed and opened Pack 2 doors expose different collision volumes', () => {
  const world = arena();
  const query = createWorldQuery(world, { resident: () => true });
  const door = [1, -34, 0];
  assert.ok(world.placePack2(...door, 67, { rotation: 0, open: false }));
  const body = getSpecies('glownewt').body;
  const positions = [[1.15, -34, .15], [1.85, -34, .15], [1.5, -34, .5], [1.15, -34, .85]];
  const closed = positions.map(point => query.volume(point, body));
  assert.deepEqual(closed, ['clear', 'clear', 'solid', 'clear']);
  assert.ok(world.updatePack2State(...door, { rotation: 0, open: true }));
  const opened = positions.map(point => query.volume(point, body));
  assert.deepEqual(opened, ['solid', 'clear', 'clear', 'solid']);
});

test('swept walking safely steps onto a partial voxel and stops at a two-block wall', () => {
  const world = arena();
  const query = createWorldQuery(world, { resident: () => true });
  assert.ok(world.placePack2(1, -34, 0, 63, {}));
  for (const y of [-34, -33]) world.set(3, y, 0, BLOCK.STONE);
  const engine = new MobEngine(query);
  const id = engine.spawn('goblin', [.5, -34, .5]);
  let maximumHeight = -34;
  for (let i = 0; i < 65; i++) {
    run(engine, 1, [1, 0]);
    maximumHeight = Math.max(maximumHeight, engine.get(id).position[1]);
  }
  assert.ok(maximumHeight > -34 && maximumHeight < -33);
  assert.ok(engine.get(id).position[0] > 2 && engine.get(id).position[0] < 2.73);
});

test('unloaded sections block crossing and do not act as a spawn floor', () => {
  const world = arena({ floor: -21 });
  const query = createWorldQuery(world, { resident: (cx, cz, section) => cx < 0 && section === -1 });
  const engine = new MobEngine(query);
  const id = engine.spawn('deer', [-1.5, -18.5, .5]);
  assert.ok(id);
  assert.equal(query.grounded([-.5, -18.999, .5], getSpecies('deer').body), false);
  run(engine, 25, [1, 0]);
  assert.ok(engine.get(id).position[0] <= -.38 + 1e-5);
  assert.equal(engine.spawn('deer', [.5, -18.5, .5]), null);
});

test('bounds, lifecycle events, deterministic randomness and disposal leave save bytes unchanged', () => {
  const world = arena();
  const before = JSON.stringify(world.base.save());
  const query = createWorldQuery(world, { resident: () => true });
  const engine = new MobEngine(query, 42, { maxEntities: 2, maxActive: 1 });
  const twin = new MobEngine(query, 42);
  const id = engine.spawn('deer', [-.5, -34, .5]);
  const second = engine.spawn('glownewt', [.5, -34, 1.5]);
  assert.equal(twin.spawn('deer', [-.5, -34, .5]), id);
  assert.equal(engine.random(id), twin.random(id));
  assert.equal(engine.get(second).state, 'dormant');
  assert.equal(engine.spawn('goblin', [1.5, -34, 1.5]), null);
  assert.equal(engine.spawn('deer', [NaN, 0, 0]), null);
  assert.equal(engine.transition(id, 'dormant'), true);
  assert.equal(engine.transition(id, 'idle'), true);
  assert.equal(engine.transition(id, 'downed'), true);
  assert.equal(engine.transition(id, 'active'), false);
  assert.equal(engine.advance(Infinity, () => [1, 0]), 0);
  assert.equal(engine.advance(90, () => [1, 0]), 4);
  assert.ok(engine.drainEvents().some(event => event.type === 'state' && event.state === 'downed'));
  engine.dispose();
  assert.equal(engine.get(id), undefined);
  assert.equal(engine.spawn('deer', [-.5, -34, .5]), null);
  assert.equal(engine.advance(FIXED_STEP), 0);
  assert.equal(JSON.stringify(world.base.save()), before);
});
