import test from 'node:test';
import assert from 'node:assert/strict';
import {RAW_LOGS_116_118,rawLogBoxes,rawLogMaterial,rawLogMesh,rawLogEditFixture} from '../../../src/auto-block-catalog/biome130/raw-logs-116-118.mjs';
test('three exclusive symbolic raw species and future-only IDs',()=>{
 assert.deepEqual(RAW_LOGS_116_118.map(a=>a.symbolicId),['biome130:116','biome130:117','biome130:118']);
 assert.deepEqual(RAW_LOGS_116_118.map(a=>a.futureOnlyId),[371,372,373]);
 assert.equal(new Set(RAW_LOGS_116_118.map(a=>JSON.stringify([a.core,a.ridges,a.knots]))).size,3);
 for(const a of RAW_LOGS_116_118){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);assert.equal(a.collision,'occupied-boxes');assert.ok(a.rings>0);}
});
for(const a of RAW_LOGS_116_118)test(a.name+' physical boxes, rotation, indexed mesh and symbolic save roundtrip',()=>{
 for(let rotation=0;rotation<4;rotation++){
  const boxes=rawLogBoxes(a,rotation);assert.equal(boxes.length,1+a.ridges.length+a.knots.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  const mesh=rawLogMesh(a,rotation);assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>Number.isInteger(i)&&i>=0&&i<mesh.vertices.length/3));
  const f=rawLogEditFixture(a,rotation);assert.deepEqual(f.selected,{symbolicId:a.symbolicId,rotation});assert.equal(f.removed,true);assert.deepEqual(JSON.parse(f.saved),[['4,5,6',f.selected]]);
 }
 assert.equal(rawLogMaterial(a,2,3,4,5),rawLogMaterial(a,2,3,4,5));
 assert.throws(()=>rawLogBoxes(a,4),RangeError);
});
test('reject unregistered descriptor and fractional material sample',()=>{assert.throws(()=>rawLogBoxes({ordinal:116}),TypeError);assert.throws(()=>rawLogMaterial(RAW_LOGS_116_118[0],.5,0,0),TypeError);});
