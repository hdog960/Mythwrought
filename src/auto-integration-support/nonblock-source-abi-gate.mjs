// :12 opt-in producer ABI drift gate. Read-only metadata; never imports unmerged producers.
export const ABI_GATE_VERSION='nonblock-source-abi-gate-v1';
const SHA=/^[0-9a-f]{40}$/;
const REQUIRED=Object.freeze({scene48:'src/nonblock-scene48/nonblock-object-v1.mjs',environment24:'src/nonblock-environments24/v1-bridge.mjs',fittings36:'src/nonblock-fittings36/guarded-break-session.mjs'});
export function auditSourceAbi({sources,refs,productionRegistration=false}={}){
 const errors=[];
 if(productionRegistration!==false)errors.push('production-registration-forbidden');
 for(const [lane,path] of Object.entries(REQUIRED)){
  const s=sources?.[lane],r=refs?.[lane];
  if(!s||s.path!==path||!SHA.test(s.blobSha??'')||typeof s.text!=='string'||!s.text.length||!r||!SHA.test(r.head??''))
   errors.push(lane+':source-not-authenticated');
 }
 const c=sources?.scene48?.text??'',e=sources?.environment24?.text??'',f=sources?.fittings36?.text??'';
 for(const symbol of ['NONBLOCK_OBJECT_VERSION','nonblockInstanceKey','describeNonblockObject','createNonblockSidecar'])
  if(!new RegExp('\\b'+symbol+'\\b').test(c))errors.push('scene48:missing-'+symbol);
 for(const symbol of ['exportEnvironmentV1','validateEnvironmentV1','COORDINATOR_SHA'])
  if(!new RegExp('\\b'+symbol+'\\b').test(e))errors.push('environment24:missing-'+symbol);
 for(const symbol of ['createGuardedFittingSession','inspectMount','authorizeRemoval'])
  if(!new RegExp('\\b'+symbol+'\\b').test(f))errors.push('fittings36:missing-'+symbol);
 const pinned=/export const COORDINATOR_SHA\s*=\s*['"]([0-9a-f]{40})['"]/.exec(e)?.[1];
 if(!pinned)errors.push('environment24:coordinator-pin-missing');
 else if(pinned!==refs?.scene48?.head)errors.push('environment24:stale-coordinator-pin');
 // Source evidence cannot establish core :00 pick, breaking or schema-1 persistence.
 return Object.freeze({ok:errors.length===0,errors:Object.freeze([...new Set(errors)]),
  status:errors.length?'ABI_BLOCKED':'SOURCE_ABI_PREFLIGHT_ONLY_NOT_LIVE',
  coordinatorPin:pinned??null,producerHeads:Object.freeze(Object.fromEntries(Object.entries(refs??{}).map(([k,v])=>[k,v?.head??null])))});
}
