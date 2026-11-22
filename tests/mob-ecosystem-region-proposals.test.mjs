import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleHabitatPool,planHabitatCandidate,planRegionalHabitatCandidate,
  deterministicHabitatRoll}
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
    revision(){return 0;},
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

test('regional species draw is uniform before a separate one-time source rarity gate',()=>{
  const high=pool.find(s=>s.population.rarity===.75);
  const low=pool.find(s=>s.population.rarity===.35);
  assert.ok(high&&low,'Must use authentic high/low rarity implemented meadow creatures');
  const pair=[high,low],chosen=[0,0],accepted=[0,0],weighted=[0,0];
  for(let serial=1;serial<=12000;serial++){
    const opts={seed:179,cx:0,cz:0,section:0,serial};
    const old=planHabitatCandidate(pair,opts);
    const uniform=planRegionalHabitatCandidate(pair,opts);
    assert.equal(uniform.x,old.x);
    assert.equal(uniform.z,old.z);
    const choice=uniform.species===high?0:1;
    chosen[choice]++;
    weighted[old.species===high?0:1]++;
    const rarity=deterministicHabitatRoll(179^0x3c91c7f5,0,0,0,serial);
    if(rarity<=uniform.species.population.rarity)accepted[choice]++;
  }
  const picked=chosen[0]/chosen[1],successful=accepted[0]/accepted[1];
  const oldPicked=weighted[0]/weighted[1];
  assert.ok(picked>.90&&picked<1.11,'Selection must NOT preweight source rarity');
  assert.ok(oldPicked>1.7&&oldPicked<2.6,
    'Existing weighted exploratory source must remain unchanged');
  assert.ok(successful>1.7&&successful<2.8,
    'One independent original rarity acceptance follows uniform selection');
});

test('complete original 32-entity roster rejects before any voxel reads',()=>{
  const world=physicalWorld();
  const roster=Array.from({length:MAX_OCCUPIED_CANDIDATES},(_,i)=>[i,4,0]);
  const result=proposeRegionalMobSpawn({
    ...args(world),rosterAvailable:true,occupiedPositions:roster
  });
  assert.equal(result.proposal,null);
  assert.equal(result.attempts,0);
  assert.equal(world.reads,0);
});

test('candidate cell must remain resident at actual accepted height',()=>{
  const world=physicalWorld({floor:4});
  const withMovingResidency={
    ...world,residentAt(p){return p[1]!==4;}
  };
  const input={...args(withMovingResidency),region:{...region,feet:8},observer:[0,8,0]};
  const output=proposeRegionalMobSpawn(input);
  assert.equal(output.proposal,null);
  assert.equal(output.rejected.eligible,0);
  assert.ok(output.rejected.unloaded+output.rejected.rarity+
    output.rejected.physicalHabitat>0);
});

test('original-world edit revision is mandatory and atomic across physical scans',()=>{
  const base=args(physicalWorld());
  assert.throws(()=>proposeRegionalMobSpawn({
    ...base,world:{...base.world,revision:undefined}
  }),/Invalid original-game regional mob proposal state/);
  assert.throws(()=>proposeRegionalMobSpawn({
    ...base,world:{...base.world,revision:()=>NaN}
  }),/Invalid original world revision/);
  let revision=0;
  const edited={
    ...physicalWorld(),
    revision(){return revision;},
    volume(point,body){revision++;return point[1]<4?'solid':'clear';}
  };
  let detected=false;
  for(let seed=1;seed<=128;seed++){
    revision=0;
    try{proposeRegionalMobSpawn(args(edited,seed));}
    catch(error){
      if(/World revision changed during mob proposal/.test(String(error))){
        detected=true;break;
      }
      throw error;
    }
  }
  assert.equal(detected,true,'A change observed while reading must not yield a spawn');
});
