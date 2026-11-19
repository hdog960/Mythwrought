import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';

const first=[0,-12,2], second=[1,-12,2];

test('snapshot receipt is immutable, complete and commits a coherent two-cell edit',()=>{
  const host=createAtomicVoxelHost([{cell:first,id:1},{cell:second,id:2}]);
  assert.equal(host.setOrientation(first,1,0,3,null),true);
  const a=host.snapshotEdit(first,4), b=host.snapshotEdit(second,4);
  assert.deepEqual(a,{cell:first,expectedId:1,expectedRevision:0,expectedOrientationEpoch:1,expectedTurn:3,nextId:4});
  assert.equal(Object.isFrozen(a),true);
  assert.equal(Object.isFrozen(a.cell),true);
  assert.equal(host.compareAndWriteMany([a,b]),true);
  assert.deepEqual(host.read(first),{id:4,revision:1,turn:null});
  assert.deepEqual(host.read(second),{id:4,revision:1,turn:null});
});

test('orientation-only ABA invalidates earlier receipt and protects entire batch',()=>{
  const host=createAtomicVoxelHost([{cell:first,id:1},{cell:second,id:2}]);
  const old=host.snapshotEdit(first,4), other=host.snapshotEdit(second,4);
  assert.equal(host.setOrientation(first,1,0,1,null),true);
  assert.equal(host.setOrientation(first,1,0,0,1),true);
  assert.equal(host.compareAndWriteMany([other,old]),false);
  assert.deepEqual(host.read(second),{id:2,revision:0,turn:null});
  assert.equal(host.compareAndWriteMany([host.snapshotEdit(first,4),other]),true);
});

test('same-ID write invalidates receipt and legacy reload has fresh state',()=>{
  const host=createAtomicVoxelHost([{cell:first,id:1}]);
  const stale=host.snapshotEdit(first,1);
  assert.equal(host.externalWrite(first,1),true);
  assert.equal(host.compareAndWriteMany([stale]),false);
  const restored=createAtomicVoxelHost(host.exportLegacyCells());
  assert.deepEqual(restored.snapshotEdit(first,1),{cell:first,expectedId:1,expectedRevision:0,expectedOrientationEpoch:0,expectedTurn:null,nextId:1});
});

test('snapshot rejects malformed input and does not expose mutable internal cell',()=>{
  const host=createAtomicVoxelHost([{cell:first,id:1}]);
  assert.throws(()=>host.snapshotEdit([1.5,0,0],2),TypeError);
  assert.throws(()=>host.snapshotEdit(first,255),TypeError);
  assert.equal(host.snapshotEdit([90,0,0],1),null);
  const snap=host.snapshotEdit(first,2);
  assert.throws(()=>{snap.cell[0]=100;},TypeError);
  assert.deepEqual(host.snapshotEdit(first,2).cell,first);
});
