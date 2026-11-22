import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback,optimizeDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
import {auditProtectedSubsurfaceStairs}
 from '../src/living-underworld/protected-subsurface-stairs.mjs';
const route=()=>{
 const q=optimizeDetachedPedestrianSwitchback(179,0,0,16);
 return planDetachedPedestrianSwitchback(179,0,0,16,{
  radius:q.selectedRadius,cornerFlat:q.selectedCornerFlat
 });
};
test('a named source-owned cave AIR cell cannot be filled by a proposed staircase',()=>{
 const p=route(),{x,y,z}=p.from;
 const result=auditProtectedSubsurfaceStairs(p,{naturalAt:()=>3,
  authoredAt:(a,b,c)=>a===x&&b===y-1&&c===z?0:undefined});
 assert.equal(result.ok,false);
 assert.equal(result.counts.authoredAirSupport,1);
 assert.ok(result.examples.some(e=>e.reason==='AUTHORED_AIR_SUPPORT'));
 assert.equal(result.sourceTerrainNeverWritten,true);
});
test('an unowned naturally occurring cave AIR support cell also remains untouched',()=>{
 const p=route(),{x,y,z}=p.from;
 const result=auditProtectedSubsurfaceStairs(p,{
  naturalAt:(a,b,c)=>a===x&&b===y-1&&c===z?0:3
 });
 assert.equal(result.ok,false);
 assert.equal(result.counts.existingAirSupport,1);
 assert.ok(result.examples.some(e=>e.reason==='EXISTING_AIR_SUPPORT'));
});
test('preserved authored AIR already in the planned three-high clearance is safe, not overwritten',()=>{
 const p=route(),{x,y,z}=p.from;
 const result=auditProtectedSubsurfaceStairs(p,{
  naturalAt:(a,b,c)=>a===x&&b===y&&c===z?0:3,
  authoredAt:(a,b,c)=>a===x&&b===y&&c===z?0:undefined
 });
 assert.equal(result.ok,true);
 assert.equal(result.counts.authoredAirClearance,1);
 assert.equal(result.counts.authoredAirSupport,0);
});
test('an authored-AIR tag contradicting the actual source reader is rejected',()=>{
 const p=route(),{x,y,z}=p.from;
 const result=auditProtectedSubsurfaceStairs(p,{
  naturalAt:()=>3,
  authoredAt:(a,b,c)=>a===x&&b===y&&c===z?0:undefined
 });
 assert.equal(result.ok,false);
 assert.equal(result.counts.sourceInconsistency,1);
});
test('malformed authored source material never becomes a carveable geology permission',()=>{
 const p=route(),{x,y,z}=p.from;
 for(const value of [null,-1,'stone',NaN]){
  const result=auditProtectedSubsurfaceStairs(p,{
   naturalAt:()=>3,
   authoredAt:(a,b,c)=>a===x&&b===y&&c===z?value:undefined
  });
  assert.equal(result.ok,false);
  assert.ok(result.counts.sourceInconsistency>0);
 }
});
