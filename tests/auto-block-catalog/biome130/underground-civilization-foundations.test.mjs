import test from 'node:test';
import assert from 'node:assert/strict';
import {UNDERGROUND_CIVILIZATION_FOUNDATIONS as assets,undergroundBoxes,undergroundMaterial,undergroundMesh,undergroundEditFixture} from '../../../src/auto-block-catalog/biome130/underground-civilization-foundations.mjs';
test('M6 roster identities, future-only IDs, and unique geometry',()=>{
 assert.deepEqual(assets.map(a=>a.id),['biome130:071','biome130:072','biome130:073']);
 assert.deepEqual(assets.map(a=>a.prospectiveId),[326,327,328]);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,3);
 for(const a of assets){assert.equal(a.selectable,true);assert.equal(a.solid,true);assert.equal(a.collision,'occupied');assert.equal(a.rotationCount,4);assert.ok(a.boxes.length>=5);}
});
test('all rotations bounded and 4-turn roundtrip',()=>{
 for(const a of assets){const original=undergroundBoxes(a,0);for(let r=0;r<4;r++)for(const b of undergroundBoxes(a,r)){assert.equal(b.length,6);for(const v of b)assert.ok(v>=0&&v<=1);assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
 assert.deepEqual(undergroundBoxes(a,0),original);
 assert.throws(()=>undergroundBoxes(a,4),RangeError);}
});
test('meshes index valid vertices and symbolic edits roundtrip',()=>{
 for(const a of assets)for(let r=0;r<4;r++){const mesh=undergroundMesh(a,r);assert.equal(mesh.vertices.length,a.boxes.length*6*4*3);assert.equal(mesh.indices.length,a.boxes.length*6*6);assert.ok(mesh.indices.every(i=>i>=0&&i<mesh.vertices.length/3));const edit=undergroundEditFixture(a,r);assert.deepEqual(edit.selected,{symbolicId:a.id,rotation:r});assert.equal(edit.removed,true);assert.ok(!edit.snapshot.includes('"numericId"'));}
});
test('material samples deterministic, palette-limited',()=>{
 for(const a of assets){const first=undergroundMaterial(a,3,8,13,2);assert.equal(first,undergroundMaterial(a,3,8,13,2));assert.ok(a.palette.includes(first));}
 assert.throws(()=>undergroundMaterial({},0,0,0),TypeError);
});
