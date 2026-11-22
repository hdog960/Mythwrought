// Detached Phase 2 original-ecology cadence contract, NOT live PopulationManager.
// This pure scheduler holds NO MobEngine/world handles and creates NO entities.
// It mirrors only the original regional cooldown and population high-water math.
import {speciesRegistry} from './species.mjs';

export const ORIGINAL_ECOLOGY_POLL_INTERVAL=.5;
export const ORIGINAL_ECOLOGY_REPLENISH_SECONDS=12;
export const ORIGINAL_ECOLOGY_SUCCESS_COOLDOWN_SECONDS=1.5;
export const ORIGINAL_ECOLOGY_MAX_TRIALS=6;
const allowed=Object.freeze(speciesRegistry.filter(s=>s.implementation==='preview'));
const ids=Object.freeze(allowed.map(s=>s.id));

function verifyCounts(counts){
  if(!(counts instanceof Map)||counts.size!==ids.length||
    ids.some(id=>!counts.has(id)||!Number.isSafeInteger(counts.get(id))||counts.get(id)<0))
    throw new TypeError('Incomplete original regional population counts');
}
function immutableWater(counts){
  return Object.freeze(ids.map(id=>Object.freeze([id,counts.get(id)])));
}
function validSchedule(state){
  return state&&Object.isFrozen(state)&&
    typeof state.regionKey==='string'&&/^-?\d+,-?\d+,-?\d+$/.test(state.regionKey)&&
    [state.time,state.next].every(Number.isFinite)&&
    state.time>=0&&state.next>=0&&
    Number.isSafeInteger(state.serial)&&state.serial>=0&&
    Array.isArray(state.highWater)&&state.highWater.length===ids.length&&
    state.highWater.every((pair,i)=>Object.isFrozen(pair)&&
      pair?.[0]===ids[i]&&Number.isSafeInteger(pair[1])&&pair[1]>=0);
}
function immutableRecord(state){
  return Object.freeze(state);
}
function validTime(now){return Number.isFinite(now)&&now>=0;}

// The source manager creates a first-visit region record and waits 0.5s by
// default; new-world warm starts explicitly opt in to immediate evaluation.
export function createRegionalEcologySchedule({
  regionKey,now,localCounts,spawnOnFirstVisit=false
}={}){
  verifyCounts(localCounts);
  if(typeof regionKey!=='string'||!/^-?\d+,-?\d+,-?\d+$/.test(regionKey)||
     !validTime(now)||typeof spawnOnFirstVisit!=='boolean')
    throw new TypeError('Invalid original ecology scheduling inputs');
  return immutableRecord({
    regionKey,time:now,next:now+(spawnOnFirstVisit?0:ORIGINAL_ECOLOGY_POLL_INTERVAL),
    serial:0,highWater:immutableWater(new Map(ids.map(id=>[id,0])))
  });
}

// Mirrors original PopulationManager high-water update: every census updates
// the stored counts; any decrease schedules at least 12 seconds from now.
export function inspectRegionalEcologySchedule(record,{
  now,localCounts
}={}){
  if(!validSchedule(record)||!validTime(now)||now<record.time)
    throw new TypeError('Invalid original regional ecology schedule');
  verifyCounts(localCounts);
  let next=record.next;
  for(let i=0;i<ids.length;i++){
    const old=record.highWater[i][1],current=localCounts.get(ids[i]);
    if(current<old)next=Math.max(next,now+ORIGINAL_ECOLOGY_REPLENISH_SECONDS);
  }
  const updated=immutableRecord({
    regionKey:record.regionKey,time:now,next,
    serial:record.serial,highWater:immutableWater(localCounts)
  });
  return Object.freeze({record:updated,ready:now>=next});
}

// Called ONLY after an actual read-only proposal poll was admitted by the
// external original 0.5-second global ticker, with its real attempted trials.
// "eligibleCandidate" means proposed physical position, NOT a natural birth;
// successfulBirth MUST be confirmed by the original engine spawn result.
export function settleRegionalEcologyPoll(record,{
  now,attempts,successfulBirth=false,speciesId=null
}={}){
  if(!validSchedule(record)||!validTime(now)||now!==record.time||
     now<record.next||!Number.isInteger(attempts)||attempts<1||
     attempts>ORIGINAL_ECOLOGY_MAX_TRIALS||
     typeof successfulBirth!=='boolean'||
     (successfulBirth&&(!ids.includes(speciesId)))||
     (!successfulBirth&&speciesId!==null)||
     record.serial>Number.MAX_SAFE_INTEGER-attempts)
    throw new TypeError('Invalid original regional poll result');
  const high=new Map(record.highWater);
  if(successfulBirth){
    high.set(speciesId,high.get(speciesId)+1);
  }
  return immutableRecord({
    regionKey:record.regionKey,time:now,
    next:successfulBirth?now+ORIGINAL_ECOLOGY_SUCCESS_COOLDOWN_SECONDS:record.next,
    serial:record.serial+attempts,highWater:immutableWater(high)
  });
}
