import test from 'node:test';
import assert from 'node:assert/strict';
import {createWoodlandShrub,SHRUB_SCENE_ID} from '../src/nonblock-scene48/woodland-shrub.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';

test('shrub variants are shaped, deterministic, bounded and opt-in only',()=>{
 const ids=new Set();
 for(let v=1;v<=3;v++){
  const a=createWoodlandShrub(17,4,8,12,v),b=createWoodlandShrub(17,4,8,12,v);
  assert.equal(a.sceneId,SHRUB_SCENE_ID);
  assert.equal(a.instanceKey,b.instanceKey);
  assert.deepEqual([...a.mesh.positions],[...b.mesh.positions]);
  assert.ok(a.mesh.triangleCount>20&&a.mesh.triangleCount<=128);
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.mesh.materials.length,a.mesh.triangleCount);
  assert.equal(a.breakIntent,'remove-instance');
  assert.equal(a.tombstoneKey,a.instanceKey);
  assert.equal(a.collision,'pass-through');
  assert.equal(a.spawn,'opt-in-only');
  assert.equal(a.respawn,'never-with-tombstone');
  for(let i=0;i<a.mesh.positions.length;i+=3)for(let j=0;j<3;j++){
   const n=a.mesh.positions[i+j]+a.anchor[j];
   assert.ok(n>=a.selectionAabb.min[j]-1e-6&&n<=a.selectionAabb.max[j]+1e-6);
  }
  ids.add(a.instanceKey);
 }
 assert.equal(ids.size,3);
});
test('shrub breaks are represented by tombstones in opt-in draw preparation',()=>{
 const shrub=createWoodlandShrub(3,1,2,3);
 const view=[[-10,-10,-10],[10,10,10]];
 const before=prepareNonblockDrawBatches([shrub],view);
 assert.equal(before.visibleCount,1);
 const after=prepareNonblockDrawBatches([shrub],view,{removedKeys:[shrub.tombstoneKey]});
 assert.equal(after.visibleCount,0);
 assert.equal(after.triangles,0);
 assert.equal(after.batches.length,0);
 assert.throws(()=>prepareNonblockDrawBatches([shrub],view,{removedKeys:['foreign']}),/unknown/);
});
test('shrub rejects invalid anchors and variants',()=>{
 for(const args of [[1,0,0,0,0],[1,0,0,0,4],[1,Infinity,0,0,1],[1,1000001,0,0,1],[1,0.2,0,0,1]]){
  assert.throws(()=>createWoodlandShrub(...args),TypeError);
 }
});
