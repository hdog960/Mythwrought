import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME_ARCHITECTURE_091_093 as assets,architectureBoxes,architectureSample,architectureMesh,architectureEditFixture} from '../../../src/auto-block-catalog/biome130/architecture-091-093.mjs';
test('M8 exact roster, exclusive symbolic identities and future-only IDs',()=>{
 assert.deepEqual(assets.map(a=>a.ordinal),[91,92,93]);
 assert.deepEqual(assets.map(a=>a.symbolicId),['biome130:091','biome130:092','biome130:093']);
 assert.deepEqual(assets.map(a=>a.futureOnlyId),[346,347,348]);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const asset of assets)test(asset.name+' physical rotation, indexed geometry, deterministic materials and symbolic edit/save',()=>{
 assert.equal(asset.selectable,true);assert.equal(asset.replaceable,true);assert.equal(asset.solid,true);assert.equal(asset.collision,'occupied');
 for(let r=0;r<4;r++){
  const boxes=architectureBoxes(asset,r);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  assert.deepEqual(architectureBoxes(asset,(r+4)%4),boxes);
  const mesh=architectureMesh(asset,r);
  assert.equal(mesh.vertices.length,boxes.length*72);
  assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
  assert.deepEqual(mesh,architectureMesh(asset,r));
  const edit=architectureEditFixture(asset,r);
  assert.equal(edit.removed,true);assert.deepEqual(edit.selected,{symbolicId:asset.symbolicId,rotation:r});
  assert.deepEqual(JSON.parse(edit.saved),[['2,3,4',edit.selected]]);
 }
 assert.deepEqual(architectureBoxes(asset,0),architectureBoxes(asset,0));
 for(const bad of [-1,4,1.5,NaN])assert.throws(()=>architectureBoxes(asset,bad),RangeError);
 for(let n=0;n<64;n++){const color=architectureSample(asset,n,2,5,n%6);assert.ok(asset.palette.includes(color));assert.equal(color,architectureSample(asset,n,2,5,n%6));}
});
test('windcatcher and louvers have physically open air gaps, not opaque full-cube aliases',()=>{
 for(const a of assets.slice(1)){const occupied=architectureBoxes(a).reduce((sum,b)=>sum+(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),0);assert.ok(occupied<.85);}
});
