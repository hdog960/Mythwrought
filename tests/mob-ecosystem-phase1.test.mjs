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
import {eligibleHabitatPool,chooseHabitatSpecies,deterministicHabitatRoll,planHabitatCandidate,ACTIVE_HABITATS}
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


test('Phase 1 counters respect original per-species population cap',()=>{
  const field=queryFor(arena({floor:3,bounds:[-8,17,-8,17]}));
  const deer=getSpecies('deer');
  const region={seed:61,cx:0,cz:0,section:0,feet:4,
    observer:[-2,4,3],localCounts:{deer:deer.population.localLimit}};
  const stats=probeOriginalSpawnRegion(field,[deer],region);
  assert.equal(stats.reasons.population,6);
  assert.equal(stats.eligible,0);
  assert.throws(()=>probeOriginalSpawnRegion(field,[deer],
    {...region,localCounts:{deer:-1}}),/Invalid natural spawn probe input/);
});

test('original global species lottery locks each species into two X stripes',()=>{
  for(const seed of [179,379,1001]){
    const columns=new Map();
    for(let i=1;i<=2048;i++){
      const value=baselineRandom(seed,0,0,0,i);
      const speciesIndex=value%40,localX=value&15;
      assert.equal(speciesIndex%8,localX%8);
      const positions=columns.get(speciesIndex)??new Set();
      positions.add(localX);
      columns.set(speciesIndex,positions);
    }
    assert.equal(columns.size,40);
    for(const positions of columns.values())
      assert.ok(positions.size<=2,'A creature unexpectedly escaped the production stripe lock');
  }
});

test('Phase 2 independent streams cover all sixteen X columns without altering source world',()=>{
  const pool=['cow','deer','horse','rabbit'].map(getSpecies);
  const columns=new Map(pool.map(c=>[c.id,new Set()]));
  const positions=new Set();
  for(let serial=1;serial<=1024;serial++){
    const opts={seed:179,cx:0,cz:0,section:0,serial};
    const candidate=planHabitatCandidate(pool,opts);
    assert.deepEqual(candidate,planHabitatCandidate(pool,opts));
    assert.ok(pool.includes(candidate.species));
    assert.ok(Number.isInteger(candidate.x-.5)&&candidate.x>=.5&&candidate.x<16);
    assert.ok(Number.isInteger(candidate.z-.5)&&candidate.z>=.5&&candidate.z<16);
    assert.ok(Object.isFrozen(candidate));
    columns.get(candidate.species.id).add(candidate.x-.5);
    positions.add(candidate.x+','+candidate.z);
  }
  for(const [id,cols] of columns)
    assert.equal(cols.size,16,id+' must be able to appear in every local X column');
  assert.ok(positions.size>100);
  assert.equal(planHabitatCandidate([],{seed:1,cx:0,cz:0,section:0,serial:1}),null);
  assert.throws(()=>planHabitatCandidate(pool,{seed:1,cx:0,cz:0,section:1,serial:1}),
    /Invalid habitat candidate inputs/);
});

test('Phase 2 independent coordinates support remote and negative world chunks',()=>{
  for(const [cx,cz,section] of [[-37,19,0],[8192,-4096,0],[-90,-81,-3]]){
    const biome=section===0?'desert':'cave';
    const feet=section===0?9:-40;
    const pool=eligibleHabitatPool({biome,feet,light:section===0?.8:.2});
    assert.ok(pool.length>0);
    for(let serial=1;serial<=30;serial++){
      const candidate=planHabitatCandidate(pool,{seed:1001,cx,cz,section,serial});
      assert.ok(candidate.x>=cx*16+.5&&candidate.x<cx*16+16);
      assert.ok(candidate.z>=cz*16+.5&&candidate.z<cz*16+16);
      assert.ok(candidate.species.habitat.biomes.includes(biome));
    }
  }
});


test('Phase 2 accepts the actual partial lowest deep section but no out-of-world sections',()=>{
  const cave=eligibleHabitatPool({biome:'cave',feet:-209,light:.2});
  assert.ok(cave.some(s=>s.classification==='hostile'));
  const proposal=planHabitatCandidate(cave,{seed:179,cx:-401,cz:11,section:-13,serial:5});
  assert.ok(proposal&&proposal.section===-13);
  assert.throws(()=>planHabitatCandidate(cave,{seed:179,cx:0,cz:0,section:-14,serial:5}),
    /Invalid habitat candidate inputs/);
});


test('Phase 1 separates blocked initial surface from ground outside narrow height window',()=>{
  const field=arena({floor:3,bounds:[-8,17,-8,17]});
  const world=queryFor(field);
  const deer=[getSpecies('deer')];
  const count=feet=>{
    const sums={};
    for(let serial=0;serial<120;serial+=6){
      const sample=probeOriginalSpawnRegion(world,deer,{
        seed:61,cx:0,cz:0,section:0,feet,
        observer:[-2,feet,3],serial
      });
      for(const [name,n] of Object.entries(sample.reasons))
        sums[name]=(sums[name]??0)+n;
    }
    return sums;
  };
  const blocked=count(2);
  const noFloor=count(15);
  assert.ok(blocked['initial-surface-overlap']>0,
    'High placement must physically intersect the real stone floor');
  assert.ok(noFloor['no-ground-in-height-window']>0,
    'No ground in the 2.5-block search window must be diagnosed separately');
  assert.equal(blocked.eligible,0);
  assert.equal(noFloor.eligible,0);
});
