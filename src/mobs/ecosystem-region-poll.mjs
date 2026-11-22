// Detached Phase 2 natural-spawn transaction preflight. Does not import or
// mutate MobEngine, PopulationManager, source world or save sidecars.
import {MobEngine} from './engine.mjs';
import {validPoint} from './world-query.mjs';
import {captureOriginalWorldRevision,assertOriginalWorldRevisionUnchanged}
  from './ecosystem-world-revision-fence.mjs';
import {captureOriginalRegionalInputs,assertOriginalRegionalInputsUnchanged}
  from './ecosystem-region-input-fence.mjs';
import {verifyOriginalNaturalMobAdmission}
  from './ecosystem-natural-admission.mjs';
import {captureOriginalMobRoster,assertOriginalMobRosterUnchanged}
  from './ecosystem-roster-integrity.mjs';
import {deriveRegionalMobState,proposeMobFromRosterSnapshot}
  from './ecosystem-region-snapshot.mjs';
import {createRegionalEcologySchedule,inspectRegionalEcologySchedule,
  settleRegionalEcologyPoll} from './ecosystem-region-cadence.mjs';

// Keep actual source-engine ownership out of serializable preview objects.
const owner=new WeakMap();
const sourceWorlds=new WeakMap();
const sourceObservers=new WeakMap();
const fullRosters=new WeakMap();
const settled=new WeakSet();

function snapshotIdentity(entities){
  return Object.freeze(entities.map(e=>Object.freeze({
    id:e.id,species:e.species,homeChunk:e.homeChunk,important:e.important,
    point:Object.freeze([...e.position])
  })));
}
function samePriorMob(old,entity){
  return old.species===entity.species&&
    old.homeChunk===entity.homeChunk&&
    old.important===entity.important&&
    old.point.every((v,i)=>v===entity.position[i]);
}
function sameRoster(before,after){
  if(before.length!==after.length)return false;
  const previous=new Map(before.map(e=>[e.id,e]));
  return after.every(e=>previous.has(e.id)&&samePriorMob(previous.get(e.id),e));
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
      if(!samePriorMob(old,entity))return null;
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
  engine,world,seed,region,observer,biome,light,kind='surface',
  now,record=null,isProtected,spawnOnFirstVisit=false
}={}){
  if(!(engine instanceof MobEngine))
    throw new TypeError('Original MobEngine instance required');
  // Original PopulationManager validates the 3D player position even during
  // regional cooldown; never admit a direct plan without that observer.
  if(!validPoint(observer))
    throw new TypeError('Invalid original regional mob observer');
  // Capture the authoritative world revision before reading external
  // source input properties or invoking source protection/terrain callbacks.
  const revision=captureOriginalWorldRevision(world);
  // Use frozen observer/region snapshots throughout the original census and
  // physical proposal; reject any mutation of the caller-owned inputs.
  const inputs=captureOriginalRegionalInputs(region,observer);
  const sourceObserver=inputs.observer,sourceRegion=inputs.region;
  const entities=engine.all();
  const rosterCertificate=captureOriginalMobRoster(entities);
  const roster=deriveRegionalMobState(entities,sourceRegion,{isProtected});
  assertOriginalRegionalInputsUnchanged(inputs,region,observer);
  assertOriginalWorldRevisionUnchanged(world,revision);
  if(record!==null&&record.regionKey!==roster.regionName)
    throw new TypeError('Original regional schedule belongs to another region');
  const sourceRecord=record??createRegionalEcologySchedule({
    regionKey:roster.regionName,now,localCounts:roster.localCounts,
    spawnOnFirstVisit
  });
  const inspected=inspectRegionalEcologySchedule(sourceRecord,{
    now,localCounts:roster.localCounts
  });
  let attempts=0,proposal=null,rejected=null;
  if(inspected.ready){
    const poll=proposeMobFromRosterSnapshot({
      world,seed,region:sourceRegion,observer:sourceObserver,biome,light,kind,
      entities,isProtected,startSerial:inspected.record.serial
    });
    attempts=poll.attempts;
    proposal=poll.proposal;
    rejected=poll.rejected;
  }
  assertOriginalRegionalInputsUnchanged(inputs,region,observer);
  assertOriginalWorldRevisionUnchanged(world,revision);
  // Source protection and terrain callbacks may edit MobEngine state without
  // incrementing world.revision. A stale proposal cannot consume a global
  // clock or become an actual natural-birth claim.
  assertOriginalMobRosterUnchanged(rosterCertificate,engine.all());
  const prepared=Object.freeze({
    kind:inspected.ready?'evaluated':'cooldown',
    record:inspected.record,attempts,proposal,rejected,
    worldRevision:revision,
    before:snapshotIdentity(entities)
  });
  owner.set(prepared,engine);
  sourceWorlds.set(prepared,world);
  sourceObservers.set(prepared,sourceObserver);
  fullRosters.set(prepared,rosterCertificate);
  return prepared;
}

// A candidate is NOT a birth. Original MobEngine.spawn must have run and its
// new snapshot must prove EXACTLY one original creature was admitted, with
// all previous IDs/species/home/positions unchanged. Otherwise fail closed.
export function settleOriginalMobPoll(plan,{
  world,spawnedId=null
}={}){
  const engine=plan&&typeof plan==='object'?owner.get(plan):null;
  const certified=plan&&typeof plan==='object'?fullRosters.get(plan):null;
  if(!(engine instanceof MobEngine)||!certified||settled.has(plan))
    throw new TypeError('Invalid or stale original regional mob poll');
  // Reject the attempt permanently, including failed or forged admissions:
  // no retry after a real engine or world state transition.
  settled.add(plan);
  // Numeric revision equality is NOT proof of source-world identity.
  if(world!==sourceWorlds.get(plan)||
     typeof world?.revision!=='function'||
     world.revision()!==plan.worldRevision)
    throw new TypeError('Invalid or stale original regional mob poll');
  // Only actual original-engine snapshots are authoritative. A fabricated
  // afterEntities array cannot be substituted by an external caller.
  const afterEntities=engine.all();
  if(plan.kind==='cooldown'){
    if(spawnedId!==null||!sameRoster(plan.before,afterEntities))
      throw new TypeError('No engine admission allowed during cooldown');
    assertOriginalMobRosterUnchanged(certified,afterEntities);
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
    // A newly spawned creature must not mask any mutation of existing
    // source-engine state, health, velocity, origin, grounded flags, etc.
    // The source engine's insertion order is stable; exclude ONLY its
    // independently admitted ID before checking all prior original fields.
    assertOriginalMobRosterUnchanged(certified,
      afterEntities.filter(entity=>entity.id!==spawnedId));
    // Original PopulationManager invokes spawn(...,{homeChunk:name,
    // dormant:distanceTo(observer,point)>18}), never juvenile:true.
    // Preserve the actual original MobEngine.spawn() initial newborn fields:
    // a separately engine-admitted juvenile, prematurely moved/damaged mob,
    // or far-away idle mob is not a certified natural birth.
    verifyOriginalNaturalMobAdmission({
      entity:added,proposal:plan.proposal,
      observer:sourceObservers.get(plan),
      regionKey:plan.record.regionKey,spawnedId
    });
    confirmed=true;speciesId=added.species.id;
  }else{
    if(!sameRoster(plan.before,afterEntities))
      throw new TypeError('No original-engine admission proof for changed roster');
    assertOriginalMobRosterUnchanged(certified,afterEntities);
  }
  if(plan.attempts===0){
    if(confirmed)throw new TypeError('Zero-trial poll cannot create a mob');
    return plan.record;
  }
  const next=settleRegionalEcologyPoll(plan.record,{
    now:plan.record.time,attempts:plan.attempts,
    successfulBirth:confirmed,speciesId
  });
  return next;
}
