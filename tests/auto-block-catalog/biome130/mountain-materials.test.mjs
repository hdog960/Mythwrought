import test from 'node:test';
import assert from 'node:assert/strict';
import {MOUNTAIN_MATERIALS,materialBoxes,materialColor,materialMesh,materialEditFixture} from '../../../src/auto-block-catalog/biome130/mountain-materials.mjs';
test('exact mountain roster, stable symbolic identities and non-live future reservations',()=>{
 assert.deepEqual(MOUNTAIN_MATERIALS.map(a=>a.id),['biome130:049','biome130:050','biome130:051']);
 assert.deepEqual(MOUNTAIN_MATERIALS.map(a=>a.prospectiveId),[304,305,306]);
 assert.equal(new Set(MOUNTAIN_MATERIALS.map(a=>a.kind)).size,3);
 assert.equal(new Set(MOUNTAIN_MATERIALS.map(a=>JSON.stringify(a.boxes))).size,3);
 assert.equal(new Set(MOUNTAIN_MATERIALS.map(a=>JSON.stringify(a.palette))).size,3);
});
for(const asset of MOUNTAIN_MATERIALS)test(asset.name+' physical geometry, rotation, mesh, deterministic color and reversible symbolic edits',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);
 assert.equal(asset.collision,'occupied');assert.equal(asset.rotationCount,4);
 for(let r=0;r<4;r++){
  const boxes=materialBoxes(asset,r);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=materialMesh(asset,r);
  assert.equal(mesh.vertices.length,asset.boxes.length*72);
  assert.equal(mesh.indices.length,asset.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,materialMesh(asset,r));
  const edit=materialEditFixture(asset,r);
  assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation:r});
  assert.equal(edit.removed,true);
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation:r}]]);
 }
 assert.equal(materialColor(asset,4,-3,8,2),materialColor(asset,4,-3,8,2));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>materialBoxes(asset,r),RangeError);
});
