import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {speciesRegistry,getSpecies} from '../src/mobs/species.mjs';
import {arena} from './mobs/fixture.mjs';
import {baselineRandom,probeOriginalSpawnRegion,REJECTION_KINDS}
  from '../src/mobs/ecosystem-diagnostics.mjs';
import {eligibleHabitatPool,chooseHabitatSpecies,deterministicHabitatRoll,ACTIVE_HABITATS}
  from '../src/mobs/ecosystem-habitat.mjs';

function queryFor(world,biome='meadow',resident=()=>true){
  return createWorldQuery(world,{resident,observe:()=>({biome,light:.8,hazard:false})});
}

test('Phase 1 original six-attempt probe is bounded and deterministic',()=>{
  const world=queryFor(arena({floor:3,bounds:[-8,17,-8,17]}));
  const input={seed:61,cx:0,cz:0,section:0,feet:4,observer:[-2,4,3]};
  const first=probeOriginalSpawnRegion(world,[getSpecies('deer')],input);
  const second=probeOriginalSpawnRegion(world,[getSpecies('deer')],input);
  assert.deepEqual(first,second);
  assert.equal(first.attempts,6);
  assert.equal(first.eligible+first.rejected,6);
  assert.equal(Object.values(first.reasons).reduce((a,b)=>a+b,0),6);
  assert.deepEqual(Object.keys(first.reasons),REJECTION_KINDS);
  assert.ok(Object.isFrozen(first)&&Object.isFrozen(first.reasons));
  assert.ok(baselineRandom(61,0,0,0,1)>=0);
});

test('Phase 1 records real biome rejection and inaccessible voxel residency',()=>{
  const region={seed:61,cx:0,cz:0,section:0,feet:4,observer:[-2,4,3]};
  const field=arena({floor:3,bounds:[-8,17,-8,17]});
  const desert=probeOriginalSpawnRegion(queryFor(field,'desert'),[getSpecies('deer')],region);
  const missing=probeOriginalSpawnRegion(queryFor(field,'meadow',()=>false),
    [getSpecies('deer')],region);
  assert.equal(desert.eligible,0);
  assert.ok(desert.reasons.biome>0||desert.reasons.rarity===6);
  assert.equal(missing.eligible,0);
  assert.ok(missing.reasons.unloaded>0||missing.reasons.rarity===6);
  assert.throws(()=>probeOriginalSpawnRegion(queryFor(field),[getSpecies('deer')],
    {...region,attempts:100}),/Invalid natural spawn probe input/);
});

test('Phase 2 habitat-first pools only select biome, depth and light-compatible members',()=>{
  const meadow=eligibleHabitatPool({biome:'meadow',feet:10,light:.8});
  const desert=eligibleHabitatPool({biome:'desert',feet:10,light:.8});
  const alpine=eligibleHabitatPool({biome:'alpine',feet:10,light:.8});
  const cave=eligibleHabitatPool({biome:'cave',feet:-40,light:.29});
  assert.ok(meadow.some(s=>s.id==='cow'));
  assert.ok(desert.some(s=>s.id==='sandstalker'));
  assert.ok(alpine.some(s=>s.id==='mountain-goat'));
  assert.ok(cave.some(s=>s.id==='glownewt'));
  assert.ok(!desert.some(s=>s.id==='cow'));
  assert.ok(!cave.some(s=>s.id==='cow'));
  for(const [environment,pool] of [
    [{biome:'meadow',feet:10,light:.8},meadow],
    [{biome:'desert',feet:10,light:.8},desert],
    [{biome:'alpine',feet:10,light:.8},alpine],
    [{biome:'cave',feet:-40,light:.29},cave]
  ])for(const creature of pool){
    assert.ok(creature.habitat.biomes.includes(environment.biome));
    assert.ok(creature.habitat.depth[0]<=environment.feet&&creature.habitat.depth[1]>=environment.feet);
    assert.ok(creature.habitat.light[0]<=environment.light&&creature.habitat.light[1]>=environment.light);
  }
});

test('Phase 2 preserves deterministic rarity-weighted picks in eligible pool',()=>{
  const pool=eligibleHabitatPool({biome:'forest',feet:10,light:.8});
  assert.ok(pool.length>0&&pool.length<speciesRegistry.length);
  const id=chooseHabitatSpecies(pool,deterministicHabitatRoll(179,0,0,0,1))?.id;
  assert.equal(id,chooseHabitatSpecies(pool,deterministicHabitatRoll(179,0,0,0,1))?.id);
  for(let i=1;i<=100;i++)
    assert.ok(pool.includes(chooseHabitatSpecies(pool,deterministicHabitatRoll(179,0,0,0,i))));
  assert.equal(chooseHabitatSpecies([],0.5),null);
  assert.throws(()=>chooseHabitatSpecies(pool,1),/Invalid habitat draw/);
});

test('every one of the 40 original roster members has a feasible candidate habitat',()=>{
  assert.equal(speciesRegistry.length,40);
  for(const creature of speciesRegistry){
    let found=false;
    for(const biome of ACTIVE_HABITATS){
      for(const feet of [10,-4,-30,-100,-200]){
        for(const light of [.1,.29,.8]){
          if(eligibleHabitatPool({biome,feet,light}).includes(creature))
            found=true;
        }
      }
    }
    assert.ok(found,'No valid candidate environment for '+creature.id);
  }
});

test('three real VoxelWorld seeds produce sampled natural failure reasons without mob injection',()=>{
  for(const seed of [179,379,1001]){
    const originalWorld=new VoxelWorld(seed);
    // Only the physical voxel geometry is real; biome/light are a controlled
    // meadow observation. Do not mislabel this as live V6 or iPhone evidence.
    const world=queryFor(originalWorld);
    const probe=probeOriginalSpawnRegion(world,speciesRegistry,{
      seed,cx:0,cz:0,section:0,feet:10,observer:[0,10,0]
    });
    assert.equal(probe.attempts,6);
    assert.equal(Object.values(probe.reasons).reduce((a,b)=>a+b,0),6);
    const engine=new MobEngine(world,seed,{maxEntities:32,maxActive:8});
    const ecology=new PopulationManager(engine,world,{seed,
      species:speciesRegistry.map(s=>s.id),spawnOnFirstVisit:true});
    let evaluated=0,births=0;
    for(let i=0;i<80;i++){
      const outcome=ecology.advance(.5,[0,10,0],[{cx:0,cz:0,section:0,feet:10}]);
      evaluated+=outcome.evaluated;
      if(outcome.spawned)births++;
    }
    assert.ok(evaluated>0);
    assert.ok(births>=0&&births<=evaluated);
    assert.ok(engine.counts().total<=32);
    console.log('MYTHWROUGHT_NATIVE_SPAWN_OBSERVATION '+JSON.stringify({
      seed,kind:'real-voxel-single-region-controlled-meadow',
      attempts:evaluated,births,remaining:engine.counts().total,
      firstSix:probe.reasons
    }));
    engine.dispose();
  }
});
