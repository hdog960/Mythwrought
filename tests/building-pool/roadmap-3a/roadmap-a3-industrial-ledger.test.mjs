// Builder A Roadmap A3 — non-destructive physical issue-census evidence over protected Builder 3A.
// No original geometry, production save, producer, collision engine or workflow is changed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {planLegacyMountRepairOptions} from '../../../src/building-pool/roadmap-3a/legacy-mount-repair-options.mjs';
import {planUnplacedThirdRoofBearingRemediations} from '../../../src/building-pool/roadmap-3a/m2-third-roof-bearing-options.mjs';
import {auditM2FourthPhysicalFit} from '../../../src/building-pool/roadmap-3a/m2-fourth-physical-aabb-audit.mjs';
import {auditM2FifthPhysicalFit} from '../../../src/building-pool/roadmap-3a/m2-fifth-physical-aabb-audit.mjs';
import {auditM3CraftSecondPhysicalFit} from '../../../src/building-pool/roadmap-3a/m3-craft-second-physical-aabb-audit.mjs';
import {auditM3CraftThirdPhysicalFit} from '../../../src/building-pool/roadmap-3a/m3-craft-third-physical-aabb-audit.mjs';

const families=[['m2-metal-fourth',auditM2FourthPhysicalFit],['m2-metal-fifth',auditM2FifthPhysicalFit],['m3-craft-second',auditM3CraftSecondPhysicalFit],['m3-craft-third',auditM3CraftThirdPhysicalFit]];
test('Roadmap A3 protected 3A industrial support audit exports exact-origin proposal coordinates without applying changes',{timeout:240000},()=>{
 const mounts=planLegacyMountRepairOptions(),beams=planUnplacedThirdRoofBearingRemediations();
 assert.equal(mounts.totalSupportBlockers,30);assert.equal(mounts.masonryFaceCandidates,15);
 assert.equal(mounts.hollowFlueConflicts,15);assert.equal(mounts.appliedModifications,0);
 assert.equal(beams.sourceDerivedUnplacedCandidateCount,156);assert.equal(beams.physicalSupportsInstalled,0);
 const mountItems=mounts.options.flatMap(group=>group.proposals.map(p=>({
  blueprintId:group.blueprintId,sourcePosition:p.at,requiredSupportAt:p.requiredAt,
  family:p.forFamily,proposal:p.assetProposal,issueKind:p.kind,
  sourceCellFree:p.sourceCellFree,passageClear:p.clearPassage,
  hollowFlueWillBeSealed:p.solidUnderChimneyBlocksFlue??false,
  approvalsNeeded:p.approvalsNeeded,installed:false,engineeringAccepted:false
 })));
 const beamItems=beams.models.flatMap(group=>group.unplacedOptions.map(p=>({
  blueprintId:group.blueprintId,roofCell:p.roof,beamCandidate:p.candidateUnplacedBeam,
  proposedMaterial:p.physicalFamilyMaterialProposal,sourceCellUnoccupied:p.sourceCellUnoccupied,
  conflictsReservedAccess:p.conflictsReservedAccess,
  nearestAuthoredStructuralSource:p.nearestAuthoredStructuralSource,
  horizontalSpanToExistingStructure:p.horizontalSpanToExistingStructure,
  verifiedAttachedLoadPath:p.attachedLoadPathVerified,
  installed:false,engineeringAccepted:false
 })));
 const historical=families.map(([cohort,run])=>{
  const audit=run();return {cohort,models:audit.models.map(m=>({
   blueprintId:m.id,sourceCells:m.sourceCellCount,roofSamples:m.roofSamples,
   sampledMissingLocalBearingWitness:m.roofSampleWithoutNearbyBearingWitness,
   fixtureProducerAABBs:m.inspectedFixtures,
   corridorIntrusionSamples:m.sampledCorridorIntrusions,
   loadEngineeringCertified:false
  })),roofBearingSamples:audit.roofBearingSamples,
  missingRoofWitnessSamples:audit.roofBearingWitnessAbsent,
  fixtureAABBIntersections:audit.physicalFixtureAABBIntersections,
  missingAuthoredSupports:audit.missingAuthoredSupports,
  overlappingOccupiedOffsets:audit.overlappingOccupiedOffsets,
  sourceOnly:true};
 });
 const totals=historical.map(h=>h.missingRoofWitnessSamples);
 assert.deepEqual(totals,[33,118,83,40]);assert.equal(totals.reduce((a,b)=>a+b,0),274);
 assert.equal(mountItems.length,30);assert.equal(beamItems.length,156);
 assert.ok(mountItems.every(p=>Array.isArray(p.sourcePosition)&&Array.isArray(p.requiredSupportAt)));
 assert.ok(beamItems.every(p=>Array.isArray(p.roofCell)&&Array.isArray(p.beamCandidate)));
 const ledger={schema:'mythwrought.roadmap-a.industrial-physical-issues.v1',
  immutableProducerSourcePr:183,sourceHead:'bae0321c1089cc4a31df05634cff41790f484e92',
  sourceBlueprintsAuthored:345,sourceBlueprintsAltered:0,installations:0,
  status:'INVESTIGATION_ONLY_NOT_REPAIRED',
  mountIssues:mountItems,proposedButUnplacedRoofBeams:beamItems,
  historicallySampledRoofWitnessGaps:historical,
  totals:{fireplaceMasonryProposals:15,hollowFlueConflicts:15,historicalRoofWitnessSamplesWithoutNearbyBearing:274,additionalM2ThirdUnplacedBeamCandidates:156},
  limitations:['nearby support is not a full attached load path','source AABB is not final installed Pack mesh','hollow chimney flues must never be plugged','source family positions are not approved production fixes','creator/producer material, yaw, mounting and climate approval required']};
 const dir=join(process.cwd(),'artifacts','building-roadmap-a-industrial');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'A3_INDUSTRIAL_PHYSICAL_ISSUE_LEDGER.json'),JSON.stringify(ledger,null,2)+'\n');
 console.log('ROADMAP_A3_AUDIT '+JSON.stringify({status:ledger.status,blueprints:345,mountIssues:30,roofWitnessSamples:274,unplacedBeamOptions:156,sourceFilesChanged:false}));
});
