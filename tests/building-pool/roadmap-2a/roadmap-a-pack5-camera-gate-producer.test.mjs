import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectOriginalMainCameraPack5GuardSource,auditOriginalPack5CameraAndEditingPrecedence}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-camera-gate-producer.mjs';
const once=auditOriginalPack5CameraAndEditingPrecedence();
const sum=(k,predicate=()=>true)=>once.originalCases.filter(predicate).reduce((s,row)=>s+row[k],0);

test('actual unchanged main camera and normal Pack5 edit guard are source-authenticated without DOM execution',()=>{
 const r=inspectOriginalMainCameraPack5GuardSource();
 assert.equal(r.originalMainSourceCameraExpressionsRead,true);
 assert.equal(r.originalMainModeAndOcclusionGuardsRead,true);
 assert.equal(r.originalMainCodeImportedOrExecuted,false);
 assert.equal(r.verifiedExpressions,10);
 assert.equal(r.editGuardDistanceBiasBlockUnits,0.000001);
});
test('original camera+targeting 432 near-edge cases across both source variants and two yaws',()=>{
 assert.equal(once.totalSourceCameraRayProbes,432);
 assert.equal(once.originalPlayerCameraDirectionCalculations,432);
 assert.equal(once.temporaryOnlyPack5BuilderLayers,24);
 assert.equal(once.originalCases.length,24);
 assert.ok(once.originalCases.every(x=>x.probes===18));
 assert.equal(once.densityBreakdown['1'].originalCameraProbes,216);
 assert.equal(once.densityBreakdown['65'].originalCameraProbes,216);
 assert.deepEqual([...new Set(once.originalCases.map(x=>x.testOnlyVariant))].sort(),
  ['hearth-running-bond','kiln-soldier-course']);
 assert.deepEqual([...new Set(once.originalCases.map(x=>x.testOnlyYaw))].sort(),[2,3]);
 assert.equal(once.originalWorldIsReadonlyFake,true);
});
test('actual original Pack5 direct <=64 and dense >64 targeting agree for matching source camera rays',()=>{
 assert.equal(once.originalDirectVersusDenseSelectionDisagreements,0,
  'original Pack5 spatial targeting disagrees with reference raycaster at physical source edge');
 assert.equal(sum('layerSelectionHits',x=>x.testOnlyDensity===1),
  sum('layerSelectionHits',x=>x.testOnlyDensity===65));
 assert.equal(sum('adapterSelectionHits',x=>x.testOnlyDensity===1),
  sum('adapterSelectionHits',x=>x.testOnlyDensity===65));
 assert.equal(sum('normalMainModeGuardIntercepts',x=>x.testOnlyDensity===1),
  sum('normalMainModeGuardIntercepts',x=>x.testOnlyDensity===65));
});
test('front terrain occlusion cannot trigger the main normal-mode shaped edit intercept',()=>{
 const rows=once.originalCases.filter(x=>x.testOnlyLegacyBlocker==='front-legacy');
 assert.equal(rows.length,8);
 assert.ok(rows.every(x=>x.legacyHits===18));
 assert.ok(rows.every(x=>x.adapterSelectionHits===0));
 assert.ok(rows.every(x=>x.normalMainModeGuardIntercepts===0));
});
test('unobstructed source camera aim reports physical selection only when original Pack5 ray actually hits',()=>{
 const rows=once.originalCases.filter(x=>x.testOnlyLegacyBlocker==='none');
 assert.equal(rows.length,8);
 assert.equal(sum('legacyHits',x=>x.testOnlyLegacyBlocker==='none'),0);
 assert.equal(sum('adapterSelectionHits',x=>x.testOnlyLegacyBlocker==='none'),
  sum('layerSelectionHits',x=>x.testOnlyLegacyBlocker==='none'));
 assert.equal(sum('normalMainModeGuardIntercepts',x=>x.testOnlyLegacyBlocker==='none'),
  sum('layerSelectionHits',x=>x.testOnlyLegacyBlocker==='none'));
});
test('rear legacy terrain target yields Pack5 normal-mode precedence only for nearer source geometry',()=>{
 const rows=once.originalCases.filter(x=>x.testOnlyLegacyBlocker==='rear-legacy');
 assert.equal(rows.length,8);
 assert.ok(rows.some(x=>x.legacyHits>0));
 assert.ok(rows.every(x=>x.legacyHits>=0&&x.legacyHits<=18));
 // Actual yaw can travel outside the rear blocking voxel at x boundaries.
 assert.ok(rows.every(x=>x.normalMainModeGuardIntercepts===x.adapterSelectionHits));
 assert.ok(rows.every(x=>x.adapterSelectionHits<=x.layerSelectionHits));
});
test('no original world, A5, schema1 PWA, player physics, camera UI or gameplay callback modified',()=>{
 assert.equal(once.originalMainGameLoopNotExecuted,true);
 assert.equal(once.actualMainRuntimeCameraOrTouchUsed,false);
 assert.equal(once.realPlayerMovementOrTouchNotExecuted,true);
 assert.equal(once.realPack5GameGpuNotUsed,true);
 assert.equal(once.originalA5BlueprintsModified,false);
 assert.equal(once.actualSaveOrWorldModified,false);
 assert.equal(once.pack5SourceVariantsOrYawAssignedToA5,false);
 assert.equal(once.structuralLoadsCertified,false);
 assert.equal(once.creatorAccepted,false);
 assert.equal(once.releaseBlocked,true);
 assert.equal(once.originalAdapterVersusMainGuardWarnings,0,
  'main normal-mode guard and adapter-source occlusion differ for sampled camera rays');
});
