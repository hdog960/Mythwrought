// Detached original-ecology global scheduling research ONLY.
// Does not access MobEngine, mutate world, replace PopulationManager or save.
// Mirrors the original 0.5s world ticker, 64-item rotating region selection,
// capped time advancement and earliest-eligible stale region eviction.
import {sectionForY} from '../depth.mjs';
import {ORIGINAL_ECOLOGY_POLL_INTERVAL,ORIGINAL_ECOLOGY_REPLENISH_SECONDS,
  inspectRegionalEcologySchedule} from './ecosystem-region-cadence.mjs';

export const ORIGINAL_MAX_REGION_RECORDS=64;
export const ORIGINAL_MAX_TIME_ADVANCE=1;
const certified=new WeakSet();
const consumed=new WeakSet();
const pending=new WeakSet();
const issued=new WeakMap();

function clock(time,next,cursor,entries){
  const result=Object.freeze({
    time,next,cursor,
    entries:Object.freeze(entries.map(([key,record])=>
      Object.freeze([key,record])))
  });
  certified.add(result);
  return result;
}
function validRegion(region){
  return [region?.cx,region?.cz,region?.section].every(Number.isSafeInteger)&&
    Math.abs(region.cx)<2**22&&Math.abs(region.cz)<2**22&&
    Number.isFinite(region.feet)&&
    sectionForY(Math.floor(region.feet))===region.section;
}
function keyFor(region){
  return [region.cx,region.cz,region.section].join(',');
}
function certifiedClock(state){
  return state&&certified.has(state)&&!consumed.has(state)&&
    !pending.has(state);
}
export function createGlobalEcologyClock(){
  return clock(0,ORIGINAL_ECOLOGY_POLL_INTERVAL,0,[]);
}

// One source advance() call; do not replay the same clock or skip an outstanding
// due region. The returned ticket owns the selection, not a mutable shared
// cursor/roster. An empty or invalid region still consumes the 0.5s global tick.
export function advanceGlobalEcologyClock(state,{
  seconds,regions
}={}){
  if(!certifiedClock(state)||!Number.isFinite(seconds)||seconds<0||
    !Array.isArray(regions))
    throw new TypeError('Invalid original ecology global advance');
  consumed.add(state);
  const time=state.time+Math.min(ORIGINAL_MAX_TIME_ADVANCE,seconds);
  if(time<state.next)
    return Object.freeze({
      clock:clock(time,state.next,state.cursor,state.entries),
      selection:null,reason:'interval'
    });
  const next=time+ORIGINAL_ECOLOGY_POLL_INTERVAL;
  if(!regions.length)
    return Object.freeze({
      clock:clock(time,next,state.cursor,state.entries),
      selection:null,reason:'empty'
    });
  const width=Math.min(regions.length,ORIGINAL_MAX_REGION_RECORDS);
  const picked=regions[state.cursor%width];
  const cursor=state.cursor+1;
  const advanced=clock(time,next,cursor,state.entries);
  if(!validRegion(picked))
    return Object.freeze({clock:advanced,selection:null,reason:'invalid-region'});
  const key=keyFor(picked);
  const known=state.entries.find(([name])=>name===key);
  let evictKey=null;
  if(!known&&state.entries.length>=ORIGINAL_MAX_REGION_RECORDS){
    const stale=state.entries.find(([,entry])=>
      entry.next<=time-ORIGINAL_ECOLOGY_REPLENISH_SECONDS);
    if(!stale)
      return Object.freeze({clock:advanced,selection:null,reason:'capacity'});
    evictKey=stale[0];
  }
  const selection=Object.freeze({
    key,
    region:Object.freeze({
      cx:picked.cx,cz:picked.cz,section:picked.section,feet:picked.feet
    }),
    record:known?.[1]??null,
    evictKey,time
  });
  issued.set(selection,advanced);
  pending.add(advanced);
  return Object.freeze({
    clock:advanced,selection,reason:'selected'
  });
}

// Only a genuine source regional cadence record from an already inspected or
// settled read-only original-engine poll may be used. It must correspond to
// the exact global tick/selected region. No clock or selection is reusable.
export function commitGlobalEcologyRegion(clockState,selection,record){
  if(!clockState||!selection||issued.get(selection)!==clockState||
     !pending.has(clockState)||consumed.has(clockState)||
     !record||Object.isFrozen(record)!==true||
     record.regionKey!==selection.key||
     record.time!==clockState.time||
     !Number.isSafeInteger(record.serial)||record.serial<0||
     !Array.isArray(record.highWater))
    throw new TypeError('Invalid original ecology global region commit');
  // Validate through existing ORIGINAL species high-water and cadence checks.
  inspectRegionalEcologySchedule(record,{
    now:clockState.time,localCounts:new Map(record.highWater)
  });
  if(selection.record&&record.serial<selection.record.serial)
    throw new TypeError('Original region serial cannot rewind');
  // Source #regions is a JavaScript Map: Map.set EXISTING key updates its
  // value WITHOUT reordering insertion; only new keys append. This order
  // determines which stale record will be evicted first.
  const entries=clockState.entries
    .filter(([key])=>key!==selection.evictKey)
    .map(([key,old])=>key===selection.key?[key,record]:[key,old]);
  if(!entries.some(([key])=>key===selection.key)){
    if(entries.length>=ORIGINAL_MAX_REGION_RECORDS)
      throw new TypeError('Original 64-region ledger is full');
    entries.push([selection.key,record]);
  }
  pending.delete(clockState);
  consumed.add(clockState);
  issued.delete(selection);
  return clock(clockState.time,clockState.next,clockState.cursor,entries);
}
