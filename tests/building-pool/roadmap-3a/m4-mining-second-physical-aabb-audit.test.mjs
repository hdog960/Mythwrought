import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditM4MiningSecondPhysicalFit} from '../../../src/building-pool/roadmap-3a/m4-mining-second-physical-aabb-audit.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';

test('all 15 M4 second-variant five-zone carpentry workshops use real Pack AABBs and typed support, reservation, crossing/collision diagnostics',()=>{
 const before=createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]);
 const r=auditM4MiningSecondPhysicalFit();
 assert.equal(r.sampledModels,15);
 assert.equal(r.oldLegacyMountBlockersStillOpen,30);
 assert.equal(r.inheritedBlueprintsModified,false);
 assert.equal(r.productionPlaced,0);
 assert.ok(r.producerShapeFamiliesUsed>=2,'two deliberately sourced mining fixture families are required');
 assert.equal(r.physicalFixtureAABBIntersections,0,'producer collision AABB overlap is not allowed');
 assert.equal(r.missingAuthoredSupports,0,'required family support lacks actual authored voxel');
 assert.equal(r.overlappingOccupiedOffsets,0,'multi-cell physical-family reservation collides');
 assert.equal(r.sampledPhysicalCorridorIntrusions,0,'partial family shape obstructs nominal clear corridor');
 assert.ok(r.roofBearingSamples>3500);
 assert.equal(r.roofBearingWitnessAbsent,0,'new original second-variant mining roofs must have actual bearing witnesses');
 assert.equal(r.structuralCapacityCertified,false);
 assert.equal(r.roofWeatherCertified,false);
 assert.equal(r.fullBlockWorldMeshRendered,false);
 assert.equal(r.iPhoneHardwareTested,false);
 assert.equal(r.models.length,15);
 for(const m of r.models){
  assert.equal(m.notProductionApproved,true);
  assert.equal(m.physicalRoofLoadAccepted,false);
  assert.ok(m.roofSamples>10);
  assert.equal(m.sampledCorridorIntrusions.length,0);
  assert.equal(m.fixtureCount,2);
  for(const f of m.inspectedFixtures){
   assert.ok(Number.isInteger(f.physicalNumericId));
   assert.equal(f.orientation,'north');
   assert.equal(f.livePlaceable,false);
   assert.equal(f.collisionAABBIntersections,0);
   assert.deepEqual(f.missingSourceSupports,[]);
   assert.deepEqual(f.blockedMultiCellReservations,[]);
  }
 }
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
 const out=join(process.cwd(),'artifacts/building-roadmap-3a-m3-second');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'M4_CARPENTER_FIFTH_PHYSICAL_AABB_REPORT.json'),JSON.stringify(r,null,2)+'\n');
 console.log('Builder 3A M4 second craft producer physical AABB report: '+r.sampledModels+
  ' source buildings, roof samples '+r.roofBearingSamples+
  ', lacking source bearing witnesses '+r.roofBearingWitnessAbsent+
  ', true fixture collisions '+r.physicalFixtureAABBIntersections+
  ', prior legacy support blockers '+r.oldLegacyMountBlockersStillOpen);
});
