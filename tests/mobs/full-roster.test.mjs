import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnEligible } from '../../src/mobs/ecology.mjs';
import { speciesRegistry } from '../../src/mobs/species.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { AnimalInteractions } from '../../src/mobs/animal-interactions.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { createScene } from '../../mob-preview/scene.mjs';
import { meshes } from '../../mob-preview/models.mjs';
import { arena } from './fixture.mjs';

test('all 40 model geometries differ and each species has a valid habitat',()=>{
  const silhouettes=new Set();
  for(const entry of speciesRegistry){
    const shape=meshes[entry.render.model];
    assert.ok(shape?.length>300,entry.id);
    assert.ok(shape.every(Number.isFinite),entry.id);
    silhouettes.add(Array.from(shape.filter((_,index)=>index%7<3)).join(','));
    const floor=entry.habitat.depth[1]<0?-35:-3;
    const world=arena({floor});
    const eligible=createWorldQuery(world,{
      resident:()=>true,observe:()=>({biome:entry.habitat.biomes[0],light:
        (entry.habitat.light[0]+entry.habitat.light[1])/2,hazard:false})
    });
    assert.ok(spawnEligible(eligible,entry,[.5,floor+1,.5],[-5.5,floor+1,.5]),entry.id);
    assert.equal(spawnEligible(eligible,entry,[.5,floor+1,.5],[0,floor+1,.5]),false);
  }
  assert.equal(silhouettes.size,40);
});

test('a preview hostile shows injury, drops its runtime body and can be retried',()=>{
  const scene=createScene();
  assert.equal(scene.select('shardmaw'),true);
  const first=scene.snapshot().mob;
  assert.ok(scene.action('hurt'));
  assert.equal(scene.snapshot().state,'hurt');
  assert.ok(scene.snapshot().mob.health<first.health);
  assert.ok(scene.action('defeat'));
  assert.equal(scene.snapshot().state,'defeat');
  assert.equal(scene.snapshot().mob.health,0);
  for(let i=0;i<45;i++)scene.tick(1/30);
  assert.equal(scene.snapshot().draw.some(entity=>entity.id===first.id),false);
  assert.ok(scene.action('restart'));
  assert.notEqual(scene.snapshot().mob.id,first.id);
  assert.equal(scene.snapshot().mob.health,first.health);
  scene.dispose();
});

test('every breeding-eligible species produces one habitat-compatible juvenile, with a repeat guard',()=>{
  const world=arena({floor:-3});
  for(const species of speciesRegistry.filter(entry=>entry.breeding.eligible)){
    const query=createWorldQuery(world,{
      resident:()=>true,observe:()=>({biome:species.habitat.biomes[0],light:.64,hazard:false})
    });
    const engine=new MobEngine(query,179);
    const animals=new AnimalInteractions(engine,query);
    const a=engine.spawn(species.id,[.5,-2,.5]);
    const b=engine.spawn(species.id,[2,-2,.5]);
    const child=animals.breed(a,b);
    assert.equal(engine.get(child)?.species.id,species.id);
    assert.equal(engine.get(child).juvenile,true);
    assert.equal(animals.breed(a,b),null);
    engine.dispose();
  }
});

test('cave pack members use the same real combat target and survive roster cleanup independently',()=>{
  const scene=createScene();
  assert.equal(scene.select('gloomcrawler'),true);
  assert.ok(scene.action('group'));
  const before=scene.snapshot().draw.filter(actor=>actor.species.id==='gloomcrawler');
  assert.equal(before.length,2);
  assert.ok(scene.action('encounter'));
  for(let tick=0;tick<97;tick++) scene.tick(FIXED_STEP);
  const after=scene.snapshot();
  assert.ok(after.target.health < 100);
  for(const actor of before)
    assert.notDeepEqual(after.draw.find(other=>other.id===actor.id).position,actor.position);
  assert.ok(scene.select('ashfang'));
  assert.equal(scene.snapshot().draw.some(actor=>actor.id===before[1].id),false);
  scene.dispose();
});
