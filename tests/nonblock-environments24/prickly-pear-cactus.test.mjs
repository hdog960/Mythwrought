import test from 'node:test';
import assert from 'node:assert/strict';
import {makePricklyPear,validatePricklyPear,PRICKLY_PEAR_SCENE_ID} from '../../src/nonblock-environments24/prickly-pear-cactus.mjs';
test('four source-modeled multi-pad cactus variants remain deterministic and bounded',()=>{
 const unique=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makePricklyPear({seed:179,anchor:[12,7,-5],variant});
  assert.deepEqual(a,makePricklyPear({seed:179,anchor:[12,7,-5],variant}));
  assert.equal(a.sceneId,PRICKLY_PEAR_SCENE_ID);
  assert.equal(a.mesh.triangleCount,32*(variant+2));
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,variant+2);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  for(const b of a.selectionAabbs)for(let k=0;k<3;k++)assert.ok(b.min[k]<b.max[k]);
  assert.ok(validatePricklyPear(a));unique.add(JSON.stringify(a.mesh.positions));
 }
 assert.equal(unique.size,4);
});
test('opt-in solid cactus has ground support, owner-gated break and stable tombstone',()=>{
 const a=makePricklyPear({seed:9,anchor:[0,3,0],variant:3});
 assert.equal(a.collisionIntent,'solid');
 assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
 assert.equal(a.breakIntent.targetKey,a.instanceKey);
 assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.integrationStatus,'source-candidate-only');
 assert.ok(a.mesh.triangleCount<=a.render.maxTrianglesPerInstance);
});
test('tampering and unsafe identity fail closed',()=>{
 for(const args of [{seed:1,anchor:[.1,0,0]},{seed:1,anchor:[0,0,0],variant:4},{seed:NaN,anchor:[0,0,0]},{seed:1,anchor:[0,0]}])assert.throws(()=>makePricklyPear(args));
 const a=makePricklyPear({seed:1,anchor:[0,0,0]});a.selectionAabbs[0].max[0]=999;
 assert.throws(()=>validatePricklyPear(a));
 const b=makePricklyPear({seed:1,anchor:[0,0,0]});b.mesh.positions[0]=999;
 assert.throws(()=>validatePricklyPear(b));
});
