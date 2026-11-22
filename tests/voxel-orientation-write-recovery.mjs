import assert from 'node:assert/strict';
import test from 'node:test';
import {makeOrientationSidecar,restoreOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {makeOrientationEditGuard} from '../src/voxel-orientation-edit-guard.mjs';

const CELL=[2,3,4];
function fixture(writer) {
  let block=4;
  const sidecar=makeOrientationSidecar();
  sidecar.set(CELL,4,3);
  const readBlock=()=>block;
  const guard=makeOrientationEditGuard({
    readBlock,sidecar,
    writeBlock:(x,y,z,id)=>writer({id,set:value=>{block=value;}})
  });
  return {sidecar,guard,readBlock,get block(){return block;}};
}
test('throw after partial mutation invalidates stale rotation and preserves original exception',()=>{
  const error=new Error('disk failed');
  const f=fixture(({id,set})=>{set(id);throw error;});
  assert.throws(()=>f.guard.edit(CELL,5,{expectedId:4}),e=>e===error);
  assert.equal(f.block,5);
  assert.equal(f.sidecar.size(),0);
  assert.deepEqual(f.sidecar.snapshot(f.readBlock),[]);
});
test('throw before mutation preserves valid orientation and unlocks next edit',()=>{
  let count=0;
  const f=fixture(({id,set})=>{if(count++===0)throw Error('preflight');set(id);return true;});
  assert.throws(()=>f.guard.edit(CELL,5),/preflight/);
  assert.equal(f.sidecar.get(CELL,4),3);
  assert.equal(f.guard.edit(CELL,5).applied,true);
  assert.equal(f.sidecar.size(),0);
});
test('false writer with mutation fails closed, does not report rejected as safe',()=>{
  const f=fixture(({id,set})=>{set(id);return false;});
  assert.throws(()=>f.guard.edit(CELL,5),/Rejected edit mutated world cell/);
  assert.equal(f.sidecar.size(),0);
});
test('genuine rejected write retains old rotation and old schema recovery',()=>{
  const f=fixture(()=>false);
  assert.deepEqual(f.guard.edit(CELL,5),{applied:false,reason:'rejected'});
  assert.equal(f.sidecar.get(CELL,4),3);
  const oldSave={schema:1,edits:[[2,3,4,4]]};
  const bytes=JSON.stringify(oldSave);
  const recovered=restoreOrientationSidecar([],f.readBlock);
  assert.equal(recovered.size(),0);
  assert.equal(JSON.stringify(oldSave),bytes);
});
test('same-ID replacement clears rotation; stale expected ID never calls writer',()=>{
  let writes=0;
  const f=fixture(({id,set})=>{writes++;set(id);return true;});
  assert.deepEqual(f.guard.edit(CELL,5,{expectedId:3}),{applied:false,reason:'stale'});
  assert.equal(writes,0);
  assert.equal(f.guard.edit(CELL,4,{replaceSameId:true}).applied,true);
  assert.equal(f.sidecar.size(),0);
});

test('revision detects same-ID mutation before throwing, clearing stale orientation',()=>{
  let revision=0;
  const error=new Error('partial same-ID write');
  const f=fixture(({set})=>{set(4);revision++;throw error;});
  const guard=makeOrientationEditGuard({
    readBlock:f.readBlock,
    writeBlock:()=>{revision++;throw error;},
    readRevision:()=>revision,
    sidecar:f.sidecar
  });
  assert.throws(()=>guard.edit(CELL,5),e=>e===error);
  assert.equal(f.sidecar.size(),0);
});
test('revision detects false-with-same-ID mutation and preserves clean rejection',()=>{
  let revision=0;
  const f=fixture(()=>false);
  const guard=makeOrientationEditGuard({
    readBlock:f.readBlock,
    writeBlock:()=>{revision++;return false;},
    readRevision:()=>revision,
    sidecar:f.sidecar
  });
  assert.throws(()=>guard.edit(CELL,5),/Rejected edit mutated world cell/);
  assert.equal(f.sidecar.size(),0);
});
test('unchanged revision preserves rotation after pre-write failure',()=>{
  const f=fixture(()=>false);
  const guard=makeOrientationEditGuard({
    readBlock:f.readBlock,
    writeBlock:()=>{throw Error('pre-write failure');},
    readRevision:()=>7,
    sidecar:f.sidecar
  });
  assert.throws(()=>guard.edit(CELL,5),/pre-write failure/);
  assert.equal(f.sidecar.get(CELL,4),3);
});
test('invalid revision reader is rejected without writing',()=>{
  const f=fixture(()=>true);
  assert.throws(()=>makeOrientationEditGuard({
    readBlock:f.readBlock,writeBlock:()=>true,sidecar:f.sidecar,readRevision:5
  }),/Invalid revision reader/);
  const guard=makeOrientationEditGuard({
    readBlock:f.readBlock,writeBlock:()=>true,sidecar:f.sidecar,readRevision:()=>-1
  });
  assert.throws(()=>guard.edit(CELL,5),/Invalid world revision/);
  assert.equal(f.sidecar.get(CELL,4),3);
});
