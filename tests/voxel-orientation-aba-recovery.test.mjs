import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

test('orientation ABA during asynchronous preparation rejects an otherwise identical batch', async () => {
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([1,0,0],1,0,1),true);
  const oldEpoch=host.readOrientationEpoch([1,0,0]);
  const batch=[
    {cell:[0,0,0],expectedId:1,expectedRevision:0,nextId:2},
    {cell:[1,0,0],expectedId:1,expectedRevision:0,expectedTurn:1,expectedOrientationEpoch:oldEpoch,nextId:2}
  ];
  let release;
  const wait=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany(batch,()=>wait);
  await Promise.resolve();
  assert.equal(host.setOrientation([1,0,0],1,0,2,1),true);
  assert.equal(host.setOrientation([1,0,0],1,0,1,2),true);
  assert.equal(host.read([1,0,0]).turn,1);
  assert.equal(host.read([1,0,0]).revision,0);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}]);
  assert.equal(host.readOrientationEpoch([1,0,0]),oldEpoch+2);
  assert.equal(await bridge.editMany([
    batch[0],{...batch[1],expectedOrientationEpoch:oldEpoch+2}
  ]),true);
  assert.equal(host.read([1,0,0]).turn,null);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
});

test('legacy recovery drops transient orientation epochs and never persists new fields', () => {
  const original=[{cell:[-2,3,4],id:7}];
  const host=createAtomicVoxelHost(original);
  assert.equal(host.setOrientation([-2,3,4],7,0,3),true);
  assert.equal(host.externalWrite([-2,3,4],7),true);
  const serialized=JSON.stringify(host.exportLegacyCells());
  assert.equal(serialized,JSON.stringify(original));
  const restored=createAtomicVoxelHost(JSON.parse(serialized));
  assert.deepEqual(restored.read([-2,3,4]),{id:7,revision:0,turn:null});
  assert.equal(restored.readOrientationEpoch([-2,3,4]),0);
});
