// :48 opt-in shaped shrub break fixture; never registers in production.
import {createWoodlandShrub} from './woodland-shrub.mjs';
import {pickExactMeshRay,breakExactMeshRay} from './exact-mesh-ray-fixture.mjs';
export const SHRUB_FIXTURE_VERSION='nonblock-shrub-break-v1';
const safe=Number.isSafeInteger;
export function makeShrubBreakFixture(seed,placements,snapshot){
 if(!safe(seed)||!Array.isArray(placements)||placements.length>4096)
  throw new TypeError('invalid shrub scope');
 const objects=new Map(),anchors=new Set();
 for(const spec of placements){
  if(!spec||!Array.isArray(spec.anchor)||spec.anchor.length!==3||
     !spec.anchor.every(safe)||(spec.seed!==undefined&&spec.seed!==seed))
   throw new TypeError('invalid shrub placement');
  const obj=createWoodlandShrub(seed,...spec.anchor,spec.variant??1);
  const anchorKey=spec.anchor.join(',');
  if(objects.has(obj.instanceKey)||anchors.has(anchorKey))
   throw new TypeError('duplicate shrub placement');
  objects.set(obj.instanceKey,obj);anchors.add(anchorKey);
 }
 const removed=new Set();
 if(snapshot!==undefined){
  if(!snapshot||snapshot.contract!==SHRUB_FIXTURE_VERSION||
     snapshot.seed!==seed||!Array.isArray(snapshot.removed)||
     snapshot.removed.length>objects.size)
   throw new TypeError('invalid shrub sidecar');
  for(const key of snapshot.removed){
   if(typeof key!=='string'||!objects.has(key)||removed.has(key))
    throw new TypeError('invalid shrub tombstone');
   removed.add(key);
  }
 }
 const fixture={
  visible:()=>[...objects.values()].filter(o=>!removed.has(o.instanceKey)),
  breakByKey:key=>{
   if(!objects.has(key)||removed.has(key))return false;
   removed.add(key);return true;
  }
 };
 return Object.freeze({
  visible:fixture.visible,breakByKey:fixture.breakByKey,
  pickRay:(origin,direction,maxDistance=6)=>pickExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakRay:(origin,direction,maxDistance=6)=>breakExactMeshRay(fixture,{origin,direction,maxDistance}),
  snapshot:()=>Object.freeze({contract:SHRUB_FIXTURE_VERSION,seed,
   removed:Object.freeze([...removed].sort())})
 });
}
