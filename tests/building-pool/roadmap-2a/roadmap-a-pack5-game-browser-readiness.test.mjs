import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalPack5ReadOnlyBrowserPlan,
 auditOriginalGameReadOnlyBrowserSourceContracts,
 auditOriginalPack5BrowserPhysicalMeshBudget,
 requireOriginalPack5ReadonlyBrowserPilot}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness-core.mjs';

const source=auditOriginalGameReadOnlyBrowserSourceContracts();
const plan=originalPack5ReadOnlyBrowserPlan();
const upload=auditOriginalPack5BrowserPhysicalMeshBudget();
const simulatedValidBrowserEvidence=()=>({
 schema:'mythwrought.roadmap-a.pack5-original-game-readonly-browser-result.v1',
 viewport:[844,390],originalGameWebGL2:true,originalGameRenderedFrames:4,
 originalGameShaderReady:true,originalMainLocalhostOnlyDebugAvailable:true,
 originalWorldSnapshotSeedIsInteger:true,
 camera:{yaw:Math.PI,pitch:0,x:0.5,z:0.5,feet:20,
  unitForwardIsFinite:true,unitForwardLength:1},
 originalSourceRayProbeCount:72,originalFixtureRayHitCount:40,
 originalSourceTriangleRayHitCount:43,originalSourceSelectionTriangleDisagreements:3,
 noGameInteractionsPerformed:true,noOriginalGameWorldOrPack5Edits:true,
 originalPack5SidecarKeysBefore:0,originalPack5SidecarKeysAfter:0,
 originalPack5LiveInstancesBefore:0,originalPack5LiveInstancesAfter:0,
 originalGameGpuPixelProbeWasForPack5Fixture:false,
 contextIsNewPrivateEphemeral:true,originalMainGameCodeUnchanged:true,
 realIphoneSafari:false,authorizedLiveGameIntegration:false,
 creatorPhysicalApproval:false,pageErrors:[],consoleErrors:[]
});

test('unchanged original main and published game WebGL2 browser hooks are source-authenticated',()=>{
 assert.equal(source.originalMainCameraAndEditGuardsVerified,12);
 assert.equal(source.originalExistingGameBrowserAcceptanceRead,true);
 assert.equal(source.originalGameEngineOrBrowserExecuted,false);
 assert.equal(source.sourceOnly,true);
});
test('one-viewport browser pilot tests 4 explicit authored source alternatives and 72 ephemeral rays only',()=>{
 assert.deepEqual(plan.requiredViewport,[844,390]);
 assert.equal(plan.deviceScaleFactor,1);
 assert.equal(plan.originalSourceAlternatives.length,4);
 assert.deepEqual(plan.originalSourceAlternatives.map(x=>x.variant),
  ['hearth-running-bond','hearth-running-bond',
   'kiln-soldier-course','kiln-soldier-course']);
 assert.deepEqual(plan.originalSourceAlternatives.map(x=>x.explicitPreviewOnlyYaw),[2,3,2,3]);
 assert.equal(plan.requiredSourceRayProbes,72);
 assert.equal(plan.privateEphemeralBrowserContext,true);
 assert.equal(plan.noPageInteractionsAndNoMenuToggles,true);
 assert.equal(plan.executedBrowser,false);
 assert.equal(plan.actualPack5FixtureRenderedInGame,false);
});
test('authentic original Pack5 brick triangle shader upload uses actual physical source and fits mobile page cap',()=>{
 assert.equal(upload.originalSourcePreviewAlternatives,4);
 assert.equal(upload.sourceProducerRows.length,4);
 assert.equal(upload.originalPageByteBudget,384*1024);
 assert.equal(upload.originalResidentByteBudget,2*1024*1024);
 assert.equal(upload.originalMaxPages,8);
 for(const row of upload.sourceProducerRows){
  assert.equal(row.physicalColliderBoxes,1);
  assert.ok(row.visibleAndSelectionBoxes>32);
  assert.ok(row.originalAuthoredTriangles>12);
  assert.ok(row.originalTerrainShaderStagedBytes>0);
  assert.ok(row.originalTerrainShaderStagedBytes<=upload.originalPageByteBudget);
  assert.equal(row.fitsOriginalOnePageBudget,true);
  assert.equal(row.inGameRendererPixelsMeasured,false);
 }
 assert.equal(upload.actualGPUUploadExecuted,false);
});
test('strict result validator accepts synthetic shape only as READ-ONLY readiness, never as actual Pack5 visual proof',()=>{
 const outcome=requireOriginalPack5ReadonlyBrowserPilot(simulatedValidBrowserEvidence());
 assert.equal(outcome.originalMainGameWebGL2BootWitness,true);
 assert.equal(outcome.originalNativeSourcePreviewRayCount,72);
 assert.equal(outcome.originalSourcePreviewBoundaryWarnings,3);
 assert.equal(outcome.actualRenderedPack5PlacementNotExamined,true);
 assert.equal(outcome.actualIphoneSafariNotExamined,true);
 assert.equal(outcome.realA5WorldPlacementNotApproved,true);
 assert.equal(outcome.productionReleaseApproved,false);
});
test('fake original main WebGL2 readiness, wrong viewport, short ray census and impossible camera fail closed',()=>{
 const x=simulatedValidBrowserEvidence();
 for(const bad of [
  {...x,originalGameWebGL2:false},
  {...x,originalGameRenderedFrames:2},
  {...x,originalGameShaderReady:false},
  {...x,originalMainLocalhostOnlyDebugAvailable:false},
  {...x,originalWorldSnapshotSeedIsInteger:false},
  {...x,viewport:[932,430]},
  {...x,originalSourceRayProbeCount:71},
  {...x,originalFixtureRayHitCount:73},
  {...x,originalSourceSelectionTriangleDisagreements:73},
  {...x,camera:{...x.camera,yaw:NaN}},
  {...x,camera:{...x.camera,unitForwardLength:.8}},
  {...x,schema:'fake'}
 ])assert.throws(()=>requireOriginalPack5ReadonlyBrowserPilot(bad),/browser gate/);
});
test('browser gate forbids real game input, world writes, Pack5 sidecars, in-game fixtures and fake approvals',()=>{
 const x=simulatedValidBrowserEvidence();
 for(const bad of [
  {...x,noGameInteractionsPerformed:false},
  {...x,noOriginalGameWorldOrPack5Edits:false},
  {...x,originalPack5SidecarKeysBefore:1},
  {...x,originalPack5SidecarKeysAfter:1},
  {...x,originalPack5LiveInstancesBefore:1},
  {...x,originalPack5LiveInstancesAfter:1},
  {...x,contextIsNewPrivateEphemeral:false},
  {...x,originalMainGameCodeUnchanged:false},
  {...x,originalGameGpuPixelProbeWasForPack5Fixture:true},
  {...x,realIphoneSafari:true},
  {...x,authorizedLiveGameIntegration:true},
  {...x,creatorPhysicalApproval:true}
 ])assert.throws(()=>requireOriginalPack5ReadonlyBrowserPilot(bad),/browser gate/);
});
test('original game errors and lost page errors invalidate even an otherwise intact pilot',()=>{
 const x=simulatedValidBrowserEvidence();
 assert.throws(()=>requireOriginalPack5ReadonlyBrowserPilot({...x,pageErrors:['boom']}),/browser gate/);
 assert.throws(()=>requireOriginalPack5ReadonlyBrowserPilot({...x,consoleErrors:['WebGL error']}),/browser gate/);
});
test('manual browser harness has no game debug mutator/UI toggle, never runs through standard native CI',()=>{
 const runner=readFileSync(new URL('./roadmap-a-pack5-game-readonly-browser.mjs',import.meta.url),'utf8');
 assert.ok(runner.includes("serviceWorkers:'block'"));
 assert.ok(runner.includes("newContext({viewport:{width:844,height:390}"));
 assert.ok(runner.includes("await page.waitForFunction("));
 assert.ok(runner.includes("requireOriginalPack5ReadonlyBrowserPilot(complete)"));
 assert.ok(runner.includes("originalGameGpuPixelProbeWasForPack5Fixture:false"));
 assert.ok(runner.includes("originalPack5SidecarKeysAfter"));
 for(const forbidden of [
  'window.__mythwroughtTest.placeFixture(',
  'window.__mythwroughtTest.placePack5TestFixture(',
  'window.__mythwroughtTest.setOrientation(',
  'window.__mythwroughtTest.placePack5DenseTestFixture(',
  "page.locator('#pack5Enabled').check(",
  "page.locator('#menu').click(",
  'localStorage.setItem(',
  'world.set(',
  'pack5Builder.save('
 ])assert.ok(!runner.includes(forbidden),'forbidden gameplay/browser mutation API '+forbidden);
});
