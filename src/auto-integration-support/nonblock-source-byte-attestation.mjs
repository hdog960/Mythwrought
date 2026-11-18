// :12 source-byte attestation only. No producer imports, world registration or save writes.
import {createHash} from 'node:crypto';
export const VERSION='nonblock-source-byte-attestation-v1';
const paths=Object.freeze({scene48:'src/nonblock-scene48/nonblock-object-v1.mjs',environment24:'src/nonblock-environments24/v1-bridge.mjs',fittings36:'src/nonblock-fittings36/guarded-break-session.mjs'});
const sha=/^[0-9a-f]{40}$/;
export function gitBlobSha(source){
 if(typeof source!=='string')throw new TypeError('source text required');
 const bytes=Buffer.from(source,'utf8');
 return createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
}
export function attestProducerSources({sources,heads,productionRegistration=false}={}){
 const errors=[],verified={};
 if(productionRegistration!==false)errors.push('production-registration-forbidden');
 for(const [lane,path] of Object.entries(paths)){
  const s=sources?.[lane],head=heads?.[lane];
  if(s?.path!==path||typeof s?.text!=='string'||!sha.test(s?.blobSha??'')||!sha.test(head??'')){
   errors.push(lane+':missing-exact-source');continue;
  }
  const actual=gitBlobSha(s.text);
  if(actual!==s.blobSha){errors.push(lane+':blob-mismatch');continue;}
  verified[lane]=Object.freeze({path,blobSha:actual,head});
 }
 if(verified.scene48){
  const t=sources.scene48.text;
  for(const name of ['NONBLOCK_OBJECT_VERSION','nonblockInstanceKey','describeNonblockObject','createNonblockSidecar'])
   if(!new RegExp('\\bexport\\s+(?:const|function)\\s+'+name+'\\b').test(t))errors.push('scene48:missing-export:'+name);
  if(!/NONBLOCK_OBJECT_VERSION\s*=\s*['"]nonblock-object-v1['"]/.test(t))errors.push('scene48:wrong-version');
 }
 if(verified.environment24){
  const t=sources.environment24.text;
  for(const name of ['exportEnvironmentV1','validateEnvironmentV1'])
   if(!new RegExp('\\bexport\\s+function\\s+'+name+'\\b').test(t))errors.push('environment24:missing-export:'+name);
  const pin=/export const COORDINATOR_SHA\s*=\s*['"]([0-9a-f]{40})['"]/.exec(t)?.[1];
  if(!pin)errors.push('environment24:missing-coordinator-pin');
  else if(pin!==heads?.scene48)errors.push('environment24:stale-coordinator-pin');
 }
 if(verified.fittings36){
  const t=sources.fittings36.text;
  if(!/export\s+function\s+createGuardedFittingSession\b/.test(t))errors.push('fittings36:missing-session-export');
  for(const name of ['inspectMount','authorizeRemoval'])if(!new RegExp('\\b'+name+'\\b').test(t))errors.push('fittings36:missing-'+name);
 }
 return Object.freeze({ok:errors.length===0,errors:Object.freeze([...new Set(errors)]),verified:Object.freeze(verified),
  status:errors.length?'SOURCE_ABI_BLOCKED':'SOURCE_BLOBS_VERIFIED_NOT_RUNTIME_ACCEPTED',
  realPickBreakReloadVerified:false,productionRegistered:false});
}
