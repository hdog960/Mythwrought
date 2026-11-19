import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBranchingCrystalCluster,validateBranchingCrystalCluster,BRANCHING_CRYSTAL_SCENE_ID} from '../../src/nonblock-environments24/branching-crystal-cluster.mjs';
test('four deterministic distinct branched pentagonal crystal meshes with per-spire picks',()=>{
 const shapes=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makeBranchingCrystalCluster({seed:179,anchor:[12,-35,4],variant});
  assert.deepEqual(a,makeBranchingCrystalCluster({seed:179,anchor:[12,-35,4],variant}));
  assert.equal(a.sceneId,BRANCHING_CRYSTAL_SCENE_ID);
  assert.equal(a.mesh.triangleCount,(3+variant)*10);
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,3+variant);
  for(const box of a.selectionAabbs)for(let axis=0;axis<3;axis++){
   assert.ok(box.min[axis]<box.max[axis]);
   assert.ok(box.min[axis]>=-.4&&box.max[axis]<=.8);
  }
  assert.ok(validateBranchingCrystalCluster(a));shapes.add(JSON.stringify(a.mesh.positions));
 }
 assert.equal(shapes.size,4);
});
test('solid ground attachment, bounded batching and explicit guarded removal',()=>{
 const a=makeBranchingCrystalCluster({seed:7,anchor:[0,1,0],variant:3});
 assert.equal(a.collisionIntent,'solid');assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
 assert.equal(a.breakIntent.targetKey,a.instanceKey);assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.spawn,'explicit-opt-in-only');assert.equal(a.integrationStatus,'source-candidate-only');
 assert.ok(a.mesh.triangleCount<=a.render.maxTrianglesPerInstance);
});
test('invalid identities and tampered selection fail closed',()=>{
 for(const args of [{seed:1,anchor:[1.5,0,0]},{seed:1,anchor:[0,0,0],variant:4},{seed:Infinity,anchor:[0,0,0]},{seed:1,anchor:[0,0]}])assert.throws(()=>makeBranchingCrystalCluster(args));
 const a=makeBranchingCrystalCluster({seed:1,anchor:[0,0,0]});a.selectionAabbs[0].max[0]=99;
 assert.throws(()=>validateBranchingCrystalCluster(a));
});
