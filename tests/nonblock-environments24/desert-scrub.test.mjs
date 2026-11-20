import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDesertScrub,validateDesertScrub,DESERT_SCRUB_SCENE_ID} from '../../src/nonblock-environments24/desert-scrub.mjs';
test('four distinct deterministic original meshes and bounded multi-AABB picks',()=>{
 const seen=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makeDesertScrub({seed:179,anchor:[8,24,-3],variant}),b=makeDesertScrub({seed:179,anchor:[8,24,-3],variant});
  assert.deepEqual(a,b);assert.equal(a.sceneId,DESERT_SCRUB_SCENE_ID);
  assert.equal(a.mesh.triangleCount,25+variant*10);assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,5+variant*2);
  for(const box of a.selectionAabbs)for(let axis=0;axis<3;axis++){assert.ok(box.min[axis]<box.max[axis]);assert.ok(box.min[axis]>=-.3&&box.max[axis]<=.5);}
  assert.ok(validateDesertScrub(a));seen.add(JSON.stringify(a.mesh.positions));
 }
 assert.equal(seen.size,4);
});
test('ground support, removal and sidecar are explicit and never automatic',()=>{
 const a=makeDesertScrub({seed:3,anchor:[0,1,0],variant:2});
 assert.equal(a.attachment.face,'ground');assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
 assert.equal(a.breakIntent.targetKey,a.instanceKey);assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.spawn,'explicit-opt-in-only');assert.equal(a.integrationStatus,'source-candidate-only');
});
test('invalid identities and tampered picks fail closed',()=>{
 for(const args of [{seed:1,anchor:[1.2,0,0]},{seed:1,anchor:[0,0,0],variant:4},{seed:Infinity,anchor:[0,0,0]},{seed:1,anchor:[0,0]}])assert.throws(()=>makeDesertScrub(args));
 const a=makeDesertScrub({seed:1,anchor:[0,0,0]});a.selectionAabbs[0].max[0]=99;
 assert.throws(()=>validateDesertScrub(a));
});
