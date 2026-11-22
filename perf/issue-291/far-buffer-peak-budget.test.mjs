// Focused original-source-backed PEAK C6 slot/byte feasibility checks.
// No live rendering, no GPU API, no screenshots or release claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assessFarPeakBufferFeasibility} from './far-buffer-peak-budget.mjs';
import {createSourceOnlyFarTransaction} from './far-buffer-transaction.mjs';
import {editAffectedChunks} from '../../src/chunks.mjs';
import {verticalEditSections,depthMeshKey,sectionBounds} from '../../src/depth.mjs';
const source={editAffectedChunks,verticalEditSections,depthMeshKey,sectionBounds};
const d=(x,z,s,extras={})=>({cx:x,cz:z,section:s,key:depthMeshKey(x,z,s),...extras});
const all=[2,3,4,5].map(x=>d(x,0,-5));
const token={worldId:'original-m7',contextId:'original-gl-context',contextGeneration:3};
const before=(residentCount=4)=>({
  ...token,worldRevision:8,planForRevision:8,selected:[...all],
  resident:all.slice(0,residentCount).map((source,i)=>({key:source.key,
    bytes:(360+i*36),source,contextGeneration:3,planForRevision:8}))
});
const after=()=>({...token,worldRevision:9,planForRevision:9,
  rayPlanRecomputed:true,nearReady:true,streamingStable:true,selected:[...all]});
const tx=(edit={x:1,y:-78,z:1},count=4)=>createSourceOnlyFarTransaction({
  before:before(count),after:after(),edit,source
});
const physical=(snapshot,bytes=360)=>({
  snapshot,
  originalResident:snapshot.originalResidentKeys.map((key,i)=>({key,bytes:360+i*36,
    ...token,worldRevision:8})),
  sourceRebuildBytes:snapshot.expectedRebuildKeys.map(key=>({key,bytes,
    ...token,worldRevision:9}))
});
const audit=(edit,count=4,bytes=360)=>{
  const t=tx(edit,count);assert.ok(t.snapshot,'Expected previously preflight-valid transition');
  return assessFarPeakBufferFeasibility(physical(t.snapshot,bytes));
};
const blocked=report=>{
  assert.equal(report.drawBlocked,true);
  assert.equal(report.liveIntegrationApproved,false);
  assert.equal(report.nativeRollbackProven,false);
  assert.equal(report.originalGlErrorPolicyUnchanged,true);
  assert.equal(report.requiresNativeResourceAndRollbackProof,true);
};

test('identical far scene needs no staged buffers and keeps all 4 old handles',()=>{
 const w=audit({x:1,y:-78,z:1});blocked(w);
 assert.equal(w.result,'no-prerelease-needed-model-only');
 assert.equal(w.requiredAllocations,0);assert.equal(w.liveBeforeReleaseSlots,4);
 assert.equal(w.canPreserveOriginalNativeBuffersUntilNewUploads,true);
});
test('four original live far buffers plus one replacement require a fifth physical slot',()=>{
 const w=audit({x:81,y:-78,z:1});blocked(w);
 assert.equal(w.result,'pre-release-required-rollback-unproven');
 assert.equal(w.liveBeforeReleaseSlots,5);
 assert.equal(w.postReleaseSlots,4);
 assert.equal(w.necessaryEarlyDeleteBeforeStage,true);
 assert.equal(w.canPreserveOriginalNativeBuffersUntilNewUploads,false);
 assert.deepEqual(w.releasedOriginalKeys,[all[3].key]);
});
test('editing middle source with four residents would need seven transient slots',()=>{
 const w=audit({x:49,y:-78,z:1});blocked(w);
 assert.equal(w.result,'pre-release-required-rollback-unproven');
 assert.equal(w.liveBeforeReleaseSlots,7);
 assert.equal(w.postReleaseSlots,4);
 assert.deepEqual(w.releasedOriginalKeys,all.slice(1).map(x=>x.key));
});
test('three original live buffers plus the missing fourth can be staged without eviction',()=>{
 const w=audit({x:1,y:-78,z:1},3);blocked(w);
 assert.equal(w.result,'no-prerelease-needed-model-only');
 assert.equal(w.liveBeforeReleaseSlots,4);
 assert.equal(w.postReleaseSlots,4);
 assert.equal(w.necessaryEarlyDeleteBeforeStage,false);
});
test('two originals and two pending uploads fit the far-slot peak exactly',()=>{
 const w=audit({x:1,y:-78,z:1},2);blocked(w);
 assert.equal(w.requiredAllocations,2);assert.equal(w.liveBeforeReleaseSlots,4);
 assert.equal(w.canPreserveOriginalNativeBuffersUntilNewUploads,true);
});
test('no original buffer plus four replacements respects exact four slot bound',()=>{
 const w=audit({x:1,y:-78,z:1},0);blocked(w);
 assert.equal(w.originalResidentCount,0);assert.equal(w.liveBeforeReleaseSlots,4);
 assert.equal(w.postReleaseSlots,4);
});
test('a matching source key counts as an additional physical GPU allocation',()=>{
 const t=tx({x:81,y:-78,z:1});
 const a=physical(t.snapshot);
 assert.equal(a.originalResident[a.originalResident.length-1].key,
              a.sourceRebuildBytes[0].key);
 const w=assessFarPeakBufferFeasibility(a);
 assert.equal(w.liveBeforeReleaseSlots,5);
 assert.equal(w.necessaryEarlyDeleteBeforeStage,true);
});
test('native source bytes must represent complete 9-float vertices, not guesses',()=>{
 for(const bytes of [0,35,37,123,1.5,-36,NaN,Infinity]){
  const t=tx({x:81,y:-78,z:1});
  const a=physical(t.snapshot);a.sourceRebuildBytes[0].bytes=bytes;
  const w=assessFarPeakBufferFeasibility(a);blocked(w);
  assert.equal(w.result,'blocked-unproven-input');
 }
});
test('original already resident source bytes must also match packed source geometry',()=>{
 const t=tx();const a=physical(t.snapshot);a.originalResident[0].bytes=359;
 const w=assessFarPeakBufferFeasibility(a);blocked(w);
 assert.equal(w.result,'blocked-unproven-input');
});
test('new final far byte total above 1 MiB is impossible even after retiring old suffix',()=>{
 const w=audit({x:49,y:-78,z:1},4,360*10000);
 assert.equal(w.result,'impossible-final-far-budget');
 assert.equal(w.modelCapacityFitsAfterReplacement,false);blocked(w);
});
test('candidate can fit final bytes but not simultaneous old+new bytes',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot,36*15000);
 // Old 4 entries are below cap; new single 540KB fits final, but staging
 // old + new is still blocked by 5 physical slots regardless of bytes.
 const w=assessFarPeakBufferFeasibility(a);
 assert.equal(w.result,'pre-release-required-rollback-unproven');
 assert.ok(w.liveBeforeReleaseBytes<=1048576);
 assert.equal(w.liveBeforeReleaseSlots,5);
});
test('candidate exceeds original far-byte cap even with vacant GPU slots',()=>{
 const w=audit({x:1,y:-78,z:1},3,36*30000);
 assert.equal(w.result,'impossible-final-far-budget');blocked(w);
 assert.equal(w.postReleaseSlots,4);
});
test('wrong original buffer order or key is blocked, never silently reordered',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot);
 [a.originalResident[0],a.originalResident[1]]=[a.originalResident[1],a.originalResident[0]];
 const w=assessFarPeakBufferFeasibility(a);blocked(w);
 assert.equal(w.result,'blocked-unproven-input');
});
test('wrong staged source order is rejected on multi-buffer suffix',()=>{
 const t=tx({x:49,y:-78,z:1});const a=physical(t.snapshot);
 [a.sourceRebuildBytes[0],a.sourceRebuildBytes[1]]=
 [a.sourceRebuildBytes[1],a.sourceRebuildBytes[0]];
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('wrong context identity of a real old buffer invalidates capacity witness',()=>{
 const t=tx();const a=physical(t.snapshot);a.originalResident[3].contextId='new-context';
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('wrong world identity for a newly staged replacement invalidates witness',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot);
 a.sourceRebuildBytes[0].worldId='other-world';
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('wrong upload revision rejects capacity witness',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot);
 a.sourceRebuildBytes[0].worldRevision=8;
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('explicit invalidated native context generation rejects old objects',()=>{
 const t=tx();const a=physical(t.snapshot);a.originalResident[0].contextGeneration=2;
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('snapshot not produced by the source safety preflight is rejected',()=>{
 const t=tx();const a=physical(t.snapshot);
 a.snapshot={...a.snapshot};delete a.snapshot.requiresNativePeakBudgetAndSourceProvenanceProof;
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('no original-world-revision attestation rejects native bytes',()=>{
 const t=tx();const a=physical(t.snapshot);delete a.originalResident[0].worldRevision;
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('invalid original Map-order partition is rejected',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot);
 a.snapshot={...a.snapshot,releaseKeys:[all[2].key]};
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('invalid new draw-order partition is rejected',()=>{
 const t=tx({x:81,y:-78,z:1});const a=physical(t.snapshot);
 a.snapshot={...a.snapshot,expectedRebuildKeys:[all[2].key]};
 assert.equal(assessFarPeakBufferFeasibility(a).result,'blocked-unproven-input');
});
test('a transaction needing original full invalidation cannot masquerade as stage plan',()=>{
 const t=tx({x:32,y:-78,z:1});assert.equal(t.snapshot,undefined);
 assert.equal(assessFarPeakBufferFeasibility({snapshot:t,originalResident:[],sourceRebuildBytes:[]}).result,
 'blocked-unproven-input');
});
test('receipt bytes are source data, not actual GL buffer allocation proof',()=>{
 const w=audit({x:1,y:-78,z:1},0);blocked(w);
 assert.equal(w.nativeRollbackProven,false);
 assert.equal(w.requiresNativeResourceAndRollbackProof,true);
});
test('results do not expose any callable GL API or authorize draw',()=>{
 const w=audit({x:81,y:-78,z:1});blocked(w);
 assert.throws(()=>{w.drawBlocked=false},TypeError);
 assert.throws(()=>w.releasedOriginalKeys.push('fake'),TypeError);
 assert.equal(typeof w.gl,'undefined');
});
test('all original occupied source counts 0..4 obey 4 physical slots without edits',()=>{
 for(let n=0;n<=4;n++){
  const w=audit({x:1,y:-78,z:1},n);
  assert.equal(w.result,'no-prerelease-needed-model-only');
  assert.equal(w.liveBeforeReleaseSlots,4);
  assert.equal(w.postReleaseSlots,4);
 }
});
test('all 4 physically resident source sets with any changed resident require pre-release',()=>{
 for(const x of [49,65,81]){
  const w=audit({x,y:-78,z:1});blocked(w);
  assert.equal(w.result,'pre-release-required-rollback-unproven');
  assert.ok(w.liveBeforeReleaseSlots>4);
 }
});
test('empty inputs never throw and never authorize native retention',()=>{
 for(const data of [undefined,{}, {snapshot:{},originalResident:[],sourceRebuildBytes:[]},
  {snapshot:null,originalResident:[],sourceRebuildBytes:[]}]){
  const w=assessFarPeakBufferFeasibility(data);blocked(w);
  assert.equal(w.result,'blocked-unproven-input');
 }
});
test('no model can alter native getError calls',()=>{
 let called=false;const gl={getError(){called=true;throw Error('never call')},
  bufferData(){called=true;throw Error('never call')}};
 const t=tx({x:81,y:-78,z:1});
 const a=physical(t.snapshot);a.gl=gl;
 const w=assessFarPeakBufferFeasibility(a);blocked(w);
 assert.equal(called,false);
});

test('old GPU byte inventory must agree with immutable source preflight retainedBytes',()=>{
 const t=tx();const a=physical(t.snapshot);a.originalResident[0].bytes+=36;
 const w=assessFarPeakBufferFeasibility(a);blocked(w);
 assert.equal(w.result,'blocked-unproven-input');
 assert.match(w.reason,/snapshot-disagreement/);
});
test('original already-resident set over 1MiB fails before any new allocations',()=>{
 const t=tx();const a=physical(t.snapshot);
 for(const r of a.originalResident)r.bytes=36*8000;
 const w=assessFarPeakBufferFeasibility(a);blocked(w);
 assert.equal(w.result,'blocked-unproven-input');
});
