import test from 'node:test';
import assert from 'node:assert/strict';
import {LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {measureDirectionService,measureFifoService} from './fairness-diagnostic.mjs';

test('bounded FIFO serves every isolated cell and survives exact queue restore',()=>{
  assert.deepEqual(measureFifoService({count:1024,rounds:3}),{count:1024,rounds:3,totalVisits:3072,minimumVisits:3,maximumVisits:3,maxVisitGap:1024,restoredMidRun:true});
});
test('direction probe conserves replenished volume and measures all five identities',()=>{
  for(const id of LIQUID_IDS){
    const r=measureDirectionService({id,cycles:64});
    assert.equal(r.units.reduce((a,b)=>a+b,0),64*(id==='water'?4:1));
    assert.equal(r.units.length,4);assert.equal(r.unserved,r.first.filter(x=>x===null).length);
    assert.deepEqual(measureDirectionService({id,cycles:64}),r);
  }
});
test('diagnostics reject unbounded or invalid workload',()=>{
  assert.throws(()=>measureFifoService({count:8193}),RangeError);
  assert.throws(()=>measureDirectionService({cycles:4097}),RangeError);
  assert.throws(()=>measureDirectionService({id:'tar'}),RangeError);
});
