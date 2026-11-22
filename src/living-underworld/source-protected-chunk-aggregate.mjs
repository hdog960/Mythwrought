// Read-only aggregation of ALREADY measured per-chunk original-source risk.
// Reuses five-biome results without querying M7 again or uploading GPU buffers.
// This is a conservative planning limit, never a gameplay-performance proof.
const INT=Number.isSafeInteger;
export function summarizeSourceProtectedChunkRisk(results,{
 expectedChunks=5,maxTotalFaceGrowth=3500,
 maxTotalSourceQueries=40000,maxTotalApprovedCarves=10000
}={}){
 if(!Array.isArray(results)||results.length<1||results.length>12||
  !INT(expectedChunks)||expectedChunks<1||expectedChunks>12||
  !INT(maxTotalFaceGrowth)||maxTotalFaceGrowth<0||maxTotalFaceGrowth>100000||
  !INT(maxTotalSourceQueries)||maxTotalSourceQueries<216||
   maxTotalSourceQueries>200000||
  !INT(maxTotalApprovedCarves)||maxTotalApprovedCarves<0||
   maxTotalApprovedCarves>1000000)
  throw TypeError('Invalid source-protected chunk risk aggregation');
 const seen=new Set(),rows=[];
 let sourceQueries=0,faceGrowth=0,approvedCarves=0,unsafeCarves=0;
 for(let i=0;i<results.length;i++){
  const r=results[i],p=r?.origin;
  if(!p||![p.x,p.y,p.z].every(INT)||!INT(r.side)||
   ![r.sourceHaloCells,r.plannedCarves,r.unsafeCarves,r.approvedCarves]
    .every(n=>INT(n)&&n>=0)||
   !INT(r.approvedOnlyFaceGrowth)||r.approvedOnlyFaceGrowth<0||
   typeof r.ok!=='boolean'||
   r.plannedCarves!==r.approvedCarves+r.unsafeCarves||
   (r.ok&&(r.unsafeCarves!==0||r.reason!=null))||
   r.side<4||r.side>24)
   return Object.freeze({ok:false,reason:'INVALID_CHUNK_RISK_EVIDENCE',
    atIndex:i,worldChanged:false});
  const key=p.x+','+p.y+','+p.z;
  if(seen.has(key))return Object.freeze({ok:false,
   reason:'DUPLICATE_CHUNK_ORIGIN',atIndex:i,worldChanged:false});
  seen.add(key);
  // Halo budget failures have no complete original source census and cannot
  // be misrepresented as approved even when the caller supplies bogus zeros.
  if(r.ok&&r.sourceHaloCells!==(r.side+2)**3)
   return Object.freeze({ok:false,
    reason:'INCOMPLETE_CHUNK_SOURCE_HALO',atIndex:i,worldChanged:false});
  sourceQueries+=r.sourceHaloCells;
  faceGrowth+=r.approvedOnlyFaceGrowth;
  approvedCarves+=r.approvedCarves;
  unsafeCarves+=r.unsafeCarves;
  rows.push(Object.freeze({index:i,origin:Object.freeze({...p}),
   sourceHaloCells:r.sourceHaloCells,
   projectedFaceGrowth:r.approvedOnlyFaceGrowth,
   approvedCarves:r.approvedCarves,unsafeCarves:r.unsafeCarves,
   sourceApproved:r.ok,refusal:r.reason??null}));
 }
 const limitsExceeded={
  chunkCount:results.length!==expectedChunks,
  sourceQueries:sourceQueries>maxTotalSourceQueries,
  faceGrowth:faceGrowth>maxTotalFaceGrowth,
  approvedCarves:approvedCarves>maxTotalApprovedCarves,
  unsafeOrOverbudgetChunk:rows.some(r=>!r.sourceApproved)
 };
 const ok=!Object.values(limitsExceeded).some(Boolean);
 return Object.freeze({ok,
  reason:ok?null:
   limitsExceeded.chunkCount?'INCOMPLETE_CHUNK_COHORT':
   limitsExceeded.unsafeOrOverbudgetChunk?'CHUNK_REFUSAL_IN_COHORT':
   limitsExceeded.sourceQueries?'AGGREGATE_SOURCE_QUERY_BUDGET':
   limitsExceeded.faceGrowth?'AGGREGATE_EXPOSED_FACE_BUDGET':
   'AGGREGATE_APPROVED_CARVE_BUDGET',
  expectedChunks,checkedChunks:results.length,
  sourceQueries,faceGrowth,approvedCarves,unsafeCarves,
  limitsExceeded:Object.freeze(limitsExceeded),
  rows:Object.freeze(rows),
  queriesReusedFromExistingResults:true,
  noM7WorldRequery:true,noGPUResourcesCreated:true,
  originalPlayerPhysicsUnverified:true,worldChanged:false});
}
