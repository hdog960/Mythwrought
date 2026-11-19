import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';

// Regression: orientation can return to the same turn (ABA) without returning
// to the same orientation epoch. A stale edit must not be allowed to commit.
const cell = [7,-12,3];
const legacy = [{cell,id:1},{cell:[8,-12,3],id:2}];
const receipt = (orientationEpoch,turn) => ({
  cell,expectedId:1,expectedRevision:0,
  expectedOrientationEpoch:orientationEpoch,expectedTurn:turn,nextId:1
});

test('orientation ABA invalidates stale same-ID edit even when turn matches',()=>{
  const host=createAtomicVoxelHost(structuredClone(legacy));
  assert.equal(host.setOrientation(cell,1,0,1,null),true);
  const stale=receipt(1,1);
  assert.equal(host.setOrientation(cell,1,0,2,1),true);
  assert.equal(host.setOrientation(cell,1,0,1,2),true);
  assert.deepEqual(host.read(cell),{id:1,revision:0,turn:1});
  assert.equal(host.readOrientationEpoch(cell),3);
  assert.equal(host.compareAndWriteMany([stale]),false);
  assert.equal(host.read(cell).turn,1);
  assert.equal(host.compareAndWriteMany([receipt(3,1)]),true);
  assert.deepEqual(host.read(cell),{id:1,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch(cell),4);
  assert.deepEqual(host.exportLegacyCells(),legacy);
});

test('old-save round trip drops transient orientation and rejects stale receipts',()=>{
  const host=createAtomicVoxelHost(structuredClone(legacy));
  assert.equal(host.setOrientation(cell,1,0,3,null),true);
  const stale=receipt(1,3);
  assert.equal(host.externalWrite(cell,1),true);
  assert.equal(host.compareAndWriteMany([stale]),false);
  const saved=host.exportLegacyCells();
  const restored=createAtomicVoxelHost(saved);
  assert.deepEqual(saved,legacy);
  assert.deepEqual(restored.read(cell),{id:1,revision:0,turn:null});
  assert.equal(restored.readOrientationEpoch(cell),0);
  assert.equal(restored.compareAndWriteMany([stale]),false);
  assert.equal(restored.compareAndWriteMany([receipt(0,null)]),true);
  assert.deepEqual(restored.exportLegacyCells(),legacy);
});

test('mixed-cell batch rejects stale orientation ABA atomically',()=>{
  const host=createAtomicVoxelHost(structuredClone(legacy));
  assert.equal(host.setOrientation(cell,1,0,1,null),true);
  assert.equal(host.setOrientation(cell,1,0,2,1),true);
  assert.equal(host.setOrientation(cell,1,0,1,2),true);
  const second={cell:[8,-12,3],expectedId:2,expectedRevision:0,
    expectedOrientationEpoch:0,expectedTurn:null,nextId:1};
  assert.equal(host.compareAndWriteMany([second,receipt(1,1)]),false);
  assert.deepEqual(host.read([8,-12,3]),{id:2,revision:0,turn:null});
  assert.equal(host.read(cell).turn,1);
  assert.deepEqual(host.exportLegacyCells(),legacy);
});
