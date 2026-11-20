import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {planEnvironmentV1Admission} from '../../src/nonblock-environments24/v1-admission-policy.mjs';
const object=()=>exportEnvironmentV1('stalagmite',{seed:101,anchor:[0,0,0],variant:0});
const world=(overrides={})=>({
 isSolid:(x,y,z)=>y===-1,
 isEdited:()=>false,
 hasTombstone:()=>false,
 ...overrides
});
test('read-only opt-in admission accepts a clear mounted object without spawning',()=>{
 const d=object(),r=planEnvironmentV1Admission([d],world());
 assert.deepEqual(r.admittedKeys,[d.instanceKey]);
 assert.equal(r.spawnEnabled,false);
 assert.equal(r.requiresOwner,':00');
});
test('removed, edited and unsupported mounts fail closed',()=>{
 const d=object();
 assert.equal(planEnvironmentV1Admission([d],world({hasTombstone:()=>true})).rejected[0].reason,'removed');
 assert.equal(planEnvironmentV1Admission([d],world({isEdited:()=>true})).rejected[0].reason,'edited');
 assert.equal(planEnvironmentV1Admission([d],world({isSolid:()=>false})).rejected[0].reason,'mount');
});
test('unknown environment states and absent providers cannot authorize placement',()=>{
 const d=object();
 assert.throws(()=>planEnvironmentV1Admission([d],{}),/providers/);
 assert.throws(()=>planEnvironmentV1Admission([d],world({isSolid:()=>undefined})),/unknown/);
 assert.throws(()=>planEnvironmentV1Admission([d],world({hasTombstone:()=>null})),/unknown/);
});
test('selection envelope occupied by terrain blocks admission',()=>{
 const d=object();
 const r=planEnvironmentV1Admission([d],world({isSolid:(x,y,z)=>y===-1||(x===0&&y===0&&z===0)}));
 assert.equal(r.admittedKeys.length,0);
 assert.equal(r.rejected[0].reason,'mount');
});
