// Builder D23 framed-window decoration: authentic Pack3 ID121 source used ONLY
// on original full-stone-jamb sites; weak windows reserved for isolated D22.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack3OrnamentalById} from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
import {planD23ExteriorArchesOnlyOnOriginalFullJambWindows} from '../../../src/building-pool/roadmap-d/d23-original-framed-window-exterior-decor.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS],K=p=>p.join(',');
const dep=Object.freeze({resolvePack3Ornamental:pack3OrnamentalById,
 resolvePack4WindowShape:windowShape,resolvePack4Asset:pack4BuilderAsset});
const G=b=>planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
const make=(b,g=G(b),x=dep)=>planD23ExteriorArchesOnlyOnOriginalFullJambWindows(b,g,x);
const F=Object.freeze({north:0,east:1,south:2,west:3});
test('all 1040 genuinely two-sided original masonry windows allow source-authentic Pack3 decorated previews, while 193 weak windows cannot overlap Pack2 jamb',()=>{
 assert.equal(B.length,16);
 let total=0,framed=0,weak=0,samples=0,bytes=0;
 const facings=new Set(),glazing=new Set(),colors=new Set();
 for(const b of B){
  const unchanged=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const m=new Map(b.cells.map(c=>[K(c.at),c]));
  const p=make(b);
  assert.equal(p.blueprintId,b.id);
  assert.equal(p.allAuthoredOriginalWindows,
   p.alreadyFramedOriginalWindowCount+p.physicallyDeficientWindowsHeldForExclusivePack2Jamb);
  assert.equal(p.sourcePreviewCount,6);
  assert.ok(p.sourcePreviewBytes<=256*1024);
  assert.equal(p.noWeakJambSiteDecorativePreview,true);
  assert.equal(p.noPack2SourceJambAndPack3ArchOverlay,true);
  assert.equal(p.originalPack3AndPack4Preserved,true);
  assert.equal(p.originalGamePhysicsAndPickingUnaccepted,true);
  assert.equal(p.originalGameWebGL2Unaccepted,true);
  assert.equal(p.iphoneHomeScreenPwaUnaccepted,true);
  assert.equal(p.newWorldCellsAdded,0);
  assert.equal(p.worldPlaced,false);
  const allowed=new Set(p.originalFramedWindowSourceChoices.map(x=>K(x.at)));
  assert.equal(allowed.size,p.alreadyFramedOriginalWindowCount);
  for(const c of p.originalFramedWindowSourceChoices){
   assert.equal(c.sourceExistingTwoSideMasonryAtY3,true);
   assert.equal(c.sourceExistingTwoSideMasonryBelowY3,true);
   assert.equal(c.originalSourceUnmodified,true);
   assert.equal(c.decorativeNotLive,true);
   assert.equal(m.get(K(c.at))?.role,'window');
   assert.equal(m.get(K(c.at))?.asset,'pack4:030');
  }
  for(const sample of p.actualSourceDecorativeSamples){
   assert.ok(allowed.has(K(sample.at)),'source decorative preview selected a weak-jamb window');
   assert.equal(sample.trueOriginalStoneSideJambCount,2);
   assert.ok(sample.realOriginalStoneFaceContactCountLeft>=1);
   assert.ok(sample.realOriginalStoneFaceContactCountRight>=1);
   assert.equal(sample.decorativeArchDerivedFromOriginalPack3Id121,true);
   assert.equal(sample.onlyOriginalPack4GlassPresent,true);
   assert.equal(sample.proposedPack2D22JambNotAtThisSite,true);
   assert.equal(sample.originalSourceCellsUnchanged,true);
   assert.equal(sample.worldPlaced,false);
   const geometry=sample.sourceDecorativeGeometry;
   assert.equal(geometry.originalGlazingId,sample.originalGlazingId);
   assert.equal(geometry.originalPack3SourceId,121);
   assert.equal(geometry.sourceConnectedParts,13);
   assert.equal(geometry.originalGlassNoIntersection,true);
   assert.equal(geometry.composedTriangles,geometry.originalGlazingId===159?212:
      geometry.originalGlazingId===160?296:320);
   assert.equal(geometry.worldSourceVertexBytes,
      geometry.originalWorldArchOpaque.byteLength+
      geometry.originalWorldGlassOpaque.byteLength+
      geometry.originalWorldGlassTranslucent.byteLength);
   const arch=pack3OrnamentalById(121,F[sample.facing]);
   for(const part of geometry.sourceShapeParts){
    assert.deepEqual(part.originalBox,arch.parts[part.index].box);
    assert.equal(part.color,arch.colors[part.tone]);
    colors.add(part.color);
   }
   facings.add(sample.facing);glazing.add(sample.originalGlazingId);
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),unchanged);
  total+=p.allAuthoredOriginalWindows;framed+=p.alreadyFramedOriginalWindowCount;
  weak+=p.physicallyDeficientWindowsHeldForExclusivePack2Jamb;
  samples+=p.sourcePreviewCount;bytes+=p.sourcePreviewBytes;
 }
 assert.deepEqual({total,framed,weak,samples,bytes},
  {total:1233,framed:1040,weak:193,samples:96,bytes:2689920});
 assert.equal(facings.size,4);
 assert.deepEqual([...glazing].sort((a,b)=>a-b),[159,160,161]);
 assert.ok(colors.size>=3);
});
test('all 3 authentic original Pack4 glass variants remain separate exterior framed decorations, 288 source sample meshes within budget',()=>{
 let combinations=0;
 for(const b of B){
  const base=G(b);
  for(const id of [159,160,161]){
   const newGlazing={...base,plannedOriginalWindowChoices:base.plannedOriginalWindowChoices.map(c=>({
    ...c,candidateId:id,candidateRef:id===159?'pack4:030':'pack4:031'
   }))};
   const plan=make(b,newGlazing);
   assert.equal(plan.sourcePreviewCount,6);
   assert.ok(plan.actualSourceDecorativeSamples.every(s=>s.originalGlazingId===id));
   assert.ok(plan.sourcePreviewBytes<=256*1024);
   assert.ok(plan.actualSourceDecorativeSamples.every(s=>s.sourceDecorativeGeometry.composedTriangles<=320));
   combinations+=plan.sourcePreviewCount;
  }
 }
 assert.equal(combinations,288);
});
test('framed-window original stone neighboring walls and exact Pack3/4 shape producers are mandatory; forged geometry never approved',()=>{
 const b=B[0],g=G(b);
 assert.throws(()=>planD23ExteriorArchesOnlyOnOriginalFullJambWindows(b,g),
  /producers required/);
 for(const opts of [{maxSamples:0},{maxSamples:7},{maxCpuBytes:5000},{maxCpuBytes:300000}])
  assert.throws(()=>make(b,g,{...dep,...opts}),/policy exceeded/);
 assert.throws(()=>make(b,g,{...dep,maxCpuBytes:8192}),/memory budget/);
 const original=make(b);
 const first=original.originalFramedWindowSourceChoices[0],off=
  first.facing==='north'||first.facing==='south'?[1,0]:[0,1];
 const target=[first.at[0]+off[0],first.at[1],first.at[2]+off[1]];
 const fake={...b,cells:b.cells.map(c=>K(c.at)===K(target)?{...c,asset:'live:crystal'}:c)};
 assert.throws(()=>make(fake,g),/source side-jamb census mismatch/);
 const spoof=(id,rot)=>{const arch=pack3OrnamentalById(id,rot);
  return {...arch,id:120}};
 assert.throws(()=>make(b,g,{...dep,resolvePack3Ornamental:spoof}),/arch source/);
 assert.throws(()=>make({...b,integrated:true},g),/original framed-window source/);
});
