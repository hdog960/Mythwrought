// M12 source-specific acceptance: cross-PR natural leaf identity and geometry contract.
// This is opt-in candidate verification, never a production registry or world placement.
import test from 'node:test';
import assert from 'node:assert/strict';
import { NATURAL_LEAVES_122_124, naturalLeafBoxes, naturalLeafMesh, naturalLeafEditFixture } from '../../../src/auto-block-catalog/biome130/natural-leaves-122-124.mjs';
import { NATURAL_LEAVES_128_130, leafBoxes, leafMesh, leafEditFixture } from '../../../src/auto-block-catalog/biome130/natural-leaves-128-130.mjs';

const sources=[
  ...NATURAL_LEAVES_122_124.map(f=>({f,boxes:naturalLeafBoxes,mesh:naturalLeafMesh,edit:naturalLeafEditFixture})),
  ...NATURAL_LEAVES_128_130.map(f=>({f,boxes:leafBoxes,mesh:leafMesh,edit:leafEditFixture}))
];
const geometrySignature=boxes=>JSON.stringify(boxes.map(b=>b.map(v=>Number(v.toFixed(8)))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
test('M12 cross-PR foliage has exclusive symbolic and future numeric identities',()=>{
 assert.equal(sources.length,6);
 assert.deepEqual(sources.map(({f})=>f.ordinal),[122,123,124,128,129,130]);
 assert.equal(new Set(sources.map(({f})=>f.symbolicId)).size,sources.length);
 assert.equal(new Set(sources.map(({f})=>f.futureOnlyId)).size,sources.length);
 for(const {f} of sources){
  assert.equal(f.symbolicId,'biome130:'+String(f.ordinal).padStart(3,'0'));
  assert.equal(f.futureOnlyId,255+f.ordinal);
  assert.ok(f.futureOnlyId>=377&&f.futureOnlyId<=385);
  assert.equal(f.solid,false);
  assert.equal(f.selectable,true);
  assert.equal(f.replaceable,true);
  assert.equal(f.alpha,'cutout');
 }
});
test('M12 cross-PR foliage geometry is distinct, positive-volume and in cell bounds in all orientations',()=>{
 const signatures=[];
 for(const {f,boxes,mesh} of sources){
  const original=boxes(f,0);
  signatures.push(geometrySignature(original));
  for(let r=0;r<4;r++){
   const rotated=boxes(f,r);
   assert.equal(rotated.length,original.length);
   for(const [x,y,z,X,Y,Z] of rotated){
    for(const value of [x,y,z,X,Y,Z])assert.ok(Number.isFinite(value)&&value>=0&&value<=1, f.symbolicId+' out of bounds');
    assert.ok(x<X&&y<Y&&z<Z, f.symbolicId+' zero/negative volume');
   }
   const generated=mesh(f,r);
   assert.equal(generated.indices.length,rotated.length*36);
   assert.equal(generated.vertices.length,rotated.length*72);
   assert.ok(generated.indices.every(i=>Number.isSafeInteger(i)&&i>=0&&i<generated.vertices.length/3));
   assert.equal(generated.collision,'none');
   const saved=edit(f,r);
   assert.equal(saved.removed,true);
   assert.deepEqual(saved.selected,{symbolicId:f.symbolicId,rotation:r});
  }
 }
 assert.equal(new Set(signatures).size,sources.length,'duplicate occupied-box source geometry');
});
test('M12 rejects cross-catalog descriptor confusion rather than silently accepting aliases',()=>{
 assert.throws(()=>leafBoxes(NATURAL_LEAVES_122_124[0]),TypeError);
 assert.throws(()=>naturalLeafBoxes(NATURAL_LEAVES_128_130[0]),TypeError);
});
