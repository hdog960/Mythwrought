import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cells=()=>[{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}];
const receipt=(cell,epoch,turn)=>({cell,expectedId:1,expectedRevision:0,
  expectedOrientationEpoch:epoch,expectedTurn:turn,nextId:2});

test('orientation ABA during async preparation rejects the entire multi-cell edit',async()=>{
  const host=createAtomicVoxelHost(cells());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([1,0,0],1,0,1),true);
  const beforeEpoch=host.readOrientationEpoch([1,0,0]);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([
    receipt([0,0,0],0,null),
    receipt([1,0,0],beforeEpoch,1)
  ],()=>gate);
  await Promise.resolve();
  assert.equal(host.setOrientation([1,0,0],1,0,2,1),true);
  assert.equal(host.setOrientation([1,0,0],1,0,1,2),true);
  assert.equal(host.read([1,0,0]).turn,1);
  assert.equal(host.read([1,0,0]).revision,0);
  assert.equal(host.readOrientationEpoch([1,0,0]),beforeEpoch+2);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),cells());
  assert.equal(host.read([0,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).revision,0);
  assert.equal(await bridge.editMany([
    receipt([0,0,0],0,null),
    receipt([1,0,0],beforeEpoch+2,1)
  ]),true);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:[0,0,0],id:2},{cell:[1,0,0],id:2}
  ]);
  assert.equal(host.read([1,0,0]).turn,null);
  assert.equal(host.readOrientationEpoch([1,0,0]),beforeEpoch+3);
});

test('legacy save projection cannot restore stale orientation epochs',async()=>{
  const host=createAtomicVoxelHost(cells());
  assert.equal(host.setOrientation([0,0,0],1,0,3),true);
  const legacy=JSON.parse(JSON.stringify(host.exportLegacyCells()));
  const restored=createAtomicVoxelHost(legacy);
  assert.deepEqual(restored.exportLegacyCells(),legacy);
  assert.equal(restored.read([0,0,0]).turn,null);
  assert.equal(restored.readOrientationEpoch([0,0,0]),0);
  const bridge=createAuthoritativeVoxelEditBridge(restored);
  assert.equal(await bridge.editMany([receipt([0,0,0],0,null)]),true);
  assert.equal(restored.read([0,0,0]).turn,null);
  assert.equal(restored.read([0,0,0]).revision,1);
});
