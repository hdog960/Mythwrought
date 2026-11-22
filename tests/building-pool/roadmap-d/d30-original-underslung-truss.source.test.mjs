// New D30 source-authentic tests only. Parent D25–D29 native results reused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD30OriginalUnderslungTrussFeasibility}
 from '../../../src/building-pool/roadmap-d/d30-original-underslung-truss-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D30 16 authentic W16/W17 buildings: real Y5 corridor veto, normalized pin-truss equilibrium and zero source modifications',()=>{
 assert.equal(B.length,16);
 const total={buildings:0,roof:0,far:0,zones:0,longBays:0,cleanY5:0,
  blockedY5:0,blockedSourceCells:0,potentialClearCellCourses:0,walk:0,
  symbolicMembers:0,symbolicJoints:0,worldChanges:0};
 const bins=[];let maxCompress=0,maxTension=0,maxEI=0;
 for(const b of B){
  const first=b.cells[0],last=b.cells.at(-1),firstNav=b.navigation[0],
   len=b.cells.length,navLen=b.navigation.length;
  const [p,s,d25]=plans(b),r=auditD30OriginalUnderslungTrussFeasibility(b,p,s,d25);
  assert.equal(r.originalCellsNeverEdited,true);
  assert.equal(r.originalWALKNeverEdited,true);
  assert.equal(r.exactOriginalY7LiveWoodUnchanged,true);
  assert.equal(r.registrationOrConstructionAllowed,false);
  assert.equal(r.roofSupportCertified,false);
  assert.equal(r.originalWorldModifiedCells,0);
  assert.equal(r.realPack2DiagonalShapeNotAuthorized,true);
  assert.equal(r.actualRoofLoadsUnknown,true);
  assert.equal(r.sourceCenterlineNotCollisionCertified,true);
  assert.equal(r.originalLongBayCandidates,r.candidates.length);
  assert.equal(r.geometricallyUnobstructedY5Y6CenterlineCandidates+r.blockedUnderRoofY5ByOriginalSource,r.originalLongBayCandidates);
  assert.ok(r.candidates.every(s=>s.buildAllowed===false&&s.ratedJointsAndDiagonals===false&&
    Number.isFinite(s.idealPeakCompressionPerUnitLineLoad)&&
    Number.isFinite(s.idealPeakTensionPerUnitLineLoad)));
  assert.equal(b.cells.length,len);assert.equal(b.navigation.length,navLen);
  assert.strictEqual(b.cells[0],first);assert.strictEqual(b.cells.at(-1),last);
  assert.strictEqual(b.navigation[0],firstNav);
  total.buildings++;total.roof+=r.originalSourceRoofCells;total.far+=r.originalDistantRoofCellsStillUncertified;
  total.zones+=r.originalUncertifiedDistantZones;total.longBays+=r.originalLongBayCandidates;
  total.cleanY5+=r.geometricallyUnobstructedY5Y6CenterlineCandidates;
  total.blockedY5+=r.blockedUnderRoofY5ByOriginalSource;
  total.blockedSourceCells+=r.originalY5CellsCausingVeto;
  total.potentialClearCellCourses+=r.originalY5Y6ClearInteriorCellCourses;
  total.walk+=r.verifiedAuthoredY2WalkNodesUnderAllCandidates;
  total.symbolicMembers+=r.idealPinWebMembersAcrossCandidateScreens;
  total.symbolicJoints+=r.idealPinWebJointNodesAcrossCandidateScreens;
  total.worldChanges+=r.originalWorldModifiedCells;
  maxCompress=Math.max(maxCompress,r.largestIdealCompressionForcePerUnitUncalibratedLineLoad);
  maxTension=Math.max(maxTension,r.largestIdealTensionForcePerUnitUncalibratedLineLoad);
  maxEI=Math.max(maxEI,r.largestIdealMinCompressionEIForK1PinnedUnbracedAssumptionPerUnitLoad);
  bins.push({id:b.id,spans:r.originalLongBayCandidates,clearY5:r.geometricallyUnobstructedY5Y6CenterlineCandidates,
   blockedY5:r.blockedUnderRoofY5ByOriginalSource,y5Obstacles:r.originalY5CellsCausingVeto,
   normalizedMaxCompression:r.largestIdealCompressionForcePerUnitUncalibratedLineLoad});
 }
 assert.deepEqual([total.buildings,total.roof,total.far,total.zones,total.longBays,total.worldChanges],
  [16,115894,59412,34,64,0]);
 assert.ok(total.cleanY5>=0&&total.cleanY5<=64);
 assert.ok(total.symbolicMembers>0&&total.symbolicJoints>0);
 assert.ok(maxCompress>0&&maxTension>0&&maxEI>0);
 console.log('D30 GENUINE UNDERSLUNG ORIGINAL SOURCE TOTALS '+JSON.stringify({...total,maxCompress,maxTension,maxEI}));
 console.log('D30 GENUINE UNDERSLUNG ORIGINAL BUILDING BINS '+JSON.stringify(bins));
});
test('D30 original W16 fails closed on changed live:wood weather-plane and original approval mutation',()=>{
 const b=B[0],[p,s,d25]=plans(b);
 const roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');assert.ok(roof);
 const changed={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD30OriginalUnderslungTrussFeasibility(changed,p,s,d25),/roof|wood|source|D28|D29/);
 assert.throws(()=>auditD30OriginalUnderslungTrussFeasibility({...b,creatorApproved:true},p,s,d25),/original|unregistered|D28|D26|unplaced/);
 assert.equal(roof.asset,'live:wood');
});
