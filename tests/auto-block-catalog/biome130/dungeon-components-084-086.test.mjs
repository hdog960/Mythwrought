import test from 'node:test';
import assert from 'node:assert/strict';
import {DUNGEON_COMPONENTS_084_086 as assets,hardwareBoxes,hardwareMaterial,hardwareMesh,hardwareEditFixture} from '../../../src/auto-block-catalog/biome130/dungeon-components-084-086.mjs';
test('ordered exclusive symbolic identities and inert states',()=>{
 assert.deepEqual(assets.map(a=>a.id),['biome130:084','biome130:085','biome130:086']);
 assert.deepEqual(assets.map(a=>a.prospectiveId),[339,340,341]);
 for(const a of assets){assert.equal(a.active,false);assert.equal(a.dynamic,false);assert.equal(a.damage,0);assert.equal(a.mechanism,'none');assert.equal(a.collision,'occupied-boxes');assert.equal(a.selectable,true);assert.equal(a.replaceable,true);}
});
for(const a of assets)test(a.id+' physical shape, four rotations, mesh and reversible save',()=>{
 const initial=hardwareBoxes(a,0);
 assert.ok(initial.length>=6);
 for(let r=0;r<4;r++){
  const boxes=hardwareBoxes(a,r);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(Number.isFinite));assert.ok(b.slice(0,3).every((v,i)=>v>=0&&v<b[i+3]));assert.ok(b.slice(3).every(v=>v<=1));}
  const mesh=hardwareMesh(a,r);
  assert.equal(mesh.vertices.length,boxes.length*72);assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>i<mesh.vertices.length/3));
  const edit=hardwareEditFixture(a,r);assert.equal(edit.selected.symbolicId,a.id);assert.equal(edit.selected.rotation,r);assert.deepEqual(edit.selected.state,a.state);assert.equal(edit.removed,true);assert.deepEqual(JSON.parse(edit.encoded).placed,edit.selected);
 }
 assert.deepEqual(hardwareBoxes(a,0),initial);
 assert.equal(hardwareMaterial(a,3,5,7),hardwareMaterial(a,3,5,7));
 assert.ok(a.palette.includes(hardwareMaterial(a,3,5,7)));
});
test('foreign descriptor and invalid inputs fail closed',()=>{
 assert.throws(()=>hardwareBoxes(assets[0],4),RangeError);
 assert.throws(()=>hardwareBoxes({...assets[0]},0),RangeError);
 assert.throws(()=>hardwareMaterial(assets[0],.5,0,0),TypeError);
});
