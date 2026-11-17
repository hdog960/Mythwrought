import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';

const setup = () => recoverLegacyVoxelSession([
  {cell:[0,0,0],id:7,turn:3}, {cell:[1,0,0],id:8,turn:2}
]);
const receipt = (cell,id,nextId,revision=0) =>
  ({cell,expectedId:id,expectedRevision:revision,nextId});

test('batch commits both edits and clears both orientations, including same-ID replacement', () => {
  const s=setup();
  s.setOrientation([0,0,0],7,0,1);
  s.setOrientation([1,0,0],8,0,3);
  assert.equal(s.editMany([receipt([0,0,0],7,7),receipt([1,0,0],8,6)]),true);
  assert.deepEqual(s.read([0,0,0]),{id:7,revision:1});
  assert.deepEqual(s.read([1,0,0]),{id:6,revision:1});
  assert.equal(s.orientation([0,0,0]),null);
  assert.equal(s.orientation([1,0,0]),null);
  assert.deepEqual(s.exportLegacyCells(),[
    {cell:[0,0,0],id:7},{cell:[1,0,0],id:6}
  ]);
});
test('stale second receipt aborts entire batch without clearing first orientation', () => {
  const s=setup();
  s.setOrientation([0,0,0],7,0,2);
  assert.equal(s.editMany([receipt([0,0,0],7,5),receipt([1,0,0],8,4,1)]),false);
  assert.deepEqual(s.read([0,0,0]),{id:7,revision:0});
  assert.deepEqual(s.read([1,0,0]),{id:8,revision:0});
  assert.equal(s.orientation([0,0,0]),2);
});
test('duplicate, malformed, missing and invalid receipts fail closed', () => {
  const s=setup();
  assert.throws(()=>s.editMany([]),/Invalid edit batch/);
  assert.throws(()=>s.editMany([receipt([0,0,0],7,2),receipt([0,0,0],7,3)]),/Duplicate/);
  assert.throws(()=>s.editMany([receipt([0,0,0],7,2),receipt([1,0,0],8,255)]),/Invalid edit receipt/);
  assert.throws(()=>s.editMany([receipt([0,0,0],7,2),receipt([1,0],8,4)]),/Invalid voxel cell/);
  assert.equal(s.editMany([receipt([0,0,0],7,2),receipt([9,0,0],8,4)]),false);
  assert.deepEqual(s.read([0,0,0]),{id:7,revision:0});
});
test('reloaded schema-1-style cells discard orientation and reset transaction epochs', () => {
  const s=setup();
  s.setOrientation([0,0,0],7,0,3);
  assert.equal(s.editMany([receipt([0,0,0],7,5),receipt([1,0,0],8,6)]),true);
  const loaded=recoverLegacyVoxelSession(s.exportLegacyCells());
  assert.equal(loaded.orientation([0,0,0]),null);
  assert.deepEqual(loaded.read([0,0,0]),{id:5,revision:0});
  assert.equal(loaded.editMany([receipt([0,0,0],5,7),receipt([1,0,0],6,8)]),true);
});
