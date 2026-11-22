// MYTHWROUGHT - original G2A flight-math runner with disjoint upper stream.
// This is an isolated HOST adapter, not a replacement G2 controller. It runs
// the exact native planG2FlightStep, while routing actual upper readiness to
// physical sky sections and keeping upper-prefetch keys out of G2's 0/-N queue.
import {planG2FlightStep} from '../creative-integration/g2-flight.mjs';
import {sectionForY} from '../depth.mjs';
import {skyIslandBodyRegions} from './sky-runtime-adapter.mjs';
import {planSkyCreativePrefetch} from './sky-creative-bridge.mjs';
const fail=s=>{throw new TypeError('Sky original G2 owner: '+s);};
const xyz=p=>p&&[p.x,p.y,p.z].every(Number.isFinite);
const activeSky=p=>skyIslandBodyRegions({x:p.x,feet:p.y,z:p.z}).length>0;
const freeze=a=>Object.freeze([...a]);
const hold=(state,reason,skyPrefetchState,skyCancelled=[],skyRequests=[])=>Object.freeze({
  g2State:Object.freeze({...state,blocked:true,reason}),skyPrefetchState,
  skyRequests:freeze(skyRequests),skyCancelled:freeze(skyCancelled),
  nativeRequests:freeze([]),nativeCancelled:freeze([]),
  position:state.position,approved:false,reason,worldWrites:0});
export function planNativeG2SkyStep({g2State,intent,skyPrefetchState,
  worldToken,readCurrentWorldToken,isBaseRegionReady,isBaseBodyClear,
  isSkyResident,isSkyBodyClear,skyPrefetchPoints=[]}={}){
  if(!g2State||g2State.mode!=='flight'||!xyz(g2State.position)||
     !skyPrefetchState||!Array.isArray(skyPrefetchState.pending)||
     !Array.isArray(skyPrefetchPoints)||skyPrefetchPoints.length>8||
     !skyPrefetchPoints.every(xyz)||
     typeof worldToken!=='string'||!worldToken||
     typeof readCurrentWorldToken!=='function'||
     [isBaseRegionReady,isBaseBodyClear,isSkyResident,isSkyBodyClear]
       .some(f=>typeof f!=='function'))
    fail('live original G2 state, world identity and dual-world authority required');
  const now=()=>readCurrentWorldToken();
  if(worldToken!==g2State.worldToken||now()!==g2State.worldToken){
    // Native G2's stale-world result does not cancel its pending G2 queue;
    // the real controller must still stop/cancel its native requests.
    const plan=planSkyCreativePrefetch(skyPrefetchState,{
      worldToken:now(),intentToken:'world-changed',points:[],isSkyResident});
    return hold(g2State,'World changed; original G2 sky flight suspended',
      plan.state,plan.cancelled);
  }
  let rejectedBySource=false;
  const checkSkyReady=p=>skyIslandBodyRegions({x:p.x,feet:p.y,z:p.z})
    .every(r=>isSkyResident(r));
  const ready=p=>{
    if(now()!==g2State.worldToken){rejectedBySource=true;return false;}
    if(p.y<20&&!isBaseRegionReady(p))return false;
    return checkSkyReady(p);
  };
  const clear=p=>{
    if(now()!==g2State.worldToken){rejectedBySource=true;return false;}
    if(!isBaseBodyClear(p))return false;
    if(activeSky(p)&&!isSkyBodyClear(p))return false;
    return true;
  };
  // Must recheck the starting body too; original G2 sweeps only i=1..N.
  // A just-placed physical sky block can invalidate the standing position.
  if(!ready(g2State.position)||!clear(g2State.position)){
    // This does not alter G2's control ownership or original pending queue.
    const plan=planSkyCreativePrefetch(skyPrefetchState,{worldToken,
      intentToken:'start-blocked',points:[g2State.position],isSkyResident});
    return hold(g2State,'Current player body not ready or obstructed',
      plan.state,plan.cancelled,plan.requests);
  }
  const result=planG2FlightStep(g2State,intent,{
    worldToken:g2State.worldToken,isRegionReady:ready,isBodyClear:clear,
    // Original G2 prefetch accepts sections 0 and negative, NOT sky IDs.
    // Its sky-ward synthetic section 0 is removed from returned requests.
    sectionForY:y=>y>19&&y<=256?0:sectionForY(y)
  });
  const changed=now()!==g2State.worldToken||rejectedBySource;
  const nativeReq=result.requests.filter(r=>!activeSky(r.point));
  // Original G2's sky-ward fake key `cx,cz,0` can alias an outstanding
  // genuine surface request. That makes G2 suppress a sky prefetch before
  // it ever reaches `result.requests`. The original renderer may supply up to
  // eight verified sky/lookahead points to break this collision without
  // changing the native G2 request key-space or inventing world geometry.
  const skyPoints=[...result.requests.filter(r=>activeSky(r.point)).map(r=>r.point),
    ...skyPrefetchPoints].slice(0,8);
  const prefetchToken=result.state.prefetch.intentToken;
  const plan=planSkyCreativePrefetch(skyPrefetchState,{
    worldToken:changed?now():worldToken,
    intentToken:changed?'world-changed':prefetchToken,
    points:changed?[]:skyPoints,isSkyResident});
  // Do not allow phantom `cx,cz,0` sky prefetch to reach the native GPU
  // desired/pending queue, where it would alias the real surface section.
  const realNativePending=result.state.prefetch.pending.filter(r=>!activeSky(r.point));
  const nativeState=Object.freeze({...result.state,prefetch:Object.freeze({
    ...result.state.prefetch,pending:freeze(realNativePending)})});
  const approved=!changed&&!nativeState.blocked&&
    // Independently verify the final body after native math, even if G2
    // happened to return 'hover ready' due to zero intent / distance.
    ready(nativeState.position)&&clear(nativeState.position)&&
    !rejectedBySource&&now()===g2State.worldToken;
  if(!approved){
    return Object.freeze({g2State:Object.freeze({...nativeState,
        position:g2State.position,blocked:true,
        reason:changed?'World changed during G2 physical sweep':nativeState.reason}),
      skyPrefetchState:plan.state,skyRequests:plan.requests,
      skyCancelled:plan.cancelled,nativeRequests:freeze(nativeReq),
      nativeCancelled:result.cancelled,position:g2State.position,approved:false,
      reason:changed?'World changed during G2 physical sweep':nativeState.reason,
      worldWrites:0});
  }
  return Object.freeze({g2State:nativeState,skyPrefetchState:plan.state,
    skyRequests:plan.requests,skyCancelled:plan.cancelled,
    nativeRequests:freeze(nativeReq),nativeCancelled:result.cancelled,
    position:nativeState.position,approved:true,
    reason:'Original G2 and physical sky sources certified',worldWrites:0});
}
