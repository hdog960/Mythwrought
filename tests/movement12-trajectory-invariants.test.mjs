import test from 'node:test';
import assert from 'node:assert/strict';
import {auditTraceInvariants,TRACE_INVARIANTS_CONTRACT} from '../src/movement12/trajectory-invariants.mjs';
const world={get(){return 0;}};
const clear=()=>false;
const trace=(positions,times=positions.map((_,i)=>i/60))=>positions.map((p,i)=>({time:times[i],position:{x:p[0],feet:p[1],z:p[2]}}));
const audit=(samples,opts={})=>auditTraceInvariants({samples,events:Array(samples.length-1).fill({}),world,collides:clear,...opts});
test('source-only trace passes bounded finite motion',()=>{
 const result=audit(trace([[0,1,0],[.05,1,0],[.1,1,0]]));
 assert.equal(result.contract,TRACE_INVARIANTS_CONTRACT);
 assert.equal(result.pass,true);assert.equal(result.live,false);assert.equal(result.sourceOnly,true);
});
test('rejects body penetration at intermediate frame',()=>{
 const samples=trace([[0,1,0],[.1,1,0],[.2,1,0]]);
 const result=audit(samples,{collides:(_w,x)=>x>.05&&x<.15});
 assert.deepEqual(result.failures.map(x=>x.reason),['body-penetration']);
});
test('flags horizontal teleport',()=>{
 const result=audit(trace([[0,1,0],[3,1,0]]));
 assert.equal(result.pass,false);assert.equal(result.failures[0].reason,'horizontal-speed');
});
test('flags vertical teleport',()=>{
 const result=audit(trace([[0,1,0],[0,4,0]]));
 assert.equal(result.pass,false);assert.equal(result.failures[0].reason,'vertical-speed');
});
test('accepts legitimate falling within configured velocity',()=>{
 assert.equal(audit(trace([[0,2,0],[0,1.8,0]])).pass,true);
});
test('rejects duplicate timestamps',()=>{
 assert.throws(()=>audit(trace([[0,1,0],[0,1,0]],[0,0])),/timestamps/);
});
test('rejects nonfinite positions',()=>{
 assert.throws(()=>audit(trace([[0,1,0],[NaN,1,0]])),/nonfinite/);
});
test('rejects missing event evidence',()=>{
 assert.throws(()=>auditTraceInvariants({samples:trace([[0,1,0],[0,1,0]]),events:[],world,collides:clear}),/event/);
});
test('rejects excessive samples',()=>{
 assert.throws(()=>audit(trace([[0,1,0],[0,1,0],[0,1,0]]),{maxSamples:2}),/bounded/);
});
test('does not mutate samples',()=>{
 const samples=trace([[0,1,0],[.05,1,0]]),before=structuredClone(samples);
 audit(samples);assert.deepEqual(samples,before);
});
