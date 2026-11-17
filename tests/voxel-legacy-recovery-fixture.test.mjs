import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';

test('schema-1-style recovery drops stale yaw and retains original cells', () => {
  const legacy=[{cell:[-2,3,4],id:7,turn:3,revision:99},{cell:[0,0,0],id:8,orientation:2}];
  const session=recoverLegacyVoxelSession(legacy);
  assert.equal(session.orientation([-2,3,4]),null);
  assert.equal(session.orientation([0,0,0]),null);
  assert.deepEqual(session.exportLegacyCells(),[{cell:[-2,3,4],id:7},{cell:[0,0,0],id:8}]);
  assert.equal(legacy[0].turn,3);
});
test('same-ID replacement invalidates yaw and rejects stale epoch', () => {
  const s=recoverLegacyVoxelSession([{cell:[1,2,3],id:7}]);
  assert.equal(s.setOrientation([1,2,3],7,0,3),true);
  assert.equal(s.orientation([1,2,3]),3);
  assert.equal(s.edit([1,2,3],7,0,7),true);
  assert.equal(s.orientation([1,2,3]),null);
  assert.equal(s.setOrientation([1,2,3],7,0,2),false);
  assert.equal(s.edit([1,2,3],7,0,6),false);
  assert.deepEqual(s.read([1,2,3]),{id:7,revision:1});
});
test('failed edits preserve current yaw and do not touch neighboring cells', () => {
  const s=recoverLegacyVoxelSession([{cell:[0,0,0],id:3},{cell:[0,0,1],id:4}]);
  s.setOrientation([0,0,0],3,0,1);
  assert.equal(s.edit([0,0,0],4,0,5),false);
  assert.equal(s.orientation([0,0,0]),1);
  assert.deepEqual(s.read([0,0,1]),{id:4,revision:0});
});
test('successful removal/replacement clears orientation and legacy export excludes metadata', () => {
  const s=recoverLegacyVoxelSession([{cell:[0,1,0],id:5}]);
  s.setOrientation([0,1,0],5,0,2);
  assert.equal(s.edit([0,1,0],5,0,0),true);
  assert.equal(s.orientation([0,1,0]),null);
  assert.deepEqual(s.exportLegacyCells(),[{cell:[0,1,0],id:0}]);
});
test('malformed legacy cells and invalid rotations fail closed', () => {
  assert.throws(()=>recoverLegacyVoxelSession([{cell:[1,2],id:4}]),/Invalid/);
  assert.throws(()=>recoverLegacyVoxelSession([{cell:[0,0,0],id:255}]),/Invalid/);
  assert.throws(()=>recoverLegacyVoxelSession([{cell:[0,0,0],id:2},{cell:[0,0,0],id:3}]),/Duplicate/);
  const s=recoverLegacyVoxelSession([{cell:[0,0,0],id:2}]);
  assert.throws(()=>s.setOrientation([0,0,0],2,0,4),/Invalid turn/);
  assert.equal(s.setOrientation([9,9,9],2,0,1),false);
});
