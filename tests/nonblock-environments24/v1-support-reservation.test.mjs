import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {planEnvironmentV1Admission} from '../../src/nonblock-environments24/v1-admission-policy.mjs';

const stalagmite=()=>exportEnvironmentV1('stalagmite',{seed:20261118,anchor:[0,0,0],variant:0});
const environment=(isReserved)=>({
 isSolid:(x,y,z)=>y===-1,
 isEdited:()=>false,
 hasTombstone:()=>false,
 isReserved
});
test('reserved solid support blocks placement even when selection cells are clear',()=>{
 const d=stalagmite();
 const result=planEnvironmentV1Admission([d],environment((x,y,z)=>x===0&&y===-1&&z===0));
 assert.deepEqual(result.admittedKeys,[]);
 assert.deepEqual(result.rejected,[{instanceKey:d.instanceKey,reason:'support-reserved'}]);
 assert.equal(result.spawnEnabled,false);
});
test('unreserved support permits admission without spawning or editing terrain',()=>{
 const d=stalagmite();
 let calls=0;
 const result=planEnvironmentV1Admission([d],environment((x,y,z)=>{
  calls++;return false;
 }));
 assert.deepEqual(result.admittedKeys,[d.instanceKey]);
 assert.ok(calls>0);
 assert.equal(result.status,'proposal-only');
 assert.equal(result.requiresOwner,':00');
});
test('unknown, asynchronous, or throwing support reservations fail closed',()=>{
 const d=stalagmite();
 for(const value of [undefined,null,1,Promise.resolve(false)]){
  assert.throws(()=>planEnvironmentV1Admission([d],environment(()=>value)),/unknown environment state/);
 }
 assert.throws(()=>planEnvironmentV1Admission([d],environment(()=>{throw Error('provider unavailable')})),/provider unavailable/);
});
test('support check cannot be bypassed by a forged descriptor or missing required state',()=>{
 const d=stalagmite();
 const forged={...d,attachment:{...d.attachment,face:'ceiling'}};
 assert.throws(()=>planEnvironmentV1Admission([forged],environment(()=>false)),/noncanonical/);
 assert.throws(()=>planEnvironmentV1Admission([d],{isSolid:()=>true,isEdited:()=>false}),/providers required/);
});
