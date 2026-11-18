import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

test('orientation ABA cannot authorize a stale atomic edit', async () => {
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const p=[1,0,0];
  assert.equal(host.setOrientation(p,1,0,1,null),true);
  const epoch=host.readOrientationEpoch(p);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const receipts=[
    {cell:[0,0,0],expectedId:1,expectedRevision:0,nextId:2},
    {cell:p,expectedId:1,expectedRevision:0,expectedTurn:1,expectedOrientationEpoch:epoch,nextId:2}
  ];
  const pending=bridge.editMany(receipts,()=>gate);
  await Promise.resolve();
  assert.equal(host.setOrientation(p,1,0,2,1),true);
  assert.equal(host.setOrientation(p,1,0,1,2),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.read([0,0,0]),{id:1,revision:0,turn:null});
  assert.equal(host.readOrientationEpoch(p),epoch+2);
  assert.equal(await bridge.editMany([{...receipts[0]},{...receipts[1],expectedOrientationEpoch:epoch+2}]),true);
  assert.deepEqual(host.read(p),{id:2,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch(p),epoch+3);
  const legacy=JSON.parse(JSON.stringify(host.exportLegacyCells()));
  assert.deepEqual(legacy,[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
  const recovered=createAtomicVoxelHost(legacy);
  assert.equal(recovered.readOrientationEpoch(p),0);
  assert.deepEqual(recovered.read(p),{id:2,revision:0,turn:null});
});

test('invalid epoch and absent epoch accessor fail closed without writes', async () => {
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const r={cell:[0,0,0],expectedId:1,expectedRevision:0,nextId:2};
  await assert.rejects(bridge.editMany([{...r,expectedOrientationEpoch:-1}]),/Invalid receipt/);
  assert.equal(await bridge.editMany([{...r,expectedOrientationEpoch:1}]),false);
  const legacyBridge=createAuthoritativeVoxelEditBridge({read:host.read,compareAndWriteMany:host.compareAndWriteMany});
  assert.equal(await legacyBridge.editMany([{...r,expectedOrientationEpoch:0}]),false);
  assert.deepEqual(host.read([0,0,0]),{id:1,revision:0,turn:null});
});
