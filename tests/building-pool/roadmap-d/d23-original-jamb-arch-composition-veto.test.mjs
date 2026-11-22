// Builder D23 source-authentic full safety refusal: never stack source Pack3
// exterior arch on Pack2 in-cell jambs if overlapping or disconnected.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack2Asset,pack2Shape} from '../../../src/block-packs/pack-2/definitions.mjs';
import {pack3OrnamentalById} from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
import {planD21GroundedExteriorWindowArches} from '../../../src/building-pool/roadmap-d/d21-original-grounded-exterior-arch-shell.mjs';
import {planD22OriginalInCellWindowJambs} from '../../../src/building-pool/roadmap-d/d22-original-window-cell-jamb-splices.mjs';
import {auditD23OriginalJambArchCompatibility} from '../../../src/building-pool/roadmap-d/d23-original-jamb-arch-composition-veto.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const owner=Object.freeze({resolvePack4Asset:pack4BuilderAsset,
 resolvePack4WindowShape:windowShape,resolvePack3Ornamental:pack3OrnamentalById});
const dep2=Object.freeze({originalPack2PostDefinition:pack2Asset,
 originalPack2PostShape:pack2Shape,resolvePack4Asset:pack4BuilderAsset,
 resolvePack4WindowShape:windowShape});
const dep3=Object.freeze({resolveOriginalPack2PostShape:pack2Shape,
 resolveOriginalPack3Ornament:pack3OrnamentalById});
const plan=b=>{const g=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
 const a=planD21GroundedExteriorWindowArches(b,g,owner);
 const j=planD22OriginalInCellWindowJambs(b,g,dep2);
 return {g,a,j,result:auditD23OriginalJambArchCompatibility(b,g,a,j,dep3)};
};
const K=p=>p.join(',');
test('all 193 weak original jambs are only Pack2-only source preview; 96 real Pack3 arch overlays have 768 collisions and 480 orphan parts',()=>{
 assert.equal(B.length,16);
 let original=0,weak=0,archSamples=0,collisions=0,orphan=0,unattached=0;
 for(const b of B){
  const unchanged=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const p=plan(b),v=p.result;
  assert.equal(v.blueprintId,b.id);
  assert.equal(v.originalWindowCount,p.g.plannedOriginalWindowChoices.length);
  assert.equal(v.deficientJambSourceCount,p.j.originalWeakSideJambs);
  assert.equal(v.provisionalSingleJambProposalCount,p.j.originalWeakSideJambs);
  assert.equal(v.originalArchVsJambSourceComparisonCount,p.a.sampleCount);
  assert.equal(v.safeOriginalWindowSourcePolicy.length,p.j.originalWeakSideJambs);
  assert.equal(v.dangerousMixedPack2AndPack3ArchesExplicitlyExcluded,true);
  assert.equal(v.unapprovedDerivedDecorationsNeverRegistered,true);
  assert.equal(v.originalLiveWoodLintelAndStoneSillRetained,true);
  assert.equal(v.actualMechanicalJambLoadAccepted,false);
  assert.equal(v.originalGameCollisionAccepted,false);
  assert.equal(v.originalGameWebGL2Accepted,false);
  assert.equal(v.originalSourceVoxelsPreserved,true);
  assert.equal(v.originalAuthoredNavigationPreserved,true);
  assert.equal(v.worldPlaced,false);
  for(const c of v.genuineArchJambCollisionSamples){
   assert.equal(c.sourceArchParts,13);
   assert.equal(c.originalArchPartsIntersectingTrueJamb,8);
   assert.equal(c.sourceArchPartsWithoutPositiveIntersection,5);
   assert.equal(c.survivingOriginalArchPartsDirectlyJoinedToJamb,0);
   assert.equal(c.survivingOriginalArchPartsTouchingMasonryOrLintel,0);
   assert.equal(c.survivingOriginalArchPartsFloating,5);
   assert.equal(c.noStackingAllowed,true);
   assert.equal(c.derivedVisualRejectedForThisWeakJamb,true);
   collisions+=c.originalArchPartsIntersectingTrueJamb;
   orphan+=c.survivingOriginalArchPartsFloating;
   unattached+=c.survivingOriginalArchPartsDirectlyJoinedToJamb;
  }
  for(const item of v.safeOriginalWindowSourcePolicy){
   assert.equal(item.permittedExclusivePhysicalPreview,
    'D22 Pack2 ID62 jamb + sole Pack4 159/160/161 glazing');
   assert.equal(item.originalWorldPlaced,false,undefined); // explicit zero world write comes from worldPlaced
   assert.equal(item.worldPlaced,false);
   assert.equal(item.wallLoadAcceptance,false);
   assert.equal(item.originalGameCollisionAcceptance,false);
   assert.equal(item.originalUnmodified,true);
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),unchanged);
  original+=v.originalWindowCount;weak+=v.deficientJambSourceCount;
  archSamples+=v.originalArchVsJambSourceComparisonCount;
 }
 assert.deepEqual({original,weak,archSamples,collisions,orphan,unattached},
  {original:1233,weak:193,archSamples:96,collisions:768,orphan:480,unattached:0});
});
test('genuine original Pack2 post / Pack3 arch owner resolver mandatory; partial fake source must be refused',()=>{
 const b=B[0],{g,a,j}=plan(b);
 assert.throws(()=>auditD23OriginalJambArchCompatibility(b,g,a,j),/resolvers required/);
 const fakeP3=(id,rotation)=>{const x=pack3OrnamentalById(id,rotation);
  return {...x,parts:x.parts.map((p,i)=>i===6?{...p,tone:'wrong'}:p)};};
 assert.throws(()=>auditD23OriginalJambArchCompatibility(b,g,a,j,{
  ...dep3,resolveOriginalPack3Ornament:fakeP3}),/counterfeit/);
 const fakeP2=(id,yaw)=>{const x=pack2Shape(id,yaw);
  return {...x,boxes:x.boxes.map((v,i)=>i===0?[0,0,0,1,1,1]:v)};};
 assert.throws(()=>auditD23OriginalJambArchCompatibility(b,g,a,j,{
  ...dep3,resolveOriginalPack2PostShape:fakeP2}),/invalid source geometry/);
 const altered={...b,cells:b.cells.map(c=>c.role==='beam'&&c.feature==='lintel'?
  {...c,asset:'live:crystal'}:c)};
 assert.throws(()=>auditD23OriginalJambArchCompatibility(altered,g,a,j,dep3),/structural source ownership/);
 const missing={...j,sourceDerivedJambCandidates:j.sourceDerivedJambCandidates.slice(1)};
 assert.throws(()=>auditD23OriginalJambArchCompatibility(b,g,a,missing,dep3),/every original deficient/);
 const forgedArch={...a,supportedExteriorDecorativeSamples:a.supportedExteriorDecorativeSamples.map((x,i)=>
  i===0?{...x,sourceShapeParts:x.sourceShapeParts.map((p,j)=>j===0?
    {...p,sourceBox:[0,0,0,1,1,1]}:p)}:x)};
 assert.throws(()=>auditD23OriginalJambArchCompatibility(b,g,forgedArch,j,dep3),/counterfeit/);
});
