import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';

// An external host writer need not participate in the cooperative cell lease.
// The revision check must fail closed, and a caller may retry with fresh receipts.
test('external host write invalidates pending batch; refreshed retry clears only edited orientations', async () => {
  const cells = [[-3, 0, 7], [-2, 0, 7], [-1, 0, 7]];
  const session = recoverLegacyVoxelSession(cells.map(cell => ({cell,id:1})));
  const editor = createLeasedLegacyEditor(session);
  cells.forEach((cell,i) => assert.equal(session.setOrientation(cell,1,0,i),true));
  let release;
  const held = new Promise(resolve => {release = resolve;});
  const stale = editor.editMany(cells.slice(0,2).map(cell=>({
    cell,expectedId:1,expectedRevision:0,nextId:2
  })),()=>held);
  assert.equal(session.edit(cells[1],1,0,3),true);
  release();
  assert.equal(await stale,false);
  assert.deepEqual(session.read(cells[0]),{id:1,revision:0});
  assert.equal(session.orientation(cells[0]),0);
  assert.deepEqual(session.read(cells[1]),{id:3,revision:1});
  assert.equal(session.orientation(cells[1]),null);
  assert.equal(session.orientation(cells[2]),2);

  assert.equal(await editor.editMany([
    {cell:cells[0],expectedId:1,expectedRevision:0,nextId:2},
    {cell:cells[1],expectedId:3,expectedRevision:1,nextId:2}
  ]),true);
  assert.deepEqual(session.read(cells[0]),{id:2,revision:1});
  assert.deepEqual(session.read(cells[1]),{id:2,revision:2});
  assert.equal(session.orientation(cells[0]),null);
  assert.equal(session.orientation(cells[1]),null);
  assert.equal(session.orientation(cells[2]),2);
  const oldSave = session.exportLegacyCells();
  const recovered = recoverLegacyVoxelSession(oldSave);
  cells.forEach((cell,i) => {
    assert.equal(recovered.read(cell).id,i===2?1:2);
    assert.equal(recovered.orientation(cell),null);
  });
});
