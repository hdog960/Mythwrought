import test from 'node:test';
import assert from 'node:assert/strict';
import {NONBLOCK_OBJECT_VERSION,NONBLOCK_FAMILY_IDS,nonblockInstanceKey,describeNonblockObject,pickNonblockRay,createNonblockSidecar,makeNonblockFixture} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

test('all registered family descriptors have shaped mesh, stable identity, selection and break intent',()=>{
 assert.ok(NONBLOCK_FAMILY_IDS.length>=8,'original eight families must remain registered');
 assert.equal(new Set(NONBLOCK_FAMILY_IDS).size,NONBLOCK_FAMILY_IDS.length);
 for(const sceneId of NONBLOCK_FAMILY_IDS){
  const a=describeNonblockObject({sceneId,seed:17,anchor:[2,3,-9]});
  const b=describeNonblockObject({sceneId,seed:17,anchor:[2,3,-9]});
  assert.equal(a.contract,NONBLOCK_OBJECT_VERSION);
  assert.equal(a.instanceKey,b.instanceKey);
  assert.equal(a.sourceFingerprint,b.sourceFingerprint);
  assert.equal(a.breakIntent.targetKey,a.instanceKey);
  assert.equal(a.collisionIntent,'pass-through');
  assert.equal(a.render.instanced,true);
  assert.ok(a.render.triangleCount>0);
  assert.equal(a.render.mesh.positions.length,a.render.triangleCount*9);
  assert.equal(a.render.mesh.materials.length,a.render.triangleCount);
  assert.equal(a.selectionAabbs.length,1);
  assert.ok(a.selectionAabbs[0].max[1]>a.selectionAabbs[0].min[1]);
  assert.notEqual(a.instanceKey,nonblockInstanceKey({sceneId,seed:17,anchor:[3,3,-9],variant:a.variant}));
 }
});
test('ray picking targets nearest shaped volume and respects misses and reach',()=>{
 const {objects}=makeNonblockFixture(17);
 const hit=pickNonblockRay(objects,[-2,.2,0],[1,0,0],6);
 assert.equal(hit.instanceKey,objects[0].instanceKey);
 assert.equal(pickNonblockRay(objects,[-2,2,0],[1,0,0],6),null);
 assert.equal(pickNonblockRay(objects,[-2,.2,0],[1,0,0],1),null);
});
test('break hides selected object, persists sidecar, and leaves other objects untouched',()=>{
 const {objects,sidecar}=makeNonblockFixture(17);
 const hit=pickNonblockRay(objects,[-2,.2,0],[1,0,0],6);
 const target=objects.find(o=>o.instanceKey===hit.instanceKey);
 assert.deepEqual(sidecar.breakObject(target),{action:'remove-object',instanceKey:target.instanceKey,removed:true});
 assert.equal(sidecar.visible(objects).length,3);
 const snapshot=sidecar.snapshot();
 const restored=createNonblockSidecar(17);
 restored.restore(JSON.parse(JSON.stringify(snapshot)));
 assert.equal(restored.visible(objects).length,3);
 assert.equal(restored.has(target.instanceKey),true);
 assert.equal(objects.length,4);
});
test('reject malformed identity, cross-seed break and incompatible sidecar',()=>{
 assert.throws(()=>describeNonblockObject({sceneId:'biome130:001',seed:17,anchor:[0,0,0]}),RangeError);
 assert.throws(()=>nonblockInstanceKey({sceneId:'scene48:low-grass',seed:17,anchor:[0.5,0,0]}),TypeError);
 const {objects}=makeNonblockFixture(17);
 assert.throws(()=>createNonblockSidecar(18).breakObject(objects[0]),TypeError);
 assert.throws(()=>createNonblockSidecar(17).restore({contract:'schema-1',seed:17,tombstones:[]}),TypeError);
});
