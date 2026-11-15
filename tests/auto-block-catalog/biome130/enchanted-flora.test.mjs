import test from 'node:test';
import assert from 'node:assert/strict';
import {ENCHANTED_FLORA,floraBoxes,floraMaterial,floraMesh,floraEditFixture} from '../../../src/auto-block-catalog/biome130/enchanted-flora.mjs';
test('strict roster, unique symbolic and future-only identifiers',()=>{
 assert.deepEqual(ENCHANTED_FLORA.map(a=>a.id),['biome130:040','biome130:041','biome130:042']);
 assert.deepEqual(ENCHANTED_FLORA.map(a=>a.prospectiveId),[295,296,297]);
 assert.equal(new Set(ENCHANTED_FLORA.map(a=>a.kind)).size,3);
});
for(const asset of ENCHANTED_FLORA)test(asset.name+' four rotations, occupancy, deterministic mesh and symbolic edits',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=floraBoxes(asset,rotation);
  for(const b of boxes){assert.ok(b.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=floraMesh(asset,rotation);
  assert.equal(mesh.vertices.length,asset.boxes.length*72);
  assert.equal(mesh.indices.length,asset.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,floraMesh(asset,rotation));
  const edit=floraEditFixture(asset,rotation);
  assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation});assert.equal(edit.removed,true);
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation}]]);
 }
 assert.equal(floraMaterial(asset,7,-3,9,2),floraMaterial(asset,7,-3,9,2));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>floraBoxes(asset,r),RangeError);
});
test('distinct attachment, solidity and transparency contracts',()=>{
 assert.deepEqual(ENCHANTED_FLORA.map(a=>a.attachment),['ground','ground','wall']);
 assert.deepEqual(ENCHANTED_FLORA.map(a=>a.collision),['occupied','none','none']);
 assert.deepEqual(ENCHANTED_FLORA.map(a=>a.opacity),['translucent','cutout','cutout']);
});
