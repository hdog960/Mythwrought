import test from 'node:test';
import assert from 'node:assert/strict';
import {sortPack4PreviewTranslucent} from '../../../src/block-packs/pack-4/preview-utils.mjs';
function tri(z,tag,x=.5,y=.5){
  const values=[];
  for(let i=0;i<3;i++) values.push(x,y,z,0,0,1,tag,.2,.3,.5);
  return values;
}
test('far glass is ordered before near glass, preserving vertex records',()=>{
  const near=tri(.1,.2),far=tri(.9,.8);
  const stream=new Float32Array([...near,...far]);
  const result=sortPack4PreviewTranslucent(stream);
  assert.equal(result.length,stream.length);
  assert.deepEqual([...result],new Float32Array([...far,...near]).slice());
  assert.deepEqual([...stream],new Float32Array([...near,...far]).slice(),
    'input is never mutated');
});
test('a tie retains authoring order deterministically',()=>{
  const one=tri(.3,.1),two=tri(.3,.9);
  const result=sortPack4PreviewTranslucent(new Float32Array([...one,...two]));
  assert.deepEqual([...result],new Float32Array([...one,...two]).slice());
});
test('preview camera X inclination contributes to depth ordering',()=>{
  const left=tri(.5,.1,.1),right=tri(.5,.9,.9);
  const result=sortPack4PreviewTranslucent(new Float32Array([...right,...left]));
  assert.deepEqual([...result],new Float32Array([...left,...right]).slice());
});
test('empty triangle stream is still a new zero-length Float32Array',()=>{
  const a=new Float32Array(0);
  const b=sortPack4PreviewTranslucent(a);
  assert.ok(b instanceof Float32Array);
  assert.notEqual(a,b);
  assert.equal(b.length,0);
});
test('bad stride, malformed triangle records and invalid input fail closed',()=>{
  for(const bad of [null,[],{},new Float64Array(30)])
    assert.throws(()=>sortPack4PreviewTranslucent(bad));
  assert.throws(()=>sortPack4PreviewTranslucent(new Float32Array(30),9));
  assert.throws(()=>sortPack4PreviewTranslucent(new Float32Array(31)));
  assert.throws(()=>sortPack4PreviewTranslucent(new Float32Array(30),10.5));
  const n=new Float32Array(30);n[0]=NaN;
  assert.throws(()=>sortPack4PreviewTranslucent(n));
});
