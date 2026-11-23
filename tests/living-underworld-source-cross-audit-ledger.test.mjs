import test from 'node:test';
import assert from 'node:assert/strict';
import {createCitySourceCrossAuditLedger as create}
 from '../src/living-underworld/source-cross-audit-ledger.mjs';
const roles=['naturalAt','authoredAt','editedAt','protectedAt'];
const normal=()=>({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const read=(readers,x,y,z)=>{
 for(const role of roles)readers[role](x,y,z);
};
test('same old-world source values across deep survey and bridge pass without extra reads',()=>{
 let calls=0;const raw=normal();
 const src=Object.fromEntries(roles.map(role=>[role,(...p)=>{
  calls++;return raw[role](...p);
 }]));
 const ledger=create(src);read(ledger.readers,625,-132,133);
 ledger.beginUnderpass();read(ledger.readers,625,-132,133);
 const proof=ledger.audit();
 assert.equal(proof.ok,true);assert.equal(calls,8);
 assert.equal(proof.totalSourceCallbackCalls,8);
 assert.deepEqual(proof.crossPhaseComparedCellsByRole,{
  naturalAt:1,authoredAt:1,editedAt:1,protectedAt:1
 });
 assert.equal(proof.comparedSourceReturnsAcrossPhases,4);
 assert.equal(proof.authenticM7WorldExecuted,false);
 assert.equal(proof.noWorldWrites,true);
});
test('safe geology ID changing from deep selection to later underpass is a hard HOLD',()=>{
 let hits=0;const source={...normal(),naturalAt:()=>++hits===1?1:2};
 const ledger=create(source);read(ledger.readers,625,-132,133);
 ledger.beginUnderpass();read(ledger.readers,625,-132,133);
 const proof=ledger.audit();
 assert.equal(proof.ok,false);
 assert.equal(proof.reason,'ORIGINAL_SOURCE_LEDGER_VALUE_CHANGED');
 assert.equal(proof.firstMismatch.role,'naturalAt');
 assert.equal(proof.firstMismatch.coordinate,'625,-132,133');
 assert.equal(proof.firstMismatch.firstPhase,'prior');
 assert.equal(proof.firstMismatch.secondPhase,'underpass');
});
test('same source voxel flipping values within the earlier deep survey refuses',()=>{
 let n=0;const ledger=create({...normal(),naturalAt:()=>++n===1?1:2});
 read(ledger.readers,0,-80,0);read(ledger.readers,0,-80,0);
 ledger.beginUnderpass();read(ledger.readers,1,-80,0);
 assert.equal(ledger.audit().reason,'ORIGINAL_SOURCE_LEDGER_VALUE_CHANGED');
});
test('original authored ownership changes after earlier accepted route are detected',()=>{
 let n=0;const ledger=create({...normal(),authoredAt:()=>++n===1?undefined:7});
 read(ledger.readers,0,-80,0);ledger.beginUnderpass();
 read(ledger.readers,0,-80,0);
 const result=ledger.audit();
 assert.equal(result.reason,'ORIGINAL_SOURCE_LEDGER_VALUE_CHANGED');
 assert.equal(result.firstMismatch.role,'authoredAt');
});
test('player edits and protected landmarks changing between audits refuse separately',()=>{
 for(const role of ['editedAt','protectedAt']){
  let n=0;const ledger=create({...normal(),[role]:()=>++n!==1});
  read(ledger.readers,0,-80,0);ledger.beginUnderpass();
  read(ledger.readers,0,-80,0);
  const r=ledger.audit();
  assert.equal(r.reason,'ORIGINAL_SOURCE_LEDGER_VALUE_CHANGED');
  assert.equal(r.firstMismatch.role,role);
 }
});
test('new underpass cells not previously queried are allowed with zero cross-phase comparisons',()=>{
 const ledger=create(normal());read(ledger.readers,0,-80,0);
 ledger.beginUnderpass();read(ledger.readers,9,-80,0);
 const r=ledger.audit();assert.equal(r.ok,true);
 assert.equal(r.comparedSourceReturnsAcrossPhases,0);
 assert.equal(r.uniqueCellsByRole.naturalAt,2);
});
test('bounded per-role cell budget never silently drops previous-data evidence',()=>{
 const ledger=create(normal(),{maxCoordinatesPerRole:1});
 read(ledger.readers,0,-80,0);ledger.beginUnderpass();
 read(ledger.readers,1,-80,0);
 const r=ledger.audit();assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_SOURCE_LEDGER_CELL_BUDGET');
 assert.equal(r.uniqueCellsByRole.naturalAt,1);
 assert.equal(r.noExtraOriginalWorldReads,true);
});
test('bounded total role-call budget refuses even when source values remain stable',()=>{
 const ledger=create(normal(),{maxTotalCalls:4});
 read(ledger.readers,0,-80,0);ledger.beginUnderpass();
 read(ledger.readers,0,-80,0);
 assert.equal(ledger.audit().reason,'ORIGINAL_SOURCE_LEDGER_TOTAL_CALL_BUDGET');
});
test('original source role input types are validated without substituting values',()=>{
 const ledger=create({...normal(),naturalAt:()=>Number.NaN});
 read(ledger.readers,0,-80,0);ledger.beginUnderpass();
 read(ledger.readers,0,-80,0);
 const r=ledger.audit();
 assert.equal(r.reason,'ORIGINAL_SOURCE_LEDGER_INVALID_ROLE_VALUE');
 assert.equal(r.firstMismatch.role,'naturalAt');
});
test('source method replacement is detected even though stable ledger wrappers remain identical',()=>{
 const source=normal();const ledger=create(source);
 read(ledger.readers,0,-80,0);
 source.editedAt=()=>false;
 ledger.beginUnderpass();read(ledger.readers,0,-80,0);
 const r=ledger.audit();assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_SOURCE_CALLBACK_BINDING_CHANGED');
 assert.equal(r.originalCallbackBindingsUnchanged,false);
});
test('premature underpass transition and premature/duplicate audits fail closed',()=>{
 const ledger=create(normal());
 assert.throws(()=>ledger.beginUnderpass(),/prior audit incomplete/);
 assert.throws(()=>ledger.audit(),/underpass not complete/);
 read(ledger.readers,0,-80,0);ledger.beginUnderpass();
 assert.throws(()=>ledger.beginUnderpass(),/prior audit incomplete/);
 read(ledger.readers,0,-80,0);ledger.audit();
 assert.throws(()=>ledger.audit(),/underpass not complete/);
 assert.throws(()=>ledger.readers.naturalAt(0,-80,0),/Invalid.*observation/);
});
test('same prior source reused many times is compared only once per role in the later phase',()=>{
 const ledger=create(normal());
 read(ledger.readers,0,-80,0);read(ledger.readers,0,-80,0);
 ledger.beginUnderpass();read(ledger.readers,0,-80,0);
 read(ledger.readers,0,-80,0);
 const r=ledger.audit();
 assert.equal(r.ok,true);assert.equal(r.comparedSourceReturnsAcrossPhases,4);
 assert.equal(r.priorCalls.naturalAt,2);assert.equal(r.underpassCalls.naturalAt,2);
});
test('per-role source readers and final report are immutable and keep caller-only cave provenance',()=>{
 const ledger=create(normal());read(ledger.readers,-1000,-180,-1000);
 ledger.beginUnderpass();read(ledger.readers,-1000,-180,-1000);
 const r=ledger.audit();
 assert.equal(Object.isFrozen(ledger.readers),true);
 assert.equal(Object.isFrozen(r),true);
 assert.equal(Object.isFrozen(r.crossPhaseComparedCellsByRole),true);
 assert.equal(r.callerSourceWorldIdentityUnverified,true);
 assert.equal(r.worldChanged,false);
 assert.throws(()=>{r.ok=false},TypeError);
});
test('malformed input and budgets refuse before invoking any original source role',()=>{
 for(const opt of [{maxCoordinatesPerRole:0},{maxCoordinatesPerRole:200001},
  {maxTotalCalls:3},{maxTotalCalls:2000001}]){
  assert.throws(()=>create(normal(),opt),/Invalid original-world/);
 }
 assert.throws(()=>create({...normal(),naturalAt:7}),/Invalid original-world/);
 const ledger=create(normal());assert.throws(()=>ledger.readers.naturalAt(0.5,-80,0),
  /Invalid.*observation/);
});
