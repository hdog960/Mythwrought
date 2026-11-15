import test from 'node:test';
import assert from 'node:assert/strict';
import {ENCHANTED_GEOLOGY,geologyBoxes,geologySurface,geologyMesh,geologyEditFixture} from '../../../src/auto-block-catalog/biome130/enchanted-geology.mjs';
test('exact roster and future-only unique identifiers',()=>{
 assert.deepEqual(ENCHANTED_GEOLOGY.map(a=>a.id),['biome130:037','biome130:038','biome130:039']);
 assert.deepEqual(ENCHANTED_GEOLOGY.map(a=>a.prospectiveId),[292,293,294]);
 assert.equal(new Set(ENCHANTED_GEOLOGY.map(a=>a.kind)).size,3);
 assert.deepEqual(ENCHANTED_GEOLOGY.map(a=>a.boxes.length),[4,3,4]);
});
for(const asset of ENCHANTED_GEOLOGY)test(asset.name+' rotation, selection, geometry and reversible symbolic edits',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=geologyBoxes(asset,rotation);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=geologyMesh(asset,rotation);
  assert.equal(mesh.vertices.length,asset.boxes.length*72);
  assert.equal(mesh.indices.length,asset.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,geologyMesh(asset,rotation));
  const edit=geologyEditFixture(asset,rotation);
  assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation});
  assert.equal(edit.removed,true);
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation}]]);
 }
 assert.equal(geologySurface(asset,12,-4,7,2),geologySurface(asset,12,-4,7,2));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>geologyBoxes(asset,r),RangeError);
});
test('sap veins are non-solid wall-attached while stones occupy cells',()=>{
 assert.equal(ENCHANTED_GEOLOGY[0].attachment,'wall');
 assert.equal(ENCHANTED_GEOLOGY[0].collision,'none');
 assert.equal(ENCHANTED_GEOLOGY[0].opacity,'cutout');
 assert.ok(ENCHANTED_GEOLOGY[0].emissive>ENCHANTED_GEOLOGY[1].emissive);
 assert.ok(ENCHANTED_GEOLOGY.slice(1).every(a=>a.solid&&a.collision==='occupied'));
});
