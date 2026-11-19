import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const initial=()=>[{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}];
const receipt=(x,epoch=0,turn=null)=>({cell:[x,0,0],expectedId:1,expectedRevision:0,expectedOrientationEpoch:epoch,expectedTurn:turn,nextId:2});
const gate=()=>{let release;const promise=new Promise(resolve=>{release=resolve;});return {promise,release};};

test('orientation-only ABA during preparation rejects both cells without partial commit',async()=>{
  const host=createAtomicVoxelHost(initial()),bridge=createAuthoritativeVoxelEditBridge(host),wait=gate();
  const pending=bridge.editMany([receipt(0),receipt(1)],()=>wait.promise);
  await Promise.resolve();
  assert.equal(host.setOrientation([1,0,0],1,0,2),true);
  assert.equal(host.setOrientation([1,0,0],1,0,0,2),true);
  wait.release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read([0,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).revision,0);
  assert.equal(host.readOrientationEpoch([1,0,0]),2);
});

test('fresh orientation epoch permits retry and clears orientation for entire committed batch',async()=>{
  const host=createAtomicVoxelHost(initial()),bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([1,0,0],1,0,3),true);
  assert.equal(await bridge.editMany([receipt(0),receipt(1,1,3)]),true);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
  assert.equal(host.read([1,0,0]).turn,null);
  assert.deepEqual([0,1].map(x=>host.readOrientationEpoch([x,0,0])),[1,2]);
});

test('old orientation-free cells restore without state and reject stale edit after external same-ID write',async()=>{
  const legacy=JSON.parse(JSON.stringify(initial()));
  const host=createAtomicVoxelHost(legacy),bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.read([0,0,0]).turn,null);
  assert.equal(host.readOrientationEpoch([0,0,0]),0);
  assert.equal(host.externalWrite([0,0,0],1),true);
  assert.equal(await bridge.editMany([receipt(0)]),false);
  assert.deepEqual(host.exportLegacyCells(),legacy);
  assert.equal(JSON.stringify(host.exportLegacyCells()).includes('orientationEpoch'),false);
});
