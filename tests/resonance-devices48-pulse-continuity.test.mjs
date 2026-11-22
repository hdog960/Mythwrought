import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPulseContinuity as audit} from '../src/resonance/devices48/pulse-continuity-v1.mjs';
const event=(tick,status='observed-partial')=>{
 const requested=status==='idle'?0:5,observed=status==='observed-satisfied'?5:status==='observed-partial'?2:0;
 return {schema:'resonance48-pulse-descriptor-v1',worldId:'w',simulationTick:tick,status,kind:'status-change',
 palette:{idle:'none','observed-satisfied':'rune-blue','observed-partial':'rune-gold','observed-unpowered':'rune-dim'}[status],
 intensity:{idle:0,'observed-satisfied':2,'observed-partial':1,'observed-unpowered':0}[status],
 requested,observed,deficit:requested-observed,advisoryOnly:true,
 authoritativeDelivery:false,energized:false,movementAuthorized:false,productionBound:false};
};
test('one event is immutable advisory',()=>{const x=audit([event(1)]);assert.ok(Object.isFrozen(x));assert.ok(Object.isFrozen(x.transitions));assert.equal(x.energized,false);});
test('transition and steady tick',()=>{const x=audit([event(1),{...event(2),kind:'steady'},event(3,'observed-satisfied')]);assert.equal(x.transitions.length,2);});
test('deterministic replay',()=>assert.deepEqual(audit([event(1)]),audit([event(1)])));
test('reject empty or oversized batches',()=>{assert.throws(()=>audit([]));assert.throws(()=>audit(Array.from({length:17},(_,i)=>({...event(i),kind:i?'steady':'status-change'}))));});
test('reject missing ticks and world changes',()=>{assert.throws(()=>audit([event(1),event(3)]));assert.throws(()=>audit([event(1),{...event(2),worldId:'z'}]));});
test('reject forged power or movement authority',()=>{for(const key of ['energized','movementAuthorized','authoritativeDelivery','productionBound'])assert.throws(()=>audit([{...event(1),[key]:true}]));});
test('reject incorrect energy totals and status',()=>{assert.throws(()=>audit([{...event(1),deficit:0}]));assert.throws(()=>audit([{...event(1),status:'idle'}]));});
test('reject wrong color, intensity, or transition',()=>{assert.throws(()=>audit([{...event(1),palette:'rune-blue'}]));assert.throws(()=>audit([{...event(1),intensity:2}]));assert.throws(()=>audit([{...event(1),kind:'steady'}]));});
