import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverOptionalOrientation} from '../src/voxel-orientation-recovery.mjs';

test('schema-1 world without optional metadata retains default orientation',()=>{
  const world={schema:1,edits:[[1,2,3,7]]},before=JSON.stringify(world);
  const {sidecar,recovered}=recoverOptionalOrientation(undefined,()=>7);
  assert.equal(recovered,true);
  assert.equal(sidecar.get([1,2,3],7),0);
  assert.equal(JSON.stringify(world),before);
});

test('malformed optional envelope cannot block legacy load or invoke world reader',()=>{
  let reads=0;
  for(const value of [{entries:[]},'corrupt',42,Array.from({length:3},()=>null)]){
    const {sidecar,recovered}=recoverOptionalOrientation(value,()=>{reads++;return 7;},{maxEntries:2});
    assert.equal(recovered,false);
    assert.equal(sidecar.size(),0);
  }
  assert.equal(reads,0);
});

test('matching records recover, stale records and ambiguous duplicates are discarded',()=>{
  const records=[
    {cell:[1,2,3],blockId:7,turns:2},
    {cell:[4,5,6],blockId:8,turns:3},
    {cell:[9,9,9],blockId:7,turns:1},
    {cell:[9,9,9],blockId:7,turns:2}
  ];
  const {sidecar,recovered}=recoverOptionalOrientation(records,(x)=>x===1?7:0);
  assert.equal(recovered,true);
  assert.equal(sidecar.size(),1);
  assert.equal(sidecar.get([1,2,3],7),2);
  assert.equal(sidecar.get([4,5,6],8),0);
  assert.equal(sidecar.get([9,9,9],7),0);
});

test('world reader failure remains visible rather than being disguised as metadata corruption',()=>{
  const failure=new Error('world storage unavailable');
  assert.throws(()=>recoverOptionalOrientation([{cell:[1,2,3],blockId:7,turns:1}],
    ()=>{throw failure;}),error=>error===failure);
  assert.throws(()=>recoverOptionalOrientation(null,()=>0,{maxEntries:0}),TypeError);
});
