import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { findRoute, LocalNavigator } from '../../src/mobs/navigation.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { BehaviorController, sense } from '../../src/mobs/behavior.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { arena } from './fixture.mjs';

const deer = getSpecies('deer');
const start = [-2.5, -34, .5];
const goal = [2.5, -34, .5];
const clear = () => ({ biome: 'cave', light: .2, hazard: false });
const targetAt = position => ({ id: 'player', position, height: 1.7 });

function buildWall(world) {
  for (const y of [-34, -33]) for (const z of [-1, 0, 1]) world.set(0, y, z, BLOCK.STONE);
}

test('bounded 3D routes detour around player walls and avoid hazards', () => {
  const world = arena();
  buildWall(world);
  const query = createWorldQuery(world, { resident: () => true,
    observe: ([x, , z]) => ({ ...clear(), hazard: x > -.5 && x < 1 && z > 1 }) });
  const route = findRoute(query, deer, start, goal, { quota: 110 });
  assert.equal(route.status, 'complete');
  assert.ok(route.nodes.some(([, , z]) => z <= -1.5));
  assert.ok(route.work <= 110);
  assert.deepEqual(findRoute(query, deer, start, goal, { quota: 1 }),
    { status: 'budget', nodes: [], work: 1 });
  assert.deepEqual(findRoute(query, deer, start, goal, { quota: 110 }), route);
});

test('navigation uses partial-volume elevations and invalidates stale routes after edits', () => {
  const world = arena();
  let revision = 0;
  const query = createWorldQuery(world, { resident: () => true, revision: () => revision, observe: clear });
  assert.ok(world.placePack2(0, -34, 0, 63, {}));
  const path = findRoute(query, deer, [-.5, -34, .5], [1.5, -34, .5]);
  assert.equal(path.status, 'complete');
  assert.ok(path.nodes.some(([, y]) => y > -33.55 && y < -33.45));
  const navigator = new LocalNavigator(query);
  const engine = new MobEngine(query);
  const id = engine.spawn('deer', start);
  navigator.beginTick();
  navigator.steer(engine.get(id), goal);
  const original = navigator.inspect(id);
  buildWall(world);
  revision++;
  navigator.beginTick();
  navigator.steer(engine.get(id), goal);
  assert.notDeepEqual(navigator.inspect(id).nodes, original.nodes);
  assert.equal(navigator.inspect(id).revision, 1);
});

test('navigation never routes into an unloaded chunk or from unknown ground', () => {
  const query = createWorldQuery(arena(), { resident: cx => cx < 0, observe: clear });
  assert.equal(findRoute(query, deer, start, goal).status, 'unreachable');
  assert.equal(findRoute(query, deer, goal, start).status, 'unreachable');
});

test('sensing distinguishes visible targets, sound behind terrain, light and hazards', () => {
  const world = arena();
  const query = createWorldQuery(world, { resident: () => true, observe: clear });
  const engine = new MobEngine(query);
  const id = engine.spawn('deer', start);
  const player = targetAt(goal);
  assert.equal(sense(query, engine.get(id), { target: player }).visible, true);
  buildWall(world);
  const heard = sense(query, engine.get(id), { target: player, disturbances: [{ position: goal, loudness: 1 }] });
  assert.equal(heard.visible, false);
  assert.deepEqual(heard.heard, goal);
  assert.equal(heard.light, .2);
  assert.equal(heard.depth, -34);
});

test('passive threat response flees and calms down, hostile target loss returns home', () => {
  const query = createWorldQuery(arena(), { resident: () => true, observe: clear });
  const engine = new MobEngine(query, 83);
  const deerId = engine.spawn('deer', [-1.5, -34, .5]);
  const goblinId = engine.spawn('goblin', [2.5, -34, 1.5]);
  const behavior = new BehaviorController(engine, query);
  let target = targetAt([.5, -34, .5]);
  const states = new Map([[deerId, new Set()], [goblinId, new Set()]]);
  for (let i = 0; i < 250; i++) {
    if (i === 65) target = null;
    behavior.advance(FIXED_STEP, { target });
    for (const [id, seen] of states) seen.add(behavior.state(id));
  }
  for (const state of ['observe', 'flee', 'calm-down']) assert.ok(states.get(deerId).has(state), state);
  for (const state of ['detect', 'acquire', 'pursue', 'prepare-attack', 'attack', 'recover', 'disengage', 'return'])
    assert.ok(states.get(goblinId).has(state), state);
  assert.ok(Math.abs(engine.get(goblinId).position[0] - 2.5) < 1);
});
