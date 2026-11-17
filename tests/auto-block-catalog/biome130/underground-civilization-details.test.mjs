import test from 'node:test';
import assert from 'node:assert/strict';
import {UNDERGROUND_CIVILIZATION_DETAILS as assets,detailBoxes,detailMaterial,detailMesh,detailEditFixture} from '../../../src/auto-block-catalog/biome130/underground-civilization-details.mjs';
test('three unique roster candidates; no live numeric registration',()=>{
 assert.deepEqual(assets.map(a=>a.id),['biome130:074','biome130:075','biome130:076']);
 assert.deepEqual(assets.map(a=>a.prospectiveId),[329,330,331]);
 assert.equal(new Set(assets.map(a=>JSON.stringify(a.boxes))).size,3);
 for(const a of assets){assert.equal(a.selectable,true);assert.equal(a.replaceable,true);assert.equal(a.dynamic,false);assert.equal(a.emissive,false);assert.ok(a.boxes.length>=6);}
});
test('all 4 orientations preserve box volumes and bounds',()=>{
 for(const a of assets){const volume=a.boxes.reduce((s,b)=>s+(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),0);
  for(let r=0;r<4;r++){const boxes=detailBoxes(a,r);assert.equal(boxes.length,a.boxes.length);let v=0;
   for(const b of boxes){assert.ok(b.every(n=>n>=0&&n<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);v+=(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]);}
   assert.ok(Math.abs(volume-v)<1e-8);
  }
 }
 assert.throws(()=>detailBoxes(assets[0],4),RangeError);
 assert.throws(()=>detailBoxes({},0),RangeError);
});
test('mesh triangles are indexed, finite and nondegenerate',()=>{
 for(const a of assets)for(let r=0;r<4;r++){const m=detailMesh(a,r);assert.equal(m.vertices.length,a.boxes.length*72);assert.equal(m.indices.length,a.boxes.length*36);
  assert.ok(m.vertices.every(Number.isFinite));assert.ok(m.indices.every(i=>i>=0&&i<m.vertices.length/3));
  for(let k=0;k<m.indices.length;k+=3){const p=m.indices.slice(k,k+3).map(i=>m.vertices.slice(i*3,i*3+3));const u=p[1].map((v,j)=>v-p[0][j]),v=p[2].map((w,j)=>w-p[0][j]);const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];assert.ok(cross.some(n=>Math.abs(n)>1e-9));}
 }
});
test('deterministic palette and reversible symbolic edit fixture',()=>{
 for(const a of assets)for(let r=0;r<4;r++){const c=detailMaterial(a,3,7,11,r);assert.ok(a.palette.includes(c));assert.equal(c,detailMaterial(a,3,7,11,r));const e=detailEditFixture(a,r);assert.deepEqual(e.selected,{symbolicId:a.id,rotation:r});assert.equal(e.removed,true);assert.ok(!e.encoded.includes('prospectiveId'));}
 assert.throws(()=>detailMaterial({},1,2,3),TypeError);
});
