// D44 ONLY: new original Wave16/17 focused acceptance, not old broad suites.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD44OriginalSourceAlternateFootingTies}
 from '../../../src/building-pool/roadmap-d/d44-original-outboard-tie-audit.mjs';
const BUILDINGS=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D44 sixteen authentic W16/W17 original buildings: exact D43 Y6 first source blockers and independent swept Y6/Y5/Y4 bend alternatives',()=>{
 assert.equal(BUILDINGS.length,16);
 const totals={buildings:0,roof:0,far:0,zones:0,bays:0,roots:0,
  disconnected:0,rearBlocked:0,winding:0,oneProtectedCenter:0,
  nearest:0,y6L:0,baselineTrials:0,solidBlocked:0,walkBlocked:0,socketBlocked:0,
  firstY6:0,firstY5:0,firstY4:0,
  y6BFS:0,y5BFS:0,y4BFS:0,gainY5:0,gainY4:0,
  fullPrismEdges:0,sourceVeto:0,walkVeto:0,socketVeto:0,writes:0};
 const bins=[];
 for(const b of BUILDINGS){
  const [p,s,d25]=plans(b),pre=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   a=auditD44OriginalSourceAlternateFootingTies(b,p,s,d25,{maxRootSamples:1});
  assert.equal(a.constructionAllowed,false);assert.equal(a.structuralReleaseAccepted,false);
  assert.equal(a.completePrismBendsCheckedWithoutSourceWALLPenetration,true);
  assert.equal(a.routeFromHypotheticalFrontCellDoesNotProveSocketPhysicalConnection,true);
  assert.equal(a.originalBlueprintFootingVacancyNotRealGroundEvidence,true);
  assert.equal(a.originalY7WoodAndAllAuthoredWALKUnmodified,true);
  assert.equal(a.noRealRatedMaterialOrInstalledConnector,true);
  assert.equal(a.approvedNewFootings,0);assert.equal(a.approvedSourceOwnerFasteners,0);
  assert.equal(a.worldWrites,0);assert.equal(a.savesWritten,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],pre);
  totals.buildings++;totals.roof+=a.originalRoof;totals.far+=a.distantRoofCellsStillStructurallyUncertified;
  totals.zones+=a.originalDistantRoofZoneCount;totals.bays+=a.bays;totals.roots+=a.roots;
  totals.disconnected+=a.originalD42Disconnected;
  totals.rearBlocked+=a.originalD42RearBlocked;
  totals.winding+=a.originalD42WindingUnavailable;
  totals.oneProtectedCenter+=a.originalD42OneBlockedCenter;
  totals.nearest+=a.candidateNearestFootprintStudies;totals.y6L+=a.originalD43Y6LSourceClear;
  totals.baselineTrials+=a.originalY6LPlansExamined;
  totals.solidBlocked+=a.originalY6LFirstSolidBlocked;
  totals.walkBlocked+=a.originalY6LFirstWalkBlocked;
  totals.socketBlocked+=a.originalY6LFirstSocketBlocked;
  totals.firstY6+=a.originalFirstSolidBlockedAtY6;
  totals.firstY5+=a.originalFirstSolidBlockedAtY5;
  totals.firstY4+=a.originalFirstSolidBlockedAtY4;
  totals.y6BFS+=a.alternateY6BFSGeometricCorridors;
  totals.y5BFS+=a.alternateY5BFSGeometricCorridors;
  totals.y4BFS+=a.alternateY4BFSGeometricCorridors;
  totals.gainY5+=a.additionalY5GeometricCorridors;
  totals.gainY4+=a.additionalY4GeometricCorridors;
  totals.fullPrismEdges+=a.uniqueFullThicknessEdges;
  totals.sourceVeto+=a.authenticOriginalVoxelEdgeVetoEvents;
  totals.walkVeto+=a.protectedWALKBodyEdgeVetoEvents;
  totals.socketVeto+=a.sourceSocketEnvelopeEdgeVetoEvents;
  totals.writes+=a.worldWrites;
  bins.push({id:b.id,roots:a.roots,footprintCandidates:a.candidateNearestFootprintStudies,
   firstSolid:a.originalY6LFirstSolidBlocked,sourceClearY6:a.alternateY6BFSGeometricCorridors,
   sourceClearY5:a.alternateY5BFSGeometricCorridors,
   sourceClearY4:a.alternateY4BFSGeometricCorridors,
   newWithY5:a.additionalY5GeometricCorridors,newWithY4:a.additionalY4GeometricCorridors});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roof,far:totals.far,zones:totals.zones,
  bays:totals.bays,roots:totals.roots,disconnected:totals.disconnected,
  rearBlocked:totals.rearBlocked,winding:totals.winding,oneProtectedCenter:totals.oneProtectedCenter,
  nearest:totals.nearest,y6L:totals.y6L},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,
   disconnected:105,rearBlocked:21,winding:2,oneProtectedCenter:126,nearest:1455,y6L:0});
 assert.equal(totals.baselineTrials,2*totals.nearest);
 assert.ok(totals.y4BFS>=totals.y5BFS&&totals.y5BFS>=totals.y6BFS);
 assert.equal(totals.gainY5,totals.y5BFS-totals.y6BFS);
 assert.equal(totals.gainY4,totals.y4BFS-totals.y5BFS);
 assert.ok(totals.fullPrismEdges>0);
 assert.equal(totals.writes,0);
 console.log('D44 ACTUAL ORIGINAL 16-BUILDING Y6/Y5/Y4 ROUTE TOTALS '+JSON.stringify(totals));
 console.log('D44 ACTUAL ORIGINAL BINS '+JSON.stringify(bins));
});
test('D44 original author source fails closed on replaced Y7 wood roof, removed WALK and fake creator permission',()=>{
 const b=BUILDINGS[0],[p,s,d25]=plans(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD44OriginalSourceAlternateFootingTies({...b,creatorApproved:true},p,s,d25),
  /D25|D26|D27|D28|D29|source|original|unplaced|authored/i);
 assert.throws(()=>auditD44OriginalSourceAlternateFootingTies({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD44OriginalSourceAlternateFootingTies({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
