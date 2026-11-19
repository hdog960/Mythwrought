import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {prepareVoxelEditBatch,commitPreparedVoxelEditBatch} from '../src/voxel-atomic-batch-preparation.mjs';

const a=[0,-12,0], b=[1,-12,0];
const make=()=>createAtomicVoxelHost([{cell:a,id:1},{cell:b,id:2}]);

test('prepared batch edits both cells and invalidates orientations',()=>{
 const host=make();
 assert.equal(host.setOrientation(a,1,0,3),true);
 const batch=prepareVoxelEditBatch(host,[{cell:a,nextId:4},{cell:b,nextId:5}]);
 assert.equal(Object.isFrozen(batch),true);
 assert.equal(commitPreparedVoxelEditBatch(host,batch),true);
 assert.deepEqual(host.read(a),{id:4,revision:1,turn:null});
 assert.deepEqual(host.read(b),{id:5,revision:1,turn:null});
});

test('orientation ABA after preparation rejects entire batch',()=>{
 const host=make();
 const batch=prepareVoxelEditBatch(host,[{cell:a,nextId:4},{cell:b,nextId:5}]);
 host.setOrientation(a,1,0,1);
 host.setOrientation(a,1,0,0,1);
 assert.equal(commitPreparedVoxelEditBatch(host,batch),false);
 assert.deepEqual(host.read(b),{id:2,revision:0,turn:null});
});

test('external same-ID writer rejects stale batch; fresh legacy reload recovers',()=>{
 const host=make();
 const batch=prepareVoxelEditBatch(host,[{cell:a,nextId:4},{cell:b,nextId:5}]);
 assert.equal(host.externalWrite(b,2),true);
 assert.equal(commitPreparedVoxelEditBatch(host,batch),false);
 const recovered=createAtomicVoxelHost(host.exportLegacyCells());
 assert.equal(commitPreparedVoxelEditBatch(recovered,prepareVoxelEditBatch(recovered,[{cell:a,nextId:4},{cell:b,nextId:5}])),true);
});

test('duplicate, malformed and missing cell fail closed',()=>{
 const host=make();
 assert.throws(()=>prepareVoxelEditBatch(host,[{cell:a,nextId:1},{cell:[...a],nextId:2}]),TypeError);
 assert.throws(()=>prepareVoxelEditBatch(host,[{cell:a,nextId:255}]),TypeError);
 assert.equal(prepareVoxelEditBatch(host,[{cell:a,nextId:3},{cell:[999,0,0],nextId:3}]),null);
 assert.deepEqual(host.read(a),{id:1,revision:0,turn:null});
});
