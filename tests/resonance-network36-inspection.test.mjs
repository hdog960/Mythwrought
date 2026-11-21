import test from 'node:test';import assert from 'node:assert/strict';
import {inspectResonanceRouting as inspect} from '../src/resonance/network36/inspection.mjs';
const routing={production:5,consumption:2,unusedProduction:3,active:['z'],stopped:['a']};
test('inspection gives deterministic read-only shortage and optical descriptor',()=>{const before=structuredClone(routing);const r=inspect({routing,stored:3,storageCapacity:8,networkId:'n'});assert.equal(r.status,'shortage');assert.equal(r.use,2);assert.equal(r.pulses[0].kind,'resonance-flow');assert.deepEqual(routing,before)});
test('idle and running summaries',()=>{assert.equal(inspect({routing:{production:0,consumption:0,unusedProduction:0,active:[],stopped:[]}}).status,'idle');assert.equal(inspect({routing:{production:1,consumption:1,unusedProduction:0,active:['x'],stopped:[]}}).status,'running')});
test('rejects fabricated energy, bad storage and duplicate ids',()=>{assert.throws(()=>inspect({routing:{...routing,unusedProduction:4}}));assert.throws(()=>inspect({routing,stored:9,storageCapacity:8}));assert.throws(()=>inspect({routing:{...routing,stopped:['z']}}))});
