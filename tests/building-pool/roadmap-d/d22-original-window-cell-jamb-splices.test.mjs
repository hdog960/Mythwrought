// MYTHWROUGHT Builder D22 focused original-source native Node test.
// The source tests may be V8-executed separately, but native node:test acceptance
// requires a complete original repo checkout and MUST NOT be claimed otherwise.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack2Asset,pack2Shape} from '../../../src/block-packs/pack-2/definitions.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
import {planD22OriginalInCellWindowJambs} from '../../../src/building-pool/roadmap-d/d22-original-window-cell-jamb-splices.mjs';
const buildings=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const dep=Object.freeze({originalPack2PostDefinition:pack2Asset,originalPack2PostShape:pack2Shape,
 resolvePack4WindowShape:windowShape,resolvePack4Asset:pack4BuilderAsset});
const G=b=>planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
const plan=(b,g=G(b),d=dep)=>planD22OriginalInCellWindowJambs(b,g,d);
const K=p=>p.join(',');
const F=Object.freeze({north:0,east:1,south:2,west:3});
const hit=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6);
test('all 193 truly deficient original windows receive two physically continuous Pack2 62 glass-clear same-cell jamb proposals with original Y2/Y4 contacts',()=>{
 assert.equal(buildings.length,16);
 let authored=0,weak=0,samples=0,bytes=0;
 const directions=new Set(),glassKinds=new Set(),biomes=new Set();
 for(const b of buildings){
  const before=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const src=new Map(b.cells.map(c=>[K(c.at),c]));
  const actual=plan(b);
  assert.equal(actual.originalWindows,b.openings.filter(o=>o.kind==='window').length);
  assert.equal(actual.originalWeakSideJambs,actual.sourceDerivedJambCandidates.length);
  assert.equal(actual.sourceMeshSampleCount,6);
  assert.ok(actual.sourceMeshCpuBytes<192*1024);
  assert.equal(actual.originalSourceId62ShapeIntact,true);
  assert.equal(actual.originalGlassPreserved,true);
  assert.equal(actual.sourceGeometricWallAndLintelContact,true);
  assert.equal(actual.zeroOriginal4BCellOverwrites,true);
  assert.equal(actual.noAdjacentNavigationCellEntered,true);
  assert.equal(actual.alternativeToOriginalD21ExteriorArch,true);
  assert.equal(actual.fullStructuralLoadAcceptance,false);
  assert.equal(actual.originalGameWebGL2Acceptance,false);
  assert.equal(actual.originalGameCollisionAndTargetingAcceptance,false);
  assert.equal(actual.iphonePwaAcceptance,false);
  assert.equal(actual.newLiveBlocksRegistered,false);
  assert.equal(actual.originalWorldSaved,false);
  for(const item of actual.sourceDerivedJambCandidates){
   assert.equal(src.get(K(item.at))?.role,'window');
   assert.equal(src.get(K(item.at))?.asset,'pack4:030');
   assert.equal(src.get(K([item.at[0],2,item.at[2]]))?.role,'wall');
   assert.equal(src.get(K([item.at[0],4,item.at[2]]))?.role,'beam');
   assert.ok(item.originalSourceJambCount<2);
   assert.equal(item.sourceParts.length,6);
   assert.equal(item.sourceActualJambTriangles,72);
   assert.equal(item.sideSplices.length,2);
   assert.equal(item.noGlassPositiveVolumeOverlap,true);
   assert.equal(item.originalWallSillAndLintelCellBoundaryContact,true);
   assert.equal(item.addedWorldCellCount,0);
   assert.equal(item.worldPlaced,false);
   assert.equal(item.candidateReplacesNotLayersOriginalGlazing,true);
   assert.equal(item.notTheD21DecorativeArch,true);
   directions.add(item.facing);glassKinds.add(item.candidateGlazingId);
   const glass=windowShape(item.candidateGlazingId,F[item.facing]);
   const mask=[...glass.visible.map(p=>p.bounds),...glass.selection,...glass.collision];
   const saved=pack2Shape(62,0).boxes;
   for(const side of item.sideSplices){
    assert.equal(side.sourcePartCount,3);
    assert.equal(side.connectedParts,3);
    assert.ok(side.originalMasonrySillContactArea>.02);
    assert.ok(side.originalUpperBeamContactArea>.02);
    assert.equal(side.geometryContactsBothOriginalNeighborCellFaces,true);
   }
   for(const x of item.sourceParts){
    assert.ok(saved.some(source=>source.every((v,j)=>v===x.authenticPostSourceBox[j])),
      'Pack2 jamb shape must originate from the exact original ID62 post');
    assert.ok(!mask.some(g=>hit(x.physicalJambAabb,g)),'derived post overlaps genuine glass');
    assert.ok([0,1,2].every(i=>x.physicalJambAabb[i]>=0&&x.physicalJambAabb[i+3]<=1));
   }
  }
  for(const m of actual.originalPhysicalMeshSamples){
   assert.ok(m.originalPack2OpaqueWorldVertices instanceof Float32Array);
   assert.ok(m.originalPack4OpaqueWorldVertices instanceof Float32Array);
   assert.ok(m.originalPack4TranslucentWorldVertices instanceof Float32Array);
   assert.ok(m.originalSourceTriangleCount<=320);
   assert.equal(m.originalSourceVertexBytes,m.originalPack2OpaqueWorldVertices.byteLength+
    m.originalPack4OpaqueWorldVertices.byteLength+
    m.originalPack4TranslucentWorldVertices.byteLength);
   assert.equal(m.originalPack2OpaqueWorldVertices.length,72*30);
   assert.equal(m.actualOriginalPostSourcePalette,true);
   assert.equal(m.originalPack4WindowMeshPreserved,true);
   assert.equal(m.realWorldWebGL2Accepted,false);
   for(const vec of [m.originalPack2OpaqueWorldVertices,m.originalPack4OpaqueWorldVertices,
     m.originalPack4TranslucentWorldVertices]){
    assert.equal(vec.length%30,0);
    for(let i=0;i<vec.length;i+=10){
     for(let j=0;j<3;j++)assert.ok(Number.isFinite(vec[i+j])&&
       vec[i+j]>=m.originalAt[j]-1e-5&&vec[i+j]<=m.originalAt[j]+1+1e-5);
     assert.ok(Math.abs(Math.hypot(vec[i+3],vec[i+4],vec[i+5])-1)<.001);
     for(let k=6;k<10;k++)assert.ok(Number.isFinite(vec[i+k])&&vec[i+k]>=0&&vec[i+k]<=1);
    }
   }
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),before);
  authored+=actual.originalWindows;weak+=actual.originalWeakSideJambs;
  samples+=actual.sourceMeshSampleCount;bytes+=actual.sourceMeshCpuBytes;biomes.add(b.biome);
 }
 assert.deepEqual({authored,weak,samples,bytes},{authored:1233,weak:193,samples:96,bytes:1690560});
 assert.deepEqual([...glassKinds].sort((a,b)=>a-b),[159,160,161]);
 assert.equal(directions.size,4);assert.equal(biomes.size,5);
});
test('all 12 original physical facade/glass combinations: same-cell post creates two grounded Y0/Y1 source-connections, never stacked with ornamental D21',()=>{
 const b=buildings[0],start=G(b);
 let cases=0;
 for(const id of [159,160,161]){
  const candidate={...start,plannedOriginalWindowChoices:start.plannedOriginalWindowChoices.map(x=>
   ({...x,candidateId:id,candidateRef:id===159?'pack4:030':'pack4:031'}))};
  for(const x of buildings){
   const local={...candidate,blueprintId:x.id,
    plannedOriginalWindowChoices:G(x).plannedOriginalWindowChoices.map(c=>
     ({...c,candidateId:id,candidateRef:id===159?'pack4:030':'pack4:031'}))};
   const result=plan(x,local);
   assert.ok(result.sourceDerivedJambCandidates.every(v=>
    v.sideSplices.every(s=>s.originalMasonrySillContactArea>.02&&s.originalUpperBeamContactArea>.02)));
   assert.ok(result.sourceMeshCpuBytes<192*1024);
   cases++;
  }
 }
 assert.equal(cases,48);
});
test('D22 rejects source forgeries, invalid post, altered Pack4 collision volume, missing window wall or lintel and oversized CPU budget',()=>{
 const b=buildings[0],g=G(b);
 assert.throws(()=>planD22OriginalInCellWindowJambs(b,g),/source owner resolvers/);
 for(const o of [{maxMeshSamples:0},{maxMeshSamples:7},{maxMeshBytes:4000},{maxMeshBytes:300000}])
  assert.throws(()=>plan(b,g,{...dep,...o}),/budget invalid/);
 assert.throws(()=>plan(b,g,{...dep,maxMeshBytes:8192}),/memory exceeded/);
 const fakePost=id=>{const x=pack2Asset(id);return {...x,boxes:x.boxes.slice(1)}};
 assert.throws(()=>plan(b,g,{...dep,originalPack2PostDefinition:fakePost}),/source physical shape changed/);
 const fakeGlass=(id,rot)=>{const q=windowShape(id,rot);
  return {...q,collision:q.collision.map((v,i)=>i===0?[0,0,0,1,1,1]:v)}};
 assert.throws(()=>plan(b,g,{...dep,resolvePack4WindowShape:fakeGlass}),/source disagree/);
 const weak=g.plannedOriginalWindowChoices.find(v=>v.structuralJambCount<2).at;
 const bad={...b,cells:b.cells.filter(c=>K(c.at)!==K([weak[0],2,weak[2]]))};
 assert.throws(()=>plan(bad,g),/wall sill or upper lintel/);
 const tamper={...g,plannedOriginalWindowChoices:g.plannedOriginalWindowChoices.map((v,i)=>
  i===0?{...v,neverOverlayOriginalGlass:false}:v)};
 assert.throws(()=>plan(b,tamper),/unowned original-glazing/);
});
