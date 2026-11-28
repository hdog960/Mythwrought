// Movement-owned candidate; no production registration or actor mutation.
import {collides} from '../voxel.mjs';
export const DODGE_DISPLACEMENT_CONTRACT='movement12-horizontal-dodge-v1';
// Shared-height contract #498. Legacy generator bounds are not physical bounds.
const MIN_FEET=-210, MAX_FEET=255.22, STEP=.05, MAX_DISTANCE=4;
const axes=['x','z'];
const valid=p=>p&&['x','feet','z'].every(k=>Number.isFinite(p[k]))&&Math.abs(p.x)<1e7&&Math.abs(p.z)<1e7;
export function resolveDodgeDisplacement({world,start,desired,regionReady,geometryReady}={}){
  if(!valid(start)||!desired||!axes.every(k=>Number.isFinite(desired[k]))||
    (desired.feet!==undefined&&desired.feet!==0)||Math.hypot(desired.x,desired.z)>MAX_DISTANCE||
    typeof regionReady!=='function'||typeof geometryReady!=='function'||!world)
    throw new TypeError('invalid horizontal displacement request');
  const origin={x:start.x,feet:start.feet,z:start.z}, pose={...origin};
  let reason='clear', queries=0;
  // Host certifies each complete swept axis segment (body + support, including
  // loaded cells, authoritative overlays and axis-aligned collision geometry).
  // Unknown/custom geometry must return false; point sampling alone cannot
  // certify arbitrary shapes or a diagonal grazing contact.
  function check(a,b){
    if(b.feet<MIN_FEET||b.feet>MAX_FEET)return 'height-bound';
    if(regionReady(a,b)!==true)return 'region-unverified';
    if(geometryReady(a,b)!==true)return 'geometry-unverified';
    queries++;
    if(collides(world,b.x,b.feet,b.z))return 'collision';
    // No automatic stepping, jumping or crossing unsupported ledges. Walking
    // retains its original step/ground behavior; Combat may request a new mode
    // only after Movement and creator approve it.
    queries++;
    if(!collides(world,b.x,b.feet-.065,b.z))return 'unsupported';
    return 'clear';
  }
  try{
    reason=check(pose,pose);
    const n=Math.max(1,Math.ceil(Math.hypot(desired.x,desired.z)/STEP));
    if(reason==='clear') outer: for(let i=1;i<=n;i++){
      // Axis-separated subsegments are the actual traversed path, not a claim
      // that the diagonal chord is free. Stop at first failed segment.
      for(const axis of axes){
        const next={...pose,[axis]:origin[axis]+desired[axis]*i/n};
        if(next[axis]===pose[axis])continue;
        reason=check(pose,next);
        if(reason!=='clear')break outer;
        pose[axis]=next[axis];
      }
    }
  }catch{
    // An unavailable or throwing collision provider invalidates the entire
    // request. Never issue partial motion from incomplete authority.
    Object.assign(pose,origin);reason='authority-error';
  }
  const displacement={x:pose.x-origin.x,feet:0,z:pose.z-origin.z};
  return Object.freeze({contract:DODGE_DISPLACEMENT_CONTRACT,
    status:reason==='clear'?'accepted':displacement.x||displacement.z?'partial':'blocked',
    reason,pose:Object.freeze({...pose}),displacement:Object.freeze(displacement),queries});
}
