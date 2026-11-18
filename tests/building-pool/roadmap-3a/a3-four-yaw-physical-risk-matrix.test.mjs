import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {auditA3FourYawPhysicalRisks} from '../../../src/building-pool/roadmap-3a/a3-four-yaw-physical-risk-matrix.mjs';
const hash=b=>createHash('sha256').update(JSON.stringify(b.modules)).digest('hex');
const YAW=['north','east','south','west'];
test('A3 read-only four-yaw source-and-producer physical risks inventory all 30 mounts 156 potential beams 274 roof witnesses without changing original 345 sources',{timeout:240000},()=>{
 const beforeLegacy=createLegacyBlacksmithPool().map(b=>[b.id,hash(b)]),
  beforeThird=createM2ThirdVariantPool().map(b=>[b.id,hash(b)]);
 const r=auditA3FourYawPhysicalRisks();
 assert.equal(r.sourceDesigns,345);
 assert.equal(r.originalLegacyFixtures,30);
 assert.equal(r.legacyYawWitnesses,120);
 assert.equal(r.unplacedBeamCandidates,156);
 assert.equal(r.unplacedBeamYawWitnesses,624);
 assert.equal(r.roofWitnessLocations,274);
 assert.equal(r.fireplaceChimneyYaw.length,120);
 assert.equal(r.beamYaw.length,624);
 assert.equal(r.roofWitnesses.length,274);
 assert.deepEqual(new Set(r.fireplaceChimneyYaw.map(x=>x.yaw)),new Set(YAW));
 assert.deepEqual(new Set(r.beamYaw.map(x=>x.yaw)),new Set(YAW));
 assert.ok(r.fireplaceChimneyYaw.every(x=>x.physicalShapeResolved&&x.producerCollisionAABBs>0&&
   Array.isArray(x.missingAuthoredSourceSupports)&&x.thermalCertified===false&&x.worldRepairApplied===false));
 assert.ok(r.beamYaw.every(x=>x.installed===false&&x.requiredStructuralLoadPathUnverified===true&&
   x.creatorApproved===false&&x.thermalCertified===false&&x.worldRegistered===false));
 assert.ok(r.roofWitnesses.every(x=>x.structuralCapacityVerified===false&&x.weatherCertified===false&&x.sourceModified===false));
 assert.equal(r.worldSupportsPlaced,0);
 assert.equal(r.modifiedSourceBlueprints,0);
 assert.equal(r.physicalIphoneTested,false);
 assert.equal(r.beamPhysicalExactAssemblyCertified,false);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,hash(b)]),beforeLegacy);
 assert.deepEqual(createM2ThirdVariantPool().map(b=>[b.id,hash(b)]),beforeThird);
 console.log('A3_FOUR_YAW_PRODUCER_RISKS '+JSON.stringify({
  fixtureYaw:r.legacyYawWitnesses,beamYaw:r.unplacedBeamYawWitnesses,roofWitnesses:r.roofWitnessLocations,
  fixtureSupportMissingYaw:r.legacySourceMountStillMissing,
  fixtureFlueOverlapYaw:r.legacyFlueCollisionYawCases,
  beamUnresolved:r.beamProducerUnresolved,beamFlueYaw:r.beamFlueCollisionYawCases,
  beamWalkwayYaw:r.beamWalkwayCollisionYawCases,beamGeometricCollisionYaw:r.beamSourceCollisionYawCases,
  roofProducerUnresolved:r.roofProducerUnresolved,appliedSupports:0}));
});
