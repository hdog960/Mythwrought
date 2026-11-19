import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';

// An old schema-1 cell list contains only coordinates and numeric block IDs.
// No orientation, revision, epoch or new persistent ID may leak into it.
const oldWorld = [
  {cell:[-4,0,9],id:1},
  {cell:[-3,0,9],id:2},
  {cell:[-2,0,9],id:0}
];
const receipt = (x,id,revision,epoch,turn,nextId) => ({
  cell:[x,0,9],expectedId:id,expectedRevision:revision,
  expectedOrientationEpoch:epoch,expectedTurn:turn,nextId
});

test('legacy restore is orientation-free and an edit invalidates a rotated cell even for same-ID replacement',()=>{
  const host=createAtomicVoxelHost(structuredClone(oldWorld));
  assert.deepEqual(host.exportLegacyCells(),oldWorld);
  assert.equal(host.read([-4,0,9]).turn,null);
  assert.equal(host.setOrientation([-4,0,9],1,0,3,null),true);
  assert.equal(host.readOrientationEpoch([-4,0,9]),1);
  assert.equal(host.compareAndWriteMany([receipt(-4,1,0,1,3,1)]),true);
  assert.deepEqual(host.read([-4,0,9]),{id:1,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch([-4,0,9]),2);
  assert.deepEqual(host.exportLegacyCells(),oldWorld);
  const recovered=createAtomicVoxelHost(host.exportLegacyCells());
  assert.deepEqual(recovered.read([-4,0,9]),{id:1,revision:0,turn:null});
  assert.equal(recovered.readOrientationEpoch([-4,0,9]),0);
});

test('stale orientation cannot be resurrected after same-ID edit, including a mixed-cell atomic batch',()=>{
  const host=createAtomicVoxelHost(structuredClone(oldWorld));
  assert.equal(host.setOrientation([-4,0,9],1,0,2,null),true);
  assert.equal(host.setOrientation([-3,0,9],2,0,1,null),true);
  const stale=receipt(-4,1,0,1,2,1);
  assert.equal(host.externalWrite([-4,0,9],1),true);
  const other=receipt(-3,2,0,1,1,2);
  assert.equal(host.compareAndWriteMany([other,stale]),false);
  assert.equal(host.read([-3,0,9]).turn,1);
  assert.equal(host.read([-3,0,9]).revision,0);
  assert.equal(host.read([-4,0,9]).turn,null);
  assert.equal(host.readOrientationEpoch([-4,0,9]),2);
  assert.deepEqual(host.exportLegacyCells(),oldWorld);
});
