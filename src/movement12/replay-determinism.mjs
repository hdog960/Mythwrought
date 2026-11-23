// Source-only repeatability probe for an injected (ideally genuine) stepPlayer.
// Never certifies terrain authenticity; caller must supply the same immutable world.
import {captureStepTrace} from './step-trace.mjs';
const keys=['stepped','landed','jumped','hitWall','ceiling'];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const motionKeys=['vX','vY','vZ','onGround','coyote','jumpBuffer'];
const changedMotion=(a,b,tolerance)=>motionKeys.some(k=>{
  if(a[k]===undefined&&b[k]===undefined)return false;
  if(typeof a[k]==='number'&&typeof b[k]==='number')
    return !Number.isFinite(a[k])||!Number.isFinite(b[k])||Math.abs(a[k]-b[k])>tolerance;
  return a[k]!==b[k];
});
export function compareStepReplays(options,{positionTolerance=1e-7}={}){
  if(!Number.isFinite(positionTolerance)||positionTolerance<0||positionTolerance>.01)
    throw Error('Invalid replay tolerance');
  // Clone input structures before each invocation, so callback-side mutation of
  // a frame cannot silently make the second replay consume different commands.
  if(!options||!Array.isArray(options.inputs))throw Error('Invalid replay inputs');
  const original=options.inputs.map(input=>input&&typeof input==='object'?{...input}:input);
  const run=()=>captureStepTrace({...options,inputs:original.map(input=>input&&typeof input==='object'?{...input}:input)});
  const first=run(),second=run();
  const violations=[];
  for(let i=0;i<first.frames.length;i++){
    const a=first.frames[i],b=second.frames[i];
    if(distance(a.start,b.start)>positionTolerance||distance(a.end,b.end)>positionTolerance)
      violations.push({frame:i,kind:'position-drift'});
    if(keys.some(k=>(a.event?.[k]??false)!==(b.event?.[k]??false)))
      violations.push({frame:i,kind:'event-drift'});
  }
  if(changedMotion(first.finalPlayer,second.finalPlayer,positionTolerance))
    violations.push({frame:first.frames.length-1,kind:'motion-state-drift'});
  return {deterministic:violations.length===0,violations,frames:first.frames.length,
    geometryCertified:false,liveIntegrated:false};
}
