import test from 'node:test';
import assert from 'node:assert/strict';
import {auditFittingInteractionSequence} from '../src/nonblock-fittings36/evidence-sequence.mjs';
const sourceSha='a'.repeat(40),instanceKey='scene36:signpost:179:1:2:3';
function sample(){return [[667,375],[844,390],[932,430]].flatMap(([width,height])=>['visible','selected','removed','restored'].map((stage,i)=>({
 width,height,stage,frameNumber:i+1,editRevision:7,instanceKey,sourceSha,selectedKey:instanceKey,
 visibleAfter:i<2,tombstonePresent:i>=2,breakAccepted:i>=2,removalKey:i>=2?instanceKey:null,
 tombstoneKey:i>=2?instanceKey:null,coldReload:i===3,rehydratedFromSidecar:i===3
})));}
test('three landscape sequences are coherent but never production-ready',()=>{
 const result=auditFittingInteractionSequence(sample());assert.equal(result.fixtureWitnesses,12);assert.equal(result.productionIntegrationReady,false);
});
test('rejects identity, ordering, edit and tombstone drift',()=>{
 for(const [index,patch] of [[2,{instanceKey:'other'}],[1,{frameNumber:1}],[3,{editRevision:8}],[2,{tombstonePresent:false}],[3,{coldReload:false}],[3,{tombstoneKey:'wrong'}],[2,{breakAccepted:false}]]){
  const c=sample();c[index]={...c[index],...patch};assert.throws(()=>auditFittingInteractionSequence(c));
 }
});
test('rejects duplicated stage and viewport mismatch',()=>{
 const c=sample();c[1]={...c[1],stage:'visible'};assert.throws(()=>auditFittingInteractionSequence(c));
 const d=sample();d[8]={...d[8],instanceKey:'another'};assert.throws(()=>auditFittingInteractionSequence(d));
});
