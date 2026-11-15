import test from 'node:test';
import assert from 'node:assert/strict';
import {SNOW_ORGANIC_CANDIDATES,rotatedBoxes,candidateFaceColor,candidateMesh,symbolicCellRoundtrip} from '../../../src/auto-block-catalog/biome130/snow-organics.mjs';
test('exact roster and future-only identifiers',()=>{
 assert.deepEqual(SNOW_ORGANIC_CANDIDATES.map(c=>c.id),['biome130:028','biome130:029','biome130:030']);
 assert.deepEqual(SNOW_ORGANIC_CANDIDATES.map(c=>c.futureId),[283,284,285]);
});
for(const c of SNOW_ORGANIC_CANDIDATES){
 test(c.name+' physical occupancy, rotation, deterministic mesh, symbolic edit roundtrip',()=>{
  assert.equal(c.selectable,true);assert.equal(c.replaceable,true);
  for(let r=0;r<4;r++){
   const boxes=rotatedBoxes(c,r);
   for(const b of boxes){assert.equal(b.length,6);for(const v of b)assert.ok(v>=0&&v<=1);assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
   const mesh=candidateMesh(c,r);
   assert.equal(mesh.indices.length,c.boxes.length*36);
   assert.equal(mesh.vertices.length,c.boxes.length*72);
   assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
   assert.deepEqual(mesh,candidateMesh(c,r));
   assert.deepEqual(symbolicCellRoundtrip(c,r),{symbolicId:c.id,rotation:r});
  }
  assert.deepEqual(rotatedBoxes(c,0),rotatedBoxes(c,0));
  assert.equal(candidateFaceColor(c,1,2,3,4),candidateFaceColor(c,1,2,3,4));
 });
}
test('shape and attachment semantics remain distinct',()=>{
 assert.deepEqual(SNOW_ORGANIC_CANDIDATES.map(c=>c.attachment),['ground','branch','ground']);
 assert.deepEqual(SNOW_ORGANIC_CANDIDATES.map(c=>c.solid),[true,false,true]);
 assert.equal(new Set(SNOW_ORGANIC_CANDIDATES.map(c=>c.pattern)).size,3);
});
