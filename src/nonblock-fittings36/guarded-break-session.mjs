// :36 isolated, opt-in approval bridge. Never touches production raycast or saves.
import {createEditSafeInteraction} from './edit-safe-interaction.mjs';
import {pickFittingTriangle} from './triangle-pick-fixture.mjs';
export function createGuardedFittingSession({seed,objects,inspectMount,authorizeRemoval,maximumReach=5}){
 if(!Array.isArray(objects)||typeof inspectMount!=='function'||typeof authorizeRemoval!=='function'||
 !Number.isFinite(maximumReach)||maximumReach<=0)throw new TypeError('invalid guarded session');
 const byKey=new Map(objects.map(o=>[o.instanceKey,o]));
 const session=createEditSafeInteraction({seed,objects,inspectMount,pick:(visible,ray)=>{
  if(!ray||!Array.isArray(ray.origin)||!Array.isArray(ray.direction)||ray.origin.length!==3||
  ray.direction.length!==3||![...ray.origin,...ray.direction].every(Number.isFinite))return null;
  const length=Math.hypot(...ray.direction);if(length<1e-8)return null;
  const maxDistance=Math.min(maximumReach,Number.isFinite(ray.maxDistance)?Math.max(0,ray.maxDistance):maximumReach);
  if(maxDistance<=0)return null;
  const blockedDistance=ray.blockedDistance===undefined?Infinity:ray.blockedDistance;
  if(!(Number.isFinite(blockedDistance)||blockedDistance===Infinity)||blockedDistance<0)return null;
  return pickFittingTriangle(visible,{origin:ray.origin,direction:ray.direction,maxDistance,blockedDistance});
 }});
 return Object.freeze({visible:session.visible,pick:session.pick,snapshot:session.snapshot,restore:session.restore,
  breakPicked:ray=>session.breakPicked(ray,proposal=>{
   const o=byKey.get(proposal.instanceKey);if(!o)return false;
   const w=inspectMount(Object.freeze([...o.anchor]),o.attachment);
   if(w?.verified!==true||w.playerEdited!==false||w.mountSupported!==true||w.occupied!==false)return false;
   // Authorization can be asynchronous in a future bridge, but this v1 fixture only
   // accepts a synchronous boolean. Recheck after the callback to close the
   // edit-between-approval-and-removal window without touching world state.
   if(authorizeRemoval(Object.freeze({...proposal,seed,anchor:Object.freeze([...o.anchor])}))!==true)return false;
   const after=inspectMount(Object.freeze([...o.anchor]),o.attachment);
   return after?.verified===true&&after.playerEdited===false&&after.mountSupported===true&&after.occupied===false;
  })
 });
}
