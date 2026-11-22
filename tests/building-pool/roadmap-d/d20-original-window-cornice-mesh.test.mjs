// Builder D D20 targeted native source test. Never writes runtime/settlements/saves.
// Tests original Pack3 cornice color/shape, original Pack4 clear/sun/moon glazing
// visible+selection+collision and true world-space typed vertex buffers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack3OrnamentalById} from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
import {planD20SourceSafeWindowCornices} from '../../../src/building-pool/roadmap-d/d20-original-culled-cornice-glazing.mjs';
import {buildD20OriginalWindowWorldMesh} from '../../../src/building-pool/roadmap-d/d20-original-physical-window-mesh.mjs';
const structures=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const sourceResolvers={resolvePack3Ornamental:pack3OrnamentalById,
 resolvePack4WindowShape:windowShape,resolvePack4Asset:pack4BuilderAsset};
const K=p=>p.join(',');
const D=Object.freeze({north:0,east:1,south:2,west:3});
const overlap=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6);
const actualSource=b=>{
 const glass=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
 return planD20SourceSafeWindowCornices(b,glass,sourceResolvers);
};
test('all 193 original weak-jamb windows are accounted for and 126 actual source-derived Pack3/Pack4 composed previews have genuine bounded world meshes',()=>{
 assert.equal(structures.length,16);
 let flagged=0,samples=0,bytes=0,colored=0,transparent=0,originalWindows=0;
 for(const b of structures){
  const before=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const source=new Map(b.cells.map(c=>[K(c.at),c]));
  const result=actualSource(b);
  assert.equal(result.blueprintId,b.id);
  assert.equal(result.noOriginalVoxelEdits,true);
  assert.equal(result.noNewOccupiedWorldCells,true);
  assert.equal(result.noOriginalGlassPhysicalOverlap,true);
  assert.equal(result.notPack3FullBlockPlacement,true);
  assert.ok(result.sourcePreviewCount>=1&&result.sourcePreviewCount<=8);
  assert.ok(result.originalPreviewVertexBytes<=256*1024);
  assert.equal(result.loadBearingAccepted,false);
  assert.equal(result.selectionCollisionGameplayAcceptance,false);
  assert.equal(result.originalGameWebGL2Accepted,false);
  assert.equal(result.iphonePwaAccepted,false);
  assert.equal(result.worldPlaced,false);
  for(const item of result.originalCulledCorniceSamples){
   assert.equal(item.originalPack3CorniceId,120);
   assert.equal(item.sourcePack3PartCount,15);
   assert.ok(item.retainedOriginalPack3Parts>=8&&item.retainedOriginalPack3Parts<=13);
   assert.ok(item.culledOverlappingSourceParts>=1);
   assert.equal(item.sideJambsStillNeedStructuralReview,true);
   assert.equal(item.loadBearingAccepted,false);
   assert.equal(item.notAnUnmodifiedLivePack3Block,true);
   assert.equal(item.noGlassRemovedOrResized,true);
   assert.equal(item.realSourceOpaqueAndTransparentWorldMesh,true);
   assert.equal(source.get(K(item.at))?.asset,'pack4:030');
   const truePack3=pack3OrnamentalById(120,D[item.facing]);
   const glass=windowShape(item.originalGlazingId,D[item.facing]);
   const physicalMasks=[...glass.visible.map(p=>p.bounds),...glass.collision,...glass.selection];
   for(const p of item.originalMaterialBoxes){
    assert.ok(truePack3.parts.some(q=>K(q.box)===K(p.originalPartAabb)&&
      truePack3.colors[q.tone]===p.sourceHex),'non-original Pack3 part in combined trim');
    assert.ok(!physicalMasks.some(m=>overlap(p.originalPartAabb,m)),
      'real Pack4 glass physically intersects source Pack3 retained cornice');
    assert.equal(p.worldPartAabb.length,6);
    for(let i=0;i<6;i++)assert.ok(Math.abs(p.worldPartAabb[i]-
      (p.originalPartAabb[i]+item.at[i%3]))<1e-5);
   }
   const m=item.originalSourceWorldMesh;
   assert.equal(m.stride,10);
   assert.equal(m.originalSourceColorsPreserved,true);
   assert.equal(m.sourceShapesUnmodified,true);
   assert.equal(m.originalWindowTransparencyUnsorted,true);
   assert.equal(m.certifiedOriginalGameWebGL2,false);
   assert.ok(m.originalPack3CorniceOpaqueWorldVertices instanceof Float32Array);
   assert.ok(m.originalPack4OpaqueWorldVertices instanceof Float32Array);
   assert.ok(m.originalPack4TranslucentWorldVertices instanceof Float32Array);
   assert.equal(m.originalPack3CorniceTriangles,item.retainedOriginalPack3Parts*12);
   assert.equal(m.sourceVertexBytes,item.originalRenderPreviewBytes);
   assert.ok(m.sourceVertexBytes<48*1024);
   for(const vertices of [m.originalPack3CorniceOpaqueWorldVertices,
     m.originalPack4OpaqueWorldVertices,m.originalPack4TranslucentWorldVertices]){
    assert.equal(vertices.length%30,0);
    for(let i=0;i<vertices.length;i+=10){
     for(let axis=0;axis<3;axis++)assert.ok(vertices[i+axis]>=item.at[axis]-1e-4&&
       vertices[i+axis]<=item.at[axis]+1+1e-4);
     const norm=Math.hypot(vertices[i+3],vertices[i+4],vertices[i+5]);
     assert.ok(Number.isFinite(norm)&&Math.abs(norm-1)<1e-3);
     for(let j=6;j<10;j++)assert.ok(Number.isFinite(vertices[i+j])&&
       vertices[i+j]>=0&&vertices[i+j]<=1);
    }
   }
   colored+=m.originalPack3CorniceTriangles;transparent+=m.originalPack4TranslucentTriangles;
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),before);
  flagged+=result.structurallyDeficientWindows;samples+=result.sourcePreviewCount;
  bytes+=result.originalPreviewVertexBytes;originalWindows+=result.originalWindowCount;
 }
 assert.deepEqual({originalWindows,flagged,samples,bytes},
  {originalWindows:1233,flagged:193,samples:126,bytes:3444480});
 assert.ok(colored>10000&&transparent>0);
});
test('original full Pack3 arches must not be layered on real Pack4 glazing; zero-overlap component trim is real but remains nonregistered preview',()=>{
 for(let turn=0;turn<4;turn++)for(const id of [159,160,161]){
  const glass=windowShape(id,turn);
  const allGlass=[...glass.visible.map(x=>x.bounds),...glass.collision,...glass.selection];
  const fullArch=pack3OrnamentalById(121,turn);
  assert.ok(fullArch.parts.some(p=>allGlass.some(x=>overlap(p.box,x))),
    'original full arch falsely marked collision-free');
  const trueCornice=pack3OrnamentalById(120,turn);
  assert.ok(trueCornice.parts.some(p=>allGlass.some(x=>overlap(p.box,x))),
    'full original cornice was wrongly marked safe to layer');
 }
});
test('D20 source parity must reject tampered original Pack4 window geometry, fabricated Pack3 source part boxes, and invalid budgets',()=>{
 const b=structures[0],glass=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
 assert.throws(()=>planD20SourceSafeWindowCornices(b,glass),/resolvers required/);
 for(const opts of [{maxSites:0},{maxSites:13},{maxPreviewBytes:4000},{maxPreviewBytes:500000}])
  assert.throws(()=>planD20SourceSafeWindowCornices(b,glass,{...sourceResolvers,...opts}),/budget invalid/);
 assert.throws(()=>planD20SourceSafeWindowCornices(b,glass,{
  ...sourceResolvers,maxPreviewBytes:8192}),/memory exceeded/,
  'valid but insufficient bounded memory budget must reject real source parts');
 const fakeWindow=(id,turn)=>{
  const original=windowShape(id,turn);
  return {...original,visible:original.visible.map((p,i)=>i===0?
    {...p,bounds:[0,0,0,1,1,1]}:p)};
 };
 assert.throws(()=>planD20SourceSafeWindowCornices(b,glass,{
  ...sourceResolvers,resolvePack4WindowShape:fakeWindow}),/disagree/);
 const fakeCornice=(id,turn)=>{
  const p=pack3OrnamentalById(id,turn);
  return {...p,boxes:p.boxes.map((x,i)=>i===0?[0,0,0,1,1,1]:x)};
 };
 assert.throws(()=>planD20SourceSafeWindowCornices(b,glass,{
  ...sourceResolvers,resolvePack3Ornamental:fakeCornice}),/inconsistent/);
});
test('D20 raw typed mesh strict source bounds reject forged colors, positions, normals, and excessive per-sample memory',()=>{
 const b=structures[0],site=actualSource(b).originalCulledCorniceSamples[0];
 const pieces=site.originalMaterialBoxes.map(p=>({
  localAabb:p.originalPartAabb,sourceHex:p.sourceHex,sourceOriginalId120:true}));
 const shape=pack4BuilderAsset(site.originalGlazingRef,{
  candidateId:site.originalGlazingId,rotation:site.facing});
 const actual=()=>buildD20OriginalWindowWorldMesh({at:site.at,
  pack3SourceParts:pieces,pack4PhysicalAsset:shape});
 assert.equal(actual().sourceVertexBytes,site.originalRenderPreviewBytes);
 assert.throws(()=>buildD20OriginalWindowWorldMesh({at:site.at,
  pack3SourceParts:pieces,pack4PhysicalAsset:shape,maxBytes:8192}),/byte budget/);
 const badColor=pieces.map((p,i)=>i===0?{...p,sourceHex:'fakeColor'}:p);
 assert.throws(()=>buildD20OriginalWindowWorldMesh({at:site.at,
  pack3SourceParts:badColor,pack4PhysicalAsset:shape}),/tone/);
 const badBox=pieces.map((p,i)=>i===0?{...p,localAabb:[0,0,0,1.2,1,1]}:p);
 assert.throws(()=>buildD20OriginalWindowWorldMesh({at:site.at,
  pack3SourceParts:badBox,pack4PhysicalAsset:shape}),/authenticated/);
 for(const fault of ['nan-normal','out-of-cell','bad-alpha']){
  const m={...shape.previewMesh,translucent:new Float32Array(shape.previewMesh.translucent)};
  if(fault==='nan-normal')m.translucent[3]=NaN;
  if(fault==='out-of-cell')m.translucent[0]=1.3;
  if(fault==='bad-alpha')m.translucent[9]=1.2;
  assert.throws(()=>buildD20OriginalWindowWorldMesh({at:site.at,
   pack3SourceParts:pieces,pack4PhysicalAsset:{...shape,previewMesh:m}}),
   /normals invalid|exceeds local cell|RGBA invalid/,
   'must reject deliberately forged original material '+fault);
 }
});
