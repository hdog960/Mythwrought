import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleHabitatPool,planHabitatCandidate}
  from '../src/mobs/ecosystem-habitat.mjs';
import {MAX_PROPOSALS_PER_TICK,MAX_OCCUPIED_CANDIDATES,
  MIN_OCCUPANCY_SEPARATION,proposeRegionalMobSpawn}
  from '../src/mobs/ecosystem-region-proposals.mjs';

const region={cx:0,cz:0,section:0,feet:4};
const biome='meadow',light=.8,observer=[8,4,8];
const pool=eligibleHabitatPool({biome,light,feet:region.feet});
const counts=()=>new Map(pool.map(species=>[species.id,0]));
function physicalWorld({resident=true,floor=4}={}){
  let reads=0;
  return {
    get reads(){return reads;},
    residentAt(){return resident;},
    volume([x,y,z]){reads++;return y<floor?'solid':'clear';},
    grounded([x,y,z]){reads++;return y>=floor&&y<floor+.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('Original world may not be modified');},
    save(){throw Error('Original world may not be saved');}
  };
}
const args=(world,seed=179)=>({
  world,seed,region,observer,biome,light,localCounts:counts(),
  occupiedPositions:[],rosterAvailable:true,startSerial:0
});
test('Phase 2 bounded candidate proposal is deterministic, frozen and readonly',()=>{
  assert.equal(MAX_PROPOSALS_PER_TICK,6);
  assert.equal(MAX_OCCUPIED_CANDIDATES,32);
  assert.equal(MIN_OCCUPANCY_SEPARATION,1.2);
  let witness=null;
  for(let seed=1;seed<=128;seed++){
    const proposal=proposeRegionalMobSpawn(args(physicalWorld(),seed));
    assert.ok(proposal.attempts<=6);
    assert.equal(proposal.nextSerial,proposal.attempts);
    assert.equal(Object.isFrozen(proposal),true);
    assert.equal(Object.isFrozen(proposal.rejected),true);
    if(!proposal.proposal)continue;
    witness=proposal;
    assert.equal(Object.isFrozen(witness.proposal),true);
    assert.equal(Object.isFrozen(witness.proposal.point),true);
    assert.equal(witness.proposal.point[1],4);
    assert.equal(witness.rejected.eligible,1);
    assert.deepEqual(proposeRegionalMobSpawn(args(physicalWorld(),seed)),witness);
    break;
  }
  assert.ok(witness,'At least one real preview meadow species should produce a proposal');
});

test('Phase 2 capacity and local per-species cap are never bypassed',()=>{
  const world=physicalWorld();
  const denied=proposeRegionalMobSpawn({...args(world),rosterAvailable:false});
  assert.equal(denied.attempts,0);
  assert.equal(denied.proposal,null);
  assert.equal(world.reads,0);
  assert.throws(()=>proposeRegionalMobSpawn({...args(world),localCounts:new Map()}),
    /Missing or invalid original local population counts/);
  const capped=new Map(pool.map(s=>[s.id,s.population.localLimit]));
  const full=proposeRegionalMobSpawn({...args(world),localCounts:capped});
  assert.equal(full.proposal,null);
  assert.equal(world.reads,0);
  assert.ok(full.rejected.population+full.rejected.rarity>0);
});

test('Phase 2 unloaded candidate does not trigger any expensive terrain scan',()=>{
  const world=physicalWorld({resident:false});
  const outcome=proposeRegionalMobSpawn(args(world));
  assert.equal(outcome.proposal,null);
  assert.equal(world.reads,0);
  assert.ok(outcome.rejected.unloaded+outcome.rejected.rarity>0);
});

test('Phase 2 six-attempt limit and source-neighbor occupancy',()=>{
  const seed=179,occupiedPositions=[];
  for(let serial=1;serial<=MAX_PROPOSALS_PER_TICK;serial++){
    const c=planHabitatCandidate(pool,{seed,cx:0,cz:0,section:0,serial});
    occupiedPositions.push([c.x,4,c.z]);
  }
  const result=proposeRegionalMobSpawn({
    ...args(physicalWorld(),seed),occupiedPositions
  });
  assert.equal(result.proposal,null);
  assert.equal(result.attempts,6);
  assert.equal(result.nextSerial,6);
  assert.equal(result.rejected.eligible,0);
});

test('Phase 2 malformed host, region, counts and occupancy fail closed',()=>{
  const base=args(physicalWorld());
  assert.throws(()=>proposeRegionalMobSpawn({...base,world:{}}),
    /Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({...base,region:{...region,section:-2}}),
    /Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({...base,occupiedPositions:[[Infinity,4,3]]}),
    /Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({
    ...base,occupiedPositions:Array.from({length:33},()=>[0,4,0])
  }),/Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({...base,localCounts:null}),
    /Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({...base,startSerial:Number.MAX_SAFE_INTEGER}),
    /Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({...base,rosterAvailable:undefined}),
    /Invalid original-game regional mob proposal state/);
});
