import test from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_CANDIDATES,createForestCandidate} from '../src/nonblock-scene48/forest-phase1-candidates.mjs';
test('two distinct B families have non-cubic triangle meshes and exact anchored bounds',()=>{
 for(const id of FOREST_CANDIDATES){
  const o=createForestCandidate(id,19,3,5,-7),p=o.mesh.positions;
  assert.ok(p.length>90 && p.length%9===0);
  assert.equal(o.mesh.triangleCount,p.length/9);
  for(let i=0;i<p.length;i+=3)for(let k=0;k<3;k++){
   const v=p[i+k]+o.anchor[k];
   assert.ok(v>=o.selectionAabb.min[k]-1e-5&&v<=o.selectionAabb.max[k]+1e-5);
  }
  assert.equal(o.collision,'pass-through');assert.equal(o.spawn,'opt-in-only');
  assert.equal(o.instanceKey,createForestCandidate(id,19,3,5,-7).instanceKey);
 }
 assert.notEqual(createForestCandidate(FOREST_CANDIDATES[0],19,3,5,-7).instanceKey,createForestCandidate(FOREST_CANDIDATES[1],19,3,5,-7).instanceKey);
});
test('anchors and seed distinguish tombstones; malformed anchors rejected',()=>{
 const a=createForestCandidate(FOREST_CANDIDATES[0],2,0,0,0);
 assert.notEqual(a.instanceKey,createForestCandidate(FOREST_CANDIDATES[0],3,0,0,0).instanceKey);
 assert.notEqual(a.instanceKey,createForestCandidate(FOREST_CANDIDATES[0],2,1,0,0).instanceKey);
 assert.throws(()=>createForestCandidate(FOREST_CANDIDATES[0],2,NaN,0,0),TypeError);
 assert.throws(()=>createForestCandidate('scene48:unknown',2,0,0,0),RangeError);
});
