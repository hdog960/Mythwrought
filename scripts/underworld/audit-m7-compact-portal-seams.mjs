// Separate seam-research cohort: six owned cores, counted TOGETHER under
// original aggregate limits, never a substitute for whole-network budgeting.
import {createOriginalM7ReadOnlySource,inspectOriginalM7ReadOnlySource}
 from '../../src/living-underworld/original-m7-reader-provenance.mjs';
import {auditCompactPortalSeam}
 from '../../src/living-underworld/compact-portal-seam-clearance.mjs';
import {summarizeSourceProtectedChunkRisk}
 from '../../src/living-underworld/source-protected-chunk-aggregate.mjs';
const specs=[
 {seed:179,rx:-9,rz:0,direction:'east'},
 {seed:179,rx:-6,rz:3,direction:'south'},
 {seed:2026,rx:6,rz:9,direction:'east'}
];
const sources=new Map(),rows=[];
for(const s of specs){
 if(!sources.has(s.seed))sources.set(s.seed,createOriginalM7ReadOnlySource(s.seed));
 const source=sources.get(s.seed);
 if(!inspectOriginalM7ReadOnlySource(source,{seed:s.seed}).ok)
  throw Error('SEAM_ORIGINAL_M7_FACTORY_REFUSED');
 const report=auditCompactPortalSeam({...s,source});
 const after=inspectOriginalM7ReadOnlySource(source,{seed:s.seed});
 if(!after.ok)throw Error('SEAM_ORIGINAL_M7_FACTORY_CHANGED');
 rows.push({...report,nativeOriginalReaderProvenance:after.ok});
}
const all=rows.flatMap(r=>r.chunks);
const aggregate=summarizeSourceProtectedChunkRisk(all,{
 expectedChunks:6,maxTotalApprovedCarves:10000,maxTotalFaceGrowth:3500,
 maxTotalSourceQueries:40000,requireInteriorEvidence:true
});
const constructorProbes=[];
for(const seed of [8675309,13579]){
 try{
  const source=createOriginalM7ReadOnlySource(seed);
  const proof=inspectOriginalM7ReadOnlySource(source,{seed});
  constructorProbes.push({seed,ok:proof.ok,reason:proof.reason,
   scope:'constructor-and-reader-identity-only-no-terrain-survey'});
 }catch(error){
  constructorProbes.push({seed,ok:false,error:String(error),
   scope:'original-constructor-failure-no-bypass'});
 }
}
const ok=aggregate.ok&&rows.length===3&&rows.every(r=>r.ok&&
 r.nativeOriginalReaderProvenance&&r.uniqueNaturalCells===11016&&
 r.originalControllerBidirectional&&r.retainedOriginalFloorOnly);
console.log(JSON.stringify({schema:'m7-compact-portal-seams-v1',ok,rows,aggregate,
 constructorProbes,distinctResearchCohortNotGlobalBudgetApproval:true,
 previousFiveHubCohortNotRecountedOrReplaced:true,
 noWorldWrites:true,liveWalkingVerified:false,releaseApproved:false}));
if(!ok)process.exitCode=3;
