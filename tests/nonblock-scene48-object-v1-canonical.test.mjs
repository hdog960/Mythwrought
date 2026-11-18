import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockSidecar,makeNonblockFixture,nonblockInstanceKey} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

test('tombstones reject foreign, unknown and noncanonical identities atomically',()=>{
 const {objects,sidecar}=makeNonblockFixture(17);
 sidecar.breakObject(objects[0]);
 const baseline=sidecar.snapshot();
 const valid=nonblockInstanceKey({sceneId:objects[1].sceneId,seed:17,anchor:objects[1].anchor,variant:objects[1].variant});
 for(const bad of [
  ['nb1:scene48%3Aunknown:17:2,0,0:0'],
  ['nb1:scene48%3Alow-grass:18:0,0,0:0'],
  [valid,valid],
  ['nb1:scene48%3Alow-grass:17:00,0,0:0'],
  ['nb1:%ZZ:17:0,0,0:0'],
 ]) {
  assert.throws(()=>sidecar.restore({contract:'nonblock-object-v1',seed:17,tombstones:bad}));
  assert.deepEqual(sidecar.snapshot(),baseline);
 }
});
test('break rejects forged identities and leaves existing removals intact',()=>{
 const {objects,sidecar}=makeNonblockFixture(17);
 sidecar.breakObject(objects[0]);
 const baseline=sidecar.snapshot();
 for(const forged of [
  {...objects[1],instanceKey:objects[0].instanceKey,breakIntent:{action:'remove-object',targetKey:objects[0].instanceKey}},
  {...objects[1],breakIntent:{action:'remove-object',targetKey:'not-a-key'}},
  {...objects[1],variant:(objects[1].variant+1)%4},
  {...objects[1],anchor:[100,0,0]},
 ]) {
  assert.throws(()=>sidecar.breakObject(forged));
  assert.deepEqual(sidecar.snapshot(),baseline);
 }
 assert.equal(sidecar.visible(objects).length,objects.length-1);
 const copy=createNonblockSidecar(17);
 copy.restore(baseline);
 assert.deepEqual(copy.snapshot(),baseline);
});
