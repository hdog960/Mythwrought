import test from 'node:test';
import assert from 'node:assert/strict';
import {MOUNTAIN_CLIFF_SURFACES,cliffBoxes,cliffColor,cliffMesh,cliffEditFixture} from '../../../src/auto-block-catalog/biome130/mountain-cliff-surfaces.mjs';
test('exact ordered roster, reserved future IDs and distinct physical shapes',()=>{
 assert.deepEqual(MOUNTAIN_CLIFF_SURFACES.map(a=>a.id),['biome130:055','biome130:056','biome130:057']);
 assert.deepEqual(MOUNTAIN_CLIFF_SURFACES.map(a=>a.prospectiveId),[310,311,312]);
 assert.equal(new Set(MOUNTAIN_CLIFF_SURFACES.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const a of MOUNTAIN_CLIFF_SURFACES)test(a.name+' geometry, orientation, palette and symbolic edit roundtrip',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.collision,'occupied');assert.equal(a.opacity,'opaque');
 for(let r=0;r<4;r++){
  const boxes=cliffBoxes(a,r);assert.equal(boxes.length,a.boxes.length);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=cliffMesh(a,r);assert.equal(mesh.vertices.length,a.boxes.length*72);assert.equal(mesh.indices.length,a.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));assert.deepEqual(mesh,cliffMesh(a,r));
  const edit=cliffEditFixture(a,r);assert.equal(edit.removed,true);assert.deepEqual(edit.selected,{symbolicId:a.id,rotation:r});
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:a.id,rotation:r}]]);
 }
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>cliffBoxes(a,r),RangeError);
 for(let i=0;i<128;i++){const c=cliffColor(a,i,2,7,i%6);assert.ok(a.palette.includes(c));assert.equal(c,cliffColor(a,i,2,7,i%6));}
});
