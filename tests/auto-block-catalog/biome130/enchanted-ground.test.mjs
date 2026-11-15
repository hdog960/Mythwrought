import test from 'node:test';
import assert from 'node:assert/strict';
import {ENCHANTED_GROUND_CANDIDATES,rotateOccupancy,materialSample,surfacePrototype,symbolicEditFixture} from '../../../src/auto-block-catalog/biome130/enchanted-ground.mjs';
test('roster, non-overlapping prospective band and distinct material/physical semantics',()=>{
 const c=ENCHANTED_GROUND_CANDIDATES;
 assert.deepEqual(c.map(x=>x.id),['biome130:031','biome130:032','biome130:033']);
 assert.deepEqual(c.map(x=>x.prospectiveId),[286,287,288]);
 assert.equal(new Set(c.map(x=>x.pattern)).size,3);
 assert.equal(new Set(c.map(x=>x.seed)).size,3);
 assert.deepEqual(c.map(x=>x.collision),['occupied','none','none']);
 assert.deepEqual(c.map(x=>x.opacity),['opaque','cutout','cutout']);
});
for(const c of ENCHANTED_GROUND_CANDIDATES){
 test(c.name+' independent selectable geometry and reversible symbolic edit',()=>{
  assert.equal(c.selectable,true);assert.equal(c.replaceable,true);
  for(let r=0;r<4;r++){
   const boxes=rotateOccupancy(c,r);
   for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
   const m=surfacePrototype(c,r);
   assert.equal(m.indices.length,c.boxes.length*36);
   assert.equal(m.vertices.length,c.boxes.length*72);
   assert.ok(m.indices.every(i=>i>=0&&i<m.vertices.length/3));
   assert.deepEqual(m,surfacePrototype(c,r));
   assert.deepEqual(symbolicEditFixture(c,r),{placed:{id:c.id,orientation:r},removed:null});
  }
  assert.deepEqual(rotateOccupancy(c,0),rotateOccupancy(c,4-4));
  assert.equal(materialSample(c,4,-2,7,3),materialSample(c,4,-2,7,3));
  assert.ok(c.accents.length>=2);
 });
}
test('invalid rotations rejected',()=>{
 for(const c of ENCHANTED_GROUND_CANDIDATES)for(const n of [-1,4,1.5,NaN])assert.throws(()=>rotateOccupancy(c,n),RangeError);
});
