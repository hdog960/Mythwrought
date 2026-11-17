import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME_ARCHITECTURE_094_096 as assets,physicalBoxes,physicalMesh,materialSample,editFixture} from '../../../src/auto-block-catalog/biome130/architecture-094-096.mjs';
test('M8 094–096 exact roster and non-persistent identities',()=>{
 assert.deepEqual(assets.map(a=>a.ordinal),[94,95,96]);
 assert.deepEqual(assets.map(a=>a.symbolicId),['biome130:094','biome130:095','biome130:096']);
 assert.deepEqual(assets.map(a=>a.futureOnlyId),[349,350,351]);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const a of assets)test(a.name+' physical geometry, rotation, material, selection, edit/save fixture',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);
 assert.equal(a.collision,'occupied');assert.equal(a.rotationCount,4);
 for(let r=0;r<4;r++){
  const boxes=physicalBoxes(a,r);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=physicalMesh(a,r);
  assert.equal(mesh.vertices.length,boxes.length*72);
  assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,physicalMesh(a,r));
  const edit=editFixture(a,r);
  assert.equal(edit.removed,true);
  assert.deepEqual(edit.selected,{symbolicId:a.symbolicId,rotation:r});
  assert.deepEqual(JSON.parse(edit.serialized),[['2,3,4',edit.selected]]);
 }
 assert.deepEqual(physicalBoxes(a,0),physicalBoxes(a,0));
 for(const bad of [-1,4,1.5,NaN])assert.throws(()=>physicalBoxes(a,bad),RangeError);
 for(let n=0;n<64;n++){const c=materialSample(a,n,2,5,n%6);assert.ok(a.palette.includes(c));assert.equal(c,materialSample(a,n,2,5,n%6));}
});
test('ice struts declare translucent physical surfaces; other components opaque',()=>{
 assert.ok(assets[1].opacity<1);assert.equal(assets[0].opacity,1);assert.equal(assets[2].opacity,1);
});
