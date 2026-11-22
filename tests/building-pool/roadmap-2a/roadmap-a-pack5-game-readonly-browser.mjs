/**
 * OPTIONAL ONLY, not invoked by CI: one read-only Chromium WebGL2 original-main
 * boot plus independent, ephemeral original-source ray math. NEVER places,
 * imports, toggles, edits, saves or mines ANY actual Mythwrought game object.
 *
 * Executes on local isolated HTTP with an entirely new ephemeral browser
 * context, blocked service workers, one 844x390 viewport, no user data.
 * This is NOT original Pack5 visual/physical-in-game acceptance or iPhone.
 *
 * Manual only: node tests/building-pool/roadmap-2a/roadmap-a-pack5-game-readonly-browser.mjs [output-dir]
 */
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {originalPack5ReadOnlyBrowserPlan,requireOriginalPack5ReadonlyBrowserPilot,
 auditOriginalPack5BrowserPhysicalMeshBudget}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness-core.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const out=path.resolve(process.argv[2]||'artifacts/roadmap-a-pack5-readonly-game-pilot');
const plan=originalPack5ReadOnlyBrowserPlan();
const meshGate=auditOriginalPack5BrowserPhysicalMeshBudget();
assert.equal(meshGate.originalSourcePreviewAlternatives,4);
assert.deepEqual(plan.requiredViewport,[844,390]);
await mkdir(out,{recursive:true});
const server=spawn('python3',['-m','http.server','4198','--bind','127.0.0.1',
 '--directory',root],{cwd:root,stdio:'ignore'});
let browser,context;
const pageErrors=[],consoleErrors=[];
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
  '--enable-webgl','--ignore-gpu-blocklist'
 ]});
 // A temporary clean browser context; NEVER load user's Chrome/iPhone profile.
 context=await browser.newContext({viewport:{width:844,height:390},
  deviceScaleFactor:1,serviceWorkers:'block',permissions:[]});
 const page=await context.newPage();
 page.on('pageerror',error=>pageErrors.push(String(error)));
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
 let loaded=false;
 for(let attempt=0;attempt<30&&!loaded;attempt++){
  try{
   await page.goto('http://127.0.0.1:4198/',{waitUntil:'load',timeout:5000});
   loaded=true;
  }catch(error){
   if(attempt===29)throw error;
   await new Promise(resolve=>setTimeout(resolve,100));
  }
 }
 await page.waitForFunction(()=>{
  const scene=document.getElementById('scene');
  return Number(scene?.dataset.renderedFrames)>=3&&scene.dataset.skyDrawn==='true';
 },null,{timeout:30000});
 // Only DOM READS and source-only test-module imports. No game debug mutator
 // called, no UI checkbox toggled, no game world created or written.
 const result=await page.evaluate(async()=>{
  const gameCanvas=document.getElementById('scene');
  const gl=gameCanvas?.getContext('webgl2');
  const debug=window.__mythwroughtTest;
  const originalSnapshot=debug?.snapshot?.();
  const sidecarKeys=()=>Object.keys(localStorage).filter(k=>
   k.startsWith('mythwrought.pack5.builder.seed.'));
  const beforeKeys=sidecarKeys().length;
  const beforeInstances=Number(gameCanvas?.dataset.pack5VisibleInstances??0);
  const storageState=()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>
   [k,localStorage.getItem(k)]));
  const storageBefore=storageState();
  const readonlySnapshotDigest=s=>JSON.stringify({
   seed:s?.seed,pack3PhysicalBlocks:s?.pack3PhysicalBlocks,
   manual14PhysicalBlocks:s?.manual14PhysicalBlocks
  });
  const originalReadonlyDigest=readonlySnapshotDigest(originalSnapshot);

  const [{clampLook,forwardVector},{makePack5Fixture},
   {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset},
   {sourceRayTriangleDistance},{pack5TerrainVertices}]=await Promise.all([
    import('/src/camera.mjs'),
    import('/src/block-packs/pack-5/fixture.mjs'),
    import('/src/pack5-integration/catalog.mjs'),
    import('/src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.mjs'),
    import('/src/pack5-integration/terrain-buffer.mjs')
  ]);
  const first=Number(gameCanvas.dataset.cameraYaw),
   second=Number(gameCanvas.dataset.cameraPitch);
  const unit=forwardVector(first,second);
  const originalRayAt=(mesh,origin,direction)=>{
   let nearest=null;
   const p=mesh.positions,ind=mesh.indices;
   const xyz=index=>[p[3*index],p[3*index+1],p[3*index+2]];
   for(let i=0;i<ind.length;i+=3){
    const d=sourceRayTriangleDistance(origin,direction,
     xyz(ind[i]),xyz(ind[i+1]),xyz(ind[i+2]));
    if(d!==null&&(nearest===null||d<nearest))nearest=d;
   }
   return nearest;
  };
  const stagedRayAt=(buffer,origin,direction)=>{
   let nearest=null;
   for(let i=0;i<buffer.length;i+=27){
    const point=n=>[buffer[i+9*n],buffer[i+9*n+1],buffer[i+9*n+2]];
    const d=sourceRayTriangleDistance(origin,direction,
     point(0),point(1),point(2));
    if(d!==null&&(nearest===null||d<nearest))nearest=d;
   }
   return nearest;
  };
  const variants=['hearth-running-bond','kiln-soldier-course'];
  const yawAlternatives=[2,3];
  const edges=[0.01999995,0.02,0.02000005,0.97999995,0.98,0.98000005];
  const touchDeltas=[-1,0,1];
  let probes=0,fixtureHits=0,triangleHits=0,disagreements=0,
   stagedTriangleHits=0,indexedStagedRayDisagreements=0;
  for(const variant of variants)for(const yaw of yawAlternatives){
   const isolatedFixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
   const fixtureOnly=isolatedFixture.place('pack5:080',[0,0,0],yaw,variant);
   if(fixtureOnly?.ok!==true||isolatedFixture.count()!==1)
    throw Error('Original browser test-only Pack5 fixture failed');
   const {descriptor,mesh}=resolvePack5BuilderAsset('pack5:080',variant);
   const originalMesh=mesh(descriptor,{rotation:yaw});
   const realShaderStaging=pack5TerrainVertices(originalMesh);
   if(realShaderStaging.length!==originalMesh.indices.length*9||
    realShaderStaging.byteLength>384*1024)
    throw Error('Original Pack5 shader staging changed');
   for(const x of edges)for(const pixelDelta of touchDeltas){
    const camera=clampLook(Math.PI,0,pixelDelta,0,1,.008);
    const facing=forwardVector(camera.yaw,camera.pitch);
    const rayOrigin=[x,.5,2];
    const selection=isolatedFixture.raycast(rayOrigin,facing,6)?.distance??null;
    const triangle=originalRayAt(originalMesh,rayOrigin,facing);
    const stagedTriangle=stagedRayAt(realShaderStaging,rayOrigin,facing);
    probes++;
    if(selection!==null)fixtureHits++;
    if(triangle!==null)triangleHits++;
    if(stagedTriangle!==null)stagedTriangleHits++;
    if((triangle===null)!==(stagedTriangle===null)||
     triangle!==null&&stagedTriangle!==null&&Math.abs(triangle-stagedTriangle)>1e-10)
     indexedStagedRayDisagreements++;
    if((selection===null)!==(triangle===null)||
      selection!==null&&triangle!==null&&Math.abs(selection-triangle)>0.0000001)
     disagreements++;
   }
  }
  return {
   schema:'mythwrought.roadmap-a.pack5-original-game-readonly-browser-result.v1',
   viewport:[innerWidth,innerHeight],
   originalGameWebGL2:Boolean(gl&&gl instanceof WebGL2RenderingContext),
   originalGameRenderedFrames:Number(gameCanvas?.dataset.renderedFrames),
   originalGameShaderReady:originalSnapshot?.graphics?.shaderReady===true,
   originalMainLocalhostOnlyDebugAvailable:Boolean(debug&&originalSnapshot),
   originalWorldSnapshotSeedIsInteger:Number.isSafeInteger(originalSnapshot?.seed),
   camera:{yaw:first,pitch:second,
    x:Number(gameCanvas.dataset.playerX),z:Number(gameCanvas.dataset.playerZ),
    feet:Number(gameCanvas.dataset.playerFeet),
    unitForwardLength:Math.hypot(...unit),
    unitForwardIsFinite:unit.every(Number.isFinite)},
   originalSourceRayProbeCount:probes,
   originalFixtureRayHitCount:fixtureHits,
   originalSourceTriangleRayHitCount:triangleHits,
   originalStagedTriangleRayHitCount:stagedTriangleHits,
   originalIndexedStagedRayDisagreements:indexedStagedRayDisagreements,
   originalSourceSelectionTriangleDisagreements:disagreements,
   originalGameLocalStorageStable:storageState()===storageBefore,
   originalGameReadonlySnapshotStable:
    readonlySnapshotDigest(debug?.snapshot?.())===originalReadonlyDigest,
   noGameInteractionsPerformed:true,
   noOriginalGameWorldOrPack5Edits:true,
   originalPack5SidecarKeysBefore:beforeKeys,
   originalPack5SidecarKeysAfter:sidecarKeys().length,
   originalPack5LiveInstancesBefore:beforeInstances,
   originalPack5LiveInstancesAfter:Number(gameCanvas?.dataset.pack5VisibleInstances??0),
   originalGameGpuPixelProbeWasForPack5Fixture:false,
   contextIsNewPrivateEphemeral:true,
   originalMainGameCodeUnchanged:true,
   realIphoneSafari:false,authorizedLiveGameIntegration:false,
   creatorPhysicalApproval:false
  };
 });
 const complete={...result,pageErrors,consoleErrors};
 const verdict=requireOriginalPack5ReadonlyBrowserPilot(complete);
 const screenshot=path.join(out,'original-unchanged-main-844x390.png');
 await page.screenshot({path:screenshot,animations:'disabled'});
 const png=await import('node:fs/promises').then(fs=>fs.readFile(screenshot));
 assert.ok(png.length>4096,'Original-game screenshot unexpectedly tiny');
 assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],
  'Original-game screenshot is not PNG');
 assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[844,390],
  'Original-game screenshot dimensions do not match requested viewport');
 const evidence={plan,sourceMeshPreflight:meshGate,observations:complete,verdict,
  screenshot:{file:path.basename(screenshot),
   sha256:createHash('sha256').update(png).digest('hex')},
  actualRenderedPack5Fixture:false,actualIPhone:false,
  originalGameOrUserSavedWorldModifiedByPilot:false};
 await writeFile(path.join(out,'ROADMAP_A_PACK5_READONLY_GAME_PILOT.json'),
  JSON.stringify(evidence,null,2)+'\n');
 console.log('PASS READ-ONLY original main boot + independent original Pack5 JS rays',
  JSON.stringify({viewport:complete.viewport,frames:complete.originalGameRenderedFrames,
   originalSourceOnlyRays:complete.originalSourceRayProbeCount,
   sourceRayWarnings:complete.originalSourceSelectionTriangleDisagreements,
   actualPack5GameVisualTest:false,realIPhone:false}));
}finally{
 if(context)await context.close();
 if(browser)await browser.close();
 server.kill('SIGTERM');
}
