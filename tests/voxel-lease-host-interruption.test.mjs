import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';

const gate = () => {
  let release;
  const promise = new Promise(resolve => { release = resolve; });
  return {promise, release};
};
const cell = i => [i, -8, 11];
const receipt = i => ({cell:cell(i),expectedId:1,expectedRevision:0,nextId:2});

test('nonparticipating writer invalidates whole leased transaction without clearing orientation', async () => {
  const session = recoverLegacyVoxelSession([0,1,2].map(i => ({cell:cell(i),id:1})));
  const editor = createLeasedLegacyEditor(session);
  for (let i=0;i<3;i++) assert.equal(session.setOrientation(cell(i),1,0,i),true);
  const hold = gate();
  const pending = editor.editMany([receipt(0),receipt(1)],()=>hold.promise);
  // Simulate an uncooperative host writer outside the cooperative lease.
  assert.equal(session.edit(cell(1),1,0,4),true);
  assert.equal(session.orientation(cell(1)),null);
  hold.release();
  assert.equal(await pending,false);
  assert.deepEqual(session.read(cell(0)),{id:1,revision:0});
  assert.equal(session.orientation(cell(0)),0);
  assert.deepEqual(session.read(cell(1)),{id:4,revision:1});
  assert.equal(session.orientation(cell(2)),2);
  const restored = recoverLegacyVoxelSession(session.exportLegacyCells());
  assert.deepEqual(restored.read(cell(1)),{id:4,revision:0});
  for (let i=0;i<3;i++) assert.equal(restored.orientation(cell(i)),null);
});

test('receipt mutation while preparation is suspended cannot redirect cell or next ID', async () => {
  const session = recoverLegacyVoxelSession([0,1].map(i=>({cell:cell(i),id:1})));
  const editor = createLeasedLegacyEditor(session);
  const input = receipt(0);
  const hold = gate();
  const pending = editor.editMany([input],()=>hold.promise);
  input.cell[0]=1;
  input.nextId=8;
  input.expectedId=9;
  hold.release();
  assert.equal(await pending,true);
  assert.deepEqual(session.read(cell(0)),{id:2,revision:1});
  assert.deepEqual(session.read(cell(1)),{id:1,revision:0});
});

test('aborted suspended edit never writes and releases its lease for retry', async () => {
  const session = recoverLegacyVoxelSession([{cell:cell(0),id:1}]);
  const editor = createLeasedLegacyEditor(session);
  const controller = new AbortController();
  const hold = gate();
  const pending = editor.editMany([receipt(0)],()=>hold.promise,controller.signal);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(session.read(cell(0)),{id:1,revision:0});
  assert.equal(await editor.editMany([receipt(0)]),true);
  hold.release();
});
