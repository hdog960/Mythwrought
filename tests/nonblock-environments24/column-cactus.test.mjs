import test from 'node:test';
import assert from 'node:assert/strict';
import {makeColumnCactus,validateColumnCactus,COLUMN_CACTUS_SCENE_ID} from '../../src/nonblock-environments24/column-cactus.mjs';
test('four deterministic articulated hexagonal cactus variants and bounded picks',()=>{
 const geometries=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makeColumnCactus({seed:179,anchor:[12,7,-5],variant});
  assert.deepEqual(a,makeColumnCactus({seed:179,anchor:[12,7,-5],variant}));
  assert.equal(a.sceneId,COLUMN_CACTUS_SCENE_ID);
  assert.equal(a.mesh.triangleCount,18*(3+2*variant));
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,3+2*variant);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  for(const box of a.selectionAabbs)for(let k=0;k<3;k++){
   assert.ok(box.min[k]<box.max[k]);
   assert.ok(box.min[k]>=-.5&&box.max[k]<=1.1);
  }
  assert.ok(validateColumnCactus(a));geometries.add(JSON.stringify(a.mesh.positions));
 }
 assert.equal(geometries.size,4);
});
test('solid ground-only opt-in candidate with guarded removal and tombstone identity',()=>{
 const a=makeColumnCactus({seed:9,anchor:[0,3,0],variant:3});
 assert.equal(a.collisionIntent,'solid');
 assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
 assert.equal(a.breakIntent.targetKey,a.instanceKey);
 assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.integrationStatus,'source-candidate-only');
 assert.ok(a.mesh.triangleCount<=a.render.maxTrianglesPerInstance);
});
test('invalid identities and tampered meshes fail closed',()=>{
 for(const args of [{seed:1,anchor:[0.1,0,0]},{seed:1,anchor:[0,0,0],variant:4},{seed:NaN,anchor:[0,0,0]},{seed:1,anchor:[0,0]}])assert.throws(()=>makeColumnCactus(args));
 const a=makeColumnCactus({seed:1,anchor:[0,0,0]});a.mesh.positions[0]=999;
 assert.throws(()=>validateColumnCactus(a));
});
