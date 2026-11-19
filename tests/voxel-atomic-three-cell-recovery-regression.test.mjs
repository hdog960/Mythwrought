import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';

// Host-side safety: no partially applied batch may survive an invalid receipt.
const a=[2,-21,4], b=[3,-21,4], c=[4,-21,4];
const initial=[{cell:a,id:1},{cell:b,id:2},{cell:c,id:3}];
const receipt=(cell,id,epoch=0,turn=null)=>({
  cell,expectedId:id,expectedRevision:0,expectedOrientationEpoch:epoch,
  expectedTurn:turn,nextId:4
});

test('invalid final receipt never commits earlier cells',()=>{
  const host=createAtomicVoxelHost(structuredClone(initial));
  assert.throws(()=>host.compareAndWriteMany([
    receipt(a,1),receipt(b,2),{...receipt(c,3),expectedOrientationEpoch:-1}
  ]),TypeError);
  assert.deepEqual(host.exportLegacyCells(),initial);
  for(const [cell,id] of [[a,1],[b,2],[c,3]])
    assert.deepEqual(host.read(cell),{id,revision:0,turn:null});
});

test('stale orientation on last receipt rejects entire valid batch',()=>{
  const host=createAtomicVoxelHost(structuredClone(initial));
  assert.equal(host.setOrientation(c,3,0,2,null),true);
  assert.equal(host.compareAndWriteMany([
    receipt(a,1),receipt(b,2),receipt(c,3)
  ]),false);
  assert.deepEqual(host.exportLegacyCells(),initial);
  assert.deepEqual(host.read(a),{id:1,revision:0,turn:null});
  assert.deepEqual(host.read(b),{id:2,revision:0,turn:null});
  assert.deepEqual(host.read(c),{id:3,revision:0,turn:2});
  assert.equal(host.compareAndWriteMany([
    receipt(a,1),receipt(b,2),receipt(c,3,1,2)
  ]),true);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:a,id:4},{cell:b,id:4},{cell:c,id:4}
  ]);
  for(const cell of [a,b,c])
    assert.deepEqual(host.read(cell),{id:4,revision:1,turn:null});
});

test('legacy save recovery clears all transient orientation epochs',()=>{
  const host=createAtomicVoxelHost(structuredClone(initial));
  assert.equal(host.setOrientation(a,1,0,1,null),true);
  assert.equal(host.externalWrite(b,2),true);
  const recovered=createAtomicVoxelHost(host.exportLegacyCells());
  assert.deepEqual(recovered.exportLegacyCells(),initial);
  for(const [cell,id] of [[a,1],[b,2],[c,3]]){
    assert.deepEqual(recovered.read(cell),{id,revision:0,turn:null});
    assert.equal(recovered.readOrientationEpoch(cell),0);
  }
});
