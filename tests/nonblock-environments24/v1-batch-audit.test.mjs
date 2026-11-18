import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {auditEnvironmentV1Batch} from '../../src/nonblock-environments24/v1-batch-audit.mjs';
const make=(family,anchor,variant=0)=>exportEnvironmentV1(family,{seed:179,anchor,variant});
test('stable admission is independent of input enumeration and never enables spawn',()=>{
 const a=make('stalagmite',[0,0,0]),b=make('agave',[0,0,0]),c=make('crystal',[100,0,100]);
 const x=auditEnvironmentV1Batch([a,b,c]),y=auditEnvironmentV1Batch([c,b,a]);
 assert.deepEqual(x,y);
 assert.equal(x.instanceCount,3);
 assert.equal(x.admittedKeys.length,2);
 assert.equal(x.rejectedOverlapKeys.length,1);
 assert.equal(x.spawnEnabled,false);
 assert.equal(x.requiresOwner,':00');
});
test('duplicate identities and tampered geometry fail closed',()=>{
 const a=make('icicle',[0,20,0]);
 assert.throws(()=>auditEnvironmentV1Batch([a,a]),/duplicate/);
 const b=make('stalactite',[4,20,0]);b.render.mesh.positions[0]+=1;
 assert.throws(()=>auditEnvironmentV1Batch([b]),/noncanonical|invalid|escapes/);
});
test('strict batch instance and triangle budgets fail before production placement',()=>{
 const a=make('agave',[0,0,0]),b=make('crystal',[100,0,100]);
 assert.throws(()=>auditEnvironmentV1Batch([a,b],{maxInstances:1}),/instance cap/);
 assert.throws(()=>auditEnvironmentV1Batch([a,b],{maxTriangles:1}),/triangle cap/);
 assert.throws(()=>auditEnvironmentV1Batch([a],{maxInstances:513}),/invalid bounded/);
});
