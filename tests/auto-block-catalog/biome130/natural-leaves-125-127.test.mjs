import test from 'node:test';
import assert from 'node:assert/strict';
import {NATURAL_LEAVES_125_127,leafBoxes,leafMaterial,leafMesh,leafEditFixture} from '../../../src/auto-block-catalog/biome130/natural-leaves-125-127.mjs';
test('exclusive stable IDs, independent physical foliage geometry and no solid collision',()=>{
 assert.deepEqual(NATURAL_LEAVES_125_127.map(a=>a.symbolicId),['biome130:125','biome130:126','biome130:127']);
 assert.deepEqual(NATURAL_LEAVES_125_127.map(a=>a.futureOnlyId),[380,381,382]);
 assert.equal(new Set(NATURAL_LEAVES_125_127.map(a=>JSON.stringify(a.lobes))).size,3);
 for(const a of NATURAL_LEAVES_125_127){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,false);assert.equal(a.collision,'none');assert.equal(a.selection,'occupied-boxes');assert.equal(a.alpha,'cutout');assert.ok(Object.isFrozen(a.lobes));}
});
for(const a of NATURAL_LEAVES_125_127)test(a.name+' orientation, mesh bounds, symbolic save and removal',()=>{
 for(let r=0;r<4;r++){
  const boxes=leafBoxes(a,r);assert.equal(boxes.length,1+a.lobes.length);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  const m=leafMesh(a,r);assert.equal(m.vertices.length,boxes.length*72);assert.equal(m.indices.length,boxes.length*36);assert.equal(m.alphaMode,'cutout');assert.equal(m.collision,'none');assert.ok(m.indices.every(i=>i>=0&&i<m.vertices.length/3));
  const edit=leafEditFixture(a,r);assert.deepEqual(edit.selected,{symbolicId:a.symbolicId,rotation:r});assert.equal(edit.removed,true);assert.deepEqual(JSON.parse(edit.saved),[['2,3,4',edit.selected]]);
 }
 assert.deepEqual(leafMaterial(a,2,3,4),leafMaterial(a,2,3,4));
 assert.deepEqual(leafBoxes(a,0),leafBoxes(a,3+1-4));
 assert.throws(()=>leafBoxes(a,4),RangeError);
});
test('invalid descriptors and fractional samples rejected',()=>{
 assert.throws(()=>leafBoxes({...NATURAL_LEAVES_125_127[0]}),TypeError);
 assert.throws(()=>leafMaterial(NATURAL_LEAVES_125_127[0],.5,0,0),TypeError);
});
