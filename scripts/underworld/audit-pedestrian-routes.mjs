// READ ONLY dry-run grading of the original 4-level network and safe-geometry
// switchback options. No excavation, no ramps placed, no player walking claims.
import fs from 'node:fs';
import {auditDetachedNetworkPedestrianReadiness,
 auditDetachedPedestrianSwitchback}
 from '../../src/living-underworld/pedestrian-switchback.mjs';
const seeds=[179,-17,2026,314159,8675309,13579],
 regions=[[0,0],[-7,13],[300,-302],[-300,250]];
const rows=[];
for(const seed of seeds)for(const [rx,rz] of regions){
 const r=auditDetachedNetworkPedestrianReadiness(seed,rx,rz);
 if(r.horizontalPairedPassed!==16||r.proposedSwitchbackPassed!==4)
  throw Error('Candidate switchback geometry refused: '+JSON.stringify(r));
 rows.push({seed,rx,rz,horizontalPairs:r.horizontalPairedTotal,
  horizontalPassed:r.horizontalPairedPassed,
  originalDirect:r.directConnectorTotal,
  originalDirectPassed:r.directConnectorPassed,
  newDryRunLinks:r.proposedSwitchbackTotal,
  newDryRunPassed:r.proposedSwitchbackPassed,
  supportCells:r.switchbacks.map(s=>s.candidateSupportCells),
  gradeFailures:r.directConnectors.filter(v=>!v.ok).map(v=>v.index)});
}
const proof=auditDetachedPedestrianSwitchback(179,0,0,16,
 {validateCandidateAir:true});
if(!proof.ok||proof.candidateRouteFaceConnected!==true)
 throw Error('Even dry-run switchback AIR continuity failed');
const totals={regions:rows.length,
 horizontalRoutes:rows.reduce((a,b)=>a+b.horizontalPairs,0),
 horizontalRoutesPassing:rows.reduce((a,b)=>a+b.horizontalPassed,0),
 originalVerticalAndSocket:rows.reduce((a,b)=>a+b.originalDirect,0),
 originalDirectGradePassing:rows.reduce((a,b)=>a+b.originalDirectPassed,0),
 switchbackProposals:rows.reduce((a,b)=>a+b.newDryRunLinks,0),
 switchbacksGeometryPassing:rows.reduce((a,b)=>a+b.newDryRunPassed,0),
 summedSupportCells:rows.reduce((a,b)=>a+b.supportCells.reduce((x,y)=>x+y,0),0)};
if(totals.regions!==24||totals.switchbacksGeometryPassing!==96)
 throw Error('Incomplete original route inventory');
const result={schema:'living-underworld-pedestrian-dryrun-readiness-v1',
 sourceOnly:true,originalNetworkUnchanged:true,
  deepAndSocketDirectLinksMostlyUnwalkable:true,
  safeSourceExcavationNotPerformed:true,
  protectedSurfaceSocketStillThreeCellsShort:true,
  modeledCollisionOnlyNoPlayerPhysics:true,
  supportBlocksNotPlaced:true,
  allCaveRampsInOriginalM7:false,
  totals,rows};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(totals));
