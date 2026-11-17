// Builder 1A isolated source-exact verifier. The base branch carries all Wave8 candidates.
// This file deliberately changes ONLY the Builder 1A-owned test directory so the
// existing GitHub Actions safety classifier invokes the real roadmap-1a focused lane.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getHospitalityWave8,HOSPITALITY_WAVE8_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
test('isolated 1A exact-source Wave8 verification must run, never be silently skipped',()=>{
 const buildings=getHospitalityWave8();
 assert.equal(buildings.length,5);
 assert.deepEqual(buildings.map(b=>b.id),HOSPITALITY_WAVE8_IDS);
 assert.equal(buildings.reduce((n,b)=>n+b.placements.length,0),87472);
 assert.ok(buildings.every(validateBlueprint));
});
