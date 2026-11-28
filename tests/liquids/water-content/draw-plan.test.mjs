import test from 'node:test';
import assert from 'node:assert/strict';
import {planLiquidDraws} from '../../../src/liquids/presentation/draw-plan.mjs';
const material=(id,pass='transparent')=>({id,pass,depthTest:true,depthWrite:pass==='opaque',cull:false,blend:'straight-alpha'});
const materials={water:material('water'),acid:material('acid'),lava:material('lava','opaque')};
function batch(id,depths,liquid='water',origin=[0,0,0]){
  const positions=new Float32Array(depths.flatMap(z=>[0,0,z,1,0,z,1,1,z,0,1,z]));
  return {id,revision:1,mesh:{version:1,origin,faceCount:depths.length,groups:[{id:liquid,positions,normals:new Float32Array(positions.length),indices:new Uint32Array(depths.flatMap((_,q)=>[0,1,2,0,2,3].map(i=>i+4*q)))}]}};
}
const plan=(batches,opts={})=>planLiquidDraws({batches,materials,camera:[0,0,0],forward:[0,0,1],...opts});
const ranges=a=>a.map(c=>[c.batchId,c.firstIndex,c.indexCount]);
test('sorts individual faces across batches and materials, not group order',()=>{
  const p=plan([batch('a',[1,5]),batch('b',[3],'acid'),batch('c',[2,4],'lava')]);
  assert.deepEqual(ranges(p.transparent),[['a',6,6],['b',0,6],['a',0,6]]);
  assert.deepEqual(ranges(p.opaque),[['c',0,12]]);assert.equal(p.faces,5);
});
test('view reversal flips order and stable ties ignore input order',()=>{
  const a=batch('a',[2]),b=batch('b',[2]),c=batch('c',[5]);
  assert.deepEqual(ranges(plan([b,c,a]).transparent),[['c',0,6],['a',0,6],['b',0,6]]);
  assert.deepEqual(ranges(plan([c,b,a],{forward:[0,0,-2]}).transparent),[['a',0,6],['b',0,6],['c',0,6]]);
});
test('camera-relative origin retains local eighth precision at large coordinates',()=>{
  const o=[2**40,256,2**40];const p=plan([batch('a',[0.125],'water',o),batch('b',[0.25],'water',o)],{camera:o});
  assert.deepEqual(ranges(p.transparent),[['b',0,6],['a',0,6]]);
});
test('coalesces only contiguous sorted index spans and preserves revision',()=>{
  const b=batch('a',[3,2,1]);b.revision=7;const p=plan([b]);assert.deepEqual(ranges(p.transparent),[['a',0,18]]);assert.equal(p.transparent[0].revision,7);assert.ok(Object.isFrozen(p.transparent[0]));
});
test('fails closed on cap, duplicate ownership, wrong material, invalid indices and malformed count',()=>{
  const b=batch('a',[2,1]);assert.throws(()=>plan([b],{maxFaces:1}));assert.throws(()=>plan([b,b]));
  assert.throws(()=>plan([b],{materials:{water:{...materials.water,depthWrite:true}}}));
  assert.throws(()=>plan([b],{forward:[0,0,0]}));b.mesh.faceCount=1;assert.throws(()=>plan([b]));b.mesh.faceCount=2;b.mesh.groups[0].indices[0]=9;assert.throws(()=>plan([b]));
});
