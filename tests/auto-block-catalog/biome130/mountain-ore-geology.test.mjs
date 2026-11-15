import test from 'node:test';
import assert from 'node:assert/strict';
import {MOUNTAIN_ORE_GEOLOGY,oreBoxes,oreSurface,oreMesh,oreEditFixture} from '../../../src/auto-block-catalog/biome130/mountain-ore-geology.mjs';
test('strict roster, future-only ID range, and distinct physical and mineral signatures',()=>{
 assert.deepEqual(MOUNTAIN_ORE_GEOLOGY.map(a=>a.id),['biome130:052','biome130:053','biome130:054']);
 assert.deepEqual(MOUNTAIN_ORE_GEOLOGY.map(a=>a.prospectiveId),[307,308,309]);
 for(const key of ['kind','boxes','palette','veins'])assert.equal(new Set(MOUNTAIN_ORE_GEOLOGY.map(a=>JSON.stringify(a[key]))).size,3);
});
for(const a of MOUNTAIN_ORE_GEOLOGY)test(a.name+' physical rotation, material, mesh and symbolic edit roundtrip',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.collision,'occupied');assert.equal(a.opacity,'opaque');
 for(let r=0;r<4;r++){
  const boxes=oreBoxes(a,r);assert.equal(boxes.length,a.boxes.length);
  for(const b of boxes){assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=oreMesh(a,r);assert.equal(mesh.vertices.length,a.boxes.length*72);assert.equal(mesh.indices.length,a.boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));assert.deepEqual(mesh,oreMesh(a,r));
  const e=oreEditFixture(a,r);assert.equal(e.removed,true);assert.deepEqual(e.selected,{symbolicId:a.id,rotation:r});
  assert.deepEqual(JSON.parse(e.snapshot),[['0,0,0',{symbolicId:a.id,rotation:r}]]);
 }
 assert.deepEqual(oreBoxes(a,0),oreBoxes(a,4-4));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>oreBoxes(a,r),RangeError);
 for(let i=0;i<100;i++){const c=oreSurface(a,i,2,7,i%6);assert.ok(a.palette.includes(c));assert.equal(c,oreSurface(a,i,2,7,i%6));}
});
