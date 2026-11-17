// Builder 1A Wave9: CI-only focused test on exact unmerged 1A canonical source.
// One exclusively Builder1A-owned changed path causes existing fail-closed CI to run 1A focused gate.
import test from 'node:test';import assert from 'node:assert/strict';
import {getHospitalityWave9,HOSPITALITY_WAVE9_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
test('Wave9 independent focused CI witnesses five original source designs, real geometry and proper IDs',()=>{
 const all=getHospitalityWave9();
 assert.equal(all.length,5);assert.deepEqual(all.map(b=>b.id),HOSPITALITY_WAVE9_IDS);
 assert.equal(all.reduce((s,b)=>s+b.placements.length,0),89104);
 assert.equal(all.reduce((s,b)=>s+b.rooms.length,0),34);
 assert.ok(all.every(validateBlueprint));
});
