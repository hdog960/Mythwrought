import test from 'node:test';
import assert from 'node:assert/strict';
import {breakVisibleEnvironment} from '../../src/nonblock-environments24/guarded-break.mjs';
const ray={origin:[0.5,0.5,0.5],direction:[1,0,0],maxDistance:5};
test('occluded hit never invokes removal',()=>{
 let calls=0;
 const session={pick:()=>({instanceKey:'nonblock:e:test',distance:3}),
  breakByKey:()=>{calls++;return true},snapshot:()=>({tombstones:[]})};
 const result=breakVisibleEnvironment(session,{...ray,blockAt:(x)=>x===2,editedAt:()=>false});
 assert.equal(result.removed,false);assert.equal(calls,0);
});
test('unobstructed hit invokes one removal and returns tombstone witness',()=>{
 let calls=0;
 const session={pick:()=>({instanceKey:'nonblock:e:test',distance:3}),
  breakByKey:()=>{calls++;return true},snapshot:()=>({tombstones:['nonblock:e:test']})};
 const result=breakVisibleEnvironment(session,{...ray,blockAt:()=>false,editedAt:()=>false});
 assert.equal(result.removed,true);assert.equal(calls,1);
 assert.deepEqual(result.tombstones,['nonblock:e:test']);
});
test('edited voxels block removal',()=>{
 let calls=0;
 const session={pick:()=>({instanceKey:'nonblock:e:test',distance:3}),
  breakByKey:()=>{calls++;return true},snapshot:()=>({tombstones:[]})};
 assert.equal(breakVisibleEnvironment(session,{...ray,blockAt:()=>false,editedAt:(x)=>x===1}).removed,false);
 assert.equal(calls,0);
});
test('malformed hit identity fails closed',()=>{
 const session={pick:()=>({instanceKey:'forged',distance:1}),
  breakByKey:()=>{throw Error('must not remove')},snapshot:()=>({tombstones:[]})};
 assert.throws(()=>breakVisibleEnvironment(session,{...ray,blockAt:()=>false,editedAt:()=>false}),TypeError);
});
