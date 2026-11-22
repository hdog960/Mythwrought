// Detached original-ecology global scheduling research ONLY.
// Does not access MobEngine, mutate world, replace PopulationManager or save.
// Mirrors the original 0.5s world ticker, 64-item rotating region selection,
// capped time advancement and earliest-eligible stale region eviction.
import {sectionForY} from '../depth.mjs';
import {previewSourceEcologyRegion} from './ecosystem-selection-preview.mjs';
import {SOURCE_MAX_ECOLOGY_TIME_ADVANCE,previewSourceEcologyTick}
  from './ecosystem-tick-preview.mjs';
import {ORIGINAL_ECOLOGY_POLL_INTERVAL,ORIGINAL_ECOLOGY_REPLENISH_SECONDS,
  inspectRegionalEcologySchedule} from './ecosystem-region-cadence.mjs';

export const ORIGINAL_MAX_REGION_RECORDS=64;
export const ORIGINAL_MAX_TIME_ADVANCE=SOURCE_MAX_ECOLOGY_TIME_ADVANCE;
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

// Preview the exact original capped time advance without touching certified
// source clock ownership. A rejected #reconcile is NOT permitted to consume
// the only valid global tick and force a restarted/forged research clock.
export function previewGlobalEcologyTick(state,{
  seconds,regions
}={}){
  if(!certifiedClock(state)||!Array.isArray(regions)||
     !Number.isFinite(seconds)||seconds<0)
    throw new TypeError('Invalid original ecology global advance');
  return previewSourceEcologyTick({
    time:state.time,next:state.next,seconds
  });
}

// Compute which real source region would be visited, WITHOUT consuming
// the certified global clock or issuing a commit-capable selection ticket.
export function previewGlobalEcologySelection(state,{
  seconds,regions
}={}){
  const due=previewGlobalEcologyTick(state,{seconds,regions});
  if(!due.due)
    return Object.freeze({
      reason:'interval',time:due.time,nextCursor:state.cursor,
      key:null,region:null,record:null,evictKey:null
    });
  const chosen=previewSourceEcologyRegion({
    regions,cursor:state.cursor,time:due.time,
    records:state.entries,isValidRegion:validRegion
  });
  return Object.freeze({...chosen,time:due.time});
}

// A single consuming source tick uses the SAME bounded source selection
// algorithm as the preview; invalid/capacity/empty slots still advance
// time and the original cursor when appropriate.
export function advanceGlobalEcologyClock(state,{
  seconds,regions
}={}){
  const predicted=previewGlobalEcologySelection(state,{seconds,regions});
  consumed.add(state);
  const time=predicted.time;
  if(predicted.reason==='interval')
    return Object.freeze({
      clock:clock(time,state.next,state.cursor,state.entries),
      selection:null,reason:'interval'
    });
  const next=time+ORIGINAL_ECOLOGY_POLL_INTERVAL;
  const advanced=clock(time,next,predicted.nextCursor,state.entries);
  if(predicted.reason!=='selected')
    return Object.freeze({
      clock:advanced,selection:null,reason:predicted.reason
    });
  const selection=Object.freeze({
    key:predicted.key,region:predicted.region,
    record:predicted.record,evictKey:predicted.evictKey,time
  });
  issued.set(selection,advanced);
  pending.add(advanced);
  return Object.freeze({clock:advanced,selection,reason:'selected'});
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
