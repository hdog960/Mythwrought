// Builder D23 focused genuine original Pack4 furniture floor/collider/picking source.
// This test requires native Node in a COMPLETE original repository checkout.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {furnishingShape} from '../../../src/block-packs/pack-4/furnishings.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {auditD23OriginalFurnishedInteriorSource} from '../../../src/building-pool/roadmap-d/d23-original-interior-furnishing-contact.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS],K=a=>a.join(',');
const dep=Object.freeze({resolvePack4FurnishingShape:furnishingShape,
 resolvePack4Asset:pack4BuilderAsset});
const audit=(b,d=dep)=>auditD23OriginalFurnishedInteriorSource(b,d);
test('all 16 actual source buildings: Pack4 authentic 171 benches/172 tables have real floor contact, independent walk approaches, original typed physical selection/collision and 737280 source bytes',()=>{
 assert.equal(B.length,16);
 let authored=0,physical=0,bytes=0,triangles=0;
 const originals=new Set(),features=new Set(),facings=new Set();
 for(const b of B){
  const original=b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';');
  const q=audit(b),nav=new Set(b.navigation.map(n=>K(n.at)));
  assert.equal(q.blueprintId,b.id);
  assert.equal(q.originalAuthoredFixtureCount,2);
  assert.equal(q.originalPack4SourceSampleCount,2);
  assert.equal(q.genuineOriginalSourceTriangles,384);
  assert.equal(q.genuineOriginalSourceMeshBytes,46080);
  assert.equal(q.sourceOriginalBenchAndTableFootingVerified,true);
  assert.equal(q.noOriginalNavigationCellsOccupied,true);
  assert.equal(q.noAuthoredSourceCellsOverwritten,true);
  assert.equal(q.sourceOriginalWallRoofsUnchanged,true);
  assert.equal(q.originalWorldColliderGameplayUnaccepted,true);
  assert.equal(q.rendererPickingUnaccepted,true);
  assert.equal(q.originalGameWebGL2Unaccepted,true);
  assert.equal(q.iphonePwaUnaccepted,true);
  assert.equal(q.sourceSaveSchemaUnchanged,true);
  assert.equal(q.worldPlaced,false);
  const at=new Map(b.cells.map(c=>[K(c.at),c]));
  for(const source of q.originalSourceFixtures){
   const originalC=at.get(K(source.at));
   assert.equal(originalC.role,'fixture');
   assert.equal(originalC.asset,source.originalAsset);
   assert.equal(source.sourceFeature,originalC.feature);
   assert.equal(at.get(K([source.at[0],1,source.at[2]]))?.asset,'live:wood');
   assert.ok(!nav.has(K(source.at)));
   assert.ok(source.originalY1FloorContactArea>.02);
   assert.ok(source.originallyAdjacentWalkwayCoordinates>=1);
   assert.equal(source.actualSourceFixtureCellNotNavigation,true);
   assert.equal(source.noOtherWorldCellOccupied,true);
   assert.equal(source.sourceFloorContactProven,true);
   assert.equal(source.originalFurnishingCollisionAndSelectionExactlyMatchOwner,true);
   assert.equal(source.nativePlayerCollisionUnaccepted,true);
   assert.equal(source.realRendererUnaccepted,true);
   assert.equal(source.worldPlaced,false);
   originals.add(source.sourceNumericId);features.add(source.sourceFeature);facings.add(source.sourceFacing);
  }
  for(const m of q.originalPack4PhysicalSamples){
   assert.ok(m.originalPack4OpaqueWorldMesh instanceof Float32Array);
   assert.ok(m.originalPack4TranslucentWorldMesh instanceof Float32Array);
   assert.equal(m.originalPack4TranslucentWorldMesh.length,0);
   assert.equal(m.originalNativeTriangles,m.sourceId===171?156:228);
   assert.equal(m.originalPack4OpaqueWorldMesh.length,m.originalNativeTriangles*30);
   assert.equal(m.actualOriginalSourceMeshBytes,m.originalPack4OpaqueWorldMesh.byteLength);
   assert.equal(m.exactPhysicalPack4SourceCopied,true);
   assert.equal(m.originalGameplayCollisionAccepted,false);
   assert.equal(m.realOriginalGameWebGL2Accepted,false);
   for(let i=0;i<m.originalPack4OpaqueWorldMesh.length;i+=10){
    const v=m.originalPack4OpaqueWorldMesh;
    for(let j=0;j<3;j++)assert.ok(v[i+j]>=m.at[j]&&v[i+j]<=m.at[j]+1);
    assert.ok(Math.abs(Math.hypot(v[i+3],v[i+4],v[i+5])-1)<.001);
    for(let j=6;j<10;j++)assert.ok(v[i+j]>=0&&v[i+j]<=1);
   }
  }
  assert.equal(b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';'),original);
  authored+=q.originalAuthoredFixtureCount;physical+=q.originalPack4SourceSampleCount;
  bytes+=q.genuineOriginalSourceMeshBytes;triangles+=q.genuineOriginalSourceTriangles;
 }
 assert.deepEqual({authored,physical,bytes,triangles},
  {authored:32,physical:32,bytes:737280,triangles:6144});
 assert.deepEqual([...originals].sort((a,b)=>a-b),[171,172]);
 assert.deepEqual([...features].sort(),['unapproved-bench','unapproved-scribe-table']);
 assert.deepEqual([...facings],['north']);
});
test('original source owner, floor, nav, collision and sample cost must not be counterfeited',()=>{
 const b=B[0],q=audit(b);
 assert.equal(q.originalSourceFixtures.length,2);
 assert.throws(()=>auditD23OriginalFurnishedInteriorSource(b),/providers mandatory/);
 for(const config of [{maxFixtureSamples:0},{maxFixtureSamples:3},{maxPreviewBytes:2000},
  {maxPreviewBytes:150000}])
  assert.throws(()=>audit(b,{...dep,...config}),/budget invalid/);
 assert.throws(()=>audit(b,{...dep,maxPreviewBytes:8192}),/CPU preview overflow/);
 const fixture=b.cells.find(c=>c.role==='fixture');
 const navOverlapping={...b,navigation:[...b.navigation,{at:[...fixture.at],mode:'walk'}]};
 assert.throws(()=>audit(navOverlapping),/blocks navigation/);
 const noFloor={...b,cells:b.cells.filter(c=>K(c.at)!==K([fixture.at[0],1,fixture.at[2]]))};
 assert.throws(()=>audit(noFloor),/not grounded/);
 const fakeShape=(id,rot)=>{const original=furnishingShape(id,rot);
  return {...original,collision:original.collision.map((c,i)=>i===0?[0,0,0,1,1,1]:c)}};
 assert.throws(()=>audit(b,{...dep,resolvePack4FurnishingShape:fakeShape}),/builder\/collision\/picking mismatch/);
 const fakeProvider=(symbol,opts)=>{const original=pack4BuilderAsset(symbol,opts);
  return {...original,previewMesh:{...original.previewMesh,translucent:new Float32Array(30)}}};
 assert.throws(()=>audit(b,{...dep,resolvePack4Asset:fakeProvider}),/triangle census changed/);
});
