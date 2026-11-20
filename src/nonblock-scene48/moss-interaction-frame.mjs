// :48 opt-in forest moss exact-mesh interaction; never registers with production.
import {createForestMossMat} from './forest-moss-mat.mjs';
import {pickExactMeshRay,breakExactMeshRay} from './exact-mesh-ray-fixture.mjs';
import {prepareNonblockDrawBatches} from './bounded-draw-batches.mjs';
export const MOSS_FRAME_VERSION='nonblock-moss-frame-v1';
const safe=Number.isSafeInteger;
export function createMossInteractionFrame(seed,placements,viewBounds,snapshot,limits={}){
 if(!safe(seed)||!Array.isArray(placements)||placements.length>4096)
  throw new TypeError('invalid moss scope');
 const objects=new Map(),anchors=new Set();
 for(const placement of placements){
  if(!placement||!Array.isArray(placement.anchor)||placement.anchor.length!==3||
     !placement.anchor.every(safe)||(placement.seed!==undefined&&placement.seed!==seed))
   throw new TypeError('invalid moss placement');
  const object=createForestMossMat(seed,...placement.anchor,placement.variant??1);
  const anchor=placement.anchor.join(',');
  if(anchors.has(anchor)||objects.has(object.instanceKey))throw new TypeError('duplicate moss anchor');
  anchors.add(anchor);objects.set(object.instanceKey,object);
 }
 const removed=new Set();
 if(snapshot!==undefined){
  if(!snapshot||snapshot.contract!==MOSS_FRAME_VERSION||snapshot.seed!==seed||
     !Array.isArray(snapshot.removed)||snapshot.removed.length>objects.size)
   throw new TypeError('invalid moss sidecar');
  for(const key of snapshot.removed){
   if(typeof key!=='string'||!objects.has(key)||removed.has(key))
    throw new TypeError('invalid moss tombstone');
   removed.add(key);
  }
 }
 const visible=()=>[...objects.values()].filter(o=>!removed.has(o.instanceKey));
 const draw=()=>prepareNonblockDrawBatches(visible(),viewBounds,limits);
 const fixture={visible,breakByKey:key=>{
  if(!objects.has(key)||removed.has(key))return false;
  removed.add(key);return true;
 }};
 draw(); // fail closed on initial GPU budget before exposing a mutable fixture
 return Object.freeze({
  contract:MOSS_FRAME_VERSION,visible,draw,
  pickRay:(origin,direction,maxDistance=6)=>pickExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakRay:(origin,direction,maxDistance=6)=>{
   const hit=breakExactMeshRay(fixture,{origin,direction,maxDistance});
   if(hit)draw();
   return hit;
  },
  breakByValidatedKey:key=>{
   if(typeof key!=='string'||!objects.has(key)||removed.has(key))return false;
   const ok=fixture.breakByKey(key);
   if(ok)draw();
   return ok;
  },
  snapshot:()=>Object.freeze({contract:MOSS_FRAME_VERSION,seed,removed:Object.freeze([...removed].sort())})
 });
}
