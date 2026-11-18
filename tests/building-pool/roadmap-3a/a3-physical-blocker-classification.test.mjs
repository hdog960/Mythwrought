// Roadmap A3 read-only physical classification: no producer, geometry or save writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {auditLegacyBlacksmithSupports} from '../../../src/building-pool/roadmap-3a/legacy-physical-support-audit.mjs';
import {auditM2MetalworkPhysicalFits} from '../../../src/building-pool/roadmap-3a/m2-physical-fit-audit.mjs';
import {auditM2FourthPhysicalFit} from '../../../src/building-pool/roadmap-3a/m2-fourth-physical-aabb-audit.mjs';
import {auditM2FifthPhysicalFit} from '../../../src/building-pool/roadmap-3a/m2-fifth-physical-aabb-audit.mjs';
import {auditM3CraftSecondPhysicalFit} from '../../../src/building-pool/roadmap-3a/m3-craft-second-physical-aabb-audit.mjs';
import {auditM3CraftThirdPhysicalFit} from '../../../src/building-pool/roadmap-3a/m3-craft-third-physical-aabb-audit.mjs';
import {planUnplacedThirdRoofBearingRemediations} from '../../../src/building-pool/roadmap-3a/m2-third-roof-bearing-options.mjs';
const sha=(x)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('A3 source audit: fireplace vs chimney are independently proven 15+15 mount blockers, preserve 15 original blacksmith sources',()=>{
 const before=createLegacyBlacksmithPool().map(b=>[b.id,sha(b.modules)]);
 const legacy=auditLegacyBlacksmithSupports();
 const physical=auditM2MetalworkPhysicalFits();
 assert.equal(legacy.blueprintCount,15);
 assert.deepEqual(legacy.byFamily,{'pack4:063':15,'pack4:064':15});
 assert.equal(legacy.missingSupports,30);
 assert.equal(legacy.repairsApplied,false);
 assert.equal(legacy.legacyGeometryChanged,false);
 assert.equal(physical.legacyMountsStillMissing,30);
 assert.equal(physical.newColdSmithyFlues,15);
 assert.equal(physical.newCapSymbolsPending,15);
 assert(physical.records.filter(x=>x.hollowMasonryShaft).every(x=>x.flueVerticallyOpen===true));
 assert.equal(physical.productionPlacements,0);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,sha(b.modules)]),before);
});
test('A3 source audit: categorize 274 sampled witness gaps without treating them as engineered roof load failures',()=>{
 const cases=[
  {name:'M2 fourth',report:auditM2FourthPhysicalFit(),expected:33},
  {name:'M2 fifth',report:auditM2FifthPhysicalFit(),expected:118},
  {name:'M3 second',report:auditM3CraftSecondPhysicalFit(),expected:83},
  {name:'M3 third',report:auditM3CraftThirdPhysicalFit(),expected:40}
 ];
 assert.equal(cases.reduce((s,x)=>s+x.report.roofBearingWitnessAbsent,0),274);
 for(const {name,report:r,expected} of cases){
  assert.equal(r.roofBearingWitnessAbsent,expected,name+' witness count drift');
  assert.equal(r.sampledModels,30,name+' original roster');
  assert.equal(r.productionPlaced,0);assert.equal(r.inheritedBlueprintsModified,false);
  assert.equal(r.physicalFixtureAABBIntersections,0);
  assert.equal(r.missingAuthoredSupports,0);
  assert.equal(r.overlappingOccupiedOffsets,0);
  assert.equal(r.sampledPhysicalCorridorIntrusions,0);
  assert.equal(r.structuralCapacityCertified,false);
  assert.equal(r.roofWeatherCertified,false);
  assert.equal(r.iPhoneHardwareTested,false);
 }
});
test('A3 source audit: 156 M2 third roof beam suggestions are separate, unplaced, flue-safe review queue',()=>{
 const options=planUnplacedThirdRoofBearingRemediations();
 assert.equal(options.originalThirdVariants,30);
 assert.equal(options.sourceDerivedUnplacedCandidateCount,156);
 assert.equal(options.previousRoofSamplesWithoutBearingWitness,156);
 assert.equal(options.actualRoofSourceModifications,0);
 assert.equal(options.physicalSupportsInstalled,0);
 assert.equal(options.structuralEngineeringApproved,false);
 assert.equal(options.roofWeatherApproved,false);
 assert.equal(options.unsupportedSamplesAfterApprovedRepair,156);
 assert(options.models.flatMap(x=>x.unplacedOptions).every(x=>x.sourceGeometryEdited===false&&x.engineeringApproved===false&&x.resolution==='PENDING_CREATOR_AND_STRUCTURAL_REVIEW'));
 console.log('MYTHWROUGHT_A3_CLASSIFICATION '+JSON.stringify({legacyMounts:30,fireplaceSupports:15,chimneyFlueSupports:15,sampledRoofWitnessGaps:274,unplacedBeamOptions:156,sourceRepairsInstalled:0,productionPlacements:0}));
});
