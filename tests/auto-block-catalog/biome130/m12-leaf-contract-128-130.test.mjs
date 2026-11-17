import test from 'node:test';
import assert from 'node:assert/strict';
import {
 NATURAL_LEAVES_128_130 as families, leafBoxes, leafMesh,
 leafMaterial, leafEditFixture
} from '../../../src/auto-block-catalog/biome130/natural-leaves-128-130.mjs';

const quarterTurn=([x,y,z,X,Y,Z])=>[1-Z,y,x,1-z,Y,X];
const canonical=boxes=>boxes.map(box=>box.map(n=>Number(n.toFixed(9))));

test('M12 leaf geometry rotation is a genuine four-cycle with invariant occupancy volume',()=>{
 for(const family of families){
  const original=leafBoxes(family,0);
  const volume=boxes=>boxes.reduce((sum,[x,y,z,X,Y,Z])=>sum+(X-x)*(Y-y)*(Z-z),0);
  for(let r=0;r<4;r++){
   const boxes=leafBoxes(family,r);
   assert.deepEqual(canonical(boxes),canonical(original.map(box=>{
    let b=box;for(let i=0;i<r;i++)b=quarterTurn(b);return b;
   })),family.symbolicId+' orientation '+r);
   assert.ok(Math.abs(volume(boxes)-volume(original))<1e-9);
   const mesh=leafMesh(family,r);
   assert.ok(mesh.vertices.every(Number.isFinite));
   assert.ok(mesh.indices.every(Number.isSafeInteger));
   const max=mesh.vertices.length/3;
   assert.ok(mesh.indices.every(i=>i>=0&&i<max));
   assert.equal(mesh.indices.length,boxes.length*36);
   assert.equal(mesh.vertices.length,boxes.length*72);
  }
  assert.deepEqual(canonical(original.map(b=>{
   let rotated=b;for(let i=0;i<4;i++)rotated=quarterTurn(rotated);return rotated;
  })),canonical(original));
 }
});

test('M12 symbolic IDs, immutable descriptors and reversible save fixtures remain isolated',()=>{
 assert.equal(new Set(families.map(a=>a.symbolicId)).size,3);
 for(const a of families){
  assert.equal(a.futureOnlyId,255+a.ordinal);
  assert.ok(a.futureOnlyId>255);
  assert.ok(Object.isFrozen(a));
  assert.ok(Object.isFrozen(a.palette));
  assert.ok(Object.isFrozen(a.lobes));
  assert.ok(a.lobes.every(Object.isFrozen));
  assert.equal(a.selectable,true);
  assert.equal(a.replaceable,true);
  assert.equal(a.solid,false);
  assert.equal(a.collision,'none');
  assert.equal(a.alpha,'cutout');
  for(let r=0;r<4;r++){
   const fixture=leafEditFixture(a,r);
   assert.equal(fixture.removed,true);
   assert.deepEqual(JSON.parse(fixture.saved)[0][1],fixture.selected);
   assert.deepEqual(fixture.selected,{symbolicId:a.symbolicId,rotation:r});
  }
  for(const [x,y,z,face] of [[0,0,0,0],[-9,8,7,5],[2147483647,-13,2,1]]){
   const sampled=leafMaterial(a,x,y,z,face);
   assert.ok(a.palette.includes(sampled.color));
   assert.equal(typeof sampled.visible,'boolean');
   assert.deepEqual(sampled,leafMaterial(a,x,y,z,face));
  }
 }
});

test('M12 rejects invalid rotation, foreign descriptor and invalid material coordinates',()=>{
 for(const a of families){
  for(const r of [-1,4,1.5,NaN,Infinity]){
   assert.throws(()=>leafBoxes(a,r));
   assert.throws(()=>leafMesh(a,r));
   assert.throws(()=>leafEditFixture(a,r));
  }
  for(const coordinate of [NaN,Infinity,0.25]){
   assert.throws(()=>leafMaterial(a,coordinate,0,0));
  }
 }
 assert.throws(()=>leafBoxes({...families[0]},0),TypeError);
});
