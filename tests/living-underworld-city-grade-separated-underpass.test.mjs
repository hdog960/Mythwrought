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
import {deriveExpectedUnderpassSourceCoordinates}
 from '../src/living-underworld/source-footprint-coordinate-witness.mjs';

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
// One exact detached source-backed synthetic case per historical site, shared
// by the original-source proof and movement witness tests. No duplicate
// expensive 290-candidate planner pass or repeated controller frames.
const coupled=new Map();
const joinedSourceAndMovement=(rx,rz)=>{
 const key=rx+','+rz;
 if(!coupled.has(key))coupled.set(key,
  auditSourceProtectedCityUnderpass(seed,rx,rz,{
   source:stone(),sourceOwnedDeepSelection:deep(rx,rz),
   auditHypotheticalMovement:true
  }));
 return coupled.get(key);
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
 assert.equal(r.threeWideFootgraphEdgeConnectivityVerified,true);
 assert.equal(r.fullNineCellDestinationPadFootgraphConnected,true);
 assert.equal(r.physicalFootgraphSections,47);
 assert.equal(r.physicalFootgraphReachableNodes,112);
 assert.equal(r.physicalFootgraphMinAccessToPadSteps,26);
 assert.equal(r.originalPlayerColliderAgainstConservativelySealedFixturePassed,true);
 assert.equal(r.originalPlayerAabbRadius,.28);
 assert.equal(r.originalPlayerAabbHeight,1.78);
 assert.equal(r.originalPlayerAabbFixtureBodySamples,622);
 assert.equal(r.originalPlayerAabbFixtureFlatSweeps,39);
 assert.equal(r.originalPlayerAabbFixtureSkippedElevationEdges,7);
 assert.equal(r.originalPlayerAabbCandidateProbes,1);
 assert.equal(r.originalPlayerStepPlayerMovementNotYetSimulated,true);
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
 assert.equal(r.threeWideFootgraphEdgeConnectivityVerified,true);
 assert.equal(r.physicalFootgraphSections,63);
 assert.equal(r.physicalFootgraphReachableNodes,187);
 assert.equal(r.physicalFootgraphMinAccessToPadSteps,100);
 assert.equal(r.originalPlayerColliderAgainstConservativelySealedFixturePassed,true);
 assert.equal(r.originalPlayerAabbFixtureBodySamples,846);
 assert.equal(r.originalPlayerAabbFixtureFlatSweeps,55);
 assert.equal(r.originalPlayerAabbFixtureSkippedElevationEdges,7);
 assert.equal(r.originalPlayerAabbCandidateProbes,1);
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
 const r=joinedSourceAndMovement(2,0);
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
 assert.equal(r.threeWideDetachedFootgraphEdgeConnectivityVerified,true);
 assert.equal(r.fullNineCellDestinationPadFootgraphConnected,true);
 assert.equal(r.detachedFootgraphFullWidthSections,47);
 assert.equal(r.detachedFootgraphReachableFootNodes,112);
 assert.equal(r.originalPlayerAabbSealedFixturePassed,true);
 assert.equal(r.originalPlayerAabbCollisionRadius,.28);
 assert.equal(r.originalPlayerAabbCollisionHeight,1.78);
 assert.equal(r.originalPlayerAabbFixtureBodySamples,622);
 assert.equal(r.originalPlayerAabbElevationChangesStillRequireStepPlayer,7);
 assert.equal(r.originalSourceChecksPassed,true);
 assert.equal(r.hypotheticalMovementAuditRequested,true);
 assert.equal(r.hypotheticalOriginalMotionSimulated,true);
 assert.equal(r.hypotheticalGradeElevationEdges,7);
 assert.equal(r.hypotheticalGradeForwardChecks,7);
 assert.equal(r.hypotheticalGradeReverseChecks,7);
 assert.equal(r.hypotheticalContinuousWalkDirections,2);
 assert.ok(r.hypotheticalContinuousWalkFrames>0);
 assert.equal(r.actualOriginalM7PlayerMotionNotVerified,true);
 assert.equal(r.releaseApproved,false);
});
test('full (2,1) source candidate counts 12711+276+135 and no original edits',()=>{
 const r=joinedSourceAndMovement(2,1);
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,13122);
 assert.equal(r.underpassSourceVisits,276);
 assert.equal(r.centerPadSourceVisits,135);
 assert.equal(r.originalSourceChecksPassed,true);
 assert.equal(r.hypotheticalMovementAuditRequested,true);
 assert.equal(r.hypotheticalGradeElevationEdges,7);
 assert.equal(r.hypotheticalContinuousWalkDirections,2);
 assert.ok(r.hypotheticalContinuousWalkFrames>0);
 assert.equal(r.originalWorldUnchanged,true);
 assert.equal(r.actualPlayerWalkingUnverified,true);
});
test('both exact seed179 candidate sites account every original callback once, without extra movement reads',()=>{
 for(const [rx,rz,bridgeCalls,padCalls] of [[2,0,248,135],[2,1,276,135]]){
  const r=joinedSourceAndMovement(rx,rz);
  assert.equal(r.ok,true);
  const visits=bridgeCalls+padCalls;
  assert.equal(r.expectedUnderpassReaderCallsPerRole,visits);
  assert.equal(r.underpassActualReaderMethodCalls,4*visits);
  assert.equal(r.sourceReaderCallsUnchangedDuringHypotheticalMotion,true);
  assert.equal(r.sourceReaderRoleBindingsUnchanged,true);
  assert.equal(r.underpassReaderIdentityCallerAuthenticatedOnly,true);
  assert.equal(r.underpassCoordinateCoveragePassed,true);
  assert.equal(r.underpassSourceRoleCoordinatesIdentical,true);
  assert.equal(r.underpassIndependentGeometryMatched,true);
  assert.equal(r.underpassIndependentSourceReaderCoordinatesVerified,true);
  assert.equal(r.underpassSourceOverlapValuesStable,true);
  assert.equal(r.underpassSourceOverlapExpectedSharedVoxels,
   r.underpassBridgePadOverlapCells);
  assert.equal(r.underpassSourceOverlapComparedSharedVoxels,
   r.underpassBridgePadOverlapCells);
  assert.equal(r.underpassSourceOverlapTotalComparisons,
   4*r.underpassBridgePadOverlapCells);
  assert.deepEqual(r.underpassSourceOverlapComparisonsByRole,{
   naturalAt:r.underpassBridgePadOverlapCells,
   authoredAt:r.underpassBridgePadOverlapCells,
   editedAt:r.underpassBridgePadOverlapCells,
   protectedAt:r.underpassBridgePadOverlapCells
  });
  assert.equal(r.underpassSourceOverlapSourceIdentityCallerOnly,true);
  assert.equal(r.underpassExpectedBridgeDistinctCells,bridgeCalls);
  assert.equal(r.underpassExpectedPadDistinctCells,padCalls);
  assert.equal(r.underpassExpectedOverlapCells,r.underpassBridgePadOverlapCells);
  assert.equal(r.underpassExpectedCombinedDistinctCells,r.underpassCombinedDistinctCells);
  const q=plan(rx,rz),independent=deriveExpectedUnderpassSourceCoordinates({
   bridgeProposal:q.proposal,centerSidePad:q.centerSidePad,floorY:q.floorY
  });
  assert.equal(independent.ok,true);
  assert.equal(independent.bridgeCells,bridgeCalls);
  assert.equal(independent.padCells,padCalls);
  assert.equal(independent.expectedOverlapCells,r.underpassBridgePadOverlapCells);
  assert.equal(r.underpassBridgeDistinctCells,bridgeCalls);
  assert.equal(r.underpassPadDistinctCells,padCalls);
  assert.equal(Number.isSafeInteger(r.underpassBridgePadOverlapCells),true);
  assert.ok(r.underpassBridgePadOverlapCells>=0);
  assert.ok(r.underpassBridgePadOverlapCells<=padCalls);
  assert.equal(r.underpassCombinedDistinctCells,
   bridgeCalls+padCalls-r.underpassBridgePadOverlapCells);
  for(const [stage,expected] of [['bridge',bridgeCalls],['pad',padCalls]]){
   assert.deepEqual(r.underpassExactStageRoleCells[stage],{
    naturalAt:expected,authoredAt:expected,editedAt:expected,protectedAt:expected
   });
   assert.deepEqual(r.underpassExactStageDuplicateCalls[stage],{
    naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0
   });
  }
  assert.deepEqual(r.underpassActualReaderCallsByRole,{
   naturalAt:visits,authoredAt:visits,editedAt:visits,protectedAt:visits
  });
  assert.equal(r.actualOriginalM7PlayerMotionNotVerified,true);
 }
});
test('seed179 original detached site (2,0) rejects two SAFE stone IDs changing on one bridge-pad overlap without a world edit',()=>{
 const planned=plan(2,0);
 const expected=deriveExpectedUnderpassSourceCoordinates({
  bridgeProposal:planned.proposal,
  centerSidePad:planned.centerSidePad,floorY:planned.floorY
 });
 assert.equal(expected.ok,true);
 const bridge=new Set(expected.bridgeCoordinates);
 const target=expected.padCoordinates.find(k=>bridge.has(k));
 assert.ok(target,'original 2,0 underpass source must overlap its center-side pad');
 const reads=new Map();
 const src={...stone(),naturalAt:(x,y,z)=>{
  const key=x+','+y+','+z;
  if(key!==target)return 1;
  const prior=reads.get(key)??0;reads.set(key,prior+1);
  return prior===0?1:2; // both ORIGINAL source geology IDs are allowed
 }};
 const r=auditSourceProtectedCityUnderpass(seed,2,0,{
  source:src,sourceOwnedDeepSelection:deep(2,0),
  auditHypotheticalMovement:true
 });
 assert.equal(reads.get(target),2);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'UNDERPASS_SOURCE_ROLE_VALUE_INCONSISTENT');
 assert.equal(r.overlapValueReason,'OVERLAP_SOURCE_ROLE_VALUE_CHANGED');
 assert.equal(r.overlapValueFirstMismatch.role,'naturalAt');
 assert.equal(r.overlapValueFirstMismatch.coordinate,target);
 assert.equal(r.sourceChecks,9198);
 assert.notEqual(r.hypotheticalOriginalMotionSimulated,true);
 assert.equal(r.worldChanged,false);
});
test('original terrain reader role replacement during bridge source checks refuses before physics',()=>{
 const mutable=stone();
 mutable.naturalAt=()=>{mutable.editedAt=()=>true;return 1;};
 const r=auditSourceProtectedCityUnderpass(seed,2,0,{
  source:mutable,sourceOwnedDeepSelection:deep(2,0),
  auditHypotheticalMovement:true
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'UNDERPASS_READER_ROLE_BINDING_CHANGED');
 assert.notEqual(r.hypotheticalOriginalMotionSimulated,true);
 assert.equal(r.sourceChecks,9198);
 assert.equal(r.underpassActualReaderCallsByRole.editedAt,383);
 assert.equal(r.worldChanged,false);
});
test('overall source budget fails BEFORE a bridge or center-pad source read',()=>{
 let oldReads=0;
 const r=auditSourceProtectedCityUnderpass(seed,2,0,{
  source:{...stone(),naturalAt:()=>{oldReads++;return 1;}},
  sourceOwnedDeepSelection:deep(2,0),
  maxTotalSourceChecks:9197,auditHypotheticalMovement:true
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

test('deep center-side landing source veto cannot be masked by a clean thin bridge',()=>{
 const p=plan(2,0),cell={x:p.to.x-1,y:p.floorY-5,z:p.to.z-1};
 const match=(x,y,z)=>x===cell.x&&y===cell.y&&z===cell.z;
 const cases=[
  [{...stone(),naturalAt:(x,y,z)=>match(x,y,z)?6:1},'UNSAFE_MATERIAL'],
  [{...stone(),naturalAt:(x,y,z)=>match(x,y,z)?0:1},'OLD_NATURAL_AIR_SUPPORT'],
  [{...stone(),naturalAt:(x,y,z)=>match(x,y,z)?0:1,
   authoredAt:(x,y,z)=>match(x,y,z)?0:undefined},'AUTHORED_AIR_SUPPORT'],
  [{...stone(),editedAt:(x,y,z)=>match(x,y,z)},'PLAYER_EDIT'],
  [{...stone(),protectedAt:(x,y,z)=>match(x,y,z)},'PROTECTED_LANDMARK']
 ];
 for(const [source,refusal] of cases){
  const r=auditSourceProtectedCityUnderpass(seed,2,0,{
   source,sourceOwnedDeepSelection:deep(2,0),
   auditHypotheticalMovement:true
  });
  assert.equal(r.ok,false);
  assert.equal(r.reason,'CENTER_SIDE_PAD_ORIGINAL_SOURCE_UNSAFE');
  assert.equal(r.firstRefusal,refusal);
  assert.equal(r.underpassSourceVisits,248);
  assert.equal(r.centerPadSourceVisits,1);
  assert.notEqual(r.hypotheticalOriginalMotionSimulated,true);
  assert.deepEqual(r.firstRejectedCell,{
   x:cell.x,y:cell.y,z:cell.z,kind:'support'
  });
  assert.equal(r.worldChanged,false);
 }
});
test('malformed original center-side landing flags and block ID fail closed',()=>{
 const p=plan(2,0),cell={x:p.to.x-1,y:p.floorY-5,z:p.to.z-1};
 const match=(x,y,z)=>x===cell.x&&y===cell.y&&z===cell.z;
 for(const [role,re] of [
  ['editedAt',/Nonboolean original M7 underpass landing edit source/],
  ['protectedAt',/Nonboolean original M7 underpass landing landmark source/]]){
  assert.throws(()=>auditSourceProtectedCityUnderpass(seed,2,0,{
   source:{...stone(),[role]:(x,y,z)=>match(x,y,z)?0:false},
   sourceOwnedDeepSelection:deep(2,0)
  }),re);
 }
 assert.throws(()=>auditSourceProtectedCityUnderpass(seed,2,0,{
  source:{...stone(),naturalAt:(x,y,z)=>match(x,y,z)?null:1},
  sourceOwnedDeepSelection:deep(2,0)
 }),/Invalid original M7 underpass landing material/);
});


// Phase23 native site witness: REAL original detached planner + sealed
// original stepPlayer + full ORIGINAL source-role gate were coupled above.
// The all-stone callback is still SYNTHETIC, not authentic FourRegionWorld.
// The opt-in original-M7 read-only script separately calls a genuine M7
// source reader, without a new fourth original-world script.
for(const [rx,rz,expectedFrom,expectedTo,expectedVisits] of [
 [2,0,{x:643,y:-132,z:151},{x:625,y:-132,z:133},9198],
 [2,1,{x:669,y:-182,z:418},{x:649,y:-182,z:396},13122]
]){
 test('seed179 detached site ('+rx+','+rz+
  ') requires source-protected seven-grade complete walking with no duplicate run',()=>{
  const selected=deep(rx,rz),geometric=plan(rx,rz);
  const proof=joinedSourceAndMovement(rx,rz);
  assert.equal(selected.ok,true);
  assert.equal(geometric.ok,true);
  assert.deepEqual(geometric.from,expectedFrom);
  assert.deepEqual(geometric.to,expectedTo);
  assert.equal(geometric.originalPlayerAabbFixtureSkippedElevationEdges,7);
  assert.equal(proof.ok,true,
   'Original detached source plus prospective real movement refused: '+
    JSON.stringify(proof));
  assert.equal(proof.sourceChecks,expectedVisits);
  assert.equal(proof.originalSourceChecksPassed,true);
  assert.equal(proof.hypotheticalGradeElevationEdges,7);
  assert.equal(proof.hypotheticalGradeForwardChecks,7);
  assert.equal(proof.hypotheticalGradeReverseChecks,7);
  assert.equal(proof.hypotheticalContinuousWalkDirections,2);
  assert.ok(proof.hypotheticalContinuousWalkFrames>0);
  assert.equal(proof.hypotheticalOnlyStagedAirStoneAndNoLiveOverlays,true);
  assert.equal(proof.actualOriginalM7PlayerMotionNotVerified,true);
  assert.equal(proof.actualPlayerWalkingUnverified,true);
  assert.equal(proof.oldFullCityFloorStillRejected,true);
  assert.equal(proof.worldChanged,false);
 });
}

test('opt-in original-player gate rejects invalid flag before any M7 source read',()=>{
 let read=0;
 assert.throws(()=>auditSourceProtectedCityUnderpass(seed,2,0,{
  source:{...stone(),naturalAt:()=>{read++;return 1;}},
  sourceOwnedDeepSelection:deep(2,0),
  auditHypotheticalMovement:1
 }),/Invalid original M7 pedestrian underpass reader/);
 assert.equal(read,0);
});
