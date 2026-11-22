// New D31 genuine-source-only tests. Reuse D25–D30 verified exact-SHA tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD31OriginalPack2ObliqueWebEnvelopes}
 from '../../../src/building-pool/roadmap-d/d31-original-pack2-web-envelope-audit.mjs';
import {pack2Shape,pack2PreviewMesh} from '../../../src/block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../../src/pack2-integration.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),
 s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('all genuine sixteen source structures: exactly 64 original long bays, 2516 real owner-derived member envelopes, 1354 unrated joints, no authored roof or WALK intrusion',()=>{
 assert.equal(B.length,16);
 assert.equal(pack2Shape(61,0).boxes.length,3);assert.equal(pack2Shape(62,0).boxes.length,3);
 assert.deepEqual(pack2Shape(61,0).boxes,pack2ShapeOf(61,{rotation:0}).boxes);
 assert.deepEqual(pack2Shape(62,0).boxes,pack2ShapeOf(62,{rotation:0}).boxes);
 assert.equal(pack2PreviewMesh(61,0).triangles,156);
 const total={buildings:0,originalRoof:0,far:0,zones:0,longBays:0,members:0,pinNodes:0,
  obliqueDiagonals:0,sourceOwnerBoxes:0,nonUnitAxialTransforms:0,
  originalSolidClashes:0,clashAtRootedWall:0,otherOriginalCellClashes:0,
  roofWoodClashes:0,upperTierClashes:0,walkBodyConflicts:0,
  overlappingJointPairs:0,topChordMembersWithRoofGap:0,
  originalOwnerSampleMeshes:0,originalOwnerSampleTriangles:0,meshBytes:0};
 const perBuilding=[];let greatestMeshDeviation=0;
 for(const b of B){
  const [p,s,d25]=plan(b),first=b.cells[0],last=b.cells.at(-1),nav=b.navigation[0],
   cells=b.cells.length,walk=b.navigation.length;
  const a=auditD31OriginalPack2ObliqueWebEnvelopes(b,p,s,d25,{maxMeshSamples:2});
  assert.equal(a.constructionAllowed,false);assert.equal(a.roofLoadAcceptance,false);
  assert.equal(a.originalWorldCellsWritten,0);assert.equal(a.sourceGeometryModified,false);
  assert.equal(a.physicallyTransformedVariantUnregistered,true);
  assert.equal(a.originalOneCellPack2BlocksCannotRepresentObliqueMultiCellMembers,true);
  assert.equal(a.exactAuthoredWALKPreserved,true);assert.equal(a.originalY7LiveWoodUntouched,true);
  assert.equal(a.roofWoodClashes,0);assert.equal(a.upperTierClashes,0);
  assert.equal(a.authoredWalkBodyConflicts,0);
  assert.equal(a.unratedPinJoints,a.pinNodes);
  assert.equal(a.sampledOriginalOwnerMeshes,2);
  assert.equal(b.cells.length,cells);assert.equal(b.navigation.length,walk);
  assert.strictEqual(b.cells[0],first);assert.strictEqual(b.cells.at(-1),last);assert.strictEqual(b.navigation[0],nav);
  total.buildings++;total.originalRoof+=a.originalRoof;
  total.far+=a.far;total.zones+=a.zones;total.longBays+=a.longBays;
  total.members+=a.members;total.pinNodes+=a.pinNodes;
  total.obliqueDiagonals+=a.obliqueDiagonals;total.sourceOwnerBoxes+=a.ownerBoxes;
  total.nonUnitAxialTransforms+=a.nonUnitAxialTransforms;
  total.originalSolidClashes+=a.originalSolidClashes;
  total.clashAtRootedWall+=a.clashAtRootedWall;
  total.otherOriginalCellClashes+=a.otherOriginalCellClashes;
  total.roofWoodClashes+=a.roofWoodClashes;total.upperTierClashes+=a.upperTierClashes;
  total.walkBodyConflicts+=a.authoredWalkBodyConflicts;
  total.overlappingJointPairs+=a.physicallyOverlappingJointPairs;
  total.topChordMembersWithRoofGap+=a.roofFaceGapTopChordMembers;
  total.originalOwnerSampleMeshes+=a.sampledOriginalOwnerMeshes;
  total.originalOwnerSampleTriangles+=a.originalMeshTriangles;total.meshBytes+=a.meshBytes;
  greatestMeshDeviation=Math.max(greatestMeshDeviation,a.meshRayVsColliderMaxDelta);
  perBuilding.push({id:b.id,spans:a.longBays,members:a.members,diagonal:a.obliqueDiagonals,
   sourceConflicts:a.originalSolidClashes,wallIntersections:a.clashAtRootedWall,
   otherOriginalCells:a.otherOriginalCellClashes,pinOverlaps:a.physicallyOverlappingJointPairs,
   roofClashes:a.roofWoodClashes,walkBodyClashes:a.authoredWalkBodyConflicts});
 }
 assert.deepEqual({buildings:total.buildings,originalRoof:total.originalRoof,
  far:total.far,zones:total.zones,longBays:total.longBays,members:total.members,pinNodes:total.pinNodes},
  {buildings:16,originalRoof:115894,far:59412,zones:34,longBays:64,members:2516,pinNodes:1354});
 assert.ok(total.obliqueDiagonals>0&&total.nonUnitAxialTransforms>0);
 assert.equal(total.sourceOwnerBoxes,total.members*3);
 assert.equal(total.originalOwnerSampleMeshes,32);
 assert.equal(total.originalOwnerSampleTriangles,32*156);
 assert.ok(greatestMeshDeviation<=.004);
 console.log('D31 EXACT ORIGINAL W16 W17 SOURCE WEB TOTALS '+JSON.stringify({...total,greatestMeshDeviation}));
 console.log('D31 EXACT ORIGINAL BUILDING WEB BINS '+JSON.stringify(perBuilding));
});
test('genuine original source refuses forged roof material, registration or lost authored WALK without mutating immutable source',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.ok(roof);const counterfeit={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD31OriginalPack2ObliqueWebEnvelopes(counterfeit,p,s,d25,{maxMeshSamples:0}),
  /D26|D27|D28|D29|source|roof|wood/i);
 assert.throws(()=>auditD31OriginalPack2ObliqueWebEnvelopes({...b,creatorApproved:true},p,s,d25,{maxMeshSamples:0}),
  /source|unregistered|unplaced|original|D26|D28/i);
 const lost={...b,navigation:b.navigation.slice(1)};
 assert.throws(()=>auditD31OriginalPack2ObliqueWebEnvelopes(lost,p,s,d25,{maxMeshSamples:0}),
  /source|WALK|navigation|D26|D27|D28|D29/i);
 assert.equal(roof.asset,'live:wood');
});
