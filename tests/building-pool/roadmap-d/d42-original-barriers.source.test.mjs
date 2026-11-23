// D42: ONLY NEW original W16/W17 source-native diagnostics. D25–D41 CI reused.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD42OriginalW16W17BarrierAndAlternateRearFaces}
 from '../../../src/building-pool/roadmap-d/d42-original-root-barrier-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
function plan(b){const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];}
test('D42 authentic 16 W16/W17: exact D41 105/21/2 failure buckets, minimum hypothetical blocked centers, source-owned side faces and fundamental winding certificates',()=>{
 assert.equal(B.length,16);
 const sum={buildings:0,roof:0,far:0,zones:0,bays:0,roots:0,
  disconnected:0,rearBlocked:0,unwound:0,minimumCostSum:0,maxCost:0,
  allMinimumWitnesses:0,blockedFrontier:0,solidFrontier:0,walkFrontier:0,socketFrontier:0,
  minimumSolidCenters:0,minimumWALKCenters:0,minimumSocketCenters:0,
  rearSitesWithClearSide:0,rearSitesWithReachableSide:0,
  nonzeroFundamentalCycle:0,zeroFundamentalCycle:0,writes:0},hist={},bins=[];
 for(const b of B){
  const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD42OriginalW16W17BarrierAndAlternateRearFaces(b,p,s,d25,{maxWitnessSamples:4});
  assert.equal(r.constructionAllowed,false);assert.equal(r.structuralRoofCertified,false);
  assert.equal(r.registeredConnectorId,undefined);
  assert.equal(r.zeroMaterialFastenerOrFoundationPulloutRatings,true);
  assert.equal(r.minimumHypotheticalBlockedCENTERPathIsNotAuthorizedCarvingOrGraphMinimumCut,true);
  assert.equal(r.tangentialSideFaceIsNotTensileBackfaceRetention,true);
  assert.equal(r.allOriginalSourceRoofWALKAndPack2OwnersPreserved,true);
  assert.equal(r.installedIphonePwaAccepted,false);assert.equal(r.webgl2Accepted,false);
  assert.equal(r.worldWrites,0);assert.equal(r.savesWritten,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  sum.buildings++;sum.roof+=r.originalLiveWoodRoof;sum.far+=r.originalDistantRoofStillUncertified;
  sum.zones+=r.originalUncertifiedFarZones;sum.bays+=r.longBays;sum.roots+=r.roots;
  sum.disconnected+=r.centerDisconnected;sum.rearBlocked+=r.rearBlocked;
  sum.unwound+=r.windingUnavailable;sum.minimumCostSum+=r.minimumBlockedCentersSum;
  sum.maxCost=Math.max(sum.maxCost,r.minimumBlockedCentersMax);
  sum.allMinimumWitnesses+=r.allBarriersHaveWitness;
  sum.blockedFrontier+=r.actualFrontierCenters;
  sum.solidFrontier+=r.frontierSolidVetoSites;
  sum.walkFrontier+=r.frontierWALKVetoSites;
  sum.socketFrontier+=r.frontierSocketVetoSites;
  sum.minimumSolidCenters+=r.hypotheticalBlockedOriginalCells;
  sum.minimumWALKCenters+=r.hypotheticalBlockedWalkingCells;
  sum.minimumSocketCenters+=r.hypotheticalBlockedSocketCells;
  sum.rearSitesWithClearSide+=r.rearBlockedRootsWithClearSideFace;
  sum.rearSitesWithReachableSide+=r.rearBlockedRootsWithReachableSideFace;
  sum.nonzeroFundamentalCycle+=r.windingRootsWithPotentialNonzeroFundamentalCycle;
  sum.zeroFundamentalCycle+=r.windingRootsWithZeroFundamentalCycle;
  sum.writes+=r.originalSourceCellsWritten;
  for(const [k,v] of Object.entries(r.minimumBarrierCostHistogram))hist[k]=(hist[k]??0)+v;
  bins.push({id:b.id,roots:r.roots,disconnected:r.centerDisconnected,rear:r.rearBlocked,
   winding:r.windingUnavailable,minimumCostSum:r.minimumBlockedCentersSum,
   costHistogram:r.minimumBarrierCostHistogram,originalSolidBarrier:r.hypotheticalBlockedOriginalCells,
   authoredWalkBarrier:r.hypotheticalBlockedWalkingCells,
   reachableSideFaces:r.rearBlockedRootsWithReachableSideFace,
   sourceWitnesses:r.sampledSourceBarriers});
 }
 assert.deepEqual({buildings:sum.buildings,roof:sum.roof,far:sum.far,zones:sum.zones,
  bays:sum.bays,roots:sum.roots,disconnected:sum.disconnected,rearBlocked:sum.rearBlocked,
  unwound:sum.unwound},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,
   disconnected:105,rearBlocked:21,unwound:2});
 assert.equal(sum.allMinimumWitnesses,128);
 assert.equal(Object.values(hist).reduce((a,b)=>a+b,0),128);
 assert.ok(sum.minimumCostSum>=126); // The 105 center-disconnected +21 blocked-rear roots need at least one hypothetical clearance.
 assert.ok(sum.solidFrontier+sum.walkFrontier+sum.socketFrontier>=sum.blockedFrontier);
 assert.ok(sum.rearSitesWithReachableSide<=sum.rearSitesWithClearSide);
 assert.equal(sum.nonzeroFundamentalCycle+sum.zeroFundamentalCycle,2);
 assert.equal(sum.writes,0);
 console.log('D42 AUTHENTIC ORIGINAL SIXTEEN BUILDING MINIMAL-BLOCKED-CENTER AND SIDE-FACE TOTALS '+JSON.stringify({sum,hist}));
 console.log('D42 AUTHENTIC ORIGINAL PER BUILDING BARRIER AND WINDING BINS '+JSON.stringify(bins));
});
test('D42 original Y7 weather wood, creator nonapproval, and original source WALK are indispensable',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof.asset,'live:wood');
 assert.throws(()=>auditD42OriginalW16W17BarrierAndAlternateRearFaces({...b,creatorApproved:true},p,s,d25),
  /original|unplaced|source|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD42OriginalW16W17BarrierAndAlternateRearFaces({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /original|source|wood|roof|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD42OriginalW16W17BarrierAndAlternateRearFaces({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /original|source|WALK|navigation|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD42OriginalW16W17BarrierAndAlternateRearFaces(b,p,s,d25,{maxWitnessSamples:30}),/samples/);
});
