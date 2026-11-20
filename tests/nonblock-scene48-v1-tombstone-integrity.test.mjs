// :48 opt-in v1 tombstone integrity regression. No production save writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockSidecar,describeNonblockObject,NONBLOCK_OBJECT_VERSION} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

test('v1 tombstone restore rejects corrupt batches atomically',()=>{
 const seed=701;
 const a=describeNonblockObject({sceneId:'scene48:low-grass',seed,anchor:[1,0,2]});
 const b=describeNonblockObject({sceneId:'scene48:short-fern',seed,anchor:[3,0,2]});
 const sidecar=createNonblockSidecar(seed);
 sidecar.breakObject(a);
 const before=sidecar.snapshot();
 const invalid=[
  {contract:NONBLOCK_OBJECT_VERSION,seed,tombstones:[b.instanceKey,b.instanceKey]},
  {contract:NONBLOCK_OBJECT_VERSION,seed,tombstones:[b.instanceKey,'nb1:scene48%3Alow-grass:702:1,0,2:0']},
  {contract:NONBLOCK_OBJECT_VERSION,seed,tombstones:[b.instanceKey,'invalid']},
  {contract:NONBLOCK_OBJECT_VERSION,seed:702,tombstones:[b.instanceKey]}
 ];
 for(const snapshot of invalid){
  assert.throws(()=>sidecar.restore(snapshot));
  assert.deepEqual(sidecar.snapshot(),before,'failed restore must not mutate valid removal state');
  assert.deepEqual(sidecar.visible([a,b]).map(o=>o.instanceKey),[b.instanceKey]);
 }
 const saved=structuredClone(before);
 const fresh=createNonblockSidecar(seed);
 fresh.restore(saved);
 assert.deepEqual(fresh.snapshot(),before);
 assert.deepEqual(fresh.visible([a,b]).map(o=>o.instanceKey),[b.instanceKey]);
});

test('v1 tombstones isolate worlds and preserve explicit no-respawn policy',()=>{
 const seed=711;
 const obj=describeNonblockObject({sceneId:'scene48:button-mushroom',seed,anchor:[5,0,9]});
 assert.equal(obj.persistence.defaultRespawn,'never-until-explicit-reset');
 assert.equal(obj.breakIntent.targetKey,obj.instanceKey);
 const sidecar=createNonblockSidecar(seed);
 sidecar.breakObject(obj);
 const persisted=sidecar.snapshot();
 assert.throws(()=>createNonblockSidecar(seed+1).restore(persisted));
 const reloaded=createNonblockSidecar(seed);
 reloaded.restore(persisted);
 assert.equal(reloaded.visible([obj]).length,0);
});
