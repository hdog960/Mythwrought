import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

test('external writer invalidates orientation receipts without changing unrelated cells', async () => {
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([1,0,0],1,0,3),true);
  const epoch=host.readOrientationEpoch([1,0,0]);
  const receipts=[
    {cell:[0,0,0],expectedId:1,expectedRevision:0,nextId:2},
    {cell:[1,0,0],expectedId:1,expectedRevision:0,expectedTurn:3,expectedOrientationEpoch:epoch,nextId:2}
  ];
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany(receipts,()=>gate);
  await Promise.resolve();
  assert.equal(host.externalWrite([1,0,0],1),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.read([0,0,0]),{id:1,revision:0,turn:null});
  assert.deepEqual(host.read([1,0,0]),{id:1,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch([1,0,0]),epoch+1);
  assert.equal(await bridge.editMany([
    receipts[0],
    {...receipts[1],expectedRevision:1,expectedTurn:null,expectedOrientationEpoch:epoch+1}
  ]),true);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:[0,0,0],id:2},{cell:[1,0,0],id:2}
  ]);
  const recovered=createAtomicVoxelHost(JSON.parse(JSON.stringify(host.exportLegacyCells())));
  assert.deepEqual(recovered.read([1,0,0]),{id:2,revision:0,turn:null});
  assert.equal(recovered.readOrientationEpoch([1,0,0]),0);
});

test('duplicate cells and stale second receipt never partially write', async () => {
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const a={cell:[0,0,0],expectedId:1,expectedRevision:0,nextId:2};
  await assert.rejects(bridge.editMany([a,{...a}]),/Duplicate cell/);
  assert.equal(await bridge.editMany([a,{cell:[1,0,0],expectedId:1,expectedRevision:1,nextId:2}]),false);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:[0,0,0],id:1},{cell:[1,0,0],id:1}
  ]);
});
