import test from 'node:test';
import assert from 'node:assert/strict';
import {DUNGEON_COMPONENTS,dungeonBoxes,dungeonMaterial,dungeonMesh,dungeonEditFixture} from '../../../src/auto-block-catalog/biome130/dungeon-components-081-083.mjs';
test('three unique ordered symbolic candidates, no live numeric allocation',()=>{
 assert.deepEqual(DUNGEON_COMPONENTS.map(a=>a.id),['biome130:081','biome130:082','biome130:083']);
 assert.deepEqual(DUNGEON_COMPONENTS.map(a=>a.prospectiveId),[336,337,338]);
 for(const a of DUNGEON_COMPONENTS){assert.equal(a.active,false);assert.equal(a.dynamic,false);assert.equal(a.damage,0);assert.equal(a.mechanism,'none');assert.equal(a.selectable,true);assert.equal(a.collision,'occupied-boxes');}
});
for(const asset of DUNGEON_COMPONENTS){
 test(asset.id+' geometry, rotation, deterministic materials and reversible symbolic save',()=>{
  const original=dungeonBoxes(asset,0);
  assert.ok(original.length>=5);
  for(let r=0;r<4;r++){
   const boxes=dungeonBoxes(asset,r);
   for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(Number.isFinite));assert.ok(b.slice(0,3).every((v,i)=>v>=0&&v<b[i+3]));assert.ok(b.slice(3).every(v=>v<=1));}
   const mesh=dungeonMesh(asset,r);assert.equal(mesh.vertices.length,boxes.length*6*4*3);assert.equal(mesh.indices.length,boxes.length*6*6);assert.ok(mesh.indices.every(i=>i<mesh.vertices.length/3));
   const edit=dungeonEditFixture(asset,r);assert.equal(edit.selected.symbolicId,asset.id);assert.equal(edit.selected.rotation,r);assert.deepEqual(edit.selected.state,asset.state);assert.equal(edit.removed,true);assert.deepEqual(JSON.parse(edit.encoded).placed,edit.selected);
  }
  assert.deepEqual(dungeonBoxes(asset,0),original);
  assert.equal(dungeonMaterial(asset,3,5,7),dungeonMaterial(asset,3,5,7));
  assert.ok(asset.palette.includes(dungeonMaterial(asset,3,5,7)));
 });
}
test('fail closed for invalid rotations and foreign descriptors',()=>{
 assert.throws(()=>dungeonBoxes(DUNGEON_COMPONENTS[0],4),RangeError);
 assert.throws(()=>dungeonBoxes({...DUNGEON_COMPONENTS[0]},0),RangeError);
 assert.throws(()=>dungeonMaterial(DUNGEON_COMPONENTS[0],.5,0,0),TypeError);
});
