import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { BehaviorController } from '../../src/mobs/behavior.mjs';
import { MobCombat, DemoTarget } from '../../src/mobs/combat.mjs';
import { CompanionManager, wildlifeActions } from '../../src/mobs/companion.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { arena } from './fixture.mjs';

function setup(point = [.5, -34, .5]) {
  const world = arena();
  const query = createWorldQuery(world, { resident: () => true,
    observe: () => ({ biome: 'cave', light: .4, hazard: false }) });
  const engine = new MobEngine(query);
  const behavior = new BehaviorController(engine, query);
  const combat = new MobCombat(engine, query, behavior);
  const companions = new CompanionManager(engine, query, combat, { capacity: 1 });
  const id = engine.spawn('glownewt', point);
  const owner = new DemoTarget([-.5, -34, .5]);
  const run = (count, threatId) => {
    for (let n = 0; n < count; n++) {
      companions.advance(FIXED_STEP);
      combat.advance(FIXED_STEP, null, { override: mob => companions.directive(mob, owner, threatId) });
    }
  };
  return { world, query, engine, companions, id, owner, run };
}

test('Glownewt bonds, follows, stays, follows, is downed, rescued and follows with the same ID', () => {
  const { engine, companions, id, owner, run, world } = setup();
  const save = JSON.stringify(world.base.save());
  assert.ok(companions.befriend(id, owner));
  assert.equal(companions.befriend(id, owner), false);
  owner.place([4, -34, .5]);
  run(70);
  const followed = engine.get(id).position[0];
  assert.ok(followed > 1.7 && followed < 4);
  assert.ok(companions.command(id, owner, 'stay'));
  owner.place([-3, -34, .5]);
  run(35);
  assert.ok(Math.abs(engine.get(id).position[0] - followed) < .025);
  assert.ok(companions.command(id, owner, 'follow'));
  run(70);
  assert.ok(engine.get(id).position[0] < 0);
  owner.place(engine.get(id).position);
  assert.ok(companions.hurt(id, 50));
  assert.equal(engine.get(id).state, 'downed');
  assert.equal(companions.rescue(id, owner), false);
  run(40);
  assert.ok(companions.rescue(id, owner));
  assert.equal(companions.rescue(id, owner), false);
  assert.equal(companions.hurt(id, 50), false);
  owner.place([3, -34, .5]);
  run(150);
  assert.ok(engine.get(id).position[0] > 1);
  assert.deepEqual(companions.slots().map(slot => [slot.id, slot.mode]), [[id, 'follow']]);
  assert.equal(JSON.stringify(world.base.save()), save);
});

test('bonded assistance applies bounded damage only to a nearby hostile', () => {
  const { engine, companions, id, owner, run } = setup();
  const enemy = engine.spawn('goblin', [1, -34, .5]);
  assert.ok(companions.befriend(id, owner));
  run(30, enemy);
  assert.equal(engine.get(enemy).health, 29);
  run(30, enemy);
  assert.equal(engine.get(enemy).health, 29);
});

test('passive capability descriptors distinguish grazers, riders, breeders and companions', () => {
  assert.deepEqual(wildlifeActions(getSpecies('horse')),
    { grazes: true, group: 'herd', breeds: true, rides: true, bonds: false });
  assert.deepEqual(wildlifeActions(getSpecies('glownewt')),
    { grazes: false, group: 'pair', breeds: false, rides: false, bonds: true });
  assert.equal(wildlifeActions(getSpecies('goblin')), null);
});

test('a companion downed while falling lands before it can be rescued', () => {
  const { engine, companions, id, owner, run } = setup([.5, -32.8, .5]);
  assert.equal(engine.get(id).grounded, false);
  assert.ok(companions.befriend(id, owner));
  assert.ok(companions.hurt(id, 50));
  assert.equal(companions.rescue(id, owner), false);
  run(38);
  const landed = engine.get(id);
  assert.equal(landed.state, 'downed');
  assert.equal(landed.grounded, true);
  assert.ok(Math.abs(landed.position[1] + 34) < .001);
  assert.ok(companions.rescue(id, owner));
});
