import test from 'node:test';
import assert from 'node:assert/strict';
import { auditRemovalEvidence } from '../../src/auto-integration-support/nonblock-removal-evidence-gate.mjs';
const h='b'.repeat(64), commit='a'.repeat(40), key='flora:seed:anchor:1';
const fixture=()=>({sourceCommit:commit,contract:'nonblock-object-v1',saveSchema:'schema-1',key,seed:'seed',provenance:{browser:'Chromium',graphics:'WebGL2',fixture:false,runId:'fixture-declared'},steps:['before','picked','removed','reloaded'].map((name,i)=>({name,key,seed:'seed',neighborDigest:h,editDigest:h,backupDigest:h,visible:i<2,tombstone:i>=2,...(i===1?{pickedKey:key}:{}),...(i===2?{removedKey:key}:{}),...(i===3?{coldReload:true,saveSchema:'schema-1'}:{})})),captures:['667x375','844x390','932x430'].map(size=>({size,sha256:h}))});
const expected={productionEnabled:false,commit};
test('declared complete evidence never proves live integration',()=>{const r=auditRemovalEvidence(fixture(),expected);assert.equal(r.accepted,true);assert.equal(r.live,false)});
for(const [name,change] of [
['source drift',e=>e.sourceCommit='c'.repeat(40)],['pick mismatch',e=>e.steps[1].pickedKey='other:key'],['removal mismatch',e=>e.steps[2].removedKey='other:key'],['neighbor damage',e=>e.steps[2].neighborDigest='c'.repeat(64)],['world edit damage',e=>e.steps[3].editDigest='c'.repeat(64)],['respawn',e=>e.steps[3].visible=true],['lost tombstone',e=>e.steps[3].tombstone=false],['no cold reload',e=>e.steps[3].coldReload=false],['fixture browser',e=>e.provenance.fixture=true],['missing capture',e=>e.captures.pop()],['duplicate capture',e=>e.captures[2]=e.captures[0]],['missing backup',e=>e.steps[0].backupDigest=''],['seed drift',e=>e.steps[1].seed='other'],['schema drift',e=>e.saveSchema='schema-2']
])test('rejects '+name,()=>{const e=fixture();change(e);assert.equal(auditRemovalEvidence(e,expected).accepted,false)});
test('rejects production enablement',()=>assert.equal(auditRemovalEvidence(fixture(),{...expected,productionEnabled:true}).accepted,false));
