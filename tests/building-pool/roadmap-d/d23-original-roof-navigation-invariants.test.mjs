// MYTHWROUGHT Builder D23 focused native-original source test. Not a live world.
// This deliberately rejects substitute Pack3 roof claims and forbidden piers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {auditD23OriginalRoofNavigationInvariants} from '../../../src/building-pool/roadmap-d/d23-original-roof-navigation-invariants.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const P=b=>{const primary=planD19SourceProvenRoofTrusses(b);
 return [primary,planD22SecondaryOriginalRoofTrusses(b,{existing:primary})]};
const K=p=>p.join(',');
test('all 16 original roof sources: 115894 REAL live:wood roof cells and all 107819 empty full-height columns overlap original navigation',()=>{
 assert.equal(B.length,16);
 let roof=0,fullyOpen=0,blocked=0,walkFree=0,footings=0,overhead=0;
 let nearOld=0,nearNew=0,far=0,farthest=0,primarySpans=0,extraSpans=0;
 for(const b of B){
  const original=b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';');
  const [primary,secondary]=P(b);
  const a=auditD23OriginalRoofNavigationInvariants(b,primary,secondary);
  assert.equal(a.originalRoofSourceAsset,'live:wood');
  assert.equal(a.sourcePack3ActuallyAuthoredOnRoof,false);
  assert.deepEqual(a.originalPack3RoofIdsOnlyMaterialReplacementProposals,[109,110,111,112]);
  assert.equal(a.groundedSourceFloorColumns,a.originalRoofPlaneCells);
  assert.equal(a.overlappingAuthoredNavigationColumns,a.originalEmptyFullHeightY2ToY6Columns);
  assert.equal(a.currentlyWalkwayFreePotentialFullHeightPiers,0);
  assert.equal(a.impossibleToAddGroundedPiersWithoutAlteringAuthoredNavigation,true);
  assert.equal(a.minimumProposedBeamVerticalGapAboveWalkY2,4);
  assert.equal(a.verifiedExistingPhysicalBeamProposals,
   primary.proposedBeamCells.length+secondary.proposedBeamCells.length);
  assert.equal(a.sourceRoofRadius,8);
  assert.equal(a.sourceRoofNearPrimaryAndSecondary>=a.sourceRoofNearPrimary,true);
  assert.equal(a.sourceRoofMaxHorizontalDistance>8,true);
  assert.equal(a.roofContiguityNotGravityLoadCertification,true);
  assert.equal(a.allProposedRoofPhysicsUnaccepted,true);
  assert.equal(a.noNewAuthoredWorldVoxels,true);
  assert.equal(a.allOriginalSourceCellsUnchanged,true);
  assert.equal(a.allAuthoredNavigationCellsRetained,true);
  assert.equal(a.originalGameWebGL2Unaccepted,true);
  assert.equal(a.iphonePwaUnaccepted,true);
  assert.equal(a.worldPlaced,false);
  for(const xy of a.sampledProhibitedPierPositions){
   assert.ok(b.navigation.some(n=>n.at[0]===xy[0]&&n.at[2]===xy[1]));
   for(let y=2;y<=6;y++)assert.ok(!b.cells.some(c=>K(c.at)===K([xy[0],y,xy[1]])),
     'an original wall was mistaken for an empty navigation column');
  }
  assert.equal(b.cells.map(x=>K(x.at)+'|'+x.role+'|'+x.asset).join(';'),original);
  roof+=a.originalRoofPlaneCells;
  fullyOpen+=a.originalEmptyFullHeightY2ToY6Columns;
  blocked+=a.overlappingAuthoredNavigationColumns;
  walkFree+=a.currentlyWalkwayFreePotentialFullHeightPiers;
  footings+=a.realOriginalFoundationWallRoofCells;
  overhead+=a.verifiedExistingPhysicalBeamProposals;
  nearOld+=a.sourceRoofNearPrimary;nearNew+=a.sourceRoofNearPrimaryAndSecondary;
  far+=a.originalRoofBeyondRadius;farthest=Math.max(farthest,a.sourceRoofMaxHorizontalDistance);
  primarySpans+=a.originalPrimarySpans;extraSpans+=a.originalSecondarySpans;
 }
 assert.deepEqual({roof,fullyOpen,blocked,walkFree,footings,overhead,
  nearOld,nearNew,far,farthest,primarySpans,extraSpans},{
  roof:115894,fullyOpen:107819,blocked:107819,walkFree:0,footings:6273,
  overhead:1270,nearOld:56424,nearNew:56449,far:59445,farthest:48,
  primarySpans:90,extraSpans:91
 });
});
test('navigation protection is source-sensitive, not an invented permanent no-pier rule',()=>{
 const b=B[0],[p,s]=P(b),original=auditD23OriginalRoofNavigationInvariants(b,p,s);
 const xy=original.sampledProhibitedPierPositions[0];
 assert.ok(xy);
 const reduced={...b,navigation:b.navigation.filter(n=>
   !(n.at[0]===xy[0]&&n.at[2]===xy[1]))};
 const a=auditD23OriginalRoofNavigationInvariants(reduced,p,s);
 assert.equal(a.currentlyWalkwayFreePotentialFullHeightPiers,1);
 assert.equal(a.impossibleToAddGroundedPiersWithoutAlteringAuthoredNavigation,false);
 assert.equal(original.currentlyWalkwayFreePotentialFullHeightPiers,0);
 assert.equal(b.navigation.length,reduced.navigation.length+1);
});
test('D23 fails closed on replacement roofing, duplicate source, fake overhead beams and invalid source gap policy',()=>{
 const b=B[0],[p,s]=P(b);
 for(const radius of [0,17,Infinity])assert.throws(()=>
  auditD23OriginalRoofNavigationInvariants(b,p,s,{radius}),/radius/);
 const first=b.cells.find(c=>c.role==='roof'&&c.feature==='weather-plane');
 const altered={...b,cells:b.cells.map(c=>c===first?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD23OriginalRoofNavigationInvariants(altered,p,s),/original Y7 roofing/);
 const duplicate={...b,cells:[...b.cells,{...b.cells[0],at:[...b.cells[0].at]}]};
 assert.throws(()=>auditD23OriginalRoofNavigationInvariants(duplicate,p,s),/duplicate/);
 const bad={...p,proposedBeamCells:p.proposedBeamCells.map((q,i)=>
  i===0?{...q,at:[q.at[0],7,q.at[2]]}:q)};
 assert.throws(()=>auditD23OriginalRoofNavigationInvariants(b,bad,s),/Proposed source/);
 assert.throws(()=>auditD23OriginalRoofNavigationInvariants({...b,worldPlaced:true},p,s),
  /unregistered/);
});
