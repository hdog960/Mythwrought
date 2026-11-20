// Forest B-family exact-triangle selection adapter, isolated from production :00.
import {makeForestBreakFixture} from './forest-break-fixture.mjs';
import {pickExactMeshRay,breakExactMeshRay} from './exact-mesh-ray-fixture.mjs';
export const FOREST_EXACT_BREAK_VERSION='nonblock-forest-exact-break-v1';
export function makeForestExactBreakFixture(specs,sidecar){
 const fixture=makeForestBreakFixture(specs,sidecar);
 return Object.freeze({
  visible:fixture.visible,
  pickRay:(origin,direction,maxDistance=6)=>pickExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakRay:(origin,direction,maxDistance=6)=>breakExactMeshRay(fixture,{origin,direction,maxDistance}),
  breakByKey:fixture.breakByKey,
  tombstoneSidecar:fixture.tombstoneSidecar
 });
}
