import test from 'node:test';
import assert from 'node:assert/strict';
import {NATURAL_LEAVES_128_130 as families,leafBoxes,leafMaterial,leafMesh,leafEditFixture} from '../../../src/auto-block-catalog/biome130/natural-leaves-128-130.mjs';
test('exact roster, isolated IDs, unique physical profiles',()=>{
 assert.deepEqual(families.map(a=>a.ordinal),[128,129,130]);
 assert.deepEqual(families.map(a=>a.symbolicId),['biome130:128','biome130:129','biome130:130']);
 assert.deepEqual(families.map(a=>a.futureOnlyId),[383,384,385]);
 assert.equal(new Set(families.map(a=>JSON.stringify(a.lobes))).size,3);
 for(const a of families){assert.equal(a.collision,'none');assert.equal(a.selectable,true);assert.equal(a.solid,false);
  assert.equal(a.alpha,'cutout');assert.ok(a.lobes.length>=4);
  for(let r=0;r<4;r++){const boxes=leafBoxes(a,r);
   for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
   const mesh=leafMesh(a,r);assert.equal(mesh.vertices.length,boxes.length*6*4*3);
   assert.equal(mesh.indices.length,boxes.length*6*6);
   assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
   const edit=leafEditFixture(a,r);assert.deepEqual(edit.selected,{symbolicId:a.symbolicId,rotation:r});
   assert.equal(edit.removed,true);assert.deepEqual(JSON.parse(edit.saved)[0][1],edit.selected);
  }
  assert.deepEqual(leafBoxes(a,0),leafBoxes(a,4-4));
  assert.deepEqual(leafMaterial(a,4,2,-8),leafMaterial(a,4,2,-8));
 }
});
test('reject unknown identities, rotations and fractional sampling',()=>{
 assert.throws(()=>leafBoxes({},0),TypeError);
 assert.throws(()=>leafBoxes(families[0],4),RangeError);
 assert.throws(()=>leafEditFixture(families[0],-1),RangeError);
 assert.throws(()=>leafMaterial(families[0],1.5,2,3),TypeError);
});
