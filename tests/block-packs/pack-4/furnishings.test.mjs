import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK4_FURNISHING_IDS,PACK4_FURNISHING_FAMILIES,PACK4_FURNISHING_ASSETS,
 PACK4_FURNISHING_STRIDE,furnishingAsset,furnishingShape,
 furnishingMountOffset,furnishingSaveState,restoreFurnishingSaveState,
 furnishingPreviewMesh
} from '../../../src/block-packs/pack-4/furnishings.mjs';

const expectedIDs=[169,170,171,172,173,174,175];
const boundsValid=b=>b.length===6&&b.every(x=>Number.isFinite(x)&&x>=0&&x<=1)&&
  b.slice(0,3).every((v,i)=>v<b[i+3]);
const volume=bb=>bb.reduce((sum,b)=>sum+((b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2])),0);
const along=(s,x,y,z)=>s.selection.some(b=>
  x>=b[0]&&x<=b[3]&&y>=b[1]&&y<=b[4]&&z>=b[2]&&z<=b[5]);

test('M3 families own exactly seven unique persistent candidates 169–175',()=>{
 assert.deepEqual(PACK4_FURNISHING_ASSETS.map(x=>x.id),expectedIDs);
 assert.deepEqual(PACK4_FURNISHING_FAMILIES,[56,57,58,59,60,61,62]);
 assert.deepEqual(Object.values(PACK4_FURNISHING_IDS).sort((a,b)=>a-b),expectedIDs);
 assert.deepEqual(PACK4_FURNISHING_ASSETS.map(x=>x.roster),PACK4_FURNISHING_FAMILIES);
 assert.equal(new Set(expectedIDs).size,7);
 assert.ok(expectedIDs.every(x=>x>=159&&x<=208&&x!==255&&x>8));
});
test('all furniture candidates have distinct authored geometry, material and physical purpose',()=>{
 const keys=PACK4_FURNISHING_ASSETS.map(x=>x.key);
 assert.equal(new Set(keys).size,7);
 assert.ok(PACK4_FURNISHING_ASSETS.every(x=>x.detail.length>=50));
 assert.equal(new Set(PACK4_FURNISHING_ASSETS.map(x=>JSON.stringify(x.parts))).size,7);
 assert.equal(PACK4_FURNISHING_ASSETS.every(x=>x.interactions.individuallySelectable&&
   x.interactions.independentlyRemovable&&!x.interactions.inventory&&!x.interactions.harvest),true);
 for(const a of PACK4_FURNISHING_ASSETS) {
  assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.parts)&&Object.isFrozen(a.parts[0].bounds));
  assert.equal(a.occludesWholeCell,false);
  assert.deepEqual(a.availableRotations,[0,1,2,3]);
  assert.equal(furnishingAsset(a.id),a);
 }
 assert.equal(furnishingAsset(4),null);
});
for(const id of expectedIDs){
 test('physical selection and collision geometry is independently addressable for '+id,()=>{
  const s=furnishingShape(id);
  assert.equal(s.id,id);
  assert.equal(s.occludesWholeCell,false);
  assert.equal(s.renderPass,'opaque');
  assert.ok(s.selection.length>=2&&s.collision.length>=2);
  assert.ok(s.visible.length>=s.selection.length);
  assert.ok(s.visible.length>=s.collision.length);
  for(const b of [...s.selection,...s.collision])assert.ok(boundsValid(b));
  assert.ok(s.collision.every(b=>b.some((n,i)=>i<3&&b[i+3]-n<.96)),
   'no false full cube collision');
 });
 test('all rotated sub-boxes preserve volume, shape and saved state for '+id,()=>{
  const before=furnishingShape(id);
  for(let r=0;r<4;r++){
   const s=furnishingShape(id,r);
   assert.equal(s.rotation,r);
   assert.equal(s.visible.length,before.visible.length);
   assert.equal(s.collision.length,before.collision.length);
   assert.ok(s.visible.every(p=>boundsValid(p.bounds)));
   assert.ok(Math.abs(volume(s.collision)-volume(before.collision))<.000001);
   const roundTrip=JSON.parse(JSON.stringify(furnishingSaveState(id,r)));
   assert.deepEqual(restoreFurnishingSaveState(roundTrip),{id,rotation:r});
   assert.deepEqual(furnishingShape(roundTrip.id,roundTrip.rotation),s);
  }
 });
 test('mesh is finite, mobile-budgeted, fully opaque and consistent for '+id,()=>{
  for(let r=0;r<4;r++){
   const mesh=furnishingPreviewMesh(id,r),s=furnishingShape(id,r);
   assert.equal(mesh.stride,PACK4_FURNISHING_STRIDE);
   assert.equal(mesh.opaque.length%PACK4_FURNISHING_STRIDE,0);
   assert.equal(mesh.translucent.length,0);
   assert.equal(mesh.opaque.length/PACK4_FURNISHING_STRIDE,s.visible.length*36);
   assert.ok(mesh.opaque.length/PACK4_FURNISHING_STRIDE<2500);
   for(let i=0;i<mesh.opaque.length;i+=mesh.stride){
    assert.ok([mesh.opaque[i],mesh.opaque[i+1],mesh.opaque[i+2]].every(v=>v>=0&&v<=1));
    assert.ok([mesh.opaque[i+3],mesh.opaque[i+4],mesh.opaque[i+5]].every(Number.isFinite));
    assert.ok([mesh.opaque[i+6],mesh.opaque[i+7],mesh.opaque[i+8]].every(v=>v>=0&&v<=1));
    assert.equal(mesh.opaque[i+9],1);
   }
  }
 });
}
test('barrel has independent curves, hoops, lid and bung, not an unstyled cube',()=>{
 const a=furnishingAsset(169);
 assert.ok(a.parts.length>=20);
 assert.ok(a.parts.some(p=>p.material==='iron'));
 assert.ok(a.parts.some(p=>p.material==='brass'));
 assert.ok(a.parts.some(p=>p.bounds[4]>.86));
 assert.ok(a.parts.some(p=>p.bounds[3]-p.bounds[0]<.13));
});
test('crate has reinforced timber slats and metal corners',()=>{
 const a=furnishingAsset(170);
 assert.ok(a.parts.length>=30);
 assert.ok(a.parts.some(p=>p.material==='iron'));
 assert.ok(a.parts.some(p=>p.material==='oakSun'));
 assert.notDeepEqual(a.parts,furnishingAsset(169).parts);
});
test('bench has open leg gaps and raised back, unlike broad table top',()=>{
 const bench=furnishingShape(171);
 assert.ok(along(bench,.5,.47,.25));
 assert.equal(along(bench,.5,.25,.5),false);
 assert.ok(along(bench,.5,.76,.70));
 const table=furnishingShape(172);
 assert.ok(along(table,.5,.77,.5));
 assert.equal(along(table,.5,.55,.5),false);
 assert.ok(table.visible.some(p=>p.bounds[4]>.8));
});
test('standing sign has a narrow post and full physical sign panel',()=>{
 const a=furnishingShape(173);
 assert.ok(along(a,.5,.35,.5));
 assert.ok(along(a,.50,.7,.45));
 assert.equal(along(a,.2,.25,.2),false);
 assert.equal(a.mount,'floor');
});
test('hanging banner is ceiling-anchored, with a split swallowtail silhouette',()=>{
 const a=furnishingShape(174);
 assert.equal(a.mount,'ceiling');
 assert.equal(along(a,.50,.2,.5),false,'center split must be empty near bottom');
 assert.ok(along(a,.27,.2,.5));
 assert.ok(along(a,.72,.2,.5));
});
test('market canopy is one independent wall-mounted tent tile, not a shop or roof structure',()=>{
 const a=furnishingShape(175);
 assert.equal(a.mount,'wall-face');
 assert.ok(a.visible.length>=18);
 assert.ok(a.visible.some(p=>p.material==='seaTeal'));
 assert.ok(a.visible.some(p=>p.material==='cream'));
 assert.equal(a.occludesWholeCell,false);
});
test('mount offsets distinguish floor, ceiling and 4-way wall faces',()=>{
 for(const id of [169,170,171,172,173])
  for(let r=0;r<4;r++)assert.deepEqual(furnishingMountOffset(id,r),[0,-1,0]);
 for(let r=0;r<4;r++)assert.deepEqual(furnishingMountOffset(174,r),[0,1,0]);
 assert.deepEqual([0,1,2,3].map(r=>furnishingMountOffset(175,r)),
  [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]]);
});
test('candidate save state rejects unknown/truncated IDs or orientations fail-closed',()=>{
 for(const bad of [0,8,168,176,208,209,255,-1,NaN,1.5])
  assert.throws(()=>furnishingShape(bad));
 for(const bad of [-1,4,1.5,NaN,Infinity,'1',null])
  assert.throws(()=>furnishingShape(169,bad));
 for(const state of [null,{},[],{id:169},{id:175,rotation:4},
  {id:169,rotation:'0'},{id:255,rotation:1}])
  assert.throws(()=>restoreFurnishingSaveState(state));
});
