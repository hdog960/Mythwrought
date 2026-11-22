// Detached Phase 2 natural-spawn transaction preflight. Does not import or
// mutate MobEngine, PopulationManager, source world or save sidecars.
import {deriveRegionalMobState,proposeMobFromRosterSnapshot}
  from './ecosystem-region-snapshot.mjs';
import {createRegionalEcologySchedule,inspectRegionalEcologySchedule,
  settleRegionalEcologyPoll} from './ecosystem-region-cadence.mjs';

function snapshotIdentity(entities){
  return Object.freeze(entities.map(e=>Object.freeze({
    id:e.id,species:e.species,homeChunk:e.homeChunk,important:e.important,
    point:Object.freeze([...e.position])
  })));
}
function sourceUnchanged(before,after){
  if(after.length!==before.length+1)return null;
  const previous=new Map(before.map(e=>[e.id,e]));
  const seen=new Set();
  let added=null;
  for(const entity of after){
    if(seen.has(entity.id))return null;
    seen.add(entity.id);
    const old=previous.get(entity.id);
    if(old){
      if(old.species!==entity.species||old.homeChunk!==entity.homeChunk||
         old.important!==entity.important||
         old.point.some((v,i)=>v!==entity.position[i]))return null;
    }else{
      if(added)return null;
      added=entity;
    }
  }
  if(before.some(e=>!seen.has(e.id)))return null;
  return added;
}

// A result is an immutable READ-ONLY plan, never a birth. The caller is
// responsible for the original engine admission and for supplying after-state
// proof separately. This function does not even have access to engine.spawn().
export function prepareOriginalMobPoll({
  world,seed,region,observer,biome,light,kind='surface',
  now,record=null,entities,isProtected,spawnOnFirstVisit=false
}={}){
  const roster=deriveRegionalMobState(entities,region,{isProtected});
  if(typeof world?.revision!=='function')
    throw new TypeError('Original world edit revision is required');
  const revision=world.revision();
  if(!Number.isSafeInteger(revision)||revision<0)
    throw new TypeError('Invalid original world revision');
  if(record!==null&&record.regionKey!==roster.regionName)
    throw new TypeError('Original regional schedule belongs to another region');
  const sourceRecord=record??createRegionalEcologySchedule({
    regionKey:roster.regionName,now,localCounts:roster.localCounts,
    spawnOnFirstVisit
  });
  const inspected=inspectRegionalEcologySchedule(sourceRecord,{
    now,localCounts:roster.localCounts
  });
  let attempts=0,proposal=null;
  if(inspected.ready){
    const poll=proposeMobFromRosterSnapshot({
      world,seed,region,observer,biome,light,kind,
      entities,isProtected,startSerial:inspected.record.serial
    });
    attempts=poll.attempts;
    proposal=poll.proposal;
  }
  if(world.revision()!==revision)
    throw new TypeError('Original world changed during regional poll');
  return Object.freeze({
    kind:inspected.ready?'evaluated':'cooldown',
    record:inspected.record,attempts,proposal,
    worldRevision:revision,
    before:Object.freeze(snapshotIdentity(entities))
  });
}

// A candidate is NOT a birth. Original MobEngine.spawn must have run and its
// new snapshot must prove EXACTLY one original creature was admitted, with
// all previous IDs/species/home/positions unchanged. Otherwise fail closed.
export function settleOriginalMobPoll(plan,{
  world,afterEntities=null,spawnedId=null
}={}){
  if(!plan||!Object.isFrozen(plan)||!plan.record||
     typeof world?.revision!=='function'||
     world.revision()!==plan.worldRevision)
    throw new TypeError('Invalid or stale original regional mob poll');
  if(plan.kind==='cooldown'){
    if(spawnedId!==null||afterEntities!==null)
      throw new TypeError('No engine admission allowed during cooldown');
    return plan.record;
  }
  if(plan.kind!=='evaluated'||!Number.isInteger(plan.attempts)||
     plan.attempts<0||plan.attempts>6)
    throw new TypeError('Invalid original regional poll budget');
  let confirmed=false,speciesId=null;
  if(spawnedId!==null){
    if(!plan.proposal||typeof spawnedId!=='string'||!spawnedId)
      throw new TypeError('A source engine admission needs an eligible candidate');
    // Reuse source roster validation rather than accepting fabricated records.
    deriveRegionalMobState(afterEntities,{
      cx:Number(plan.record.regionKey.split(',')[0]),
      cz:Number(plan.record.regionKey.split(',')[1]),
      section:Number(plan.record.regionKey.split(',')[2]),
      feet:plan.proposal.point[1]
    });
    const added=sourceUnchanged(plan.before,afterEntities);
    if(!added||added.id!==spawnedId||
       added.species!==plan.proposal.species||
       added.homeChunk!==plan.record.regionKey||
       added.important!==false||
       added.position.some((v,i)=>v!==plan.proposal.point[i]))
      throw new TypeError('Original MobEngine admission proof mismatch');
    confirmed=true;speciesId=added.species.id;
  }else if(afterEntities!==null){
    throw new TypeError('No engine proof allowed without spawned ID');
  }
  if(plan.attempts===0){
    if(confirmed)throw new TypeError('Zero-trial poll cannot create a mob');
    return plan.record;
  }
  return settleRegionalEcologyPoll(plan.record,{
    now:plan.record.time,attempts:plan.attempts,
    successfulBirth:confirmed,speciesId
  });
}
