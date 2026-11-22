import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion,UNDERWORLD_LEVELS}
 from '../src/living-underworld/worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt}
 from '../src/living-underworld/depth-calibrated-proposal.mjs';
import {auditBoundedCaveComponents}
 from '../src/living-underworld/bounded-components.mjs';
test('four-depth local voxel census refuses to describe a secondary pocket as a world-connected cave',()=>{
 const seed=179,plan=planUnderworldRegion(seed,0,0);
 for(const l of plan.layers){
  const p=l.hub;
  const result=auditBoundedCaveComponents({
   origin:{x:p.x-6,y:p.y-5,z:p.z-6},size:{x:13,y:11,z:13},
   anchors:[p],airAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)});
  assert.equal(result.ok,true);
  assert.equal(result.anchors[0].air,true);
  assert.ok(result.air>100);
  assert.equal(result.wholeWorldConnectivityVerified,false);
 }
 assert.equal(plan.layers.length,UNDERWORLD_LEVELS.length);
});
