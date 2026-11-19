import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockHostBridge,PRODUCER_SOURCES,HOST_BRIDGE_VERSION} from '../src/voxel-nonblock-host-bridge.mjs';
const seed=179;
const a=[0,0,0];
const b={min:[-.25,0,-.25],max:[.25,1,.25]};
const flora={contract:'nonblock-object-v1',sceneId:'scene48:low-grass',seed,anchor:a,variant:0,
 instanceKey:'nb1:scene48%3Alow-grass:179:0,0,0:0',selectionAabbs:[b],
 breakIntent:{action:'remove-object',targetKey:'nb1:scene48%3Alow-grass:179:0,0,0:0'}};
const environment={contract:'nonblock-object-v1-proposal-24',sceneId:'nonblock:e:crystal-shard',
 seed,anchor:{x:2,y:0,z:0},variant:7,instanceKey:'179:2:0:0:nonblock:e:crystal-shard:7',
 selection:[b],removal:{action:'break',tombstoneKey:'nonblock:179:2:0:0:nonblock:e:crystal-shard:7'}};
const fitting={contract:'nonblock-object-v1',sceneId:'scene36:signpost',seed,anchor:[4,0,0],variant:1,orientation:3,
 instanceKey:'nb1:scene36%3Asignpost:179:4,0,0:1:r3',selectionAabbs:[{min:[3.75,0,-.25],max:[4.25,1,.25]}],
 breakIntent:{action:'remove-object',targetKey:'nb1:scene36%3Asignpost:179:4,0,0:1:r3'}};
const entries=[{lane:'48',descriptor:flora},{lane:'24',descriptor:environment},{lane:'36',descriptor:fitting}];
function fixture({voxelPick=()=>null,eligible=()=>true,readFail=false,writeFail=false}={}){
 let saved={version:HOST_BRIDGE_VERSION,seed,tombstones:[]};
 const create=()=>createNonblockHostBridge({seed,objects:entries,attest:PRODUCER_SOURCES,voxelPick,eligible,
  readSidecar:()=>readFail?{...saved,tombstones:[]}:structuredClone(saved),
  writeSidecar:s=>{if(!writeFail)saved=structuredClone(s);}});
 return {create,getSaved:()=>saved};
}
const ray=(x)=>[[x,0.5,-2],[0,0,1]];
test('source-exact admission rejects stale coordinator and rotated-key aliases',()=>{
 const f=fixture();assert.equal(f.create().visible().length,3);
 assert.throws(()=>createNonblockHostBridge({seed,objects:entries,attest:{...PRODUCER_SOURCES,36:'old'},voxelPick:()=>null,eligible:()=>true,readSidecar:()=>({version:HOST_BRIDGE_VERSION,seed,tombstones:[]}),writeSidecar:()=>{}}),/unauthenticated/);
 assert.throws(()=>createNonblockHostBridge({seed,objects:[{lane:'36',descriptor:{...fitting,instanceKey:fitting.instanceKey.replace(':r3',':r0')}}],attest:PRODUCER_SOURCES,voxelPick:()=>null,eligible:()=>true,readSidecar:()=>({version:HOST_BRIDGE_VERSION,seed,tombstones:[]}),writeSidecar:()=>{}}),/unauthenticated/);
});
test('each producer pick break reload, preserving neighbor and old voxel hit',()=>{
 const f=fixture();
 let host=f.create();
 for(const [x,key] of [[0,flora.instanceKey],[2,environment.instanceKey],[4,fitting.instanceKey]]){
  const hit=host.pick(...ray(x));assert.equal(hit.instanceKey,key);
  assert.equal(host.breakHit(hit,...ray(x)),true);
  assert.equal(host.breakHit(hit,...ray(x)),false);
  host=f.create();assert.equal(host.pick(...ray(x)),null);
 }
 assert.equal(f.getSaved().tombstones.length,3);
 const protectedHost=fixture({voxelPick:()=>({distance:0.5,cell:[0,0,0]})}).create();
 assert.equal(protectedHost.pick(...ray(0)).kind,'voxel');
});
test('readback mismatch and write failure do not hide object',()=>{
 for(const options of [{readFail:true},{writeFail:true}]){
  const f=fixture(options),host=f.create(),hit=host.pick(...ray(0));
  assert.equal(host.breakHit(hit,...ray(0)),false);
  assert.equal(host.visible().length,3);
 }
});
test('foreign seed, orphan and duplicate sidecars fail closed',()=>{
 for(const tombstones of [[flora.instanceKey,flora.instanceKey],['other']]){
  assert.throws(()=>createNonblockHostBridge({seed,objects:entries,attest:PRODUCER_SOURCES,voxelPick:()=>null,eligible:()=>true,
    readSidecar:()=>({version:HOST_BRIDGE_VERSION,seed,tombstones}),writeSidecar:()=>{}}),/tombstone/);
 }
});

test('only genuine current-host pick receipts authorize removal; clones and foreign hosts fail',()=>{
 const f=fixture(),first=f.create(),second=f.create();
 const genuine=first.pick(...ray(0));
 assert.equal(genuine.kind,'nonblock');
 for(const forged of [
   {...genuine},
   structuredClone(genuine),
   Object.freeze({...genuine}),
   {...genuine,instanceKey:environment.instanceKey},
   {...genuine,epoch:genuine.epoch+1},
 ]) {
   assert.equal(first.breakHit(forged,...ray(0)),false);
 }
 assert.equal(second.breakHit(genuine,...ray(0)),false);
 assert.equal(first.visible().length,3);
 assert.equal(first.breakHit(genuine,...ray(0)),true);
 assert.equal(first.breakHit(genuine,...ray(0)),false);
 assert.equal(f.create().pick(...ray(0)),null);
});
test('receipt from prior pick cannot remove a different rotated neighbor',()=>{
 const f=fixture(),host=f.create();
 const a=host.pick(...ray(0));
 const c=host.pick(...ray(4));
 assert.equal(host.breakHit(a,...ray(4)),false);
 assert.equal(host.breakHit({...c,instanceKey:a.instanceKey},...ray(4)),false);
 assert.equal(host.visible().length,3);
 assert.equal(host.breakHit(c,...ray(4)),true);
 assert.equal(host.pick(...ray(0)).instanceKey,flora.instanceKey);
});

test('failed readback rolls back durable tombstone without hiding the object on reload',()=>{
 let disk={version:HOST_BRIDGE_VERSION,seed,tombstones:[]},reads=0;
 const deps={seed,objects:entries,attest:PRODUCER_SOURCES,voxelPick:()=>null,eligible:()=>true,
   readSidecar:()=>{reads++;return reads===2?{...disk,tombstones:[]}:structuredClone(disk);},
   writeSidecar:value=>{disk=structuredClone(value);}};
 const host=createNonblockHostBridge(deps),hit=host.pick(...ray(0));
 assert.equal(host.breakHit(hit,...ray(0)),false);
 assert.deepEqual(disk.tombstones,[]);
 assert.equal(host.visible().length,3);
 assert.equal(createNonblockHostBridge(deps).pick(...ray(0)).instanceKey,flora.instanceKey);
});

test('unrecoverable storage mismatch disables all later picks and breaks on the same host',()=>{
 let disk={version:HOST_BRIDGE_VERSION,seed,tombstones:[]},reads=0,writes=0;
 const host=createNonblockHostBridge({seed,objects:entries,attest:PRODUCER_SOURCES,
  voxelPick:()=>null,eligible:()=>true,
  readSidecar:()=>{reads++;return reads===1?structuredClone(disk):{...disk,tombstones:[]};},
  writeSidecar:value=>{writes++;if(writes===1)disk=structuredClone(value);}});
 const hit=host.pick(...ray(0));
 assert.equal(host.breakHit(hit,...ray(0)),false);
 assert.equal(writes,2);
 assert.equal(host.breakHit(hit,...ray(0)),false);
 assert.throws(()=>host.pick(...ray(0)),/recovery required/);
 // A fresh host must independently validate the durable sidecar; no automatic
 // repair of a possibly committed tombstone or legacy schema-1 payload.
 assert.deepEqual(disk.tombstones,[flora.instanceKey]);
});
