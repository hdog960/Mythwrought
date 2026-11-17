import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME_ARCHITECTURE_097_100 as assets,rotatedBoxes,materialSample,physicalMesh,editFixture} from '../../../src/auto-block-catalog/biome130/architecture-097-100.mjs';
test('exact M8 roster and unique symbolic / future-only identities',()=>{
 assert.deepEqual(assets.map(a=>a.ordinal),[97,98,99,100]);
 assert.deepEqual(assets.map(a=>a.futureOnlyId),[352,353,354,355]);
 assert.equal(new Set(assets.map(a=>a.symbolicId)).size,4);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,4);
});
for(const asset of assets)test(asset.name+' physical mesh, four rotations, deterministic material, reversible symbolic edit',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);assert.equal(asset.solid,true);
 assert.ok(['wall','ground'].includes(asset.attachment));
 assert.ok(asset.boxes.length>=7);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=rotatedBoxes(asset,rotation),mesh=physicalMesh(asset,rotation);
  assert.equal(mesh.vertices.length,boxes.length*6*4*3);
  assert.equal(mesh.indices.length,boxes.length*6*6);
  for(const b of boxes){assert.equal(b.length,6);for(const n of b)assert.ok(n>=0&&n<=1);assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  const fixture=editFixture(asset,rotation);
  assert.deepEqual(fixture.selected,{symbolicId:asset.symbolicId,rotation});assert.equal(fixture.removed,true);
  assert.ok(fixture.saved.includes(asset.symbolicId));
 }
 assert.equal(materialSample(asset,4,-3,7,2),materialSample(asset,4,-3,7,2));
 assert.ok(asset.palette.includes(materialSample(asset,4,-3,7,2)));
 assert.throws(()=>rotatedBoxes(asset,4),RangeError);
});
