import test from 'node:test';
import assert from 'node:assert/strict';
import {DUNGEON_COMPONENTS_087_090 as assets,dungeonBoxes,dungeonMaterial,dungeonMesh,dungeonEditFixture} from '../../../src/auto-block-catalog/biome130/dungeon-components-087-090.mjs';
test('exact exclusive ordered IDs and inert behavior',()=>{
 assert.deepEqual(assets.map(a=>a.id),['biome130:087','biome130:088','biome130:089','biome130:090']);
 assert.deepEqual(assets.map(a=>a.prospectiveId),[342,343,344,345]);
 assert.equal(new Set(assets.map(a=>a.profile)).size,4);
 for(const a of assets){assert.equal(a.active,false);assert.equal(a.dynamic,false);assert.equal(a.damage,0);assert.equal(a.mechanism,'none');assert.equal(a.collision,'occupied-boxes');assert.equal(a.selectable,true);assert.equal(a.replaceable,true);}
});
for(const a of assets)test(a.id+' shape, rotation, indexed mesh, reversible symbolic save',()=>{
 const initial=dungeonBoxes(a,0);
 assert.ok(initial.length>=5);
 for(let r=0;r<4;r++){
  const boxes=dungeonBoxes(a,r);
  for(const b of boxes){assert.equal(b.length,6);assert.ok(b.every(Number.isFinite));assert.ok(b.slice(0,3).every((v,i)=>v>=0&&v<b[i+3]));assert.ok(b.slice(3).every(v=>v<=1));}
  const mesh=dungeonMesh(a,r);
  assert.equal(mesh.vertices.length,boxes.length*72);
  assert.equal(mesh.indices.length,boxes.length*36);
  assert.ok(mesh.indices.every(i=>i<mesh.vertices.length/3));
  const edit=dungeonEditFixture(a,r);
  assert.equal(edit.selected.symbolicId,a.id);assert.equal(edit.selected.rotation,r);
  assert.deepEqual(edit.selected.state,a.state);assert.equal(edit.removed,true);
  assert.deepEqual(JSON.parse(edit.encoded).placed,edit.selected);
 }
 assert.deepEqual(dungeonBoxes(a,0),initial);
 assert.equal(dungeonMaterial(a,3,5,7),dungeonMaterial(a,3,5,7));
 assert.ok(a.palette.includes(dungeonMaterial(a,3,5,7)));
});
test('foreign candidates and invalid parameters fail closed',()=>{
 assert.throws(()=>dungeonBoxes(assets[0],4),RangeError);
 assert.throws(()=>dungeonBoxes({...assets[0]},0),RangeError);
 assert.throws(()=>dungeonMaterial(assets[0],.5,0,0),TypeError);
});
