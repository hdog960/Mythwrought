import test from 'node:test';
import assert from 'node:assert/strict';
import {getSpecies} from '../src/mobs/species.mjs';
import {supportedPosition} from '../src/mobs/movement.mjs';
import {spawnEligible} from '../src/mobs/ecology.mjs';
import {proposeTerrainAwarePosition,M7_SURFACE_WINDOW_OFFSETS,
  ORIGINAL_MAX_SPAWN_DISTANCE}
  from '../src/mobs/ecosystem-terrain-placement.mjs';

function sourceFloorWorld(floor=4){
  return {
    volume(point,body){
      if(!Array.isArray(point)||point.length!==3||!body)return 'unknown';
      return point[1]<floor?'solid':'clear';
    },
    grounded(point){return point[1]>=floor&&point[1]<floor+.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';}
  };
}

test('terrain-aware Phase 2 chooses original supported voxel outside narrow first window',()=>{
  const world=sourceFloorWorld(4),species=getSpecies('deer');
  const x=8,z=8,observer=[0,8,0],feet=8;
  assert.equal(supportedPosition(world,x,z,feet+1,feet-1.5,species.body),null,
    'Production narrow window cannot reach the existing physical floor');
  const proposal=proposeTerrainAwarePosition(world,{
    species,x,z,feet,section:0,observer,kind:'surface'
  });
  assert.ok(proposal,'A bounded lower window must discover existing physical floor');
  assert.equal(proposal.offset,-4,'No broad or arbitrary vertical scanning');
  assert.equal(proposal.windowsTried,5);
  assert.equal(world.grounded(proposal.point,species.body),true,
    'Cannot claim supported placement without original grounding');
  assert.equal(spawnEligible(world,species,proposal.point,observer),true);
  assert.equal(Object.isFrozen(proposal),true);
  assert.equal(Object.isFrozen(proposal.point),true);
  assert.deepEqual(M7_SURFACE_WINDOW_OFFSETS,[0,2,-2,4,-4]);
});

test('terrain-aware Phase 2 keeps the unchanged valid original window as first choice',()=>{
  const world=sourceFloorWorld(4),species=getSpecies('deer');
  const input={species,x:8,z:8,feet:4,section:0,observer:[0,4,0],kind:'surface'};
  const original=supportedPosition(world,8,8,5,2.5,species.body);
  assert.ok(original,'Original physically valid spawn must remain eligible');
  const proposal=proposeTerrainAwarePosition(world,input);
  assert.deepEqual(proposal.point,original);
  assert.equal(proposal.offset,0,'Existing valid positions must not move');
  assert.equal(proposal.windowsTried,1);
  assert.deepEqual(proposal,proposeTerrainAwarePosition(world,input));
});

test('terrain-aware fallback never bypasses unknown terrain, observer distance or habitat',()=>{
  const species=getSpecies('deer');
  const blocked={
    ...sourceFloorWorld(),
    volume:()=> 'unknown'
  };
  const input={species,x:8,z:8,feet:8,section:0,observer:[0,8,0],kind:'surface'};
  assert.equal(proposeTerrainAwarePosition(blocked,input),null,
    'Unknown/unresident geometry must remain unsupported');
  assert.equal(proposeTerrainAwarePosition(sourceFloorWorld(),{
    ...input,observer:[8,8,8]
  }),null,'Nearby player safety radius must remain enforced');
  assert.equal(proposeTerrainAwarePosition({
    ...sourceFloorWorld(),
    environment:()=>({biome:'desert',light:.8,hazard:false})
  },input),null,'Wrong habitat remains forbidden');
  assert.throws(()=>proposeTerrainAwarePosition(sourceFloorWorld(),{
    ...input,section:-1
  }),/Invalid terrain-aware proposal/);
  assert.throws(()=>proposeTerrainAwarePosition(sourceFloorWorld(),{
    ...input,kind:'cave'
  }),/Cave proposal must use a deep section/);
});

test('terrain-aware cave contract retains original single-window behavior',()=>{
  const species=getSpecies('glownewt'),floor=-33,feet=-29;
  const world={
    ...sourceFloorWorld(floor),
    environment:()=>({biome:'cave',light:.29,hazard:false})
  };
  const observer=[0,feet,0],x=8,z=8;
  assert.equal(supportedPosition(world,x,z,feet+1,feet-1.5,species.body),null);
  const planned=proposeTerrainAwarePosition(world,{
    species,x,z,feet,section:-2,observer,kind:'cave'
  });
  assert.equal(planned,null,'Must not search additional deep-cave heights');
  assert.throws(()=>proposeTerrainAwarePosition(world,{
    species,x,z,feet,section:-2,observer,kind:'surface'
  }),/Surface proposal must use section 0/);
});

test('terrain-aware placement avoids redundant overlapping original voxel reads',()=>{
  const species=getSpecies('deer'),observer=[0,8,0],x=8,z=8,feet=8;
  let baselineReads=0;
  const baseline={
    ...sourceFloorWorld(4),
    volume(point,body){baselineReads++;return point[1]<4?'solid':'clear';}
  };
  // Baseline reproduces the same five sequential original supportedPosition
  // queries without shared memoization, stopping on first real eligibility.
  let first=null;
  for(const offset of M7_SURFACE_WINDOW_OFFSETS){
    const point=supportedPosition(baseline,x,z,feet+1+offset,feet-1.5+offset,species.body);
    if(point&&spawnEligible(baseline,species,point,observer)){first=point;break;}
  }
  assert.ok(first,'Must compare against an actual valid original source floor');
  let optimizedReads=0;
  const optimized={
    ...sourceFloorWorld(4),
    volume(point,body){optimizedReads++;return point[1]<4?'solid':'clear';}
  };
  const result=proposeTerrainAwarePosition(optimized,{
    species,x,z,feet,section:0,observer,kind:'surface'
  });
  assert.deepEqual(result.point,first,'Caching must retain EXACT source physics');
  assert.ok(optimizedReads<baselineReads,
    'Overlapping vertical windows should reuse original verified voxel results');
  assert.ok(baselineReads-optimizedReads>0);
});

test('terrain-aware far-distance rejection performs zero original body reads',()=>{
  const species=getSpecies('deer');
  assert.equal(ORIGINAL_MAX_SPAWN_DISTANCE,26);
  let reads=0;
  const world={
    ...sourceFloorWorld(4),
    volume(point,body){reads++;return point[1]<4?'solid':'clear';}
  };
  const result=proposeTerrainAwarePosition(world,{
    species,x:28,z:0,feet:4,section:0,observer:[0,4,0],kind:'surface'
  });
  assert.equal(result,null);
  assert.equal(reads,0,'Guaranteed >26 horizontal separation must never scan');
});

test('memoized unknown terrain remains unknown and is never reclassified',()=>{
  const species=getSpecies('deer');
  let reads=0;
  const world={
    ...sourceFloorWorld(4),
    volume(point){reads++;return 'unknown';}
  };
  assert.equal(proposeTerrainAwarePosition(world,{
    species,x:8,z:8,feet:8,section:0,observer:[0,8,0],kind:'surface'
  }),null);
  assert.ok(reads>0);
});
