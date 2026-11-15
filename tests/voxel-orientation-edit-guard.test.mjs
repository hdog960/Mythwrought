import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {applyOrientedVoxelEdit,invalidateOrientationAfterEdit} from '../src/voxel-orientation-edit-guard.mjs';

function fixture(initial=4) {
  const world=new Map([['-2,3,5',initial]]);
  const orientation=makeOrientationSidecar();
  orientation.set([-2,3,5],initial,3);
  const readBlock=(x,y,z)=>world.get([x,y,z].join(','))??0;
  const writeBlock=(x,y,z,id)=>{world.set([x,y,z].join(','),id);return true;};
  return {world,orientation,readBlock,writeBlock,cell:[-2,3,5]};
}
test('committed replacement clears orientation, including after replacing back',()=>{
  const f=fixture();
  const result=applyOrientedVoxelEdit({...f,nextBlockId:6});
  assert.deepEqual(result,{changed:true,before:4,after:6});
  assert.equal(f.orientation.size(),0);
  applyOrientedVoxelEdit({...f,nextBlockId:4});
  assert.equal(f.orientation.get(f.cell,4),0);
});
test('no-op preserves yaw and never invokes writer',()=>{
  const f=fixture();
  const result=applyOrientedVoxelEdit({...f,nextBlockId:4,writeBlock:()=>{throw Error('should not write')}});
  assert.equal(result.changed,false);
  assert.equal(f.orientation.get(f.cell,4),3);
});
test('failed or throwing world edits preserve orientation',()=>{
  const f=fixture();
  assert.equal(applyOrientedVoxelEdit({...f,nextBlockId:0,writeBlock:()=>false}).changed,false);
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:0,writeBlock:()=>{throw Error('disk failure')}}),/disk failure/);
  assert.equal(f.orientation.get(f.cell,4),3);
});
test('reported success without actual write fails closed without clearing yaw',()=>{
  const f=fixture();
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:6,writeBlock:()=>true}),/without committing/);
  assert.equal(f.orientation.get(f.cell,4),3);
});
test('external same-ID replacement can explicitly invalidate',()=>{
  const f=fixture();
  f.world.set('-2,3,5',4);
  invalidateOrientationAfterEdit(f.orientation,f.cell);
  assert.equal(f.orientation.size(),0);
});
test('invalid cells and sentinel IDs never write',()=>{
  const f=fixture();
  for(const cell of [[1,2,Infinity],[1,2],['1',2,3]]) {
    assert.throws(()=>applyOrientedVoxelEdit({...f,cell,nextBlockId:0}),TypeError);
  }
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:255}),TypeError);
  assert.equal(f.orientation.get(f.cell,4),3);
});
test('legacy schema-1 payload remains byte-identical',()=>{
  const f=fixture();
  const legacy='{"schema":1,"edits":[[-2,3,5,4]],"seed":42}';
  applyOrientedVoxelEdit({...f,nextBlockId:5});
  assert.equal(legacy,'{"schema":1,"edits":[[-2,3,5,4]],"seed":42}');
});

test('writer mutates then returns false: clear stale yaw and report partial failure',()=>{
  const f=fixture();
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:6,writeBlock:(x,y,z,id)=>{
    f.world.set([x,y,z].join(','),id); return false;
  }}),/changed despite failed edit/);
  assert.equal(f.readBlock(...f.cell),6);
  assert.equal(f.orientation.size(),0);
});
test('writer mutates then throws: preserve original error but clear stale yaw',()=>{
  const f=fixture();
  const failure=new Error('save unavailable');
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:6,writeBlock:(x,y,z,id)=>{
    f.world.set([x,y,z].join(','),id); throw failure;
  }}),e=>e===failure);
  assert.equal(f.orientation.size(),0);
});
test('readback failure after attempted write invalidates untrusted yaw',()=>{
  const f=fixture(); let reads=0;
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:6,
    readBlock:(...args)=>{ if(++reads===2) throw Error('readback failed'); return f.readBlock(...args); }
  }),/Cannot verify world state/);
  assert.equal(f.orientation.size(),0);
});
test('writer returning success but mutating to wrong ID invalidates old yaw',()=>{
  const f=fixture();
  assert.throws(()=>applyOrientedVoxelEdit({...f,nextBlockId:6,writeBlock:(x,y,z)=>{
    f.world.set([x,y,z].join(','),5);return true;
  }}),/without committing/);
  assert.equal(f.orientation.size(),0);
});
test('false writer without mutation retains yaw and avoids phantom edit',()=>{
  const f=fixture();
  assert.deepEqual(applyOrientedVoxelEdit({...f,nextBlockId:6,writeBlock:()=>false}),
    {changed:false,before:4,after:4});
  assert.equal(f.orientation.get(f.cell,4),3);
});
