import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback,
 auditDetachedPedestrianSwitchback,optimizeDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
test('default old 44 radius remains byte-for-byte equal to explicit 44/8',()=>{
 for(const index of [16,25,34,35]){
  const old=planDetachedPedestrianSwitchback(179,0,0,index);
  const explicit=planDetachedPedestrianSwitchback(179,0,0,index,
   {radius:44,cornerFlat:8});
  assert.deepEqual(old,explicit);
 }
});
test('cost-focused radius choice preserves every existing strict support and headroom check',()=>{
 let old=0,optimized=0,links=0;
 for(const seed of [179,-17,2026,314159,8675309,13579])
  for(const [rx,rz] of [[0,0],[-7,13],[300,-302],[-300,250]])
   for(const index of [16,25,34,35]){
    const selected=optimizeDetachedPedestrianSwitchback(seed,rx,rz,index);
    const checked=auditDetachedPedestrianSwitchback(seed,rx,rz,index,{
      radius:selected.selectedRadius,cornerFlat:selected.selectedCornerFlat
    });
    assert.ok(selected.ok);
    assert.ok(checked.ok);
    assert.equal(checked.conflicts,0);
    assert.ok(checked.maximumStepRise<=1);
    assert.equal(selected.actualM7VoxelsModified,false);
    assert.equal(selected.originalM7SourceOwnershipUnverified,true);
    old+=selected.baselineSupportCells;
    optimized+=selected.optimizedSupportCells;
    links++;
   }
 assert.equal(links,96);
 assert.equal(old,128731);
 assert.equal(optimized,45866);
 assert.ok(optimized<=old*.40);
});
test('under-surface socket never reaches old protected surface with any radius',()=>{
 const q=optimizeDetachedPedestrianSwitchback(179,0,0,35);
 const ramp=planDetachedPedestrianSwitchback(179,0,0,35,{
  radius:q.selectedRadius,cornerFlat:q.selectedCornerFlat
 });
 assert.equal(ramp.to.y,-7);
 assert.equal(ramp.stopsBeforeProtectedSurface,true);
 assert.equal(ramp.remainingOriginalSocketRise,3);
});
test('unsafe radius and turn dimensions fail closed before candidate allocation',()=>{
 assert.throws(()=>planDetachedPedestrianSwitchback(179,0,0,16,{radius:13}),/Invalid/);
 assert.throws(()=>planDetachedPedestrianSwitchback(179,0,0,16,{radius:45}),/Invalid/);
 assert.throws(()=>planDetachedPedestrianSwitchback(179,0,0,16,{radius:14,cornerFlat:10}),/Invalid/);
});
