import test from 'node:test';
import assert from 'node:assert/strict';
import {UNDERGROUND_CIVILIZATION_COMPLETION as assets,completionBoxes,completionMaterial,completionMesh,completionEditFixture} from '../../../src/auto-block-catalog/biome130/underground-civilization-completion.mjs';
test('four distinct physical candidates with reserved symbolic identities',()=>{
 assert.deepEqual(assets.map(a=>a.id),['biome130:077','biome130:078','biome130:079','biome130:080']);
 assert.deepEqual(assets.map(a=>a.prospectiveId),[332,333,334,335]);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,4);
 for(const a of assets){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);assert.equal(a.dynamic,false);assert.equal(a.active,false);assert.ok(a.boxes.length>=6);}
});
test('four rotations maintain exact geometry bounds and volumes',()=>{
 for(const a of assets)for(let r=0;r<4;r++){
  const boxes=completionBoxes(a,r);assert.equal(boxes.length,a.boxes.length);
  const vol=b=>b.reduce((s,v)=>s+(v[3]-v[0])*(v[4]-v[1])*(v[5]-v[2]),0);
  assert.ok(Math.abs(vol(boxes)-vol(a.boxes))<1e-8);
  for(const b of boxes){assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
 }
 assert.throws(()=>completionBoxes(assets[0],4),RangeError);
 assert.throws(()=>completionBoxes({},0),RangeError);
});
test('mesh indices finite, triangles nondegenerate, mobile fixture bounded',()=>{
 for(const a of assets)for(let r=0;r<4;r++){
  const m=completionMesh(a,r);assert.equal(m.vertices.length,a.boxes.length*72);assert.equal(m.indices.length,a.boxes.length*36);
  assert.ok(m.vertices.every(Number.isFinite));assert.ok(m.indices.every(i=>Number.isInteger(i)&&i>=0&&i<m.vertices.length/3));
  assert.ok(m.indices.length<=252);
  for(let i=0;i<m.indices.length;i+=3){
   const p=m.indices.slice(i,i+3).map(j=>m.vertices.slice(j*3,j*3+3));
   const u=p[1].map((v,j)=>v-p[0][j]),v=p[2].map((w,j)=>w-p[0][j]);
   const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   assert.ok(cross.some(n=>Math.abs(n)>1e-9));
  }
 }
});
test('deterministic material and reversible symbolic save fixture',()=>{
 for(const a of assets)for(let r=0;r<4;r++){
  const c=completionMaterial(a,3,7,11,r);assert.ok(a.palette.includes(c));assert.equal(c,completionMaterial(a,3,7,11,r));
  const e=completionEditFixture(a,r);assert.deepEqual(e.selected,{symbolicId:a.id,rotation:r});assert.equal(e.removed,true);
  assert.ok(!e.encoded.includes('prospectiveId'));
 }
 assert.throws(()=>completionMaterial({},0,0,0),TypeError);
});
