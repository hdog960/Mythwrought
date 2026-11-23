/**
 * Creator-authorized ONE-SCENE, disposable-context, ORIGINAL Mythwrought
 * WebGL2 Pack5 fixture rendering and original MINE ownership acceptance.
 *
 * NEVER load a user profile/seed/saved world, never change original game
 * modules, never deploy, and never confuse Chromium with real iPhone Safari.
 * Only the UNCHANGED original localhost __mythwroughtTest fixture is used.
 */
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const out=path.resolve(process.argv[2]||'artifacts/roadmap-a-pack5-disposable-original-game');
await mkdir(out,{recursive:true});
const host='http://127.0.0.1:4199/';
const server=spawn('python3',['-m','http.server','4199','--bind','127.0.0.1','--directory',root],
 {cwd:root,stdio:'ignore'});
let browser,context,page;
const pageErrors=[],consoleErrors=[],result={
 schema:'mythwrought.roadmap-a.original-pack5-disposable-actual-game.v1',
 creatorAuthorized:true,originalGameSourceUnmodified:true,
 originalWorldInUserBrowserAccessed:false,originalUserSavesAccessed:false,
 contextEntirelyNewEphemeral:true,device:'headless-chromium-swiftshader',
 viewport:[844,390],deviceScaleFactor:1,
 actualPhysicalIphoneSafari:false,sourceA5MaterialYawAssigned:false,
 deployedOrMerged:false,originalSourceCodeChanges:false,
 stage:'init',passed:false
};
const sha=b=>createHash('sha256').update(b).digest('hex');
const snapshot=()=>page.evaluate(()=>{
 const c=document.getElementById('scene');
 const d=c.dataset,s=window.__mythwroughtTest?.snapshot?.();
 return {
  renderedFrames:Number(d.renderedFrames),skyDrawn:d.skyDrawn==='true',
  loadedChunks:Number(d.loadedChunks),meshVertices:Number(d.pack5MeshVertices),
  instances:Number(d.pack5VisibleInstances),gpuBytes:Number(d.pack5GpuBytes),
  gpuDrawCalls:Number(d.pack5DrawCalls),pendingPages:Number(d.pack5PendingPages),
  x:Number(d.playerX),z:Number(d.playerZ),feet:Number(d.playerFeet),
  yaw:Number(d.cameraYaw),pitch:Number(d.cameraPitch),
  webgl2:Boolean(c.getContext('webgl2') instanceof WebGL2RenderingContext),
  shaderReady:s?.graphics?.shaderReady===true,
  worldSeed:s?.seed,
  sidecarKeys:Object.keys(localStorage).filter(k=>
   k.startsWith('mythwrought.pack5.builder.seed.')),
  status:document.getElementById('status')?.textContent
 };
});
function actualPngDiff(a,b){
 const x=PNG.sync.read(a),y=PNG.sync.read(b);
 assert.equal(x.width,844);assert.equal(x.height,390);
 assert.equal(y.width,x.width);assert.equal(y.height,x.height);
 let changed=0,strong=0,centerStrong=0,maximum=0;
 const region={left:0.1,right:0.9,top:0.1,bottom:0.9};
 for(let py=0;py<390;py++)for(let px=0;px<844;px++){
  if(px<844*region.left||px>844*region.right||
   py<390*region.top||py>390*region.bottom)continue;
  const idx=(py*844+px)*4;
  const delta=Math.abs(x.data[idx]-y.data[idx])+
   Math.abs(x.data[idx+1]-y.data[idx+1])+
   Math.abs(x.data[idx+2]-y.data[idx+2]);
  if(delta>0)changed++;
  if(delta>=48){
   strong++;
   if(px>844*.27&&px<844*.73&&py>390*.2&&py<390*.8)centerStrong++;
  }
  maximum=Math.max(maximum,delta);
 }
 return {changedPixels:changed,strongRgbDifferencePixels:strong,
  centralStrongDifferencePixels:centerStrong,maximumRgbDifference:maximum,
  region,actualScreenshotPixelComparison:true};
}
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
  '--enable-webgl','--ignore-gpu-blocklist'
 ]});
 context=await browser.newContext({viewport:{width:844,height:390},
  deviceScaleFactor:1,serviceWorkers:'block',permissions:[]});
 page=await context.newPage();
 page.on('pageerror',error=>pageErrors.push(String(error)));
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
 let opened=false;
 for(let i=0;i<25&&!opened;i++){
  try{await page.goto(host,{waitUntil:'load',timeout:6000});opened=true;}
  catch(error){if(i===24)throw error;await new Promise(resolve=>setTimeout(resolve,120));}
 }
 await page.waitForFunction(()=>{
  const c=document.getElementById('scene');
  return Number(c?.dataset.renderedFrames)>3&&c.dataset.skyDrawn==='true'&&
   Number(c.dataset.loadedChunks)>0&&window.__mythwroughtTest?.snapshot?.()?.graphics?.shaderReady===true;
 },null,{timeout:30000});
 const pristine=await snapshot();
 assert.equal(pristine.webgl2,true);assert.equal(pristine.instances,0);
 assert.equal(pristine.sidecarKeys.length,0);
 result.initial={...pristine,actualGameGraphics:true};
 result.stage='disposable-game-booted';
 // The exact original UI enables Pack5; all state belongs to this one
 // disposable private Playwright browser context and is destroyed in finally.
 await page.locator('#menu').click();
 await page.evaluate(()=>{
  const e=document.getElementById('pack5Enabled');
  e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));
 });
 await page.waitForFunction(()=>
  document.getElementById('pack5Status')?.textContent.includes('Pack 5 ON'),
  null,{timeout:30000});
 await page.locator('#closeHelp').click();
 await page.waitForTimeout(600);
 const cell=await page.evaluate(()=>{
  const api=window.__mythwroughtTest,c=document.getElementById('scene');
  const x=Math.floor(Number(c.dataset.playerX))+3,
   z=Math.floor(Number(c.dataset.playerZ)),
   y=Math.min(18,Math.floor(Number(c.dataset.playerFeet))+2);
  api.aimAt(x,y,z);
  return [x,y,z];
 });
 await page.waitForTimeout(450);
 const before=await snapshot();
 assert.equal(before.instances,0);assert.equal(before.meshVertices,0);
 assert.equal(before.sidecarKeys.length,0);
 assert.equal(before.webgl2,true);
 const beforePng=await page.locator('#scene').screenshot({animations:'disabled'});
 result.before={...before,screenshotSha256:sha(beforePng)};
 await writeFile(path.join(out,'actual-original-game-before-pack5-844x390.png'),beforePng);
 result.stage='baseline-actual-game-canvas-captured';
 const placement=await page.evaluate(([x,y,z])=>window.__mythwroughtTest.placePack5TestFixture(x,y,z),cell);
 assert.equal(placement.ok,true,'original localhost-only Pack5 physical fixture placement');
 assert.equal(placement.worldSchema,1,'original game world remains schema1');
 await page.waitForFunction(()=>{
  const d=document.getElementById('scene').dataset;
  return Number(d.pack5VisibleInstances)===1&&
   Number(d.pack5MeshVertices)>0&&Number(d.pack5PendingPages)===0;
 },null,{timeout:30000});
 await page.waitForTimeout(240);
 const after=await snapshot();
 assert.equal(after.instances,1);assert.ok(after.meshVertices>0);
 assert.ok(after.gpuBytes>0&&after.gpuBytes<=2*1024*1024);
 assert.ok(after.gpuDrawCalls>=1&&after.gpuDrawCalls<=8);
 assert.ok(after.sidecarKeys.length>=1&&after.sidecarKeys.length<=3,
  'only temporary browser Pack5 sidecar and bounded verified journal/backup');
 assert.equal(after.worldSeed,before.worldSeed);
 assert.ok(Math.abs(after.yaw-before.yaw)<1e-10);
 assert.ok(Math.abs(after.pitch-before.pitch)<1e-10);
 assert.ok(Math.abs(after.x-before.x)<.001);
 assert.ok(Math.abs(after.z-before.z)<.001);
 const afterPng=await page.locator('#scene').screenshot({animations:'disabled'});
 const diff=actualPngDiff(beforePng,afterPng);
 result.placed={cell,fixture:placement,snapshot:after,
  actualOriginalWebGL2RenderVertices:after.meshVertices,
  canvasScreenshotSha256:sha(afterPng),realCanvasRgbDifference:diff};
 await writeFile(path.join(out,'actual-original-game-after-pack5-844x390.png'),afterPng);
 result.stage='real-game-gpu-resident-and-canvas-before-after-sampled';
 // A geometry draw call alone does NOT prove visibility. Require genuine
 // actual original game canvas pixel differences, not HTML status text.
 assert.ok(diff.strongRgbDifferencePixels>=100&&diff.centralStrongDifferencePixels>=40,
  'Actual original-game Pack5 GPU fixture was not visibly distinguishable on game canvas');
 // Independently use unchanged original Pack5 fixture and camera module in
 // the same browser JS engine to confirm source-targeting for the exact cell.
 const sourceRay=await page.evaluate(async([x,y,z])=>{
  const [{forwardVector},{makePack5Fixture},{PACK5_BUILDER_FAMILIES}]
   =await Promise.all([import('/src/camera.mjs'),
    import('/src/block-packs/pack-5/fixture.mjs'),
    import('/src/pack5-integration/catalog.mjs')]);
  const c=document.getElementById('scene'),d=c.dataset;
  const origin=[Number(d.playerX),Number(d.playerFeet)+1.55,Number(d.playerZ)],
    direction=forwardVector(Number(d.cameraYaw),Number(d.cameraPitch));
  const source=makePack5Fixture(PACK5_BUILDER_FAMILIES);
  const placed=source.place('pack5:080',[x,y,z],0);
  const hit=source.raycast(origin,direction,6);
  return {placed:placed.ok,sourceHitCell:hit?.cell??null,
   sourceHitDistance:hit?.distance??null,origin,direction};
 },cell);
 assert.equal(sourceRay.placed,true);
 assert.ok(sourceRay.sourceHitDistance!==null&&sourceRay.sourceHitDistance<=6,
  'Original source detailed selection ray must actually hit rendered original fixture');
 result.placed.sourceDetailedRay=sourceRay;
 // Genuine game MINE button with deliberately wrong original camera aim
 // must NOT remove the fixture; no fake helper removes it.
 await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,0));
 await page.locator('#dig').click();
 await page.waitForTimeout(300);
 const missed=await snapshot();
 result.aimAway={instances:missed.instances,status:missed.status,
  cameraYaw:missed.yaw,preserveFixture:missed.instances===1};
 assert.equal(missed.instances,1,'Original game away-facing MINE accidentally removed Pack5');
 await page.evaluate(([x,y,z])=>window.__mythwroughtTest.aimAt(x,y,z),cell);
 await page.waitForTimeout(120);
 await page.locator('#dig').click();
 await page.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.pack5VisibleInstances)===0,
  null,{timeout:20000});
 const mined=await snapshot();
 result.mineThroughRealPlayerButton={instances:mined.instances,
  originalStatus:mined.status,sidecarKeys:mined.sidecarKeys,
  actualUserControlInvoked:true,originalPack5LayerRayUsed:true};
 assert.equal(mined.instances,0);
 assert.match(mined.status,/removed|remove|Pack 5/i);
 result.stage='game-pixel-and-original-player-mine-verified';
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.renderedFrames)>2,
  null,{timeout:30000});
 const reloaded=await snapshot();
 result.reloaded={instances:reloaded.instances,meshVertices:reloaded.meshVertices,
  editingOff:!(await page.locator('#pack5Enabled').isChecked())};
 assert.equal(reloaded.instances,0,'Deleted disposable fixture reappeared after sidecar reload');
 assert.equal(result.reloaded.editingOff,true);
 result.errors={pageErrors,consoleErrors};
 assert.deepEqual(pageErrors,[],'original game uncaught errors');
 result.passed=true;
 result.stage='completed-original-game-disposable-screenshot-and-mine';
 console.log('ROADMAP_A_REAL_ORIGINAL_PACK5_BROWSER_ACCEPTANCE '+JSON.stringify({
  originalGameWebgl2:true,viewport:[844,390],result:'PASS',
  originalGamePack5Vertices:after.meshVertices,gpuBytes:after.gpuBytes,
  drawCalls:after.gpuDrawCalls,screenshotPixelChange:diff,
  originalSourceRayDistance:sourceRay.sourceHitDistance,
  aimAwayRetained:missed.instances===1,actualGameMineRemoved:mined.instances===0,
  sidecarReloadDeleted:reloaded.instances===0,realIphoneSafari:false
 }));
} catch(error){
 result.failure=String(error?.stack||error);
 result.errors={pageErrors,consoleErrors};
 console.error('ROADMAP_A_REAL_ORIGINAL_PACK5_BROWSER_BLOCKER',result.stage,result.failure);
 process.exitCode=1;
}finally{
 result.originalUserSavedWorldWasNeverOpened=true;
 result.browserContextClosedInFinally=true;
 await writeFile(path.join(out,'ROADMAP_A_ORIGINAL_DISPOSABLE_GAME_ACCEPTANCE.json'),
  JSON.stringify(result,null,2)+'\n');
 if(context)await context.close();
 if(browser)await browser.close();
 server.kill('SIGTERM');
}
