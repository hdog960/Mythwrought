import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {createFittingReplayFixture} from '../src/nonblock-fittings36/fixture-replay.mjs';
const witness=()=>({verified:true,playerEdited:false,mountSupported:true,occupied:false});
const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
const make=({authorizeRemoval=()=>true,inspectMount=witness}={})=>{
 const o=describeFitting({sceneId:'scene36:signpost',seed:179,anchor:[12,0,15],mount:{below:true}});
 return {o,fixture:createFittingReplayFixture({seed:179,objects:[o],inspectMount,authorizeRemoval})};
};
test('opt-in fixture captures actual visible disappearance and external tombstone restoration',()=>{
 const {o,fixture:f}=make();
 const before=f.frame('before');
 assert.deepEqual(before.visibleKeys,[o.instanceKey]);
 assert.equal(f.pick(ray)?.instanceKey,o.instanceKey);
 assert.equal(f.breakPicked(ray)?.instanceKey,o.instanceKey);
 const after=f.frame('after');
 assert.deepEqual(after.visibleKeys,[]);
 assert.deepEqual(after.tombstones,[o.instanceKey]);
 assert.equal(f.pick(ray),null);
 const sidecar=f.snapshot();
 const {fixture:reloaded}=make();
 reloaded.restore(sidecar);
 assert.deepEqual(reloaded.frame('reloaded').visibleKeys,[]);
 assert.deepEqual(reloaded.snapshot(),sidecar);
 assert.deepEqual(f.timeline().map(x=>x.label),['before','after']);
});
test('rejected authorization and edited mount never remove visible geometry',()=>{
 let edited=false;
 const {fixture:f}=make({authorizeRemoval:()=>false,inspectMount:()=>({...witness(),playerEdited:edited})});
 assert.equal(f.breakPicked(ray),null);
 edited=true;
 assert.equal(f.breakPicked(ray),null);
 assert.equal(f.frame('denied').visibleCount,1);
 assert.deepEqual(f.snapshot().tombstones,[]);
});
test('fixture rejects corrupt sidecars without mutating prior visibility',()=>{
 const {fixture:f}=make();
 const before=f.snapshot();
 assert.throws(()=>f.restore({...before,tombstones:['unknown']}),/invalid/);
 assert.deepEqual(f.snapshot(),before);
 assert.throws(()=>f.frame(''),/invalid frame/);
});
