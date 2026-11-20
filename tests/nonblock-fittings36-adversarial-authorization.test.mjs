// :36 opt-in guarded interaction adversarial tests. No production mutations.
import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {createFittingReplayFixture} from '../src/nonblock-fittings36/fixture-replay.mjs';
const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
const good=()=>({verified:true,playerEdited:false,mountSupported:true,occupied:false});
function fixture({inspectMount=good,authorizeRemoval=()=>true,maximumReach=5}={}){
 const object=describeFitting({sceneId:'scene36:signpost',seed:179,anchor:[12,0,15],mount:{below:true}});
 return createFittingReplayFixture({seed:179,objects:[object],inspectMount,authorizeRemoval,maximumReach});
}
test('async authorization is rejected, never interpreted as permission',()=>{
 const f=fixture({authorizeRemoval:async()=>true});
 const before=f.snapshot();
 assert.equal(f.breakPicked(ray),null);
 assert.deepEqual(f.snapshot(),before);
 assert.equal(f.visible().length,1);
});
test('mount edit during authorization prevents removal even after prior verification',()=>{
 let edited=false;
 const f=fixture({inspectMount:()=>({...good(),playerEdited:edited}),authorizeRemoval:()=>{edited=true;return true;}});
 assert.equal(f.breakPicked(ray),null);
 assert.equal(f.visible().length,1);
 assert.deepEqual(f.snapshot().tombstones,[]);
});
test('unverified, occupied and unsupported mounts fail closed',()=>{
 for(const witness of [{...good(),verified:false},{...good(),occupied:true},{...good(),mountSupported:false}]){
  assert.throws(()=>fixture({inspectMount:()=>witness}),{name:'RangeError',message:'mount unverified or edit-protected'});
 }
});
test('ray distance and occluder distance cannot be bypassed',()=>{
 const f=fixture({maximumReach:0.25});
 assert.equal(f.breakPicked(ray),null);
 assert.equal(f.visible().length,1);
 const g=fixture();
 assert.equal(g.breakPicked({...ray,blockedDistance:0}),null);
 assert.equal(g.breakPicked({...ray,maxDistance:0}),null);
 assert.deepEqual(g.snapshot().tombstones,[]);
});
