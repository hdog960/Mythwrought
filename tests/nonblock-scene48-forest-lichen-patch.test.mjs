import test from 'node:test';
import assert from 'node:assert/strict';
import {createForestLichenPatch,LICHEN_SCENE_ID} from '../src/nonblock-scene48/forest-lichen-patch.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';
const view=[[-10,-10,-10],[10,10,10]];
test('lichen has distinct non-cubic radial lobes, valid selection bounds and stable variants',()=>{
 for(let variant=1;variant<=3;variant++){
  const a=createForestLichenPatch(19,2,0,3,variant),b=createForestLichenPatch(19,2,0,3,variant);
  assert.equal(a.sceneId,LICHEN_SCENE_ID);
  assert.equal(a.mesh.triangleCount,(6+variant)*3);
  assert.ok(a.mesh.triangleCount<=a.lod.maxTriangles);
  assert.deepEqual([...a.mesh.positions],[...b.mesh.positions]);
  assert.equal(a.instanceKey,b.instanceKey);
  assert.equal(a.collision,'pass-through');
  assert.equal(a.breakIntent,'remove-instance');
  assert.equal(a.respawn,'never-with-tombstone');
  for(let i=0;i<a.mesh.positions.length;i+=3)for(let k=0;k<3;k++){
   const v=a.mesh.positions[i+k]+a.anchor[k];
   assert.ok(v>=a.selectionAabb.min[k]-1e-6&&v<=a.selectionAabb.max[k]+1e-6);
  }
 }
});
test('lichen removal tombstone excludes only its anchored instance from scene draw',()=>{
 const a=createForestLichenPatch(19,0,0,0,1),b=createForestLichenPatch(19,3,0,0,2);
 const full=prepareNonblockDrawBatches([a,b],view);
 const after=prepareNonblockDrawBatches([a,b],view,{removedKeys:[a.instanceKey]});
 assert.equal(full.visibleCount,2);
 assert.equal(after.visibleCount,1);
 assert.notEqual(a.instanceKey,b.instanceKey);
});
test('lichen rejects invalid identity and variants',()=>{
 assert.throws(()=>createForestLichenPatch(1,0,0,0,4),TypeError);
 assert.throws(()=>createForestLichenPatch(1,0.5,0,0),TypeError);
 assert.throws(()=>createForestLichenPatch(1,1000001,0,0),TypeError);
});
