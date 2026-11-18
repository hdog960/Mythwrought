import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {orderA3SourceSpecificPhysicalReviews} from '../../../src/building-pool/roadmap-3a/a3-per-building-review-order.mjs';
const sig=b=>createHash('sha256').update(JSON.stringify(b.modules)).digest('hex');

test('A3 each exact source building is explicitly review-only, with all fixture, flue, beam and roof witness positions preserved',()=>{
 const old=createLegacyBlacksmithPool().map(b=>[b.id,sig(b)]);
 const third=createM2ThirdVariantPool().map(b=>[b.id,sig(b)]);
 const r=orderA3SourceSpecificPhysicalReviews(),n=r.issueCounts;
 assert.equal(r.original3ASourceDesignsProtected,345);
 assert.deepEqual(n,{legacyMounts:30,fireplace:15,chimney:15,missingMountYaws:118,
  flueIntersectionYaws:60,unplacedRoofBeams:156,sampledRoofWitnesses:274});
 assert.ok(r.reviewSiteCount>0);
 assert.equal(new Set(r.sites.map(s=>s.sourceBlueprintId)).size,r.reviewSiteCount);
 assert.equal(Object.values(r.priorityCounts).reduce((a,b)=>a+b,0),r.reviewSiteCount);
 assert.equal(r.installedPhysicalRepairs,0);assert.equal(r.sourceGeometryChanges,0);
 assert.equal(r.finalInstalledProducerAssemblyCertified,false);
 assert.equal(r.explicitlyAuthorizedByCreator,false);assert.equal(r.reviewOrderOnly,true);
 assert.equal(r.realIphoneTested,false);
 let mounts=0,beams=0,roof=0,missingYaw=0,flueYaw=0;
 for(const x of r.sites){
  assert(x.sourceBlueprintId.length>0&&x.priority.startsWith('P'));
  assert.equal(x.placementAuthorized,false);
  assert.equal(x.structuralEngineeringApproved,false);
  assert.equal(x.flueClearanceApproved,false);assert.equal(x.saveWrites,0);
  assert.equal(x.originalSourceEdits,0);assert.equal(x.physicalWorldMeshVerified,false);
  mounts+=x.mounts.length;beams+=x.beamOptions.length;roof+=x.roofWitnesses.length;
  missingYaw+=x.missingSupportYawCount;flueYaw+=x.flueOverlapYawCount;
  assert(x.mounts.every(m=>m.mountingCertified===false&&m.thermalCertified===false));
  assert(x.beamOptions.every(b=>b.installed===false&&b.immediateBearingVerified===false&&b.continuousLoadPathVerified===false));
  assert(x.roofWitnesses.every(w=>w.sampledWitnessMissing===true&&w.provedStructuralFault===false));
 }
 assert.deepEqual([mounts,beams,roof,missingYaw,flueYaw],[30,156,274,118,60]);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,sig(b)]),old);
 assert.deepEqual(createM2ThirdVariantPool().map(b=>[b.id,sig(b)]),third);
 console.log('A3_PER_BUILDING_REVIEW '+JSON.stringify({sourceBuildings:r.reviewSiteCount,priorities:r.priorityCounts,
  originalCount:345,missingSupportYaw:missingYaw,reservedFlueYaw:flueYaw,unplacedBeamOptions:beams,
  roofWitnessGaps:roof,repairsInstalled:0}));
});