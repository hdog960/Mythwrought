import test from 'node:test';
import assert from 'node:assert/strict';
import {bindCityDeepSourceReaderCohort as bind,
 auditCityDeepSourceReaderCohort as audit}
 from '../src/living-underworld/source-reader-cohort-provenance.mjs';
const source=()=>({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const selected=()=>Object.freeze({ok:true,seed:179,rx:2,rz:0,
 sourceChecks:8815,joined:Object.freeze({ok:true})});
const attest=(selection,src,site={seed:179,rx:2,rz:0})=>
 audit(selection,src,site);
test('unchanged exact four caller-supplied functions pass without original M7 calls',()=>{
 const s=source(),r=selected();bind(r,s);
 const proof=attest(r,s);
 assert.equal(proof.ok,true);
 assert.equal(proof.matchingRoles,4);
 assert.equal(proof.sourceCallbackCalls,0);
 assert.equal(proof.authenticOriginalM7WorldVerified,false);
 assert.equal(proof.noWorldWrites,true);
});
test('reconstructed source object with same four function identities passes',()=>{
 const s=source(),r=selected();bind(r,s);
 assert.equal(attest(r,{...s}).ok,true);
});
test('different but semantically identical callback functions refuse without reading',()=>{
 const a=source(),b=source(),r=selected();bind(r,a);
 const proof=attest(r,b);
 assert.equal(proof.ok,false);
 assert.equal(proof.reason,'DEEP_SOURCE_READER_COHORT_ROLE_CHANGED');
 assert.equal(proof.role,'naturalAt');
 assert.equal(proof.sourceCallbackCalls,0);
});
test('single editedAt / protectedAt / authoredAt mutation is detected',()=>{
 for(const role of ['editedAt','protectedAt','authoredAt']){
  const s=source(),r=selected();bind(r,s);
  const changed={...s,[role]:()=>false};
  const proof=attest(r,changed);
  assert.equal(proof.reason,'DEEP_SOURCE_READER_COHORT_ROLE_CHANGED');
  assert.equal(proof.role,role);
 }
});
test('unbound synthetic selection refuses instead of claiming original M7 provenance',()=>{
 const r=selected(),s=source();
 assert.equal(attest(r,s).reason,'DEEP_SOURCE_READER_COHORT_UNBOUND');
});
test('wrong seed and both wrong region indices refuse even when functions match',()=>{
 const r=selected(),s=source();bind(r,s);
 for(const site of [{seed:2026,rx:2,rz:0},{seed:179,rx:3,rz:0},
  {seed:179,rx:2,rz:1},{seed:179,rx:2,rz:'0'}]){
  assert.equal(attest(r,s,site).reason,'DEEP_SOURCE_READER_COHORT_SITE_MISMATCH');
 }
});
test('malformed prior successes or untrusted reader input refuse before binding',()=>{
 for(const r of [null,{},Object.freeze({...selected(),ok:false}),
  Object.freeze({...selected(),sourceChecks:0}),
  Object.freeze({...selected(),joined:{ok:false}})]){
  assert.throws(()=>bind(r,source()),/Invalid original city deep reader provenance/);
 }
 const r=selected();
 assert.equal(attest(r,{...source(),naturalAt:17}).reason,
  'DEEP_SOURCE_READER_COHORT_INPUT_INVALID');
});
test('rebind same selection to different callbacks is strictly prohibited',()=>{
 const r=selected(),s=source();bind(r,s);
 assert.throws(()=>bind(r,source()),/already bound to different callbacks/);
 assert.equal(attest(r,s).ok,true);
});
test('idempotent same-cohort registration and frozen output preserve stability',()=>{
 const r=selected(),s=source();
 assert.strictEqual(bind(r,s),r);
 assert.strictEqual(bind(r,s),r);
 const proof=attest(r,s);
 assert.equal(Object.isFrozen(proof),true);
 assert.equal(Object.isFrozen(r),true);
 assert.throws(()=>{proof.ok=false},TypeError);
});
test('separate selected candidate objects never inherit each other source identity',()=>{
 const r=selected(),other=selected(),s=source();bind(r,s);
 assert.equal(attest(other,s).reason,'DEEP_SOURCE_READER_COHORT_UNBOUND');
});
test('caller-side method replacement after admission is detectable without side effects',()=>{
 const r=selected(),s=source();bind(r,s);
 const before=attest(r,s);assert.equal(before.ok,true);
 s.naturalAt=()=>1;
 const after=attest(r,s);
 assert.equal(after.ok,false);
 assert.equal(after.role,'naturalAt');
 assert.equal(after.sourceCallbackCalls,0);
});
test('cohort proof neither stores source values nor authenticates an original M7 instance',()=>{
 let invoked=0;const s={naturalAt:()=>{invoked++;return 1},
  authoredAt:()=>{invoked++;return undefined},editedAt:()=>{invoked++;return false},
  protectedAt:()=>{invoked++;return false}};
 const r=selected();bind(r,s);
 const proof=attest(r,s);
 assert.equal(invoked,0);
 assert.equal(proof.sourceReaderIdentityCallerOnly,true);
 assert.equal(proof.authenticOriginalM7WorldVerified,false);
});
