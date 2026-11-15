import test from 'node:test';
import assert from 'node:assert/strict';
import {ANCIENT_RUIN_FOUNDATIONS,ruinBoxes,ruinMaterial,ruinMesh,ruinEditFixture} from '../../../src/auto-block-catalog/biome130/ancient-ruin-foundations.mjs';
test('authoritative M5 opening roster, unique symbolic IDs, future-only numeric IDs',()=>{
 assert.deepEqual(ANCIENT_RUIN_FOUNDATIONS.map(a=>a.name),['Cyclopean ancient stone blocks','Collapsed lintel segments','Arch springer wedges']);
 assert.deepEqual(ANCIENT_RUIN_FOUNDATIONS.map(a=>a.id),['biome130:061','biome130:062','biome130:063']);
 assert.deepEqual(ANCIENT_RUIN_FOUNDATIONS.map(a=>a.prospectiveId),[316,317,318]);
 assert.equal(new Set(ANCIENT_RUIN_FOUNDATIONS.map(a=>JSON.stringify(a.boxes))).size,3);
});
for(const a of ANCIENT_RUIN_FOUNDATIONS)test(a.name+' occupied shape, rotated mesh, selection and symbolic edit roundtrip',()=>{
 assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,true);
 assert.equal(a.collision,'occupied');assert.equal(a.opacity,'opaque');assert.equal(a.attachment,'ground');
 assert.equal(a.rotationCount,4);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=ruinBoxes(a,rotation);assert.equal(boxes.length,a.boxes.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(v=>Number.isFinite(v)&&v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}
  const m=ruinMesh(a,rotation);assert.equal(m.vertices.length,boxes.length*72);assert.equal(m.indices.length,boxes.length*36);
  assert.ok(m.indices.every(i=>i>=0&&i<m.vertices.length/3));assert.deepEqual(m,ruinMesh(a,rotation));
  const f=ruinEditFixture(a,rotation);assert.equal(f.removed,true);assert.deepEqual(f.selected,{symbolicId:a.id,rotation});
  assert.deepEqual(JSON.parse(f.snapshot),[['0,0,0',{symbolicId:a.id,rotation}]]);
 }
 assert.deepEqual(ruinBoxes(a,0),ruinBoxes(a,4-4));
 for(const invalid of [-1,4,NaN,1.5])assert.throws(()=>ruinBoxes(a,invalid),RangeError);
 for(let i=0;i<128;i++){const c=ruinMaterial(a,i,2,7,i%6);assert.ok(a.palette.includes(c));assert.equal(c,ruinMaterial(a,i,2,7,i%6));}
});
