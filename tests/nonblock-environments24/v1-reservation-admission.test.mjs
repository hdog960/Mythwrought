import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {planEnvironmentV1Admission} from '../../src/nonblock-environments24/v1-admission-policy.mjs';

const descriptor=()=>exportEnvironmentV1('stalagmite',{seed:179,anchor:[0,0,0],variant:0});
const environment=(isReserved)=>({
 isSolid:(x,y,z)=>y===-1,
 isEdited:()=>false,
 hasTombstone:()=>false,
 ...(isReserved===undefined?{}:{isReserved})
});
test('clear optional read-only reservation provider admits a source-modeled candidate',()=>{
 const d=descriptor(),r=planEnvironmentV1Admission([d],environment(()=>false));
 assert.deepEqual(r.admittedKeys,[d.instanceKey]);
 assert.equal(r.spawnEnabled,false);
});
test('existing object reservations block admission without touching the world',()=>{
 const d=descriptor();let calls=0;
 const r=planEnvironmentV1Admission([d],environment((x,y,z)=>{calls++;return x===0&&y===0&&z===0;}));
 assert.ok(calls>0);
 assert.deepEqual(r.admittedKeys,[]);
 assert.equal(r.rejected[0].reason,'occupied');
});
test('unknown or malformed reservation providers fail closed',()=>{
 const d=descriptor();
 assert.throws(()=>planEnvironmentV1Admission([d],environment(null)),/reservation provider/);
 assert.throws(()=>planEnvironmentV1Admission([d],environment(()=>undefined)),/unknown environment state/);
 assert.throws(()=>planEnvironmentV1Admission([d],environment(()=>Promise.resolve(false))),/unknown environment state/);
});
test('provider order and identity remain deterministic for unchanged inputs',()=>{
 const d=descriptor(),a=planEnvironmentV1Admission([d],environment(()=>false));
 const b=planEnvironmentV1Admission([d],environment(()=>false));
 assert.deepEqual(a,b);
 assert.equal(a.status,'proposal-only');
});
