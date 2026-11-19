// :48 opt-in woodland shrub interaction frame. No production world/save writes.
import {makeShrubBreakFixture,SHRUB_FIXTURE_VERSION} from './shrub-break-fixture.mjs';
import {prepareNonblockDrawBatches} from './bounded-draw-batches.mjs';
export const SHRUB_FRAME_VERSION='nonblock-shrub-frame-v1';
// A single immutable-view API for the manual integrator to inspect: picking and
// drawing always use the same tombstone-filtered fixture state.
export function createShrubInteractionFrame(seed,placements,viewBounds,snapshot,limits={}){
 const fixture=makeShrubBreakFixture(seed,placements,snapshot);
 const draw=()=>prepareNonblockDrawBatches(fixture.visible(),viewBounds,limits);
 // Fail closed before exposing an interactive frame if the initial scene is over budget.
 draw();
 return Object.freeze({
  contract:SHRUB_FRAME_VERSION,sidecarContract:SHRUB_FIXTURE_VERSION,
  draw,visible:fixture.visible,pickRay:fixture.pickRay,
  breakRay:(origin,direction,maxDistance=6)=>{
   const hit=fixture.pickRay(origin,direction,maxDistance);
   if(!hit)return null;
   // Verify the post-break scene still fits GPU budgets before committing a removal.
   // Removing an instance cannot increase triangles, but validation must remain explicit.
   const removed=fixture.breakRay(origin,direction,maxDistance);
   if(!removed||removed.instanceKey!==hit.instanceKey)
    throw new Error('inconsistent shrub break target');
   draw();
   return removed;
  },
  snapshot:fixture.snapshot
 });
}
