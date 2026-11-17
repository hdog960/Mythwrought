import test from 'node:test';
import assert from 'node:assert/strict';
import {createRevisionedVoxelFixture} from '../src/voxel-revisioned-cas-fixture.mjs';
import {atomicLegacyWriter} from '../src/voxel-atomic-edit-adapter.mjs';

test('same-ID edit advances revision and rejects stale orientation-era write', async () => {
  const host=createRevisionedVoxelFixture([{cell:[0,0,0],id:7,revision:4}]);
  const write=atomicLegacyWriter(host);
  assert.equal(await write([0,0,0],7,7,4),true);
  assert.equal(await write([0,0,0],6,7,4),false);
  assert.deepEqual(host.read([0,0,0]),{id:7,revision:5});
});
test('cells are independent and old world cells remain untouched', async () => {
  const host=createRevisionedVoxelFixture([{cell:[1,2,3],id:4,revision:0},{cell:[1,2,4],id:5,revision:0}]);
  const write=atomicLegacyWriter(host);
  assert.equal(await write([1,2,3],6,4,0),true);
  assert.deepEqual(host.read([1,2,4]),{id:5,revision:0});
  assert.equal(host.read([9,9,9]),null);
});
test('duplicate coordinates, invalid IDs and malformed revisions fail closed', () => {
  assert.throws(()=>createRevisionedVoxelFixture([{cell:[0,0,0],id:1,revision:0},{cell:[0,0,0],id:2,revision:0}]),/Duplicate/);
  assert.throws(()=>createRevisionedVoxelFixture([{cell:[0,0,0],id:255,revision:0}]),/Invalid/);
  const host=createRevisionedVoxelFixture([{cell:[0,0,0],id:1,revision:0}]);
  assert.throws(()=>host.compareAndWrite({cell:[0,0,0],expectedId:1,expectedRevision:-1,nextId:2}),/Invalid/);
  assert.deepEqual(host.read([0,0,0]),{id:1,revision:0});
});
test('revision overflow cannot resurrect stale edits', async () => {
  const max=Number.MAX_SAFE_INTEGER;
  const host=createRevisionedVoxelFixture([{cell:[-1,0,2],id:8,revision:max}]);
  assert.equal(await atomicLegacyWriter(host)([-1,0,2],7,8,max),false);
  assert.deepEqual(host.read([-1,0,2]),{id:8,revision:max});
});
test('two asynchronous callers cannot both commit the same revision', async () => {
  const host=createRevisionedVoxelFixture([{cell:[0,0,0],id:3,revision:0}]);
  const write=atomicLegacyWriter(host);
  const results=await Promise.all([write([0,0,0],4,3,0),write([0,0,0],5,3,0)]);
  assert.deepEqual(results.sort(),[false,true]);
  assert.equal(host.read([0,0,0]).revision,1);
});
