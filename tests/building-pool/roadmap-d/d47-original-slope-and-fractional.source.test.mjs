// D47 ONLY new native original W16/W17 source tests: no historic CI replay.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD47OriginalSlopedSocketsAndFractionalBarrier}
 from '../../../src/building-pool/roadmap-d/d47-original-slope-and-first-barrier-audit.mjs';
const ALL=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const a=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:a});
 return [a,s,planD25OriginalLiveWoodRoofZones(b,a,s)];};
test('D47 16 authentic author sources: independently congruent original D36 sloped socket saddle, nonintrusive source/member collision and first fractional outboard voxel entry',()=>{
 assert.equal(ALL.length,16);
 const t={buildings:0,bays:0,roots:0,roof:0,far:0,zones:0,saddles:0,realArea:0,
  areaTotal:0,minArea:Infinity,maxArea:0,socketPenetration:0,sourceClashes:0,walkClashes:0,
  theoreticalOwnerClashes:0,clearedSaddles:0,footprints:0,routePairs:0,orders:0,
  collidedOrders:0,firstVoxelWitnesses:0,firstWall:0,firstOther:0,firstSegment:0,
  middleSegment:0,lastSegment:0,sourceBodyClearPairs:0,meshSamples:0,rayDelta:0,edits:0};
 const bins=[];
 for(const b of ALL){
  const [p,s,d25]=plans(b),old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD47OriginalSlopedSocketsAndFractionalBarrier(b,p,s,d25);
  assert.equal(r.constructionAllowed,false);assert.equal(r.ratedStructuralAcceptance,false);
  assert.equal(r.realPhysicalGameWebGL2AndInstalledPwaUntested,true);
  assert.equal(r.positiveFaceAreaDoesNotEstablishMechanicalRetention,true);
  assert.equal(r.independentFastenerMaterialUnapproved,true);
  assert.equal(r.originalD36SocketMeshAndOwnerUnmodified,true);
  assert.equal(r.originalPack2Id61AndId62RegistryUnchanged,true);
  assert.equal(r.authoredNavigationAndRoofUnmodified,true);
  assert.equal(r.originalWorldWrites,0);assert.equal(r.originalSaveWrites,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],old);
  t.buildings++;t.bays+=r.bays;t.roots+=r.roots;t.roof+=r.originalWoodRoof;
  t.far+=r.stillUncertifiedFarRoof;t.zones+=r.originalFarZones;
  t.saddles+=r.sourceAuthenticSaddleProposals;t.realArea+=r.sourceSaddlesWithRealPositiveArea;
  t.areaTotal+=r.summedUnratedActualSocketFaceArea;
  t.minArea=Math.min(t.minArea,r.minSocketFaceArea);t.maxArea=Math.max(t.maxArea,r.maxSocketFaceArea);
  t.socketPenetration+=r.saddleVsSocketPositiveVolumeOverlap;
  t.sourceClashes+=r.saddleAuthoredSolidClashes;t.walkClashes+=r.saddleAuthoredWalkingBodyClashes;
  t.theoreticalOwnerClashes+=r.saddleOtherTheoreticalOwnerClashes;
  t.clearedSaddles+=r.sourceAndTheoreticalOwnersClearSaddles;
  t.footprints+=r.checkedHypotheticalFootprints;
  t.routePairs+=r.fractionalOutboardRoutePairs;t.orders+=r.fractionalExtensionOrders;
  t.collidedOrders+=r.ordersWithAnyOriginalSolid;
  t.firstVoxelWitnesses+=r.originalSourceFirstVoxelWitnesses;
  t.firstWall+=r.firstVoxelWallRoles;t.firstOther+=r.firstVoxelOtherRoles;
  t.firstSegment+=r.firstBarriersOnFirstExtensionSegment;
  t.lastSegment+=r.firstBarriersOnLastExtensionSegment;
  t.middleSegment+=r.firstBarriersOnMiddleExtensionSegment;
  t.sourceBodyClearPairs+=r.sourceAndWalkingClearExtensionPairs;
  t.meshSamples+=r.genuinePaletteMeshSamples;
  t.rayDelta=Math.max(t.rayDelta,r.maxActualTriangleVsAnalyticRayDelta);
  t.edits+=r.originalWorldWrites;
  bins.push({id:b.id,bays:r.bays,roots:r.roots,saddles:r.sourceAuthenticSaddleProposals,
   realFace:r.sourceSaddlesWithRealPositiveArea,sourceClear:r.sourceAndTheoreticalOwnersClearSaddles,
   solidClashes:r.saddleAuthoredSolidClashes,otherMemberClashes:r.saddleOtherTheoreticalOwnerClashes,
   outboardPairs:r.fractionalOutboardRoutePairs,firstWalls:r.firstVoxelWallRoles,
   firstOther:r.firstVoxelOtherRoles,firstSegment:r.firstBarriersOnFirstExtensionSegment,
   laterSegments:r.firstBarriersOnMiddleExtensionSegment+r.firstBarriersOnLastExtensionSegment});
 }
 assert.deepEqual({buildings:t.buildings,bays:t.bays,roots:t.roots,roof:t.roof,far:t.far,zones:t.zones},
  {buildings:16,bays:64,roots:128,roof:115894,far:59412,zones:34});
 assert.equal(t.saddles,128);assert.equal(t.realArea,128);
 assert.ok(t.minArea>0&&t.maxArea>t.minArea*.5);
 assert.equal(t.socketPenetration,0);assert.equal(t.walkClashes,0);
 assert.equal(t.footprints,1455);assert.equal(t.routePairs,2910);
 assert.equal(t.firstWall+t.firstOther,t.firstVoxelWitnesses);
 assert.equal(t.firstSegment+t.middleSegment+t.lastSegment,t.firstVoxelWitnesses);
 assert.ok(t.meshSamples===16&&t.rayDelta<1e-5);
 assert.equal(t.edits,0);
 console.log('D47 EXACT ORIGINAL SIXTEEN BUILDING SLOPED SOCKET AND FIRST VOXEL TOTALS '+JSON.stringify(t));
 console.log('D47 ORIGINAL SOURCE PER BUILDING BINS '+JSON.stringify(bins));
});
test('D47 original source authority and roof/walking anchors reject forged building approval, roof changes and deleted WALK',()=>{
 const b=ALL[0],[p,s,d25]=plans(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 const wrong={...b,creatorApproved:true};
 assert.throws(()=>auditD47OriginalSlopedSocketsAndFractionalBarrier(wrong,p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|original|source|unplaced|approved/i);
 assert.throws(()=>auditD47OriginalSlopedSocketsAndFractionalBarrier({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|roof|source|wood|original/i);
 assert.throws(()=>auditD47OriginalSlopedSocketsAndFractionalBarrier({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
