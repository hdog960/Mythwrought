import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {encodeOrientationEnvelope,decodeOrientationEnvelope,ORIENTATION_FORMAT} from '../src/voxel-orientation-envelope.mjs';
const ctx={seed:'fixed-seed-01',worldId:'world-01'};
const blocks=new Map([['-2,3,4',8],['1,2,3',7]]);
const read=(x,y,z)=>blocks.get([x,y,z].join(','))??0;
test('orientation envelope round trip with negative cells and legacy-safe empty default',()=>{
  const side=makeOrientationSidecar();
  side.set([-2,3,4],8,3); side.set([1,2,3],7,1);
  const saved=encodeOrientationEnvelope(side,read,ctx);
  assert.equal(JSON.parse(saved).format,ORIENTATION_FORMAT);
  const restored=decodeOrientationEnvelope(saved,read,ctx);
  assert.equal(restored.get([-2,3,4],8),3);
  assert.equal(restored.get([1,2,3],7),1);
  assert.equal(decodeOrientationEnvelope(null,read,ctx).size(),0);
});
test('world identity and seed isolation fail closed',()=>{
  const side=makeOrientationSidecar();side.set([-2,3,4],8,2);
  const saved=encodeOrientationEnvelope(side,read,ctx);
  assert.throws(()=>decodeOrientationEnvelope(saved,read,{...ctx,seed:'another'}));
  assert.throws(()=>decodeOrientationEnvelope(saved,read,{...ctx,worldId:'other'}));
});
test('stale replaced blocks cannot inherit orientation',()=>{
  const side=makeOrientationSidecar();side.set([-2,3,4],8,2);
  const saved=encodeOrientationEnvelope(side,read,ctx);
  blocks.set('-2,3,4',7);
  assert.equal(decodeOrientationEnvelope(saved,read,ctx).get([-2,3,4],7),0);
  blocks.set('-2,3,4',8);
});
test('invalid and duplicate records rejected without changing original state',()=>{
  const side=makeOrientationSidecar();side.set([-2,3,4],8,2);
  const saved=encodeOrientationEnvelope(side,read,ctx);
  for(const entries of [[{cell:[0,0,0],blockId:8,turns:9}],[
    {cell:[1,2,3],blockId:7,turns:1},{cell:[1,2,3],blockId:7,turns:2}]]) {
    assert.throws(()=>decodeOrientationEnvelope(JSON.stringify({...JSON.parse(saved),entries}),read,ctx));
  }
  assert.throws(()=>decodeOrientationEnvelope('{',read,ctx));
  assert.equal(side.get([-2,3,4],8),2);
});
test('bounded payload and record budgets',()=>{
  const side=makeOrientationSidecar();side.set([-2,3,4],8,2);
  assert.throws(()=>encodeOrientationEnvelope(side,read,{...ctx,maxEntries:0}));
  assert.throws(()=>decodeOrientationEnvelope(' '.repeat(262145),read,ctx));
});
