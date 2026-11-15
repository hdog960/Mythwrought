import test from 'node:test';
import assert from 'node:assert/strict';
import {MOUNTAIN_FINAL_GEOLOGY,finalMountainBoxes,finalMountainColor,finalMountainMesh,finalMountainEditFixture} from '../../../src/auto-block-catalog/biome130/mountain-final-geology.mjs';
test('exact mountain roster and isolated future ID band',()=>{
 assert.deepEqual(MOUNTAIN_FINAL_GEOLOGY.map(a=>a.name),['Natural cliff salt deposits','Snowmelt-eroded stone','Geothermal mountain rock']);
 assert.deepEqual(MOUNTAIN_FINAL_GEOLOGY.map(a=>a.id),['biome130:058','biome130:059','biome130:060']);
 assert.deepEqual(MOUNTAIN_FINAL_GEOLOGY.map(a=>a.prospectiveId),[313,314,315]);
 assert.equal(new Set(MOUNTAIN_FINAL_GEOLOGY.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const asset of MOUNTAIN_FINAL_GEOLOGY)test(asset.name+' physical geometry, rotation, surface and symbolic save',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);assert.equal(asset.solid,true);assert.equal(asset.collision,'occupied');
 for(let r=0;r<4;r++){
  const boxes=finalMountainBoxes(asset,r);
  assert.equal(boxes.length,asset.boxes.length);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=finalMountainMesh(asset,r);
  assert.equal(mesh.vertices.length,asset.boxes.length*72);assert.equal(mesh.indices.length,asset.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));assert.deepEqual(mesh,finalMountainMesh(asset,r));
  const edit=finalMountainEditFixture(asset,r);
  assert.equal(edit.removed,true);assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation:r});
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation:r}]]);
 }
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>finalMountainBoxes(asset,r),RangeError);
 for(let i=0;i<128;i++){const c=finalMountainColor(asset,i,2,7,i%6);assert.ok(asset.palette.includes(c));assert.equal(c,finalMountainColor(asset,i,2,7,i%6));}
});
