import test from 'node:test';
import assert from 'node:assert/strict';
import {NATURAL_STONE_101_103 as assets,stoneBoxes,stoneSample,stoneMesh,stoneEditFixture} from '../../../src/auto-block-catalog/biome130/stone-101-103.mjs';
test('three distinct raw stone families and future-only IDs',()=>{
 assert.deepEqual(assets.map(a=>a.ordinal),[101,102,103]);
 assert.deepEqual(assets.map(a=>a.futureOnlyId),[356,357,358]);
 assert.equal(new Set(assets.map(a=>a.symbolicId)).size,3);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,3);
 assert.equal(new Set(assets.map(a=>a.geology)).size,3);
});
for(const a of assets)test(a.name+' physical geometry, rotations, material, selection and symbolic save',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);
 assert.ok(a.boxes.length>=5);assert.ok(a.veins.length>=2);
 for(let r=0;r<4;r++){
  const boxes=stoneBoxes(a,r),mesh=stoneMesh(a,r);
  assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);
  for(const b of boxes){assert.ok(b.every(n=>n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  const f=stoneEditFixture(a,r);assert.deepEqual(f.selected,{symbolicId:a.symbolicId,rotation:r});assert.equal(f.removed,true);
 }
 assert.equal(stoneSample(a,4,-3,7,2),stoneSample(a,4,-3,7,2));
 assert.ok(a.palette.includes(stoneSample(a,4,-3,7,2)));
 assert.throws(()=>stoneBoxes(a,4),RangeError);
 assert.throws(()=>stoneSample(a,1.5,2,3),TypeError);
});
