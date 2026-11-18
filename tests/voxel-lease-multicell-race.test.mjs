import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';

const cell = x => [x,0,0];
const receipt = (x, expectedId=1, expectedRevision=0, nextId=2) => ({
  cell:cell(x), expectedId, expectedRevision, nextId
});
function deferred() {
  let release;
  const promise = new Promise(resolve => {release=resolve;});
  return {promise,release};
}

test('external writer races one member of a leased batch: no partial commit, no lost orientation', async () => {
  const session=recoverLegacyVoxelSession([{cell:cell(0),id:1},{cell:cell(1),id:1}]);
  assert.equal(session.setOrientation(cell(0),1,0,1),true);
  assert.equal(session.setOrientation(cell(1),1,0,3),true);
  const editor=createLeasedLegacyEditor(session), barrier=deferred();
  const pending=editor.editMany([receipt(0),receipt(1)],()=>barrier.promise);
  // An uncooperative external writer is not protected by the opt-in lease.
  assert.equal(session.edit(cell(1),1,0,4),true);
  assert.equal(session.setOrientation(cell(1),4,1,2),true);
  barrier.release();
  assert.equal(await pending,false);
  assert.deepEqual(session.read(cell(0)),{id:1,revision:0});
  assert.deepEqual(session.read(cell(1)),{id:4,revision:1});
  assert.equal(session.orientation(cell(0)),1);
  assert.equal(session.orientation(cell(1)),2);
  assert.deepEqual(session.exportLegacyCells(),[
    {cell:cell(0),id:1},{cell:cell(1),id:4}
  ]);
  const restored=recoverLegacyVoxelSession(session.exportLegacyCells());
  assert.deepEqual(restored.exportLegacyCells(),session.exportLegacyCells());
  assert.equal(restored.orientation(cell(0)),null);
  assert.equal(restored.orientation(cell(1)),null);
  assert.equal(await editor.editMany([receipt(0),receipt(1,4,1,2)]),true);
  assert.equal(session.orientation(cell(0)),null);
  assert.equal(session.orientation(cell(1)),null);
});

test('stale multi-cell preflight suppresses preparation and does not invalidate orientation', async () => {
  const session=recoverLegacyVoxelSession([{cell:cell(0),id:1},{cell:cell(1),id:1}]);
  session.setOrientation(cell(0),1,0,2);
  const editor=createLeasedLegacyEditor(session);
  let invoked=0;
  assert.equal(await editor.editMany([receipt(0),receipt(1,1,9)],()=>{
    invoked++;
    throw Error('preparation must not execute');
  }),false);
  assert.equal(invoked,0);
  assert.equal(session.orientation(cell(0)),2);
  assert.deepEqual(session.exportLegacyCells(),[
    {cell:cell(0),id:1},{cell:cell(1),id:1}
  ]);
});
