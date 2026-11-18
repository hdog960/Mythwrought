import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cells=()=>[{cell:[0,0,0],id:1},{cell:[1,0,0],id:1},{cell:[2,0,0],id:1}];
const receipt=x=>({cell:[x,0,0],expectedId:1,expectedRevision:0,expectedOrientationEpoch:0,expectedTurn:null,nextId:2});
const deferred=()=>{let release;const promise=new Promise(resolve=>{release=resolve;});return {promise,release};};

test('nonparticipating same-ID writer during preparation invalidates the entire batch',async()=>{
  const host=createAtomicVoxelHost(cells()), bridge=createAuthoritativeVoxelEditBridge(host);
  const gate=deferred();
  const pending=bridge.editMany([receipt(0),receipt(1),receipt(2)],()=>gate.promise);
  await Promise.resolve();
  assert.equal(host.externalWrite([2,0,0],1),true);
  gate.release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),cells());
  assert.deepEqual([0,1,2].map(x=>host.read([x,0,0]).revision),[0,0,1]);
  assert.equal(host.readOrientationEpoch([2,0,0]),1);
});

test('prepared transaction uses immutable receipt snapshot despite caller mutations',async()=>{
  const host=createAtomicVoxelHost(cells()), bridge=createAuthoritativeVoxelEditBridge(host);
  const gate=deferred();
  const requests=[receipt(0),receipt(1)];
  const pending=bridge.editMany(requests,()=>gate.promise);
  await Promise.resolve();
  requests[0].cell[0]=2;
  requests[0].nextId=254;
  requests[1].expectedRevision=999;
  requests.push(receipt(2));
  gate.release();
  assert.equal(await pending,true);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:[0,0,0],id:2},{cell:[1,0,0],id:2},{cell:[2,0,0],id:1}
  ]);
});

test('abort after async preparation prevents all writes and orientation changes',async()=>{
  const host=createAtomicVoxelHost(cells()), bridge=createAuthoritativeVoxelEditBridge(host);
  const controller=new AbortController(), gate=deferred();
  const pending=bridge.editMany([receipt(0),receipt(1)],()=>gate.promise,controller.signal);
  await Promise.resolve();
  controller.abort();
  gate.release();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(host.exportLegacyCells(),cells());
  assert.deepEqual([0,1].map(x=>host.readOrientationEpoch([x,0,0])),[0,0]);
});

test('legacy schema-1 projection remains orientation-free after successful edit',async()=>{
  const host=createAtomicVoxelHost(cells()), bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(await bridge.editMany([receipt(0)]),true);
  assert.equal(host.setOrientation([0,0,0],2,1,3),true);
  assert.deepEqual(host.exportLegacyCells()[0],{cell:[0,0,0],id:2});
  assert.equal(JSON.stringify(host.exportLegacyCells()).includes('turn'),false);
  assert.equal(JSON.stringify(host.exportLegacyCells()).includes('orientationEpoch'),false);
});
