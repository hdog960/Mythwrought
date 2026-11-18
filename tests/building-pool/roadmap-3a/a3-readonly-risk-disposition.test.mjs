import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {classifyA3UnresolvedPhysicalRisks} from '../../../src/building-pool/roadmap-3a/a3-readonly-risk-disposition.mjs';
const sha=x=>createHash('sha256').update(JSON.stringify(x.modules)).digest('hex');
test('A3 physical dispositions preserve all original fingerprints and explicitly reject any installation, roof/load or flue certification',()=> {
 const historical=createLegacyBlacksmithPool().map(x=>[x.id,sha(x)]);
 const originalThird=createM2ThirdVariantPool().map(x=>[x.id,sha(x)]);
 const a=classifyA3UnresolvedPhysicalRisks(),s=a.summary;
 assert.equal(a.rootSourceDesigns,345);assert.equal(s.legacyMounts,30);
 assert.equal(s.fireplaceMounts,15);assert.equal(s.chimneyMounts,15);
 assert.equal(s.mountYawMissingSourceSupport,118);
 assert.equal(s.mountYawIntersectsReservedFlue,60);
 assert.equal(s.unplacedBeamProposals,156);
 assert.equal(s.beamsWithoutVerifiedBearing,156);
 assert.equal(s.beamYawProducerResolution,624);
 assert.equal(s.sampledRoofBearingWitnessGaps,274);
 assert.deepEqual(s.roofSamplesByCohort.map(x=>[x.cohort,x.count]),[
  ['m2-fourth',33],['m2-fifth',118],['m3-second',83],['m3-third',40]]);
 assert.equal(s.physicalRepairsPlaced,0);assert.equal(s.modifiedSourceBlueprints,0);
 assert.equal(new Set(a.mounts.map(x=>x.id)).size,30);
 assert.equal(new Set(a.unplacedBeams.map(x=>x.id)).size,156);
 assert.equal(new Set(a.roofWitnesses.map(x=>x.id+'|'+x.cohort+'|'+x.at.join(','))).size,274);
 assert.ok(a.mounts.every(x=>x.yawCoverage===4&&x.physicalInstallationAllowed===false&&
  x.requiresCreatorApproval&&x.manualPackPhysicalJoineryCertified===false));
 assert.ok(a.unplacedBeams.every(x=>x.engineeringLoadPathProven===false&&
  x.physicalPlacementAllowed===false&&x.physicalSupportsInstalled===0&&x.requiresRoofEngineeringApproval));
 assert.ok(a.roofWitnesses.every(x=>x.physicalStructuralFaultProven===false&&
  x.retrospectiveRoofApproval===false&&x.physicalRepairPermitted===false));
 assert.equal(a.endToEndInstalledFamilyAssemblyCertified,false);
 assert.equal(a.realIphoneTested,false);assert.equal(a.gameplayRegistered,false);
 assert.equal(a.allPhysicalRepairsForbiddenWithoutSeparateApproval,true);
 assert.deepEqual(createLegacyBlacksmithPool().map(x=>[x.id,sha(x)]),historical);
 assert.deepEqual(createM2ThirdVariantPool().map(x=>[x.id,sha(x)]),originalThird);
 console.log('A3_READONLY_RISK_DISPOSITION '+JSON.stringify(s));
});
