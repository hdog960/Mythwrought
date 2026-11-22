// D21 focused native Node source tests, never a fake original-game screenshot.
// Full Pack3 121 *original* authored geometry + real Pack4 159/160/161 glazing.
// Derived outer-depth arch is a NEW unregistered visual, not a standalone block.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack3OrnamentalById} from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
import {planD21GroundedExteriorWindowArches} from '../../../src/building-pool/roadmap-d/d21-original-grounded-exterior-arch-shell.mjs';
const original=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const dep=Object.freeze({resolvePack3Ornamental:pack3OrnamentalById,
 resolvePack4WindowShape:windowShape,resolvePack4Asset:pack4BuilderAsset});
const K=a=>a.join(',');
const side=Object.freeze({north:0,east:1,south:2,west:3});
const volCross=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6);
const strongJoin=(a,b)=>{const d=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return d.every(x=>x>=-1e-6)&&d.filter(x=>x>1e-6).length>=2};
const create=(b,d19=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset}))=>
 planD21GroundedExteriorWindowArches(b,d19,dep);
test('16 original 4B structures: 193 flagged windows, 96 real grounded exterior arches, source-backed bounded original Pack3/Pack4 geometry',()=>{
 assert.equal(original.length,16);
 let totalWindows=0,totalBad=0,totalPhysical=0,totalBytes=0,maxTriangles=0,positiveAnchor=0;
 const seenSourceColors=new Set(),glazingFamilies=new Set(),facings=new Set();
 for(const b of original){
  const unchanged=b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';');
  const originalAt=new Map(b.cells.map(c=>[K(c.at),c]));
  const a=create(b);
  assert.equal(a.blueprintId,b.id);
  assert.ok(a.originalWindows>=8&&a.originalWindowsNeedingJambRemediation>=1);
  assert.equal(a.sampleCount,6);
  assert.ok(a.sourcePreviewByteCount<=256*1024);
  assert.equal(a.originalWallSillContactVerifiedOnSampledSite,true);
  assert.equal(a.fullHistoricWindowRemediation,false);
  assert.equal(a.actualStructuralJambAcceptance,false);
  assert.equal(a.originalGameWebGL2Acceptance,false);
  assert.equal(a.iPhoneHomeScreenPwaAcceptance,false);
  assert.equal(a.noOriginalSourceVoxelsEdited,true);
  assert.equal(a.noPack2Or3Or4SourceOwnerEdits,true);
  assert.equal(a.noWorldOccupiedCellAdded,true);
  assert.equal(a.worldPlaced,false);
  for(const p of a.supportedExteriorDecorativeSamples){
   assert.equal(originalAt.get(K(p.at))?.role,'window');
   assert.equal(originalAt.get(K([p.at[0],p.at[1]-1,p.at[2]]))?.role,'wall');
   assert.equal(originalAt.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role,'beam');
   assert.equal(p.originalSourcePartCount,13);
   assert.equal(p.groundedArchParts,13);
   assert.equal(p.sourceConnectedParts,13);
   assert.ok(p.originalSillContactParts>=2);
   assert.ok(p.trueGroundedSillContactArea>0);
   assert.equal(p.originalGlassNoIntersection,true);
   assert.equal(p.sourceHiddenFaceCount,2);
   assert.ok(p.composedTriangles<=320);
   assert.equal(p.composedTriangles,p.originalArchTriangles+p.originalGlassTriangles);
   assert.equal(p.worldSourceVertexBytes,p.composedTriangles*30*4);
   assert.equal(p.worldSourceVertexBytes,
    p.originalWorldArchOpaque.byteLength+p.originalWorldGlassOpaque.byteLength+
    p.originalWorldGlassTranslucent.byteLength);
   assert.equal(p.exteriorFrontOnly,true);
   assert.equal(p.positiveAreaOriginalWallSillContact,true);
   assert.equal(p.worldPlaced,false);
   assert.equal(p.noRoofLoadClaim,true);
   assert.equal(p.worldCollisionAndSelectionUnaccepted,true);
   assert.equal(p.transparentDepthOrderUnaccepted,true);
   assert.equal(p.derivedNonRegisteredVisual,true);
   assert.equal(p.notUnmodifiedPack3Block,true);
   glazingFamilies.add(p.originalGlazingId);facings.add(p.facing);
   const arch=pack3OrnamentalById(121,side[p.facing]);
   const physical=windowShape(p.originalGlazingId,side[p.facing]);
   const masks=[...physical.visible.map(x=>x.bounds),...physical.selection,...physical.collision];
   const graph=new Set(),stack=[0];
   while(stack.length){const i=stack.pop();if(graph.has(i))continue;graph.add(i);
    for(let j=0;j<p.sourceShapeParts.length;j++)
      if(!graph.has(j)&&strongJoin(p.sourceShapeParts[i].sourceBox,p.sourceShapeParts[j].sourceBox))stack.push(j);
   }
   assert.equal(graph.size,13);
   assert.ok(p.sourceShapeParts.some(x=>x.sourceBox[1]===0));
   for(const x of p.sourceShapeParts){
    const originalSource=arch.parts[x.index];
    assert.ok(originalSource,'source retained invented Pack3 original part');
    assert.equal(x.tone,originalSource.tone);
    assert.equal(x.color,arch.colors[x.tone]);
    assert.deepEqual(x.originalBox,originalSource.box);
    assert.ok(!masks.some(y=>volCross(x.sourceBox,y)));
    seenSourceColors.add(x.color);
   }
   for(const verts of [p.originalWorldArchOpaque,p.originalWorldGlassOpaque,
     p.originalWorldGlassTranslucent]){
    assert.ok(verts instanceof Float32Array);
    assert.equal(verts.length%30,0);
    for(let j=0;j<verts.length;j+=10){
     for(let k=0;k<3;k++)assert.ok(verts[j+k]>=p.at[k]-1e-5&&
       verts[j+k]<=p.at[k]+1+1e-5);
     assert.ok(Math.abs(Math.hypot(verts[j+3],verts[j+4],verts[j+5])-1)<.001);
     for(let k=6;k<10;k++)assert.ok(verts[j+k]>=0&&verts[j+k]<=1);
    }
   }
   const v=p.originalWorldArchOpaque;
   for(let j=0;j<v.length;j+=30){
    const u=[v[j+10]-v[j],v[j+11]-v[j+1],v[j+12]-v[j+2]],
      w=[v[j+20]-v[j],v[j+21]-v[j+1],v[j+22]-v[j+2]];
    const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
    assert.ok(n[0]*v[j+3]+n[1]*v[j+4]+n[2]*v[j+5]>1e-10,
      'source-original Pack3 arch exterior mesh triangle winding is inverted');
   }
   maxTriangles=Math.max(maxTriangles,p.composedTriangles);positiveAnchor++;
  }
  totalPhysical+=a.sampleCount;totalBad+=a.originalWindowsNeedingJambRemediation;
  totalWindows+=a.originalWindows;totalBytes+=a.sourcePreviewByteCount;
  assert.equal(b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';'),unchanged);
 }
 assert.deepEqual({totalWindows,totalBad,totalPhysical,totalBytes,maxTriangles},
  {totalWindows:1233,totalBad:193,totalPhysical:96,totalBytes:2619360,maxTriangles:320});
 assert.deepEqual([...glazingFamilies].sort((a,b)=>a-b),[159,160,161]);
 assert.equal(facings.size,4);
 assert.ok(seenSourceColors.size>=3);
 assert.equal(positiveAnchor,96);
});
test('true original Pack3 arch on all orientations: clear, sun and moon glass stay grounded and <=320 triangles with source-owner mesh equivalence',()=>{
 let cases=0;
 for(const b of original){
  const actual=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
  for(const id of [159,160,161]){
   const ref=id===159?'pack4:030':'pack4:031';
   const variant={...actual,plannedOriginalWindowChoices:actual.plannedOriginalWindowChoices.map(v=>({
    ...v,candidateId:id,candidateRef:ref
   }))};
   const plan=create(b,variant);
   assert.equal(plan.sampleCount,6);
   for(const p of plan.supportedExteriorDecorativeSamples){
    assert.equal(p.originalGlazingId,id);
    assert.equal(p.composedTriangles,id===159?212:id===160?296:320);
    assert.equal(p.sourceHiddenFaceCount,2);
    assert.ok(p.trueGroundedSillContactArea>0);
    assert.ok(p.originalGlassNoIntersection);
    cases++;
   }
  }
 }
 assert.equal(cases,288);
});
test('D21 fails closed on fake Pack3 body, mismatched real Pack4 source geometry, damaged wall bearing, source counterfeit and excessive memory',()=>{
 const b=original[0],base=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
 assert.throws(()=>planD21GroundedExteriorWindowArches(b,base),/resolvers required/);
 for(const opts of [{maxSites:0},{maxSites:7},{maxPreviewBytes:8000},{maxPreviewBytes:400000}])
  assert.throws(()=>planD21GroundedExteriorWindowArches(b,base,{...dep,...opts}),/budget/);
 assert.throws(()=>planD21GroundedExteriorWindowArches(b,base,{
  ...dep,maxPreviewBytes:8192}),/memory cap/);
 const fakeArch=(id,rot)=>{const a=pack3OrnamentalById(id,rot);
  return {...a,parts:a.parts.slice(1),boxes:a.boxes.slice(1)}};
 assert.throws(()=>planD21GroundedExteriorWindowArches(b,base,{
  ...dep,resolvePack3Ornamental:fakeArch}),/arch source/);
 const fakeWindow=(id,rot)=>{const a=windowShape(id,rot);
  return {...a,visible:a.visible.map((p,j)=>j===0?{...p,bounds:[0,0,0,1,1,1]}:p)}};
 assert.throws(()=>planD21GroundedExteriorWindowArches(b,base,{
  ...dep,resolvePack4WindowShape:fakeWindow}),/disagree/);
 const noWall={...b,cells:b.cells.filter(c=>K(c.at)!==K([base.plannedOriginalWindowChoices.find(v=>v.structuralJambCount<2).at[0],2,base.plannedOriginalWindowChoices.find(v=>v.structuralJambCount<2).at[2]]))};
 assert.throws(()=>planD21GroundedExteriorWindowArches(noWall,base,dep),/no structural masonry/);
});
