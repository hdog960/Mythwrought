// :48 opt-in sapling break fixture. No production registration or schema-1 writes.
import {createWoodlandSapling} from './woodland-sapling.mjs';
import {pickExactMeshRay,breakExactMeshRay} from './exact-mesh-ray-fixture.mjs';
export const SAPLING_FIXTURE_VERSION='nonblock-sapling-break-v1';
const integer=Number.isSafeInteger;
export function makeSaplingBreakFixture(seed,placements,snapshot){
 if(!integer(seed)||!Array.isArray(placements)||placements.length>4096)
  throw new TypeError('invalid sapling world scope');
 const objects=new Map();
 for(const spec of placements){
  if(!spec||!Array.isArray(spec.anchor)||spec.anchor.length!==3||
     !spec.anchor.every(integer)||(spec.seed!==undefined&&spec.seed!==seed))
   throw new TypeError('invalid sapling placement');
  const obj=createWoodlandSapling(seed,...spec.anchor,spec.variant??1);
  if(objects.has(obj.instanceKey))throw new TypeError('duplicate sapling identity');
  objects.set(obj.instanceKey,obj);
 }
 const removed=new Set();
 if(snapshot!==undefined){
  if(!snapshot||snapshot.contract!==SAPLING_FIXTURE_VERSION||
     snapshot.seed!==seed||!Array.isArray(snapshot.removed)||
     snapshot.removed.length>objects.size)throw new TypeError('foreign sapling tombstone sidecar');
  for(const key of snapshot.removed){
   if(typeof key!=='string'||!objects.has(key)||removed.has(key))
    throw new TypeError('invalid sapling tombstone');
   removed.add(key);
  }
 }
 const fixture={
  visible:()=>[...objects.values()].filter(obj=>!removed.has(obj.instanceKey)),
  breakByKey:key=>{if(!objects.has(key)||removed.has(key))return false;removed.add(key);return true;}
 };
 return Object.freeze({
  visible:fixture.visible,breakByKey:fixture.breakByKey,
  pickRay:(origin,direction,maxDistance=6)=>pickExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakRay:(origin,direction,maxDistance=6)=>breakExactMeshRay(fixture,{origin,direction,maxDistance}),
  snapshot:()=>Object.freeze({contract:SAPLING_FIXTURE_VERSION,seed,removed:Object.freeze([...removed].sort())})
 });
}
