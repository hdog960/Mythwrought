import test from 'node:test';
import assert from 'node:assert/strict';
import {NATURAL_LEAVES_122_124,naturalLeafBoxes,naturalLeafSample,naturalLeafMesh,naturalLeafEditFixture} from '../../../src/auto-block-catalog/biome130/natural-leaves-122-124.mjs';
test('unique species and reserved symbolic identities',()=>{
 assert.deepEqual(NATURAL_LEAVES_122_124.map(a=>a.symbolicId),['biome130:122','biome130:123','biome130:124']);
 assert.deepEqual(NATURAL_LEAVES_122_124.map(a=>a.futureOnlyId),[377,378,379]);
 assert.equal(new Set(NATURAL_LEAVES_122_124.map(a=>JSON.stringify(a.lobes))).size,3);
 for(const a of NATURAL_LEAVES_122_124){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.solid,false);assert.equal(a.transparent,true);assert.equal(a.collision,'none');assert.equal(a.selection,'occupied-boxes');assert.ok(Object.isFrozen(a.lobes));}
});
for(const a of NATURAL_LEAVES_122_124)test(a.name+' rotated physical selection geometry, mesh, cutout and symbolic edit',()=>{
 for(let r=0;r<4;r++){const boxes=naturalLeafBoxes(a,r);assert.equal(boxes.length,1+a.lobes.length);
 for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(n=>Number.isFinite(n)&&n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
 const mesh=naturalLeafMesh(a,r);assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);assert.equal(mesh.alphaMode,'cutout');assert.equal(mesh.collision,'none');assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));
 const edit=naturalLeafEditFixture(a,r);assert.deepEqual(edit.selected,{symbolicId:a.symbolicId,rotation:r});assert.equal(edit.removed,true);assert.deepEqual(JSON.parse(edit.saved),[['2,3,4',edit.selected]]);
 }assert.deepEqual(naturalLeafBoxes(a,0),naturalLeafBoxes(a,4%4));assert.deepEqual(naturalLeafSample(a,1,2,3),naturalLeafSample(a,1,2,3));assert.throws(()=>naturalLeafBoxes(a,4),RangeError);
});
test('reject forged descriptor and fractional sample',()=>{assert.throws(()=>naturalLeafBoxes({...NATURAL_LEAVES_122_124[0]}),TypeError);assert.throws(()=>naturalLeafSample(NATURAL_LEAVES_122_124[0],.5,0,0),TypeError);});
