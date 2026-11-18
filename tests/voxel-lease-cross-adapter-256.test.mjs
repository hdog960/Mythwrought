import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';
import {VoxelCellLeaseConflictError} from '../src/voxel-cell-lease.mjs';

const cell = i => [i, -4, 9];
const receipt = (i, nextId=2) => ({
  cell: cell(i), expectedId: 1, expectedRevision: 0, nextId
});
const gate = () => {
  let release;
  const promise = new Promise(resolve => { release = resolve; });
  return {promise, release};
};

test('separate editors of the same recovered session share a 256-cell lease', async () => {
  const initial = Array.from({length:257}, (_,i) => ({cell:cell(i), id:1}));
  const session = recoverLegacyVoxelSession(initial);
  const first = createLeasedLegacyEditor(session);
  const second = createLeasedLegacyEditor(session);
  assert.equal(session.setOrientation(cell(255),1,0,3),true);
  assert.equal(session.setOrientation(cell(256),1,0,2),true);
  const hold = gate();
  const pending = first.editMany(Array.from({length:256}, (_,i) => receipt(i)), () => hold.promise);
  await assert.rejects(second.editMany([receipt(255,4)]), VoxelCellLeaseConflictError);
  // An unrelated cell can commit while the larger lease is pending.
  assert.equal(await second.editMany([receipt(256,4)]),true);
  assert.deepEqual(session.read(cell(256)),{id:4,revision:1});
  assert.equal(session.orientation(cell(256)),null);
  assert.deepEqual(session.read(cell(255)),{id:1,revision:0});
  assert.equal(session.orientation(cell(255)),3);
  hold.release();
  assert.equal(await pending,true);
  assert.deepEqual(session.read(cell(255)),{id:2,revision:1});
  assert.equal(session.orientation(cell(255)),null);
  // Releasing the 256-cell lease allows the next authoritative revision.
  assert.equal(await second.editMany([{...receipt(255,4),expectedId:2,expectedRevision:1}]),true);
  assert.deepEqual(session.read(cell(255)),{id:4,revision:2});
  assert.equal(session.exportLegacyCells().length,257);
  assert.deepEqual(session.exportLegacyCells()[256],{cell:cell(256),id:4});
  const restored = recoverLegacyVoxelSession(session.exportLegacyCells());
  assert.deepEqual(restored.read(cell(255)),{id:4,revision:0});
  assert.equal(restored.orientation(cell(255)),null);
});

test('a rejected overlapping lease never invokes the competing preparation callback', async () => {
  const session = recoverLegacyVoxelSession([{cell:cell(0),id:1}]);
  const a = createLeasedLegacyEditor(session);
  const b = createLeasedLegacyEditor(session);
  const hold = gate();
  const pending = a.editMany([receipt(0)], () => hold.promise);
  let called = 0;
  await assert.rejects(b.editMany([receipt(0)], () => {called++;}), VoxelCellLeaseConflictError);
  assert.equal(called,0);
  hold.release();
  assert.equal(await pending,true);
});
