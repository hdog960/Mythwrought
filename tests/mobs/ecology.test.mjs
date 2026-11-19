import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { MobEngine } from '../../src/mobs/engine.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { PopulationManager, spawnEligible } from '../../src/mobs/ecology.mjs';
import { arena } from './fixture.mjs';

const region = { cx: 0, cz: 0, section: -2, feet: -34 };
const observer = [-2, -34, 3];
const meadow = () => ({ biome: 'meadow', light: .8, hazard: false });

function setup(observe = meadow) {
  let loaded = true;
  const world = arena({ bounds: [-8, 17, -8, 17] });
  const query = createWorldQuery(world, { resident: () => loaded, observe });
  const engine = new MobEngine(query, 61);
  const ecology = new PopulationManager(engine, query, { seed: 61, species: ['deer'] });
  return { world, query, engine, ecology, unload: () => { loaded = false; }, load: () => { loaded = true; } };
}

test('spawn eligibility fails closed for profile, darkness, geometry and nearby observers', () => {
  const point = [4.5, 4, 3.5];
  const species = getSpecies('deer');
  const world = arena({ floor: 3 });
  const query = createWorldQuery(world, { resident: () => true, observe: meadow });
  assert.ok(spawnEligible(query, species, point, [-4, 4, 3.5]));
  assert.equal(spawnEligible(query, species, point, [3, 4, 3.5]), false);
  assert.equal(spawnEligible(createWorldQuery(world, { resident: () => true }), species, point, [-4, 4, 3.5]), false);
  assert.equal(spawnEligible(createWorldQuery(world, { resident: () => true,
    observe: () => ({ ...meadow(), light: .1 }) }), species, point, [-4, 4, 3.5]), false);
  world.set(4, 4, 3, BLOCK.STONE);
  assert.equal(spawnEligible(query, species, point, [-4, 4, 3.5]), false);
});

test('seeded visits admit bounded deterministic populations and no immediate replenishment', () => {
  const surface = { ...region, section: 0, feet: 4 };
  const make = () => {
    const query = createWorldQuery(arena({ floor: 3, bounds: [-8, 17, -8, 17] }),
      { resident: () => true, observe: meadow });
    const engine = new MobEngine(query, 61);
    return { engine, ecology: new PopulationManager(engine, query, { seed: 61, species: ['deer'] }) };
  };
  const a = make();
  const b = make();
  for (let i = 0; i < 120; i++) for (const { ecology } of [a, b])
    assert.ok(ecology.advance(.5, [-2, 4, 3], [surface]).evaluated <= 6);
  assert.deepEqual(a.engine.all(), b.engine.all());
  assert.equal(a.engine.counts().total, 4);
  for (const entity of a.engine.all()) a.engine.transition(entity.id, 'removed');
  a.ecology.advance(.5, [-2, 4, 3], [surface]);
  assert.equal(a.engine.counts().total, 0);
});

test('chunk reconciliation keeps protected IDs dormant and restores the same identity', () => {
  const { engine, ecology, unload, load } = setup();
  const ordinary = engine.spawn('glownewt', [1.5, -34, 1.5]);
  const important = engine.spawn('glownewt', [3.5, -34, 3.5]);
  assert.equal(engine.protectIdentity(important), true);
  unload();
  for (let i = 0; i < 16; i++) ecology.advance(.5, observer, []);
  assert.equal(engine.get(ordinary), undefined);
  assert.equal(engine.get(important).state, 'dormant');
  load();
  ecology.advance(.5, observer, []);
  assert.equal(engine.get(important).state, 'idle');
  assert.equal(engine.counts().total, 1);
  assert.equal(engine.transition(important, 'removed'), false);
});
