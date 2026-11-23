// ONLY NEW D36 real original W16/W17 source test. Existing D25–D35 exact CI reused.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD36OriginalWallSocketTransitions}
 from '../../../src/building-pool/roadmap-d/d36-original-wall-socket-audit.mjs';
const all=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D36 all original W16/W17 buildings: 128 genuine source-rooted independent wall-socket convex previews, all construction approvals vetoed',()=>{
 assert.equal(all.length,16);
 const totals={buildings:0,originalRoofCells:0,originalUncertifiedFarRoofCells:0,
  originalFarZones:0,longBays:0,theoreticalMembers:0,pinNodes:0,rootDiagonals:0,
  sourceClearTrimmedRoots:0,sourceRootStillBlocked:0,attemptedIndependentSockets:0,
  socketsWithSourceCellClashes:0,socketsWithOwnerMemberClashes:0,
  sourceClearWallSocketCandidates:0,originalRootWallCollisionEvents:0,
  originalRoofTierCollisionEvents:0,conservativeWalkBodyClashes:0,
  remainingUnapprovedRootConnections:0,sourceOnlyWallFaceContactArea:0,
  sourceOnlyWebFaceContactArea:0,samplePalettedMeshAndColliderRays:0,maximumRayError:0,
  unsupportedActualFastenerCount:0,originalCellsModified:0};
 const bins=[];
 for(const b of all){const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
  const r=auditD36OriginalWallSocketTransitions(b,p,s,d25);
  assert.equal(r.structuralCertification,false);assert.equal(r.constructionAllowed,false);
  assert.equal(r.originalSaveWrites,0);assert.equal(r.sourceBuildsRegistered,0);
  assert.equal(r.originalAuthoredWallsAndFoundationUnchanged,true);
  assert.equal(r.originalAuthoredWALKUnchanged,true);
  assert.equal(r.originalY7WoodAndUpperRoofTiersUnchanged,true);
  assert.equal(r.originalPack2Id61And62AndPaletteUnchanged,true);
  assert.equal(r.derivedColoredMeshNotOriginalApprovedUV,true);
  assert.equal(r.engineeringMaterialRatingsAndActualFastenersMissing,true);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  for(const k of Object.keys(totals)){
   if(k==='maximumRayError')totals[k]=Math.max(totals[k],r[k]);else totals[k]+=r[k];
  }
  bins.push({id:b.id,longBays:r.longBays,rootDiagonals:r.rootDiagonals,
   sourceClear:r.sourceClearWallSocketCandidates,authoredCellClash:r.socketsWithSourceCellClashes,
   otherMemberClash:r.socketsWithOwnerMemberClashes});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.originalRoofCells,
  far:totals.originalUncertifiedFarRoofCells,zones:totals.originalFarZones,
  spans:totals.longBays,members:totals.theoreticalMembers,
  pins:totals.pinNodes,rootDiagonals:totals.rootDiagonals},
  {buildings:16,roof:115894,far:59412,zones:34,spans:64,members:2516,pins:1354,rootDiagonals:128});
 assert.equal(totals.sourceClearTrimmedRoots,128);
 assert.equal(totals.sourceRootStillBlocked,0);
 assert.equal(totals.attemptedIndependentSockets,128);
 assert.equal(totals.remainingUnapprovedRootConnections,128);
 assert.ok(totals.sourceOnlyWallFaceContactArea>0);
 assert.ok(totals.sourceOnlyWebFaceContactArea>0);
 assert.equal(totals.originalRootWallCollisionEvents,0);
 assert.equal(totals.originalRoofTierCollisionEvents,0);
 assert.equal(totals.conservativeWalkBodyClashes,0);
 assert.equal(totals.originalCellsModified,0);
 assert.equal(totals.samplePalettedMeshAndColliderRays,16);
 assert.ok(totals.maximumRayError<.00005);
 console.log('D36 AUTHENTIC ORIGINAL 16-BUILDING CONVEX WALL SOCKET TOTALS '+JSON.stringify(totals));
 console.log('D36 ORIGINAL CONVEX WALL SOCKET BUILDINGS '+JSON.stringify(bins));
});
test('D36 original source MUST veto forged creator approval, replaced Y7 wood and missing WALK',()=>{
 const b=all[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof.asset,'live:wood');
 assert.throws(()=>auditD36OriginalWallSocketTransitions({...b,creatorApproved:true},p,s,d25),
  /D26|D27|D28|D29|original|unplaced|source/);
 assert.throws(()=>auditD36OriginalWallSocketTransitions({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /roof|source|material|D25|D26|D27|D28|D29|original/);
 assert.throws(()=>auditD36OriginalWallSocketTransitions({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /WALK|navigation|D25|D26|D27|D28|D29|original|source/);
 assert.equal(roof.asset,'live:wood');
});
