import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStatusPanel} from '../src/resonance/devices48/status-panel-v1.mjs';
const sample=()=>({seed:5,tick:9,produced:12,stored:4,devices:[{id:'gate',requested:8,supplied:0},{id:'lamp',requested:4,supplied:4}]});
test('deterministic ordered candidate-only panel',()=>{const a=buildStatusPanel(sample());assert.deepEqual(a,buildStatusPanel({...sample(),devices:sample().devices.reverse()}));assert.equal(a.authoritative,false);assert.equal(a.deficitCandidate,8);assert.equal(a.devices[0].state,'candidate-stopped');assert.ok(Object.isFrozen(a.devices));});
test('rejects duplicate identities',()=>{const s=sample();s.devices.push({...s.devices[0]});assert.throws(()=>buildStatusPanel(s));});
test('rejects overgrant and bad aggregates',()=>{const s=sample();s.devices[0].supplied=9;assert.throws(()=>buildStatusPanel(s));assert.throws(()=>buildStatusPanel({...sample(),produced:257}));});
test('never represents partial grant as powered',()=>{const s=sample();s.devices[0].supplied=2;assert.equal(buildStatusPanel(s).devices[0].state,'candidate-deficit');});