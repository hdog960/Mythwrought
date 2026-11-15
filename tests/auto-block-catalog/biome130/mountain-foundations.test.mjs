import test from 'node:test';
import assert from 'node:assert/strict';
import {MOUNTAIN_FOUNDATIONS,mountainBoxes,mountainSurface,mountainMesh,mountainEditFixture} from '../../../src/auto-block-catalog/biome130/mountain-foundations.mjs';
test('exact mountain roster and isolated future-only identifiers',()=>{
 assert.deepEqual(MOUNTAIN_FOUNDATIONS.map(a=>a.id),['biome130:046','biome130:047','biome130:048']);
 assert.deepEqual(MOUNTAIN_FOUNDATIONS.map(a=>a.prospectiveId),[301,302,303]);
 assert.equal(new Set(MOUNTAIN_FOUNDATIONS.map(a=>a.kind)).size,3);
 assert.deepEqual(MOUNTAIN_FOUNDATIONS.map(a=>a.boxes.length),[3,3,4]);
});
for(const asset of MOUNTAIN_FOUNDATIONS)test(asset.name+' shape, rotation, deterministic surface and reversible edit',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);
 assert.equal(asset.collision,'occupied');
 for(let r=0;r<4;r++){
  const boxes=mountainBoxes(asset,r);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=mountainMesh(asset,r);
  assert.equal(mesh.vertices.length,asset.boxes.length*72);
  assert.equal(mesh.indices.length,asset.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,mountainMesh(asset,r));
  const edit=mountainEditFixture(asset,r);
  assert.deepEqual(edit.selected,{symbolicId:asset.id,rotation:r});
  assert.equal(edit.removed,true);
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:asset.id,rotation:r}]]);
 }
 assert.deepEqual(mountainBoxes(asset,0),mountainBoxes(asset,4-4));
 assert.equal(mountainSurface(asset,7,-3,9,2),mountainSurface(asset,7,-3,9,2));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>mountainBoxes(asset,r),RangeError);
});
test('mountain materials have distinct palette and physical silhouettes',()=>{
 assert.equal(new Set(MOUNTAIN_FOUNDATIONS.map(a=>JSON.stringify(a.palette))).size,3);
 assert.equal(new Set(MOUNTAIN_FOUNDATIONS.map(a=>JSON.stringify(a.boxes))).size,3);
});
