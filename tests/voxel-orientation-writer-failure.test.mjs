import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {makeOrientationEditGuard} from '../src/voxel-orientation-edit-guard.mjs';

function fixture(writer) {
  const world=new Map([['2,0,-1',7]]);
  const cell=[2,0,-1];
  const sidecar=makeOrientationSidecar();
  sidecar.set(cell,7,3);
  const readBlock=(x,y,z)=>world.get([x,y,z].join(','))??0;
  const guard=makeOrientationEditGuard({readBlock,sidecar,
    writeBlock:(x,y,z,id)=>writer(world,[x,y,z].join(','),id)});
  return {world,cell,sidecar,guard,readBlock};
}
test('rejected writer that secretly mutates block fails closed and drops rotation',()=>{
  const f=fixture((world,key,id)=>{world.set(key,id);return false;});
  assert.throws(()=>f.guard.edit(f.cell,8),/Rejected writer mutated/);
  assert.equal(f.readBlock(...f.cell),8);
  assert.equal(f.sidecar.size(),0);
});
test('throwing writer that partially commits invalidates stale orientation',()=>{
  const f=fixture((world,key,id)=>{world.set(key,id);throw new Error('disk failure');});
  assert.throws(()=>f.guard.edit(f.cell,8),/disk failure/);
  assert.equal(f.sidecar.size(),0);
});
test('throwing atomic writer retains old orientation',()=>{
  const f=fixture(()=>{throw new Error('rejected before commit');});
  assert.throws(()=>f.guard.edit(f.cell,8),/rejected before commit/);
  assert.equal(f.sidecar.get(f.cell,7),3);
});
test('rejected atomic writer retains orientation',()=>{
  const f=fixture(()=>false);
  assert.equal(f.guard.edit(f.cell,8).reason,'rejected');
  assert.equal(f.sidecar.get(f.cell,7),3);
});
test('reader failure after throwing writer invalidates state defensively',()=>{
  let reads=0;
  const sidecar=makeOrientationSidecar();
  sidecar.set([0,0,0],4,2);
  const guard=makeOrientationEditGuard({sidecar,
    readBlock(){reads++;if(reads>1)throw new Error('read unavailable');return 4;},
    writeBlock(){throw new Error('writer failed');}});
  assert.throws(()=>guard.edit([0,0,0],5),/writer failed/);
  assert.equal(sidecar.size(),0);
});
