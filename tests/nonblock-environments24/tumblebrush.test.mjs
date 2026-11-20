import test from 'node:test';
import assert from 'node:assert/strict';
import {makeTumblebrush,validateTumblebrush} from '../../src/nonblock-environments24/tumblebrush.mjs';
test('tumblebrush four deterministic mesh variants stay within caps and pick bounds',()=>{
 for(let variant=0;variant<4;variant++){
  const x=makeTumblebrush({seed:179,anchor:[3,8,-5],variant});
  assert.deepEqual(x,makeTumblebrush({seed:179,anchor:[3,8,-5],variant}));
  assert.equal(x.mesh.triangleCount,(7+variant)*4);
  assert.equal(x.mesh.positions.length,x.mesh.triangleCount*9);
  assert.equal(x.selectionAabbs.length,7+variant);
  assert.ok(x.mesh.positions.every(Number.isFinite));
  for(let i=0;i<x.mesh.positions.length;i+=3){
   const point=x.mesh.positions.slice(i,i+3);
   assert.ok(x.selectionAabbs.some(b=>point.every((v,k)=>v>=b.min[k]-1e-9&&v<=b.max[k]+1e-9)));
  }
  assert.equal(validateTumblebrush(x),true);
 }
});
test('tumblebrush identity, attachment and tombstone remain guarded opt-in',()=>{
 const a=makeTumblebrush({seed:179,anchor:[3,8,-5]});
 assert.notEqual(a.instanceKey,makeTumblebrush({seed:180,anchor:[3,8,-5]}).instanceKey);
 assert.equal(a.attachment.face,'ground');
 assert.equal(a.attachment.requiresClear,true);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.breakIntent.requiresOwner,':00');
 assert.equal(a.persistence.key,a.instanceKey);
 assert.equal(a.integrationStatus,'source-candidate-only');
});
test('tumblebrush rejects forged descriptors and invalid identity',()=>{
 const x=makeTumblebrush({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validateTumblebrush({...x,breakIntent:{...x.breakIntent,requiresOwner:'fixture'}}));
 assert.throws(()=>makeTumblebrush({seed:1.5,anchor:[0,0,0]}));
 assert.throws(()=>makeTumblebrush({seed:1,anchor:[0,0,0],variant:4}));
 assert.throws(()=>makeTumblebrush({seed:1,anchor:[0,Infinity,0]}));
});
