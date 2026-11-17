import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';

test('post-load mutation cannot redirect original voxel coordinates or exports', () => {
  const cell = [3, 4, 5];
  const source = [{cell, id: 7, turn: 3, revision: 91}];
  const session = recoverLegacyVoxelSession(source);
  cell[0] = 99;
  source[0].id = 8;
  source[0].cell = [1, 1, 1];
  assert.deepEqual(session.read([3, 4, 5]), {id: 7, revision: 0});
  assert.equal(session.read([99, 4, 5]), null);
  assert.deepEqual(session.exportLegacyCells(), [{cell: [3, 4, 5], id: 7}]);
  assert.equal(session.setOrientation([3, 4, 5], 7, 0, 2), true);
  assert.equal(session.edit([3, 4, 5], 7, 0, 7), true);
  assert.equal(session.orientation([3, 4, 5]), null);
  assert.deepEqual(session.exportLegacyCells(), [{cell: [3, 4, 5], id: 7}]);
});

test('mutation of exported coordinates cannot poison later exports or edits', () => {
  const session = recoverLegacyVoxelSession([{cell: [-1, 0, 2], id: 6}]);
  const exported = session.exportLegacyCells();
  exported[0].cell[0] = 1000;
  exported[0].id = 2;
  assert.deepEqual(session.exportLegacyCells(), [{cell: [-1, 0, 2], id: 6}]);
  assert.equal(session.edit([-1, 0, 2], 6, 0, 0), true);
  assert.deepEqual(session.exportLegacyCells(), [{cell: [-1, 0, 2], id: 0}]);
});
