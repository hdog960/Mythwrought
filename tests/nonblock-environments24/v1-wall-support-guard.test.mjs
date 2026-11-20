import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {planEnvironmentV1Admission} from '../../src/nonblock-environments24/v1-admission-policy.mjs';
const d=()=>exportEnvironmentV1('stalagmite',{seed:313,anchor:[4,0,8],variant:0});
const env=(extra={})=>({isSolid:(x,y,z)=>y===-1,isEdited:()=>false,
 hasTombstone:()=>false,...extra});
test('wall-support interface is optional and cannot change existing ground admission',()=>{
 const o=d(),r=planEnvironmentV1Admission([o],env());
 assert.deepEqual(r.admittedKeys,[o.instanceKey]);
 assert.equal(r.spawnEnabled,false);
});
test('malformed wall-support provider fails closed before any candidate admission',()=>{
 assert.throws(()=>planEnvironmentV1Admission([d()],env({wallSupportCell:true})),/wall support provider/);
 assert.throws(()=>planEnvironmentV1Admission([d()],env({wallSupportCell:[]})),/wall support provider/);
});
test('wall-support callback is not invoked for a ground-mounted candidate',()=>{
 let calls=0;
 const r=planEnvironmentV1Admission([d()],env({wallSupportCell:()=>{calls++;throw Error('unexpected');}}));
 assert.equal(calls,0);
 assert.equal(r.admittedKeys.length,1);
});
test('unknown reservation state remains fail-closed with wall-support interface present',()=>{
 assert.throws(()=>planEnvironmentV1Admission([d()],env({
  wallSupportCell:()=>[5,0,8],isReserved:()=>Promise.resolve(false)
 })),/unknown environment state/);
});
