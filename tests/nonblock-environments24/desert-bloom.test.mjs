import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDesertBloom,validateDesertBloom,DESERT_BLOOM_SCENE_ID} from '../../src/nonblock-environments24/desert-bloom.mjs';
const opts={seed:179,anchor:[7,13,-5],variant:3};
test('desert bloom uses folded shaped triangles with bounded selection',()=>{
 for(let variant=0;variant<4;variant++){
  const o=makeDesertBloom({...opts,variant});
  assert.equal(o.sceneId,DESERT_BLOOM_SCENE_ID);
  assert.equal(o.mesh.triangleCount,10+4*(5+variant));
  assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
  assert.equal(o.mesh.positions.length,o.mesh.triangleCount*9);
  for(let i=0;i<o.mesh.positions.length;i+=3)for(let j=0;j<3;j++)
   assert.ok(o.mesh.positions[i+j]>=o.selectionAabbs[0].min[j]-1e-8&&o.mesh.positions[i+j]<=o.selectionAabbs[0].max[j]+1e-8);
  assert.equal(validateDesertBloom(o),true);
 }
});
test('desert bloom identity and opt-in removal contract are deterministic',()=>{
 const a=makeDesertBloom(opts);assert.deepEqual(a,makeDesertBloom(opts));
 for(const change of [{seed:180},{anchor:[7,14,-5]},{variant:2}])
  assert.notEqual(makeDesertBloom({...opts,...change}).instanceKey,a.instanceKey);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.collisionIntent,'pass-through');
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.deepEqual(a.attachment.supportOffset,[0,-1,0]);
});
test('desert bloom rejects forged geometry, removal and malformed anchors',()=>{
 const a=makeDesertBloom(opts);
 assert.throws(()=>validateDesertBloom({...a,breakIntent:{...a.breakIntent,targetKey:'forged'}}));
 assert.throws(()=>validateDesertBloom({...a,mesh:{...a.mesh,positions:[0]}}));
 assert.throws(()=>validateDesertBloom({...a,selectionAabbs:[]}));
 for(const change of [{seed:NaN},{anchor:[0,Infinity,0]},{variant:4},{variant:-1}])
  assert.throws(()=>makeDesertBloom({...opts,...change}));
});
