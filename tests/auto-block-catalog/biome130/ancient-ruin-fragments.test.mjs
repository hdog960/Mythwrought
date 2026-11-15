import test from 'node:test';
import assert from 'node:assert/strict';
import {ANCIENT_RUIN_FRAGMENTS,fragmentBoxes,fragmentMaterial,fragmentMesh,fragmentEditFixture} from '../../../src/auto-block-catalog/biome130/ancient-ruin-fragments.mjs';
test('M5 roster identity, uniqueness and future-only ID band',()=>{
 assert.deepEqual(ANCIENT_RUIN_FRAGMENTS.map(a=>a.ordinal),[67,68,69,70]);
 assert.deepEqual(ANCIENT_RUIN_FRAGMENTS.map(a=>a.id),['biome130:067','biome130:068','biome130:069','biome130:070']);
 assert.deepEqual(ANCIENT_RUIN_FRAGMENTS.map(a=>a.prospectiveId),[322,323,324,325]);
 assert.equal(new Set(ANCIENT_RUIN_FRAGMENTS.map(a=>JSON.stringify(a.boxes))).size,4);
});
for(const a of ANCIENT_RUIN_FRAGMENTS)test(a.name+' physical geometry, selection, rotation, mesh and edit/save fixtures',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);
 assert.equal(a.collision,'occupied');assert.equal(a.attachment,'ground');assert.equal(a.opacity,'opaque');
 for(let r=0;r<4;r++){
  const boxes=fragmentBoxes(a,r);assert.equal(boxes.length,a.boxes.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const mesh=fragmentMesh(a,r);assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));assert.deepEqual(mesh,fragmentMesh(a,r));
  const edit=fragmentEditFixture(a,r);assert.equal(edit.removed,true);assert.deepEqual(edit.selected,{symbolicId:a.id,rotation:r});
  assert.deepEqual(JSON.parse(edit.snapshot),[['0,0,0',{symbolicId:a.id,rotation:r}]]);
 }
 assert.deepEqual(fragmentBoxes(a,0),fragmentBoxes(a,0));
 for(const r of [-1,4,NaN,1.5])assert.throws(()=>fragmentBoxes(a,r),RangeError);
 for(let i=0;i<100;i++){const c=fragmentMaterial(a,i,3,7,i%6);assert.ok(a.palette.includes(c));assert.equal(c,fragmentMaterial(a,i,3,7,i%6));}
});
