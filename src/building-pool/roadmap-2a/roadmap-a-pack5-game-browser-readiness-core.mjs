/**
 * Roadmap A Pack5 — fail-closed, source-authentic, READ-ONLY original-game
 * browser pilot acceptance. A plan/validator, NOT a gameplay alteration.
 * No launched browser in the native test, and no Pack5 A5 world placement.
 */
import {readFileSync} from 'node:fs';
import {resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {pack5TerrainVertices,PACK5_GPU_PAGE_BYTES,
 PACK5_GPU_RESIDENT_BYTES,PACK5_GPU_MAX_PAGES} from '../../pack5-integration/terrain-buffer.mjs';
const must=(ok,why)=>{if(!ok)throw Error('Roadmap A read-only Pack5 browser gate: '+why);};
const checkedInt=x=>Number.isSafeInteger(x)&&x>=0;
const originalVariants=['hearth-running-bond','kiln-soldier-course'];
const yaws=[2,3];
const edges=[.01999995,.02,.02000005,.97999995,.98,.98000005];
const touch=[-1,0,1];
const exactMainExpressions=[
 "const eye=()=>[player.x,player.feet+1.55,player.z];",
 "const facing=()=>forwardVector(player.yaw,player.pitch);",
 "canvas.dataset.cameraYaw=String(player.yaw);",
 "canvas.dataset.cameraPitch=String(player.pitch);",
 "canvas.dataset.playerX=String(player.x);",
 "canvas.dataset.playerFeet=String(player.feet);",
 "if(['localhost','127.0.0.1'].includes(location.hostname)){",
 "window.__mythwroughtTest=Object.freeze({",
 "if(pack5Mode&&pack5Builder){",
 "const target=inspectBlockTarget(world,eye(),facing(),selected,player);",
 "const shape=pack5Builder.layer.raycast(eye(),facing(),6);",
 "if(shape&&(!target.hit||shape.distance<target.distance-1e-6)){"
];
export function auditOriginalGameReadOnlyBrowserSourceContracts(){
 const main=readFileSync(new URL('../../main.mjs',import.meta.url),'utf8');
 const legacy=readFileSync(new URL('../../../tests/pack5-game-browser.mjs',import.meta.url),'utf8');
 for(const line of exactMainExpressions)must(main.includes(line),
  'original main source expression missing: '+line);
 must(main.includes("const gl=canvas.getContext('webgl2'")&&
  main.includes("canvas.dataset.pack5MeshVertices")&&
  main.includes("canvas.dataset.renderedFrames")&&
  legacy.includes("await page.waitForFunction")&&
  legacy.includes("window.__mythwroughtTest")&&
  legacy.includes("pack5VisibleInstances"),
  'original game GL, main telemetry or existing browser acceptance hook drifted');
 return {schema:'mythwrought.roadmap-a.pack5-original-browser-source-readiness.v1',
  originalMainCameraAndEditGuardsVerified:exactMainExpressions.length,
  originalExistingGameBrowserAcceptanceRead:true,
  originalGameEngineOrBrowserExecuted:false,sourceOnly:true};
}
export function originalPack5ReadOnlyBrowserPlan(){
 const source=auditOriginalGameReadOnlyBrowserSourceContracts();
 const alternatives=originalVariants.flatMap(variant=>yaws.map(yaw=>({symbol:'pack5:080',
  variant,explicitPreviewOnlyYaw:yaw,chosenForA5:false})));
 must(alternatives.length===4&&edges.length===6&&touch.length===3,
  'authored exact fixed pilot matrix drift');
 return {schema:'mythwrought.roadmap-a.pack5-original-browser-pilot-plan.v1',
  ...source,
  requiredViewport:[844,390],deviceScaleFactor:1,
  localhostOnly:true,privateEphemeralBrowserContext:true,
  originalGameMustRenderWebGL2:true,
  serviceWorkersBlockedInEphemeralContext:true,
  currentGameCameraTelemetryReadOnly:true,
  noPageInteractionsAndNoMenuToggles:true,
  browserRaysAreIndependentEphemeralSourceFixturesNotLiveWorld:true,
  originalSourceAlternatives:alternatives,
  sourceEdgeCoordinates:[...edges],sourcePointerDeltaX:[...touch],
  requiredSourceRayProbes:alternatives.length*edges.length*touch.length,
  pilotScreenshotsOfOriginalUnmodifiedMain:1,
  originalA5SourceVariantsOrYawsChosen:false,
  actualGameWorldEdited:false,sidecarWriteAllowed:false,
  noOriginalGameSourceEdits:true,noSaveOrPwaWritesByPilot:true,
  executedBrowser:false,iphoneSafariAcceptance:false,
  actualPack5FixtureRenderedInGame:false,
  structuralOrCreatorAcceptance:false,readyForDeployment:false};
}
export function auditOriginalPack5BrowserPhysicalMeshBudget(){
 const rows=[];
 for(const variant of originalVariants)for(const yaw of yaws){
  const original=resolveManualFivePackAsset('pack5:080',{variant,orientation:yaw});
  const asset=resolvePack5BuilderAsset('pack5:080',variant);
  const mesh=asset.mesh(asset.descriptor,{rotation:yaw});
  const packed=pack5TerrainVertices(mesh);
  must(original.livePlaceable===false&&original.saveWritten===false&&original.sourcePack===5&&
   original.collisionBoxes.length===1&&
   original.collisionBoxes[0].join(',')==='0,0,0,1,1,1'&&
   original.visibleBoxes.length===original.selectionBoxes.length&&
   mesh.indices.length===mesh.triangles*3&&packed.length===mesh.indices.length*9&&
   packed.byteLength<=PACK5_GPU_PAGE_BYTES&&
   packed.byteLength===mesh.triangles*3*9*4,
   'unchanged genuine fired-brick source physical mesh/selection/budget drift');
  must(packed.length>0&&packed.every(Number.isFinite)&&
   packed.every((v,i)=>i%9!==8||v===0),
   'source original shader material 0 or finite GPU staging contract mismatch');
  rows.push({symbol:'pack5:080',variant,explicitPreviewYaw:yaw,
   visibleAndSelectionBoxes:original.selectionBoxes.length,
   physicalColliderBoxes:original.collisionBoxes.length,
   originalAuthoredTriangles:mesh.triangles,
   originalTerrainShaderStagedBytes:packed.byteLength,
   fitsOriginalOnePageBudget:true,sourcePreviewOnly:true,
   inGameRendererPixelsMeasured:false});
 }
 return {schema:'mythwrought.roadmap-a.pack5-source-upload-browser-preflight.v1',
  originalSourcePreviewAlternatives:4,sourceProducerRows:rows,
  originalPageByteBudget:PACK5_GPU_PAGE_BYTES,
  originalResidentByteBudget:PACK5_GPU_RESIDENT_BYTES,
  originalMaxPages:PACK5_GPU_MAX_PAGES,
  actualGPUUploadExecuted:false,realFramePixelsOrPerformanceMeasured:false,
  actualWorldOrA5SourceModified:false,readyForLiveWorldIntegration:false};
}
/** A *successful* browser run must provide original-main evidence AND isolate
 * its in-page preview-only ray samples. Deliberately REJECT source-only fake
 * results passed off as a live Mythwrought Pack5 screenshot.
 */
export function requireOriginalPack5ReadonlyBrowserPilot(evidence){
 const plan=originalPack5ReadOnlyBrowserPlan();
 must(evidence&&typeof evidence==='object'&&!Array.isArray(evidence)&&
  evidence.schema==='mythwrought.roadmap-a.pack5-original-game-readonly-browser-result.v1',
  'unknown original game browser evidence or schema');
 must(JSON.stringify(evidence.viewport)===JSON.stringify(plan.requiredViewport)&&
  evidence.originalGameWebGL2===true&&evidence.originalGameRenderedFrames>=3&&
  evidence.originalGameShaderReady===true&&
  evidence.originalMainLocalhostOnlyDebugAvailable===true&&
  evidence.originalWorldSnapshotSeedIsInteger===true,
  'original main.js WebGL2/renderer/camera/debug readiness not proven');
 must(evidence.camera?.yaw!==undefined&&evidence.camera?.pitch!==undefined&&
  [evidence.camera.yaw,evidence.camera.pitch,evidence.camera.x,
   evidence.camera.z,evidence.camera.feet].every(Number.isFinite)&&
  evidence.camera.unitForwardIsFinite===true&&
  Math.abs(evidence.camera.unitForwardLength-1)<1e-9,
  'real original camera/forward-vector data unreadable');
 must(evidence.originalSourceRayProbeCount===plan.requiredSourceRayProbes&&
  checkedInt(evidence.originalFixtureRayHitCount)&&
  evidence.originalFixtureRayHitCount<=plan.requiredSourceRayProbes&&
  checkedInt(evidence.originalSourceTriangleRayHitCount)&&
  evidence.originalSourceTriangleRayHitCount<=plan.requiredSourceRayProbes&&
  checkedInt(evidence.originalSourceSelectionTriangleDisagreements)&&
  evidence.originalSourceSelectionTriangleDisagreements<=plan.requiredSourceRayProbes&&
  checkedInt(evidence.originalStagedTriangleRayHitCount)&&
  evidence.originalStagedTriangleRayHitCount<=plan.requiredSourceRayProbes&&
  evidence.originalIndexedStagedRayDisagreements===0&&
  evidence.originalStagedTriangleRayHitCount===evidence.originalSourceTriangleRayHitCount,
  'independent browser original triangle, terrain Float32 staging and source ray census must agree');
 must(evidence.originalGameLocalStorageStable===true&&
  evidence.originalGameReadonlySnapshotStable===true&&
  evidence.noGameInteractionsPerformed===true&&
  evidence.noOriginalGameWorldOrPack5Edits===true&&
  evidence.originalPack5SidecarKeysBefore===0&&
  evidence.originalPack5SidecarKeysAfter===0&&
  evidence.originalPack5LiveInstancesBefore===0&&
  evidence.originalPack5LiveInstancesAfter===0&&
  evidence.originalGameGpuPixelProbeWasForPack5Fixture===false&&
  evidence.contextIsNewPrivateEphemeral===true&&
  evidence.originalMainGameCodeUnchanged===true&&
  evidence.realIphoneSafari===false&&
  evidence.authorizedLiveGameIntegration===false&&
  evidence.creatorPhysicalApproval===false,
  'browser pilot attempted saved world, gameplay, sidecar or approval');
 must(Array.isArray(evidence.pageErrors)&&evidence.pageErrors.length===0&&
  Array.isArray(evidence.consoleErrors)&&evidence.consoleErrors.length===0,
  'original game emitted browser errors');
 return {schema:'mythwrought.roadmap-a.pack5-original-game-readonly-browser-acceptance.v1',
  originalMainGameWebGL2BootWitness:true,
  originalCameraTelemetryReadOnly:true,
  originalNativeSourcePreviewRayCount:plan.requiredSourceRayProbes,
  originalSourcePreviewBoundaryWarnings:evidence.originalSourceSelectionTriangleDisagreements,
  originalGpuFloat32SourceTriangleRayParityVerifiedInBrowser:true,
  originalStorageValueAndReadonlyWorldSnapshotStable:true,
  actualRenderedPack5PlacementNotExamined:true,
  actualIphoneSafariNotExamined:true,
  visualPack5AppearanceNotAccepted:true,
  realA5WorldPlacementNotApproved:true,
  productionReleaseApproved:false};
}
