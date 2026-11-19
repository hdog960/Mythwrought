import test from 'node:test';
import assert from 'node:assert/strict';
import {makeAlpineWildflower,validateAlpineWildflower,ALPINE_WILDFLOWER_SCENE_ID} from '../../src/nonblock-environments24/alpine-wildflower.mjs';
const opts={seed:179,anchor:[8,21,-4],variant:3};
test('alpine wildflower builds actual bounded multi-stem petal and leaf triangles',()=>{
 const o=makeAlpineWildflower(opts);
 assert.equal(o.sceneId,ALPINE_WILDFLOWER_SCENE_ID);
 assert.equal(o.mesh.triangleCount,93);
 assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
 assert.equal(o.mesh.positions.length,o.mesh.triangleCount*9);
 for(let i=0;i<o.mesh.positions.length;i+=3)for(let a=0;a<3;a++)
  assert.ok(o.mesh.positions[i+a]>=o.selectionAabbs[0].min[a]-1e-8&&o.mesh.positions[i+a]<=o.selectionAabbs[0].max[a]+1e-8);
 assert.equal(validateAlpineWildflower(o),true);
});
test('alpine wildflower identity is deterministic and variant-dependent',()=>{
 const a=makeAlpineWildflower(opts);assert.deepEqual(a,makeAlpineWildflower(opts));
 for(const change of [{seed:180},{anchor:[8,22,-4]},{variant:2}])
  assert.notEqual(makeAlpineWildflower({...opts,...change}).instanceKey,a.instanceKey);
});
test('alpine wildflower removal identity and collision are explicit and tamper-resistant',()=>{
 const o=makeAlpineWildflower(opts);
 assert.equal(o.breakIntent.targetKey,o.persistence.key);
 assert.equal(o.collisionIntent,'pass-through');
 assert.equal(o.spawn,'explicit-opt-in-only');
 assert.throws(()=>validateAlpineWildflower({...o,breakIntent:{...o.breakIntent,targetKey:'fake'}}));
 assert.throws(()=>validateAlpineWildflower({...o,mesh:{...o.mesh,positions:[0]}}));
 assert.throws(()=>validateAlpineWildflower({...o,selectionAabbs:[{min:[0,0,0],max:[1,1,1]}]}));
});
test('alpine wildflower fails closed on malformed seed, anchor and variant',()=>{
 for(const change of [{seed:NaN},{seed:1.2},{anchor:[0,0,Infinity]},{variant:-1},{variant:4}])
  assert.throws(()=>makeAlpineWildflower({...opts,...change}));
});
