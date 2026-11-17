import test from 'node:test';
import assert from 'node:assert/strict';
import {RAW_LOGS_119_121,rawLogBoxes119,rawLogMaterial119,rawLogMesh119,rawLogEditFixture119} from '../../../src/auto-block-catalog/biome130/raw-logs-119-121.mjs';
test('three exclusive raw wood identities, no live IDs',()=>{
 assert.deepEqual(RAW_LOGS_119_121.map(a=>a.symbolicId),['biome130:119','biome130:120','biome130:121']);
 assert.deepEqual(RAW_LOGS_119_121.map(a=>a.futureOnlyId),[374,375,376]);
 assert.equal(new Set(RAW_LOGS_119_121.map(a=>JSON.stringify([a.core,a.ridges,a.knots,a.buttresses]))).size,3);
 for(const a of RAW_LOGS_119_121){assert.equal(a.selectable,true);assert.equal(a.solid,true);assert.equal(a.replaceable,true);assert.equal(a.collision,'occupied-boxes');assert.ok(a.rings>0);assert.ok(Object.isFrozen(a.ridges));}
});
for(const a of RAW_LOGS_119_121)test(a.name+' physical geometry, four rotations, indexed mesh and symbolic edit roundtrip',()=>{
 for(let r=0;r<4;r++){
  const boxes=rawLogBoxes119(a,r);
  assert.equal(boxes.length,1+a.ridges.length+a.knots.length+a.buttresses.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  const mesh=rawLogMesh119(a,r);assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>Number.isInteger(i)&&i>=0&&i<mesh.vertices.length/3));
  const fixture=rawLogEditFixture119(a,r);
  assert.deepEqual(fixture.selected,{symbolicId:a.symbolicId,rotation:r});
  assert.deepEqual(JSON.parse(fixture.saved),[['4,5,6',fixture.selected]]);
  assert.equal(fixture.removed,true);
 }
 assert.deepEqual(rawLogBoxes119(a,0),rawLogBoxes119(a,4%4));
 assert.equal(rawLogMaterial119(a,2,3,4,5),rawLogMaterial119(a,2,3,4,5));
 assert.throws(()=>rawLogBoxes119(a,4),RangeError);
});
test('reject fabricated descriptor and fractional samples',()=>{
 assert.throws(()=>rawLogBoxes119({...RAW_LOGS_119_121[0]}),TypeError);
 assert.throws(()=>rawLogMaterial119(RAW_LOGS_119_121[0],.5,0,0),TypeError);
});
