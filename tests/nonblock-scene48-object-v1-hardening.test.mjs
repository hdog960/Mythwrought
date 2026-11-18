import test from 'node:test';
import assert from 'node:assert/strict';
import {NONBLOCK_FAMILY_IDS,describeNonblockObject,nonblockInstanceKey,createNonblockSidecar,makeNonblockFixture,pickNonblockRay} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

test('family-salted deterministic variants match original producers and stable keys',()=>{
 const ids=NONBLOCK_FAMILY_IDS;
 assert.equal(ids.length,8);
 for(const id of ids){
  const a=describeNonblockObject({sceneId:id,seed:2718,anchor:[11,-14,7]});
  const b=describeNonblockObject({sceneId:id,seed:2718,anchor:[11,-14,7]});
  assert.equal(a.variant,b.variant);
  assert.equal(a.instanceKey,nonblockInstanceKey({sceneId:id,seed:2718,anchor:[11,-14,7],variant:a.variant}));
  assert.equal(a.render.triangleCount,a.render.mesh.materials.length);
  assert.ok(a.render.triangleCount>0);
 }
 const variants=new Set(ids.map(id=>describeNonblockObject({sceneId:id,seed:2718,anchor:[11,-14,7]}).variant));
 assert.ok(variants.size>1,'families must not all inherit the low-grass variant');
});
test('tombstones fail closed on foreign seed and malformed identities without losing prior removals',()=>{
 const {objects,sidecar}=makeNonblockFixture(17);
 sidecar.breakObject(objects[0]);
 const before=sidecar.snapshot();
 for(const tombstones of [
  ['nb1:scene48%3Alow-grass:18:0,0,0:0'],
  ['nb1:scene48%3Alow-grass:17:0,0,0:9'],
  ['nb1:scene48%3Alow-grass:17:0,0,0:0','garbage']
 ]) {
  assert.throws(()=>sidecar.restore({contract:before.contract,seed:17,tombstones}),TypeError);
  assert.deepEqual(sidecar.snapshot(),before);
 }
});
test('fixture pick break and reload remain opt-in and non-destructive',()=>{
 const {objects,sidecar}=makeNonblockFixture(17);
 const hit=pickNonblockRay(objects,[-2,.2,0],[1,0,0],6);
 assert.equal(hit.instanceKey,objects[0].instanceKey);
 sidecar.breakObject(objects[0]);
 const restored=createNonblockSidecar(17);
 restored.restore(JSON.parse(JSON.stringify(sidecar.snapshot())));
 assert.equal(restored.visible(objects).length,3);
 assert.equal(restored.has(hit.instanceKey),true);
});
