import test from 'node:test';
import assert from 'node:assert/strict';
import {ENCHANTED_ROOT_CANDIDATES,orientedBoxes,rootMaterial,rootMesh,rootEditFixture} from '../../../src/auto-block-catalog/biome130/enchanted-roots.mjs';
test('exact Issue 117 roster positions, prospective IDs and distinct construction',()=>{
 const c=ENCHANTED_ROOT_CANDIDATES;
 assert.deepEqual(c.map(x=>x.id),['biome130:034','biome130:035','biome130:036']);
 assert.deepEqual(c.map(x=>x.prospectiveId),[289,290,291]);
 assert.equal(new Set(c.map(x=>x.pattern)).size,3);
 assert.equal(new Set(c.map(x=>x.seed)).size,3);
 assert.deepEqual(c.map(x=>x.boxes.length),[4,5,4]);
});
for(const c of ENCHANTED_ROOT_CANDIDATES)test(c.name+' physical shape, rotation, mesh and reversible edit',()=>{
 assert.equal(c.selectable,true);assert.equal(c.replaceable,true);assert.equal(c.collision,'occupied');
 assert.ok(c.veins.length>=2);
 for(let turns=0;turns<4;turns++){
  const boxes=orientedBoxes(c,turns);
  for(const b of boxes){
   assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));
   assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);
  }
  const mesh=rootMesh(c,turns);
  assert.equal(mesh.vertices.length,c.boxes.length*72);
  assert.equal(mesh.indices.length,c.boxes.length*36);
  assert.ok(mesh.indices.every(n=>n>=0&&n<mesh.vertices.length/3));
  assert.deepEqual(mesh,rootMesh(c,turns));
  assert.deepEqual(rootEditFixture(c,turns),{restored:{symbolicId:c.id,orientation:turns},removed:null});
 }
 assert.equal(rootMaterial(c,9,-3,11,2),rootMaterial(c,9,-3,11,2));
});
test('hollow trunk has genuine empty center column',()=>{
 const c=ENCHANTED_ROOT_CANDIDATES[2];
 for(let t=0;t<4;t++)assert.ok(orientedBoxes(c,t).every(b=>!(b[0]<.5&&b[3]>.5&&b[2]<.5&&b[5]>.5)));
});
test('reject invalid orientation',()=>{
 for(const c of ENCHANTED_ROOT_CANDIDATES)for(const t of [-1,4,NaN,1.5])assert.throws(()=>orientedBoxes(c,t),RangeError);
});
