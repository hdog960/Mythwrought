// Lightweight manual projected-face study of 16 representative candidate
// stair chunks. Does NOT benchmark original M7 GPU or construct any voxels.
import fs from 'node:fs';
import {selectSourceProtectedInterlevelRamps}
 from '../../src/living-underworld/source-aware-ramp-selection.mjs';
import {proposedSurfaceAirAt}
 from '../../src/living-underworld/surface-entrance-proposal.mjs';
import {auditDetachedRampChunkProjection}
 from '../../src/living-underworld/chunk-carve-projection.mjs';

const seeds=[179,-17,2026,314159],indices=[16,25,34,35],side=16;
const samples=[];
for(const seed of seeds){
 const network=selectSourceProtectedInterlevelRamps(seed,0,0,{
  includeSocket:true
 });
 if(!network.ok||!network.completeNetworkCollisionFree||
  network.approvedLinkCount!==4)
  throw Error('Detached optimized walking network failed safety dry-run');
 for(const index of indices){
 const chosen=network.links.find(x=>x.index===index)?.selected;
 if(!chosen||!chosen.candidateSixFaceVoxelAirContinuous)
  throw Error('Missing physically face-connected candidate link');
 const planned=chosen.proposal;
 // Use one reproducible actual interior segment waypoint, not a best
 // or worst posthoc cherry-picked camera/sample location.
 const seg=planned.segments[Math.floor(planned.segments.length/2)];
 const waypoint=seg.a;
 const origin={x:Math.floor(waypoint.x/side)*side,
  y:Math.floor(waypoint.y/side)*side,
  z:Math.floor(waypoint.z/side)*side};
 const result=auditDetachedRampChunkProjection(seed,origin,{
  side,maxFaceGrowth:1200,
  futureRampAirAt:(x,y,z)=>proposedSurfaceAirAt(planned,x,y,z)
 });
 if(!result.ok&&result.reason!=='FACE_GROWTH_BUDGET')
  throw Error('Invalid projected underworld chunk analysis');
 samples.push({seed,rx:0,rz:0,index,quarterTurns:chosen.quarterTurns,
  chosenRadius:chosen.radius,waypoint,origin,
  projectedOnly:true,cuttableOriginalM7NotVerified:true,
  selectedRampsNonblocking:true,sourceProvenanceNotChecked:true,
  originalFaces:result.baselineFaces,
  proposedFaces:result.projectedFaces,
  faceChange:result.exposedFaceDelta,
  newlyCarvedSolidCells:result.newlyCarvedSolidCells,
  faceGrowthBudgetPassed:result.ok,
  assumedBytesDelta:result.illustrativeBytesDelta,
  trueGpuBufferNotMeasured:true});
 }
}
if(samples.length!==16)throw Error('Incomplete candidate chunk impact sample');
const report={schema:'living-underworld-combined-ramp-overlay-16-chunk-cpu-only-v2',
 samples,totals:{
  chunks:samples.length,projectedFaceDelta:samples.reduce((n,r)=>n+r.faceChange,0),
  maxFaceGrowth:Math.max(...samples.map(s=>Math.max(0,s.faceChange))),
  budgetRefusals:samples.filter(x=>!x.faceGrowthBudgetPassed).length,
  totalNewlyCarvedSolidCells:samples.reduce((n,r)=>n+r.newlyCarvedSolidCells,0)
 },sourceWorldChanged:false,
 realM7CarveNotEvaluated:true,
 combinedRampsGeoSafeOnly:true,
 combinedRampsSourceProtectionNotEvaluated:true,
 rendererAndGPUNotMeasured:true,
 installedIPhonePwaNotTested:true};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals));
