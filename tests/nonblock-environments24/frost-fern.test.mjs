import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFrostFern,validateFrostFern,FROST_FERN_SCENE_ID} from '../../src/nonblock-environments24/frost-fern.mjs';
const opts={seed:179,anchor:[8,21,-4],variant:3};
test('frost fern creates bounded original serrated fronds',()=>{
 const o=makeFrostFern(opts);
 assert.equal(o.sceneId,FROST_FERN_SCENE_ID);
 assert.equal(o.mesh.triangleCount,72);
 assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
 assert.equal(o.mesh.positions.length,o.mesh.triangleCount*9);
 for(let i=0;i<o.mesh.positions.length;i+=3)for(let a=0;a<3;a++)
  assert.ok(o.mesh.positions[i+a]>=o.selectionAabbs[0].min[a]-1e-8&&o.mesh.positions[i+a]<=o.selectionAabbs[0].max[a]+1e-8);
 assert.equal(validateFrostFern(o),true);
});
test('frost fern has stable instance key and variant geometry',()=>{
 const a=makeFrostFern(opts);assert.deepEqual(a,makeFrostFern(opts));
 for(const change of [{seed:180},{anchor:[8,22,-4]},{variant:2}])
  assert.notEqual(makeFrostFern({...opts,...change}).instanceKey,a.instanceKey);
});
test('frost fern guards removal identity and source geometry',()=>{
 const o=makeFrostFern(opts);
 assert.equal(o.breakIntent.targetKey,o.persistence.key);
 assert.equal(o.spawn,'explicit-opt-in-only');
 assert.equal(o.collisionIntent,'pass-through');
 assert.throws(()=>validateFrostFern({...o,breakIntent:{...o.breakIntent,targetKey:'fake'}}));
 assert.throws(()=>validateFrostFern({...o,mesh:{...o.mesh,positions:[0]}}));
 assert.throws(()=>validateFrostFern({...o,selectionAabbs:[{min:[0,0,0],max:[1,1,1]}]}));
});
test('frost fern fails closed for invalid seeds, anchors and variants',()=>{
 for(const change of [{seed:NaN},{seed:1.2},{anchor:[0,0,Infinity]},{variant:-1},{variant:4}])
  assert.throws(()=>makeFrostFern({...opts,...change}));
});
