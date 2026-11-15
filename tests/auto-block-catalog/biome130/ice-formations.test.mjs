import test from 'node:test';
import assert from 'node:assert/strict';
import {ICE_FORMATION_IDS,iceFormation,iceFaceColor,iceFormationMesh,iceFormationFixture} from '../../../src/auto-block-catalog/biome130/ice-formations.mjs';
test('roster, unique symbolic identity, future-only ID, physical attachment and transparency',()=>{
 assert.deepEqual(ICE_FORMATION_IDS,['biome130:025','biome130:026','biome130:027']);
 for(let i=0;i<3;i++){const d=iceFormation(ICE_FORMATION_IDS[i]);assert.equal(d.proposedFutureId,280+i);assert.equal(d.status,'BLOCKED BY ENGINE');
  assert.equal(d.material.transparent,true);assert.equal(d.physical.targetable,true);assert.equal(d.physical.removable,true);assert.ok(d.shape.boxes.length>=3);}
 assert.deepEqual(ICE_FORMATION_IDS.map(id=>iceFormation(id).physical.attachment),['ceiling','ground','wall']);
});
test('four rotations preserve bounds and deterministic appearance',()=>{
 for(const id of ICE_FORMATION_IDS)for(let r=0;r<4;r++){
  const d=iceFormation(id,r);assert.equal(d.rotation,r);
  for(const b of d.shape.boxes){assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  assert.equal(iceFaceColor(id,2,.35,.67,31),iceFaceColor(id,2,.35,.67,31));
 }
 assert.throws(()=>iceFormation(ICE_FORMATION_IDS[0],4));assert.throws(()=>iceFaceColor(ICE_FORMATION_IDS[0],6,0,0));
});
test('meshes contain exposed surfaces with outward triangle winding and mobile budgets',()=>{
 for(const id of ICE_FORMATION_IDS)for(let r=0;r<4;r++){
  const m=iceFormationMesh(id,r);assert.ok(m.indices.length>0&&m.indices.length<=2400);assert.equal(m.indices.length%3,0);
  for(let t=0;t<m.indices.length;t+=3){
   const p=m.indices.slice(t,t+3).map(i=>m.vertices.slice(i*3,i*3+3));
   const a=p[1].map((x,i)=>x-p[0][i]),b=p[2].map((x,i)=>x-p[0][i]);
   const n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
   const expected=m.normals.slice(m.indices[t]*3,m.indices[t]*3+3);
   assert.ok(n.reduce((s,x,i)=>s+x*expected[i],0)>1e-10);
  }
 }
});
test('isolated placement, selection, removal and atomic snapshot restoration',()=>{
 const a=iceFormationFixture(),b=iceFormationFixture();
 assert.equal(a.place(1,2,3,ICE_FORMATION_IDS[0],3),true);assert.equal(a.place(1,2,3,ICE_FORMATION_IDS[1]),false);
 b.restore(a.snapshot());assert.deepEqual(b.select(1,2,3),{id:ICE_FORMATION_IDS[0],rotation:3});
 assert.throws(()=>b.restore(JSON.stringify([['4,5,6',{id:'biome130:999',rotation:0}]])));
 assert.deepEqual(b.select(1,2,3),{id:ICE_FORMATION_IDS[0],rotation:3});
 assert.deepEqual(b.remove(1,2,3),{id:ICE_FORMATION_IDS[0],rotation:3});
});
