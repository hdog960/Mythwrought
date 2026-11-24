// Detached Mountain V8 synthetic owner-version / ABA race research.
// Source-only; NEVER imported by src/main.mjs. No real WebGL/IDB, save writes,
// numeric V8 material ID, live buffer publication or GPU retirement.
// Mock counters must not be confused with cross-tab owner revision fences.
// A real approved render owner MUST instrument every writer before/after edits.
import {readMountainV8DetachedOriginalEpoch}
  from './mountain-v8-p3-source-epoch-projected-publication.mjs';
import {V8_P3_SOURCE_HEAD}
  from './mountain-v8-p3-uplift-and-halo-audit.mjs';
const f=Object.freeze;
const OWNER_KEYS=f(['world','pack2','pack3','manual14','loadedChunks','renderer','context']);
export const MOUNTAIN_V8_SYNTHETIC_REVISION_OWNERS=OWNER_KEYS;
const denied=f({safeToIntegrate:false,registeredV8Ids:0,
  originalM7P3ColorHaloInherited:false,realGpuUsed:false,
  oldGpuBufferDeleted:false,liveChunkMapChanged:false,
  originalSaveWritten:false,caveMobVaultMirrorAttested:false,
  realWriterInstrumentationInstalled:false,atomicBrowserLockObtained:false,
  realIphoneHomeScreenPwaAccepted:false,releaseAuthorized:false});
const bad=reason=>f({status:'rejected',reason,sourceEpoch:null,versions:null,...denied});
function revisionVector(v) {
  if(!v||typeof v!=='object'||Object.keys(v).length!==OWNER_KEYS.length)
    throw Error('Missing synthetic owner source revision');
  const o={};
  for(const key of OWNER_KEYS) {
    const value=v[key];
    // For test-only seqlock: even means writer not in progress. +1 at
    // begin, +1 at end. Owner must own its own actual writer instrumentation.
    if(!Number.isSafeInteger(value)||value<0||value%2!==0)
      throw Error('Unstable synthetic writer revision: '+key);
    o[key]=value;
  }
  return f(o);
}
const sameVersions=(a,b)=>OWNER_KEYS.every(k=>a[k]===b[k]);
const sameSource=(a,b)=>a&&b&&
  a.sourceMainHead===V8_P3_SOURCE_HEAD&&
  b.sourceMainHead===V8_P3_SOURCE_HEAD&&
  a.contextGeneration===b.contextGeneration&&
  a.worldSchema1===b.worldSchema1&&a.originalPack2===b.originalPack2&&
  a.originalPack3===b.originalPack3&&
  a.originalManual14===b.originalManual14&&
  JSON.stringify(a.originalAuxiliary)===JSON.stringify(b.originalAuxiliary);

/** TWO actual original in-memory source reads and FOUR synthetic revision
 * readings. The intervening callback is exclusively a test fault injection.
 * A valid source snapshot is a research-only witness, not a live lock:
 * it cannot certify that an uninstrumented original writer never ran.
 */
export function captureMountainV8SyntheticVersionedSource(readers,{
  readVersions,betweenReads=()=>{},contextGeneration=0
}={}){
  if(!readers||typeof readers!=='object'||
     typeof readVersions!=='function'||typeof betweenReads!=='function'||
     !Number.isSafeInteger(contextGeneration)||contextGeneration<0)
    return bad('unverifiable-original-source-or-synthetic-revision-reader');
  let v0,v1,v2,v3,s0,s1;
  try{
    v0=revisionVector(readVersions());
    s0=readMountainV8DetachedOriginalEpoch({...readers,contextGeneration});
    v1=revisionVector(readVersions());
    betweenReads();
    v2=revisionVector(readVersions());
    s1=readMountainV8DetachedOriginalEpoch({...readers,contextGeneration});
    v3=revisionVector(readVersions());
  }catch{return bad('synthetic-revision-or-original-source-read-error');}
  if(!sameVersions(v0,v1)||!sameVersions(v1,v2)||
     !sameVersions(v2,v3))
    return bad('synthetic-original-owner-aba-or-concurrent-write');
  if(!sameSource(s0,s1))
    return bad('original-source-snapshot-changed-without-revision');
  return f({
    status:'synthetic-source-version-stable',
    sourceMainHead:V8_P3_SOURCE_HEAD,
    versions:v3,sourceEpoch:s1,
    fourOriginalRevisionReads:true,twoOriginalSourceReads:true,
    originalOwnerWritesObserved:false,
    actualOwnerRevisionsAvailable:false,
    ABAWithInstrumentedMockWritersRejected:true,
    caveMobVaultMirrorUnverified:true,...denied
  });
}
/** Wraps a previously-tested DETACHED old-buffer eligibility plan and
 * synthetic writer/version witness without ever releasing an old buffer.
 * A future real owner needs real writer seqlocks + one coherent published
 * epoch before using any of these conclusions in the actual renderer.
 */
export function inspectMountainV8MockRevisionGuardedRetirement(
  evidence,retirement,{
  readVersions,readCurrentOriginalEpoch,readContextGeneration,
  contextGeneration,onInspection=()=>{},isContextLost=()=>false
}={}){
  if(!evidence||evidence.status!=='synthetic-source-version-stable'||
     evidence.safeToIntegrate!==false||
     !retirement||retirement.status!=='retirement-plan-only'||
     retirement.ownerApprovedOldBufferRelease!==false||
     retirement.oldBufferDeleted!==false||
     retirement.oldBufferReleaseAuthorized!==false||
     !Number.isSafeInteger(contextGeneration)||contextGeneration<0||
     contextGeneration!==evidence.sourceEpoch?.contextGeneration||
     typeof readVersions!=='function'||
     typeof readCurrentOriginalEpoch!=='function'||
     typeof readContextGeneration!=='function'||
     typeof onInspection!=='function'||typeof isContextLost!=='function')
    return bad('retirement-or-original-owner-evidence-invalid');
  let before,mid,after,source;
  try{
    if(isContextLost()||readContextGeneration()!==contextGeneration)
      return bad('original-synthetic-renderer-context-lost');
    before=revisionVector(readVersions());
    source=readCurrentOriginalEpoch();
    mid=revisionVector(readVersions());
    onInspection();
    after=revisionVector(readVersions());
    if(isContextLost()||readContextGeneration()!==contextGeneration)
      return bad('original-synthetic-renderer-context-changed');
  }catch{return bad('original-source-or-version-read-failed');}
  if(!sameVersions(evidence.versions,before)||
     !sameVersions(before,mid)||!sameVersions(mid,after))
    return bad('original-synthetic-writer-revision-drift');
  if(!sameSource(evidence.sourceEpoch,source))
    return bad('original-source-epoch-drift');
  return f({
    status:'synthetic-versioned-retirement-review-only',
    sourceMainHead:V8_P3_SOURCE_HEAD,
    hypotheticalOldHandleCount:retirement.hypotheticalOldHandles.length,
    hypotheticalNewHandleCount:retirement.hypotheticalNewHandles.length,
    originalOwnerVersions:evidence.versions,
    oldBufferReleaseAuthorized:false,
    actualAtomicPublicationPerformed:false,
    futureRendererOwnerCommitLockRequired:true,
    realVersionedWritersStillRequired:true,
    originalM7P3ColorHaloInherited:false,...denied
  });
}
