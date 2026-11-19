import test from 'node:test';
import assert from 'node:assert/strict';
import {createWoodlandSapling,SAPLING_SCENE_ID} from '../src/nonblock-scene48/woodland-sapling.mjs';
test('sapling has original bounded shaped triangles, stable variants and pass-through intent',()=>{
 const a=createWoodlandSapling(17,4,8,-2,1),b=createWoodlandSapling(17,4,8,-2,1),c=createWoodlandSapling(17,4,8,-2,2);
 assert.equal(a.sceneId,SAPLING_SCENE_ID);assert.equal(a.instanceKey,b.instanceKey);
 assert.notEqual(a.instanceKey,c.instanceKey);assert.equal(a.mesh.triangleCount,68);
 assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
 assert.equal(a.mesh.materials.length,a.mesh.triangleCount);
 assert.deepEqual([...a.mesh.positions],[...b.mesh.positions]);
 assert.equal(a.collision,'pass-through');assert.equal(a.spawn,'opt-in-only');
 assert.equal(a.tombstoneKey,a.instanceKey);assert.equal(a.breakIntent,'remove-instance');
 assert.ok(a.selectionAabb.max[1]-a.selectionAabb.min[1]>1);
 assert.ok(a.mesh.positions.every(Number.isFinite));
 assert.ok(a.mesh.triangleCount<=a.lod.maxTriangles);
});
test('sapling rejects malformed identity and produces world-space selection bounds',()=>{
 for(const args of [[NaN,0,0,0],[1,.5,0,0],[1,0,0,0,0],[1,0,0,0,4]])assert.throws(()=>createWoodlandSapling(...args));
 const a=createWoodlandSapling(1,0,0,0),b=createWoodlandSapling(1,9,2,-3);
 for(let i=0;i<3;i++){const offset=[9,2,-3][i];
  assert.ok(Math.abs((b.selectionAabb.min[i]-a.selectionAabb.min[i])-offset)<1e-8);
  assert.ok(Math.abs((b.selectionAabb.max[i]-a.selectionAabb.max[i])-offset)<1e-8);
 }
});
