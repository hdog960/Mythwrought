import test from 'node:test';
import assert from 'node:assert/strict';
import {tryVoxelCellLease} from '../src/voxel-try-cell-lease.mjs';
import {withVoxelCellLease, VoxelCellLeaseConflictError} from '../src/voxel-cell-lease.mjs';

test('busy overlapping edit is skipped without invoking work',async()=>{
  const scope={};let release,entered;
  const gate=new Promise(r=>release=r),started=new Promise(r=>entered=r);
  const pending=withVoxelCellLease(scope,[[2,0,1]],async()=>{entered();await gate;return 'first';});
  await started;
  let called=false;
  assert.deepEqual(await tryVoxelCellLease(scope,[[2,0,1]],()=>{called=true;}),{acquired:false});
  assert.equal(called,false);
  assert.deepEqual(await tryVoxelCellLease(scope,[[3,0,1]],()=>42),{acquired:true,value:42});
  release();assert.equal(await pending,'first');
  assert.deepEqual(await tryVoxelCellLease(scope,[[2,0,1]],()=>7),{acquired:true,value:7});
});

test('callback failures are not disguised as lease contention',async()=>{
  const scope={};
  await assert.rejects(tryVoxelCellLease(scope,[[0,0,0]],()=>{throw Error('edit failed');}),/edit failed/);
  await assert.rejects(tryVoxelCellLease(scope,[[0,0,0]],()=>{throw Error('Voxel cell lease conflict');}),/Voxel cell lease conflict/);
  await assert.rejects(tryVoxelCellLease(scope,[[0,0,0],[0,0,0]],()=>true),/Duplicate/);
});

test('typed contention is distinct from a callback with identical error text',async()=>{
  const scope={};let release,started;
  const gate=new Promise(resolve=>release=resolve);
  const entered=new Promise(resolve=>started=resolve);
  const pending=withVoxelCellLease(scope,[[4,5,6]],async()=>{started();await gate;});
  await entered;
  await assert.rejects(withVoxelCellLease(scope,[[4,5,6]],()=>0),
    error=>error instanceof VoxelCellLeaseConflictError && error.message==='Voxel cell lease conflict');
  const forged=new Error('Voxel cell lease conflict');
  await assert.rejects(tryVoxelCellLease(scope,[[9,9,9]],()=>{throw forged;}),
    error=>error===forged);
  release();await pending;
  assert.deepEqual(await tryVoxelCellLease(scope,[[4,5,6]],()=>99),{acquired:true,value:99});
});

test('rejected asynchronous work releases all leased cells',async()=>{
  const scope={}, failure=new Error('write rejected');
  await assert.rejects(tryVoxelCellLease(scope,[[1,2,3],[4,5,6]],async()=>{
    await Promise.resolve();throw failure;
  }),error=>error===failure);
  assert.deepEqual(await tryVoxelCellLease(scope,[[1,2,3],[4,5,6]],()=>true),
    {acquired:true,value:true});
});
