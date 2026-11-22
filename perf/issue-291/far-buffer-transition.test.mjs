import test from 'node:test';
import assert from 'node:assert/strict';
import {preflightFarBufferTransition} from './far-buffer-transition.mjs';
import {editAffectedChunks} from '../../src/chunks.mjs';
import {verticalEditSections,depthMeshKey,sectionBounds} from '../../src/depth.mjs';
const source={editAffectedChunks,verticalEditSections,depthMeshKey,sectionBounds};
const s=(x,z,y,more={})=>({cx:x,cz:z,section:y,key:depthMeshKey(x,z,y),...more});
const a=s(2,0,-5),b=s(3,0,-5),c=s(4,0,-5),d=s(5,0,-5);
const original=[a,b,c,d];
const before=()=>({worldId:'world-7',contextId:'context1',contextGeneration:2,
 worldRevision:82,planForRevision:82,selected:original,
 resident:original.map((x,i)=>({key:x.key,bytes:3000+i*100,
  contextGeneration:2,planForRevision:82,source:x}))});
const after=()=>({worldId:'world-7',contextId:'context1',contextGeneration:2,
 worldRevision:83,planForRevision:83,rayPlanRecomputed:true,nearReady:true,
 streamingStable:true,selected:original});
const go=(overrides={})=>preflightFarBufferTransition({
 before:before(),after:after(),edit:{x:1,y:-78,z:1},source,...overrides});
const fail=(value,reason)=>{assert.equal(value.decision,'invalidate-all');
 assert.match(value.reason,reason);assert.equal(value.liveIntegrationApproved,false);
 assert.equal(value.drawBlockedUntilCommitted,true)};

test('original untouched resident buffers remain ordered and reusable',()=>{
 const t=go();assert.equal(t.decision,'retain-all');
 assert.deepEqual(t.retainKeys,original.map(x=>x.key));
 assert.deepEqual(t.rebuildKeys,[]);
 assert.equal(t.estimatedRetainedBytes,12600);
});
test('partial near/far source alteration evicts suffix and requires staged rebuild',()=>{
 const t=go({edit:{x:49,y:-78,z:1}});
 assert.equal(t.decision,'retain-prefix');
 assert.deepEqual(t.retainKeys,[a.key]);
 assert.deepEqual(t.releaseKeys,[b.key,c.key,d.key]);
 assert.deepEqual(t.rebuildKeys,[b.key,c.key,d.key]);
});
test('context generation change invalidates stale GPU objects',()=>{
 const t=go({after:{...after(),contextGeneration:3}});
 fail(t,/context-generation/);
});
test('even same generation but different GL context id fails closed',()=>{
 fail(go({after:{...after(),contextId:'context2'}}),/context-changed/);
});
test('world reload/id change fails closed',()=>{
 fail(go({after:{...after(),worldId:'world-8'}}),/context-changed/);
});
test('wrong source revision delta fails closed',()=>{
 fail(go({after:{...after(),worldRevision:84,planForRevision:84}}),/world-revision/);
});
test('stale original ray plan fails closed even if selection keys identical',()=>{
 fail(go({after:{...after(),planForRevision:82}}),/new-ray-plan/);
});
test('ray recomputation must be attested, not presumed from a key list',()=>{
 fail(go({after:{...after(),rayPlanRecomputed:false}}),/new-ray-plan/);
});
test('do not reuse buffers while near streaming/visibility is incomplete',()=>{
 fail(go({after:{...after(),nearReady:false}}),/streaming/);
 fail(go({after:{...after(),streamingStable:false}}),/streaming/);
});
test('unknown source bounds cannot certify a reuse decision',()=>{
 fail(go({source:{...source,sectionBounds:undefined}}),/source-contract/);
});
test('positive and overly deep source sections fail closed even with key parity',()=>{
 for (const section of [1,-14]) {
  const bad=s(2,0,section);
  const stale=before(),updated=after();
  stale.selected=[bad,b,c,d];
  stale.resident[0]={...stale.resident[0],key:bad.key,source:bad};
  updated.selected=[bad,b,c,d];
  fail(go({before:stale,after:updated}),/out-of-range/);
 }
});
test('correct primary but forged buffer provenance cannot be retained',()=>{
 const old=before();old.resident[1].source=s(3,0,-6);
 fail(go({before:old}),/gpu-buffer-provenance/);
});
test('never reuse an old-generation buffer after WebGL context restoration',()=>{
 const old=before();old.resident[1].contextGeneration=1;
 fail(go({before:old}),/gpu-buffer-provenance/);
});
test('buffers created for a different plan revision cannot be reused',()=>{
 const old=before();old.resident[3].planForRevision=81;
 fail(go({before:old}),/gpu-buffer-provenance/);
});
test('all resident bytes must fit original one-MiB budget',()=>{
 const old=before();old.resident[1].bytes=1048576;
 fail(go({before:old}),/byte-budget/);
});
test('source composition includes all three genuine C6 companion slots',()=>{
 const enriched=s(2,0,-5,{companion:s(2,0,-6),
 seamCompanion:s(1,0,-5),wideWitnessCompanion:s(2,1,-5)});
 const old=before(),newPlan=after();old.selected[0]=enriched;
 old.resident[0]={...old.resident[0],source:enriched};
 newPlan.selected[0]=enriched;
 const untouched=go({before:old,after:newPlan});
 assert.equal(untouched.decision,'retain-all');
 const edited=go({before:old,after:newPlan,edit:{x:32,y:-83,z:1}});
 assert.equal(edited.decision,'invalidate-all');
});
test('changed companion section refuses even identical primary key',()=>{
 const updated=after();updated.selected=[s(2,0,-5,{companion:s(2,0,-6)}),b,c,d];
 fail(go({after:updated}),/ray-plan/);
});
test('changed order refuses retention and must rebuild under original draw ordering',()=>{
 const updated=after();updated.selected=[b,a,c,d];
 fail(go({after:updated}),/ray-plan/);
});
test('missing or malformed edit provenance is a fail-closed no-WebGL result',()=>{
 for(const edit of [null,{x:1.5,y:-78,z:1},{x:1,y:-211,z:1}])
  fail(go({edit}),/edit/);
});
test('empty resident prefix is valid but still requires original ray plan',()=>{
 const old=before();old.resident=[];
 const p=go({before:old});assert.equal(p.decision,'retain-all');
 assert.deepEqual(p.rebuildKeys,original.map(x=>x.key));
 assert.equal(p.drawBlockedUntilCommitted,true);
});
test('unknown resident metadata fails closed rather than trusting a Map key',()=>{
 const old=before();delete old.resident[2].contextGeneration;
 fail(go({before:old}),/gpu-buffer-provenance/);
});
test('zero actual native GL calls, unchanged error read policy',()=>{
 const gl={getError(){throw Error('MUST NOT CALL')},deleteBuffer(){throw Error('MUST NOT CALL')}};
 const p=go({gl});assert.equal(p.decision,'retain-all');
 assert.equal(p.mustUseOriginalErrorChecks,true);
 assert.equal(p.liveIntegrationApproved,false);
});
test('reject if untrusted source key uses fake section despite valid source bounds',()=>{
 const old=before(),updated=after();const bad={...a,key:'not-source-derived'};
 old.selected[0]=bad;old.resident[0].key=bad.key;old.resident[0].source=bad;
 updated.selected[0]=bad;
 fail(go({before:old,after:updated}),/out-of-range/);
});
test('no integration decision can certify live GPU safety or performance',()=>{
 for(const p of [go(),go({after:{...after(),nearReady:false}})]){
  assert.equal(p.ownerApprovalRequired,true);
  assert.equal(p.liveIntegrationApproved,false);
  assert.equal(p.drawBlockedUntilCommitted,true);
  assert.equal(p.requiresFreshRayPlan,true);
 }
});
