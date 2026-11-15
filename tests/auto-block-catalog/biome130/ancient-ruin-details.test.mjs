import test from 'node:test';
import assert from 'node:assert/strict';
import {ANCIENT_RUIN_DETAILS,detailBoxes,detailMaterial,detailMesh,detailEditFixture} from '../../../src/auto-block-catalog/biome130/ancient-ruin-details.mjs';
test('M5 exact roster and disjoint symbolic and future-only numeric identities',()=>{
 assert.deepEqual(ANCIENT_RUIN_DETAILS.map(a=>a.name),['Individual keystones','Broken vault ribs','Fractured plinth bases']);
 assert.deepEqual(ANCIENT_RUIN_DETAILS.map(a=>a.id),['biome130:064','biome130:065','biome130:066']);
 assert.deepEqual(ANCIENT_RUIN_DETAILS.map(a=>a.prospectiveId),[319,320,321]);
 assert.equal(new Set(ANCIENT_RUIN_DETAILS.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const a of ANCIENT_RUIN_DETAILS)test(a.name+' physical occupancy, orientation, deterministic mesh and symbolic edit fixture',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);
 assert.equal(a.collision,'occupied');assert.equal(a.opacity,'opaque');assert.equal(a.attachment,'ground');
 assert.equal(a.rotationCount,4);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=detailBoxes(a,rotation);assert.equal(boxes.length,a.boxes.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const m=detailMesh(a,rotation);assert.equal(m.vertices.length,boxes.length*72);assert.equal(m.indices.length,boxes.length*36);
  assert.ok(m.indices.every(i=>i>=0&&i<m.vertices.length/3));assert.deepEqual(m,detailMesh(a,rotation));
  const f=detailEditFixture(a,rotation);assert.equal(f.removed,true);assert.deepEqual(f.selected,{symbolicId:a.id,rotation});
  assert.deepEqual(JSON.parse(f.snapshot),[['0,0,0',{symbolicId:a.id,rotation}]]);
 }
 for(const invalid of [-1,4,NaN,1.5])assert.throws(()=>detailBoxes(a,invalid),RangeError);
 for(let i=0;i<128;i++){const c=detailMaterial(a,i,2,7,i%6);assert.ok(a.palette.includes(c));assert.equal(c,detailMaterial(a,i,2,7,i%6));}
});
