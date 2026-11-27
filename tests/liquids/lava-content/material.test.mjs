import test from 'node:test';
import assert from 'node:assert/strict';
import {LAVA_MATERIAL as m,sampleMolten as sample,buildLavaTile as tile,lavaVisualSignal as signal} from '../../../src/liquids/lava/content/material.mjs';
test('opaque emissive material matches shared descriptor',()=>{
  assert.equal(m.id,'lava');assert.equal(m.pass,'opaque');assert.equal(m.alpha,1);
  assert.equal(m.depthTest,true);assert.equal(m.depthWrite,true);assert.ok(m.emissive>0);
});
test('periodic texture and phase have no world tile discontinuity',()=>{
  for(let i=0;i<64;i++){const p=i/64;assert.deepEqual(sample(0,p,.25),sample(1,p,1.25));assert.deepEqual(sample(p,0),sample(p,1));}
});
test('bounded deterministic texture with distinct fissures and crust',()=>{
  const a=tile(),b=tile();assert.deepEqual(a,b);assert.equal(a.rgba.length,4096);assert.equal(a.emission.length,1024);
  assert.ok(Math.max(...a.emission)>100);assert.ok(a.emission.includes(0));
  assert.notDeepEqual(a.rgba,tile({phase:.25}).rgba);
  assert.ok(a.rgba.filter((_,i)=>i%4===3).every(v=>v===255));
});
test('cold visual is nonemissive, no solid conversion',()=>{
  const a=tile({heat:0});assert.ok(a.emission.every(v=>v===0));assert.equal(sample(0,0,0,0).crust,1);
});
test('reject invalid sizes and nonfinite visual inputs',()=>{
  for(const size of [0,65,3.5,NaN])assert.throws(()=>tile({size}),RangeError);
  assert.throws(()=>sample(NaN,0),RangeError);assert.throws(()=>sample(0,0,0,1.1),RangeError);
  const a=tile({size:64});assert.equal(a.rgba.byteLength+a.emission.byteLength,20480);
});
test('heat signal delegates validation and does not mutate cells',()=>{
  const cell=Object.freeze({id:'lava',units:3,quantities:Object.freeze({'lava-heat':180})});
  assert.deepEqual(signal(cell,c=>c.quantities['lava-heat']),{id:'lava',fill:3/8,heat:.6});
  assert.equal(signal(cell,()=>null),null);assert.equal(signal(cell,()=>301),null);
  assert.equal(signal({...cell,id:'water'},()=>180),null);assert.equal(signal({...cell,units:9},()=>180),null);
});
