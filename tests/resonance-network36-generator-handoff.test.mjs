import test from 'node:test';
import assert from 'node:assert/strict';
import {acceptGeneratorAvailability} from '../src/resonance/network36/generator-handoff.mjs';
const g=(id,availablePerTick,capacityPerTick=availablePerTick)=>({id,tick:12,availablePerTick,capacityPerTick});
test('stable merged generator availability without mutations',()=>{const input=[g('z',3,4),g('a',2,5)];const x=acceptGeneratorAvailability(input,{tick:12});assert.equal(x.availablePerTick,5);assert.deepEqual(x.generators.map(g=>g.id),['a','z']);assert.equal(x.authoritative,false);assert.equal(input[0].id,'z');assert.ok(Object.isFrozen(x.generators));});
test('reject stale tick, duplicate, excess and fractional output',()=>{for(const xs of [[{...g('a',1),tick:11}],[g('a',1),g('a',2)],[g('a',3,2)],[g('a',.5,1)]])assert.throws(()=>acceptGeneratorAvailability(xs,{tick:12}));});
test('reject getters without execution',()=>{let called=0;const x=g('a',2);Object.defineProperty(x,'id',{get(){called++;return 'a'}});assert.throws(()=>acceptGeneratorAvailability([x],{tick:12}));assert.equal(called,0);});
test('reject unsafe aggregate overflow',()=>assert.throws(()=>acceptGeneratorAvailability([g('a',Number.MAX_SAFE_INTEGER),g('b',1)],{tick:12})));
