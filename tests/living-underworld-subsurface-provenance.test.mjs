import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback,optimizeDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
import {auditProtectedSubsurfaceStairs}
 from '../src/living-underworld/protected-subsurface-stairs.mjs';
const plan=()=>{
 const q=optimizeDetachedPedestrianSwitchback(179,0,0,16);
 return planDetachedPedestrianSwitchback(179,0,0,16,{
  radius:q.selectedRadius,cornerFlat:q.selectedCornerFlat
 });
};
test('source footprint matches independent three-wide stair geometry with normal rock',()=>{
 const r=auditProtectedSubsurfaceStairs(plan(),{naturalAt:()=>3});
 assert.equal(r.ok,true);
 assert.equal(r.counts.authored,0);
 assert.equal(r.counts.edited,0);
 assert.equal(r.originalM7Edited,false);
 assert.ok(r.counts.geologyExcavation>100);
 assert.ok(r.sourceChecks>100);
});
test('ore, authored cave, protected landmarks, edits and unknown sources remain fail-closed',()=>{
 for(const bad of [{naturalAt:()=>6},
  {naturalAt:()=>3,authoredAt:()=>3},
  {naturalAt:()=>3,protectedAt:()=>true},
  {naturalAt:()=>3,editedAt:()=>true},
  {naturalAt:()=>undefined}]){
  const r=auditProtectedSubsurfaceStairs(plan(),{naturalAt:()=>3,...bad});
  assert.equal(r.ok,false);
  assert.equal(r.sourceTerrainNeverWritten,true);
  assert.ok(r.examples.length>=1);
 }
});
test('original underground terminal stays before protected old-surface cells',()=>{
 const q=optimizeDetachedPedestrianSwitchback(179,0,0,35);
 const p=planDetachedPedestrianSwitchback(179,0,0,35,{
  radius:q.selectedRadius,cornerFlat:q.selectedCornerFlat});
 const r=auditProtectedSubsurfaceStairs(p,{naturalAt:()=>3});
 assert.equal(r.ok,true);
 assert.ok(r.counts.bounds===0);
 assert.equal(p.to.y,-7);
 assert.equal(p.stopsBeforeProtectedSurface,true);
});
test('budget and malformed source reader fail safely',()=>{
 assert.throws(()=>auditProtectedSubsurfaceStairs(plan()),/Invalid/);
 const a=auditProtectedSubsurfaceStairs(plan(),{
  naturalAt:()=>3,maxCells:100});
 assert.equal(a.ok,false);
 assert.equal(a.reason,'SOURCE_QUERY_BUDGET_EXCEEDED');
});
