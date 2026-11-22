import test from 'node:test';
import assert from 'node:assert/strict';
import {planGradeSeparatedCityUnderpass,
 auditSourceProtectedCityUnderpass}
 from '../src/living-underworld/city-gallery-grade-separated-underpass.mjs';
import {selectCityCompatibleDeepLinks}
 from '../src/living-underworld/source-aware-city-deep-selection.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance,auditCombinedStairFootprints}
 from '../src/living-underworld/combined-stair-footprints.mjs';
import {auditSupportedEntranceStairs}
 from '../src/living-underworld/walkable-entrance-stairs.mjs';

const seed=179;
const stone=()=>({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const prior=new Map(),planned=new Map();
const deep=(rx,rz)=>{
 const key=rx+','+rz;
 if(!prior.has(key))prior.set(key,selectCityCompatibleDeepLinks(
  seed,rx,rz,{source:stone()}));
 const p=prior.get(key);
 assert.equal(p.ok,true);
 assert.deepEqual(p.chosen.map(x=>x.index),[16,25,34]);
 return p;
};
const plan=(rx,rz)=>{
 const key=rx+','+rz;
 if(!planned.has(key))planned.set(key,
  planGradeSeparatedCityUnderpass(seed,rx,rz,{
   sourceOwnedDeepSelection:deep(rx,rz)
  }));
 return planned.get(key);
};

test('seed179 (2,0) bypass bends around the selected access route with a full-depth center pad',()=>{
 const r=plan(2,0);
 assert.equal(r.ok,true);
 assert.deepEqual(r.from,{x:643,y:-132,z:151});
 assert.deepEqual(r.to,{x:625,y:-132,z:133});
 assert.deepEqual(r.originalCityCenter,{x:623,y:-132,z:131});
 assert.deepEqual(r.pivot,{x:628,y:-132,z:134});
 assert.equal(r.segments,2);
 assert.equal(r.threeWideSupportCells,62);
 assert.equal(r.threeHighClearanceCells,186);
 assert.equal(r.originalVoxelSourceVisitsRequired,248);
 assert.equal(r.centerSidePadOriginalSourceVisitsRequired,135);
 assert.equal(r.centerPadThreeWideFullDepthAndOneCellEasementSafe,true);
 assert.equal(r.globalSearchComplete,true);
 assert.equal(r.inspectedCandidates,290);
 assert.equal(r.oldFullCityFloorNotApproved,true);
 assert.equal(r.worldChanged,false);
});
test('seed179 (2,1) direct three-wide bridge stops at nearby safe center-side pad',()=>{
 const r=plan(2,1);
 assert.equal(r.ok,true);
 assert.deepEqual(r.from,{x:669,y:-182,z:418});
 assert.deepEqual(r.to,{x:649,y:-182,z:396});
 assert.equal(r.pivot,null);
 assert.equal(r.segments,1);
 assert.equal(r.threeWideSupportCells,69);
 assert.equal(r.threeHighClearanceCells,207);
 assert.equal(r.originalVoxelSourceVisitsRequired,276);
 assert.equal(r.centerSidePadOriginalSourceVisitsRequired,135);
 assert.equal(r.exactOriginalCityCenterWalkableLandingNotCertified,true);
 assert.equal(r.originalM7SourceOwnershipNotYetVerified,true);
});
test('independent full 5x5 15-high center-pad margin and thin bridge preserve all old geometry',()=>{
 for(const [rx,rz] of [[2,0],[2,1]]){
  const r=plan(rx,rz),p=deep(rx,rz);
  const main=compileMainGalleryPedestrianClearance(seed,rx,rz);
  const selectedRoutes=[...p.deepProposals,
   p.joined.sourceAuditedCityAccessRouteGeometry];
  const selected=compileSelectedStairPedestrianClearance(selectedRoutes);
  assert.equal(main.ok,true);assert.equal(selected.ok,true);
  const grade=auditSupportedEntranceStairs(r.proposal);
  assert.equal(grade.ok,true);
  assert.equal(main.inspect(r.proposal).ok,true);
  assert.equal(auditCombinedStairFootprints([...selectedRoutes,r.proposal]).ok,true);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)
   for(let y=r.floorY-5;y<=r.floorY+9;y++){
    const type=y<=r.floorY?'support':'clearance';
    assert.equal(main.inspectCell(r.to.x+dx,y,r.to.z+dz,type),null);
    assert.equal(selected.inspectCell(r.to.x+dx,y,r.to.z+dz,type),null);
   }
 }
});
test('full (2,0) candidate source proof conserves 8815+248+135 exact visits',()=>{
 const r=auditSourceProtectedCityUnderpass(seed,2,0,{
  source:stone(),sourceOwnedDeepSelection:deep(2,0)
 });
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,9198);
 assert.equal(r.originalFourHubSourceChecks,8815);
 assert.equal(r.underpassSourceVisits,248);
 assert.equal(r.centerPadSourceVisits,135);
 assert.equal(r.centerPadSolidSupports,54);
 assert.equal(r.centerPadProspectiveExcavation,81);
 assert.equal(r.centerSideThreeWideLandingJoinedByCandidatePedestrianUnderpass,true);
 assert.equal(r.exactOriginalCityCenterThreeWideLandingUnverified,true);
 assert.equal(r.oldFullCityFloorStillRejected,true);
 assert.equal(r.releaseApproved,false);
});
test('full (2,1) source candidate counts 12711+276+135 and no original edits',()=>{
 const r=auditSourceProtectedCityUnderpass(seed,2,1,{
  source:stone(),sourceOwnedDeepSelection:deep(2,1)
 });
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,13122);
 assert.equal(r.underpassSourceVisits,276);
 assert.equal(r.centerPadSourceVisits,135);
 assert.equal(r.originalWorldUnchanged,true);
 assert.equal(r.actualPlayerWalkingUnverified,true);
});
test('overall source budget fails BEFORE a bridge or center-pad source read',()=>{
 let oldReads=0;
 const r=auditSourceProtectedCityUnderpass(seed,2,0,{
  source:{...stone(),naturalAt:()=>{oldReads++;return 1;}},
  sourceOwnedDeepSelection:deep(2,0),
  maxTotalSourceChecks:9197
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'UNDERPASS_ORIGINAL_SOURCE_BUDGET');
 assert.equal(r.requiredAdditionalVisits,383);
 assert.equal(r.sourceChecks,8815);
 assert.equal(oldReads,0);
 assert.equal(r.worldChanged,false);
});
test('original ore, natural AIR, authored cave AIR, edits and landmarks remain vetoes',()=>{
 const cases=[
  [{...stone(),naturalAt:()=>6},'UNSAFE_MATERIAL'],
  [{...stone(),naturalAt:()=>0},'EXISTING_AIR_SUPPORT'],
  [{...stone(),naturalAt:()=>0,authoredAt:()=>0},'AUTHORED_AIR_SUPPORT'],
  [{...stone(),editedAt:()=>true},'PLAYER_EDIT'],
  [{...stone(),protectedAt:()=>true},'PROTECTED_LANDMARK']
 ];
 for(const [source,why] of cases){
  const r=auditSourceProtectedCityUnderpass(seed,2,0,{
   source,sourceOwnedDeepSelection:deep(2,0)
  });
  assert.equal(r.ok,false);
  assert.equal(r.reason,'UNDERPASS_ORIGINAL_SOURCE_UNSAFE');
  assert.equal(r.firstRefusal,why);
  assert.equal(r.worldChanged,false);
 }
});
test('false and numeric original edit/landmark flags cannot be confused',()=>{
 for(const [role,pattern] of [
  ['editedAt',/Nonboolean original M7 stair edit source/],
  ['protectedAt',/Nonboolean original M7 stair landmark source/]
 ]){
  for(const value of [0,null,'false'])
   assert.throws(()=>auditSourceProtectedCityUnderpass(seed,2,0,{
    source:{...stone(),[role]:()=>value},
    sourceOwnedDeepSelection:deep(2,0)
   }),pattern);
 }
});
test('wrong seed and forged four-hub deep proposal cannot supply underpass proof',()=>{
 const p=deep(2,0);
 for(const sourceOwnedDeepSelection of [
  {...p,seed:2026},
  {...p,deepProposals:[...p.deepProposals.slice(0,2),
   {...p.deepProposals[2],index:16}]},
  {...p,joined:{...p.joined,completeDeepLinkSourceOwnershipVerified:false}}
 ]){
  const r=planGradeSeparatedCityUnderpass(seed,2,0,{
   sourceOwnedDeepSelection
  });
  assert.equal(r.ok,false);
  assert.equal(r.reason,'FOUR_HUB_SOURCE_AUDITED_APPROACH_REQUIRED');
 }
});
test('bounded search cannot call an untested direct route impossible',()=>{
 const p=planGradeSeparatedCityUnderpass(seed,2,0,{
  sourceOwnedDeepSelection:deep(2,0),maxCandidates:1
 });
 assert.equal(p.ok,false);
 assert.equal(p.reason,'UNDERPASS_SEARCH_LIMIT_REACHED');
 assert.equal(p.globalSearchComplete,false);
 const q=planGradeSeparatedCityUnderpass(seed,2,1,{
  sourceOwnedDeepSelection:deep(2,1),maxCandidates:1
 });
 assert.equal(q.ok,true);
 assert.equal(q.globalSearchComplete,false);
 assert.equal(q.segments,1);
});
