import test from 'node:test';
import assert from 'node:assert/strict';
import {createForestMossMat,MOSS_SCENE_ID} from '../src/nonblock-scene48/forest-moss-mat.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';

test('moss mat variants are shaped, bounded, deterministic and stable across reload',()=>{
 for(let variant=1;variant<=3;variant++){
  const a=createForestMossMat(179,4,2,8,variant);
  const b=createForestMossMat(179,4,2,8,variant);
  assert.equal(a.sceneId,MOSS_SCENE_ID);
  assert.equal(a.mesh.triangleCount,40);
  assert.deepEqual([...a.mesh.positions],[...b.mesh.positions]);
  assert.equal(a.instanceKey,b.instanceKey);
  assert.equal(a.tombstoneKey,a.instanceKey);
  assert.equal(a.collision,'pass-through');
  assert.equal(a.breakIntent,'remove-instance');
  assert.equal(a.spawn,'opt-in-only');
  assert.equal(a.respawn,'never-with-tombstone');
  assert.ok(a.selectionAabb.max[1]>a.selectionAabb.min[1]);
  assert.ok(a.selectionAabb.max[0]-a.selectionAabb.min[0]>.5);
  assert.ok(a.mesh.triangleCount<=a.lod.maxTriangles);
 }
});
test('moss keys distinguish variants, anchors and world seeds; reject invalid placements',()=>{
 const a=createForestMossMat(179,0,0,0,1);
 assert.notEqual(a.instanceKey,createForestMossMat(180,0,0,0,1).instanceKey);
 assert.notEqual(a.instanceKey,createForestMossMat(179,1,0,0,1).instanceKey);
 assert.notEqual(a.instanceKey,createForestMossMat(179,0,0,0,2).instanceKey);
 for(const args of [[179,0,0,0,0],[179,0,0,0,4],[179,Infinity,0,0,1],[179,1000001,0,0,1]])
  assert.throws(()=>createForestMossMat(...args),TypeError);
});
test('moss tombstones exclude removed instance from bounded scene preparation',()=>{
 const a=createForestMossMat(179,0,0,0,1),b=createForestMossMat(179,3,0,0,2);
 const bounds=[[-2,-2,-2],[6,3,3]];
 const all=prepareNonblockDrawBatches([a,b],bounds);
 assert.equal(all.visibleCount,2);
 const removed=prepareNonblockDrawBatches([a,b],bounds,{removedKeys:[a.instanceKey]});
 assert.equal(removed.visibleCount,1);
 assert.ok(removed.batches.flatMap(batch=>batch.instances).every(o=>o.instanceKey!==a.instanceKey));
});
