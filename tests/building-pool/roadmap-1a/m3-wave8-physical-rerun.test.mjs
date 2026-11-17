// Builder 1A Wave8 source-exact focused verification, repair run #2.
// Compare only Builder 1A-owned code against canonical PR #180 HEAD, no shared CI edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getHospitalityWave8,HOSPITALITY_WAVE8_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
test('focused Wave8 repair exact-source invariants: real unused IDs and 86269 source voxels',()=>{
 const b=getHospitalityWave8();
 assert.equal(b.length,5);
 assert.deepEqual(b.map(x=>x.id),HOSPITALITY_WAVE8_IDS);
 assert.equal(b.reduce((n,x)=>n+x.placements.length,0),86269);
 assert.deepEqual([b[0].id,b[2].id],['r1:tavern:snow:large:001','r1:tavern:enchanted-forest:medium:001']);
 assert.equal(b[4].architecturalIdentity.exteriorNotches.length,3);
 assert.ok(b.every(validateBlueprint));
});
