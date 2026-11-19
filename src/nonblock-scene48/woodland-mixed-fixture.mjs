// :48 opt-in mixed B-family woodland scene; never registers into the live world.
// All sidecar validation is atomic before exposing mutable break operations.
import {makeSeedScopedForestFixture,FOREST_SIDECAR_GUARD_VERSION} from './forest-sidecar-guard.mjs';
import {makeSaplingBreakFixture,SAPLING_FIXTURE_VERSION} from './sapling-break-fixture.mjs';
import {pickExactMeshRay,breakExactMeshRay} from './exact-mesh-ray-fixture.mjs';
export const WOODLAND_MIXED_VERSION='nonblock-woodland-mixed-v1';
const integer=Number.isSafeInteger;
export function makeWoodlandMixedFixture(seed,forestSpecs,saplingSpecs,snapshot){
 if(!integer(seed)||!Array.isArray(forestSpecs)||!Array.isArray(saplingSpecs)||
    forestSpecs.length+saplingSpecs.length>4096)
  throw new TypeError('invalid woodland scope');
 if(snapshot!==undefined&&(!snapshot||snapshot.contract!==WOODLAND_MIXED_VERSION||
    snapshot.seed!==seed||!snapshot.forest||!snapshot.saplings))
  throw new TypeError('invalid woodland sidecar');
 // Construct both child fixtures before publishing either: malformed second
 // sidecars must not partially restore or break the first group.
 const forest=makeSeedScopedForestFixture(seed,forestSpecs,snapshot?.forest);
 const saplings=makeSaplingBreakFixture(seed,saplingSpecs,snapshot?.saplings);
 const keys=new Set();
 for(const obj of [...forest.visible(),...saplings.visible()]){
  if(keys.has(obj.instanceKey))throw new TypeError('duplicate woodland identity');
  keys.add(obj.instanceKey);
 }
 const fixture={
  visible:()=>[...forest.visible(),...saplings.visible()],
  breakByKey:key=>forest.breakByKey(key)||saplings.breakByKey(key)
 };
 return Object.freeze({
  visible:fixture.visible,breakByKey:fixture.breakByKey,
  pickRay:(origin,direction,maxDistance=6)=>pickExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakRay:(origin,direction,maxDistance=6)=>breakExactMeshRay(fixture,{origin,direction,maxDistance}),
  snapshot:()=>Object.freeze({contract:WOODLAND_MIXED_VERSION,seed,
   forest:forest.snapshot(),saplings:saplings.snapshot()})
 });
}
