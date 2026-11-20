import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { BehaviorController } from '../../src/mobs/behavior.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { AnimalInteractions } from '../../src/mobs/animal-interactions.mjs';
import { meshes } from '../../mob-preview/models.mjs';
import { arena } from './fixture.mjs';

const expected = {
  cow: 'graze', sheep: 'graze', pig: 'forage', chicken: 'peck',
  horse: 'trot', rabbit: 'hop', fox: 'scout', 'mountain-goat': 'climb', wolf: 'patrol-pack'
};
const walker = { id: 'keeper', position: [.5, -34, -.45], height: 1.08 };

function setup(biome = 'meadow', floor = -35) {
  const world = arena({ floor });
  const query = createWorldQuery(world, {
    resident: () => true,
    observe: () => ({ biome, light: .82, hazard: false, climbable: biome === 'alpine' })
  });
  const engine = new MobEngine(query);
  return { world, engine, query, controller: new BehaviorController(engine, query) };
}

test('each familiar species has distinct anatomy and enters its signature activity', () => {
  const geometry = new Set();
  for (const [species, activity] of Object.entries(expected)) {
    const fixture = setup(getSpecies(species).habitat.biomes[0]);
    if (species === 'mountain-goat') {
      for (const y of [-34, -33]) fixture.world.set(1, y, 0, BLOCK.STONE);
    }
    const id = fixture.engine.spawn(species, [.5, -34, .5]);
    assert.ok(id, species);
    assert.ok(meshes[species]?.length > 300, species);
    geometry.add(Array.from(meshes[species].filter((_, i) => i % 7 < 3)).join(','));
    const observed = new Set();
    for (let step = 0; step < 130; step++) {
      fixture.controller.advance(FIXED_STEP);
      observed.add(fixture.controller.state(id));
    }
    assert.ok(observed.has(activity), species + ' observed ' + [...observed].join(','));
    fixture.engine.dispose();
    assert.equal(fixture.engine.get(id), undefined);
  }
  assert.equal(geometry.size, 9);
});

test('breeding requires two nearby eligible parents and cannot be repeated immediately', () => {
  const { engine, query } = setup('meadow', -3);
  const animals = new AnimalInteractions(engine, query);
  const first = engine.spawn('cow', [.5, -2, .5]);
  const second = engine.spawn('cow', [1.6, -2, .5]);
  const pig = engine.spawn('pig', [-1, -2, .5]);
  assert.equal(animals.breed(first, pig), null);
  const calf = animals.breed(first, second);
  assert.ok(calf);
  assert.equal(engine.get(calf).species.id, 'cow');
  assert.equal(engine.get(calf).juvenile, true);
  assert.equal(animals.breed(first, second), null);
  assert.equal(animals.breed(first, calf), null);
});

test('a tamed and mounted horse carries its rider but clips against actual stone', () => {
  const { world, engine, query } = setup();
  const animals = new AnimalInteractions(engine, query);
  const horse = engine.spawn('horse', [.5, -34, .5]);
  for (const y of [-34,-33,-32]) world.set(3, y, 0, BLOCK.STONE);
  assert.equal(animals.mount(horse, walker), false);
  assert.equal(animals.tame(horse, walker), true);
  assert.equal(animals.mount(horse, walker), true);
  assert.equal(animals.steer(walker, [1, 0], true), true);
  for (let step = 0; step < 60; step++) engine.advance(FIXED_STEP, mob => animals.directive(mob)?.heading);
  const ridden = animals.riderPosition(walker);
  const animal = engine.get(horse);
  assert.ok(animal.position[0] > 2 && animal.position[0] < 2.54);
  assert.deepEqual(ridden, [animal.position[0], animal.position[1] + animal.species.body.height, .5]);
  assert.equal(animals.dismount(walker), true);
  assert.equal(animals.riderPosition(walker), null);
});

test('rabbit hops physically, and an alpine goat may climb only approved solid support', () => {
  const { world, query, engine } = setup('alpine');
  for (const y of [-34,-33,-32]) world.set(1, y, 0, BLOCK.STONE);
  const rabbit = engine.spawn('rabbit', [-2.5, -34, .5]);
  const goat = engine.spawn('mountain-goat', [.68, -34, .5]);
  for (let step = 0; step < 15; step++) engine.advance(FIXED_STEP, mob =>
    mob.id === rabbit ? { direction: [1,0], jump: true } : { direction: [1,0], climb: true });
  assert.ok(engine.get(rabbit).position[1] > -34.2);
  assert.ok(engine.get(goat).position[1] > -33.7);
  assert.equal(query.volume(engine.get(goat).position, engine.get(goat).species.body), 'clear');
});

test('every familiar wildlife body respects a physical wall at a signed chunk coordinate', () => {
  const { world, query } = setup();
  for (const y of [-34,-33,-32]) world.set(-1, y, 0, BLOCK.STONE);
  for (const species of Object.keys(expected)) {
    const engine = new MobEngine(query);
    const id = engine.spawn(species, [-3.5, -34, .5]);
    for (let step = 0; step < 70; step++) engine.advance(FIXED_STEP, () => [1,0]);
    const mob = engine.get(id);
    assert.ok(mob.position[0] > -3, species);
    assert.ok(mob.position[0] <= -1 - mob.species.body.radius + .001, species);
    assert.equal(query.volume(mob.position, mob.species.body), 'clear');
    engine.dispose();
  }
});

test('eligible familiar animals can produce one offspring in their own habitat', () => {
  for (const id of Object.keys(expected)) {
    const species = getSpecies(id);
    const { query, engine } = setup(species.habitat.biomes[0], -3);
    const animals = new AnimalInteractions(engine, query);
    const first = engine.spawn(id, [.5,-2,.5]);
    const second = engine.spawn(id, [2,-2,.5]);
    const child = animals.breed(first, second);
    if (species.breeding.eligible) assert.equal(engine.get(child)?.juvenile, true, id);
    else assert.equal(child,null,id);
    assert.equal(animals.breed(first, second), null, id);
    engine.dispose();
  }
});
