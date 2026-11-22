import test from 'node:test';
import assert from 'node:assert/strict';
import {getSpecies} from '../src/mobs/species.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {proposeRegionalMobSpawn}
  from '../src/mobs/ecosystem-region-proposals.mjs';
import {planRegionalHabitatCandidate,eligibleHabitatPool}
  from '../src/mobs/ecosystem-habitat.mjs';
import {deriveRegionalMobState,proposeMobFromRosterSnapshot}
  from '../src/mobs/ecosystem-region-snapshot.mjs';

const region={cx:0,cz:0,section:0,feet:4},observer=[8,4,8];
const deer=getSpecies('deer');
function entity(id,{species=deer,position=[8,4,8],homeChunk='0,0,0',
  important=false}={}){
  return {id,species,position,homeChunk,important};
}
function physicalWorld(){
  return {
    revision(){return 0;},
    residentAt(){return true;},
    volume(point){return point[1]<4?'solid':'clear';},
    grounded(point){return point[1]>=4&&point[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('World mutation forbidden');},
    save(){throw Error('Save writes forbidden');}
  };
}
function args(world,seed=179){
  return {world,seed,region,observer,biome:'meadow',light:.8,kind:'surface',
    startSerial:0};
}

test('snapshot retains original local count and protected identity semantics',()=>{
  const records=[
    entity('regular'),
    entity('important',{important:true,position:[9,4,8]}),
    entity('tamed',{position:[10,4,8]}),
    entity('elsewhere',{homeChunk:'2,0,0',position:[11,4,8]})
  ];
  const sourceBefore=JSON.stringify(records.map(x=>({
    id:x.id,homeChunk:x.homeChunk,important:x.important,
    position:x.position,species:x.species.id
  })));
  const called=[];
  const result=deriveRegionalMobState(records,region,{
    isProtected:mob=>{called.push(mob.id);return mob.id==='tamed';}
  });
  assert.equal(result.regionName,'0,0,0');
  assert.equal(result.localCounts.get('deer'),1,
    'Only natural nonimportant nonprotected local deer count');
  assert.equal(result.occupiedPositions.length,4,
    'Important, tamed and foreign creatures still block physical overlap');
  assert.deepEqual(called,['regular','tamed'],
    'Protection is checked only for nonimportant local species');
  assert.equal(result.rosterAvailable,true);
  assert.equal(Object.isFrozen(result),true);
  assert.equal(Object.isFrozen(result.occupiedPositions),true);
  assert.equal(Object.isFrozen(result.occupiedPositions[0]),true);
  assert.notEqual(result.occupiedPositions[0],records[0].position);
  assert.equal(JSON.stringify(records.map(x=>({
    id:x.id,homeChunk:x.homeChunk,important:x.important,
    position:x.position,species:x.species.id
  }))),sourceBefore,'Source engine snapshots must be unchanged');
});

test('empty canonical roster adapter exactly matches explicit source counts',()=>{
  const before=deriveRegionalMobState([],region);
  const world=physicalWorld(),seed=179;
  const explicit=proposeRegionalMobSpawn({
    ...args(world,seed),localCounts:before.localCounts,
    occupiedPositions:before.occupiedPositions,
    rosterAvailable:before.rosterAvailable
  });
  const bridged=proposeMobFromRosterSnapshot({
    ...args(world,seed),entities:[]
  });
  assert.deepEqual(bridged,explicit);
  assert.equal(before.localCounts.get('deer'),0);
});

test('original 32-entity limit counts every kind of mob including protected',()=>{
  const full=Array.from({length:32},(_,i)=>entity('mob-'+i,{
    position:[i+.5,4,0],important:i%2===0,
    homeChunk:i%3===0?'1,0,0':null
  }));
  const snapshot=deriveRegionalMobState(full,region);
  assert.equal(snapshot.rosterAvailable,false);
  assert.equal(snapshot.occupiedPositions.length,32);
  assert.equal(proposeMobFromRosterSnapshot({
    ...args(physicalWorld()),entities:full
  }).proposal,null);
});

test('foreign region residents still block physical occupancy near candidate',()=>{
  const seed=179,pool=eligibleHabitatPool({biome:'meadow',light:.8,feet:4});
  const others=Array.from({length:6},(_,i)=>{
    const c=planRegionalHabitatCandidate(pool,{
      seed,cx:0,cz:0,section:0,serial:i+1
    });
    return entity('elsewhere-'+i,{
      position:[c.x,4,c.z],homeChunk:'99,0,0'
    });
  });
  const result=proposeMobFromRosterSnapshot({
    ...args(physicalWorld(),seed),entities:others
  });
  assert.equal(result.proposal,null,'Every original candidate location is occupied');
  assert.equal(result.attempts,6);
  assert.ok(result.rejected.occupied+result.rejected.rarity+
    result.rejected.physicalHabitat>0);
});

test('incomplete, forged, duplicated or corrupted source roster fails closed',()=>{
  assert.throws(()=>deriveRegionalMobState(null,region),
    /Invalid original MobEngine regional roster snapshot/);
  assert.throws(()=>deriveRegionalMobState([],{
    ...region,section:-2
  }),/Invalid original MobEngine regional roster snapshot/);
  assert.throws(()=>deriveRegionalMobState(Array.from({length:33},
    (_,i)=>entity('extra'+i)),region),
    /Invalid original MobEngine regional roster snapshot/);
  assert.throws(()=>deriveRegionalMobState([
    entity('same'),entity('same')
  ],region),/Invalid original mob roster entry/);
  assert.throws(()=>deriveRegionalMobState([
    entity('bad',{species:{...deer}})
  ],region),/Invalid original mob roster entry/);
  assert.throws(()=>deriveRegionalMobState([
    entity('bad',{position:[Infinity,4,8]})
  ],region),/Invalid original mob roster entry/);
  assert.throws(()=>deriveRegionalMobState([
    entity('tamed')
  ],region,{isProtected:()=>undefined}),/Invalid original mob protection status/);
});

test('actual original MobEngine snapshots preserve identity and home-chunk rules',()=>{
  const world=physicalWorld();
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const natural=engine.spawn('deer',[8,4,8],{homeChunk:'0,0,0'});
  const bonded=engine.spawn('glownewt',[9,4,8],{homeChunk:'0,0,0'});
  assert.ok(natural&&bonded,
    'Use actual source engine admission, never forged creature snapshots');
  assert.equal(engine.protectIdentity(bonded),true);
  const actual=engine.all();
  assert.equal(actual.length,2);
  assert.equal(Object.isFrozen(actual[0]),true,
    'Original MobEngine snapshot references must remain immutable');
  assert.equal(actual[0].species,getSpecies('deer'));
  assert.equal(actual[1].species,getSpecies('glownewt'));
  const derived=deriveRegionalMobState(actual,region);
  assert.equal(derived.localCounts.get('deer'),1);
  assert.equal(derived.localCounts.get('glownewt'),0,
    'Important original engine mob cannot consume renewable population cap');
  assert.equal(derived.occupiedPositions.length,2,
    'Important mob still consumes occupancy in exact physical voxels');
  assert.equal(derived.rosterAvailable,true);
  assert.deepEqual(derived.occupiedPositions.map(p=>p[0]),[8,9]);
  assert.equal(engine.counts().total,2,'Read-only bridge never mutates engine');
  engine.dispose();
});
