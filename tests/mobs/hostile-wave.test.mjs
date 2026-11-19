import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { FIXED_STEP, MobEngine } from '../../src/mobs/engine.mjs';
import { BehaviorController } from '../../src/mobs/behavior.mjs';
import { DemoTarget, MobCombat } from '../../src/mobs/combat.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { getSpecies } from '../../src/mobs/species.mjs';
import { meshes } from '../../mob-preview/models.mjs';
import { arena } from './fixture.mjs';

const familiarHostiles = [
  'zombie','skeleton','giant-spider','slime','wraith','troll','harpy','mimic','gargoyle'
];

function encounter(species, targetPoint = [1.5,-34,.5]) {
  const world = arena();
  const query = createWorldQuery(world, {
    resident: () => true,
    observe: () => ({ biome: 'cave', light: .36, hazard: false, climbable: true })
  });
  const engine = new MobEngine(query);
  const control = new BehaviorController(engine, query);
  const combat = new MobCombat(engine, query, control);
  const id = engine.spawn(species, [-1.5,-34,.5]);
  assert.ok(id,species);
  return { world, engine, control, combat, id, target: new DemoTarget(targetPoint) };
}

test('each familiar hostile has distinct geometry and commits a timed physical attack', () => {
  const geometries = new Set();
  for (const species of familiarHostiles) {
    assert.ok(meshes[species]?.length > 300,species);
    geometries.add(Array.from(meshes[species].filter((_,i)=>i%7<3)).join(','));
    const { world, engine, control, combat, id, target } = encounter(species);
    const original = JSON.stringify(world.base.save());
    const states = new Set();
    let hit = false, highest = -34;
    const modes = new Set();
    for (let tick=0; tick<350; tick++) {
      combat.advance(FIXED_STEP,target);
      states.add(control.state(id));
      const mob=engine.get(id);
      highest=Math.max(highest,mob.position[1]);
      modes.add(mob.motionMode);
      hit ||= combat.events.some(event=>event.type==='damage' && event.source===id);
    }
    assert.ok(states.has('prepare-attack') && states.has('recover') && hit,species+' '+[...states]);
    assert.ok(target.health < 100,species);
    if (species==='slime') assert.ok(highest>-33.71,'slime bounced above its floor');
    if (['wraith','harpy','gargoyle'].includes(species))
      assert.ok(modes.has('fly') && highest>-33.8,species+' changed altitude through flight');
    if (species==='mimic') assert.ok(states.has('disguise') && states.has('reveal'));
    if (species==='gargoyle') assert.ok(states.has('perched') && states.has('awaken'));
    combat.clearProjectiles();
    const last=target.health;
    for (let tick=0; tick<180; tick++) {
      combat.advance(FIXED_STEP);
      states.add(control.state(id));
    }
    assert.ok(states.has('disengage') || states.has('return'),species);
    assert.equal(target.health,last);
    assert.equal(JSON.stringify(world.base.save()),original);
    engine.dispose();
  }
  assert.equal(geometries.size,familiarHostiles.length);
});

test('a launched Skeleton projectile hits after travel and is blocked by a newly placed wall', () => {
  const { world, combat, target } = encounter('skeleton');
  for (let tick=0; tick<120 && !combat.projectiles.length; tick++) combat.advance(FIXED_STEP,target);
  assert.equal(target.health,100);
  assert.equal(combat.projectiles.length,1);
  for (const y of [-34,-33]) world.set(0,y,0,BLOCK.STONE);
  for (let tick=0; tick<25; tick++) combat.advance(FIXED_STEP,target);
  assert.equal(combat.projectiles.length,0);
  assert.equal(target.health,100);
  assert.equal(world.get(0,-34,0),BLOCK.STONE);
  assert.ok(getSpecies('skeleton').combat.reach > getSpecies('zombie').combat.reach);
});
