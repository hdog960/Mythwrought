// G2A fail-closed landing. Host supplies REAL body collision, floor support,
// region residency and safe swept descent; no world state is changed here.
import {createG2PrefetchState} from './g2-streaming.mjs';
const good=p=>p&&['x','y','z'].every(k=>Number.isFinite(p[k]));
const fail=s=>{throw new TypeError('G2 landing: '+s);};
const freezePos=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
export const G2_MAX_LANDING_CANDIDATES=64;
export const G2_MAX_LANDING_DISTANCE=8;
export const G2_MAX_LANDING_DROP=32;
function validate(state,host){
  if(!state||state.mode!=='flight'||!good(state.position)||!host||
     typeof host.isRegionReady!=='function'||typeof host.isBodyClear!=='function'||
     typeof host.hasGroundSupport!=='function'||typeof host.isSafeDescent!=='function'||
     host.worldToken!==state.worldToken)fail('live flight state and four source-backed safety readers required');
}
function safe(state,p,host){
  const h=state.position;
  if(!good(p)||p.y<h.y-G2_MAX_LANDING_DROP||p.y>h.y+.01||
     Math.hypot(p.x-h.x,p.z-h.z)>G2_MAX_LANDING_DISTANCE||
     p.y<state.heightBounds.minFeet||p.y>state.heightBounds.maxFeet)return false;
  return host.isRegionReady(p)&&host.isBodyClear(p)&&host.hasGroundSupport(p)&&
    host.isSafeDescent(h,p);
}
export function inspectG2Landing(state,host){
  validate(state,host);
  if(typeof host.findGroundCandidates!=='function')fail('bounded ground search required');
  const candidates=host.findGroundCandidates(state.position);
  if(!Array.isArray(candidates)||candidates.length>G2_MAX_LANDING_CANDIDATES)
    fail('landing search exceeds bounded budget');
  for(const candidate of candidates)if(safe(state,candidate,host))
    return Object.freeze({landed:false,canLand:true,position:freezePos(candidate),
      worldToken:state.worldToken,reason:'Verified landing candidate'});
  return Object.freeze({landed:false,canLand:false,position:null,
    worldToken:state.worldToken,reason:'No verified landing; remain hovering'});
}
export function commitG2Landing(state,assessment,host){
  validate(state,host);
  if(!assessment?.canLand||assessment.worldToken!==state.worldToken||
     !safe(state,assessment.position,host))
    return Object.freeze({landed:false,state,restorePlayer:null,
      reason:'Landing stale or unsafe; remain hovering'});
  const landing=freezePos(assessment.position);
  const next=Object.freeze({...state,mode:'off',position:landing,blocked:false,
    reason:'Safe landing acknowledged',prefetch:createG2PrefetchState(state.worldToken)});
  // HOST must apply this only in a separately authorized integration.
  // Walking velocity reset is a suggestion, not a mutation or save.
  const restore=Object.freeze({position:landing,vX:0,vY:0,vZ:0,onGround:true});
  return Object.freeze({landed:true,state:next,restorePlayer:restore,reason:'Landing verified'});
}
