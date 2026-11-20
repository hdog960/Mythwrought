import test from 'node:test';
import assert from 'node:assert/strict';
import {makeMineralEncrustation,validateMineralEncrustation,MINERAL_ENCRUSTATION_SCENE_ID} from '../../src/nonblock-environments24/mineral-encrustation.mjs';
test('four wall orientations and four deterministic noncubic mineral variants',()=>{
 for(const face of ['north','south','east','west'])for(let variant=0;variant<4;variant++){
  const a=makeMineralEncrustation({seed:179,anchor:[4,-35,7],variant,face});
  assert.equal(a.sceneId,MINERAL_ENCRUSTATION_SCENE_ID);
  assert.equal(a.mesh.triangleCount,6*(4+variant));
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,4+variant);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  for(const b of a.selectionAabbs)assert.ok(b.min.every((n,i)=>Number.isFinite(n)&&n<=b.max[i]));
  assert.equal(validateMineralEncrustation(a),true);
  assert.deepEqual(a,makeMineralEncrustation({seed:179,anchor:[4,-35,7],variant,face}));
 }
});
test('wall support is orthogonal, identity is face-specific and removal is external',()=>{
 const a=makeMineralEncrustation({seed:1,anchor:[0,0,0],face:'east'});
 assert.deepEqual(a.attachment.supportOffset,[-1,0,0]);
 assert.equal(a.attachment.requiresSolid,true);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.integrationStatus,'source-candidate-only');
 assert.notEqual(a.instanceKey,makeMineralEncrustation({seed:1,anchor:[0,0,0],face:'west'}).instanceKey);
});
test('malformed identity and forged geometry, mount or removal fail closed',()=>{
 for(const x of [{seed:1,anchor:[0,0,0],variant:4},{seed:1,anchor:[0,0,0],face:'ceiling'},{seed:1,anchor:[.5,0,0]},{seed:Infinity,anchor:[0,0,0]}])assert.throws(()=>makeMineralEncrustation(x),TypeError);
 const a=makeMineralEncrustation({seed:1,anchor:[0,0,0]});
 for(const patch of [{mesh:{positions:[]}},{attachment:{face:'ground'}},{breakIntent:{action:'none'}},{selectionAabbs:[]}])assert.throws(()=>validateMineralEncrustation({...a,...patch}),/noncanonical/);
});
