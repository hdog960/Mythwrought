import test from 'node:test';
import assert from 'node:assert/strict';
import {ENCHANTED_WOOD,woodBoxes,woodSurface,woodMesh,woodEditFixture} from '../../../src/auto-block-catalog/biome130/enchanted-wood.mjs';
test('exact roster and isolated prospective IDs',()=>{
assert.deepEqual(ENCHANTED_WOOD.map(a=>a.id),['biome130:043','biome130:044','biome130:045']);
assert.deepEqual(ENCHANTED_WOOD.map(a=>a.prospectiveId),[298,299,300]);
assert.equal(new Set(ENCHANTED_WOOD.map(a=>a.kind)).size,3);
});
for(const asset of ENCHANTED_WOOD)test(asset.name+' four rotations, mesh and symbolic edits',()=>{
assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);
for(let r=0;r<4;r++){
const boxes=woodBoxes(asset,r);
for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
const mesh=woodMesh(asset,r);
assert.equal(mesh.vertices.length,asset.boxes.length*72);
assert.equal(mesh.indices.length,asset.boxes.length*36);
assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
assert.deepEqual(mesh,woodMesh(asset,r));
const edit=woodEditFixture(asset,r);
assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation:r});assert.equal(edit.removed,true);
assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation:r}]]);
}
assert.equal(woodSurface(asset,4,-3,8,2),woodSurface(asset,4,-3,8,2));
for(const r of [-1,4,NaN,1.5])assert.throws(()=>woodBoxes(asset,r),RangeError);
});
test('distinct attachment, solidity and transparency',()=>{
assert.deepEqual(ENCHANTED_WOOD.map(a=>a.attachment),['trunk','wall','wall']);
assert.deepEqual(ENCHANTED_WOOD.map(a=>a.collision),['occupied','none','none']);
assert.deepEqual(ENCHANTED_WOOD.map(a=>a.opacity),['opaque','cutout','cutout']);
});
