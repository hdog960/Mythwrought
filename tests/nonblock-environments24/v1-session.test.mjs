import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {createEnvironmentV1Session} from '../../src/nonblock-environments24/v1-session.mjs';
const seed=179;
const make=(family,anchor,variant=0)=>exportEnvironmentV1(family,{seed,anchor,variant});
const world={blockAt:(x,y,z)=>y===-1,editedAt:()=>false,occupiedAt:()=>false};
const session=(descriptors,extra={})=>createEnvironmentV1Session({seed,descriptors,...world,...extra});
test('v1 opt-in picking, break, sidecar reload and stable no-respawn',()=>{
 const a=make('stalagmite',[0,0,0]),b=make('crystal',[4,0,0]);
 const s=session([b,a]);
 assert.equal(s.visible().length,2);
 const hit=s.pick([0,1,4],[0,0,-1],6);
 assert.equal(hit?.instanceKey,a.instanceKey);
 assert.equal(s.breakByKey(hit.instanceKey),true);
 assert.equal(s.breakByKey(hit.instanceKey),false);
 assert.deepEqual(s.visible().map(x=>x.instanceKey),[b.instanceKey]);
 const saved=s.snapshot();
 assert.deepEqual(saved.tombstones,[a.instanceKey]);
 const reload=session([a,b],{snapshot:saved});
 assert.deepEqual(reload.visible().map(x=>x.instanceKey),[b.instanceKey]);
 assert.deepEqual(reload.snapshot(),saved);
});
test('v1 attachment fails closed for edited support, occupied footprint and missing support',()=>{
 const a=make('stalagmite',[0,0,0]);
 assert.equal(session([a],{editedAt:(x,y,z)=>y===-1}).visible().length,0);
 assert.equal(session([a],{occupiedAt:(x,y,z)=>y===0}).visible().length,0);
 assert.equal(session([a],{blockAt:()=>false}).visible().length,0);
});
test('v1 refuses forged identity, duplicate keys, cross-seed and foreign tombstones',()=>{
 const a=make('agave',[0,0,0]);
 assert.throws(()=>session([{...a,instanceKey:'fake'}]));
 assert.throws(()=>session([a,a]));
 assert.throws(()=>session([{...a,seed:1}]));
 assert.throws(()=>session([a],{snapshot:{contract:'nonblock-object-v1',seed,tombstones:['foreign']}}));
 assert.throws(()=>session([a],{snapshot:{contract:'nonblock-object-v1',seed,tombstones:[a.instanceKey,a.instanceKey]}}));
});
test('v1 overlap reservations independent of enumeration and tombstone reload',()=>{
 const a=make('stalagmite',[0,0,0]),b=make('crystal',[0,0,0]);
 const first=session([a,b]),second=session([b,a]);
 assert.deepEqual(first.visible().map(x=>x.instanceKey),second.visible().map(x=>x.instanceKey));
 assert.equal(first.visible().length,1);
 const winner=first.visible()[0].instanceKey;
 assert.equal(first.breakByKey(winner),true);
 assert.equal(first.visible().length,0);
 assert.equal(session([b,a],{snapshot:first.snapshot()}).visible().length,0);
});
test('v1 ceiling mount requires unedited overhead support',()=>{
 const a=make('icicle',[0,0,0]);
 const ceiling={blockAt:(x,y,z)=>y===1};
 assert.equal(session([a],ceiling).visible().length,1);
 assert.equal(session([a],{...ceiling,editedAt:(x,y,z)=>y===1}).visible().length,0);
});
