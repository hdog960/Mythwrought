import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProducerEvidence} from '../../src/auto-integration-support/producer-evidence.mjs';
const base=()=>({producers:Object.fromEntries([':24',':36',':48'].map(l=>[l,{head:'a'.repeat(40),sourcePath:'src/auto-'+l.slice(1)+'/index.mjs',fixtureKind:'producer-export',exportName:'createFixture'}])),fixtures:[{seed:42,name:'entrance-and-objects',lanes:[':24',':36',':48']}]});
test('complete provenance is structurally valid but does not claim execution',()=>{const r=validateProducerEvidence(base());assert.equal(r.ok,true);assert.match(r.status,/NOT-VERIFIED/)});
test('rejects static mock presented as source evidence',()=>{const m=base();m.producers[':36'].fixtureKind='static-mock';assert.deepEqual(validateProducerEvidence(m).failures,[':36:not-source-driven'])});
test('rejects missing producer and unsafe source paths',()=>{const m=base();delete m.producers[':48'];m.producers[':24'].sourcePath='../src/evil';assert.equal(validateProducerEvidence(m).ok,false)});
test('rejects duplicate and incomplete cross-lane fixtures',()=>{const m=base();m.fixtures.push({...m.fixtures[0]});m.fixtures[0].lanes=[':24'];assert.equal(validateProducerEvidence(m).ok,false)});
