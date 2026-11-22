import test from 'node:test';import assert from 'node:assert/strict';import {gitBlob,auditCrosslaneWitness} from '../../src/auto-integration-support/nonblock-crosslane-provenance.mjs';
const owners={scene48:'src/nonblock-scene48/',environments24:'src/nonblock-environments24/',fittings36:'src/nonblock-fittings36/'};
function fixture(){const producers={},treeWitnesses={};for(const [owner,prefix] of Object.entries(owners)){const path=prefix+'fixture.mjs',text='export const witness = 1;',blob=gitBlob(text),head='a'.repeat(40);producers[owner]={head,files:[{path,text,blob}]};treeWitnesses[owner]={head,independentlyVerified:true,files:[{path,blob}]};}return {producers,treeWitnesses,instances:[{owner:'fittings36',key:'nonblock:f:seed:anchor:r2',seed:9,anchor:[1,2,3],rotation:2,tombstoneKey:'nonblock:f:seed:anchor:r2',pickable:true,breakable:true,removable:true,selectionAabb:[0,0,0,1,1,1],collisionAabb:[0,0,0,1,1,1],triangles:12,lod:0,batchCount:1}],interaction:{pick(){},remove(){},snapshot(){},restore(){}}};}
test('well-formed declared fixture is never marked live',()=>{const r=auditCrosslaneWitness(fixture());assert.equal(r.ok,true);assert.equal(r.live,false);assert.equal(r.schema1Verified,false);});
const mutations=[
 ['unverified tree',x=>x.treeWitnesses.scene48.independentlyVerified=false,'tree-membership-unverified'],
 ['wrong head',x=>x.treeWitnesses.environments24.head='b'.repeat(40),'tree-membership-unverified'],
 ['wrong blob',x=>x.treeWitnesses.fittings36.files[0].blob='c'.repeat(40),'source-mismatch'],
 ['tampered source',x=>x.producers.scene48.files[0].text='tampered','source-mismatch'],
 ['wrong rotation',x=>x.instances[0].rotation=1,'rotation-not-preserved'],
 ['missing tombstone',x=>x.instances[0].tombstoneKey='wrong','not-removable'],
 ['unpickable',x=>x.instances[0].pickable=false,'not-removable'],
 ['invalid collision',x=>x.instances[0].collisionAabb=[0,0,0,0,1,1],'invalid-collisionAabb'],
 ['protected edit',x=>x.instances[0].protectedEdit=true,'protected-world-edit'],
 ['render budget',x=>x.instances[0].triangles=10001,'unbounded-render-budget'],
 ['default spawn',x=>x.instances[0].defaultSpawn=true,'not-removable'],
 ['missing real hook',x=>delete x.interaction.restore,'missing-hook'],
 ['numeric block ID',x=>x.instances[0].numericBlockId=185,'not-removable']
];
for(const [label,mutate,expected] of mutations)test(label,()=>{const x=fixture();mutate(x);const r=auditCrosslaneWitness(x);assert.equal(r.ok,false);assert.ok(r.errors.some(e=>e.includes(expected)),r.errors.join(','));assert.equal(r.live,false);});
test('duplicate object keys fail closed',()=>{const x=fixture();x.instances.push({...x.instances[0]});assert.ok(auditCrosslaneWitness(x).errors.includes('duplicate-or-invalid-key'));});
test('neighbor at same anchor must declare sharing',()=>{const x=fixture();x.instances.push({...x.instances[0],key:'nonblock:f:other:r2',tombstoneKey:'nonblock:f:other:r2'});assert.ok(auditCrosslaneWitness(x).errors.some(e=>e.includes('anchor-overlap')));});
