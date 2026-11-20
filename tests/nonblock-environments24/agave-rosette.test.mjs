import test from 'node:test';
import assert from 'node:assert/strict';
import {makeAgaveRosette,validateAgaveRosette,AGAVE_SCENE_ID} from '../../src/nonblock-environments24/agave-rosette.mjs';
test('four deterministic folded succulent rosettes with separate leaf pick volumes',()=>{
 const geometries=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makeAgaveRosette({seed:179,anchor:[12,7,-5],variant});
  assert.deepEqual(a,makeAgaveRosette({seed:179,anchor:[12,7,-5],variant}));
  assert.equal(a.sceneId,AGAVE_SCENE_ID);
  assert.equal(a.mesh.triangleCount,6*(6+variant*2));
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,6+variant*2);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  for(const box of a.selectionAabbs)for(let k=0;k<3;k++){
   assert.ok(box.min[k]<box.max[k]);
   assert.ok(box.min[k]>=-.55&&box.max[k]<=.55);
  }
  assert.ok(validateAgaveRosette(a));geometries.add(JSON.stringify(a.mesh.positions));
 }
 assert.equal(geometries.size,4);
});
test('ground-only opt-in removable candidate with deterministic external tombstone',()=>{
 const a=makeAgaveRosette({seed:9,anchor:[0,3,0],variant:3});
 assert.equal(a.collisionIntent,'pass-through');
 assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
 assert.equal(a.breakIntent.targetKey,a.instanceKey);
 assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.integrationStatus,'source-candidate-only');
 assert.ok(a.mesh.triangleCount<=a.render.maxTrianglesPerInstance);
});
test('forged identities and tampered selection or geometry fail closed',()=>{
 for(const args of [{seed:1,anchor:[0.1,0,0]},{seed:1,anchor:[0,0,0],variant:4},{seed:NaN,anchor:[0,0,0]},{seed:1,anchor:[0,0]}])assert.throws(()=>makeAgaveRosette(args));
 const a=makeAgaveRosette({seed:1,anchor:[0,0,0]});a.selectionAabbs[0].max[0]=999;
 assert.throws(()=>validateAgaveRosette(a));
 const b=makeAgaveRosette({seed:1,anchor:[0,0,0]});b.mesh.positions[0]=999;
 assert.throws(()=>validateAgaveRosette(b));
});
