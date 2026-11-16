import test from 'node:test';
import assert from 'node:assert/strict';
import {RAW_LOGS_113_115,logBoxes,logMaterial,logMesh,logEditFixture} from '../../../src/auto-block-catalog/biome130/raw-logs-113-115.mjs';
test('three distinct reserved symbolic physical species',()=>{
 assert.deepEqual(RAW_LOGS_113_115.map(a=>a.symbolicId),['biome130:113','biome130:114','biome130:115']);
 assert.deepEqual(RAW_LOGS_113_115.map(a=>a.futureOnlyId),[368,369,370]);
 assert.equal(new Set(RAW_LOGS_113_115.map(a=>JSON.stringify(a.ridges))).size,3);
 for(const a of RAW_LOGS_113_115){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);assert.equal(a.collision,'occupied-boxes');assert.ok(a.rings>0);}
});
for(const a of RAW_LOGS_113_115){
 test(a.name+' geometry, rotation, deterministic material and symbolic save fixture',()=>{
  for(let rotation=0;rotation<4;rotation++){
   const boxes=logBoxes(a,rotation);assert.equal(boxes.length,1+a.ridges.length);
   for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
   const mesh=logMesh(a,rotation);assert.equal(mesh.vertices.length,boxes.length*6*4*3);assert.equal(mesh.indices.length,boxes.length*6*6);
   assert.ok(mesh.indices.every(i=>Number.isInteger(i)&&i>=0&&i<mesh.vertices.length/3));
   const f=logEditFixture(a,rotation);assert.deepEqual(f.selected,{symbolicId:a.symbolicId,rotation});assert.equal(f.removed,true);assert.deepEqual(JSON.parse(f.saved),[['4,5,6',f.selected]]);
  }
  assert.equal(logMaterial(a,2,3,4,5),logMaterial(a,2,3,4,5));
  assert.throws(()=>logBoxes(a,4),RangeError);
 });
}
test('reject unknown asset and fractional sample coordinates',()=>{
 assert.throws(()=>logBoxes({ordinal:113}),TypeError);
 assert.throws(()=>logMaterial(RAW_LOGS_113_115[0],.1,0,0),TypeError);
});
