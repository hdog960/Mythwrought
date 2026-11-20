import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {readOnlyRoadmapA3RoofWitnessLedger} from '../../../src/building-pool/roadmap-3a/roadmap-a3-roof-witness-ledger.mjs';
test('Roadmap A3 exact 274 sampled roof-witness coordinates, without changing source construction',{timeout:240000},()=>{
 const ledger=readOnlyRoadmapA3RoofWitnessLedger();
 assert.equal(ledger.totalExactLocatedWarnings,274);
 assert.deepEqual(ledger.cohorts.map(c=>c.exactlyLocatedWarnings),[33,118,83,40]);
 assert.equal(ledger.beamProposalsSeparatelyCounted,156);
 let positions=0;
 for(const cohort of ledger.cohorts){assert.equal(cohort.sourceGeometryAltered,false);for(const model of cohort.buildings){
   for(const w of model.witnesses){assert.equal(w.blueprintId,model.blueprintId);assert.equal(w.roofPosition.length,3);assert.ok(w.roofPosition.every(Number.isInteger));assert.equal(w.nearbyBearingRoleWitness,false);assert.equal(w.correctiveSourceGeometryPlaced,false);assert.equal(w.roofLoadCertified,false);positions++;}
 }}
 assert.equal(positions,274);
 const dest=join(process.cwd(),'artifacts','building-roadmap-a-industrial');mkdirSync(dest,{recursive:true});
 writeFileSync(join(dest,'A3_ROOF_WITNESS_EXACT_COORDINATES.json'),JSON.stringify(ledger,null,2)+'\n');
 console.log('ROADMAP_A3_ALL_274_EXACT_ROOF_WARNING_COORDINATES '+JSON.stringify({count:positions,cohorts:ledger.cohorts.map(c=>c.exactlyLocatedWarnings),sourceModified:ledger.roofGeometryModified}));
});
