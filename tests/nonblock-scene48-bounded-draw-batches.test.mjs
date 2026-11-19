import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNonblockDrawBatches,NONBLOCK_BATCH_PREP_VERSION} from '../src/nonblock-scene48/bounded-draw-batches.mjs';
const triangle=[0,0,0,1,0,0,0,1,0];
const obj=(key,sceneId,anchor)=>({instanceKey:key,sceneId,anchor,mesh:{positions:triangle}});
const view=[[-2,-2,-2],[2,2,2]];
test('bounded batches cull distant meshes, sort deterministically, and retain real mesh references',()=>{
 const near=obj('b','forest:root',[0,0,0]),other=obj('a','forest:root',[1,0,0]),far=obj('z','forest:root',[100,0,0]);
 const result=prepareNonblockDrawBatches([near,far,other],view);
 assert.equal(result.contract,NONBLOCK_BATCH_PREP_VERSION);
 assert.equal(result.visibleCount,2);assert.equal(result.culledCount,1);
 assert.equal(result.triangles,2);assert.equal(result.batches.length,1);
 assert.deepEqual(result.batches[0].instances.map(x=>x.instanceKey),['a','b']);
 assert.equal(result.batches[0].instances[1].mesh,near.mesh);
 assert.equal(prepareNonblockDrawBatches([other,near,far],view).batches[0].instances[0].instanceKey,'a');
});
test('fail closed on duplicate identities, malformed geometry and exceeded GPU budgets',()=>{
 const a=obj('a','forest:root',[0,0,0]),b=obj('b','forest:root',[1,0,0]);
 assert.throws(()=>prepareNonblockDrawBatches([a,a],view),TypeError);
 assert.throws(()=>prepareNonblockDrawBatches([a,b],view,{maxObjects:1}),TypeError);
 assert.throws(()=>prepareNonblockDrawBatches([a,b],view,{maxTriangles:1,maxBatchTriangles:1}),RangeError);
 assert.throws(()=>prepareNonblockDrawBatches([a],view,{maxTriangles:10,maxBatchTriangles:0}),TypeError);
 assert.throws(()=>prepareNonblockDrawBatches([{...a,mesh:{positions:[NaN,...triangle.slice(1)]}}],view),TypeError);
 assert.throws(()=>prepareNonblockDrawBatches([a],[[2,2,2],[-2,-2,-2]]),TypeError);
});
test('batch triangle cap splits groups without dropping instances',()=>{
 const result=prepareNonblockDrawBatches([obj('b','forest:root',[0,0,0]),obj('a','forest:root',[0,0,0])],view,{maxTriangles:2,maxBatchTriangles:1});
 assert.equal(result.batches.length,2);
 assert.deepEqual(result.batches.map(b=>b.triangles),[1,1]);
});

test('reject invalid namespaces and nonfinite translated vertices before draw preparation',()=>{
 const a=obj('a','forest:root',[0,0,0]);
 for(const sceneId of ['', 'forest', 'forest:root:extra', '123', 'forest:Root', null]){
  assert.throws(()=>prepareNonblockDrawBatches([{...a,sceneId}],view),TypeError);
 }
 assert.throws(()=>prepareNonblockDrawBatches([{...a,instanceKey:'x'.repeat(513)}],view),TypeError);
 const overflow=obj('overflow','forest:root',[Number.MAX_VALUE,0,0]);
 overflow.mesh={positions:[Number.MAX_VALUE,0,0,0,1,0,0,0,1]};
 assert.throws(()=>prepareNonblockDrawBatches([overflow],view),TypeError);
 assert.equal(prepareNonblockDrawBatches([a],view).visibleCount,1);
});
