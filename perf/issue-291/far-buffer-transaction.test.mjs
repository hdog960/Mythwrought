// Source-only metadata transaction protocol tests. Native GPU verification
// remains in the cave owner's original modules and is NOT represented here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceOnlyFarTransaction} from './far-buffer-transaction.mjs';
import {editAffectedChunks} from '../../src/chunks.mjs';
import {verticalEditSections,depthMeshKey,sectionBounds} from '../../src/depth.mjs';
const source={editAffectedChunks,verticalEditSections,depthMeshKey,sectionBounds};
const desc=(x,z,y,extras={})=>({key:depthMeshKey(x,z,y),cx:x,cz:z,section:y,...extras});
const positions=[2,3,4,5].map(x=>desc(x,0,-5));
const old=()=>({worldId:'world-m7',contextId:'webgl-original',contextGeneration:7,
  worldRevision:104,planForRevision:104,selected:[...positions],
  resident:positions.map((p,i)=>({key:p.key,bytes:5000+i*100,
    contextGeneration:7,planForRevision:104,source:p}))});
const next=()=>({worldId:'world-m7',contextId:'webgl-original',contextGeneration:7,
  worldRevision:105,planForRevision:105,rayPlanRecomputed:true,
  nearReady:true,streamingStable:true,selected:[...positions]});
const build=(edit={x:1,y:-78,z:1},opts={})=>createSourceOnlyFarTransaction({
 before:old(),after:next(),edit,source,...opts});
const receipt=(key,bytes=1000)=>({key,bytes,worldId:'world-m7',worldRevision:105,
 contextId:'webgl-original',contextGeneration:7});
const blocked=x=>{
 assert.equal(x.drawBlocked,true);
 assert.equal(x.liveIntegrationApproved,false);
};

test('unchanged geometry retained; still blocked until an owner native transaction',()=>{
 const t=build(),s=t.state();
 assert.equal(s.phase,'staging');
 assert.equal(s.expectedRebuildKeys.length,0);blocked(s);
 const p=t.prepare();assert.equal(p.prepared,true);blocked(p);
 assert.equal(p.nativeCommitted,false);assert.equal(p.totalExpectedResidentBytes,20600);
});
test('dirty final far section stages only one original ordered suffix',()=>{
 const t=build({x:81,y:-78,z:1});
 assert.deepEqual(t.state().retainedKeys,positions.slice(0,3).map(x=>x.key));
 assert.deepEqual(t.state().expectedRebuildKeys,[positions[3].key]);
 const waiting=t.prepare();assert.equal(waiting.accepted,false);blocked(waiting);
 const accepted=t.stage(receipt(positions[3].key,1250));assert.equal(accepted.accepted,true);blocked(accepted);
 const p=t.prepare();assert.equal(p.prepared,true);
 assert.deepEqual(p.expectedOriginalDrawOrder,positions.map(x=>x.key));
 assert.deepEqual(p.releaseKeys,[positions[3].key]);
});
test('dirty middle source stages suffix in original mesh draw order',()=>{
 const t=build({x:49,y:-78,z:1});
 assert.deepEqual(t.state().retainedKeys,[positions[0].key]);
 assert.deepEqual(t.state().expectedRebuildKeys,positions.slice(1).map(x=>x.key));
 for(const key of t.state().expectedRebuildKeys){
  assert.equal(t.stage(receipt(key)).accepted,true);
 }
 const p=t.prepare();assert.equal(p.prepared,true);
 assert.deepEqual(p.stagedKeys,positions.slice(1).map(x=>x.key));
 assert.equal(p.totalExpectedResidentBytes,8000);
});
test('first resident edit requires full native invalidation, never an unsafe cache',()=>{
 const t=build({x:32,y:-78,z:1});
 assert.equal(t.phase,'requires-original-full-invalidation');
 blocked(t);assert.deepEqual(t.releaseKeys,positions.map(x=>x.key));
});
test('changed ray plan requires original full invalidation even with no edit geometry overlap',()=>{
 const n=next();n.selected=[positions[1],positions[0],positions[2],positions[3]];
 const t=build(undefined,{after:n});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('unverified native buffer provenance blocks all far rendering',()=>{
 const b=old();b.resident[1].planForRevision=103;
 const t=build(undefined,{before:b});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('context-loss transition always invalidates, never carries stale GPU receipts',()=>{
 const n=next();n.contextGeneration=8;
 const t=build(undefined,{after:n});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('context identity change invalidates even when generation is unchanged',()=>{
 const n=next();n.contextId='another-context';
 const t=build(undefined,{after:n});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('new world identity cannot reuse original world GPU buffers',()=>{
 const n=next();n.worldId='world-other';
 const t=build(undefined,{after:n});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('no near-ready or incomplete streaming permits GPU reuse',()=>{
 for(const field of ['nearReady','streamingStable']){
  const n=next();n[field]=false;
  const t=build(undefined,{after:n});
  assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
 }
});
test('stage receipts must carry world and context identity, not just a matching key',()=>{
 for(const wrong of [
  {worldRevision:104},{contextGeneration:6},{contextId:'new-gl'},
  {worldId:'world-other'},{key:'wrong-key'}
 ]){
  const t=build({x:81,y:-78,z:1});
  const out=t.stage({...receipt(positions[3].key),...wrong});
  assert.equal(out.accepted,false);blocked(out);
  assert.equal(t.state().phase,'aborted');
  assert.equal(t.stage(receipt(positions[3].key)).accepted,false);
 }
 const valid=build({x:81,y:-78,z:1});
 assert.equal(valid.stage(receipt(positions[3].key)).accepted,true);
 assert.equal(valid.prepare().prepared,true);
});
test('staged size can never exceed the original 1MiB budget',()=>{
 const t=build({x:81,y:-78,z:1});
 const out=t.stage(receipt(positions[3].key,1048576));
 assert.equal(out.accepted,false);blocked(out);
 assert.equal(t.state().phase,'aborted');
 assert.equal(t.prepare().accepted,false);
});
test('noninteger and zero source sizes are rejected',()=>{
 for(const bytes of [0, -1, 1.1, NaN, Infinity]){
  const t=build({x:81,y:-78,z:1});
  const out=t.stage(receipt(positions[3].key,bytes));
  assert.equal(out.accepted,false);blocked(out);
  assert.equal(t.state().phase,'aborted');
 }
});
test('no speculative double stage allowed after all original sources are staged',()=>{
 const t=build({x:81,y:-78,z:1});
 assert.equal(t.stage(receipt(positions[3].key)).accepted,true);
 assert.equal(t.stage(receipt(positions[3].key)).accepted,false);
 assert.equal(t.prepare().prepared,true);
});
test('no receipts can be staged after prepare',()=>{
 const t=build({x:81,y:-78,z:1});
 assert.equal(t.stage(receipt(positions[3].key)).accepted,true);
 assert.equal(t.prepare().prepared,true);
 assert.equal(t.stage(receipt(positions[3].key)).accepted,false);
});
test('abort never publishes buffers; it flags native rollback and stale handles',()=>{
 const t=build({x:49,y:-78,z:1});
 t.stage(receipt(positions[1].key));
 const cancelled=t.abort('source-world-edited-again');
 assert.equal(cancelled.aborted,true);assert.equal(cancelled.nativeRollbackRequired,true);
 blocked(cancelled);
 assert.deepEqual(cancelled.syntheticReceiptsToDiscard,[positions[1].key]);
 assert.equal(t.stage(receipt(positions[2].key)).accepted,false);
});
test('caller cannot mutate key order or metadata while transaction is staged',()=>{
 const n=next(),b=old();
 const t=build({x:49,y:-78,z:1},{after:n,before:b});
 const saved=t.state().expectedRebuildKeys.join(',');
 b.resident.splice(0,4);n.selected.splice(0,4);
 assert.equal(t.state().expectedRebuildKeys.join(','),saved);
 assert.throws(()=>t.state().retainedKeys.push('fake'),TypeError);
 assert.throws(()=>{t.state().estimatedBytes=0},TypeError);
 for(const key of t.state().expectedRebuildKeys) assert.equal(t.stage(receipt(key)).accepted,true);
 assert.equal(t.prepare().prepared,true);
});
test('original real chunk edits yield only exact original-order suffix rebuilds',()=>{
 for(const [x,prefix] of [[1,4],[32,0],[49,1],[65,2],[81,3]]){
  const t=build({x,y:-78,z:1});
  if(prefix===0){assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);continue;}
  const s=t.state();blocked(s);
  assert.deepEqual(s.retainedKeys,positions.slice(0,prefix).map(v=>v.key));
  assert.deepEqual(s.expectedRebuildKeys,positions.slice(prefix).map(v=>v.key));
  for(const key of s.expectedRebuildKeys)
   assert.equal(t.stage(receipt(key)).accepted,true);
  const p=t.prepare();assert.equal(p.prepared,true);blocked(p);
  assert.deepEqual(p.expectedOriginalDrawOrder,positions.map(v=>v.key));
 }
});
test('model makes no native gl calls and never alters original gl.getError semantics',()=>{
 const gl={getError(){throw Error('cannot call')},deleteBuffer(){throw Error('cannot call')},
   bufferData(){throw Error('cannot call')}};
 const t=build({x:81,y:-78,z:1},{gl});
 assert.equal(t.stage(receipt(positions[3].key)).accepted,true);
 const p=t.prepare();assert.equal(p.prepared,true);
 assert.equal(p.originalGlErrorPolicyUnchanged,true);
 assert.equal(p.nativeUploadValidationRequired,true);
 blocked(p);
});
test('source-world edit boundary in physical negative X never skips the real neighbor',()=>{
 const t=build({x:-16,y:-78,z:1});
 assert.ok(t.state().expectedRebuildKeys.length===0);
 blocked(t.state());
});
test('must remain source-only: no phase ever asserts native commit or renderability',()=>{
 const paths=[build(),build({x:32,y:-78,z:1}),build({x:49,y:-78,z:1})];
 for(const t of paths){
  if(typeof t.state==='function'){
   blocked(t.state());
   const p=t.prepare();blocked(p);
   blocked(t.abort());
  }else blocked(t);
 }
});
test('zero original buffers allows staged initial reconstruction but never bypasses owner commit',()=>{
 const b=old();b.resident=[];
 const t=build(undefined,{before:b});
 assert.deepEqual(t.state().retainedKeys,[]);
 assert.deepEqual(t.state().expectedRebuildKeys,positions.map(v=>v.key));
 for(const key of t.state().expectedRebuildKeys)
   assert.equal(t.stage(receipt(key,100)).accepted,true);
 const prepared=t.prepare();assert.equal(prepared.prepared,true);
 assert.equal(prepared.totalExpectedResidentBytes,400);
 assert.equal(prepared.nativeUploadValidationRequired,true);blocked(prepared);
});
test('out-of-order first staged source aborts the complete transaction',()=>{
 const t=build({x:49,y:-78,z:1});
 const wrong=t.stage(receipt(positions[3].key));
 assert.equal(wrong.accepted,false);assert.equal(t.state().phase,'aborted');
 assert.equal(t.stage(receipt(positions[1].key)).accepted,false);
 const cancelled=t.abort('discard-stale-receipts');
 assert.deepEqual(cancelled.syntheticReceiptsToDiscard,[]);blocked(cancelled);
});
test('abort after prepare remains non-renderable and cannot receive new receipts',()=>{
 const t=build({x:81,y:-78,z:1});
 assert.equal(t.stage(receipt(positions[3].key)).accepted,true);
 assert.equal(t.prepare().prepared,true);
 const aborted=t.abort('app-pagehide-before-native-commit');
 assert.equal(aborted.aborted,true);blocked(aborted);
 assert.deepEqual(aborted.syntheticReceiptsToDiscard,[positions[3].key]);
 assert.equal(t.prepare().accepted,false);
 assert.equal(t.stage(receipt(positions[3].key)).accepted,false);
});
test('recomputed ray plan carrying different joined companion fails to stage',()=>{
 const n=next();n.selected[2]=desc(4,0,-5,{companion:desc(4,0,-6)});
 const t=build(undefined,{after:n});
 assert.equal(t.phase,'requires-original-full-invalidation');blocked(t);
});
test('native peak buffer slots and transient bytes are explicitly NOT certified by pure receipts',()=>{
 const t=build({x:49,y:-78,z:1});
 assert.equal(t.snapshot.requiresNativePeakBudgetAndSourceProvenanceProof,true);
 for(const key of t.state().expectedRebuildKeys)
   assert.equal(t.stage(receipt(key,1000)).accepted,true);
 const p=t.prepare();assert.equal(p.prepared,true);
 assert.equal(p.requiresNativePeakBudgetAndSourceProvenanceProof,true);
 assert.equal(p.nativeCommitted,false);blocked(p);
});
test('aborted transactions do not advertise another expected GPU upload',()=>{
 const t=build({x:49,y:-78,z:1});
 t.stage(receipt(positions[3].key));
 assert.equal(t.state().phase,'aborted');
 assert.equal(t.state().nextExpectedKey,null);
});
