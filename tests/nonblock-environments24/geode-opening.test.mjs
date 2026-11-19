import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGeodeOpening,validateGeodeOpening,GEODE_OPENING_SCENE_ID} from '../../src/nonblock-environments24/geode-opening.mjs';
test('geode opening variants have hollow polygon rim and inward teeth',()=>{
 for(let v=0;v<4;v++){
  const o=makeGeodeOpening({seed:179,anchor:[12,64,-8],variant:v});
  assert.equal(o.sceneId,GEODE_OPENING_SCENE_ID);
  assert.equal(o.mesh.triangleCount,(8+v*2)*6);
  assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
  assert.equal(o.selectionAabbs.length,8+v*2);
  assert.ok(o.mesh.positions.every(Number.isFinite));
  for(const b of o.selectionAabbs)assert.ok(b.min.every((n,i)=>n<=b.max[i]));
  assert.equal(validateGeodeOpening(o),true);
 }
});
test('geode requires wall support and stable removal tombstone identity',()=>{
 const a=makeGeodeOpening({seed:179,anchor:[12,64,-8],variant:2});
 assert.deepEqual(a,makeGeodeOpening({seed:179,anchor:[12,64,-8],variant:2}));
 assert.notEqual(a.instanceKey,makeGeodeOpening({seed:180,anchor:[12,64,-8],variant:2}).instanceKey);
 assert.equal(a.attachment.face,'wall');assert.equal(a.attachment.rejectEditedSupport,true);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);assert.equal(a.spawn,'explicit-opt-in-only');
});
test('geode fails closed on forged descriptors and unsafe anchors',()=>{
 assert.throws(()=>makeGeodeOpening({seed:1,anchor:[0,0,0],variant:4}));
 assert.throws(()=>makeGeodeOpening({seed:1,anchor:[0,.5,0]}));
 const a=makeGeodeOpening({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validateGeodeOpening({...a,instanceKey:'forged'}));
 assert.throws(()=>validateGeodeOpening({...a,mesh:{...a.mesh,positions:[...a.mesh.positions.slice(0,-1),99]}}));
 assert.throws(()=>validateGeodeOpening({...a,attachment:{...a.attachment,rejectEditedSupport:false}}));
});
