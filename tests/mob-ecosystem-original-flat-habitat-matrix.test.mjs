// Frozen ORIGINAL source-spawning contract on a controlled physical flat floor.
// This is NOT generated M7 terrain and cannot certify M7 caves or performance.
// Imports real MobEngine, PopulationManager, 40 species, movement and depth.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {speciesRegistry, getSpecies} from '../src/mobs/species.mjs';
import {sectionForY} from '../src/depth.mjs';

const OBSERVER_XZ = [8, 8];
const SCENES = Object.freeze([
  {biome:'meadow', floor:4, light:.8, births:28, passive:28, hostile:0, distinct:9},
  {biome:'forest', floor:4, light:.8, births:44, passive:30, hostile:14, distinct:18},
  {biome:'desert', floor:4, light:.8, births:13, passive:3, hostile:10, distinct:3},
  {biome:'snow', floor:4, light:.8, births:19, passive:15, hostile:4, distinct:5},
  {biome:'alpine', floor:4, light:.8, births:32, passive:22, hostile:10, distinct:9},
  {biome:'cave', floor:-34, light:.25, births:43, passive:2, hostile:41, distinct:16},
  {biome:'wetland', floor:4, light:.8, births:19, passive:8, hostile:11, distinct:5},
  {biome:'volcanic', floor:4, light:.8, births:6, passive:1, hostile:5, distinct:2}
]);
function flatWorld(scene,{hazard=false, noGround=false}={}) {
  const floor = scene.floor;
  return {
    revision(){return 0;},
    volume(point){return point[1] < floor ? 'solid' : 'clear';},
    grounded(point){return !noGround && point[1]>=floor && point[1]<floor+.04;},
    residentAt(){return true;},
    environment(){return {biome:scene.biome,light:scene.light,hazard};},
    medium(){return 'air';},
    set(){throw Error('Original flat-world test must not mutate terrain');},
    save(){throw Error('Original flat-world test must not mutate Schema-1')}
  };
}
function firstTick(seed,scene,flags={}) {
  const world=flatWorld(scene,flags);
  const engine=new MobEngine(world,seed,{maxEntities:128,maxActive:32});
  const manager=new PopulationManager(engine,world,{
    seed,spawnOnFirstVisit:true
  });
  const observer=[OBSERVER_XZ[0],scene.floor,OBSERVER_XZ[1]];
  const region={cx:0,cz:0,section:sectionForY(scene.floor),feet:scene.floor};
  const result=manager.advance(.5,observer,[region]);
  const entity=result.spawned===null?null:engine.get(result.spawned);
  assert.ok(Number.isInteger(result.evaluated)&&
    result.evaluated>=0&&result.evaluated<=6);
  assert.equal(engine.counts().total,entity?1:0,
    'One original ecology tick can create at most one real engine mob');
  if(entity) {
    assert.ok(speciesRegistry.includes(entity.species));
    assert.ok(entity.species.habitat.biomes.includes(scene.biome));
    assert.ok(scene.light>=entity.species.habitat.light[0]);
    assert.ok(scene.light<=entity.species.habitat.light[1]);
    assert.ok(world.grounded(entity.position,entity.species.body),
      'A real original newborn must have source-ground support');
    assert.equal(sectionForY(Math.floor(entity.position[1])),region.section);
    assert.equal(entity.homeChunk,`0,0,${region.section}`);
    assert.ok(entity.position[0]>=0&&entity.position[0]<16);
    assert.ok(entity.position[2]>=0&&entity.position[2]<16);
    const distance=Math.hypot(entity.position[0]-observer[0],
      entity.position[1]-observer[1],entity.position[2]-observer[2]);
    assert.ok(distance>=5&&distance<=26,
      'Original natural admission keeps the source 5-to-26-block observer band');
    assert.equal(entity.important,false);
    assert.equal(entity.juvenile,false);
  }
  engine.dispose();
  return entity;
}

test('original roster stays at exactly twenty passive and twenty hostile implemented creatures',()=>{
  assert.equal(speciesRegistry.length,40);
  assert.equal(new Set(speciesRegistry.map(s=>s.id)).size,40);
  assert.equal(speciesRegistry.filter(s=>s.classification==='passive').length,20);
  assert.equal(speciesRegistry.filter(s=>s.classification==='hostile').length,20);
  assert.ok(speciesRegistry.every(s=>s.implementation==='preview'));
  assert.deepEqual(speciesRegistry.filter(s=>s.bonding.eligible).map(s=>s.id).sort(),
    ['glownewt','wolf']);
  assert.equal(getSpecies('deer')?.id,'deer');
});

for(const scene of SCENES) {
  test(`original ${scene.biome} physically supported first-tick source matrix, seeds 1..64`,()=>{
    const admitted=[],classes={passive:0,hostile:0};
    for(let seed=1;seed<=64;seed++){
      const mob=firstTick(seed,scene);
      if(mob){admitted.push(mob.species.id);classes[mob.species.classification]++;}
    }
    assert.equal(admitted.length,scene.births,
      'Frozen original-source baseline with 64 new-world seeds on flat ground');
    assert.equal(classes.passive,scene.passive);
    assert.equal(classes.hostile,scene.hostile);
    assert.equal(new Set(admitted).size,scene.distinct);
  });
}

test('original hazard vetoes first-tick natural births across 16 otherwise eligible seeds',()=>{
  const scene=SCENES[0];
  for(let seed=1;seed<=16;seed++)
    assert.equal(firstTick(seed,scene,{hazard:true}),null);
});

test('original unsupported floor vetoes first-tick births without creating mobs',()=>{
  const scene=SCENES[0];
  for(let seed=1;seed<=16;seed++)
    assert.equal(firstTick(seed,scene,{noGround:true}),null);
});

test('default original first-visit cooldown prevents premature birth',()=>{
  const scene=SCENES[0],world=flatWorld(scene),engine=new MobEngine(world,1);
  const manager=new PopulationManager(engine,world,{seed:1});
  const result=manager.advance(.5,[8,4,8],[{cx:0,cz:0,section:0,feet:4}]);
  assert.deepEqual(result,{evaluated:0,spawned:null});
  assert.equal(engine.counts().total,0);
  engine.dispose();
});

test('all forty original species admit under real engine and only protected identity survives six-second away expiry',()=>{
  const scene=SCENES[0],world=flatWorld(scene);
  const engine=new MobEngine(world,179,{maxEntities:128,maxActive:32});
  const ids=speciesRegistry.map((species,i)=>engine.spawn(species.id,[9+i*2,4,8]));
  assert.equal(ids.filter(Boolean).length,40);
  assert.equal(engine.counts().total,40);
  assert.equal(engine.counts().awake,32);
  const glow=ids[speciesRegistry.findIndex(s=>s.id==='glownewt')];
  assert.equal(engine.protectIdentity(glow),true);
  const manager=new PopulationManager(engine,world,{seed:179});
  for(let tick=0;tick<13;tick++)
    assert.deepEqual(manager.advance(.5,[10000,4,8],[]),
      {evaluated:0,spawned:null});
  const survivors=engine.all();
  assert.equal(survivors.length,1);
  assert.equal(survivors[0].id,glow);
  assert.equal(survivors[0].state,'dormant');
  assert.equal(survivors[0].important,true);
  engine.dispose();
});
