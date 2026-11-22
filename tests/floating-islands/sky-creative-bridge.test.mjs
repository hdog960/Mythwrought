import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkyPrefetchState,planSkyCreativePrefetch,
 settleSkyCreativePrefetch,cancelSkyCreativePrefetch,verifySkyCreativeFlightStep} from '../../src/floating-islands/sky-creative-bridge.mjs';
const xyz=(x,y,z)=>({x,y,z});
const host=(more={})=>({worldToken:'seed179:w0',expectedWorldToken:'seed179:w0',
 isBaseRegionReady:()=>true,isBaseBodyClear:()=>true,
 isSkyResident:()=>true,isSkyBodyClear:()=>true,...more});
test('dual-world G2 flight gate refuses unloaded upper cells before collision',()=>{
  let collisionReads=0;
  const a=verifySkyCreativeFlightStep(xyz(0,35.5,0),host({isSkyResident:r=>r.cx===0,
    isBaseBodyClear:()=>{collisionReads++;return true;}}));
  assert.equal(a.safe,false);assert.equal(a.missing.length,4);
  assert.equal(collisionReads,0);
});
test('source-authored sky collision blocks flight even if old ground host says clear',()=>{
  const a=verifySkyCreativeFlightStep(xyz(12,144,24),host({isSkyBodyClear:()=>false}));
  assert.equal(a.safe,false);assert.match(a.reason,/island body collision/);
});
test('original terrain region remains mandatory at low feet and Y19/20 transition',()=>{
  const a=verifySkyCreativeFlightStep(xyz(3,19.5,3),host({isBaseRegionReady:()=>false}));
  assert.equal(a.safe,false);assert.equal(a.required.length,1);
  assert.match(a.reason,/Original terrain region unloaded/);
});
test('all body seams must be live before dual-world high flight is safe',()=>{
  const a=verifySkyCreativeFlightStep(xyz(0,35.5,0),host());
  assert.equal(a.safe,true);assert.equal(a.required.length,8);
  assert.equal(new Set(a.required.map(x=>x.key)).size,8);
});
test('world token changes and unsupported ceilings fail safely',()=>{
  assert.equal(verifySkyCreativeFlightStep(xyz(12,100,12),host({worldToken:'seed2026:w1'})).safe,false);
  assert.equal(verifySkyCreativeFlightStep(xyz(12,256.25,12),host()).safe,false);
  assert.throws(()=>verifySkyCreativeFlightStep(xyz(12,150,12),host({isSkyBodyClear:undefined})),/host/);
});
test('safe sky prefetch uses namespaced non-aliased sky keys at negative seams',()=>{
  const result=planSkyCreativePrefetch(createSkyPrefetchState('seed179:w0'),{
    worldToken:'seed179:w0',intentToken:'up',points:[xyz(0,35.5,0)],isSkyResident:()=>false});
  assert.equal(result.requests.length,2);
  assert.ok(result.requests.every(r=>r.key.startsWith('sky:')));
  assert.ok(result.requests.every(r=>r.section>=0));
  assert.notEqual(result.requests[0].key,'-1,0,0');
});
test('pending requests are bounded to six while sparse vertical crossing queues backfill',()=>{
  let state=createSkyPrefetchState('seed179:w0','up');const seen=new Set();
  const points=[xyz(0,35.5,0)];
  for(let i=0;i<7;i++){
    const planned=planSkyCreativePrefetch(state,{worldToken:'seed179:w0',intentToken:'up',
      points,isSkyResident:r=>seen.has(r.key)});
    assert.ok(planned.requests.length<=2);assert.ok(planned.state.pending.length<=6);
    for(const r of planned.requests)seen.add(r.key);
    state=settleSkyCreativePrefetch(planned.state,planned.requests.map(r=>r.key));
  }
  assert.equal(seen.size,8);
  assert.equal(state.pending.length,0);
});
test('direction reversal cancels stale requests and maintains new bounded owner',()=>{
  const old=planSkyCreativePrefetch(createSkyPrefetchState('seed179:w0','toward'),{
    worldToken:'seed179:w0',intentToken:'toward',points:[xyz(16,98,12)],isSkyResident:()=>false});
  const changed=planSkyCreativePrefetch(old.state,{worldToken:'seed179:w0',intentToken:'away',
    points:[xyz(-16,98,12)],isSkyResident:()=>false});
  assert.deepEqual(changed.cancelled,old.requests.map(r=>r.key));
  assert.equal(changed.state.intentToken,'away');
  assert.equal(changed.state.pending.length,changed.requests.length);
});
test('world switch cancels all prior sky-prefetch identity without touching terrain',()=>{
  const a=planSkyCreativePrefetch(createSkyPrefetchState('seed179:w0'),{
    worldToken:'seed179:w0',intentToken:'forward',points:[xyz(8,50,8)],isSkyResident:()=>false});
  const b=planSkyCreativePrefetch(a.state,{worldToken:'seed2026:w1',intentToken:'forward',
    points:[],isSkyResident:()=>false});
  assert.deepEqual(b.cancelled,a.requests.map(x=>x.key));
  assert.equal(b.state.pending.length,0);
});
test('manual flight interruption returns all pending sky plans for actual host cancellation',()=>{
  const a=planSkyCreativePrefetch(createSkyPrefetchState('seed179:w0'),{
    worldToken:'seed179:w0',intentToken:'up',points:[xyz(30,114,30)],isSkyResident:()=>false});
  const cancel=cancelSkyCreativePrefetch(a.state);
  assert.deepEqual(cancel.cancelled,a.requests.map(x=>x.key));
  assert.equal(cancel.state.pending.length,0);
});
test('invalid future headroom, NaN, oversized point batches fail closed',()=>{
  const state=createSkyPrefetchState('seed179:w0');
  assert.throws(()=>planSkyCreativePrefetch(state,{worldToken:'seed179:w0',intentToken:'up',
    points:[xyz(0,NaN,0)],isSkyResident:()=>false}),/nonfinite/);
  assert.throws(()=>planSkyCreativePrefetch(state,{worldToken:'seed179:w0',intentToken:'up',
    points:Array.from({length:9},()=>xyz(0,100,0)),isSkyResident:()=>false}),/bounded/);
  assert.throws(()=>planSkyCreativePrefetch(state,{worldToken:'seed179:w0',intentToken:'up',
    points:[xyz(0,300,0)],isSkyResident:()=>false}),/ceiling/);
});
