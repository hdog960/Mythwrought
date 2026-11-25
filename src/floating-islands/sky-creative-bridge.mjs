// MYTHWROUGHT isolated Creative flight / sky residency bridge.
// Original G2 streaming owns 0 and negative sections; this standalone queue
// owns only namespaced upper keys, never aliases sky to depth section 0.
// No flight state, input ownership, production renderer or saves are mutated.
import {skyIslandBodyRegions,SKY_ISLAND_MAX_Y,SKY_ISLAND_PLAYER_HEIGHT} from './sky-runtime-adapter.mjs';
export const SKY_PREFETCH_MAX_NEW=2;
export const SKY_PREFETCH_MAX_PENDING=6;
export const SKY_PREFETCH_MAX_POINTS=8;
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const token=t=>typeof t==='string'&&t.length>0&&t.length<=128;
const fail=s=>{throw new TypeError('Sky creative bridge: '+s);};
const frozenRows=rows=>Object.freeze(rows.map(r=>Object.freeze({...r})));
const legalPoint=p=>p&&[p.x,p.y,p.z].every(valid);
function bodyRegions(point){
  if(point.y>SKY_ISLAND_MAX_Y)fail('flight feet exceed loaded sky source ceiling');
  return skyIslandBodyRegions({x:point.x,feet:point.y,z:point.z});
}
export function createSkyPrefetchState(worldToken='unbound',intentToken='idle'){
  if(!token(worldToken)||!token(intentToken))fail('world and intent tokens required');
  return Object.freeze({worldToken,intentToken,pending:Object.freeze([])});
}
export function planSkyCreativePrefetch(state,{worldToken,intentToken,points=[],isSkyResident}={}){
  if(!state||!Array.isArray(state.pending)||!token(worldToken)||!token(intentToken)||
    !Array.isArray(points)||points.length>SKY_PREFETCH_MAX_POINTS||
    typeof isSkyResident!=='function')fail('invalid bounded sky prefetch request');
  const stale=state.worldToken!==worldToken||state.intentToken!==intentToken;
  const cancelled=stale?state.pending.map(r=>r.key):[];
  const kept=stale?[]:state.pending.filter(r=>!isSkyResident(r));
  const pending=[...kept],seen=new Set(pending.map(r=>r.key)),requests=[];
  for(const point of points){
    if(!legalPoint(point))fail('nonfinite prefetch position');
    const regions=bodyRegions(point);
    for(const region of regions){
      if(isSkyResident(region)||seen.has(region.key))continue;
      if(requests.length>=SKY_PREFETCH_MAX_NEW||pending.length>=SKY_PREFETCH_MAX_PENDING)break;
      pending.push(region);requests.push(region);seen.add(region.key);
    }
    if(requests.length>=SKY_PREFETCH_MAX_NEW||pending.length>=SKY_PREFETCH_MAX_PENDING)break;
  }
  return Object.freeze({state:Object.freeze({worldToken,intentToken,pending:frozenRows(pending)}),
    requests:frozenRows(requests),cancelled:Object.freeze([...new Set(cancelled)])});
}
export function settleSkyCreativePrefetch(state,completed=[]){
  if(!state||!Array.isArray(state.pending)||!Array.isArray(completed)||
    !completed.every(k=>typeof k==='string'))fail('invalid sky prefetch completion');
  const keys=new Set(completed);
  return Object.freeze({...state,pending:frozenRows(state.pending.filter(r=>!keys.has(r.key)))});
}
export function cancelSkyCreativePrefetch(state){
  if(!state||!Array.isArray(state.pending))fail('missing sky state');
  return Object.freeze({state:createSkyPrefetchState(state.worldToken,state.intentToken),
    cancelled:Object.freeze(state.pending.map(r=>r.key))});
}
// Call from a future G2-owned dispatch path BEFORE letting G2 advance.
// A base-world-only body collision callback cannot certify an island cell;
// skyBodyClear MUST query the actual sky+edit physical source and shapes.
export function verifySkyCreativeFlightStep(point,{worldToken,expectedWorldToken,
  isBaseRegionReady,isBaseBodyClear,isSkyResident,isSkyBodyClear}={}){
  if(!legalPoint(point)||!token(worldToken)||!token(expectedWorldToken)||
    typeof isBaseRegionReady!=='function'||typeof isBaseBodyClear!=='function'||
    typeof isSkyResident!=='function'||typeof isSkyBodyClear!=='function')
    fail('authoritative dual-world physical host required');
  if(worldToken!==expectedWorldToken)
    return Object.freeze({safe:false,reason:'World changed; flight suspended',required:Object.freeze([])});
  if(point.y+SKY_ISLAND_PLAYER_HEIGHT>SKY_ISLAND_MAX_Y+1e-9)
    return Object.freeze({safe:false,reason:'Full player body exceeds upper-world ceiling',required:Object.freeze([])});
  const required=bodyRegions(point);
  if(point.y<20&&!isBaseRegionReady(point))
    return Object.freeze({safe:false,reason:'Original terrain region unloaded',required});
  const missing=required.filter(r=>!isSkyResident(r));
  if(missing.length)return Object.freeze({safe:false,reason:'Sky section not resident',
    required,missing:frozenRows(missing)});
  if(!isBaseBodyClear(point))
    return Object.freeze({safe:false,reason:'Original body collision',required});
  if(required.length&&!isSkyBodyClear(point))
    return Object.freeze({safe:false,reason:'Physical island body collision',required});
  return Object.freeze({safe:true,reason:'Dual-world source certified',required});
}
